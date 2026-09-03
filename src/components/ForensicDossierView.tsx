import { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Building2,
  Globe,
  DollarSign,
  Scale,
  Landmark,
  AlertOctagon,
  AlertTriangle,
  FileText,
  Calculator,
  ChevronRight,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
  Info,
  Award,
} from 'lucide-react';
import type { ForensicEntity } from '../shared/types';

export function ForensicDossierView() {
  const [entities, setEntities] = useState<ForensicEntity[]>([]);
  const [target, setTarget] = useState<{
    fullName: string;
    nric: string;
    jpnBirthIndexes: string[];
    status: string;
    primaryDomesticEntity: string;
    jurisdictions: string[];
    totalLiabilitiesMYR: number;
    domesticLiquidAssetsMYR: number;
    offshoreLiquidUSD: number;
    taxExposureMYR: number;
    flaggedForgedUSD: number;
  } | null>(null);

  // Transfer pricing interactive simulator
  const [loanPrincipalMYR, setLoanPrincipalMYR] = useState<number>(10000000);
  const [benchmarkRatePct, setBenchmarkRatePct] = useState<number>(4.85);

  useEffect(() => {
    fetch('/api/dossier/target')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setTarget(j.data);
      });

    fetch('/api/dossier/entities')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setEntities(j.data);
      });
  }, []);

  // Compute Section 140A monthly deemed interest: I = 1/12 * A * B
  const monthlyDeemedInterest = (1 / 12) * loanPrincipalMYR * (benchmarkRatePct / 100);
  const annualDeemedInterest = monthlyDeemedInterest * 12;
  const corporateTaxDeemed = annualDeemedInterest * 0.24; // 24% standard Malaysian CIT
  const section113Penalty = corporateTaxDeemed * 0.45; // 45% standard penalty under subsection 113(2)

  return (
    <div className="space-y-8" id="forensic-dossier-container">
      {/* Target Identity Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-8 h-8 text-rose-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Primary Investigation Subject
                </span>
                <span className="text-xs text-slate-400">JPN National Registry Verified</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white mt-1">
                {target?.fullName || 'Kavinath Ganeshan'}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2 font-mono">
                <span className="bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                  NRIC: {target?.nric || '960906-08-5839'}
                </span>
                <span className="bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                  Birth Index: Ipoh, Perak / Johor Bahru
                </span>
                <span className="bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                  Status: {target?.status || 'Active Audit Subject'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Assessed Tax Debt</div>
              <div className="text-sm font-black text-rose-400 mt-1">MYR 56.42M</div>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Offshore Target</div>
              <div className="text-sm font-black text-emerald-400 mt-1">USD 35.00M</div>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Domestic Liquid</div>
              <div className="text-sm font-black text-amber-400 mt-1">MYR 300K</div>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Forged Balance</div>
              <div className="text-sm font-black text-purple-400 mt-1">USD 2.00M</div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Jurisdictional Entity Architecture */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Reconciled Corporate & Asset Architecture</h2>
            <p className="text-xs text-slate-500">Cross-border holdings mapped through MyGDX, SSM, e-Kehakiman, and ICIJ</p>
          </div>
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
            {entities.length} Operational Nodes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {entities.map((entity) => (
            <div
              key={entity.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                    {entity.operatingJurisdiction.includes('Malaysia') && <Building2 className="w-4 h-4" />}
                    {entity.operatingJurisdiction.includes('Switzerland') && <Globe className="w-4 h-4 text-blue-600" />}
                    {entity.operatingJurisdiction.includes('Cayman') && <Shield className="w-4 h-4 text-purple-600" />}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {entity.operatingJurisdiction}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">{entity.entityName}</h3>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    entity.riskRating === 'CRITICAL'
                      ? 'bg-rose-100 text-rose-800'
                      : entity.riskRating === 'HIGH'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {entity.riskRating}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Identifier / Ref:</span>
                  <span className="font-mono font-bold text-slate-800">{entity.identifierReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Legal Status:</span>
                  <span className="font-semibold text-slate-700">{entity.legalStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Value / Target:</span>
                  <span className="font-bold text-slate-950">{entity.financialValue}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-100">
                {entity.notes}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Statutory Tax Penalty Simulator & Transfer Pricing Math */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-700">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Transfer Pricing Statutory Arm's Length Calculator</h3>
              <p className="text-xs text-slate-500">
                Income Tax Act 1967 Section 140A(3C) Formula: <code className="font-mono text-amber-700 font-bold">I = 1/12 * A * B</code>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sim-loan-principal" className="block text-xs font-semibold text-slate-700 mb-1">
                Loan Principal (A) – In MYR
              </label>
              <input
                id="sim-loan-principal"
                type="number"
                step="500000"
                value={loanPrincipalMYR}
                onChange={(e) => setLoanPrincipalMYR(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label htmlFor="sim-benchmark-rate" className="block text-xs font-semibold text-slate-700 mb-1">
                LHDN Benchmark Interest Rate (B) – % Per Annum
              </label>
              <input
                id="sim-benchmark-rate"
                type="number"
                step="0.05"
                value={benchmarkRatePct}
                onChange={(e) => setBenchmarkRatePct(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div>
                <div className="text-[10px] font-bold text-amber-800 uppercase">Monthly Deemed Int.</div>
                <div className="text-sm font-black text-amber-950 mt-0.5">
                  MYR {monthlyDeemedInterest.toLocaleString('en-MY', { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-amber-800 uppercase">Annual Deemed Int.</div>
                <div className="text-sm font-black text-amber-950 mt-0.5">
                  MYR {annualDeemedInterest.toLocaleString('en-MY', { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-amber-800 uppercase">CIT Adjustment (24%)</div>
                <div className="text-sm font-black text-amber-950 mt-0.5">
                  MYR {corporateTaxDeemed.toLocaleString('en-MY', { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-amber-800 uppercase">Sec 113 Penalty (45%)</div>
                <div className="text-sm font-black text-rose-700 mt-0.5">
                  MYR {section113Penalty.toLocaleString('en-MY', { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <p>
              <strong>Audit Application:</strong> When non-interest bearing or non-arm's length advances flow between domestic node <em>Kavinath Holdings Sdn Bhd</em> and foreign shell <em>Archon Holdings SA</em>, LHDN enforces Section 140A surcharges plus Section 113 incorrect return penalties.
            </p>
          </div>
        </div>

        {/* Right 5 Cols: Multi-Jurisdictional Asset Recovery Synthesis */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Cross-Jurisdictional Asset Recovery Synthesis</h3>
              <p className="text-xs text-slate-500">Domestic Deficit vs International Liquidity</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">1. Domestic Realizable Assets</div>
                <div className="text-[11px] text-slate-500">RHB Privilege (Suit 4-334567, Sub-Judice)</div>
              </div>
              <span className="font-mono font-bold text-sm text-slate-900">MYR 300,000</span>
            </div>

            <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-rose-900">2. Assessed Tax Liabilities Demand</div>
                <div className="text-[11px] text-rose-700">LHDN Notices under ITA 1967 Sections 4(c) & 113</div>
              </div>
              <span className="font-mono font-bold text-sm text-rose-700">MYR 56,420,000</span>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-emerald-900">3. Offshore Unencumbered Target</div>
                <div className="text-[11px] text-emerald-700">Archon Holdings SA (Lombard Odier, Geneva)</div>
              </div>
              <span className="font-mono font-bold text-sm text-emerald-700">USD 35,000,000</span>
            </div>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 text-xs">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Strategic Recovery Directive
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Because domestic liquid assets (MYR 300k) represent less than 0.6% of statutory liabilities (MYR 56.42M), asset recovery requires a <strong>Mutual Legal Assistance in Criminal Matters (MACMA)</strong> request directed to the Swiss Federal Department of Justice and Police (FDJP) targeting Account <code className="text-cyan-300">ch9300767000usd000001</code> at Lombard Odier.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
