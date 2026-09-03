import React, { useState, useEffect } from 'react';
import {
  FileCode2,
  Download,
  FolderArchive,
  CheckCircle2,
  Search,
  ExternalLink,
  ShieldCheck,
  Code,
  BookOpen,
  Copy,
  Check,
  Sparkles,
  Layers,
  Terminal,
} from 'lucide-react';
import { SKILL_PACKAGES, SkillManifest } from '../server/skillsData';

export const SkillsPackageHubView: React.FC = () => {
  const [skills, setSkills] = useState<SkillManifest[]>(SKILL_PACKAGES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSkillModal, setActiveSkillModal] = useState<SkillManifest | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredSkills = skills.filter((s) => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.toolsIncluded.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const copySkillManifest = (skill: SkillManifest) => {
    navigator.clipboard.writeText(JSON.stringify(skill.schemaJson, null, 2));
    setCopiedId(skill.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with One-Click Zip Download */}
      <div className="rounded-xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-900/50 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <FolderArchive className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  Evidentiary &amp; Forensic Skills Package (.zip)
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {skills.length} Skills Included
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Includes CourtListener, MyGDX SSM, ICIJ Reconcile, LegalAI-MY, and Advanced Corporate Forensics packages in standard <code>.skillux</code> format.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/api/skills/download-zip"
              download="mygdx-ssm-forensic-skills.zip"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold tracking-wide shadow-lg hover:shadow-blue-500/20 transition group"
            >
              <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition" />
              <span>Download All Skills Package (.zip)</span>
            </a>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Total Skill Packages</div>
            <div className="text-lg font-mono font-bold text-slate-100 mt-0.5">{skills.length} Files</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Archive Compression</div>
            <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">Deflate (Level 9)</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Protocol Compatibility</div>
            <div className="text-lg font-mono font-bold text-blue-400 mt-0.5">MCP &amp; Agent Skills</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Evidentiary Scope</div>
            <div className="text-lg font-mono font-bold text-purple-400 mt-0.5">Cross-Jurisdiction</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All Packages' },
            { id: 'legal', label: 'Legal & Court' },
            { id: 'regulatory', label: 'Regulatory & SSM' },
            { id: 'intelligence', label: 'OSINT & ICIJ' },
            { id: 'forensics', label: 'Forensic Audit' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter skills or tools..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => {
          const categoryColors: Record<string, string> = {
            legal: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
            regulatory: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
            intelligence: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
            forensics: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
          };

          return (
            <div
              key={skill.id}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3 shadow"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      categoryColors[skill.category] || 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {skill.category}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">v{skill.version}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-100 line-clamp-1">{skill.name}</h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {skill.description}
                </p>

                {/* Tools Preview Tag */}
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Included MCP Tools ({skill.toolsIncluded.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {skill.toolsIncluded.slice(0, 2).map((tool) => (
                      <span
                        key={tool}
                        className="px-1.5 py-0.5 rounded bg-slate-950 font-mono text-[10px] text-slate-300 border border-slate-800 truncate max-w-[200px]"
                      >
                        {tool}
                      </span>
                    ))}
                    {skill.toolsIncluded.length > 2 && (
                      <span className="text-[10px] text-slate-500 px-1 py-0.5">
                        +{skill.toolsIncluded.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-slate-400">{skill.filename}</span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveSkillModal(skill)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Inspect skill instructions & manifest"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => copySkillManifest(skill)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Copy JSON manifest"
                  >
                    {copiedId === skill.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Skill Inspection Modal */}
      {activeSkillModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <FileCode2 className="w-5 h-5 text-blue-400" />
                  {activeSkillModal.name}
                </h3>
                <span className="text-xs font-mono text-slate-400">{activeSkillModal.filename} (v{activeSkillModal.version})</span>
              </div>

              <button
                type="button"
                onClick={() => setActiveSkillModal(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Close
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Description</span>
                <p className="text-slate-300 leading-relaxed">{activeSkillModal.description}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Exposed MCP Tools &amp; Methods
                </span>
                <div className="space-y-1">
                  {activeSkillModal.toolsIncluded.map((t) => (
                    <div key={t} className="p-2 rounded bg-slate-950 font-mono text-slate-200 border border-slate-800">
                      <code>{t}</code>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">SKILL.md Documentation</span>
                <pre className="p-3.5 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-300 border border-slate-800 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {activeSkillModal.readme}
                </pre>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Manifest JSON</span>
                <pre className="p-3.5 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-300 border border-slate-800 overflow-x-auto leading-relaxed">
                  {JSON.stringify(activeSkillModal.schemaJson, null, 2)}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <a
                href="/api/skills/download-zip"
                download="mygdx-ssm-forensic-skills.zip"
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                Download in Complete Zip Bundle
              </a>

              <button
                type="button"
                onClick={() => copySkillManifest(activeSkillModal)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                {copiedId === activeSkillModal.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied Manifest
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Schema JSON
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
