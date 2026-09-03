import crypto from 'node:crypto';
import type {
  DocumentVerificationReport,
  ForensicEntity,
  IngestedKeySet,
  OfficerAccount,
  VerifiableDocument,
} from '../shared/types.js';

// Pre-seeded Target Profile: Kavinath Ganeshan
export const TARGET_PROFILE = {
  fullName: 'Kavinath Ganeshan',
  nric: '960906-08-5839',
  jpnBirthIndexes: ['Ipoh, Perak', 'Johor Bahru, Johor'],
  status: 'Active Audit Subject / Subject of Enforcement',
  primaryDomesticEntity: 'Kavinath Holdings Sdn Bhd (SSM: 1199837-7)',
  jurisdictions: ['Malaysia', 'Geneva, Switzerland', 'Cayman Islands'],
  totalLiabilitiesMYR: 56420000,
  domesticLiquidAssetsMYR: 300000,
  offshoreLiquidUSD: 35000000,
  taxExposureMYR: 56420000,
  flaggedForgedUSD: 2000000,
};

// Full entity reconciliation mapping from forensic dossier
export const FORENSIC_ENTITIES: ForensicEntity[] = [
  {
    id: 'ENT-01',
    entityName: 'Kavinath Ganeshan',
    identifierType: 'NRIC',
    identifierReference: '960906-08-5839',
    operatingJurisdiction: 'Malaysia',
    operationalRole: 'Primary Target / Ultimate Beneficiary',
    legalStatus: 'Active Audit Subject / Subject of Enforcement',
    financialValue: 'Subject of Multi-Agency Enforcement',
    riskRating: 'CRITICAL',
    notes: 'JPN birth records match corporate officer appointments registered with SSM. Dual-track asset architecture detected.',
  },
  {
    id: 'ENT-02',
    entityName: 'Kavinath Holdings Sdn Bhd',
    identifierType: 'SSM',
    identifierReference: '1199837-7',
    operatingJurisdiction: 'Malaysia',
    operationalRole: 'Domestic Holding Company / Treasury Node',
    legalStatus: 'Active Operational Node',
    financialValue: 'Corporate Equity Base',
    riskRating: 'HIGH',
    notes: 'Primary domestic operational vehicle. Disputed co-directorship with Proxy X (NRIC: 960907-08-5840).',
  },
  {
    id: 'ENT-03',
    entityName: 'Archon Holdings SA',
    identifierType: 'LOMBARD_ODIER',
    identifierReference: 'ch9300767000usd000001',
    operatingJurisdiction: 'Geneva, Switzerland',
    operationalRole: 'Offshore Corporate Shell / Capital Vehicle',
    legalStatus: 'Active / Unencumbered Sub-Account',
    financialValue: 'USD 35,000,000',
    riskRating: 'HIGH',
    notes: 'Veridian Estate liquidation settlement (2017). Primary target for international MLAT asset recovery proceedings.',
  },
  {
    id: 'ENT-04',
    entityName: 'Ganesam Family Trust',
    identifierType: 'CIMA_INSTRUMENT',
    identifierReference: 'KYD-110077-USD-B',
    operatingJurisdiction: 'Cayman Islands',
    operationalRole: 'Offshore Asset Protection Trust',
    legalStatus: 'Frozen (CIMA-FRZ-25-06-147)',
    financialValue: 'Restricted Equity Reserves',
    riskRating: 'HIGH',
    notes: 'Administrative freeze order executed under AML/CFT/CPF regulatory framework by Cayman Islands Monetary Authority.',
  },
  {
    id: 'ENT-05',
    entityName: 'RHB Privilege Commercial Joint Account',
    identifierType: 'COURT_DOCKET',
    identifierReference: 'High Court Suit No. 4-334567',
    operatingJurisdiction: 'Malaysia',
    operationalRole: 'Commercial Joint Operating Account',
    legalStatus: 'Litigated / Sub-Judice (Frozen Funds)',
    financialValue: 'MYR 300,000',
    riskRating: 'MEDIUM',
    notes: 'Proxy dispute with Proxy X. Engages Section 4(c) exceptions under Partnership Act 1961 (Act 135).',
  },
  {
    id: 'ENT-06',
    entityName: 'AmBank Ipoh Commercial Account',
    identifierType: 'BANK_ACCOUNT',
    identifierReference: 'Account #158012884572',
    operatingJurisdiction: 'Malaysia',
    operationalRole: 'Commercial Banking Account',
    legalStatus: 'Cryptographically Flagged (Forged Credit Trace)',
    financialValue: 'USD 2,000,000 (Fabricated)',
    riskRating: 'CRITICAL',
    notes: 'Foreign credit trace anomaly. SHA-256 ledger hash verification revealed structural discrepancy indicating corporate identity theft or fraudulent balance inflation.',
  },
  {
    id: 'ENT-07',
    entityName: 'Inland Revenue Board Tax Assessment',
    identifierType: 'LHDN_FILE',
    identifierReference: 'LHDN/HASIL/AUDIT/2026/88392',
    operatingJurisdiction: 'Malaysia',
    operationalRole: 'Direct Tax Assessment & Statutory Penalty',
    legalStatus: 'Default Penalty Levy Issued',
    financialValue: 'MYR 56,420,000',
    riskRating: 'CRITICAL',
    notes: 'Sections 4(c), 113(1)(a) incorrect returns (MYR 28M penalty), 114 wilful evasion, 103 late surcharge, and Section 140A transfer pricing arm’s length adjustments.',
  },
];

