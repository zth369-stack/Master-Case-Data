import React, { useState } from 'react';
import {
  Code2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Play,
  FileCode,
  FolderPlus,
  Zap,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

interface AuditCheck {
  name: string;
  passed: boolean;
  details: string;
}

interface AuditResult {
  syntaxValid: boolean;
  score: number;
  checks: AuditCheck[];
  cryptographicIntegrity: 'VERIFIED' | 'WARNING' | 'FAILED';
  statutoryCompliance: string;
  summary: string;
}

const CODE_PRESETS = [
  {
    id: 's90a_cert_generator',
    label: 'Evidence Act S.90A SHA-256 Sealer',
    target: 'Kavinath Holdings Sdn. Bhd.',
    icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
    desc: 'Generates NIST FIPS 180-4 cryptographic certificates for Malaysian court admissibility under Act 56.',
  },
  {
    id: 'mygdx_hmac_signer',
    label: 'MyGDX SSM HMAC-SHA256 Request Signer',
    target: 'Kavinath Holdings Sdn. Bhd. (SSM 1199837-7)',
    icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
    desc: 'Signs government-to-government REST requests with nonces, timestamps, and payload hashes.',
  },
  {
    id: 'swift_mt103_validator',
    label: 'SWIFT MT103 Geneva Wire Validator',
    target: '2017 Geneva Veridian Escrow / Kavinath Ganesan',
    icon: <Code2 className="w-3.5 h-3.5 text-indigo-400" />,
    desc: 'Parses banking tags (20, 32A, 50K, 59, 70) and computes SHA-256 tamper-detection digests.',
  },
  {
    id: 'courtlistener_recap_pipeline',
    label: 'CourtListener RECAP Ingestion Pipeline',
    target: 'Commercial Division Suit WA-22NCC-482-09/2026',
    icon: <Layers className="w-3.5 h-3.5 text-blue-400" />,
    desc: 'Asynchronous fetcher and docket normalizer for federal and international opinions.',
  },
];

export const AiCodeWorkbench: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>(CODE_PRESETS[0].id);
  const [targetEntity, setTargetEntity] = useState<string>('Kavinath Holdings Sdn. Bhd.');
  const [includeSha256, setIncludeSha256] = useState<boolean>(true);
  const [statutoryStandard, setStatutoryStandard] = useState<string>('Evidence Act 1950 Section 90A');
  const [code, setCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [attachedDocId, setAttachedDocId] = useState<string | null>(null);
  const [isAttaching, setIsAttaching] = useState<boolean>(false);

  // Generate code via API
  const handleGenerateCode = async (presetId = selectedPreset) => {
    setIsGenerating(true);
    setAuditResult(null);
    setAttachedDocId(null);
    try {
      const res = await fetch('/api/v1/ai/code/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose: presetId,
          targetEntity,
          includeSha256,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.code) {
        setCode(data.data.code);
        // Automatically run audit
        runCodeAudit(data.data.code);
      }
    } catch (err: any) {
      alert(`Code generation error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Run audit on current code
  const runCodeAudit = async (codeToAudit = code) => {
    if (!codeToAudit.trim()) return;
    setIsValidating(true);
    try {
      const res = await fetch('/api/v1/ai/code/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeToAudit,
          statutoryRequirement: statutoryStandard,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAuditResult(data.data);
      }
    } catch (err: any) {
      console.error('Audit failed', err);
    } finally {
      setIsValidating(false);
    }
  };

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAttachToDossier = async () => {
    if (!code || isAttaching) return;
    setIsAttaching(true);
    try {
      const res = await fetch('/api/v1/agent/attach-to-dossier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Forensic TypeScript Script: ${selectedPreset} (${new Date().toLocaleDateString()})`,
          content: code,
          formatTag: 'TYPESCRIPT_CODE_EXHIBIT',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAttachedDocId(data.data?.document?.serialOrRegistrationNo || 'SEALED & ATTACHED');
      }
    } catch (err: any) {
      alert(`Failed to attach code exhibit: ${err.message}`);
    } finally {
      setIsAttaching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Presets Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                AI Code Workbench &amp; Forensic Script Synthesizer (+codes)
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  TypeScript 5.8
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Automated generation of Evidence Act 1950 Section 90A certificates, MyGDX HMAC-SHA256 signatures, and SWIFT MT103 integrity validators.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleGenerateCode()}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
          >
            {isGenerating ? (
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            )}
            {isGenerating ? 'Synthesizing...' : 'Generate Script'}
          </button>
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {CODE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                setSelectedPreset(preset.id);
                setTargetEntity(preset.target);
                handleGenerateCode(preset.id);
              }}
              className={`p-3 rounded-lg border text-left transition flex flex-col justify-between ${
                selectedPreset === preset.id
                  ? 'bg-indigo-950/40 border-indigo-500/60 ring-1 ring-indigo-500/30'
                  : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                {preset.icon}
                <span className="text-xs font-bold text-slate-200 truncate">{preset.label}</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{preset.desc}</p>
            </button>
          ))}
        </div>

        {/* Config row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800/80 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Target Entity / Subject:</label>
            <input
              type="text"
              value={targetEntity}
              onChange={(e) => setTargetEntity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:border-indigo-500 outline-none text-xs"
              placeholder="Entity Name or Account"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Statutory Compliance Standard:</label>
            <select
              value={statutoryStandard}
              onChange={(e) => setStatutoryStandard(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:border-indigo-500 outline-none text-xs"
            >
              <option value="Evidence Act 1950 Section 90A">Evidence Act 1950 Section 90A</option>
              <option value="Rules of Court 2012 Order 38 Rule 13">ROC 2012 Order 38 (Form 66)</option>
              <option value="Companies Act 2016 Section 198">Companies Act 2016 S.198</option>
              <option value="Anti-Money Laundering Act 2001 Section 4">AMLA 2001 Section 4</option>
            </select>
          </div>

          <div className="flex items-center sm:items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
              <input
                type="checkbox"
                checked={includeSha256}
                onChange={(e) => setIncludeSha256(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0 w-4 h-4"
              />
              <span>Include SHA-256 Custody Hash</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Code & Audit Two-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Cols: Interactive Code Display */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono font-medium text-slate-300">
                {selectedPreset}.ts
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                {code ? `${code.split('\n').length} lines` : 'Empty'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => runCodeAudit()}
                disabled={!code || isValidating}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition disabled:opacity-40"
              >
                <Play className="w-3 h-3 text-emerald-400" />
                <span>Audit Script</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                disabled={!code}
                className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={handleAttachToDossier}
                disabled={!code || isAttaching}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-xs transition disabled:opacity-40"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>{isAttaching ? 'Attaching...' : 'Attach as Exhibit'}</span>
              </button>
            </div>
          </div>

          {/* Code Textarea / Viewer */}
          <div className="p-4 flex-1 bg-slate-950 font-mono text-xs leading-relaxed overflow-auto max-h-[520px]">
            {code ? (
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-[480px] bg-transparent text-slate-200 resize-none outline-none font-mono text-xs leading-relaxed selection:bg-indigo-500/30"
                spellCheck={false}
              />
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 space-y-2">
                <Code2 className="w-8 h-8 text-slate-600" />
                <p>Click "Generate Script" or select a preset above to synthesize specialized forensic code.</p>
              </div>
            )}
          </div>

          {attachedDocId && (
            <div className="px-4 py-2.5 bg-emerald-950/40 border-t border-emerald-800/40 text-emerald-300 text-xs flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Exhibit successfully sealed into Evidence Dossier
              </span>
              <span className="font-mono text-[11px] bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/50">
                {attachedDocId}
              </span>
            </div>
          )}
        </div>

        {/* Right 1-Col: Statutory Audit & Compliance Score Card */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Static Compliance Audit
                </h3>
              </div>
              {auditResult && (
                <span
                  className={`text-xs px-2.5 py-0.5 rounded font-mono font-bold ${
                    auditResult.score >= 80
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  Score: {auditResult.score}%
                </span>
              )}
            </div>

            {auditResult ? (
              <div className="space-y-4 text-xs">
                {/* Status summary */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Judicial Admissibility:</span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      {auditResult.cryptographicIntegrity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Statute:</span>
                    <span className="font-mono text-slate-300 truncate max-w-[150px]">
                      {auditResult.statutoryCompliance}
                    </span>
                  </div>
                </div>

                {/* Checklist */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Verification Rule Breakdown:
                  </span>
                  {auditResult.checks.map((check, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded bg-slate-950/80 border border-slate-800/80 flex items-start gap-2"
                    >
                      {check.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-medium text-slate-200 leading-tight">{check.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{check.details}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 rounded bg-indigo-950/20 border border-indigo-500/20 text-[11px] text-indigo-300 leading-relaxed">
                  {auditResult.summary}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 space-y-2">
                <ShieldCheck className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">Generate or input code to execute real-time statutory static audit.</p>
              </div>
            )}
          </div>

          {/* Quick MCP Code Reference */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
            <span className="font-semibold text-slate-300 block flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              Runtime Architecture Note
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Synthesized TypeScript code runs within the Node.js 22 sandbox. Every execution outputs cryptographic SHA-256 hashes anchored to the Evidence Act 1950 Section 90A electronic record ledger.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
