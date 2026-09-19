import React, { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  Terminal,
  Server,
  Play,
  Copy,
  Check,
  RefreshCw,
  FolderPlus,
  Layers,
  Code2,
  FileText,
  ShieldCheck,
  Zap,
  Globe,
  Database,
  ArrowRightLeft,
  Sparkles,
  AlertCircle,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Brain,
  Sliders,
  Settings2,
} from 'lucide-react';
import type { TargetAppFormat } from '../server/agentOrchestratorService';
import { AiCodeWorkbench } from './AiCodeWorkbench';
import { McpToolsTester } from './McpToolsTester';

interface TelemetryLog {
  id: string;
  time: string;
  status: string;
  active_nodes: number;
  event: string;
  raw: string;
}

interface ToolCallLogEntry {
  toolName: string;
  args: Record<string, unknown>;
  timestamp: string;
  durationMs: number;
  status: 'SUCCESS' | 'ERROR';
  resultPreview: string;
  fullResult?: any;
}

interface AutonomousAgentResponse {
  text: string;
  modelUsed: string;
  toolCallsExecuted: ToolCallLogEntry[];
  totalTurns: number;
  durationMs: number;
  codeBlocks?: Array<{ language: string; code: string; title?: string }>;
}

const AUTONOMOUS_PRESETS = [
  {
    label: '2017 Geneva Veridian Settlement Forensic Audit',
    prompt:
      'Investigate the 2017 Geneva Veridian settlement for Kavinath A/L Ganesan (960906085839). Query CourtListener for relevant dockets and opinions, reconcile corporate entities in SSM, and generate an Evidence Act 1950 Section 90A tamper-evident certificate in TypeScript.',
  },
  {
    label: 'SSM & ICIJ Offshore Asset Tracing',
    prompt:
      'Reconcile Kavinath Holdings Sdn. Bhd. (SSM 1199837-7) with ICIJ Offshore Leaks for Archon Holdings SA and Veridian Trust. Check director disqualification status for Suresh Kumar A/L Balakrishnan and produce a SWIFT MT103 wire validator script.',
  },
  {
    label: 'High Court Malaya Cause Paper Verification',
    prompt:
      'Audit Commercial Division Suit WA-22NCC-482-09/2026 under Malaysian Evidence Act Section 90A and Rules of Court 2012 Form 66. Write a production TypeScript MyGDX HMAC-SHA256 request signer.',
  },
];

const PRESET_INPUTS: { label: string; format: TargetAppFormat; icon: React.ReactNode; text: string }[] = [
  {
    label: 'Python/FastAPI Script',
    format: 'EXPRESS_TYPESCRIPT_CODE',
    icon: <Code2 className="w-3.5 h-3.5 text-indigo-400" />,
    text: `@app.post("/api/v1/agent/execute")
async def execute_agent_workflow(payload: QueryPayload):
    context_aggregations = {}
    for server_url in payload.mcp_servers:
        res = await mcp_manager.query_mcp_node(server_url, {"query": payload.prompt})
        context_aggregations[server_url] = res

    async def event_generator():
        async for chunk in simulate_genai_stream(payload.prompt, context_aggregations):
            yield chunk

    return StreamingResponse(event_generator(), media_type="text/event-stream")`,
  },
  {
    label: 'Court Docket / RECAP Opinion',
    format: 'COURT_JUDICIAL_DOCKET',
    icon: <FileText className="w-3.5 h-3.5 text-amber-400" />,
    text: `OPINION FILED: In the High Court of Malaya at Kuala Lumpur, Commercial Division. Suit No. WA-22NCC-482-09/2026. Plaintiff: Kavinath A/L Ganesan vs Defendant: Nominee Suresh Kumar. Ruling on interlocutory injunction regarding USD 35M Veridian escrow proceeds. Found that Evidence Act 1950 Section 90A certificate strictly satisfies burden of electronic record integrity.`,
  },
  {
    label: 'SWIFT MT103 Wire Audit',
    format: 'EVIDENCE_DOSSIER_EXHIBIT',
    icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
    text: `SWIFT MT103 LOG: SENDER: LOMBARD ODIER GENEVA (SWISS PRIV BANK) BIC: LOCHCHGGXXX // FIELD 20: TR-2024-990812 // FIELD 32A: 240315USD35000000,00 // FIELD 50K: ARCHON HOLDINGS SA // FIELD 59: KAVINATH GANESAN MAYBANK KL ACC 5140-1289-4410 // DISPUTE: ROGUE MT199 DIVERSION ATTEMPT BY NOMINEE S.KUMAR INTERCEPTED.`,
  },
  {
    label: 'Raw JSON Ingestion',
    format: 'SSM_MYGDX_STATUTORY',
    icon: <Database className="w-3.5 h-3.5 text-blue-400" />,
    text: `{
  "target_company": "Kavinath Holdings Sdn. Bhd.",
  "registration_no": "1199837-7",
  "incorporation": "2020-04-12",
  "shareholders": [
    { "name": "Kavinath A/L Ganesan", "nric": "950812-14-5923", "ordinary_shares": 10000000, "voting_power": "100%" }
  ],
  "disputed_proxy": { "name": "Suresh Kumar A/L Balakrishnan", "claimed_equity": "50%", "status": "REBUTTED_UNDER_S4C" }
}`,
  },
];

export const EnterpriseGenAiMcpConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'autonomous' | 'codes' | 'mcp_tester' | 'stream'>('autonomous');

  // Autonomous Agent State
  const [agentPrompt, setAgentPrompt] = useState<string>(AUTONOMOUS_PRESETS[0].prompt);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [thinkingLevel, setThinkingLevel] = useState<'HIGH' | 'LOW'>('HIGH');
  const [enableMcpTools, setEnableMcpTools] = useState<boolean>(true);
  const [isAgentExecuting, setIsAgentExecuting] = useState<boolean>(false);
  const [agentResponse, setAgentResponse] = useState<AutonomousAgentResponse | null>(null);
  const [expandedToolIndex, setExpandedToolIndex] = useState<number | null>(null);

  // SSE Stream State
  const [streamPrompt, setStreamPrompt] = useState<string>(PRESET_INPUTS[0].text);
  const [targetFormat, setTargetFormat] = useState<TargetAppFormat>('AUTO');
  const [selectedServers, setSelectedServers] = useState<string[]>([
    'http://localhost:3000/mcp',
    'courtlistener-recap-node',
    'mygdx-ssm-gateway',
    'icij-offshore-node',
  ]);
  const [serverInput, setServerInput] = useState('');
  const [streamingOutput, setStreamingOutput] = useState('');
  const [isExecutingStream, setIsExecutingStream] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>([]);
  const [copied, setCopied] = useState(false);
  const [dossierAttached, setDossierAttached] = useState<string | null>(null);
  const [isAttaching, setIsAttaching] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const [consoleError, setConsoleError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const outputBoxRef = useRef<HTMLDivElement | null>(null);

  // Periodic telemetry polling / heartbeat
  useEffect(() => {
    let mounted = true;

    const pollTelemetry = async () => {
      try {
        const res = await fetch('/api/v1/telemetry?echo=heartbeat_poll');
        if (res.ok) {
          const data = await res.json();
          if (mounted) {
            setIsConnected(true);
            const newLog: TelemetryLog = {
              id: Math.random().toString(36).substring(2, 9),
              time: new Date().toLocaleTimeString(),
              status: data.status || 'healthy',
              active_nodes: data.active_nodes || 4,
              event: 'MCP Node Ping OK',
              raw: JSON.stringify({
                status: data.status,
                active_nodes: data.active_nodes,
                tools: data.connected_mcp_tools,
                uptime: `${data.uptime_seconds}s`,
                echo: data.echo,
              }),
            };
            setTelemetryLogs((prev) => [newLog, ...prev.slice(0, 7)]);
          }
        } else {
          if (mounted) setIsConnected(false);
        }
      } catch {
        if (mounted) setIsConnected(false);
      }
    };

    pollTelemetry();
    const interval = setInterval(pollTelemetry, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Auto-scroll streaming output box
  useEffect(() => {
    if (outputBoxRef.current) {
      outputBoxRef.current.scrollTop = outputBoxRef.current.scrollHeight;
    }
  }, [streamingOutput]);

  // Execute Autonomous Agent
  const handleRunAutonomousAgent = async () => {
    if (!agentPrompt.trim() || isAgentExecuting) return;

    setIsAgentExecuting(true);
    setAgentResponse(null);
    setExpandedToolIndex(null);
    setDossierAttached(null);

    try {
      const res = await fetch('/api/v1/ai/agent/autonomous', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: agentPrompt,
          model: selectedModel,
          thinkingLevel,
          enableMcpTools,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setAgentResponse(data.data);
        setConsoleError(null);
      } else {
        setConsoleError(`Autonomous agent error: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      setConsoleError(`Network error: ${err.message}`);
    } finally {
      setIsAgentExecuting(false);
    }
  };

  // Execute SSE Stream Pipeline
  const handleExecutionStream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamPrompt.trim() || isExecutingStream) return;

    setIsExecutingStream(true);
    setStreamingOutput('');
    setDossierAttached(null);
    setTokenCount(0);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/v1/agent/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: streamPrompt,
          session_id: `sess-enterprise-${Math.floor(10 + Math.random() * 90)}`,
          mcp_servers: selectedServers,
          target_format: targetFormat,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) {
        throw new Error('No readable stream available in response');
      }

      let count = 0;
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const dataContent = trimmed.substring(5).trim();
          if (dataContent === '[DONE]') break;

          try {
            const parsed = JSON.parse(dataContent);
            if (parsed.token) {
              setStreamingOutput((prev) => prev + parsed.token);
              count++;
              setTokenCount(count);
            }
          } catch {
            // Raw text fallback
            setStreamingOutput((prev) => prev + dataContent);
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setStreamingOutput((prev) => prev + `\n[Stream Error: ${err.message}]`);
      }
    } finally {
      setIsExecutingStream(false);
      abortControllerRef.current = null;
    }
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAttachToDossier = async (content: string, title: string, tag: string) => {
    if (!content || isAttaching) return;
    setIsAttaching(true);
    try {
      const res = await fetch('/api/v1/agent/attach-to-dossier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${title} (${new Date().toLocaleDateString()})`,
          content,
          formatTag: tag,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDossierAttached(data.data?.document?.serialOrRegistrationNo || 'SEALED & ATTACHED');
        setConsoleError(null);
      } else {
        setConsoleError(`Failed to attach: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      setConsoleError(`Failed to attach to dossier: ${err.message}`);
    } finally {
      setIsAttaching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Navigation Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        {consoleError && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <span>⚠ {consoleError}</span>
            <button onClick={() => setConsoleError(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
          </div>
        )}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Enterprise GenAI Orchestrator &amp; MCP Integration Suite
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  +mcp +ai +codes
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Autonomous Gemini Function Calling, 13 Model Context Protocol tools, and TypeScript statutory code synthesizer.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className="font-medium">{isConnected ? 'MCP Gateway Connected' : 'Connecting...'}</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('autonomous')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  activeTab === 'autonomous'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autonomous Agent</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('codes')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  activeTab === 'codes'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>AI Code Workbench (+codes)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('mcp_tester')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  activeTab === 'mcp_tester'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>MCP Tools (13)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('stream')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  activeTab === 'stream'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Universal Rewriter (SSE)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Sub-header Info based on active tab */}
        <div className="pt-3 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4 flex-wrap">
            <span>
              Primary Model: <strong className="text-indigo-300 font-mono">gemini-3.8-flash</strong>
            </span>
            <span>•</span>
            <span>
              SDK Engine: <strong className="text-slate-200">@google/genai (v2.4.0)</strong>
            </span>
            <span>•</span>
            <span>
              Statutory Custody: <strong className="text-emerald-400">Evidence Act 1950 S.90A</strong>
            </span>
          </div>

          <div className="text-[11px] font-mono text-slate-500 hidden sm:block">
            Transport: Internal JSON-RPC 2.0 &amp; SSE Stream
          </div>
        </div>
      </div>

      {/* TAB 1: Autonomous GenAI Agent */}
      {activeTab === 'autonomous' && (
        <div className="space-y-6">
          {/* Agent Configuration and Prompt Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Autonomous Multi-Turn Agent with Native MCP Tool Calling
                </h3>
              </div>

              {/* Model & Thinking Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs">
                  <span className="text-slate-400 text-[11px]">Model:</span>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="bg-transparent text-indigo-300 font-mono text-xs outline-none cursor-pointer"
                  >
                    <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended)</option>
                    <option value="gemini-flash-latest">gemini-flash-latest</option>
                    <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite</option>
                    <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Deep)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs">
                  <span className="text-slate-400 text-[11px]">Thinking:</span>
                  <select
                    value={thinkingLevel}
                    onChange={(e) => setThinkingLevel(e.target.value as any)}
                    className="bg-transparent text-emerald-300 font-mono text-xs outline-none cursor-pointer"
                  >
                    <option value="HIGH">HIGH (Deep Judicial Reasoning)</option>
                    <option value="LOW">LOW (Fast Response)</option>
                  </select>
                </div>

                <label className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={enableMcpTools}
                    onChange={(e) => setEnableMcpTools(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>Enable MCP Tools</span>
                </label>
              </div>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-400 text-[11px] font-semibold">Quick Investigations:</span>
              {AUTONOMOUS_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAgentPrompt(p.prompt)}
                  className="px-2.5 py-1 rounded-md bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] transition truncate max-w-xs"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Prompt input */}
            <div className="relative">
              <textarea
                value={agentPrompt}
                onChange={(e) => setAgentPrompt(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 text-xs font-mono outline-none focus:border-indigo-500 resize-none selection:bg-indigo-500/30"
                placeholder="Instruct the autonomous agent with tasks, queries, or code synthesis targets..."
              />
              <button
                type="button"
                onClick={handleRunAutonomousAgent}
                disabled={isAgentExecuting || !agentPrompt.trim()}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${isAgentExecuting ? 'animate-spin' : ''}`} />
                <span>{isAgentExecuting ? 'Agent Reasoning...' : 'Run Autonomous Agent'}</span>
              </button>
            </div>
          </div>

          {/* Results: Tool Execution Trace & Synthesized Output */}
          {agentResponse ? (
            <div className="space-y-6">
              {/* Tool Calls Execution Trace */}
              {agentResponse.toolCallsExecuted && agentResponse.toolCallsExecuted.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Autonomous MCP Tool Invocations ({agentResponse.toolCallsExecuted.length})
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      Executed across {agentResponse.totalTurns} Agent Turns
                    </span>
                  </div>

                  <div className="space-y-2">
                    {agentResponse.toolCallsExecuted.map((toolCall, idx) => {
                      const isExpanded = expandedToolIndex === idx;
                      return (
                        <div
                          key={idx}
                          className="bg-slate-950 border border-slate-800/90 rounded-lg overflow-hidden transition"
                        >
                          <button
                            type="button"
                            onClick={() => setExpandedToolIndex(isExpanded ? null : idx)}
                            className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-900/60 transition"
                          >
                            <div className="flex items-center gap-2.5">
                              {isExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                              )}
                              <span className="font-mono text-xs text-indigo-300 font-semibold">
                                {toolCall.toolName}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                                {toolCall.durationMs}ms
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-500">{toolCall.timestamp}</span>
                              <span
                                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                  toolCall.status === 'SUCCESS'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                }`}
                              >
                                {toolCall.status}
                              </span>
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="p-3 bg-slate-950/90 border-t border-slate-800/70 text-xs font-mono space-y-2">
                              <div>
                                <span className="text-[11px] text-slate-500 block mb-0.5">Arguments:</span>
                                <pre className="p-2 rounded bg-slate-900 text-slate-300 text-[11px] overflow-auto">
                                  {JSON.stringify(toolCall.args, null, 2)}
                                </pre>
                              </div>
                              <div>
                                <span className="text-[11px] text-slate-500 block mb-0.5">Full Response:</span>
                                <pre className="p-2 rounded bg-slate-900 text-slate-300 text-[11px] max-h-56 overflow-auto">
                                  {JSON.stringify(toolCall.fullResult || toolCall.resultPreview, null, 2)}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Synthesized Response View */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-slate-300">Grounded Agent Synthesis</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {agentResponse.modelUsed}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {agentResponse.durationMs}ms
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(agentResponse.text)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleAttachToDossier(
                          agentResponse.text,
                          'Autonomous GenAI Agent Forensic Synthesis',
                          'AGENT_SYNTHESIS'
                        )
                      }
                      disabled={isAttaching}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-xs transition disabled:opacity-40"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      <span>{isAttaching ? 'Attaching...' : 'Attach to Dossier'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-5 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[600px] overflow-auto bg-slate-950">
                  {agentResponse.text}
                </div>

                {dossierAttached && (
                  <div className="px-4 py-2.5 bg-emerald-950/40 border-t border-emerald-800/40 text-emerald-300 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Synthesis successfully sealed into Evidence Dossier
                    </span>
                    <span className="font-mono text-[11px] bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/50">
                      {dossierAttached}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-xl p-10 text-center space-y-2">
              <Brain className="w-10 h-10 mx-auto text-slate-600" />
              <h4 className="text-sm font-semibold text-slate-300">Autonomous Agent Ready</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Select a preset or enter a prompt above to initiate autonomous multi-turn reasoning with live MCP tool calling and statutory code validation.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AI Code Workbench (+codes) */}
      {activeTab === 'codes' && <AiCodeWorkbench />}

      {/* TAB 3: MCP Tools (13) */}
      {activeTab === 'mcp_tester' && <McpToolsTester />}

      {/* TAB 4: Universal Rewriter (SSE Stream) */}
      {activeTab === 'stream' && (
        <div className="space-y-6">
          {/* Top Config Row */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Anything-to-Anything Rewriter &amp; SSE Stream
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Target App Format:</span>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value as TargetAppFormat)}
                  className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-indigo-300 font-mono outline-none"
                >
                  <option value="AUTO">AUTO (Detect &amp; Normalize)</option>
                  <option value="EXPRESS_TYPESCRIPT_CODE">TypeScript Express Service Code</option>
                  <option value="FORM_66_SUBPOENA">Court Order 38 Form 66 Subpoena</option>
                  <option value="SECTION_90A_CERT">Evidence Act S.90A Certificate</option>
                  <option value="COURT_JUDICIAL_DOCKET">CourtListener Judicial Docket</option>
                  <option value="SSM_MYGDX_STATUTORY">MyGDX SSM Statutory Record</option>
                  <option value="EVIDENCE_DOSSIER_EXHIBIT">Evidence Dossier Exhibit (SWIFT/Wire)</option>
                  <option value="MCP_JSONRPC_PACKET">MCP JSON-RPC Packet</option>
                </select>
              </div>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400">Input Presets:</span>
              {PRESET_INPUTS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setStreamPrompt(p.text);
                    setTargetFormat(p.format);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs transition"
                >
                  {p.icon}
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Prompt input */}
            <form onSubmit={handleExecutionStream} className="relative">
              <textarea
                value={streamPrompt}
                onChange={(e) => setStreamPrompt(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 text-xs font-mono outline-none focus:border-indigo-500 resize-none selection:bg-indigo-500/30"
                placeholder="Input any unstructured content, raw JSON, legacy code, or court ruling..."
              />
              <button
                type="submit"
                disabled={isExecutingStream || !streamPrompt.trim()}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${isExecutingStream ? 'animate-spin' : ''}`} />
                <span>{isExecutingStream ? 'Streaming SSE...' : 'Stream Output'}</span>
              </button>
            </form>
          </div>

          {/* Streaming Output Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-slate-300">Live SSE Stream Output</span>
                {tokenCount > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {tokenCount} tokens
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(streamingOutput)}
                  disabled={!streamingOutput}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition disabled:opacity-40"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleAttachToDossier(
                      streamingOutput,
                      `Rewritten Exhibit: ${targetFormat}`,
                      targetFormat
                    )
                  }
                  disabled={!streamingOutput || isAttaching}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-xs transition disabled:opacity-40"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>{isAttaching ? 'Attaching...' : 'Attach to Dossier'}</span>
                </button>
              </div>
            </div>

            <div
              ref={outputBoxRef}
              className="p-4 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap h-96 overflow-auto bg-slate-950"
            >
              {streamingOutput || (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                  <Terminal className="w-8 h-8 text-slate-600" />
                  <p>Submit input to stream tailored output formatted for judicial compliance.</p>
                </div>
              )}
            </div>

            {dossierAttached && (
              <div className="px-4 py-2.5 bg-emerald-950/40 border-t border-emerald-800/40 text-emerald-300 text-xs flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Exhibit successfully sealed into Evidence Dossier
                </span>
                <span className="font-mono text-[11px] bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/50">
                  {dossierAttached}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