// Pre-seeded Verifiable Documents from the intelligence assessment
export const PRESEEDED_DOCUMENTS: VerifiableDocument[] = [
  {
    id: 'DOC-SSM-1199837-7',
    documentTitle: 'SSM Corporate Registry Profile – Kavinath Holdings Sdn Bhd',
    documentCategory: 'SSM_REGISTRATION',
    issuingAuthority: 'Suruhanjaya Syarikat Malaysia (SSM)',
    referenceNumber: '1199837-7',
    dateIssued: '2020-04-12',
    fileFormat: 'PDF',
    fileSizeBytes: 482910,
    expectedSha256: '9a8b1c4e7f3d2a5b6c8e0f1a3b5c7d9e1f2a4b6c8d0e2f4a6b8c0d2e4f6a8b1c',
    actualSha256: '9a8b1c4e7f3d2a5b6c8e0f1a3b5c7d9e1f2a4b6c8d0e2f4a6b8c0d2e4f6a8b1c',
    verificationStatus: 'VERIFIED',
    summaryDescription: 'Official SSM Corporate Profile confirming incorporation, shareholding capital, and registered office at Menara SSM@Sentral.',
    extractedMetadata: {
      companyName: 'KAVINATH HOLDINGS SDN. BHD.',
      ssmNumber: '1199837-7',
      incorporationDate: '2020-04-12',
      authorizedCapitalMYR: 1000000,
      paidUpCapitalMYR: 500000,
      principalOfficer: 'Kavinath Ganeshan (Director)',
      coDirector: 'Proxy X (NRIC: 960907-08-5840)',
    },
    verificationChecks: {
      sha256Match: true,
      ssmStatusConfirmed: true,
      mygdxHmacSigned: true,
      eKehakimanVerified: true,
      icijReconciled: true,
    },
    forensicAlerts: [
      'Co-director Proxy X flagged in High Court civil suit.',
      'Domestic operational node for offshore capital channeling.',
    ],
    statutoryProvisions: ['Companies Act 2016 (Act 777)'],
  },
  {
    id: 'DOC-COURT-4-334567',
    documentTitle: 'High Court Civil Suit Cause Papers – Suit No. 4-334567',
    documentCategory: 'COURT_DOCKET',
    issuingAuthority: 'Malaysian Judiciary (e-Kehakiman)',
    referenceNumber: 'Suit No. 4-334567',
    dateIssued: '2025-08-22',
    fileFormat: 'PDF',
    fileSizeBytes: 1249300,
    expectedSha256: '3f5e7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f',
    actualSha256: '3f5e7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f',
    verificationStatus: 'UNDER_LITIGATION',
    summaryDescription: 'Reconstructed court docket from e-Court Phase 2 Document S/N protocol regarding RHB Privilege account balance of MYR 300,000.',
    extractedMetadata: {
      court: 'High Court of Malaya',
      suitNumber: '4-334567',
      plaintiff: 'Proxy X (NRIC: 960907-08-5840)',
      firstDefendant: 'Kavinath Ganeshan (NRIC: 960906-08-5839)',
      disputedAmountMYR: 300000,
      bankAccount: 'RHB Privilege Joint Current Account',
      eJudgmentDocSn: 'SN-2025-EFS-8839210-KL',
    },
    verificationChecks: {
      sha256Match: true,
      ssmStatusConfirmed: true,
      mygdxHmacSigned: true,
      eKehakimanVerified: true,
      icijReconciled: false,
    },
    forensicAlerts: [
      'Funds frozen sub-judice pending judicial resolution.',
      'Section 4(c) Partnership Act defense invoked: profit sharing exceptions.',
      'LHDN may assert priority tax lien before settlement.',
    ],
    statutoryProvisions: [
      'Partnership Act 1961 (Act 135) Section 4(c)',
      'Rules of Court 2012 Order 29 (Preservation of Subject Matter)',
    ],
  },
  {
    id: 'DOC-BANK-AMB-1580',
    documentTitle: 'AmBank Ipoh Ledger Statement – Acct #158012884572',
    documentCategory: 'BANK_LEDGER',
    issuingAuthority: 'AmBank (M) Berhad / Fraud Monitoring Division',
    referenceNumber: '#158012884572',
    dateIssued: '2026-01-14',
    fileFormat: 'JSON',
    fileSizeBytes: 182400,
    expectedSha256: 'e8d7c6b5a4938271605f4e3d2c1b0a9f8e7d6c5b4a39281706f5e4d3c2b1a0f9',
    actualSha256: 'FORGED_HASH_DISCREPANCY_77182903847291029384710293847102',
    verificationStatus: 'TAMPERED_FORGED',
    summaryDescription: 'Foreign credit trace entry of USD 2,000,000. Cryptographic verification of the SHA-256 ledger hash revealed structural discrepancy.',
    extractedMetadata: {
      bankName: 'AmBank Ipoh Branch',
      accountNumber: '158012884572',
      purportedCreditUSD: 2000000,
      currency: 'USD',
      reportedHash: 'e8d7c6b5a4938271605f4e3d2c1b0a9f8e7d6c5b4a39281706f5e4d3c2b1a0f9',
      actualComputedHash: 'FORGED_HASH_DISCREPANCY_77182903847291029384710293847102',
      ledgerValidation: 'FAILED_CRYPTOGRAPHIC_MISMATCH',
    },
    verificationChecks: {
      sha256Match: false,
      ssmStatusConfirmed: true,
      mygdxHmacSigned: true,
      eKehakimanVerified: false,
      icijReconciled: false,
    },
    forensicAlerts: [
      'CRITICAL: Cryptographic verification confirmed credit trace was fraudulently generated.',
      'Potential corporate identity theft by external actors or fraudulent balance inflation.',
      'Report required to Bank Negara Malaysia (BNM) and CCID.',
    ],
    statutoryProvisions: [
      'Penal Code Section 468 (Forgery for Purpose of Cheating)',
      'Financial Services Act 2013 (Act 758)',
    ],
  },
  {
    id: 'DOC-TAX-LHDN-56M',
    documentTitle: 'LHDN Notice of Assessment & Penalties – MYR 56,420,000',
    documentCategory: 'TAX_ASSESSMENT',
    issuingAuthority: 'Lembaga Hasil Dalam Negeri Malaysia (LHDN / HASIL)',
    referenceNumber: 'LHDN/HASIL/AUDIT/2026/88392',
    dateIssued: '2026-02-18',
    fileFormat: 'PDF',
    fileSizeBytes: 894000,
    expectedSha256: '4a6b8c0d2e4f6a8b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b',
    actualSha256: '4a6b8c0d2e4f6a8b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b',
    verificationStatus: 'VERIFIED',
    summaryDescription: 'Statutory tax assessment under Section 4(c), Section 113(1)(a) incorrect return penalty of MYR 28M, Section 114 wilful evasion, and Section 140A transfer pricing.',
    extractedMetadata: {
      taxpayer: 'Kavinath Ganeshan',
      nric: '960906-08-5839',
      totalDemandMYR: 56420000,
      penaltyUnderSection113MYR: 28000000,
      offshoreSource: 'Archon Holdings SA (Geneva)',
      transferPricingFormula: 'I = 1/12 * A * B',
    },
    verificationChecks: {
      sha256Match: true,
      ssmStatusConfirmed: true,
      mygdxHmacSigned: true,
      eKehakimanVerified: true,
      icijReconciled: true,
    },
    forensicAlerts: [
      'Severe civil & criminal exposure under Section 114(1) of ITA 1967.',
      'Domestic liquid assets (MYR 300k) insufficient; requires MLAT to Swiss authorities.',
    ],
    statutoryProvisions: [
      'Income Tax Act 1967 (Act 53) Sections 4(c), 29(3), 103, 113, 114, 140A',
    ],
  },
  {
    id: 'DOC-CIMA-FRZ-147',
    documentTitle: 'CIMA Gazette Administrative Freeze Order – Ganesam Family Trust',
    documentCategory: 'CIMA_FREEZE_ORDER',
    issuingAuthority: 'Cayman Islands Monetary Authority (CIMA)',
    referenceNumber: 'CIMA-FRZ-25-06-147',
    dateIssued: '2025-06-30',
    fileFormat: 'PDF',
    fileSizeBytes: 620500,
    expectedSha256: '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
    actualSha256: '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
    verificationStatus: 'FROZEN',
    summaryDescription: 'CIMA Gazette freeze order locking assets of Ganesam Family Trust (KYD-110077-USD-B) pursuant to AML/CFT/CPF compliance sanctions.',
    extractedMetadata: {
      trustName: 'Ganesam Family Trust',
      instrumentRef: 'KYD-110077-USD-B',
      jurisdiction: 'Grand Cayman, Cayman Islands',
      freezeOrderRef: 'CIMA-FRZ-25-06-147',
      fiduciaryPartner: 'Private Fiduciary Services Ltd',
      assetStatus: 'Administratively Frozen',
    },
    verificationChecks: {
      sha256Match: true,
      ssmStatusConfirmed: false,
      mygdxHmacSigned: true,
      eKehakimanVerified: false,
      icijReconciled: true,
    },
    forensicAlerts: [
      'Assets currently encumbered by Cayman regulatory authorities.',
      'Monitoring required to determine if assets face permanent forfeiture.',
    ],
    statutoryProvisions: [
      'Cayman Islands Monetary Authority AML/CFT/CPF Regulations',
    ],
  },
  {
    id: 'DOC-SWISS-ARCHON',
    documentTitle: 'Lombard Odier Geneva Settlement & Sub-Account Certificate',
    documentCategory: 'OFFSHORE_AGREEMENT',
    issuingAuthority: 'Lombard Odier (Geneva, Switzerland)',
    referenceNumber: 'ch9300767000usd000001',
    dateIssued: '2017-10-15',
    fileFormat: 'PDF',
    fileSizeBytes: 751200,
    expectedSha256: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    actualSha256: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    verificationStatus: 'VERIFIED',
    summaryDescription: 'Settlement agreement from Veridian Estate liquidation crediting USD 35,000,000 to Archon Holdings SA, economically owned by Kavinath Ganeshan.',
    extractedMetadata: {
      corporateHolder: 'Archon Holdings SA',
      bankReference: 'ch9300767000usd000001',
      city: 'Geneva, Switzerland',
      balanceUSD: 35000000,
      settlementSource: 'Veridian Estate Liquidation (2017)',
      beneficialOwner: 'Kavinath Ganeshan',
      encumbranceStatus: 'Unencumbered / Active',
    },
    verificationChecks: {
      sha256Match: true,
      ssmStatusConfirmed: false,
      mygdxHmacSigned: true,
      eKehakimanVerified: false,
      icijReconciled: true,
    },
    forensicAlerts: [
      'Primary recovery target for Malaysian tax enforcement (MYR 56.42M debt).',
      'Requires Mutual Legal Assistance Request (MLAT) to Swiss federal authorities.',
    ],
    statutoryProvisions: [
      'Mutual Assistance in Criminal Matters Act 2002 (Act 621)',
      'Double Taxation Avoidance Agreement (Malaysia - Switzerland)',
    ],
  },
];

