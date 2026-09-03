import { useState, useEffect } from 'react';
import {
  Scale,
  ShieldAlert,
  AlertTriangle,
  FileText,
  Search,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  Lock,
  Landmark,
  Building2,
  DollarSign,
  Gavel,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Coins,
  Download,
} from 'lucide-react';
import type { CaseDisputeCore, CaseTrigger, GenerateMediaAnalysisResponse } from '../shared/types';

interface CaseDisputeAndTracesViewProps {
  onNavigateToAiMedia?: (triggerId?: string) => void;
  onNavigateToVeridianSwift?: () => void;
  onNavigateToCrawler?: () => void;
}

export function CaseDisputeAndTracesView({
  onNavigateToAiMedia,
  onNavigateToVeridianSwift,
  onNavigateToCrawler,
}: CaseDisputeAndTracesViewProps) {
  const [coreData, setCoreData] = useState<CaseDisputeCore | null>(null);
  const [triggers, setTriggers] = useState<CaseTrigger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTrigger, setSelectedTrigger] = useState<CaseTrigger | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'dispute_core' | 'triggers_traced' | 'contradictions'>('dispute_core');

  // AI Trace Modal State
  const [isTracingAi, setIsTracingAi] = useState(false);
  const [traceModalOpen, setTraceModalOpen] = useState(false);
  const [activeTraceResult, setActiveTraceResult] = useState<{
    trigger: CaseTrigger;
    traceReport: GenerateMediaAnalysisResponse;
  } | null>(null);

  useEffect(() => {
    loadCaseData();
  }, []);

  const loadCaseData = async () => {
    setIsLoading(true);
    try {
      const [coreRes, trgRes] = await Promise.all([
        fetch('/api/case/core-dispute'),
        fetch('/api/case/triggers'),
      ]);
      const coreJson = await coreRes.json();
      const trgJson = await trgRes.json();
      if (coreJson.success) setCoreData(coreJson.data);
      if (trgJson.success) {
        setTriggers(trgJson.data);
        if (trgJson.data.length > 0) setSelectedTrigger(trgJson.data[0]);
      }
    } catch (err) {
      console.error('Failed to load case dispute and triggers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerTraceWithAi = async (trigger: CaseTrigger) => {
    setIsTracingAi(true);
    setTraceModalOpen(true);
    setActiveTraceResult(null);
    try {
      const res = await fetch('/api/ai/trace-trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ triggerId: trigger.triggerId }),
      });
      const json = await res.json();
      if (json.success) {
        setActiveTraceResult(json);
      }
    } catch (err) {
      console.error('AI trace trigger failed:', err);
    } finally {
      setIsTracingAi(false);
    }
  };

  const filteredTriggers = triggers.filter((t) => {
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    const matchesSearch =
      !searchQuery ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.sourceAgency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.evidentiaryArtifact.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading && !coreData) {
    return (
      <div id="case-dispute-loading" className="flex flex-col items-center justify-center p-16 space-y-4">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-medium text-slate-600">Reconstructing Case Dispute Dossier &amp; Trigger Matrices...</p>
      </div>
    );
  }

  return (
    <div id="case-dispute-view" className="space-y-6">
      {/* Sub-Judice Court Banner */}
      <div
        id="sub-judice-advisory-bar"
        className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-amber-200"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                SUB-JUDICE PROCEEDING
              </span>
              <span className="font-semibold text-sm text-amber-100">{coreData?.suitNumber}</span>
              <span className="text-xs text-amber-300/70 hidden sm:inline">• {coreData?.court}</span>
            </div>
            <p className="text-xs text-amber-200/80 mt-0.5">
              Subject matter sub-judice under Rules of Court 2012 Order 29. Evidentiary records sealed pending trial.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onNavigateToCrawler && (
            <button
              id="btn-nav-to-crawler"
              onClick={onNavigateToCrawler}
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition shrink-0 shadow"
            >
              <Download className="w-3.5 h-3.5 text-emerald-200" />
              Scraped Docs &amp; PDF
            </button>
          )}

          {onNavigateToVeridianSwift && (
            <button
              id="btn-nav-to-veridian-swift"
              onClick={onNavigateToVeridianSwift}
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition shrink-0 shadow"
            >
              <Coins className="w-3.5 h-3.5 text-emerald-200" />
              Audit Veridian SWIFT &amp; UBO
            </button>
          )}

          <button
            id="btn-nav-to-ai-media"
            onClick={() => onNavigateToAiMedia?.(selectedTrigger?.triggerId)}
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition shrink-0 shadow"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            Analyze Media &amp; Historical Precedents
          </button>
        </div>
      </div>

      {/* Top Header & Metrics */}
      <div id="case-dispute-header" className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">
              <Gavel className="w-4 h-4 text-blue-400" />
              <span>Core Commercial Dispute &amp; Multi-Agency Asset Tracing</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{coreData?.caseTitle}</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-4xl leading-relaxed">
              {coreData?.disputeOrigin}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-refresh-case-data"
              onClick={loadCaseData}
              className="px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh Traces
            </button>
          </div>
        </div>

        {/* Financial Web Discrepancy Snapshot */}
        <div id="case-financial-snapshot" className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
            <div className="text-xs text-slate-400 font-medium">Nominal Domestic Claim</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">
              MYR {coreData?.financialWeb.domesticDisputeMYR.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 truncate">RHB Privilege Joint Account</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
            <div className="text-xs text-slate-400 font-medium">Concealed Geneva Capital</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">
              USD {coreData?.financialWeb.offshoreLombardOdierUSD.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 truncate">Lombard Odier Private Bank</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
            <div className="text-xs text-slate-400 font-medium">LHDN Statutory Demand</div>
            <div className="text-lg font-bold text-rose-400 mt-0.5">
              MYR {coreData?.financialWeb.lhdnTaxDemandMYR.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 truncate">Sec 113 Penalty + Sec 140A TP</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
            <div className="text-xs text-slate-400 font-medium">Fabricated Credit Trace</div>
            <div className="text-lg font-bold text-purple-400 mt-0.5">
              USD {coreData?.financialWeb.fraudulentCreditTraceUSD.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 truncate">AmBank SHA-256 Mismatch</div>
          </div>
        </div>
      </div>

      {/* Primary Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          id="tab-dispute-core"
          onClick={() => setActiveTab('dispute_core')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition flex items-center gap-2 border-b-2 ${
            activeTab === 'dispute_core'
              ? 'border-blue-500 text-blue-400 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scale className="w-4 h-4" />
          The Core Dispute &amp; Section 4(c) Shield
        </button>

        <button
          id="tab-triggers-traced"
          onClick={() => setActiveTab('triggers_traced')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition flex items-center gap-2 border-b-2 ${
            activeTab === 'triggers_traced'
              ? 'border-blue-500 text-blue-400 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          All Triggers Traced ({triggers.length})
          <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded-full font-mono">LIVE</span>
        </button>

        <button
          id="tab-contradictions"
          onClick={() => setActiveTab('contradictions')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition flex items-center gap-2 border-b-2 ${
            activeTab === 'contradictions'
              ? 'border-blue-500 text-blue-400 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Evidentiary Contradictions &amp; Entities
        </button>
      </div>

      {/* Tab 1: Core Dispute & Section 4(c) Shield */}
      {activeTab === 'dispute_core' && (
        <div id="view-dispute-core-content" className="space-y-6">
          {/* Litigants Confrontation Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plaintiff Card */}
            <div id="card-plaintiff" className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Plaintiff / Claimant
                </span>
                <span className="text-xs text-slate-500">Civil Litigant</span>
              </div>
              <h3 className="text-lg font-bold text-white">{coreData?.plaintiff.name}</h3>
              <div className="text-xs text-slate-400 font-mono mt-0.5">NRIC: {coreData?.plaintiff.nric}</div>
              <p className="text-xs text-slate-300 mt-2 italic bg-slate-950/50 p-2.5 rounded border border-slate-800/60">
                "{coreData?.plaintiff.claimedRole}"
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                <div>
                  <span className="text-slate-500">Legal Counsel:</span> {coreData?.plaintiff.legalCounsel}
                </div>
                <div>
                  <span className="text-slate-500">Relief Sought:</span> Declaratory partnership orders, freeze over RHB joint funds, and accounting of profits.
                </div>
              </div>
            </div>

            {/* Defendant Card */}
            <div id="card-defendant" className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Defendant / Target
                </span>
                <span className="text-xs text-slate-500">Principal Director</span>
              </div>
              <h3 className="text-lg font-bold text-white">{coreData?.defendant.name}</h3>
              <div className="text-xs text-slate-400 font-mono mt-0.5">NRIC: {coreData?.defendant.nric}</div>
              <p className="text-xs text-slate-300 mt-2 italic bg-slate-950/50 p-2.5 rounded border border-slate-800/60">
                "{coreData?.defendant.corporateRole}"
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                <div>
                  <span className="text-slate-500">Legal Counsel:</span> {coreData?.defendant.legalCounsel}
                </div>
                <div>
                  <span className="text-slate-500">Core Defense:</span> Section 4(c) statutory shield — no mutual agency, no partnership, mere nominee arrangement.
                </div>
              </div>
            </div>
          </div>

          {/* Primary Legal Issues Accordion/Grid */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-400" />
              Four Pillars of the Legal &amp; Evidentiary Dispute
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coreData?.primaryLegalIssues.map((issue) => (
                <div
                  key={issue.issueId}
                  id={`legal-issue-${issue.issueId.toLowerCase()}`}
                  className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                      {issue.statutoryBasis}
                    </span>
                    <span className="text-xs font-mono text-slate-500">{issue.issueId}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{issue.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{issue.description}</p>

                  <div className="bg-slate-950/80 rounded p-2.5 border border-slate-800/60 text-xs">
                    <span className="text-amber-400 font-medium">Judicial Significance: </span>
                    <span className="text-slate-300">{issue.significance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: All Triggers Traced Engine */}
      {activeTab === 'triggers_traced' && (
        <div id="view-triggers-traced-content" className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                id="search-triggers-input"
                type="text"
                placeholder="Search triggers by code, agency, artifact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-full md:w-80"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <span className="text-xs text-slate-400 shrink-0 font-medium">Filter Status:</span>
              {['ALL', 'ACTIVE_SUB_JUDICE', 'FLAGGED_FRAUD', 'STATUTORY_DEMAND', 'TRACED_RECONCILED', 'FROZEN_CIMA'].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`text-[11px] font-mono px-2.5 py-1 rounded transition shrink-0 ${
                      filterStatus === status
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {status.replace(/_/g, ' ')}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Triggers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTriggers.map((trigger) => (
              <div
                key={trigger.triggerId}
                id={`trigger-card-${trigger.triggerId.toLowerCase()}`}
                className={`bg-slate-900/80 border rounded-xl p-5 transition space-y-3 relative overflow-hidden ${
                  selectedTrigger?.triggerId === trigger.triggerId
                    ? 'border-blue-500 shadow-sm shadow-blue-500/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header line */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-300 border border-slate-700">
                      {trigger.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        trigger.status === 'FLAGGED_FRAUD'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : trigger.status === 'STATUTORY_DEMAND'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : trigger.status === 'ACTIVE_SUB_JUDICE'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {trigger.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(trigger.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Event Title & Summary */}
                <div>
                  <h4 className="text-sm font-semibold text-white">{trigger.eventType}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{trigger.summary}</p>
                </div>

                {/* Evidentiary Artifact */}
                <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      Evidentiary Artifact:
                    </span>
                    <span className="font-mono text-[11px] text-blue-400">{trigger.sourceAgency}</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-300 truncate">{trigger.evidentiaryArtifact}</div>
                </div>

                {/* Metrics Bar */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
                  <div className="bg-slate-950/40 p-2 rounded">
                    <div className="text-[10px] text-slate-500 font-medium">Risk Score</div>
                    <div className="text-xs font-bold text-rose-400">{trigger.riskScore}/100</div>
                  </div>
                  <div className="bg-slate-950/40 p-2 rounded">
                    <div className="text-[10px] text-slate-500 font-medium">Media Impact</div>
                    <div className="text-xs font-bold text-amber-400">{trigger.mediaProbability}%</div>
                  </div>
                  <div className="bg-slate-950/40 p-2 rounded">
                    <div className="text-[10px] text-slate-500 font-medium">Sub-Judice</div>
                    <div className="text-xs font-bold text-purple-300">{trigger.subJudiceSensitivity}</div>
                  </div>
                </div>

                {/* Traced Ripple Effect */}
                <div className="bg-blue-950/20 border border-blue-500/20 rounded p-2.5 text-xs text-blue-200/90 leading-relaxed">
                  <span className="font-semibold text-blue-400">Traced Ripple: </span>
                  {trigger.tracedRippleEffect}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <span>Scope:</span>
                    {trigger.crossJurisdictionScope.map((scope) => (
                      <span key={scope} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                        {scope}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-trace-ai-${trigger.triggerId.toLowerCase()}`}
                      onClick={() => handleTriggerTraceWithAi(trigger)}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1 shadow"
                    >
                      <Sparkles className="w-3 h-3 text-blue-200" />
                      Trace with AI
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Evidentiary Contradictions & Corporate Web */}
      {activeTab === 'contradictions' && (
        <div id="view-contradictions-content" className="space-y-6">
          {/* Key Corporate Entities Involved */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              Entities in the Disputed Capital Chain
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coreData?.keyCorporateEntities.map((entity, idx) => (
                <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{entity.entityName}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {entity.jurisdiction}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-blue-400">{entity.registrationOrAccount}</div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">{entity.roleInDispute}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Forensic Contradictions */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Critical Contradictions &amp; Investigated Inconsistencies
            </h2>

            <div className="space-y-3">
              {coreData?.criticalContradictions.map((contra, idx) => (
                <div
                  key={idx}
                  className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-4 flex items-start gap-3"
                >
                  <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400 shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                      Forensic Discrepancy #{idx + 1}
                    </div>
                    <p className="text-xs text-slate-200 mt-1 leading-relaxed">{contra}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Trigger Trace Modal */}
      {traceModalOpen && (
        <div
          id="trace-ai-modal-overlay"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            id="trace-ai-modal-container"
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 my-8"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    AI Trigger Ripple Trace: {activeTraceResult?.trigger.code || 'Executing...'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Powered by server-side Gemini AI &bull; Deep multi-jurisdictional causality mapping
                  </p>
                </div>
              </div>

              <button
                onClick={() => setTraceModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                &times;
              </button>
            </div>

            {isTracingAi ? (
              <div className="p-12 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-sm font-medium text-slate-300">
                  Analyzing ripple causality, sub-judice boundaries &amp; historical precedents...
                </p>
              </div>
            ) : activeTraceResult ? (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                {/* Headline */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                    AI Generated Analysis
                  </span>
                  <h4 className="text-base font-bold text-white mt-1">
                    {activeTraceResult.traceReport.generatedHeadline}
                  </h4>
                </div>

                {/* Sub-Judice Advisory */}
                <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <Scale className="w-4 h-4" />
                    Sub-Judice Contempt Warning (Rating: {activeTraceResult.traceReport.subJudiceRiskAnalysis.riskRating})
                  </div>
                  <p className="text-amber-200/80 leading-relaxed">
                    {activeTraceResult.traceReport.subJudiceRiskAnalysis.contemptOfCourtWarning}
                  </p>
                </div>

                {/* Historical Precedent Match */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Historical Precedent Convergence:</span>
                    <span className="text-blue-400 font-mono">
                      {activeTraceResult.traceReport.historicalPrecedentMatch.citation}
                    </span>
                  </div>
                  <div className="text-slate-200 font-semibold">
                    {activeTraceResult.traceReport.historicalPrecedentMatch.caseName}
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    {activeTraceResult.traceReport.historicalPrecedentMatch.practicalLesson}
                  </p>
                </div>

                {/* Traced Ripple Effects */}
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Downstream Ripple Effects Traced
                  </h5>
                  <div className="space-y-1.5">
                    {activeTraceResult.traceReport.tracedRippleEffects.map((effect, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2"
                      >
                        <ChevronRight className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span>{effect}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simulated Quotes */}
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Key Litigant &amp; Regulatory Commentary
                  </h5>
                  <div className="space-y-2">
                    {activeTraceResult.traceReport.keyQuotes.map((q, idx) => (
                      <div key={idx} className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs">
                        <div className="text-blue-400 font-semibold">{q.speaker}</div>
                        <div className="text-slate-300 italic mt-1">"{q.quote}"</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setTraceModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition"
              >
                Close Trace Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
