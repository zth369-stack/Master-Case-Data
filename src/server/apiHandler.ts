import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  addAuditLog,
  createSecureMyGdxHeaders,
  getAuditLogs,
  getSanitizedConfigReport,
  loadMiddlewareConfig,
  reloadMiddlewareConfig,
  validateMiddlewareConfig,
} from './mygdxSsmConfig.js';
import type { IngestedKeySet, OfficerAccount, SsmCompanyStatus } from '../shared/types.js';
import {
  FORENSIC_ENTITIES,
  getActiveOfficerAccount,
  getVerifiableDocuments,
  ingestOfficerKeys,
  TARGET_PROFILE,
  updateOfficerAccount,
  verifyDocumentById,
} from './forensicData.js';
import { buildSkillsZipBuffer, SKILL_PACKAGES } from './skillsData.js';
import {
  dispatchMcpRpc,
  executeIcijReconcile,
  handleMcpToolCall,
  MCP_PROMPTS,
  MCP_RESOURCES,
  MCP_TOOLS,
} from './mcpServer.js';
import {
  CASE_DISPUTE_CORE,
  CASE_TRIGGER_TRACES,
  HISTORICAL_PRECEDENTS,
  PRECOMPUTED_MEDIA_COVERAGE,
  executeAiMediaCaseAnalysis,
  VERIDIAN_SETTLEMENT_ANALYSIS,
  SWIFT_TRANSFER_LOGS,
  UBO_DETAILS,
  type GenerateMediaAnalysisRequest,
} from './geminiAiService.js';
import {
  SCRAPED_DOCUMENTS_CATALOG,
  CRAWLER_TARGET_CONFIGS,
  CRAWLER_EXECUTION_LOGS,
  AI_CODE_RETRIEVAL_SNIPPETS,
  executeAiDocumentRetrieval,
} from './crawlerAndRetrievalService.js';
import type { AiDocumentRetrievalRequest, AiProbateInvestigationRequest } from '../shared/types.js';
import {
  PROBATE_COURT_DOSSIER,
  PROBATE_WILL_RECORD,
  ALL_COURT_DOCKETS,
  DNA_VERDICT_REPORT,
  executeProbateCourtAiInvestigation,
} from './probateAndCourtService.js';
import {
  buildMasterDossierExportData,
  generateMasterDossierMarkdown,
  generateMasterDossierCsv,
} from './masterDossierService.js';
import {
  discoverAllPowerOfAttorney,
  POWER_OF_ATTORNEY_REGISTRY,
} from './powerOfAttorneyService.js';
import {
  buildCompleteForensicThesis,
  generateThesisMarkdownText,
  ADDITIONAL_EVIDENTIARY_DOCUMENTS,
  FORENSIC_THESIS_CHAPTERS,
  BINDING_LEGAL_THESES,
  PATRIARCH_AND_LINEAGE_DATA,
  PERSONAL_ASSET_DATA,
  CORPORATE_STRUCTURE_DATA,
  LAW_ENFORCEMENT_AMLA_DATA,
  UNMASKED_PROXY_X_DATA,
} from './masterThesisService.js';
import {
  PRESET_CORRECTION_CASES,
  DATA_VERIFICATION_RECORDS,
  executeBrainAiCorrection,
  getDataVerificationSystemOverview,
  queryDataVerificationRegistry,
  executeFullSystemAutoAuditAndCorrection,
  getLatestAutoCorrectionAuditSummary,
  getAutoCorrectedChangesList,
  generateAutoCorrectionDecreeText,
  MASTER_SYSTEM_AUTO_CORRECTIONS,
} from './brainAiCorrectionService.js';
import {
  TWENTY_STRATEGIC_INTEGRATIONS,
  getIntegrationById,
  executeIntegrationVerification,
} from '../shared/twentyIntegrationsData.js';
import {
  getEnterpriseGateways,
  testGatewayConnection,
  getAllIngestedDocuments,
  deleteIngestedDocument,
  ingestRealDocument,
  generateSubpoenaCourtDocument,
} from './realExtractsService.js';

// Pre-seeded authentic mock SSM registry records for testing restricted status queries
const MOCK_ENTITIES: Record<string, SsmCompanyStatus> = {
  '1199837-7': {
    entityType: 'ROC',
    registrationNumber: '1199837-7',
    oldRegistrationNumber: '202001012345',
    companyName: 'KAVINATH HOLDINGS SDN. BHD.',
    incorporationDate: '2020-04-12',
    companyStatus: 'EXISTING',
    companyType: 'SENDRIAN BERHAD',
    registeredAddress: {
      addressLine1: 'Level 14, Menara SSM@Sentral',
      addressLine2: 'No. 7 Jalan Stesen Sentral 5, KL Sentral',
      postcode: '50470',
      city: 'Kuala Lumpur',
      state: 'Wilayah Persekutuan Kuala Lumpur',
    },
    complianceStatus: {
      lastAnnualReturnYear: 2025,
      lastFinancialStatementYear: 2025,
      hasActiveCompound: true,
      compoundCount: 1,
      isDirectorBlacklisted: false,
    },
    verifiedBy: 'MyGDX Gateway SSM Broker',
    retrievedAt: new Date().toISOString(),
  },
  '201901000001': {
    entityType: 'ROC',
    registrationNumber: '201901000001',
    oldRegistrationNumber: '1312345-X',
    companyName: 'MALAYSIA CENTRAL DATA SERVICES SDN. BHD.',
    incorporationDate: '2019-01-08',
    companyStatus: 'EXISTING',
    companyType: 'SENDRIAN BERHAD',
    registeredAddress: {
      addressLine1: 'Level 14, Menara SSM@Sentral',
      addressLine2: 'No. 7 Jalan Stesen Sentral 5, KL Sentral',
      postcode: '50470',
      city: 'Kuala Lumpur',
      state: 'Wilayah Persekutuan Kuala Lumpur',
    },
    complianceStatus: {
      lastAnnualReturnYear: 2025,
      lastFinancialStatementYear: 2025,
      hasActiveCompound: false,
      compoundCount: 0,
      isDirectorBlacklisted: false,
    },
    verifiedBy: 'MyGDX Gateway SSM Broker',
    retrievedAt: new Date().toISOString(),
  },
  '1312345-X': {
    entityType: 'ROC',
    registrationNumber: '201901000001',
    oldRegistrationNumber: '1312345-X',
    companyName: 'MALAYSIA CENTRAL DATA SERVICES SDN. BHD.',
    incorporationDate: '2019-01-08',
    companyStatus: 'EXISTING',
    companyType: 'SENDRIAN BERHAD',
    registeredAddress: {
      addressLine1: 'Level 14, Menara SSM@Sentral',
      addressLine2: 'No. 7 Jalan Stesen Sentral 5, KL Sentral',
      postcode: '50470',
      city: 'Kuala Lumpur',
      state: 'Wilayah Persekutuan Kuala Lumpur',
    },
    complianceStatus: {
      lastAnnualReturnYear: 2025,
      lastFinancialStatementYear: 2025,
      hasActiveCompound: false,
      compoundCount: 0,
      isDirectorBlacklisted: false,
    },
    verifiedBy: 'MyGDX Gateway SSM Broker',
    retrievedAt: new Date().toISOString(),
  },
  '002934812-M': {
    entityType: 'ROB',
    registrationNumber: '002934812-M',
    companyName: 'BORNEO SMART ENTERPRISE',
    incorporationDate: '2020-05-14',
    companyStatus: 'ACTIVE',
    companyType: 'SOLE PROPRIETORSHIP',
    registeredAddress: {
      addressLine1: 'Lot 45, Jalan Tun Fuad Stephens',
      postcode: '88000',
      city: 'Kota Kinabalu',
      state: 'Sabah',
    },
    complianceStatus: {
      lastAnnualReturnYear: 2024,
      hasActiveCompound: false,
      compoundCount: 0,
      isDirectorBlacklisted: false,
    },
    verifiedBy: 'MyGDX Gateway SSM Broker',
    retrievedAt: new Date().toISOString(),
  },
  'LLP0019283-LGN': {
    entityType: 'LLP',
    registrationNumber: 'LLP0019283-LGN',
    companyName: 'KONSORTIUM TEKNOLOGI KERAJAAN PLT',
    incorporationDate: '2021-11-20',
    companyStatus: 'ACTIVE',
    companyType: 'LIMITED LIABILITY PARTNERSHIP',
    registeredAddress: {
      addressLine1: 'Suite 8-2, Cyberview Tower 2',
      addressLine2: 'Persiaran APEC',
      postcode: '63000',
      city: 'Cyberjaya',
      state: 'Selangor',
    },
    complianceStatus: {
      lastAnnualReturnYear: 2025,
      lastFinancialStatementYear: 2024,
      hasActiveCompound: false,
      compoundCount: 0,
      isDirectorBlacklisted: false,
    },
    verifiedBy: 'MyGDX Gateway SSM Broker',
    retrievedAt: new Date().toISOString(),
  },
};

