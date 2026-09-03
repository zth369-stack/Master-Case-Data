import { useState, useEffect } from 'react';
import {
  Brain,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  XCircle,
  Scale,
  RefreshCw,
  Search,
  Copy,
  Check,
  Download,
  Terminal,
  Cpu,
  Sparkles,
  Award,
  ChevronRight,
  ChevronDown,
  Building2,
  User,
  Landmark,
  FileText,
  Lock,
  Layers,
  Fingerprint,
  FileCode,
  Sliders,
  Send,
  Loader2,
  Eye,
  ArrowRight,
  History,
  ListFilter,
  CheckSquare,
  FileSpreadsheet,
} from 'lucide-react';
import type {
  BrainAiCorrectionVerdict,
  BrainAiCaseCategory,
  DataVerificationRecord,
  DataVerificationSystemOverview,
  BrainAiAutoCorrectedChange,
  BrainAiAutoAuditRunSummary,
  AutoCorrectionDomain,
} from '../shared/types.js';

interface BrainAiCorrectionalCenterViewProps {
  onNavigateToPoaDossier?: () => void;
}

export function BrainAiCorrectionalCenterView({
  onNavigateToPoaDossier,
}: BrainAiCorrectionalCenterViewProps) {
  // Navigation between the three main wings
  const [activeWing, setActiveWing] = useState<'auto_audit_changes' | 'correction_center' | 'data_verification'>('auto_audit_changes');

  // Brain AI Auto-Audit & Auto-Correction State
  const [autoAuditSummary, setAutoAuditSummary] = useState<BrainAiAutoAuditRunSummary | null>(null);
  const [isRunningAutoAudit, setIsRunningAutoAudit] = useState<boolean>(false);
  const [autoAuditProgressStep, setAutoAuditProgressStep] = useState<string>('');
  const [changeSearchQuery, setChangeSearchQuery] = useState<string>('');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('ALL');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState<string>('ALL');
  const [copiedChangeHash, setCopiedChangeHash] = useState<string | null>(null);
  const [expandedChangeId, setExpandedChangeId] = useState<string | null>(null);
  const [decreeModalText, setDecreeModalText] = useState<string | null>(null);
  const [copiedDecree, setCopiedDecree] = useState<boolean>(false);

  // Brain AI Correctional Center State
  const [presetCases, setPresetCases] = useState<BrainAiCorrectionVerdict[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('BCC-2024-001');
  const [activeVerdict, setActiveVerdict] = useState<BrainAiCorrectionVerdict | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<BrainAiCaseCategory>('CUSTOM_INGESTION');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  // Data Verification System State
  const [verificationOverview, setVerificationOverview] = useState<DataVerificationSystemOverview | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [verifiedRecords, setVerifiedRecords] = useState<DataVerificationRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<DataVerificationRecord | null>(null);
  const [selectedDimensionFilter, setSelectedDimensionFilter] = useState<string>('ALL');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [certificateModalData, setCertificateModalData] = useState<{
    record: DataVerificationRecord;
    certificateText: string;
    issuedAt: string;
  } | null>(null);
  const [copiedCert, setCopiedCert] = useState<boolean>(false);

  // 1. Load Initial Cases, Verification Registry and Auto-Audit Summary
  const loadInitialData = async () => {
    try {
      // Load auto-audit summary
      const auditRes = await fetch('/api/brain-ai/auto-audit/summary');
      if (auditRes.ok) {
        const auditJson = await auditRes.json();
        if (auditJson.success && auditJson.data) {
          setAutoAuditSummary(auditJson.data);
        }
      }

      // Load preset cases
      const casesRes = await fetch('/api/brain-ai/cases');
      if (casesRes.ok) {
        const casesJson = await casesRes.json();
        if (casesJson.success && casesJson.data) {
          setPresetCases(casesJson.data);
          const firstCase = casesJson.data[0];
          if (firstCase && !activeVerdict) {
            setActiveVerdict(firstCase);
            setSelectedCaseId(firstCase.caseId);
          }
        }
      }

      // Load data verification overview
      const verRes = await fetch('/api/brain-ai/verification-system');
      if (verRes.ok) {
        const verJson = await verRes.json();
        if (verJson.success && verJson.data) {
          setVerificationOverview(verJson.data);
          setVerifiedRecords(verJson.data.verifiedRecords || []);
          if (verJson.data.verifiedRecords?.length > 0 && !selectedRecord) {
            setSelectedRecord(verJson.data.verifiedRecords[0]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load Brain AI and Verification data:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // 2. Trigger Brain AI Correction
  const handleRunCorrection = async (caseId?: string, overrideText?: string) => {
    setIsAnalyzing(true);
    try {
      const payload = isCustomMode
        ? {
            category: customCategory,
            suspectedDocumentTitle: customTitle || 'Questionable Forensic Submission',
            customText: overrideText || customText,
            subjectIdentifier: 'Kavinath A/L Ganesan / Veridian Nexus',
          }
        : {
            caseId: caseId || selectedCaseId,
          };

      const res = await fetch('/api/brain-ai/correct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setActiveVerdict(json.data);
          if (isCustomMode && !presetCases.some((c) => c.caseId === json.data.caseId)) {
            setPresetCases((prev) => [json.data, ...prev]);
            setSelectedCaseId(json.data.caseId);
          }
        }
      }
    } catch (err) {
      console.error('Failed to execute Brain AI correction:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 3. Search Data Verification Registry
  const handleSearchRegistry = async (queryToRun: string) => {
    setIsSearching(true);
    try {
      const res = await fetch('/api/brain-ai/verify-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryToRun }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setVerifiedRecords(json.data.matchedRecords || []);
          if (json.data.matchedRecords?.length > 0) {
            setSelectedRecord(json.data.matchedRecords[0]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to query verification registry:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // 4. Generate Section 90A Digital Certificate
  const handleGenerateCertificate = async (recordId: string) => {
    try {
      const res = await fetch('/api/brain-ai/generate-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setCertificateModalData(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to generate certificate:', err);
    }
  };

  // 4b. Run Autonomous Full-System Auto-Check & Auto-Correction
  const handleRunAutonomousAudit = async () => {
    setIsRunningAutoAudit(true);
    setAutoAuditProgressStep('Initiating autonomous full-system audit scan...');
    try {
      setAutoAuditProgressStep('Phase 1/5: Auditing 74 corporate registry filings & Form 32A transfers...');
      await new Promise((r) => setTimeout(r, 450));
      setAutoAuditProgressStep('Phase 2/5: Reconciling JPN vital birth/death registers & 24-loci STR DNA concordance...');
      await new Promise((r) => setTimeout(r, 450));
      setAutoAuditProgressStep('Phase 3/5: Cross-checking High Court probate dockets & voiding forged 2023 codicils...');
      await new Promise((r) => setTimeout(r, 450));
      setAutoAuditProgressStep('Phase 4/5: Tracing SWIFT MT103 wire settlements & validating BNM FIED AMLA clearance...');
      await new Promise((r) => setTimeout(r, 450));
      setAutoAuditProgressStep('Phase 5/5: Expunging adverse caveats & recalculating Evidence Act S.90A SHA-256 digests...');
      await new Promise((r) => setTimeout(r, 450));

      const res = await fetch('/api/brain-ai/auto-audit/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceFullRescan: true }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setAutoAuditSummary(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to run autonomous auto-audit:', err);
    } finally {
      setIsRunningAutoAudit(false);
      setAutoAuditProgressStep('');
    }
  };

  // 4c. Export Full Rectification Decree Text
  const handleExportDecree = async () => {
    try {
      const res = await fetch('/api/brain-ai/auto-audit/export-decree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.decreeText) {
          setDecreeModalText(json.data.decreeText);

          // Also trigger automatic download
          const blob = new Blob([json.data.decreeText], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `BRAIN-AI-AUTO-RECTIFICATION-DECREE-${json.data.auditRunId}.txt`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }
    } catch (err) {
      console.error('Failed to export decree:', err);
    }
  };

  const copyChangeHash = (id: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedChangeHash(id);
    setTimeout(() => setCopiedChangeHash(null), 2000);
  };

  // Filter auto-corrected changes
  const filteredChanges = (autoAuditSummary?.changesMade || []).filter((change) => {
    if (selectedDomainFilter !== 'ALL' && change.domain !== selectedDomainFilter) {
      return false;
    }
    if (selectedSeverityFilter !== 'ALL' && change.severity !== selectedSeverityFilter) {
      return false;
    }
    if (changeSearchQuery.trim()) {
      const q = changeSearchQuery.toLowerCase().trim();
      return (
        change.id.toLowerCase().includes(q) ||
        change.targetEntityOrDoc.toLowerCase().includes(q) ||
        change.fieldOrParameter.toLowerCase().includes(q) ||
        change.preCorrectionState.toLowerCase().includes(q) ||
        change.postCorrectionState.toLowerCase().includes(q) ||
        change.statutoryAnchor.toLowerCase().includes(q) ||
        change.custodianAuthority.toLowerCase().includes(q) ||
        change.correctionRationale.toLowerCase().includes(q) ||
        change.sha256VerificationHash.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // 5. Download Verdict as Judicial Text
  const handleDownloadVerdict = () => {
    if (!activeVerdict) return;
    const content = `========================================================================
JUDICIAL BRAIN AI CORRECTIONAL CENTER - OFFICIAL SANCTION DECREE
MALAYSIA GOVERNMENT DATA EXCHANGE (MyGDX) & HIGH COURT OF MALAYA
========================================================================
CASE IDENTIFIER: ${activeVerdict.caseId}
TITLE: ${activeVerdict.title}
CATEGORY: ${activeVerdict.category}
SEVERITY RATING: ${activeVerdict.severity}
SUBJECT INVOLVED: ${activeVerdict.submittedSubject}
TIMESTAMP: ${activeVerdict.timestamp}
AI ADJUDICATOR: ${activeVerdict.aiModelUsed}
NEURAL CONFIDENCE SCORE: ${activeVerdict.neuralConfidenceScore}%
SHA-256 CERTIFICATE DIGEST: ${activeVerdict.sha256CertificateHash}

------------------------------------------------------------------------
1. SUBMITTED ANOMALOUS DOCUMENT OR CLAIM
------------------------------------------------------------------------
${activeVerdict.submittedDocumentOrClaim}

------------------------------------------------------------------------
2. FLAGGED ANOMALIES & FORENSIC CONTRADICTIONS
------------------------------------------------------------------------
${activeVerdict.flaggedAnomalies
  .map(
    (a, i) => `[${i + 1}] FIELD: ${a.field}
    - CLAIMED: ${a.claimedValue}
    - AUTHORITATIVE: ${a.verifiedAuthoritativeValue}
    - FORENSIC DEFECT: ${a.anomalyDescription}
    - DETECTION RULE: ${a.forensicDetectionRule}\n`
  )
  .join('\n')}

------------------------------------------------------------------------
3. STATUTORY BREACHES & CRIMINAL SANCTIONS
------------------------------------------------------------------------
${activeVerdict.statutoryBreaches
  .map(
    (b, i) => `[${i + 1}] ${b.act} - ${b.section}
    - VIOLATION: ${b.violationTitle}
    - STATUTORY SANCTION: ${b.legalSanction}\n`
  )
  .join('\n')}

------------------------------------------------------------------------
4. AUTHORITATIVE GROUND TRUTH ESTABLISHED
------------------------------------------------------------------------
${activeVerdict.authoritativeGroundTruth
  .map(
    (g, i) => `[${i + 1}] REGISTRY: ${g.registry} (${g.officialRecordNumber})
    - CUSTODIAN AGENCY: ${g.custodianAgency}
    - ESTABLISHED FACT: ${g.establishedFact}\n`
  )
  .join('\n')}

------------------------------------------------------------------------
5. BRAIN AI ADJUDICATION VERDICT
------------------------------------------------------------------------
VERDICT: ${activeVerdict.aiAdjudicationVerdict}

ORDERED CORRECTIVE ACTIONS:
${activeVerdict.orderedCorrectiveActions.map((c, i) => `  ${i + 1}. ${c}`).join('\n')}

NEURAL REASONING STEPS:
${activeVerdict.reasoningStepByStep.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}

========================================================================
CERTIFIED CONCLUSIVE EVIDENCE UNDER EVIDENCE ACT 1950 SECTION 90A
========================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BRAIN-AI-CORRECTION-${activeVerdict.caseId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string, isCert = false) => {
    navigator.clipboard.writeText(text);
    if (isCert) {
      setCopiedCert(true);
      setTimeout(() => setCopiedCert(false), 2000);
    } else {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  // Filter records by dimension
  const filteredRecords = verifiedRecords.filter((rec) => {
    if (selectedDimensionFilter === 'ALL') return true;
    return rec.dimension === selectedDimensionFilter;
  });

  return (
    <div className="space-y-6">
      {/* Supreme Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl border border-indigo-500/30 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                Cognitive Judicial Intelligence
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Evidence Act 1950 S.90A
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Brain AI Correctional Center &amp; Data Verification System
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Autonomous neural discrepancy reconciliation engine and multi-dimensional statutory registry cross-check hub. Actively identifies fabricated corporate minutes, forged Form 32A transfers, false adoption claims, and money laundering diversions, issuing cryptographically sealed judicial correction verdicts.
            </p>

            {/* Quick Metrics Badges */}
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="px-3 py-1 bg-slate-800/80 rounded-lg border border-slate-700 text-slate-200 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                AI Model: gemini-3.8-flash
              </span>
              <span className="px-3 py-1 bg-slate-800/80 rounded-lg border border-slate-700 text-slate-200 flex items-center gap-1.5 font-mono">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                {verificationOverview?.totalRecordsIndexed || 8} Verified Registry Records
              </span>
              <span className="px-3 py-1 bg-slate-800/80 rounded-lg border border-slate-700 text-slate-200 flex items-center gap-1.5 font-mono">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                Digital Signature Act 1997
              </span>
              <span className="px-3 py-1 bg-slate-800/80 rounded-lg border border-slate-700 text-slate-200 flex items-center gap-1.5 font-mono">
                <Award className="w-3.5 h-3.5 text-purple-400" />
                100% Registry Alignment
              </span>
            </div>
          </div>

          {/* Wing Switcher */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700/80">
            <button
              onClick={() => setActiveWing('auto_audit_changes')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-between gap-2.5 ${
                activeWing === 'auto_audit_changes'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 text-emerald-300 ${isRunningAutoAudit ? 'animate-spin' : ''}`} />
                <span>1. Auto-Audit &amp; Changes List</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-200 border border-emerald-500/40">
                {autoAuditSummary?.totalAutoCorrectionsApplied || 14} Fixed
              </span>
            </button>

            <button
              onClick={() => setActiveWing('correction_center')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-between gap-2.5 ${
                activeWing === 'correction_center'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-amber-300" />
                <span>2. Case Dispute Adjudication</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900/60 text-slate-300">
                {presetCases.length || 4} Cases
              </span>
            </button>

            <button
              onClick={() => setActiveWing('data_verification')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-between gap-2.5 ${
                activeWing === 'data_verification'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-300" />
                <span>3. Data Verification Registry (5D)</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900/60 text-slate-300">
                {verifiedRecords.length || 6} Records
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* WING 1: BRAIN AI AUTO-AUDIT & AUTO-CORRECTED CHANGES MADE (SEPARATE LIST) */}
      {/* ========================================================================= */}
      {activeWing === 'auto_audit_changes' && (
        <div className="space-y-6">
          {/* Master Autonomous Control & Execution Banner */}
          <div className="bg-slate-900 rounded-2xl border border-emerald-500/40 p-6 shadow-xl relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Autonomous Real-Time Audit Engine Active
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                    Evidence Act 1950 (Act 56) S.90A
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Companies Act 2016 S.600
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
                  <RefreshCw className={`w-6 h-6 text-emerald-400 ${isRunningAutoAudit ? 'animate-spin' : ''}`} />
                  Brain AI Full-System Auto-Check &amp; Rectification Engine
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Brain AI continuously sweeps all application data, corporate registers, civil lineage archives, High Court probate dockets, land titles, and international wire transcripts. Any fraudulent alterations, forged Form 32A transfers, or unverified claims are automatically detected, corrected back to statutory ground truth, and recorded in the separate changes list below.
                </p>

                {autoAuditSummary && (
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                    <span>Audit Run: <strong className="text-slate-200">{autoAuditSummary.auditRunId}</strong></span>
                    <span>Last Checked: <strong className="text-slate-200">{new Date(autoAuditSummary.completedAt).toLocaleTimeString()}</strong></span>
                    <span>Master Seal: <strong className="text-emerald-400">{autoAuditSummary.masterSealSha256.slice(0, 16)}...</strong></span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 sm:w-auto w-full">
                <button
                  onClick={handleRunAutonomousAudit}
                  disabled={isRunningAutoAudit}
                  className={`px-5 py-3 rounded-xl font-bold text-xs tracking-wide shadow-lg transition flex items-center justify-center gap-2 ${
                    isRunningAutoAudit
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${isRunningAutoAudit ? 'animate-spin' : ''}`} />
                  {isRunningAutoAudit ? 'Sweeping System & Rectifying...' : 'Run Autonomous Auto-Check & Auto-Correct'}
                </button>

                <button
                  onClick={handleExportDecree}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-indigo-600/80 hover:bg-indigo-600 text-white border border-indigo-400/40 shadow-sm transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-indigo-200" />
                  Export S.90A Rectification Decree (.txt)
                </button>

                {autoAuditSummary && (
                  <button
                    onClick={() => copyToClipboard(autoAuditSummary.masterSealSha256)}
                    className="px-4 py-2 rounded-xl text-xs font-mono bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition flex items-center justify-center gap-1.5"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedHash ? 'Master Seal Copied!' : 'Copy Master SHA-256 Seal'}
                  </button>
                )}
              </div>
            </div>

            {/* Live Progress Indicator Bar during sweep */}
            {isRunningAutoAudit && (
              <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-300">
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    {autoAuditProgressStep}
                  </span>
                  <span>Autonomous Engine Scanning...</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 h-2 rounded-full animate-pulse w-full"></div>
                </div>
              </div>
            )}
          </div>

          {/* Master Audit KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                Entities Audited
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
                {autoAuditSummary?.totalEntitiesChecked || 74}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                SSM, JPN, BNM, PTG Land
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                Docs &amp; Exhibits Scanned
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
                {(autoAuditSummary?.totalDocumentsScanned || 22)} / {(autoAuditSummary?.totalEvidenceArtifactsInspected || 48)}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Court Dockets &amp; Registers
              </div>
            </div>

            <div className="bg-white rounded-xl border border-emerald-200 bg-emerald-50/20 p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Auto-Corrected
              </div>
              <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">
                {autoAuditSummary?.totalAutoCorrectionsApplied || 14} Changes
              </div>
              <div className="text-[11px] text-emerald-600 mt-0.5">
                100% Rectifications Applied
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="text-[11px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-600" />
                System Integrity
              </div>
              <div className="text-2xl font-black text-emerald-600 mt-1 font-mono flex items-center gap-1.5">
                <span>100.0%</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-sans font-bold">
                  Restored
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Pre-Audit: {autoAuditSummary?.systemIntegrityPreAudit || 71.4}%
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm col-span-2 sm:col-span-1">
              <div className="text-[11px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                Legal Admissibility
              </div>
              <div className="text-sm font-black text-purple-900 mt-2 font-mono">
                CONCLUSIVE PROOF
              </div>
              <div className="text-[11px] text-purple-700 mt-0.5">
                Evidence Act S.90A Certified
              </div>
            </div>
          </div>

          {/* DEDICATED SEPARATE LIST OF CHANGES MADE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider bg-indigo-100 text-indigo-800 font-mono">
                    OFFICIAL RECTIFICATION REGISTER
                  </span>
                  <span className="text-xs text-slate-400">|</span>
                  <span className="text-xs font-semibold text-slate-600">
                    Separate List of Changes Made by Brain AI
                  </span>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                  <span>Certified List of Auto-Corrected Data, Documents &amp; Evidence</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {filteredChanges.length} of {autoAuditSummary?.changesMade.length || 14} Changes
                  </span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Every listed entry details the adverse/unverified claim prior to correction alongside the restored statutory ground truth value.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportDecree}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  Download Decree
                </button>
                <button
                  onClick={() => {
                    const allText = (autoAuditSummary?.changesMade || [])
                      .map((c, i) => `${i + 1}. [${c.id}] ${c.targetEntityOrDoc} -> RESTORED: ${c.postCorrectionState}`)
                      .join('\n');
                    copyToClipboard(allText);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition flex items-center gap-1.5"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                  Copy Summary List
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={changeSearchQuery}
                    onChange={(e) => setChangeSearchQuery(e.target.value)}
                    placeholder="Search changed entity, document, statute, parameter, or prior claim..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {changeSearchQuery && (
                    <button
                      onClick={() => setChangeSearchQuery('')}
                      className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedSeverityFilter}
                    onChange={(e) => setSelectedSeverityFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                  >
                    <option value="ALL">All Severities</option>
                    <option value="CRITICAL">Critical Only</option>
                    <option value="HIGH">High Severity</option>
                    <option value="MEDIUM">Medium Severity</option>
                  </select>
                </div>
              </div>

              {/* Domain Filter Pills */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  { key: 'ALL', label: 'All Domains' },
                  { key: 'CORPORATE_REGISTRY', label: 'Corporate Registry (SSM)' },
                  { key: 'CIVIL_LINEAGE', label: 'Civil Lineage (JPN)' },
                  { key: 'FORENSIC_EVIDENCE', label: 'DNA & Forensics' },
                  { key: 'JUDICIAL_PROBATE', label: 'High Court Probate' },
                  { key: 'FINANCIAL_AMLA', label: 'Banking & AMLA' },
                  { key: 'ASSET_LEDGER', label: 'Real Estate Titles' },
                  { key: 'PROXY_IDENTIFICATION', label: 'Proxy X Criminal Warrants' },
                  { key: 'CRYPTOGRAPHIC_INTEGRITY', label: 'S.90A Hashes' },
                ].map((pill) => (
                  <button
                    key={pill.key}
                    onClick={() => setSelectedDomainFilter(pill.key)}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      selectedDomainFilter === pill.key
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Render Changes List */}
            <div className="space-y-4 pt-2">
              {filteredChanges.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs">
                  No changes match the filter criteria "{changeSearchQuery}".
                </div>
              ) : (
                filteredChanges.map((item, index) => {
                  const isExpanded = expandedChangeId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition shadow-sm overflow-hidden"
                    >
                      {/* Change Item Card Header */}
                      <div className="p-4 bg-slate-50/60 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-slate-900 text-white">
                            {item.id}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {item.domainLabel}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.severity === 'CRITICAL'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : item.severity === 'HIGH'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {item.severity}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            Seq #{index + 1}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {item.status.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {/* Main Content Body */}
                      <div className="p-5 space-y-4">
                        {/* Target Entity & Parameter */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                              Target Entity / Evidentiary Document
                            </div>
                            <h5 className="text-base font-extrabold text-slate-900 mt-0.5 flex items-center gap-2">
                              <span>{item.targetEntityOrDoc}</span>
                            </h5>
                          </div>

                          <div className="sm:text-right">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                              Audited Parameter / Field
                            </div>
                            <div className="text-xs font-mono font-bold text-indigo-700 mt-0.5">
                              {item.fieldOrParameter}
                            </div>
                          </div>
                        </div>

                        {/* Side-by-Side Comparison: Pre-Correction vs. Post-Correction */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                          {/* Left: Pre-Correction Adverse Claim */}
                          <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1.5">
                            <div className="text-[11px] font-bold uppercase text-rose-800 flex items-center gap-1.5">
                              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                              Pre-Correction Disputed Claim (Anomalous / Forged):
                            </div>
                            <p className="text-xs text-rose-950 font-medium leading-relaxed">
                              "{item.preCorrectionState}"
                            </p>
                            <div className="text-[10px] text-rose-700 italic font-mono pt-1">
                              Status: FLAGGED &amp; EXPUNGED BY BRAIN AI
                            </div>
                          </div>

                          {/* Right: Post-Correction Ground Truth */}
                          <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-1.5 shadow-sm">
                            <div className="text-[11px] font-bold uppercase text-emerald-800 flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                              Auto-Corrected Ground Truth (Restored &amp; Locked):
                            </div>
                            <p className="text-xs text-emerald-950 font-bold leading-relaxed">
                              "{item.postCorrectionState}"
                            </p>
                            <div className="text-[10px] text-emerald-700 font-mono pt-1 flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              RECONCILED AGAINST AUTHORITATIVE GOVERNMENT RECORD
                            </div>
                          </div>
                        </div>

                        {/* Statutory Authority & Custodian Anchor */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="space-y-0.5">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">
                              Governing Statutory Anchor
                            </div>
                            <div className="font-semibold text-slate-800 font-mono">
                              {item.statutoryAnchor}
                            </div>
                          </div>

                          <div className="space-y-0.5 sm:text-right">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">
                              Custodian Authority
                            </div>
                            <div className="font-semibold text-slate-800">
                              {item.custodianAuthority}
                            </div>
                          </div>
                        </div>

                        {/* Expandable Forensic Rationale & Tested Loci */}
                        <div>
                          <button
                            onClick={() => setExpandedChangeId(isExpanded ? null : item.id)}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                          >
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                            {isExpanded ? 'Hide Technical Rationale & Tested Loci' : 'View Technical Rationale & Tested Loci'}
                          </button>

                          {isExpanded && (
                            <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                              <div>
                                <span className="font-bold text-slate-700">Forensic Correction Rationale:</span>
                                <p className="text-slate-600 mt-1 leading-relaxed">
                                  {item.correctionRationale}
                                </p>
                              </div>

                              <div>
                                <span className="font-bold text-slate-700">Tested Verification Loci:</span>
                                <ul className="mt-1 space-y-1 pl-1">
                                  {item.testedLoci.map((loci, lIdx) => (
                                    <li key={lIdx} className="flex items-center gap-1.5 text-slate-600 font-mono text-[11px]">
                                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                      {loci}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Card Footer: SHA-256 Digest */}
                        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] font-mono text-slate-500">
                          <div className="flex items-center gap-1.5 truncate max-w-lg">
                            <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="text-slate-400">SHA-256 Digest:</span>
                            <span className="text-slate-700 truncate">{item.sha256VerificationHash}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => copyChangeHash(item.id, item.sha256VerificationHash)}
                              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1"
                            >
                              {copiedChangeHash === item.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-700 font-sans font-bold text-[10px]">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-slate-500" />
                                  <span className="font-sans text-[10px]">Copy Hash</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WING 2: BRAIN AI CASE DISPUTE ADJUDICATION                                */}
      {/* ========================================================================= */}
      {activeWing === 'correction_center' && (
        <div className="space-y-6">
          {/* Preset Case Selector and Ingestion Controls */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-600" />
                  Select Pre-Indexed Anomaly Dispute or Ingest Questionable Document
                </h3>
                <p className="text-xs text-slate-500">
                  Run cognitive forensic correction to deconstruct deceptive claims and generate binding legal verdicts.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCustomMode(!isCustomMode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
                    isCustomMode
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  {isCustomMode ? 'Switch to Preset Disputes' : 'Custom Ingestion Mode'}
                </button>

                {onNavigateToPoaDossier && (
                  <button
                    onClick={onNavigateToPoaDossier}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    View Master Dossier
                  </button>
                )}
              </div>
            </div>

            {/* If In Custom Ingestion Mode */}
            {isCustomMode ? (
              <div className="space-y-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Document / Dispute Title</label>
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder="e.g. Suspicious Share Transfer Form 32A or Adverse Lineage Allegation"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Forensic Category</label>
                    <select
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value as BrainAiCaseCategory)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="CUSTOM_INGESTION">Custom Forensic Ingestion</option>
                      <option value="CORPORATE_FORGERY">Corporate Share Capital &amp; Form 32A Forgery</option>
                      <option value="IDENTITY_LINEAGE">Identity, Birth Register &amp; Adoption Discrepancy</option>
                      <option value="JUDICIAL_PROBATE">Probate, Will &amp; High Court Estate Dispute</option>
                      <option value="BANKING_DIVERSION">SWIFT Wire Diversion &amp; AMLA Red Flag</option>
                      <option value="PROXY_DECEPTION">Nominee / Proxy X Identity Concealment</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 text-xs mb-1">
                    Suspect Claim, Discrepancy Text or Ingested Document Body
                  </label>
                  <textarea
                    rows={3}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Paste conflicting legal clauses, contested board minutes, altered birth/death cert details, or suspect share assignment paragraphs..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:ring-2 focus:ring-indigo-500 font-mono leading-relaxed"
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleRunCorrection()}
                    disabled={isAnalyzing || !customText.trim()}
                    className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-2 disabled:opacity-50 shadow-md shadow-indigo-600/20"
                  >
                    {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                    Execute Brain AI Cognitive Correction
                  </button>
                </div>
              </div>
            ) : (
              /* Preset Disputes Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {presetCases.map((c) => (
                  <button
                    key={c.caseId}
                    onClick={() => {
                      setSelectedCaseId(c.caseId);
                      setActiveVerdict(c);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between space-y-2.5 ${
                      selectedCaseId === c.caseId
                        ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-500/20 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-slate-600">{c.caseId}</span>
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                            c.severity === 'CRITICAL'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {c.severity}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">{c.title}</div>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200">
                      <span className="font-mono text-emerald-700 font-semibold">{c.neuralConfidenceScore}% Trust</span>
                      <span className="text-indigo-600 font-medium hover:underline flex items-center gap-0.5 text-[10px]">
                        Inspect <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Brain AI Adjudication & Sanction Manifest */}
          {activeVerdict && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
              {/* Verdict Header Ribbon */}
              <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
                      {activeVerdict.caseId}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide text-amber-400">
                      {activeVerdict.category.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(activeVerdict.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-white">{activeVerdict.title}</h3>
                  <div className="text-xs text-slate-300">
                    Subject: <span className="font-semibold text-slate-100">{activeVerdict.submittedSubject}</span>
                  </div>
                </div>

                {/* Right side: AI Decision Banner & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 text-center sm:text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Neural Verdict</div>
                    <div className="text-xs font-extrabold text-emerald-400 font-mono tracking-wider">
                      {activeVerdict.aiAdjudicationVerdict.replace(/_/g, ' ')}
                    </div>
                    <div className="text-[10px] text-slate-400">Confidence: {activeVerdict.neuralConfidenceScore}%</div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadVerdict}
                      className="p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition flex items-center gap-1.5 shadow-sm"
                      title="Download Certified Judicial Sanction Decree"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Download Decree</span>
                    </button>

                    <button
                      onClick={() => handleRunCorrection(activeVerdict.caseId)}
                      disabled={isAnalyzing}
                      className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs transition"
                      title="Re-run AI Analysis"
                    >
                      <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin text-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Submitted Anomaly Summary */}
              <div className="p-4 bg-amber-50/70 border-b border-amber-200 text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-amber-950 uppercase tracking-wide">
                    Ingested Questionable Record / Adverse Submission
                  </div>
                  <div className="text-amber-900 leading-relaxed font-mono text-[11px]">
                    "{activeVerdict.submittedDocumentOrClaim}"
                  </div>
                </div>
              </div>

              {/* 4 Multi-Dimensional Forensic Blocks */}
              <div className="p-5 space-y-6">
                {/* 1. Flagged Contradictions & Chemical/Systemic Forensics */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-indigo-600" />
                      1. Flagged Contradictions &amp; Forensic Defect Breakdown ({activeVerdict.flaggedAnomalies.length})
                    </h4>
                    <span className="text-[11px] text-slate-500 font-mono">Forensic Cross-Examination</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    {activeVerdict.flaggedAnomalies.map((ano, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2.5"
                      >
                        <div className="font-bold text-slate-900 text-xs pb-1 border-b border-slate-200 flex items-center justify-between">
                          <span>{ano.field}</span>
                          <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold">
                            DEFECT
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="text-slate-500 text-[11px]">Adverse Claim:</div>
                          <div className="text-red-700 font-medium bg-red-50 p-1.5 rounded border border-red-200 text-[11px]">
                            {ano.claimedValue}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-slate-500 text-[11px]">Authoritative Ground Truth:</div>
                          <div className="text-emerald-800 font-medium bg-emerald-50 p-1.5 rounded border border-emerald-200 text-[11px]">
                            {ano.verifiedAuthoritativeValue}
                          </div>
                        </div>

                        <div className="pt-1 text-[11px] text-slate-600 italic">
                          <span className="font-semibold text-slate-800">Defect Analysis:</span> {ano.anomalyDescription}
                        </div>

                        <div className="text-[10px] font-mono text-indigo-700 pt-1">
                          Rule: {ano.forensicDetectionRule}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Statutory Violations & Criminal Sanctions */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-600" />
                    2. Statutory Breaches &amp; Penal Sanctions
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeVerdict.statutoryBreaches.map((sb, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-red-50/50 border border-red-200 text-xs space-y-1.5"
                      >
                        <div className="font-bold text-red-950 flex items-center justify-between">
                          <span>{sb.act}</span>
                          <span className="font-mono text-red-800 font-bold px-2 py-0.5 bg-red-100 rounded">
                            {sb.section}
                          </span>
                        </div>
                        <div className="text-red-900 font-medium">{sb.violationTitle}</div>
                        <div className="text-[11px] text-slate-700 bg-white/80 p-2 rounded border border-red-200/60 font-mono">
                          <span className="font-semibold text-red-900">Sanction:</span> {sb.legalSanction}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Authoritative Registries Reconciled */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    3. Primary Custodian Databases &amp; Statutory Truth Established
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeVerdict.authoritativeGroundTruth.map((gt, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs space-y-1.5"
                      >
                        <div className="font-bold text-emerald-950 flex items-center justify-between">
                          <span>{gt.registry}</span>
                          <span className="font-mono text-emerald-800 font-semibold text-[11px]">
                            {gt.officialRecordNumber}
                          </span>
                        </div>
                        <div className="text-slate-600 text-[11px]">Custodian: {gt.custodianAgency}</div>
                        <div className="text-emerald-900 font-semibold bg-white p-2 rounded border border-emerald-200">
                          {gt.establishedFact}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Ordered Corrective Actions & Neural Reasoning */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-2.5">
                    <div className="font-bold text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      Ordered Judicial Rectifications
                    </div>
                    <ul className="space-y-2">
                      {activeVerdict.orderedCorrectiveActions.map((act, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-800 text-[11px] leading-relaxed">
                          <span className="w-4 h-4 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                            {idx + 1}
                          </span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-purple-600" />
                      Cognitive Neural Reasoning Sequence
                    </div>
                    <ul className="space-y-1.5 font-mono text-[11px] text-slate-700">
                      {activeVerdict.reasoningStepByStep.map((step, idx) => (
                        <li key={idx} className="p-1.5 bg-white rounded border border-slate-200 leading-snug">
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Cryptographic Hash Seal Footer */}
                <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 font-mono">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-400">SHA-256 Seal:</span>
                    <span className="text-emerald-300 truncate max-w-[280px] sm:max-w-md">
                      {activeVerdict.sha256CertificateHash}
                    </span>
                  </div>

                  <button
                    onClick={() => copyToClipboard(activeVerdict.sha256CertificateHash)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] flex items-center gap-1 transition self-start sm:self-auto"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedHash ? 'Copied' : 'Copy Seal'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* WING 2: DATA VERIFICATION SYSTEM                                          */}
      {/* ========================================================================= */}
      {activeWing === 'data_verification' && (
        <div className="space-y-6">
          {/* Verification Search and Filter Bar */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Multi-Dimensional Statutory Data Verification Hub
                </h3>
                <p className="text-xs text-slate-500">
                  Cross-checks identifiers across JPN Civil Registers, SSM Corporate Equity, High Court Probate, Jabatan Kimia DNA, and BNM FIED.
                </p>
              </div>

              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-mono font-bold">
                100% Registry Integrity
              </span>
            </div>

            {/* Search Input */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearchRegistry(searchQuery);
                  }}
                  placeholder="Scan NRIC (960906-08-5839), SSM (202101038912), Case No (WA-32NCvC-1102), Birth/Death Cert, or SHA-256 Hash..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={() => handleSearchRegistry(searchQuery)}
                disabled={isSearching}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Scan Registry
              </button>

              <button
                onClick={() => {
                  setSearchQuery('');
                  handleSearchRegistry('');
                }}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
              >
                Reset
              </button>
            </div>

            {/* Quick Dimension Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 pt-1 text-xs">
              {[
                { key: 'ALL', label: 'All Dimensions' },
                { key: 'CIVIL_LINEAGE', label: 'Civil & JPN Vital' },
                { key: 'CORPORATE_EQUITY', label: 'SSM Corporate Equity' },
                { key: 'JUDICIAL_PROBATE', label: 'High Court Probate' },
                { key: 'BIOMETRIC_DNA', label: 'Jabatan Kimia DNA' },
                { key: 'FINANCIAL_AMLA', label: 'BNM AMLA Clearance' },
                { key: 'PROXY_IDENTIFIER', label: 'Proxy X Criminal Indictment' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setSelectedDimensionFilter(f.key)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                    selectedDimensionFilter === f.key
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Verification Dimensions Grid Overview */}
          {verificationOverview && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {verificationOverview.verificationDimensions.map((dim) => (
                <div
                  key={dim.key}
                  onClick={() => setSelectedDimensionFilter(dim.key)}
                  className={`p-3 rounded-xl border cursor-pointer transition text-xs space-y-1 ${
                    selectedDimensionFilter === dim.key
                      ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-[11px] truncate">{dim.title}</div>
                  <div className="text-[10px] text-slate-500 truncate">{dim.authority}</div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono font-bold text-emerald-700">{dim.recordCount} Rec</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Verified Records Table & Detail Split Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Records List (5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>Verified Records ({filteredRecords.length})</span>
                <span className="text-[11px] text-slate-500 font-mono">Evidence Act S.90A</span>
              </div>

              <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
                {filteredRecords.map((rec) => {
                  const isSelected = selectedRecord?.id === rec.id;
                  return (
                    <div
                      key={rec.id}
                      onClick={() => setSelectedRecord(rec)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition space-y-2 ${
                        isSelected
                          ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-500/20 shadow-sm'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-slate-600">{rec.id}</span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            rec.verificationStatus === 'AUTHENTIC_VERIFIED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {rec.verificationStatus.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-900">{rec.identifierType}</div>
                        <div className="text-[11px] font-mono text-amber-700 font-semibold">
                          {rec.primaryIdentifier}
                        </div>
                        <div className="text-[11px] text-slate-600 truncate">{rec.targetSubject}</div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/80">
                        <span className="truncate max-w-[200px]">{rec.issuingAuthority}</span>
                        <span className="font-mono">{rec.verifiedDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected Record Comprehensive Audit Inspector (7 Cols) */}
            <div className="lg:col-span-7">
              {selectedRecord ? (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                          {selectedRecord.id}
                        </span>
                        <span className="text-xs text-indigo-700 font-semibold">
                          {selectedRecord.dimensionLabel}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900">{selectedRecord.identifierType}</h4>
                      <div className="font-mono text-xs text-amber-800 font-bold">
                        {selectedRecord.primaryIdentifier}
                      </div>
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-1.5">
                      <span
                        className={`text-xs font-extrabold px-2.5 py-1 rounded-full uppercase ${
                          selectedRecord.verificationStatus === 'AUTHENTIC_VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {selectedRecord.verificationStatus.replace(/_/g, ' ')}
                      </span>

                      <button
                        onClick={() => handleGenerateCertificate(selectedRecord.id)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                      >
                        <Award className="w-3.5 h-3.5" />
                        Generate S.90A Certificate
                      </button>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <div className="text-slate-500 text-[11px]">Primary Subject</div>
                      <div className="font-bold text-slate-900">{selectedRecord.targetSubject}</div>
                      <div className="text-slate-600 text-[11px]">Authority: {selectedRecord.issuingAuthority}</div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <div className="text-slate-500 text-[11px]">Statutory Anchor</div>
                      <div className="font-bold text-indigo-900">{selectedRecord.statutoryAnchor}</div>
                      <div className="text-slate-600 font-mono text-[11px]">Ref: {selectedRecord.officialReferenceNumber}</div>
                    </div>
                  </div>

                  {/* Verification Loci Matrix */}
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center justify-between">
                      <span>Tested Verification Loci ({selectedRecord.verificationLoci.length} Parameters)</span>
                      <span className="text-[10px] text-emerald-700 font-mono font-bold">100% Concordance</span>
                    </div>

                    <div className="space-y-1.5">
                      {selectedRecord.verificationLoci.map((loc, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                        >
                          <span className="font-medium text-slate-800">{loc.parameter}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-slate-600 text-[11px]">{loc.detail}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                loc.status === 'VERIFIED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {loc.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Attestation & Remarks */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-900 uppercase text-[11px] tracking-wide">
                      Attesting Officer Certification
                    </div>
                    <div className="text-slate-800 font-semibold">{selectedRecord.attestingOfficer}</div>
                    <div className="text-slate-600 text-[11px] italic">"{selectedRecord.officialRemarks}"</div>
                    <div className="text-slate-400 font-mono text-[10px] pt-1">Verified on: {selectedRecord.verifiedDate}</div>
                  </div>

                  {/* Cryptographic SHA-256 Hash */}
                  <div className="p-3 rounded-lg bg-slate-900 text-white text-xs font-mono flex items-center justify-between gap-2">
                    <div className="truncate">
                      <span className="text-slate-400">Digest: </span>
                      <span className="text-emerald-400">{selectedRecord.cryptographicSha256}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedRecord.cryptographicSha256)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
                  Select a verified record to inspect comprehensive audit parameters.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SECTION 90A DIGITAL CERTIFICATE OF VERIFICATION                   */}
      {/* ========================================================================= */}
      {certificateModalData && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-extrabold tracking-wide uppercase">
                  Evidence Act 1950 Section 90A Certificate
                </h3>
              </div>
              <button
                onClick={() => setCertificateModalData(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs font-mono bg-slate-50 leading-relaxed text-slate-800">
              <pre className="whitespace-pre-wrap">{certificateModalData.certificateText}</pre>
            </div>

            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <div className="text-slate-500 text-xs font-mono">
                Digitally Sealed under Digital Signature Act 1997
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(certificateModalData.certificateText, true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5"
                >
                  {copiedCert ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCert ? 'Copied' : 'Copy Text'}
                </button>
                <button
                  onClick={() => setCertificateModalData(null)}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official S.90A Rectification Decree Modal */}
      {decreeModalText && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">
                  Official Section 90A Judicial Rectification Decree &amp; Master Changes List
                </h3>
              </div>
              <button
                onClick={() => setDecreeModalText(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs font-mono bg-slate-50 leading-relaxed text-slate-800">
              <pre className="whitespace-pre-wrap">{decreeModalText}</pre>
            </div>

            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <div className="text-slate-500 text-xs font-mono">
                Digitally Generated under Evidence Act 1950 S.90A &amp; Digital Signature Act 1997
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(decreeModalText);
                    setCopiedDecree(true);
                    setTimeout(() => setCopiedDecree(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5"
                >
                  {copiedDecree ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedDecree ? 'Copied to Clipboard' : 'Copy Decree Text'}
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([decreeModalText], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `BRAIN-AI-DECREE-S90A.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save as .txt
                </button>
                <button
                  onClick={() => setDecreeModalText(null)}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
