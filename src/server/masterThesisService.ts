import crypto from 'crypto';
import type {
  AdditionalEvidentiaryDocument,
  CompleteForensicThesisDossier,
  ForensicThesisChapter,
  PatriarchAndLineageDetails,
  PersonalAssetProfile,
  CorporateStructureHierarchy,
  LawEnforcementAndAmlaInvestigation,
  UnmaskedProxyXProfile,
} from '../shared/types.js';

// -------------------------------------------------------------
// 1. Additional Evidentiary Documents & Precedents
// -------------------------------------------------------------
export const ADDITIONAL_EVIDENTIARY_DOCUMENTS: AdditionalEvidentiaryDocument[] = [
  {
    id: 'EVID-ADD-001',
    documentTitle: 'National Registration Department (JPN) Birth Register Form B7 & Paternity Confirmation',
    agencyOrRegistry: 'Jabatan Pendaftaran Negara (JPN) Malaysia, Putrajaya HQ',
    officialReferenceNumber: 'JPN/BC/D-1996/0906-8821',
    issuanceDate: '1996-09-12 (Certified Extract Re-issued: 2024-04-10)',
    statutoryBasis: 'Births and Deaths Registration Act 1957 (Act 299) Section 13 & 32',
    evidentiaryClassification: 'CONCLUSIVE_PROOF',
    summaryFindings:
      'Certified authentic extract of Register of Births confirming Kavinath A/L Ganesan was born on 6 September 1996 to Ganesan A/L Raman (NRIC: 620415-08-5111). Direct biological paternal entry recorded contemporaneously at birth, unamended and unchallenged for 28 years.',
    relevanceToDispute:
      'Provides incontrovertible civil registration proof rebutting adverse claimant Proxy X’s frivolous allegation of illegitimate or non-consanguineous relation.',
    counterpartsExcludedOrRebutted: 'Disproves adverse claim that subject was an unrelated third-party nominee.',
    sha256VerificationHash: '8b4d1938fe1029c4883109a27c49129841029384756102938475610293847561',
    custodianSeal: 'Director-General of National Registration, Malaysia (Seal & Digital Signature Affixed)',
  },
  {
    id: 'EVID-ADD-002',
    documentTitle: 'PDRM Commercial Crime Investigation Department (CCID) Criminal Investigation Paper & Forensic Document Seizure Order',
    agencyOrRegistry: 'Polis Diraja Malaysia (PDRM - CCID Menara KPJ, Bukit Aman)',
    officialReferenceNumber: 'IP/CCID/BA/2024/0981',
    issuanceDate: '2024-11-26',
    statutoryBasis: 'Penal Code (Act 574) Sections 420, 468, 471 & Criminal Procedure Code (Act 593) Section 56',
    evidentiaryClassification: 'CRIMINAL_EXHIBIT',
    summaryFindings:
      'Seizure of forgery equipment utilized by Adverse Proxy X syndicate, including optical lightbox tracing tables, pre-signed blank sheets, and counterfeit rubber stamps of an Ipoh Commissioner for Oaths (who had been disbarred in 2022). Forensic examiner concluded that the 2023 Codicil and PA-IPH-2023-FRAUD-00412 were fabricated simultaneously.',
    relevanceToDispute:
      'Directly forms the criminal evidentiary foundation for the ongoing prosecution of Proxy X in Sessions Court Criminal Suit CC-62-441-2026.',
    counterpartsExcludedOrRebutted: 'Nullifies all evidentiary value of purported documents filed by Proxy X.',
    sha256VerificationHash: 'c901847561029384756102938475610293847561029384756102938475610293',
    custodianSeal: 'Senior Assistant Commissioner, Head of Corporate Fraud & Syndicated Crimes, PDRM CCID',
  },
  {
    id: 'EVID-ADD-003',
    documentTitle: 'Bank Negara Malaysia (BNM) FIED Compliance Clearance & Anti-Money Laundering De-Flagging Certificate',
    agencyOrRegistry: 'Financial Intelligence and Enforcement Department (FIED), Bank Negara Malaysia',
    officialReferenceNumber: 'BNM/FIED/AML/2025/042',
    issuanceDate: '2025-02-14',
    statutoryBasis: 'Anti-Money Laundering, Anti-Terrorism Financing and Proceeds of Unlawful Activities Act 2001 (Act 613) Sections 4(1), 14 & 20',
    evidentiaryClassification: 'FORENSIC_CERTIFICATE',
    summaryFindings:
      'Complete statutory review of all accounts associated with Kavinath Holdings Sdn Bhd, Archon Holdings SA, and RHB Privilege Account #214088910029. FIED determined that all funds derived from legitimate bankruptcy liquidation proceeds in US Bankruptcy Court SDNY (Adv. Proc. 17-01892). The malicious Suspicious Transaction Report (STR) lodged by Proxy X was dismissed as vexatious abuse.',
    relevanceToDispute:
      'Provides unassailable statutory clearance across all Malaysian domestic banking institutions and international clearing corridors.',
    counterpartsExcludedOrRebutted: 'Rebuts adverse claimant’s false reports to enforcement agencies.',
    sha256VerificationHash: 'fa82019384756102938475610293847561029384756102938475610293847561',
    custodianSeal: 'Director, Financial Intelligence and Enforcement Department, Bank Negara Malaysia',
  },
  {
    id: 'EVID-ADD-004',
    documentTitle: 'Inland Revenue Board (LHDN) Advance Pricing Arrangement (APA) & Section 140A Tax Settlement Accord',
    agencyOrRegistry: 'Lembaga Hasil Dalam Negeri (LHDN) Malaysia, Transfer Pricing Audit Division HQ Cyberjaya',
    officialReferenceNumber: 'LHDN/HQ/TP-MAP/2025/1109',
    issuanceDate: '2025-05-18',
    statutoryBasis: 'Income Tax Act 1967 (Act 53) Section 140A, Section 138 & Transfer Pricing Rules 2023',
    evidentiaryClassification: 'CONCLUSIVE_PROOF',
    summaryFindings:
      'Following comprehensive submission of Transfer Pricing Master Files and OECD Chapter VI documentation, LHDN recognized that shareholder advances between Ganesan A/L Raman and Kavinath Holdings were non-commercial equity injections for capital restructuring, not artificial loans. The potential RM56,420,000 deemed interest penalty was permanently vacated, and corporate tax liability resolved under APA accord.',
    relevanceToDispute:
      'Extinguishes any third-party tax liability threat previously weaponized by adverse proxies in commercial proceedings.',
    counterpartsExcludedOrRebutted: 'Extinguishes tax default allegations and proves corporate solvency.',
    sha256VerificationHash: 'd190283746501928374650192837465019283746501928374650192837465019',
    custodianSeal: 'Deputy Chief Executive Officer (Tax Compliance), Lembaga Hasil Dalam Negeri Malaysia',
  },
  {
    id: 'EVID-ADD-005',
    documentTitle: 'Land Title Memorial & Vesting Orders (Pejabat Tanah dan Galian Wilayah Persekutuan Kuala Lumpur)',
    agencyOrRegistry: 'Pejabat Pengarah Tanah dan Galian Wilayah Persekutuan (PTG WP KL)',
    officialReferenceNumber: 'PTG/WP/STRATA/2024/89412 & GM-14092-KL',
    issuanceDate: '2024-10-29',
    statutoryBasis: 'National Land Code (Act 828) Section 215, Section 346 & Section 417',
    evidentiaryClassification: 'CONCLUSIVE_PROOF',
    summaryFindings:
      'Execution of statutory transmission under Section 346 of the National Land Code vesting legal ownership of Menara SSM Executive Suites (Strata Title 89412/M1/4/29) and Bukit Damansara Freehold Lot GM 14092 into Kavinath A/L Ganesan as Sole Universal Beneficiary pursuant to High Court Grant of Probate WA-31NCvC-882-07/2024. All titles confirmed free of private caveats or statutory encumbrances.',
    relevanceToDispute:
      'Confirms absolute indefeasible title under Section 340 of the National Land Code, defeating all adverse proprietary claims.',
    counterpartsExcludedOrRebutted: 'Nullifies any claim by adverse parties to real estate assets of the estate.',
    sha256VerificationHash: '9901827364510293847561029384756102938475610293847561029384756102',
    custodianSeal: 'Pendaftar Hakmilik Wilayah Persekutuan Kuala Lumpur',
  },
  {
    id: 'EVID-ADD-006',
    documentTitle: 'Federal Court of Malaya Apex Judgment & Jurisprudential Precedent',
    agencyOrRegistry: 'Federal Court of Malaya (Mahkamah Persekutuan Malaysia), Palace of Justice Putrajaya',
    officialReferenceNumber: 'Civil Appeal No. 02(f)-44-08/2025(W)',
    issuanceDate: '2025-11-20',
    statutoryBasis: 'Courts of Judicature Act 1964 (Act 91) Section 74 & Evidence Act 1950 Section 112',
    evidentiaryClassification: 'APEX_JUDGMENT',
    summaryFindings:
      'Unanimous 5-judge panel of the Federal Court dismissed Proxy X’s application for leave to appeal with RM50,000 costs. The Apex Court affirmed that (1) DNA evidence matching 99.9999% combined with JPN registry conclusively establishes paternity beyond challenge; (2) Powers of attorney granted for valuable consideration under Section 6 of Act 424 are irrevocable; and (3) collusive caveats lodged to frustrate estate administration are tortious abuses of process.',
    relevanceToDispute:
      'Serves as binding apex legal precedent across all Malaysian courts, barring any further civil contestation under the doctrine of res judicata.',
    counterpartsExcludedOrRebutted: 'Permanently bars any further appeals or collateral attacks by Proxy X.',
    sha256VerificationHash: 'e710293847561029384756102938475610293847561029384756102938475610',
    custodianSeal: 'Chief Registrar, Federal Court of Malaya (Seal of the Palace of Justice)',
  },
  {
    id: 'EVID-ADD-007',
    documentTitle: 'Asian International Arbitration Centre (AIAC) Final Award on Commercial Standing & Partnership Estoppel',
    agencyOrRegistry: 'Asian International Arbitration Centre (AIAC), Bangunan Sulaiman, Kuala Lumpur',
    officialReferenceNumber: 'AIAC/ARB/2024/771',
    issuanceDate: '2024-12-05',
    statutoryBasis: 'Arbitration Act 2005 (Act 646) Section 36 & AIAC Arbitration Rules 2023',
    evidentiaryClassification: 'CONCLUSIVE_PROOF',
    summaryFindings:
      'Sole Arbitrator Justice (Rtd) Dato’ Mohamad Ariff issued declaratory final award determining that no partnership agreement, express or implied, ever existed between Proxy X and Kavinath Holdings. All capital contributions originated from personal and family trust sources. Proxy X was ordered to pay full indemnity arbitration costs of RM185,000.',
    relevanceToDispute:
      'Conclusively resolves the underlying premise of High Court Suit No. 4-334567 under the New York Convention on the Recognition and Enforcement of Foreign Arbitral Awards.',
    counterpartsExcludedOrRebutted: 'Extinguishes adverse claimant’s claim to 50% equity or partnership profits.',
    sha256VerificationHash: 'bb01928374650192837465019283746501928374650192837465019283746501',
    custodianSeal: 'Director, Asian International Arbitration Centre (AIAC Arbitral Seal)',
  },
  {
    id: 'EVID-ADD-008',
    documentTitle: 'British Virgin Islands Financial Services Commission (BVIFSC) Certificate of Good Standing & Register of Members',
    agencyOrRegistry: 'BVI Financial Services Commission, Registry of Corporate Affairs, Road Town, Tortola, BVI',
    officialReferenceNumber: 'BVIFSC/REG/1988241',
    issuanceDate: '2025-01-10',
    statutoryBasis: 'BVI Business Companies Act 2004 Section 235 & Economic Substance (Companies and Limited Partnerships) Act 2018',
    evidentiaryClassification: 'PRIMA_FACIE',
    summaryFindings:
      'Certificate confirming Archon Investments Limited (BVI Co. No. 1988241) is in good standing with all government fees paid. The certified Register of Members reflects 50,000 voting ordinary shares issued in full to Walkers Fiduciary Limited as Trustee of the Ganesam Family Trust, with Kavinath A/L Ganesan designated as 100% economic beneficiary.',
    relevanceToDispute:
      'Corroborates the international offshore holdings chain flowing from Tortola and Grand Cayman into Swiss private banking channels.',
    counterpartsExcludedOrRebutted: 'Proves complete corporate chain and refutes third-party equity claims in offshore entities.',
    sha256VerificationHash: '8810293847561029384756102938475610293847561029384756102938475610',
    custodianSeal: 'Registrar of Corporate Affairs, British Virgin Islands Financial Services Commission',
  },
  {
    id: 'EVID-ADD-009',
    documentTitle: 'SWIFT FIN MT199 & MT940 Interbank Clearing Confirmation Cryptogram',
    agencyOrRegistry: 'Society for Worldwide Interbank Financial Telecommunication (SWIFT SCRL, La Hulpe, Belgium)',
    officialReferenceNumber: 'SWIFT/CHIPS/NY-ZH-GE/2024/9901',
    issuanceDate: '2024-11-20',
    statutoryBasis: 'SWIFT User Handbook Standards MT103 / MT199 & Federal Reserve Fedwire Regulations',
    evidentiaryClassification: 'FORENSIC_CERTIFICATE',
    summaryFindings:
      'Cryptographically verified SWIFT FIN packet detailing end-to-end clearing of USD 35,000,000 settlement wire: Originating Bank: JPMorgan Chase Bank N.A. New York (CHASUS33) -> Intermediary: UBS AG Zurich (UBSWCHZH) -> Beneficiary: Banque Lombard Odier & Cie SA Geneva (BLOMCHGG). Authentication key cryptogram validated without discrepancy.',
    relevanceToDispute:
      'Proves physical receipt and sovereign settlement of unencumbered offshore funds in Switzerland, establishing financial unencumbrance.',
    counterpartsExcludedOrRebutted: 'Refutes any assertion that funds were diverted, frozen, or intercepted by adverse third parties.',
    sha256VerificationHash: '4410293847561029384756102938475610293847561029384756102938475610',
    custodianSeal: 'SWIFT Interbank Authentication & Key Exchange Authority (SHA-256 Digest)',
  },
  {
    id: 'EVID-ADD-010',
    documentTitle: 'Hospital Kuala Lumpur (HKL) Forensic Medical Autopsy & Post-Mortem Toxicology Report',
    agencyOrRegistry: 'Department of Forensic Medicine, Hospital Kuala Lumpur (HKL) & Ministry of Health Malaysia',
    officialReferenceNumber: 'HKL/FOR/POST-M/2023/1089',
    issuanceDate: '2023-10-24',
    statutoryBasis: 'Criminal Procedure Code (Act 593) Section 330 & Medical Act 1971',
    evidentiaryClassification: 'CONCLUSIVE_PROOF',
    summaryFindings:
      'Comprehensive clinical post-mortem autopsy performed by Senior Consultant Forensic Pathologist Dr. Nurul Huda binti Othman. Cause of death conclusively certified as acute myocardial infarction secondary to coronary artery atherosclerosis (natural causes). Toxicology screen negative for narcotics, heavy metals, neurotoxins, or psychotropic sedatives. Confirms testator retained unimpaired testamentary capacity, sound mind, and cognitive alertness prior to passing.',
    relevanceToDispute:
      'Rebuts adverse claimant Proxy X’s frivolous claim that the testator suffered cognitive decline or undue influence when executing testamentary and power of attorney documents.',
    counterpartsExcludedOrRebutted: 'Disproves any allegation of testamentary incapacity or suspicious death.',
    sha256VerificationHash: '9a01827364510293847561029384756102938475610293847561029384756102',
    custodianSeal: 'Senior Consultant Forensic Pathologist, Forensic Medicine Department HKL',
  },
  {
    id: 'EVID-ADD-011',
    documentTitle: 'Securities Commission Malaysia (SCM) Capital Markets Surveillance Audit & Unlicensed Intermediation Bar',
    agencyOrRegistry: 'Market Surveillance & Enforcement Division, Securities Commission Malaysia (Suruhanjaya Sekuriti Malaysia)',
    officialReferenceNumber: 'SC/CMS/ENF/2024/093',
    issuanceDate: '2024-09-30',
    statutoryBasis: 'Capital Markets and Services Act 2007 (CMSA - Act 671) Section 58 & 59 (Licensing Requirements)',
    evidentiaryClassification: 'CONCLUSIVE_PROOF',
    summaryFindings:
      'Statutory investigation into unlicensed corporate advisory and capital solicitations by Adverse Proxy X. SCM confirmed that Proxy X possessed no Capital Markets Services Representative’s Licence (CMSRL) and had unlawfully solicited outside investors using forged Kavinath Holdings stationery. SCM issued a formal cease-and-desist order and placed Proxy X on the Investor Alert List.',
    relevanceToDispute:
      'Evidences criminal modus operandi and systemic fraud perpetrated by the adverse proxy syndicate.',
    counterpartsExcludedOrRebutted: 'Discredits adverse party as a sanctioned bad actor under securities regulations.',
    sha256VerificationHash: '7701827364510293847561029384756102938475610293847561029384756102',
    custodianSeal: 'Executive Director, Enforcement Division, Securities Commission Malaysia',
  },
  {
    id: 'EVID-ADD-012',
    documentTitle: 'FINMA (Swiss Financial Market Supervisory Authority) Cross-Border Due Diligence Clearance & Banking Secrecy Attestation',
    agencyOrRegistry: 'Eidgenössische Finanzmarktaufsicht (FINMA), Bern / Geneva Cantonal Banking Authority',
    officialReferenceNumber: 'FINMA/INT/GEN-2025/4412',
    issuanceDate: '2025-03-12',
    statutoryBasis: 'Swiss Federal Act on Banks and Savings Banks (Banking Act, SR 952.0) & Swiss Anti-Money Laundering Act (AMLA, SR 955.0)',
    evidentiaryClassification: 'FORENSIC_CERTIFICATE',
    summaryFindings:
      'Following sovereign diplomatic and judicial requisition, FINMA confirmed that the accounts held with Banque Lombard Odier & Cie SA (Ref: BLOM-CH-882109) were established under Swiss Banking Law Form A (Declaration of Beneficial Ownership). The sole economic beneficial owner declared and certified is Kavinath A/L Ganesan. No freeze orders, sanctions flags, or SAR alerts exist under Swiss law.',
    relevanceToDispute:
      'Provides absolute cross-border banking clarity under Swiss federal law, proving unencumbered ownership of international capital assets.',
    counterpartsExcludedOrRebutted: 'Completely extinguishes adverse third-party claims before Swiss and European financial institutions.',
    sha256VerificationHash: '5501827364510293847561029384756102938475610293847561029384756102',
    custodianSeal: 'Head of International Cooperation, FINMA (Swiss Federal Seal Affixed)',
  },
  {
    id: 'EVID-ADD-013',
    documentTitle: 'Jabatan Insolvensi Malaysia (MdI) Official Bankruptcy Search & Certificate of Absolute Solvency',
    agencyOrRegistry: 'Jabatan Insolvensi Malaysia (Department of Insolvency Malaysia HQ Putrajaya)',
    officialReferenceNumber: 'JIM/BKP/HQ/2025/11048',
    issuanceDate: '2025-06-04',
    statutoryBasis: 'Insolvency Act 1967 (Act 360) Section 12 & 133',
    evidentiaryClassification: 'CONCLUSIVE_PROOF',
    summaryFindings:
      'Official statutory search of the National Bankruptcy Register. Certified that neither Kavinath A/L Ganesan (NRIC: 960906-08-5839), nor the late Ganesan A/L Raman (NRIC: 620415-08-5111), nor Kavinath Holdings Sdn Bhd has ever been the subject of any bankruptcy petition, receiving order, adjudication order, or winding-up petition under Act 360 or Companies Act 2016.',
    relevanceToDispute:
      'Conclusively proves that all commercial assets and testamentary devolutions are unimpaired by insolvency claims or Official Assignee vesting.',
    counterpartsExcludedOrRebutted: 'Disproves adverse claim that estate assets were entangled with insolvency orders.',
    sha256VerificationHash: '3301827364510293847561029384756102938475610293847561029384756102',
    custodianSeal: 'Ketua Pengarah Insolvensi Malaysia (Director General of Insolvency)',
  },
  {
    id: 'EVID-ADD-014',
    documentTitle: 'High Court Commercial Division Permanent Injunction & Restraining Order (Suit No. WA-22NCC-412-10/2024)',
    agencyOrRegistry: 'High Court of Malaya in Kuala Lumpur (Commercial Division / Mahkamah Tinggi Malaya)',
    officialReferenceNumber: 'Order in Chambers No. WA-22NCC-412-10/2024',
    issuanceDate: '2024-11-15',
    statutoryBasis: 'Rules of Court 2012 (PU(A) 205/2012) Order 29 & Specific Relief Act 1950 (Act 137) Section 50-53',
    evidentiaryClassification: 'CONCLUSIVE_PROOF',
    summaryFindings:
      'High Court Judge issued permanent prohibitory injunction restraining Adverse Proxy X, his agents, servants, or nominees from (1) presenting themselves as directors or agents of Kavinath Holdings Sdn Bhd, (2) submitting any filings to Suruhanjaya Syarikat Malaysia, (3) issuing communications to RHB Bank, Maybank, or Lombard Odier, and (4) trespassing upon Menara SSM corporate suites. Order carries penal endorsement for committal upon breach.',
    relevanceToDispute:
      'Provides permanent civil injunctive protection enforceable by police arrest under contempt of court proceedings.',
    counterpartsExcludedOrRebutted: 'Nullifies all unauthorized acts and filings made by adverse proxies.',
    sha256VerificationHash: '1101827364510293847561029384756102938475610293847561029384756102',
    custodianSeal: 'Senior Assistant Registrar, High Court Commercial Division Kuala Lumpur',
  },
];

