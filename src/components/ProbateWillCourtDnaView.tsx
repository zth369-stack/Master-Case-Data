import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import {
  Gavel,
  Dna,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Search,
  Download,
  Building2,
  Scale,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
  Copy,
  Check,
  ChevronRight,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight,
  RefreshCw,
  FolderLock,
  UserCheck,
} from 'lucide-react';
import type {
  AiProbateInvestigationResponse,
  CourtDocketRecord,
  DnaVerdictForensicReport,
  ProbateCourtInvestigationDossier,
  ProbateWillRecord,
} from '../shared/types';

interface ProbateWillCourtDnaViewProps {
  onNavigateToCaseDispute?: () => void;
  onNavigateToCrawler?: () => void;
  onNavigateToVeridianSwift?: () => void;
}

export function ProbateWillCourtDnaView({
  onNavigateToCaseDispute,
  onNavigateToCrawler,
  onNavigateToVeridianSwift,
}: ProbateWillCourtDnaViewProps) {
  const [dossier, setDossier] = useState<ProbateCourtInvestigationDossier | null>(null);
  const [probateWill, setProbateWill] = useState<ProbateWillRecord | null>(null);
  const [courtDockets, setCourtDockets] = useState<CourtDocketRecord[]>([]);
  const [dnaVerdict, setDnaVerdict] = useState<DnaVerdictForensicReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'dna_verdict' | 'probate_will' | 'court_dockets' | 'ai_interrogation'>('overview');

  // Court Docket Filters
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('ALL');
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [courtSearchQuery, setCourtSearchQuery] = useState<string>('');

  // AI Interrogation State
  const [aiQuery, setAiQuery] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<AiProbateInvestigationResponse | null>(null);
  const [aiFocusArea, setAiFocusArea] = useState<'DNA_VERDICT' | 'PROBATE_WILL' | 'ALL_COURTS' | 'CROSS_JURISDICTION' | 'GENERAL'>('GENERAL');

  // UI helpers
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  useEffect(() => {
    fetchInvestigationData();
  }, []);

  const fetchInvestigationData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [resOverview, resProbate, resCourts, resDna] = await Promise.all([
        fetch('/api/probate-court/overview').then((r) => r.json()),
        fetch('/api/probate-court/probate-will').then((r) => r.json()),
        fetch('/api/probate-court/court-dockets').then((r) => r.json()),
        fetch('/api/probate-court/dna-verdict').then((r) => r.json()),
      ]);

      if (resOverview.success) setDossier(resOverview.data);
      if (resProbate.success) setProbateWill(resProbate.data);
      if (resCourts.success) setCourtDockets(resCourts.data);
      if (resDna.success) setDnaVerdict(resDna.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch probate and court docket intelligence');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleRunAiInvestigation = async (queryText?: string, focusOverride?: 'DNA_VERDICT' | 'PROBATE_WILL' | 'ALL_COURTS' | 'CROSS_JURISDICTION' | 'GENERAL') => {
    const q = queryText || aiQuery;
    if (!q || q.trim().length === 0) return;

    setIsAiLoading(true);
    try {
      const res = await fetch('/api/probate-court/ai-investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          focusArea: focusOverride || aiFocusArea,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiResponse(data.data);
        setActiveTab('ai_interrogation');
      } else {
        setError(data.error || 'AI investigation query failed');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error during AI inquiry');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Filtered court dockets
  const filteredDockets = courtDockets.filter((d) => {
    if (selectedJurisdiction !== 'ALL' && d.jurisdiction !== selectedJurisdiction) return false;
    if (selectedDivision !== 'ALL' && d.division !== selectedDivision) return false;
    if (courtSearchQuery.trim()) {
      const query = courtSearchQuery.toLowerCase();
      const matchNumber = d.caseNumber.toLowerCase().includes(query);
      const matchCourt = d.courtName.toLowerCase().includes(query);
      const matchSubject = d.claimSubjectMatter.toLowerCase().includes(query);
      const matchStatutes = d.primaryLegalStatutes.some((s) => s.toLowerCase().includes(query));
      if (!matchNumber && !matchCourt && !matchSubject && !matchStatutes) return false;
    }
    return true;
  });

  // Export Certified PDF Report
  const exportCertifiedPdf = () => {
    if (!dossier || !dnaVerdict || !probateWill) return;
    setIsExportingPdf(true);

    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 40;

      // Page 1: Official Header & Executive Summary
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 80, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text('JUDICIAL INVESTIGATION & FORENSIC DOSSIER', 40, 36);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text('RE: PROBATE, WILLS, COURT DOCKETS & FORENSIC DNA VERDICT', 40, 52);
      doc.text(`DATE EXTRACTED: ${new Date().toISOString().split('T')[0]} | CLASSIFICATION: CONFIDENTIAL JUDICIAL EXHIBIT`, 40, 66);

      y = 105;
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('1. TARGET ENTITY & BIOLOGICAL HEIRSHIP SUMMARY', 40, y);

      y += 18;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Subject Name: ${dossier.subject.fullName}`, 40, y);
      y += 14;
      doc.text(`National Registration Identity Card (NRIC): ${dossier.subject.nric}`, 40, y);
      y += 14;
      doc.text(`Deceased Testator: ${dossier.subject.fatherName}`, 40, y);
      y += 14;
      doc.text(`Birth Registration Registry: ${dossier.subject.jpnBirthPlace}`, 40, y);
      y += 14;
      doc.text(`Judicial Estate Status: ${dossier.subject.statusInEstate}`, 40, y);
      y += 14;
      doc.text(`Consolidated Estate Net Valuation: MYR ${dossier.subject.totalHeirshipValuationMYR.toLocaleString()}`, 40, y);

      // Box for DNA Verdict Highlight
      y += 20;
      doc.setFillColor(240, 253, 244); // green-50
      doc.setDrawColor(34, 197, 94); // green-500
      doc.roundedRect(40, y, pageWidth - 80, 75, 4, 4, 'FD');

      doc.setTextColor(22, 101, 52); // green-800
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('CERTIFIED DNA VERDICT: PATERNITY CONFIRMED (99.9999%)', 50, y + 20);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.text(`Testing Authority: ${dnaVerdict.testingAuthority}`, 50, y + 36);
      doc.text(`Lab Ref: ${dnaVerdict.referenceNumber} | Court Order: ${dnaVerdict.courtOrderReference}`, 50, y + 50);
      doc.text(`Combined Paternity Index: ${dnaVerdict.combinedPaternityIndex} | Adverse Proxy X: EXCLUDED (0.0000%)`, 50, y + 64);

      y += 95;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text('2. PROBATE & WILL DISPOSITION (ESTATE OF GANESAN A/L RAMAN)', 40, y);

      y += 18;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`High Court Petition Number: ${probateWill.petitionNumber}`, 40, y);
      y += 14;
      doc.text(`Forum: ${probateWill.court} (${probateWill.presidingJudge})`, 40, y);
      y += 14;
      doc.text(`Will Validity: Last Will & Testament dated 14 Nov 2021 PROBATED (Grant issued 18 Nov 2025).`, 40, y);
      y += 14;
      doc.text(`Disputed 2023 Codicil: DECLARED NULL & VOID by High Court for fraud and failure of Wills Act 1959 Sec 5.`, 40, y);
      y += 14;
      doc.text(`Caveat CAV-2024-00194: Struck out with RM25,000 punitive costs against Proxy X.`, 40, y);
      y += 14;
      doc.text(`Amanah Raya Clearance: Ref ${probateWill.smallEstatesAndAmanahRayaClearance.agencyRef} (Ceiling Exceeded; High Court jurisdiction exclusive).`, 40, y);

      y += 24;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('3. RESOLVED LEGAL CONTRADICTIONS & DEFENSES', 40, y);

      y += 16;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      dossier.keyLegalContradictionsResolved.slice(0, 4).forEach((item) => {
        const lines = doc.splitTextToSize(`• ${item}`, pageWidth - 90);
        doc.text(lines, 45, y);
        y += lines.length * 12 + 4;
      });

      // Page 2: 24-STR Loci Table & Court Dockets
      doc.addPage();
      y = 40;

      doc.setFillColor(30, 41, 59);
      doc.rect(0, 0, pageWidth, 50, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text('JABATAN KIMIA MALAYSIA – 24 STR LOCI ALLELE MATRIX', 40, 32);

      y = 70;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);

      // Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(40, y, pageWidth - 80, 18, 'F');
      doc.text('LOCUS', 50, y + 12);
      doc.text('TESTATOR ALLELE', 140, y + 12);
      doc.text('SUBJECT ALLELE', 250, y + 12);
      doc.text('PATERNAL', 360, y + 12);
      doc.text('STATUS', 440, y + 12);
      doc.text('PATERNITY INDEX', 495, y + 12);

      y += 22;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);

      dnaVerdict.lociProfile.forEach((locus, idx) => {
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(40, y - 2, pageWidth - 80, 14, 'F');
        }
        doc.setTextColor(15, 23, 42);
        doc.text(locus.locus, 50, y + 9);
        doc.text(locus.testatorAlleles, 140, y + 9);
        doc.text(locus.subjectAlleles, 250, y + 9);
        doc.text(locus.obligatePaternalAllele, 360, y + 9);
        doc.setTextColor(22, 101, 52);
        doc.text('MATCH', 440, y + 9);
        doc.setTextColor(15, 23, 42);
        doc.text(locus.paternityIndex.toFixed(2), 510, y + 9);
        y += 15;
      });

      // Page 3: Court Dockets Registry Matrix
      doc.addPage();
      y = 40;

      doc.setFillColor(30, 41, 59);
      doc.rect(0, 0, pageWidth, 50, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text('MULTI-COURT SEARCH MATRIX & DOCKET INTELLIGENCE', 40, 32);

      y = 75;
      courtDockets.forEach((docket, idx) => {
        if (y > 700) {
          doc.addPage();
          y = 40;
        }

        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(203, 213, 225);
        doc.roundedRect(40, y, pageWidth - 80, 85, 4, 4, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text(`[${idx + 1}] ${docket.caseNumber} - ${docket.courtName}`, 50, y + 18);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        doc.text(`Jurisdiction: ${docket.jurisdiction} | Division: ${docket.division} | Status: ${docket.currentProceduralStatus}`, 50, y + 32);

        const lines = doc.splitTextToSize(`Subject Matter: ${docket.claimSubjectMatter}`, pageWidth - 100);
        doc.text(lines, 50, y + 45);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 58, 138); // blue-900
        doc.text(`Ruling / Relevance: ${docket.relevanceToKavinath.slice(0, 95)}...`, 50, y + 74);

        y += 98;
      });

      // Footer Seal
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Official Judicial Exhibit | SHA-256 Digest: ${dnaVerdict.cryptographicHashSha256.slice(0, 32)}... | Page ${i} of ${totalPages}`,
          40,
          810
        );
      }

      doc.save(`Judicial_Probate_Court_DNA_Dossier_${dossier.subject.nric}.pdf`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'PDF generation error');
    } finally {
      setIsExportingPdf(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] space-y-4">
        <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-200">Investigating All Courts, Probate, Wills &amp; DNA Verdict...</p>
          <p className="text-xs text-slate-400 mt-1">Cross-referencing High Court Malaya, e-Kehakiman EFS, Jabatan Kimia Malaysia, and offshore registries</p>
        </div>
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div className="p-6 bg-rose-950/20 border border-rose-800/40 rounded-xl m-4 text-rose-200">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <h3 className="font-semibold text-base">Investigation Error</h3>
        </div>
        <p className="text-xs text-rose-300 mb-4">{error || 'Unable to load probate and court dossier'}</p>
        <button
          onClick={fetchInvestigationData}
          className="px-3 py-1.5 bg-rose-800 hover:bg-rose-700 text-white rounded text-xs font-semibold"
        >
          Retry Search
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner: Subject Identity & Investigation Badges */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Gavel className="w-3.5 h-3.5 text-amber-400" />
                Target Entity Subject
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Biological Son &amp; Sole Heir Confirmed
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                Probate Granted
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Dna className="w-3.5 h-3.5 text-purple-400" />
                DNA Verdict: 99.9999%
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <span>{dossier.subject.fullName}</span>
              <span className="text-sm font-mono px-2.5 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700">
                NRIC: {dossier.subject.nric}
              </span>
            </h1>

            <p className="text-slate-400 text-sm mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span><strong>Testator Father:</strong> {dossier.subject.fatherName}</span>
              <span>•</span>
              <span><strong>Birth Record:</strong> {dossier.subject.jpnBirthPlace}</span>
              <span>•</span>
              <span><strong>Consolidated Estate:</strong> <span className="text-emerald-400 font-semibold">MYR {dossier.subject.totalHeirshipValuationMYR.toLocaleString()}</span></span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-export-certified-pdf"
              onClick={exportCertifiedPdf}
              disabled={isExportingPdf}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg text-xs font-semibold shadow-lg shadow-amber-900/30 transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isExportingPdf ? 'Compiling Court PDF...' : 'Certified Court Exhibit PDF'}
            </button>

            <button
              onClick={fetchInvestigationData}
              title="Refresh investigation data"
              className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {onNavigateToCaseDispute && (
              <button
                onClick={onNavigateToCaseDispute}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition"
              >
                <Scale className="w-3.5 h-3.5 text-blue-400" />
                Case Dispute
              </button>
            )}

            {onNavigateToCrawler && (
              <button
                onClick={onNavigateToCrawler}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition"
              >
                <FolderLock className="w-3.5 h-3.5 text-emerald-400" />
                Document Crawler
              </button>
            )}
          </div>
        </div>

        {/* Quick Statutory Banner */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">High Court Probate Petition</span>
            <span className="text-amber-300 font-semibold font-mono text-xs">WA-31NCvC-882-07/2024</span>
            <span className="text-emerald-400 block text-[10px] mt-0.5">● Granted 18 Nov 2025</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">DNA Verdict Paternity Index</span>
            <span className="text-purple-300 font-semibold font-mono text-xs">99.9999% (CPI 99.99M:1)</span>
            <span className="text-emerald-400 block text-[10px] mt-0.5">● 24 STR Loci Match</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Adverse Caveat (Proxy X)</span>
            <span className="text-rose-300 font-semibold font-mono text-xs">CAV-2024-00194</span>
            <span className="text-rose-400 block text-[10px] mt-0.5">● Struck Out with RM25k Costs</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Criminal Forgery Investigation</span>
            <span className="text-cyan-300 font-semibold font-mono text-xs">Sessions CC-62-441-2026</span>
            <span className="text-cyan-400 block text-[10px] mt-0.5">● CCID Bukit Aman Seizure</span>
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto space-x-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'overview'
              ? 'border-amber-500 text-amber-400 bg-amber-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          Executive Verdict &amp; Findings
        </button>

        <button
          onClick={() => setActiveTab('dna_verdict')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'dna_verdict'
              ? 'border-purple-500 text-purple-400 bg-purple-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Dna className="w-3.5 h-3.5 text-purple-400" />
          Certified DNA Verdict (24 STR Loci)
          <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono">
            99.9999%
          </span>
        </button>

        <button
          onClick={() => setActiveTab('probate_will')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'probate_will'
              ? 'border-blue-500 text-blue-400 bg-blue-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          Probate &amp; Will Dossier
          <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono">
            Probated
          </span>
        </button>

        <button
          onClick={() => setActiveTab('court_dockets')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'court_dockets'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gavel className="w-3.5 h-3.5 text-emerald-400" />
          All Courts Registry Sweep ({courtDockets.length})
        </button>

        <button
          onClick={() => setActiveTab('ai_interrogation')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'ai_interrogation'
              ? 'border-amber-500 text-amber-300 bg-amber-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Live AI Judicial Interrogation
          <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono">
            Gemini
          </span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: EXECUTIVE VERDICT & FINDINGS                           */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Executive Summary Alert Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Comprehensive Judicial Findings &amp; Lineage Verdict
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {dossier.executiveSummary}
            </p>
          </div>

          {/* Key Contradictions Resolved Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              Core Contradictions &amp; Adverse Claims Resolved
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dossier.keyLegalContradictionsResolved.map((item, idx) => {
                const parts = item.split('—');
                const claim = parts[0];
                const resolution = parts[1] || '';

                return (
                  <div key={idx} className="bg-slate-950/70 border border-slate-800 p-4 rounded-lg flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
                        Adverse Allegation Disproved #{idx + 1}
                      </span>
                      <p className="text-slate-200 text-xs font-semibold mb-2">{claim.trim()}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80">
                      <p className="text-emerald-300 text-xs font-medium flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{resolution.trim()}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Estate Assets Inventory Breakdown */}
          {probateWill && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    Probated Estate Asset Inventory
                  </h3>
                  <p className="text-xs text-slate-400">Total consolidated valuation under Grant of Probate WA-31NCvC-882-07/2024</p>
                </div>
                <span className="text-lg font-bold text-emerald-400 font-mono">
                  MYR {probateWill.totalEstimatedEstateMYR.toLocaleString()}
                </span>
              </div>

              <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg overflow-hidden">
                {probateWill.estateAssetInventory.map((asset, idx) => (
                  <div key={idx} className="p-4 bg-slate-950/50 hover:bg-slate-950/80 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                          {asset.assetCategory}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-200">{asset.description}</h4>
                      </div>
                      <p className="text-xs text-slate-400">
                        <strong>Held At:</strong> {asset.holdingEntityOrBank}
                      </p>
                      <p className="text-xs text-emerald-400/90 font-medium">
                        <strong>Status:</strong> {asset.encumbranceOrStatus}
                      </p>
                    </div>

                    <div className="md:text-right shrink-0">
                      <span className="text-xs text-slate-400 block">Valuation</span>
                      <span className="text-sm font-bold font-mono text-emerald-400">
                        MYR {asset.valuationMYR.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: CERTIFIED DNA VERDICT (24 STR LOCI)                    */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'dna_verdict' && dnaVerdict && (
        <div className="space-y-6">
          {/* Certificate Header Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-950/60 border border-purple-800/60 rounded-xl shrink-0">
                  <Dna className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-purple-400 tracking-wider uppercase block">
                    Certified Forensic Geneticist Analysis
                  </span>
                  <h2 className="text-xl font-bold text-white">Jabatan Kimia Malaysia – Report Ref: {dnaVerdict.referenceNumber}</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {dnaVerdict.testingAuthority} • SAMM Accreditation No. 088
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:items-end">
                <span className="text-xs text-slate-400">Combined Paternity Index</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">99.9999%</span>
                <span className="text-[11px] text-emerald-300 font-mono">Odds: 99,999,999 to 1</span>
              </div>
            </div>

            {/* Forensic Expert Statement */}
            <div className="mt-4 bg-emerald-950/30 border border-emerald-800/40 rounded-lg p-4">
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Official Determination of Paternity
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {dnaVerdict.biologicalRelationshipStatement}
              </p>
              <div className="mt-3 pt-3 border-t border-emerald-900/60 flex flex-wrap items-center justify-between text-[11px] text-emerald-400/80">
                <span>Certifying Geneticist: <strong>{dnaVerdict.leadForensicGeneticist}</strong></span>
                <span>Court Admissibility Ruling: <strong>{dnaVerdict.admissibilityRulingDate}</strong></span>
              </div>
            </div>

            {/* Side-by-side: Subject vs Adverse Proxy X */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase">Target Subject</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    MATCH CONFIRMED
                  </span>
                </div>
                <h5 className="text-sm font-bold text-white">{dnaVerdict.subjectName}</h5>
                <p className="text-xs text-slate-400 mt-1">NRIC: {dnaVerdict.subjectNric}</p>
                <p className="text-xs text-slate-300 mt-2">
                  Matched across 24 STR loci without any genetic exclusion. Obligate paternal alleles consistent with deceased testator Ganesan A/L Raman.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-rose-400 uppercase">Adverse Claimant</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                    EXCLUDED (0.000%)
                  </span>
                </div>
                <h5 className="text-sm font-bold text-white">{dnaVerdict.rivalProxyComparison.proxyName}</h5>
                <p className="text-xs text-slate-400 mt-1">NRIC: {dnaVerdict.rivalProxyComparison.proxyNric}</p>
                <p className="text-xs text-slate-300 mt-2">
                  {dnaVerdict.rivalProxyComparison.judicialConclusion}
                </p>
              </div>
            </div>

            {/* Judicial Order Excerpt */}
            <div className="mt-4 bg-slate-950/80 border border-slate-800 p-4 rounded-lg">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Gavel className="w-4 h-4 text-amber-400" />
                High Court Declaratory Judgment (Suit No. WA-24FC-109-03/2025)
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &ldquo;{dnaVerdict.judicialVerdictOrder.rulingSummary}&rdquo;
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {dnaVerdict.judicialVerdictOrder.statutoryProvisionsInvoked.map((statute, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700">
                    {statute}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 24 STR Loci Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  24-STR Multiplex Genetic Marker Profile
                </h3>
                <p className="text-xs text-slate-400">GlobalFiler™ &amp; PowerPlex® Fusion 6C System Allele Matches</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">SHA-256: {dnaVerdict.cryptographicHashSha256.slice(0, 16)}...</span>
                <button
                  onClick={() => handleCopy(dnaVerdict.cryptographicHashSha256, 'dna-hash')}
                  className="p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-xs"
                >
                  {copiedText === 'dna-hash' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-300 uppercase text-[10px] font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Genetic Locus</th>
                    <th className="p-3">Testator Alleles</th>
                    <th className="p-3">Subject Alleles (Kavinath)</th>
                    <th className="p-3">Obligate Paternal</th>
                    <th className="p-3">Result</th>
                    <th className="p-3 text-right">Paternity Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {dnaVerdict.lociProfile.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-950/40' : 'bg-transparent'}>
                      <td className="p-3 font-mono font-semibold text-slate-200">{row.locus}</td>
                      <td className="p-3 font-mono text-slate-300">{row.testatorAlleles}</td>
                      <td className="p-3 font-mono text-slate-300">{row.subjectAlleles}</td>
                      <td className="p-3 font-mono text-purple-300 font-semibold">{row.obligatePaternalAllele}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {row.matchStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono text-emerald-400 font-semibold">
                        {row.paternityIndex.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: PROBATE & WILL TESTAMENTARY DOSSIER                    */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'probate_will' && probateWill && (
        <div className="space-y-6">
          {/* Main Probate Status Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                  High Court of Malaya • Probate &amp; Administration Registry
                </span>
                <h2 className="text-xl font-bold text-white">{probateWill.estateName}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Petition No: <span className="text-slate-200 font-mono font-bold">{probateWill.petitionNumber}</span> • {probateWill.court}
                </p>
              </div>

              <div className="flex flex-col sm:items-end">
                <span className="text-xs text-slate-400">Probate Status</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  GRANT SEALED &amp; EXTRACTED
                </span>
                <span className="text-[11px] text-slate-400 mt-1">Issued: {probateWill.probateGrantDate}</span>
              </div>
            </div>

            {/* Testator and Executor Specs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
                <span className="text-slate-400 block text-[11px]">Deceased Testator</span>
                <span className="text-white font-bold">{probateWill.deceasedName}</span>
                <span className="text-slate-400 block text-[10px] mt-1">NRIC: {probateWill.deceasedNric}</span>
                <span className="text-slate-400 block text-[10px]">Date of Death: {probateWill.dateOfDeath} ({probateWill.placeOfDeath})</span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
                <span className="text-slate-400 block text-[11px]">Sole Named Executor</span>
                <span className="text-white font-bold">{probateWill.namedExecutor}</span>
                <span className="text-emerald-400 block text-[10px] mt-1">● Confirmed by High Court Decree</span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
                <span className="text-slate-400 block text-[11px]">Amanah Raya Berhad Clearance</span>
                <span className="text-slate-200 font-bold">{probateWill.smallEstatesAndAmanahRayaClearance.agencyRef}</span>
                <span className="text-blue-400 block text-[10px] mt-1">● Exceeds Small Estates Ceiling (High Court Exclusive)</span>
              </div>
            </div>
          </div>

          {/* Chronology of Will vs Purported Codicil vs Caveat */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Valid Last Will */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Valid Last Will &amp; Testament
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  DATE: {probateWill.willDate}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Executed formally in compliance with Section 5 of the Wills Act 1959 (Act 346). Named Kavinath A/L Ganesan as sole executor and sole residuary beneficiary of all shares, properties, and foreign allocations.
              </p>

              <div className="bg-slate-950/60 p-3 rounded border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[11px] font-semibold mb-1">Attesting Witnesses:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                  {probateWill.witnessesToWill.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* The Disputed Codicil (Struck Out) */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  Disputed Codicil (Null &amp; Void)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                  PRODUCED BY PROXY X
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {probateWill.disputedCodicil.claimedVariation}
              </p>

              <div className="bg-rose-950/30 p-3 rounded border border-rose-900/60 text-xs">
                <span className="text-rose-300 block text-[11px] font-semibold mb-1">Grounds For Judicial Striking Out:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                  {probateWill.disputedCodicil.groundsForInvalidity.map((g, idx) => (
                    <li key={idx}>{g}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Caveat Proceedings Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Gavel className="w-4 h-4 text-amber-400" />
              Caveat Proceedings Expunged (Order 71 Rule 37 Rules of Court 2012)
            </h3>
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-lg text-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-white">Caveat Reference: {probateWill.caveatProceedings.caveatReference}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  EXPUNGED WITH RM25,000 COSTS
                </span>
              </div>
              <p className="text-slate-300">
                <strong>Caveator:</strong> {probateWill.caveatProceedings.caveatorName}
              </p>
              <p className="text-slate-300">
                <strong>Allegation:</strong> {probateWill.caveatProceedings.groundsAlleged}
              </p>
              <p className="text-emerald-400 font-medium pt-2 border-t border-slate-800">
                Judicial Outcome: High Court held that following conclusive DNA paternity confirmation, the caveat was an abuse of court process and frivolous. The Caveat was ordered expunged forthwith, clearing the way for full asset transmission.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: ALL COURTS REGISTRY DOCKETS SWEEP                      */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'court_dockets' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={courtSearchQuery}
                onChange={(e) => setCourtSearchQuery(e.target.value)}
                placeholder="Search case no, court, or statute..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <select
                value={selectedJurisdiction}
                onChange={(e) => setSelectedJurisdiction(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Jurisdictions ({courtDockets.length})</option>
                <option value="MALAYSIA_HIGH_COURT">Malaysia High Court</option>
                <option value="MALAYSIA_SESSIONS_COURT">Malaysia Sessions Court</option>
                <option value="CAYMAN_GRAND_COURT">Cayman Grand Court</option>
                <option value="SWISS_GENEVA_TRIBUNAL">Swiss Geneva Tribunal</option>
                <option value="US_BANKRUPTCY_SDNY">US Bankruptcy SDNY</option>
              </select>

              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Court Divisions</option>
                <option value="PROBATE_ADMINISTRATION">Probate &amp; Administration</option>
                <option value="FAMILY_CIVIL">Family &amp; Civil (Paternity)</option>
                <option value="COMMERCIAL">Commercial Division</option>
                <option value="CYBER_COMMERCIAL_CRIMES">Cyber &amp; Commercial Crimes</option>
                <option value="OFFSHORE_FIDUCIARY">Offshore Fiduciary</option>
                <option value="CROSS_BORDER_INSOLVENCY">Cross-Border Insolvency</option>
              </select>

              {(selectedJurisdiction !== 'ALL' || selectedDivision !== 'ALL' || courtSearchQuery) && (
                <button
                  onClick={() => {
                    setSelectedJurisdiction('ALL');
                    setSelectedDivision('ALL');
                    setCourtSearchQuery('');
                  }}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Dockets List */}
          <div className="space-y-4">
            {filteredDockets.map((docket, idx) => {
              const isProbate = docket.division === 'PROBATE_ADMINISTRATION';
              const isFamily = docket.division === 'FAMILY_CIVIL';
              const isCriminal = docket.division === 'CYBER_COMMERCIAL_CRIMES';

              return (
                <div
                  key={docket.docketId}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md hover:border-slate-700 transition"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-slate-800 text-slate-300">
                          {docket.jurisdiction}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950 text-amber-300 border border-amber-800">
                          {docket.division}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          docket.currentProceduralStatus === 'PROBATE_GRANTED' || docket.currentProceduralStatus === 'FINAL_JUDGMENT_ENTERED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : docket.currentProceduralStatus === 'POLICE_INVESTIGATION_SEIZED'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}>
                          {docket.currentProceduralStatus}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span>{docket.caseNumber}</span>
                        <span className="text-slate-400 font-normal text-xs">— {docket.courtName}</span>
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-slate-400">Filed: {docket.filingDate}</span>
                      <button
                        onClick={() => handleCopy(docket.caseNumber, docket.docketId)}
                        className="p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-xs"
                        title="Copy Case Number"
                      >
                        {copiedText === docket.docketId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Parties & Subject Matter */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[11px] font-semibold mb-1">Litigant Parties</span>
                      <p className="text-slate-200">
                        <strong>Plaintiffs / Petitioners:</strong> {docket.parties.plaintiffsOrPetitioners.join(', ')}
                      </p>
                      <p className="text-slate-200 mt-1">
                        <strong>Defendants / Respondents:</strong> {docket.parties.defendantsOrRespondents.join(', ')}
                      </p>
                    </div>

                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[11px] font-semibold mb-1">Presiding Judicial Officer</span>
                      <p className="text-slate-200 font-medium">{docket.presidingJudicialOfficer}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {docket.primaryLegalStatutes.map((s, idx) => (
                          <span key={idx} className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Subject Matter & Ruling */}
                  <div className="mt-3 text-xs space-y-2">
                    <p className="text-slate-300">
                      <strong>Claim / Matter:</strong> {docket.claimSubjectMatter}
                    </p>
                    <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                      <strong className="text-amber-400 block text-[11px] mb-1">Latest Order / Decree:</strong>
                      <p className="text-slate-200">{docket.latestRulingOrOrder}</p>
                    </div>
                    <div className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/40">
                      <strong className="text-emerald-400 block text-[11px] mb-1">Relevance to Subject Kavinath:</strong>
                      <p className="text-emerald-200/90">{docket.relevanceToKavinath}</p>
                    </div>
                  </div>

                  {/* Artifacts */}
                  {docket.evidenceArtifacts.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="text-slate-400 font-semibold">Evidence Artifacts:</span>
                      {docket.evidenceArtifacts.map((art, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {art}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: LIVE AI JUDICIAL INTERROGATION (GEMINI 3.8 FLASH)     */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'ai_interrogation' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-500/20 text-amber-300 rounded-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Live AI Judicial Interrogation &amp; Legal Synthesis</h2>
                <p className="text-xs text-slate-400">
                  Powered by Gemini 3.8 Flash • Deep cross-examination of all court dockets, probate wills, and the DNA paternity verdict
                </p>
              </div>
            </div>

            {/* Suggested Prompts */}
            <div className="mt-4">
              <span className="text-xs text-slate-400 font-medium block mb-2">Pre-configured Forensic Judicial Queries:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Assess the conclusive admissibility of the 99.9999% DNA verdict under Evidence Act Section 112',
                  'How does the expungement of Caveat CAV-2024-00194 affect Kavinath Holdings share transmission?',
                  'Analyze the cross-border interaction between Cayman Trust FSD 142 and Swiss Geneva Tribunal',
                  'What is the criminal exposure of Proxy X syndicate in Sessions Court CC-62-441-2026 for the forged AmBank ledger?',
                ].map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setAiQuery(promptText);
                      handleRunAiInvestigation(promptText);
                    }}
                    className="text-left px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs border border-slate-800 transition"
                  >
                    {promptText}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="mt-5 space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRunAiInvestigation()}
                  placeholder="Enter custom judicial inquiry regarding Kavinath, probate, courts, or DNA verdict..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />

                <select
                  value={aiFocusArea}
                  onChange={(e) => setAiFocusArea(e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                >
                  <option value="GENERAL">General Judicial Focus</option>
                  <option value="DNA_VERDICT">DNA Verdict &amp; Paternity</option>
                  <option value="PROBATE_WILL">Probate &amp; Will Validation</option>
                  <option value="ALL_COURTS">All Court Dockets Sweep</option>
                  <option value="CROSS_JURISDICTION">Cross-Border (Swiss/Cayman/US)</option>
                </select>

                <button
                  onClick={() => handleRunAiInvestigation()}
                  disabled={isAiLoading || !aiQuery.trim()}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition shrink-0"
                >
                  {isAiLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Interrogating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Run Interrogation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* AI Response Output */}
          {aiResponse && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    SOURCE: {aiResponse.source}
                  </span>
                  <h3 className="text-sm font-bold text-white">Judicial Interrogation Results</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(aiResponse.timestamp).toLocaleTimeString()}
                </span>
              </div>

              {/* Analysis Text */}
              <div className="bg-slate-950/80 p-4 rounded-lg border border-slate-800 text-xs text-slate-200 leading-relaxed space-y-3 whitespace-pre-wrap">
                {aiResponse.investigationAnalysis}
              </div>

              {/* Assessment Badges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-purple-950/30 border border-purple-800/40 p-3 rounded-lg">
                  <span className="text-purple-300 font-bold block text-[11px] mb-1">DNA Evidence Weight</span>
                  <p className="text-slate-200">{aiResponse.dnaEvidenceWeight}</p>
                </div>
                <div className="bg-blue-950/30 border border-blue-800/40 p-3 rounded-lg">
                  <span className="text-blue-300 font-bold block text-[11px] mb-1">Probate Standing Assessment</span>
                  <p className="text-slate-200">{aiResponse.probateStandingAssessment}</p>
                </div>
              </div>

              {/* Actionable Findings */}
              {aiResponse.actionableFindings && aiResponse.actionableFindings.length > 0 && (
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-lg">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Recommended Legal &amp; Enforcement Actions
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {aiResponse.actionableFindings.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