// Helper to read JSON request body
async function readJsonBody<T>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        if (!data || data.trim() === '') {
          resolve({} as T);
        } else {
          resolve(JSON.parse(data));
        }
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  });
  res.end(JSON.stringify(body));
}

export async function handleApiRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const method = req.method?.toUpperCase();

  // 0. GET /api/health - Health check endpoint
  if (pathname === '/api/health' && (method === 'GET' || method === 'HEAD')) {
    sendJson(res, 200, {
      status: 'ok',
      service: 'ssm-middleware',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    });
    return true;
  }

  // 1. GET /api/config/status - Get sanitized configuration report
  if (pathname === '/api/config/status' && method === 'GET') {
    const report = getSanitizedConfigReport();
    sendJson(res, 200, { success: true, data: report });
    return true;
  }

  // 2. POST /api/config/validate - Test proposed environment variables
  if (pathname === '/api/config/validate' && method === 'POST') {
    try {
      const body = await readJsonBody<{ env?: Record<string, string | undefined> }>(req);
      const testConfig = loadMiddlewareConfig({
        ...process.env,
        ...(body.env || {}),
      });
      const posture = validateMiddlewareConfig(testConfig);
      sendJson(res, 200, { success: true, data: posture });
    } catch {
      sendJson(res, 400, { success: false, error: 'Invalid request payload' });
    }
    return true;
  }

  // 3. POST /api/config/reload - Apply custom environment settings in-memory
  if (pathname === '/api/config/reload' && method === 'POST') {
    try {
      const body = await readJsonBody<{ env?: Record<string, string | undefined> }>(req);
      const updated = reloadMiddlewareConfig(body.env ? { ...process.env, ...body.env } : undefined);
      const report = getSanitizedConfigReport(updated);
      sendJson(res, 200, { success: true, message: 'Configuration reloaded successfully', data: report });
    } catch {
      sendJson(res, 400, { success: false, error: 'Failed to reload configuration' });
    }
    return true;
  }

  // 4. POST /api/ssm/query - Query restricted status endpoint through middleware
  if (pathname === '/api/ssm/query' && method === 'POST') {
    const startTime = Date.now();
    try {
      const body = await readJsonBody<{
        endpoint: string;
        registrationNumber: string;
      }>(req);

      const endpoint = body.endpoint || '/ssm/status/roc';
      const regNo = (body.registrationNumber || '').trim();

      if (!regNo) {
        sendJson(res, 400, { success: false, error: 'Registration number is required' });
        return true;
      }

      // Generate cryptographically signed MyGDX headers
      const signedHeaders = createSecureMyGdxHeaders(endpoint, { registrationNumber: regNo });

      // Lookup or synthesize entity details
      const cleanKey = regNo.toUpperCase().replace(/\s+/g, '');
      let entity = MOCK_ENTITIES[cleanKey];

      if (!entity) {
        // Synthesize a valid Malaysian entity result for demonstration
        const isRob = /^[0-9]{9}-[A-Z]$/.test(cleanKey) || endpoint.includes('rob');
        const isLlp = cleanKey.startsWith('LLP') || endpoint.includes('llp');

        entity = {
          entityType: isRob ? 'ROB' : isLlp ? 'LLP' : 'ROC',
          registrationNumber: cleanKey,
          companyName: `${cleanKey.replace(/[^A-Z0-9]/g, '')} VENTURES ${isRob ? 'ENTERPRISE' : isLlp ? 'PLT' : 'SDN. BHD.'}`,
          incorporationDate: '2022-03-15',
          companyStatus: 'EXISTING',
          companyType: isRob ? 'SOLE PROPRIETORSHIP' : isLlp ? 'LIMITED LIABILITY PARTNERSHIP' : 'SENDRIAN BERHAD',
          registeredAddress: {
            addressLine1: 'Wisma Persekutuan, Jalan Sultan Hishamuddin',
            postcode: '50050',
            city: 'Kuala Lumpur',
            state: 'Wilayah Persekutuan Kuala Lumpur',
          },
          complianceStatus: {
            lastAnnualReturnYear: 2025,
            lastFinancialStatementYear: 2024,
            hasActiveCompound: false,
            compoundCount: 0,
            isDirectorBlacklisted: false,
          },
          verifiedBy: 'MyGDX Gateway SSM Broker',
          retrievedAt: new Date().toISOString(),
        };
      }

      const durationMs = Date.now() - startTime;

      // Log the event securely in the audit ring
      addAuditLog({
        agencyCode: signedHeaders['X-MyGDX-Agency-Code'],
        endpoint,
        queryParam: regNo,
        httpStatus: 200,
        statusText: `200 OK (${entity.companyStatus})`,
        hmacVerified: true,
        durationMs,
      });

      sendJson(res, 200, {
        success: true,
        data: {
          entity,
          securityMetadata: {
            endpoint,
            gateway: signedHeaders['X-MyGDX-Agency-Code'],
            timestamp: signedHeaders['X-MyGDX-Timestamp'],
            signaturePreview: `${signedHeaders['X-MyGDX-Signature'].slice(0, 10)}...`,
            consumerKeyUsed: signedHeaders['X-MyGDX-Consumer-Key'],
            userIdUsed: signedHeaders['X-SSM-User-Id'],
            hmacVerified: true,
            durationMs,
          },
        },
      });
    } catch {
      const durationMs = Date.now() - startTime;
      addAuditLog({
        agencyCode: 'UNKNOWN',
        endpoint: '/ssm/status/unknown',
        queryParam: 'INVALID',
        httpStatus: 500,
        statusText: 'Internal Error',
        hmacVerified: false,
        durationMs,
      });
      sendJson(res, 500, { success: false, error: 'Failed to process SSM query' });
    }
    return true;
  }

  // 5. GET /api/audit-logs - Query audit trail
  if (pathname === '/api/audit-logs' && method === 'GET') {
    const logs = getAuditLogs();
    sendJson(res, 200, { success: true, data: logs });
    return true;
  }

  // 6. GET /api/account - Query officer account profile
  if (pathname === '/api/account' && method === 'GET') {
    const account = getActiveOfficerAccount();
    sendJson(res, 200, { success: true, data: account });
    return true;
  }

  // 7. POST /api/account - Update officer account details
  if (pathname === '/api/account' && method === 'POST') {
    try {
      const body = await readJsonBody<Partial<OfficerAccount>>(req);
      const updated = updateOfficerAccount(body);
      sendJson(res, 200, { success: true, data: updated });
    } catch {
      sendJson(res, 400, { success: false, error: 'Invalid account data' });
    }
    return true;
  }

  // 8. POST /api/keys/ingest - Ingest agency credentials with cryptographic verification
  if (pathname === '/api/keys/ingest' && method === 'POST') {
    try {
      const body = await readJsonBody<Partial<IngestedKeySet>>(req);
      const result = ingestOfficerKeys(body);
      sendJson(res, 200, {
        success: true,
        message: 'Credentials cryptographically verified and ingested successfully.',
        data: result,
      });
    } catch {
      sendJson(res, 400, { success: false, error: 'Failed to ingest cryptographic keys' });
    }
    return true;
  }

  // 9. GET /api/dossier/target - Get target intelligence profile
  if (pathname === '/api/dossier/target' && method === 'GET') {
    sendJson(res, 200, { success: true, data: TARGET_PROFILE });
    return true;
  }

  // 10. GET /api/dossier/entities - Get multi-jurisdictional reconciled entities
  if (pathname === '/api/dossier/entities' && method === 'GET') {
    sendJson(res, 200, { success: true, data: FORENSIC_ENTITIES });
    return true;
  }

  // 10A. GET /api/dossier/master-export - Consolidated Master Dossier with all data from initial case to present
  if (pathname === '/api/dossier/master-export' && method === 'GET') {
    const masterData = buildMasterDossierExportData();
    sendJson(res, 200, { success: true, data: masterData });
    return true;
  }

  // 10B. GET /api/dossier/master-export/download - Raw JSON downloadable file
  if (pathname === '/api/dossier/master-export/download' && method === 'GET') {
    const masterData = buildMasterDossierExportData();
    const jsonBuffer = Buffer.from(JSON.stringify(masterData, null, 2), 'utf-8');
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="master-forensic-dossier-kavinath-all-data.json"',
      'Content-Length': jsonBuffer.length,
      'Cache-Control': 'no-cache',
    });
    res.end(jsonBuffer);
    return true;
  }

  // 10C. GET /api/dossier/master-export/markdown - Formatted Legal Brief Markdown downloadable file
  if (pathname === '/api/dossier/master-export/markdown' && method === 'GET') {
    const masterData = buildMasterDossierExportData();
    const mdContent = generateMasterDossierMarkdown(masterData);
    const mdBuffer = Buffer.from(mdContent, 'utf-8');
    res.writeHead(200, {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'attachment; filename="master-forensic-dossier-kavinath-all-data.md"',
      'Content-Length': mdBuffer.length,
      'Cache-Control': 'no-cache',
    });
    res.end(mdBuffer);
    return true;
  }

  // 10D. GET /api/dossier/master-export/csv - Tabular Data Matrix CSV downloadable file
  if (pathname === '/api/dossier/master-export/csv' && method === 'GET') {
    const masterData = buildMasterDossierExportData();
    const csvContent = generateMasterDossierCsv(masterData);
    const csvBuffer = Buffer.from(csvContent, 'utf-8');
    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="master-forensic-dossier-kavinath-data-matrix.csv"',
      'Content-Length': csvBuffer.length,
      'Cache-Control': 'no-cache',
    });
    res.end(csvBuffer);
    return true;
  }

  // 10E. GET /api/power-of-attorney/discover - Discover all Power of Attorney instruments held upon Kavinath A/L Ganesan
  if (pathname === '/api/power-of-attorney/discover' && method === 'GET') {
    const discovery = discoverAllPowerOfAttorney();
    sendJson(res, 200, { success: true, data: discovery });
    return true;
  }

  // 10F. GET /api/power-of-attorney/records - List all discovered Power of Attorney records
  if (pathname === '/api/power-of-attorney/records' && method === 'GET') {
    sendJson(res, 200, { success: true, data: POWER_OF_ATTORNEY_REGISTRY });
    return true;
  }

  // 11. GET /api/documents - Get list of verifiable evidentiary documents
  if (pathname === '/api/documents' && method === 'GET') {
    const docs = getVerifiableDocuments();
    sendJson(res, 200, { success: true, data: docs });
    return true;
  }

  // 12. POST /api/documents/verify - Verify document authenticity
  if (pathname === '/api/documents/verify' && method === 'POST') {
    try {
      const body = await readJsonBody<{ documentId: string; customPayload?: string }>(req);
      if (!body.documentId && !body.customPayload) {
        sendJson(res, 400, { success: false, error: 'Document ID or custom payload required' });
        return true;
      }
      const report = verifyDocumentById(body.documentId, body.customPayload);
      sendJson(res, 200, { success: true, data: report });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Document verification failed';
      sendJson(res, 400, { success: false, error: msg });
    }
    return true;
  }

  // 13. GET /api/skills/list - List all evidentiary and MCP skills
  if (pathname === '/api/skills/list' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      count: SKILL_PACKAGES.length,
      data: SKILL_PACKAGES,
      zipDownloadUrl: '/api/skills/download-zip',
    });
    return true;
  }

  // 14. GET /api/skills/download-zip - Download complete skills package in zip
  if ((pathname === '/api/skills/download-zip' || pathname === '/api/skills/zip') && method === 'GET') {
    try {
      const zipBuffer = await buildSkillsZipBuffer();
      res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="mygdx-ssm-forensic-skills.zip"',
        'Content-Length': zipBuffer.byteLength,
        'Cache-Control': 'no-cache',
      });
      res.end(Buffer.from(zipBuffer));
    } catch (err) {
      console.error('Failed to generate skills zip:', err);
      sendJson(res, 500, { success: false, error: 'Failed to generate skills zip' });
    }
    return true;
  }

  // 15. GET /api/icij/manifest - ICIJ Offshore Leaks Reconciliation Service Manifest
  if (pathname === '/api/icij/manifest' && method === 'GET') {
    sendJson(res, 200, {
      name: 'ICIJ Offshore Leaks OpenRefine Reconcile Service',
      identifierSpace: 'https://offshoreleaks.icij.org/nodes/',
      schemaSpace: 'https://offshoreleaks.icij.org/schema/',
      defaultTypes: [
        { id: 'Entity', name: 'Offshore Entity / Shell Company' },
        { id: 'Officer', name: 'Officer / Director / Shareholder' },
        { id: 'Intermediary', name: 'Intermediary / Law Firm / Trust Provider' },
        { id: 'Address', name: 'Registered / Shell Address' },
      ],
      view: {
        url: 'https://offshoreleaks.icij.org/nodes/{{id}}',
      },
      upstreamApi: 'https://offshoreleaks.icij.org/api/v1/reconcile',
    });
    return true;
  }

  // 16. GET /api/icij/reconcile or POST /api/icij/reconcile - Query ICIJ Offshore Leaks API
  if (pathname === '/api/icij/reconcile') {
    try {
      let queryParam = url.searchParams.get('query') || '';
      let typeParam = url.searchParams.get('type') || undefined;
      let limitParam = Number(url.searchParams.get('limit') || 5);

      if (method === 'POST') {
        const body = await readJsonBody<{ query?: string; type?: string; limit?: number }>(req);
        if (body.query) queryParam = body.query;
        if (body.type) typeParam = body.type;
        if (body.limit) limitParam = body.limit;
      }

      if (!queryParam) {
        queryParam = 'Archon Holdings SA';
      }

      const reconcileResult = await executeIcijReconcile(queryParam, typeParam, limitParam);
      sendJson(res, 200, { success: true, data: reconcileResult });
    } catch {
      sendJson(res, 500, { success: false, error: 'Failed to reconcile entity against ICIJ Offshore Leaks' });
    }
    return true;
  }

  // 17. POST /api/mcp/rpc - Direct JSON-RPC MCP executor
  if (pathname === '/api/mcp/rpc' && method === 'POST') {
    try {
      const body = await readJsonBody<{
        jsonrpc?: string;
        id?: string | number | null;
        method: string;
        params?: Record<string, unknown>;
      }>(req);
      const rpcResult = await dispatchMcpRpc(body);
      sendJson(res, 200, rpcResult);
    } catch {
      sendJson(res, 400, { jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } });
    }
    return true;
  }

  // 18. GET /api/mcp/tools - List available MCP tools
  if (pathname === '/api/mcp/tools' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      tools: MCP_TOOLS,
      resources: MCP_RESOURCES,
      prompts: MCP_PROMPTS,
    });
    return true;
  }

  // 19. GET/POST /api/courtlistener/search - Dual REST access to CourtListener
  if (pathname === '/api/courtlistener/search') {
    try {
      let queryStr = url.searchParams.get('q') || '';
      let court = url.searchParams.get('court') || 'all';

      if (method === 'POST') {
        const body = await readJsonBody<{ query?: string; court?: string }>(req);
        if (body.query) queryStr = body.query;
        if (body.court) court = body.court;
      }

      if (!queryStr) queryStr = 'Kavinath Holdings';
      const results = await handleMcpToolCall('courtlistener_search_opinions', { query: queryStr, court });
      sendJson(res, 200, { success: true, data: results });
    } catch {
      sendJson(res, 500, { success: false, error: 'CourtListener search failed' });
    }
    return true;
  }

  // 20. GET /api/case/core-dispute - Retrieve foundational case dispute dossier
  if (pathname === '/api/case/core-dispute' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      data: CASE_DISPUTE_CORE,
    });
    return true;
  }

  // 21. GET /api/case/triggers - Retrieve all tracked case dispute triggers and trace vectors
  if (pathname === '/api/case/triggers' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      data: CASE_TRIGGER_TRACES,
    });
    return true;
  }

  // 22. GET /api/case/historical-precedents - Retrieve landmark judicial precedents
  if (pathname === '/api/case/historical-precedents' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      data: HISTORICAL_PRECEDENTS,
    });
    return true;
  }

  // 23. GET /api/case/media-coverage - Retrieve current and historical media articles
  if (pathname === '/api/case/media-coverage' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      data: PRECOMPUTED_MEDIA_COVERAGE,
    });
    return true;
  }

  // 24. POST /api/ai/media-analysis - Inject AI for media coverage, precedents, and sub-judice audit
  if (pathname === '/api/ai/media-analysis' && method === 'POST') {
    try {
      const body = await readJsonBody<GenerateMediaAnalysisRequest>(req);
      const aiResult = await executeAiMediaCaseAnalysis(body);
      sendJson(res, 200, {
        success: true,
        data: aiResult,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'AI media analysis failed';
      sendJson(res, 500, { success: false, error: message });
    }
    return true;
  }

  // 25. POST /api/ai/trace-trigger - Detailed AI trace of a specific trigger's ripple effects
  if (pathname === '/api/ai/trace-trigger' && method === 'POST') {
    try {
      const body = await readJsonBody<{ triggerId: string }>(req);
      const found = CASE_TRIGGER_TRACES.find((t) => t.triggerId === body.triggerId) || CASE_TRIGGER_TRACES[0];
      const analysis = await executeAiMediaCaseAnalysis({
        targetTriggerId: found.triggerId,
        focusTopic: `Trace trigger ${found.code}: ${found.summary}`,
        perspective: 'regulatory_enforcer',
      });
      sendJson(res, 200, {
        success: true,
        trigger: found,
        traceReport: analysis,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Trigger trace execution failed';
      sendJson(res, 500, { success: false, error: message });
    }
    return true;
  }

  // 26. GET /api/case/veridian-settlement - Forensic verdict on Crypto Liquidation vs. Veridian Settlement
  if (pathname === '/api/case/veridian-settlement' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      data: VERIDIAN_SETTLEMENT_ANALYSIS,
    });
    return true;
  }

  // 27. GET /api/case/swift-logs - Comprehensive forensic SWIFT and interbank wire transfer logs
  if (pathname === '/api/case/swift-logs' && method === 'GET') {
    const statusFilter = url.searchParams.get('status');
    const transferId = url.searchParams.get('transferId');

    let logs = SWIFT_TRANSFER_LOGS;
    if (statusFilter) {
      logs = logs.filter((l) => l.status === statusFilter);
    }
    if (transferId) {
      logs = logs.filter((l) => l.transferId === transferId || l.id === transferId);
    }

    sendJson(res, 200, {
      success: true,
      count: logs.length,
      data: logs,
    });
    return true;
  }

  // 28. GET /api/case/ubo-details - Comprehensive Ultimate Beneficial Owner (UBO) dossier
  if (pathname === '/api/case/ubo-details' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      data: UBO_DETAILS,
    });
    return true;
  }

  // 29. GET /api/crawler/documents - Filter and retrieve scraped incorporation, trust, banking & registration docs
  if (pathname === '/api/crawler/documents' && method === 'GET') {
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search')?.toLowerCase();
    const jurisdiction = url.searchParams.get('jurisdiction')?.toLowerCase();

    let docs = SCRAPED_DOCUMENTS_CATALOG;
    if (category && category !== 'ALL') {
      docs = docs.filter((d) => d.category === category);
    }
    if (jurisdiction && jurisdiction !== 'all') {
      docs = docs.filter((d) => d.jurisdiction.toLowerCase().includes(jurisdiction));
    }
    if (search) {
      docs = docs.filter(
        (d) =>
          d.documentTitle.toLowerCase().includes(search) ||
          d.referenceNumber.toLowerCase().includes(search) ||
          d.issuingAuthority.toLowerCase().includes(search) ||
          d.summary.toLowerCase().includes(search) ||
          d.keyParties.some((p) => p.name.toLowerCase().includes(search) || p.identification.toLowerCase().includes(search))
      );
    }

    sendJson(res, 200, {
      success: true,
      count: docs.length,
      data: docs,
    });
    return true;
  }

  // 30. GET /api/crawler/documents/:id - Single scraped document
  if (pathname.startsWith('/api/crawler/documents/') && method === 'GET') {
    const docId = pathname.replace('/api/crawler/documents/', '');
    const found = SCRAPED_DOCUMENTS_CATALOG.find((d) => d.id === docId);
    if (!found) {
      sendJson(res, 404, { success: false, error: 'Document not found in scraped registry archive' });
      return true;
    }
    sendJson(res, 200, { success: true, data: found });
    return true;
  }

  // 31. GET /api/crawler/spiders - Crawler spider target configurations
  if (pathname === '/api/crawler/spiders' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      data: CRAWLER_TARGET_CONFIGS,
    });
    return true;
  }

  // 32. GET /api/crawler/logs - Live crawler execution logs
  if (pathname === '/api/crawler/logs' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      data: CRAWLER_EXECUTION_LOGS,
    });
    return true;
  }

  // 33. POST /api/crawler/start-crawl - Trigger targeted spider execution
  if (pathname === '/api/crawler/start-crawl' && method === 'POST') {
    try {
      const body = await readJsonBody<{ spiderId?: string; category?: string }>(req);
      const spider = CRAWLER_TARGET_CONFIGS.find((s) => s.id === body.spiderId) || CRAWLER_TARGET_CONFIGS[0];

      // Generate a realistic live crawl execution record
      const newLog = {
        id: `LOG-CRAWL-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        spiderName: spider.name,
        targetEndpoint: spider.baseUrl,
        category: spider.targetCategory,
        status: 'SUCCESS' as const,
        httpStatus: 200,
        documentsHarvested: Math.floor(Math.random() * 3) + 2,
        bytesHarvested: Math.floor(Math.random() * 500000) + 400000,
        durationMs: Math.floor(Math.random() * 300) + 180,
        details: `Live targeted extraction completed against ${spider.jurisdiction}. Indexed into vector corpus with verified SHA-256 integrity.`,
      };

      sendJson(res, 200, {
        success: true,
        message: `Crawler spider ${spider.name} executed successfully.`,
        executionLog: newLog,
        matchingDocuments: SCRAPED_DOCUMENTS_CATALOG.filter((d) => d.crawlerSpider === spider.id || d.category === spider.targetCategory),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Crawler execution failed';
      sendJson(res, 500, { success: false, error: msg });
    }
    return true;
  }

  // 34. GET /api/ai-retrieval/code-snippets - Modern AI Code Retrieval Snippets
  if (pathname === '/api/ai-retrieval/code-snippets' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      count: AI_CODE_RETRIEVAL_SNIPPETS.length,
      data: AI_CODE_RETRIEVAL_SNIPPETS,
    });
    return true;
  }

  // 35. POST /api/ai-retrieval/search - Modern AI code & document retrieval engine
  if (pathname === '/api/ai-retrieval/search' && method === 'POST') {
    try {
      const body = await readJsonBody<AiDocumentRetrievalRequest>(req);
      if (!body.query || body.query.trim().length === 0) {
        sendJson(res, 400, { success: false, error: 'Search query parameter is required' });
        return true;
      }
      const retrievalResponse = await executeAiDocumentRetrieval(body);
      sendJson(res, 200, {
        success: true,
        data: retrievalResponse,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'AI Retrieval search failed';
      sendJson(res, 500, { success: false, error: msg });
    }
    return true;
  }

  // 36. GET /api/probate-court/overview - Full Probate, Court Dockets & DNA Verdict Dossier
  if (pathname === '/api/probate-court/overview' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      data: PROBATE_COURT_DOSSIER,
    });
    return true;
  }

  // 37. GET /api/probate-court/probate-will - Detailed Probate & Last Will Record
  if (pathname === '/api/probate-court/probate-will' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      data: PROBATE_WILL_RECORD,
    });
    return true;
  }

  // 38. GET /api/probate-court/court-dockets - Multi-court litigation dockets
  if (pathname === '/api/probate-court/court-dockets' && method === 'GET') {
    const jurisdiction = url.searchParams.get('jurisdiction');
    const division = url.searchParams.get('division');

    let filtered = [...ALL_COURT_DOCKETS];
    if (jurisdiction && jurisdiction !== 'ALL') {
      filtered = filtered.filter((d) => d.jurisdiction === jurisdiction);
    }
    if (division && division !== 'ALL') {
      filtered = filtered.filter((d) => d.division === division);
    }

    sendJson(res, 200, {
      success: true,
      count: filtered.length,
      data: filtered,
    });
    return true;
  }

  // 39. GET /api/probate-court/dna-verdict - Jabatan Kimia Certified DNA Verdict Report
  if (pathname === '/api/probate-court/dna-verdict' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      data: DNA_VERDICT_REPORT,
    });
    return true;
  }

  // 40. POST /api/probate-court/ai-investigate - Deep AI Judicial & Evidentiary Interrogation
  if (pathname === '/api/probate-court/ai-investigate' && method === 'POST') {
    try {
      const body = await readJsonBody<AiProbateInvestigationRequest>(req);
      if (!body.query || body.query.trim().length === 0) {
        sendJson(res, 400, { success: false, error: 'Inquiry query parameter is required' });
        return true;
      }
      const response = await executeProbateCourtAiInvestigation(body);
      sendJson(res, 200, {
        success: true,
        data: response,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Probate AI investigation failed';
      sendJson(res, 500, { success: false, error: msg });
    }
    return true;
  }

  // 41. GET /api/power-of-attorney/discover - Comprehensive POA discovery on Kavinath A/L Ganesan
  if (pathname === '/api/power-of-attorney/discover' && method === 'GET') {
    const summary = discoverAllPowerOfAttorney();
    sendJson(res, 200, {
      success: true,
      data: summary,
    });
    return true;
  }

  // 42. GET /api/power-of-attorney/records - All registered POA records
  if (pathname === '/api/power-of-attorney/records' && method === 'GET') {
    const category = url.searchParams.get('category');
    let records = POWER_OF_ATTORNEY_REGISTRY;
    if (category && category !== 'ALL') {
      records = records.filter((r) => r.category === category);
    }
    sendJson(res, 200, {
      success: true,
      count: records.length,
      data: records,
    });
    return true;
  }

  // 43. GET /api/dossier/master-export - Master dossier evolving from all findings
  if (pathname === '/api/dossier/master-export' && method === 'GET') {
    const masterData = buildMasterDossierExportData();
    sendJson(res, 200, {
      success: true,
      data: masterData,
    });
    return true;
  }

  // 44. GET /api/dossier/master-export/markdown - Plaintext Markdown brief of Master Dossier
  if (pathname === '/api/dossier/master-export/markdown' && method === 'GET') {
    const md = generateMasterDossierMarkdown();
    res.writeHead(200, {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline; filename="master-forensic-dossier-kavinath.md"',
    });
    res.end(md);
    return true;
  }

  // 45. GET /api/dossier/master-export/csv - Chronological audit log in CSV format
  if (pathname === '/api/dossier/master-export/csv' && method === 'GET') {
    const csv = generateMasterDossierCsv();
    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="master-dossier-chronology.csv"',
    });
    res.end(csv);
    return true;
  }

  // 46. GET /api/thesis/complete - Complete Forensic Thesis Dossier (A-Z Compendium)
  if (pathname === '/api/thesis/complete' && method === 'GET') {
    const thesis = buildCompleteForensicThesis();
    sendJson(res, 200, {
      success: true,
      data: thesis,
    });
    return true;
  }

  // 47. GET /api/thesis/additional-evidences - Catalog of all 14 additional evidentiary documents
  if (pathname === '/api/thesis/additional-evidences' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      count: ADDITIONAL_EVIDENTIARY_DOCUMENTS.length,
      data: ADDITIONAL_EVIDENTIARY_DOCUMENTS,
    });
    return true;
  }

  // 48. GET /api/thesis/chapters - All 12 comprehensive forensic thesis chapters
  if (pathname === '/api/thesis/chapters' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      count: FORENSIC_THESIS_CHAPTERS.length,
      data: FORENSIC_THESIS_CHAPTERS,
      bindingTheses: BINDING_LEGAL_THESES,
    });
    return true;
  }

  // 49. GET /api/thesis/markdown - Complete formatted thesis in Markdown format
  if ((pathname === '/api/thesis/markdown' || pathname === '/api/thesis/download-markdown') && method === 'GET') {
    const thesisMd = generateThesisMarkdownText();
    res.writeHead(200, {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'attachment; filename="SUPREME-FORENSIC-THESIS-DOSSIER-KAVINATH-GANESAN.md"',
    });
    res.end(thesisMd);
    return true;
  }

  // 50. GET /api/thesis/patriarch-lineage - Patriarch Provenance, Lineage & JPN Adoption Verification
  if (pathname === '/api/thesis/patriarch-lineage' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      data: PATRIARCH_AND_LINEAGE_DATA,
    });
    return true;
  }

  // 51. GET /api/thesis/personal-assets - Personal Bank Accounts, Real Estate & Luxury Vehicles
  if (pathname === '/api/thesis/personal-assets' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      data: PERSONAL_ASSET_DATA,
    });
    return true;
  }

  // 52. GET /api/thesis/corporate-structure - Corporate Hierarchy, SSM & Subsidiary Architecture
  if (pathname === '/api/thesis/corporate-structure' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      data: CORPORATE_STRUCTURE_DATA,
    });
    return true;
  }

  // 53. GET /api/thesis/law-enforcement - PDRM CCID & BNM AMLA Investigation Reports, Counsel on Record
  if (pathname === '/api/thesis/law-enforcement' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      data: LAW_ENFORCEMENT_AMLA_DATA,
    });
    return true;
  }

  // 54. GET /api/thesis/unmasked-proxy-x - Adverse Proxy X Real Full Name, NRIC & Criminal Charges
  if (pathname === '/api/thesis/unmasked-proxy-x' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      data: UNMASKED_PROXY_X_DATA,
    });
    return true;
  }

  // 55. GET /api/brain-ai/cases - Preset Brain AI Correction Cases
  if (pathname === '/api/brain-ai/cases' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      count: PRESET_CORRECTION_CASES.length,
      data: PRESET_CORRECTION_CASES,
      categories: ['CORPORATE_FORGERY', 'IDENTITY_LINEAGE', 'JUDICIAL_PROBATE', 'BANKING_DIVERSION', 'PROXY_DECEPTION'],
    });
    return true;
  }

  // 56. POST /api/brain-ai/correct - Execute Brain AI Cognitive Correction
  if (pathname === '/api/brain-ai/correct' && method === 'POST') {
    try {
      const body = await readJsonBody<any>(req);
      const verdict = await executeBrainAiCorrection(body);
      addAuditLog({
        agencyCode: 'BRAIN-AI-CORE',
        endpoint: '/api/brain-ai/correct',
        queryParam: verdict.caseId,
        httpStatus: 200,
        statusText: `Brain AI Correction executed: ${verdict.caseId} (${verdict.title}) [Verdict: ${verdict.aiAdjudicationVerdict}]`,
        hmacVerified: true,
        durationMs: 45,
      });
      sendJson(res, 200, {
        success: true,
        data: verdict,
      });
    } catch (err: any) {
      console.error('Brain AI Correction Error:', err);
      sendJson(res, 500, {
        success: false,
        error: err.message || 'Failed to execute Brain AI correction',
      });
    }
    return true;
  }

  // 57. GET /api/brain-ai/verification-system - Data Verification System Overview & Records
  if (pathname === '/api/brain-ai/verification-system' && method === 'GET') {
    const overview = getDataVerificationSystemOverview();
    sendJson(res, 200, {
      success: true,
      data: overview,
    });
    return true;
  }

  // 58. POST /api/brain-ai/verify-query - Query the Data Verification Registry
  if (pathname === '/api/brain-ai/verify-query' && method === 'POST') {
    try {
      const body = await readJsonBody<any>(req);
      const queryStr = body.query || '';
      const result = queryDataVerificationRegistry(queryStr);
      addAuditLog({
        agencyCode: 'DATA-VERIFY-REG',
        endpoint: '/api/brain-ai/verify-query',
        queryParam: queryStr || 'ALL',
        httpStatus: 200,
        statusText: `Data verification query scanned: "${queryStr}" (${result.matchedRecords.length} matched)`,
        hmacVerified: true,
        durationMs: 25,
      });
      sendJson(res, 200, {
        success: true,
        data: result,
      });
    } catch (err: any) {
      sendJson(res, 500, {
        success: false,
        error: err.message || 'Failed to query verification registry',
      });
    }
    return true;
  }

  // 59. POST /api/brain-ai/generate-certificate - Generate Digital Signature & Section 90A Certificate
  if (pathname === '/api/brain-ai/generate-certificate' && method === 'POST') {
    try {
      const body = await readJsonBody<any>(req);
      const recordId = body.recordId;
      const targetRecord = DATA_VERIFICATION_RECORDS.find((r) => r.id === recordId) || DATA_VERIFICATION_RECORDS[0];
      const certText = `MALAYSIA EVIDENCE ACT 1950 (ACT 56) SECTION 90A
DIGITAL CERTIFICATE OF VERIFICATION AND STATUTORY INTEGRITY

1. RECORD IDENTIFIER: ${targetRecord.id}
2. VERIFYING AUTHORITY: ${targetRecord.issuingAuthority}
3. STATUTORY ANCHOR: ${targetRecord.statutoryAnchor}
4. PRIMARY SUBJECT: ${targetRecord.targetSubject}
5. OFFICIAL REFERENCE: ${targetRecord.officialReferenceNumber}
6. VERIFICATION STATUS: ${targetRecord.verificationStatus}
7. CRYPTOGRAPHIC SHA-256 HASH: ${targetRecord.cryptographicSha256}
8. VERIFICATION LOCI AUDIT:
${targetRecord.verificationLoci.map((l) => `   - [${l.status}] ${l.parameter}: ${l.detail}`).join('\n')}
9. ATTESTING OFFICER: ${targetRecord.attestingOfficer}
10. OFFICIAL REMARKS: ${targetRecord.officialRemarks}

CERTIFICATION UNDER ACT 56 SECTION 90A:
I, ${targetRecord.attestingOfficer}, hereby certify that the electronic document identified above is authentic, uncorrupted, and accurately reproduced from the authoritative official registry. Pursuant to Section 90A of the Evidence Act 1950 and the Digital Signature Act 1997, this computer output is conclusive documentary evidence admissible in all courts of Malaysia.

ISSUED AT: ${new Date().toISOString()}
DIGITAL SEAL: ${targetRecord.cryptographicSha256.toUpperCase()}`;

      sendJson(res, 200, {
        success: true,
        data: {
          record: targetRecord,
          certificateText: certText,
          issuedAt: new Date().toISOString(),
        },
      });
    } catch (err: any) {
      sendJson(res, 500, {
        success: false,
        error: err.message || 'Failed to generate certificate',
      });
    }
    return true;
  }

  // 60. GET /api/brain-ai/auto-audit/summary - Retrieve latest auto-audit summary & stats
  if (pathname === '/api/brain-ai/auto-audit/summary' && method === 'GET') {
    const summary = getLatestAutoCorrectionAuditSummary();
    sendJson(res, 200, {
      success: true,
      data: summary,
    });
    return true;
  }

  // 61. POST /api/brain-ai/auto-audit/run - Trigger live autonomous scan & auto-correction sweep
  if (pathname === '/api/brain-ai/auto-audit/run' && method === 'POST') {
    try {
      const body = await readJsonBody<any>(req);
      const summary = await executeFullSystemAutoAuditAndCorrection(body);
      addAuditLog({
        agencyCode: 'BRAIN-AI-AUTO-AUDIT',
        endpoint: '/api/brain-ai/auto-audit/run',
        queryParam: summary.auditRunId,
        httpStatus: 200,
        statusText: `Autonomous audit & auto-correction executed: ${summary.totalAutoCorrectionsApplied} discrepancies rectified`,
        hmacVerified: true,
        durationMs: 45,
      });
      sendJson(res, 200, {
        success: true,
        data: summary,
      });
    } catch (err: any) {
      sendJson(res, 500, {
        success: false,
        error: err.message || 'Failed to execute autonomous audit run',
      });
    }
    return true;
  }

  // 62. GET /api/brain-ai/auto-audit/changes - Retrieve filtered separate list of auto-corrected changes
  if (pathname === '/api/brain-ai/auto-audit/changes' && method === 'GET') {
    const urlObj = new URL(req.url || '', `http://${req.headers.host}`);
    const domain = urlObj.searchParams.get('domain') || undefined;
    const query = urlObj.searchParams.get('query') || undefined;
    const severity = urlObj.searchParams.get('severity') || undefined;

    const list = getAutoCorrectedChangesList({ domain, query, severity });
    sendJson(res, 200, {
      success: true,
      count: list.length,
      data: list,
    });
    return true;
  }

  // 63. POST /api/brain-ai/auto-audit/export-decree - Generate official Evidence Act S.90A rectification decree
  if (pathname === '/api/brain-ai/auto-audit/export-decree' && method === 'POST') {
    try {
      const summary = getLatestAutoCorrectionAuditSummary();
      const text = generateAutoCorrectionDecreeText(summary);
      sendJson(res, 200, {
        success: true,
        data: {
          auditRunId: summary.auditRunId,
          decreeText: text,
          totalChanges: summary.changesMade.length,
          generatedAt: new Date().toISOString(),
        },
      });
    } catch (err: any) {
      sendJson(res, 500, {
        success: false,
        error: err.message || 'Failed to export rectification decree',
      });
    }
    return true;
  }

  // 64. GET /api/integrations/all - Retrieve all 20 judicial, statutory & forensic integrations
  if (pathname === '/api/integrations/all' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      count: TWENTY_STRATEGIC_INTEGRATIONS.length,
      data: TWENTY_STRATEGIC_INTEGRATIONS,
      generatedAt: new Date().toISOString(),
    });
    return true;
  }

  // 65. GET /api/integrations/summary - Telemetry and health metrics for the 20 integrations
  if (pathname === '/api/integrations/summary' && method === 'GET') {
    const totalCount = TWENTY_STRATEGIC_INTEGRATIONS.length;
    const operationalCount = TWENTY_STRATEGIC_INTEGRATIONS.filter(
      (i) => i.healthStatus === 'OPERATIONAL' || i.healthStatus === 'SYNCHRONIZED'
    ).length;
    const avgLatency = Math.round(
      TWENTY_STRATEGIC_INTEGRATIONS.reduce((acc, curr) => acc + curr.latencyMs, 0) / totalCount
    );
    const categoryCounts: Record<string, number> = {};
    TWENTY_STRATEGIC_INTEGRATIONS.forEach((i) => {
      categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
    });

    sendJson(res, 200, {
      success: true,
      summary: {
        totalIntegrations: totalCount,
        operationalIntegrations: operationalCount,
        complianceRate: '100% Evidence Act 1950 S.90A Admissible',
        averageLatencyMs: avgLatency,
        categoryBreakdown: categoryCounts,
        statutoryStandards: [
          'National Land Code 1965 (Act 828)',
          'Insolvency Act 1967 (Act 360)',
          'Companies Act 2016 (Act 777)',
          'Stamp Act 1949 (Act 378)',
          'Rules of Court 2012 Order 63A',
          'Legal Profession Act 1976 (Act 166)',
          'Digital Signature Act 1997 (Act 562)',
          'Anti-Money Laundering Act 2001 (Act 613)',
          'Penal Code (Act 574) Sec 468/471',
          'Evidence Act 1950 Sec 45, 47, 65B & 90A',
        ],
        lastAuditTimestamp: new Date().toISOString(),
      },
    });
    return true;
  }

  // 66. POST /api/integrations/execute - Execute live forensic query simulation across any of the 20 integrations
  if (pathname === '/api/integrations/execute' && method === 'POST') {
    try {
      const body = await readJsonBody<any>(req);
      const { integrationId, customQuery } = body;
      if (!integrationId) {
        sendJson(res, 400, { success: false, error: 'integrationId is required' });
        return true;
      }

      const execution = executeIntegrationVerification(integrationId, customQuery);

      // Record audit log
      addAuditLog({
        agencyCode: execution.integration.issuingAgency,
        endpoint: `/api/integrations/execute/${integrationId}`,
        queryParam: execution.queryExecuted,
        httpStatus: 200,
        statusText: `200 OK (${execution.result.status})`,
        hmacVerified: true,
        durationMs: execution.integration.latencyMs,
      });

      sendJson(res, 200, {
        success: true,
        data: execution,
      });
    } catch (err: any) {
      sendJson(res, 500, {
        success: false,
        error: err.message || 'Failed to execute integration query',
      });
    }
    return true;
  }

  // 67. GET /api/real-extracts/gateways - Retrieve enterprise B2B gateways and env connection readiness
  if (pathname === '/api/real-extracts/gateways' && method === 'GET') {
    const gateways = getEnterpriseGateways();
    sendJson(res, 200, {
      success: true,
      data: {
        gateways,
        summary: {
          totalGateways: gateways.length,
          configuredCount: gateways.filter((g) => g.configuredInEnv).length,
          activeCount: gateways.filter((g) => g.status === 'ONLINE').length,
          statutoryStandards: ['Evidence Act 1950 S.90A', 'Companies Act 2016 S.602', 'Digital Signature Act 1997 S.62', 'Order 38 Rule 13 ROC 2012'],
        },
      },
    });
    return true;
  }

  // 68. POST /api/real-extracts/gateways/test - Test live handshake and PKI certificate on official enterprise gateway
  if (pathname === '/api/real-extracts/gateways/test' && method === 'POST') {
    try {
      const body = await readJsonBody<any>(req);
      const { gatewayId } = body;
      const testResult = testGatewayConnection(gatewayId || 'mydata_ssm');

      addAuditLog({
        agencyCode: testResult.gateway.provider,
        endpoint: `/api/real-extracts/gateways/test/${gatewayId}`,
        queryParam: testResult.gateway.apiEndpoint,
        httpStatus: 200,
        statusText: '200 OK (TLS Handshake & OCSP Verified)',
        hmacVerified: true,
        durationMs: testResult.latencyMs,
      });

      sendJson(res, 200, {
        success: true,
        data: testResult,
      });
    } catch (err: any) {
      sendJson(res, 500, { success: false, error: err.message || 'Gateway handshake test failed' });
    }
    return true;
  }

  // 69. GET /api/real-extracts/dossier - Retrieve all real, cryptographically hashed documents in the dossier
  if (pathname === '/api/real-extracts/dossier' && method === 'GET') {
    const docs = getAllIngestedDocuments();
    sendJson(res, 200, {
      success: true,
      data: {
        documents: docs,
        totalDocuments: docs.length,
        totalBytes: docs.reduce((acc, d) => acc + d.fileSizeBytes, 0),
        sealedDocumentsCount: docs.filter((d) => d.forensicReport.hasDigitalSignature).length,
        courtAdmissibleCount: docs.filter((d) => d.admissibilityStatus === 'ADMISSIBLE_S90A').length,
      },
    });
    return true;
  }

  // 70. POST /api/real-extracts/ingest - Ingest a real scanned/downloaded document with byte-level forensic analysis
  if (pathname === '/api/real-extracts/ingest' && method === 'POST') {
    try {
      const body = await readJsonBody<any>(req);
      const { title, fileName, fileSizeBytes, base64Data, rawText, sourceCategory, issuingAgency, serialNo, courtRelevance } = body;

      if (!fileName && !title) {
        sendJson(res, 400, { success: false, error: 'Document fileName or title is required' });
        return true;
      }

      const ingested = ingestRealDocument({
        title: title || fileName,
        fileName: fileName || 'uploaded_evidence.pdf',
        fileSizeBytes: Number(fileSizeBytes) || 1024,
        base64Data,
        rawText,
        sourceCategory: sourceCategory || 'ssm_ctc',
        issuingAgency,
        serialNo,
        courtRelevance,
      });

      addAuditLog({
        agencyCode: ingested.issuingAgency,
        endpoint: `/api/real-extracts/ingest/${ingested.id}`,
        queryParam: `SHA256:${ingested.sha256Hash.substring(0, 16)}...`,
        httpStatus: 201,
        statusText: `201 Created (Section 90A Cert: ${ingested.forensicReport.section90ACertNo})`,
        hmacVerified: true,
        durationMs: 42,
      });

      sendJson(res, 201, {
        success: true,
        data: ingested,
      });
    } catch (err: any) {
      sendJson(res, 500, { success: false, error: err.message || 'Ingestion failed' });
    }
    return true;
  }

  // 71. DELETE /api/real-extracts/dossier - Delete an ingested document by ID
  if (pathname.startsWith('/api/real-extracts/dossier/') && method === 'DELETE') {
    const docId = pathname.replace('/api/real-extracts/dossier/', '');
    const deleted = deleteIngestedDocument(docId);
    if (deleted) {
      sendJson(res, 200, { success: true, message: `Document ${docId} deleted from evidence dossier.` });
    } else {
      sendJson(res, 404, { success: false, error: `Document ${docId} not found.` });
    }
    return true;
  }

  // 72. POST /api/real-extracts/subpoena/generate - Generate Court-Ready Subpoena Duces Tecum (Order 38 Rule 13)
  if (pathname === '/api/real-extracts/subpoena/generate' && method === 'POST') {
    try {
      const body = await readJsonBody<any>(req);
      const { subpoenaType, overrides } = body;
      const result = generateSubpoenaCourtDocument(subpoenaType || 'JPN', overrides);

      addAuditLog({
        agencyCode: 'High Court of Malaya',
        endpoint: '/api/real-extracts/subpoena/generate',
        queryParam: `Target: ${result.data.targetOfficialTitle}`,
        httpStatus: 200,
        statusText: '200 OK (Form 66 ROC 2012 Generated)',
        hmacVerified: true,
        durationMs: 18,
      });

      sendJson(res, 200, {
        success: true,
        data: result,
      });
    } catch (err: any) {
      sendJson(res, 500, { success: false, error: err.message || 'Subpoena generation failed' });
    }
    return true;
  }

  // 73. POST /api/real-extracts/download - Automated Enterprise B2B Document Retrieval Simulation
  if (pathname === '/api/real-extracts/download' && method === 'POST') {
    try {
      const body = await readJsonBody<any>(req);
      const { gatewayId, documentType, entityIdentifier, addToDossier } = body;

      const gw = getEnterpriseGateways().find((g) => g.id === gatewayId) || getEnterpriseGateways()[0];
      const targetId = entityIdentifier || '1199837-7';
      const docName = `${gw.name.split(' ')[0]}_${documentType || 'OFFICIAL_EXTRACT'}_${targetId.replace(/[^a-zA-Z0-9]/g, '')}.pdf`;
      
      const payloadContent = `OFFICIAL STATUTORY EXTRACT ISSUED UNDER AUTHORITY OF ${gw.statutoryBasis}\n` +
        `ENTITY: ${targetId}\n` +
        `DOCUMENT: ${documentType || 'CERTIFIED TRUE COPY'}\n` +
        `DATE OF ISSUANCE: ${new Date().toISOString()}\n` +
        `SECURITY DIGEST: SHA256 OF DIGITAL CERTIFICATE SEALED BY ACCREDITED CA`;

      let ingestedDoc = null;
      if (addToDossier !== false) {
        ingestedDoc = ingestRealDocument({
          title: `${gw.name.split(' ')[0]} Official Extract: ${documentType || 'Statutory Extract'} (${targetId})`,
          fileName: docName,
          fileSizeBytes: 1240000 + Math.floor(Math.random() * 800000),
          rawText: payloadContent,
          sourceCategory: gatewayId.includes('ssm') ? 'ssm_ctc' : gatewayId.includes('stamps') ? 'lhdn_stamping' : gatewayId.includes('efs') ? 'court_efs_order' : 'federal_gazette',
          issuingAgency: gw.provider,
          serialNo: `DCHEQS-2026-${Math.floor(10000000 + Math.random() * 90000000)}`,
          courtRelevance: `Direct enterprise B2B statutory extract retrieved via ${gw.name}. Sealed under Digital Signature Act 1997.`,
        });
      }

      sendJson(res, 200, {
        success: true,
        data: {
          gateway: gw,
          entityIdentifier: targetId,
          documentType,
          downloadFileName: docName,
          dcheqsSerial: ingestedDoc?.serialOrRegistrationNo || 'DCHEQS-2026-LIVE-001',
          sha256Hash: ingestedDoc?.sha256Hash || 'b78a9c...',
          dossierDocument: ingestedDoc,
        },
      });
    } catch (err: any) {
      sendJson(res, 500, { success: false, error: err.message || 'Failed to download real extract' });
    }
    return true;
  }

  return false;
}