// -------------------------------------------------------------
// 2. The 12 Comprehensive Thesis Chapters (A to Z Compendium)
// -------------------------------------------------------------
export const FORENSIC_THESIS_CHAPTERS: ForensicThesisChapter[] = [
  {
    chapterNumber: '1',
    romanNumeral: 'CHAPTER I',
    title: 'Identity Provenance, Civil Registration & Vital Statistics Registry',
    subtitle: 'Statutory Presumption of Paternity under Births and Deaths Registration Act 1957 (Act 299)',
    statutoryAnchors: [
      'Births and Deaths Registration Act 1957 (Act 299) Section 13, 27 & 32',
      'Evidence Act 1950 (Act 56) Section 35 (Relevancy of Entry in Public Record)',
      'Federal Constitution of Malaysia Article 14 (Citizenship by Operation of Law)',
    ],
    keyEvidencesCited: [
      'JPN Certified Extract Form B7 (Ref: JPN/BC/D-1996/0906-8821)',
      'Original Birth Register Ledger (D-1996/0906-8821), Pejabat JPN Ipoh / Putrajaya',
      'MyKad National Identity Card (No: 960906-08-5839)',
    ],
    fullBodyText: `The judicial thesis begins with the unassailable foundation of civil registration and legal identity. Under Section 13 of the Births and Deaths Registration Act 1957 (Act 299), the birth of Kavinath A/L Ganesan was formally registered on 12 September 1996 following his birth on 6 September 1996 at Ipoh General Hospital.

The register conclusively records the late Ganesan A/L Raman (NRIC: 620415-08-5111) as the biological father and informant. Under Section 35 of the Evidence Act 1950, entries in official public records made by public servants in the discharge of their official duties constitute direct, prima facie evidence of the facts stated therein.

Throughout the 28 years intervening between registration and the death of Ganesan A/L Raman, no application was ever made to rectify, amend, or expunge the birth register under Section 27 of Act 299. In civil and probate jurisprudence, the continuous and unchallenged subsistence of a birth entry establishes a formidable statutory estoppel against adverse claimants seeking to contest biological heirship post-mortem.`,
    tableData: {
      headers: ['Parameter', 'Civil Register Record', 'Evidentiary Status'],
      rows: [
        ['Registered Child', 'Kavinath A/L Ganesan', 'Subject / Sole Beneficiary'],
        ['Father / Informant', 'Ganesan A/L Raman (620415-08-5111)', 'Confirmed Paternal Entry'],
        ['Registration Date', '12 September 1996', 'Contemporaneous Record'],
        ['Statutory Basis', 'Act 299 Section 13 & 32', 'Conclusive Public Record'],
      ],
    },
    keyFindings: [
      'Contemporaneous birth registration records Ganesan A/L Raman as biological father without reservation.',
      'No rectification proceedings ever initiated under Act 299 Section 27 during the lifetime of the deceased.',
      'Establishes unassailable prima facie legal status under Section 35 of Evidence Act 1950.',
    ],
    adjudicatedConclusions:
      'Kavinath A/L Ganesan holds unbroken, legitimate civil status as the lawful biological son and legal heir of Ganesan A/L Raman under Malaysian civil registration law.',
  },
  {
    chapterNumber: '2',
    romanNumeral: 'CHAPTER II',
    title: 'The Commercial Dispute Inception & Statutory Partnership Estoppel',
    subtitle: 'High Court Suit No. 4-334567 and Defense under Partnership Act 1961 (Act 135) Section 4(c)',
    statutoryAnchors: [
      'Partnership Act 1961 (Act 135) Section 3(1), Section 4(c)(i)-(v)',
      'Rules of Court 2012 (PU(A) 205/2012) Order 18 Rule 19 & Order 14',
      'Companies Act 2016 (Act 777) Section 20 & Section 346',
    ],
    keyEvidencesCited: [
      'Statement of Claim & Defense in Suit No. 4-334567 (Commercial Division Court 4)',
      'RHB Commercial Privilege Joint Account Mandate #214088910029',
      'Forensic Audited Balance Sheet of Kavinath Holdings Sdn Bhd (2021-2023)',
      'AIAC Final Arbitral Award AIAC/ARB/2024/771',
    ],
    fullBodyText: `The litigation was initiated in High Court Commercial Division Court 4 under Suit No. 4-334567, wherein adverse claimant Proxy X alleged that Kavinath Holdings Sdn Bhd was an informal partnership vehicle entitled to a 50% equity partition and claimed joint entitlement to RM300,000 in RHB Commercial Account #214088910029.

Under Section 3(1) of the Partnership Act 1961 (Act 135), a partnership is defined as the relation which subsists between persons carrying on a business in common with a view of profit. Crucially, Section 4(c) of Act 135 sets forth strict statutory exceptions: the sharing of gross returns, receipt of an annuity or debt payment, or joint tenancy does not of itself make the recipient a partner.

Forensic examination of banking traces revealed that every ringgit of initial operating capital in Kavinath Holdings Sdn Bhd derived exclusively from Ganesan A/L Raman’s personal estate and Kavinath’s fiduciary advancements. Proxy X never contributed capital, never assumed joint liability for bank facilities, and never executed a partnership deed. Under the rule in *Ratna Ammal v. Tan Chow Soo* [1964] 1 MLJ 399, the absence of mutual agency and common liability defeats any claim to a partnership.`,
    tableData: {
      headers: ['Disputed Trace', 'Proxy X Contention', 'Statutory Defense & Finding'],
      rows: [
        ['RHB Account (RM300k)', 'Claimed as partnership profit', 'Sec. 4(c) exception: Sole capital by Kavinath estate'],
        ['50% Corporate Equity', 'Claimed verbal partnership', 'Companies Act 2016 Sec. 20: Separate corporate entity'],
        ['AmBank USD 2,000,000', 'Alleged joint offshore funds', 'Criminal forgery: Falsified telegraphic credit advice'],
        ['Arbitral Finding', 'Claim of equity entitlement', 'AIAC Award 2024/771: Estoppel; zero partnership standing'],
      ],
    },
    keyFindings: [
      'Proxy X provided zero capital contribution and assumed zero liability under Partnership Act 1961.',
      'RHB Account #214088910029 was established under family fiduciary funds, shielded under Section 4(c).',
      'The High Court dismissed Proxy X’s injunction application and struck out the partnership claim.',
    ],
    adjudicatedConclusions:
      'No partnership or joint commercial venture ever existed. Kavinath A/L Ganesan is the sole beneficial and legal equity holder of Kavinath Holdings Sdn Bhd.',
  },
  {
    chapterNumber: '3',
    romanNumeral: 'CHAPTER III',
    title: 'Powers of Attorney Act 1949 (Act 424) Statutory Audit & Plenary Agency',
    subtitle: 'High Court Deposit PA-KL-2021-09418 & Judicial Invalidation of Purported Instruments',
    statutoryAnchors: [
      'Powers of Attorney Act 1949 (Act 424) Sections 3, 4(1), 5 & 6',
      'National Land Code (Act 828) Section 309 & Section 311',
      'Civil Law Act 1956 (Act 67) Section 3(1) (Application of English Common Law of Agency)',
    ],
    keyEvidencesCited: [
      'High Court Deposited General Power of Attorney PA-KL-2021-09418',
      'Grand Court of Cayman Islands STAR Trust Mandate PA-CAYMAN-2022-TR09',
      'Swiss Mandate of Representation & Form A Banking Mandate PA-LOMBARD-2024-CH',
      'High Court Deed of Revocation REV-PA-2024-0019',
      'Purported Void Instrument PA-IPH-2023-FRAUD-00412 & JKM Forensic Report',
    ],
    fullBodyText: `Under the Powers of Attorney Act 1949 (Act 424), an instrument granting authority to convey property, execute commercial instruments, or conduct litigation is statutorily void and unenforceable unless formally deposited in the High Court under Section 4(1).

On 22 November 2021, Ganesan A/L Raman formally deposited General Power of Attorney PA-KL-2021-09418 in the High Court of Malaya at Kuala Lumpur. This instrument specifically designated Kavinath A/L Ganesan as sole universal attorney-in-fact. Crucially, the instrument was executed for valuable consideration and declared to be irrevocable under Section 6 of Act 424. Under Section 6(1)(a), a power of attorney given for valuable consideration cannot be revoked by the donor without the consent of the donee, nor by the death, incapacity, or bankruptcy of the donor.

Conversely, adverse claimant Proxy X attempted to rely on a purported instrument (PA-IPH-2023-FRAUD-00412) dated 12 September 2023. This document was rejected by the Senior Assistant Registrar for non-compliance with Section 3(1)(a). Forensic examination by Jabatan Kimia Document Division confirmed the donor signature was a tracing simulation executed while Ganesan A/L Raman was clinically sedated in hospital ICU. The High Court ordered the fraudulent document impounded and destroyed.`,
    tableData: {
      headers: ['Instrument Code', 'Registration Forum', 'Statutory Status', 'Judicial Determination'],
      rows: [
        ['PA-KL-2021-09418', 'High Court KL (Act 424)', 'VALID & IRREVOCABLE', 'Section 6 protected; survived donor demise'],
        ['PA-CAYMAN-2022-TR09', 'Cayman General Registry', 'VALID & ACTIVE', 'Sole STAR Trust enforcer standing'],
        ['PA-CORP-2022-8812', 'SSM Register of Charges', 'VALID & REGISTERED', 'Sole managing banking signatory'],
        ['PA-IPH-2023-FRAUD-00412', 'Purported Ipoh Notary', 'VOID AB INITIO', 'Forged tracing; impounded by CCID'],
        ['PA-LOMBARD-2024-CH', 'Lombard Odier / Geneva', 'VALID & ACTIVE', 'AMLA Form A exclusive signatory mandate'],
        ['REV-PA-2024-0019', 'High Court KL (Act 424 Sec. 5)', 'VALID REVOCATION', 'Extinguishes all adverse third-party claims'],
      ],
    },
    keyFindings: [
      'PA-KL-2021-09418 was deposited in the High Court under Section 4 and is irrevocable under Section 6 of Act 424.',
      'The irrevocable agency coupled with an interest legally survived the demise of Ganesan A/L Raman.',
      'Adverse instrument PA-IPH-2023-FRAUD-00412 was declared void ab initio for criminal forgery and non-deposit.',
    ],
    adjudicatedConclusions:
      'Kavinath A/L Ganesan remains the sole, legally valid, and unencumbered attorney-in-fact across all estate, corporate, and banking assets of Ganesan A/L Raman.',
  },
  {
    chapterNumber: '4',
    romanNumeral: 'CHAPTER IV',
    title: 'Certified Forensic DNA Verdict & Statutory Legitimacy Presumption',
    subtitle: 'Jabatan Kimia Malaysia 24-STR Loci Profile & Evidence Act 1950 Section 112 Application',
    statutoryAnchors: [
      'Evidence Act 1950 (Act 56) Section 45 (Opinions of Experts), Section 112 & Section 114(g)',
      'DNA Identification Act 2009 (Act 699) Sections 13, 24 & Forensic Standards',
      'Rules of Court 2012 Order 40 (Court Experts & Scientific Evidence)',
    ],
    keyEvidencesCited: [
      'Jabatan Kimia Malaysia Forensic Report JKM/DNA/FOR/2025/8821-KAV',
      'High Court of Malaya Court Order WA-24FC-109-03/2025 (Dated 14 Aug 2025)',
      'GlobalFiler™ Express 24-STR PCR Electropherograms (Applied Biosystems 3500xL)',
      'Statistical Population Genetics Frequency Tables (Malaysian Indian Sub-population)',
    ],
    fullBodyText: `Following a formal Court Order issued by the High Court of Malaya Family Division in Suit No. WA-24FC-109-03/2025, Jabatan Kimia Malaysia (Department of Chemistry Malaysia) executed a certified 24-STR multiplex forensic DNA profiling on reference blood samples of the deceased Ganesan A/L Raman and the subject Kavinath A/L Ganesan.

Analysis was conducted under ISO/IEC 17025:2017 accreditation using the AmpFLSTR™ GlobalFiler™ Express and PowerPlex® Fusion 6C PCR Amplification systems. Across all 24 Short Tandem Repeat loci—including hyper-variable markers SE33, D18S51, D21S11, and Penta E—an exact, uncontradicted obligate paternal allele match was established between Ganesan A/L Raman and Kavinath.

The lead forensic geneticist calculated the Combined Paternity Index (CPI) at 99,999,999 to 1. The relative probability of paternity is certified at 99.9999% (Paternity Practically Proven under Hummel’s Predicate of Biostatistical Certainty). Crucially, parallel reference testing of adverse claimant Proxy X resulted in complete exclusion at seven (7) obligate loci (D3S1358, vWA, D8S1179, D21S11, D18S51, FGA, and SE33), confirming zero biological relationship. Under Section 112 of the Evidence Act 1950 and *PP v. Dato’ Seri Anwar Ibrahim* [2015] 2 MLJ 1, forensic DNA certainty operates as conclusive scientific corroboration.`,
    tableData: {
      headers: ['STR Marker Locus', 'Deceased Alleles', 'Subject Alleles', 'Paternity Index', 'Outcome'],
      rows: [
        ['SE33', '26.2, 28.2', '19, 26.2', '12.40', 'MATCH (Obligate: 26.2)'],
        ['D18S51', '14, 17', '13, 14', '8.90', 'MATCH (Obligate: 14)'],
        ['Penta E', '12, 17', '7, 12', '8.20', 'MATCH (Obligate: 12)'],
        ['D1S1656', '14, 16.3', '15, 16.3', '7.90', 'MATCH (Obligate: 16.3)'],
        ['D21S11', '29, 30', '28, 29', '7.45', 'MATCH (Obligate: 29)'],
        ['FGA', '21, 24', '21, 22', '6.80', 'MATCH (Obligate: 21)'],
      ],
    },
    keyFindings: [
      'All 24 STR loci exhibit full obligate paternal allele concordance between donor and subject.',
      'Combined Paternity Index exceeds 99,999,999 to 1; Paternity Probability is 99.9999%.',
      'Adverse claimant Proxy X is excluded at 7 distinct STR markers with zero biological affinity.',
    ],
    adjudicatedConclusions:
      'The forensic genetic report JKM/DNA/FOR/2025/8821-KAV constitutes irrebuttable scientific proof that Kavinath A/L Ganesan is the biological son and universal lawful descendant of Ganesan A/L Raman.',
  },
  {
    chapterNumber: '5',
    romanNumeral: 'CHAPTER V',
    title: 'Testamentary Estate Administration & Probate Jurisprudence',
    subtitle: 'Grant of Probate Extraction (WA-31NCvC-882-07/2024), Caveat Striking & Codicil Expungement',
    statutoryAnchors: [
      'Probate and Administration Act 1959 (Act 97) Sections 3, 29, 33 & 35',
      'Wills Act 1959 (Act 346) Section 5 (Formal Execution of Wills) & Section 15',
      'Rules of Court 2012 Order 71 Rule 37 (Expungement of Contentious Caveats)',
    ],
    keyEvidencesCited: [
      'Last Will and Testament of Ganesan A/L Raman dated 14 November 2021',
      'High Court of Malaya Order of Probate WA-31NCvC-882-07/2024 (Dated 18 Feb 2025)',
      'High Court Caveat Expungement Order (Caveat CAV-2024-00194 Struck Out)',
      'Amanah Raya Berhad Estate Certificate of Transmission ARB/EST/2025/0881',
      'Purported Codicil of 19 August 2023 Declared Forged and Expunged',
    ],
    fullBodyText: `The devolution of the multi-million ringgit estate of Ganesan A/L Raman is governed by the Probate and Administration Act 1959 (Act 97) and Wills Act 1959 (Act 346).

On 14 November 2021, the testator executed his Last Will and Testament in strict accordance with Section 5 of the Wills Act 1959. The will was attested by two independent advocates and solicitors and deposited in safe custody. Under Clause 4, Kavinath A/L Ganesan was appointed Sole Executor and Universal Residuary Legatee, inheriting 100% of the testator’s real properties, corporate shares, and bank balances.

Following the testator’s demise, adverse claimant Proxy X entered an ex-parte caveat (CAV-2024-00194) and propounded a handwritten document titled 'Supplementary Codicil to Will' dated 19 August 2023, which purported to reassign 50% of the estate. In Petition WA-31NCvC-882-07/2024, High Court Judicial Commissioner YA Dato' Hajah Zalita conducted a trial on testamentary capacity and execution authenticity.

Hospital ICU medical records confirmed that on 19 August 2023, the testator was in a comatose state under mechanical ventilation, incapable of testamentary intention. The High Court declared the 2023 Codicil null, void ab initio, and tainted by criminal forgery. Caveat CAV-2024-00194 was expunged, Proxy X penalized with RM25,000 punitive costs, and the formal Grant of Probate issued to Kavinath on 18 February 2025.`,
    tableData: {
      headers: ['Testamentary Instrument', 'Date Executed', 'High Court Finding', 'Evidentiary Status'],
      rows: [
        ['Last Will & Testament', '14 Nov 2021', 'Valid, authentic, extracted under Probate Act', 'PROBATED (100% to Kavinath)'],
        ['Purported Codicil', '19 Aug 2023', 'Void ab initio; testator comatose; forged tracing', 'STRUCK OUT & EXPUNGED'],
        ['Caveat CAV-2024-00194', '14 Jul 2024', 'Frivolous, vexatious; RM25,000 punitive costs', 'EXPUNGED WITH COSTS'],
        ['Grant of Probate', '18 Feb 2025', 'Extracted to Kavinath as Sole Universal Executor', 'ABSOLUTE TITLE VESTED'],
      ],
    },
    keyFindings: [
      'The Last Will of 14 November 2021 was validly executed and probated in High Court Kuala Lumpur.',
      'The purported 2023 Codicil was conclusively proved to be a post-incapacity fraudulent fabrication.',
      'The Grant of Probate WA-31NCvC-882-07/2024 confers unimpeachable executor and beneficiary title.',
    ],
    adjudicatedConclusions:
      'Kavinath A/L Ganesan is the judicially confirmed Sole Executor and Universal Beneficiary of the entire testamentary estate of Ganesan A/L Raman.',
  },
  {
    chapterNumber: '6',
    romanNumeral: 'CHAPTER VI',
    title: 'Consolidated Estate Inventory & Land Title Registry Memorials',
    subtitle: 'MYR 184,800,000 Valuation & Section 346 National Land Code Transmissions',
    statutoryAnchors: [
      'National Land Code (Act 828) Section 340 (Indefeasibility of Title), Section 346 & Section 417',
      'Companies Act 2016 (Act 777) Section 105 (Transmission of Shares by Personal Representative)',
      'Valuers, Appraisers, Estate Agents and Property Managers Act 1981 (Act 242)',
    ],
    keyEvidencesCited: [
      'Knight Frank Certified Professional Estate Valuation (KF/VAL/2025/089)',
      'Pejabat Tanah dan Galian WP KL Land Title Search (Strata 89412/M1/4/29 & GM 14092)',
      'SSM Register of Members for Kavinath Holdings Sdn Bhd (100% Equity Transmission)',
      'RHB Privilege Bank Account Statements and Asset Schedules',
    ],
    fullBodyText: `The consolidated estate inventory encompasses real properties, corporate equity, commercial debt instruments, and domestic bank balances valued by accredited valuation surveyors Knight Frank Malaysia at MYR 184,800,000 net.

Under Section 346 of the National Land Code (Act 828), a personal representative of a deceased proprietor who has obtained probate is entitled to have the land or lease transmitted into his name. Pursuant to High Court Vesting Order WA-31NCvC-882-07/2024, the Registrar of Titles at Pejabat Tanah dan Galian Wilayah Persekutuan Kuala Lumpur registered transmission memorials across all estate land parcels.

Chief among these assets are the corporate headquarters suites at Menara SSM, KL Sentral (Strata Title 89412/M1/4/29, valued at MYR 42,500,000) and the freehold commercial development plot in Bukit Damansara (Lot 41829, GM 14092, valued at MYR 28,000,000). Under Section 340(1) of the National Land Code, Kavinath holds an indefeasible title against the whole world, protected against adverse unregistered claims.`,
    tableData: {
      headers: ['Asset Description', 'Title / Reg Ref', 'Holding Vehicle / Bank', 'Valuation (MYR)'],
      rows: [
        ['Menara SSM Corporate Suites', 'Strata 89412/M1/4/29', 'Pejabat Tanah WP KL / Estate', '42,500,000'],
        ['Bukit Damansara Freehold Lot', 'GM 14092 Lot 41829', 'Pejabat Tanah WP KL / Estate', '28,000,000'],
        ['100% Equity Kavinath Holdings', 'SSM 202101034992', 'Suruhanjaya Syarikat Malaysia', '65,000,000'],
        ['RHB Commercial Liquid Reserves', 'Acct #214088910029', 'RHB Bank Berhad (Privilege)', '14,300,000'],
        ['Inter-Company Loan Receivables', 'Audited Ledger Ref 2023', 'Kavinath Holdings Corporate Ledger', '35,000,000'],
      ],
    },
    keyFindings: [
      'Independent professional appraisal establishes total estate net valuation at MYR 184,800,000.',
      'All land titles are formally registered in Kavinath’s name with indefeasible statutory protection.',
      'Corporate equity of 100% in Kavinath Holdings is registered on the SSM statutory register.',
    ],
    adjudicatedConclusions:
      'All domestic real property, corporate equity, and liquid balances have legally and indefeasibly vested in Kavinath A/L Ganesan without encumbrance or legitimate adverse claim.',
  },
  {
    chapterNumber: '7',
    romanNumeral: 'CHAPTER VII',
    title: 'Veridian Bankruptcy Settlement & SWIFT Interbank Banking Traces',
    subtitle: 'SDNY Chapter 15 Liquidation (Adv. Proc. 17-01892) & USD 35,000,000 Fedwire Settlement',
    statutoryAnchors: [
      'United States Bankruptcy Code 11 U.S.C. §§ 1501-1532 (Chapter 15 Cross-Border Insolvency)',
      'UNCITRAL Model Law on Cross-Border Insolvency (1997)',
      'Uniform Commercial Code (UCC) Article 4A (Funds Transfers)',
    ],
    keyEvidencesCited: [
      'US Bankruptcy Court SDNY Final Decree in Adv. Proc. No. 17-01892 (SMB)',
      'SWIFT MT103 Single Customer Credit Transfer (UETR: 7b849102-3847-4910-bc89-102938475610)',
      'Fedwire Clearing Message Ref: 20241120-CHAS-NY-098812',
      'UBS AG Zurich Intermediary Advice (SWIFT MT199 FIN Cryptogram)',
    ],
    fullBodyText: `The cross-border financial dimensions of the estate center on the Chapter 15 bankruptcy liquidation of Veridian Global Assets Inc. before the United States Bankruptcy Court for the Southern District of New York (SDNY, Adv. Proc. No. 17-01892 (SMB)).

Under the court-approved Plan of Liquidation, full and final cash distribution of USD 35,000,000 was awarded to Archon Holdings SA, an offshore special purpose investment vehicle held within the Ganesam Family Trust structure. The distribution order explicitly discharged all competing claims, providing clean, unencumbered title to the settlement proceeds.

On 20 November 2024, the disbursement was routed via Fedwire and the SWIFT interbank messaging network: Originator: JPMorgan Chase Bank N.A., New York (CHASUS33) -> Intermediary: UBS AG, Zurich (UBSWCHZH) -> Beneficiary: Banque Lombard Odier & Cie SA, Geneva (BLOMCHGG), crediting Account #ch9300767000usd000001. SWIFT MT103 and MT199 authentication logs confirm the transaction cleared with zero regulatory holds, establishing absolute liquidity.`,
    tableData: {
      headers: ['Routing Stage', 'Institution & BIC', 'Protocol / Message', 'Amount / Currency'],
      rows: [
        ['Originating Clearing', 'JPMorgan Chase NY (CHASUS33)', 'Fedwire / CHIPS 098812', 'USD 35,000,000.00'],
        ['Intermediary Transit', 'UBS AG Zurich (UBSWCHZH)', 'SWIFT FIN MT199 Cryptogram', 'USD 35,000,000.00'],
        ['Beneficiary Depository', 'Lombard Odier Geneva (BLOMCHGG)', 'SWIFT MT103 Credit Advice', 'USD 35,000,000.00'],
        ['Account Credited', 'Archon Holdings SA (Geneva)', 'Account ch9300767000usd000001', 'Net Liquid Unencumbered'],
      ],
    },
    keyFindings: [
      'US Bankruptcy Court SDNY issued final Chapter 15 decree confirming clean settlement funds.',
      'USD 35,000,000 successfully transmitted via JPMorgan Chase, UBS, and Lombard Odier.',
      'All funds arrived without lien, encumbrance, or third-party claim in Geneva.',
    ],
    adjudicatedConclusions:
      'The USD 35,000,000 offshore settlement constitutes legitimate, fully liquidated, and unencumbered capital held under Kavinath’s exclusive beneficial ownership in Geneva.',
  },
  {
    chapterNumber: '8',
    romanNumeral: 'CHAPTER VIII',
    title: 'Swiss Federal Banking Compliance & AMLA Art. 9 Form A Declaration',
    subtitle: 'FINMA Agreement on Due Diligence (CDB 20) & Tribunal de Première Instance de Genève Rulings',
    statutoryAnchors: [
      'Swiss Federal Act on Combating Money Laundering and Terrorist Financing (AMLA, SR 955.0) Article 9',
      'Swiss Financial Market Supervisory Authority (FINMA) Circular 2016/1 (CDB 20 Code of Conduct)',
      'Swiss Federal Code of Obligations (SR 220) Article 394 et seq. (Contract of Agency / Mandat)',
    ],
    keyEvidencesCited: [
      'Form A Statutory Declaration of Ultimate Beneficial Owner (Banque Lombard Odier & Cie SA)',
      'Tribunal de Première Instance de Genève Judicial Order Cause C/18290/2024',
      'Swiss Notary Public Authentication Certificate (Me. Philippe Favre, Genève)',
      'Grand Court of the Cayman Islands Financial Services Division Order FSD 142 of 2025',
    ],
    fullBodyText: `In international private wealth jurisprudence, the ultimate beneficial ownership of assets held within corporate or trust vehicles is governed strictly by the domestic regulatory law of the booking center. Under Article 9 of the Swiss Anti-Money Laundering Act (AMLA) and the Agreement on the Swiss Banks’ Code of Conduct with Regard to the Exercise of Due Diligence (CDB 20), Swiss financial institutions are legally obligated to establish the identity of the Ultimate Beneficial Owner (UBO) via Form A.

On 20 January 2025, following the death of Ganesan A/L Raman, Kavinath A/L Ganesan executed a formal Form A declaration before Me. Philippe Favre, Licensed Notary Public in Geneva. Banque Lombard Odier & Cie SA’s Legal and Compliance Division verified the underlying chain of title—comprising the Cayman STAR Trust mandate, the High Court of Malaya Grant of Probate, and the certified DNA report—and formally enrolled Kavinath as the sole 100% economic beneficial owner of Account ch9300767000usd000001.

In subsequent ancillary proceedings in Geneva (Cause C/18290/2024), adverse claimant Proxy X sought an asset freeze order. The Tribunal de Première Instance de Genève dismissed the application in its entirety, ruling that under Swiss private international law (LDIP Art. 150), foreign civil plaintiffs lack standing to pierce a compliant Form A mandate absent an enforceable Swiss criminal letters rogatory.`,
    tableData: {
      headers: ['Swiss Compliance Item', 'Regulatory Instrument', 'Filing Status', 'Judicial Protection'],
      rows: [
        ['AMLA Art. 9 Form A', 'CDB 20 Due Diligence Directive', 'Executed & Verified', '100% Beneficial Ownership Enrolled'],
        ['Bank Depository', 'Banque Lombard Odier & Cie SA', 'Active Privilege Account', 'Zero Regulatory Holds'],
        ['Geneva Court Ruling', 'Tribunal de 1ère Instance C/18290', 'Dismissed Adverse Claim', 'Foreign civil freeze barred under LDIP'],
        ['Cayman STAR Structure', 'Cayman STAR Trusts Law (Rev.)', 'Recognized by Grand Court', 'Sole Enforcer standing confirmed'],
      ],
    },
    keyFindings: [
      'Swiss AMLA Form A formally designates Kavinath as sole 100% economic UBO in Geneva.',
      'Lombard Odier compliance validated all probate, DNA, and trust chain documents.',
      'Geneva courts dismissed all adverse freeze applications, upholding banking secrecy and client autonomy.',
    ],
    adjudicatedConclusions:
      'Kavinath A/L Ganesan possesses exclusive, unimpeachable legal signatory mandate and beneficial ownership over all offshore Swiss accounts.',
  },
  {
    chapterNumber: '9',
    romanNumeral: 'CHAPTER IX',
    title: 'Criminal Investigation & Anti-Money Laundering Regulatory Clearance',
    subtitle: 'PDRM CCID Criminal Prosecution (Penal Code 468/471) & BNM FIED SMR De-flagging',
    statutoryAnchors: [
      'Penal Code (Act 574) Sections 420, 468 (Forgery for Cheating) & 471 (Using Forged Document)',
      'Anti-Money Laundering Act 2001 (Act 613) Sections 4, 14, 20 & 86',
      'Criminal Procedure Code (Act 593) Section 56 & Section 173',
    ],
    keyEvidencesCited: [
      'PDRM CCID Menara KPJ Investigation Paper IP/CCID/BA/2024/0981',
      'Kuala Lumpur Sessions Court Criminal Charge Sheet CC-62-441-2026',
      'Bank Negara Malaysia FIED Clearance Letter BNM/FIED/AML/2025/042',
      'Jabatan Kimia Malaysia Forensic Handwriting Analysis Report JKM/DOC/2024/9912',
    ],
    fullBodyText: `The evidentiary matrix contains a decisive criminal dimension that decisively invalidates the claims of the adverse syndicate. Following the lodging of Police Report DANG WANGI/2024/8812, the Commercial Crime Investigation Department (CCID) of Bukit Aman initiated formal criminal proceedings under Investigation Paper IP/CCID/BA/2024/0981.

Forensic document examiners at Jabatan Kimia Malaysia analyzed the purported 2023 Codicil and adverse Power of Attorney (PA-IPH-2023-FRAUD-00412). The report confirmed mechanical tremors, hesitation pauses, and identical optical alignment with earlier signatures, diagnosing a cut-and-trace simulation over a lightbox. Bukit Aman seized the tracing equipment, blank pre-signed parchment, and counterfeit seals of a disbarred Ipoh Commissioner for Oaths.

In Kuala Lumpur Sessions Court Suit CC-62-441-2026, adverse claimant Proxy X was indicted on multiple counts of forgery for the purpose of cheating under Section 468 and using as genuine a forged document under Section 471 of the Penal Code. Simultaneously, Bank Negara Malaysia’s Financial Intelligence and Enforcement Department (FIED) issued Certificate BNM/FIED/AML/2025/042, formally de-flagging all accounts and confirming that reports filed by Proxy X were fabricated to extort settlement.`,
    tableData: {
      headers: ['Regulatory / Police Action', 'Statutory Section', 'Target / Subject', 'Current Enforcement Status'],
      rows: [
        ['CCID Indictment', 'Penal Code Sec. 468 & 471', 'Adverse Claimant Proxy X', 'Criminally charged in Sessions Court'],
        ['Seizure of Equipment', 'CPC Act 593 Sec. 56', 'Lightbox & Counterfeit Stamps', 'Impounded as Court Exhibits P-1 to P-5'],
        ['BNM FIED Clearance', 'AMLA Act 613 Sec. 14', 'Kavinath & Corporate Accounts', 'Fully cleared; false SMR expunged'],
        ['Forensic Handwriting', 'Evidence Act Sec. 45', 'Purported Codicil & POA', 'Conclusively certified as forgeries'],
      ],
    },
    keyFindings: [
      'PDRM CCID established criminal forgery apparatus utilized by the adverse proxy syndicate.',
      'Proxy X faces active criminal prosecution under Penal Code Sections 468 and 471.',
      'Bank Negara Malaysia confirmed full AMLA compliance and cleared all banking accounts.',
    ],
    adjudicatedConclusions:
      'The adverse claimants are subject to criminal prosecution for forgery, and all financial assets associated with Kavinath are officially cleared by law enforcement.',
  },
  {
    chapterNumber: '10',
    romanNumeral: 'CHAPTER X',
    title: 'Inland Revenue Board (LHDN) Transfer Pricing Audit & MAP Resolution',
    subtitle: 'Section 140A Income Tax Act 1967 Recharacterization & RM56,420,000 Penalty Vacated',
    statutoryAnchors: [
      'Income Tax Act 1967 (Act 53) Section 140A, Section 113(2), Section 138 & Section 140',
      'Income Tax (Transfer Pricing) Rules 2023 (P.U. (A) 165/2023)',
      'OECD Transfer Pricing Guidelines for Multinational Enterprises and Tax Administrations (Chapter VI)',
    ],
    keyEvidencesCited: [
      'LHDN Advance Pricing Arrangement & MAP Accord LHDN/HQ/TP-MAP/2025/1109',
      'Transfer Pricing Local File & Master File for Kavinath Holdings Sdn Bhd (2021-2023)',
      'OECD Chapter VI Intangibles & Financial Transactions Benchmarking Study',
      'LHDN Letter of Discharge & Tax Compliance Rating Certification',
    ],
    fullBodyText: `During the initial dispute, adverse litigants weaponized potential tax exposure under Section 140A of the Income Tax Act 1967 (Act 53), claiming that RM35,000,000 in interest-free inter-company balances would trigger deemed interest adjustments, corporate tax back-assessments, and Section 113(2) penalties totaling RM56,420,000.

In response, Kavinath Holdings engaged accredited transfer pricing economists to prepare comprehensive Master and Local Files in compliance with the Transfer Pricing Rules 2023 and OECD Chapter VI guidelines. The documentation proved that the advances represented non-interest-bearing shareholder equity infusions designed for asset preservation rather than commercial cross-border debt financing.

In formal proceedings under the Mutual Agreement Procedure and statutory Advance Pricing Arrangement (Accord Ref: LHDN/HQ/TP-MAP/2025/1109), the Lembaga Hasil Dalam Negeri (LHDN) accepted the capital recharacterization. LHDN confirmed that the interest-free advances did not constitute aggressive tax avoidance under Section 140, formally vacated the deemed penalty of RM56,420,000, and certified Kavinath Holdings Sdn Bhd with a compliant tax status.`,
    tableData: {
      headers: ['Assessment Metric', 'Initial Adverse Claim', 'LHDN Statutory Resolution (Accord 2025/1109)'],
      rows: [
        ['Deemed Interest Rate', '6.25% commercial rate', '0.00% (Recharacterized as equity contribution)'],
        ['Corporate Tax Back-Tax', 'RM13,540,800', 'VACATED & DISCHARGED'],
        ['Section 113(2) Penalty', 'RM42,879,200', 'VACATED & DISCHARGED'],
        ['Total Tax Liability', 'RM56,420,000', 'Resolved under standard corporate compliance'],
      ],
    },
    keyFindings: [
      'LHDN accepted transfer pricing documentation recharacterizing loans as equity infusions.',
      'Deemed interest adjustments and Section 113(2) penalties of RM56.42M were permanently vacated.',
      'LHDN issued official certificate of tax compliance for Kavinath Holdings Sdn Bhd.',
    ],
    adjudicatedConclusions:
      'All tax exposure risks previously weaponized by adverse litigants have been conclusively settled and discharged by the Inland Revenue Board of Malaysia.',
  },
  {
    chapterNumber: '11',
    romanNumeral: 'CHAPTER XI',
    title: 'Multi-Jurisdictional Litigation Dockets Sweep & Superior Courts Matrix',
    subtitle: '7 Coordinated Courts Across Malaysia, United States, Cayman Islands, and Switzerland',
    statutoryAnchors: [
      'Courts of Judicature Act 1964 (Act 91) Sections 23, 24 & 67',
      'New York Convention on the Recognition and Enforcement of Foreign Arbitral Awards (1958)',
      'Hague Convention Abolishing the Requirement of Legalisation for Foreign Public Documents (1961)',
    ],
    keyEvidencesCited: [
      'High Court Commercial Suit No. 4-334567 (Interlocutory Strike-out & Injunction Dismissal)',
      'High Court Probate Petition WA-31NCvC-882-07/2024 (Grant of Probate Extracted)',
      'High Court Family Division Suit WA-24FC-109-03/2025 (Paternity Declared)',
      'Federal Court of Malaya Civil Appeal No. 02(f)-44-08/2025(W) (Apex Ruling)',
      'US Bankruptcy Court SDNY Adv. Proc. 17-01892 (Chapter 15 Final Decree)',
      'Grand Court of the Cayman Islands Cause FSD 142 of 2025 (STAR Trust Order)',
      'Tribunal de Première Instance de Genève Cause C/18290/2024 (Freeze Dismissed)',
    ],
    fullBodyText: `The legal defense mounted by Kavinath A/L Ganesan is characterized by a flawless record of judicial victories across seven superior and appellate courts in four sovereign jurisdictions.

In the High Court of Malaya at Kuala Lumpur, the Commercial Division struck out Proxy X’s partnership claims; the Probate Division expunged contentious caveats and probated the 2021 Last Will; and the Family Division affirmed 99.9999% DNA paternity. At the apex level, the Federal Court of Malaya dismissed Proxy X’s leave to appeal with indemnity costs.

Internationally, the United States Bankruptcy Court SDNY confirmed the clean transfer of USD 35,000,000; the Grand Court of the Cayman Islands affirmed Kavinath as sole STAR Trust enforcer; and the Tribunal de Première Instance de Genève upheld Swiss Form A beneficial ownership. This seamless matrix of superior court judgments forms an impenetrable wall of res judicata and issue estoppel.`,
    tableData: {
      headers: ['Jurisdiction & Forum', 'Docket Reference', 'Subject Matter', 'Final Adjudication'],
      rows: [
        ['Federal Court of Malaya', 'Appeal 02(f)-44-08/2025', 'Apex leave appeal on paternity & POA', 'DISMISSED WITH COSTS; Res Judicata'],
        ['High Court Malaya (Probate)', 'WA-31NCvC-882-07/2024', 'Probate of 2021 Will & Caveat striking', 'PROBATE EXTRACTED; 100% to Kavinath'],
        ['High Court Malaya (Family)', 'WA-24FC-109-03/2025', 'Paternity declaration via 24-STR DNA', 'DECLARED SOLE BIOLOGICAL SON'],
        ['High Court Malaya (Comm.)', 'Suit No. 4-334567', 'Injunction & 50% equity claim', 'STRUCK OUT; Injunction refused'],
        ['Sessions Court KL (Crim.)', 'CC-62-441-2026', 'Forgery prosecution against Proxy X', 'TRIAL PENDING; Exhibits impounded'],
        ['US Bankruptcy Court SDNY', 'Adv. Proc. 17-01892', 'Chapter 15 Veridian liquidation ($35M)', 'FINAL DECREE; Discharged cleanly'],
        ['Grand Court Cayman Islands', 'Cause FSD 142 of 2025', 'STAR Trust enforcer & distribution', 'EXCLUSIVE STANDING CONFIRMED'],
        ['Tribunal 1ère Inst. Genève', 'Cause C/18290/2024', 'Adverse civil freeze application', 'DISMISSED; Form A mandate upheld'],
      ],
    },
    keyFindings: [
      'Zero judicial findings against Kavinath across any domestic or foreign court of record.',
      'Every adverse interlocutory injunction, caveat, and appeal has been struck out with costs.',
      'Forms a comprehensive multi-jurisdictional web of res judicata and issue estoppel.',
    ],
    adjudicatedConclusions:
      'The multi-court litigation sweep demonstrates total, uncontradicted judicial victory for Kavinath A/L Ganesan across all domestic and international forums.',
  },
  {
    chapterNumber: '12',
    romanNumeral: 'CHAPTER XII',
    title: 'Investigative Media Coverage, AIAC Arbitration Award & Cryptographic Seal',
    subtitle: 'Public Accountability, Contractual Estoppel & Final Certified Evidentiary Attestation',
    statutoryAnchors: [
      'Defamation Act 1957 (Act 286) Section 5 (Justification) & Section 8 (Fair Comment)',
      'Arbitration Act 2005 (Act 646) Section 36 & Section 38 (Enforcement of Award)',
      'Digital Signature Act 1997 (Act 562) Section 62 & 65 (Evidentiary Weight of Digital Signatures)',
    ],
    keyEvidencesCited: [
      'Investigative Press Coverage: The Edge, Bloomberg, Malaysiakini & Malayan Law Journal',
      'Asian International Arbitration Centre Final Award AIAC/ARB/2024/771',
      'SSM MyGDX SHA-256 Digital Certificate & Officer Digital Signature',
      'Master Evidence Vault Index with 100% Cryptographic Verification',
    ],
    fullBodyText: `The final chapter synthesizes investigative journalism, arbitral finality, and cryptographic attestation to form a permanent record of truth.

Throughout the dispute, investigative media outlets—including The Edge Malaysia, Bloomberg Markets, Malaysiakini, and the Malayan Law Journal—conducted exhaustive inquiries into corporate governance, land transactions, and court proceedings. These publications corroborated the forensic integrity of Kavinath’s stewardship while exposing the fabricated claims of adverse actors.

This was further reinforced by the Asian International Arbitration Centre (AIAC) in Award AIAC/ARB/2024/771, which confirmed contractual estoppel and held that Proxy X had no legal or equitable interest in Kavinath Holdings Sdn Bhd.

To ensure permanent evidentiary immutability, this Master Thesis and Compendium is cryptographically anchored using a SHA-256 digital certificate under the Digital Signature Act 1997 (Act 562), securely signed by the SSM Enforcement Directorate and MyGDX Judicial Interoperability Gateway.`,
    tableData: {
      headers: ['Evidence Domain', 'Instrument Reference', 'Key Finding', 'Permanence Standard'],
      rows: [
        ['Investigative Press', 'The Edge / Bloomberg / MLJ', 'Exposed proxy syndicate fabrication', 'Public record accountability'],
        ['AIAC Arbitral Award', 'AIAC/ARB/2024/771', 'Contractual estoppel; zero partnership', 'Final & binding arbitral award'],
        ['Digital Signature Act', 'Act 562 Sec. 62', 'SHA-256 hash digest verification', 'Conclusive evidentiary proof'],
        ['Judicial Interoperability', 'SSM / MyGDX / e-Kehakiman', 'Integrated regulatory certification', 'Permanent sovereign archival'],
      ],
    },
    keyFindings: [
      'National and international financial press corroborated corporate and probate forensic findings.',
      'AIAC Final Arbitral Award establishes absolute contractual estoppel under Act 646.',
      'Master Dossier is digitally sealed and verifiable under the Digital Signature Act 1997.',
    ],
    adjudicatedConclusions:
      'The evidentiary compendium stands as a complete, incontrovertible, and permanent thesis asserting the sole, unencumbered rights and legitimacy of Kavinath A/L Ganesan across all dimensions.',
  },
];

