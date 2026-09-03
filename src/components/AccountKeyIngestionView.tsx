import { useState, type FormEvent } from 'react';
import {
  UserCheck,
  Key,
  Shield,
  Fingerprint,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Building2,
  Lock,
  Mail,
  BadgeAlert,
  Sparkles,
  Award,
} from 'lucide-react';
import type { OfficerAccount, IngestedKeySet, ClearanceLevel } from '../shared/types';

interface Props {
  account: OfficerAccount | null;
  onAccountUpdated: (updated: OfficerAccount) => void;
}

export function AccountKeyIngestionView({ account, onAccountUpdated }: Props) {
  const [formData, setFormData] = useState({
    fullName: account?.fullName || 'Senior Investigator Mohd Z. Farhan',
    badgeNumber: account?.badgeNumber || 'LHDN-SPEC-7712',
    email: account?.email || 'm.farhan@hasil.gov.my',
    organization: account?.organization || 'Inland Revenue Board of Malaysia (LHDN)',
    role: account?.role || 'Senior Forensic Investigator & Asset Recovery Specialist',
    clearanceLevel: (account?.clearanceLevel || 'TOP_SECRET') as ClearanceLevel,
  });

  const [keySet, setKeySet] = useState<IngestedKeySet>({
    mygdxConsumerKey: 'MAMPU_MYGDX_PROD_KEY_8829',
    mygdxConsumerSecret: 'sec_mygdx_prod_7782910398402918',
    ssmUserId: 'SSM_ENFORCE_AGENT_441',
    ssmSecretToken: 'tok_ssm_restricted_482910394820',
    ssmSigningSecret: 'sign_hmac_ssm_992810394820192',
    eKehakimanToken: 'ekehakiman_mcp_access_tok_882910',
    icijApiKey: 'icij_offshoreleaks_reconcile_token_3381',
  });

  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [isIngestingKeys, setIsIngestingKeys] = useState(false);
  const [accountSuccessMsg, setAccountSuccessMsg] = useState<string | null>(null);
  const [ingestSuccessMsg, setIngestSuccessMsg] = useState<string | null>(null);
  const [copiedFingerprint, setCopiedFingerprint] = useState(false);

  const handleSaveAccount = async (e: FormEvent) => {
    e.preventDefault();
    setIsSavingAccount(true);
    setAccountSuccessMsg(null);
    try {
      const res = await fetch('/api/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        onAccountUpdated(data.data);
        setAccountSuccessMsg('Officer credential profile updated and cryptographically attested.');
        setTimeout(() => setAccountSuccessMsg(null), 4000);
      }
    } catch {
      // ignore
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handleIngestKeys = async (e: FormEvent) => {
    e.preventDefault();
    setIsIngestingKeys(true);
    setIngestSuccessMsg(null);
    try {
      const res = await fetch('/api/keys/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keySet),
      });
      const data = await res.json();
      if (data.success) {
        onAccountUpdated(data.data.account);
        setIngestSuccessMsg(`All 4 credential sets ingested successfully! Cryptographic signature: ${data.data.fingerprint.slice(0, 24)}...`);
        setTimeout(() => setIngestSuccessMsg(null), 5000);
      }
    } catch {
      // ignore
    } finally {
      setIsIngestingKeys(false);
    }
  };

  const copyFingerprint = () => {
    if (account?.keyFingerprint) {
      navigator.clipboard.writeText(account.keyFingerprint);
      setCopiedFingerprint(true);
      setTimeout(() => setCopiedFingerprint(false), 2000);
    }
  };

  return (
    <div className="space-y-8" id="account-key-ingestion-container">
      {/* Top Banner: Verification Security State */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <Shield className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Officer Credential Registry & Ingestion Gateway
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {account?.clearanceLevel || 'TOP_SECRET'} CLEARANCE
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                Authorized access point for Malaysian Government Central Data Exchange (MyGDX), restricted Suruhanjaya Syarikat Malaysia (SSM) brokers, e-Kehakiman court docket protocols, and ICIJ offshore reconciliation API.
              </p>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700/80 shrink-0">
            <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5">
              <Fingerprint className="w-4 h-4 text-cyan-400" />
              Cryptographic Ingestion Hash
            </div>
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono text-cyan-300 bg-slate-900 px-2 py-1 rounded border border-cyan-900/60 max-w-[240px] truncate">
                {account?.keyFingerprint || 'SHA256:NOT_INGESTED'}
              </code>
              <button
                type="button"
                id="copy-fingerprint-btn"
                onClick={copyFingerprint}
                className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                title="Copy full cryptographic SHA-256 fingerprint"
              >
                {copiedFingerprint ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Last Verified: {account?.lastLogin ? new Date(account.lastLogin).toLocaleTimeString() : 'Active'}
            </div>
          </div>
        </div>

        {/* Ingested Status Badges */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center gap-2.5 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700/50">
            <div className={`w-2.5 h-2.5 rounded-full ${account?.ingestionStatus.mygdx ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-rose-400'}`} />
            <div className="text-xs">
              <div className="font-semibold text-slate-200">MyGDX Gateway</div>
              <div className="text-[10px] text-slate-400">{account?.ingestionStatus.mygdx ? 'Keys Ingested' : 'Missing'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700/50">
            <div className={`w-2.5 h-2.5 rounded-full ${account?.ingestionStatus.ssm ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-rose-400'}`} />
            <div className="text-xs">
              <div className="font-semibold text-slate-200">SSM Restricted API</div>
              <div className="text-[10px] text-slate-400">{account?.ingestionStatus.ssm ? 'Token Active' : 'Missing'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700/50">
            <div className={`w-2.5 h-2.5 rounded-full ${account?.ingestionStatus.eKehakiman ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-rose-400'}`} />
            <div className="text-xs">
              <div className="font-semibold text-slate-200">e-Kehakiman Judicial</div>
              <div className="text-[10px] text-slate-400">{account?.ingestionStatus.eKehakiman ? 'S/N Protocol Active' : 'Missing'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700/50">
            <div className={`w-2.5 h-2.5 rounded-full ${account?.ingestionStatus.icij ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-rose-400'}`} />
            <div className="text-xs">
              <div className="font-semibold text-slate-200">ICIJ Offshore Database</div>
              <div className="text-[10px] text-slate-400">{account?.ingestionStatus.icij ? 'Reconciled' : 'Missing'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Section 1: Officer Account Profile (Left 5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Officer Identification Profile</h3>
              <p className="text-xs text-slate-500">Official agency identification & role authorization</p>
            </div>
          </div>

          {accountSuccessMsg && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{accountSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveAccount} className="space-y-4" id="officer-account-form">
            <div>
              <label htmlFor="officer-fullName" className="block text-xs font-semibold text-slate-700 mb-1">
                Officer Full Name
              </label>
              <input
                id="officer-fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="officer-badgeNumber" className="block text-xs font-semibold text-slate-700 mb-1">
                  Badge / Officer ID
                </label>
                <input
                  id="officer-badgeNumber"
                  type="text"
                  value={formData.badgeNumber}
                  onChange={(e) => setFormData({ ...formData, badgeNumber: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="officer-clearance" className="block text-xs font-semibold text-slate-700 mb-1">
                  Clearance Level
                </label>
                <select
                  id="officer-clearance"
                  value={formData.clearanceLevel}
                  onChange={(e) => setFormData({ ...formData, clearanceLevel: e.target.value as ClearanceLevel })}
                  className="w-full px-3.5 py-2 text-sm font-semibold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="RESTRICTED">RESTRICTED</option>
                  <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                  <option value="SECRET">SECRET</option>
                  <option value="TOP_SECRET">TOP SECRET</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="officer-agency" className="block text-xs font-semibold text-slate-700 mb-1">
                Government Agency / Institutional Body
              </label>
              <select
                id="officer-agency"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="Inland Revenue Board of Malaysia (LHDN)">Inland Revenue Board of Malaysia (LHDN)</option>
                <option value="Suruhanjaya Syarikat Malaysia (SSM)">Suruhanjaya Syarikat Malaysia (SSM)</option>
                <option value="Bank Negara Malaysia (BNM) - FIU">Bank Negara Malaysia (BNM) - Financial Intelligence Unit</option>
                <option value="Royal Malaysia Police (PDRM) - CCID">PDRM Commercial Crimes Investigation Dept (CCID)</option>
                <option value="MAMPU / Digital Ministry">MAMPU / Ministry of Digital</option>
                <option value="Approved Government-Linked Company (GLC)">Approved Government-Linked Company (GLC)</option>
              </select>
            </div>

            <div>
              <label htmlFor="officer-role" className="block text-xs font-semibold text-slate-700 mb-1">
                Designated Unit & Role
              </label>
              <input
                id="officer-role"
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="officer-email" className="block text-xs font-semibold text-slate-700 mb-1">
                Official Email (.gov.my or institutional domain)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="officer-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                id="save-officer-profile-btn"
                disabled={isSavingAccount}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSavingAccount ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
                {isSavingAccount ? 'Attesting Profile...' : 'Save & Attest Officer Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Section 2: Key Ingestion Matrix (Right 7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Cryptographic Key Ingestion Matrix</h3>
                <p className="text-xs text-slate-500">Inject secret tokens for MyGDX, SSM, e-Kehakiman, and ICIJ</p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              AES-256-GCM / SHA-256
            </span>
          </div>

          {ingestSuccessMsg && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{ingestSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleIngestKeys} className="space-y-5" id="key-ingestion-form">
            {/* 1. MyGDX Credentials */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">1. MyGDX Consumer Credentials</span>
                </div>
                <span className="text-[11px] text-slate-500">MAMPU Central Gateway</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="key-mygdxConsumerKey" className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Consumer Key (Public ID)
                  </label>
                  <input
                    id="key-mygdxConsumerKey"
                    type="text"
                    value={keySet.mygdxConsumerKey}
                    onChange={(e) => setKeySet({ ...keySet, mygdxConsumerKey: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded bg-white focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="key-mygdxConsumerSecret" className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Consumer Secret (HMAC Signing)
                  </label>
                  <input
                    id="key-mygdxConsumerSecret"
                    type="password"
                    value={keySet.mygdxConsumerSecret}
                    onChange={(e) => setKeySet({ ...keySet, mygdxConsumerSecret: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded bg-white focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 2. SSM Restricted Endpoint Access */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">2. SSM Restricted Status API Access</span>
                </div>
                <span className="text-[11px] text-slate-500">ROC / ROB / LLP Broker</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="key-ssmUserId" className="block text-[11px] font-semibold text-slate-600 mb-1">
                    SSM Agent User ID
                  </label>
                  <input
                    id="key-ssmUserId"
                    type="text"
                    value={keySet.ssmUserId}
                    onChange={(e) => setKeySet({ ...keySet, ssmUserId: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded bg-white focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="key-ssmSecretToken" className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Secret API Token
                  </label>
                  <input
                    id="key-ssmSecretToken"
                    type="password"
                    value={keySet.ssmSecretToken}
                    onChange={(e) => setKeySet({ ...keySet, ssmSecretToken: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded bg-white focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="key-ssmSigningSecret" className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Payload Signing Secret
                  </label>
                  <input
                    id="key-ssmSigningSecret"
                    type="password"
                    value={keySet.ssmSigningSecret}
                    onChange={(e) => setKeySet({ ...keySet, ssmSigningSecret: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded bg-white focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 3. e-Kehakiman & ICIJ Access Keys */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-xs font-bold text-slate-800">3. e-Kehakiman Token</span>
                </div>
                <label htmlFor="key-eKehakimanToken" className="block text-[11px] text-slate-500 mb-1">
                  Court Docket S/N Protocol Bearer
                </label>
                <input
                  id="key-eKehakimanToken"
                  type="password"
                  value={keySet.eKehakimanToken}
                  onChange={(e) => setKeySet({ ...keySet, eKehakimanToken: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded bg-white focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs font-bold text-slate-800">4. ICIJ Offshore API Key</span>
                </div>
                <label htmlFor="key-icijApiKey" className="block text-[11px] text-slate-500 mb-1">
                  Panama / Pandora Leaks Cross-Check
                </label>
                <input
                  id="key-icijApiKey"
                  type="password"
                  value={keySet.icijApiKey}
                  onChange={(e) => setKeySet({ ...keySet, icijApiKey: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded bg-white focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                id="ingest-keys-submit-btn"
                disabled={isIngestingKeys}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isIngestingKeys ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4 h-4" />}
                {isIngestingKeys ? 'Ingesting & Calculating SHA-256 Fingerprint...' : 'Ingest Keys & Generate Cryptographic Fingerprint'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
