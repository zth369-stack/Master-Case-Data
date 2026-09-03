import { useState, useEffect } from 'react';
import {
  Sparkles,
  Newspaper,
  BookOpen,
  Scale,
  AlertTriangle,
  Send,
  RefreshCw,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  FileText,
  Building2,
  Share2,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import type {
  HistoricalPrecedent,
  MediaCoverageItem,
  GenerateMediaAnalysisResponse,
  CaseTrigger,
} from '../shared/types';

interface AiMediaCoverageViewProps {
  initialTriggerId?: string;
}

export function AiMediaCoverageView({ initialTriggerId }: AiMediaCoverageViewProps) {
  const [mediaArticles, setMediaArticles] = useState<MediaCoverageItem[]>([]);
  const [precedents, setPrecedents] = useState<HistoricalPrecedent[]>([]);
  const [triggers, setTriggers] = useState<CaseTrigger[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form parameters
  const [focusTopic, setFocusTopic] = useState<string>(
    'Expose the Section 4(c) defense against the USD 35M Swiss accounts and LHDN priority lien'
  );
  const [selectedTriggerId, setSelectedTriggerId] = useState<string>(initialTriggerId || 'TRG-001');
  const [selectedPrecedentCitation, setSelectedPrecedentCitation] = useState<string>('[2018] 4 MLJ 712 (CA)');
  const [perspective, setPerspective] = useState<
    'financial_journalist' | 'sub_judice_auditor' | 'defense_counsel' | 'regulatory_enforcer'
  >('financial_journalist');
  const [customPrompt, setCustomPrompt] = useState<string>('');

  // AI Output
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<GenerateMediaAnalysisResponse | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Active view tab
  const [viewTab, setViewTab] = useState<'ai_studio' | 'coverage_archive' | 'precedent_library'>('ai_studio');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (initialTriggerId) {
      setSelectedTriggerId(initialTriggerId);
    }
  }, [initialTriggerId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [mediaRes, precRes, trgRes] = await Promise.all([
        fetch('/api/case/media-coverage'),
        fetch('/api/case/historical-precedents'),
        fetch('/api/case/triggers'),
      ]);
      const mediaJson = await mediaRes.json();
      const precJson = await precRes.json();
      const trgJson = await trgRes.json();

      if (mediaJson.success) setMediaArticles(mediaJson.data);
      if (precJson.success) setPrecedents(precJson.data);
      if (trgJson.success) {
        setTriggers(trgJson.data);
        if (!initialTriggerId && trgJson.data.length > 0) {
          setSelectedTriggerId(trgJson.data[0].triggerId);
        }
      }
    } catch (err) {
      console.error('Failed to load media or precedent data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAiAnalysis = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/media-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          focusTopic,
          targetTriggerId: selectedTriggerId,
          historicalPrecedentCitation: selectedPrecedentCitation,
          perspective,
          customPrompt: customPrompt.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setAiResult(json.data);
      }
    } catch (err) {
      console.error('AI Media analysis error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyReport = () => {
    if (!aiResult) return;
    const text = `${aiResult.generatedHeadline}\n\n${aiResult.mediaArticleHtml}`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const selectedPrecedent = precedents.find((p) => p.citation === selectedPrecedentCitation);
  const selectedTrigger = triggers.find((t) => t.triggerId === selectedTriggerId);

  return (
    <div id="ai-media-coverage-view" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Gemini AI Media Intelligence &bull; Historical Precedents Engine</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Media Coverage &amp; Case Precedents Synthesis
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Injecting server-side AI to analyze media exposure, historical case parallels, and sub-judice press compliance across High Court Suit No. 4-334567 and the Swiss-Cayman asset web.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              gemini-3.8-flash active
            </span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex border-b border-slate-800 gap-3 mt-6 pt-2">
          <button
            id="tab-ai-studio"
            onClick={() => setViewTab('ai_studio')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition flex items-center gap-2 border-b-2 ${
              viewTab === 'ai_studio'
                ? 'border-blue-500 text-blue-400 bg-slate-950/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Media &amp; Precedents Generator
          </button>

          <button
            id="tab-coverage-archive"
            onClick={() => setViewTab('coverage_archive')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition flex items-center gap-2 border-b-2 ${
              viewTab === 'coverage_archive'
                ? 'border-blue-500 text-blue-400 bg-slate-950/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            Investigative Coverage Archive ({mediaArticles.length})
          </button>

          <button
            id="tab-precedent-library"
            onClick={() => setViewTab('precedent_library')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition flex items-center gap-2 border-b-2 ${
              viewTab === 'precedent_library'
                ? 'border-blue-500 text-blue-400 bg-slate-950/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Historical Landmark Precedents ({precedents.length})
          </button>
        </div>
      </div>

      {/* VIEW 1: AI GENERATOR STUDIO */}
      {viewTab === 'ai_studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  Synthesis Controls
                </h3>
                <span className="text-[10px] font-mono text-slate-500">Case Context Injected</span>
              </div>

              {/* Focus Topic Quick Presets */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Investigation Focus Preset</label>
                <select
                  id="select-focus-preset"
                  value={focusTopic}
                  onChange={(e) => setFocusTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Expose the Section 4(c) defense against the USD 35M Swiss accounts and LHDN priority lien">
                    Section 4(c) Defense vs USD 35M Geneva Accounts
                  </option>
                  <option value="Forensic breakdown: Forged AmBank SHA-256 credit trace vs landmark SRC banking forgery precedent">
                    Forged AmBank USD 2M Trace vs SRC/1MDB Precedent
                  </option>
                  <option value="LHDN RM56.42M priority tax lien vs High Court Sub-Judice freeze: Who gets paid first?">
                    LHDN Sovereign Tax Lien vs Court Order 29 Freeze
                  </option>
                  <option value="Mutual Legal Assistance (MLAT) in Criminal Matters: Piercing Swiss Lombard Odier accounts">
                    Swiss IMAC MLAT Asset Recovery Evaluation
                  </option>
                  <option value="Sub-judice contempt audit: Evaluating journalist inquiry compliance under Order 52">
                    Sub-Judice Press Risk &amp; Contempt of Court Audit
                  </option>
                </select>
              </div>

              {/* Anchor Trigger */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Anchor to Case Trigger</label>
                <select
                  id="select-anchor-trigger"
                  value={selectedTriggerId}
                  onChange={(e) => setSelectedTriggerId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {triggers.map((trg) => (
                    <option key={trg.triggerId} value={trg.triggerId}>
                      {trg.code}: {trg.eventType.substring(0, 45)}...
                    </option>
                  ))}
                </select>
                {selectedTrigger && (
                  <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800/80">
                    <span className="text-blue-400 font-semibold">{selectedTrigger.sourceAgency}:</span>{' '}
                    {selectedTrigger.summary}
                  </p>
                )}
              </div>

              {/* Historical Precedent Comparator */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Cross-Reference Historical Precedent</label>
                <select
                  id="select-precedent-citation"
                  value={selectedPrecedentCitation}
                  onChange={(e) => setSelectedPrecedentCitation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {precedents.map((prec) => (
                    <option key={prec.citation} value={prec.citation}>
                      {prec.caseName} ({prec.citation})
                    </option>
                  ))}
                </select>
                {selectedPrecedent && (
                  <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800/80 leading-relaxed">
                    <span className="text-amber-400 font-semibold">{selectedPrecedent.courtAndYear}:</span>{' '}
                    {selectedPrecedent.keyLegalPrinciple}
                  </p>
                )}
              </div>

              {/* Perspective Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Analytical Perspective</label>
                <select
                  id="select-perspective"
                  value={perspective}
                  onChange={(e) =>
                    setPerspective(
                      e.target.value as
                        | 'financial_journalist'
                        | 'sub_judice_auditor'
                        | 'defense_counsel'
                        | 'regulatory_enforcer'
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="financial_journalist">Senior Financial Investigative Journalist (The Edge / Bloomberg)</option>
                  <option value="sub_judice_auditor">Sub-Judice Compliance &amp; Contempt Auditor (Order 52)</option>
                  <option value="defense_counsel">Senior Commercial Defense Counsel (Advocates &amp; Solicitors)</option>
                  <option value="regulatory_enforcer">Multi-Agency Taskforce Enforcer (LHDN / BNM / SSM)</option>
                </select>
              </div>

              {/* Custom Prompt Instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Custom Investigation Directive (Optional)</label>
                <textarea
                  id="textarea-custom-prompt"
                  rows={3}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Specifically compare the AmBank forged SHA-256 ledger discrepancy to the SRC International donation letters and assess contempt of court risks under Order 52..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Generate Button */}
              <button
                id="btn-execute-ai-media-generation"
                onClick={handleGenerateAiAnalysis}
                disabled={isGenerating}
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-200" />
                    <span>Synthesizing with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-blue-200" />
                    <span>Generate AI Media &amp; Precedent Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Output Column */}
          <div className="lg:col-span-7 space-y-4">
            {aiResult ? (
              <div id="ai-generated-report-card" className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Generated via {aiResult.source}
                    </span>
                    <span className="text-xs text-slate-400 ml-2 font-mono">
                      {new Date(aiResult.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <button
                    onClick={handleCopyReport}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition border border-slate-700"
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Dossier</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Headline */}
                <h2 className="text-xl font-bold text-white leading-tight tracking-tight">
                  {aiResult.generatedHeadline}
                </h2>

                {/* Sub-Judice Risk Rating Box */}
                <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Scale className="w-4 h-4" />
                      Order 52 Sub-Judice &amp; Contempt Assessment:
                    </span>
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-200 border border-amber-500/40">
                      {aiResult.subJudiceRiskAnalysis.riskRating}
                    </span>
                  </div>
                  <p className="text-amber-200/90 leading-relaxed">
                    {aiResult.subJudiceRiskAnalysis.contemptOfCourtWarning}
                  </p>
                  <div className="pt-2 border-t border-amber-500/20 space-y-1">
                    <div className="font-semibold text-amber-300">Safe Harbor Compliance Guidelines:</div>
                    {aiResult.subJudiceRiskAnalysis.safeHarborRecommendations.map((rec, i) => (
                      <div key={i} className="text-slate-300 flex items-start gap-1.5">
                        <span className="text-amber-400">&bull;</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Article Body */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/90 text-slate-200 text-xs leading-relaxed space-y-3 font-sans whitespace-pre-wrap">
                  {aiResult.mediaArticleHtml}
                </div>

                {/* Historical Precedent Correlation */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      Historical Precedent Match:
                    </span>
                    <span className="font-mono text-emerald-400">
                      {aiResult.historicalPrecedentMatch.correlationFactor}
                    </span>
                  </div>
                  <div className="text-white font-semibold">{aiResult.historicalPrecedentMatch.caseName}</div>
                  <div className="text-slate-400 font-mono">{aiResult.historicalPrecedentMatch.citation}</div>
                  <p className="text-slate-300 leading-relaxed pt-1">
                    {aiResult.historicalPrecedentMatch.practicalLesson}
                  </p>
                </div>

                {/* Traced Ripple Effects */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Downstream Regulatory &amp; Judicial Ripple Effects
                  </h4>
                  <div className="space-y-1.5">
                    {aiResult.tracedRippleEffects.map((effect, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2"
                      >
                        <ChevronRight className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span>{effect}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Litigant & Official Quotes */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Simulated Litigant &amp; Legal Quotes
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {aiResult.keyQuotes.map((q, idx) => (
                      <div key={idx} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                        <div className="font-semibold text-blue-400">{q.speaker}</div>
                        <p className="text-slate-300 italic">"{q.quote}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-3">
                <Newspaper className="w-12 h-12 text-slate-600" />
                <h3 className="text-sm font-semibold text-white">No Analysis Generated Yet</h3>
                <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                  Select your investigation focus, anchor trigger, and historical precedent on the left, then click{' '}
                  <span className="text-blue-400 font-semibold">Generate AI Media &amp; Precedent Analysis</span> to trigger live server-side Gemini intelligence.
                </p>
                <button
                  onClick={handleGenerateAiAnalysis}
                  className="mt-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Run Instant Default Synthesis
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: INVESTIGATIVE COVERAGE ARCHIVE */}
      {viewTab === 'coverage_archive' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mediaArticles.map((article) => {
              const isExpanded = expandedArticleId === article.id;
              return (
                <div
                  key={article.id}
                  id={`article-card-${article.id.toLowerCase()}`}
                  className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-slate-700 transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                        {article.outlet}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{article.publishedDate}</span>
                    </div>

                    <h3 className="text-sm font-bold text-white leading-snug">{article.headline}</h3>

                    <p className="text-xs text-slate-300 leading-relaxed">{article.synopsis}</p>

                    {isExpanded && (
                      <div className="pt-2 border-t border-slate-800 text-xs space-y-2 text-slate-300">
                        <div className="bg-slate-950 p-3 rounded border border-slate-800/80">
                          <span className="font-semibold text-blue-400">Investigative Angle: </span>
                          {article.investigativeAngle}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                          article.subJudiceCompliance === 'COMPLIANT'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : article.subJudiceCompliance === 'BORDERLINE_SUB_JUDICE'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {article.subJudiceCompliance.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <button
                      onClick={() => setExpandedArticleId(isExpanded ? null : article.id)}
                      className="text-blue-400 hover:text-blue-300 font-medium text-xs flex items-center gap-1"
                    >
                      {isExpanded ? 'Collapse' : 'Examine Angle'}
                      <ChevronRight className={`w-3.5 h-3.5 transition ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: HISTORICAL LANDMARK PRECEDENTS */}
      {viewTab === 'precedent_library' && (
        <div className="space-y-4">
          <div className="space-y-4">
            {precedents.map((prec, idx) => (
              <div
                key={idx}
                id={`precedent-item-${idx}`}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    {prec.caseName}
                  </h3>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-amber-300 border border-slate-700 font-semibold self-start sm:self-auto">
                    {prec.citation}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-400">{prec.courtAndYear}</div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs">
                  <span className="font-bold text-blue-400">Key Legal Principle: </span>
                  <span className="text-slate-200">{prec.keyLegalPrinciple}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950/60 p-3 rounded border border-slate-800">
                    <div className="font-semibold text-emerald-400 mb-1">Direct Application to High Court Suit 4-334567:</div>
                    <p className="text-slate-300 leading-relaxed">{prec.applicabilityToCurrentDispute}</p>
                  </div>

                  <div className="bg-slate-950/60 p-3 rounded border border-slate-800">
                    <div className="font-semibold text-purple-400 mb-1">Judicial Outcome Ratio &amp; Media Impact:</div>
                    <p className="text-slate-300 leading-relaxed">
                      <span className="font-medium text-slate-200">Ratio: </span>
                      {prec.judicialOutcomeRatio}
                    </p>
                    <p className="text-slate-400 mt-1 italic">{prec.mediaRelevance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