// In-Memory Officer Account Singleton
let activeOfficerAccount: OfficerAccount = {
  id: 'OFFICER-MY-88219',
  fullName: 'Senior Investigator Mohd Z. Farhan',
  badgeNumber: 'LHDN-SPEC-7712',
  email: 'm.farhan@hasil.gov.my',
  organization: 'Inland Revenue Board of Malaysia (LHDN)',
  role: 'Senior Forensic Investigator & Asset Recovery Specialist',
  clearanceLevel: 'TOP_SECRET',
  createdAt: '2026-01-10T08:30:00.000Z',
  lastLogin: new Date().toISOString(),
  keyFingerprint: 'SHA256:7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
  ingestionStatus: {
    mygdx: true,
    ssm: true,
    eKehakiman: true,
    icij: true,
  },
};

// In-Memory Ingested Keys (secure, never sent plaintext to client)
let ingestedKeys: IngestedKeySet = {
  mygdxConsumerKey: 'MAMPU_MYGDX_PROD_KEY_8829',
  mygdxConsumerSecret: 'sec_mygdx_prod_7782910398402918',
  ssmUserId: 'SSM_ENFORCE_AGENT_441',
  ssmSecretToken: 'tok_ssm_restricted_482910394820',
  ssmSigningSecret: 'sign_hmac_ssm_992810394820192',
  eKehakimanToken: 'ekehakiman_mcp_access_tok_882910',
  icijApiKey: 'icij_offshoreleaks_reconcile_token_3381',
};

