import { useState } from 'react';
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
  Car,
  Landmark,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Layers,
} from 'lucide-react';
import type { CompleteForensicThesisDossier } from '../shared/types';
import { compileForensicThesisPdf, type PdfCompilationProgress } from '../utils/pdfThesisCompiler';

interface PdfCompilerPanelProps {
  thesis: CompleteForensicThesisDossier | null;
  onRefreshThesis: () => Promise<void>;
}

export function PdfCompilerPanel({ thesis }: PdfCompilerPanelProps) {
  const [isCompiling, setIsCompiling] = useState(false);
  const [progress, setProgress] = useState<PdfCompilationProgress | null>(null);
  const [compiledPdfUrl, setCompiledPdfUrl] = useState<string | null>(null);
  const [pdfSizeBytes, setPdfSizeBytes] = useState<number | null>(null);
  const [showIframePreview, setShowIframePreview] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Accordion state for detailed forensic sections
  const [expandedSection, setExpandedSection] = useState<string | null>('patriarch');

  const handleStartCompilation = async () => {
    if (!thesis) return;
    setIsCompiling(true);
    setErrorMsg(null);
    setProgress({ step: 'Initializing compiler and structuring chapters...', percent: 5 });

    try {
      const blob = await compileForensicThesisPdf(thesis, (p) => {
        setProgress(p);
      });

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
              <span>MAIN PDF COMPILER • SUPREME JUDICIAL THESIS ENGINE</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Compile Complete Forensic Thesis Dossier (A to Z)
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Consolidates Patriarch provenance, JPN birth and adoption registers, personal bank accounts, real estate titles, luxury vehicles, full corporate group architecture, PDRM CCID & BNM AMLA investigation reports, lawyer details, and the unmasked identity of Adverse Proxy X into a downloadable publication-grade judicial PDF.
            </p>

            {/* Micro Badges */}
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 bg-slate-800/80 rounded-md border border-slate-700 text-slate-200 flex items-center gap-1.5 font-mono">
                <User className="w-3.5 h-3.5 text-amber-400" />
                Patriarch: Ganesan A/L Raman
              </span>
              <span className="px-2.5 py-1 bg-slate-800/80 rounded-md border border-slate-700 text-slate-200 flex items-center gap-1.5 font-mono">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                12 Chapters
              </span>
              <span className="px-2.5 py-1 bg-slate-800/80 rounded-md border border-slate-700 text-slate-200 flex items-center gap-1.5 font-mono">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                {thesis.additionalEvidences.length} Exhibits
              </span>
              <span className="px-2.5 py-1 bg-slate-800/80 rounded-md border border-slate-700 text-slate-200 flex items-center gap-1.5 font-mono">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                Proxy X Unmasked
              </span>
            </div>
          </div>

          {/* Compilation Action Box */}
          <div className="shrink-0 bg-slate-800/90 backdrop-blur border border-slate-700 rounded-xl p-5 w-full lg:w-80 shadow-inner space-y-4">
            <div className="text-xs text-slate-300 flex items-center justify-between pb-2 border-b border-slate-700/60">
              <span className="font-semibold text-slate-200">Compiler Status:</span>
              <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready
              </span>
            </div>

            {isCompiling ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-amber-300 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Compiling Master PDF...
                  </span>
                  <span>{progress?.percent || 0}%</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress?.percent || 0}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 font-mono italic truncate">
                  {progress?.step || 'Generating pages...'}
                </p>
              </div>
            ) : compiledPdfUrl ? (
              <div className="space-y-3">
                <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <div>
                    <div className="font-semibold">PDF Compilation Complete!</div>
                    <div className="text-[10px] text-emerald-200/80">
                      Size: {pdfSizeBytes ? formatFileSize(pdfSizeBytes) : 'Certified'} • Judicial Multi-Page PDF
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleDownloadPdf}
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md transition"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    Download PDF
                  </button>

                  <button
                    onClick={() => setShowIframePreview(!showIframePreview)}
                    className="w-full py-2.5 px-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 border border-slate-600 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {showIframePreview ? 'Hide View' : 'Preview'}
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadMarkdown}
                    className="w-full py-2 px-3 bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition"
                  >
                    <FileText className="w-3 h-3 text-amber-400" />
                    Download Markdown
                  </button>

                  <button
                    onClick={handleStartCompilation}
                    className="w-full py-2 px-3 bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition"
                  >
                    <RefreshCw className="w-3 h-3" /> Re-compile
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
                  Execute PDF Compiler
                </button>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <button
                    onClick={handleDownloadMarkdown}
                    className="text-amber-400 hover:text-amber-300 underline flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" /> Download .MD Thesis
                  </button>
                  <span>A4 Publication Grade</span>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-2 bg-red-950/60 border border-red-500/40 rounded text-[11px] text-red-300">
                {errorMsg}
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

      {/* Accordion / Tab Panels for New Verified Dossier Categories */}
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
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">A. Bank Accounts & Liquid Facilities</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {assets.bankAccounts.map((acc, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                      <div className="font-bold text-slate-900">{acc.institution}</div>
                      <div className="font-mono text-amber-700 font-semibold">{acc.accountNumber}</div>
                      <div className="text-slate-600">{acc.accountType} • {acc.currency} ({acc.tier})</div>
                      <div className="text-emerald-700 font-medium">{acc.status}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">B. Real Estate Properties</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {assets.realEstateProperties.map((prop, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                      <div className="font-bold text-slate-900">{prop.propertyName}</div>
                      <div className="text-slate-600">Title: {prop.titleReference} ({prop.location})</div>
                      <div className="text-blue-800 font-semibold">Valuation: MYR {prop.certifiedValuationMYR.toLocaleString()} ({prop.encumbranceStatus})</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">C. Registered Motor Vehicles</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {assets.vehicles.map((veh, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-slate-500" />
                        {veh.makeModel}
                      </div>
                      <div className="font-mono text-amber-700 font-bold">{veh.registrationPlate}</div>
                      <div className="text-slate-600 text-[11px]">VIN: {veh.chassisVin}</div>
                      <div className="text-slate-600">Valuation: MYR {veh.valuationMYR.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Corporate Structure Hierarchy */}
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
                <div className="text-sm font-bold text-slate-900">Corporate Architecture & Group Holdings Structure</div>
                <div className="text-xs text-slate-500 font-mono">
                  {corp.holdingCompany.companyName} (100% Owned) • {corp.subsidiaries.length} Operating Subsidiaries
                </div>
              </div>
            </div>
            {expandedSection === 'corporate' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {expandedSection === 'corporate' && (
            <div className="p-5 space-y-4 border-t border-slate-200">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-900 text-sm">{corp.holdingCompany.companyName}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-slate-600">
                  <div>SSM: <span className="font-mono font-semibold text-slate-900">{corp.holdingCompany.ssmRegistrationNumber}</span></div>
                  <div>Incorporated: <span className="font-semibold text-slate-900">{corp.holdingCompany.incorporationDate}</span></div>
                  <div>Capital: <span className="font-semibold text-slate-900">MYR {corp.holdingCompany.paidUpCapitalMYR.toLocaleString()}</span></div>
                  <div>Status: <span className="font-semibold text-emerald-700">{corp.holdingCompany.companyStatus}</span></div>
                </div>
                <div className="text-slate-700 font-medium pt-1">
                  Sole Director & Shareholder: <span className="font-bold text-slate-900">{corp.holdingCompany.soleDirectorAndShareholder}</span> ({corp.shareCapitalSummary.votingControl})
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">Operating Subsidiaries & Vehicles</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {corp.subsidiaries.map((sub, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <span>{sub.name}</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[11px] font-semibold">{sub.equityOwnershipPct}% Equity</span>
                      </div>
                      <div className="text-slate-600 font-mono text-[11px]">{sub.ssmOrRegistrationNumber} ({sub.jurisdiction})</div>
                      <div className="text-slate-600">{sub.principalActivity}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Law Enforcement & Lawyers */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <button
            onClick={() => setExpandedSection(expandedSection === 'enforcement' ? null : 'enforcement')}
            className="w-full px-5 py-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-800">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Law Enforcement PDRM CCID, BNM AMLA & Advocates on Record</div>
                <div className="text-xs text-slate-500 font-mono">
                  PDRM CCID: {enf.policeCcid.investigatingOfficerName} • BNM FIED: {enf.bankNegaraMalaysiaAmla.leadAmlaOfficerName} • Counsel: {enf.lawyersOnRecord.firmName}
                </div>
              </div>
            </div>
            {expandedSection === 'enforcement' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {expandedSection === 'enforcement' && (
            <div className="p-5 space-y-4 border-t border-slate-200 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 uppercase tracking-wide">PDRM CCID Bukit Aman Corporate Fraud Report</div>
                  <div className="text-slate-700">Senior IO: <span className="font-semibold">{enf.policeCcid.investigatingOfficerName}</span> ({enf.policeCcid.ioRankAndDivision})</div>
                  <div className="text-slate-700">Approving Officer: <span className="font-semibold">{enf.policeCcid.seniorApprovingOfficer}</span></div>
                  <div className="text-slate-700 font-mono text-[11px]">Report: {enf.policeCcid.policeReportNumber} • Paper: {enf.policeCcid.investigationPaperRef}</div>
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-900 italic text-[11px]">
                    "{enf.policeCcid.ioStatementUnderS112Cpc}"
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 uppercase tracking-wide">Bank Negara Malaysia (BNM FIED) AMLA Report</div>
                  <div className="text-slate-700">Lead AMLA Officer: <span className="font-semibold">{enf.bankNegaraMalaysiaAmla.leadAmlaOfficerName}</span></div>
                  <div className="text-slate-700 font-mono text-[11px]">Ref: {enf.bankNegaraMalaysiaAmla.amlaReportReference}</div>
                  <div className="text-emerald-700 font-semibold">{enf.bankNegaraMalaysiaAmla.sourceOfFundsClearance}</div>
                  <div className="text-slate-600">{enf.bankNegaraMalaysiaAmla.assetFreezingOrderTarget}</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 uppercase tracking-wide">Legal Counsel on Record (Advocates & Solicitors)</div>
                <div className="font-semibold text-slate-900 text-sm">{enf.lawyersOnRecord.firmName}</div>
                <div className="text-slate-700">Lead Counsel: <span className="font-semibold">{enf.lawyersOnRecord.leadCounsel}</span> | Co-Counsel: <span className="font-semibold">{enf.lawyersOnRecord.coCounsel}</span></div>
                <div className="text-slate-500 text-[11px]">{enf.lawyersOnRecord.chamberAddress} • Standing: {enf.lawyersOnRecord.formalLegalStanding}</div>
              </div>
            </div>
          )}
        </div>

        {/* 5. Unmasking Adverse Proxy X */}
        <div className="bg-red-50/50 rounded-xl border border-red-200 shadow-sm overflow-hidden">
          <button
            onClick={() => setExpandedSection(expandedSection === 'proxyx' ? null : 'proxyx')}
            className="w-full px-5 py-3.5 bg-red-100/50 hover:bg-red-100 flex items-center justify-between transition text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-200 text-red-900">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-red-950">Unmasking of Adverse "Proxy X" — Real Name, NRIC & Criminal Docket</div>
                <div className="text-xs text-red-700 font-mono">
                  Identified: {px.legalFullName} • NRIC: {px.nricNumber} • Case: {px.criminalCourtCaseNumber}
                </div>
              </div>
            </div>
            {expandedSection === 'proxyx' ? <ChevronUp className="w-4 h-4 text-red-700" /> : <ChevronDown className="w-4 h-4 text-red-700" />}
          </button>

          {expandedSection === 'proxyx' && (
            <div className="p-5 space-y-3 border-t border-red-200 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="text-slate-900 font-bold text-sm">{px.legalFullName}</div>
                  <div className="text-slate-700 font-mono">NRIC: <span className="font-bold text-red-800">{px.nricNumber}</span> • Passport: {px.passportNumber}</div>
                  <div className="text-slate-600">Aliases: {px.knownAliases.join(', ')}</div>
                  <div className="text-slate-600">Vehicle: {px.registeredVehicle}</div>
                  <div className="text-slate-600">Address: {px.residentialAddress}</div>
                  <div className="text-red-700 font-semibold">{px.ssmDisqualificationRef}</div>
                </div>

                <div className="space-y-1.5">
                  <div className="font-bold text-slate-900">Criminal Charges & Trial Status</div>
                  <div className="font-mono text-red-800 font-semibold">{px.criminalCourtCaseNumber}</div>
                  <ul className="list-disc list-inside text-slate-700 space-y-0.5 text-[11px]">
                    {px.penalCodeCharges.map((ch, i) => (
                      <li key={i}>{ch}</li>
                    ))}
                    {px.amlaCharges.map((ch, i) => (
                      <li key={i} className="font-semibold text-red-700">{ch}</li>
                    ))}
                  </ul>
                  <div className="text-slate-700 text-[11px] pt-1">{px.currentLegalAndBailStatus}</div>
                  <div className="text-red-800 font-medium text-[11px]">{px.borderBlacklistNotice}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compiler Metadata & Evidentiary Verification Box */}
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
            Full SHA-256 checksum computed across all 12 chapters, 14 evidentiary exhibits, and cross-border bank dockets.
          </p>
        </div>
      </div>
    </div>
  );
}
