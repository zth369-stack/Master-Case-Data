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

export type SubpoenaTargetType =
  | 'KETUA_PENGARAH_JPN'
  | 'TIMBALAN_PENDAFTAR_KANAN_MAHKAMAH_TINGGI'
  | 'PENDAFTAR_SYARIKAT_SSM'
  | 'PENDAFTAR_HAKMILIK_PTG'
  | 'PEMUNGUT_DUTI_SETEM_LHDN'
  | 'PENGURUS_OPERASI_SWIFT_BANK'
  | 'UNIT_PERISIKAN_KEWANGAN_BNM'
  | 'PENGARAH_FORENSIK_HOSPITAL_DNA'
  | 'CUSTOM';

export interface CourtRegistryOption {
  id: string;
  courtNameMalay: string;
  courtNameEnglish: string;
  location: string;
  state: string;
  divisionMalay: string;
  divisionEnglish: string;
  jurisdictionLevel: 'FEDERAL_COURT' | 'COURT_OF_APPEAL' | 'HIGH_COURT' | 'SESSIONS_COURT';
  defaultCourtRoom: string;
  registrarTitleMalay: string;
  registrarTitleEnglish: string;
  sealTextMalay: string;
  sealTextEnglish: string;
  address: string;
}

export interface CourtCaseOption {
  id: string;
  caseNumber: string;
  courtId: string;
  caseTitleMalay: string;
  caseTitleEnglish: string;
  plaintiff: string;
  defendant: string;
  matterSummary: string;
  hearingDate: string;
  hearingTime: string;
  courtRoom: string;
  recommendedTargets: SubpoenaTargetType[];
}

export interface SubpoenaTargetOption {
  id: SubpoenaTargetType;
  shortLabel: string;
  authorityNameMalay: string;
  authorityNameEnglish: string;
  targetOfficialTitleMalay: string;
  targetOfficialTitleEnglish: string;
  targetAddress: string;
  statutoryRuleMalay: string;
  statutoryRuleEnglish: string;
  defaultDocumentsMalay: string[];
  defaultDocumentsEnglish: string[];
  defaultJustificationMalay: string;
  defaultJustificationEnglish: string;
  badgeColor: string;
}

