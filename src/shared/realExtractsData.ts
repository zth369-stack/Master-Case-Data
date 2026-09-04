/**
 * realExtractsData.ts
 * High Court Forensics, Real Document Ingestion & Enterprise B2B Gateway Specifications
 * Supporting: Evidence Act 1950 (Act 56) S.90A, S.65B, Digital Signature Act 1997,
 * and Rules of Court 2012 Order 38 Rule 13 (Subpoena Duces Tecum).
 */

export interface EnterpriseB2BGateway {
  id: string;
  name: string;
  provider: string;
  portalUrl: string;
  apiEndpoint: string;
  authMethod: 'HMAC-SHA256' | 'mTLS + GPKI' | 'Smart Token X.509' | 'Bearer Token API Key';
  statutoryBasis: string;
  availableProducts: string[];
  costPerQuery: string;
  status: 'ONLINE' | 'STANDBY' | 'REQUIRES_KEY';
  configuredInEnv: boolean;
  notes: string;
}

export interface IngestedRealDocument {
  id: string;
  title: string;
  originalFileName: string;
  fileSizeBytes: number;
  sha256Hash: string;
  md5Hash?: string;
  sourceCategory: 'ssm_ctc' | 'jpn_birth_cert' | 'court_efs_order' | 'land_title_ptg' | 'lhdn_stamping' | 'federal_gazette';
  issuingAgency: string;
  serialOrRegistrationNo: string;
  ingestionTimestamp: string;
  forensicReport: {
    pdfVersion?: string;
    producerSoftware?: string;
    creationDate?: string;
    modDate?: string;
    incrementalUpdates: number;
    hasDigitalSignature: boolean;
    digitalSigner?: string;
    certificateIssuer?: string;
    dcheqsQrUrl?: string;
    dcheqsSerial?: string;
    tamperRiskScore: number; // 0 = lowest risk, 100 = critical risk
    integrityVerdict: 'AUTHENTIC_SEALED' | 'PROBABLE_GENUINE' | 'VERIFIED_OFFICIAL_EXTRACT' | 'SUSPICIOUS_UNSEALED' | 'TAMPERED';
    chainOfCustodySigner: string;
    section90ACertNo: string;
  };
  courtRelevance: string;
  admissibilityStatus: 'ADMISSIBLE_S90A' | 'TENDERED_AS_EXHIBIT' | 'SUBJECT_TO_SUBPOENA' | 'REQUIRES_ORIGINAL_PRODUCTION';
  markedExhibitNo?: string;
  rawBase64Data?: string;
}

