import React, { useState } from 'react';
import {
  Cpu,
  Terminal,
  Play,
  Copy,
  Check,
  RefreshCw,
  Search,
  Scale,
  Building2,
  Globe2,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';

interface ToolPreset {
  name: string;
  category: 'courtlistener' | 'mygdx_ssm' | 'icij_offshore' | 'legalai_my';
  displayName: string;
  description: string;
  defaultArgs: Record<string, any>;
}

const MCP_TOOL_PRESETS: ToolPreset[] = [
  {
    name: 'courtlistener_search_opinions',
    category: 'courtlistener',
    displayName: 'CourtListener Search Opinions',
    description: 'Searches 4M+ judicial opinions and rulings via CourtListener RECAP API.',
    defaultArgs: {
      query: 'Veridian Settlement 2017 Geneva Kavinath Ganesan',
      court: 'all',
      order_by: 'score desc',
    },
  },
  {
    name: 'courtlistener_search_dockets',
    category: 'courtlistener',
    displayName: 'CourtListener Search Dockets',
    description: 'Searches court dockets, cases, litigants, judges, and sub-judice filings.',
    defaultArgs: {
      case_name: 'Kavinath Holdings & Anor',
      docket_number: '4-334567',
    },
  },
  {
    name: 'courtlistener_lookup_citation',
    category: 'courtlistener',
    displayName: 'CourtListener Citation Lookup',
    description: 'Parses legal citations to extract official Bluebook reporter metadata.',
    defaultArgs: {
      citation: '2025 MLJ 882',
    },
  },
  {
    name: 'courtlistener_cross_jurisdiction_check',
    category: 'courtlistener',
    displayName: 'CourtListener Cross-Jurisdiction Check',
    description: 'Multi-jurisdiction litigation cross-checks linking international dockets.',
    defaultArgs: {
      target_name: 'Kavinath Ganesan',
      related_jurisdictions: ['MY', 'US', 'KY', 'CH'],
    },
  },
  {
    name: 'mygdx_ssm_query_roc',
    category: 'mygdx_ssm',
    displayName: 'MyGDX SSM Query ROC (Companies)',
    description: 'Queries restricted SSM Register of Companies with HMAC-SHA256 headers.',
    defaultArgs: {
      registration_number: '1199837-7',
      include_directors: true,
    },
  },
  {
    name: 'mygdx_ssm_query_rob',
    category: 'mygdx_ssm',
    displayName: 'MyGDX SSM Query ROB (Businesses)',
    description: 'Queries Register of Businesses for sole proprietorships & partnerships.',
    defaultArgs: {
      registration_number: '002934812-M',
    },
  },
  {
    name: 'mygdx_ssm_query_llp',
    category: 'mygdx_ssm',
    displayName: 'MyGDX SSM Query LLP (PLT)',
    description: 'Queries Limited Liability Partnerships status and compliance officers.',
    defaultArgs: {
      registration_number: 'LLP0019283-LGN',
    },
  },
  {
    name: 'mygdx_ssm_check_director_disqualification',
    category: 'mygdx_ssm',
    displayName: 'SSM Director Disqualification Register',
    description: 'Checks director disqualification registers under Companies Act 2016 S.198/199.',
    defaultArgs: {
      director_name: 'Suresh Kumar A/L Balakrishnan',
      director_identifier: '960907-08-5840',
    },
  },
  {
    name: 'mygdx_ssm_charges_and_winding_up',
    category: 'mygdx_ssm',
    displayName: 'SSM Charges & Winding-Up Petitions',
    description: 'Verifies active debentures, banking charges, and insolvency petitions.',
    defaultArgs: {
      registration_number: '1199837-7',
    },
  },
  {
    name: 'icij_offshore_reconcile_entity',
    category: 'icij_offshore',
    displayName: 'ICIJ Offshore Leaks Reconcile Entity',
    description: 'Reconciles entity or officer against Panama, Pandora, and Paradise Papers.',
    defaultArgs: {
      query: 'Archon Holdings SA',
      type: 'Entity',
      limit: 5,
    },
  },
  {
    name: 'icij_offshore_batch_reconcile',
    category: 'icij_offshore',
    displayName: 'ICIJ Offshore Batch Reconcile',
    description: 'Batch reconciliation for multiple suspect entities in parallel.',
    defaultArgs: {
      queries: ['Archon Holdings SA', 'Veridian Trust Services Ltd', 'Ganesam'],
    },
  },
  {
    name: 'legalai_my_verify_cause_papers',
    category: 'legalai_my',
    displayName: 'LegalAI High Court Cause Paper Audit',
    description: 'Verifies High Court of Malaya e-Kehakiman filings and S.4(c) exceptions.',
    defaultArgs: {
      suit_number: 'WA-22NCC-482-09/2026',
      court_division: 'Commercial Division, High Court Malaya',
    },
  },
  {
    name: 'legalai_my_statutory_tax_demand_audit',
    category: 'legalai_my',
    displayName: 'LegalAI LHDN Statutory Demand Audit',
    description: 'Audits Notice of Assessment under ITA 1967 S.4(c), 113, and 140A.',
    defaultArgs: {
      notice_reference: 'LHDN/JBT/2026/0994',
      assessed_profit_myr: 35000000,
      arm_length_rate_pct: 5.5,
    },
  },
];

export const McpToolsTester: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTool, setSelectedTool] = useState<ToolPreset>(MCP_TOOL_PRESETS[0]);
  const [argsJson, setArgsJson] = useState<string>(JSON.stringify(MCP_TOOL_PRESETS[0].defaultArgs, null, 2));
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const filteredTools =
    selectedCategory === 'all'
      ? MCP_TOOL_PRESETS
      : MCP_TOOL_PRESETS.filter((t) => t.category === selectedCategory);

  const handleSelectTool = (tool: ToolPreset) => {
    setSelectedTool(tool);
    setArgsJson(JSON.stringify(tool.defaultArgs, null, 2));
    setExecutionResult(null);
    setLatencyMs(null);
  };

  const handleExecuteTool = async () => {
    setIsExecuting(true);
    setExecutionResult(null);
    setLatencyMs(null);

    let parsedArgs: Record<string, any> = {};
    try {
      parsedArgs = JSON.parse(argsJson);
    } catch (err: any) {
      alert(`Invalid JSON arguments: ${err.message}`);
      setIsExecuting(false);
      return;
    }

    try {
      const res = await fetch('/api/v1/mcp/tool/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: selectedTool.name,
          args: parsedArgs,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setExecutionResult(data.data);
        setLatencyMs(data.latencyMs);
      } else {
        setExecutionResult({ error: data.error || 'Execution failed' });
      }
    } catch (err: any) {
      setExecutionResult({ error: err.message });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopy = () => {
    if (!executionResult) return;
    navigator.clipboard.writeText(JSON.stringify(executionResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Interactive Model Context Protocol (MCP) Tools Tester
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  13 Active MCP Tools
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Direct RPC execution across CourtListener RECAP, MyGDX SSM, ICIJ Offshore Leaks, and LegalAI Malaysian Court Cause Papers.
              </p>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All (13)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('courtlistener')}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition ${
                selectedCategory === 'courtlistener'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Scale className="w-3 h-3" /> CourtListener (4)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('mygdx_ssm')}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition ${
                selectedCategory === 'mygdx_ssm'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Building2 className="w-3 h-3" /> MyGDX SSM (5)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('icij_offshore')}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition ${
                selectedCategory === 'icij_offshore'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Globe2 className="w-3 h-3" /> ICIJ Leaks (2)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('legalai_my')}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition ${
                selectedCategory === 'legalai_my'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <BookOpen className="w-3 h-3" /> LegalAI MY (2)
            </button>
          </div>
        </div>

        {/* Tools Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredTools.map((tool) => (
            <button
              key={tool.name}
              type="button"
              onClick={() => handleSelectTool(tool)}
              className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between ${
                selectedTool.name === tool.name
                  ? 'bg-indigo-950/50 border-indigo-500/70 ring-1 ring-indigo-500/30'
                  : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-semibold text-slate-200 truncate">{tool.displayName}</span>
                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-mono bg-slate-800 text-slate-400">
                  {tool.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">{tool.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column: Args & Live Execution Result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Tool Args & Execution Trigger */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Tool Invocation Parameters
              </h3>
              <p className="text-[11px] font-mono text-indigo-400 mt-0.5">
                {selectedTool.name}
              </p>
            </div>
            <button
              type="button"
              onClick={handleExecuteTool}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
              <span>{isExecuting ? 'Invoking MCP...' : 'Invoke Tool'}</span>
            </button>
          </div>

          <div className="flex-1 flex flex-col space-y-2">
            <label className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
              <span>JSON Payload (Editable):</span>
              <button
                type="button"
                onClick={() => setArgsJson(JSON.stringify(selectedTool.defaultArgs, null, 2))}
                className="text-indigo-400 hover:text-indigo-300 text-[10px]"
              >
                Reset Defaults
              </button>
            </label>
            <textarea
              value={argsJson}
              onChange={(e) => setArgsJson(e.target.value)}
              rows={12}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-200 outline-none focus:border-indigo-500 resize-none selection:bg-indigo-500/30"
              spellCheck={false}
            />
          </div>

          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">Transport: </span>
            <span>Internal JSON-RPC 2.0 Dispatch &amp; Live Gateway Proxy</span>
          </div>
        </div>

        {/* Right Col: Live Tool Result */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-300">MCP Result Payload</span>
              {latencyMs !== null && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {latencyMs}ms
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!executionResult}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>

          <div className="p-4 flex-1 bg-slate-950 font-mono text-xs overflow-auto max-h-[440px]">
            {executionResult ? (
              <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(executionResult, null, 2)}
              </pre>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 space-y-2">
                <Cpu className="w-8 h-8 text-slate-600" />
                <p>Select an MCP tool and click "Invoke Tool" to inspect live response payload.</p>
              </div>
            )}
          </div>

          <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Status: {isExecuting ? 'Invoking MCP Node...' : executionResult ? '200 OK' : 'Idle'}</span>
            <span className="font-mono">JSON-RPC 2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