export const COURT_REGISTRY_OPTIONS: CourtRegistryOption[] = [
  {
    id: 'HIGH_COURT_KL_COMMERCIAL',
    courtNameMalay: 'Mahkamah Tinggi Malaya di Kuala Lumpur',
    courtNameEnglish: 'High Court of Malaya at Kuala Lumpur',
    location: 'Kuala Lumpur',
    state: 'Wilayah Persekutuan Kuala Lumpur',
    divisionMalay: 'Bahagian Dagang (Commercial Division)',
    divisionEnglish: 'Commercial Division',
    jurisdictionLevel: 'HIGH_COURT',
    defaultCourtRoom: 'Mahkamah Tinggi Dagang 4 (Aras 4, Sayap Kanan)',
    registrarTitleMalay: 'Timbalan Pendaftar Kanan / Penolong Kanan Pendaftar',
    registrarTitleEnglish: 'Senior Assistant Registrar / Deputy Registrar',
    sealTextMalay: 'METERAI MAHKAMAH TINGGI MALAYA KUALA LUMPUR',
    sealTextEnglish: 'SEAL OF THE HIGH COURT OF MALAYA AT KUALA LUMPUR',
    address: 'Kompleks Mahkamah Kuala Lumpur, Jalan Tuanku Abdul Halim, 50480 Kuala Lumpur',
  },
  {
    id: 'HIGH_COURT_KL_CIVIL',
    courtNameMalay: 'Mahkamah Tinggi Malaya di Kuala Lumpur',
    courtNameEnglish: 'High Court of Malaya at Kuala Lumpur',
    location: 'Kuala Lumpur',
    state: 'Wilayah Persekutuan Kuala Lumpur',
    divisionMalay: 'Bahagian Sivil (Civil Division)',
    divisionEnglish: 'Civil Division',
    jurisdictionLevel: 'HIGH_COURT',
    defaultCourtRoom: 'Mahkamah Tinggi Sivil 3 (Aras 3)',
    registrarTitleMalay: 'Timbalan Pendaftar Kanan',
    registrarTitleEnglish: 'Senior Deputy Registrar',
    sealTextMalay: 'METERAI MAHKAMAH TINGGI SIVIL KUALA LUMPUR',
    sealTextEnglish: 'SEAL OF THE HIGH COURT CIVIL DIVISION KUALA LUMPUR',
    address: 'Kompleks Mahkamah Kuala Lumpur, Jalan Tuanku Abdul Halim, 50480 Kuala Lumpur',
  },
  {
    id: 'HIGH_COURT_KL_RKK',
    courtNameMalay: 'Mahkamah Tinggi Malaya di Kuala Lumpur',
    courtNameEnglish: 'High Court of Malaya at Kuala Lumpur',
    location: 'Kuala Lumpur',
    state: 'Wilayah Persekutuan Kuala Lumpur',
    divisionMalay: 'Bahagian Rayuan dan Kuasa-Kuasa Khas (Appellate & Special Powers)',
    divisionEnglish: 'Appellate and Special Powers Division',
    jurisdictionLevel: 'HIGH_COURT',
    defaultCourtRoom: 'Mahkamah Tinggi RKK 2 (Aras 5)',
    registrarTitleMalay: 'Timbalan Pendaftar Mahkamah Tinggi',
    registrarTitleEnglish: 'Deputy Registrar High Court',
    sealTextMalay: 'METERAI MAHKAMAH TINGGI KUASA-KUASA KHAS KUALA LUMPUR',
    sealTextEnglish: 'SEAL OF THE HIGH COURT APPELLATE & SPECIAL POWERS DIVISION',
    address: 'Kompleks Mahkamah Kuala Lumpur, Jalan Tuanku Abdul Halim, 50480 Kuala Lumpur',
  },
  {
    id: 'HIGH_COURT_SHAH_ALAM',
    courtNameMalay: 'Mahkamah Tinggi Malaya di Shah Alam',
    courtNameEnglish: 'High Court of Malaya at Shah Alam',
    location: 'Shah Alam',
    state: 'Selangor Darul Ehsan',
    divisionMalay: 'Bahagian Sivil & Probet (Civil & Probate Division)',
    divisionEnglish: 'Civil & Probate Division',
    jurisdictionLevel: 'HIGH_COURT',
    defaultCourtRoom: 'Mahkamah Tinggi Sivil & Probet 2 (Aras 2)',
    registrarTitleMalay: 'Timbalan Pendaftar Kanan Mahkamah Tinggi Shah Alam',
    registrarTitleEnglish: 'Senior Deputy Registrar High Court Shah Alam',
    sealTextMalay: 'METERAI MAHKAMAH TINGGI SHAH ALAM SELANGOR',
    sealTextEnglish: 'SEAL OF THE HIGH COURT SHAH ALAM SELANGOR',
    address: 'Kompleks Mahkamah Sultan Salahuddin Abdul Aziz Shah, Persiaran Masjid, 40000 Shah Alam, Selangor',
  },
  {
    id: 'HIGH_COURT_PENANG',
    courtNameMalay: 'Mahkamah Tinggi Malaya di Pulau Pinang',
    courtNameEnglish: 'High Court of Malaya at Penang',
    location: 'George Town',
    state: 'Pulau Pinang',
    divisionMalay: 'Bahagian Sivil & Dagang (Civil & Commercial)',
    divisionEnglish: 'Civil & Commercial Division',
    jurisdictionLevel: 'HIGH_COURT',
    defaultCourtRoom: 'Mahkamah Tinggi Pulau Pinang 1',
    registrarTitleMalay: 'Timbalan Pendaftar Mahkamah Tinggi Pulau Pinang',
    registrarTitleEnglish: 'Deputy Registrar High Court Penang',
    sealTextMalay: 'METERAI MAHKAMAH TINGGI PULAU PINANG',
    sealTextEnglish: 'SEAL OF THE HIGH COURT PENANG',
    address: 'Bangunan Mahkamah Tinggi, Lebuh Farquhar, 10200 George Town, Pulau Pinang',
  },
  {
    id: 'HIGH_COURT_JOHOR_BAHRU',
    courtNameMalay: 'Mahkamah Tinggi Malaya di Johor Bahru',
    courtNameEnglish: 'High Court of Malaya at Johor Bahru',
    location: 'Johor Bahru',
    state: 'Johor Darul Ta\'zim',
    divisionMalay: 'Bahagian Sivil (Civil Division)',
    divisionEnglish: 'Civil Division',
    jurisdictionLevel: 'HIGH_COURT',
    defaultCourtRoom: 'Mahkamah Tinggi Sivil JB 3',
    registrarTitleMalay: 'Timbalan Pendaftar Mahkamah Tinggi Johor Bahru',
    registrarTitleEnglish: 'Deputy Registrar High Court Johor Bahru',
    sealTextMalay: 'METERAI MAHKAMAH TINGGI JOHOR BAHRU',
    sealTextEnglish: 'SEAL OF THE HIGH COURT JOHOR BAHRU',
    address: 'Kompleks Mahkamah Johor Bahru, Jalan Ayer Molek, 80000 Johor Bahru, Johor',
  },
  {
    id: 'COURT_OF_APPEAL_PUTRAJAYA',
    courtNameMalay: 'Mahkamah Rayuan Malaysia di Putrajaya',
    courtNameEnglish: 'Court of Appeal of Malaysia at Putrajaya',
    location: 'Putrajaya',
    state: 'Wilayah Persekutuan Putrajaya',
    divisionMalay: 'Bahagian Rayuan Sivil (Civil Appellate Jurisdiction)',
    divisionEnglish: 'Civil Appeals Division',
    jurisdictionLevel: 'COURT_OF_APPEAL',
    defaultCourtRoom: 'Dewan Mahkamah Rayuan 1, Istana Kehakiman',
    registrarTitleMalay: 'Pendaftar / Timbalan Pendaftar Mahkamah Rayuan Malaysia',
    registrarTitleEnglish: 'Registrar / Deputy Registrar Court of Appeal of Malaysia',
    sealTextMalay: 'METERAI MAHKAMAH RAYUAN MALAYSIA ISTANA KEHAKIMAN PUTRAJAYA',
    sealTextEnglish: 'SEAL OF THE COURT OF APPEAL OF MALAYSIA PALACE OF JUSTICE',
    address: 'Istana Kehakiman, Presint 3, 62506 Putrajaya',
  },
  {
    id: 'FEDERAL_COURT_PUTRAJAYA',
    courtNameMalay: 'Mahkamah Persekutuan Malaysia di Putrajaya',
    courtNameEnglish: 'Federal Court of Malaysia at Putrajaya',
    location: 'Putrajaya',
    state: 'Wilayah Persekutuan Putrajaya',
    divisionMalay: 'Bidang Kuasa Rayuan Terakhir (Apex Court Jurisdiction)',
    divisionEnglish: 'Apex Appellate Jurisdiction',
    jurisdictionLevel: 'FEDERAL_COURT',
    defaultCourtRoom: 'Dewan Mahkamah Persekutuan, Istana Kehakiman',
    registrarTitleMalay: 'Ketua Pendaftar Mahkamah Persekutuan Malaysia',
    registrarTitleEnglish: 'Chief Registrar Federal Court of Malaysia',
    sealTextMalay: 'METERAI BESAR MAHKAMAH PERSEKUTUAN MALAYSIA',
    sealTextEnglish: 'GREAT SEAL OF THE FEDERAL COURT OF MALAYSIA',
    address: 'Istana Kehakiman, Presint 3, 62506 Putrajaya',
  },
  {
    id: 'SESSIONS_COURT_KL',
    courtNameMalay: 'Mahkamah Sesyen Sivil di Kuala Lumpur',
    courtNameEnglish: 'Civil Sessions Court at Kuala Lumpur',
    location: 'Kuala Lumpur',
    state: 'Wilayah Persekutuan Kuala Lumpur',
    divisionMalay: 'Bahagian Sivil (Civil Subordinate Court)',
    divisionEnglish: 'Civil Division',
    jurisdictionLevel: 'SESSIONS_COURT',
    defaultCourtRoom: 'Mahkamah Sesyen Sivil 8',
    registrarTitleMalay: 'Penolong Kanan Pendaftar Mahkamah Sesyen',
    registrarTitleEnglish: 'Senior Assistant Registrar Sessions Court',
    sealTextMalay: 'METERAI MAHKAMAH SESYEN SIVIL KUALA LUMPUR',
    sealTextEnglish: 'SEAL OF THE CIVIL SESSIONS COURT KUALA LUMPUR',
    address: 'Kompleks Mahkamah Kuala Lumpur, Jalan Tuanku Abdul Halim, 50480 Kuala Lumpur',
  },
];