export const ENTERPRISE_B2B_GATEWAYS: EnterpriseB2BGateway[] = [
  {
    id: 'mydata_ssm',
    name: 'MYDATA-SSM Enterprise B2B API',
    provider: 'Big Dataworks Sdn Bhd (Authorized SSM Technology Partner)',
    portalUrl: 'https://www.mydata-ssm.com.my',
    apiEndpoint: 'https://api.mydata-ssm.com.my/v2/document/purchase',
    authMethod: 'Bearer Token API Key',
    statutoryBasis: 'Companies Act 2016 (Act 777) Section 602 & Companies Commission of Malaysia Act 2001',
    availableProducts: [
      'Company Profile (Pecahan Profil Syarikat - PDF & JSON)',
      'Certified True Copy (CTC) Form 9 / Section 17 Incorporation',
      'CTC Section 14 Superform (First Directors & Subscribers)',
      'CTC Form 49 / Section 58 Directors, Managers & Secretaries',
      'CTC Form 24 / Section 78 Return of Share Allotment',
      'Register of Charges (Form 34 / Section 352) Encumbrances',
    ],
    costPerQuery: 'RM 10.00 - RM 30.00 / document',
    status: 'ONLINE',
    configuredInEnv: false,
    notes: 'Produces official PDFs with Pos Digicert 256-bit digital seal and DCHEQS verification QR code.',
  },
  {
    id: 'ssm_einfo',
    name: 'SSM e-Info B2B Gateway',
    provider: 'Commerce Dot Com Sdn Bhd (CDCSB)',
    portalUrl: 'https://www.ssm-e-info.com.my',
    apiEndpoint: 'https://b2b.ssm-e-info.com.my/api/v1/extracts',
    authMethod: 'HMAC-SHA256',
    statutoryBasis: 'Companies Act 2016 (Act 777) & Registration of Businesses Act 1956',
    availableProducts: [
      'Historical Corporate Profile & Financial Statements (MBRS XBRL)',
      'Termination & Strike-off Notice Filings',
      'Directorship Cross-Ownership & Disqualification Index',
    ],
    costPerQuery: 'RM 15.00 / query',
    status: 'ONLINE',
    configuredInEnv: false,
    notes: 'Direct XML/SOAP pipeline utilizing dedicated corporate deposit account.',
  },
  {
    id: 'ekehakiman_efs',
    name: 'e-Kehakiman EFS (Electronic Filing System)',
    provider: 'Pejabat Ketua Pendaftar Mahkamah Persekutuan Malaysia / Omesti',
    portalUrl: 'https://efiling.kehakiman.gov.my',
    apiEndpoint: 'https://efiling.kehakiman.gov.my/api/v2/case-search',
    authMethod: 'Smart Token X.509',
    statutoryBasis: 'Rules of Court 2012 Order 63A & Electronic Commerce Act 2006',
    availableProducts: [
      'Sealed Writ & Statement of Claim (Saman & Pernyataan Tuntutan)',
      'Certified Court Orders (Perintah Termeterai Mahkamah Tinggi)',
      'Affidavits with Exhibits (Afidavit Jawapan & Afidavit Sokongan)',
      'Grounds of Judgment (Alasan Penghakiman Rasmi)',
    ],
    costPerQuery: 'RM 8.00 - RM 25.00 / filing search',
    status: 'ONLINE',
    configuredInEnv: false,
    notes: 'Enforces hardware USB token authentication (MSC Trustgate) linked to Bar Council practicing certificate.',
  },
  {
    id: 'lhdn_stamps',
    name: 'LHDN STAMPS Verification Gateway',
    provider: 'Lembaga Hasil Dalam Negeri Malaysia (LHDN)',
    portalUrl: 'https://stamps.hasil.gov.my',
    apiEndpoint: 'https://stamps.hasil.gov.my/stamps/verifyCertificate',
    authMethod: 'Bearer Token API Key',
    statutoryBasis: 'Stamp Act 1949 (Act 378) Section 52 & Section 7(1)',
    availableProducts: [
      'Digital Stamp Certificate Verification (Sijil Setem Digital)',
      'Duty Adjudication Endorsement (Pemberitahuan Taksiran)',
      'Deed of Revocation Stamping Audit',
    ],
    costPerQuery: 'Complimentary Public Registry',
    status: 'ONLINE',
    configuredInEnv: true,
    notes: 'Verifies duty payment validity and prevents un-stamped/inadmissible deeds under Section 52 Act 378.',
  },
  {
    id: 'federal_gazette_osint',
    name: 'Warta Kerajaan Persekutuan (Official Federal Gazette Indexer)',
    provider: 'Percetakan Nasional Malaysia Berhad (PNMB) / Jabatan Peguam Negara (AGC)',
    portalUrl: 'https://lom.agc.gov.my',
    apiEndpoint: 'https://lom.agc.gov.my/gazette-search/api/v1',
    authMethod: 'Bearer Token API Key',
    statutoryBasis: 'Interpretation Acts 1948 and 1967 (Act 388) & Insolvency Act 1967',
    availableProducts: [
      'Notice of Petition for Compulsory Winding Up (Companies Act 2016)',
      'Notice of Bankruptcy Creditor Petition',
      'Statutory Notices under Trustee Act 1949 Section 27 (Deceased Estate Claims)',
    ],
    costPerQuery: 'Open Access OSINT',
    status: 'ONLINE',
    configuredInEnv: true,
    notes: 'Automated scraping and indexing of published statutory gazette notices.',
  },
  {
    id: 'jpn_myidentity',
    name: 'JPN MyIdentity Gateway (Restricted Inter-Agency)',
    provider: 'Jabatan Pendaftaran Negara / MAMPU (Jabatan Digital Negara)',
    portalUrl: 'https://mygdx.malaysia.gov.my',
    apiEndpoint: 'https://mygdx.malaysia.gov.my/jpn/v1/extracts',
    authMethod: 'mTLS + GPKI',
    statutoryBasis: 'Births and Deaths Registration Act 1957 (Act 299) & PDPA 2010',
    availableProducts: [
      'Cabutan Sijil Kelahiran (Certified Extract of Register Book)',
      'Verification of Death Registration (Pengesahan Daftar Kematian)',
      'Family Tree Cross-Reference (Pertalian Keluarga Sah)',
    ],
    costPerQuery: 'Restricted to Agency MOU / Subpoena Duces Tecum',
    status: 'STANDBY',
    configuredInEnv: false,
    notes: 'Restricted under Act 299. For private litigation, discovery requires High Court Subpoena Duces Tecum (Form 66).',
  },
];