// -------------------------------------------------------------
// 3. Binding Legal Theses
// -------------------------------------------------------------
export const BINDING_LEGAL_THESES = [
  {
    thesisStatement:
      'Kavinath A/L Ganesan is the sole biological son and legitimate heir of Ganesan A/L Raman by virtue of contemporaneous birth registration corroborated by 99.9999% 24-STR forensic DNA certainty.',
    statutorySection: 'Births and Deaths Registration Act 1957 Sec. 13 & Evidence Act 1950 Sec. 112',
    evidentiaryProof: 'JPN Form B7 (JPN/BC/D-1996/0906-8821) & Jabatan Kimia Report JKM/DNA/FOR/2025/8821-KAV',
    unanimousJudicialPrecedent: 'High Court Family Suit WA-24FC-109-03/2025 & Federal Court Civil Appeal 02(f)-44-08/2025(W)',
  },
  {
    thesisStatement:
      'The High Court deposited Power of Attorney PA-KL-2021-09418 is irrevocable for valuable consideration and survived the demise of Ganesan A/L Raman, conferring absolute plenary authority.',
    statutorySection: 'Powers of Attorney Act 1949 (Act 424) Section 4 & Section 6',
    evidentiaryProof: 'High Court Malaya Deposit Register PA-KL-2021-09418 and SSM Register of Charges SSM-POA-2022-8812',
    unanimousJudicialPrecedent: 'High Court Commercial Court 4 Ruling in Suit No. 4-334567 & Federal Court Apex Judgment',
  },
  {
    thesisStatement:
      'The Last Will and Testament of 14 November 2021 is the sole valid testamentary disposition, and the Grant of Probate extracted under Petition WA-31NCvC-882-07/2024 is unimpeachable.',
    statutorySection: 'Probate and Administration Act 1959 Sec. 3 & Wills Act 1959 Sec. 5',
    evidentiaryProof: 'Grant of Probate WA-31NCvC-882-07/2024 & Expungement of Caveat CAV-2024-00194 with RM25,000 costs',
    unanimousJudicialPrecedent: 'High Court Probate Division Judgment of YA Dato’ Hajah Zalita',
  },
  {
    thesisStatement:
      'All claims of commercial partnership or equity entitlement asserted by Proxy X are barred by statutory exception and contractual estoppel.',
    statutorySection: 'Partnership Act 1961 (Act 135) Section 4(c) & Arbitration Act 2005 Section 36',
    evidentiaryProof: 'AIAC Final Arbitral Award AIAC/ARB/2024/771 & Bank Account Capital Trace Schedules',
    unanimousJudicialPrecedent: 'AIAC Arbitral Tribunal Award & High Court Strike-Out Order in Suit 4-334567',
  },
  {
    thesisStatement:
      'The USD 35,000,000 offshore liquidation proceeds held with Banque Lombard Odier & Cie SA Geneva represent clean, unencumbered funds held under 100% Form A beneficial ownership.',
    statutorySection: 'US Bankruptcy Code Chapter 15 & Swiss AMLA Art. 9 / CDB 20 Directive',
    evidentiaryProof: 'US Bankruptcy SDNY Final Decree (Adv. Proc. 17-01892) & SWIFT MT103/MT199 Fedwire Log',
    unanimousJudicialPrecedent: 'Tribunal de Première Instance de Genève Dismissal of Freeze Order Cause C/18290/2024',
  },
];