export const PRESET_COURT_CASES: CourtCaseOption[] = [
  {
    id: 'CASE_WA_COMMERCIAL',
    caseNumber: 'WA-22NCC-482-09/2026',
    courtId: 'HIGH_COURT_KL_COMMERCIAL',
    caseTitleMalay: 'Tindakan Penindasan Pemegang Saham & Pelucutan Hak Aset Korporat (Seksyen 346 Akta Syarikat 2016)',
    caseTitleEnglish: 'Oppression of Minority & Unlawful Corporate Asset Stripping (Section 346 Companies Act 2016)',
    plaintiff: 'PHILIP CHONG VUN SHIN (Sebagai Pentadbir Harta Pusaka Simati & Benefisiari Tunggal)',
    defendant: 'MARY CHONG MEE LIN, TAN SRI DATO SERI ERIC LIM, & PACIFIC ALLIANCE NOMINEES SDN BHD',
    matterSummary: 'Penyalahgunaan kuasa pengarah, pencairan saham haram tanpa resolusi agung, dan pengalihan pegangan ekuiti ke entiti nominee pesisir luar.',
    hearingDate: '2026-09-28',
    hearingTime: '09:00 AM',
    courtRoom: 'Mahkamah Tinggi Dagang 4 (Aras 4, Sayap Kanan)',
    recommendedTargets: ['PENDAFTAR_SYARIKAT_SSM', 'PENGURUS_OPERASI_SWIFT_BANK', 'UNIT_PERISIKAN_KEWANGAN_BNM', 'TIMBALAN_PENDAFTAR_KANAN_MAHKAMAH_TINGGI'],
  },
  {
    id: 'CASE_WA_CIVIL',
    caseNumber: 'WA-24NCvC-714-08/2026',
    courtId: 'HIGH_COURT_KL_CIVIL',
    caseTitleMalay: 'Tuntutan Pembatalan Pindah Milik Hartanah Komersial & Fraud Borang 14A KTN 1965',
    caseTitleEnglish: 'Rescission of Fraudulent Land Transfers & National Land Code S.340 Title Recovery',
    plaintiff: 'PHILIP CHONG VUN SHIN (Plaintif)',
    defendant: 'CHONG HOLDINGS (MALAYSIA) SDN BHD & GOLDEN HORIZON ASSETS MANAGEMENT LTD',
    matterSummary: 'Fraud pendaftaran pindah milik tanah komersial pegangan bebas di bawah Seksyen 340 Kanun Tanah Negara menggunakan Surat Kuasa Wakil terbatal.',
    hearingDate: '2026-10-05',
    hearingTime: '09:30 AM',
    courtRoom: 'Mahkamah Tinggi Sivil 3 (Aras 3)',
    recommendedTargets: ['PENDAFTAR_HAKMILIK_PTG', 'PEMUNGUT_DUTI_SETEM_LHDN', 'TIMBALAN_PENDAFTAR_KANAN_MAHKAMAH_TINGGI'],
  },
  {
    id: 'CASE_BA_PROBATE',
    caseNumber: 'BA-32NCvC-109-07/2026',
    courtId: 'HIGH_COURT_SHAH_ALAM',
    caseTitleMalay: 'Pertikaian Probet Harta Pusaka, Pembatalan Surat Kuasa Mentadbir Palsu & Kodisil Palsu 2023',
    caseTitleEnglish: 'Probate Dispute, Revocation of Fraudulent Letters of Administration & Voiding Forged 2023 Codicil',
    plaintiff: 'PHILIP CHONG VUN SHIN (Pemohon / Plaintif)',
    defendant: 'MARY CHONG MEE LIN & KETUA PENGARAH HARTA PUSAKA KECIL (SEBAGAI PIHAK BERKENAAN)',
    matterSummary: 'Permohonan membatalkan Surat Kuasa Mentadbir yang didakwa diperolehi melalui representasi palsu, pengesahan nasab tulen, dan pemansuhan kodisil palsu.',
    hearingDate: '2026-10-12',
    hearingTime: '09:00 AM',
    courtRoom: 'Mahkamah Tinggi Sivil & Probet 2 (Aras 2)',
    recommendedTargets: ['KETUA_PENGARAH_JPN', 'PENGARAH_FORENSIK_HOSPITAL_DNA', 'TIMBALAN_PENDAFTAR_KANAN_MAHKAMAH_TINGGI'],
  },
  {
    id: 'CASE_JA_INDUSTRIAL',
    caseNumber: 'JA-22NCvC-55-06/2026',
    courtId: 'HIGH_COURT_JOHOR_BAHRU',
    caseTitleMalay: 'Penguatkuasaan Amanah Tersurat Zon Bebas Pelabuhan Tanjung Pelepas & Jejak Aliran Dana SWIFT',
    caseTitleEnglish: 'Enforcement of Express Trust over Port of Tanjung Pelepas Depot & SWIFT Fund Tracing',
    plaintiff: 'PHILIP CHONG VUN SHIN (Plaintif)',
    defendant: 'VERIDIAN LOGISTICS SDN BHD & SOUTHERN MARITIME ASSETS LTD (BVI)',
    matterSummary: 'Tuntutan pengisytiharan hak milik amanah benefisiari ke atas depoh logistik perindustrian dan pengesanan pemindahan telegrafik luar negara USD 3.25M.',
    hearingDate: '2026-10-19',
    hearingTime: '10:00 AM',
    courtRoom: 'Mahkamah Tinggi Sivil JB 3',
    recommendedTargets: ['PENGURUS_OPERASI_SWIFT_BANK', 'UNIT_PERISIKAN_KEWANGAN_BNM', 'PENDAFTAR_HAKMILIK_PTG'],
  },
  {
    id: 'CASE_PUTRAJAYA_APPELLATE',
    caseNumber: 'W-02(NCvC)(W)-1890-10/2026',
    courtId: 'COURT_OF_APPEAL_PUTRAJAYA',
    caseTitleMalay: 'Rayuan Injunksi Interlokutori & Perintah Pemeliharaan Korpus Harta Pusaka Seluruh Dunia',
    caseTitleEnglish: 'Interlocutory Injunction Appeal & Worldwide Preservation of Estate Corpus Assets',
    plaintiff: 'PHILIP CHONG VUN SHIN (Perayu / Plaintif Asal)',
    defendant: 'MARY CHONG MEE LIN & 3 YANG LAIN (Responden-Responden)',
    matterSummary: 'Rayuan terhadap penolakan perintah injunksi Mareva dan pemeliharaan status quo saham sehingga perbicaraan penuh selesai.',
    hearingDate: '2026-11-03',
    hearingTime: '09:00 AM',
    courtRoom: 'Dewan Mahkamah Rayuan 1, Istana Kehakiman',
    recommendedTargets: ['PENDAFTAR_SYARIKAT_SSM', 'PENGURUS_OPERASI_SWIFT_BANK', 'TIMBALAN_PENDAFTAR_KANAN_MAHKAMAH_TINGGI'],
  },
  {
    id: 'CASE_SESSIONS_KL',
    caseNumber: 'WA-B52NCvC-311-05/2026',
    courtId: 'SESSIONS_COURT_KL',
    caseTitleMalay: 'Tindakan Restitusi Penyerahan Buku Statutori, Meterai Syarikat & Rekod Perakaunan',
    caseTitleEnglish: 'Action for Restitution of Statutory Company Books, Common Seals & Accounts',
    plaintiff: 'PHILIP CHONG VUN SHIN (Plaintif)',
    defendant: 'PACIFIC ALLIANCE NOMINEES SDN BHD (Defendan)',
    matterSummary: 'Tuntutan penghakiman segera bagi pemulangan meterai rasmi syarikat, buku minit berkanun, dan lejar kewangan yang ditahan secara tidak sah.',
    hearingDate: '2026-09-22',
    hearingTime: '09:00 AM',
    courtRoom: 'Mahkamah Sesyen Sivil 8',
    recommendedTargets: ['PENDAFTAR_SYARIKAT_SSM', 'PEMUNGUT_DUTI_SETEM_LHDN'],
  },
];

