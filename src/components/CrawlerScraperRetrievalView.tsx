import React, { useState, useEffect } from 'react';
import {
  Search,
  Download,
  Terminal,
  FileText,
  FileCheck,
  Shield,
  Layers,
  Database,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Code2,
  Copy,
  Check,
  Building2,
  Landmark,
  FileCode2,
  Scale,
  Lock,
  ChevronDown,
  ChevronUp,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Play,
  Clock,
  BookOpen,
} from 'lucide-react';
import type {
  ScrapedDocument,
  CrawlerTargetConfig,
  CrawlerExecutionLog,
  AiCodeRetrievalSnippet,
  AiDocumentRetrievalResponse,
  TargetDocumentCategory,
} from '../shared/types';
import { downloadDocumentAsPdf, downloadAllDocumentsAsConsolidatedPdf } from '../utils/pdfGenerator';

interface CrawlerScraperRetrievalViewProps {
  onNavigateToCaseDispute?: () => void;
  onNavigateToVeridianSwift?: () => void;
}

export function CrawlerScraperRetrievalView({
  onNavigateToCaseDispute,
  onNavigateToVeridianSwift,
}: CrawlerScraperRetrievalViewProps) {
  // State
  const [documents, setDocuments] = useState<ScrapedDocument[]>([]);
  const [spiders, setSpiders] = useState<CrawlerTargetConfig[]>([]);
  const [logs, setLogs] = useState<CrawlerExecutionLog[]>([]);
  const [codeSnippets, setCodeSnippets] = useState<AiCodeRetrievalSnippet[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TargetDocumentCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlMessage, setCrawlMessage] = useState<string | null>(null);

  // AI Semantic Search State
  const [aiSearchActive, setAiSearchActive] = useState(false);
  const [aiSearchResult, setAiSearchResult] = useState<AiDocumentRetrievalResponse | null>(null);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [includeCodeSnippets, setIncludeCodeSnippets] = useState(true);

  // Active View Mode inside this tab
  const [activeSubView, setActiveSubView] = useState<'documents' | 'ai_retrieval' | 'spiders' | 'code_library'>('documents');

  // Expanded Document Details
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedJurisdiction]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory);
      if (selectedJurisdiction !== 'all') params.append('jurisdiction', selectedJurisdiction);

      const [docRes, spiderRes, logRes, codeRes] = await Promise.all([
        fetch(`/api/crawler/documents?${params.toString()}`),
        fetch('/api/crawler/spiders'),
        fetch('/api/crawler/logs'),
        fetch('/api/ai-retrieval/code-snippets'),
      ]);

      const docData = await docRes.json();
      const spiderData = await spiderRes.json();
      const logData = await logRes.json();
      const codeData = await codeRes.json();

      if (docData.success) setDocuments(docData.data);
      if (spiderData.success) setSpiders(spiderData.data);
      if (logData.success) setLogs(logData.data);
      if (codeData.success) setCodeSnippets(codeData.data);
    } catch (err) {
      console.error('Error fetching crawler and retrieval data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger Targeted Crawl
  const handleTriggerCrawl = async (spiderId?: string) => {
    setIsCrawling(true);
    setCrawlMessage(null);
    try {
      const res = await fetch('/api/crawler/start-crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spiderId, category: selectedCategory }),
      });
      const data = await res.json();
      if (data.success) {
        setCrawlMessage(data.message);
        if (data.executionLog) {
          setLogs((prev) => [data.executionLog, ...prev]);
        }
        await loadData();
      }
    } catch (err) {
      console.error('Crawl trigger failed:', err);
      setCrawlMessage('Crawler execution error encountered.');
    } finally {
      setIsCrawling(false);
    }
  };

  // Run Modern AI Semantic Retrieval
  const handleRunAiSearch = async (overrideQuery?: string) => {
    const q = overrideQuery !== undefined ? overrideQuery : searchQuery;
    if (!q.trim()) return;

    setIsAiSearching(true);
    setAiSearchActive(true);
    setActiveSubView('ai_retrieval');

    try {
      const res = await fetch('/api/ai-retrieval/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          categoryFilter: selectedCategory,
          jurisdictionFilter: selectedJurisdiction !== 'all' ? selectedJurisdiction : undefined,
          includeCodeSnippets,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiSearchResult(data.data);
      }
    } catch (err) {
      console.error('AI Document search failed:', err);
    } finally {
      setIsAiSearching(false);
    }
  };

  const copyToClipboard = (text: string, id: string, isCode = false) => {
    navigator.clipboard.writeText(text);
    if (isCode) {
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 2000);
    } else {
      setCopiedHash(id);
      setTimeout(() => setCopiedHash(null), 2000);
    }
  };

  const getCategoryBadgeColor = (category: TargetDocumentCategory) => {
    switch (category) {
      case 'INCORPORATION_DOCUMENTS':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'TRUST_DOCUMENTS':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'BANK_ACCOUNT_OPENING':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'COMPANY_REGISTRATION':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const getCategoryIcon = (category: TargetDocumentCategory) => {
    switch (category) {
      case 'INCORPORATION_DOCUMENTS':
        return <Building2 className="w-4 h-4 text-blue-400" />;
      case 'TRUST_DOCUMENTS':
        return <Shield className="w-4 h-4 text-purple-400" />;
      case 'BANK_ACCOUNT_OPENING':
        return <Landmark className="w-4 h-4 text-emerald-400" />;
      case 'COMPANY_REGISTRATION':
        return <FileCheck className="w-4 h-4 text-amber-400" />;
    }
  };

  const sampleSearchQueries = [
    'Retrieve all documents signed by Kavinath Ganeshan as sole subscriber or beneficial owner',
    'Find Swiss Form A Lombard Odier beneficial ownership declaration and Finma AMLA rule',
    'Crawl Section 14 Superform and Form 24 share allotment proving Proxy X holds zero shares',
    'Find CIMA trust deed KYD-110077 and regulatory freeze order CIMA-FRZ-25-06-147',
    'Retrieve AST parser code for validating SWIFT MT103 and Section 4(c) defense',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Control Center */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                Targeted Registry Crawler &amp; Scraper Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Modern AI Code Retrieval
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                jsPDF Certified Export
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Statutory Documents Crawler &amp; AI Retrieval Hub
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Targeted crawling, scraping, and cryptographic verification of Incorporation Documents, Trust Instruments,
              Bank Account Opening Declarations (Swiss Form A), and Company Registration Returns. Download individual or
              consolidated certified PDFs with embedded SHA-256 seals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="btn-trigger-crawl-all"
              onClick={() => handleTriggerCrawl()}
              disabled={isCrawling}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold shadow transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCrawling ? 'animate-spin' : ''}`} />
              {isCrawling ? 'Crawling Targets...' : 'Run Targeted Crawl'}
            </button>

            <button
              id="btn-download-all-pdf"
              onClick={() => downloadAllDocumentsAsConsolidatedPdf(documents)}
              disabled={documents.length === 0}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 text-xs font-semibold shadow transition"
            >
              <Download className="w-3.5 h-3.5" />
              Consolidated PDF Dossier ({documents.length})
            </button>

            {onNavigateToVeridianSwift && (
              <button
                onClick={onNavigateToVeridianSwift}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
              >
                SWIFT &amp; UBO Trace
              </button>
            )}
          </div>
        </div>

        {crawlMessage && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{crawlMessage}</span>
          </div>
        )}

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Scraped Documents</div>
            <div className="text-xl font-bold text-white mt-0.5">{documents.length} Exhibits</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">4 Core Regulatory Classes</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Active Spiders</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">{spiders.length} Online</div>
            <div className="text-[11px] text-slate-400 mt-0.5">SSM, Zefix, CIMA, SWIFT</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">AI Code Retrieval ASTs</div>
            <div className="text-xl font-bold text-blue-400 mt-0.5">{codeSnippets.length} Parsers</div>
            <div className="text-[11px] text-blue-300 mt-0.5">TypeScript, Python, JSON</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">SHA-256 Ledger Integrity</div>
            <div className="text-xl font-bold text-purple-400 mt-0.5">100% Cryptographic</div>
            <div className="text-[11px] text-purple-300 mt-0.5">Certified Court Ready</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubView('documents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeSubView === 'documents'
              ? 'bg-slate-800 text-emerald-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Targeted Document Catalog ({documents.length})
        </button>

        <button
          onClick={() => {
            setActiveSubView('ai_retrieval');
            if (!aiSearchResult && searchQuery.trim()) handleRunAiSearch();
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeSubView === 'ai_retrieval'
              ? 'bg-slate-800 text-blue-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          Modern AI Semantic &amp; Code Retrieval
        </button>

        <button
          onClick={() => setActiveSubView('code_library')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeSubView === 'code_library'
              ? 'bg-slate-800 text-purple-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-purple-400" />
          AI Code Snippets &amp; AST Parsers ({codeSnippets.length})
        </button>

        <button
          onClick={() => setActiveSubView('spiders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeSubView === 'spiders'
              ? 'bg-slate-800 text-amber-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-amber-400" />
          Crawler Spiders &amp; Execution Logs ({logs.length})
        </button>
      </div>

      {/* Modern AI Semantic Retrieval Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="input-ai-search-query"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunAiSearch()}
              placeholder="Search via Modern AI: query incorporation, trust, Form A bank opening, or AST code parsers..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer select-none bg-slate-950 px-3 py-2.5 rounded-lg border border-slate-800">
              <input
                type="checkbox"
                checked={includeCodeSnippets}
                onChange={(e) => setIncludeCodeSnippets(e.target.checked)}
                className="rounded border-slate-700 text-emerald-500 focus:ring-0"
              />
              <span>Include AST Code</span>
            </label>

            <button
              id="btn-submit-ai-retrieval"
              onClick={() => handleRunAiSearch()}
              disabled={isAiSearching || !searchQuery.trim()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white text-xs font-semibold rounded-lg shadow disabled:opacity-50 transition"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAiSearching ? 'animate-spin' : ''}`} />
              {isAiSearching ? 'Retrieving...' : 'AI Semantic Retrieval'}
            </button>
          </div>
        </div>

        {/* Suggested Queries */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-500 font-medium">Quick Queries:</span>
          {sampleSearchQueries.map((sq, i) => (
            <button
              key={i}
              onClick={() => {
                setSearchQuery(sq);
                handleRunAiSearch(sq);
              }}
              className="text-[11px] px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition truncate max-w-xs"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: TARGETED DOCUMENT CATALOG */}
      {activeSubView === 'documents' && (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  selectedCategory === 'ALL'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                All Categories ({documents.length})
              </button>

              <button
                onClick={() => setSelectedCategory('INCORPORATION_DOCUMENTS')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  selectedCategory === 'INCORPORATION_DOCUMENTS'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Incorporation Documents
              </button>

              <button
                onClick={() => setSelectedCategory('TRUST_DOCUMENTS')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  selectedCategory === 'TRUST_DOCUMENTS'
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Trust Documents &amp; CIMA
              </button>

              <button
                onClick={() => setSelectedCategory('BANK_ACCOUNT_OPENING')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  selectedCategory === 'BANK_ACCOUNT_OPENING'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Landmark className="w-3.5 h-3.5" />
                Bank Account Opening &amp; Form A
              </button>

              <button
                onClick={() => setSelectedCategory('COMPANY_REGISTRATION')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  selectedCategory === 'COMPANY_REGISTRATION'
                    ? 'bg-amber-600 text-white border-amber-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                Company Registration &amp; Allotment
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedJurisdiction}
                onChange={(e) => setSelectedJurisdiction(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="all">All Jurisdictions</option>
                <option value="Malaysia">Malaysia (SSM)</option>
                <option value="Switzerland">Switzerland (Geneva/FINMA)</option>
                <option value="Cayman">Cayman Islands (CIMA)</option>
                <option value="British Virgin Islands">British Virgin Islands (BVI)</option>
              </select>
            </div>
          </div>

          {/* Document Cards List */}
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400 mb-2" />
              Loading crawled registry documents...
            </div>
          ) : documents.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
              No documents matched the specified category or query.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {documents.map((doc) => {
                const isExpanded = expandedDocId === doc.id;
                return (
                  <div
                    key={doc.id}
                    id={`doc-card-${doc.id}`}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition shadow-sm"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1 ${getCategoryBadgeColor(
                              doc.category
                            )}`}
                          >
                            {getCategoryIcon(doc.category)}
                            {doc.category.replace(/_/g, ' ')}
                          </span>

                          <span className="font-mono text-xs text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {doc.referenceNumber}
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              doc.filingStatus === 'ACTIVE_REGISTERED' || doc.filingStatus === 'AMLA_DECLARED'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : doc.filingStatus === 'FROZEN_REGULATORY'
                                ? 'bg-purple-500/20 text-purple-300'
                                : 'bg-red-500/20 text-red-300'
                            }`}
                          >
                            {doc.filingStatus.replace(/_/g, ' ')}
                          </span>

                          <span className="text-xs text-slate-400">
                            {doc.jurisdiction} • Issued {doc.dateIssued}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white tracking-tight">{doc.documentTitle}</h3>

                        <p className="text-xs text-slate-300 leading-relaxed">{doc.summary}</p>

                        {/* Parties Tags */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="text-[11px] text-slate-400 font-medium">Parties:</span>
                          {doc.keyParties.map((p, pIdx) => (
                            <span
                              key={pIdx}
                              className="text-[11px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                            >
                              <strong className="text-white">{p.name}</strong> ({p.role})
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right Action Column */}
                      <div className="flex flex-row lg:flex-col items-end gap-2 shrink-0">
                        <button
                          id={`btn-download-pdf-${doc.id}`}
                          onClick={() => downloadDocumentAsPdf(doc)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download Official PDF
                        </button>

                        <button
                          onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
                        >
                          {isExpanded ? (
                            <>
                              <span>Collapse</span>
                              <ChevronUp className="w-3.5 h-3.5" />
                            </>
                          ) : (
                            <>
                              <span>View Clauses &amp; Hash</span>
                              <ChevronDown className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Forensic Deep-Dive */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4">
                        {/* Extracted Clauses */}
                        {doc.extractedClauses.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                              Extracted Statutory Clauses &amp; Schedules
                            </h4>
                            <div className="space-y-2">
                              {doc.extractedClauses.map((clause, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs space-y-1"
                                >
                                  <div className="font-semibold text-emerald-400">
                                    {clause.clauseNumber} — {clause.heading}
                                  </div>
                                  <div className="text-slate-300 leading-relaxed">{clause.text}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Raw Transcript Extract */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                            Harvested Registry Transcript Extract
                          </h4>
                          <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                            {doc.rawExtractedText}
                          </pre>
                        </div>

                        {/* Cryptographic Footprint & Spider Info */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px]">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-slate-400 font-mono shrink-0">SHA-256:</span>
                            <span className="font-mono text-emerald-300 truncate">{doc.contentHashSha256}</span>
                            <button
                              onClick={() => copyToClipboard(doc.contentHashSha256, doc.id)}
                              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition"
                              title="Copy Hash"
                            >
                              {copiedHash === doc.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 text-slate-400">
                            <span>Spider: <strong className="text-slate-300">{doc.crawlerSpider}</strong></span>
                            <span>Pages: {doc.pageCount}</span>
                            <span>Seal: {doc.signatureVerified ? 'Verified' : 'Unsigned'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: MODERN AI SEMANTIC & CODE RETRIEVAL RESULTS */}
      {activeSubView === 'ai_retrieval' && (
        <div className="space-y-6">
          {isAiSearching ? (
            <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
              <Sparkles className="w-8 h-8 animate-spin mx-auto text-blue-400 mb-3" />
              <div className="text-base font-semibold text-white">Running Modern AI Semantic Retrieval Engine</div>
              <p className="text-xs text-slate-400 mt-1">
                Vectorizing query, ranking statutory clauses, and retrieving AST code parser routines...
              </p>
            </div>
          ) : !aiSearchResult ? (
            <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
              Enter a query above or click a quick search to run the AI Semantic Retrieval Engine.
            </div>
          ) : (
            <div className="space-y-6">
              {/* AI Synthesis Card */}
              <div className="bg-slate-900 border border-blue-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      AI Legal &amp; Technical Synthesis
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Engine: {aiSearchResult.source}
                  </span>
                </div>

                <div className="prose prose-invert max-w-none text-xs text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950/60 p-4 rounded-lg border border-slate-800">
                  {aiSearchResult.aiSynthesis}
                </div>

                {/* Recommended Actions */}
                {aiSearchResult.recommendedLegalActions && aiSearchResult.recommendedLegalActions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                      Recommended Evidentiary &amp; Filing Actions:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {aiSearchResult.recommendedLegalActions.map((action, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Top Ranked Documents */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Top Retrieved Statutory Exhibits ({aiSearchResult.topDocuments.length})
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {aiSearchResult.topDocuments.map(({ document: doc, similarityScore, matchingPassages }) => (
                    <div
                      key={doc.id}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getCategoryBadgeColor(
                              doc.category
                            )}`}
                          >
                            {doc.category.replace(/_/g, ' ')}
                          </span>
                          <span className="font-mono text-xs text-slate-400">{doc.referenceNumber}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                            {(similarityScore * 100).toFixed(1)}% Match
                          </span>
                        </div>

                        <div className="text-sm font-bold text-white">{doc.documentTitle}</div>

                        {matchingPassages.length > 0 && (
                          <div className="text-xs text-slate-300 bg-slate-950 p-2 rounded border border-slate-800/80 italic">
                            "{matchingPassages[0]}"
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => downloadDocumentAsPdf(doc)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Retrieved Code Snippets */}
              {aiSearchResult.retrievedCodeSnippets && aiSearchResult.retrievedCodeSnippets.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-purple-400" />
                    Retrieved AST Code Parsers &amp; Verification Rules (
                    {aiSearchResult.retrievedCodeSnippets.length})
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    {aiSearchResult.retrievedCodeSnippets.map((snippet) => (
                      <div
                        key={snippet.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5 shadow"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-purple-300">{snippet.title}</span>
                              <span className="px-2 py-0.2 rounded bg-slate-800 text-[10px] text-slate-400 uppercase font-mono">
                                {snippet.language}
                              </span>
                              <span className="px-2 py-0.2 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono">
                                AST: {snippet.astType}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{snippet.description}</p>
                          </div>

                          <button
                            onClick={() => copyToClipboard(snippet.code, snippet.id, true)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition shrink-0"
                          >
                            {copiedCodeId === snippet.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>

                        <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-200 overflow-x-auto">
                          <code>{snippet.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: AI CODE RETRIEVAL LIBRARY */}
      {activeSubView === 'code_library' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-400" />
              Modern AST Code Retrieval Library
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Production AST parsing routines and legal inference algorithms utilized by the crawler engine to extract
              beneficial ownership declarations, validate cryptographic SWIFT MT103 block hashes, and enforce statutory
              partnership defenses.
            </p>
          </div>

          <div className="space-y-4">
            {codeSnippets.map((snippet) => (
              <div
                key={snippet.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{snippet.title}</h4>
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono uppercase">
                        {snippet.language}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                        {snippet.astType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{snippet.description}</p>
                  </div>

                  <button
                    onClick={() => copyToClipboard(snippet.code, snippet.id, true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition shrink-0"
                  >
                    {copiedCodeId === snippet.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                  <code>{snippet.code}</code>
                </pre>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-500 font-medium">Semantic Tags:</span>
                  {snippet.semanticTags.map((t, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: CRAWLER SPIDERS & EXECUTION LOGS */}
      {activeSubView === 'spiders' && (
        <div className="space-y-6">
          {/* Active Spiders Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              Configured Registry Crawler Spiders ({spiders.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {spiders.map((spider) => (
                <div key={spider.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold text-sm text-white">{spider.name}</div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                      {spider.status}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-slate-400 truncate bg-slate-950 p-1.5 rounded border border-slate-800">
                    {spider.baseUrl}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <div>
                      Method: <strong className="text-slate-300">{spider.scrapingMethod}</strong>
                    </div>
                    <div>
                      Rate Limit: <strong className="text-slate-300">{spider.rateLimitMs}ms</strong>
                    </div>
                    <div>
                      Jurisdiction: <strong className="text-slate-300">{spider.jurisdiction}</strong>
                    </div>
                    <div>
                      Harvested: <strong className="text-emerald-400">{spider.documentsFound} Docs</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTriggerCrawl(spider.id)}
                    disabled={isCrawling}
                    className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
                  >
                    <Play className="w-3 h-3 text-emerald-400" />
                    Dispatch Spider Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Crawler Execution Logs */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Live Spider Execution Audit Trail
            </h3>

            <div className="divide-y divide-slate-800/80 font-mono text-xs">
              {logs.map((log) => (
                <div key={log.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">{log.spiderName}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300">{log.status} ({log.httpStatus} OK)</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{log.durationMs}ms</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans">{log.details}</div>
                  </div>

                  <div className="text-[11px] text-slate-500 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
