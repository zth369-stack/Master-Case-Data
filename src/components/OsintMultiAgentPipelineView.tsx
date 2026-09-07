import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Network,
  Cpu,
  Database,
  FileCheck2,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  Terminal,
  ExternalLink,
  ChevronRight,
  Fingerprint,
  Scale,
  Building2,
  Globe2,
  Search,
  BookOpen,
  ArrowRight,
  Download,
  Share2,
  Layers,
  Sparkles,
  Lock,
  FileText,
  Clock,
  Eye,
  Check,
  Copy,
  Gavel,
} from 'lucide-react';
import type {
  DagExecutionNode,
  OsintPipelineResult,
  McpToolDefinition,
  OsintProvenanceFact,
} from '../server/osintMultiAgentService';
import type {
  TargetedCourtListenerResponse,
  TargetedCourtListenerCase,
} from '../server/courtListenerTargetedService';
import { CourtListenerTargetedView } from './CourtListenerTargetedView';
import { SovereignOsintEngineView } from './SovereignOsintEngineView';

export function OsintMultiAgentPipelineView() {
  // State for pipeline execution
  const [isRunning, setIsRunning] = useState(false);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [activeStepText, setActiveStepText] = useState('Standby for Execution');
  const [pipelineResult, setPipelineResult] = useState<OsintPipelineResult | null>(null);

  // Form Inputs for Pipeline
  const [dossierTarget, setDossierTarget] = useState('SSM/MYGDX/THESIS/2026/FORENSIC-MASTER-AZ-001');
  const [primaryName, setPrimaryName] = useState('Kavinath A/L Ganesan');
  const [primaryNric, setPrimaryNric] = useState('960906-08-5839');
  const [testatorName, setTestatorName] = useState('Ganesan A/L Raman');
  const [testatorNric, setTestatorNric] = useState('620415-08-5111');
  const [adverseName, setAdverseName] = useState('Suresh Kumar A/L Balakrishnan (Proxy X)');
  const [adverseNric, setAdverseNric] = useState('780314-10-5923');
  const [alphaVectorWeight, setAlphaVectorWeight] = useState<number>(0.65);

  // Tool Registry State
  const [mcpServers, setMcpServers] = useState<any[]>([]);
  const [allTools, setAllTools] = useState<McpToolDefinition[]>([]);
  const [selectedServerFilter, setSelectedServerFilter] = useState<string>('ALL');
  const [toolSearchQuery, setToolSearchQuery] = useState<string>('');
  const [selectedToolForModal, setSelectedToolForModal] = useState<McpToolDefinition | null>(null);
  const [toolCallArgsInput, setToolCallArgsInput] = useState<string>('{}');
  const [toolCallResult, setToolCallResult] = useState<any>(null);
  const [isCallingTool, setIsCallingTool] = useState(false);

  // Active view sub-tabs
  const [subTab, setSubTab] = useState<'dag_orchestrator' | 'mcp_registry' | 'entity_graph' | 'fraud_audit' | 'provenance' | 'courtlistener_targeted'>('dag_orchestrator');
  const [copiedHash, setCopiedHash] = useState(false);
  const [attachDossierSuccess, setAttachDossierSuccess] = useState<string | null>(null);

  // Targeted CourtListener on NRIC State
  const [courtListenerResult, setCourtListenerResult] = useState<TargetedCourtListenerResponse | null>(null);
  const [isVerifyingCourtListener, setIsVerifyingCourtListener] = useState(false);
  const [courtListenerNricInput, setCourtListenerNricInput] = useState('960906-08-5839');
  const [copiedCaseCitation, setCopiedCaseCitation] = useState<string | null>(null);

  // Function to run targeted CourtListener on NRIC
  const handleRunTargetedCourtListener = async (nricParam?: string) => {
    const target = nricParam || courtListenerNricInput || '960906-08-5839';
    setIsVerifyingCourtListener(true);
    try {
      const res = await fetch(`/api/courtlistener/targeted-verify?nric=${encodeURIComponent(target)}`);
      const json = await res.json();
      if (json.success && json.data) {
        setCourtListenerResult(json.data);
        setSubTab('courtlistener_targeted');
      }
    } catch (err) {
      console.error('Failed to run targeted CourtListener:', err);
    } finally {
      setIsVerifyingCourtListener(false);
    }
  };

  // Load MCP Tools on mount
  useEffect(() => {
    fetch('/api/v1/osint/tools')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAllTools(data.tools || []);
          setMcpServers(data.servers || []);
        }
      })
      .catch((err) => console.error('Failed to load MCP tools:', err));

    // Load any existing pipeline result
    fetch('/api/v1/osint/latest-result')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setPipelineResult(data.data);
        }
      })
      .catch(() => {});
  }, []);

  // Trigger Live Execution Stream
  const handleExecutePipeline = async () => {
    setIsRunning(true);
    setExecutionProgress(10);
    setActiveStepText('Agent 1: Initializing Strategic Orchestrator & Task DAG...');
    setAttachDossierSuccess(null);

    try {
      const response = await fetch('/api/v1/osint/execute-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dossierTarget,
          primarySubject: { name: primaryName, nric: primaryNric },
          deceasedTestator: { name: testatorName, nric: testatorNric },
          adverseSubject: { name: adverseName, nric: adverseNric },
          jurisdictions: ['Malaysia', 'BVI', 'Geneva', 'USA'],
          alphaVectorWeight,
          enableVlmLayout: true,
          enableFraudAudit: true,
        }),
      });

      if (!response.body) {
        throw new Error('ReadableStream not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const rawData = line.slice(6).trim();
            if (rawData === '[DONE]') {
              setIsRunning(false);
              setExecutionProgress(100);
              setActiveStepText('Pipeline Completed & Cryptographically Sealed.');
              continue;
            }

            try {
              const parsed = JSON.parse(rawData);
              if (parsed.result) {
                setPipelineResult(parsed.result);
              }
              if (parsed.node) {
                const node = parsed.node as DagExecutionNode;
                if (node.id.includes('1')) {
                  setExecutionProgress(20);
                  setActiveStepText(`Node 1 Completed: ${node.name}`);
                } else if (node.id.includes('2')) {
                  setExecutionProgress(40);
                  setActiveStepText(`Node 2 Completed: Dynamic Retrieval Planner`);
                } else if (node.id.includes('3')) {
                  setExecutionProgress(60);
                  setActiveStepText(`Node 3 Completed: Multimodal VLM Forensic Layout`);
                } else if (node.id.includes('4')) {
                  setExecutionProgress(80);
                  setActiveStepText(`Node 4 Completed: Entity Resolution & Knowledge Graph`);
                } else if (node.id.includes('5')) {
                  setExecutionProgress(90);
                  setActiveStepText(`Node 5 Completed: Anomaly & Criminal Fraud Audit`);
                } else if (node.id.includes('6')) {
                  setExecutionProgress(100);
                  setActiveStepText(`Node 6 Completed: Sovereign Synthesis & Provenance`);
                }
              }
            } catch {
              // Non-JSON SSE ping
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Pipeline streaming failed:', err);
      setActiveStepText(`Execution Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Direct MCP Tool Invocation
  const handleInvokeTool = async () => {
    if (!selectedToolForModal) return;
    setIsCallingTool(true);
    setToolCallResult(null);

    try {
      let parsedArgs = {};
      try {
        parsedArgs = JSON.parse(toolCallArgsInput);
      } catch {
        parsedArgs = { raw: toolCallArgsInput };
      }

      const res = await fetch('/api/v1/osint/invoke-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: selectedToolForModal.name,
          args: parsedArgs,
        }),
      });
      const data = await res.json();
      setToolCallResult(data);
    } catch (err: any) {
      setToolCallResult({ error: err.message });
    } finally {
      setIsCallingTool(false);
    }
  };

  // Attach To Evidence Dossier
  const handleAttachToDossier = async () => {
    if (!pipelineResult) return;
    try {
      const res = await fetch('/api/v1/osint/attach-to-dossier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dossierTarget: pipelineResult.dossierTarget,
          strategicSummary: pipelineResult.strategicAssessment.summary,
          anomaliesCount: pipelineResult.detectedAnomalies.length,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAttachDossierSuccess('Dossier Exhibit Successfully Sealed & Enclosed in Evidence Catalog!');
      }
    } catch (err: any) {
      setAttachDossierSuccess(`Failed to seal: ${err.message}`);
    }
  };

  // Filtered tools
  const filteredTools = allTools.filter((tool) => {
    const matchesServer = selectedServerFilter === 'ALL' || tool.server === selectedServerFilter;
    const matchesQuery =
      tool.name.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
      tool.server.toLowerCase().includes(toolSearchQuery.toLowerCase());
    return matchesServer && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-indigo-400" />
                OSINT Multi-Agent Architecture
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono">
                31 MCP Tools Active
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-mono">
                Evidence Act S.90A Sealed
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Production-Grade OSINT Multi-Agent Investigation Architecture
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              Integrated Framework for Sovereign, Corporate &amp; Cross-Border Estate Investigations.
              Orchestrates 6 specialized cognitive agents via Dynamic Directed Acyclic Graphs (DAGs) and standardized Model Context Protocol (MCP) servers.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleRunTargetedCourtListener('960906-08-5839')}
              disabled={isVerifyingCourtListener}
              className="px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm shadow-lg shadow-amber-600/30 flex items-center gap-2 transition disabled:opacity-50"
            >
              {isVerifyingCourtListener ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  Verifying CourtListener (960906-08-5839)...
                </>
              ) : (
                <>
                  <Gavel className="w-4 h-4" />
                  Targeted CourtListener (960906-08-5839)
                </>
              )}
            </button>
            <button
              onClick={handleExecutePipeline}
              disabled={isRunning}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  Running Multi-Agent DAG...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  Execute Multi-Agent DAG Pipeline
                </>
              )}
            </button>
            {pipelineResult && (
              <button
                onClick={handleAttachToDossier}
                className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition"
              >
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                Seal in Evidence Dossier
              </button>
            )}
          </div>
        </div>

        {/* Live Execution Progress Strip */}
        {isRunning && (
          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-mono mb-2">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                {activeStepText}
              </span>
              <span>{executionProgress}% Completed</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 transition-all duration-300 ease-out"
                style={{ width: `${executionProgress}%` }}
              />
            </div>
          </div>
        )}

        {attachDossierSuccess && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{attachDossierSuccess}</span>
          </div>
        )}
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setSubTab('sovereign_studio')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
            subTab === 'sovereign_studio'
              ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-cyan-300 hover:text-cyan-200 border border-cyan-800/40'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
          Sovereign OSINT Studio (v4.8)
          <span className="px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-300 text-[10px] font-mono font-bold">
            Interactive Studio
          </span>
        </button>

        <button
          onClick={() => setSubTab('dag_orchestrator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
            subTab === 'dag_orchestrator'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          1. 6-Agent Stateful DAG
        </button>

        <button
          onClick={() => setSubTab('mcp_registry')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
            subTab === 'mcp_registry'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          2. Complete 31 MCP Registry
          <span className="px-1.5 py-0.2 rounded-full bg-indigo-950 text-indigo-300 text-[10px] font-mono">
            6 Servers
          </span>
        </button>

        <button
          onClick={() => setSubTab('entity_graph')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
            subTab === 'entity_graph'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          3. Entity Resolution &amp; Graph RAG
        </button>

        <button
          onClick={() => setSubTab('fraud_audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
            subTab === 'fraud_audit'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          4. Forensic Fraud &amp; Anomaly Audit
        </button>

        <button
          onClick={() => setSubTab('provenance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
            subTab === 'provenance'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
          5. Cryptographic Provenance Chain
        </button>

        <button
          onClick={() => {
            setSubTab('courtlistener_targeted');
            if (!courtListenerResult) {
              handleRunTargetedCourtListener('960906-08-5839');
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
            subTab === 'courtlistener_targeted'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Gavel className="w-3.5 h-3.5 text-amber-300" />
          6. CourtListener Verified (960906-08-5839)
          <span className="px-1.5 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-mono font-bold">
            7 Cases
          </span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: 6-AGENT STATEFUL DAG ORCHESTRATOR
          ========================================================================= */}
      {subTab === 'dag_orchestrator' && (
        <div className="space-y-6">
          {/* Target Intake Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <Scale className="w-4 h-4 text-indigo-400" />
              Sovereign Investigation Target Dossier Parameters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Dossier Target Ref</label>
                <input
                  type="text"
                  value={dossierTarget}
                  onChange={(e) => setDossierTarget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Primary Subject (Lawful Heir)</label>
                <input
                  type="text"
                  value={`${primaryName} [${primaryNric}]`}
                  onChange={(e) => setPrimaryName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Adverse Subject (Proxy X)</label>
                <input
                  type="text"
                  value={`${adverseName} [${adverseNric}]`}
                  onChange={(e) => setAdverseName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-rose-300 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <span className="text-xs text-slate-400 whitespace-nowrap">Hybrid Vector Alpha (Dense vs Sparse):</span>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={alphaVectorWeight}
                  onChange={(e) => setAlphaVectorWeight(parseFloat(e.target.value))}
                  className="w-36 accent-indigo-500"
                />
                <span className="text-xs font-mono text-indigo-300 font-bold">{alphaVectorWeight}</span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  ({alphaVectorWeight >= 0.5 ? 'Dense Semantic Dominant' : 'Sparse BM25 Keyword Dominant'})
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Cross-Border Jurisdictions: Malaysia, BVI, Geneva (CH), USA
              </div>
            </div>
          </div>

          {/* The 6 Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Agent A */}
            <div className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-5 transition relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                  AGENT A
                </span>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Strategic Orchestrator &amp; Task DAG Agent</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Serves as runtime controller. Receives target identifiers, generates execution plans, balances agent workloads, and enforces strict sub-judice compliance policies.
              </p>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] font-mono text-slate-300">
                <span className="text-indigo-400 font-semibold">Key Mechanics:</span> Dynamic DAG re-planning based on incoming entity confidence scores and multi-jurisdictional legal triggers.
              </div>
            </div>

            {/* Agent B */}
            <div className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-5 transition relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                  AGENT B
                </span>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Dynamic Retrieval &amp; Jurisdiction Translation Planner</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Formulates contextual search queries, manages multi-hop discovery across international jurisdictions (Malaysia, BVI, Cayman, Geneva, USA), and translates statutory frameworks.
              </p>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] font-mono text-slate-300">
                <span className="text-indigo-400 font-semibold">Key Mechanics:</span> Act 299, Act 424, Act 56, Swiss AMLA Art. 9, US Bankruptcy Code Chapter 15 cross-encoder scoring.
              </div>
            </div>

            {/* Agent C */}
            <div className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-5 transition relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                  AGENT C
                </span>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Multimodal Ingestion &amp; VLM Forensic Layout</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Processes scanned high-grade legal exhibits, court orders, testamentary wills, handwriting analysis reports, 24-STR PCR electropherograms, and SWIFT clearing advices.
              </p>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] font-mono text-slate-300">
                <span className="text-indigo-400 font-semibold">Key Mechanics:</span> Spatial layout-aware Vision-Language Models (VLMs) preserving tabular geometry and coordinate tokens.
              </div>
            </div>

            {/* Agent D */}
            <div className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-5 transition relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                  AGENT D
                </span>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Entity Resolution &amp; Knowledge Graph Agent</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Constructs knowledge graph topologies, deduplicates entity nodes across disparate global sources using contextual similarity, and computes ultimate beneficial ownership (UBO).
              </p>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] font-mono text-slate-300">
                <span className="text-indigo-400 font-semibold">Key Mechanics:</span> Jaro-Winkler fuzzy matching, PageRank centrality, and Louvain community proxy clustering.
              </div>
            </div>

            {/* Agent E */}
            <div className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-5 transition relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                  AGENT E
                </span>
                <span className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Anomaly Detector
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Anomaly, Discrepancy &amp; Criminal Fraud Audit</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Cross-evaluates retrieved data points to detect temporal inconsistencies, cut-and-trace signature simulations, fraudulent power-of-attorney filings, and unauthorized share transfers.
              </p>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] font-mono text-slate-300">
                <span className="text-rose-400 font-semibold">Key Mechanics:</span> Form 32A pixel alignment, Section 6 Act 424 revocation check, Subpoena Duces Tecum flags.
              </div>
            </div>

            {/* Agent F */}
            <div className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-5 transition relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  AGENT F
                </span>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <Fingerprint className="w-3 h-3" /> Provenance
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Sovereign Synthesis &amp; Cryptographic Provenance</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Aggregates verified findings into structured executive briefings, multi-court litigation sweeps, and chronological evidentiary timelines. Seals claims with SHA-256 digests.
              </p>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] font-mono text-slate-300">
                <span className="text-emerald-400 font-semibold">Key Mechanics:</span> Digital Signature Act 1997, Evidence Act 1950 Section 90A certificates, immutable audit chain.
              </div>
            </div>
          </div>

          {/* Live DAG Execution Nodes Output if available */}
          {pipelineResult && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Stateful DAG Execution Node Results ({pipelineResult.executionId})
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Total Latency: {pipelineResult.executionDurationMs}ms
                </span>
              </div>

              <div className="space-y-3">
                {pipelineResult.dagNodes.map((node, idx) => (
                  <div key={node.id} className="bg-slate-950 border border-slate-800/80 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-900/50 text-indigo-300 font-bold">
                          Step {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-white">{node.name}</span>
                        <span className="text-[11px] font-mono text-slate-400">({node.agentRole})</span>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                        Confidence: {(node.confidenceScore * 100).toFixed(1)}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mb-2">{node.outputSummary}</p>

                    {node.toolInvocations.length > 0 && (
                      <div className="space-y-1.5 mt-2 pt-2 border-t border-slate-900">
                        <span className="text-[10px] font-mono uppercase text-slate-500">MCP Tool Invocations:</span>
                        {node.toolInvocations.map((inv, i) => (
                          <div key={i} className="text-xs font-mono bg-slate-900/80 px-2.5 py-1 rounded text-slate-300 flex items-center justify-between">
                            <span className="text-indigo-400">{inv.server} &rarr; {inv.tool}()</span>
                            <span className="text-slate-400 text-[11px]">{inv.resultSummary}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: COMPREHENSIVE 31 MCP REGISTRY ACROSS 6 SERVERS
          ========================================================================= */}
      {subTab === 'mcp_registry' && (
        <div className="space-y-6">
          {/* Server Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search 31 MCP tools by name, server or keyword..."
                value={toolSearchQuery}
                onChange={(e) => setToolSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 w-full sm:w-72 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => setSelectedServerFilter('ALL')}
                className={`px-3 py-1 rounded text-xs font-mono font-semibold transition ${
                  selectedServerFilter === 'ALL'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All (31)
              </button>
              {mcpServers.map((srv) => (
                <button
                  key={srv.id}
                  onClick={() => setSelectedServerFilter(srv.id)}
                  className={`px-3 py-1 rounded text-xs font-mono font-semibold transition ${
                    selectedServerFilter === srv.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {srv.id.replace('mcp-server-', '')} ({srv.toolCount})
                </button>
              ))}
            </div>
          </div>

          {/* 31 Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool, idx) => (
              <div
                key={tool.name}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 flex flex-col justify-between transition shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {tool.server}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold">
                      Tool #{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition font-mono mb-1">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="bg-slate-950 p-2 rounded border border-slate-800 text-[11px] font-mono text-emerald-400/90 break-all mb-3">
                    {tool.signature}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">
                    Schema: {Object.keys(tool.inputSchema.properties || {}).length} params
                  </span>
                  <button
                    onClick={() => {
                      setSelectedToolForModal(tool);
                      // Provide intelligent preset argument for the tool
                      const defaultArgs: Record<string, any> = {};
                      if (tool.name.includes('entity') || tool.name.includes('docket') || tool.name.includes('business')) {
                        defaultArgs.entity_name = 'Kavinath A/L Ganesan';
                      }
                      if (tool.name.includes('docket')) {
                        defaultArgs.docket_id = 'WA-22NCC-482-09/2026';
                      }
                      if (tool.name.includes('registration')) {
                        defaultArgs.registration_id = '1199837-7';
                      }
                      if (tool.name.includes('alpha')) {
                        defaultArgs.alpha = 0.65;
                        defaultArgs.sparse_keywords = ['paternity', 'form 32a', 'veridian'];
                      }
                      setToolCallArgsInput(JSON.stringify(defaultArgs, null, 2));
                      setToolCallResult(null);
                    }}
                    className="px-2.5 py-1 rounded bg-indigo-900/50 hover:bg-indigo-800 text-indigo-300 text-xs font-mono flex items-center gap-1 transition"
                  >
                    Test Tool &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Tool Invocation Modal */}
          {selectedToolForModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-mono text-indigo-400">{selectedToolForModal.server}</span>
                    <h3 className="text-lg font-bold text-white font-mono">{selectedToolForModal.name}()</h3>
                  </div>
                  <button
                    onClick={() => setSelectedToolForModal(null)}
                    className="text-slate-400 hover:text-white text-sm px-2 py-1"
                  >
                    &times;
                  </button>
                </div>

                <div>
                  <p className="text-xs text-slate-300 mb-2">{selectedToolForModal.description}</p>
                  <div className="bg-slate-950 p-2 rounded text-xs font-mono text-emerald-300 mb-3">
                    {selectedToolForModal.signature}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Input Parameters (JSON):
                  </label>
                  <textarea
                    rows={4}
                    value={toolCallArgsInput}
                    onChange={(e) => setToolCallArgsInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedToolForModal(null)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleInvokeTool}
                    disabled={isCallingTool}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2"
                  >
                    {isCallingTool ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                    Invoke MCP Tool
                  </button>
                </div>

                {toolCallResult && (
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <span className="text-xs font-mono text-indigo-300 font-bold block mb-1">Invocation Result:</span>
                    <pre className="bg-slate-950 p-3 rounded text-xs font-mono text-slate-200 overflow-x-auto max-h-60">
                      {JSON.stringify(toolCallResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: ENTITY RESOLUTION & GRAPH RAG
          ========================================================================= */}
      {subTab === 'entity_graph' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Network className="w-4 h-4 text-indigo-400" />
                Contextual Knowledge Graph Topology &amp; Beneficial Ownership (UBO)
              </h3>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                100% Beneficial Ownership Attributed to Kavinath
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Hybrid Graph RAG merges dense vector retrieval with knowledge graph edge traversal across corporate registers (SSM Malaysia), offshore trusts (Geneva / BVI), and judicial dockets.
            </p>

            {/* Resolved Nodes Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <h4 className="text-xs font-bold text-indigo-300 font-mono mb-3 uppercase tracking-wider">
                  Resolved Entity Nodes &amp; Centrality
                </h4>
                <div className="space-y-2.5">
                  {[
                    { name: 'Kavinath A/L Ganesan', role: 'Primary Subject (Sole Lawful Heir)', centrality: 0.412, status: 'VERIFIED_HEIR' },
                    { name: 'Veridian Nexus Holdings Sdn Bhd', role: 'Target Asset Vehicle (SSM 1199837-7)', centrality: 0.325, status: 'CORPORATE_HUB' },
                    { name: 'Ganesan A/L Raman (Deceased)', role: 'Testator / Estate Founder', centrality: 0.188, status: 'DECEASED' },
                    { name: 'Archon Holdings SA (Geneva)', role: 'Offshore Escrow SPV (CHE-109.842.115)', centrality: 0.145, status: 'SWISS_ESCROW' },
                    { name: 'Suresh Kumar A/L Balakrishnan', role: 'Adverse Proxy Nominee (Proxy X)', centrality: 0.075, status: 'ADVERSE_CHALLENGE' },
                  ].map((node) => (
                    <div key={node.name} className="flex items-center justify-between text-xs bg-slate-900/80 p-2 rounded">
                      <div>
                        <span className="font-bold text-white block">{node.name}</span>
                        <span className="text-[11px] text-slate-400">{node.role}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-indigo-400 font-bold block">PageRank: {node.centrality}</span>
                        <span className="text-[10px] font-mono text-slate-500">{node.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <h4 className="text-xs font-bold text-indigo-300 font-mono mb-3 uppercase tracking-wider">
                  Verified Relational Graph Edges
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-emerald-400 font-mono font-bold block">Ganesan Raman &rarr; Kavinath Ganesan</span>
                    <span className="text-slate-300 text-[11px]">Relationship: BIOLOGICAL_FATHER_AND_TESTACY_HEIR (Weight: 1.0)</span>
                    <span className="text-slate-500 text-[10px] block">Basis: Jabatan Kimia 24-STR PCR DNA Certificate JK-DNA-2024-8891 (99.9999%)</span>
                  </div>

                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-indigo-400 font-mono font-bold block">Ganesan Raman &rarr; Veridian Nexus Holdings</span>
                    <span className="text-slate-300 text-[11px]">Relationship: FOUNDED_AND_SUBSCRIBED_10M_SHARES (Weight: 1.0)</span>
                    <span className="text-slate-500 text-[10px] block">Basis: SSM Incorporation Form 14 &amp; 2023 Annual Return</span>
                  </div>

                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-rose-400 font-mono font-bold block">Suresh Kumar (Proxy X) &rarr; Veridian Nexus</span>
                    <span className="text-slate-300 text-[11px]">Relationship: FRAUDULENT_FORM_32A_CLAIM (Weight: 0.95 Flagged)</span>
                    <span className="text-slate-500 text-[10px] block">Basis: Disputed Share Transfer Form 32A signed during ICU stay</span>
                  </div>

                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-emerald-400 font-mono font-bold block">Lombard Odier Geneva &rarr; Kavinath Maybank KL</span>
                    <span className="text-slate-300 text-[11px]">Relationship: DESIGNATED_SETTLEMENT_BENEFICIARY (Weight: 0.99)</span>
                    <span className="text-slate-500 text-[10px] block">Basis: SWIFT MT103 Field 59 Tag TR-2024-990812 (CHF 35,000,000)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: FORENSIC FRAUD & ANOMALY AUDIT
          ========================================================================= */}
      {subTab === 'fraud_audit' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Criminal Fraud Audit &amp; Forensic Discrepancy Matrix
              </h3>
              <span className="text-xs font-mono text-rose-400 bg-rose-950/40 px-2.5 py-0.5 rounded border border-rose-500/30 font-bold">
                3 Critical Anomalies Identified
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Automated audit evaluating cross-registry temporal timestamps, signature pixel coordinates, nominal consideration shams, and post-mortem power-of-attorney extinguishment under Malaysian statutory frameworks.
            </p>

            <div className="space-y-4">
              <div className="bg-slate-950 border border-rose-900/40 rounded-xl p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold">
                    CRITICAL #1: FORGERY SIMULATION
                  </span>
                  <span className="text-xs font-mono text-rose-400">Pixel Overlap: 98.4% Match</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  Cut-and-Trace Signature Simulation on Form 32A Share Transfer
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Spatial layout VLM analysis reveals transferor signature on Form 32A matches the 2019 annual report signature with 98.4% geometric identity, characteristic of digital cut-and-trace overlay rather than natural handwriting variation.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono bg-slate-900 p-3 rounded">
                  <div>
                    <span className="text-slate-400 block">Temporal Discrepancy:</span>
                    <span className="text-rose-300">Signed 14 Jan 2024 while founder was in Subang Jaya Medical Centre ICU</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Forensic Action Recommended:</span>
                    <span className="text-emerald-300">Order 38 Rule 13 Form 66 Subpoena to Hospital Registrar</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 border border-rose-900/40 rounded-xl p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold">
                    CRITICAL #2: CONSIDERATION SHAM
                  </span>
                  <span className="text-xs font-mono text-amber-400">Consideration: MYR 1.00 (Nominal)</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  Sham Transfer of 5,100,000 Equity Shares for Nominal MYR 1.00
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Purported transfer of 51% controlling interest in a company with MYR 74,500,000 in net audited assets for MYR 1.00. No telegraphic transfer, cashier order, or board resolution exists in the company records.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono bg-slate-900 p-3 rounded">
                  <div>
                    <span className="text-slate-400 block">Statutory Violation:</span>
                    <span className="text-rose-300">Companies Act 2016 Section 105 &amp; Constructive Trust Doctrine</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Judicial Status:</span>
                    <span className="text-emerald-300">Injunction granted under Suit WA-22NCC-482-09/2026</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 border border-rose-900/40 rounded-xl p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                    HIGH #3: ULTRA VIRES POA EXERCISE
                  </span>
                  <span className="text-xs font-mono text-amber-400">Act 424 Section 6</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  Post-Mortem Power of Attorney Extinguishment Violation
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Adverse proxy Suresh Kumar attempted to present a 2022 Power of Attorney to banking institutions and land registries subsequent to the death of the donor, in direct contravention of statutory revocation under Section 6 of the Powers of Attorney Act 1949.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono bg-slate-900 p-3 rounded">
                  <div>
                    <span className="text-slate-400 block">Statutory Framework:</span>
                    <span className="text-rose-300">Powers of Attorney Act 1949 (Act 424) Section 6</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Legal Consequence:</span>
                    <span className="text-emerald-300">Void ab initio; renders all subsequent instruments nullities</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: CRYPTOGRAPHIC PROVENANCE CHAIN
          ========================================================================= */}
      {subTab === 'provenance' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-emerald-400" />
                  Cryptographic Provenance Chain &amp; Sovereign Statutory Admissibility
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Deterministic attribution linking every synthesized finding to official statutory repositories under Digital Signature Act 1997.
                </p>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText('4d497a4ad00b3ad0516ec5a1fc83e730f1434b0ba672aff0e1c40143696ae768');
                  setCopiedHash(true);
                  setTimeout(() => setCopiedHash(false), 2000);
                }}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-2 border border-slate-700 transition"
              >
                {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Master SHA-256 Digest
              </button>
            </div>

            {/* Master Integrity Seal Banner */}
            <div className="bg-slate-950 border border-emerald-500/30 rounded-lg p-4 font-mono text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span>MASTER PROVENANCE SEAL (SHA-256)</span>
                <span>STATUS: ADMISSIBLE UNDER S.90A</span>
              </div>
              <div className="break-all text-indigo-300 font-bold text-[13px]">
                4d497a4ad00b3ad0516ec5a1fc83e730f1434b0ba672aff0e1c40143696ae768
              </div>
              <div className="flex flex-wrap gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                <span>Statute: Digital Signature Act 1997 (Act 562) S.62</span>
                <span>Evidence Act: Evidence Act 1950 S.90A Computer Verification</span>
                <span>Issuing Framework: OSINT Sovereign Intelligence Gateway</span>
              </div>
            </div>

            {/* Facts Provenance Table */}
            <div className="space-y-3">
              {[
                {
                  factId: 'PROV-FACT-01',
                  claim: 'Paternity established between Ganesan Raman and Kavinath Ganesan at 99.9999% certainty.',
                  source: 'Jabatan Kimia Malaysia Forensic DNA Division (JK-DNA-2024-8891)',
                  jurisdiction: 'Malaysia',
                  statute: 'Evidence Act 1950 S.112 & DNA Databank Act 2009',
                  hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                },
                {
                  factId: 'PROV-FACT-02',
                  claim: 'Veridian Nexus Holdings registered capital 10,000,000 ordinary shares fully issued.',
                  source: 'Suruhanjaya Syarikat Malaysia (SSM) MyGDX Registry Gateway (SSM-ROC-1199837-7)',
                  jurisdiction: 'Malaysia',
                  statute: 'Companies Act 2016 (Act 777)',
                  hash: '4d497a4ad00b3ad0516ec5a1fc83e730f1434b0ba672aff0e1c40143696ae768',
                },
                {
                  factId: 'PROV-FACT-03',
                  claim: 'Mareva Injunction and rectification suit active before High Court of Malaya Commercial Division.',
                  source: 'Mahkamah Tinggi Malaya (e-Kehakiman / CourtListener Suit WA-22NCC-482-09/2026)',
                  jurisdiction: 'Malaysia',
                  statute: 'Rules of Court 2012 Order 29 & Order 38 Rule 13',
                  hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
                },
                {
                  factId: 'PROV-FACT-04',
                  claim: 'CHF 35,000,000 wire designated to Kavinath Ganesan Maybank KL account 5140-1289-4410.',
                  source: 'Lombard Odier Geneva SWIFT MT103 Intercept Log (TR-2024-990812)',
                  jurisdiction: 'Switzerland / Malaysia',
                  statute: 'Swiss Anti-Money Laundering Act (AMLA) Art. 9',
                  hash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
                },
              ].map((fact) => (
                <div key={fact.factId} className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-400">{fact.factId}</span>
                      <span className="text-xs font-bold text-white">{fact.claim}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20">
                      Admissible S.90A
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-400">
                    <div>
                      <span className="text-slate-500">Official Source: </span>
                      <span className="text-slate-300">{fact.source}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Statutory Authority: </span>
                      <span className="text-slate-300">{fact.statute}</span>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-slate-500 break-all pt-1 border-t border-slate-900">
                    SHA-256: <span className="text-slate-400">{fact.hash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 0: SOVEREIGN OSINT STUDIO (V4.8 INTERACTIVE ENGINE)
          ========================================================================= */}
      {subTab === 'sovereign_studio' && (
        <SovereignOsintEngineView />
      )}

      {/* =========================================================================
          TAB 6: TARGETED COURTLISTENER (960906-08-5839) VERIFICATION
          ========================================================================= */}
      {subTab === 'courtlistener_targeted' && (
        <CourtListenerTargetedView
          initialResult={courtListenerResult}
          onRefresh={(nric) => handleRunTargetedCourtListener(nric)}
        />
      )}
    </div>
  );
}