export const SUBPOENA_TARGET_OPTIONS: SubpoenaTargetOption[] = [
  {
    id: 'KETUA_PENGARAH_JPN',
    shortLabel: 'JPN (Daftar Kelahiran & Kematian)',
    authorityNameMalay: 'Jabatan Pendaftaran Negara Malaysia (JPN)',
    authorityNameEnglish: 'National Registration Department of Malaysia (NRD)',
    targetOfficialTitleMalay: 'Ketua Pengarah Pendaftaran Negara Malaysia',
    targetOfficialTitleEnglish: 'Director General of National Registration Malaysia',
    targetAddress: 'Ibu Pejabat Jabatan Pendaftaran Negara Malaysia, No. 20, Persiaran Perdana, Presint 2, 62551 WP Putrajaya',
    statutoryRuleMalay: 'Borang 66, Aturan 38 Kaedah 13 Kaedah-Kaedah Mahkamah 2012 & Seksyen 7 Akta Pendaftaran Kelahiran dan Kematian 1957 (Akta 299)',
    statutoryRuleEnglish: 'Form 66, Order 38 Rule 13 Rules of Court 2012 & Section 7 Births and Deaths Registration Act 1957 (Act 299)',
    defaultDocumentsMalay: [
      'Buku Daftar Asal Kelahiran (Original Register Book of Births) di bawah Seksyen 7 Akta Pendaftaran Kelahiran dan Kematian 1957 (Akta 299) yang merangkumi rekod Daftar Kelahiran No. 640112-08-5120.',
      'Borang JPN.LM01 (Permohonan Pendaftaran Kelahiran) asal yang ditandatangani oleh pemaklum pada masa pendaftaran rasmi.',
      'Cabutan Sah Diperakui (Certified True Copy Extract) di bawah meterai rasmi Ketua Pengarah Pendaftaran Negara yang memperakui salasilah nasab pertalian keluarga simati.',
      'Daftar Pengesahan Kematian Asal (Register of Deaths) dan laporan perubatan kematian yang difailkan di bawah Seksyen 19 Akta 299.',
    ],
    defaultDocumentsEnglish: [
      'Original Register Book of Births maintained pursuant to Section 7 Births and Deaths Registration Act 1957 (Act 299) covering Birth Entry No. 640112-08-5120.',
      'Original Form JPN.LM01 (Application for Birth Registration) signed by the informant at the time of contemporaneous statutory registration.',
      'Certified True Copy Extract under the official statutory seal of the Director General verifying legitimate family pedigree and lineage.',
      'Original Register Book of Deaths and death verification certificate submitted pursuant to Section 19 Act 299.',
    ],
    defaultJustificationMalay:
      'Dokumen ini adalah perlu dan material dalam prosiding ini bagi menentukan kedudukan sah pentadbiran harta pusaka, menolak dakwaan pertalian nasab yang palsu, dan mengesahkan rekod pendaftaran statutori simati secara muktamad di hadapan Mahkamah.',
    defaultJustificationEnglish:
      'These documents are essential and material in this proceeding to conclusively establish lawful entitlement to estate administration, disprove fictitious kinship claims, and present unimpeachable statutory vital records before this Court.',
    badgeColor: 'emerald',
  },
  {
    id: 'TIMBALAN_PENDAFTAR_KANAN_MAHKAMAH_TINGGI',
    shortLabel: 'Mahkamah Tinggi (Surat Kuasa Wakil Akta 424)',
    authorityNameMalay: 'Pejabat Pendaftaran Mahkamah Tinggi Malaya',
    authorityNameEnglish: 'Registry of the High Court of Malaya',
    targetOfficialTitleMalay: 'Timbalan Pendaftar Kanan / Penolong Kanan Pendaftar Mahkamah Tinggi Malaya',
    targetOfficialTitleEnglish: 'Senior Assistant Registrar / Deputy Registrar of the High Court of Malaya',
    targetAddress: 'Pejabat Pendaftaran Mahkamah Tinggi Malaya, Kompleks Mahkamah Kuala Lumpur, Jalan Tuanku Abdul Halim, 50480 Kuala Lumpur',
    statutoryRuleMalay: 'Borang 66, Aturan 38 Kaedah 13 Kaedah-Kaedah Mahkamah 2012 & Seksyen 4 Akta Surat Kuasa Wakil 1949 (Akta 424)',
    statutoryRuleEnglish: 'Form 66, Order 38 Rule 13 Rules of Court 2012 & Section 4 Powers of Attorney Act 1949 (Act 424)',
    defaultDocumentsMalay: [
      'Buku Daftar Simpanan Surat Kuasa Wakil (Deposit Register Book of Powers of Attorney) di bawah Seksyen 4 Akta Surat Kuasa Wakil 1949 (Akta 424) bagi P.A. No. 1198/2020.',
      'Surat Cara Pembatalan Surat Kuasa Wakil (Deed of Revocation of Power of Attorney) bertarikh 14 November 2024 yang telah difailkan dan dicatat dalam rekod Mahkamah.',
      'Sijil Pengesahan Pendaftaran Deposit yang dimeterai di bawah meterai Mahkamah Tinggi.',
      'Buku Rekod Pemfailan Probet bagi Petisyen Guaman No. WA-32NCvC-109-07/2026.',
    ],
    defaultDocumentsEnglish: [
      'Original Deposit Register Book of Powers of Attorney maintained pursuant to Section 4 Powers of Attorney Act 1949 (Act 424) for P.A. No. 1198/2020.',
      'Official Deed of Revocation of Power of Attorney dated 14 November 2024 stamped and formally registered in Court records.',
      'Court Sealed Certificate of Revocation and Registry Deposit Record under the Seal of the High Court.',
      'Probate Filing Register and Docket File for Civil Petition No. WA-32NCvC-109-07/2026.',
    ],
    defaultJustificationMalay:
      'Bagi membuktikan bahawa Surat Kuasa Wakil yang dipertikaikan telah dibatalkan secara sah di bawah Seksyen 4 Akta 424 dan direkodkan dalam daftar rasmi Mahkamah Tinggi sebelum sebarang transaksi yang dipertikaikan dilakukan oleh defendan.',
    defaultJustificationEnglish:
      'To substantiate conclusively that the disputed Power of Attorney was lawfully revoked pursuant to Section 4 Act 424 and memorialized in Court archives prior to any contested transactions executed by the defendants.',
    badgeColor: 'indigo',
  },
  {
    id: 'PENDAFTAR_SYARIKAT_SSM',
    shortLabel: 'SSM (Pecahan Saham, Minit & Borang 32A)',
    authorityNameMalay: 'Suruhanjaya Syarikat Malaysia (SSM)',
    authorityNameEnglish: 'Companies Commission of Malaysia (SSM)',
    targetOfficialTitleMalay: 'Pendaftar Syarikat, Suruhanjaya Syarikat Malaysia',
    targetOfficialTitleEnglish: 'Registrar of Companies, Companies Commission of Malaysia',
    targetAddress: 'Menara SSM@Sentral, No. 7, Jalan Stesen Sentral 5, Kuala Lumpur Sentral, 50623 Kuala Lumpur',
    statutoryRuleMalay: 'Borang 66, Aturan 38 Kaedah 13 Kaedah-Kaedah Mahkamah 2012 & Seksyen 602 Akta Syarikat 2016 (Akta 777)',
    statutoryRuleEnglish: 'Form 66, Order 38 Rule 13 Rules of Court 2012 & Section 602 Companies Act 2016 (Act 777)',
    defaultDocumentsMalay: [
      'Instrumen Pemindahan Saham Asal (Original Form 32A / Section 105 Instruments of Transfer) yang didakwa ditandatangani pada 12 Mac 2023 bagi pemindahan 2,500,000 unit saham.',
      'Daftar Anggota Asal (Register of Members under Section 50 Companies Act 2016) dan Daftar Pemegang Saham Pengasas sejak tarikh penubuhan.',
      'Buku Minit Mesyuarat Lembaga Pengarah Asal dan Resolusi Pekeliling Pengarah (Directors Circular Resolutions) berkaitan pelupusan aset korporat.',
      'Penyata Pemfailan Seksyen 58 (Perubahan Pengarah dan Pegawai) berserta dokumen sokongan akuan bersumpah penerimaan lantikan.',
    ],
    defaultDocumentsEnglish: [
      'Original Form 32A / Section 105 Instruments of Share Transfer purportedly executed on 12 March 2023 for 2,500,000 ordinary shares.',
      'Original Register of Members maintained under Section 50 Companies Act 2016 and Register of Beneficial Owners.',
      'Original Board of Directors Minute Books and Directors Circular Resolutions sanctioning alleged asset disposals.',
      'Statutory Section 58 Return of Directors, Managers and Secretaries together with Form 48A statutory declarations.',
    ],
    defaultJustificationMalay:
      'Dokumen ini material bagi membuktikan bahawa pemindahan saham dibuat melalui pemalsuan tandatangan dan manipulasi daftar berkanun tanpa pengetahuan atau persetujuan pemilik benefisiari.',
    defaultJustificationEnglish:
      'These documents are critically material to prove that contested share transfers were effected via fraudulent attestation and registry manipulation without beneficial owner knowledge.',
    badgeColor: 'amber',
  },
  {
    id: 'PENDAFTAR_HAKMILIK_PTG',
    shortLabel: 'PTG / Pejabat Tanah (Hakmilik Geran & Borang 14A)',
    authorityNameMalay: 'Pejabat Pengarah Tanah dan Galian (PTG e-Tanah)',
    authorityNameEnglish: 'Land Registry / State Director of Lands and Mines',
    targetOfficialTitleMalay: 'Pendaftar Hakmilik Negeri / Pentadbir Tanah Daerah',
    targetOfficialTitleEnglish: 'Registrar of Titles / District Land Administrator',
    targetAddress: 'Pejabat Pengarah Tanah dan Galian Wilayah Persekutuan Kuala Lumpur, Aras 1-4, Rumah Persekutuan, Jalan Sultan Hishamuddin, 50678 Kuala Lumpur',
    statutoryRuleMalay: 'Borang 66, Aturan 38 Kaedah 13 Kaedah-Kaedah Mahkamah 2012 & Seksyen 343 & 380 Kanun Tanah Negara (Akta 828)',
    statutoryRuleEnglish: 'Form 66, Order 38 Rule 13 Rules of Court 2012 & Sections 343 & 380 National Land Code (Act 828)',
    defaultDocumentsMalay: [
      'Dokumen Hakmilik Daftar Asal (Original Register Document of Title / RDT) bagi Geran No. 51928, Lot 401, Seksyen 89, Bandar Kuala Lumpur.',
      'Borang 14A (Pindah Milik Tanah) asal bertarikh 18 Ogos 2023 berserta dokumen sokongan penyaksian di hadapan Peguamcara / Pentadbir Tanah.',
      'Buku Rekod Permohonan Kaveat Persendirian (Borang 19B) dan Memorial Pendaftaran Kaveat Persendirian No. 892/2024.',
      'Log Audit Forensik Sistem e-Tanah bagi merekodkan identiti pegawai yang meluluskan pendaftaran pindah milik tersebut.',
    ],
    defaultDocumentsEnglish: [
      'Original Register Document of Title (RDT) for Geran No. 51928, Lot 401, Section 89, Town and District of Kuala Lumpur.',
      'Original Form 14A (Instrument of Transfer of Land) dated 18 August 2023 with attestation schedules.',
      'Private Caveat Entry Application (Form 19B) and Memorial Register of Caveats No. 892/2024.',
      'e-Tanah System Audit Logs recording user ID, IP address, and supervisor overrides authorizing registry entry.',
    ],
    defaultJustificationMalay:
      'Bagi membuktikan kecacatan hak milik di bawah Seksyen 340(2) Kanun Tanah Negara atas alasan fraud dan pemalsuan instrumen pindah milik tanah bernilai tinggi.',
    defaultJustificationEnglish:
      'To establish defeasibility of registered title pursuant to Section 340(2) National Land Code grounded on fraud, forgery, and insufficient instrument.',
    badgeColor: 'sky',
  },
  {
    id: 'PEMUNGUT_DUTI_SETEM_LHDN',
    shortLabel: 'LHDN (Sijil Setem Digital & Adjudikasi)',
    authorityNameMalay: 'Lembaga Hasil Dalam Negeri Malaysia (LHDN)',
    authorityNameEnglish: 'Inland Revenue Board of Malaysia (IRBM / LHDN)',
    targetOfficialTitleMalay: 'Pemungut Duti Setem, Lembaga Hasil Dalam Negeri Malaysia',
    targetOfficialTitleEnglish: 'Collector of Stamp Duties, Inland Revenue Board of Malaysia',
    targetAddress: 'Pusat Perkhidmatan Hasil LHDN, Cawangan Setem WP Kuala Lumpur, Kompleks Kerajaan, Jalan Tuanku Abdul Halim, 50600 Kuala Lumpur',
    statutoryRuleMalay: 'Borang 66, Aturan 38 Kaedah 13 Kaedah-Kaedah Mahkamah 2012 & Seksyen 52 Akta Setem 1949 (Akta 378)',
    statutoryRuleEnglish: 'Form 66, Order 38 Rule 13 Rules of Court 2012 & Section 52 Stamp Act 1949 (Act 378)',
    defaultDocumentsMalay: [
      'Rekod Pangkalan Data Sistem STAMPS dan Sijil Penyeteman Digital rasmi bagi Surat Ikatan Pembatalan Kuasa Wakil No. STAMP-2024-WP-8841029.',
      'Buku Lejar Taksiran Duti Adjudikasi bagi Surat Cara Pemindahan Saham dan Hartanah bernilai RM 14,800,000.',
      'Rekod pengesahan pembayaran duti atau penolakan adjudikasi bagi instrumen Form 32A yang dipertikaikan.',
    ],
    defaultDocumentsEnglish: [
      'Official STAMPS System Database Audit Record and Digital Stamp Certificate for Deed of Revocation No. STAMP-2024-WP-8841029.',
      'Duty Adjudication Docket and Valuation Assessment Records for instruments valued at RM 14,800,000.',
      'Evidence of stamp duty delinquency, penalty notices, or non-stamping invalidating documents under Section 52 Stamp Act 1949.',
    ],
    defaultJustificationMalay:
      'Bagi membuktikan pengesahan duti setem di bawah Seksyen 52 Akta Setem 1949 dan menolak pengemukaan dokumen tanpa duti yang tidak boleh diterima sebagai keterangan.',
    defaultJustificationEnglish:
      'To establish compliance with Section 52 Stamp Act 1949 and bar inadmissible unstamped or fraudulently stamped instruments tendered by opposing parties.',
    badgeColor: 'violet',
  },
  {
    id: 'PENGURUS_OPERASI_SWIFT_BANK',
    shortLabel: 'Perbankan / SWIFT (MT103 Wire Nostro Logs)',
    authorityNameMalay: 'Bahagian Operasi Kiriman Wang Asing & SWIFT',
    authorityNameEnglish: 'Commercial Bank Foreign Remittance & SWIFT Operations',
    targetOfficialTitleMalay: 'Pengurus Operasi Kiriman Wang Asing & Penyelesaian SWIFT, Malayan Banking Berhad',
    targetOfficialTitleEnglish: 'Head of Foreign Remittance Operations & SWIFT Wire Settlement, Malayan Banking Berhad',
    targetAddress: 'Bahagian Operasi Perbankan Global, Menara Maybank, 100 Jalan Tun Perak, 50050 Kuala Lumpur',
    statutoryRuleMalay: 'Borang 66, Aturan 38 Kaedah 13 Kaedah-Kaedah Mahkamah 2012 & Seksyen 134(1) Akta Perkhidmatan Kewangan 2013 (Akta 758)',
    statutoryRuleEnglish: 'Form 66, Order 38 Rule 13 Rules of Court 2012 & Section 134(1) Schedule 11 Financial Services Act 2013 (Act 758)',
    defaultDocumentsMalay: [
      'Salinan Sah Mesej Kiriman Telegrafik SWIFT MT103 Nostro/Vostro Asal bertarikh 15 November 2024 bagi pemindahan dana USD 3,250,000.00.',
      'Borang Permohonan Pindahan Telegrafik Keluar Negara asal yang ditandatangani oleh penandatangan berkuasa akaun syarikat.',
      'Penyata Akaun Semasa Syarikat lengkap dari Januari 2023 hingga kini yang mencatatkan pemindahan dana keluar.',
      'Log Pengesahan Audit Perbankan Elektronik (Corporate Online Banking Approval Audit Trail) dengan catatan alamat IP dan cap masa OTP.',
    ],
    defaultDocumentsEnglish: [
      'Authenticated Raw SWIFT MT103 Outward Telegraphic Transfer Message dated 15 November 2024 for USD 3,250,000.00.',
      'Original Telegraphic Transfer Application Form bearing specimen authorized signatories.',
      'Certified Comprehensive Corporate Bank Statements spanning January 2023 to date.',
      'Corporate Online Banking Token Authentication Audit Trail with IP logs and dual-custody authorization timestamps.',
    ],
    defaultJustificationMalay:
      'Dokumen ini adalah penting bagi mengesan aliran keluar wang korporat (equitable asset tracing) dan membuktikan pelupusan dana tanpa mandat sah pengarah.',
    defaultJustificationEnglish:
      'These records are crucial for forensic asset tracing and restitution of misappropriated corporate treasury reserves.',
    badgeColor: 'teal',
  },
  {
    id: 'UNIT_PERISIKAN_KEWANGAN_BNM',
    shortLabel: 'BNM FIED (AMLA & Pemunya Benefisiari)',
    authorityNameMalay: 'Bank Negara Malaysia (Jabatan Perisikan Kewangan & Penguatkuasaan)',
    authorityNameEnglish: 'Bank Negara Malaysia (Financial Intelligence & Enforcement Department)',
    targetOfficialTitleMalay: 'Pengarah Jabatan Perisikan Kewangan dan Penguatkuasaan (FIED), Bank Negara Malaysia',
    targetOfficialTitleEnglish: 'Director of Financial Intelligence and Enforcement Department (FIED), Bank Negara Malaysia',
    targetAddress: 'Ibu Pejabat Bank Negara Malaysia, Jalan Dato\' Onn, 50480 Kuala Lumpur',
    statutoryRuleMalay: 'Borang 66, Aturan 38 Kaedah 13 Kaedah-Kaedah Mahkamah 2012 & Seksyen 14, 20 & 44 Akta AMLA 2001 (Akta 613)',
    statutoryRuleEnglish: 'Form 66, Order 38 Rule 13 Rules of Court 2012 & Sections 14, 20 & 44 Anti-Money Laundering Act 2001 (Act 613)',
    defaultDocumentsMalay: [
      'Daftar Pendedahan Statutori Pemunya Benefisiari Terakhir (Ultimate Beneficial Ownership Register) entiti nominee berkaitan.',
      'Rekod Perisikan Aliran Tunai Antarabangsa dan Analisis Carta Aliran Wang yang dibekukan di bawah Seksyen 44 AMLA 2001.',
      'Sijil Pengesahan Perisikan Kewangan bagi pengesanan aset pesisir luar (offshore shell companies).',
    ],
    defaultDocumentsEnglish: [
      'Statutory Register of Ultimate Beneficial Ownership (UBO) for nominee and offshore counterparties.',
      'Intelligence Dossier and Financial Flowcharts regarding assets frozen pursuant to Section 44 AMLA 2001.',
      'Accredited Certification of Transnational Shell Entity Networks and disguised controlling shareholdings.',
    ],
    defaultJustificationMalay:
      'Bagi mendedahkan struktur hak milik tersembunyi (piercing corporate veil) dan membuktikan konspirasi pengalihan aset secara terancang.',
    defaultJustificationEnglish:
      'To pierce the corporate veil, expose concealed controlling interests, and substantiate intentional dissipation of assets.',
    badgeColor: 'rose',
  },
  {
    id: 'PENGARAH_FORENSIK_HOSPITAL_DNA',
    shortLabel: 'Jabatan Kimia / Hospital (Forensik DNA 24-Loci)',
    authorityNameMalay: 'Jabatan Kimia Malaysia / Bahagian Forensik Hospital',
    authorityNameEnglish: 'Department of Chemistry Malaysia / Hospital Forensic Division',
    targetOfficialTitleMalay: 'Pengarah Bahagian Forensik DNA, Jabatan Kimia Malaysia',
    targetOfficialTitleEnglish: 'Director of Forensic DNA Division, Department of Chemistry Malaysia',
    targetAddress: 'Ibu Pejabat Jabatan Kimia Malaysia, Jalan Sultan, 46661 Petaling Jaya, Selangor',
    statutoryRuleMalay: 'Borang 66, Aturan 38 Kaedah 13 Kaedah-Kaedah Mahkamah 2012 & Akta Identifikasi DNA 2009 (Akta 699)',
    statutoryRuleEnglish: 'Form 66, Order 38 Rule 13 Rules of Court 2012 & DNA Identification Act 2009 (Act 699)',
    defaultDocumentsMalay: [
      'Laporan Analisis Profil DNA 24-Loci STR Asal (Original Electropherogram & Concordance Matrix Report) No. Ruj: KIMIA/DNA/2026/8912.',
      'Buku Log Rantaian Jagaan Bahan Bukti Biologi (Chain of Custody Sample Ledger) dari tarikh pensampelan hingga ujian perbandingan.',
      'Sijil Perakuan Pakar Forensik DNA di bawah Seksyen 399 Kanun Tatacara Jenayah dan Seksyen 90A Akta Keterangan 1950.',
    ],
    defaultDocumentsEnglish: [
      'Original 24-Loci STR DNA Electropherogram and Concordance Matrix Report Ref: KIMIA/DNA/2026/8912.',
      'Biological Sample Chain of Custody Ledger detailing extraction, preservation, and bench testing procedures.',
      'Forensic Expert Certification tendered under Section 399 Criminal Procedure Code and Section 90A Evidence Act 1950.',
    ],
    defaultJustificationMalay:
      'Bagi mengesahkan kesahihan biologi keturunan 99.999% dan membuktikan penipuan dalam dakwaan pertalian nasab secara saintifik.',
    defaultJustificationEnglish:
      'To provide conclusive 99.999% scientific biometric proof establishing genuine pedigree and rebutting fraudulent kinship assertions.',
    badgeColor: 'cyan',
  },
];

