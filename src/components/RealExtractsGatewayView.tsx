import React, { useState, useEffect, useRef } from 'react';
import {
  FileCheck2,
  UploadCloud,
  ShieldCheck,
  Download,
  AlertTriangle,
  FileText,
  Building2,
  Scale,
  Stamp,
  Globe,
  Lock,
  Search,
  CheckCircle2,
  RefreshCw,
  Copy,
  ExternalLink,
  ChevronRight,
  Terminal,
  Trash2,
  QrCode,
  Key,
  Database,
  Eye,
} from 'lucide-react';
import type {
  EnterpriseB2BGateway,
  IngestedRealDocument,
  SubpoenaCausePaperData,
} from '../shared/realExtractsData';
import { jsPDF } from 'jspdf';

export function RealExtractsGatewayView() {
  const [activeSubTab, setActiveSubTab] = useState<'upload_ingest' | 'b2b_gateways' | 'subpoena_generator' | 'dossier_schedule'>('upload_ingest');
  
  // State from server
  const [gateways, setGateways] = useState<EnterpriseB2BGateway[]>([]);
  const [dossierDocuments, setDossierDocuments] = useState<IngestedRealDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Upload state
  const [uploadCategory, setUploadCategory] = useState<IngestedRealDocument['sourceCategory']>('ssm_ctc');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadAgency, setUploadAgency] = useState('');
  const [uploadSerial, setUploadSerial] = useState('');
  const [uploadCourtRelevance, setUploadCourtRelevance] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewMeta, setFilePreviewMeta] = useState<{
    fileName: string;
    sizeBytes: number;
    base64Data?: string;
    sha256Hex?: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // B2B Downloader state
  const [selectedGatewayId, setSelectedGatewayId] = useState<string>('mydata_ssm');
  const [b2bEntityId, setB2bEntityId] = useState<string>('1199837-7');
  const [b2bProduct, setB2bProduct] = useState<string>('CTC Section 14 Superform (First Directors & Subscribers)');
  const [gatewayHandshakeResult, setGatewayHandshakeResult] = useState<any | null>(null);

  // Subpoena state
  const [subpoenaType, setSubpoenaType] = useState<'JPN' | 'HIGH_COURT_REGISTRAR'>('JPN');
  const [subpoenaHearingDate, setSubpoenaHearingDate] = useState('2026-09-28');
  const [subpoenaCourtRoom, setSubpoenaCourtRoom] = useState('Mahkamah Tinggi Dagang 4 (Aras 4, Sayap Kanan)');
  const [subpoenaResult, setSubpoenaResult] = useState<any | null>(null);

  // Selected document for full detail modal
  const [viewingDoc, setViewingDoc] = useState<IngestedRealDocument | null>(null);

  // Load initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const [gwRes, docRes] = await Promise.all([
          fetch('/api/real-extracts/gateways'),
          fetch('/api/real-extracts/dossier'),
        ]);

        if (gwRes.ok) {
          const gwData = await gwRes.json();
          if (gwData?.data?.gateways) setGateways(gwData.data.gateways);
        }

        if (docRes.ok) {
          const docData = await docRes.json();
          if (docData?.data?.documents) setDossierDocuments(docData.data.documents);
        }
        break;
      } catch {
        if (attempt < 2) {
          await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
        }
      }
    }
    setIsLoading(false);
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Handle client-side file selection & instant SHA-256 computation
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Auto-populate title if empty
      if (!uploadTitle) {
        setUploadTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }

      // Read array buffer to compute client-side SHA-256 for instantaneous verification
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      // Read base64 for submission
      const reader = new FileReader();
      reader.onload = (uploadEvt) => {
        const base64 = uploadEvt.target?.result as string;
        setFilePreviewMeta({
          fileName: file.name,
          sizeBytes: file.size,
          base64Data: base64,
          sha256Hex: hashHex,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit file for ingestion and forensic server-side verification
  const handleIngestFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filePreviewMeta && !uploadTitle) {
      setErrorMessage('Please select a file or provide an extract title.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setStatusMessage('Analyzing byte headers, checking PKI signatures, and computing Section 90A hash...');

    try {
      const res = await fetch('/api/real-extracts/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadTitle || filePreviewMeta?.fileName,
          fileName: filePreviewMeta?.fileName || `${uploadTitle.replace(/\s+/g, '_')}.pdf`,
          fileSizeBytes: filePreviewMeta?.sizeBytes || 1024,
          base64Data: filePreviewMeta?.base64Data,
          sourceCategory: uploadCategory,
          issuingAgency: uploadAgency || undefined,
          serialNo: uploadSerial || undefined,
          courtRelevance: uploadCourtRelevance || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage(`Document successfully ingested! Section 90A Certificate: ${data.data.forensicReport.section90ACertNo}`);
        setDossierDocuments((prev) => [data.data, ...prev]);
        // Reset form
        setSelectedFile(null);
        setFilePreviewMeta(null);
        setUploadTitle('');
        setUploadAgency('');
        setUploadSerial('');
        setUploadCourtRelevance('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        setTimeout(() => setStatusMessage(null), 5000);
      } else {
        setErrorMessage(data.error || 'Ingestion failed');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error during ingestion');
    } finally {
      setIsProcessing(false);
    }
  };

  // Test live connection to an official gateway
  const handleTestGateway = async (gatewayId: string) => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/real-extracts/gateways/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gatewayId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setGatewayHandshakeResult(data.data);
      } else {
        setErrorMessage(data.error || 'Handshake failed');
      }
    } catch (err: any) {
      setErrorMessage('Failed to initiate gateway handshake');
    } finally {
      setIsProcessing(false);
    }
  };

  // Trigger B2B extract download
  const handleExecuteB2bDownload = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setStatusMessage(`Requesting official statutory extract via ${selectedGatewayId.toUpperCase()}...`);

    try {
      const res = await fetch('/api/real-extracts/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gatewayId: selectedGatewayId,
          entityIdentifier: b2bEntityId,
          documentType: b2bProduct,
          addToDossier: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage(`Extract downloaded and anchored to Master Dossier! DCHEQS Serial: ${data.data.dcheqsSerial}`);
        if (data.data.dossierDocument) {
          setDossierDocuments((prev) => [data.data.dossierDocument, ...prev]);
        }
        setTimeout(() => setStatusMessage(null), 6000);
      } else {
        setErrorMessage(data.error || 'Download failed');
      }
    } catch (err: any) {
      setErrorMessage('Failed to communicate with B2B extract endpoint');
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate Subpoena Duces Tecum
  const handleGenerateSubpoena = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/real-extracts/subpoena/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subpoenaType,
          overrides: {
            hearingDate: subpoenaHearingDate,
            courtRoom: subpoenaCourtRoom,
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubpoenaResult(data.data);
      } else {
        setErrorMessage(data.error || 'Subpoena generation failed');
      }
    } catch (err: any) {
      setErrorMessage('Failed to generate court subpoena');
    } finally {
      setIsProcessing(false);
    }
  };

  // Export Subpoena as Court-Ready PDF
  const handleDownloadSubpoenaPdf = () => {
    if (!subpoenaResult) return;
    const doc = new jsPDF();
    const sub = subpoenaResult.data as SubpoenaCausePaperData;

    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.text(`DALAM MAHKAMAH TINGGI MALAYA DI ${sub.courtLocation.toUpperCase()}`, 105, 20, { align: 'center' });
    doc.text(`${sub.division.toUpperCase()}`, 105, 26, { align: 'center' });
    doc.text(`GUAMAN SIVIL NO: ${sub.caseNumber}`, 105, 32, { align: 'center' });

    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.text('ANTARA:', 20, 42);
    doc.setFont('times', 'bold');
    doc.text(sub.plaintiff, 20, 48);
    doc.setFont('times', 'italic');
    doc.text('... PLAINTIF', 160, 48);

    doc.setFont('times', 'normal');
    doc.text('DAN', 20, 56);
    doc.setFont('times', 'bold');
    doc.text(sub.defendant, 20, 62);
    doc.setFont('times', 'italic');
    doc.text('... DEFENDAN-DEFENDAN', 145, 62);

    doc.line(20, 68, 190, 68);

    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.text('BORANG 66 (ATURAN 38 KAEDAH 13 KAEDAH-KAEDAH MAHKAMAH 2012)', 105, 75, { align: 'center' });
    doc.text('SAMAN KEPADA SAKSI UNTUK MENGEMUKAKAN DOKUMEN (SUBPOENA DUCES TECUM)', 105, 81, { align: 'center' });

    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    doc.text(`KEPADA: ${sub.targetOfficialTitle}`, 20, 92);
    const splitAddr = doc.splitTextToSize(sub.targetAddress, 160);
    doc.text(splitAddr, 20, 98);

    let yPos = 98 + splitAddr.length * 5 + 4;
    doc.text(`BAHAWASANYA kehadiran tuan adalah dikehendaki pada pendengaran tindakan ini pada:`, 20, yPos);
    yPos += 6;
    doc.setFont('times', 'bold');
    doc.text(`TARIKH: ${sub.hearingDate}   |   MASA: ${sub.hearingTime}   |   TEMPAT: ${sub.courtRoom}`, 20, yPos);
    yPos += 8;

    doc.setFont('times', 'normal');
    doc.text('DAN TUAN ADALAH DENGAN INI DIPERINTAHKAN untuk membawa bersama dan mengemukakan:', 20, yPos);
    yPos += 6;

    sub.documentsToProduce.forEach((docItem, idx) => {
      doc.setFont('times', 'bold');
      doc.text(`(${idx + 1})`, 22, yPos);
      doc.setFont('times', 'normal');
      const lines = doc.splitTextToSize(docItem, 150);
      doc.text(lines, 30, yPos);
      yPos += lines.length * 5 + 3;
    });

    yPos += 4;
    doc.setFont('times', 'bold');
    doc.text('PERINGATAN PENAL:', 20, yPos);
    doc.setFont('times', 'normal');
    doc.text('Kegagalan mematuhi saman ini tanpa alasan sah boleh dikenakan tindakan pengkomitan menghina Mahkamah.', 55, yPos);

    yPos += 16;
    doc.text('BERTARIKH: _____________________', 20, yPos);
    doc.text('METERAI MAHKAMAH TINGGI MALAYA', 120, yPos);
    yPos += 14;
    doc.text('...........................................................................', 115, yPos);
    doc.text('TIMBALAN PENDAFTAR KANAN', 125, yPos + 5);

    doc.save(`SUBPOENA_DUCES_TECUM_BORANG_66_${sub.caseNumber.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
  };

  // Delete document
  const handleDeleteDoc = async (id: string) => {
    if (!confirm('Are you sure you want to remove this document from the court evidence schedule?')) return;
    try {
      const res = await fetch(`/api/real-extracts/dossier/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDossierDocuments((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getSourceIcon = (cat: IngestedRealDocument['sourceCategory']) => {
    switch (cat) {
      case 'ssm_ctc':
        return <Building2 className="w-4 h-4 text-amber-400" />;
      case 'jpn_birth_cert':
        return <FileCheck2 className="w-4 h-4 text-emerald-400" />;
      case 'court_efs_order':
        return <Scale className="w-4 h-4 text-indigo-400" />;
      case 'lhdn_stamping':
        return <Stamp className="w-4 h-4 text-rose-400" />;
      case 'land_title_ptg':
        return <Database className="w-4 h-4 text-cyan-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-700/40 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-indigo-500/30">
                Official Government &amp; Court Gateway
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-semibold">
                ● Evidence Act 1950 S.90A Ready
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-indigo-400" />
              Real Statutory Extracts, PKI Verifier &amp; Subpoena Gateway
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Transition from mock fixtures to authentic judicial evidence. Ingest real scanned PDFs, verify Pos Digicert / DCHEQS cryptographic seals, query authorized B2B government gateways, and generate court-enforceable Subpoenas (Order 38 Rule 13) for restricted registries.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <span className="block text-[10px] text-slate-400 uppercase font-mono">Ingested Files</span>
              <span className="text-base font-bold text-white font-mono">{dossierDocuments.length} Records</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <span className="block text-[10px] text-slate-400 uppercase font-mono">Accredited Seals</span>
              <span className="text-base font-bold text-emerald-400 font-mono">
                {dossierDocuments.filter((d) => d.forensicReport.hasDigitalSignature).length} Signed
              </span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {statusMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('upload_ingest')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
            activeSubTab === 'upload_ingest'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          1. Ingest Real File &amp; Forensic Verifier
        </button>

        <button
          onClick={() => setActiveSubTab('b2b_gateways')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
            activeSubTab === 'b2b_gateways'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-amber-400" />
          2. B2B Gateways &amp; Direct Downloader
        </button>

        <button
          onClick={() => setActiveSubTab('subpoena_generator')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
            activeSubTab === 'subpoena_generator'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-emerald-400" />
          3. Court Subpoena Duces Tecum (JPN &amp; Registrar)
        </button>

        <button
          onClick={() => setActiveSubTab('dossier_schedule')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
            activeSubTab === 'dossier_schedule'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          4. Real Evidence Schedule ({dossierDocuments.length})
        </button>
      </div>

      {/* SUB-TAB 1: UPLOAD REAL FILE & FORENSIC VERIFIER */}
      {activeSubTab === 'upload_ingest' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Upload Form */}
          <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-indigo-400" />
                Upload Real Scanned Extract or Sealed PDF
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Drop your genuine SSM CTC, JPN Cabutan Sijil Kelahiran scan, e-Kehakiman sealed court order, or LHDN stamping cert. The engine performs byte-level forensic inspection, SHA-256 computation, and Section 90A Evidence Act certification.
              </p>
            </div>

            <form onSubmit={handleIngestFile} className="space-y-4">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Statutory Document Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'ssm_ctc', label: 'SSM CTC Extract', icon: Building2 },
                    { id: 'jpn_birth_cert', label: 'JPN Birth Extract', icon: FileCheck2 },
                    { id: 'court_efs_order', label: 'Sealed Court Order', icon: Scale },
                    { id: 'land_title_ptg', label: 'Land Title (e-Tanah)', icon: Database },
                    { id: 'lhdn_stamping', label: 'LHDN Stamp Cert', icon: Stamp },
                    { id: 'federal_gazette', label: 'Federal Gazette', icon: Globe },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setUploadCategory(cat.id as any)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold text-left transition ${
                          uploadCategory === cat.id
                            ? 'bg-indigo-600/30 border-indigo-500 text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drag & Drop File Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target File (PDF, TIFF, PNG, or Scanned Image)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/50 transition group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.tiff"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-indigo-400 mx-auto transition" />
                  <p className="text-xs font-medium text-slate-300 mt-2">
                    {selectedFile ? (
                      <span className="text-indigo-300 font-semibold">{selectedFile.name}</span>
                    ) : (
                      'Click to browse or drag and drop real document here'
                    )}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                    {selectedFile
                      ? `${(selectedFile.size / 1024).toFixed(1)} KB — Instant SHA-256 Calculated`
                      : 'Accepts PDF, TIFF, PNG, JPG (Max 50MB)'}
                  </p>
                </div>
              </div>

              {/* Title & Metadata Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Document Title / Description
                  </label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g. SSM Form 49 Directorship Extract"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Issuing Agency / Registration Locus
                  </label>
                  <input
                    type="text"
                    value={uploadAgency}
                    onChange={(e) => setUploadAgency(e.target.value)}
                    placeholder="e.g. Suruhanjaya Syarikat Malaysia"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Official Serial / DCHEQS / Case Number
                  </label>
                  <input
                    type="text"
                    value={uploadSerial}
                    onChange={(e) => setUploadSerial(e.target.value)}
                    placeholder="e.g. DCHEQS-2026-KL-09941824"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Relevance in Trial / Cause Paper
                  </label>
                  <input
                    type="text"
                    value={uploadCourtRelevance}
                    onChange={(e) => setUploadCourtRelevance(e.target.value)}
                    placeholder="e.g. Disproves disputed authority &amp; establishes lis pendens"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Executing Cryptographic Verification &amp; Ingestion...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Ingest into Evidence Dossier &amp; Issue Section 90A Certificate
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Side: Instant Cryptographic Inspection Box */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Live Binary Hash &amp; Integrity Interrogator
              </h4>

              {filePreviewMeta ? (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] text-slate-500 uppercase">Selected File</span>
                    <p className="text-white font-sans font-semibold text-xs truncate">{filePreviewMeta.fileName}</p>
                    <p className="text-slate-400 text-[11px]">Byte Size: {filePreviewMeta.sizeBytes.toLocaleString()} bytes</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-emerald-900/40 space-y-1">
                    <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center justify-between">
                      <span>True SHA-256 Bit-Level Digest</span>
                      <button
                        onClick={() => copyToClipboard(filePreviewMeta.sha256Hex || '', 'hash_preview')}
                        className="text-slate-400 hover:text-white text-[10px] font-mono flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        {copiedKey === 'hash_preview' ? 'Copied' : 'Copy'}
                      </button>
                    </span>
                    <p className="text-emerald-300 text-[10px] break-all leading-relaxed">
                      {filePreviewMeta.sha256Hex}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Digital Signature / PKI:</span>
                      <span className="text-indigo-300 font-semibold">Inspecting Byte Range</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Section 90A Certificate:</span>
                      <span className="text-emerald-400 font-semibold">Auto-Generates on Ingest</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Presumption of Authenticity:</span>
                      <span className="text-white">Active under S.90A(2)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">
                    No file queued yet. Select or drop a genuine extract to examine its cryptographic footprint.
                  </p>
                </div>
              )}
            </div>

            {/* Evidentiary Assurance Card */}
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 text-xs space-y-2">
              <h5 className="font-bold text-indigo-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Unbroken Chain of Custody Standard
              </h5>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Under Malaysian High Court practice, files uploaded through this pipeline are locked bit-for-bit into the master evidence schedule, generating a statutory declaration of proper computer operation under Section 90A Evidence Act 1950.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: B2B GATEWAYS & DIRECT DOWNLOADER */}
      {activeSubTab === 'b2b_gateways' && (
        <div className="space-y-6">
          {/* Gateway Inventory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gateways.map((gw) => (
              <div
                key={gw.id}
                onClick={() => setSelectedGatewayId(gw.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer space-y-3 ${
                  selectedGatewayId === gw.id
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500/40'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                      {gw.authMethod}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{gw.name}</h4>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      gw.status === 'ONLINE'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    ● {gw.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{gw.provider}</p>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[10px] font-mono space-y-1">
                  <div className="text-slate-400 truncate">
                    <span className="text-slate-500">Statutory:</span> {gw.statutoryBasis}
                  </div>
                  <div className="text-emerald-400 truncate">
                    <span className="text-slate-500">Cost/Query:</span> {gw.costPerQuery}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTestGateway(gw.id);
                    }}
                    disabled={isProcessing}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-200 transition flex items-center gap-1"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    Ping Gateway
                  </button>

                  <span className="text-[10px] text-indigo-300 font-semibold flex items-center gap-1">
                    Select to Download <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Handshake Result Console */}
          {gatewayHandshakeResult && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-800/40 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  TLS Handshake &amp; Qualified Certificate Verified: {gatewayHandshakeResult.gateway.name}
                </span>
                <span className="text-slate-400 text-[11px]">{gatewayHandshakeResult.latencyMs} ms</span>
              </div>
              <div className="text-[11px] text-slate-300">
                Cipher: {gatewayHandshakeResult.cipherSuite}
              </div>
              <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-300 overflow-x-auto">
                {JSON.stringify(gatewayHandshakeResult.handshakePayload, null, 2)}
              </pre>
            </div>
          )}

          {/* Programmatic B2B Download Console */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-amber-400" />
                Programmatic B2B Extract Requester
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Acquire authentic corporate and statutory records directly through enterprise API endpoints.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Active Gateway</label>
                <select
                  value={selectedGatewayId}
                  onChange={(e) => setSelectedGatewayId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {gateways.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Target Entity / ROC / Ref No.</label>
                <input
                  type="text"
                  value={b2bEntityId}
                  onChange={(e) => setB2bEntityId(e.target.value)}
                  placeholder="e.g. 1199837-7 or WA-22NCC-482"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Extract Document Type</label>
                <select
                  value={b2bProduct}
                  onChange={(e) => setB2bProduct(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="CTC Section 14 Superform (First Directors & Subscribers)">
                    CTC Section 14 Superform (SSM)
                  </option>
                  <option value="CTC Form 49 / Section 58 Directors & Secretaries">
                    CTC Form 49 / Section 58 Directorship (SSM)
                  </option>
                  <option value="CTC Form 24 / Section 78 Share Allotments">
                    CTC Form 24 Share Allotments (SSM)
                  </option>
                  <option value="Company Profile (Full Financials & Encumbrances)">
                    Full Corporate Profile (SSM)
                  </option>
                  <option value="Sijil Setem Digital Adjudication Notice">
                    Digital Stamp Certificate (LHDN STAMPS)
                  </option>
                  <option value="Sealed Court Order & Committal Cause Papers">
                    Sealed Court Order (e-Kehakiman EFS)
                  </option>
                  <option value="Winding Up / Bankruptcy Notice (Federal Gazette)">
                    Gazette Statutory Notice (Warta Kerajaan)
                  </option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Automatic Action: Anchors to Master Dossier with immediate Section 90A certificate.
              </span>
              <button
                type="button"
                onClick={handleExecuteB2bDownload}
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Fetching from Enterprise Gateway...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Execute B2B Retrieval &amp; Ingest
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: COURT SUBPOENA DUCES TECUM GENERATOR */}
      {activeSubTab === 'subpoena_generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4">
            <div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold uppercase">
                Statutory Discovery: Order 38 Rule 13
              </span>
              <h3 className="text-base font-bold text-white mt-1 flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                Subpoena Duces Tecum Generator
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Essential for restricted government registers (such as <strong>JPN Birth Register Books</strong> under Act 299 or <strong>High Court Power of Attorney Deposit Books</strong> under Act 424) where digital B2B API access is restricted by law.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Government Authority</label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setSubpoenaType('JPN')}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition flex items-start gap-2.5 ${
                      subpoenaType === 'JPN'
                        ? 'bg-emerald-950/40 border-emerald-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileCheck2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                    <div>
                      <span className="font-bold block">Ketua Pengarah Pendaftaran Negara (JPN)</span>
                      <span className="text-[11px] text-slate-400">
                        Order production of original Register Book of Births (Akta 299) to conclusively settle kinship.
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubpoenaType('HIGH_COURT_REGISTRAR')}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition flex items-start gap-2.5 ${
                      subpoenaType === 'HIGH_COURT_REGISTRAR'
                        ? 'bg-emerald-950/40 border-emerald-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Scale className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
                    <div>
                      <span className="font-bold block">Timbalan Pendaftar Kanan Mahkamah Tinggi</span>
                      <span className="text-[11px] text-slate-400">
                        Order production of High Court PA Deposit Register Book under Section 4 Power of Attorney Act 1949.
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Hearing Date</label>
                  <input
                    type="date"
                    value={subpoenaHearingDate}
                    onChange={(e) => setSubpoenaHearingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Court Room</label>
                  <input
                    type="text"
                    value={subpoenaCourtRoom}
                    onChange={(e) => setSubpoenaCourtRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateSubpoena}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
              >
                <FileText className="w-4 h-4" />
                Generate Court Cause Paper (Borang 66)
              </button>
            </div>
          </div>

          {/* Right Side: Cause Paper Preview */}
          <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Borang 66 Court Document Preview
                </h4>
                <p className="text-[11px] text-slate-400">Aturan 38 Kaedah 13 Kaedah-Kaedah Mahkamah 2012</p>
              </div>

              {subpoenaResult && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(subpoenaResult.formattedLegalNoticeMalay, 'subpoena_text')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition flex items-center gap-1.5"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedKey === 'subpoena_text' ? 'Copied' : 'Copy Text'}
                  </button>
                  <button
                    onClick={handleDownloadSubpoenaPdf}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow"
                  >
                    <Download className="w-3 h-3" />
                    Export Court PDF
                  </button>
                </div>
              )}
            </div>

            {subpoenaResult ? (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed max-h-[480px] overflow-y-auto whitespace-pre-wrap">
                  {subpoenaResult.formattedLegalNoticeMalay}
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Prescribed Format: P.U.(A) 205/2012 Form 66</span>
                  <span className="text-emerald-400 font-mono font-semibold">Penal Notice Incorporated</span>
                </div>
              </div>
            ) : (
              <div className="p-16 text-center rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <Scale className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">
                  Select the authority and click &quot;Generate Court Cause Paper&quot; to format the statutory subpoena.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: INGESTED EVIDENCE DOSSIER SCHEDULE */}
      {activeSubTab === 'dossier_schedule' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified Real Evidence Schedule (Section 90A Evidence Act 1950)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every record below has been ingested with a bit-for-bit SHA-256 hash, unbroken chain of custody, and statutory certificate ready for High Court trial bundles.
              </p>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30 whitespace-nowrap">
              {dossierDocuments.length} Documents Sealed
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Exhibit No &amp; Title</th>
                  <th className="p-3.5">Issuing Authority</th>
                  <th className="p-3.5">SHA-256 Hash Digest</th>
                  <th className="p-3.5">Digital Seal &amp; PKI</th>
                  <th className="p-3.5">Section 90A Cert</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {dossierDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-sans">
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 mt-0.5">
                          {getSourceIcon(doc.sourceCategory)}
                        </div>
                        <div>
                          <span className="font-bold text-white text-xs block">{doc.title}</span>
                          <span className="font-mono text-[10px] text-amber-400 font-semibold">
                            {doc.markedExhibitNo || 'EXHIBIT C'}
                          </span>
                          <span className="text-slate-500 text-[10px] block truncate max-w-xs">
                            {doc.originalFileName} ({(doc.fileSizeBytes / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-300 font-sans text-xs">
                      {doc.issuingAgency}
                      <span className="block font-mono text-[10px] text-slate-500">{doc.serialOrRegistrationNo}</span>
                    </td>

                    <td className="p-3.5 text-[10px] text-emerald-400 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate max-w-[140px]">{doc.sha256Hash}</span>
                        <button
                          onClick={() => copyToClipboard(doc.sha256Hash, doc.id)}
                          className="text-slate-400 hover:text-white"
                          title="Copy full SHA-256"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      {copiedKey === doc.id && <span className="text-[9px] text-indigo-300">Copied!</span>}
                    </td>

                    <td className="p-3.5">
                      {doc.forensicReport.hasDigitalSignature ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                          {doc.forensicReport.digitalSigner?.includes('POS DIGICERT') ? 'Pos Digicert (DSA 97)' : 'X.509 Sealed'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                          Scanned / Subpoena
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 font-mono text-[10px] text-indigo-300">
                      {doc.forensicReport.section90ACertNo}
                      <span className="block text-[9px] text-slate-500">{new Date(doc.ingestionTimestamp).toLocaleDateString()}</span>
                    </td>

                    <td className="p-3.5 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingDoc(doc)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                          title="View Full Forensic Dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDoc(doc.id)}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition"
                          title="Remove from Schedule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DOCUMENT DETAIL MODAL */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  {getSourceIcon(viewingDoc.sourceCategory)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{viewingDoc.title}</h3>
                  <p className="text-xs text-amber-400 font-mono">{viewingDoc.markedExhibitNo || 'EXHIBIT C'}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="text-slate-400 hover:text-white p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
              <div className="text-emerald-400 font-bold text-sm">
                Evidence Act 1950 Section 90A(2) Certificate
              </div>
              <div className="text-slate-300">Certificate Reference: <span className="text-white">{viewingDoc.forensicReport.section90ACertNo}</span></div>
              <div className="text-slate-300">Issuing Locus: <span className="text-white">{viewingDoc.issuingAgency}</span></div>
              <div className="text-slate-300">File Byte Size: <span className="text-white">{viewingDoc.fileSizeBytes.toLocaleString()} bytes</span></div>
              <div className="text-slate-300">PDF Syntax: <span className="text-white">{viewingDoc.forensicReport.pdfVersion || 'Standard Binary'}</span></div>
              <div className="text-slate-300 break-all">SHA-256 Digest: <span className="text-emerald-300">{viewingDoc.sha256Hash}</span></div>
              <div className="text-slate-300">Digital Signer: <span className="text-indigo-300">{viewingDoc.forensicReport.digitalSigner || 'N/A (Tendered Under Subpoena)'}</span></div>
              <div className="text-slate-300">Integrity Verdict: <span className="text-emerald-400 font-bold">{viewingDoc.forensicReport.integrityVerdict}</span></div>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs space-y-1">
              <span className="font-bold text-indigo-300 block">Court Trial Relevance:</span>
              <p className="text-slate-300 text-xs leading-relaxed">{viewingDoc.courtRelevance}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  copyToClipboard(
                    `PERAKUAN DI BAWAH SEKSYEN 90A AKTA KETERANGAN 1950\n` +
                    `No. Perakuan: ${viewingDoc.forensicReport.section90ACertNo}\n` +
                    `Nama Dokumen: ${viewingDoc.title}\n` +
                    `Pihak Berkuasa: ${viewingDoc.issuingAgency}\n` +
                    `Nilai Hash SHA-256: ${viewingDoc.sha256Hash}\n` +
                    `Status Integriti: ${viewingDoc.forensicReport.integrityVerdict}`,
                    'cert_text'
                  );
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedKey === 'cert_text' ? 'Affidavit Statement Copied!' : 'Copy Section 90A Affidavit Text'}
              </button>
              <button
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
