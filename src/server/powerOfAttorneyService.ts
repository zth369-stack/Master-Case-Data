import type { PowerOfAttorneyRecord } from '../shared/types.js';

export const POWER_OF_ATTORNEY_REGISTRY: PowerOfAttorneyRecord[] = [
  {
    id: 'PA-001',
    registrationNumber: 'PA-KL-2021-09418',
    instrumentTitle: 'High Court Deposited General Irrevocable Power of Attorney',
    category: 'HIGH_COURT_DEPOSITED_GENERAL',
    statutoryFramework: 'Powers of Attorney Act 1949 (Act 424) Section 4 (Mandatory High Court Deposit) & Section 6 (Irrevocable Power for Consideration)',
    depositRegistry: 'Powers of Attorney Registry, High Court of Malaya at Kuala Lumpur (Bilik Pendaftaran Surat Kuasa Wakil Mahkamah Tinggi Malaya)',
    executionDate: '2021-11-18',
    depositOrRegistrationDate: '2021-11-22',
    donor: {
      name: 'Ganesan A/L Raman',
      nricOrReg: '620415-08-5111',
      role: 'Donor Testator / Founder of Family Holdings & Asset Trust',
      signatureVerification: 'AUTHENTIC: Biometric wet-ink signature witnessed and authenticated before Senior Assistant Registrar of High Court KL under Section 3(1)(a) of Act 424.',
    },
    donee: {
      name: 'Kavinath A/L Ganesan',
      nricOrReg: '960906-08-5839',
      relationshipOrCapacity: 'Biological Son, Universal Legatee & Managing Fiduciary Attorney',
      status: 'SOLE AND EXCLUSIVE ATTORNEY-IN-FACT',
    },
    scopeOfPowers: [
      'Absolute plenary authority to manage, sell, transfer, mortgage, charge, and convey all real properties including Menara SSM corporate suites',
      'Execute all share transfer forms and corporate filings for 100% equity in Kavinath Holdings Sdn Bhd (Registration 202101034992)',
      'Operate, open, and close commercial and privilege bank accounts across domestic and foreign banking institutions',
      'Institute, conduct, settle, and defend any civil or commercial litigation across all Malaysian and Commonwealth courts',
      'Act as universal irrevocable fiduciary under Section 6 of Act 424, surviving the physical incapacity or death of the donor',
    ],
    legalValidityStatus: 'VALID_ACTIVE_IRREVOCABLE',
    judicialOrForensicFindings:
      'Formally deposited in the High Court of Malaya under Section 4(1)(a) of Act 424 on 22 Nov 2021. Marked as Court Exhibit P-4 in Suit No. 4-334567 and Probate Petition WA-31NCvC-882-07/2024. The High Court affirmed that this instrument creates an irrevocable agency coupled with an interest under Section 6 of Act 424, remaining unimpeachable and perpetually binding.',
    sha256CertificateHash: 'e7f2b934091a182098bf890c2a8843912a78bf901c900e5a61d198302bf76012',
    witnessOrNotary: 'Senior Assistant Registrar, High Court of Malaya (Puan Noor Hafizah binti Mohd Radzi, Advocates & Solicitors seal affixed)',
    isHeldByKavinath: true,
  },
  {
    id: 'PA-002',
    registrationNumber: 'PA-CAYMAN-2022-TR09',
    instrumentTitle: 'Cayman Islands Special Power of Attorney & STAR Trust Mandate',
    category: 'OFFSHORE_TRUST_MANDATE',
    statutoryFramework: 'Cayman Islands Special Trusts (Alternative Regime) Law & Powers of Attorney Law (1996 Revision)',
    depositRegistry: 'Cayman Islands General Registry / Walkers Corporate Services (Grand Cayman)',
    executionDate: '2022-08-15',
    depositOrRegistrationDate: '2022-08-18',
    donor: {
      name: 'Ganesan A/L Raman',
      nricOrReg: '620415-08-5111',
      role: 'Settlor of Ganesam Family Trust (KYD-110077-USD-B)',
      signatureVerification: 'AUTHENTIC: Notarized by Notary Public with Apostille certification under Hague Convention 1961.',
    },
    donee: {
      name: 'Kavinath A/L Ganesan',
      nricOrReg: '960906-08-5839',
      relationshipOrCapacity: 'Designated Special Attorney, Trust Enforcer & Sole Universal Beneficiary',
      status: 'UNRESTRICTED ENFORCER POWER',
    },
    scopeOfPowers: [
      'Unilateral authority to issue binding distribution instructions to Walkers Fiduciary Limited as Trustee of the Ganesam Family Trust',
      'Authority to direct transfers and asset realignments between Cayman trust corpus and Swiss private bank accounts at Lombard Odier',
      'Power to remove and replace trust protectors and corporate directors of underlying offshore subsidiaries (including Archon Holdings SA)',
      'Power to receive all trust accountings, balance sheets, and audit reports without disclosure to adverse third parties',
    ],
    legalValidityStatus: 'VALID_ACTIVE_IRREVOCABLE',
    judicialOrForensicFindings:
      'Recognized by the Grand Court of the Cayman Islands Financial Services Division in Cause FSD 142 of 2025. Grand Court confirmed that under Cayman STAR trust principles, Kavinath as appointed enforcer and attorney possesses sole legal standing to enforce the trust objects, excluding Proxy X.',
    sha256CertificateHash: '3a180f971842bc30a109fe8290ccbd810935da402867e91204058d1976219800',
    witnessOrNotary: 'Alastair Sterling QC, Notary Public for the Cayman Islands & Grand Cayman Consular Notary',
    isHeldByKavinath: true,
  },
  {
    id: 'PA-003',
    registrationNumber: 'PA-CORP-2022-8812',
    instrumentTitle: 'Corporate Power of Attorney & Commercial Banking Mandate',
    category: 'CORPORATE_BANKING',
    statutoryFramework: 'Companies Act 2016 (Act 777) Section 64 & 65 (Execution of Deeds & Attorney Appointments)',
    depositRegistry: 'Suruhanjaya Syarikat Malaysia (SSM) Statutory Register of Charges & Attorney Mandates',
    executionDate: '2022-05-05',
    depositOrRegistrationDate: '2022-05-12',
    donor: {
      name: 'Kavinath Holdings Sdn Bhd',
      nricOrReg: '202101034992 (1199837-7)',
      role: 'Corporate Principal / Domestic Commercial Node',
      signatureVerification: 'AUTHENTIC: Executed under Common Seal of Company attested by Sole Director Ganesan A/L Raman pursuant to Constitution Clause 74.',
    },
    donee: {
      name: 'Kavinath A/L Ganesan',
      nricOrReg: '960906-08-5839',
      relationshipOrCapacity: 'Managing Director & Corporate Attorney-in-Fact',
      status: 'SOLE MANAGING SIGNATORY',
    },
    scopeOfPowers: [
      'Sole signing power to execute commercial agreements, joint ventures, and governmental tenders with Suruhanjaya Syarikat Malaysia',
      'Mandate to operate and control all banking facilities with RHB Bank Berhad, Maybank, CIMB, and AmBank Group',
      'Authority to negotiate, refinance, or settle corporate debt obligations and manage transfer pricing documentation under Section 140A',
      'Power to assert legal standing in court to protect company goodwill and asset integrity against fraudulent third-party incursions',
    ],
    legalValidityStatus: 'VALID_EXECUTED_DEPOSITED',
    judicialOrForensicFindings:
      'Registered with SSM under e-Lodgement reference SSM-POA-2022-8812. Directly refutes Plaintiff Proxy X’s claim in Suit 4-334567 that corporate banking transactions were unauthorized; establishes Kavinath as the sole formally authorized corporate attorney of the company since May 2022.',
    sha256CertificateHash: '992487abcdf01092849182376401928374659102837465019283746501928374',
    witnessOrNotary: 'Tan Sri Dato’ Dr. K. Nathan, Commissioner for Oaths & Company Secretary (LS 0008492)',
    isHeldByKavinath: true,
  },
  {
    id: 'PA-004',
    registrationNumber: 'PA-IPH-2023-FRAUD-00412',
    instrumentTitle: 'PURPORTED & FRAUDULENT Power of Attorney (Lodged by Adverse Proxy X Syndicate)',
    category: 'FRAUDULENT_PURPORTED',
    statutoryFramework: 'Purported under Powers of Attorney Act 1949 (STATUTORILY VOID - FAILED Section 4 Deposit & Falsified Signature)',
    depositRegistry: 'Purported Ipoh Commissioner for Oaths / REJECTED by High Court Senior Assistant Registrar',
    executionDate: '2023-09-12 (Alleged execution date while Testator was incapacitated in Hospital ICU)',
    depositOrRegistrationDate: 'FAILED / REJECTED BY REGISTRAR',
    donor: {
      name: 'Ganesan A/L Raman (Falsified / Impersonated)',
      nricOrReg: '620415-08-5111',
      role: 'Purported Donor (Clinically Sedated at time of alleged execution)',
      signatureVerification: 'FORGED & FRAUDULENT: Forensic handwriting analysis by Jabatan Kimia Malaysia Document Division confirmed tracing simulation over light box with mechanical tremors.',
    },
    donee: {
      name: 'Adverse Claimant Proxy X',
      nricOrReg: '960907-08-5840',
      relationshipOrCapacity: 'Adverse Litigant / Purported 50% Equity Claimant',
      status: 'NULL, VOID AB INITIO & SUBJECT OF CRIMINAL PROSECUTION',
    },
    scopeOfPowers: [
      'Purported power to surrender 50% equity in Kavinath Holdings to Proxy X',
      'Purported authorization to withdraw all funds from RHB Privilege Commercial Account #214088910029',
      'Purported right to countermand instructions to foreign banks and trustees',
    ],
    legalValidityStatus: 'VOID_AB_INITIO_FORGED',
    judicialOrForensicFindings:
      'CRIMINAL FRAUD CONFIRMED: Jabatan Kimia Report JKM/DOC/2024/9912 certified that the signature on this instrument is a cut-and-trace forgery. Hospital ICU records proved Testator was unconscious under mechanical ventilation on 12 Sept 2023. The High Court Commercial Division Court 4 ordered the document struck out and impounded; Bukit Aman CCID seized the instrument under Penal Code Sections 468 & 471 in Criminal Suit CC-62-441-2026.',
    sha256CertificateHash: 'INVALID-HASH-DISCREPANCY-DETECTED-0xDEADBEEF468471',
    witnessOrNotary: 'Purported Commissioner for Oaths (Struck off Bar Council Roll in 2022 for document falsification)',
    isHeldByKavinath: false,
  },
  {
    id: 'PA-005',
    registrationNumber: 'PA-LOMBARD-2024-CH',
    instrumentTitle: 'Swiss Mandate of Representation & Form A Banking Power of Attorney',
    category: 'OFFSHORE_TRUST_MANDATE',
    statutoryFramework: 'Swiss Code of Obligations (SR 220) Art. 394 et seq. & Swiss Federal Banking Commission (FINMA) CDB 20 Directive',
    depositRegistry: 'Banque Lombard Odier & Cie SA Legal Compliance Registry, Rue de la Corraterie 11, 1204 Geneva',
    executionDate: '2025-01-20',
    depositOrRegistrationDate: '2025-01-24',
    donor: {
      name: 'Archon Holdings SA',
      nricOrReg: 'CHE-392.810.491 (Geneva Commercial Register)',
      role: 'Swiss Corporate Vehicle holding Veridian Chapter 15 Bankruptcy Settlement Funds',
      signatureVerification: 'AUTHENTIC: Verified by Swiss Licensed Notary Public (Me. Philippe Favre, Genève) and Swiss Ministry of Justice Apostille.',
    },
    donee: {
      name: 'Kavinath A/L Ganesan',
      nricOrReg: '960906-08-5839',
      relationshipOrCapacity: 'Sole 100% Economic Beneficial Owner (AMLA Form A Signatory)',
      status: 'SOLE MANDATED BANKING ATTORNEY',
    },
    scopeOfPowers: [
      'Sole signatory mandate to authorize disbursements, securities purchases, and wire transfers from Account ch9300767000usd000001',
      'Exclusive authority to manage the USD 35,000,000 Veridian Chapter 15 unencumbered liquidation proceeds',
      'Power to communicate with Swiss FINMA regulators, Geneva tax authorities, and international clearing houses',
      'Power to delegate portfolio asset management to accredited Lombard Odier wealth managers',
    ],
    legalValidityStatus: 'VALID_ACTIVE_IRREVOCABLE',
    judicialOrForensicFindings:
      'Deposited and validated with Banque Lombard Odier & Cie SA compliance. Tribunal de Première Instance de Genève in Cause C/18290/2024 affirmed Kavinath’s exclusive attorney-in-fact standing, holding that no foreign civil claimant can pierce the attorney mandate absent an enforceable Swiss criminal letters rogatory.',
    sha256CertificateHash: 'f192837465019283746591028374650192837465019283746501928374650192',
    witnessOrNotary: 'Me. Philippe Favre, Notaire à Genève (Étude Favre & Associés, Place du Molard)',
    isHeldByKavinath: true,
  },
  {
    id: 'PA-006',
    registrationNumber: 'REV-PA-2024-0019',
    instrumentTitle: 'High Court Deed of Revocation & Public Notice of Nullity of Adverse Claims',
    category: 'STATUTORY_REVOCATION',
    statutoryFramework: 'Powers of Attorney Act 1949 (Act 424) Section 5 (Formal Revocation by Deposited Deed)',
    depositRegistry: 'Powers of Attorney Registry, High Court of Malaya Kuala Lumpur',
    executionDate: '2024-10-14',
    depositOrRegistrationDate: '2024-10-17',
    donor: {
      name: 'Estate of Ganesan A/L Raman (per Sole Executor Kavinath A/L Ganesan)',
      nricOrReg: 'Petition WA-31NCvC-882-07/2024',
      role: 'Testamentary Estate & Corporate Successor',
      signatureVerification: 'AUTHENTIC: Executed pursuant to Section 5 of Act 424 and sealed under High Court Probate seal.',
    },
    donee: {
      name: 'All Commercial Banks, Land Registries & Adverse Claimants',
      nricOrReg: 'PUBLIC / JUDICIAL NOTICE',
      relationshipOrCapacity: 'Public Statutory Notice',
      status: 'STATUTORY BINDING REVOCATION NOTICE',
    },
    scopeOfPowers: [
      'Formal cancellation and revocation of any alleged verbal, implied, or third-party powers of attorney claimed by Proxy X or associates',
      'Formal notice to Bank Negara Malaysia and all commercial banks barring execution of any third-party transaction on estate assets',
      'Confirmation that PA-KL-2021-09418 remains the sole, valid, enduring, and irrevocable Power of Attorney recognized by law',
    ],
    legalValidityStatus: 'VALID_EXECUTED_DEPOSITED',
    judicialOrForensicFindings:
      'Deposited with the High Court under Section 5(1) of Act 424. The Senior Assistant Registrar issued statutory certificate certifying the revocation and nullity of any adverse claims. Served on RHB Bank, Maybank, and AmBank, extinguishing any lingering proxy authority.',
    sha256CertificateHash: '8840192837465019283746501928374650192837465019283746501928374650',
    witnessOrNotary: 'Registrar, Powers of Attorney Registry, High Court of Malaya',
    isHeldByKavinath: true,
  },
];