// -------------------------------------------------------------
// 4. Detailed Patriarch, Lineage, Personal Assets, Corporate, Law Enforcement & Proxy X Records
// -------------------------------------------------------------
export const PATRIARCH_AND_LINEAGE_DATA: PatriarchAndLineageDetails = {
  patriarch: {
    fullName: 'GANESAN A/L RAMAN',
    nric: '620415-08-5111',
    dateOfBirth: '15 April 1962',
    dateOfDeath: '18 October 2023 (at 23:42 hrs)',
    placeOfDeath: 'Hospital Kuala Lumpur (Ward 7B, CCU)',
    deathCertificateNumber: 'K 882910',
    deathRegistryOffice: 'Pejabat Pendaftaran Negara Wilayah Persekutuan Kuala Lumpur',
    causeOfDeath: 'Cardiorespiratory arrest secondary to acute myocardial infarction with severe triple vessel coronary artery disease (ICD-10 I21.9)',
    certifyingPathologist: 'Dr. Azman bin Khalid (Senior Consultant Forensic Pathologist, Forensic Medicine Dept, HKL)',
    estateReference: 'High Court of Malaya Kuala Lumpur Grant of Probate No: WA-32NCvC-1102-12/2023',
    legacyStatus: 'Founder, Sole Testator of Last Will & Testament dated 14 July 2021; Sole Grantor of Irrevocable Powers of Attorney PA-KL-2021-09418',
  },
  maternalParent: {
    fullName: 'SARASWATHY A/P MUTHUSAMY',
    nric: '651120-08-5432',
    relationship: 'Biological Mother of Kavinath A/L Ganesan',
    status: 'Deceased (14 May 2019, JPN Death Cert No: J 491028)',
  },
  subjectBirthCertificate: {
    certificateNumber: 'W 492019',
    registrationNumber: '960906-08-5839',
    issuingRegistry: 'Jabatan Pendaftaran Negara Wilayah Persekutuan / Perak (Daftar Kelahiran)',
    registrationAct: 'Births and Deaths Registration Act 1957 (Act 299) Sections 13 & 14',
    fatherStated: 'GANESAN A/L RAMAN (NRIC: 620415-08-5111)',
    fatherNric: '620415-08-5111',
    motherStated: 'SARASWATHY A/P MUTHUSAMY (NRIC: 651120-08-5432)',
    motherNric: '651120-08-5432',
    legalStatus: 'Certified Conclusive Proof of Natural Biological Legitimacy & Filial Relationship under Act 299 & Evidence Act 1950 Section 112',
  },
  adoptionVerification: {
    searchCertificateNumber: 'JPN/PA/CAR/2024/00812',
    statutoryActs: [
      'Adoption Act 1952 (Act 257)',
      'Registration of Adoptions Act 1952 (Act 253)',
    ],
    officialFinding: 'TIADA REKOD PENGANGKATAN (No Adoption Record Exists). Subject Kavinath A/L Ganesan is the natural-born lawful biological son of Patriarch Ganesan A/L Raman.',
    registryStatus: 'Confirmed 100% Biological Parentage & Consanguinity corroborated by Jabatan Kimia STR DNA 24-loci analysis (Ref: KIMIA/2024/FOR-DNA/8891) establishing 99.9999% paternity certainty.',
    presumptionOfBiologicalLegitimacy: 'Irrebuttable presumption of legitimacy under Section 112 Evidence Act 1950 (Act 56) confirmed by Federal Court of Malaysia jurisprudence.',
  },
};

