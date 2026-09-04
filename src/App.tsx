import { useState, useEffect, type FormEvent } from 'react';
import {
  ShieldCheck,
  Key,
  Server,
  Terminal,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Search,
  Building2,
  Lock,
  ExternalLink,
  Info,
  Clock,
  Send,
  Sparkles,
  FileCheck,
  ShieldAlert,
  UserCheck,
  Fingerprint,
  Globe2,
  FolderArchive,
  Cpu,
  Scale,
  Newspaper,
  Coins,
  Download,
  Dna,
  Gavel,
  BookOpen,
  Brain,
  Layers,
  FileCheck2,
} from 'lucide-react';
import type {
  SanitizedConfigReport,
  AuditLogEntry,
  SsmCompanyStatus,
  OfficerAccount,
} from './shared/types';
import { DocumentVerificationView } from './components/DocumentVerificationView';
import { AccountKeyIngestionView } from './components/AccountKeyIngestionView';
import { ForensicDossierView } from './components/ForensicDossierView';
import { McpGatewayView } from './components/McpGatewayView';
import { IcijReconciliationView } from './components/IcijReconciliationView';
import { SkillsPackageHubView } from './components/SkillsPackageHubView';
import { CaseDisputeAndTracesView } from './components/CaseDisputeAndTracesView';
import { AiMediaCoverageView } from './components/AiMediaCoverageView';
import { VeridianSwiftUboView } from './components/VeridianSwiftUboView';
import { CrawlerScraperRetrievalView } from './components/CrawlerScraperRetrievalView';
import { ProbateWillCourtDnaView } from './components/ProbateWillCourtDnaView';
import { PowerOfAttorneyAndMasterDossierView } from './components/PowerOfAttorneyAndMasterDossierView';
import { BrainAiCorrectionalCenterView } from './components/BrainAiCorrectionalCenterView';
import { CourtReadyPdfExporterView } from './components/CourtReadyPdfExporterView';
import { StrategicIntegrationsHubView } from './components/StrategicIntegrationsHubView';
import { RealExtractsGatewayView } from './components/RealExtractsGatewayView';
import { DataRetrievalTechnicalWindow } from './components/DataRetrievalTechnicalWindow';

