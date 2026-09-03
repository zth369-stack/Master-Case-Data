import { useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Scale,
  CheckCircle2,
  Table,
  Search,
  FileText,
  Tag,
} from 'lucide-react';
import type { ForensicThesisChapter } from '../shared/types';

interface ThesisChaptersViewProps {
  chapters: ForensicThesisChapter[];
}

export function ThesisChaptersView({ chapters }: ThesisChaptersViewProps) {
  const [expandedChapter, setExpandedChapter] = useState<string | null>('1');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredChapters = chapters.filter((c) => {
    if (!searchFilter.trim()) return true;
    const term = searchFilter.toLowerCase();
    return (
      c.title.toLowerCase().includes(term) ||
      c.subtitle.toLowerCase().includes(term) ||
      c.romanNumeral.toLowerCase().includes(term) ||
      c.statutoryAnchors.some((a) => a.toLowerCase().includes(term)) ||
      c.keyEvidencesCited.some((e) => e.toLowerCase().includes(term)) ||
      c.fullBodyText.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-5">
      {/* Search & Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            12 Comprehensive Forensic Thesis Chapters (A to Z Compendium)
          </h3>
          <p className="text-xs text-slate-500">
            Exhaustive evidentiary thesis detailing identity, corporate equity, powers of attorney, DNA, probate, Swiss compliance, and litigation.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search chapters, statutes, cases..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
          />
        </div>
      </div>

      {/* Chapters Accordion / List */}
      <div className="space-y-3">
        {filteredChapters.map((chapter) => {
          const isExpanded = expandedChapter === chapter.chapterNumber;

          return (
            <div
              key={chapter.chapterNumber}
              className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden shadow-sm ${
                isExpanded ? 'border-amber-400 ring-1 ring-amber-300' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header clickable row */}
              <button
                type="button"
                onClick={() => setExpandedChapter(isExpanded ? null : chapter.chapterNumber)}
                className="w-full text-left p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 transition"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-slate-900 text-amber-400 font-mono font-bold text-xs shrink-0">
                    {chapter.romanNumeral}
                  </span>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {chapter.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium pt-0.5">
                      {chapter.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden md:inline-flex text-[11px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {chapter.statutoryAnchors.length} Statutes
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expanded Body Content */}
              {isExpanded && (
                <div className="p-5 sm:p-6 border-t border-slate-200 space-y-5 bg-white">
                  {/* Statutory Anchors */}
                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-blue-600" />
                      Statutory Anchors & Legal Provisions:
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {chapter.statutoryAnchors.map((anc, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white border border-slate-300 text-slate-800 rounded text-xs font-medium"
                        >
                          {anc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Evidences Cited */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-600" />
                      Key Evidences Cited:
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
                      {chapter.keyEvidencesCited.map((ev, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 bg-amber-50/50 p-2 rounded border border-amber-100">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Full Evidentiary Exposition Body */}
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      Evidentiary Exposition & Thesis Analysis:
                    </div>
                    <div className="prose prose-sm max-w-none text-xs text-slate-800 leading-relaxed space-y-3">
                      {chapter.fullBodyText.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx} className="bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Tabular Matrix (if available) */}
                  {chapter.tableData && chapter.tableData.rows.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Table className="w-3.5 h-3.5 text-indigo-600" />
                        Tabular Evidentiary Matrix:
                      </div>
                      <div className="overflow-x-auto rounded-lg border border-slate-200">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-900 text-white font-semibold">
                              {chapter.tableData.headers.map((h, hIdx) => (
                                <th key={hIdx} className="p-2.5 border-b border-slate-700">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {chapter.tableData.rows.map((row, rIdx) => (
                              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="p-2.5 text-slate-700 font-mono text-[11px]">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Key Evidentiary Findings */}
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                    <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Key Evidentiary Findings:
                    </div>
                    <ul className="space-y-1 text-xs text-emerald-950">
                      {chapter.keyFindings.map((f, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold shrink-0">✔</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Adjudicated Judicial Conclusion */}
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 space-y-1">
                    <div className="text-xs font-bold text-indigo-900">
                      Adjudicated Judicial Conclusion:
                    </div>
                    <blockquote className="text-xs text-indigo-950 font-medium italic leading-relaxed pl-2 border-l-2 border-indigo-400">
                      {chapter.adjudicatedConclusions}
                    </blockquote>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