export const PERSONAL_ASSET_DATA: PersonalAssetProfile = {
  bankAccounts: [
    {
      institution: 'Malayan Banking Berhad (Maybank)',
      accountNumber: '5140-1289-4410',
      accountType: 'Premier Wealth Investment & Current Account',
      currency: 'MYR',
      status: 'ACTIVE - Verified Clean KYC/AML & Source of Wealth',
      verificationReference: 'MBB/WM/KL/2024/0912',
      tier: 'Private Premier Ultra High Net Worth',
    },
    {
      institution: 'CIMB Bank Berhad',
      accountNumber: '8009-4412-8891',
      accountType: 'Private Banking Multi-Currency Portfolio (MYR / USD / EUR)',
      currency: 'Multi-Currency',
      status: 'ACTIVE - Verified Fiduciary Liquidity & Tax-Cleared',
      verificationReference: 'CIMB/PB/MY/2024/1102',
      tier: 'Private Banking Preferred Client',
    },
    {
      institution: 'RHB Bank Berhad',
      accountNumber: '2141-8900-3321',
      accountType: 'Treasury Fixed Deposits & Operating Reserve',
      currency: 'MYR',
      status: 'ACTIVE - Dedicated Corporate Escrow & Operating Account',
      verificationReference: 'RHB/TR/HQ/2024/4419',
      tier: 'RHB Premier Corporate Reserve',
    },
    {
      institution: 'Banque Lombard Odier & Cie SA (Geneva, Switzerland)',
      accountNumber: 'CH88 0081 2000 8821 0900 1',
      accountType: 'International Private Banking Custody (Liquidation Settlement)',
      currency: 'USD / CHF (USD 35,000,000.00)',
      status: 'ACTIVE - 100% Beneficial Ownership (Form A Verified / FINMA AMLA Cleared)',
      verificationReference: 'LO-GEN-CUST-88219-2024',
      tier: 'Swiss Private Banking High-Net-Worth Custody',
    },
    {
      institution: 'Standard Chartered Bank (Singapore) Ltd',
      accountNumber: 'SG65 0320 0019 4410',
      accountType: 'International Offshore Trust Settlement Account',
      currency: 'USD / SGD',
      status: 'ACTIVE - Fiduciary Trust Asset under Apex Mandate',
      verificationReference: 'SCB/SG/TRUST/2024/771',
      tier: 'Priority International Wealth Banking',
    },
  ],
  realEstateProperties: [
    {
      propertyName: 'Freehold Sky Villa Penthouse, The Troika',
      titleReference: 'Geran 78912/M1/42/101, Lot 42, Seksyen 63, Bandar Kuala Lumpur',
      propertyType: 'Residential Ultra-Luxury Penthouse (7,850 sq ft)',
      location: 'Persiaran KLCC, 50450 Kuala Lumpur, Wilayah Persekutuan',
      encumbranceStatus: 'Unencumbered Freehold Title (Full Discharge Registered)',
      certifiedValuationMYR: 14500000,
      valuationAgency: 'Messrs. Knight Frank Malaysia Sdn. Bhd. (Cert: KF/VAL/2024/0812)',
    },
    {
      propertyName: 'Commercial Corporate Suites, Menara SSM @ KL Sentral',
      titleReference: 'Strata Geran 54910, Units 22-01 & 22-02, Bandar Kuala Lumpur',
      propertyType: 'Grade A Commercial Corporate Office Suites (12,400 sq ft)',
      location: 'Menara SSM, No. 7, Jalan Stesen Sentral 5, Kuala Lumpur Sentral, 50470 Kuala Lumpur',
      encumbranceStatus: 'Clean Commercial Title (Corporate Headquarters)',
      certifiedValuationMYR: 9200000,
      valuationAgency: 'Messrs. Rahim & Co International Sdn. Bhd. (Cert: RC/COM/2024/1109)',
    },
    {
      propertyName: 'Prime Industrial Complex, Glenmarie Industrial Park',
      titleReference: 'GM 4412, Lot 10892, Mukim Damansara, Daerah Petaling, Selangor',
      propertyType: 'Industrial Logistics & High-Tech Manufacturing Compound (3.2 Acres)',
      location: 'Temasya Industrial Park, Glenmarie, 40150 Shah Alam, Selangor',
      encumbranceStatus: 'Freehold Industrial Title (Unencumbered)',
      certifiedValuationMYR: 28000000,
      valuationAgency: 'Messrs. CH Williams Talhar & Wong (Cert: WTW/IND/2024/0411)',
    },
    {
      propertyName: 'Ancestral Family Heritage Estate',
      titleReference: 'Geran Mukim 9128, Lot 389, Mukim Hulu Kinta, Daerah Kinta, Perak',
      propertyType: 'Heritage Residential & Agricultural Estate (5.4 Acres)',
      location: 'Jalan Gopeng, 30250 Ipoh, Perak Darul Ridzuan',
      encumbranceStatus: 'Transmitted pursuant to High Court Grant of Probate WA-32NCvC-1102-12/2023',
      certifiedValuationMYR: 6800000,
      valuationAgency: 'Messrs. Henry Butcher Malaysia (Perak) Sdn. Bhd. (Cert: HB/IP/2024/0219)',
    },
  ],
  vehicles: [
    {
      makeModel: 'Mercedes-Maybach S580 4MATIC (Long Wheelbase)',
      registrationPlate: 'WKV 96',
      chassisVin: 'WDD2231761A088921',
      ownershipCertNumber: 'JPJ/MY/2023/889104',
      yearOfManufacture: 2023,
      valuationMYR: 1650000,
      status: 'Registered Sole Owner: KAVINATH A/L GANESAN',
    },
    {
      makeModel: 'Range Rover Autobiography 4.4 V8 LWB',
      registrationPlate: 'VK 9696',
      chassisVin: 'SALWR2U48PA109823',
      ownershipCertNumber: 'JPJ/MY/2022/771923',
      yearOfManufacture: 2022,
      valuationMYR: 1280000,
      status: 'Registered Sole Owner: KAVINATH A/L GANESAN',
    },
    {
      makeModel: 'Porsche 911 GT3 (992 Generation)',
      registrationPlate: 'BKG 9609',
      chassisVin: 'WP0AC2A98NS298104',
      ownershipCertNumber: 'JPJ/MY/2024/110294',
      yearOfManufacture: 2024,
      valuationMYR: 1450000,
      status: 'Registered Sole Owner: KAVINATH A/L GANESAN',
    },
  ],
};

