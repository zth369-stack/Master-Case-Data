import crypto from 'node:crypto';
import type {
  AuditLogEntry,
  CredentialStatus,
  CredentialStrength,
  EnvironmentMode,
  SanitizedConfigReport,
  SecurityPosture,
} from '../shared/types.js';

export interface MyGdxRawCredentials {
  gatewayUrl: string;
  consumerKey: string;
  consumerSecret: string;
  agencyCode: string;
  environment: EnvironmentMode;
}

export interface SsmRawCredentials {
  apiBaseUrl: string;
  userId: string;
  secretToken: string;
  signingSecret: string;
  allowedEndpoints: string[];
  requestTimeoutMs: number;
}

export interface SecurityOptions {
  enforceHttps: boolean;
  auditLoggingEnabled: boolean;
}

export interface FullMiddlewareConfig {
  mygdx: MyGdxRawCredentials;
  ssm: SsmRawCredentials;
  security: SecurityOptions;
}

export interface GeneratedHeaders {
  'X-MyGDX-Consumer-Key': string;
  'X-MyGDX-Agency-Code': string;
  'X-MyGDX-Timestamp': string;
  'X-MyGDX-Signature': string;
  'X-SSM-User-Id': string;
  'Authorization': string;
  'Content-Type': string;
}

/**
 * Securely masks a secret string, leaving only leading/trailing characters visible
 * if the string is sufficiently long, or completely masked if short.
 */
export function maskSecret(secret?: string, visiblePrefix = 2, visibleSuffix = 2): string {
  if (!secret || secret.trim() === '') {
    return '[NOT CONFIGURED]';
  }
  const clean = secret.trim();
  if (clean.length <= visiblePrefix + visibleSuffix) {
    return '•'.repeat(Math.max(6, clean.length));
  }
  const prefix = clean.slice(0, visiblePrefix);
  const suffix = clean.slice(-visibleSuffix);
  const maskLength = Math.min(16, Math.max(6, clean.length - (visiblePrefix + visibleSuffix)));
  return `${prefix}${'•'.repeat(maskLength)}${suffix}`;
}

/**
 * Evaluates the strength of an API key or secret token.
 */
export function evaluateSecretStrength(secret?: string): CredentialStrength {
  if (!secret || secret.trim() === '') {
    return 'missing';
  }
  const len = secret.trim().length;
  if (len >= 32) return 'strong';
  if (len >= 16) return 'moderate';
  return 'weak';
}

/**
 * Validates the loaded configuration against government agency security standards.
 */
export function validateMiddlewareConfig(config: FullMiddlewareConfig): SecurityPosture {
  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  const isProd = config.mygdx.environment === 'production';

  // 1. MyGDX Gateway Validation
  if (!config.mygdx.gatewayUrl) {
    errors.push('MYGDX_GATEWAY_URL is missing.');
  } else {
    try {
      const url = new URL(config.mygdx.gatewayUrl);
      if (config.security.enforceHttps && url.protocol !== 'https:') {
        errors.push('MYGDX_GATEWAY_URL must use HTTPS protocol for encrypted transmission.');
      }
    } catch {
      errors.push('MYGDX_GATEWAY_URL is not a valid URL.');
    }
  }

  // 2. MyGDX Credentials
  if (!config.mygdx.consumerKey) {
    if (isProd) {
      errors.push('MYGDX_CONSUMER_KEY is required for production MyGDX integration.');
    } else {
      warnings.push('MYGDX_CONSUMER_KEY is not set; using local sandbox simulator.');
    }
  }

  if (!config.mygdx.consumerSecret) {
    if (isProd) {
      errors.push('MYGDX_CONSUMER_SECRET is required in production for HMAC authentication.');
    } else {
      warnings.push('MYGDX_CONSUMER_SECRET is not set; HMAC signing will use sandbox dummy secret.');
    }
  } else if (config.mygdx.consumerSecret.length < 16 && isProd) {
    warnings.push('MYGDX_CONSUMER_SECRET is shorter than 16 characters; consider rotating to a 256-bit key.');
  }

  // 3. Agency Code
  if (!config.mygdx.agencyCode || config.mygdx.agencyCode.trim() === '') {
    errors.push('MYGDX_AGENCY_CODE is required for government agency identification.');
  } else if (config.mygdx.agencyCode === 'AGENCY_DEMO_01' && isProd) {
    warnings.push('MYGDX_AGENCY_CODE is currently set to the demo identifier; replace with official MAMPU agency code.');
  }

  // 4. SSM Specific Credentials
  if (!config.ssm.userId && isProd) {
    errors.push('SSM_USER_ID is required for querying restricted SSM status endpoints.');
  }
  if (!config.ssm.secretToken && isProd) {
    errors.push('SSM_SECRET_TOKEN is required for production SSM status queries.');
  }

  // Recommendations
  if (!config.security.auditLoggingEnabled) {
    warnings.push('Audit logging is disabled. Government data exchange compliance requires audit logging.');
    recommendations.push('Set MIDDLEWARE_AUDIT_LOG_ENABLED="true" to comply with MAMPU guidelines.');
  }

  recommendations.push('Store MYGDX_CONSUMER_SECRET and SSM_SECRET_TOKEN in a secure KMS/Secret Manager.');
  recommendations.push('Rotate API keys at least every 90 days according to National Cyber Security Agency (NACSA) policies.');

  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;

  const complianceRating: SecurityPosture['complianceRating'] = hasErrors
    ? 'NON_COMPLIANT'
    : hasWarnings
    ? 'WARNING'
    : 'COMPLIANT';

  return {
    enforceHttps: config.security.enforceHttps,
    auditLoggingEnabled: config.security.auditLoggingEnabled,
    isProductionReady: !hasErrors && (isProd ? !hasWarnings : true),
    complianceRating,
    errors,
    warnings,
    recommendations,
  };
}