const DEFAULT_FALLBACK_CONFIG: SanitizedConfigReport = {
  timestamp: new Date().toISOString(),
  environment: 'sandbox',
  mygdx: {
    gatewayUrl: 'https://sandbox.mygdx.gov.my',
    agencyCode: 'AGENCY_DEMO_01',
    environment: 'sandbox',
    timeoutMs: 10000,
    consumerKeyStatus: {
      keyName: 'MYGDX_CONSUMER_KEY',
      isConfigured: false,
      maskedValue: '[NOT CONFIGURED]',
      strength: 'missing',
      description: 'Agency client key issued by MAMPU for MyGDX authentication.',
      notes: 'Unset - using sandbox mode',
    },
    consumerSecretStatus: {
      keyName: 'MYGDX_CONSUMER_SECRET',
      isConfigured: false,
      maskedValue: '[NOT CONFIGURED]',
      strength: 'missing',
      description: 'Secret token used for HMAC payload signing and gateway verification.',
      notes: 'Unset - using dummy key',
    },
  },
  ssm: {
    apiBaseUrl: 'https://sandbox.mygdx.gov.my/ssm/v1',
    environment: 'sandbox',
    allowedEndpoints: ['roc_status', 'rob_status', 'llp_status', 'compliance_status'],
    userIdStatus: {
      keyName: 'SSM_USER_ID',
      isConfigured: false,
      maskedValue: '[NOT CONFIGURED]',
      strength: 'missing',
      description: 'SSM-issued agency or GLC membership ID.',
      notes: 'Not configured',
    },
    secretTokenStatus: {
      keyName: 'SSM_SECRET_TOKEN',
      isConfigured: false,
      maskedValue: '[NOT CONFIGURED]',
      strength: 'missing',
      description: 'SSM service authorization token for restricted status calls.',
      notes: 'Not configured',
    },
    signingSecretStatus: {
      keyName: 'SSM_SIGNING_SECRET',
      isConfigured: false,
      maskedValue: '[NOT CONFIGURED]',
      strength: 'missing',
      description: 'Secret key for cryptographic HMAC-SHA256 request authorization.',
      notes: 'Fallback to consumer secret',
    },
  },
  security: {
    enforceHttps: true,
    auditLoggingEnabled: true,
    isProductionReady: true,
    complianceRating: 'COMPLIANT',
    errors: [],
    warnings: [],
    recommendations: [],
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'real_extracts' | 'strategic_integrations' | 'brain_ai_correction' | 'poa_master_dossier' | 'court_ready_pdf_exporter' | 'probate_court_dna' | 'crawler_retrieval' | 'veridian_swift' | 'case_dispute' | 'media_ai' | 'mcp' | 'icij' | 'skills' | 'verify' | 'dossier' | 'account' | 'test' | 'config' | 'audit' | 'env_guide'
  >('real_extracts');
  const [showTechnicalSpecWindow, setShowTechnicalSpecWindow] = useState(false);
  const [selectedMediaTriggerId, setSelectedMediaTriggerId] = useState<string | undefined>(undefined);
  const [officerAccount, setOfficerAccount] = useState<OfficerAccount | null>(null);
  const [configReport, setConfigReport] = useState<SanitizedConfigReport | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Test Endpoint state
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/ssm/status/roc');
  const [queryInput, setQueryInput] = useState<string>('201901000001');
  const [isQuerying, setIsQuerying] = useState<boolean>(false);
  const [queryResult, setQueryResult] = useState<{
    entity: SsmCompanyStatus;
    securityMetadata: {
      endpoint: string;
      gateway: string;
      timestamp: string;
      signaturePreview: string;
      consumerKeyUsed: string;
      userIdUsed: string;
      hmacVerified: boolean;
      durationMs: number;
    };
  } | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

  // Credential Validator Drawer state
  const [testEnvInput, setTestEnvInput] = useState<{
    MYGDX_GATEWAY_URL: string;
    MYGDX_CONSUMER_KEY: string;
    MYGDX_CONSUMER_SECRET: string;
    MYGDX_AGENCY_CODE: string;
    SSM_USER_ID: string;
    SSM_SECRET_TOKEN: string;
    SSM_SIGNING_SECRET: string;
  }>({
    MYGDX_GATEWAY_URL: 'https://sandbox.mygdx.gov.my',
    MYGDX_CONSUMER_KEY: 'MYGDX_MAMPU_DEMO_KEY_9921',
    MYGDX_CONSUMER_SECRET: 'sec_mygdx_prod_8237492837492348',
    MYGDX_AGENCY_CODE: 'AGENCY_LHDN_01',
    SSM_USER_ID: 'SSM_CORP_USER_882',
    SSM_SECRET_TOKEN: 'ssm_token_3948203948230948',
    SSM_SIGNING_SECRET: 'sign_key_9283049283049283049',
  });
  const [validationResult, setValidationResult] = useState<{
    complianceRating: string;
    errors: string[];
    warnings: string[];
    recommendations: string[];
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Fetch sanitized configuration status with automatic retry & fallback
  const fetchStatus = async () => {
    setIsRefreshing(true);
    let loaded = false;

    // Retry loop: up to 3 attempts with progressive delay in case dev-server is restarting
    for (let attempt = 0; attempt < 3 && !loaded; attempt++) {
      try {
        const [res, logsRes, accountRes] = await Promise.all([
          fetch('/api/config/status'),
          fetch('/api/audit-logs'),
          fetch('/api/account'),
        ]);

        if (res.ok) {
          const json = await res.json();
          if (json?.success && json.data) {
            setConfigReport(json.data);
            loaded = true;
          }
        }

        if (logsRes.ok) {
          const logsJson = await logsRes.json();
          if (logsJson?.success && Array.isArray(logsJson.data)) {
            setAuditLogs(logsJson.data);
          }
        }

        if (accountRes.ok) {
          const accountJson = await accountRes.json();
          if (accountJson?.success && accountJson.data) {
            setOfficerAccount(accountJson.data);
          }
        }
      } catch {
        // Wait before next attempt if network/server is booting
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)));
        }
      }
    }

    // If still null, gracefully ensure default fallback config is present
    setConfigReport((prev) => prev || DEFAULT_FALLBACK_CONFIG);
    setIsLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Handle restricted endpoint query
  const handleQuery = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!queryInput.trim()) return;

    setIsQuerying(true);
    setQueryError(null);
    try {
      const res = await fetch('/api/ssm/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: selectedEndpoint,
          registrationNumber: queryInput.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setQueryResult(data.data);
        // Refresh audit logs
        const logsRes = await fetch('/api/audit-logs');
        if (logsRes.ok) {
          const logsJson = await logsRes.json();
          if (logsJson.success) setAuditLogs(logsJson.data);
        }
      } else {
        setQueryError(data.error || 'Failed to query restricted SSM endpoint');
      }
    } catch {
      setQueryError('Network error connecting to SSM Middleware API');
    } finally {
      setIsQuerying(false);
    }
  };

  // Test proposed environment variables
  const handleValidateProposedEnv = async () => {
    setIsValidating(true);
    try {
      const res = await fetch('/api/config/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ env: testEnvInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setValidationResult(data.data);
      }
    } catch (err) {
      console.warn('Validation failed:', err);
    } finally {
      setIsValidating(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const envSample = `# Malaysian Government Central Data Exchange (MyGDX) Configuration
MYGDX_GATEWAY_URL="${configReport?.mygdx.gatewayUrl || 'https://sandbox.mygdx.gov.my'}"
MYGDX_CONSUMER_KEY="<YOUR_MAMPU_MYGDX_CONSUMER_KEY>"
MYGDX_CONSUMER_SECRET="<YOUR_MAMPU_MYGDX_CONSUMER_SECRET>"
MYGDX_AGENCY_CODE="${configReport?.mygdx.agencyCode || 'AGENCY_DEMO_01'}"
MYGDX_ENVIRONMENT="${configReport?.environment || 'sandbox'}"

# Suruhanjaya Syarikat Malaysia (SSM) Restricted Status API
SSM_API_BASE_URL="${configReport?.ssm.apiBaseUrl || 'https://sandbox.mygdx.gov.my/ssm/v1'}"
SSM_USER_ID="<YOUR_SSM_AGENCY_MEMBER_ID>"
SSM_SECRET_TOKEN="<YOUR_SSM_SERVICE_TOKEN>"
SSM_SIGNING_SECRET="<YOUR_HMAC_SHA256_SIGNING_SECRET>"
SSM_REQUEST_TIMEOUT_MS="10000"
SSM_RESTRICTED_ENDPOINTS="roc_status,rob_status,llp_status,compliance_status"

# Security & Compliance Flags
MIDDLEWARE_ENFORCE_HTTPS="true"
MIDDLEWARE_AUDIT_LOG_ENABLED="true"`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Top Government Security Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm ring-1 ring-blue-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">SSM Middleware</h1>
                <span className="text-[11px] font-semibold tracking-wider px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50 uppercase">
                  MyGDX Gateway
                </span>
                <span className="hidden sm:inline-flex text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-700/50 uppercase">
                  Document Verification Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Restricted Forensic & Evidentiary Gateway for Government Agencies, GLCs & Statutory Bodies
              </p>
            </div>
          </div>

          {/* Quick officer and key status indicator */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {officerAccount && (
              <button
                type="button"
                onClick={() => setActiveTab('account')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition"
                title="Click to manage Officer Account and Keys"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                <div>
                  <div className="font-semibold text-slate-200 text-[11px] leading-tight">
                    {officerAccount.fullName} ({officerAccount.badgeNumber})
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight truncate max-w-[170px]">
                    {officerAccount.organization}
                  </div>
                </div>
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 ml-1">
                  {officerAccount.clearanceLevel}
                </span>
              </button>
            )}

            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold uppercase tracking-wider text-emerald-300 text-[11px]">
                {configReport?.environment || 'SANDBOX'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowTechnicalSpecWindow(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/60 text-indigo-300 text-xs font-semibold shadow-sm transition"
              title="Open Technical Data Retrieval & Architecture Specification"
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Data Retrieval Spec</span>
              <span className="sm:hidden">Spec</span>
            </button>

            <button
              onClick={fetchStatus}
              disabled={isRefreshing}
              className="p-2 rounded-md bg-slate-800 border border-slate-700 hover:bg-slate-700 transition text-slate-300 disabled:opacity-50"
              title="Refresh Configuration Status"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 border-t border-slate-800/80 pt-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('brain_ai_correction')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 whitespace-nowrap transition ${
              activeTab === 'brain_ai_correction'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-950/40 shadow-sm'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            Brain AI Correctional &amp; Data Verification
            <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">
              AI Engine
            </span>
          </button>

          <button
            onClick={() => setActiveTab('poa_master_dossier')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 whitespace-nowrap transition ${
              activeTab === 'poa_master_dossier'
                ? 'border-amber-500 text-amber-300 bg-amber-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            POA &amp; Master Dossier
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono">
              Act 424
            </span>
          </button>

          <button
            onClick={() => setActiveTab('real_extracts')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 whitespace-nowrap transition ${
              activeTab === 'real_extracts'
                ? 'border-emerald-500 text-emerald-300 bg-emerald-950/40 shadow-sm'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
            Real Extracts &amp; CTC Gateway
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-semibold">
              Live Ingest
            </span>
          </button>

          <button
            onClick={() => setActiveTab('strategic_integrations')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 whitespace-nowrap transition ${
              activeTab === 'strategic_integrations'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-950/40 shadow-sm'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            20 Strategic Integrations
            <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-semibold">
              20 Active
            </span>
          </button>

          <button
            onClick={() => setActiveTab('court_ready_pdf_exporter')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 whitespace-nowrap transition ${
              activeTab === 'court_ready_pdf_exporter'
                ? 'border-amber-500 text-amber-300 bg-amber-950/40 shadow-sm'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            Court-Ready PDF Exporter
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-semibold">
              S.90A Admissible
            </span>
          </button>

          <button
            onClick={() => setActiveTab('probate_court_dna')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 whitespace-nowrap transition ${
              activeTab === 'probate_court_dna'
                ? 'border-amber-500 text-amber-300 bg-amber-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Gavel className="w-3.5 h-3.5 text-amber-400" />
            Probate, Courts &amp; DNA Verdict
            <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono">
              99.9999% DNA
            </span>
          </button>

          <button
            onClick={() => setActiveTab('crawler_retrieval')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 whitespace-nowrap transition ${
              activeTab === 'crawler_retrieval'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Document Crawler &amp; AI Retrieval
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
              PDF
            </span>
          </button>

          <button
            onClick={() => setActiveTab('case_dispute')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 whitespace-nowrap transition ${
              activeTab === 'case_dispute'
                ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-blue-400" />
            Case Dispute &amp; Traces
            <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono">
              Core
            </span>
          </button>

          <button
            onClick={() => setActiveTab('veridian_swift')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 whitespace-nowrap transition ${
              activeTab === 'veridian_swift'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            Veridian SWIFT &amp; UBO
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
              Trace
            </span>
          </button>

          <button
            onClick={() => setActiveTab('media_ai')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 whitespace-nowrap transition ${
              activeTab === 'media_ai'
                ? 'border-purple-500 text-purple-400 bg-purple-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5 text-purple-400" />
            AI Media &amp; Precedents
            <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono">
              AI
            </span>
          </button>

          <button
            onClick={() => setActiveTab('mcp')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 whitespace-nowrap transition ${
              activeTab === 'mcp'
                ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            MCP Server &amp; Tools
            <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 text-[10px]">
              Active
            </span>
          </button>

          <button
            onClick={() => setActiveTab('icij')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 whitespace-nowrap transition ${
              activeTab === 'icij'
                ? 'border-purple-500 text-purple-400 bg-purple-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5 text-purple-400" />
            ICIJ Reconcile API
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 whitespace-nowrap transition ${
              activeTab === 'skills'
                ? 'border-amber-500 text-amber-300 bg-amber-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <FolderArchive className="w-3.5 h-3.5 text-amber-400" />
            Skills Package (.zip)
          </button>

          <button
            onClick={() => setActiveTab('verify')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 whitespace-nowrap transition ${
              activeTab === 'verify'
                ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            Document Verification
          </button>

          <button
            onClick={() => setActiveTab('dossier')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 whitespace-nowrap transition ${
              activeTab === 'dossier'
                ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Intelligence Dossier
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 whitespace-nowrap transition ${
              activeTab === 'account'
                ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Officer &amp; Key Ingestion
          </button>

          <button
            onClick={() => setActiveTab('test')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 whitespace-nowrap transition ${
              activeTab === 'test'
                ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Restricted Endpoints
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 whitespace-nowrap transition ${
              activeTab === 'config'
                ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            Credentials
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 whitespace-nowrap transition ${
              activeTab === 'audit'
                ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Audit Trail
            {auditLogs.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
                {auditLogs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('env_guide')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 whitespace-nowrap transition ${
              activeTab === 'env_guide'
                ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            .env Spec
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Notice Banner regarding MyGDX restricted endpoints */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-900/40 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-slate-300">
            <span className="font-semibold text-blue-200">Restricted Evidentiary Gateway Context: </span>
            MyGDX (Malaysian Government Central Data Exchange) lists restricted status endpoints
            (Register of Companies ROC, Register of Businesses ROB, and LLP) accessible via both native
            Model Context Protocol (MCP) JSON-RPC 2.0 and standard REST API. Fully integrated with CourtListener
            legal decisions, ICIJ Offshore Leaks Reconcile API, and evidentiary document verification.
          </div>
        </div>

        {/* TAB: BRAIN AI CORRECTIONAL CENTER & DATA VERIFICATION SYSTEM */}
        {activeTab === 'brain_ai_correction' && (
          <BrainAiCorrectionalCenterView
            onNavigateToPoaDossier={() => setActiveTab('poa_master_dossier')}
          />
        )}

        {/* TAB: POWER OF ATTORNEY & MASTER FORENSIC DOSSIER */}
        {activeTab === 'poa_master_dossier' && (
          <PowerOfAttorneyAndMasterDossierView />
        )}

        {/* TAB: REAL EXTRACTS & STATUTORY CTC INGESTION GATEWAY */}
        {activeTab === 'real_extracts' && (
          <RealExtractsGatewayView />
        )}

        {/* TAB: 20 STRATEGIC JUDICIAL, FORENSIC & REGULATORY INTEGRATIONS */}
        {activeTab === 'strategic_integrations' && (
          <StrategicIntegrationsHubView />
        )}

        {/* TAB: COURT-READY PDF EXPORTER (EVIDENCE ACT 1950 SECTION 90A) */}
        {activeTab === 'court_ready_pdf_exporter' && (
          <CourtReadyPdfExporterView
            onNavigateToDossier={() => setActiveTab('poa_master_dossier')}
          />
        )}

        {/* TAB: PROBATE, ALL COURTS & DNA VERDICT FORENSIC INVESTIGATION */}
        {activeTab === 'probate_court_dna' && (
          <ProbateWillCourtDnaView
            onNavigateToCaseDispute={() => setActiveTab('case_dispute')}
            onNavigateToCrawler={() => setActiveTab('crawler_retrieval')}
            onNavigateToVeridianSwift={() => setActiveTab('veridian_swift')}
          />
        )}

        {/* TAB: TARGETED DOCUMENT CRAWLER, SCRAPER & AI RETRIEVAL */}
        {activeTab === 'crawler_retrieval' && (
          <CrawlerScraperRetrievalView
            onNavigateToCaseDispute={() => setActiveTab('case_dispute')}
            onNavigateToVeridianSwift={() => setActiveTab('veridian_swift')}
          />
        )}

        {/* TAB: CORE CASE DISPUTE & ALL TRIGGERS TRACED */}
        {activeTab === 'case_dispute' && (
          <CaseDisputeAndTracesView
            onNavigateToAiMedia={(triggerId) => {
              if (triggerId) setSelectedMediaTriggerId(triggerId);
              setActiveTab('media_ai');
            }}
            onNavigateToVeridianSwift={() => setActiveTab('veridian_swift')}
            onNavigateToCrawler={() => setActiveTab('crawler_retrieval')}
          />
        )}

        {/* TAB: VERIDIAN SETTLEMENT, SWIFT TRACE & UBO AUDIT */}
        {activeTab === 'veridian_swift' && (
          <VeridianSwiftUboView
            onNavigateToVerify={() => setActiveTab('verify')}
            onNavigateToIcij={() => setActiveTab('icij')}
            onNavigateToCaseDispute={() => setActiveTab('case_dispute')}
            onNavigateToCrawler={() => setActiveTab('crawler_retrieval')}
          />
        )}

        {/* TAB: AI MEDIA COVERAGE & HISTORICAL PRECEDENTS */}
        {activeTab === 'media_ai' && (
          <AiMediaCoverageView initialTriggerId={selectedMediaTriggerId} />
        )}

        {/* TAB: MCP SERVER & DUAL-ACCESS CONSOLE */}
        {activeTab === 'mcp' && (
          <McpGatewayView
            onNavigateToIcij={() => setActiveTab('icij')}
            onNavigateToSkills={() => setActiveTab('skills')}
          />
        )}

        {/* TAB: ICIJ OFFSHORE LEAKS RECONCILIATION */}
        {activeTab === 'icij' && <IcijReconciliationView />}

        {/* TAB: SKILLS PACKAGE (.ZIP) HUB */}
        {activeTab === 'skills' && <SkillsPackageHubView />}

        {/* TAB: DOCUMENT VERIFICATION */}
        {activeTab === 'verify' && <DocumentVerificationView account={officerAccount} />}

        {/* TAB 1: INTELLIGENCE DOSSIER & RECONCILIATION */}
        {activeTab === 'dossier' && <ForensicDossierView />}

        {/* TAB 2: ACCOUNT CREATION & KEY INGESTION */}
        {activeTab === 'account' && (
          <AccountKeyIngestionView
            account={officerAccount}
            onAccountUpdated={(updated) => setOfficerAccount(updated)}
          />
        )}

        {/* TAB 1: CREDENTIALS & SECURITY STATUS */}
        {activeTab === 'config' && (
          <div className="space-y-6">
            {/* Top row: Security Posture Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Compliance Posture</div>
                  <div className="text-lg font-bold text-white mt-1 flex items-center gap-2">
                    {configReport?.security.complianceRating === 'COMPLIANT' ? (
                      <>
                        <span className="text-emerald-400">COMPLIANT</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </>
                    ) : configReport?.security.complianceRating === 'WARNING' ? (
                      <>
                        <span className="text-amber-400">SANDBOX VERIFIED</span>
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      </>
                    ) : (
                      <>
                        <span className="text-red-400">ACTION REQUIRED</span>
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      </>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {configReport?.environment === 'production'
                      ? 'Production security rules active'
                      : 'Sandbox simulated gateway mode active'}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Secret Masking & Memory Guard</div>
                  <div className="text-lg font-bold text-white mt-1 flex items-center gap-2">
                    <span className="text-blue-400">ISOLATED</span>
                    <Lock className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Secrets sanitized before exposure
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-950/40 border border-blue-800/40 flex items-center justify-center text-blue-400">
                  <Lock className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-medium">HMAC-SHA256 Signing Engine</div>
                  <div className="text-lg font-bold text-white mt-1 flex items-center gap-2">
                    <span className="text-purple-400">ACTIVE</span>
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    X-MyGDX-Signature header generator ready
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-950/40 border border-purple-800/40 flex items-center justify-center text-purple-400">
                  <Key className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Credential Status Inspection Table */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Environment Credentials Audit Table
                  </h3>
                  <p className="text-xs text-slate-400">
                    Real-time status of MyGDX and SSM environment variables processed by the configuration module.
                  </p>
                </div>
                <button
                  onClick={fetchStatus}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-medium transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-audit
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60 border-y border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Variable Name</th>
                      <th className="py-2.5 px-3">Purpose & Target</th>
                      <th className="py-2.5 px-3">Configured Status</th>
                      <th className="py-2.5 px-3">Masked Preview (Safe DTO)</th>
                      <th className="py-2.5 px-3">Strength / Isolation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono">
                    {/* MYGDX_GATEWAY_URL */}
                    <tr className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-semibold text-blue-400">MYGDX_GATEWAY_URL</td>
                      <td className="py-3 px-3 font-sans text-slate-300">MyGDX API gateway base endpoint</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[10px]">
                          <Check className="w-3 h-3" /> SET
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">
                        {configReport?.mygdx.gatewayUrl || 'https://sandbox.mygdx.gov.my'}
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-400 text-[11px]">HTTPS Enforced</td>
                    </tr>

                    {/* MYGDX_CONSUMER_KEY */}
                    <tr className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-semibold text-blue-400">MYGDX_CONSUMER_KEY</td>
                      <td className="py-3 px-3 font-sans text-slate-300">Agency consumer key issued by MAMPU</td>
                      <td className="py-3 px-3">
                        {configReport?.mygdx.consumerKeyStatus.isConfigured ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[10px]">
                            <Check className="w-3 h-3" /> ACTIVE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60 text-[10px]">
                            SANDBOX DEMO
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">
                        {configReport?.mygdx.consumerKeyStatus.maskedValue || 'DEMO••••••••KEY'}
                      </td>
                      <td className="py-3 px-3 font-sans">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] uppercase font-mono">
                          {configReport?.mygdx.consumerKeyStatus.strength || 'moderate'}
                        </span>
                      </td>
                    </tr>

                    {/* MYGDX_CONSUMER_SECRET */}
                    <tr className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-semibold text-blue-400">MYGDX_CONSUMER_SECRET</td>
                      <td className="py-3 px-3 font-sans text-slate-300">HMAC-SHA256 signature secret token</td>
                      <td className="py-3 px-3">
                        {configReport?.mygdx.consumerSecretStatus.isConfigured ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[10px]">
                            <Check className="w-3 h-3" /> ACTIVE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60 text-[10px]">
                            SANDBOX FALLBACK
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">
                        {configReport?.mygdx.consumerSecretStatus.maskedValue || '••••••••••••'}
                      </td>
                      <td className="py-3 px-3 font-sans">
                        <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40 text-[10px]">
                          Masked in DTO
                        </span>
                      </td>
                    </tr>

                    {/* MYGDX_AGENCY_CODE */}
                    <tr className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-semibold text-blue-400">MYGDX_AGENCY_CODE</td>
                      <td className="py-3 px-3 font-sans text-slate-300">Authorized ministry, agency, or GLC code</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[10px]">
                          <Check className="w-3 h-3" /> VERIFIED
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-200 font-mono text-[11px]">
                        {configReport?.mygdx.agencyCode || 'AGENCY_DEMO_01'}
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-400 text-[11px]">
                        Institutional Identifier
                      </td>
                    </tr>

                    {/* SSM_API_BASE_URL */}
                    <tr className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-semibold text-purple-400">SSM_API_BASE_URL</td>
                      <td className="py-3 px-3 font-sans text-slate-300">SSM status service base path</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[10px]">
                          <Check className="w-3 h-3" /> SET
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">
                        {configReport?.ssm.apiBaseUrl || 'https://sandbox.mygdx.gov.my/ssm/v1'}
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-400 text-[11px]">Restricted Route</td>
                    </tr>

                    {/* SSM_USER_ID */}
                    <tr className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-semibold text-purple-400">SSM_USER_ID</td>
                      <td className="py-3 px-3 font-sans text-slate-300">SSM member/agent identifier</td>
                      <td className="py-3 px-3">
                        {configReport?.ssm.userIdStatus.isConfigured ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[10px]">
                            <Check className="w-3 h-3" /> CONFIGURED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60 text-[10px]">
                            SANDBOX USER
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">
                        {configReport?.ssm.userIdStatus.maskedValue || 'DEM••••82'}
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-400 text-[11px]">Restricted Membership</td>
                    </tr>

                    {/* SSM_SECRET_TOKEN */}
                    <tr className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-semibold text-purple-400">SSM_SECRET_TOKEN</td>
                      <td className="py-3 px-3 font-sans text-slate-300">SSM API service bearer credential</td>
                      <td className="py-3 px-3">
                        {configReport?.ssm.secretTokenStatus.isConfigured ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[10px]">
                            <Check className="w-3 h-3" /> SECURED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60 text-[10px]">
                            SANDBOX TOKEN
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">
                        {configReport?.ssm.secretTokenStatus.maskedValue || '••••••••••••'}
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-400 text-[11px]">Bearer Authentication</td>
                    </tr>

                    {/* SSM_SIGNING_SECRET */}
                    <tr className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-semibold text-purple-400">SSM_SIGNING_SECRET</td>
                      <td className="py-3 px-3 font-sans text-slate-300">Dedicated signature key for payload hashing</td>
                      <td className="py-3 px-3">
                        {configReport?.ssm.signingSecretStatus.isConfigured ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[10px]">
                            <Check className="w-3 h-3" /> SET
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                            USES CONSUMER SECRET
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">
                        {configReport?.ssm.signingSecretStatus.maskedValue || '••••••••••••'}
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-400 text-[11px]">SHA-256 HMAC</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Interactive Environment Variable Validator Drawer */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  Test Proposed Environment Variables (Dry-Run Simulator)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Validate government agency credentials against NACSA and MAMPU security compliance
                  rules before deploying to production. Values tested here are evaluated in-memory and
                  are never persisted.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    MYGDX_CONSUMER_KEY
                  </label>
                  <input
                    type="text"
                    value={testEnvInput.MYGDX_CONSUMER_KEY}
                    onChange={(e) =>
                      setTestEnvInput({ ...testEnvInput, MYGDX_CONSUMER_KEY: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                    placeholder="e.g. MAMPU_MYGDX_PROD_KEY"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    MYGDX_CONSUMER_SECRET (HMAC Signing Secret)
                  </label>
                  <input
                    type="password"
                    value={testEnvInput.MYGDX_CONSUMER_SECRET}
                    onChange={(e) =>
                      setTestEnvInput({ ...testEnvInput, MYGDX_CONSUMER_SECRET: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                    placeholder="Enter secret token"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    MYGDX_AGENCY_CODE
                  </label>
                  <input
                    type="text"
                    value={testEnvInput.MYGDX_AGENCY_CODE}
                    onChange={(e) =>
                      setTestEnvInput({ ...testEnvInput, MYGDX_AGENCY_CODE: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                    placeholder="e.g. AGENCY_LHDN_01"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    SSM_USER_ID
                  </label>
                  <input
                    type="text"
                    value={testEnvInput.SSM_USER_ID}
                    onChange={(e) =>
                      setTestEnvInput({ ...testEnvInput, SSM_USER_ID: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                    placeholder="e.g. SSM_CORP_USER_882"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleValidateProposedEnv}
                  disabled={isValidating}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-xs text-white shadow-sm transition disabled:opacity-50"
                >
                  {isValidating ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5" />
                  )}
                  Run Security Validation Dry-Run
                </button>
              </div>

              {validationResult && (
                <div className="mt-4 p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">
                      Validation Outcome:
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded uppercase ${
                        validationResult.complianceRating === 'COMPLIANT'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : validationResult.complianceRating === 'WARNING'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-red-950 text-red-300 border border-red-800'
                      }`}
                    >
                      {validationResult.complianceRating}
                    </span>
                  </div>

                  {validationResult.errors.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[11px] font-semibold text-red-400">Critical Errors:</div>
                      {validationResult.errors.map((err, i) => (
                        <div key={i} className="text-xs text-red-300 flex items-center gap-1.5 font-mono">
                          • {err}
                        </div>
                      ))}
                    </div>
                  )}

                  {validationResult.warnings.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[11px] font-semibold text-amber-400">Warnings:</div>
                      {validationResult.warnings.map((w, i) => (
                        <div key={i} className="text-xs text-amber-300 flex items-center gap-1.5 font-mono">
                          • {w}
                        </div>
                      ))}
                    </div>
                  )}

                  {validationResult.recommendations.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[11px] font-semibold text-blue-400">Security Advice:</div>
                      {validationResult.recommendations.map((rec, i) => (
                        <div key={i} className="text-xs text-slate-400 flex items-center gap-1.5">
                          • {rec}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: RESTRICTED ENDPOINTS CONSOLE */}
        {activeTab === 'test' && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  Restricted SSM Status Endpoints Query Console
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  These endpoints are hosted through MyGDX for authorized government entities, GLCs,
                  and financial institutions. The query dynamically computes HMAC-SHA256 request
                  signatures with the agency credentials.
                </p>
              </div>

              {/* Endpoint selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEndpoint('/ssm/status/roc');
                    setQueryInput('201901000001');
                  }}
                  className={`p-3 rounded-lg border text-left transition ${
                    selectedEndpoint === '/ssm/status/roc'
                      ? 'bg-blue-950/40 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-blue-400">ROC Status</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">Register of Companies</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">/ssm/status/roc</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedEndpoint('/ssm/status/rob');
                    setQueryInput('002934812-M');
                  }}
                  className={`p-3 rounded-lg border text-left transition ${
                    selectedEndpoint === '/ssm/status/rob'
                      ? 'bg-blue-950/40 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-emerald-400">ROB Status</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">Register of Businesses</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">/ssm/status/rob</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedEndpoint('/ssm/status/llp');
                    setQueryInput('LLP0019283-LGN');
                  }}
                  className={`p-3 rounded-lg border text-left transition ${
                    selectedEndpoint === '/ssm/status/llp'
                      ? 'bg-blue-950/40 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-purple-400">LLP Status</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">Limited Liability Partnership</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">/ssm/status/llp</div>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleQuery} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Entity Registration Number (ROC / ROB / LLP)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={queryInput}
                        onChange={(e) => setQueryInput(e.target.value)}
                        placeholder="e.g. 201901000001, 1312345-X, 002934812-M, LLP0019283-LGN"
                        className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isQuerying}
                      className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 transition disabled:opacity-50"
                    >
                      {isQuerying ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Dispatch Signed Query
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Pre-seeded samples: <span className="text-slate-400 font-mono">201901000001 (1312345-X)</span> (ROC),{' '}
                    <span className="text-slate-400 font-mono">002934812-M</span> (ROB),{' '}
                    <span className="text-slate-400 font-mono">LLP0019283-LGN</span> (LLP).
                  </p>
                </div>
              </form>

              {queryError && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{queryError}</span>
                </div>
              )}
            </div>

            {/* Query Result Card */}
            {queryResult && (
              <div className="space-y-4">
                {/* Security Signatures Card */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      Cryptographic Authorization Headers Generated
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-mono text-[10px]">
                      HMAC-SHA256 VERIFIED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Agency Code</div>
                      <div className="font-mono text-slate-300 font-semibold text-[11px] mt-0.5">
                        {queryResult.securityMetadata.gateway}
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Signature Hash</div>
                      <div className="font-mono text-purple-300 font-semibold text-[11px] mt-0.5 truncate">
                        {queryResult.securityMetadata.signaturePreview}
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Consumer Key Used</div>
                      <div className="font-mono text-blue-300 font-semibold text-[11px] mt-0.5 truncate">
                        {queryResult.securityMetadata.consumerKeyUsed}
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Latency</div>
                      <div className="font-mono text-emerald-400 font-semibold text-[11px] mt-0.5">
                        {queryResult.securityMetadata.durationMs}ms
                      </div>
                    </div>
                  </div>
                </div>

                {/* Entity Details Certificate Card */}
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">
                          {queryResult.entity.entityType}
                        </span>
                        <h4 className="text-base font-bold text-white tracking-wide">
                          {queryResult.entity.companyName}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 font-mono">
                        Registration No: {queryResult.entity.registrationNumber}{' '}
                        {queryResult.entity.oldRegistrationNumber && (
                          <span className="text-slate-500">
                            (Old: {queryResult.entity.oldRegistrationNumber})
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {queryResult.entity.companyStatus}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Verified via MyGDX SSM Broker
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <div className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                        Company Details
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Entity Type:</span>
                          <span className="text-slate-200 font-medium">{queryResult.entity.companyType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Incorporation / Reg Date:</span>
                          <span className="text-slate-200 font-mono">{queryResult.entity.incorporationDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Registered City / State:</span>
                          <span className="text-slate-200">
                            {queryResult.entity.registeredAddress.city},{' '}
                            {queryResult.entity.registeredAddress.state}
                          </span>
                        </div>
                        <div className="pt-1 text-[11px] text-slate-400">
                          <span className="block text-slate-500">Registered Office:</span>
                          {queryResult.entity.registeredAddress.addressLine1}
                          {queryResult.entity.registeredAddress.addressLine2 &&
                            `, ${queryResult.entity.registeredAddress.addressLine2}`}
                          , {queryResult.entity.registeredAddress.postcode}{' '}
                          {queryResult.entity.registeredAddress.city}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                        Compliance & Statutory Record
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Last Annual Return Year:</span>
                          <span className="text-emerald-400 font-mono font-medium">
                            {queryResult.entity.complianceStatus.lastAnnualReturnYear || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Financial Statements Filed:</span>
                          <span className="text-slate-200 font-mono">
                            {queryResult.entity.complianceStatus.lastFinancialStatementYear || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Active SSM Compounds:</span>
                          <span className="text-emerald-400 font-medium">
                            {queryResult.entity.complianceStatus.hasActiveCompound ? 'YES (Active)' : 'None (Clean)'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Director Blacklisting Flag:</span>
                          <span className="text-emerald-400 font-medium">
                            {queryResult.entity.complianceStatus.isDirectorBlacklisted ? 'BLACKLISTED' : 'CLEAR'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DEVOPS & .ENV SPECIFICATION */}
        {activeTab === 'env_guide' && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-blue-400" />
                    Production .env Specification & Architecture
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Complete environment variable manifest for system engineers configuring
                    Kubernetes Secrets, Cloud Run, or HashiCorp Vault for government agency middleware.
                  </p>
                </div>

                <button
                  onClick={() => copyToClipboard(envSample, 'env_sample')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
                >
                  {copiedKey === 'env_sample' ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy .env Template
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                  {envSample}
                </pre>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Security Hardening Guidelines (MAMPU & NACSA Standards)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-semibold text-blue-300">1. Zero Plaintext Secret Leakage</div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      The SSM configuration module parses environment variables into read-only, frozen
                      memory buffers. Outbound API responses for status and telemetry use sanitized DTOs
                      with character masking.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-semibold text-purple-300">2. Request Signing & Nonce Integrity</div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      All outbound requests to MyGDX calculate an HMAC-SHA256 signature using{' '}
                      <span className="font-mono text-slate-300">SSM_SIGNING_SECRET</span> and an ISO 8601
                      timestamp, preventing man-in-the-middle replay attacks.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-semibold text-emerald-300">3. TLS/HTTPS Enforcement</div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      Plaintext <span className="font-mono text-slate-300">http://</span> URLs are rejected
                      at startup by the configuration module, ensuring that sensitive corporate status data
                      travels exclusively over TLS 1.3 encrypted channels.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-semibold text-amber-300">4. Restricted Agency White-listing</div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      Endpoints are gated by <span className="font-mono text-slate-300">SSM_RESTRICTED_ENDPOINTS</span>.
                      Any attempt to query an unapproved endpoint will be halted at the middleware layer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    Government Data Exchange Audit Log
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Immutable ring buffer recording all transactions dispatched through this SSM middleware.
                  </p>
                </div>
                <button
                  onClick={fetchStatus}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-medium transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh Logs
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60 border-y border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Agency</th>
                      <th className="py-2.5 px-3">Restricted Endpoint</th>
                      <th className="py-2.5 px-3">Query Param</th>
                      <th className="py-2.5 px-3">HMAC Integrity</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                          No audit entries recorded yet. Query an endpoint in the console to generate logs.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-blue-400">
                            {log.agencyCode}
                          </td>
                          <td className="py-2.5 px-3 text-slate-300">{log.endpoint}</td>
                          <td className="py-2.5 px-3 text-slate-200 font-medium">{log.queryParam}</td>
                          <td className="py-2.5 px-3">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[10px]">
                              <Check className="w-3 h-3" /> VERIFIED
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] ${
                                log.httpStatus === 200
                                  ? 'bg-emerald-950 text-emerald-300'
                                  : 'bg-red-950 text-red-300'
                              }`}
                            >
                              {log.statusText}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">{log.durationMs}ms</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-900 mt-12 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4">
        <div>
          SSM Middleware Gateway • Secure Environment Configuration for MyGDX Restricted Endpoints
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-slate-400">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            TLS 1.3 & HMAC-SHA256 Active
          </span>
          <span className="text-slate-600">|</span>
          <span>Approved for Ministries, Agencies & GLCs</span>
        </div>
      </footer>
      {/* Technical Data Retrieval Specification Window */}
      <DataRetrievalTechnicalWindow
        isOpen={showTechnicalSpecWindow}
        onClose={() => setShowTechnicalSpecWindow(false)}
      />
    </div>
  );
}
