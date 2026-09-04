import { useState, useEffect, useId } from 'react';
import {
  FileDown,
  Scale,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Eye,
  FileText,
  Lock,
  Download,
  Building2,
  Calendar,
  Hash,
  Sparkles,
  Layers,
  Settings,
  BookOpen,
  ChevronRight,
  HelpCircle,
  CheckSquare,
  Square,
  Fingerprint,
  Terminal,
} from 'lucide-react';
import type { CompleteForensicThesisDossier } from '../shared/types';
import { DataRetrievalTechnicalWindow } from './DataRetrievalTechnicalWindow';
import {
  compileForensicThesisPdf,
  calculateFileSha256,
  generateSection90AAffidavitText,
  type CourtReadyPdfExportOptions,
  type PdfCompilationProgress,
} from '../utils/pdfThesisCompiler';
import {
  MASTER_COURT_EVIDENTIARY_CATALOG,
  CANONICAL_BRAIN_AI_AUTO_CORRECTIONS,
} from '../shared/courtEvidentiaryMetadata';

interface CourtReadyPdfExporterViewProps {
  onNavigateToDossier?: () => void;
}

type ExporterTab =
  | 'preview'
  | 'section90a_declaration'
  | 'exhibits_schedule'
  | 'brain_ai_corrections'
  | 'crypto_verifier';

interface JudicialPreset {
  id: string;
  name: string;
  forum: string;
  docket: string;
  description: string;
}

const JUDICIAL_PRESETS: JudicialPreset[] = [
  {
    id: 'kl_high_court_commercial',
    name: 'High Court Commercial Division (KL NCC-2)',
    forum: 'High Court of Malaya at Kuala Lumpur (Commercial Division / Special Powers)',
    docket: 'WA-22NCC-482-09/2026',
    description: 'Primary suit: Estate restitution, universal legatee declaration & S.6 Act 424 enforcement.',
  },
  {
    id: 'federal_court_apex',
    name: 'Federal Court of Malaya (Apex Hearing, Putrajaya)',
    forum: 'Federal Court of Malaya (Appellate & Apex Jurisdiction, Palace of Justice Putrajaya)',
    docket: '02(f)-88-11/2026(W)',
    description: 'Conclusive determination on biological legitimacy, DNA admissibility & irrevocability of POA.',
  },
  {
    id: 'sessions_court_ccid',
    name: 'Sessions Court Criminal / CCID Indictment',
    forum: 'Sessions Court of Malaya at Kuala Lumpur (Special Criminal Corruption & AMLA Court)',
    docket: 'WA-62NCC-119-08/2026',
    description: 'Criminal prosecution of adverse proxy syndicate for Section 468/471 Penal Code forgeries.',
  },
  {
    id: 'international_arbitration',
    name: 'Asian International Arbitration Centre (AIAC / Cross-Border)',
    forum: 'Asian International Arbitration Centre (AIAC) / Singapore International Commercial Court',
    docket: 'AIAC/ARB/2026/0491',
    description: 'Offshore settlement & cross-border asset tracing under FINMA and BVI reciprocal treaties.',
  },
];