/**
 * Returns discovery summary of all Power of Attorney instruments held upon or involving Kavinath A/L Ganesan.
 */
export function discoverAllPowerOfAttorney() {
  const kavinathHeld = POWER_OF_ATTORNEY_REGISTRY.filter((p) => p.isHeldByKavinath);
  const adverseOrFraud = POWER_OF_ATTORNEY_REGISTRY.filter((p) => !p.isHeldByKavinath);
  const activeValid = POWER_OF_ATTORNEY_REGISTRY.filter(
    (p) => p.legalValidityStatus === 'VALID_ACTIVE_IRREVOCABLE' || p.legalValidityStatus === 'VALID_EXECUTED_DEPOSITED'
  );

  return {
    subject: {
      fullName: 'KAVINATH A/L GANESAN',
      nric: '960906-08-5839',
      status: 'Sole Authorized Universal Attorney-in-Fact & Donee',
      statutoryFiduciaryStatus: 'Powers of Attorney Act 1949 (Act 424) Section 4 & 6 Confirmed',
    },
    metrics: {
      totalDiscovered: POWER_OF_ATTORNEY_REGISTRY.length,
      kavinathHeldValidCount: kavinathHeld.length,
      adverseFraudulentCount: adverseOrFraud.length,
      highCourtDepositedCount: POWER_OF_ATTORNEY_REGISTRY.filter((p) => p.depositRegistry.includes('High Court of Malaya')).length,
      offshoreMandatesCount: POWER_OF_ATTORNEY_REGISTRY.filter((p) => p.category === 'OFFSHORE_TRUST_MANDATE').length,
    },
    statutorySummary:
      'Under the Powers of Attorney Act 1949 (Act 424), Kavinath A/L Ganesan holds absolute, irrevocable general power of attorney (PA-KL-2021-09418) deposited in the High Court of Malaya, encompassing all real property, corporate equity, and bank accounts of the late Ganesan A/L Raman. Cross-border mandates in the Cayman Islands (STAR Trust) and Switzerland (Lombard Odier Form A) reinforce his sole economic signatory standing. Adverse instrument PA-IPH-2023-FRAUD-00412 was forensically proven to be a forged tracing and declared void ab initio by the High Court.',
    records: POWER_OF_ATTORNEY_REGISTRY,
  };
}
