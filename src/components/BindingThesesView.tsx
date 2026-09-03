import {
  Scale,
  ShieldCheck,
  Award,
  Gavel,
  BookOpen,
} from 'lucide-react';
import type { CompleteForensicThesisDossier } from '../shared/types';

interface BindingThesesViewProps {
  theses: CompleteForensicThesisDossier['bindingLegalTheses'];
}

export function BindingThesesView({ theses }: BindingThesesViewProps) {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-amber-600" />
          <h3 className="text-base font-bold text-slate-900">
            The Five Binding Legal Theses (Proven Beyond Reasonable Doubt)
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Statutory theses grounded in statutory law, laboratory biological verifications, and unanimous apex judicial precedents. Each thesis stands uncontroverted and binding under the doctrine of res judicata.
        </p>
      </div>

      <div className="space-y-4">
        {theses.map((th, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition"
          >
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="font-bold text-sm tracking-wide text-amber-300">
                  LEGAL THESIS {idx + 1}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
                PROVEN BEYOND REASONABLE DOUBT
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {th.thesisStatement}
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-600 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    Statutory Framework:
                  </div>
                  <div className="font-medium text-slate-900">
                    {th.statutorySection}
                  </div>
                </div>

                <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200 space-y-1 md:col-span-2">
                  <div className="font-bold text-amber-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    Evidentiary Proof:
                  </div>
                  <div className="text-slate-800 leading-relaxed">
                    {th.evidentiaryProof}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/70 rounded-lg border border-indigo-200 text-xs text-indigo-950 flex items-start gap-2">
                <Gavel className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-indigo-900">Binding Judicial Precedent: </strong>
                  <span className="italic">{th.unanimousJudicialPrecedent}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
