import { useState, useEffect } from 'react';
import {
  FileText,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  FileCheck,
  Scale,
  Building2,
  Globe,
  Landmark,
  UserCheck,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Hash,
  Copy,
  Check,
  Eye,
  Calendar,
  Layers,
  Newspaper,
  Dna,
  Gavel,
  BookOpen,
  Sparkles,
  Award,
  FileDown,
  Lock,
} from 'lucide-react';
import type {
  PowerOfAttorneyRecord,
  MasterDossierExportData,
  CompleteForensicThesisDossier,
} from '../shared/types';
import { PdfCompilerPanel } from './PdfCompilerModalOrPanel';
import { ThesisChaptersView } from './ThesisChaptersView';
import { EvidentiaryCatalogView } from './EvidentiaryCatalogView';
import { BindingThesesView } from './BindingThesesView';

type DossierTab =
  | 'pdf_compiler'
  | 'thesis_chapters'
  | 'evidentiary_catalog'
  | 'binding_theses'
  | 'poa_discovery'
  | 'master_dossier'
  | 'media_catalog'
  | 'markdown_preview';

export function PowerOfAttorneyAndMasterDossierView() {
  const [poaList, setPoaList] = useState<PowerOfAttorneyRecord[]>([]);
  const [discoverySummary, setDiscoverySummary] = useState<{
    subject: {
      fullName: string;
      nric: string;
      status: string;
      statutoryFiduciaryStatus: string;
    };
    metrics: {
      totalDiscovered: number;
      kavinathHeldValidCount: number;
      adverseFraudulentCount: number;
      highCourtDepositedCount: number;
      offshoreMandatesCount: number;
    };
    statutorySummary: string;
  } | null>(null);

  const [masterDossier, setMasterDossier] = useState<MasterDossierExportData | null>(null);
  const [thesisData, setThesisData] = useState<CompleteForensicThesisDossier | null>(null);
  const [isLoadingPoa, setIsLoadingPoa] = useState(false);
  const [isLoadingMaster, setIsLoadingMaster] = useState(false);
  const [isLoadingThesis, setIsLoadingThesis] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<DossierTab>('pdf_compiler');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [expandedPoaId, setExpandedPoaId] = useState<string | null>('PA-001');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch POA Discovery data
  const fetchPoaData = async () => {
    setIsLoadingPoa(true);
    try {
      const res = await fetch('/api/power-of-attorney/discover');
      const json = await res.json();
      if (json.success && json.data) {
        setDiscoverySummary(json.data);
        setPoaList(json.data.records);
      }
    } catch (err) {
      console.warn('Failed to discover Power of Attorney records:', err);
    } finally {
      setIsLoadingPoa(false);
    }
  };

  // 2. Fetch Master Dossier export data
  const fetchMasterDossier = async () => {
    setIsLoadingMaster(true);
    try {
      const res = await fetch('/api/dossier/master-export');
      const json = await res.json();
      if (json.success && json.data) {
        setMasterDossier(json.data);
      }
    } catch (err) {
      console.warn('Failed to load master dossier export:', err);
    } finally {
      setIsLoadingMaster(false);
    }
  };

  // 3. Fetch Complete Forensic Thesis data
  const fetchThesisData = async () => {
    setIsLoadingThesis(true);
    try {
      const res = await fetch('/api/thesis/complete');
      const json = await res.json();
      if (json.success && json.data) {
        setThesisData(json.data);
      }
    } catch (err) {
      console.warn('Failed to load complete thesis:', err);
    } finally {
      setIsLoadingThesis(false);
    }
  };

  // 4. Fetch Markdown export
  const fetchMarkdownPreview = async () => {
    try {
      const res = await fetch('/api/thesis/markdown');
      const text = await res.text();
      setMarkdownContent(text);
    } catch (err) {
      console.warn('Failed to load markdown brief:', err);
    }
  };

  useEffect(() => {
    fetchPoaData();
    fetchMasterDossier();
    fetchThesisData();
    fetchMarkdownPreview();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filteredPoa = poaList.filter((p) => {
    const matchesCat =
      filterCategory === 'ALL' ||
      (filterCategory === 'VALID_HELD' && p.isHeldByKavinath && p.legalValidityStatus.includes('VALID')) ||
      (filterCategory === 'HIGH_COURT' && p.depositRegistry.includes('High Court of Malaya')) ||
      (filterCategory === 'OFFSHORE' &&
        (p.category === 'OFFSHORE_TRUST_MANDATE' ||
          p.depositRegistry.includes('Geneva') ||
          p.depositRegistry.includes('Cayman'))) ||
      (filterCategory === 'FRAUD' && p.legalValidityStatus === 'VOID_AB_INITIO_FORGED');

    const matchesSearch =
      searchQuery === '' ||
      p.instrumentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.statutoryFramework.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6" id="poa-and-master-dossier-view">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <BookOpen className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Act 424 Discovery &amp; Supreme Thesis Compendium
                </span>
                <span className="text-xs text-slate-400">
                  Evidence Act 1950 &bull; Powers of Attorney Act 1949 &bull; Complete A-Z Master Thesis
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white mt-1">
                Forensic Thesis Dossier &amp; Power of Attorney Discovery
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Comprehensive judicial thesis dossier upon subject{' '}
                <strong className="text-amber-300">KAVINATH A/L GANESAN (NRIC: 960906-08-5839)</strong>{' '}
                asserting all 12 forensic chapters, 14 evidentiary documents, 5 binding legal theses,
                High Court Powers of Attorney, media publications, court dockets, and apex judgments.
              </p>
            </div>
          </div>

          {/* Quick Action Export Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveSubTab('pdf_compiler')}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-600 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5"
            >
              <FileDown className="w-4 h-4 text-slate-950" />
              PDF Thesis Compiler (A-Z)
            </button>

            <a
              href="/api/thesis/markdown"
              download="SUPREME-FORENSIC-THESIS-DOSSIER-KAVINATH-GANESAN.md"
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold shadow transition"
              title="Download formatted Markdown Thesis"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              Thesis (.md)
            </a>

            <a
              href="/api/dossier/master-export"
              download="master-forensic-dossier-kavinath-all-data.json"
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold shadow transition"
              title="Download full JSON Master Dossier"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              JSON Data
            </a>

            <a
              href="/api/dossier/master-export/csv"
              download="master-forensic-dossier-kavinath-data-matrix.csv"
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold shadow transition"
              title="Download comprehensive CSV data matrix"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              CSV Matrix
            </a>
          </div>
        </div>

        {/* Discovery Summary KPI Bar */}
        {discoverySummary && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-800 text-center">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Total PA Discovered</div>
              <div className="text-xl font-black text-amber-400 mt-0.5">
                {discoverySummary.metrics.totalDiscovered} Instruments
              </div>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Kavinath Held (Valid)</div>
              <div className="text-xl font-black text-emerald-400 mt-0.5">
                {discoverySummary.metrics.kavinathHeldValidCount} Active
              </div>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <div className="text-[10px] font-bold text-slate-400 uppercase">High Court Act 424</div>
              <div className="text-xl font-black text-blue-400 mt-0.5">
                {discoverySummary.metrics.highCourtDepositedCount} Deposited
              </div>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Evidentiary Exhibits</div>
              <div className="text-xl font-black text-purple-400 mt-0.5">
                {thesisData?.additionalEvidences.length || 14} Certified
              </div>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Fraudulent Voided</div>
              <div className="text-xl font-black text-rose-400 mt-0.5">
                {discoverySummary.metrics.adverseFraudulentCount} Impounded
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 overflow-x-auto gap-3">
        <div className="flex space-x-1.5 shrink-0">
          <button
            onClick={() => setActiveSubTab('pdf_compiler')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeSubTab === 'pdf_compiler'
                ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400 font-extrabold'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Main PDF Compiler (A-Z Thesis)
          </button>

          <button
            onClick={() => setActiveSubTab('thesis_chapters')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeSubTab === 'thesis_chapters'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            12 Thesis Chapters ({thesisData?.chapters.length || 12})
          </button>

          <button
            onClick={() => setActiveSubTab('evidentiary_catalog')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeSubTab === 'evidentiary_catalog'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            Evidentiary Catalog ({thesisData?.additionalEvidences.length || 14})
          </button>

          <button
            onClick={() => setActiveSubTab('binding_theses')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeSubTab === 'binding_theses'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            5 Binding Theses
          </button>

          <button
            onClick={() => setActiveSubTab('poa_discovery')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeSubTab === 'poa_discovery'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Gavel className="w-3.5 h-3.5" />
            POA Registry ({poaList.length})
          </button>

          <button
            onClick={() => setActiveSubTab('master_dossier')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeSubTab === 'master_dossier'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Master Dossier Synthesis
          </button>

          <button
            onClick={() => setActiveSubTab('media_catalog')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeSubTab === 'media_catalog'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            Media ({masterDossier?.mediaPublications.length || 0})
          </button>

          <button
            onClick={() => setActiveSubTab('markdown_preview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeSubTab === 'markdown_preview'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Markdown Brief
          </button>
        </div>

        <button
          onClick={() => {
            fetchPoaData();
            fetchMasterDossier();
            fetchThesisData();
            fetchMarkdownPreview();
          }}
          className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${
              isLoadingPoa || isLoadingMaster || isLoadingThesis ? 'animate-spin' : ''
            }`}
          />
          Refresh
        </button>
      </div>

      {/* VIEW: MAIN PDF COMPILER */}
      {activeSubTab === 'pdf_compiler' && (
        <PdfCompilerPanel thesis={thesisData} onRefreshThesis={fetchThesisData} />
      )}

      {/* VIEW: 12 THESIS CHAPTERS A-Z */}
      {activeSubTab === 'thesis_chapters' && (
        <ThesisChaptersView chapters={thesisData?.chapters || []} />
      )}

      {/* VIEW: EVIDENTIARY CATALOG */}
      {activeSubTab === 'evidentiary_catalog' && (
        <EvidentiaryCatalogView documents={thesisData?.additionalEvidences || []} />
      )}

      {/* VIEW: 5 BINDING THESES */}
      {activeSubTab === 'binding_theses' && (
        <BindingThesesView theses={thesisData?.bindingLegalTheses || []} />
      )}

      {/* VIEW: POWER OF ATTORNEY DISCOVERY */}
      {activeSubTab === 'poa_discovery' && (
        <div className="space-y-6">
          {/* Statutory Insight Callout */}
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3">
            <Gavel className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-amber-950">
              <strong className="text-amber-900 font-bold">
                Powers of Attorney Act 1949 (Act 424) Statutory Audit:
              </strong>{' '}
              {discoverySummary?.statutorySummary ||
                'Under Act 424, Kavinath A/L Ganesan holds absolute, irrevocable general power of attorney deposited in the High Court of Malaya under Sections 4 and 6, coupled with Swiss and Cayman offshore enforcer mandates.'}
            </div>
          </div>

          {/* Filtering & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
              <span className="text-slate-400 font-bold mr-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {[
                { key: 'ALL', label: 'All Instruments' },
                { key: 'VALID_HELD', label: 'Valid Kavinath Held' },
                { key: 'HIGH_COURT', label: 'High Court Act 424' },
                { key: 'OFFSHORE', label: 'Offshore Mandates' },
                { key: 'FRAUD', label: 'Fraudulent Voided' },
              ].map((pill) => (
                <button
                  key={pill.key}
                  onClick={() => setFilterCategory(pill.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    filterCategory === pill.key
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search PA registration, title, donor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
              />
            </div>
          </div>

          {/* Records List */}
          <div className="space-y-4">
            {filteredPoa.map((pa) => {
              const isExpanded = expandedPoaId === pa.id;
              const isValid = pa.legalValidityStatus.includes('VALID');
              const isForged = pa.legalValidityStatus === 'VOID_AB_INITIO_FORGED';

              return (
                <div
                  key={pa.id}
                  className={`bg-white rounded-xl border transition shadow-sm ${
                    isForged
                      ? 'border-rose-200 bg-rose-50/20'
                      : isValid
                      ? 'border-emerald-200 hover:border-emerald-300'
                      : 'border-slate-200'
                  }`}
                >
                  <div
                    className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
                    onClick={() => setExpandedPoaId(isExpanded ? null : pa.id)}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isForged
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : isValid
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {isForged ? (
                          <ShieldAlert className="w-5 h-5" />
                        ) : isValid ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Scale className="w-5 h-5" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {pa.id}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-800">
                            {pa.registrationNumber}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                              isForged
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : isValid
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                            }`}
                          >
                            {pa.legalValidityStatus.replace(/_/g, ' ')}
                          </span>
                          {pa.isHeldByKavinath && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1">
                              <UserCheck className="w-3 h-3" /> Held by Subject Kavinath
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-slate-900 text-base leading-snug">
                          {pa.instrumentTitle}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-0.5">
                          <span className="flex items-center gap-1">
                            <Landmark className="w-3.5 h-3.5 text-slate-400" />
                            {pa.depositRegistry}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            Execution: {pa.dateOfExecution}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          Classification
                        </div>
                        <div className="text-xs font-semibold text-slate-700">
                          {pa.category.replace(/_/g, ' ')}
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Instrument Details */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div>
                          <div className="text-[11px] font-bold text-slate-500 uppercase">
                            Donor (Principal Grantor)
                          </div>
                          <div className="font-bold text-slate-900 text-sm mt-0.5">{pa.donor.name}</div>
                          <div className="text-slate-600 font-mono text-[11px]">
                            NRIC/ID: {pa.donor.nricOrId} &bull; Capacity: {pa.donor.capacity}
                          </div>
                        </div>

                        <div>
                          <div className="text-[11px] font-bold text-slate-500 uppercase">
                            Donee (Attorney-in-Fact)
                          </div>
                          <div className="font-bold text-slate-900 text-sm mt-0.5">{pa.donee.name}</div>
                          <div className="text-slate-600 font-mono text-[11px]">
                            NRIC/ID: {pa.donee.nricOrId} &bull; Capacity: {pa.donee.capacity}
                          </div>
                        </div>
                      </div>

                      {/* Scope of Authority */}
                      <div>
                        <div className="font-bold text-slate-800 text-xs mb-1">
                          Conferred Scope of Authority &amp; Fiduciary Powers:
                        </div>
                        <ul className="space-y-1 text-slate-700 pl-4 list-disc">
                          {pa.scopeOfAuthority.map((scope, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {scope}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Statutory Anchor */}
                      <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-blue-950">
                        <strong className="text-blue-900 font-bold">
                          Statutory Enforceability &amp; Framework:
                        </strong>{' '}
                        {pa.statutoryFramework}
                      </div>

                      {/* Adverse Counterparts Note */}
                      <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-amber-950">
                        <strong className="text-amber-900 font-bold">
                          Forensic Impact on Adverse Claims:
                        </strong>{' '}
                        {pa.adverseCounterpartsNote}
                      </div>

                      {/* SHA-256 Hash & Attestation Seal */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-200 text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                          <Hash className="w-3.5 h-3.5 text-slate-400" />
                          <span>SHA-256: {pa.sha256CertificateHash}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(pa.sha256CertificateHash, pa.id);
                            }}
                            className="p-1 hover:bg-slate-200 rounded text-slate-600 transition"
                            title="Copy Hash"
                          >
                            {copiedHash === pa.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        <div className="text-slate-500 italic">
                          Attesting Officer: {pa.attestingAdvocateOrRegistrar}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: MASTER DOSSIER SYNTHESIS */}
      {activeSubTab === 'master_dossier' && masterDossier && (
        <div className="space-y-6">
          {/* Executive Overview Header */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Ref: {masterDossier.metadata.dossierReference}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Comprehensive Master Dossier: All Findings, Traces &amp; Legal Theses
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cryptographically sealed on {masterDossier.metadata.generatedAt} by{' '}
                  {masterDossier.metadata.signedByOfficer}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
                  {masterDossier.metadata.classification}
                </span>
              </div>
            </div>

            {/* Core Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Tracked Entities</div>
                <div className="text-lg font-black text-slate-900 mt-0.5">
                  {masterDossier.summaryStatistics.totalEntitiesTracked} Corporate &amp; Estate
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Court Dockets</div>
                <div className="text-lg font-black text-blue-700 mt-0.5">
                  {masterDossier.summaryStatistics.totalCourtDockets} High Court &amp; Apex
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">DNA Paternity Probability</div>
                <div className="text-lg font-black text-emerald-700 mt-0.5">
                  {masterDossier.summaryStatistics.dnaPaternityProbability}%
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Offshore Liquid Reserves</div>
                <div className="text-lg font-black text-amber-700 mt-0.5">
                  USD ${masterDossier.summaryStatistics.unencumberedOffshoreUSD.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Chronological Milestones Flow */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              Chronological Audit Trail (From Initial Dispute to Apex Verdicts)
            </h3>

            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {masterDossier.chronologicalMilestones.map((m, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white border-2 border-amber-500 group-hover:bg-amber-500 transition" />
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 hover:bg-amber-50/30 transition">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-amber-700">{m.date}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        {m.phase.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-sm">{m.title}</div>
                    <div className="text-xs text-slate-600 leading-relaxed">{m.description}</div>
                    <div className="text-xs text-slate-500 font-medium pt-1 flex items-center justify-between border-t border-slate-200/60 mt-2">
                      <span>Agency / Forum: {m.forumOrAgency}</span>
                      <span className="text-emerald-700 font-semibold">{m.verdictOrImpact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: MEDIA CATALOG */}
      {activeSubTab === 'media_catalog' && masterDossier && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-purple-600" />
              Media Publications, Press Coverage &amp; Investigative Exposés
            </h3>
            <span className="text-xs font-mono bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-200 font-bold">
              {masterDossier.mediaPublications.length} Press Articles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {masterDossier.mediaPublications.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                      {item.outlet}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">{item.outletTier}</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">{item.publishedDate}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.headline}</h3>

                <p className="text-xs text-slate-600 leading-relaxed">{item.synopsis}</p>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px]">
                  <div className="text-slate-700">
                    <strong className="text-slate-500">Investigative Angle:</strong> {item.investigativeAngle}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.keyTriggersReferenced.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: MARKDOWN LEGAL BRIEF PREVIEW */}
      {activeSubTab === 'markdown_preview' && (
        <div className="bg-slate-900 text-slate-200 rounded-xl p-6 shadow-inner font-mono text-xs overflow-x-auto space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-amber-400 font-bold flex items-center gap-2">
              <FileText className="w-4 h-4" /> SUPREME-FORENSIC-THESIS-DOSSIER-KAVINATH-GANESAN.md
            </span>
            <button
              onClick={() => handleCopy(markdownContent, 'md-full')}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1.5 border border-slate-700 transition"
            >
              {copiedHash === 'md-full' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copiedHash === 'md-full' ? 'Copied' : 'Copy All'}
            </button>
          </div>
          <pre className="whitespace-pre-wrap leading-relaxed text-slate-300 font-mono text-xs">
            {markdownContent || 'Loading markdown thesis legal brief...'}
          </pre>
        </div>
      )}
    </div>
  );
}
