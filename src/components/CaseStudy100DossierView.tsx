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
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Hash,
  Sparkles,
  Layers,
  Database,
  ArrowDownToLine,
  Eye,
  FileCheck2,
  RefreshCw,
} from 'lucide-react';
import { CASE_STUDY_105_ITEMS, type CaseStudyItem } from '../shared/caseStudy100Dataset';
import { compile100CaseStudyPdf, type CaseStudyPdfProgress } from '../utils/caseStudy100PdfCompiler';

export const CaseStudy100DossierView: React.FC = () => {
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

  // Filtered Exhibits
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

  // Generate PDF and return Blob
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
    setPdfProgress({ step: 'Preparing 100+ PDF Document...', percent: 5 });

    try {
      const blob = await generatePdfBlob();
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);

      const link = document.createElement('a');
      link.href = url;
      link.download = `CASE_STUDY_100_FORENSIC_MASTER_DOSSIER_KAVINATH_GANESAN_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      setPdfError(err?.message || 'Failed to compile 100+ PDF Case Study.');
    } finally {
      setIsGeneratingPdf(false);
      setPdfProgress(null);
    }
  };

  // Trigger In-App PDF Preview Modal
  const handleOpenPdfPreview = async () => {
    if (pdfBlobUrl) {
      setShowPdfModal(true);
      return;
    }
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    setPdfProgress({ step: 'Compiling PDF for In-App Viewer...', percent: 5 });

    try {
      const blob = await generatePdfBlob();
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
      setShowPdfModal(true);
    } catch (err: any) {
      setPdfError(err?.message || 'Failed to generate PDF for in-app preview.');
    } finally {
      setIsGeneratingPdf(false);
      setPdfProgress(null);
    }
  };

  // Export JSON Dataset
  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(CASE_STUDY_105_ITEMS, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute(
      'download',
      `CASE_STUDY_105_VERIFIED_EXHIBITS_MANIFEST_${new Date().toISOString().split('T')[0]}.json`
    );
    dlAnchorElem.click();
  };

  // Browser Print
  const handlePrint = () => {
    window.print();
  };

  const categories = [
    { id: 'ALL', label: `All Exhibits (${CASE_STUDY_105_ITEMS.length})` },
    { id: 'CIVIL_IDENTITY', label: 'Civil Identity & Birth (10)' },
    { id: 'GENEVA_VERIDIAN_SETTLEMENT', label: '2017 Geneva Settlement (10)' },
    { id: 'CORPORATE_SSM_REBUTTAL', label: 'Corporate & SSM (7)' },
    { id: 'HIGH_COURT_LITIGATION', label: 'High Court Suit (5)' },
    { id: 'PDRM_CCID_AMLA', label: 'PDRM CCID & AMLA (6)' },
    { id: 'SECTION_90A_CYBER_FORENSICS', label: 'Section 90A Evidence (7)' },
    { id: 'BANKING_REAL_ESTATE_ASSETS', label: 'Banking & Assets (60)' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Formal Sovereign Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mt-1">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  100+ Section Master Forensic Case Study &amp; Evidentiary Dossier
                </h1>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  105 Verified Exhibits
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Evidence Act 1950 S.90A Admissible
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-4xl leading-relaxed">
                Exhaustive forensic investigation and legal thesis on the 2017 Geneva Veridian Settlement (USD 35,000,000.00 Escrow),
                paternal biological consanguinity, SSM corporate ownership, and complete rebuttals of adverse nominee Suresh Kumar
                under High Court Malaya Commercial Suit WA-22NCC-482-09/2026.
              </p>
            </div>
          </div>

          {/* Action buttons: Download PDF, Preview PDF, Print, Export JSON */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleOpenPdfPreview}
              disabled={isGeneratingPdf}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
              title="Preview the 100+ case study PDF right in the app"
            >
              <Eye className="w-4 h-4" />
              <span>View PDF In-App</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isGeneratingPdf ? 'Compiling PDF...' : 'Download 100+ PDF Case Study'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              title="Open browser print dialog with styled printable layout"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              title="Download full JSON evidentiary manifest"
            >
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
          </div>
        </div>

        {/* PDF Compilation Error Banner */}
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

        {/* PDF Progress Bar if generating */}
        {isGeneratingPdf && pdfProgress && (
          <div className="mt-4 p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 space-y-1.5 animate-pulse">
            <div className="flex items-center justify-between text-xs text-amber-300">
              <span className="font-medium">{pdfProgress.step}</span>
              <span className="font-mono font-bold">{pdfProgress.percent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${pdfProgress.percent}%` }}
              />
            </div>
          </div>
        )}

        {/* Four Key Evidentiary Highlights Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/90">
            <div className="text-[11px] text-slate-400">Total Case Study Records</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">105 Exhibits</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">100% Verified &amp; Sealed</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/90">
            <div className="text-[11px] text-slate-400">Geneva Escrow Wire</div>
            <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">USD 35,000,000.00</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Lombard Odier MT103</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/90">
            <div className="text-[11px] text-slate-400">Judicial Forum</div>
            <div className="text-lg font-bold text-indigo-400 font-mono mt-0.5 truncate">WA-22NCC-482-09</div>
            <div className="text-[10px] text-slate-400 mt-0.5">High Court Malaya</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/90">
            <div className="text-[11px] text-slate-400">Digital Admissibility</div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">Act 56 S.90A</div>
            <div className="text-[10px] text-slate-400 mt-0.5">DSA 1997 SHA-256</div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Categories, and Expand All */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 105 exhibits by keyword, statute, exhibit code, authority, or SHA-256 hash..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 outline-none focus:border-amber-500 font-mono"
            />
          </div>

          {/* Expand All / Collapse All button */}
          <button
            type="button"
            onClick={toggleExpandAll}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            {areAllExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
                <span>Collapse All ({filteredItems.length})</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
                <span>Expand All ({filteredItems.length})</span>
              </>
            )}
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-md whitespace-nowrap text-xs font-medium transition ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 105 Exhibits List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Showing <strong className="text-white">{filteredItems.length}</strong> of{' '}
            <strong className="text-white">{CASE_STUDY_105_ITEMS.length}</strong> verified evidentiary records
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            Click any exhibit card to inspect full statutory details
          </span>
        </div>

        {filteredItems.map((item) => {
          const isExpanded = expandedIds.has(item.id);

          return (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800/90 rounded-xl overflow-hidden shadow-sm transition hover:border-slate-700"
            >
              {/* Exhibit Header */}
              <div
                onClick={() => toggleExpandItem(item.id)}
                className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none bg-slate-900 hover:bg-slate-800/40 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-amber-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {item.exhibitCode}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {item.categoryLabel}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {item.evidentiaryClassification}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white mt-1">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Authority: <span className="text-slate-300">{item.issuingAuthority}</span> • Ref: {item.officialRefNo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:self-center">
                  <div className="text-right hidden md:block">
                    <div className="text-[11px] font-mono text-slate-400">{item.issuanceDate}</div>
                    <div className="text-[10px] text-emerald-400 font-medium">VERIFIED &amp; TAMPER-EVIDENT</div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveItemModal(item);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="View full judicial provenance"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Content View */}
              {isExpanded && (
                <div className="p-4 bg-slate-950 border-t border-slate-800/80 text-xs space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Statutory Admissibility Rule
                      </span>
                      <p className="text-slate-200 font-mono text-[11px]">{item.statutoryBasis}</p>
                      <div className="text-[10px] text-slate-400 pt-1">
                        Court Docket: <strong className="text-slate-200">{item.courtDocket}</strong>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Jurisdiction &amp; Registry
                      </span>
                      <p className="text-slate-200 text-[11px]">{item.jurisdiction}</p>
                      <div className="text-[10px] text-slate-400 pt-1">
                        Chain of Custody: <span className="text-slate-300 font-mono">{item.chainOfCustody}</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Findings & Dispute Relevance */}
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 space-y-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                        Verified Forensic Finding:
                      </span>
                      <p className="text-slate-300 leading-relaxed">{item.findings}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-0.5">
                        Relevance to Dispute:
                      </span>
                      <p className="text-slate-300 leading-relaxed">{item.relevanceToDispute}</p>
                    </div>
                  </div>

                  {/* Cryptographic SHA-256 Hash Bar */}
                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Hash className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[11px] font-mono text-slate-400">SHA-256 Hash:</span>
                      <code className="text-[11px] font-mono text-emerald-400 font-bold break-all">
                        {item.sha256Hash}
                      </code>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(item.sha256Hash, item.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
                    >
                      {copiedHash === item.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedHash === item.id ? 'Copied' : 'Copy Hash'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-xl p-10 text-center space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-500" />
            <h4 className="text-sm font-semibold text-slate-300">No exhibits matched your search query</h4>
            <p className="text-xs text-slate-500">
              Try clearing your search terms or selecting a different category.
            </p>
          </div>
        )}
      </div>

      {/* Item Inspection Modal */}
      {activeItemModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-amber-400">
                  {activeItemModal.exhibitCode}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{activeItemModal.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveItemModal(null)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Official Authority &amp; Reference</span>
                <p className="text-white font-medium">{activeItemModal.issuingAuthority}</p>
                <p className="text-slate-400 font-mono text-[11px]">
                  Ref No: {activeItemModal.officialRefNo} • Issuance: {activeItemModal.issuanceDate}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Statutory Classification</span>
                <p className="text-emerald-400 font-mono font-bold">{activeItemModal.statutoryBasis}</p>
                <p className="text-slate-300">Court Docket: {activeItemModal.courtDocket}</p>
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

      {/* In-App PDF Document Viewer Modal */}
      {showPdfModal && pdfBlobUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full h-[94vh] max-w-6xl flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    100+ Section Master Forensic PDF Case Study &amp; Dossier
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Suit No. WA-22NCC-482-09/2026 • Evidence Act 1950 S.90A Admissible • 105 Exhibits
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
                  <span>Download</span>
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

            {/* Modal Body with Embedded PDF */}
            <div className="flex-1 w-full bg-slate-950 p-1">
              <iframe
                src={pdfBlobUrl}
                title="100+ Master PDF Case Study Dossier Preview"
                className="w-full h-full rounded border-0 bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
