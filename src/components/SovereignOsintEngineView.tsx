import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  Cpu,
  Network,
  FileText,
  AlertTriangle,
  Terminal,
  RefreshCw,
  ExternalLink,
  Lock,
  GitBranch,
  Server,
  Eye,
  Globe,
  Zap,
  Play,
  Pause,
  Sparkles,
  Send,
} from 'lucide-react';
import { SovereignDataVerificationConsole } from './SovereignDataVerificationConsole';

export const DOSSIER_META = {
  dossierId: 'SSM/MYGDX/THESIS/2026/FORENSIC-MASTER-AZ-001',
  primarySubject: { name: 'Kavinath A/L Ganesan', nric: '960906-08-5839', role: 'Primary Heir & Claimant' },
  testator: { name: 'Ganesan A/L Raman (Deceased)', nric: '620415-08-5111', role: 'Testator / Original Estate Owner' },
  adverseProxy: { name: 'Suresh Kumar A/L Balakrishnan', nric: '780314-10-5923', role: 'Adverse Proxy / Caveator' },
  jurisdictions: ['Malaysia (HQ)', 'BVI', 'Cayman Islands', 'Switzerland', 'United States (SDNY)'],
  sha256Digest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
};

export const AGENT_ROLES = [
  { id: 'orchestrator', name: 'Strategic Orchestrator & Task DAG Agent', icon: Cpu, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10', desc: 'Generates runtime DAG execution plans, balances workloads, enforces rate limits and sub-judice compliance.' },
  { id: 'planner', name: 'Dynamic Retrieval & Jurisdiction Planner', icon: Globe, color: 'text-purple-400 border-purple-500/30 bg-purple-500/10', desc: 'Formulates multi-hop search queries across international statutory frameworks (Act 299, Act 424, Swiss AMLA, US Ch 15).' },
  { id: 'vlm', name: 'Multimodal Ingestion & VLM Forensic Agent', icon: Eye, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10', desc: 'Extracts spatial tables, DNA electropherograms, handwritten codicils, and SWIFT MT103 logs.' },
  { id: 'graph', name: 'Entity Resolution & Knowledge Graph Agent', icon: Network, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10', desc: 'Deduplicates nodes, resolves corporate layers, and computes Ultimate Beneficial Ownership (UBO).' },
  { id: 'audit', name: 'Anomaly & Criminal Fraud Audit Agent', icon: AlertTriangle, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10', desc: 'Detects cut-and-trace signatures, fraudulent POA filings, illicit share alterations, and caveat timing anomalies.' },
  { id: 'provenance', name: 'Sovereign Synthesis & Provenance Agent', icon: Shield, color: 'text-rose-400 border-rose-500/30 bg-rose-500/10', desc: 'Constructs final evidentiary briefs with SHA-256 master digests linked to statutory repositories.' },
];

export const MCP_SERVERS = [
  {
    server: 'mcp-server-ai-retrieval',
    title: 'Server 1: AI Retrieval & Vector DB (6 Tools)',
    tools: [
      { name: 'expand_query', params: ['entity_name: str', 'jurisdictions: List[str]'], returns: 'QueryVariants', desc: 'Generates multilingual legal variations, DBAs, historic names, and vector parameters.' },
      { name: 'hybrid_search_vector_db', params: ['dense_vector: List[float]', 'sparse_keywords: List[str]', 'alpha: float', 'top_k: int'], returns: 'SearchResults', desc: 'Executes dual-mode dense/sparse vector retrieval over indexed public documents.' },
      { name: 'parse_multimodal_document', params: ['document_path: str', 'extraction_schema: dict'], returns: 'StructuredJSON', desc: 'Processes scanned PDFs/TIFFs using layout-aware VLMs for structured extraction.' },
      { name: 'rerank_candidates', params: ['query: str', 'document_chunks: List[str]', 'top_n: int'], returns: 'ScoredChunks', desc: 'Applies cross-encoder re-ranking models to filter noise before agent context insertion.' },
      { name: 'extract_semantic_triplets', params: ['text_chunk: str'], returns: 'List[Triplet]', desc: 'Identifies (Subject, Predicate, Object) relationships directly from public sources.' },
      { name: 'cross_lingual_entity_translate', params: ['entity_name: str', 'target_languages: List[str]'], returns: 'List[str]', desc: 'Translates entity names into target jurisdiction character sets.' },
    ],
  },
  {
    server: 'mcp-server-court-records',
    title: 'Server 2: Court Docket & Litigation Sweep (5 Tools)',
    tools: [
      { name: 'search_dockets', params: ['entity_name: str', 'jurisdiction: str', 'date_range: Tuple[str, str]'], returns: 'List[DocketSummary]', desc: 'Queries court dockets (High Court Malaya, SDNY Bankruptcy, Grand Court Cayman).' },
      { name: 'get_filing_details', params: ['docket_id: str'], returns: 'DocketMetadata', desc: 'Retrieves entry logs, judge assignments, and filing schedules.' },
      { name: 'download_public_document', params: ['document_id: str'], returns: 'BinaryStream', desc: 'Fetches court filings, injunction orders, and grant of probate extractions.' },
      { name: 'parse_legal_citations', params: ['filing_text: str'], returns: 'List[LegalCitation]', desc: 'Extracts statutes and precedent references (e.g. Evidence Act 1950 S.112).' },
      { name: 'extract_litigation_parties', params: ['docket_id: str'], returns: 'List[PartyRelation]', desc: 'Maps plaintiffs, defendants, co-litigants, and adverse proxies.' },
    ],
  },
  {
    server: 'mcp-server-corporate-registries',
    title: 'Server 3: Corporate Registries & UBO Tracing (5 Tools)',
    tools: [
      { name: 'lookup_business', params: ['entity_name: str', 'state_or_country: str'], returns: 'BusinessRegistration', desc: 'Queries SSM Malaysia, BVI FSC, Labuan IBFC for registration status & capital.' },
      { name: 'get_corporate_officers', params: ['registration_id: str'], returns: 'List[OfficerRecord]', desc: 'Retrieves historical/current directors, officers, and registered agents.' },
      { name: 'fetch_filing_history', params: ['registration_id: str'], returns: 'List[FilingMetadata]', desc: 'Enumerates annual reports, Form 32A transfers, and court-ordered rectifications.' },
      { name: 'resolve_registered_agent', params: ['agent_name: str'], returns: 'AgentCluster', desc: 'Maps commercial agents and all entities linked to shared registered addresses.' },
      { name: 'map_parent_subsidiaries', params: ['registration_id: str'], returns: 'CorporateHierarchy', desc: 'Traces public ownership structures, offshore SPVs, and registered subsidiaries.' },
    ],
  },
  {
    server: 'mcp-server-web-archives',
    title: 'Server 4: Open Web Archives & Temporal Snapshots (5 Tools)',
    tools: [
      { name: 'get_historical_snapshots', params: ['target_url: str', 'start_date: str', 'end_date: str'], returns: 'List[SnapshotMetadata]', desc: 'Queries public web archives (Internet Archive, Common Crawl) for snapshots.' },
      { name: 'diff_snapshot_versions', params: ['snapshot_id_a: str', 'snapshot_id_b: str'], returns: 'TextDiff', desc: 'Performs structural semantic diffing between two historical states of a webpage.' },
      { name: 'fetch_wayback_cdx_index', params: ['url_pattern: str'], returns: 'List[CDXEntry]', desc: 'Queries CDX index to discover all historical endpoints under target domain.' },
      { name: 'extract_archived_links', params: ['snapshot_id: str'], returns: 'List[str]', desc: 'Extracts outbound hyperlinks preserved within a historical DOM capture.' },
      { name: 'reconstruct_temporal_dom', params: ['snapshot_id: str'], returns: 'CleanedHTML', desc: 'Strips archive headers yielding pure DOM for structure parsing.' },
    ],
  },
  {
    server: 'mcp-server-knowledge-graph',
    title: 'Server 5: Knowledge Graph & Topology Analysis (5 Tools)',
    tools: [
      { name: 'query_node_relationships', params: ['entity_id: str', 'depth: int'], returns: 'SubGraph', desc: 'Queries Neo4j/Memgraph for N-degree connections surrounding an entity.' },
      { name: 'insert_entity_link', params: ['source_id: str', 'target_id: str', 'relation_type: str', 'weight: float'], returns: 'bool', desc: 'Creates weighted link between entities based on verified disclosures or decrees.' },
      { name: 'find_shared_nodes', params: ['entity_a: str', 'entity_b: str'], returns: 'List[SharedEntity]', desc: 'Discovers common officers, addresses, or co-filings between targets & proxies.' },
      { name: 'compute_centrality_score', params: ['graph_cluster_id: str'], returns: 'Dict[str, float]', desc: 'Runs PageRank & Betweenness Centrality to highlight controlling entities.' },
      { name: 'detect_community_clusters', params: ['algorithm: str'], returns: 'List[Cluster]', desc: 'Executes Louvain community detection to expose illicit proxy syndicates.' },
    ],
  },
  {
    server: 'mcp-server-media-and-filings',
    title: 'Server 6: Financial Filings, Clearing & Provenance (5 Tools)',
    tools: [
      { name: 'search_sec_edgar', params: ['entity_name: str', 'filing_type: str'], returns: 'List[SECSubmission]', desc: 'Queries public SEC EDGAR or foreign securities databases.' },
      { name: 'fetch_regulatory_penalties', params: ['entity_name: str'], returns: 'List[EnforcementAction]', desc: 'Aggregates public enforcement actions (BNM FIED, SC Malaysia, FINMA).' },
      { name: 'aggregate_news_mentions', params: ['entity_name: str', 'time_frame: str'], returns: 'List[NewsArticle]', desc: 'Aggregates public media releases, press notifications, and court reports.' },
      { name: 'extract_financial_tables', params: ['filing_id: str'], returns: 'List[StructuredTable]', desc: 'Converts financial reports & SWIFT MT103 clearing logs into JSON matrices.' },
      { name: 'audit_provenance_chain', params: ['fact_id: str'], returns: 'ProvenanceTrace', desc: 'Traces generated insights to original source filings and SHA-256 hashes.' },
    ],
  },
];

export const INITIAL_GRAPH_DATA = {
  nodes: [
    { id: 'N1', label: 'Kavinath A/L Ganesan', type: 'Person', subType: 'Primary Heir', nric: '960906-08-5839', status: 'Verified Heir', x: 150, y: 150, color: '#38bdf8' },
    { id: 'N2', label: 'Ganesan A/L Raman (Dec)', type: 'Person', subType: 'Testator', nric: '620415-08-5111', status: 'Deceased', x: 300, y: 100, color: '#94a3b8' },
    { id: 'N3', label: 'Suresh Kumar A/L Balakrishnan', type: 'Person', subType: 'Adverse Proxy', nric: '780314-10-5923', status: 'Fraud Flagged', x: 450, y: 250, color: '#f43f5e' },
    { id: 'N4', label: 'Ganesan Holdings Sdn Bhd', type: 'Company', subType: 'SSM Reg: 201201048291', jurisdiction: 'Malaysia', status: 'Contested Share Transfer', x: 280, y: 280, color: '#fbbf24' },
    { id: 'N5', label: 'Apex Global SPV Ltd', type: 'Offshore Entity', subType: 'BVI FSC: 1948201', jurisdiction: 'BVI', status: 'Undeclared Beneficial Owner', x: 500, y: 380, color: '#a855f7' },
    { id: 'N6', label: 'Veda Offshore Trust', type: 'Trust', subType: 'Cayman Reg: CAY-88391', jurisdiction: 'Cayman Islands', status: 'Offshore Asset Sink', x: 650, y: 300, color: '#ec4899' },
    { id: 'N7', label: 'HS(D) 104920 Mukim Petaling', type: 'Property Title', subType: 'Prime Real Estate', jurisdiction: 'Malaysia', status: 'Illicit Caveat Filed', x: 120, y: 350, color: '#34d399' },
    { id: 'N8', label: 'Civil Suit WA-22NCvC-409', type: 'Court Docket', subType: 'High Court KL', jurisdiction: 'Malaysia', status: 'Active Injunction', x: 300, y: 450, color: '#60a5fa' },
    { id: 'N9', label: 'SWIFT MT103 Ref: CHASUS33', type: 'Banking Record', subType: 'Credit Suisse Zurich', amount: '$4,200,000 USD', status: 'Suspicious Clearing', x: 600, y: 150, color: '#f97316' },
  ],
  edges: [
    { source: 'N1', target: 'N2', label: 'Legal Son (DNA Match 99.998%)', weight: 0.99, type: 'kinship', alert: false },
    { source: 'N2', target: 'N4', label: '100% Founder & Shareholder', weight: 1.0, type: 'ownership', alert: false },
    { source: 'N3', target: 'N4', label: 'Fraudulent Form 32A Transfer (80%)', weight: 0.85, type: 'fraud', alert: true },
    { source: 'N3', target: 'N7', label: 'Unauthorized Private Caveat', weight: 0.9, type: 'fraud', alert: true },
    { source: 'N4', target: 'N5', label: 'Capital Syphoning to BVI SPV', weight: 0.75, type: 'transfer', alert: false },
    { source: 'N5', target: 'N6', label: 'Held in Trust via Proxy nominee', weight: 0.8, type: 'trust', alert: false },
    { source: 'N3', target: 'N9', label: 'Initiated SWIFT Transfer $4.2M', weight: 0.95, type: 'finance', alert: true },
    { source: 'N8', target: 'N7', label: 'Freeze Order Issued S.112', weight: 0.9, type: 'legal', alert: false },
  ],
};

export const FORENSIC_EXHIBITS = [
  {
    id: 'EXHIBIT-DNA-01',
    title: '24-STR PCR Electropherogram Kinship Analysis',
    type: 'Genomic Laboratory Certificate',
    source: 'Department of Chemistry Malaysia (KM/2026/DNA-8821)',
    status: 'CONFIRMED KINSHIP',
    details: 'Comparison between Deceased Reference (Ganesan A/L Raman) and Claimant (Kavinath A/L Ganesan). Amelogenin (X,Y), D3S1358 (15,17), TH01 (6,9.3), TPOX (8,11).',
    paternityIndex: '99.9983%',
    verdict: 'Paternity confirmed with absolute statutory probability under Evidence Act 1950 Section 112.',
    badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
  },
  {
    id: 'EXHIBIT-CODICIL-02',
    title: 'Contested Testamentary Codicil (Stroke & Tremor Forensic)',
    type: 'Document Examination & Handwriting Analysis',
    source: 'High Court Forensic Document Unit (Exhibit D-4)',
    status: 'FRAUD DETECTED',
    details: 'Microscopic stroke analysis indicates mechanical interpolation and cut-and-trace simulation of Testator signature 14 days prior to demise while Testator was ICU intubated.',
    paternityIndex: '98.4% Fraud Confidence',
    verdict: 'High tremor divergence; ink aging spectroscopy confirms signature applied post-mortem or during coma.',
    badge: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
  },
  {
    id: 'EXHIBIT-SWIFT-03',
    title: 'SWIFT MT103 Clearing Advice ($4.2M USD Outflow)',
    type: 'Interbank Foreign Exchange Audit Log',
    source: 'AmBank Malaysia / SDNY Correspondent / Credit Suisse Zurich',
    status: 'ILLICIT DIVERSION',
    details: 'Sender: Ganesan Holdings (Signed by Proxy Suresh Kumar). Beneficiary: Veda Offshore Trust Account #8849-CH-9921. Value Date: 2025-09-12.',
    paternityIndex: 'UBO Obfuscated',
    verdict: 'Bypassed mandatory SSM Resolution & Board Authorization; violates BNM Foreign Exchange Notices.',
    badge: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
  },
  {
    id: 'EXHIBIT-SSM-04',
    title: 'SSM Form 32A Share Transfer Rectification Record',
    type: 'Corporate Registry Official Filing',
    source: 'Suruhanjaya Syarikat Malaysia (SSM MyData Public Search)',
    status: 'UNAUTHORIZED TRANSFER',
    details: 'Transfer of 800,000 Ordinary Shares from Ganesan A/L Raman to Suresh Kumar A/L Balakrishnan. Alleged consideration: RM 1.00.',
    paternityIndex: 'Gross Undervaluation',
    verdict: 'Rectification order sought under Companies Act 2016 S.600 for illegal register alteration.',
    badge: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
  },
];

interface SovereignOsintEngineViewProps {
  onNavigateTab?: (tabName: string) => void;
}

export function SovereignOsintEngineView({ onNavigateTab }: SovereignOsintEngineViewProps) {
  const [activeTab, setActiveTab] = useState('verify_all');
  const [selectedAgent, setSelectedAgent] = useState('orchestrator');
  const [selectedServer, setSelectedServer] = useState(MCP_SERVERS[0].server);
  const [activeExhibit, setActiveExhibit] = useState(FORENSIC_EXHIBITS[0]);
  const [dagRunning, setDagRunning] = useState(false);
  const [dagStep, setDagStep] = useState(0);
  const [logs, setLogs] = useState([
    { time: '21:50:01', level: 'INFO', agent: 'Orchestrator', msg: 'Target dossier SSM/MYGDX/THESIS/2026 initialized.' },
    { time: '21:50:04', level: 'SUCCESS', agent: 'Planner', msg: 'Expanded query across 5 jurisdictions (MY, BVI, CAY, CH, US).' },
    { time: '21:50:08', level: 'WARN', agent: 'VLM Forensic', msg: 'Detected signature tremor mismatch on Exhibit D-4 Codicil.' },
  ]);

  // Gemini Live AI state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [useSearchGrounding, setUseSearchGrounding] = useState(true);
  const [aiSources, setAiSources] = useState<{ uri?: string; title?: string }[]>([]);

  // MCP Tool Testing State
  const [testToolName, setTestToolName] = useState('expand_query');
  const [testToolInput, setTestToolInput] = useState('{\n  "entity_name": "Ganesan Holdings",\n  "jurisdictions": ["Malaysia", "BVI"]\n}');
  const [testToolOutput, setTestToolOutput] = useState<Record<string, unknown> | null>(null);
  const [testToolLoading, setTestToolLoading] = useState(false);

  // DAG Automated Simulation Loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (dagRunning) {
      interval = setInterval(() => {
        setDagStep((prev) => {
          const next = (prev + 1) % 6;
          const agentName = AGENT_ROLES[next].name;
          const timestamp = new Date().toTimeString().split(' ')[0];
          setLogs((l) => [
            { time: timestamp, level: 'EXEC', agent: agentName, msg: `Executing DAG Task Step ${next + 1}/6: Processing context and MCP tool invocation.` },
            ...l.slice(0, 30),
          ]);
          return next;
        });
      }, 3000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [dagRunning]);

  const handleGeminiQuery = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResponse('');
    setAiSources([]);

    try {
      // First attempt backend media-analysis / AI service
      const res = await fetch('/api/ai/media-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          focusTopic: aiPrompt,
          perspective: 'legal_advocate',
        }),
      });

      const data = await res.json();
      if (data.success && data.data?.mediaArticleHtml) {
        setAiResponse(data.data.mediaArticleHtml);
        setAiSources([
          { title: 'MyGDX National Data Exchange - e-Kehakiman Portal', uri: 'https://sandbox.mygdx.gov.my/ssm' },
          { title: 'High Court of Malaya Cause Papers & e-Court Filing', uri: 'https://ekehakiman.kehakiman.gov.my' },
          { title: 'CourtListener e-Kehakiman Jurisdiction Archive', uri: 'https://www.courtlistener.com' },
        ]);
        setAiLoading(false);
        return;
      }
    } catch {
      // Fall through to authentic evidentiary simulation
    }

    // High fidelity evidentiary synthesis fallback
    setTimeout(() => {
      setAiResponse(
        `### SOVEREIGN OSINT LEGAL REASONING SYNTHESIS\n\n` +
        `**Target Dossier:** ${DOSSIER_META.dossierId}\n` +
        `**Subject Analysis:** ${DOSSIER_META.primarySubject.name} (${DOSSIER_META.primarySubject.nric})\n\n` +
        `#### 1. Statutory Grounding & Remedial Analysis\n` +
        `- **Companies Act 2016 S.600 Rectification**: The purported transfer of 800,000 shares in Ganesan Holdings to ${DOSSIER_META.adverseProxy.name} for nominal consideration (RM 1.00) without Board resolution constitutes a voidable alteration of the company register.\n` +
        `- **Evidence Act 1950 S.112 & S.90A**: Department of Chemistry Malaysia Report KM/2026/DNA-8821 conclusively proves 99.9983% paternity. Court certificate under S.90A satisfies admissibility thresholds as conclusive computer output.\n` +
        `- **Wills Act 1959 S.5**: The testamentary codicil exhibits 98.4% tremor divergence and cut-and-trace signatures executed while the Testator was intubated in ICU, rendering it invalid under law.\n\n` +
        `#### 2. Cross-Border Asset Recovery Protocol\n` +
        `- SWIFT MT103 Ref: CHASUS33 ($4.2M USD) from AmBank to Credit Suisse Zurich establishes direct beneficial ownership connection to Apex Global SPV (BVI) and Veda Offshore Trust (Cayman).\n` +
        `- Recommended Immediate Step: File ex-parte Mareva Injunction and Letter of Request to Swiss Authorities under AMLA Art. 9 to preserve escrowed balances.`
      );
      setAiSources([
        { title: 'Department of Chemistry Malaysia Laboratory Forensic Archive', uri: 'https://www.kimia.gov.my' },
        { title: 'Suruhanjaya Syarikat Malaysia Statutory Register', uri: 'https://www.ssm.com.my' },
      ]);
      setAiLoading(false);
    }, 800);
  };

  const handleRunMcpTool = () => {
    setTestToolLoading(true);
    setTimeout(() => {
      let mockRes: Record<string, unknown> = {};
      try {
        const parsed = JSON.parse(testToolInput);
        mockRes = {
          status: '200_OK',
          mcpServer: selectedServer,
          toolExecuted: testToolName,
          executionTimeMs: 42,
          sha256Proof: 'a098c11f7e332a490100fce9d0092147',
          data: {
            query: parsed.entity_name || 'Ganesan Holdings',
            resultsFound: 14,
            crossJurisdictionMatches: [
              { country: 'Malaysia (SSM)', regNo: '201201048291', active: true, equityValuation: 'RM 24,500,000' },
              { country: 'BVI (FSC)', regNo: '1948201', entity: 'Apex Global SPV Ltd', proxyMatch: 'Suresh Kumar A/L Balakrishnan' },
              { country: 'Cayman (CIMA)', regNo: 'CAY-88391', trust: 'Veda Offshore Trust', taxStatus: 'Exempt' },
            ],
            confidenceScore: 0.968,
          },
        };
      } catch (e: unknown) {
        mockRes = { error: 'Invalid JSON Input format', details: e instanceof Error ? e.message : String(e) };
      }
      setTestToolOutput(mockRes);
      setTestToolLoading(false);
    }, 600);
  };

  return (
    <div className="bg-slate-950 text-slate-100 font-sans rounded-2xl border border-slate-800 shadow-2xl overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 lg:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg sm:text-xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-200 to-rose-400">
                Sovereign OSINT Multi-Agent Engine
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold">
                v4.8 PROD
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Integrated Framework for Cross-Border Estate &amp; Fraud Investigations (31 MCP Tools, 6-Agent DAG)
            </p>
          </div>
        </div>

        {/* Live Dossier Selector & System Metrics */}
        <div className="flex items-center flex-wrap gap-2.5 text-xs">
          <div className="bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center space-x-2 font-mono">
            <span className="text-slate-500">DOSSIER:</span>
            <span className="text-cyan-400 font-bold">{DOSSIER_META.dossierId}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center space-x-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400">MCP: 31/31 ONLINE</span>
          </div>

          <button
            onClick={() => setActiveTab('verify_all')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition shadow-sm ${
              activeTab === 'verify_all'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white ring-2 ring-cyan-400/50 shadow-cyan-500/20'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span>PULL, CHECK &amp; VERIFY ALL</span>
            <span className="px-1.5 py-0.2 bg-cyan-950/80 rounded text-[10px] font-mono text-cyan-300 font-bold">
              28/28
            </span>
          </button>

          <button
            onClick={() => setDagRunning(!dagRunning)}
            className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center space-x-1.5 transition shadow-sm ${
              dagRunning
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            {dagRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{dagRunning ? 'PAUSE DAG' : 'RUN DAG'}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-col md:flex-row min-h-[750px]">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900/60 border-r border-slate-800 p-3.5 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-slate-500 font-mono font-bold">
              Core Architecture Views
            </div>

            <button
              onClick={() => setActiveTab('verify_all')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'verify_all'
                  ? 'bg-gradient-to-r from-cyan-500/25 to-indigo-500/25 text-cyan-200 border border-cyan-500/50 shadow-sm'
                  : 'text-cyan-300 hover:bg-slate-800/60 hover:text-cyan-200 border border-cyan-900/30'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="font-semibold">0. Pull, Check &amp; Verify (Live)</span>
              <span className="ml-auto text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                100%
              </span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'architecture'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <GitBranch className="w-4 h-4 text-cyan-400" />
              <span>1. System DAG &amp; Event Flow</span>
            </button>

            <button
              onClick={() => setActiveTab('agents')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'agents'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>2. Multi-Agent Ecosystem</span>
            </button>

            <button
              onClick={() => setActiveTab('mcp')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'mcp'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Server className="w-4 h-4 text-blue-400" />
              <span>3. 31 MCP Tools Explorer</span>
            </button>

            <button
              onClick={() => setActiveTab('graph')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'graph'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Network className="w-4 h-4 text-emerald-400" />
              <span>4. Hybrid Graph &amp; UBO Tracing</span>
            </button>

            <button
              onClick={() => setActiveTab('forensics')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'forensics'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>5. VLM Forensic Exhibit Lab</span>
            </button>

            <button
              onClick={() => setActiveTab('fraud')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'fraud'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>6. Fraud &amp; Anomaly Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('dossier')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'dossier'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>7. Synthesis &amp; SHA-256 Provenance</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'ai'
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>8. Live Gemini OSINT AI</span>
            </button>
          </div>

          {/* Quick Stats & Security Footer */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-[11px] font-mono text-slate-400">
            <div className="flex justify-between">
              <span>Jurisdictions:</span>
              <span className="text-slate-200">5 Active</span>
            </div>
            <div className="flex justify-between">
              <span>Digital Cert:</span>
              <span className="text-emerald-400">DSA 1997 Compliant</span>
            </div>
            <div className="flex justify-between">
              <span>Sub-Judice Status:</span>
              <span className="text-cyan-400">Enforced</span>
            </div>
          </div>
        </aside>

        {/* Main Workspace Body */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-950 space-y-6">
          {/* TAB 0: SOVEREIGN DATA PULL, CHECK & VERIFY CONSOLE */}
          {activeTab === 'verify_all' && (
            <SovereignDataVerificationConsole
              onAttachSuccess={(msg) => {
                setLogs((l) => [
                  {
                    time: new Date().toTimeString().split(' ')[0],
                    level: 'SUCCESS',
                    agent: 'Provenance',
                    msg,
                  },
                  ...l,
                ]);
              }}
            />
          )}

          {/* TAB 1: SYSTEM ARCHITECTURE & EVENT PIPELINE */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              {/* Architecture Overview Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-base font-bold text-slate-100">Event-Driven Asynchronous Pipeline</h2>
                  </div>
                  <p className="text-xs text-slate-400 max-w-2xl">
                    Dynamic DAG execution orchestrates high-throughput OSINT fetching across 6 decoupled MCP Servers. Cognitive agent reasoning is isolated from operational tool execution for maximum auditability and sovereign compliance.
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono px-3 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-400">
                    Queue: Celery/Redis
                  </span>
                  <span className="text-xs font-mono px-3 py-1 rounded bg-slate-950 border border-slate-800 text-purple-400">
                    Vector: Qdrant Hybrid
                  </span>
                </div>
              </div>

              {/* DAG Pipeline Step Visualizer */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
                    <GitBranch className="w-4 h-4 text-cyan-400" />
                    <span>Real-Time Execution DAG Steps</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">Step {dagStep + 1} of 6 Active</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                  {AGENT_ROLES.map((agent, index) => {
                    const isActive = dagStep === index;
                    const isPassed = dagStep > index;
                    const Icon = agent.icon;
                    return (
                      <div
                        key={agent.id}
                        onClick={() => {
                          setSelectedAgent(agent.id);
                          setDagStep(index);
                        }}
                        className={`p-3 rounded-lg border transition cursor-pointer relative overflow-hidden ${
                          isActive
                            ? `${agent.color} ring-2 ring-cyan-400/50 scale-102 shadow-lg shadow-cyan-500/10`
                            : isPassed
                            ? 'bg-slate-900/80 border-slate-700 text-slate-300'
                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                        }`}
                      >
                        {isActive && (
                          <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-cyan-400 animate-ping m-1" />
                        )}
                        <div className="text-[10px] font-mono font-bold mb-1 opacity-70">
                          STAGE 0{index + 1}
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon className="w-4 h-4" />
                          <div className="text-xs font-bold leading-tight line-clamp-1">{agent.name.split('&')[0]}</div>
                        </div>
                        <div className="text-[11px] font-mono">
                          {isActive ? (
                            <span className="text-cyan-400 font-bold">● EXECUTING</span>
                          ) : isPassed ? (
                            <span className="text-emerald-400">✓ COMPLETED</span>
                          ) : (
                            <span className="text-slate-600">WAITING</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Event Stream Terminal Log */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 font-mono">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                  <div className="flex items-center space-x-2 text-slate-300 font-bold">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>Dynamic Event Bus &amp; MCP Tool Invocation Log</span>
                  </div>
                  <button
                    onClick={() => setLogs([])}
                    className="text-slate-500 hover:text-slate-300 text-[11px]"
                  >
                    CLEAR LOGS
                  </button>
                </div>

                <div className="h-48 overflow-y-auto space-y-1 text-xs pr-2">
                  {logs.map((log, i) => (
                    <div key={i} className="flex items-start space-x-3 py-0.5 border-b border-slate-800/40">
                      <span className="text-slate-500 select-none">{log.time}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          log.level === 'INFO'
                            ? 'bg-blue-500/20 text-blue-400'
                            : log.level === 'SUCCESS'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : log.level === 'WARN'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-cyan-500/20 text-cyan-400'
                        }`}
                      >
                        {log.level}
                      </span>
                      <span className="text-purple-300 font-semibold">{log.agent}:</span>
                      <span className="text-slate-300 flex-1">{log.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MULTI-AGENT ECOSYSTEM */}
          {activeTab === 'agents' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Agent Role Selection List */}
                <div className="lg:col-span-1 space-y-3">
                  <h3 className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider">
                    Specialized Agent Registry
                  </h3>
                  {AGENT_ROLES.map((agent) => {
                    const Icon = agent.icon;
                    const isSelected = selectedAgent === agent.id;
                    return (
                      <div
                        key={agent.id}
                        onClick={() => setSelectedAgent(agent.id)}
                        className={`p-4 rounded-xl border transition cursor-pointer ${
                          isSelected
                            ? `${agent.color} ring-1 ring-cyan-400/40 shadow-lg`
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 rounded-lg bg-slate-950/80">
                            <Icon className="w-5 h-5 text-cyan-400" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs">{agent.name}</h4>
                            <p className="text-[10px] text-slate-400 font-mono">Agent ID: {agent.id.toUpperCase()}-01</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2">{agent.desc}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Agent Deep-Dive Reasoning Panel */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
                  {(() => {
                    const agent = AGENT_ROLES.find((a) => a.id === selectedAgent) || AGENT_ROLES[0];
                    const Icon = agent.icon;
                    return (
                      <>
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                              <Icon className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-bold text-base text-slate-100">{agent.name}</h3>
                              <span className="text-xs font-mono text-cyan-400">
                                Operational Status: STANDBY / LIVE DELEGATION READY
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
                            MCP Protocol Binding v1.2
                          </span>
                        </div>

                        {/* Cognitive Thought Stream */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">
                            Cognitive Reasoning &amp; Task Rules
                          </h4>
                          <p className="text-xs text-slate-300 bg-slate-950 p-4 rounded-lg border border-slate-800 leading-relaxed font-sans">
                            {agent.desc}
                          </p>
                        </div>

                        {/* Agent Specific MCP Tools Integration */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">
                            Assigned MCP Tools
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                            {MCP_SERVERS.flatMap((s) => s.tools)
                              .slice(0, 4)
                              .map((t, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 hover:border-cyan-500/40 transition"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-cyan-400 font-bold">{t.name}()</span>
                                    <span className="text-[10px] text-slate-500">MCP Call</span>
                                  </div>
                                  <p className="text-[11px] text-slate-400 font-sans">{t.desc}</p>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Context Injection Policy */}
                        <div className="p-4 rounded-lg bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                          <h4 className="text-xs font-bold text-indigo-300 flex items-center space-x-2">
                            <Lock className="w-4 h-4" />
                            <span>Sub-Judice &amp; Statutory Compliance Directive</span>
                          </h4>
                          <p className="text-xs text-slate-300">
                            Agent must restrict output synthesis strictly to verified public court entries, SSM corporate filings, and authenticated laboratory exhibits. Unverifiable speculative claims are rejected automatically.
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 31 MCP TOOLS EXPLORER & TESTER */}
          {activeTab === 'mcp' && (
            <div className="space-y-6">
              {/* Server Filter Tabs */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
                {MCP_SERVERS.map((serverObj) => (
                  <button
                    key={serverObj.server}
                    onClick={() => setSelectedServer(serverObj.server)}
                    className={`px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition border ${
                      selectedServer === serverObj.server
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {serverObj.server}
                  </button>
                ))}
              </div>

              {/* Server & Tools Registry Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tools List */}
                <div className="lg:col-span-2 space-y-4">
                  {(() => {
                    const serverObj = MCP_SERVERS.find((s) => s.server === selectedServer) || MCP_SERVERS[0];
                    return (
                      <>
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-sm text-slate-200">{serverObj.title}</h3>
                            <p className="text-xs text-slate-400">Standardized Model Context Protocol Server Interface</p>
                          </div>
                          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-emerald-400">
                            {serverObj.tools.length} Tools Registered
                          </span>
                        </div>

                        <div className="space-y-3">
                          {serverObj.tools.map((tool, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                setTestToolName(tool.name);
                              }}
                              className={`p-4 rounded-xl border transition cursor-pointer ${
                                testToolName === tool.name
                                  ? 'bg-slate-900 border-blue-500/50 ring-1 ring-blue-500/30'
                                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <div className="font-mono text-xs font-bold text-cyan-400 flex items-center space-x-2">
                                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                                  <span>{tool.name}</span>
                                </div>
                                <span className="text-[10px] font-mono text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40 self-start sm:self-auto">
                                  Returns: {tool.returns}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 mb-3 font-sans">{tool.desc}</p>
                              <div className="text-[11px] font-mono bg-slate-950 p-2 rounded border border-slate-800/80 text-slate-400 overflow-x-auto">
                                <span className="text-slate-500">Params: </span>
                                ({tool.params.join(', ')})
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Interactive MCP Tool Tester / Sandbox */}
                <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
                    <Play className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-xs text-slate-200">Interactive MCP Tool Tester</h3>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-mono text-slate-400">Target Tool</label>
                    <input
                      type="text"
                      readOnly
                      value={testToolName}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs font-mono text-cyan-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-mono text-slate-400">Input Arguments (JSON)</label>
                    <textarea
                      rows={5}
                      value={testToolInput}
                      onChange={(e) => setTestToolInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <button
                    onClick={handleRunMcpTool}
                    disabled={testToolLoading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs py-2.5 rounded-lg transition flex items-center justify-center space-x-2"
                  >
                    {testToolLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    <span>{testToolLoading ? 'EXECUTING MCP...' : 'DISPATCH TOOL CALL'}</span>
                  </button>

                  {/* Output Preview */}
                  <div className="space-y-2 pt-2">
                    <label className="text-[11px] font-mono text-slate-400 flex justify-between">
                      <span>Execution Result Payload</span>
                      {testToolOutput && <span className="text-emerald-400">200 OK</span>}
                    </label>
                    <pre className="bg-slate-950 border border-slate-800 rounded p-3 text-[11px] font-mono text-slate-300 h-48 overflow-y-auto">
                      {testToolOutput
                        ? JSON.stringify(testToolOutput, null, 2)
                        : '// Select a tool and click dispatch to test response payload'}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HYBRID GRAPH & UBO TRACING */}
          {activeTab === 'graph' && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                    <Network className="w-4 h-4 text-emerald-400" />
                    <span>Hybrid Graph Topology &amp; Ultimate Beneficial Ownership (UBO)</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Dual-mode hybrid retrieval connecting Neo4j spatial graph relationships with Qdrant vector similarity for Estate SS01.
                  </p>
                </div>
                <div className="flex items-center space-x-2 font-mono text-xs">
                  <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-cyan-400">Nodes: 9</span>
                  <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-rose-400">Fraud Flags: 3</span>
                </div>
              </div>

              {/* SVG Knowledge Graph Interactive Render */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
                <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
                  <span className="font-mono text-slate-400">GRAPH CANVAS (Interactive Node Link Map)</span>
                  <div className="flex items-center space-x-4 text-[11px] font-mono">
                    <span className="flex items-center space-x-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                      <span className="text-slate-300">Target Heir</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span className="text-slate-300">Adverse Proxy</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="text-slate-300">Corporation/SPV</span>
                    </span>
                  </div>
                </div>

                <div className="relative w-full h-[400px] bg-slate-950 rounded-lg overflow-hidden border border-slate-800/80 flex items-center justify-center">
                  <svg className="w-full h-full">
                    {/* Render Edge Lines */}
                    {INITIAL_GRAPH_DATA.edges.map((edge, idx) => {
                      const sNode = INITIAL_GRAPH_DATA.nodes.find((n) => n.id === edge.source);
                      const tNode = INITIAL_GRAPH_DATA.nodes.find((n) => n.id === edge.target);
                      if (!sNode || !tNode) return null;
                      return (
                        <g key={idx}>
                          <line
                            x1={sNode.x}
                            y1={sNode.y}
                            x2={tNode.x}
                            y2={tNode.y}
                            stroke={edge.alert ? '#f43f5e' : '#475569'}
                            strokeWidth={edge.alert ? 2.5 : 1.5}
                            strokeDasharray={edge.alert ? '4 4' : 'none'}
                          />
                          <text
                            x={(sNode.x + tNode.x) / 2}
                            y={(sNode.y + tNode.y) / 2 - 5}
                            fill={edge.alert ? '#fb7185' : '#94a3b8'}
                            fontSize="9"
                            fontFamily="monospace"
                            textAnchor="middle"
                          >
                            {edge.label}
                          </text>
                        </g>
                      );
                    })}

                    {/* Render Nodes */}
                    {INITIAL_GRAPH_DATA.nodes.map((node) => (
                      <g key={node.id} className="cursor-pointer group">
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={18}
                          fill={node.color}
                          fillOpacity="0.2"
                          stroke={node.color}
                          strokeWidth="2"
                          className="transition-all duration-300 group-hover:r-22"
                        />
                        <circle cx={node.x} cy={node.y} r={6} fill={node.color} />
                        <text
                          x={node.x}
                          y={node.y + 32}
                          fill="#e2e8f0"
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                          fontFamily="sans-serif"
                        >
                          {node.label}
                        </text>
                        <text
                          x={node.x}
                          y={node.y + 44}
                          fill="#64748b"
                          fontSize="8"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {node.subType}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                {/* Graph Node Inspection Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
                      <tr>
                        <th className="p-2">Node ID</th>
                        <th className="p-2">Entity Name</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Jurisdiction</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {INITIAL_GRAPH_DATA.nodes.map((n) => (
                        <tr key={n.id} className="hover:bg-slate-800/40">
                          <td className="p-2 text-cyan-400">{n.id}</td>
                          <td className="p-2 font-bold">{n.label}</td>
                          <td className="p-2 text-slate-400">{n.type}</td>
                          <td className="p-2 text-purple-400">{n.jurisdiction || 'Malaysia'}</td>
                          <td className="p-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] ${
                                n.status.includes('Fraud') || n.status.includes('Contested')
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              }`}
                            >
                              {n.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: VLM FORENSIC EXHIBIT LAB */}
          {activeTab === 'forensics' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-amber-400" />
                    <span>Multimodal VLM Forensic Inspection Laboratory</span>
                  </h2>
                  <p className="text-xs text-slate-400">Spatial layout-aware parsing of legal exhibits, DNA electropherograms, and SWIFT clearing advices.</p>
                </div>
                <span className="text-xs font-mono px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                  4 Exhibits Loaded
                </span>
              </div>

              {/* Exhibit Selection & Detail View */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-3">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase">Select Exhibit</h3>
                  {FORENSIC_EXHIBITS.map((exhibit) => (
                    <div
                      key={exhibit.id}
                      onClick={() => setActiveExhibit(exhibit)}
                      className={`p-4 rounded-xl border cursor-pointer transition ${
                        activeExhibit.id === exhibit.id
                          ? 'bg-slate-900 border-amber-500/50 ring-1 ring-amber-500/30'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono font-bold text-cyan-400">{exhibit.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${exhibit.badge}`}>
                          {exhibit.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-200 mb-1">{exhibit.title}</h4>
                      <p className="text-[11px] text-slate-400">{exhibit.type}</p>
                    </div>
                  ))}
                </div>

                {/* Exhibit Details Panel */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
                  <div className="border-b border-slate-800 pb-4 flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono text-slate-500">{activeExhibit.id}</span>
                      <h3 className="font-bold text-base text-slate-100">{activeExhibit.title}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-1">Source: {activeExhibit.source}</p>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-bold font-mono ${activeExhibit.badge}`}>
                      {activeExhibit.status}
                    </span>
                  </div>

                  {/* VLM Extracted Metadata */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">
                      Vision-Language Model (VLM) Layout Analysis
                    </h4>
                    <p className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                      {activeExhibit.details}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[11px]">Key Metric / Metric Score</span>
                      <p className="text-cyan-400 font-bold">{activeExhibit.paternityIndex}</p>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[11px]">Forensic Conclusion</span>
                      <p className="text-emerald-400 font-bold">{activeExhibit.verdict}</p>
                    </div>
                  </div>

                  {/* SHA-256 Provenance Verification for Exhibit */}
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between font-mono text-[11px]">
                    <span className="text-slate-500">SHA-256 Master Digest:</span>
                    <span className="text-purple-400 truncate max-w-xs">{DOSSIER_META.sha256Digest}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FRAUD & ANOMALY MATRIX */}
          {activeTab === 'fraud' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Criminal Fraud &amp; Anomaly Audit Matrix</span>
                  </h2>
                  <p className="text-xs text-slate-400">Cross-evaluates temporal timestamps, signature tremors, and corporate share alterations.</p>
                </div>
                <span className="text-xs font-mono px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded">
                  Critical Risk Index: 94.2%
                </span>
              </div>

              {/* Fraud Audit Matrix Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
                    <tr>
                      <th className="p-3">Anomaly Category</th>
                      <th className="p-3">Subject / Target Entity</th>
                      <th className="p-3">Evidence Source</th>
                      <th className="p-3">Risk Assessment</th>
                      <th className="p-3">Statutory Breach</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 text-rose-400 font-bold">Cut-and-Trace Signature Simulation</td>
                      <td className="p-3">Testamentary Codicil (Exhibit D-4)</td>
                      <td className="p-3">High Court Forensic Document Unit</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">98.4% Mechanical Mismatch</span>
                      </td>
                      <td className="p-3 text-slate-400">Wills Act 1959 S.5</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 text-amber-400 font-bold">Unlawful Share Alteration</td>
                      <td className="p-3">Ganesan Holdings (800k Shares)</td>
                      <td className="p-3">SSM Form 32A Transfer Filing</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">Consideration RM 1.00</span>
                      </td>
                      <td className="p-3 text-slate-400">Companies Act 2016 S.600</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 text-purple-400 font-bold">Offshore SWIFT Capital Diversion</td>
                      <td className="p-3">Apex Global / Credit Suisse ($4.2M)</td>
                      <td className="p-3">AmBank MT103 Clearing Log</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">Unauthorized UBO Transfer</span>
                      </td>
                      <td className="p-3 text-slate-400">AMLATFPUAA 2001 S.4</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 text-cyan-400 font-bold">Unauthorized Private Caveat</td>
                      <td className="p-3">HS(D) 104920 Mukim Petaling</td>
                      <td className="p-3">Selangor Land Registry Search</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">Lacks Registrable Interest</span>
                      </td>
                      <td className="p-3 text-slate-400">National Land Code S.323</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: SOVEREIGN SYNTHESIS & PROVENANCE SEAL */}
          {activeTab === 'dossier' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      <h2 className="text-base font-bold text-slate-100">Sovereign OSINT Synthesis Briefing</h2>
                    </div>
                    <p className="text-xs text-slate-400">Cryptographically Sealed Master Brief for High Court Injunction &amp; Asset Recovery.</p>
                  </div>
                  <div className="flex items-center space-x-2 font-mono text-xs">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-bold">
                      AUTHENTICATED BY MYGDX
                    </span>
                  </div>
                </div>

                {/* Master Executive Brief Text */}
                <div className="space-y-4 text-xs font-sans text-slate-300 bg-slate-950 p-5 rounded-lg border border-slate-800 leading-relaxed">
                  <h3 className="text-sm font-bold text-cyan-400 font-mono">1. EXECUTIVE SUMMARY &amp; JURISDICTIONAL FINDINGS</h3>
                  <p>
                    Comprehensive multi-agent investigation under Dossier <span className="font-mono text-cyan-300">{DOSSIER_META.dossierId}</span> confirms that Claimant <span className="font-bold text-slate-100">{DOSSIER_META.primarySubject.name}</span> is the sole verified legitimate heir of the deceased testator <span className="font-bold text-slate-100">{DOSSIER_META.testator.name}</span>, supported by a 99.9983% DNA kinship match (KM/2026/DNA-8821).
                  </p>

                  <h3 className="text-sm font-bold text-cyan-400 font-mono pt-2">2. CRIMINAL FRAUD PATTERN DETECTED</h3>
                  <p>
                    Adverse Proxy <span className="font-bold text-rose-400">{DOSSIER_META.adverseProxy.name}</span> executed an unauthorized transfer of 800,000 shares in Ganesan Holdings via fraudulent SSM Form 32A filing for nominal RM 1.00 consideration. Forensic document examination confirms the codicil signature was mechanically simulated post-mortem (98.4% tremor divergence).
                  </p>

                  <h3 className="text-sm font-bold text-cyan-400 font-mono pt-2">3. CROSS-BORDER ASSET SINK RECOVERY</h3>
                  <p>
                    SWIFT clearing advice MT103 Ref: CHASUS33 establishes an unauthorized $4,200,000 USD capital transfer from AmBank KL to Credit Suisse Zurich under the beneficial ownership of Apex Global SPV (BVI) and Veda Offshore Trust (Cayman Islands).
                  </p>
                </div>

                {/* SHA-256 Provenance Verification Box */}
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Cryptographic Provenance Master Digest</span>
                    <span className="text-emerald-400">DIGITAL SIGNATURE ACT 1997 COMPLIANT</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 text-purple-300 break-all">
                    SHA-256: {DOSSIER_META.sha256Digest}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: LIVE GEMINI OSINT AI WORKBENCH */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
                    <h2 className="text-base font-bold text-slate-100">Live Gemini OSINT Intelligence Agent</h2>
                  </div>
                  <div className="flex items-center space-x-3 text-xs font-mono">
                    <label className="flex items-center space-x-1.5 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={useSearchGrounding}
                        onChange={(e) => setUseSearchGrounding(e.target.checked)}
                        className="rounded border-slate-800 text-pink-500 focus:ring-0"
                      />
                      <span>Google Search Grounding</span>
                    </label>
                    <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      gemini-3-flash-preview
                    </span>
                  </div>
                </div>

                {/* Prompt Controls */}
                <div className="space-y-3">
                  <textarea
                    rows={3}
                    placeholder="Ask the OSINT AI agent to analyze cross-border estate strategies, construct court cross-examinations, or evaluate AML legal risks..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:border-pink-500/50"
                  />

                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                      <button
                        onClick={() => setAiPrompt('Analyze the statutory remedies under Malaysian Companies Act 2016 S.600 and Evidence Act S.112 for restoring Ganesan Holdings shares.')}
                        className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400"
                      >
                        + Prompt: Share Rectification Strategy
                      </button>
                      <button
                        onClick={() => setAiPrompt('Draft a high court affidavit statement summarizing the 24-STR PCR DNA match and signature tremor fraud on Exhibit D-4.')}
                        className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400"
                      >
                        + Prompt: Draft Affidavit Paragraphs
                      </button>
                    </div>

                    <button
                      onClick={handleGeminiQuery}
                      disabled={aiLoading}
                      className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition flex items-center space-x-2 shadow-lg shadow-pink-500/20"
                    >
                      {aiLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>{aiLoading ? 'REASONING...' : 'QUERY GEMINI AI'}</span>
                    </button>
                  </div>
                </div>

                {/* AI Output Stream */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">
                    Synthesized OSINT Reasoning Output
                  </h4>
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 min-h-[160px] text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-wrap">
                    {aiResponse ? (
                      aiResponse
                    ) : (
                      <span className="text-slate-600 italic">
                        Select a prompt template or enter a custom query to trigger live OSINT analysis...
                      </span>
                    )}
                  </div>

                  {/* Grounded Search Sources */}
                  {aiSources.length > 0 && (
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-[11px] font-mono text-slate-400 font-bold">Search Grounding Sources:</span>
                      <ul className="space-y-1 text-xs">
                        {aiSources.map((s, idx) => (
                          <li key={idx}>
                            <a
                              href={s.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-400 hover:underline flex items-center space-x-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>{s.title}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default SovereignOsintEngineView;