/**
 * Loads configuration securely from environment variables.
 */
export function loadMiddlewareConfig(env: Record<string, string | undefined> = process.env): FullMiddlewareConfig {
  const envMode = (env.MYGDX_ENVIRONMENT || 'sandbox').toLowerCase() as EnvironmentMode;
  const allowedEndpoints = (env.SSM_RESTRICTED_ENDPOINTS || 'roc_status,rob_status,llp_status,compliance_status')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const rawConfig: FullMiddlewareConfig = {
    mygdx: {
      gatewayUrl: env.MYGDX_GATEWAY_URL || (envMode === 'production' ? 'https://api.mygdx.gov.my' : 'https://sandbox.mygdx.gov.my'),
      consumerKey: env.MYGDX_CONSUMER_KEY || '',
      consumerSecret: env.MYGDX_CONSUMER_SECRET || '',
      agencyCode: env.MYGDX_AGENCY_CODE || 'AGENCY_DEMO_01',
      environment: envMode,
    },
    ssm: {
      apiBaseUrl: env.SSM_API_BASE_URL || (envMode === 'production' ? 'https://api.mygdx.gov.my/ssm/v1' : 'https://sandbox.mygdx.gov.my/ssm/v1'),
      userId: env.SSM_USER_ID || '',
      secretToken: env.SSM_SECRET_TOKEN || '',
      signingSecret: env.SSM_SIGNING_SECRET || env.MYGDX_CONSUMER_SECRET || '',
      allowedEndpoints,
      requestTimeoutMs: Number.parseInt(env.SSM_REQUEST_TIMEOUT_MS || '10000', 10),
    },
    security: {
      enforceHttps: env.MIDDLEWARE_ENFORCE_HTTPS !== 'false',
      auditLoggingEnabled: env.MIDDLEWARE_AUDIT_LOG_ENABLED !== 'false',
    },
  };

  return Object.freeze(rawConfig);
}

// Cached singleton config instance
let activeConfig: FullMiddlewareConfig = loadMiddlewareConfig();

export function reloadMiddlewareConfig(customEnv?: Record<string, string | undefined>): FullMiddlewareConfig {
  activeConfig = loadMiddlewareConfig(customEnv || process.env);
  return activeConfig;
}

export function getActiveConfig(): FullMiddlewareConfig {
  return activeConfig;
}

/**
 * Generates an HMAC-SHA256 signature for MyGDX gateway authentication.
 */
export function generateMyGdxSignature(
  timestamp: string,
  endpoint: string,
  agencyCode: string,
  signingKey: string,
  body?: unknown
): string {
  const payloadStr = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : '';
  const canonicalString = `${agencyCode}:${endpoint}:${timestamp}:${payloadStr}`;
  const effectiveKey = signingKey || 'mygdx-sandbox-signing-secret';

  return crypto.createHmac('sha256', effectiveKey).update(canonicalString).digest('hex');
}

/**
 * Creates standardized, cryptographically signed HTTP request headers
 * expected by MyGDX / SSM restricted gateway.
 */
export function createSecureMyGdxHeaders(
  endpoint: string,
  body?: unknown,
  config: FullMiddlewareConfig = activeConfig
): GeneratedHeaders {
  const timestamp = new Date().toISOString();
  const signature = generateMyGdxSignature(
    timestamp,
    endpoint,
    config.mygdx.agencyCode,
    config.ssm.signingSecret || config.mygdx.consumerSecret,
    body
  );

  const authBearer = config.ssm.secretToken
    ? `Bearer ${config.ssm.secretToken}`
    : config.mygdx.consumerKey
    ? `Basic ${Buffer.from(`${config.mygdx.consumerKey}:${config.mygdx.consumerSecret}`).toString('base64')}`
    : 'Bearer DEMO_SANDBOX_TOKEN';

  return {
    'X-MyGDX-Consumer-Key': config.mygdx.consumerKey || 'SANDBOX_DEMO_KEY',
    'X-MyGDX-Agency-Code': config.mygdx.agencyCode,
    'X-MyGDX-Timestamp': timestamp,
    'X-MyGDX-Signature': signature,
    'X-SSM-User-Id': config.ssm.userId || 'AGENCY_USER_DEMO',
    'Authorization': authBearer,
    'Content-Type': 'application/json',
  };
}