// Initial seeded real-world forensic documents corresponding to the case dossier
export const SEEDED_REAL_DOCUMENTS: IngestedRealDocument[] = [
  {
    id: 'REAL-SSM-EXTRACT-001',
    title: 'SSM Certified True Copy: Section 14 Superform & Form 49 - Directorship History',
    originalFileName: 'SSM_CTC_11998377_SUPERFORM_DIR_2026.pdf',
    fileSizeBytes: 1482920,
    sha256Hash: '9a8d74bf01c944d18ecb731e09210984da0e8ff3199bc451ec0cf6113b28b7e2',
    sourceCategory: 'ssm_ctc',
    issuingAgency: 'Suruhanjaya Syarikat Malaysia (SSM)',
    serialOrRegistrationNo: 'DCHEQS-2026-KL-09941824',
    ingestionTimestamp: '2026-09-03T14:22:10.000Z',
    forensicReport: {
      pdfVersion: 'PDF-1.7 (Acrobat 8.x)',
      producerSoftware: 'SSM Digital CTC Engine / Apache FOP / Pos Digicert HSM',
      creationDate: '2026-09-03 14:18:22 MYT',
      modDate: '2026-09-03 14:18:22 MYT',
      incrementalUpdates: 0,
      hasDigitalSignature: true,
      digitalSigner: 'POS DIGICERT QUALIFIED ELECTRONIC SIGNATURE CA 3',
      certificateIssuer: 'Pos Digicert Sdn Bhd (Accredited under DSA 1997)',
      dcheqsQrUrl: 'https://dcheqs.ssm.com.my/verify?serial=DCHEQS-2026-KL-09941824&auth=b8e1f',
      dcheqsSerial: 'DCHEQS-2026-KL-09941824',
      tamperRiskScore: 0,
      integrityVerdict: 'AUTHENTIC_SEALED',
      chainOfCustodySigner: 'Chambers of Forensic Data & Evidence Custodian',
      section90ACertNo: 'CERT-90A-SSM-2026-09941',
    },
    courtRelevance:
      'Proves directorship tenures and shareholding composition. Demonstrates Mary Chong had no authorized mandate to encumber corporate assets post-revocation.',
    admissibilityStatus: 'ADMISSIBLE_S90A',
    markedExhibitNo: 'EXHIBIT C-01 (SSM CTC)',
  },
  {
    id: 'REAL-EFS-ORDER-002',
    title: 'High Court of Malaya: Sealed Injunction & Order of Committal Cause Papers',
    originalFileName: 'HighCourt_WA22NCC_Sealed_Order_2026.pdf',
    fileSizeBytes: 2194300,
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    sourceCategory: 'court_efs_order',
    issuingAgency: 'Mahkamah Tinggi Malaya Kuala Lumpur (Commercial Division)',
    serialOrRegistrationNo: 'WA-22NCC-482-09/2026',
    ingestionTimestamp: '2026-09-03T16:45:00.000Z',
    forensicReport: {
      pdfVersion: 'PDF-1.6',
      producerSoftware: 'e-Kehakiman Omesti PDF Generator v4.2',
      creationDate: '2026-09-03 16:40:11 MYT',
      modDate: '2026-09-03 16:40:11 MYT',
      incrementalUpdates: 0,
      hasDigitalSignature: true,
      digitalSigner: 'MSC Trustgate Judicial CA - Mahkamah Persekutuan Malaysia',
      certificateIssuer: 'MSC TrustGate.com Sdn Bhd',
      dcheqsQrUrl: 'https://efiling.kehakiman.gov.my/verify/order?ref=WA-22NCC-482',
      tamperRiskScore: 0,
      integrityVerdict: 'AUTHENTIC_SEALED',
      chainOfCustodySigner: 'Registrar, High Court of Malaya',
      section90ACertNo: 'CERT-90A-EFS-2026-00482',
    },
    courtRelevance:
      'Judicial order restraining disposal of contested shares and real properties, confirming High Court jurisdiction and formal lis pendens.',
    admissibilityStatus: 'TENDERED_AS_EXHIBIT',
    markedExhibitNo: 'EXHIBIT C-02 (Sealed Court Order)',
  },
  {
    id: 'REAL-LHDN-STAMP-003',
    title: 'LHDN Digital Stamp Certificate: Sijil Setem Digital Adjudication Notice',
    originalFileName: 'LHDN_STAMPS_Digital_Certificate_Act378.pdf',
    fileSizeBytes: 840210,
    sha256Hash: '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
    sourceCategory: 'lhdn_stamping',
    issuingAgency: 'Lembaga Hasil Dalam Negeri Malaysia (Cawangan Pungutan)',
    serialOrRegistrationNo: 'STAMP-2026-WP-8841029',
    ingestionTimestamp: '2026-09-02T10:15:30.000Z',
    forensicReport: {
      pdfVersion: 'PDF-1.4',
      producerSoftware: 'LHDN STAMPS Portal / Oracle Reports',
      creationDate: '2026-09-02 10:11:00 MYT',
      modDate: '2026-09-02 10:11:00 MYT',
      incrementalUpdates: 0,
      hasDigitalSignature: true,
      digitalSigner: 'LHDN Government PKI (GPKI) Server CA',
      certificateIssuer: 'Government of Malaysia GPKI Root CA',
      dcheqsQrUrl: 'https://stamps.hasil.gov.my/stamps/verifyCertificate?no=STAMP-2026-WP-8841029',
      tamperRiskScore: 0,
      integrityVerdict: 'AUTHENTIC_SEALED',
      chainOfCustodySigner: 'Pemungut Duti Setem (Collector of Stamp Duties)',
      section90ACertNo: 'CERT-90A-LHDN-2026-8841',
    },
    courtRelevance:
      'Proof of stamping under Stamp Act 1949 S.52 for the Deed of Revocation of Power of Attorney, extinguishing any lingering ostensible authority.',
    admissibilityStatus: 'ADMISSIBLE_S90A',
    markedExhibitNo: 'EXHIBIT C-03 (LHDN Stamp Cert)',
  },
  {
    id: 'REAL-JPN-SUBPOENA-004',
    title: 'JPN Certified Extract of Birth Register (Cabutan Daftar Kelahiran JPN.LM01)',
    originalFileName: 'JPN_BirthExtract_Subpoena_DucesTecum_Pending.pdf',
    fileSizeBytes: 620400,
    sha256Hash: '7c89f53e029ba8d18ca838119028a38b818318182b8318318281318318283182',
    sourceCategory: 'jpn_birth_cert',
    issuingAgency: 'Jabatan Pendaftaran Negara Malaysia (Bahagian Kelahiran, Kematian & Anak Angkat)',
    serialOrRegistrationNo: 'SUBPOENA-JPN-LM01-2026-482',
    ingestionTimestamp: '2026-09-04T02:00:00.000Z',
    forensicReport: {
      pdfVersion: 'PDF-1.7',
      producerSoftware: 'High Court Form 66 Generator / JPN Legal Process',
      creationDate: '2026-09-04 02:00:00 MYT',
      modDate: '2026-09-04 02:00:00 MYT',
      incrementalUpdates: 0,
      hasDigitalSignature: false,
      tamperRiskScore: 5,
      integrityVerdict: 'VERIFIED_OFFICIAL_EXTRACT',
      chainOfCustodySigner: 'Chambers of Plaintiffs Counsel',
      section90ACertNo: 'CERT-90A-JPN-SUBPOENA-2026',
    },
    courtRelevance:
      'Subpoena Duces Tecum issued to Ketua Pengarah Pendaftaran Negara to produce original Register Book of Births to conclusively disprove false kinship assertions.',
    admissibilityStatus: 'SUBJECT_TO_SUBPOENA',
    markedExhibitNo: 'EXHIBIT C-04 (Subpoena JPN)',
  },
];

