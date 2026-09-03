import React, { useState } from 'react';
import {
  Globe2,
  Search,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Shield,
  Layers,
  Database,
  Building,
  User,
  MapPin,
  FileSpreadsheet,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';

export const IcijReconciliationView: React.FC = () => {
  const [query, setQuery] = useState('Archon Holdings SA');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Entity' | 'Officer' | 'Intermediary' | 'Address'>('All');
  const [limit, setLimit] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Batch reconciliation state
  const [batchInput, setBatchInput] = useState<string>(
    'Archon Holdings SA\nThe Ganesam Family Trust\nKavinath Ventures Offshore Ltd\nVeridian Estate Capital'
  );
  const [batchResults, setBatchResults] = useState<any>(null);
  const [isBatchLoading, setIsBatchLoading] = useState<boolean>(false);

  const executeReconcile = async (targetQuery?: string) => {
    const q = targetQuery || query;
    setIsLoading(true);
    try {
      const res = await fetch('/api/icij/reconcile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          type: typeFilter !== 'All' ? typeFilter : undefined,
          limit,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setResults(json.data);
      } else {
        alert(json.error || 'Reconciliation failed');
      }
    } catch (err) {
      console.error('ICIJ Reconcile Error:', err);
      alert('Failed to connect to ICIJ Reconcile proxy');
    } finally {
      setIsLoading(false);
    }
  };

  const executeBatch = async () => {
    setIsBatchLoading(true);
    setBatchResults(null);
    const queries = batchInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/mcp/rpc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: `batch-${Date.now()}`,
          method: 'tools/call',
          params: {
            name: 'icij_offshore_batch_reconcile',
            arguments: { queries },
          },
        }),
      });
      const data = await res.json();
      if (data.result?.content?.[0]?.text) {
        setBatchResults(JSON.parse(data.result.content[0].text));
      }
    } catch (err) {
      console.error('Batch error:', err);
    } finally {
      setIsBatchLoading(false);
    }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Globe2 className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">
                  ICIJ Offshore Leaks Reconcile Integration
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  OpenRefine API v1
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Upstream Endpoint: <code className="font-mono text-purple-300">https://offshoreleaks.icij.org/api/v1/reconcile</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <a
              href="https://offshoreleaks.icij.org"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              <span>ICIJ Database</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
              Panama / Pandora / Paradise Leaks
            </span>
          </div>
        </div>
      </div>

      {/* Main Single-Entity Reconcile Section */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Search className="w-4 h-4 text-purple-400" />
          Interactive Entity Reconciliation
        </h3>

        {/* Search Bar & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter suspect entity or officer name..."
              className="w-full pl-3 pr-10 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              onKeyDown={(e) => e.key === 'Enter' && executeReconcile()}
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Types</option>
              <option value="Entity">Entity (Offshore Shell)</option>
              <option value="Officer">Officer / Nominee</option>
              <option value="Intermediary">Intermediary (Law/Fiduciary)</option>
              <option value="Address">Address</option>
            </select>
          </div>

          <div className="md:col-span-3 flex gap-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => executeReconcile()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold shadow transition"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Reconciling...
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  Reconcile
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-400">Target presets:</span>
          {[
            'Archon Holdings SA',
            'The Ganesam Family Trust',
            'Kavinath Ventures Offshore Ltd',
            'Veridian Estate Capital',
            'Mossack Fonseca',
            'Portcullis TrustNet',
          ].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setQuery(preset);
                executeReconcile(preset);
              }}
              className="px-2.5 py-1 text-[11px] rounded-md bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Reconcile Results List */}
        {results && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">
                Candidates found for &quot;<span className="text-purple-300">{results.query || query}</span>&quot;
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Source: {results.source === 'live_icij_api' ? 'Live ICIJ OpenRefine API' : 'Evidentiary Cache'}
              </span>
            </div>

            <div className="space-y-2.5">
              {Array.isArray(results.result) && results.result.length > 0 ? (
                results.result.map((item: any, idx: number) => {
                  const score = Number(item.score || 0);
                  const isHighConfidence = score >= 85;

                  return (
                    <div
                      key={item.id || idx}
                      className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              isHighConfidence
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {score.toFixed(1)}% MATCH
                          </span>

                          <span className="text-sm font-bold text-slate-100">{item.name}</span>

                          {item.match && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[9px] font-bold">
                              EXACT MATCH
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {item.verifiedUrl && (
                            <a
                              href={item.verifiedUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                            >
                              <span>Offshore Leaks Node</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => copyText(JSON.stringify(item, null, 2), item.id || String(idx))}
                            className="text-slate-400 hover:text-slate-200 text-xs p-1"
                            title="Copy candidate details"
                          >
                            {copiedId === (item.id || String(idx)) ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-400 pt-1 border-t border-slate-800/60">
                        <div>
                          <span className="text-slate-500">Jurisdiction: </span>
                          <span className="text-slate-300 font-medium">{item.jurisdiction || 'International'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Database: </span>
                          <span className="text-slate-300">{item.sourceDatabase || 'Panama / Pandora Papers'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Node ID: </span>
                          <span className="font-mono text-slate-300">{item.id}</span>
                        </div>
                      </div>

                      {item.linkedOfficers && item.linkedOfficers.length > 0 && (
                        <div className="text-xs pt-1">
                          <span className="text-slate-500">Linked Officers / Intermediaries: </span>
                          <span className="text-blue-300 font-medium">
                            {item.linkedOfficers.join(' • ')}
                          </span>
                        </div>
                      )}

                      {item.status && (
                        <div className="text-[11px] text-amber-300/90 bg-amber-950/20 px-2.5 py-1 rounded border border-amber-900/30">
                          <span className="font-semibold">Evidentiary Status: </span>
                          {item.status}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-4 rounded-lg bg-slate-950 text-center text-xs text-slate-400">
                  No matching offshore entities found. Try broadening the search term.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Batch Reconciliation Utility */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Batch Entity Reconciliation Matrix
          </h3>
          <span className="text-[11px] text-slate-400">Parallel OpenRefine Queries</span>
        </div>

        <p className="text-xs text-slate-400">
          Paste multiple suspect corporate entities or officer names (one per line) to cross-reference in a single multi-threaded reconciliation batch:
        </p>

        <textarea
          rows={4}
          value={batchInput}
          onChange={(e) => setBatchInput(e.target.value)}
          className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
          placeholder="One entity per line..."
        />

        <div className="flex items-center justify-between">
          <button
            type="button"
            disabled={isBatchLoading}
            onClick={executeBatch}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow transition"
          >
            {isBatchLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Executing Batch...
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Run Batch Reconciliation
              </>
            )}
          </button>

          {batchResults && (
            <span className="text-xs text-emerald-400 font-semibold">
              Reconciled {batchResults.batchCount} entities successfully
            </span>
          )}
        </div>

        {batchResults && (
          <div className="mt-4 pt-4 border-t border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold text-[11px] uppercase">
                  <th className="py-2 px-3">Queried Entity</th>
                  <th className="py-2 px-3">Top Matched Candidate</th>
                  <th className="py-2 px-3">Confidence Score</th>
                  <th className="py-2 px-3">Jurisdiction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {Object.entries(batchResults.results || {}).map(([queryKey, resObj]: [string, any]) => {
                  const topCandidate = Array.isArray(resObj.result) ? resObj.result[0] : null;

                  return (
                    <tr key={queryKey} className="hover:bg-slate-950/40">
                      <td className="py-2.5 px-3 text-slate-200 font-medium">{queryKey}</td>
                      <td className="py-2.5 px-3 text-purple-300">
                        {topCandidate?.name || 'No direct match'}
                      </td>
                      <td className="py-2.5 px-3">
                        {topCandidate ? (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              topCandidate.score >= 80
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {Number(topCandidate.score).toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-slate-500">0%</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                        {topCandidate?.jurisdiction || 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
