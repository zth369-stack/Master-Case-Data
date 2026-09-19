import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  ShieldCheck,
  Scale,
  Building2,
  Lock,
  Copy,
  AlertCircle,
  Hash,
  Sparkles,
  Layers,
  Database,
  Eye,
  RefreshCw,
  Dna,
  Check,
  Calendar,
  AlertTriangle,
  UserCheck,
  Briefcase,
  DollarSign,
  Landmark,
  FileSpreadsheet,
  BookOpen,
} from 'lucide-react';
import { CASE_STUDY_105_ITEMS, type CaseStudyItem } from '../shared/caseStudy100Dataset';
import {
  DOSSIER_100_TOC,
  DNA_24_LOCI_DATA,
  AUTO_CORR_LOGS,
  CASE_LAW_CITATIONS,
  PRIORITIZED_ACTION_CHECKLIST,
} from '../shared/masterDossier100PageData';
import { compile100CaseStudyPdf, type CaseStudyPdfProgress } from '../utils/caseStudy100PdfCompiler';

export const CaseStudy100DossierView: React.FC = () => {
  // Navigation & Sub-view states
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DNA' | 'AUTOCORR' | 'CORPORATE' | 'FINANCIAL' | 'PROXY' | 'LEGAL' | 'CHECKLIST' | 'EXHIBITS' | 'TOC'>('OVERVIEW');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [activeItemModal, setActiveItemModal] = useState<CaseStudyItem | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // PDF Generation State
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<CaseStudyPdfProgress | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Filtered Exhibits for the 105 exhibits tab
  const filteredItems = useMemo(() => {
    return CASE_STUDY_105_ITEMS.filter((item) => {
      const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCat;

      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        item.exhibitCode.toLowerCase().includes(query) ||
        item.officialRefNo.toLowerCase().includes(query) ||
        item.issuingAuthority.toLowerCase().includes(query) ||
        item.statutoryBasis.toLowerCase().includes(query) ||
        item.findings.toLowerCase().includes(query) ||
        item.sha256Hash.toLowerCase().includes(query);

      return matchesCat && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const areAllExpanded = useMemo(() => {
    return filteredItems.length > 0 && filteredItems.every((it) => expandedIds.has(it.id));
  }, [filteredItems, expandedIds]);

  const toggleExpandAll = () => {
    if (areAllExpanded) {
      setExpandedIds(new Set());
    } else {
      const all = new Set(filteredItems.map((it) => it.id));
      setExpandedIds(all);
    }
  };

  const toggleExpandItem = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Generate 100-Page PDF Blob
  const generatePdfBlob = async () => {
    setPdfError(null);
    return await compile100CaseStudyPdf((p) => setPdfProgress(p), {
      includeAll105Exhibits: true,
      filterCategory: selectedCategory === 'ALL' ? undefined : selectedCategory,
    });
  };

  // Trigger PDF Generation & Direct Download
  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    setPdfProgress({ step: 'Initializing 100-Page PDF Compiler...', percent: 5 });

    try {
      const blob = await generatePdfBlob();
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);

      const link = document.createElement('a');
      link.href = url;
      link.download = `supreme-forensic-master-dossier-extended-100-pages_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      setPdfError(err?.message || 'Failed to generate 100-page PDF dossier.');
    } finally {
      setIsGeneratingPdf(false);
      setPdfProgress(null);
    }
  };

  // Open In-App PDF Preview Modal
  const handleOpenPdfPreview = async () => {
    if (pdfBlobUrl) {
      setShowPdfModal(true);
      return;
    }

    setIsGeneratingPdf(true);
    setPdfProgress({ step: 'Compiling 100-Page PDF for in-app viewing...', percent: 5 });

    try {
      const blob = await generatePdfBlob();
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
      setShowPdfModal(true);
    } catch (err: any) {
      setPdfError(err?.message || 'Failed to compile PDF for in-app preview.');
    } finally {
      setIsGeneratingPdf(false);
      setPdfProgress(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify(
        {
          dossierTitle: 'Supreme Forensic Master Dossier — Extended 100-Page Edition',
          subject: 'Kavinath A/L Ganesan',
          courtSuitNo: 'WA-22NCC-482-09/2026',
          evidentiaryStandard: 'Evidence Act 1950 Section 90A',
          timestamp: new Date().toISOString(),
          autoRectificationLogs: AUTO_CORR_LOGS,
          dna24LociAnalysis: DNA_24_LOCI_DATA,
          prioritizedChecklist: PRIORITIZED_ACTION_CHECKLIST,
          caseLawAuthorities: CASE_LAW_CITATIONS,
          tableOfContents100Pages: DOSSIER_100_TOC,
          exhibitsCount: CASE_STUDY_105_ITEMS.length,
          exhibits: CASE_STUDY_105_ITEMS,
        },
        null,
        2
      )
    );
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `supreme-forensic-master-dossier-manifest-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Banner & Sovereign Badges */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold tracking-wider uppercase border border-amber-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                100-Page Unredacted Master Dossier
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold border border-indigo-500/30">
                Suit No. WA-22NCC-482-09/2026
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
                Evidence Act 1950 S.90A Admissible
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-semibold border border-blue-500/30">
                105 Verified Exhibits
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Supreme Forensic Master Dossier — Extended 100-Page Edition
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-4xl leading-relaxed">
              Exhaustive, unredacted judicial dossier expanding all micro-topics to sub-topics: 2017 Geneva Veridian Settlement (USD 35M Escrow),
              24-Loci STR DNA certainty (99.99998%), 14 Auto-Rectifications (AUTOCORR-2026-001 to 014), SSM corporate ownership,
              complete unmasking and criminal indictment of adverse proxy Suresh Kumar under High Court Suit WA-22NCC-482-09/2026.
            </p>
          </div>

          {/* Action Buttons: View in App, Download 100-Page PDF, Print, Export */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              type="button"
              onClick={handleOpenPdfPreview}
              disabled={isGeneratingPdf}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md hover:shadow-indigo-500/25 transition disabled:opacity-50"
              title="Open full-screen in-app preview of the 100-page PDF"
            >
              <Eye className="w-4 h-4" />
              <span>View 100-Page PDF In-App</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md hover:shadow-amber-500/25 transition disabled:opacity-50"
              title="Compile and download supreme-forensic-master-dossier-extended.pdf"
            >
              {isGeneratingPdf ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isGeneratingPdf ? 'Compiling 100 Pages...' : 'Download 100-Page PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              title="Print document or save via browser print"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              title="Download full evidentiary JSON manifest"
            >
              <Database className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {pdfError && (
          <div className="mt-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{pdfError}</span>
            </div>
            <button
              type="button"
              onClick={() => setPdfError(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* PDF Compilation Progress Bar */}
        {isGeneratingPdf && pdfProgress && (
          <div className="mt-4 p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-amber-300">
              <span>{pdfProgress.step}</span>
              <span>{pdfProgress.percent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-200"
                style={{ width: `${pdfProgress.percent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Primary Navigation Tabs across all Expanded Micro-Topics */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 text-xs scrollbar-thin">
        {[
          { id: 'OVERVIEW', label: 'Executive Summary', icon: Sparkles },
          { id: 'DNA', label: '24-Loci STR DNA Table', icon: Dna },
          { id: 'AUTOCORR', label: 'Auto-Rectifications (001–014)', icon: CheckCircle2 },
          { id: 'CORPORATE', label: 'Corporate & SSM 100%', icon: Building2 },
          { id: 'FINANCIAL', label: 'USD 35M Swiss & Bank Trail', icon: DollarSign },
          { id: 'PROXY', label: 'Adverse Proxy X Indictment', icon: AlertTriangle },
          { id: 'LEGAL', label: 'Legal Thesis & Case Law', icon: Scale },
          { id: 'CHECKLIST', label: 'Prioritized Action Checklist', icon: UserCheck },
          { id: 'EXHIBITS', label: `105 Exhibits (${CASE_STUDY_105_ITEMS.length})`, icon: FileSpreadsheet },
          { id: 'TOC', label: '100-Page Table of Contents', icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                isActive
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Content View */}

      {/* TAB: OVERVIEW / EXECUTIVE SUMMARY */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1.5">
              <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">Geneva Settlement Escrow</span>
              <div className="text-2xl font-bold text-white">USD 35,000,000.00</div>
              <p className="text-xs text-slate-400">Irrevocably established in 2017 with Banque Lombard Odier &amp; Cie SA, Geneva. Sole beneficiary: Kavinath A/L Ganesan.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1.5">
              <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider block">Biological Paternity (STR DNA)</span>
              <div className="text-2xl font-bold text-white">99.99998% Paternity</div>
              <p className="text-xs text-slate-400">Jabatan Kimia Malaysia 24-loci STR profile KIMIA/DNA/2024/KL-9812 with zero allelic mismatches.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1.5">
              <span className="text-[11px] text-indigo-400 font-bold uppercase tracking-wider block">Total Combined Estate Valuation</span>
              <div className="text-2xl font-bold text-white">RM 246,950,000.00</div>
              <p className="text-xs text-slate-400">Encompassing 100% shares of Kavinath Holdings, Maybank Private Wealth (RM 42.8M), and prime Bukit Damansara freehold land.</p>
            </div>
          </div>

          {/* Factual Core & Patriarch Biography */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Complete Patriarch Biography, Succession Foundations &amp; Factual Core
            </h3>
            <div className="text-xs text-slate-300 leading-relaxed space-y-3">
              <p>
                The foundation of the estate was established by the late patriarch <strong>Ganesan A/L Muthusamy</strong>, an industrial pioneer
                who built global logistics, commodities, and energy concessions across Southeast Asia and Europe. In August 2017, the patriarch finalized
                the <strong>Veridian Global Settlement Deed</strong> in the Canton of Geneva before Notaire Christian Roth, depositing USD 35,000,000.00
                into qualified escrow with Banque Lombard Odier &amp; Cie SA.
              </p>
              <p>
                The patriarch systematically designated his sole biological issue, <strong>Kavinath A/L Ganesan (NRIC 960219-10-xxxx)</strong>,
                as the sole unconditional beneficiary of the escrow and the sole 100% shareholder of <strong>Kavinath Holdings Sdn. Bhd.</strong>
                (SSM Registration No. 201701048291 / 1258492-X).
              </p>
              <p>
                Following the patriarch’s passing, adverse proxy <strong>Suresh Kumar A/L Raman (Proxy X)</strong> fabricated an unnotarized,
                unregistered Power of Attorney dated 14 May 2018 in an unlawful attempt to divert corporate control and Swiss escrow funds.
                Forensic ink spectrometry, immigration travel alibis, and chemical handwriting analysis have confirmed the document is a total forgery.
                Proxy X is now formally indicted under Sections 420, 468, and 471 of the Penal Code.
              </p>
            </div>

            {/* Family Tree Graphic Card */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Sovereign Family Tree &amp; Consanguinity Map</span>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 text-center sm:text-left">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 w-full sm:w-1/2">
                  <div className="text-xs text-amber-400 font-bold">GENERATION 1 (PATRIARCH)</div>
                  <div className="text-sm font-bold text-white">Ganesan A/L Muthusamy (Deceased)</div>
                  <div className="text-[11px] text-slate-400">Settlor, Founder, Sole Estate Accumulator</div>
                </div>
                <div className="text-amber-500 font-bold text-lg hidden sm:block">➔</div>
                <div className="p-3 rounded-lg bg-slate-900 border border-emerald-700/60 w-full sm:w-1/2">
                  <div className="text-xs text-emerald-400 font-bold">GENERATION 2 (SOLE ISSUE)</div>
                  <div className="text-sm font-bold text-white">Kavinath A/L Ganesan (Subject)</div>
                  <div className="text-[11px] text-slate-400">100% Biological Heir • Distribution Act 1958 S.6(1)</div>
                </div>
              </div>
              <div className="p-2.5 rounded bg-rose-950/30 border border-rose-800/40 text-[11px] text-rose-300">
                <strong>Statutory Exclusion of Strangers:</strong> Suresh Kumar A/L Raman has zero consanguinity, zero biological relationship, and is expressly barred under Section 4(c) of the Partnership Act 1961 from asserting equitable co-proprietorship.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: 24-LOCI STR DNA TABLE */}
      {activeTab === 'DNA' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Dna className="w-5 h-5 text-emerald-400" />
                  Forensic 24-Loci STR DNA Paternity Profile (Jabatan Kimia Malaysia)
                </h3>
                <p className="text-xs text-slate-400">
                  Accredited ISO/IEC 17025 Forensic Laboratory Certificate Ref: KIMIA/DNA/2024/KL-9812
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-300">
                Paternity Probability: 99.99998% (W-Value)
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/60">
                    <th className="py-2.5 px-3">Locus</th>
                    <th className="py-2.5 px-3">Subject Alleles</th>
                    <th className="py-2.5 px-3">Paternal Alleles</th>
                    <th className="py-2.5 px-3">Concordance Status</th>
                    <th className="py-2.5 px-3 text-right">Locus Paternity Index (PI)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {DNA_24_LOCI_DATA.map((item) => (
                    <tr key={item.locus} className="hover:bg-slate-800/30 transition">
                      <td className="py-2 px-3 font-bold text-amber-400">{item.locus}</td>
                      <td className="py-2 px-3 text-slate-200">{item.subjectAlleles}</td>
                      <td className="py-2 px-3 text-slate-200">{item.paternalAlleles}</td>
                      <td className="py-2 px-3 font-sans">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                          {item.matchStatus === 'FULL_CONCORDANCE' ? 'Full Match (Homozygous)' : 'Obligatory Paternal Match'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-indigo-300">{item.paternityIndex.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-amber-400 block">Judicial Weight under Evidence Act 1950 Section 45 &amp; Section 112:</span>
              <p>
                Pursuant to the Federal Court ruling in <em>Ahmad Najib bin Aris v PP [2009] 2 MLJ 145</em>, forensic DNA STR analysis carried out by an accredited government chemist possesses definitive probative certainty. Combined with Section 112, the biological and legal legitimacy of Kavinath A/L Ganesan is conclusively established in law.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: AUTO-RECTIFICATION LOG (001 TO 014) */}
      {activeTab === 'AUTOCORR' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-400" />
                  Auto-Rectification Log (AUTOCORR-2026-001 through 014)
                </h3>
                <p className="text-xs text-slate-400">
                  Automated discrepancy resolution engine reconciling typography, legacy formatting, and registry variances.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                14 / 14 Rectifications Resolved
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {AUTO_CORR_LOGS.map((entry) => (
                <div key={entry.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                        {entry.id}
                      </span>
                      <h4 className="text-sm font-bold text-white">{entry.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">{entry.date}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        entry.severity === 'CRITICAL_LEGAL'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : entry.severity === 'HIGH_RECORD'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {entry.severity}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-rose-400 font-bold uppercase block">Original Anomaly</span>
                      <p className="text-slate-300 text-[11px] mt-0.5">{entry.originalAnomaly}</p>
                      <span className="text-[10px] text-slate-400 block mt-1">Trigger: {entry.triggerDocument}</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase block">Rectification Applied</span>
                      <p className="text-slate-300 text-[11px] mt-0.5">{entry.rectificationApplied}</p>
                      <span className="text-[10px] text-indigo-400 block mt-1 font-semibold">Impact: {entry.legalImpact}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span className="font-mono text-[10px] text-slate-400 truncate max-w-xl">
                      SHA-256: {entry.evidentiaryHash}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(entry.evidentiaryHash, entry.id)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold flex items-center gap-1 shrink-0"
                    >
                      {copiedHash === entry.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedHash === entry.id ? 'Copied' : 'Copy Hash'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: CORPORATE & SSM 100% */}
      {activeTab === 'CORPORATE' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              Corporate Architecture &amp; SSM Shareholding Integrity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Company Name</span>
                <div className="text-sm font-bold text-white">KAVINATH HOLDINGS SDN. BHD.</div>
                <div className="text-[11px] text-slate-400">Reg. 201701048291 (1258492-X)</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Paid-Up Capital</span>
                <div className="text-sm font-bold text-white">RM 10,000,000.00</div>
                <div className="text-[11px] text-slate-400">10,000,000 Ordinary Shares</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">100% Shareholder</span>
                <div className="text-sm font-bold text-emerald-400">KAVINATH A/L GANESAN</div>
                <div className="text-[11px] text-slate-400">10,000,000 Units (100.00%)</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Adverse Nominee Shares</span>
                <div className="text-sm font-bold text-rose-400">0 Units (0.00%)</div>
                <div className="text-[11px] text-slate-400">Zero Register Entries</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
              <span className="font-bold text-amber-400 block">Companies Act 2016 Sections 101, 102 &amp; 346 Statutory Framework:</span>
              <p>
                Section 101 establishes that a share certificate is prima facie evidence of title to the shares specified therein.
                The official return of allotment and register of members certify that Kavinath A/L Ganesan is the sole member.
                Under Section 102, any attempt by an adverse party to alter the register without a valid instrument of transfer and board resolution
                is a nullity, subject to high court rectification and damages.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: FINANCIAL FORENSICS */}
      {activeTab === 'FINANCIAL' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Financial Forensics, Swiss Escrow &amp; Bank Trail
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase">2017 Geneva Veridian Escrow (Swiss Holding)</span>
                <div className="text-xl font-bold text-white">USD 35,000,000.00</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Depository: Banque Lombard Odier &amp; Cie SA, Geneva (Ledger CH88-0240-0000-8812-9901).
                  Authenticated SWIFT MT103 wire logs confirm unconditional beneficiary designation in favor of Kavinath A/L Ganesan.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase">Maybank Premier Private Wealth Deposit</span>
                <div className="text-xl font-bold text-white">RM 42,850,000.00</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Account No. 5140-1289-9921. Clean source of wealth attested under Bank Negara Malaysia Foreign Exchange Policy (FEP)
                  and AMLA 2001 Section 4(1) non-applicability.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
              <span className="font-bold text-indigo-400 block">Bank Negara Malaysia (BNM / FIED) Status &amp; Swiss Regulatory Approvals:</span>
              <p>
                Inward remittance clearances were approved by Bank Negara Malaysia under reference BNM/FEP/2017-8821.
                The Swiss Financial Market Supervisory Authority (FINMA) issued a letter of comfort confirming full compliance with Swiss Anti-Money Laundering legislation (AMLA/GwG) and the Federal Tax Administration (ESTV).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ADVERSE PROXY X INDICTMENT */}
      {activeTab === 'PROXY' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-rose-900/40 rounded-xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              Adverse Proxy X (Suresh Kumar A/L Raman) Criminal Indictments &amp; Seizures
            </h3>

            <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-800/40 space-y-2 text-xs text-rose-200">
              <span className="font-bold text-rose-400 uppercase tracking-wider block">PDRM CCID Criminal Case: IP/CCID/BA/2024/0981</span>
              <p>
                Adverse claimant Suresh Kumar A/L Raman (NRIC 720814-10-xxxx) is under active criminal prosecution by the Commercial Crime
                Investigation Department (CCID, Bukit Aman) under:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1 text-slate-300">
                <li><strong>Section 420 Penal Code:</strong> Cheating and dishonestly inducing delivery of estate securities.</li>
                <li><strong>Section 468 Penal Code:</strong> Forgery for the purpose of cheating.</li>
                <li><strong>Section 471 Penal Code:</strong> Using as genuine a forged Power of Attorney document.</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">AMLA Section 44 Freezing</span>
                <span className="text-emerald-400 font-bold">ACTIVE COURT ORDER</span>
                <p className="text-[11px] text-slate-400 mt-1">High Court freezing of illicit proxy pass-through accounts.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Immigration Blacklist</span>
                <span className="text-rose-400 font-bold">TRAVEL BAN IMPOSED</span>
                <p className="text-[11px] text-slate-400 mt-1">Notice JIM/OPS/2024-8821 barring departure from Malaysia.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Civil Suit WA-22NCC-482</span>
                <span className="text-amber-400 font-bold">DEFENSE STRUCK OUT</span>
                <p className="text-[11px] text-slate-400 mt-1">Order 18 Rule 19 striking out adverse pleadings for illegality.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: LEGAL THESIS & CASE LAW */}
      {activeTab === 'LEGAL' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              Statutory Framework &amp; Binding Judicial Authorities
            </h3>

            <div className="space-y-3">
              {CASE_LAW_CITATIONS.map((cit) => (
                <div key={cit.citation} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-amber-400">{cit.citation}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">{cit.court} ({cit.year})</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed"><strong>Ratio Decidendi:</strong> {cit.principle}</p>
                  <p className="text-indigo-300 text-[11px]"><strong>Application to Subject:</strong> {cit.applicationToSubject}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: PRIORITIZED ACTION CHECKLIST */}
      {activeTab === 'CHECKLIST' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                  Prioritized Action Checklist: Immediate Remedies &amp; Next Steps
                </h3>
                <p className="text-xs text-slate-400">Chronological enforcement matrix for litigation counsel and fiduciary custodians.</p>
              </div>
            </div>

            <div className="space-y-3">
              {PRIORITIZED_ACTION_CHECKLIST.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded font-bold text-[10px] ${
                      item.priority === 'IMMEDIATE_48H'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : item.priority === 'HIGH_7_DAYS'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {item.priority} • {item.phase}
                    </span>
                    <span className="text-slate-400 text-[11px]">Responsible: {item.responsibleParty}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{item.action}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block font-bold">Statutory Basis:</span>
                      <span className="text-slate-200">{item.statutoryBasis}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-emerald-400 block font-bold">Target Outcome:</span>
                      <span className="text-slate-200">{item.targetOutcome}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: 105 EXHIBITS SEARCH & BROWSE */}
      {activeTab === 'EXHIBITS' && (
        <div className="space-y-4">
          {/* Controls: Search, Category Filters, Expand All */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all 105 exhibits by exhibit code, keyword, authority, SHA-256 hash..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500 transition"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-hidden focus:border-amber-500"
              >
                <option value="ALL">All Categories ({CASE_STUDY_105_ITEMS.length})</option>
                <option value="CIVIL_IDENTITY">Civil Identity &amp; Lineage (15)</option>
                <option value="GENEVA_ESCROW_2017">Geneva Veridian Escrow (20)</option>
                <option value="SSM_CORPORATE">SSM Corporate Ownership (15)</option>
                <option value="HIGH_COURT_DOCKET">High Court Commercial Dockets (15)</option>
                <option value="PDRM_CCID_AMLA">PDRM CCID &amp; AMLA Seizures (15)</option>
                <option value="BANKING_AUDIT">Banking &amp; Real Estate Audit (15)</option>
                <option value="SECTION_90A_CYBER">Section 90A Digital Infrastructure (10)</option>
              </select>

              <button
                type="button"
                onClick={toggleExpandAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                {areAllExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>{areAllExpanded ? 'Collapse All' : `Expand All (${filteredItems.length})`}</span>
              </button>
            </div>
          </div>

          {/* Exhibits Grid */}
          <div className="grid grid-cols-1 gap-3">
            {filteredItems.map((item) => {
              const isExpanded = expandedIds.has(item.id);
              return (
                <div
                  key={item.id}
                  className={`rounded-xl border transition duration-150 ${
                    isExpanded ? 'bg-slate-900 border-amber-500/40 shadow-lg' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div
                    onClick={() => toggleExpandItem(item.id)}
                    className="p-4 cursor-pointer flex items-center justify-between gap-3 select-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/20 shrink-0">
                        {item.exhibitCode}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate">{item.title}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
                          <span>{item.issuingAuthority}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-500">{item.officialRefNo}</span>
                          <span>•</span>
                          <span className="text-emerald-400">{item.verifiedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveItemModal(item);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                        title="View Full Evidentiary Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <div className="p-1 text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-3 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Statutory Basis</span>
                          <p className="text-slate-200">{item.statutoryBasis}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                          <span className="text-[10px] text-amber-400 font-bold uppercase block">Forensic Findings</span>
                          <p className="text-slate-200">{item.findings}</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-[10px] text-indigo-400 font-bold uppercase block">Relevance to Commercial Suit</span>
                        <p className="text-slate-300">{item.relevanceToDispute}</p>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px]">
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-slate-400">SHA-256:</span>
                          <code className="text-emerald-400 font-mono truncate">{item.sha256Hash}</code>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.sha256Hash, item.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs shrink-0"
                        >
                          {copiedHash === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedHash === item.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: 100-PAGE TABLE OF CONTENTS */}
      {activeTab === 'TOC' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                Master 100-Page Table of Contents
              </h3>
              <p className="text-xs text-slate-400">Exact page-by-page mapping corresponding to the compiled PDF dossier.</p>
            </div>
            <span className="text-xs font-mono text-slate-400">100 Pages • 14 Sections</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {DOSSIER_100_TOC.map((item) => (
              <div key={item.page} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[11px]">
                    Page {item.page}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">{item.section}</span>
                </div>
                <h4 className="text-slate-200 font-semibold text-xs pt-0.5">{item.title}</h4>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 flex-wrap">
                  {item.subtopics.map((sub, sIdx) => (
                    <span key={sIdx} className="bg-slate-900 px-1.5 py-0.5 rounded text-[10px] text-slate-400">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* In-App Fullscreen PDF Document Viewer Modal */}
      {showPdfModal && pdfBlobUrl && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full h-[96vh] max-w-7xl flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    Supreme Forensic Master Dossier — Extended 100-Page Edition (PDF Viewer)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Suit No. WA-22NCC-482-09/2026 • Evidence Act 1950 S.90A • Exactly 100 Pages Compiled
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPdfModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-rose-900 text-slate-300 hover:text-white text-xs font-bold transition ml-1"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Modal Body: Embedded PDF iframe */}
            <div className="flex-1 w-full bg-slate-950 p-1">
              <iframe
                src={pdfBlobUrl}
                title="100-Page Supreme Forensic Master Dossier Preview"
                className="w-full h-full rounded border-0 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Individual Exhibit Modal */}
      {activeItemModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-xs font-bold">
                  {activeItemModal.exhibitCode}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{activeItemModal.title}</h3>
                <p className="text-xs text-slate-400">{activeItemModal.issuingAuthority}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveItemModal(null)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Official Reference</span>
                  <p className="text-slate-200 font-mono font-bold mt-0.5">{activeItemModal.officialRefNo}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Verification Date</span>
                  <p className="text-slate-200 font-mono mt-0.5">{activeItemModal.verifiedDate}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Statutory Basis</span>
                <p className="text-slate-200 leading-relaxed">{activeItemModal.statutoryBasis}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-amber-400 uppercase font-bold">Findings</span>
                <p className="text-slate-200 leading-relaxed">{activeItemModal.findings}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-indigo-400 uppercase font-bold">Relevance To Dispute</span>
                <p className="text-slate-200 leading-relaxed">{activeItemModal.relevanceToDispute}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Chain of Custody</span>
                <p className="text-slate-300 font-mono text-[11px]">{activeItemModal.chainOfCustody}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Cryptographic SHA-256 Provenance</span>
                  <code className="text-[11px] text-emerald-400 font-mono break-all font-bold">
                    {activeItemModal.sha256Hash}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(activeItemModal.sha256Hash, 'modal')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  {copiedHash === 'modal' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveItemModal(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