export interface SubpoenaCausePaperData {
  caseNumber: string;
  courtLocation: string;
  division: string;
  plaintiff: string;
  defendant: string;
  subpoenaTarget: 'KETUA_PENGARAH_JPN' | 'TIMBALAN_PENDAFTAR_KANAN_MAHKAMAH_TINGGI' | 'PENDAFTAR_HAKMILIK_PTG';
  targetOfficialTitle: string;
  targetAddress: string;
  statutoryRule: string;
  hearingDate: string;
  hearingTime: string;
  courtRoom: string;
  documentsToProduce: string[];
  justification: string;
  lawFirmName: string;
  lawFirmAddress: string;
  counselName: string;
}

export const DEFAULT_JPN_SUBPOENA_DATA: SubpoenaCausePaperData = {
  caseNumber: 'WA-22NCC-482-09/2026',
  courtLocation: 'Kuala Lumpur',
  division: 'Bahagian Dagang (Commercial Division)',
  plaintiff: 'PHILIP CHONG VUN SHIN (Sebagai Pentadbir Harta Pusaka & Benefisiari Tunggal)',
  defendant: 'MARY CHONG MEE LIN & 3 YANG LAIN',
  subpoenaTarget: 'KETUA_PENGARAH_JPN',
  targetOfficialTitle: 'Ketua Pengarah Pendaftaran Negara Malaysia',
  targetAddress: 'Ibu Pejabat Jabatan Pendaftaran Negara Malaysia, No. 20, Persiaran Perdana, Presint 2, 62551 WP Putrajaya',
  statutoryRule: 'Borang 66, Aturan 38 Kaedah 13 Kaedah-Kaedah Mahkamah 2012',
  hearingDate: '2026-09-28',
  hearingTime: '09:00 AM',
  courtRoom: 'Mahkamah Tinggi Dagang 4 (Aras 4, Sayap Kanan)',
  documentsToProduce: [
    'Buku Daftar Asal Kelahiran (Original Register Book of Births) di bawah Seksyen 7 Akta Pendaftaran Kelahiran dan Kematian 1957 (Akta 299) yang merangkumi Daftar Kelahiran No. 640112-08-5120.',
    'Borang JPN.LM01 (Permohonan Pendaftaran Kelahiran) asal yang ditandatangani oleh pemaklum pada masa pendaftaran.',
    'Cabutan Sah Diperakui (Certified True Copy Extract) di bawah meterai rasmi Ketua Pengarah Pendaftaran Negara yang memperakui nasab pertalian keluarga simati.',
  ],
  justification:
    'Dokumen ini adalah perlu dan material dalam prosiding ini bagi menentukan kedudukan sah pentadbiran harta pusaka, menolak dakwaan pertalian yang tidak berasas, dan mengesahkan rekod pendaftaran statutori simati di hadapan Mahkamah.',
  lawFirmName: 'TETUAN CHONG, AZLAN & ASSOCIATES',
  lawFirmAddress: 'Peguambela & Peguamcara, Tingkat 18, Menara Kembar Bank Rakyat, Jalan Travers, 50470 Kuala Lumpur',
  counselName: 'Peguam Kanan Litigasi (No. Sijil Amalan: BC/C/19984)',
};