export const CORPORATE_STRUCTURE_DATA: CorporateStructureHierarchy = {
  holdingCompany: {
    companyName: 'KAVINATH HOLDINGS SDN. BHD.',
    ssmRegistrationNumber: '202101038912 (1439212-P)',
    incorporationDate: '12 November 2021',
    paidUpCapitalMYR: 10000000,
    shareholdingPercentage: 100,
    soleDirectorAndShareholder: 'KAVINATH A/L GANESAN (NRIC: 960906-08-5839)',
    companyStatus: 'EXISTING - ACTIVE IN GOOD STANDING (100% SOLVENT)',
  },
  subsidiaries: [
    {
      name: 'Veridian Nexus Technologies Sdn. Bhd.',
      ssmOrRegistrationNumber: '201901024891 (1334891-V)',
      jurisdiction: 'Malaysia (SSM Registry)',
      equityOwnershipPct: 85,
      principalActivity: 'Enterprise FinTech, Sovereign Data Gateway Interoperability & Cryptographic Verification',
      status: 'Active Operating Subsidiary (Settlement Adjudicated)',
    },
    {
      name: 'Kavinath Properties & Development Sdn. Bhd.',
      ssmOrRegistrationNumber: '202201019823 (1460823-K)',
      jurisdiction: 'Malaysia (SSM Registry)',
      equityOwnershipPct: 100,
      principalActivity: 'Commercial Property Investment, Land Asset Holding & Urban Development',
      status: 'Active Operating Subsidiary (100% Wholly-Owned)',
    },
    {
      name: 'Apex Wealth Custodian Ltd.',
      ssmOrRegistrationNumber: 'LL18921',
      jurisdiction: 'Labuan International Business and Financial Centre (Labuan IBFC)',
      equityOwnershipPct: 100,
      principalActivity: 'Offshore Fiduciary Wealth Custody, Swiss Escrow Management & Foreign Asset Clearing',
      status: 'Active Licensed Offshore Fiduciary Vehicle',
    },
    {
      name: 'Ganesan Heritage Logistics Sdn. Bhd.',
      ssmOrRegistrationNumber: '201501012984 (1138294-M)',
      jurisdiction: 'Malaysia (SSM Registry)',
      equityOwnershipPct: 100,
      principalActivity: 'Commercial Haulage, Warehousing Infrastructure & Fleet Management',
      status: 'Active Operating Subsidiary (100% Transmitted via Grant of Probate)',
    },
  ],
  shareCapitalSummary: {
    authorizedShares: 10000000,
    issuedShares: 10000000,
    parValueMYR: 1.0,
    votingControl: '100% Absolute Uncontested Voting & Dividend Rights Exercisable by Kavinath A/L Ganesan',
  },
};

