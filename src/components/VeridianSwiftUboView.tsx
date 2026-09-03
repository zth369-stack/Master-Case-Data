import { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Eye,
  Lock,
  Unlock,
  Coins,
  Building2,
  Landmark,
  User,
  Users,
  FileCheck2,
  Scale,
  Sparkles,
  Download,
} from 'lucide-react';
import type {
  SwiftLogEntry,
  UboProfile,
  VeridianSettlementAnalysis,
} from '../shared/types';

interface VeridianSwiftUboViewProps {
  onNavigateToVerify?: (docId?: string) => void;
  onNavigateToIcij?: () => void;
  onNavigateToCaseDispute?: () => void;
  onNavigateToCrawler?: () => void;
}

export function VeridianSwiftUboView({
  onNavigateToVerify,
  onNavigateToIcij,
  onNavigateToCaseDispute,
  onNavigateToCrawler,
}: VeridianSwiftUboViewProps) {
  const [veridianData, setVeridianData] = useState<VeridianSettlementAnalysis | null>(null);
  const [swiftLogs, setSwiftLogs] = useState<SwiftLogEntry[]>([]);
  const [uboProfile, setUboProfile] = useState<UboProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filters & Toggles
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [expandedSwiftPayloads, setExpandedSwiftPayloads] = useState<Record<string, boolean>>({});
  const [activeSubTab, setActiveSubTab] = useState<'verdict' | 'swift_trace' | 'ubo_tree'>('verdict');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [veridianRes, swiftRes, uboRes] = await Promise.all([
        fetch('/api/case/veridian-settlement'),
        fetch('/api/case/swift-logs'),
        fetch('/api/case/ubo-details'),
      ]);

      const veridianJson = await veridianRes.json();
      const swiftJson = await swiftRes.json();
      const uboJson = await uboRes.json();

      if (veridianJson.success) setVeridianData(veridianJson.data);
      if (swiftJson.success) setSwiftLogs(swiftJson.data);
      if (uboJson.success) setUboProfile(uboJson.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load forensic data';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const togglePayload = (id: string) => {
    setExpandedSwiftPayloads((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredSwiftLogs = swiftLogs.filter((log) => {
    if (statusFilter === 'ALL') return true;
    return log.status === statusFilter;
  });

  if (loading && !veridianData) {
    return (
      <div className="p-12 text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
        <p className="text-sm text-slate-400 font-mono">
          Deciphering SWIFT MT103 wire feeds, UBO disclosures, and bankruptcy settlement files...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-red-950/40 border border-red-800 text-red-300 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span className="text-sm font-medium">{error}</span>
        </div>
        <button
          onClick={fetchData}
          className="px-3 py-1.5 rounded-lg bg-red-900/50 hover:bg-red-800 text-xs font-semibold text-white transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation & Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 uppercase tracking-wider">
              Forensic Wire Audit
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Veridian Settlement, SWIFT Ledger &amp; UBO Audit
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Definitive forensic clarification: Crypto Liquidation vs. SDNY Chapter 15 Bankruptcy Settlement, multi-hop SWIFT wire tracing, and Beneficial Ownership hierarchy.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onNavigateToCrawler && (
            <button
              onClick={onNavigateToCrawler}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Document Scraper &amp; PDF
            </button>
          )}

          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveSubTab('verdict')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                activeSubTab === 'verdict'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Settlement Verdict
            </button>
            <button
              onClick={() => setActiveSubTab('swift_trace')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition flex items-center gap-1.5 ${
                activeSubTab === 'swift_trace'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>SWIFT Wire Trace</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-blue-300 font-mono">
                {swiftLogs.length}
              </span>
            </button>
            <button
              onClick={() => setActiveSubTab('ubo_tree')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                activeSubTab === 'ubo_tree'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              UBO Dossier &amp; Sec 4(c)
            </button>
          </div>
        </div>
      </div>

      {/* SUBTAB 1: SETTLEMENT VERDICT */}
      {activeSubTab === 'verdict' && veridianData && (
        <div className="space-y-6">
          {/* Main Anomaly & Truth Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      FACTUAL VERDICT: NOT A CRYPTO LIQUIDATION
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300">
                      SDNY 24-CV-08119
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white pt-1">
                    What is the Veridian Settlement Actually?
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-black font-mono text-emerald-400">
                    USD 35,000,000
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Total Legal Distribution
                  </div>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                {veridianData.actualSettlementNature}
              </p>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Judicial Origin &amp; Docket
                  </div>
                  <div className="text-xs font-semibold text-slate-200">
                    {veridianData.legalOrigin}
                  </div>
                  <div className="text-[11px] font-mono text-blue-400 pt-0.5">
                    {veridianData.docketReference}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Settlement Routing Channel
                  </div>
                  <div className="text-xs font-semibold text-slate-200">
                    BNY Mellon (NY) ➔ Banque Lombard Odier (Geneva)
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 pt-0.5">
                    Credited to Archon Holdings SA (#ch9300767000usd000001)
                  </div>
                </div>
              </div>

              {/* The Crypto Layering Narrative Analysis */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Why Was "Crypto Liquidation" Suspected or Conflated?
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {veridianData.cryptoLayeringAttemptDetails.whyCryptoWasSuspected}
                </p>
                <div className="text-xs text-amber-200/90 leading-relaxed font-medium bg-amber-950/30 p-2.5 rounded-lg border border-amber-800/30">
                  <span className="font-bold text-amber-300">Forensic Reality: </span>
                  {veridianData.cryptoLayeringAttemptDetails.forensicConclusion}
                </div>
              </div>
            </div>

            {/* Quick Metrics & Intermediaries Column */}
            <div className="lg:col-span-4 space-y-4">
              {/* Financial Breakdown Card */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Audited Capital Position
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-slate-200">
                        Unencumbered Offshore
                      </div>
                      <div className="text-[10px] text-slate-400">Lombard Odier Geneva</div>
                    </div>
                    <span className="text-sm font-bold font-mono text-emerald-400">
                      $35,000,000 USD
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-slate-200">
                        CIMA Frozen Trust
                      </div>
                      <div className="text-[10px] text-slate-400">Ganesam Family Trust (Cayman)</div>
                    </div>
                    <span className="text-sm font-bold font-mono text-amber-400">
                      $12,500,000 USD
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-slate-200">
                        Fabricated Wire Trace
                      </div>
                      <div className="text-[10px] text-slate-400">AmBank Ipoh (Forged)</div>
                    </div>
                    <span className="text-sm font-bold font-mono text-red-400 line-through">
                      $2,000,000 USD
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-slate-200">
                        Sub-Judice Frozen
                      </div>
                      <div className="text-[10px] text-slate-400">RHB Privilege Joint Acct</div>
                    </div>
                    <span className="text-sm font-bold font-mono text-blue-400">
                      RM 300,000 MYR
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-red-950/60">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-slate-200">
                        LHDN Priority Tax Claim
                      </div>
                      <div className="text-[10px] text-red-400">Sovereign Lien / Sec 106</div>
                    </div>
                    <span className="text-sm font-bold font-mono text-rose-400">
                      RM 56,420,000 MYR
                    </span>
                  </div>
                </div>
              </div>

              {/* Entities in the Layering Attempt */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Entities in Layering Inquiry</span>
                  <span className="text-[10px] font-mono text-slate-500">5 nodes</span>
                </div>
                <div className="space-y-2 text-xs">
                  {veridianData.cryptoLayeringAttemptDetails.involvedEntities.map((ent, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/60 text-slate-300 font-mono text-[11px] flex items-center gap-2"
                    >
                      <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">{ent}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: SWIFT WIRE TRACE & MONEY TRANSFER LOGS */}
      {activeSubTab === 'swift_trace' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Filter Transfer Status:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: 'ALL', label: 'All Wire Logs' },
                  { key: 'SETTLED_UNENCUMBERED', label: 'Settled Unencumbered' },
                  { key: 'FROZEN_REGULATORY', label: 'CIMA Frozen' },
                  { key: 'FORGED_REJECTED', label: 'Forged / Rejected' },
                  { key: 'SUB_JUDICE_FROZEN', label: 'Sub-Judice Frozen' },
                  { key: 'STATUTORY_GARNISHMENT', label: 'LHDN Garnishment' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setStatusFilter(item.key)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                      statusFilter === item.key
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              Showing {filteredSwiftLogs.length} of {swiftLogs.length} recorded ledger transfers
            </div>
          </div>

          {/* Wire Logs List */}
          <div className="space-y-4">
            {filteredSwiftLogs.map((log) => {
              const isForged = log.status === 'FORGED_REJECTED';
              const isFrozen = log.status === 'FROZEN_REGULATORY' || log.status === 'SUB_JUDICE_FROZEN';
              const isGarnishment = log.status === 'STATUTORY_GARNISHMENT';
              const isExpanded = !!expandedSwiftPayloads[log.id];

              return (
                <div
                  key={log.id}
                  className={`p-5 rounded-2xl border transition ${
                    isForged
                      ? 'bg-red-950/20 border-red-900/60'
                      : isGarnishment
                      ? 'bg-purple-950/20 border-purple-900/50'
                      : isFrozen
                      ? 'bg-amber-950/20 border-amber-900/50'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 text-slate-200">
                        {log.messageType}
                      </span>
                      <span className="text-xs font-mono font-semibold text-blue-400">
                        {log.transferId}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isForged
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : isGarnishment
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : isFrozen
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {log.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {new Date(log.date).toLocaleDateString('en-GB', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div
                          className={`text-lg font-black font-mono ${
                            isForged
                              ? 'text-red-400 line-through'
                              : isGarnishment
                              ? 'text-purple-300'
                              : 'text-emerald-400'
                          }`}
                        >
                          {log.currency} {log.amount.toLocaleString()}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-slate-500">
                          {log.clearingSystem}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transfer Route Routing Visual */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 items-center">
                    {/* Sender Box */}
                    <div className="md:col-span-5 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                        <span>Originating Institution</span>
                        <span className="font-mono text-blue-400">{log.senderBic}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-200 truncate">
                        {log.senderBank}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Entity: <span className="text-slate-300 font-medium">{log.senderEntity}</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 truncate">
                        Acct: {log.senderAccount}
                      </div>
                    </div>

                    {/* Arrow / Intermediary */}
                    <div className="md:col-span-2 text-center py-2 md:py-0">
                      <div className="inline-flex flex-col items-center">
                        <div className="p-2 rounded-full bg-slate-800/80 text-blue-400">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                        {log.intermediaryBic && (
                          <div className="text-[9px] font-mono text-slate-400 mt-1 max-w-[120px] truncate">
                            Via {log.intermediaryBank?.split(',')[0]}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Receiver Box */}
                    <div className="md:col-span-5 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                        <span>Beneficiary Destination</span>
                        <span className="font-mono text-blue-400">{log.receiverBic}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-200 truncate">
                        {log.receiverBank}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Beneficiary: <span className="text-slate-300 font-medium">{log.receiverEntity}</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 truncate">
                        Acct: {log.receiverAccount}
                      </div>
                    </div>
                  </div>

                  {/* Cryptographic & Forensic Details */}
                  <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/60 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-medium">
                          SWIFT gpi UETR:
                        </span>
                        <span className="font-mono text-[11px] text-slate-200">
                          {log.uetr}
                        </span>
                        <button
                          onClick={() => handleCopy(log.uetr, `uetr-${log.id}`)}
                          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition"
                          title="Copy UETR"
                        >
                          {copiedId === `uetr-${log.id}` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400">Block Integrity:</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            log.hashVerificationResult === 'MATCH_VALID'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : log.hashVerificationResult === 'FORGED_MISMATCH'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {log.hashVerificationResult}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 leading-relaxed font-sans">
                      <span className="font-bold text-slate-400">Forensic Audit: </span>
                      {log.forensicNotes}
                    </div>

                    {/* Expandable RAW SWIFT Payload */}
                    <div className="pt-1">
                      <button
                        onClick={() => togglePayload(log.id)}
                        className="text-[11px] font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>
                          {isExpanded ? 'Hide Raw SWIFT Advice MT' : 'Inspect Raw SWIFT MT Payload (Tags :20, :32A, :50K, :59)'}
                        </span>
                      </button>

                      {isExpanded && (
                        <pre className="mt-2 p-3 rounded-lg bg-black text-emerald-400 font-mono text-[10px] overflow-x-auto whitespace-pre-wrap border border-slate-800">
                          {log.rawSwiftPayload}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: ULTIMATE BENEFICIAL OWNER (UBO) HIERARCHY & SEC 4(c) DEFENSE */}
      {activeSubTab === 'ubo_tree' && uboProfile && (
        <div className="space-y-6">
          {/* UBO Identity Header Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 uppercase">
                      Primary Ultimate Beneficial Owner
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300">
                      100% Equity Controller
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight mt-1">
                    {uboProfile.uboName}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono flex flex-wrap gap-x-4 gap-y-1 mt-0.5">
                    <span>NRIC: <strong className="text-slate-200">{uboProfile.nric}</strong></span>
                    <span>JPN Records: <strong className="text-slate-200">{uboProfile.jpnRegistration}</strong></span>
                    <span>Tax ID: <strong className="text-slate-200">{uboProfile.taxIdentificationNumber}</strong></span>
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <div className="text-xs text-slate-400 uppercase font-semibold">Total Traced Offshore Capital</div>
                <div className="text-xl font-black font-mono text-emerald-400">
                  USD ${uboProfile.totalTracedNetWorthUSD.toLocaleString()}
                </div>
                <div className="text-[10px] font-mono text-rose-400">
                  LHDN Demand: RM {uboProfile.effectiveTaxLiabilityMYR.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Controlled Entities Grid */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Entities Controlled Under Beneficial Ownership Framework (Section 56 CA 2016 &amp; Swiss AMLA)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {uboProfile.entitiesControlled.map((ent) => (
                  <div
                    key={ent.entityId}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-mono text-blue-400">{ent.jurisdiction}</div>
                        <div className="text-sm font-bold text-white">{ent.entityName}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-500/20 text-blue-300">
                        {ent.percentageOwnership}% UBO
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 font-mono">
                      Account/Instrument: <span className="text-slate-200">{ent.instrumentOrAccount}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                      <span className="text-slate-400">Traced Value:</span>
                      <span className="font-mono font-bold text-emerald-400">{ent.financialValue}</span>
                    </div>

                    <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/40">
                      <span className="font-semibold text-slate-300">Disclosure Basis: </span>
                      {ent.uboDisclosureStandard}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statutory Defense: Section 4(c) Partnership Act 1961 vs Proxy X */}
            <div className="p-5 rounded-xl bg-blue-950/20 border border-blue-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-blue-400" />
                  <h4 className="text-sm font-bold text-blue-200">
                    The Statutory Shield: Section 4(c) of the Partnership Act 1961 (Act 135)
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300">
                  Judicial Landmark Rule
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-blue-900/30 text-xs text-slate-300 space-y-2">
                <div className="font-semibold text-white">
                  Why Proxy X Is Legally Barred From Claiming 50% Equitable Equity:
                </div>
                <p className="leading-relaxed">
                  Section 4(c) of the Partnership Act 1961 expressly dictates that the receipt by a person of a share of profits, debt reimbursements, or bank disbursements does not of itself make that person a partner in the business.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px]">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-bold text-red-400">Proxy X's Contention (Suit 4-334567):</span>
                    <p className="text-slate-400">
                      Asserts that being a co-signatory on the RHB Privilege Joint Account (#214-441-0081) and receiving operational funds constitutes an equitable co-ownership of corporate revenues.
                    </p>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-400">Kavinath Ganeshan's Statutory Defense:</span>
                    <p className="text-slate-400">
                      Under Section 4(c), funds wired into the joint facility were convenience disbursements and debt repayments for administrative tasks. The principal maintains 100% sole beneficial ownership.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Statutory Lodgments & Declarations */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Multi-Jurisdictional UBO Declarations
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {uboProfile.statutoryDeclarations.map((decl, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{decl.authority}</span>
                      <span className="font-mono text-slate-500 text-[10px]">{decl.filingDate}</span>
                    </div>
                    <div className="text-[11px] font-mono text-blue-400">{decl.filingRef}</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {decl.declarationSummary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cross-Link Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-400" />
          <span>Cross-verify with other modules:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onNavigateToVerify && (
            <button
              onClick={() => onNavigateToVerify('DOC-AMB-2026-0114')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition flex items-center gap-1.5"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-red-400" />
              <span>Verify AmBank Forged SHA-256 Ledger</span>
            </button>
          )}

          {onNavigateToIcij && (
            <button
              onClick={onNavigateToIcij}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
              <span>Reconcile Archon Holdings with ICIJ</span>
            </button>
          )}

          {onNavigateToCaseDispute && (
            <button
              onClick={onNavigateToCaseDispute}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Review Full Case Dispute &amp; Traces</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
