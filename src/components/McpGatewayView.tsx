import React, { useState } from 'react';
import {
  Terminal,
  Cpu,
  Server,
  Play,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Scale,
  Building2,
  Globe2,
  FileCode2,
  Layers,
  ArrowRightLeft,
  Sparkles,
  Search,
} from 'lucide-react';

interface McpGatewayViewProps {
  onNavigateToIcij?: () => void;
  onNavigateToSkills?: () => void;
}

const MCP_PRESETS: Record<string, { name: string; tool: string; args: Record<string, unknown> }> = {
  courtlistener_kavinath: {
    name: 'CourtListener: Sub-judice Litigation Search',
    tool: 'courtlistener_search_opinions',
    args: {
      query: 'Kavinath Holdings partnership debt exception section 4c',
      court: 'all',
      order_by: 'score desc',
    },
  },
  courtlistener_dockets: {
    name: 'CourtListener: High Court Suit No. 4-334567 Dockets',
    tool: 'courtlistener_search_dockets',
    args: {
      case_name: 'Kavinath Holdings',
      docket_number: '4-334567',
      court: 'High Court of Malaya',
    },
  },
  courtlistener_citation: {
    name: 'CourtListener: Citation Bluebook Verification',
    tool: 'courtlistener_lookup_citation',
    args: {
      citation: '2025 MLJ 882',
    },
  },
  courtlistener_cross_jurisdiction: {
    name: 'CourtListener: Cross-Jurisdiction Asset Check',
    tool: 'courtlistener_cross_jurisdiction_check',
    args: {
      target_name: 'Kavinath Holdings / Archon Holdings SA',
      related_jurisdictions: ['MY', 'US', 'KY', 'CH'],
    },
  },
  mygdx_ssm_roc: {
    name: 'MyGDX SSM: Restricted ROC Verification (1199837-7)',
    tool: 'mygdx_ssm_query_roc',
    args: {
      registration_number: '1199837-7',
      include_directors: true,
    },
  },
  mygdx_ssm_disqualification: {
    name: 'MyGDX SSM: Section 198 Director Disqualification Check',
    tool: 'mygdx_ssm_check_director_disqualification',
    args: {
      director_name: 'KAVINATH A/L GANESAM',
      director_identifier: '88****-08-****',
    },
  },
  mygdx_ssm_charges: {
    name: 'MyGDX SSM: Active Debentures & Winding-Up Check',
    tool: 'mygdx_ssm_charges_and_winding_up',
    args: {
      registration_number: '1199837-7',
    },
  },
  icij_offshore_archon: {
    name: 'ICIJ Reconcile: Archon Holdings SA (Geneva)',
    tool: 'icij_offshore_reconcile_entity',
    args: {
      query: 'Archon Holdings SA',
      type: 'Entity',
      limit: 5,
    },
  },
  legalai_cause_papers: {
    name: 'LegalAI-MY: High Court Cause Papers & S/N Verification',
    tool: 'legalai_my_verify_cause_papers',
    args: {
      suit_number: 'Suit No. 4-334567',
      court_division: 'Commercial Court 4, High Court Malaya',
    },
  },
  legalai_tax_recalculation: {
    name: 'LegalAI-MY: Statutory Tax Demand & Sec 140A Audit',
    tool: 'legalai_my_statutory_tax_demand_audit',
    args: {
      notice_reference: 'LHDN/ENF/2026/09912',
      assessed_profit_myr: 56420000,
      arm_length_rate_pct: 5.5,
    },
  },
};