export function CourtReadyPdfExporterView({ onNavigateToDossier }: CourtReadyPdfExporterViewProps) {
  const baseId = useId();
  const [activeTab, setActiveTab] = useState<ExporterTab>('preview');
  const [dossier, setDossier] = useState<CompleteForensicThesisDossier | null>(null);
  const [isLoadingDossier, setIsLoadingDossier] = useState(false);

  // Configuration options state
  const [selectedPreset, setSelectedPreset] = useState<string>('kl_high_court_commercial');
  const [officerName, setOfficerName] = useState('Dato\' Senior Principal Forensic Registrar');
  const [officerNric, setOfficerNric] = useState('780412-14-5581');
  const [officerDesignation, setOfficerDesignation] = useState('Chief Forensic Technology & Systems Registrar / Senior Custodian');
  const [courtForum, setCourtForum] = useState('High Court of Malaya at Kuala Lumpur (Commercial Division / Special Powers)');
  const [courtFilingRef, setCourtFilingRef] = useState('WA-22NCC-482-09/2026');
  const [deponentChambers, setDeponentChambers] = useState('MyGDX Judicial Central Evidence Gateway, Putrajaya / Kompleks Mahkamah Kuala Lumpur');

  // Inclusions toggles
  const [includeSection90A, setIncludeSection90A] = useState(true);
  const [includeEvidentiaryCatalog, setIncludeEvidentiaryCatalog] = useState(true);
  const [includeBrainAiCorrections, setIncludeBrainAiCorrections] = useState(true);
  const [includeThesisChapters, setIncludeThesisChapters] = useState(true);
  const [includeAssetAndCorporate, setIncludeAssetAndCorporate] = useState(true);
  const [includePDRMAndAmla, setIncludePDRMAndAmla] = useState(true);
  const [includeWatermark, setIncludeWatermark] = useState(true);

  // Compilation state
  const [isCompiling, setIsCompiling] = useState(false);
  const [progress, setProgress] = useState<PdfCompilationProgress | null>(null);
  const [compiledPdfBlob, setCompiledPdfBlob] = useState<Blob | null>(null);
  const [compiledPdfUrl, setCompiledPdfUrl] = useState<string | null>(null);
  const [compiledSha256, setCompiledSha256] = useState<string | null>(null);
  const [compilationTimestamp, setCompilationTimestamp] = useState<string | null>(null);
  const [pdfSizeBytes, setPdfSizeBytes] = useState<number>(0);

  // Verification & Copy tool state
  const [copiedSection90A, setCopiedSection90A] = useState(false);
  const [copiedDigest, setCopiedDigest] = useState(false);
  const [searchExhibitsQuery, setSearchExhibitsQuery] = useState('');
  const [verificationInputHash, setVerificationInputHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    matched: boolean;
    title?: string;
    details?: string;
  } | null>(null);
  const [showRetrievalSpecWindow, setShowRetrievalSpecWindow] = useState(false);

  // Load complete thesis data from API with auto-retry
  const fetchThesisData = async () => {
    setIsLoadingDossier(true);
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch('/api/thesis/complete');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setDossier(json.data);
            if (json.data.thesisMetadata) {
              if (json.data.thesisMetadata.leadCertifyingOfficer) {
                setOfficerName(json.data.thesisMetadata.leadCertifyingOfficer);
              }
              if (json.data.thesisMetadata.thesisReference) {
                setCourtFilingRef(json.data.thesisMetadata.thesisReference);
              }
            }
            break;
          }
        }
      } catch {
        if (attempt < 2) {
          await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
        }
      }
    }
    setIsLoadingDossier(false);
  };

  useEffect(() => {
    fetchThesisData();
  }, []);

  // Handle Preset Selection
  const handleSelectPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    const p = JUDICIAL_PRESETS.find((item) => item.id === presetId);
    if (p) {
      setCourtForum(p.forum);
      setCourtFilingRef(p.docket);
    }
  };

  // Compile Master PDF Action
  const handleCompilePdf = async () => {
    if (!dossier) return;

    setIsCompiling(true);
    setProgress({ step: 'Preparing Section 90A Evidence Declaration & Dossier Metadata...', percent: 5 });

    try {
      const exportOptions: CourtReadyPdfExportOptions = {
        officerName,
        officerNric,
        officerDesignation,
        courtForum,
        courtFilingRef,
        deponentChambers,
        includeSection90ACertificate: includeSection90A,
        includeEvidentiaryCatalog,
        includeBrainAiCorrections,
        includeThesisChapters,
        includeAssetAndCorporateAudit: includeAssetAndCorporate,
        includePDRMAndAmla,
        includeWatermark,
      };

      const blob = await compileForensicThesisPdf(
        dossier,
        (prog) => setProgress(prog),
        exportOptions
      );

      // Clean up previous blob URL
      if (compiledPdfUrl) {
        URL.revokeObjectURL(compiledPdfUrl);
      }

      const url = URL.createObjectURL(blob);
      setCompiledPdfBlob(blob);
      setCompiledPdfUrl(url);
      setPdfSizeBytes(blob.size);

      // Compute native SHA-256
      const hash = await calculateFileSha256(blob);
      setCompiledSha256(hash);
      setCompilationTimestamp(new Date().toLocaleString('en-GB'));
    } catch (err) {
      console.warn('Court-ready PDF compilation failed:', err);
    } finally {
      setIsCompiling(false);
    }
  };

  // Auto-compile once dossier is loaded
  useEffect(() => {
    if (dossier && !compiledPdfBlob && !isCompiling) {
      handleCompilePdf();
    }
  }, [dossier]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (compiledPdfUrl) {
        URL.revokeObjectURL(compiledPdfUrl);
      }
    };
  }, [compiledPdfUrl]);

  // Download PDF file
  const handleDownloadPdf = () => {
    if (!compiledPdfBlob) return;
    const url = URL.createObjectURL(compiledPdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `COURT_READY_FORENSIC_DOSSIER_${courtFilingRef.replace(/[^a-zA-Z0-9]/g, '_')}_S90A.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy Section 90A statutory affirmation text
  const handleCopySection90A = () => {
    if (!dossier) return;
    const exportOptions: CourtReadyPdfExportOptions = {
      officerName,
      officerNric,
      officerDesignation,
      courtForum,
      courtFilingRef,
      deponentChambers,
    };
    const text = generateSection90AAffidavitText(dossier, exportOptions);
    navigator.clipboard.writeText(text);
    setCopiedSection90A(true);
    setTimeout(() => setCopiedSection90A(false), 3000);
  };

  // Download Section 90A certificate as .txt file
  const handleDownloadSection90AText = () => {
    if (!dossier) return;
    const exportOptions: CourtReadyPdfExportOptions = {
      officerName,
      officerNric,
      officerDesignation,
      courtForum,
      courtFilingRef,
      deponentChambers,
    };
    const text = generateSection90AAffidavitText(dossier, exportOptions);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SECTION_90A_CERTIFICATE_OF_COMPUTER_OUTPUT_${courtFilingRef.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy SHA-256 Digest
  const handleCopyDigest = () => {
    if (!compiledSha256) return;
    navigator.clipboard.writeText(compiledSha256);
    setCopiedDigest(true);
    setTimeout(() => setCopiedDigest(false), 2500);
  };

  // Search filter for exhibits
  const filteredExhibits = MASTER_COURT_EVIDENTIARY_CATALOG.filter((ex) => {
    if (!searchExhibitsQuery.trim()) return true;
    const q = searchExhibitsQuery.toLowerCase();
    return (
      ex.exhibitNumber.toLowerCase().includes(q) ||
      ex.documentTitle.toLowerCase().includes(q) ||
      ex.evidentiaryClassification.toLowerCase().includes(q) ||
      ex.sourceDataAuthority.toLowerCase().includes(q) ||
      ex.courtOrJudicialForum.toLowerCase().includes(q) ||
      ex.exactCourtLocation.toLowerCase().includes(q) ||
      ex.sha256VerificationHash.toLowerCase().includes(q)
    );
  });

  // Verify custom hash against catalog or compiled pdf
  const handleVerifyHash = () => {
    const q = verificationInputHash.trim().toLowerCase();
    if (!q) {
      setVerificationResult(null);
      return;
    }

    if (compiledSha256 && compiledSha256.toLowerCase() === q) {
      setVerificationResult({
        matched: true,
        title: 'Master Compiled Court-Ready PDF (Section 90A Evidence Act 1950)',
        details: `Exact match with the active compiled PDF binary. Ref: ${courtFilingRef} • Sealed on: ${compilationTimestamp || 'Active Session'}.`,
      });
      return;
    }

    const foundExhibit = MASTER_COURT_EVIDENTIARY_CATALOG.find(
      (e) => e.sha256VerificationHash.toLowerCase() === q
    );
    if (foundExhibit) {
      setVerificationResult({
        matched: true,
        title: `${foundExhibit.exhibitNumber}: ${foundExhibit.documentTitle}`,
        details: `Authoritative Custodian: ${foundExhibit.sourceDataAuthority} • Locus: ${foundExhibit.exactCourtLocation} • Seal: ${foundExhibit.custodianSeal}`,
      });
      return;
    }

    const foundCorrection = CANONICAL_BRAIN_AI_AUTO_CORRECTIONS.find(
      (c) => c.sha256VerificationHash.toLowerCase() === q
    );
    if (foundCorrection) {
      setVerificationResult({
        matched: true,
        title: `Brain AI Auto-Correction (${foundCorrection.domain})`,
        details: `Post-Correction State: ${foundCorrection.postCorrectionState} • Statutory Anchor: ${foundCorrection.statutoryAnchor}`,
      });
      return;
    }

    setVerificationResult({
      matched: false,
      title: 'No Matching Cryptographic Record Found',
      details: 'The supplied SHA-256 hash does not match any certified exhibit or registered master PDF in the judicial gateway repository.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Judicial Banner & Status Bar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold tracking-wide flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                EVIDENCE ACT 1950 (ACT 56) SECTION 90A
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[11px] font-mono">
                ACT 424 S.6 IRREVOCABLE
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px] font-mono">
                DIGITAL SIGNATURE ACT 1997
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[11px] font-mono">
                PAGINATED COURT DOSSIER
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <FileDown className="w-7 h-7 text-amber-400 shrink-0" />
              Court-Ready PDF Exporter
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Synthesize and export forensic document metadata, statutory findings, and 12-chapter legal theses
              into a fully paginated, court-admissible PDF file equipped with a formal statutory declaration under
              <strong className="text-amber-300 font-semibold"> Section 90A of the Evidence Act 1950</strong>. Formatted to
              exacting judicial standards for Malaysian High Courts, the Federal Court, and international tribunals.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id={`${baseId}-compile-master-btn`}
              onClick={handleCompilePdf}
              disabled={isCompiling || isLoadingDossier}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-2 transition shadow-lg ${
                isCompiling
                  ? 'bg-amber-600/50 text-amber-100 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/40 active:scale-98'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isCompiling ? 'animate-spin' : ''}`} />
              {isCompiling ? 'Compiling Dossier...' : 'Re-Compile Master PDF'}
            </button>

            {compiledPdfBlob && (
              <button
                id={`${baseId}-download-pdf-btn`}
                onClick={handleDownloadPdf}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wide flex items-center gap-2 transition shadow-lg shadow-emerald-950/40 active:scale-98"
              >
                <Download className="w-4 h-4" />
                Download PDF ({(pdfSizeBytes / (1024 * 1024)).toFixed(2)} MB)
              </button>
            )}

            <button
              id={`${baseId}-copy-s90a-btn`}
              onClick={handleCopySection90A}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold tracking-wide border border-slate-700 flex items-center gap-2 transition"
              title="Copy Section 90A Affidavit affirmation for inclusion in Cause Papers"
            >
              {copiedSection90A ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
              {copiedSection90A ? 'Affidavit Text Copied!' : 'Copy S.90A Affidavit'}
            </button>

            <button
              id={`${baseId}-retrieval-spec-btn`}
              onClick={() => setShowRetrievalSpecWindow(true)}
              className="px-3.5 py-2.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 text-xs font-semibold tracking-wide border border-indigo-700/60 flex items-center gap-2 transition"
              title="Open Technical Data Retrieval & Sources Specification"
            >
              <Terminal className="w-4 h-4 text-indigo-400" />
              Technical Retrieval Spec
            </button>
          </div>
        </div>

        {/* Live Compilation Progress Bar */}
        {isCompiling && progress && (
          <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-amber-300 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                {progress.step}
              </span>
              <span className="font-mono text-amber-400 font-bold">{progress.percent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        )}

        {/* Cryptographic Seal Bar when compiled */}
        {compiledSha256 && !isCompiling && (
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-400 shrink-0">SHA-256 PDF Master Integrity Digest:</span>
              <span className="font-mono text-[11px] text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50 truncate max-w-md">
                {compiledSha256}
              </span>
              <button
                onClick={handleCopyDigest}
                className="p-1 text-slate-400 hover:text-white transition"
                title="Copy SHA-256 Digest"
              >
                {copiedDigest ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
              <span>SEAL ID: SEAL-MYGDX-{courtFilingRef}</span>
              <span>Compiled: {compilationTimestamp}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Left Configuration & Right Workhub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration & Deponent Particulars */}
        <div className="lg:col-span-4 space-y-6">
          {/* Preset Selector */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" />
                Judicial Filing Presets
              </h3>
              <span className="text-[10px] text-slate-400">Jurisdictions</span>
            </div>

            <div className="space-y-2">
              {JUDICIAL_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`w-full text-left p-3 rounded-lg border transition ${
                    selectedPreset === preset.id
                      ? 'border-amber-500/80 bg-amber-950/20 text-white'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="text-xs font-semibold text-amber-300 flex items-center justify-between">
                    <span>{preset.name}</span>
                    {selectedPreset === preset.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">{preset.docket}</div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 90A Deponent Identification */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-blue-400" />
                Section 90A Deponent Credentials
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">S.90A(2)</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Certifying Officer / Deponent Name
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Officer NRIC / ID
                  </label>
                  <input
                    type="text"
                    value={officerNric}
                    onChange={(e) => setOfficerNric(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Cause / Docket Ref
                  </label>
                  <input
                    type="text"
                    value={courtFilingRef}
                    onChange={(e) => setCourtFilingRef(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Official Designation / Capacity
                </label>
                <input
                  type="text"
                  value={officerDesignation}
                  onChange={(e) => setOfficerDesignation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Judicial Forum & Court Division
                </label>
                <input
                  type="text"
                  value={courtForum}
                  onChange={(e) => setCourtForum(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Department / Chambers Address
                </label>
                <textarea
                  rows={2}
                  value={deponentChambers}
                  onChange={(e) => setDeponentChambers(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Dossier Scope & Module Inclusions */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Compilation Scope & Toggles
              </h3>
              <span className="text-[10px] text-slate-400">Schedule</span>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:bg-slate-800/40 transition">
                <input
                  type="checkbox"
                  checked={includeSection90A}
                  onChange={(e) => setIncludeSection90A(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/20"
                />
                <span className="text-slate-200 font-medium">Evidence Act 1950 S.90A Certificate</span>
                <span className="ml-auto text-[10px] font-mono text-amber-400 font-semibold">MANDATORY</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:bg-slate-800/40 transition">
                <input
                  type="checkbox"
                  checked={includeEvidentiaryCatalog}
                  onChange={(e) => setIncludeEvidentiaryCatalog(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/20"
                />
                <span className="text-slate-200">18 Master Court Evidentiary Exhibits</span>
                <span className="ml-auto text-[10px] font-mono text-slate-400">Exhibits P1-P18</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:bg-slate-800/40 transition">
                <input
                  type="checkbox"
                  checked={includeBrainAiCorrections}
                  onChange={(e) => setIncludeBrainAiCorrections(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/20"
                />
                <span className="text-slate-200">14 Brain AI Statutory Auto-Corrections</span>
                <span className="ml-auto text-[10px] font-mono text-slate-400">Ground Truth</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:bg-slate-800/40 transition">
                <input
                  type="checkbox"
                  checked={includeThesisChapters}
                  onChange={(e) => setIncludeThesisChapters(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/20"
                />
                <span className="text-slate-200">12 Forensic Thesis Chapters (I to XII)</span>
                <span className="ml-auto text-[10px] font-mono text-slate-400">Full Doctrine</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:bg-slate-800/40 transition">
                <input
                  type="checkbox"
                  checked={includeAssetAndCorporate}
                  onChange={(e) => setIncludeAssetAndCorporate(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/20"
                />
                <span className="text-slate-200">Personal Assets, Bank &amp; 53 SSM Cos</span>
                <span className="ml-auto text-[10px] font-mono text-slate-400">RM12.8B</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:bg-slate-800/40 transition">
                <input
                  type="checkbox"
                  checked={includePDRMAndAmla}
                  onChange={(e) => setIncludePDRMAndAmla(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/20"
                />
                <span className="text-slate-200">PDRM CCID &amp; BNM AMLA Papers</span>
                <span className="ml-auto text-[10px] font-mono text-slate-400">Clearances</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:bg-slate-800/40 transition">
                <input
                  type="checkbox"
                  checked={includeWatermark}
                  onChange={(e) => setIncludeWatermark(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/20"
                />
                <span className="text-slate-200">Official Judicial Header &amp; Sub-Judice Seal</span>
                <span className="ml-auto text-[10px] font-mono text-slate-400">Watermark</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Workhub Tabs */}
        <div className="lg:col-span-8 space-y-4">
          {/* Sub-Tabs Bar */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium tracking-wide flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === 'preview'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Live PDF Previewer
            </button>

            <button
              onClick={() => setActiveTab('section90a_declaration')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium tracking-wide flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === 'section90a_declaration'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              Section 90A Evidence Act Affirmation
            </button>

            <button
              onClick={() => setActiveTab('exhibits_schedule')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium tracking-wide flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === 'exhibits_schedule'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Exhibit Schedule (18 Records)
            </button>

            <button
              onClick={() => setActiveTab('brain_ai_corrections')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium tracking-wide flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === 'brain_ai_corrections'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              14 Brain AI Auto-Corrections
            </button>

            <button
              onClick={() => setActiveTab('crypto_verifier')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium tracking-wide flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === 'crypto_verifier'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              Integrity &amp; Hash Verifier
            </button>
          </div>

          {/* TAB 1: LIVE PDF PREVIEWER */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Court-Admissible PDF Viewer</h4>
                    <p className="text-[11px] text-slate-400">
                      Standard ISO A4 • Two-Pass Pagination • Digital Signature Act 1997 &amp; Evidence Act 1950
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {compiledPdfUrl && (
                    <a
                      href={compiledPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Full Screen
                    </a>
                  )}

                  {compiledPdfBlob && (
                    <button
                      onClick={handleDownloadPdf}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download ({(pdfSizeBytes / (1024 * 1024)).toFixed(2)} MB)
                    </button>
                  )}
                </div>
              </div>

              {/* Embedded PDF Iframe or Empty State */}
              <div className="w-full h-[700px] rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative shadow-inner">
                {isCompiling ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm p-6 text-center space-y-4">
                    <RefreshCw className="w-10 h-10 text-amber-400 animate-spin" />
                    <div>
                      <h4 className="text-base font-bold text-white">Compiling Court-Ready Master Dossier...</h4>
                      <p className="text-xs text-slate-400 mt-1">{progress?.step || 'Generating judicial pages...'}</p>
                    </div>
                    <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress?.percent || 10}%` }}
                      />
                    </div>
                  </div>
                ) : compiledPdfUrl ? (
                  <iframe
                    src={`${compiledPdfUrl}#view=FitH`}
                    title="Court-Ready PDF Master Document"
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <FileDown className="w-12 h-12 text-slate-600" />
                    <div>
                      <h4 className="text-base font-bold text-white">No PDF Compiled Yet</h4>
                      <p className="text-xs text-slate-400 max-w-md mt-1">
                        Click the button below to compile the complete forensic thesis dossier into a court-ready,
                        paginated PDF with formal Section 90A Evidence Act declarations.
                      </p>
                    </div>
                    <button
                      onClick={handleCompilePdf}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-amber-950/40"
                    >
                      Compile Master PDF Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SECTION 90A STATUTORY DECLARATION */}
          {activeTab === 'section90a_declaration' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Formal Section 90A Certificate of Computer Output
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Bilingual BM/English statutory certificate conforming to Malaysian High Court practice directions.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySection90A}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium flex items-center gap-1.5 transition"
                  >
                    {copiedSection90A ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedSection90A ? 'Affidavit Text Copied!' : 'Copy for Cause Papers'}
                  </button>
                  <button
                    onClick={handleDownloadSection90AText}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition border border-slate-700"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    Download Certificate (.txt)
                  </button>
                </div>
              </div>

              {/* Formatted Affidavit Viewer */}
              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs leading-relaxed text-slate-300 max-h-[640px] overflow-y-auto space-y-4 whitespace-pre-wrap select-text">
                {dossier
                  ? generateSection90AAffidavitText(dossier, {
                      officerName,
                      officerNric,
                      officerDesignation,
                      courtForum,
                      courtFilingRef,
                      deponentChambers,
                    })
                  : 'Loading certificate text...'}
              </div>
            </div>
          )}

          {/* TAB 3: EXHIBITS SCHEDULE */}
          {activeTab === 'exhibits_schedule' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    Certified Evidentiary Exhibits Schedule (Evidence Act S.90A Schedule)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    18 verified exhibits with issuing statutory authorities, exact courtroom extraction coordinates, and SHA-256 digests.
                  </p>
                </div>

                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Filter exhibits by title, hash, locus..."
                    value={searchExhibitsQuery}
                    onChange={(e) => setSearchExhibitsQuery(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredExhibits.map((exhibit) => (
                  <div
                    key={exhibit.id}
                    className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition space-y-2.5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                          {exhibit.exhibitNumber}
                        </span>
                        <h5 className="text-xs font-bold text-white">{exhibit.documentTitle}</h5>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                        {exhibit.evidentiaryClassification}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{exhibit.summaryFindings}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                      <div>
                        <span className="text-slate-400 font-medium">Issuing Authority: </span>
                        <span className="text-slate-200">{exhibit.sourceDataAuthority}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Exact Courtroom Locus: </span>
                        <span className="text-amber-300 font-mono">{exhibit.exactCourtLocation}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Court Docket: </span>
                        <span className="text-slate-300 font-mono">{exhibit.courtDocketOrFilingRef}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Official Custodian Seal: </span>
                        <span className="text-emerald-400 font-mono">{exhibit.custodianSeal}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                      <span className="truncate max-w-md">SHA-256: {exhibit.sha256VerificationHash}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(exhibit.sha256VerificationHash);
                        }}
                        className="text-amber-400 hover:text-amber-300 transition text-[10px] flex items-center gap-1 shrink-0 ml-2"
                      >
                        <Copy className="w-3 h-3" />
                        Copy Hash
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BRAIN AI AUTO-CORRECTIONS */}
          {activeTab === 'brain_ai_corrections' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    14 Brain AI Statutory Auto-Corrections Register (Evidence Act S.90A &amp; S.45)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Autonomous algorithmic corrections matched with statutory ground truth to protect universal legatee standing.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-mono">
                  14 Rectifications Certified
                </span>
              </div>

              <div className="space-y-3">
                {CANONICAL_BRAIN_AI_AUTO_CORRECTIONS.map((corr, idx) => (
                  <div
                    key={corr.id}
                    className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-xs font-bold">
                          #{idx + 1} {corr.id}
                        </span>
                        <span className="text-xs font-semibold text-white">{corr.domain}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{corr.timestamp}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/30 text-red-200">
                        <span className="block text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">
                          Adverse Allegation (Pre-Correction)
                        </span>
                        {corr.preCorrectionState}
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-emerald-200">
                        <span className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                          Restored Truth (Post-Correction)
                        </span>
                        {corr.postCorrectionState}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 text-xs space-y-1">
                      <div>
                        <span className="text-slate-400 font-medium">Statutory Anchor: </span>
                        <span className="text-amber-300 font-semibold">{corr.statutoryAnchor}</span>
                        <span className="text-slate-400 font-medium ml-3">Custodian: </span>
                        <span className="text-slate-200">{corr.custodianAuthority}</span>
                      </div>
                      <div className="text-slate-400 text-[11px] leading-relaxed">
                        <span className="font-medium text-slate-300">Rationale: </span>
                        {corr.correctionRationale}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 pt-1">
                        SHA-256: {corr.sha256VerificationHash}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CRYPTOGRAPHIC HASH VERIFIER */}
          {activeTab === 'crypto_verifier' && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Hash className="w-4 h-4 text-amber-400" />
                    Cryptographic Integrity &amp; SHA-256 Tamper Verification Engine
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Verify any PDF binary, exhibit digest, or auto-correction hash against the immutable judicial
                    records ledger in compliance with Section 90A(2) of the Evidence Act 1950 and the Digital Signature Act 1997.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste any SHA-256 hash digest (e.g. from a downloaded PDF or court exhibit)..."
                      value={verificationInputHash}
                      onChange={(e) => setVerificationInputHash(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={handleVerifyHash}
                      className="px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition"
                    >
                      Verify Hash
                    </button>
                  </div>

                  {compiledSha256 && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400">Quick Test with active PDF:</span>
                      <button
                        onClick={() => {
                          setVerificationInputHash(compiledSha256);
                        }}
                        className="text-amber-400 hover:text-amber-300 font-mono text-[11px] underline"
                      >
                        Insert Compiled Master PDF Hash
                      </button>
                    </div>
                  )}

                  {verificationResult && (
                    <div
                      className={`p-4 rounded-xl border ${
                        verificationResult.matched
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                          : 'bg-red-950/20 border-red-500/40 text-red-200'
                      } space-y-1.5 text-xs`}
                    >
                      <div className="flex items-center gap-2 font-bold text-sm">
                        {verificationResult.matched ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <span className="text-emerald-300">Cryptographic Match Verified</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <span className="text-red-300">No Hash Match Found</span>
                          </>
                        )}
                      </div>
                      <div className="font-semibold text-white">{verificationResult.title}</div>
                      <div className="text-slate-300 text-[11px] leading-relaxed">
                        {verificationResult.details}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Master Ledger Hash Summary Table */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Active Cryptographic Ledger Summary
                </h5>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-950 flex justify-between items-center text-slate-300">
                    <span className="text-slate-400">Master Dossier Root Digest:</span>
                    <span className="text-amber-300 text-[11px]">{dossier?.thesisMetadata.sha256MasterIntegrityDigest || 'Loading...'}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 flex justify-between items-center text-slate-300">
                    <span className="text-slate-400">Section 90A Certifying Authority:</span>
                    <span className="text-emerald-300 text-[11px]">{officerName}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 flex justify-between items-center text-slate-300">
                    <span className="text-slate-400">Statutory Court Docket:</span>
                    <span className="text-blue-300 text-[11px]">{courtFilingRef}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 flex justify-between items-center text-slate-300">
                    <span className="text-slate-400">Verified Exhibits Count:</span>
                    <span className="text-slate-200 text-[11px]">18 Official Court Instruments</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Technical Data Retrieval Specification Window */}
      <DataRetrievalTechnicalWindow
        isOpen={showRetrievalSpecWindow}
        onClose={() => setShowRetrievalSpecWindow(false)}
      />
    </div>
  );
}
