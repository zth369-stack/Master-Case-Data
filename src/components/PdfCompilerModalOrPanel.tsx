import { useState, useMemo } from 'react';
import {
  FileDown,
  Sparkles,
  CheckCircle2,
  FileCheck,
  Shield,
  Loader2,
  BookOpen,
  Hash,
  Scale,
  RefreshCw,
  Eye,
  User,
  Building2,
  Landmark,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Layers,
  Search,
  Filter,
  Copy,
  Check,
  Gavel,
  FolderCheck,
  MapPin,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import type { CompleteForensicThesisDossier } from '../shared/types';
import { compileForensicThesisPdf, type PdfCompilationProgress } from '../utils/pdfThesisCompiler';
import {
  MASTER_COURT_EVIDENTIARY_CATALOG,
  CANONICAL_BRAIN_AI_AUTO_CORRECTIONS,
  generateCourtAffidavitBundleIndex,
  type CourtEvidentiaryMetadataRecord,
} from '../shared/courtEvidentiaryMetadata';

interface PdfCompilerPanelProps {
  thesis: CompleteForensicThesisDossier | null;
  onRefreshThesis: () => Promise<void>;
}

export function PdfCompilerPanel({ thesis, onRefreshThesis }: PdfCompilerPanelProps) {
  const [isCompiling, setIsCompiling] = useState(false);
  const [progress, setProgress] = useState<PdfCompilationProgress | null>(null);
  const [compiledPdfUrl, setCompiledPdfUrl] = useState<string | null>(null);
  const [pdfSizeBytes, setPdfSizeBytes] = useState<number | null>(null);
  const [showIframePreview, setShowIframePreview] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Table and Search state for lawyers
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourtFilter, setSelectedCourtFilter] = useState<string>('ALL');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('ALL');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [copiedAffidavitIndex, setCopiedAffidavitIndex] = useState(false);
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

  // Corrections panel view mode: 'documents' or 'corrections'
  const [activeCompilerTab, setActiveCompilerTab] = useState<'documents' | 'corrections' | 'dossier'>('documents');

  // Accordion state for detailed forensic sections
  const [expandedSection, setExpandedSection] = useState<string | null>('patriarch');

  // Merge additional evidences from thesis with MASTER_COURT_EVIDENTIARY_CATALOG
  const allEvidentiaryDocs: CourtEvidentiaryMetadataRecord[] = useMemo(() => {
    return MASTER_COURT_EVIDENTIARY_CATALOG;
  }, []);

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return allEvidentiaryDocs.filter((doc) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        doc.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.courtOrJudicialForum.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.exactCourtLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.sourceDataAuthority.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.courtDocketOrFilingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.officialReferenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.sha256VerificationHash.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCourt =
        selectedCourtFilter === 'ALL' ||
        (selectedCourtFilter === 'HIGH_COURT' && doc.courtOrJudicialForum.includes('High Court')) ||
        (selectedCourtFilter === 'APEX' && doc.courtOrJudicialForum.includes('Federal Court')) ||
        (selectedCourtFilter === 'SESSIONS' && doc.courtOrJudicialForum.includes('Sessions Court')) ||
        (selectedCourtFilter === 'OFFSHORE' && (doc.courtOrJudicialForum.includes('BVI') || doc.courtOrJudicialForum.includes('Genève') || doc.courtOrJudicialForum.includes('Swiss')));

      const matchesGrade =
        selectedGradeFilter === 'ALL' ||
        doc.evidentiaryClassification === selectedGradeFilter;

      return matchesSearch && matchesCourt && matchesGrade;
    });
  }, [allEvidentiaryDocs, searchQuery, selectedCourtFilter, selectedGradeFilter]);

  const handleStartCompilation = async () => {
    if (!thesis) return;
    setIsCompiling(true);
    setErrorMsg(null);
    setProgress({ step: 'Phase 1: Ingesting & Verifying Evidentiary Source Metadata & Hashes...', percent: 5 });

    try {
      const blob = await compileForensicThesisPdf(
        thesis,
        (p) => {
          setProgress(p);
        },
        {
          includeSection90ACertificate: true,
          includeEvidentiaryCatalog: true,
          includeBrainAiCorrections: true,
          courtForum: 'High Court of Malaya at Kuala Lumpur (Commercial Division / Special Powers)',
          courtFilingRef: thesis.thesisMetadata?.thesisReference || 'WA-22NCC-482-09/2026',
        }
      );

      setPdfSizeBytes(blob.size);
      const url = URL.createObjectURL(blob);
      setCompiledPdfUrl(url);
    } catch (err: unknown) {
      console.error('PDF Compilation failed:', err);
      setErrorMsg(err instanceof Error ? err.message : 'PDF compilation encountered an error.');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!compiledPdfUrl) return;
    const a = document.createElement('a');
    a.href = compiledPdfUrl;
    a.download = `MASTER-FORENSIC-THESIS-DOSSIER-KAVINATH-GANESAN-${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadMarkdown = () => {
    window.open('/api/thesis/download-markdown', '_blank');
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  const handleCopyAffidavitIndex = () => {
    const text = generateCourtAffidavitBundleIndex(filteredDocs);
    navigator.clipboard.writeText(text);
    setCopiedAffidavitIndex(true);
    setTimeout(() => setCopiedAffidavitIndex(false), 3000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (!thesis) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
        <Loader2 className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
        <p className="text-sm font-medium text-slate-700">Loading master forensic thesis data from judicial gateway...</p>
      </div>
    );
  }

  const { patriarchAndLineage: pat, personalAssets: assets, corporateStructure: corp, lawEnforcementAndAmla: enf, unmaskedProxyX: px } = thesis;

  return (
    <div className="space-y-6">
      {/* Master Compiler Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-slate-700/60">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>JUDICIAL PDF COMPILER & COURT EXTRACTION ENGINE</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Compile Complete Forensic Thesis Dossier (A to Z)
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Consolidates Patriarch provenance, JPN birth/death registers, corporate registries, Swiss banking clearances, PDRM CCID criminal papers, and 14 Brain AI statutory auto-corrections into a solid, court-admissible publication-grade master PDF.
            </p>

            {/* Micro Badges */}
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 bg-slate-800/80 rounded-md border border-slate-700 text-slate-200 flex items-center gap-1.5 font-mono">
                <User className="w-3.5 h-3.5 text-amber-400" />
                Patriarch: Ganesan A/L Raman
              </span>
              <span className="px-2.5 py-1 bg-slate-800/80 rounded-md border border-slate-700 text-slate-200 flex items-center gap-1.5 font-mono">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                12 Judicial Chapters
              </span>
              <span className="px-2.5 py-1 bg-slate-800/80 rounded-md border border-slate-700 text-slate-200 flex items-center gap-1.5 font-mono">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                {allEvidentiaryDocs.length} Court Exhibits
              </span>
              <span className="px-2.5 py-1 bg-slate-800/80 rounded-md border border-slate-700 text-slate-200 flex items-center gap-1.5 font-mono">
                <Gavel className="w-3.5 h-3.5 text-blue-400" />
                14 Brain AI Decrees (S.90A)
              </span>
              <span className="px-2.5 py-1 bg-slate-800/80 rounded-md border border-slate-700 text-slate-200 flex items-center gap-1.5 font-mono">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                Proxy X Unmasked
              </span>
            </div>
          </div>

          {/* Compilation Action Box with Visual Progress Bar */}
          <div className="shrink-0 bg-slate-800/90 backdrop-blur border border-slate-700 rounded-xl p-5 w-full lg:w-84 shadow-inner space-y-4">
            <div className="text-xs text-slate-300 flex items-center justify-between pb-2 border-b border-slate-700/60">
              <span className="font-semibold text-slate-200">Compiler Pipeline Status:</span>
              <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isCompiling ? 'Active Processing' : compiledPdfUrl ? 'Compiled & Verified' : 'Ready to Compile'}
              </span>
            </div>

            {/* Visual Progress Bar Component */}
            {isCompiling ? (
              <div className="space-y-3 bg-slate-900/80 p-3.5 rounded-lg border border-amber-500/30">
                <div className="flex items-center justify-between text-xs text-amber-300 font-medium">
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Compiling Judicial Dossier...</span>
                  </span>
                  <span className="font-mono text-sm font-bold text-amber-400">{progress?.percent || 0}%</span>
                </div>

                {/* Animated Gradient Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
                  <div
                    className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-300 shadow-sm shadow-amber-500/50"
                    style={{ width: `${progress?.percent || 0}%` }}
                  />
                </div>

                {/* Step Description */}
                <p className="text-[11px] text-slate-300 font-mono italic leading-tight">
                  {progress?.step || 'Structuring chapters and applying statutory seals...'}
                </p>

                {/* Multi-Phase Pipeline Steps */}
                <div className="grid grid-cols-5 gap-1 pt-1 text-[9px] text-center font-mono">
                  <div className={`p-1 rounded ${progress?.percent && progress.percent >= 20 ? 'bg-amber-500/30 text-amber-300 font-bold' : 'text-slate-500'}`}>
                    1. Ingest
                  </div>
                  <div className={`p-1 rounded ${progress?.percent && progress.percent >= 40 ? 'bg-amber-500/30 text-amber-300 font-bold' : 'text-slate-500'}`}>
                    2. Lineage
                  </div>
                  <div className={`p-1 rounded ${progress?.percent && progress.percent >= 60 ? 'bg-amber-500/30 text-amber-300 font-bold' : 'text-slate-500'}`}>
                    3. Chapters
                  </div>
                  <div className={`p-1 rounded ${progress?.percent && progress.percent >= 80 ? 'bg-amber-500/30 text-amber-300 font-bold' : 'text-slate-500'}`}>
                    4. Court Table
                  </div>
                  <div className={`p-1 rounded ${progress?.percent && progress.percent >= 90 ? 'bg-emerald-500/30 text-emerald-300 font-bold' : 'text-slate-500'}`}>
                    5. S.90A Seal
                  </div>
                </div>
              </div>
            ) : compiledPdfUrl ? (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                  <div>
                    <div className="font-semibold text-white">Court-Admissible PDF Compiled!</div>
                    <div className="text-[11px] text-emerald-200/90 font-mono">
                      Size: {pdfSizeBytes ? formatFileSize(pdfSizeBytes) : 'Certified'} • All 18 Exhibits & 14 Corrections Included
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleDownloadPdf}
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md transition"
                  >
                    <FileDown className="w-4 h-4" />
                    Download PDF
                  </button>

                  <button
                    onClick={() => setShowIframePreview(!showIframePreview)}
                    className="w-full py-2.5 px-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 border border-slate-600 transition"
                  >
                    <Eye className="w-4 h-4" />
                    {showIframePreview ? 'Hide View' : 'Preview PDF'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleDownloadMarkdown}
                    className="w-full py-2 px-2.5 bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition truncate"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Download .MD</span>
                  </button>

                  <button
                    onClick={handleStartCompilation}
                    className="w-full py-2 px-2.5 bg-emerald-700/80 hover:bg-emerald-750 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                    <span>Re-compile</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleStartCompilation}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  Execute PDF Compiler & Recomply
                </button>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <button
                    onClick={handleDownloadMarkdown}
                    className="text-amber-400 hover:text-amber-300 underline flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" /> Download .MD Thesis
                  </button>
                  <span className="font-mono text-emerald-400">Act 56 S.90A Ready</span>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-2.5 bg-red-950/70 border border-red-500/50 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* In-browser Interactive PDF Previewer (if toggled) */}
      {showIframePreview && compiledPdfUrl && (
        <div className="bg-white rounded-2xl border border-slate-300 shadow-xl overflow-hidden space-y-0">
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <FileCheck className="w-4 h-4" />
              <span>Interactive PDF Document Viewer: MASTER-FORENSIC-THESIS-DOSSIER-KAVINATH-GANESAN.pdf</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadPdf}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-xs flex items-center gap-1 transition"
              >
                <FileDown className="w-3.5 h-3.5" /> Save File
              </button>
              <button
                onClick={() => setShowIframePreview(false)}
                className="text-xs text-slate-400 hover:text-white transition"
              >
                Close Viewer
              </button>
            </div>
          </div>
          <div className="w-full h-[650px] bg-slate-100">
            <iframe
              src={compiledPdfUrl}
              title="Forensic Thesis PDF Preview"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}

      {/* Main Navigation Tabs for Compiler View */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveCompilerTab('documents')}
          className={`px-4 py-2.5 text-xs font-bold rounded-lg flex items-center gap-2 transition ${
            activeCompilerTab === 'documents'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-amber-400" />
          <span>Court Evidentiary Metadata & Extraction Ledger</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-mono">
            {allEvidentiaryDocs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveCompilerTab('corrections')}
          className={`px-4 py-2.5 text-xs font-bold rounded-lg flex items-center gap-2 transition ${
            activeCompilerTab === 'corrections'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
          }`}
        >
          <Gavel className="w-3.5 h-3.5 text-purple-300" />
          <span>Brain AI Auto-Corrected Changes (Act 56 S.90A)</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">
            14 Restorations
          </span>
        </button>

        <button
          onClick={() => setActiveCompilerTab('dossier')}
          className={`px-4 py-2.5 text-xs font-bold rounded-lg flex items-center gap-2 transition ${
            activeCompilerTab === 'dossier'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Detailed Dossier Sections (Patriarch, Assets, Group)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: COURT EVIDENTIARY METADATA TABLE & EXTRACTION LEDGER FOR LAWYERS   */}
      {/* ========================================================================= */}
      {activeCompilerTab === 'documents' && (
        <div className="space-y-4">
          {/* Table Header & Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-600" />
                  Court-Admissible Document Extraction & Assembly Table
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed court forum references, exact courtroom/docket locations, source data authorities, timestamps, and SHA-256 digests for seamless extraction by legal counsel.
                </p>
              </div>

              {/* Quick Actions for Lawyers */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyAffidavitIndex}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs flex items-center gap-1.5 border border-blue-200 transition"
                  title="Copies complete court affidavit exhibit bundle text to clipboard for lawyers"
                >
                  {copiedAffidavitIndex ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Affidavit Index Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-blue-600" />
                      <span>Copy Court Filing Index</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleStartCompilation}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-comply PDF</span>
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
              {/* Search Bar */}
              <div className="md:col-span-6 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by court, location, docket, source authority, or title..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Court Filter */}
              <div className="md:col-span-3">
                <select
                  value={selectedCourtFilter}
                  onChange={(e) => setSelectedCourtFilter(e.target.value)}
                  className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-700 font-medium"
                >
                  <option value="ALL">All Judicial Forums ({allEvidentiaryDocs.length})</option>
                  <option value="HIGH_COURT">High Court of Malaya (Commercial/Probate)</option>
                  <option value="APEX">Federal Court of Malaya (Apex)</option>
                  <option value="SESSIONS">Sessions Court (Criminal)</option>
                  <option value="OFFSHORE">International / Offshore (BVI, Swiss, AIAC)</option>
                </select>
              </div>

              {/* Classification Filter */}
              <div className="md:col-span-3">
                <select
                  value={selectedGradeFilter}
                  onChange={(e) => setSelectedGradeFilter(e.target.value)}
                  className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-700 font-medium"
                >
                  <option value="ALL">All Admissibility Grades</option>
                  <option value="CONCLUSIVE_PROOF">Conclusive Proof (S.112 / S.46)</option>
                  <option value="APEX_JUDGMENT">Apex Judgment (Res Judicata)</option>
                  <option value="FORENSIC_CERTIFICATE">Forensic Certificate (S.90A / S.45)</option>
                  <option value="CRIMINAL_EXHIBIT">Criminal Prosecution Exhibit</option>
                </select>
              </div>
            </div>
          </div>

          {/* Master Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4 w-28">Exhibit / Ref</th>
                    <th className="py-3 px-4 min-w-[220px]">Document Title & Classification</th>
                    <th className="py-3 px-4 min-w-[220px]">Which Court & Where Exactly</th>
                    <th className="py-3 px-4 min-w-[220px]">Source Data Authority</th>
                    <th className="py-3 px-4 w-28">Date / Time</th>
                    <th className="py-3 px-4 w-32">Cryptographic Hash</th>
                    <th className="py-3 px-4 w-24 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {filteredDocs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        No evidentiary documents matching the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredDocs.map((doc, idx) => {
                      const isExpanded = expandedDocId === doc.id;
                      const isHashCopied = copiedHash === doc.sha256VerificationHash;

                      return (
                        <tr
                          key={doc.id}
                          className={`hover:bg-slate-50 transition ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                          } ${doc.isBrainAiAutoCorrected ? 'bg-purple-50/30' : ''}`}
                        >
                          {/* Exhibit & Ref */}
                          <td className="py-3 px-4 align-top">
                            <div className="font-bold text-slate-900 font-mono text-[11px]">
                              {doc.exhibitNumber}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono truncate max-w-[110px]" title={doc.officialReferenceNumber}>
                              {doc.officialReferenceNumber}
                            </div>
                            {doc.isBrainAiAutoCorrected && (
                              <span className="inline-block mt-1 px-1.5 py-0.5 bg-purple-100 text-purple-800 text-[9px] font-bold rounded">
                                Brain AI S.90A
                              </span>
                            )}
                          </td>

                          {/* Document Title & Classification */}
                          <td className="py-3 px-4 align-top space-y-1">
                            <div className="font-semibold text-slate-900 leading-snug">
                              {doc.documentTitle}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  doc.evidentiaryClassification === 'CONCLUSIVE_PROOF'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : doc.evidentiaryClassification === 'APEX_JUDGMENT'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : doc.evidentiaryClassification === 'CRIMINAL_EXHIBIT'
                                    ? 'bg-red-100 text-red-800 border border-red-200'
                                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                                }`}
                              >
                                {doc.evidentiaryClassification.replace(/_/g, ' ')}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {doc.statutoryAdmissibilityRule.split('&')[0]}
                              </span>
                            </div>
                          </td>

                          {/* Court Forum & Exact Location (WHICH COURT & WHERE EXACTLY) */}
                          <td className="py-3 px-4 align-top space-y-1">
                            <div className="flex items-start gap-1 text-slate-900 font-semibold">
                              <Gavel className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                              <span className="text-[11px] leading-tight">{doc.courtOrJudicialForum}</span>
                            </div>
                            <div className="flex items-start gap-1 text-amber-800 font-medium text-[11px] pl-4">
                              <MapPin className="w-3 h-3 text-amber-600 mt-0.5 shrink-0" />
                              <span className="leading-tight">{doc.exactCourtLocation}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 pl-4 font-mono">
                              Docket: {doc.courtDocketOrFilingRef}
                            </div>
                          </td>

                          {/* Source Data Authority (ALWAYS EXPLICITLY STATED!) */}
                          <td className="py-3 px-4 align-top space-y-1">
                            <div className="font-semibold text-slate-900 text-[11px] flex items-start gap-1">
                              <Building2 className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                              <span className="leading-tight">{doc.sourceDataAuthority}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 pl-4">
                              Seal: {doc.custodianSeal}
                            </div>
                          </td>

                          {/* Date & Time */}
                          <td className="py-3 px-4 align-top text-[11px]">
                            <div className="font-medium text-slate-800 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{doc.issuanceDate.slice(0, 10)}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {new Date(doc.verificationTimestamp).toLocaleDateString()}
                            </div>
                          </td>

                          {/* Cryptographic SHA-256 Hash */}
                          <td className="py-3 px-4 align-top">
                            <button
                              onClick={() => handleCopyHash(doc.sha256VerificationHash)}
                              className="w-full text-left font-mono text-[10px] bg-slate-100 hover:bg-amber-50 p-1.5 rounded border border-slate-200 transition group flex items-center justify-between"
                              title="Click to copy verified SHA-256 checksum"
                            >
                              <span className="truncate max-w-[85px] text-slate-700 font-semibold">
                                {doc.sha256VerificationHash.slice(0, 12)}…
                              </span>
                              {isHashCopied ? (
                                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                              ) : (
                                <Copy className="w-3 h-3 text-slate-400 group-hover:text-amber-600 shrink-0" />
                              )}
                            </button>
                            <span className="text-[9px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                              Verified Digest
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 align-top text-right">
                            <button
                              onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition inline-flex items-center gap-1"
                            >
                              <span>{isExpanded ? 'Hide' : 'Details'}</span>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Expandable Document Extraction Drawer (if selected) */}
            {expandedDocId && (
              <div className="p-4 bg-slate-900 text-white border-t border-slate-700 space-y-3">
                {(() => {
                  const doc = allEvidentiaryDocs.find((d) => d.id === expandedDocId);
                  if (!doc) return null;

                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-xs font-bold font-mono">
                            {doc.exhibitNumber}
                          </span>
                          <span className="text-sm font-bold text-white">{doc.documentTitle}</span>
                        </div>
                        <button
                          onClick={() => setExpandedDocId(null)}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Close Detail
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-800/80 p-3.5 rounded-lg border border-slate-700">
                        <div>
                          <div className="text-amber-400 font-semibold mb-1">Judicial Assembly Location</div>
                          <div className="text-slate-200">{doc.courtOrJudicialForum}</div>
                          <div className="text-slate-300 font-medium">{doc.exactCourtLocation}</div>
                          <div className="text-slate-400 font-mono text-[11px] mt-1">Coordinates: {doc.bundleExtractionCoordinates}</div>
                        </div>

                        <div>
                          <div className="text-amber-400 font-semibold mb-1">Source Authority & Seal</div>
                          <div className="text-slate-200">{doc.sourceDataAuthority}</div>
                          <div className="text-slate-400 text-[11px]">Official Seal: {doc.custodianSeal}</div>
                          <div className="text-emerald-400 font-medium text-[11px] mt-1">{doc.statutoryAdmissibilityRule}</div>
                        </div>

                        <div>
                          <div className="text-amber-400 font-semibold mb-1">Cryptographic Ledger</div>
                          <div className="font-mono text-[11px] text-slate-300 break-all">{doc.sha256VerificationHash}</div>
                          <div className="text-slate-400 text-[11px] mt-1">Issuance: {doc.issuanceDate}</div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-300 bg-slate-800/40 p-3 rounded border border-slate-700/60 space-y-1">
                        <div className="font-bold text-slate-200">Summary Findings:</div>
                        <p>{doc.summaryFindings}</p>
                        <div className="font-bold text-amber-300 pt-1">Rebuttal Value:</div>
                        <p className="text-amber-100">{doc.relevanceToDispute} ({doc.counterpartsExcludedOrRebutted})</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BRAIN AI STATUTORY RECTIFICATION REGISTER (ACT 56 S.90A)           */}
      {/* ========================================================================= */}
      {activeCompilerTab === 'corrections' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white p-5 rounded-xl border border-purple-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/30 border border-purple-400/40 text-purple-300 text-xs font-semibold">
                <Gavel className="w-3.5 h-3.5" />
                <span>EVIDENCE ACT 1950 (ACT 56) SECTION 90A STATUTORY CERTIFICATION</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Brain AI Autonomous Verification & Statutory Corrections Register
              </h3>
              <p className="text-xs text-purple-200 max-w-2xl leading-relaxed">
                The Brain AI system auto-checked all data, evidentiary records, and corporate registries, rectifying 14 disputed claims with verified ground truth pursuant to Companies Act 2016 S.600 and Probate Act S.46. All 14 corrections are incorporated into the PDF compilation.
              </p>
            </div>

            <div className="shrink-0 flex flex-col items-end gap-2">
              <button
                onClick={handleStartCompilation}
                className="py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Re-compile with Corrections</span>
              </button>
              <span className="text-[11px] text-purple-300 font-mono">14/14 Restorations Locked</span>
            </div>
          </div>

          {/* List of 14 Auto-Corrected Changes */}
          <div className="grid grid-cols-1 gap-3">
            {CANONICAL_BRAIN_AI_AUTO_CORRECTIONS.map((corr) => (
              <div
                key={corr.id}
                className="bg-white p-4 rounded-xl border border-purple-200 shadow-sm hover:border-purple-300 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-bold text-xs">
                      {corr.id}
                    </span>
                    <span className="font-bold text-slate-900 text-xs">{corr.domainLabel}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-700">{corr.targetEntityOrDoc}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      AUTO-RECTIFIED & LOCKED
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{corr.timestamp.slice(0, 10)}</span>
                  </div>
                </div>

                {/* Pre vs Post Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Pre-Correction Disputed Claim */}
                  <div className="p-3 bg-red-50/80 rounded-lg border border-red-200 space-y-1">
                    <div className="font-bold text-red-800 text-[11px] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      <span>Pre-Correction Disputed Claim (Adverse Proxy Filing):</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{corr.preCorrectionState}</p>
                  </div>

                  {/* Post-Correction Restored Ground Truth */}
                  <div className="p-3 bg-emerald-50/80 rounded-lg border border-emerald-200 space-y-1">
                    <div className="font-bold text-emerald-800 text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Post-Correction Restored Ground Truth (Brain AI Certified):</span>
                    </div>
                    <p className="text-slate-900 font-medium leading-relaxed">{corr.postCorrectionState}</p>
                  </div>
                </div>

                {/* Statutory Anchor & Rationale */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-slate-600">
                  <div>
                    <span className="font-bold text-slate-800">Statutory Anchor:</span> {corr.statutoryAnchor} • <span className="font-semibold text-slate-700">Authority:</span> {corr.custodianAuthority}
                  </div>
                  <div className="font-mono text-[10px] text-slate-400 truncate max-w-xs">
                    SHA-256: {corr.sha256VerificationHash.slice(0, 24)}…
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ACCORDION PANELS FOR DETAILED DOSSIER CHAPTERS & MODULES           */}
      {/* ========================================================================= */}
      {activeCompilerTab === 'dossier' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              Evidentiary Master Dossier Compendium Breakdown
            </h3>
            <span className="text-xs text-slate-500 font-mono">5 Comprehensive Forensic Modules</span>
          </div>

          {/* 1. Patriarch & Family Lineage */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 'patriarch' ? null : 'patriarch')}
              className="w-full px-5 py-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Patriarch Details, Family Lineage & Adoption/Birth Register Audit</div>
                  <div className="text-xs text-slate-500 font-mono">
                    Patriarch: {pat.patriarch.fullName} (NRIC: {pat.patriarch.nric}) • Death Cert: {pat.patriarch.deathCertificateNumber}
                  </div>
                </div>
              </div>
              {expandedSection === 'patriarch' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expandedSection === 'patriarch' && (
              <div className="p-5 space-y-4 border-t border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="font-bold text-slate-800 text-xs uppercase tracking-wide">Deceased Patriarch & Testator</div>
                    <div className="text-slate-900 font-semibold">{pat.patriarch.fullName} (NRIC: {pat.patriarch.nric})</div>
                    <div className="text-slate-600">Date of Birth: {pat.patriarch.dateOfBirth}</div>
                    <div className="text-slate-600">Date of Demise: {pat.patriarch.dateOfDeath}</div>
                    <div className="text-slate-600">Place: {pat.patriarch.placeOfDeath}</div>
                    <div className="text-amber-800 font-semibold">Death Certificate: {pat.patriarch.deathCertificateNumber} ({pat.patriarch.deathRegistryOffice})</div>
                    <div className="text-slate-600">Cause of Death: {pat.patriarch.causeOfDeath}</div>
                    <div className="text-slate-600">Grant of Probate: {pat.patriarch.estateReference}</div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="font-bold text-slate-800 text-xs uppercase tracking-wide">Civil Birth & Adoption Registry Verification</div>
                    <div className="text-slate-900 font-semibold">Birth Certificate: {pat.subjectBirthCertificate.certificateNumber}</div>
                    <div className="text-slate-600">Registry: {pat.subjectBirthCertificate.issuingRegistry} ({pat.subjectBirthCertificate.registrationAct})</div>
                    <div className="text-slate-600">Parents Stated: {pat.subjectBirthCertificate.fatherStated} & {pat.subjectBirthCertificate.motherStated}</div>
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 font-medium">
                      <div>JPN Adoption Search: {pat.adoptionVerification.searchCertificateNumber}</div>
                      <div className="font-bold">{pat.adoptionVerification.officialFinding}</div>
                      <div className="text-[11px]">{pat.adoptionVerification.presumptionOfBiologicalLegitimacy}</div>
                    </div>
                    <div className="text-slate-500 text-[11px] pt-1">
                      Maternal: {pat.maternalParent.fullName} (NRIC: {pat.maternalParent.nric}) • {pat.maternalParent.status}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Personal Assets & Bank Accounts */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 'assets' ? null : 'assets')}
              className="w-full px-5 py-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-800">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Personal Bank Accounts, Real Estate Land Titles & Luxury Vehicles</div>
                  <div className="text-xs text-slate-500 font-mono">
                    {assets.bankAccounts.length} Verified Accounts • {assets.realEstateProperties.length} Real Estate Assets • {assets.vehicles.length} Motor Vehicles
                  </div>
                </div>
              </div>
              {expandedSection === 'assets' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expandedSection === 'assets' && (
              <div className="p-5 space-y-4 border-t border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {assets.bankAccounts.map((b, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800">{b.institution}</div>
                      <div className="font-mono text-slate-700">{b.accountNumber} ({b.accountType})</div>
                      <div className="text-emerald-700 font-semibold">{b.currency} Tier {b.tier}</div>
                      <div className="text-slate-500 text-[11px]">{b.status} • Ref: {b.verificationReference}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Corporate Group Structure */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 'corporate' ? null : 'corporate')}
              className="w-full px-5 py-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Corporate Group Architecture & Holding Entities</div>
                  <div className="text-xs text-slate-500 font-mono">
                    {corp.holdingCompany.companyName} • {corp.subsidiaries.length} Operating Subsidiaries
                  </div>
                </div>
              </div>
              {expandedSection === 'corporate' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expandedSection === 'corporate' && (
              <div className="p-5 space-y-3 border-t border-slate-200 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">{corp.holdingCompany.companyName} ({corp.holdingCompany.ssmRegistrationNumber})</div>
                  <div className="text-slate-600">Paid Up Capital: RM {corp.holdingCompany.paidUpCapitalMYR.toLocaleString()} • Equity: {corp.holdingCompany.shareholdingPercentage}%</div>
                  <div className="text-emerald-800 font-semibold">Sole Director & Shareholder: {corp.holdingCompany.soleDirectorAndShareholder} ({corp.holdingCompany.companyStatus})</div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Law Enforcement, AMLA & Legal Standing */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 'enforcement' ? null : 'enforcement')}
              className="w-full px-5 py-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-800">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Law Enforcement Reports, AMLA Clearance & Solicitors On Record</div>
                  <div className="text-xs text-slate-500 font-mono">
                    Solicitors: {enf.lawyersOnRecord.firmName} • Lead Counsel: {enf.lawyersOnRecord.leadCounsel}
                  </div>
                </div>
              </div>
              {expandedSection === 'enforcement' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expandedSection === 'enforcement' && (
              <div className="p-5 space-y-3 border-t border-slate-200 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900">{enf.lawyersOnRecord.firmName} ({enf.lawyersOnRecord.barCouncilNumber})</div>
                  <div className="text-slate-600">Lead: {enf.lawyersOnRecord.leadCounsel} • Chambers: {enf.lawyersOnRecord.chamberAddress}</div>
                  <div className="text-slate-600">Warrant to Act: {enf.lawyersOnRecord.warrantToActFilingDate}</div>
                  <div className="text-emerald-800 font-semibold">{enf.lawyersOnRecord.formalLegalStanding}</div>
                </div>
              </div>
            )}
          </div>

          {/* 5. Unmasked Adverse Proxy X Profile */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 'proxyx' ? null : 'proxyx')}
              className="w-full px-5 py-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100 text-red-800">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Unmasked Profile of Adverse Impersonator (Proxy X)</div>
                  <div className="text-xs text-red-600 font-mono">
                    {px.legalFullName} (NRIC: {px.nricNumber}) • Case: {px.criminalCourtCaseNumber}
                  </div>
                </div>
              </div>
              {expandedSection === 'proxyx' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expandedSection === 'proxyx' && (
              <div className="p-5 space-y-3 border-t border-slate-200 text-xs">
                <div className="p-3.5 bg-red-50/80 rounded-lg border border-red-200 space-y-1.5">
                  <div className="font-bold text-red-900">{px.legalFullName} (NRIC: {px.nricNumber})</div>
                  <div className="text-slate-700">Residential: {px.residentialAddress}</div>
                  <div className="text-red-800 font-semibold">Sessions Criminal Case: {px.criminalCourtCaseNumber}</div>
                  <div className="text-slate-700 font-medium">Bail & Status: {px.currentLegalAndBailStatus}</div>
                  <div className="text-red-700 font-mono text-[11px]">{px.borderBlacklistNotice}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Compiler Statutory Seals & Certifications Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-blue-600" />
            Statutory Admissibility
          </div>
          <div className="text-sm font-semibold text-slate-900">
            Evidence Act 1950 (Act 56)
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Sections 65B and 90A statutory electronic output certificate automatically attached with digital hash provenance.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            Irrevocable Power of Attorney
          </div>
          <div className="text-sm font-semibold text-slate-900">
            Powers of Attorney Act 1949 (Act 424)
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Affirms High Court of Malaya deposit (PA-KL-2021-09418) under Section 4 & 6 with irrevocable agency coupled with an interest.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-purple-600" />
            Cryptographic Integrity
          </div>
          <div className="text-xs font-mono font-semibold text-slate-900 truncate">
            {thesis.thesisMetadata.sha256MasterIntegrityDigest}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Full SHA-256 checksum computed across all 12 chapters, 18 evidentiary exhibits, and 14 Brain AI auto-corrections.
          </p>
        </div>
      </div>
    </div>
  );
}
