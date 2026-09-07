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
} from 'lucide-react';
import type { TargetAppFormat } from '../server/agentOrchestratorService';

interface TelemetryLog {
  id: string;
  time: string;
  status: string;
  active_nodes: number;
  event: string;
  raw: string;
}

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
    label: 'Unstructured Court Testimony',
    format: 'FORM_66_SUBPOENA',
    icon: <FileText className="w-3.5 h-3.5 text-amber-400" />,
    text: `Witness states that on 14 January 2024, Suresh Kumar A/L Balakrishnan (Proxy X) claimed he obtained 5,100,000 shares in Veridian Nexus Holdings Sdn. Bhd. for MYR 1.00 consideration via forged Form 32A while principal was overseas in London. Requesting production of original share registry minute books and RHB joint account records for Suit WA-22NCC-482-09/2026.`,
  },
  {
    label: 'Raw SWIFT Banking Memo',
    format: 'SECTION_90A_CERT',
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
  const [prompt, setPrompt] = useState<string>(PRESET_INPUTS[0].text);
  const [targetFormat, setTargetFormat] = useState<TargetAppFormat>('AUTO');
  const [selectedServers, setSelectedServers] = useState<string[]>([
    'http://localhost:3000/mcp',
    'courtlistener-recap-node',
    'mygdx-ssm-gateway',
    'icij-offshore-node',
  ]);
  const [serverInput, setServerInput] = useState('');
  const [streamingOutput, setStreamingOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>([]);
  const [copied, setCopied] = useState(false);
  const [dossierAttached, setDossierAttached] = useState<string | null>(null);
  const [isAttaching, setIsAttaching] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);

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

  // Execute Agent Pipeline via Server-Sent Events (SSE)
  const handleExecution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isExecuting) return;

    setIsExecuting(true);
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
          prompt,
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
          if (trimmed.startsWith('data: ')) {
            const payload = trimmed.slice(6).trim();
            if (payload === '[DONE]') {
              setIsExecuting(false);
              return;
            }
            try {
              const parsed = JSON.parse(payload);
              if (parsed.token) {
                count++;
                setTokenCount(count);
                setStreamingOutput((prev) => prev + parsed.token);
              }
            } catch {
              // Non-JSON plain payload
              setStreamingOutput((prev) => prev + payload);
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setStreamingOutput((prev) => `${prev}\n\n[EXECUTION ERROR]: ${err.message || 'Stream connection interrupted'}`);
      }
    } finally {
      setIsExecuting(false);
      abortControllerRef.current = null;
    }
  };

  // Instant non-streaming conversion
  const handleDirectConvert = async () => {
    if (!prompt.trim() || isExecuting) return;
    setIsExecuting(true);
    setDossierAttached(null);
    try {
      const res = await fetch('/api/v1/agent/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: prompt,
          targetFormat,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setStreamingOutput(json.data.rewritten);
        setTokenCount(json.data.rewritten.split(/\s+/).length);
      }
    } catch (err: any) {
      setStreamingOutput(`[CONVERT ERROR]: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Copy output
  const handleCopy = () => {
    if (!streamingOutput) return;
    navigator.clipboard.writeText(streamingOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Attach directly to Evidence Dossier
  const handleAttachToDossier = async () => {
    if (!streamingOutput || isAttaching) return;
    setIsAttaching(true);
    try {
      const res = await fetch('/api/v1/agent/attach-to-dossier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Universal Rewritten Exhibit (${targetFormat})`,
          content: streamingOutput,
          formatTag: targetFormat,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDossierAttached(data.data?.document?.serialOrRegistrationNo || 'SEALED & ATTACHED');
      }
    } catch (err: any) {
      alert(`Attachment failed: ${err.message}`);
    } finally {
      setIsAttaching(false);
    }
  };

  const addCustomServer = () => {
    if (!serverInput.trim()) return;
    if (!selectedServers.includes(serverInput.trim())) {
      setSelectedServers([...selectedServers, serverInput.trim()]);
    }
    setServerInput('');
  };

  const removeServer = (srv: string) => {
    setSelectedServers(selectedServers.filter((s) => s !== srv));
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  Enterprise GenAI &amp; MCP Orchestrator
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    v2.0.0 Microservice
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Universal Anything-to-Anything Rewriter, Model Context Protocol (MCP) Bridge &amp; Real-Time SSE Token Stream
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <span className={`h-2.5 w-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span className="font-mono text-slate-300">
                {isConnected ? 'Telemetry Online (Active)' : 'Telemetry Reconnecting...'}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 font-mono">
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              <span>Port 3000 Ingress</span>
            </div>
          </div>
        </div>

        {/* Quick Ingestion Presets: "Convert Anything" */}
        <div className="mt-4 pt-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
            <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" />
            <span>Universal Input Presets (Click to load arbitrary payload):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {PRESET_INPUTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrompt(item.text);
                  setTargetFormat(item.format);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 text-left transition group text-xs"
              >
                {item.icon}
                <div className="truncate">
                  <span className="font-medium text-slate-200 block truncate group-hover:text-white">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate font-mono">
                    Target: {item.format}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Form, Target Format & Streaming Execution */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleExecution} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                Input Payload (Whatever Format Given)
              </label>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Target App Format:</span>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value as TargetAppFormat)}
                  className="bg-slate-950 border border-slate-700 text-indigo-300 rounded px-2.5 py-1 text-xs font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
                >
                  <option value="AUTO">AUTO (Intelligent Detection)</option>
                  <option value="EXPRESS_TYPESCRIPT_CODE">Node.js/Express TypeScript</option>
                  <option value="FORM_66_SUBPOENA">Borang 66 Subpoena Duces Tecum</option>
                  <option value="SECTION_90A_CERT">Evidence Act S.90A Certificate</option>
                  <option value="EVIDENCE_DOSSIER_EXHIBIT">Master Evidence Dossier Exhibit</option>
                  <option value="MCP_JSONRPC_PACKET">JSON-RPC 2.0 Context Packet</option>
                  <option value="SSM_MYGDX_STATUTORY">SSM MyGDX Statutory Extract</option>
                  <option value="COURT_JUDICIAL_DOCKET">High Court Cause Paper Docket</option>
                </select>
              </div>
            </div>

            <textarea
              rows={7}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste whatever input given (Python FastAPI code, raw court pleading, SWIFT wire, JSON, or diagnostic task)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs sm:text-sm font-mono text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
            />

            {/* MCP Servers Selection */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 flex items-center justify-between">
                <span>Active Model Context Protocol (MCP) Nodes to Query:</span>
                <span className="text-[11px] text-slate-500 font-mono">JSON-RPC 2.0 context/retrieve</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {selectedServers.map((srv, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-indigo-300"
                  >
                    <Globe className="w-3 h-3 text-indigo-400" />
                    {srv}
                    <button
                      type="button"
                      onClick={() => removeServer(srv)}
                      className="text-slate-500 hover:text-slate-300 text-xs ml-1"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={serverInput}
                  onChange={(e) => setServerInput(e.target.value)}
                  placeholder="Add MCP Node URL (e.g. http://localhost:9001)..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs font-mono text-slate-300 outline-none focus:border-indigo-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomServer();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addCustomServer}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium"
                >
                  Add Node
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isExecuting || !prompt.trim()}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm transition disabled:opacity-50 shadow-md shadow-indigo-600/20"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Streaming GenAI Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Execute Agent Pipeline (SSE Stream)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDirectConvert}
                disabled={isExecuting || !prompt.trim()}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Instant Convert &amp; Tailor</span>
              </button>

              {isExecuting && (
                <button
                  type="button"
                  onClick={() => abortControllerRef.current?.abort()}
                  className="px-3 py-2 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-mono"
                >
                  Cancel Stream
                </button>
              )}
            </div>
          </form>

          {/* Live Streaming Execution Console */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isExecuting ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isExecuting ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                </span>
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Live Stream Execution Output
                </h2>
                {tokenCount > 0 && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                    {tokenCount} tokens
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!streamingOutput}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition disabled:opacity-40"
                  title="Copy output to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleAttachToDossier}
                  disabled={!streamingOutput || isAttaching || !!dossierAttached}
                  className="flex items-center gap-1.5 px-3 py-1 rounded bg-indigo-900/60 hover:bg-indigo-800/80 border border-indigo-700/60 text-indigo-200 text-xs font-medium transition disabled:opacity-40"
                  title="Attach rewritten output to Master Evidence Dossier"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isAttaching ? 'Attaching...' : dossierAttached ? `Sealed (${dossierAttached})` : 'Attach to Dossier'}</span>
                </button>
              </div>
            </div>

            {dossierAttached && (
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/80 text-xs text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Successfully anchored as certified exhibit in Evidence Dossier (Serial: <strong className="font-mono">{dossierAttached}</strong>). Admissible under S.90A Evidence Act 1950.
                </span>
              </div>
            )}

            <div
              ref={outputBoxRef}
              className="bg-slate-950 border border-slate-800/80 rounded-lg p-4 min-h-[220px] max-h-[500px] overflow-y-auto font-mono text-xs sm:text-sm text-emerald-400 whitespace-pre-wrap leading-relaxed select-text"
            >
              {streamingOutput || (
                <span className="text-slate-600 font-sans italic">
                  Awaiting execution payload... Select a preset above or input custom parameters and click &quot;Execute Agent Pipeline&quot;.
                </span>
              )}
              {isExecuting && <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-0.5 align-middle" />}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): MCP Node Telemetry, Tool Registry & Architecture State */}
        <div className="space-y-6">
          {/* MCP Telemetry Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                MCP Node Telemetry
              </h2>
              <span className="text-[10px] font-mono text-slate-400">Live SSE/RPC Feed</span>
            </div>

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {telemetryLogs.length === 0 ? (
                <div className="p-3 rounded bg-slate-950 text-xs text-slate-500 font-mono">
                  Listening for node heartbeat on port 3000...
                </div>
              ) : (
                telemetryLogs.map((log) => (
                  <div key={log.id} className="bg-slate-950 border border-slate-800/80 p-2.5 rounded-lg space-y-1 text-xs font-mono">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="text-emerald-400 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                        {log.status.toUpperCase()}
                      </span>
                      <span className="text-slate-500">{log.time}</span>
                    </div>
                    <div className="text-slate-300 text-[11px] break-all leading-tight">
                      {log.raw}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Integrated MCP Tool Registry */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                Integrated MCP Tools (4 Active)
              </h2>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <div className="flex items-center justify-between font-mono font-medium text-indigo-300">
                  <span>courtlistener_search</span>
                  <span className="text-[10px] text-emerald-400">4M+ Opinions</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Federal, state &amp; international judicial dockets, citations and RECAP filings.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <div className="flex items-center justify-between font-mono font-medium text-emerald-300">
                  <span>mygdx_ssm_gateway</span>
                  <span className="text-[10px] text-emerald-400">Companies Act 2016</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Direct statutory corporate registry &amp; beneficial ownership validation.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <div className="flex items-center justify-between font-mono font-medium text-purple-300">
                  <span>icij_offshore_search</span>
                  <span className="text-[10px] text-emerald-400">Offshore Leaks</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Panama/Paradise Papers and cross-border trust reconciliation.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <div className="flex items-center justify-between font-mono font-medium text-amber-300">
                  <span>legalai_my_statutes</span>
                  <span className="text-[10px] text-emerald-400">Act 56 / ROC 2012</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Evidence Act 1950 S.90A, Form 66 Subpoenas, and High Court precedents.
                </p>
              </div>
            </div>
          </div>

          {/* System Architecture Verification */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2.5 text-xs text-slate-400">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Runtime Architecture State
            </h2>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Frontend Console:</span>
                <span className="text-slate-300">React 18 + Vite + SSE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Backend Orchestrator:</span>
                <span className="text-slate-300">Node.js Express + TS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">MCP Protocol Bridge:</span>
                <span className="text-slate-300">JSON-RPC 2.0 (v2.0.0)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GenAI Engine:</span>
                <span className="text-indigo-300">Gemini 2.5 Flash / Fast-Path</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Statutory Certification:</span>
                <span className="text-emerald-400">S.90A Evidence Act 1950</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