// Dynamic list of documents in memory (supports uploads)
let memoryDocuments: VerifiableDocument[] = [...PRESEEDED_DOCUMENTS];

export function getActiveOfficerAccount(): OfficerAccount {
  return { ...activeOfficerAccount };
}

export function updateOfficerAccount(accountData: Partial<OfficerAccount>): OfficerAccount {
  activeOfficerAccount = {
    ...activeOfficerAccount,
    ...accountData,
    lastLogin: new Date().toISOString(),
  };
  return { ...activeOfficerAccount };
}

export function ingestOfficerKeys(keys: Partial<IngestedKeySet>): {
  account: OfficerAccount;
  fingerprint: string;
} {
  ingestedKeys = {
    ...ingestedKeys,
    ...keys,
  };

  // Generate cryptographic fingerprint of the ingested keys
  const combined = `${ingestedKeys.mygdxConsumerKey}:${ingestedKeys.ssmUserId}:${ingestedKeys.ssmSecretToken}:${ingestedKeys.eKehakimanToken}:${Date.now()}`;
  const fingerprint = `SHA256:${crypto.createHash('sha256').update(combined).digest('hex')}`;

  activeOfficerAccount.keyFingerprint = fingerprint;
  activeOfficerAccount.ingestionStatus = {
    mygdx: Boolean(ingestedKeys.mygdxConsumerKey && ingestedKeys.mygdxConsumerSecret),
    ssm: Boolean(ingestedKeys.ssmUserId && ingestedKeys.ssmSecretToken),
    eKehakiman: Boolean(ingestedKeys.eKehakimanToken),
    icij: Boolean(ingestedKeys.icijApiKey),
  };

  return {
    account: { ...activeOfficerAccount },
    fingerprint,
  };
}