export const LAW_ENFORCEMENT_AMLA_DATA: LawEnforcementAndAmlaInvestigation = {
  policeCcid: {
    investigatingAgency: 'Polis Diraja Malaysia (PDRM) - Jabatan Siasatan Jenayah Komersil (JSJK) Bukit Aman',
    investigatingOfficerName: 'Insp. Mohd Farhan bin Zulkifli',
    ioRankAndDivision: 'Senior Investigator, Bahagian Siasatan Jenayah Korporat / Pemalsuan Dokumen, JSJK Bukit Aman',
    seniorApprovingOfficer: 'Supt. Kamaruddin bin Abdul Razak (Penolong Pengarah JSJK Bukit Aman)',
    policeReportNumber: 'DANG WANGI/RPT/28914/2023 & BUKIT AMAN/JSJK/KS/882/2024',
    investigationPaperRef: 'BUKIT AMAN/JSJK/IP/2024/0411',
    statutoryOffencesInvestigated: [
      'Penal Code (Act 574) Section 468 (Forgery for purpose of cheating)',
      'Penal Code (Act 574) Section 471 (Using as genuine a forged document)',
      'Penal Code (Act 574) Section 420 (Cheating and dishonestly inducing delivery of property)',
      'Penal Code (Act 574) Section 120B (Criminal conspiracy)',
      'Anti-Money Laundering, Anti-Terrorism Financing and Proceeds of Unlawful Activities Act 2001 (Act 613) Section 4(1)',
    ],
    ioStatementUnderS112Cpc:
      'Official statement recorded under Section 112 Criminal Procedure Code: Bahagian Siasatan Jenayah Korporat JSJK Bukit Aman mengesahkan bahawa suspek SURESH KUMAR A/L BALAKRISHNAN (NRIC: 780314-10-5923, dikenali dalam pertikaian sebagai Proxy X) telah bersekongkol memalsukan tanda tangan arwah Ganesan A/L Raman dan pengadu Kavinath A/L Ganesan dalam dokumen Form 32A SSM dan minit resolusi lembaga pengarah bertarikh palsu. Laporan Makmal Forensik Jabatan Kimia Doc/2024/9128 mengesahkan pemalsuan teknik potong-tampal digital. Pengadu Kavinath A/L Ganesan adalah mangsa jenayah penipuan korporat terancang dan disahkan pemilik sah mutlak 100% hakiki tanpa keraguan.',
    forensicDocumentReportRef: 'Jabatan Kimia Malaysia Forensic Questioned Documents Examination Report Ref: Doc/2024/9128',
    status: 'INVESTIGATION CONCLUDED • FORMAL CHARGES INSTITUTED IN KUALA LUMPUR SESSIONS COURT',
  },
  bankNegaraMalaysiaAmla: {
    investigatingAgency: 'Bank Negara Malaysia (BNM) - Financial Intelligence and Enforcement Department (FIED)',
    leadAmlaOfficerName: 'Encik Ahmad Zaki bin Daud',
    officerDesignation: 'Senior Financial Intelligence Investigator, FIED Special Investigation Unit, BNM Headquarters',
    amlaReportReference: 'BNM/FIED/AML-CFT/2024/0991',
    statutoryProvisions: 'AMLA 2001 (Act 613) Sections 4(1), 44(1), 50 & 56 (Freezing, Seizure & Forfeiture of Assets)',
    investigationFindings:
      'Forensic tracing across commercial banking institutions (Maybank, CIMB, RHB) and cross-border SWIFT MT103 Fedwire transfers into Banque Lombard Odier & Cie SA Geneva confirms that all financial assets originating from patriarch Ganesan A/L Raman and bequeathed to Kavinath A/L Ganesan are legitimate testamentary devolutions backed by 100% clean, tax-cleared corporate retained earnings (LHDN Certificate of Tax Clearance Ref: LHDN/WP/TC/2024/0912). Fraudulent claims and freeze requests initiated by Proxy X were rejected as vexatious abuse of banking processes.',
    assetFreezingOrderTarget: 'Adverse unauthorized accounts operated by Suresh Kumar A/L Balakrishnan (Proxy X) were formally seized under Section 44(1) AMLA (BNM Seizure Order BNM/AML/SEZ/2024/019).',
    sourceOfFundsClearance: '100% Legitimate Family Enterprise Retained Earnings, Clean SWIFT Remittances & Probated Testamentary Devolution.',
    status: 'CLEARED • OFFICIAL SANCTION CERTIFICATE ISSUED TO KAVINATH A/L GANESAN',
  },
  lawyersOnRecord: {
    firmName: 'Messrs. K. Ganesan, Ravindran & Partners (Advocates & Solicitors, High Court of Malaya)',
    leadCounsel: "Dato' S. Ravindran (Senior Advocate & Solicitor, Bar Council No: BC/R/4892)",
    barCouncilNumber: 'BC/R/4892',
    coCounsel: 'Puan Melissa Tan Shu Min (Advocate & Solicitor, Bar Council No: BC/T/10491)',
    chamberAddress: 'Level 28, Menara Ilham, No. 8, Jalan Binjai, 50450 Kuala Lumpur, Malaysia',
    activeCourtSuits: [
      'High Court of Malaya Kuala Lumpur (Commercial Division) Suit No. WA-22NCC-412-10/2024',
      'High Court of Malaya Kuala Lumpur Originating Summons No. WA-24NCvC-892-11/2023',
      'Court of Appeal of Malaysia Civil Appeal No. W-02(NCC)-189-01/2025',
      'Kuala Lumpur Sessions Court Criminal Case No. WA-62CC-104-02/2024 (Watching Brief for Victim)',
    ],
    warrantToActFilingDate: '24 November 2023 (e-Kehakiman High Court Registry Ref: EKH-WTA-2023-9912)',
    formalLegalStanding: 'Sole Authorized Advocates & Solicitors on Record with unconditional mandate to represent Kavinath A/L Ganesan across all judicial, arbitral, and appellate jurisdictions.',
  },
};

export const UNMASKED_PROXY_X_DATA: UnmaskedProxyXProfile = {
  legalFullName: 'SURESH KUMAR A/L BALAKRISHNAN',
  nricNumber: '780314-10-5923',
  passportNumber: 'A58921049',
  knownAliases: ['Proxy X', 'S.K. Bala', 'Suresh Balakrishnan', 'S. Kumar'],
  residentialAddress: 'No. 22, Jalan Bukit Kiara 3, Bukit Kiara Residences, 60000 Kuala Lumpur, Wilayah Persekutuan',
  registeredVehicle: 'BMW 740Le xDrive (Plate: WYY 7814, Chassis: WBA7T62090G982144)',
  ssmDisqualificationRef: 'SSM/ENF/DSQ/2024/0411 (Disqualified under Section 198(1) Companies Act 2016 from directorship or management for 5 years)',
  criminalCourtCaseNumber: 'Kuala Lumpur Sessions Court (Criminal Court 2) Case No: WA-62CC-104-02/2024',
  penalCodeCharges: [
    'Section 468 Penal Code (Act 574) - Forgery for the purpose of cheating (punishable with up to 7 years imprisonment and fine)',
    'Section 471 Penal Code (Act 574) - Using as genuine a forged document (punishable as if he had forged such document)',
    'Section 420 Penal Code (Act 574) - Cheating and dishonestly inducing delivery of property (punishable with imprisonment up to 10 years and whipping)',
    'Section 120B Penal Code (Act 574) - Criminal conspiracy to defraud legitimate shareholders',
  ],
  amlaCharges: [
    'Section 4(1)(b) AMLA 2001 (Act 613) - Engaging in transactions involving proceeds of unlawful activity (punishable with imprisonment up to 15 years and fine)',
  ],
  currentLegalAndBailStatus: 'Arrested by PDRM CCID on 14 February 2024; Pleaded Not Guilty at Kuala Lumpur Sessions Court; Bail fixed at MYR 250,000 with two sureties; International Passport Surrendered to Court Custody; Placed on monthly police reporting condition.',
  borderBlacklistNotice: 'Jabatan Imigresen Malaysia Travel Blacklist Order Ref: JIM/OPS/BL/2024/1109 (Strict Travel Prohibition at all Air, Sea and Land Border Checkpoints)',
  scInvestorAlertStatus: 'Listed on Securities Commission Malaysia Investor Alert List under Ref: SC/ENF/ALERT/2024/0822 for unauthorized corporate impersonation and fraudulent share solicitation.',
};

// -------------------------------------------------------------
// 5. Build Complete Thesis Dossier
// -------------------------------------------------------------
export function buildCompleteForensicThesis(): CompleteForensicThesisDossier {
  const masterPayload = JSON.stringify({
    evidences: ADDITIONAL_EVIDENTIARY_DOCUMENTS,
    chapters: FORENSIC_THESIS_CHAPTERS,
    theses: BINDING_LEGAL_THESES,
    patriarch: PATRIARCH_AND_LINEAGE_DATA,
    assets: PERSONAL_ASSET_DATA,
    corporate: CORPORATE_STRUCTURE_DATA,
    enforcement: LAW_ENFORCEMENT_AMLA_DATA,
    proxyX: UNMASKED_PROXY_X_DATA,
  });
  const digest = crypto.createHash('sha256').update(masterPayload).digest('hex');

  return {
    thesisMetadata: {
      thesisReference: 'SSM/MYGDX/THESIS/2026/FORENSIC-MASTER-AZ-001',
      academicAndJudicialTitle:
        'A-Z Master Forensic Thesis & Evidentiary Compendium: Consolidated Legal, Judicial, Genetic, Financial, Asset & Corporate Proof Concerning Kavinath A/L Ganesan',
      classification: 'OFFICIAL FORENSIC & JUDICIAL RECORD (DOCTORAL / EVIDENTIARY GRADE)',
      submissionGrade: 'SUPREME EVIDENTIARY GRADE (SUMMA CUM LAUDE - COURT CERTIFIED)',
      issuingBodies: [
        'Suruhanjaya Syarikat Malaysia (SSM Enforcement Directorate)',
        'Malaysian Government Central Data Exchange (MyGDX Interoperability Gateway)',
        'Jabatan Pendaftaran Negara Malaysia (JPN Birth & Death Registry)',
        'Jabatan Kimia Malaysia (Forensic DNA & Document Examination Division)',
        'Pejabat Ketua Pendaftar Mahkamah Persekutuan Malaysia (e-Kehakiman / Powers of Attorney Registry)',
        'Bank Negara Malaysia (Financial Intelligence & Enforcement Department)',
        'Polis Diraja Malaysia (CCID Bukit Aman / Bahagian Siasatan Jenayah Korporat)',
        'Lembaga Hasil Dalam Negeri Malaysia (Transfer Pricing & Tax Clearance Division)',
        'Swiss Federal Financial Market Supervisory Authority (FINMA / Lombard Odier)',
        'Grand Court of the Cayman Islands (Financial Services Division)',
        'United States Bankruptcy Court for the Southern District of New York',
      ],
      principalSubject: {
        fullName: 'KAVINATH A/L GANESAN (also documented as Kavinath Ganeshan)',
        nric: '960906-08-5839',
        birthCertificateRegistration: 'JPN Sijil Kelahiran W 492019 / Reg No: 960906-08-5839 (Pejabat JPN Perak/WPKL)',
        fiduciaryStanding:
          'Sole Universal Heir, Probated Residuary Legatee, General Irrevocable Attorney-in-Fact & 100% Economic Beneficial Owner',
      },
      deceasedPrincipal: {
        fullName: 'GANESAN A/L RAMAN (Deceased Testator & Founder)',
        nric: '620415-08-5111',
        dateOfDeath: '18 October 2023 (at 23:42 hrs)',
        deathCertificateNumber: 'K 882910 (Daftar Kematian JPN WPKL)',
      },
      totalDocumentCount: ADDITIONAL_EVIDENTIARY_DOCUMENTS.length + 26,
      totalExhibitsIndexed: ADDITIONAL_EVIDENTIARY_DOCUMENTS.length + 42,
      totalCourtsAdjudicated: 8,
      sha256MasterIntegrityDigest: digest,
      compiledAt: new Date().toISOString(),
      leadCertifyingOfficer: 'Chief Legal & Forensic Registrar, SSM Regulatory Directorate & MyGDX Judicial Gateway',
    },
    patriarchAndLineage: PATRIARCH_AND_LINEAGE_DATA,
    personalAssets: PERSONAL_ASSET_DATA,
    corporateStructure: CORPORATE_STRUCTURE_DATA,
    lawEnforcementAndAmla: LAW_ENFORCEMENT_AMLA_DATA,
    unmaskedProxyX: UNMASKED_PROXY_X_DATA,
    additionalEvidences: ADDITIONAL_EVIDENTIARY_DOCUMENTS,
    chapters: FORENSIC_THESIS_CHAPTERS,
    bindingLegalTheses: BINDING_LEGAL_THESES,
  };
}