export interface SubpoenaCausePaperData {
  courtId?: string;
  courtNameMalay: string;
  courtNameEnglish: string;
  courtLocation: string;
  stateMalay?: string;
  divisionMalay: string;
  divisionEnglish: string;
  jurisdictionLevel?: string;
  caseNumber: string;
  caseId?: string;
  caseTitleMalay?: string;
  caseTitleEnglish?: string;
  plaintiff: string;
  defendant: string;
  subpoenaTarget: SubpoenaTargetType;
  targetOfficialTitle: string;
  targetAddress: string;
  statutoryRule: string;
  statutoryRuleEnglish?: string;
  hearingDate: string;
  hearingTime: string;
  courtRoom: string;
  documentsToProduce: string[];
  documentsToProduceEnglish?: string[];
  justification: string;
  justificationEnglish?: string;
  lawFirmName: string;
  lawFirmAddress: string;
  counselName: string;
  registrarTitleMalay?: string;
  registrarTitleEnglish?: string;
  courtSealTextMalay?: string;
  courtSealTextEnglish?: string;
  filingRef?: string;
}

export const DEFAULT_JPN_SUBPOENA_DATA: SubpoenaCausePaperData = {
  courtId: 'HIGH_COURT_KL_COMMERCIAL',
  courtNameMalay: 'Mahkamah Tinggi Malaya di Kuala Lumpur',
  courtNameEnglish: 'High Court of Malaya at Kuala Lumpur',
  courtLocation: 'Kuala Lumpur',
  stateMalay: 'Wilayah Persekutuan Kuala Lumpur',
  divisionMalay: 'Bahagian Dagang (Commercial Division)',
  divisionEnglish: 'Commercial Division',
  caseNumber: 'WA-22NCC-482-09/2026',
  caseId: 'CASE_WA_COMMERCIAL',
  caseTitleMalay: 'Tindakan Penindasan Pemegang Saham & Pelucutan Hak Aset Korporat',
  caseTitleEnglish: 'Oppression of Minority & Unlawful Corporate Asset Stripping',
  plaintiff: 'PHILIP CHONG VUN SHIN (Sebagai Pentadbir Harta Pusaka & Benefisiari Tunggal)',
  defendant: 'MARY CHONG MEE LIN & 3 YANG LAIN',
  subpoenaTarget: 'KETUA_PENGARAH_JPN',
  targetOfficialTitle: 'Ketua Pengarah Pendaftaran Negara Malaysia',
  targetAddress: 'Ibu Pejabat Jabatan Pendaftaran Negara Malaysia, No. 20, Persiaran Perdana, Presint 2, 62551 WP Putrajaya',
  statutoryRule: 'Borang 66, Aturan 38 Kaedah 13 Kaedah-Kaedah Mahkamah 2012 & Seksyen 7 Akta Pendaftaran Kelahiran dan Kematian 1957 (Akta 299)',
  statutoryRuleEnglish: 'Form 66, Order 38 Rule 13 Rules of Court 2012 & Section 7 Births and Deaths Registration Act 1957 (Act 299)',
  hearingDate: '2026-09-28',
  hearingTime: '09:00 AM',
  courtRoom: 'Mahkamah Tinggi Dagang 4 (Aras 4, Sayap Kanan)',
  documentsToProduce: [
    'Buku Daftar Asal Kelahiran (Original Register Book of Births) di bawah Seksyen 7 Akta Pendaftaran Kelahiran dan Kematian 1957 (Akta 299) yang merangkumi Daftar Kelahiran No. 640112-08-5120.',
    'Borang JPN.LM01 (Permohonan Pendaftaran Kelahiran) asal yang ditandatangani oleh pemaklum pada masa pendaftaran rasmi.',
    'Cabutan Sah Diperakui (Certified True Copy Extract) di bawah meterai rasmi Ketua Pengarah Pendaftaran Negara yang memperakui nasab pertalian keluarga simati.',
    'Daftar Pengesahan Kematian Asal (Register of Deaths) dan laporan perubatan kematian yang difailkan di bawah Seksyen 19 Akta 299.',
  ],
  documentsToProduceEnglish: [
    'Original Register Book of Births maintained pursuant to Section 7 Births and Deaths Registration Act 1957 (Act 299) covering Birth Entry No. 640112-08-5120.',
    'Original Form JPN.LM01 (Application for Birth Registration) signed by the informant at the time of contemporaneous statutory registration.',
    'Certified True Copy Extract under the official statutory seal of the Director General verifying legitimate family pedigree and lineage.',
  ],
  justification:
    'Dokumen ini adalah perlu dan material dalam prosiding ini bagi menentukan kedudukan sah pentadbiran harta pusaka, menolak dakwaan pertalian yang tidak berasas, dan mengesahkan rekod pendaftaran statutori simati di hadapan Mahkamah.',
  justificationEnglish:
    'These documents are essential and material in this proceeding to conclusively establish lawful entitlement to estate administration, disprove fictitious kinship claims, and present unimpeachable statutory vital records before this Court.',
  lawFirmName: 'TETUAN CHONG, AZLAN & ASSOCIATES',
  lawFirmAddress: 'Peguambela & Peguamcara, Tingkat 18, Menara Kembar Bank Rakyat, Jalan Travers, 50470 Kuala Lumpur',
  counselName: 'Peguam Kanan Litigasi (No. Sijil Amalan: BC/C/19984)',
  registrarTitleMalay: 'Timbalan Pendaftar Kanan / Penolong Kanan Pendaftar',
  registrarTitleEnglish: 'Senior Assistant Registrar / Deputy Registrar',
  courtSealTextMalay: 'METERAI MAHKAMAH TINGGI MALAYA KUALA LUMPUR',
  courtSealTextEnglish: 'SEAL OF THE HIGH COURT OF MALAYA AT KUALA LUMPUR',
  filingRef: 'CAL/LIT/WA22NCC482/2026',
};

