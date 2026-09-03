import { useState } from 'react';
import {
  FileCheck,
  Search,
  Filter,
  Check,
  Copy,
  Building2,
  Calendar,
  Scale,
  ShieldAlert,
  Hash,
  Award,
} from 'lucide-react';
import type { AdditionalEvidentiaryDocument } from '../shared/types';

interface EvidentiaryCatalogViewProps {
  documents: AdditionalEvidentiaryDocument[];
}

export function EvidentiaryCatalogView({ documents }: EvidentiaryCatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassification, setSelectedClassification] = useState<string>('ALL');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const classifications = ['ALL', 'CONCLUSIVE_PROOF', 'FORENSIC_CERTIFICATE', 'APEX_JUDGMENT', 'PRIMA_FACIE', 'CRIMINAL_EXHIBIT'];

  const filteredDocs = documents.filter((doc) => {
    const matchesClass = selectedClassification === 'ALL' || doc.evidentiaryClassification === selectedClassification;
    if (!matchesClass) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.documentTitle.toLowerCase().includes(q) ||
      doc.officialReferenceNumber.toLowerCase().includes(q) ||
      doc.agencyOrRegistry.toLowerCase().includes(q) ||
      doc.statutoryBasis.toLowerCase().includes(q) ||
      doc.summaryFindings.toLowerCase().includes(q)
    );
  });

  const getBadgeClass = (classification: string) => {
    switch (classification) {
      case 'CONCLUSIVE_PROOF':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'APEX_JUDGMENT':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'FORENSIC_CERTIFICATE':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'CRIMINAL_EXHIBIT':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'PRIMA_FACIE':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Filter Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              Surfaced & Indexed Evidentiary Documents Catalog ({documents.length} Exhibits)
            </h3>
            <p className="text-xs text-slate-500">
              Primary evidentiary exhibits spanning civil registration (JPN), criminal forensics (PDRM CCID), central banking (BNM), tax settlements (LHDN), land titles, apex rulings, arbitration, and international Swiss clearing.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search reference, agency, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
            />
          </div>
        </div>

        {/* Classification Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {classifications.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedClassification(c)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedClassification === c
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Evidentiary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc, idx) => (
          <div
            key={doc.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header with Classification Badge */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Exhibit {idx + 1}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeClass(doc.evidentiaryClassification)}`}>
                  {doc.evidentiaryClassification.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Title & Ref */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {doc.documentTitle}
                </h4>
                <div className="font-mono text-xs text-slate-500 pt-1">
                  Ref: <strong className="text-slate-800">{doc.officialReferenceNumber}</strong>
                </div>
              </div>

              {/* Agency & Issuance Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{doc.agencyOrRegistry}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{doc.issuanceDate}</span>
                </div>
              </div>

              {/* Statutory Basis */}
              <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700">
                <strong className="text-slate-900 block font-semibold mb-0.5 flex items-center gap-1">
                  <Scale className="w-3 h-3 text-blue-600" /> Statutory Authority:
                </strong>
                {doc.statutoryBasis}
              </div>

              {/* Summary Findings */}
              <div className="text-xs text-slate-700 space-y-1">
                <strong className="text-slate-900 font-semibold block">Evidentiary Findings:</strong>
                <p className="leading-relaxed bg-amber-50/40 p-2.5 rounded border border-amber-100">
                  {doc.summaryFindings}
                </p>
              </div>

              {/* Counterparts Excluded */}
              <div className="text-xs text-slate-600 bg-red-50/50 p-2 rounded border border-red-100">
                <strong className="text-red-900 font-semibold">Adverse Claims Rebutted: </strong>
                {doc.counterpartsExcludedOrRebutted}
              </div>
            </div>

            {/* Footer Seal & SHA-256 Hash */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span className="truncate font-medium">Seal: {doc.custodianSeal}</span>
              </div>

              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded border border-slate-200 text-[10px] font-mono text-slate-600">
                <span className="truncate flex items-center gap-1">
                  <Hash className="w-3 h-3 text-purple-600" />
                  {doc.sha256VerificationHash.slice(0, 24)}...
                </span>
                <button
                  onClick={() => handleCopy(doc.sha256VerificationHash, doc.id)}
                  className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-100 flex items-center gap-1 shrink-0 transition"
                  title="Copy SHA-256"
                >
                  {copiedHash === doc.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