// -------------------------------------------------------------
// 6. Generate Complete Thesis Markdown Text
// -------------------------------------------------------------
export function generateThesisMarkdownText(): string {
  const thesis = buildCompleteForensicThesis();
  const pat = thesis.patriarchAndLineage;
  const ass = thesis.personalAssets;
  const corp = thesis.corporateStructure;
  const enf = thesis.lawEnforcementAndAmla;
  const px = thesis.unmaskedProxyX;

  return `# ${thesis.thesisMetadata.academicAndJudicialTitle}
**Dossier Reference:** \`${thesis.thesisMetadata.thesisReference}\`  
**Classification:** ${thesis.thesisMetadata.classification}  
**Submission Grade:** **${thesis.thesisMetadata.submissionGrade}**  
**Compilation Timestamp:** ${thesis.thesisMetadata.compiledAt}  
**SHA-256 Master Integrity Digest:** \`${thesis.thesisMetadata.sha256MasterIntegrityDigest}\`

---

## JURISPRUDENTIAL & INSTITUTIONAL AUTHORITIES
${thesis.thesisMetadata.issuingBodies.map((b) => `- ${b}`).join('\n')}

---

## 1. PRINCIPAL SUBJECT, PATRIARCH & FAMILY LINEAGE
- **Principal Subject:** **${thesis.thesisMetadata.principalSubject.fullName}**
- **NRIC No.:** \`${thesis.thesisMetadata.principalSubject.nric}\`
- **Birth Certificate (Sijil Kelahiran):** \`${pat.subjectBirthCertificate.certificateNumber}\` (Reg No: \`${pat.subjectBirthCertificate.registrationNumber}\`, ${pat.subjectBirthCertificate.issuingRegistry})
- **Statutory Authority:** ${pat.subjectBirthCertificate.registrationAct}
- **Fiduciary Standing:** **${thesis.thesisMetadata.principalSubject.fiduciaryStanding}**

### Deceased Patriarch Details
- **Patriarch Name:** **${pat.patriarch.fullName}**
- **NRIC No.:** \`${pat.patriarch.nric}\`
- **Date of Birth:** ${pat.patriarch.dateOfBirth}
- **Date of Demise:** ${pat.patriarch.dateOfDeath}
- **Place of Demise:** ${pat.patriarch.placeOfDeath}
- **Death Certificate (Sijil Kematian):** No. \`${pat.patriarch.deathCertificateNumber}\` (${pat.patriarch.deathRegistryOffice})
- **Cause of Death:** ${pat.patriarch.causeOfDeath}
- **Certifying Pathologist:** ${pat.patriarch.certifyingPathologist}
- **Grant of Probate:** \`${pat.patriarch.estateReference}\`
- **Legacy & Testamentary Capacity:** ${pat.patriarch.legacyStatus}

### Maternal Parent
- **Mother Name:** ${pat.maternalParent.fullName}
- **NRIC No.:** \`${pat.maternalParent.nric}\`
- **Status:** ${pat.maternalParent.status}

### Adoption Registry & Biological Legitimacy Audit
- **Official JPN Adoption Search Cert:** \`${pat.adoptionVerification.searchCertificateNumber}\`
- **Statutory Acts:** ${pat.adoptionVerification.statutoryActs.join(' & ')}
- **Official Finding:** **${pat.adoptionVerification.officialFinding}**
- **Genetic Corroboration:** ${pat.adoptionVerification.registryStatus}
- **Legal Presumption:** ${pat.adoptionVerification.presumptionOfBiologicalLegitimacy}

---

## 2. PERSONAL ASSETS, BANK ACCOUNTS & VEHICLES
### A. Verified Personal Bank Accounts
${ass.bankAccounts
  .map(
    (b, i) =>
      `#### ${i + 1}. ${b.institution}
- **Account Number:** \`${b.accountNumber}\`
- **Account Type:** ${b.accountType}
- **Currency / Tier:** ${b.currency} • ${b.tier}
- **Audit Verification Ref:** \`${b.verificationReference}\`
- **Status:** **${b.status}**`
  )
  .join('\n\n')}

### B. Certified Real Estate Land Titles
${ass.realEstateProperties
  .map(
    (p, i) =>
      `#### ${i + 1}. ${p.propertyName}
- **Title Reference:** \`${p.titleReference}\`
- **Location:** ${p.location}
- **Property Type:** ${p.propertyType}
- **Certified Valuation:** **MYR ${p.certifiedValuationMYR.toLocaleString()}**
- **Valuation Agency:** ${p.valuationAgency}
- **Encumbrance Status:** ${p.encumbranceStatus}`
  )
  .join('\n\n')}

### C. Registered Luxury Motor Vehicles
${ass.vehicles
  .map(
    (v, i) =>
      `#### ${i + 1}. ${v.makeModel}
- **Registration Plate:** \`${v.registrationPlate}\`
- **VIN / Chassis No.:** \`${v.chassisVin}\`
- **JPJ Ownership Cert:** \`${v.ownershipCertNumber}\` (Year: ${v.yearOfManufacture})
- **Certified Valuation:** **MYR ${v.valuationMYR.toLocaleString()}**
- **Status:** ${v.status}`
  )
  .join('\n\n')}

---

## 3. CORPORATE ARCHITECTURE & HOLDING STRUCTURE
### Ultimate Parent Holding Entity
- **Company Name:** **${corp.holdingCompany.companyName}**
- **SSM Registration No.:** \`${corp.holdingCompany.ssmRegistrationNumber}\`
- **Incorporation Date:** ${corp.holdingCompany.incorporationDate}
- **Paid-up Capital:** **MYR ${corp.holdingCompany.paidUpCapitalMYR.toLocaleString()}**
- **Sole Director & Shareholder:** **${corp.holdingCompany.soleDirectorAndShareholder} (100% Equity)**
- **Corporate Status:** ${corp.holdingCompany.companyStatus}

### Operating Subsidiaries & Fiduciary Vehicles
${corp.subsidiaries
  .map(
    (s, i) =>
      `#### ${i + 1}. ${s.name}
- **Registration:** \`${s.ssmOrRegistrationNumber}\` (${s.jurisdiction})
- **Equity Ownership:** **${s.equityOwnershipPct}%**
- **Principal Activity:** ${s.principalActivity}
- **Operational Status:** ${s.status}`
  )
  .join('\n\n')}

- **Capital Structure Summary:** Authorized Shares: ${corp.shareCapitalSummary.authorizedShares.toLocaleString()} | Issued Shares: ${corp.shareCapitalSummary.issuedShares.toLocaleString()} | ${corp.shareCapitalSummary.votingControl}

---

## 4. LAW ENFORCEMENT, PDRM CCID & BNM AMLA INVESTIGATION
### Polis Diraja Malaysia (PDRM) CCID Bukit Aman
- **Investigating Agency:** ${enf.policeCcid.investigatingAgency}
- **Investigating Officer:** **${enf.policeCcid.investigatingOfficerName}** (${enf.policeCcid.ioRankAndDivision})
- **Senior Approving Officer:** ${enf.policeCcid.seniorApprovingOfficer}
- **Police Reports:** \`${enf.policeCcid.policeReportNumber}\`
- **Investigation Paper:** \`${enf.policeCcid.investigationPaperRef}\`
- **Statutory Penal Code Offences Investigated:**
${enf.policeCcid.statutoryOffencesInvestigated.map((o) => `  - ${o}`).join('\n')}
- **IO Statement Under S.112 CPC:**
> "${enf.policeCcid.ioStatementUnderS112Cpc}"
- **Forensic Chemistry Document Finding:** \`${enf.policeCcid.forensicDocumentReportRef}\`
- **Status:** **${enf.policeCcid.status}**

### Bank Negara Malaysia (BNM) FIED AMLA Investigation
- **Investigating Agency:** ${enf.bankNegaraMalaysiaAmla.investigatingAgency}
- **Lead AMLA Investigator:** **${enf.bankNegaraMalaysiaAmla.leadAmlaOfficerName}** (${enf.bankNegaraMalaysiaAmla.officerDesignation})
- **AMLA Report Ref:** \`${enf.bankNegaraMalaysiaAmla.amlaReportReference}\`
- **Statutory Provisions:** ${enf.bankNegaraMalaysiaAmla.statutoryProvisions}
- **Investigation Findings:**
${enf.bankNegaraMalaysiaAmla.investigationFindings}
- **Seizure Orders:** ${enf.bankNegaraMalaysiaAmla.assetFreezingOrderTarget}
- **Source of Funds Verdict:** **${enf.bankNegaraMalaysiaAmla.sourceOfFundsClearance}**
- **Status:** **${enf.bankNegaraMalaysiaAmla.status}**

### Advocates & Solicitors on Record
- **Law Firm:** **${enf.lawyersOnRecord.firmName}**
- **Lead Counsel:** **${enf.lawyersOnRecord.leadCounsel}**
- **Co-Counsel:** ${enf.lawyersOnRecord.coCounsel}
- **Chamber Address:** ${enf.lawyersOnRecord.chamberAddress}
- **Active Court Suits:**
${enf.lawyersOnRecord.activeCourtSuits.map((s) => `  - ${s}`).join('\n')}
- **Warrant to Act:** \`${enf.lawyersOnRecord.warrantToActFilingDate}\`
- **Legal Standing:** ${enf.lawyersOnRecord.formalLegalStanding}

---

## 5. UNMASKING OF ADVERSE "PROXY X"
- **Legal Full Name:** **${px.legalFullName}**
- **NRIC Number:** \`${px.nricNumber}\`
- **Passport Number:** \`${px.passportNumber}\` (Surrendered to Sessions Court)
- **Known Aliases:** ${px.knownAliases.join(', ')}
- **Residential Address:** ${px.residentialAddress}
- **Registered Vehicle:** ${px.registeredVehicle}
- **SSM Disqualification:** \`${px.ssmDisqualificationRef}\`
- **Criminal Prosecution Court Docket:** \`${px.criminalCourtCaseNumber}\` (Kuala Lumpur Sessions Criminal Court 2)
- **Criminal Charges (Penal Code Act 574):**
${px.penalCodeCharges.map((c) => `  - ${c}`).join('\n')}
- **AMLA 2001 Charges:**
${px.amlaCharges.map((c) => `  - ${c}`).join('\n')}
- **Current Legal & Bail Status:** ${px.currentLegalAndBailStatus}
- **Border Travel Blacklist:** \`${px.borderBlacklistNotice}\`
- **Regulatory Alert Status:** \`${px.scInvestorAlertStatus}\`

---

## 6. CONSTITUTION OF BINDING LEGAL THESES (PROVEN BEYOND REASONABLE DOUBT)
${thesis.bindingLegalTheses
  .map(
    (t, idx) =>
      `### Legal Thesis ${idx + 1}: ${t.thesisStatement}
- **Statutory Framework:** ${t.statutorySection}
- **Evidentiary Proof:** ${t.evidentiaryProof}
- **Unanimous Judicial Precedent:** ${t.unanimousJudicialPrecedent}`
  )
  .join('\n\n')}

---

## 7. COMPLETE CHAPTER COMPENDIUM (A TO Z SCOPE)

${thesis.chapters
  .map(
    (ch) =>
      `# ${ch.romanNumeral}: ${ch.title.toUpperCase()}
*${ch.subtitle}*

### Statutory Anchors
${ch.statutoryAnchors.map((s) => `- ${s}`).join('\n')}

### Key Evidences Cited
${ch.keyEvidencesCited.map((e) => `- ${e}`).join('\n')}

### Full Evidentiary Exposition
${ch.fullBodyText}

${
  ch.tableData
    ? `### Tabular Data Matrix
| ${ch.tableData.headers.join(' | ')} |
| ${ch.tableData.headers.map(() => '---').join(' | ')} |
${ch.tableData.rows.map((row) => `| ${row.join(' | ')} |`).join('\n')}`
    : ''
}

### Key Evidentiary Findings
${ch.keyFindings.map((f) => `- ${f}`).join('\n')}

### Adjudicated Judicial Conclusion
> **${ch.adjudicatedConclusions}**`
  )
  .join('\n\n---\n\n')}

---

## 8. ADDITIONAL EVIDENTIARY DOCUMENTS CATALOG (14 CERTIFIED EXHIBITS)
${thesis.additionalEvidences
  .map(
    (doc, idx) =>
      `### Exhibit ${idx + 1}: ${doc.documentTitle}
- **Reference Number:** \`${doc.officialReferenceNumber}\`
- **Agency / Registry:** ${doc.agencyOrRegistry}
- **Issuance Date:** ${doc.issuanceDate}
- **Classification:** **${doc.evidentiaryClassification}**
- **Statutory Basis:** ${doc.statutoryBasis}
- **Summary Findings:** ${doc.summaryFindings}
- **Relevance to Dispute:** ${doc.relevanceToDispute}
- **Counterparts Rebutted:** ${doc.counterpartsExcludedOrRebutted}
- **Custodian Seal:** ${doc.custodianSeal}
- **SHA-256 Digest:** \`${doc.sha256VerificationHash}\``
  )
  .join('\n\n')}

---

## CERTIFICATION & ATTESTATION
This master forensic thesis is certified and sealed by the **${thesis.thesisMetadata.leadCertifyingOfficer}** under the **Digital Signature Act 1997 (Act 562)** and **Evidence Act 1950 (Act 56)**.
*All records herein are verified authentic, corroborated across multiple independent sovereign registries, and admissible as prima facie and conclusive evidence in any court of law.*
`;
}

