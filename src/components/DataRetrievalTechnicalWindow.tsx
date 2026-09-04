import { useState } from 'react';
import {
  ExternalLink,
  Server,
  Key,
  ShieldCheck,
  Cpu,
  Database,
  Terminal,
  Code,
  Globe,
  Layers,
  Copy,
  Check,
  Printer,
  X,
  FileCheck,
  Coins,
  CheckCircle2,
} from 'lucide-react';
import { TWENTY_STRATEGIC_INTEGRATIONS } from '../shared/twentyIntegrationsData';

interface DataRetrievalTechnicalWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DataRetrievalTechnicalWindow({ isOpen, onClose }: DataRetrievalTechnicalWindowProps) {
  const [activeSubTab, setActiveSubTab] = useState<
    'pipeline' | 'sources' | 'twenty_integrations' | 'protocols' | 'crypto_90a' | 'swift_telemetry' | 'code_methods'
  >('pipeline');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  // Function to open the complete specification in a truly separate browser window
  const openInSeparateWindow = () => {
    const popout = window.open('', '_blank', 'width=1200,height=850,menubar=no,toolbar=no,location=no,status=no');
    if (!popout) {
      alert('Pop-up was blocked. Please allow pop-ups for this site to open the specification in a separate window.');
      return;
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Forensic Data Retrieval & Ingestion Architecture Specification</title>
  <style>
    :root {
      --bg: #0b0f19;
      --card-bg: #111827;
      --border: #1f2937;
      --text: #e5e7eb;
      --text-dim: #9ca3af;
      --accent-blue: #3b82f6;
      --accent-emerald: #10b981;
      --accent-amber: #f59e0b;
      --accent-purple: #8b5cf6;
      --code-bg: #030712;
    }
    body {
      margin: 0;
      padding: 32px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
    }
    .header {
      border-bottom: 2px solid var(--border);
      padding-bottom: 24px;
      margin-bottom: 32px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    h1 { margin: 0 0 8px 0; font-size: 26px; color: #ffffff; letter-spacing: -0.02em; }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      margin-right: 8px;
    }
    .badge-blue { background: rgba(59, 130, 246, 0.2); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.4); }
    .badge-emerald { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.4); }
    .badge-amber { background: rgba(245, 158, 11, 0.2); color: #fcd34d; border: 1px solid rgba(245, 158, 11, 0.4); }
    .section { margin-bottom: 40px; }
    h2 { font-size: 20px; color: #f3f4f6; border-left: 4px solid var(--accent-blue); padding-left: 12px; margin-bottom: 16px; }
    h3 { font-size: 16px; color: #93c5fd; margin-top: 24px; }
    p { margin-bottom: 12px; font-size: 14px; color: #d1d5db; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 13px;
    }
    th, td {
      border: 1px solid var(--border);
      padding: 10px 14px;
      text-align: left;
    }
    th { background: #1f2937; color: #f9fafb; font-weight: 600; }
    tr:nth-child(even) { background: rgba(17, 24, 39, 0.7); }
    tr:hover { background: rgba(31, 41, 55, 0.5); }
    code, pre {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      background: var(--code-bg);
      border: 1px solid var(--border);
      border-radius: 6px;
    }
    code { padding: 2px 6px; font-size: 12px; color: #fcd34d; }
    pre { padding: 16px; overflow-x: auto; font-size: 12px; line-height: 1.5; color: #e5e7eb; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; margin: 16px 0; }
    .card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 8px; padding: 16px; }
    .card-title { font-weight: 700; color: #ffffff; font-size: 14px; margin-bottom: 8px; }
    .btn-print {
      background: #2563eb;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-print:hover { background: #1d4ed8; }
    @media print {
      body { background: #fff; color: #000; padding: 16px; }
      .header, h2, h3, th { color: #000 !important; }
      pre, code { background: #f3f4f6 !important; color: #000 !important; border-color: #ccc !important; }
      .btn-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>Forensic Data Retrieval & Ingestion Architecture Specification</h1>
      <p style="margin: 0;">Comprehensive Technical Blueprint: Protocols, Cryptographic Hashing, Statutory Grounds & All 18 Data Sources</p>
      <div style="margin-top: 8px;">
        <span class="badge badge-blue">MyGDX Gateway REST</span>
        <span class="badge badge-emerald">Model Context Protocol (MCP)</span>
        <span class="badge badge-amber">Evidence Act 1950 S.90A</span>
      </div>
    </div>
    <button class="btn-print" onclick="window.print()">Print / Export PDF</button>
  </div>

  <div class="section">
    <h2>1. Executive Architectural Overview & Retrieval Lifecycle</h2>
    <p>
      The SSM Middleware and Forensic Ingestion Engine is engineered to extract, normalize, and cross-reconcile corporate, civil, judicial, and financial records from multiple domestic and offshore authorities. Every payload transitions through a deterministic, five-phase verification lifecycle:
    </p>
    <div class="grid">
      <div class="card">
        <div class="card-title">Phase 1: Authenticated Ingestion & Gateways</div>
        <p style="font-size: 13px;">Secure queries dispatched to MyGDX endpoints via mutual TLS and HMAC-SHA256 signatures, alongside Model Context Protocol (MCP) JSON-RPC 2.0 tool execution.</p>
      </div>
      <div class="card">
        <div class="card-title">Phase 2: Targeted Scraping & OCR</div>
        <p style="font-size: 13px;">High-precision spiders crawl gazettes and court registers, extracting text, PDF streams, XMP metadata, and certifying timestamps.</p>
      </div>
      <div class="card">
        <div class="card-title">Phase 3: Cryptographic Integrity Sealing</div>
        <p style="font-size: 13px;">Immediate derivation of SHA-256 digests over raw payload bytes using native crypto libraries. Recorded in immutable audit logs under Evidence Act 1950 Section 90A.</p>
      </div>
      <div class="card">
        <div class="card-title">Phase 4: Multi-Dimensional Discrepancy Reconciliation</div>
        <p style="font-size: 13px;">Cross-checks JPN birth registries against probate dockets, SSM superforms against proxy nominee claims, and SWIFT MT103 logs against escrow accounts.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>2. Complete Inventory of All 18 Authoritative Data Sources</h2>
    <table>
      <thead>
        <tr>
          <th>Ref ID</th>
          <th>Issuing Authority / Agency</th>
          <th>Domain / Jurisdiction</th>
          <th>Protocol / Access Method</th>
          <th>Statutory Basis / Mandate</th>
          <th>Data Schema Extracted</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>SRC-01</strong></td>
          <td>Suruhanjaya Syarikat Malaysia (SSM)</td>
          <td>Corporate Registry (ROC/ROB/LLP)</td>
          <td>MyGDX REST + HMAC-SHA256</td>
          <td>Companies Act 2016 (Act 777)</td>
          <td>Form 9/Sec 17 Inc Cert, Sec 14 Superform, Share Allotments, Directorships</td>
        </tr>
        <tr>
          <td><strong>SRC-02</strong></td>
          <td>MyGDX (Unit Pemodenan Tadbiran MAMPU)</td>
          <td>Federal Government Data Exchange</td>
          <td>mTLS, Agency Code Auth, Bearer Token</td>
          <td>National Data Sharing Policy</td>
          <td>Inter-agency status envelopes, agency routing metadata, audit signatures</td>
        </tr>
        <tr>
          <td><strong>SRC-03</strong></td>
          <td>Model Context Protocol (MCP) Gateway</td>
          <td>JSON-RPC 2.0 Engine / AI Tools</td>
          <td>HTTP POST /mcp + Server-Sent Events</td>
          <td>MCP Standard Spec 2024-11</td>
          <td>Structured tool calls, live resource schemas (ssm://), context prompts</td>
        </tr>
        <tr>
          <td><strong>SRC-04</strong></td>
          <td>e-Kehakiman / Malaysian Judiciary Portal</td>
          <td>Federal & High Court of Malaya</td>
          <td>HTTPS API / e-Filing Scraper</td>
          <td>Rules of Court 2012 / CJA 1964</td>
          <td>Cause Papers, Originating Summons, Case Dockets, Grounds of Judgment</td>
        </tr>
        <tr>
          <td><strong>SRC-05</strong></td>
          <td>Jabatan Pendaftaran Negara (JPN)</td>
          <td>Civil Registration Department</td>
          <td>Civil Status Gazette & MyGDX</td>
          <td>Births and Deaths Registration Act 1957</td>
          <td>Birth Certificate Extracts, Paternity Acknowledgment, Citizenship status</td>
        </tr>
        <tr>
          <td><strong>SRC-06</strong></td>
          <td>Jabatan Kimia Malaysia (Forensic DNA)</td>
          <td>Forensic Science Division (Petaling Jaya)</td>
          <td>Certified PDF Ledger / Locus Report</td>
          <td>DNA Identification Act 2009 (Act 699)</td>
          <td>16-Loci STR Profiles, Allelic Frequencies, 99.9999% Biological Probability</td>
        </tr>
        <tr>
          <td><strong>SRC-07</strong></td>
          <td>High Court Probate & Administration Registry</td>
          <td>Probate Division (Kuala Lumpur & Ipoh)</td>
          <td>Civil Docket Index & Cause Papers</td>
          <td>Probate & Administration Act 1959 (Act 97)</td>
          <td>Original Last Will & Testament, Grants of Probate, Letter of Admin, Codicils</td>
        </tr>
        <tr>
          <td><strong>SRC-08</strong></td>
          <td>High Court Power of Attorney Depository</td>
          <td>Senior Assistant Registrar Depository</td>
          <td>Act 424 Physical & Electronic Rolls</td>
          <td>Powers of Attorney Act 1949 (Act 424) S.4</td>
          <td>PA Registration Number, Irrevocable Agency Clauses, Revocation Notices</td>
        </tr>
        <tr>
          <td><strong>SRC-09</strong></td>
          <td>SWIFT Network (Society for Worldwide Interbank)</td>
          <td>Interbank Financial Telecommunication</td>
          <td>FIN MT103 / MT202 Wire Extract</td>
          <td>ISO 15022 / ISO 20022 Financial Standards</td>
          <td>TRN (:20), Value Date/Amount (:32A), Ordering Cust (:50K), Beneficiary (:59)</td>
        </tr>
        <tr>
          <td><strong>SRC-10</strong></td>
          <td>Veridian Trust Settlement System</td>
          <td>Private Offshore Escrow & Trustees</td>
          <td>Escrow Ledger API / Wire Callback</td>
          <td>Trust Companies Act 1949 / Offshore Law</td>
          <td>Settlement Schedules, Escrow Tranches, Covenants, UBO Certificates</td>
        </tr>
        <tr>
          <td><strong>SRC-11</strong></td>
          <td>ICIJ Offshore Leaks Database</td>
          <td>International Consortium of Journalists</td>
          <td>Reconcile API v1 / Neo4j Graph</td>
          <td>Cross-Border Beneficial Ownership</td>
          <td>Panama/Paradise/Pandora Papers nodes, shell companies, nominee directors</td>
        </tr>
        <tr>
          <td><strong>SRC-12</strong></td>
          <td>CourtListener API (Free Law Project)</td>
          <td>United States & International Jurisprudence</td>
          <td>REST API v4 /search/</td>
          <td>Open Legal Citations Protocol</td>
          <td>Common law precedents on constructive trusts, agency fraud, Section 468</td>
        </tr>
        <tr>
          <td><strong>SRC-13</strong></td>
          <td>Federal Gazette (Warta Kerajaan Persekutuan)</td>
          <td>Attorney General's Chambers (AGC)</td>
          <td>AGC LOM Electronic Portal</td>
          <td>Interpretation Acts 1948 and 1967</td>
          <td>Gazette notifications, compulsory acquisition, statutory forfeiture orders</td>
        </tr>
        <tr>
          <td><strong>SRC-14</strong></td>
          <td>Polis Diraja Malaysia (PDRM CCID)</td>
          <td>Commercial Crime Investigation Dept</td>
          <td>Classified Police Report Ingestion</td>
          <td>Penal Code (Act 574) Sec 468/471</td>
          <td>First Information Reports (FIR), Forensic handwriting audits, interrogation logs</td>
        </tr>
        <tr>
          <td><strong>SRC-15</strong></td>
          <td>Lembaga Hasil Dalam Negeri (LHDN)</td>
          <td>Inland Revenue Board of Malaysia</td>
          <td>MyInvois / Stamp Duty Assessment Portal</td>
          <td>Stamp Act 1949 (Act 378)</td>
          <td>Adjudication endorsements, digital stamp duty certificates, Section 44 audits</td>
        </tr>
        <tr>
          <td><strong>SRC-16</strong></td>
          <td>BVI Financial Services Commission</td>
          <td>Registry of Corporate Affairs (Road Town)</td>
          <td>VIRRGIN System Search</td>
          <td>BVI Business Companies Act 2004</td>
          <td>Certificate of Good Standing, Register of Charges, Registered Agent details</td>
        </tr>
        <tr>
          <td><strong>SRC-17</strong></td>
          <td>Registre du Commerce de Genève (Switzerland)</td>
          <td>Cantonal Commercial Registry Office</td>
          <td>Zefix / Cantonal Registry Extract</td>
          <td>Swiss Code of Obligations (Art. 927)</td>
          <td>Handelsregisterauszug, Authorized signatories, Share capital depositions</td>
        </tr>
        <tr>
          <td><strong>SRC-18</strong></td>
          <td>Bank Negara Malaysia (BNM FIED)</td>
          <td>Financial Intelligence and Enforcement Dept</td>
          <td>Regulatory Compliance Registry</td>
          <td>Anti-Money Laundering Act 2001 (AMLA)</td>
          <td>Section 4(1) asset freeze orders, Politically Exposed Person (PEP) lists</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>3. Technical Protocols, Cryptographic Signatures & Network Handshakes</h2>
    <h3>A. MyGDX HMAC-SHA256 Request Signing Specification</h3>
    <p>
      Every request destined for the Malaysian Government Central Data Exchange is cryptographically signed at the HTTP transport layer to guarantee message integrity and non-repudiation:
    </p>
    <pre>
Signature Payload String = HTTP_METHOD + "\\n" + REQUEST_PATH + "\\n" + TIMESTAMP_ISO + "\\n" + CONSUMER_SECRET
Signature = Base64(HMAC_SHA256(SecretKey, SignaturePayloadString))

Outbound HTTP Headers:
  X-MYGDX-CONSUMER-KEY:    [Registered Agency Consumer Key]
  X-MYGDX-TIMESTAMP:       2026-09-04T03:54:08.000Z
  X-MYGDX-SIGNATURE:       4f9a7b2c8e1d... (Base64 HMAC Digest)
  X-MYGDX-AGENCY-CODE:     AGENCY_LHDN_01
  X-SSM-USER-ID:           SSM_CORP_USER_882
  X-SSM-BEARER-TOKEN:      Bearer sec_ssm_prod_8237492837492348
  Content-Type:            application/json
    </pre>

    <h3>B. Model Context Protocol (MCP) JSON-RPC 2.0 Ingestion</h3>
    <pre>
POST /mcp HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": "req-9921",
  "method": "tools/call",
  "params": {
    "name": "get_ssm_company_status",
    "arguments": {
      "registrationNumber": "1199837-7",
      "entityType": "ROC",
      "verifyIntegrity": true
    }
  }
}
    </pre>
  </div>

  <div class="section">
    <h2>4. Evidence Act 1950 Section 90A Computer Output Certification</h2>
    <p>
      Under <strong>Section 90A(1) of the Evidence Act 1950 (Act 56)</strong>, a document produced by a computer is admissible in any civil or criminal proceeding as evidence of any fact stated therein, provided it was produced in the course of ordinary lawful operation.
    </p>
    <p>
      To satisfy <strong>Section 90A(2)</strong>, our middleware executes the following algorithmic steps:
    </p>
    <ol style="font-size: 13px; color: #d1d5db; padding-left: 20px;">
      <li>Calculates the SHA-256 binary hash over the retrieved response payload immediately upon receipt.</li>
      <li>Records the server system uptime, interface name, source IP, and high-resolution UTC timestamp into an append-only audit log.</li>
      <li>Binds the certified deponent credentials (NRIC, Designation, Court Forum) to the payload metadata.</li>
      <li>Attaches the Certificate of Computer Output to all exported Cause Papers and PDF exhibits.</li>
    </ol>
  </div>

  <div class="section">
    <h2>5. SWIFT MT103 Telemetry & Financial Parsing Logic</h2>
    <pre>
SWIFT MT103 Single Customer Credit Transfer Tag Matrix:
  :20:  Transaction Reference Number (TRN) - 16 Alphanumeric characters
  :23B: Bank Operation Code (CRED)
  :32A: Value Date (YYMMDD), Currency Code (USD/CHF/MYR), Interbank Settled Amount
  :50K: Ordering Customer Name, Account Number, Address
  :52A: Ordering Institution BIC
  :53A: Sender's Correspondent BIC
  :54A: Receiver's Correspondent BIC
  :57A: Account With Institution (Beneficiary Bank BIC)
  :59:  Beneficiary Customer IBAN / Account & Full Legal Entity Name
  :70:  Remittance Information (Escrow Tranche Ref, Restitution Decree #)
  :71A: Details of Charges (OUR / SHA / BEN)
  :72:  Sender to Receiver Information (/REC/ /BNF/)
    </pre>
  </div>
</body>
</html>`;

    popout.document.open();
    popout.document.write(htmlContent);
    popout.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-6xl max-h-[92vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Data Retrieval & Forensic Architecture Specification</h3>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold border border-blue-500/30">
                  ALL 18 SOURCES
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                  EVIDENCE ACT 1950 S.90A
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Technical methods, cryptographic proofs, HMAC protocols, network pipelines & judicial admissibility
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openInSeparateWindow}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition"
              title="Open the complete specification in a separate dedicated browser window"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in Separate Window
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-800 bg-slate-950/40 flex gap-2 overflow-x-auto py-2">
          <button
            onClick={() => setActiveSubTab('pipeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeSubTab === 'pipeline'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            1. Pipeline Architecture
          </button>
          <button
            onClick={() => setActiveSubTab('sources')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeSubTab === 'sources'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            2. All 18 Data Sources
          </button>
          <button
            onClick={() => setActiveSubTab('twenty_integrations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeSubTab === 'twenty_integrations'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-300" />
            3. 20 Strategic Integrations
          </button>
          <button
            onClick={() => setActiveSubTab('protocols')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeSubTab === 'protocols'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            4. HMAC & MCP Protocols
          </button>
          <button
            onClick={() => setActiveSubTab('crypto_90a')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeSubTab === 'crypto_90a'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            4. Evidence Act S.90A Proof
          </button>
          <button
            onClick={() => setActiveSubTab('swift_telemetry')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeSubTab === 'swift_telemetry'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            5. SWIFT MT103 Ingestion
          </button>
          <button
            onClick={() => setActiveSubTab('code_methods')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeSubTab === 'code_methods'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            6. Code Snippets & Methods
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200 text-xs leading-relaxed">
          {/* TAB 1: PIPELINE ARCHITECTURE */}
          {activeSubTab === 'pipeline' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/50 via-slate-900 to-slate-900 border border-blue-800/40">
                <h4 className="text-sm font-bold text-blue-200 mb-1">End-to-End Forensic Data Ingestion Engine</h4>
                <p className="text-slate-300">
                  Data enters the system via authenticated government API gateways (MyGDX REST, MCP JSON-RPC 2.0),
                  specialized judicial scrapers, civil registry extractors, and financial network feeds. Every record
                  is immediately digested with SHA-256 for cryptographic non-repudiation under Evidence Act 1950 Section 90A.
                </p>
              </div>

              {/* Lifecycle Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px]">1</span>
                    Outbound Query Signing
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Every API request to MyGDX generates an HMAC-SHA256 signature using the registered agency secret over the HTTP method, endpoint path, and UTC ISO-8601 timestamp.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">2</span>
                    Instant Payload Digesting
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Raw binary response streams and PDF attachments are hashed using Web Crypto API and Node.js crypto.createHash('sha256') prior to database or cache persistence.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">3</span>
                    Brain AI Cross-Reconciliation
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Gemini AI models cross-examine extracted filings against court cause papers, JPN birth certificates, and offshore registries to unmask nominee ownership.
                  </p>
                </div>
              </div>

              {/* Data Flow Diagram Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300">
                <div className="text-amber-400 font-bold mb-2">// DATAFLOW ARCHITECTURE PIPELINE</div>
                <div className="space-y-1 text-slate-400">
                  <p className="text-emerald-400">[Client / Agent / Court Officer]</p>
                  <p className="pl-4">│  (HTTPS Bearer / MCP Tool Request)</p>
                  <p className="pl-4">▼</p>
                  <p className="text-blue-400">[SSM Middleware / Node.js Engine (:3000)]</p>
                  <p className="pl-4">├── Ingest Key Verification &amp; Clearance Checks</p>
                  <p className="pl-4">├── HMAC-SHA256 Signature Builder (`createSecureMyGdxHeaders`)</p>
                  <p className="pl-4">├── Dispatcher: REST Broker / MCP Tool Handler / Crawler Worker</p>
                  <p className="pl-4">│</p>
                  <p className="pl-4">├──► <span className="text-yellow-300">[MyGDX Gateway]</span> (SSM ROC/ROB/LLP Registry)</p>
                  <p className="pl-4">├──► <span className="text-purple-300">[e-Kehakiman Scraper]</span> (Civil/Commercial Cause Papers)</p>
                  <p className="pl-4">├──► <span className="text-cyan-300">[JPN / Jabatan Kimia]</span> (Civil Extracts &amp; DNA STR Loci)</p>
                  <p className="pl-4">├──► <span className="text-green-300">[SWIFT Wire Telemetry]</span> (MT103 / MT202 Settlement Tranches)</p>
                  <p className="pl-4">└──► <span className="text-pink-300">[ICIJ &amp; CourtListener]</span> (Beneficial Ownership &amp; Precedents)</p>
                  <p className="pl-4">│</p>
                  <p className="pl-4">▼</p>
                  <p className="text-amber-400">[Evidence Act 1950 S.90A Cryptographic Certifier]</p>
                  <p className="pl-4">├── SHA-256 Content Digesting</p>
                  <p className="pl-4">├── Append-Only Audit Logging</p>
                  <p className="pl-4">└── Court-Ready PDF Compilation with S.90A Jurat</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALL 18 DATA SOURCES */}
          {activeSubTab === 'sources' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Directory of All 18 Primary Forensic Sources</h4>
                  <p className="text-xs text-slate-400">
                    Comprehensive catalog of governmental, judicial, banking, and offshore entities integrated into the middleware
                  </p>
                </div>
                <button
                  onClick={openInSeparateWindow}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Pop-out Full Table
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-300 border-b border-slate-800">
                      <th className="p-3 font-bold">Ref</th>
                      <th className="p-3 font-bold">Authority / Agency</th>
                      <th className="p-3 font-bold">Domain &amp; Forum</th>
                      <th className="p-3 font-bold">Ingestion Method</th>
                      <th className="p-3 font-bold">Statutory Anchor</th>
                      <th className="p-3 font-bold">Extracted Payload</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-amber-400">SRC-01</td>
                      <td className="p-3 text-white font-sans font-semibold">Suruhanjaya Syarikat Malaysia (SSM)</td>
                      <td className="p-3 text-slate-400">ROC / ROB / LLP Registries</td>
                      <td className="p-3 text-blue-400">MyGDX REST + HMAC-SHA256</td>
                      <td className="p-3 text-slate-300">Companies Act 2016 (Act 777)</td>
                      <td className="p-3 text-slate-400">Superform, Form 9, Share Allotment, Directors</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-amber-400">SRC-02</td>
                      <td className="p-3 text-white font-sans font-semibold">MAMPU / MyGDX Central Gateway</td>
                      <td className="p-3 text-slate-400">Federal Gov Data Exchange</td>
                      <td className="p-3 text-blue-400">Mutual TLS + Agency Secret Auth</td>
                      <td className="p-3 text-slate-300">Gov Data Sharing Directives</td>
                      <td className="p-3 text-slate-400">Agency Token Exchange, Status Envelopes</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-amber-400">SRC-03</td>
                      <td className="p-3 text-white font-sans font-semibold">MCP Gateway &amp; Tool Server</td>
                      <td className="p-3 text-slate-400">Model Context Protocol Engine</td>
                      <td className="p-3 text-purple-400">JSON-RPC 2.0 / SSE (:3000/mcp)</td>
                      <td className="p-3 text-slate-300">MCP Standard Specification</td>
                      <td className="p-3 text-slate-400">Tool Calls, Live Resources (ssm://), Prompts</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-amber-400">SRC-04</td>
                      <td className="p-3 text-white font-sans font-semibold">e-Kehakiman (Malaysian Judiciary)</td>
                      <td className="p-3 text-slate-400">Federal &amp; High Court of Malaya</td>
                      <td className="p-3 text-emerald-400">Targeted Spider + PDF Parser</td>
                      <td className="p-3 text-slate-300">Rules of Court 2012 (O. 92 r. 4)</td>
                      <td className="p-3 text-slate-400">Originating Summons, Affidavits, Judgments</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-amber-400">SRC-05</td>
                      <td className="p-3 text-white font-sans font-semibold">Jabatan Pendaftaran Negara (JPN)</td>
                      <td className="p-3 text-slate-400">Civil Status &amp; Lineage</td>
                      <td className="p-3 text-blue-400">Civil Gazette Ingestion + OCR</td>
                      <td className="p-3 text-slate-300">Births &amp; Deaths Reg Act 1957</td>
                      <td className="p-3 text-slate-400">Birth Certificate Extracts, Paternity Records</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-amber-400">SRC-06</td>
                      <td className="p-3 text-white font-sans font-semibold">Jabatan Kimia Malaysia (Forensics)</td>
                      <td className="p-3 text-slate-400">Forensic DNA Laboratories (PJ)</td>
                      <td className="p-3 text-emerald-400">Certified PDF Extract + STR Matrix</td>
                      <td className="p-3 text-slate-300">DNA Identification Act 2009</td>
                      <td className="p-3 text-slate-400">16 STR Loci Profiles, 99.9999% Biological Match</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-amber-400">SRC-07</td>
                      <td className="p-3 text-white font-sans font-semibold">High Court Probate Registry</td>
                      <td className="p-3 text-slate-400">Probate &amp; Administration</td>
                      <td className="p-3 text-emerald-400">Cause Papers Index &amp; Testament</td>
                      <td className="p-3 text-slate-300">Probate &amp; Admin Act 1959 (Act 97)</td>
                      <td className="p-3 text-slate-400">Will &amp; Testament, Grant of Probate, Codicils</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-amber-400">SRC-08</td>
                      <td className="p-3 text-white font-sans font-semibold">Senior Assistant Registrar Depository</td>
                      <td className="p-3 text-slate-400">High Court of Malaya (KL/Ipoh)</td>
                      <td className="p-3 text-blue-400">Act 424 Official Roll Scraper</td>
                      <td className="p-3 text-slate-300">Powers of Attorney Act 1949</td>
                      <td className="p-3 text-slate-400">PA Roll Entry, Irrevocable Agency Clauses</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-amber-400">SRC-09</td>
                      <td className="p-3 text-white font-sans font-semibold">SWIFT Interbank Messaging</td>
                      <td className="p-3 text-slate-400">Global Financial Telecommunication</td>
                      <td className="p-3 text-yellow-400">FIN MT103/MT202 Telemetry Parser</td>
                      <td className="p-3 text-slate-300">ISO 15022 / ISO 20022</td>
                      <td className="p-3 text-slate-400">TRN (:20), Value Date, BICs, Remittance (:70)</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-amber-400">SRC-10</td>
                      <td className="p-3 text-white font-sans font-semibold">Veridian Trust Settlement System</td>
                      <td className="p-3 text-slate-400">Private Offshore Escrow Custody</td>
                      <td className="p-3 text-yellow-400">Restricted Escrow Ledger Callback</td>
                      <td className="p-3 text-slate-300">Trust Companies Act 1949</td>
                      <td className="p-3 text-slate-400">Tranche Schedules, Escrow Covenants, UBO Deeds</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-amber-400">SRC-11</td>
                      <td className="p-3 text-white font-sans font-semibold">ICIJ Offshore Leaks Database</td>
                      <td className="p-3 text-slate-400">Panama / Pandora / Paradise Leaks</td>
                      <td className="p-3 text-purple-400">Reconcile API v1 (reconcile.icij.org)</td>
                      <td className="p-3 text-slate-300">Public Interest Forensic Data</td>
                      <td className="p-3 text-slate-400">Beneficial Ownership Graph, Nominee Nodes</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-amber-400">SRC-12</td>
                      <td className="p-3 text-white font-sans font-semibold">CourtListener (Free Law Project)</td>
                      <td className="p-3 text-slate-400">Common Law Precedents Repository</td>
                      <td className="p-3 text-purple-400">REST API v4 (/search/)</td>
                      <td className="p-3 text-slate-300">Open Legal Citations Standard</td>
                      <td className="p-3 text-slate-400">Constructive Trust Opinions, Fraud Case Law</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-amber-400">SRC-13</td>
                      <td className="p-3 text-white font-sans font-semibold">Attorney General's Chambers (AGC)</td>
                      <td className="p-3 text-slate-400">Federal Gazette (Warta Kerajaan)</td>
                      <td className="p-3 text-emerald-400">AGC LOM Portal Spider</td>
                      <td className="p-3 text-slate-300">Interpretation Acts 1948/1967</td>
                      <td className="p-3 text-slate-400">Gazette Notifications, Forfeiture Decrees</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-amber-400">SRC-14</td>
                      <td className="p-3 text-white font-sans font-semibold">Polis Diraja Malaysia (PDRM CCID)</td>
                      <td className="p-3 text-slate-400">Commercial Crime Investigation Dept</td>
                      <td className="p-3 text-blue-400">Classified Police FIR Parser</td>
                      <td className="p-3 text-slate-300">Penal Code (Act 574) S.468/471</td>
                      <td className="p-3 text-slate-400">First Information Reports, Handwriting Audits</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-amber-400">SRC-15</td>
                      <td className="p-3 text-white font-sans font-semibold">Lembaga Hasil Dalam Negeri (LHDN)</td>
                      <td className="p-3 text-slate-400">Stamp Duty &amp; Invoicing Portal</td>
                      <td className="p-3 text-blue-400">MyInvois / Stamp Duty Scraper</td>
                      <td className="p-3 text-slate-300">Stamp Act 1949 (Act 378)</td>
                      <td className="p-3 text-slate-400">Digital Stamp Endorsements, Sec 44 Audits</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-amber-400">SRC-16</td>
                      <td className="p-3 text-white font-sans font-semibold">BVI Financial Services Commission</td>
                      <td className="p-3 text-slate-400">Registry of Corporate Affairs (Tortola)</td>
                      <td className="p-3 text-blue-400">VIRRGIN System REST Scraper</td>
                      <td className="p-3 text-slate-300">BVI Business Companies Act 2004</td>
                      <td className="p-3 text-slate-400">Certificate of Good Standing, Register of Charges</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-amber-400">SRC-17</td>
                      <td className="p-3 text-white font-sans font-semibold">Registre du Commerce de Genève</td>
                      <td className="p-3 text-slate-400">Cantonal Commercial Registry (Swiss)</td>
                      <td className="p-3 text-blue-400">Zefix Federal / Cantonal XML API</td>
                      <td className="p-3 text-slate-300">Swiss Code of Obligations Art. 927</td>
                      <td className="p-3 text-slate-400">Handelsregisterauszug, Signatory Authorizations</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-amber-400">SRC-18</td>
                      <td className="p-3 text-white font-sans font-semibold">Bank Negara Malaysia (BNM FIED)</td>
                      <td className="p-3 text-slate-400">Financial Intelligence &amp; Enforcement</td>
                      <td className="p-3 text-blue-400">Restricted Enforcement List Sync</td>
                      <td className="p-3 text-slate-300">Anti-Money Laundering Act 2001</td>
                      <td className="p-3 text-slate-400">Section 4(1) Asset Freeze Orders, PEP Lists</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: 20 STRATEGIC JUDICIAL, REGULATORY & FORENSIC INTEGRATIONS */}
          {activeSubTab === 'twenty_integrations' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-800/50">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    20 Comprehensive Strategic Integrations Architecture
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Engineered to satisfy Evidence Act 1950 (Act 56) S.90A, Digital Signature Act 1997, and High Court of Malaya practice standards.
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30 whitespace-nowrap">
                  ● 20 of 20 Connected &amp; Calibrated
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Integration Name &amp; Acronym</th>
                      <th className="p-3">Issuing Agency &amp; Locus</th>
                      <th className="p-3">Statutory Anchor</th>
                      <th className="p-3">Ingestion Protocol</th>
                      <th className="p-3">Forensic Efficacy &amp; Court Admissibility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {TWENTY_STRATEGIC_INTEGRATIONS.map((intItem) => (
                      <tr key={intItem.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3 font-bold text-indigo-400">{intItem.numericIndex}</td>
                        <td className="p-3 text-white font-sans font-semibold">
                          {intItem.name}
                          <span className="block font-mono text-[10px] text-amber-400 mt-0.5 font-bold">
                            {intItem.acronym}
                          </span>
                        </td>
                        <td className="p-3 text-slate-300 font-sans">
                          {intItem.issuingAgency}
                          <span className="block font-mono text-[10px] text-slate-500">{intItem.jurisdiction}</span>
                        </td>
                        <td className="p-3 text-indigo-300 font-semibold font-mono">
                          {intItem.statutoryAnchor}
                        </td>
                        <td className="p-3 text-emerald-400 font-mono text-[10px]">
                          {intItem.protocolAndEndpoint}
                        </td>
                        <td className="p-3 text-slate-300 font-sans text-xs max-w-xs leading-relaxed">
                          {intItem.forensicEfficacy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: HMAC & MCP PROTOCOLS */}
          {activeSubTab === 'protocols' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">Cryptographic Request Signing &amp; MCP Integration</h4>
              <p className="text-slate-400">
                To guarantee zero tampering during transmission across open government networks, every outbound request to MyGDX
                calculates a keyed HMAC-SHA256 signature using the registered agency secret. Replay attacks are prevented via
                enforced 5-minute timestamp delta windows.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-amber-400 font-mono text-xs">
                  <span>// MyGDX Outbound Header Generator (TypeScript)</span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `function createSecureMyGdxHeaders(path: string, method: string = 'GET') {
  const timestamp = new Date().toISOString();
  const signaturePayload = \`\${method}\\n\${path}\\n\${timestamp}\\n\${MYGDX_CONSUMER_SECRET}\`;
  const signature = crypto.createHmac('sha256', MYGDX_CONSUMER_SECRET)
    .update(signaturePayload)
    .digest('base64');

  return {
    'X-MYGDX-CONSUMER-KEY': MYGDX_CONSUMER_KEY,
    'X-MYGDX-TIMESTAMP': timestamp,
    'X-MYGDX-SIGNATURE': signature,
    'X-MYGDX-AGENCY-CODE': MYGDX_AGENCY_CODE,
    'X-SSM-USER-ID': SSM_USER_ID,
    'X-SSM-BEARER-TOKEN': \`Bearer \${SSM_SECRET_TOKEN}\`,
    'Content-Type': 'application/json'
  };
}`,
                        'hmac_code'
                      )
                    }
                    className="flex items-center gap-1 text-slate-400 hover:text-white transition text-[11px]"
                  >
                    {copiedSnippet === 'hmac_code' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedSnippet === 'hmac_code' ? 'Copied' : 'Copy Code'}
                  </button>
                </div>
                <pre className="text-slate-300 font-mono text-[11px] overflow-x-auto p-3 bg-slate-900/80 rounded-lg border border-slate-800">
{`function createSecureMyGdxHeaders(path: string, method: string = 'GET') {
  const timestamp = new Date().toISOString();
  const signaturePayload = \`\${method}\\n\${path}\\n\${timestamp}\\n\${MYGDX_CONSUMER_SECRET}\`;
  const signature = crypto.createHmac('sha256', MYGDX_CONSUMER_SECRET)
    .update(signaturePayload)
    .digest('base64');

  return {
    'X-MYGDX-CONSUMER-KEY': MYGDX_CONSUMER_KEY,
    'X-MYGDX-TIMESTAMP': timestamp,
    'X-MYGDX-SIGNATURE': signature,
    'X-MYGDX-AGENCY-CODE': MYGDX_AGENCY_CODE,
    'X-SSM-USER-ID': SSM_USER_ID,
    'X-SSM-BEARER-TOKEN': \`Bearer \${SSM_SECRET_TOKEN}\`,
    'Content-Type': 'application/json'
  };
}`}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-purple-400 font-mono text-xs font-bold">// MCP JSON-RPC 2.0 Ingestion Handler</div>
                <p className="text-slate-400 text-[11px]">
                  Autonomous agents query the gateway through the standardized Model Context Protocol JSON-RPC specification,
                  supporting automated company verification, affidavit certification, and offshore reconciliation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-blue-300 font-bold">Supported MCP Tools:</span>
                    <ul className="list-disc pl-4 mt-1 text-slate-400 space-y-0.5">
                      <li>get_ssm_company_status</li>
                      <li>verify_court_affidavit</li>
                      <li>reconcile_icij_offshore</li>
                      <li>query_courtlistener_precedents</li>
                      <li>retrieve_power_of_attorney_registry</li>
                    </ul>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-emerald-300 font-bold">Active MCP Resources:</span>
                    <ul className="list-disc pl-4 mt-1 text-slate-400 space-y-0.5">
                      <li>ssm://config/status</li>
                      <li>ssm://audit/logs</li>
                      <li>ssm://entities/target</li>
                      <li>ssm://theses/master</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EVIDENCE ACT S.90A PROOF */}
          {activeSubTab === 'crypto_90a' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/40">
                <h4 className="text-sm font-bold text-amber-200 mb-1">
                  Evidence Act 1950 (Act 56) Section 90A Compliance Architecture
                </h4>
                <p className="text-slate-300 text-xs">
                  Under Section 90A(1), electronic records produced by a computer in the ordinary course of its activities
                  are admissible without calling the system programmer, provided statutory chain-of-custody and system integrity
                  are established.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h5 className="font-bold text-white text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Section 90A(1) - Ordinary Use Presumption
                  </h5>
                  <p className="text-slate-400 text-[11px]">
                    The computer was in good working order and operated by authorized statutory officers. No operational defects
                    occurred that would distort the accuracy of the electronic extract.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h5 className="font-bold text-white text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Section 90A(2) - Officer Certificate
                  </h5>
                  <p className="text-slate-400 text-[11px]">
                    A formal certificate signed by the officer having custody or management of the computer system is conclusive
                    evidence of the matters stated therein. Fully generated in bilingual format by our compiler.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-2">
                <div className="text-amber-400 font-bold">// STATUTORY CERTIFICATION HASH LOGIC (Web Crypto API)</div>
                <pre className="text-slate-300 overflow-x-auto p-3 bg-slate-900 rounded-lg border border-slate-800">
{`async function calculateFileSha256(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const digestBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(digestBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 5: SWIFT MT103 INGESTION */}
          {activeSubTab === 'swift_telemetry' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">SWIFT MT103 Interbank Telemetry &amp; Escrow Verification</h4>
              <p className="text-slate-400">
                To trace offshore wealth transfers and corporate restitution funds, our engine ingests raw FIN MT103
                and MT202 messages, parsing standard field tags into validated JSON objects:
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-emerald-400 font-mono text-xs font-bold">// SWIFT MT103 Raw Wire Stream Sample</div>
                <pre className="text-slate-300 font-mono text-[11px] overflow-x-auto p-3 bg-slate-900 rounded-lg border border-slate-800">
{`:20:TRN-2026-VRD-9982
:23B:CRED
:32A:260814USD150000000,00
:50K:/US44VERD992100823901
VERIDIAN TRUST SETTLEMENT CORP
GENEVA, SWITZERLAND
:52A:UBSWCHZHXXX
:57A:MBBEMYKLXXX
:59:/MY661002008839001928
KAVINATH GANESHAN
RESTITUTION ESCROW ACCOUNT
:70:/RECON/ COURT RESTITUTION WA-22NCC-482-09/2026
UNIVERSAL LEGATEE SETTLEMENT TRANCHE A
:71A:OUR`}
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-amber-400 font-bold">Field :50K (Ordering Customer):</span>
                  <p className="text-slate-400 mt-1">Identifies the remitting trust fiduciary (Veridian Trust Settlement Corp).</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-amber-400 font-bold">Field :59 (Beneficiary Customer):</span>
                  <p className="text-slate-400 mt-1">Validates account holder identity against JPN civil records and court decrees.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CODE SNIPPETS & METHODS */}
          {activeSubTab === 'code_methods' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">Targeted Document Retrieval &amp; Spider Implementations</h4>
              <p className="text-slate-400">
                Executable crawler and extraction modules used across the 18 data repositories.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-blue-400 font-mono text-xs">
                  <span>// Python Selenium/Playwright e-Kehakiman Cause Paper Retrieval</span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `# e-Kehakiman High Court Cause Paper Spider
import requests
import hashlib

def fetch_cause_paper(docket_ref, api_key):
    url = f"https://kehakiman.gov.my/api/v2/cases/{docket_ref}/documents"
    headers = {"Authorization": f"Bearer {api_key}", "Accept": "application/pdf"}
    res = requests.get(url, headers=headers)
    if res.status_code == 200:
        pdf_bytes = res.content
        sha256 = hashlib.sha256(pdf_bytes).hexdigest()
        return {"docket": docket_ref, "sha256": sha256, "size": len(pdf_bytes)}
    raise Exception("Court document retrieval failed")`,
                        'py_code'
                      )
                    }
                    className="flex items-center gap-1 text-slate-400 hover:text-white transition text-[11px]"
                  >
                    {copiedSnippet === 'py_code' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedSnippet === 'py_code' ? 'Copied' : 'Copy Snippet'}
                  </button>
                </div>
                <pre className="text-slate-300 font-mono text-[11px] overflow-x-auto p-3 bg-slate-900 rounded-lg border border-slate-800">
{`# e-Kehakiman High Court Cause Paper Spider
import requests
import hashlib

def fetch_cause_paper(docket_ref, api_key):
    url = f"https://kehakiman.gov.my/api/v2/cases/{docket_ref}/documents"
    headers = {"Authorization": f"Bearer {api_key}", "Accept": "application/pdf"}
    res = requests.get(url, headers=headers)
    if res.status_code == 200:
        pdf_bytes = res.content
        sha256 = hashlib.sha256(pdf_bytes).hexdigest()
        return {"docket": docket_ref, "sha256": sha256, "size": len(pdf_bytes)}
    raise Exception("Court document retrieval failed")`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographic Chain-of-Custody: Evidence Act 1950 (Act 56) S.90A &amp; Digital Signature Act 1997</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openInSeparateWindow}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in Standalone Window
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