export const McpGatewayView: React.FC<McpGatewayViewProps> = ({
  onNavigateToIcij,
  onNavigateToSkills,
}) => {
  const [selectedTool, setSelectedTool] = useState<string>('courtlistener_search_opinions');
  const [accessMode, setAccessMode] = useState<'mcp' | 'rest' | 'both'>('mcp');
  const [jsonArgs, setJsonArgs] = useState<string>(
    JSON.stringify(MCP_PRESETS.courtlistener_kavinath.args, null, 2)
  );
  const [copiedConfig, setCopiedConfig] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [mcpResult, setMcpResult] = useState<any>(null);
  const [restResult, setRestResult] = useState<any>(null);
  const [executionTiming, setExecutionTiming] = useState<{ mcpMs?: number; restMs?: number } | null>(null);
  const [activeConfigTab, setActiveConfigTab] = useState<'claude' | 'cursor' | 'gemini' | 'cli'>('claude');

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-zxw7jvofy7kgpy36jawqij-21151088915.asia-east1.run.app';

  const applyPreset = (key: string) => {
    const preset = MCP_PRESETS[key];
    if (preset) {
      setSelectedTool(preset.tool);
      setJsonArgs(JSON.stringify(preset.args, null, 2));
    }
  };

  const executeCall = async () => {
    setIsExecuting(true);
    setMcpResult(null);
    setRestResult(null);
    setExecutionTiming(null);

    let parsedArgs: Record<string, unknown> = {};
    try {
      parsedArgs = JSON.parse(jsonArgs);
    } catch {
      alert('Invalid JSON in arguments field');
      setIsExecuting(false);
      return;
    }

    const timing: { mcpMs?: number; restMs?: number } = {};

    // 1. Execute via MCP Protocol
    if (accessMode === 'mcp' || accessMode === 'both') {
      const mcpStart = performance.now();
      try {
        const res = await fetch('/api/mcp/rpc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: `req-${Date.now()}`,
            method: 'tools/call',
            params: {
              name: selectedTool,
              arguments: parsedArgs,
            },
          }),
        });
        const data = await res.json();
        timing.mcpMs = Math.round(performance.now() - mcpStart);
        setMcpResult(data);
      } catch (err) {
        timing.mcpMs = Math.round(performance.now() - mcpStart);
        setMcpResult({ error: 'Network error executing MCP call', details: String(err) });
      }
    }

    // 2. Execute via REST API
    if (accessMode === 'rest' || accessMode === 'both') {
      const restStart = performance.now();
      try {
        let endpoint = '/api/mcp/rpc';
        let body: any = {};

        if (selectedTool.startsWith('courtlistener_')) {
          endpoint = '/api/courtlistener/search';
          body = { query: parsedArgs.query || parsedArgs.target_name || parsedArgs.case_name || 'Kavinath' };
        } else if (selectedTool.startsWith('mygdx_ssm_')) {
          endpoint = '/api/ssm/query';
          body = {
            endpoint: '/ssm/status/roc',
            registrationNumber: String(parsedArgs.registration_number || '1199837-7'),
          };
        } else if (selectedTool.startsWith('icij_offshore_')) {
          endpoint = '/api/icij/reconcile';
          body = { query: String(parsedArgs.query || 'Archon Holdings SA') };
        } else {
          endpoint = '/api/mcp/rpc';
          body = {
            jsonrpc: '2.0',
            id: `rest-${Date.now()}`,
            method: 'tools/call',
            params: { name: selectedTool, arguments: parsedArgs },
          };
        }

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        timing.restMs = Math.round(performance.now() - restStart);
        setRestResult(data);
      } catch (err) {
        timing.restMs = Math.round(performance.now() - restStart);
        setRestResult({ error: 'Network error executing REST call', details: String(err) });
      }
    }

    setExecutionTiming(timing);
    setIsExecuting(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedConfig(id);
    setTimeout(() => setCopiedConfig(null), 2500);
  };

  const claudeConfig = JSON.stringify(
    {
      mcpServers: {
        'mygdx-ssm-courtlistener': {
          url: `${currentOrigin}/mcp`,
          transport: 'sse',
        },
      },
    },
    null,
    2
  );

  const cursorConfig = JSON.stringify(
    {
      mcp: {
        servers: [
          {
            name: 'mygdx-ssm-courtlistener',
            url: `${currentOrigin}/mcp`,
            type: 'sse',
          },
        ],
      },
    },
    null,
    2
  );

  const geminiConfig = JSON.stringify(
    {
      modelContextProtocol: {
        serverUrl: `${currentOrigin}/mcp`,
        protocols: ['2024-11-05'],
        endpoints: {
          courtlistener: `${currentOrigin}/mcp/courtlistener`,
          mygdxSsm: `${currentOrigin}/mcp/ssm`,
          icijReconcile: `${currentOrigin}/mcp/offshoreleaks`,
        },
      },
    },
    null,
    2
  );

  const cliSnippet = `# Connect using the MCP stdio / HTTP bridge:
npx -y @modelcontextprotocol/inspector ${currentOrigin}/mcp

# Or direct JSON-RPC 2.0 curl invocation:
curl -X POST ${currentOrigin}/mcp \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"courtlistener_search_opinions","arguments":{"query":"Kavinath Holdings"}}}'`;

  return (
    <div className="space-y-6">
      {/* Top Banner with Architecture & Dual Access Overview */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Server className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  Model Context Protocol (MCP) Server & Evidentiary Gateway
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active (Protocol 2024-11-05)
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Dual-access bridge supporting both native MCP clients (Claude Desktop, Cursor, Gemini) and standard REST APIs.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onNavigateToSkills && (
              <button
                type="button"
                onClick={onNavigateToSkills}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition"
              >
                <FileCode2 className="w-3.5 h-3.5" />
                Skills Package (.zip)
              </button>
            )}

            {onNavigateToIcij && (
              <button
                type="button"
                onClick={onNavigateToIcij}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition"
              >
                <Globe2 className="w-3.5 h-3.5" />
                ICIJ Reconcile Explorer
              </button>
            )}

            <a
              href="/api/skills/download-zip"
              download
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow transition"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              Download All Skills (.zip)
            </a>
          </div>
        </div>

        {/* Live Endpoints Matrix */}
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-2.5 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Scale className="w-3 h-3 text-blue-400" />
              CourtListener MCP
            </div>
            <div className="font-mono text-slate-200 mt-1 truncate select-all">{currentOrigin}/mcp/courtlistener</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Opinions, Dockets, Citations</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-emerald-400" />
              MyGDX SSM MCP
            </div>
            <div className="font-mono text-slate-200 mt-1 truncate select-all">{currentOrigin}/mcp/ssm</div>
            <div className="text-[10px] text-slate-500 mt-0.5">ROC, ROB, LLP, Section 198</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Globe2 className="w-3 h-3 text-purple-400" />
              ICIJ Offshore Reconcile
            </div>
            <div className="font-mono text-slate-200 mt-1 truncate select-all">{currentOrigin}/mcp/offshoreleaks</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Panama, Pandora, Paradise Papers</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-amber-400" />
              Universal MCP SSE Stream
            </div>
            <div className="font-mono text-slate-200 mt-1 truncate select-all">{currentOrigin}/mcp/sse</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Live JSON-RPC SSE Transport</div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Left Configuration & Presets, Right Interactive Runner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Ready-to-copy client configurations */}
        <div className="lg:col-span-5 space-y-6">
          {/* Agent Configuration Snippets */}
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-blue-400" />
                Connect MCP Agent / LLM
              </h3>
              <span className="text-[10px] text-slate-400">Copy &amp; Paste config</span>
            </div>

            {/* Config Tabs */}
            <div className="flex border-b border-slate-800 space-x-1">
              {(['claude', 'cursor', 'gemini', 'cli'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveConfigTab(tab)}
                  className={`px-3 py-1.5 text-xs font-medium border-b-2 transition ${
                    activeConfigTab === tab
                      ? 'border-blue-500 text-blue-400 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab === 'claude' && 'Claude Desktop'}
                  {tab === 'cursor' && 'Cursor IDE'}
                  {tab === 'gemini' && 'AI Studio'}
                  {tab === 'cli' && 'CLI / Stdio'}
                </button>
              ))}
            </div>

            {/* Snippet Display */}
            <div className="relative">
              <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-56">
                {activeConfigTab === 'claude' && claudeConfig}
                {activeConfigTab === 'cursor' && cursorConfig}
                {activeConfigTab === 'gemini' && geminiConfig}
                {activeConfigTab === 'cli' && cliSnippet}
              </pre>

              <button
                type="button"
                onClick={() => {
                  const text =
                    activeConfigTab === 'claude'
                      ? claudeConfig
                      : activeConfigTab === 'cursor'
                      ? cursorConfig
                      : activeConfigTab === 'gemini'
                      ? geminiConfig
                      : cliSnippet;
                  copyToClipboard(text, activeConfigTab);
                }}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                title="Copy snippet"
              >
                {copiedConfig === activeConfigTab ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              When connected, your agent receives full tools for CourtListener opinion search, restricted MyGDX SSM registries, and ICIJ offshore reconciliation.
            </p>
          </div>

          {/* Quick Presets for Officers */}
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Evidentiary Investigation Presets
            </h3>
            <p className="text-[11px] text-slate-400">
              Click any verified case preset to populate the runner below:
            </p>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {Object.entries(MCP_PRESETS).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => applyPreset(key)}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-medium text-slate-200 group-hover:text-blue-300">
                      {item.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      tool: {item.tool}
                    </div>
                  </div>
                  <Play className="w-3 h-3 text-slate-500 group-hover:text-blue-400" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Interactive Dual-Access Tool Runner */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl">
            {/* Header with Mode Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
                  Dual-Access Execution Console
                </h3>
                <span className="text-[11px] text-slate-400">
                  Execute via MCP Server, REST API, or both in parallel
                </span>
              </div>

              {/* Mode Toggle */}
              <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setAccessMode('mcp')}
                  className={`px-2.5 py-1 rounded font-medium transition ${
                    accessMode === 'mcp'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  MCP Protocol
                </button>
                <button
                  type="button"
                  onClick={() => setAccessMode('rest')}
                  className={`px-2.5 py-1 rounded font-medium transition ${
                    accessMode === 'rest'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  REST API
                </button>
                <button
                  type="button"
                  onClick={() => setAccessMode('both')}
                  className={`px-2.5 py-1 rounded font-medium transition ${
                    accessMode === 'both'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Both (Compare)
                </button>
              </div>
            </div>

            {/* Tool Selection Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target MCP Tool / Method
              </label>
              <select
                value={selectedTool}
                onChange={(e) => setSelectedTool(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono focus:outline-none focus:border-blue-500"
              >
                <optgroup label="CourtListener Legal MCP (4M+ Decisions & Dockets)">
                  <option value="courtlistener_search_opinions">courtlistener_search_opinions</option>
                  <option value="courtlistener_search_dockets">courtlistener_search_dockets</option>
                  <option value="courtlistener_lookup_citation">courtlistener_lookup_citation</option>
                  <option value="courtlistener_cross_jurisdiction_check">courtlistener_cross_jurisdiction_check</option>
                </optgroup>
                <optgroup label="MyGDX Restricted SSM Status MCP">
                  <option value="mygdx_ssm_query_roc">mygdx_ssm_query_roc (ROC Register)</option>
                  <option value="mygdx_ssm_query_rob">mygdx_ssm_query_rob (ROB Businesses)</option>
                  <option value="mygdx_ssm_query_llp">mygdx_ssm_query_llp (LLP Partnerships)</option>
                  <option value="mygdx_ssm_check_director_disqualification">mygdx_ssm_check_director_disqualification</option>
                  <option value="mygdx_ssm_charges_and_winding_up">mygdx_ssm_charges_and_winding_up</option>
                </optgroup>
                <optgroup label="ICIJ Offshore Leaks Reconcile (https://offshoreleaks.icij.org/api/v1/reconcile)">
                  <option value="icij_offshore_reconcile_entity">icij_offshore_reconcile_entity</option>
                  <option value="icij_offshore_batch_reconcile">icij_offshore_batch_reconcile</option>
                </optgroup>
                <optgroup label="LegalAI-MY & Evidentiary Discovery">
                  <option value="legalai_my_verify_cause_papers">legalai_my_verify_cause_papers</option>
                  <option value="legalai_my_statutory_tax_demand_audit">legalai_my_statutory_tax_demand_audit</option>
                </optgroup>
              </select>
            </div>

            {/* Arguments JSON Editor */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Tool Arguments (JSON Schema)
                </label>
                <span className="text-[10px] text-slate-400">Edit values below as needed</span>
              </div>
              <textarea
                rows={5}
                value={jsonArgs}
                onChange={(e) => setJsonArgs(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Action Button */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                disabled={isExecuting}
                onClick={executeCall}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg transition"
              >
                {isExecuting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Executing via {accessMode.toUpperCase()}...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Execute Request ({accessMode.toUpperCase()})
                  </>
                )}
              </button>

              {executionTiming && (
                <div className="text-[11px] text-slate-400 flex items-center gap-3">
                  {executionTiming.mcpMs !== undefined && (
                    <span className="text-blue-300">MCP: {executionTiming.mcpMs}ms</span>
                  )}
                  {executionTiming.restMs !== undefined && (
                    <span className="text-emerald-300">REST: {executionTiming.restMs}ms</span>
                  )}
                </div>
              )}
            </div>

            {/* Results Viewer */}
            {(mcpResult || restResult) && (
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-4">
                {mcpResult && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5" />
                        MCP Protocol Response (JSON-RPC 2.0 via /mcp)
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(JSON.stringify(mcpResult, null, 2), 'mcp-res')}
                        className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                      >
                        {copiedConfig === 'mcp-res' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        Copy
                      </button>
                    </div>
                    <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-200 overflow-x-auto max-h-72 leading-relaxed">
                      {JSON.stringify(mcpResult, null, 2)}
                    </pre>
                  </div>
                )}

                {restResult && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5" />
                        REST API Response (via /api/...)
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(JSON.stringify(restResult, null, 2), 'rest-res')}
                        className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                      >
                        {copiedConfig === 'rest-res' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        Copy
                      </button>
                    </div>
                    <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-200 overflow-x-auto max-h-72 leading-relaxed">
                      {JSON.stringify(restResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