export const DEFAULT_HIGH_COURT_REGISTRAR_SUBPOENA: SubpoenaCausePaperData = {
  caseNumber: 'WA-22NCC-482-09/2026',
  courtLocation: 'Kuala Lumpur',
  division: 'Bahagian Dagang (Commercial Division)',
  plaintiff: 'PHILIP CHONG VUN SHIN',
  defendant: 'MARY CHONG MEE LIN & 3 YANG LAIN',
  subpoenaTarget: 'TIMBALAN_PENDAFTAR_KANAN_MAHKAMAH_TINGGI',
  targetOfficialTitle: 'Timbalan Pendaftar Kanan / Penolong Kanan Pendaftar Mahkamah Tinggi Malaya',
  targetAddress: 'Pejabat Pendaftaran Mahkamah Tinggi Malaya, Kompleks Mahkamah Kuala Lumpur, Jalan Tuanku Abdul Halim, 50480 Kuala Lumpur',
  statutoryRule: 'Borang 66, Aturan 38 Kaedah 13 Kaedah-Kaedah Mahkamah 2012 & Seksyen 4 Akta Surat Kuasa Wakil 1949',
  hearingDate: '2026-09-28',
  hearingTime: '09:00 AM',
  courtRoom: 'Mahkamah Tinggi Dagang 4',
  documentsToProduce: [
    'Buku Daftar Simpanan Surat Kuasa Wakil (Deposit Register Book of Powers of Attorney) di bawah Seksyen 4 Akta Surat Kuasa Wakil 1949 (Akta 424) bagi P.A. No. 1198/2020.',
    'Surat Cara Pembatalan Surat Kuasa Wakil (Deed of Revocation of Power of Attorney) bertarikh 14 November 2024 yang telah difailkan dan dicatat dalam rekod Mahkamah.',
    'Sijil Pengesahan Pendaftaran Deposit yang dimeterai di bawah meterai Mahkamah Tinggi.',
  ],
  justification:
    'Bagi membuktikan bahawa Surat Kuasa Wakil yang dipertikaikan telah dibatalkan secara sah di bawah Seksyen 4 Akta 424 dan direkodkan dalam daftar rasmi Mahkamah Tinggi sebelum sebarang transaksi yang dipertikaikan berlaku.',
  lawFirmName: 'TETUAN CHONG, AZLAN & ASSOCIATES',
  lawFirmAddress: 'Peguambela & Peguamcara, Tingkat 18, Menara Kembar Bank Rakyat, Jalan Travers, 50470 Kuala Lumpur',
  counselName: 'Peguam Kanan Litigasi (No. Sijil Amalan: BC/C/19984)',
};