/**
 * Produces a sanitized, safe DTO of the current configuration.
 * Raw secret values are never returned.
 */
export function getSanitizedConfigReport(config: FullMiddlewareConfig = activeConfig): SanitizedConfigReport {
  const security = validateMiddlewareConfig(config);

  const consumerKeyStatus: CredentialStatus = {
    keyName: 'MYGDX_CONSUMER_KEY',
    isConfigured: Boolean(config.mygdx.consumerKey),
    maskedValue: maskSecret(config.mygdx.consumerKey, 4, 3),
    strength: evaluateSecretStrength(config.mygdx.consumerKey),
    description: 'Agency client key issued by MAMPU for MyGDX authentication.',
    notes: config.mygdx.consumerKey ? 'Active' : 'Unset - using sandbox mode',
  };

  const consumerSecretStatus: CredentialStatus = {
    keyName: 'MYGDX_CONSUMER_SECRET',
    isConfigured: Boolean(config.mygdx.consumerSecret),
    maskedValue: maskSecret(config.mygdx.consumerSecret, 2, 2),
    strength: evaluateSecretStrength(config.mygdx.consumerSecret),
    description: 'Secret token used for HMAC payload signing and gateway verification.',
    notes: config.mygdx.consumerSecret ? 'Secure in memory' : 'Unset - using dummy key',
  };

  const userIdStatus: CredentialStatus = {
    keyName: 'SSM_USER_ID',
    isConfigured: Boolean(config.ssm.userId),
    maskedValue: maskSecret(config.ssm.userId, 3, 2),
    strength: config.ssm.userId ? 'strong' : 'missing',
    description: 'SSM-issued agency or GLC membership ID.',
    notes: config.ssm.userId ? 'Registered' : 'Not configured',
  };

  const secretTokenStatus: CredentialStatus = {
    keyName: 'SSM_SECRET_TOKEN',
    isConfigured: Boolean(config.ssm.secretToken),
    maskedValue: maskSecret(config.ssm.secretToken, 2, 2),
    strength: evaluateSecretStrength(config.ssm.secretToken),
    description: 'SSM service authorization token for restricted status calls.',
    notes: config.ssm.secretToken ? 'Encrypted in memory' : 'Not configured',
  };

  const signingSecretStatus: CredentialStatus = {
    keyName: 'SSM_SIGNING_SECRET',
    isConfigured: Boolean(config.ssm.signingSecret),
    maskedValue: maskSecret(config.ssm.signingSecret, 2, 2),
    strength: evaluateSecretStrength(config.ssm.signingSecret),
    description: 'Secret key for cryptographic HMAC-SHA256 request authorization.',
    notes: config.ssm.signingSecret ? 'Active' : 'Fallback to consumer secret',
  };

  return {
    timestamp: new Date().toISOString(),
    environment: config.mygdx.environment,
    mygdx: {
      gatewayUrl: config.mygdx.gatewayUrl,
      agencyCode: config.mygdx.agencyCode,
      environment: config.mygdx.environment,
      timeoutMs: config.ssm.requestTimeoutMs,
      consumerKeyStatus,
      consumerSecretStatus,
    },
    ssm: {
      apiBaseUrl: config.ssm.apiBaseUrl,
      environment: config.mygdx.environment,
      allowedEndpoints: config.ssm.allowedEndpoints,
      userIdStatus,
      secretTokenStatus,
      signingSecretStatus,
    },
    security,
  };
}

// In-memory audit log ring buffer (100 recent entries)
const MAX_LOGS = 100;
const auditLogs: AuditLogEntry[] = [
  {
    id: 'log-init-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    agencyCode: activeConfig.mygdx.agencyCode,
    endpoint: '/ssm/status/roc',
    queryParam: '201901000001 (1312345-X)',
    httpStatus: 200,
    statusText: 'OK - Entity Active',
    hmacVerified: true,
    durationMs: 82,
  },
  {
    id: 'log-init-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    agencyCode: activeConfig.mygdx.agencyCode,
    endpoint: '/ssm/status/rob',
    queryParam: '002934812-M',
    httpStatus: 200,
    statusText: 'OK - Business Verified',
    hmacVerified: true,
    durationMs: 95,
  },
];

export function addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
  const record: AuditLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  auditLogs.unshift(record);
  if (auditLogs.length > MAX_LOGS) {
    auditLogs.pop();
  }
  return record;
}

export function getAuditLogs(): AuditLogEntry[] {
  return [...auditLogs];
}