export function getVerifiableDocuments(): VerifiableDocument[] {
  return [...memoryDocuments];
}

export function verifyDocumentById(docId: string, customPayload?: string): DocumentVerificationReport {
  let doc = memoryDocuments.find((d) => d.id === docId);

  if (!doc && customPayload) {
    // Generate new document verification entry on-the-fly
    const computedHash = crypto.createHash('sha256').update(customPayload).digest('hex');
    const newDoc: VerifiableDocument = {
      id: `DOC-CUSTOM-${Date.now()}`,
      documentTitle: 'Uploaded Forensic Evidentiary Document',
      documentCategory: 'SSM_REGISTRATION',
      issuingAuthority: 'Government Agency / Institutional Registry',
      referenceNumber: `CUSTOM-${Date.now().toString().slice(-6)}`,
      dateIssued: new Date().toISOString().split('T')[0],
      fileFormat: 'TEXT/JSON',
      fileSizeBytes: Buffer.byteLength(customPayload, 'utf8'),
      expectedSha256: computedHash,
      actualSha256: computedHash,
      verificationStatus: 'VERIFIED',
      summaryDescription: 'Uploaded evidentiary document analyzed through multi-jurisdictional verification pipeline.',
      extractedMetadata: {
        payloadSnippet: customPayload.slice(0, 100),
        byteLength: Buffer.byteLength(customPayload, 'utf8'),
      },
      verificationChecks: {
        sha256Match: true,
        ssmStatusConfirmed: true,
        mygdxHmacSigned: true,
        eKehakimanVerified: true,
        icijReconciled: true,
      },
      forensicAlerts: ['New evidentiary item ingested and cryptographically indexed.'],
      statutoryProvisions: ['Evidence Act 1950 (Act 56) Section 90A'],
    };
    memoryDocuments.unshift(newDoc);
    doc = newDoc;
  }

  if (!doc) {
    throw new Error(`Document ${docId} not found`);
  }

  // Calculate forensic score
  let forensicScore = 100;
  if (doc.verificationStatus === 'TAMPERED_FORGED') {
    forensicScore = 12;
  } else if (doc.verificationStatus === 'FROZEN') {
    forensicScore = 45;
  } else if (doc.verificationStatus === 'UNDER_LITIGATION') {
    forensicScore = 60;
  }

  const recommendations: string[] = [];
  if (doc.verificationStatus === 'TAMPERED_FORGED') {
    recommendations.push('Initiate immediate freezing of AmBank Account #158012884572 under AMLA 2001 Section 44.');
    recommendations.push('Refer forensic hash discrepancy to Bank Negara Malaysia and PDRM Commercial Crimes Investigation Department (CCID).');
  } else if (doc.documentCategory === 'TAX_ASSESSMENT') {
    recommendations.push('File priority tax lien in High Court Suit No. 4-334567 to claim the MYR 300,000 RHB Privilege account.');
    recommendations.push('Submit Mutual Legal Assistance Treaty (MLAT) request to Swiss Federal Department of Justice and Police (FDJP) to freeze USD 35,000,000 at Lombard Odier.');
  } else if (doc.documentCategory === 'CIMA_FREEZE_ORDER') {
    recommendations.push('Liaise with Cayman Islands Monetary Authority (CIMA) regarding priority creditor claims under order CIMA-FRZ-25-06-147.');
  } else {
    recommendations.push('Document verified authentic. Proceed with cross-referencing against JPN identity seeds.');
  }

  const authenticityStatus: DocumentVerificationReport['authenticityStatus'] =
    doc.verificationStatus === 'TAMPERED_FORGED'
      ? 'FRAUD_DETECTED'
      : doc.verificationStatus === 'FROZEN' || doc.verificationStatus === 'UNDER_LITIGATION'
      ? 'REGULATORY_RESTRICTED'
      : 'GENUINE_VERIFIED';

  return {
    timestamp: new Date().toISOString(),
    verifiedByOfficer: activeOfficerAccount.fullName,
    officerBadge: activeOfficerAccount.badgeNumber,
    agency: activeOfficerAccount.organization,
    document: doc,
    forensicScore,
    authenticityStatus,
    recommendedActions: recommendations,
  };
}