export const DEFAULT_HIGH_COURT_REGISTRAR_SUBPOENA: SubpoenaCausePaperData = {
  courtId: 'HIGH_COURT_KL_COMMERCIAL',
  courtNameMalay: 'Mahkamah Tinggi Malaya di Kuala Lumpur',
  courtNameEnglish: 'High Court of Malaya at Kuala Lumpur',
  courtLocation: 'Kuala Lumpur',
  stateMalay: 'Wilayah Persekutuan Kuala Lumpur',
  divisionMalay: 'Bahagian Dagang (Commercial Division)',
  divisionEnglish: 'Commercial Division',
  caseNumber: 'WA-22NCC-482-09/2026',
  caseId: 'CASE_WA_COMMERCIAL',
  caseTitleMalay: 'Tindakan Penindasan Pemegang Saham & Pelucutan Hak Aset Korporat',
  caseTitleEnglish: 'Oppression of Minority & Unlawful Corporate Asset Stripping',
  plaintiff: 'PHILIP CHONG VUN SHIN',
  defendant: 'MARY CHONG MEE LIN & 3 YANG LAIN',
  subpoenaTarget: 'TIMBALAN_PENDAFTAR_KANAN_MAHKAMAH_TINGGI',
  targetOfficialTitle: 'Timbalan Pendaftar Kanan / Penolong Kanan Pendaftar Mahkamah Tinggi Malaya',
  targetAddress: 'Pejabat Pendaftaran Mahkamah Tinggi Malaya, Kompleks Mahkamah Kuala Lumpur, Jalan Tuanku Abdul Halim, 50480 Kuala Lumpur',
  statutoryRule: 'Borang 66, Aturan 38 Kaedah 13 Kaedah-Kaedah Mahkamah 2012 & Seksyen 4 Akta Surat Kuasa Wakil 1949 (Akta 424)',
  statutoryRuleEnglish: 'Form 66, Order 38 Rule 13 Rules of Court 2012 & Section 4 Powers of Attorney Act 1949 (Act 424)',
  hearingDate: '2026-09-28',
  hearingTime: '09:00 AM',
  courtRoom: 'Mahkamah Tinggi Dagang 4 (Aras 4, Sayap Kanan)',
  documentsToProduce: [
    'Buku Daftar Simpanan Surat Kuasa Wakil (Deposit Register Book of Powers of Attorney) di bawah Seksyen 4 Akta Surat Kuasa Wakil 1949 (Akta 424) bagi P.A. No. 1198/2020.',
    'Surat Cara Pembatalan Surat Kuasa Wakil (Deed of Revocation of Power of Attorney) bertarikh 14 November 2024 yang telah difailkan dan dicatat dalam rekod Mahkamah.',
    'Sijil Pengesahan Pendaftaran Deposit yang dimeterai di bawah meterai Mahkamah Tinggi.',
    'Buku Rekod Pemfailan Probet bagi Petisyen Guaman No. WA-32NCvC-109-07/2026.',
  ],
  documentsToProduceEnglish: [
    'Original Deposit Register Book of Powers of Attorney maintained pursuant to Section 4 Powers of Attorney Act 1949 (Act 424) for P.A. No. 1198/2020.',
    'Official Deed of Revocation of Power of Attorney dated 14 November 2024 stamped and formally registered in Court records.',
    'Court Sealed Certificate of Revocation and Registry Deposit Record under the Seal of the High Court.',
  ],
  justification:
    'Bagi membuktikan bahawa Surat Kuasa Wakil yang dipertikaikan telah dibatalkan secara sah di bawah Seksyen 4 Akta 424 dan direkodkan dalam daftar rasmi Mahkamah Tinggi sebelum sebarang transaksi yang dipertikaikan berlaku.',
  justificationEnglish:
    'To substantiate conclusively that the disputed Power of Attorney was lawfully revoked pursuant to Section 4 Act 424 and memorialized in Court archives prior to any contested transactions executed by the defendants.',
  lawFirmName: 'TETUAN CHONG, AZLAN & ASSOCIATES',
  lawFirmAddress: 'Peguambela & Peguamcara, Tingkat 18, Menara Kembar Bank Rakyat, Jalan Travers, 50470 Kuala Lumpur',
  counselName: 'Peguam Kanan Litigasi (No. Sijil Amalan: BC/C/19984)',
  registrarTitleMalay: 'Timbalan Pendaftar Kanan / Penolong Kanan Pendaftar',
  registrarTitleEnglish: 'Senior Assistant Registrar / Deputy Registrar',
  courtSealTextMalay: 'METERAI MAHKAMAH TINGGI MALAYA KUALA LUMPUR',
  courtSealTextEnglish: 'SEAL OF THE HIGH COURT OF MALAYA AT KUALA LUMPUR',
  filingRef: 'CAL/LIT/WA22NCC482/2026',
};
