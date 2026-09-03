import { useState, useEffect } from 'react';
import {
  FileCheck,
  ShieldCheck,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Upload,
  RefreshCw,
  Search,
  Building2,
  Scale,
  Landmark,
  ExternalLink,
  Copy,
  Check,
  Printer,
  Shield,
  Fingerprint,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import type {
  VerifiableDocument,
  DocumentVerificationReport,
  OfficerAccount,
} from '../shared/types';

interface Props {
  account: OfficerAccount | null;
}

export function DocumentVerificationView({ account }: Props) {
  const [documents, setDocuments] = useState<VerifiableDocument[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('DOC-SSM-1199837-7');
  const [activeReport, setActiveReport] = useState<DocumentVerificationReport | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [customText, setCustomText] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  // Fetch all documents on load
  const loadDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setDocuments(json.data);
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  // Run verification whenever selectedDocId changes or manually triggered
  const triggerVerification = async (docId?: string, payload?: string) => {
    const targetId = docId || selectedDocId;
    setIsVerifying(true);
    try {
      const res = await fetch('/api/documents/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: targetId,
          customPayload: payload,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setActiveReport(json.data);
        if (json.data.document && !documents.some((d) => d.id === json.data.document.id)) {
          setDocuments((prev) => [json.data.document, ...prev]);
        }
      }
    } catch {
      // ignore
    } finally {
      setIsVerifying(false);
    }
  };

  // Initial verification on mount once documents load
  useEffect(() => {
    if (documents.length > 0 && !activeReport) {
      triggerVerification(selectedDocId);
    }
  }, [documents]);

  const filteredDocs = documents.filter((doc) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'VERIFIED') return doc.verificationStatus === 'VERIFIED';
    if (activeFilter === 'FORGED') return doc.verificationStatus === 'TAMPERED_FORGED';
    if (activeFilter === 'RESTRICTED')
      return doc.verificationStatus === 'FROZEN' || doc.verificationStatus === 'UNDER_LITIGATION';
    return true;
  });

  const selectedDoc = documents.find((d) => d.id === selectedDocId);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-8" id="document-verification-view">
      {/* Top Banner: Verification Security Authority */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 tracking-wider uppercase mb-1">
              <ShieldCheck className="w-4 h-4" />
              National Evidentiary Cross-Checking Authority
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Multi-Jurisdictional Forensic Document Verification
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Cryptographically verify corporate filings, court dockets, bank ledger balances, and tax assessments for the target profile <strong className="text-white font-semibold">Kavinath Ganeshan (NRIC: 960906-08-5839)</strong> and associated holding entities.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              id="switch-custom-upload-btn"
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="px-4 py-2.5 rounded-xl border border-slate-600 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Upload className="w-4 h-4 text-blue-400" />
              {isCustomMode ? 'View Dossier Documents' : 'Upload Evidentiary File'}
            </button>

            <button
              type="button"
              id="run-verification-pipeline-btn"
              onClick={() => triggerVerification(selectedDocId)}
              disabled={isVerifying}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
            >
              {isVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isVerifying ? 'Running Verification Pipeline...' : 'Verify Selected Document'}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Upload / Text Ingestion Drawer */}
      {isCustomMode && (
        <div className="bg-slate-900 border border-blue-500/40 rounded-2xl p-6 text-white shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Upload className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-base text-white">Upload / Ingest Custom Forensic Evidence</h3>
            </div>
            <span className="text-xs text-slate-400">Supported: Raw JSON, Bank Statement Telemetry, Court Cause Paper Text</span>
          </div>

          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Paste raw bank ledger transaction, e-Court docket JSON, or corporate certificate payload here to calculate live SHA-256 and run MyGDX verification..."
            rows={5}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-cyan-400" />
              Payload length: {customText.length} characters
            </div>
            <button
              type="button"
              id="submit-custom-verification-btn"
              onClick={() => {
                if (customText.trim()) {
                  triggerVerification(undefined, customText);
                  setIsCustomMode(false);
                }
              }}
              disabled={!customText.trim() || isVerifying}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <FileCheck className="w-4 h-4" />
              Ingest & Cryptographically Validate
            </button>
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Evidentiary Dossier Document Catalog (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Evidentiary Document Repository</h2>
                <p className="text-xs text-slate-500">Target: Kavinath Ganeshan & Related Nodes</p>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                {documents.length} Records
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 overflow-x-auto">
              {(['ALL', 'VERIFIED', 'FORGED', 'RESTRICTED'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                    activeFilter === filter
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {filter === 'ALL'
                    ? 'All Records'
                    : filter === 'VERIFIED'
                    ? 'Verified Genuine'
                    : filter === 'FORGED'
                    ? 'Flagged Forged'
                    : 'Restricted / Litigated'}
                </button>
              ))}
            </div>

            {/* Document List */}
            <div className="mt-4 space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {filteredDocs.map((doc) => {
                const isSelected = doc.id === selectedDocId;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => {
                      setSelectedDocId(doc.id);
                      triggerVerification(doc.id);
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-blue-50/60 border-blue-500 shadow-sm'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {doc.documentCategory === 'SSM_REGISTRATION' && (
                          <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                        )}
                        {doc.documentCategory === 'COURT_DOCKET' && (
                          <Scale className="w-4 h-4 text-purple-600 shrink-0" />
                        )}
                        {doc.documentCategory === 'BANK_LEDGER' && (
                          <Landmark className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        {doc.documentCategory === 'TAX_ASSESSMENT' && (
                          <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        {doc.documentCategory === 'CIMA_FREEZE_ORDER' && (
                          <AlertTriangle className="w-4 h-4 text-cyan-600 shrink-0" />
                        )}
                        {doc.documentCategory === 'OFFSHORE_AGREEMENT' && (
                          <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          {doc.documentCategory.replace('_', ' ')}
                        </span>
                      </div>

                      {doc.verificationStatus === 'VERIFIED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          GENUINE
                        </span>
                      )}
                      {doc.verificationStatus === 'TAMPERED_FORGED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 animate-pulse">
                          FORGERY FLAGGED
                        </span>
                      )}
                      {doc.verificationStatus === 'UNDER_LITIGATION' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                          SUB-JUDICE
                        </span>
                      )}
                      {doc.verificationStatus === 'FROZEN' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          CIMA FROZEN
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-xs mt-2 line-clamp-2 leading-snug">
                      {doc.documentTitle}
                    </h3>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2.5 pt-2 border-t border-slate-100">
                      <span className="font-mono text-slate-600 font-semibold">{doc.referenceNumber}</span>
                      <span>{doc.dateIssued}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Verification Certificate & Audit Findings (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeReport ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-7 space-y-6" id="verification-certificate-card">
              {/* Certificate Header with Institutional Crest */}
              <div className="border-b-2 border-slate-900 pb-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 font-bold text-lg shadow-md">
                      My
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                        MALAYSIAN GOVERNMENT VERIFICATION PROTOCOL // MyGDX-SSM
                      </div>
                      <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">
                        Forensic Document Verification Certificate
                      </h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handlePrintCertificate}
                    className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors print:hidden"
                  >
                    <Printer className="w-4 h-4 text-slate-500" />
                    Print / Export Certificate
                  </button>
                </div>
              </div>

              {/* Status Classification Banner */}
              <div
                className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  activeReport.authenticityStatus === 'GENUINE_VERIFIED'
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                    : activeReport.authenticityStatus === 'FRAUD_DETECTED'
                    ? 'bg-rose-50/90 border-rose-300 text-rose-950'
                    : 'bg-amber-50/80 border-amber-300 text-amber-950'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {activeReport.authenticityStatus === 'GENUINE_VERIFIED' && (
                    <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {activeReport.authenticityStatus === 'FRAUD_DETECTED' && (
                    <AlertOctagon className="w-8 h-8 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  {activeReport.authenticityStatus === 'REGULATORY_RESTRICTED' && (
                    <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider">
                      Authenticity Determination
                    </div>
                    <div className="text-lg font-black tracking-tight">
                      {activeReport.authenticityStatus === 'GENUINE_VERIFIED' && 'GENUINE & CRYPTOGRAPHICALLY VERIFIED'}
                      {activeReport.authenticityStatus === 'FRAUD_DETECTED' && 'CRITICAL FORGERY DETECTED – HASH MISMATCH'}
                      {activeReport.authenticityStatus === 'REGULATORY_RESTRICTED' && 'LEGAL ENCUMBRANCE / REGULATORY FREEZE'}
                    </div>
                    <p className="text-xs mt-1 opacity-90">
                      {activeReport.document.summaryDescription}
                    </p>
                  </div>
                </div>

                <div className="text-center sm:text-right shrink-0 bg-white/70 backdrop-blur px-4 py-2 rounded-xl border border-current/20">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Forensic Confidence
                  </div>
                  <div className="text-2xl font-black">{activeReport.forensicScore} / 100</div>
                </div>
              </div>

              {/* Cryptographic Hash Verification Block */}
              <div className="bg-slate-900 rounded-xl p-5 text-white space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 font-sans font-semibold text-cyan-300">
                    <Fingerprint className="w-4 h-4" />
                    Cryptographic SHA-256 Ledger Checksum
                  </span>
                  <span className={activeReport.document.verificationChecks.sha256Match ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {activeReport.document.verificationChecks.sha256Match ? 'MATCH CONFIRMED' : 'CHECKSUM FAILURE'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-sans">Expected Digital Registry Checksum:</div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800 text-cyan-300 break-all text-[11px]">
                    {activeReport.document.expectedSha256}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-sans">Actual Extracted Document Checksum:</div>
                  <div className={`p-2 rounded border break-all text-[11px] ${
                    activeReport.document.verificationChecks.sha256Match
                      ? 'bg-slate-950 border-slate-800 text-emerald-300'
                      : 'bg-rose-950/60 border-rose-800 text-rose-300 font-bold'
                  }`}>
                    {activeReport.document.actualSha256}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-sans">
                  <span>Size: {(activeReport.document.fileSizeBytes / 1024).toFixed(1)} KB</span>
                  <button
                    type="button"
                    onClick={() => handleCopyHash(activeReport.document.actualSha256)}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedHash ? 'Checksum Copied' : 'Copy Actual Hash'}
                  </button>
                </div>
              </div>

              {/* Multi-Agency Verification Pipeline Checks */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Multi-Agency Pipeline Cross-Checks
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-1.5 mb-1">
                      {activeReport.document.verificationChecks.ssmStatusConfirmed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                      <span className="font-bold text-slate-800">SSM Registry</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {activeReport.document.verificationChecks.ssmStatusConfirmed ? 'Status Active' : 'Non-SSM Entity'}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-1.5 mb-1">
                      {activeReport.document.verificationChecks.mygdxHmacSigned ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertOctagon className="w-4 h-4 text-rose-500" />
                      )}
                      <span className="font-bold text-slate-800">MyGDX HMAC</span>
                    </div>
                    <div className="text-[11px] text-slate-500">HMAC-SHA256 Valid</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-1.5 mb-1">
                      {activeReport.document.verificationChecks.eKehakimanVerified ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-slate-300 inline-block text-[10px] text-center font-bold">N</span>
                      )}
                      <span className="font-bold text-slate-800">e-Kehakiman</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {activeReport.document.verificationChecks.eKehakimanVerified ? 'S/N Confirmed' : 'Not Litigated'}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-1.5 mb-1">
                      {activeReport.document.verificationChecks.icijReconciled ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-slate-300 inline-block text-[10px] text-center font-bold">N</span>
                      )}
                      <span className="font-bold text-slate-800">Offshore Leaks</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {activeReport.document.verificationChecks.icijReconciled ? 'Node Matched' : 'Domestic Only'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Extracted Metadata Grid */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Extracted Document Evidentiary Parameters
                </h3>
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 divide-y divide-slate-200 text-xs">
                  {Object.entries(activeReport.document.extractedMetadata).map(([key, value]) => (
                    <div key={key} className="py-2 flex items-center justify-between first:pt-0 last:pb-0">
                      <span className="font-semibold text-slate-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-mono text-slate-900 font-bold">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statutory Provisions & Penal Exposures */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Invoked Statutory Provisions & Legal Exposure
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeReport.document.statutoryProvisions.map((statute, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-medium"
                    >
                      {statute}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Agency Enforcement Actions */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                <div className="text-xs font-bold text-blue-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Recommended Multi-Agency Enforcement Directives
                </div>
                <ul className="space-y-1.5 text-xs text-blue-950">
                  {activeReport.recommendedActions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Attestation Footer */}
              <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  Attested by Officer: <strong className="text-slate-800">{activeReport.verifiedByOfficer}</strong> ({activeReport.officerBadge})
                </div>
                <div>Agency: {activeReport.agency}</div>
                <div>Timestamp: {new Date(activeReport.timestamp).toLocaleString()}</div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
              <p className="text-sm font-semibold">Running verification engine...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
