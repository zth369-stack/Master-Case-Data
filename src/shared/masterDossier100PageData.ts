/**
 * Supreme Forensic Master Dossier — 100-Page Unredacted Dataset & Structured Knowledge Base
 * Covering 14 Core Sections, Front Matter, Appendices, 24-Loci STR DNA,
 * AUTOCORR-2026-001 to 014, USD 35M Swiss Financial Tracing, Adverse Proxy X Indictments,
 * Statutory Framework, Case Law, and Prioritized Action Checklist.
 */

export interface TocItem {
  page: number;
  section: string;
  title: string;
  subtopics: string[];
}

export interface DnaLocus {
  locus: string;
  subjectAlleles: string;
  paternalAlleles: string;
  matchStatus: 'FULL_CONCORDANCE' | 'OBLIGATORY_MATCH';
  paternityIndex: number;
}

export interface AutoCorrEntry {
  id: string; // e.g. 'AUTOCORR-2026-001'
  title: string;
  date: string;
  severity: 'CRITICAL_LEGAL' | 'HIGH_RECORD' | 'SYSTEM_RECONCILIATION';
  triggerDocument: string;
  originalAnomaly: string;
  rectificationApplied: string;
  legalImpact: string;
  evidentiaryHash: string;
}

export interface CaseLawCitation {
  citation: string;
  court: string;
  year: number;
  principle: string;
  applicationToSubject: string;
}

export interface ActionChecklistItem {
  priority: 'IMMEDIATE_48H' | 'HIGH_7_DAYS' | 'PROCEDURAL_30_DAYS';
  phase: string;
  action: string;
  statutoryBasis: string;
  responsibleParty: string;
  targetOutcome: string;
}

export const DOSSIER_100_TOC: TocItem[] = [
  // Front Matter
  { page: 1, section: 'Front Matter', title: 'Formal High Court Cover Page & Judicial Seals', subtopics: ['Jurisdiction & Suit No.', 'Subject Bio & Identifiers', 'Sealed Sovereign Crest'] },
  { page: 2, section: 'Front Matter', title: 'Document Control, Distribution & Confidentiality Notice', subtopics: ['Fiduciary Classification', 'Document Control Matrix', 'Strict Non-Disclosure Warning'] },
  { page: 3, section: 'Front Matter', title: 'Master Table of Contents (Pages 1 to 100)', subtopics: ['14 Master Sections', 'Sub-Topic Categorization', 'Evidentiary Navigation Index'] },
  { page: 4, section: 'Front Matter', title: 'List of Exhibits (Part I: Exhibits KG-001 to KG-050)', subtopics: ['Civil Identity Exhibits', 'Geneva Settlement Instruments', 'SSM Corporate Filings'] },
  { page: 5, section: 'Front Matter', title: 'List of Exhibits (Part II: KG-051 to KG-105) & Abbreviations', subtopics: ['CCID AMLA Exhibits', 'Section 90A Cyber Logs', 'Glossary of Statutory Acronyms'] },
  { page: 6, section: 'Front Matter', title: 'Foreword, Scope Note & Statutory Jurisdiction', subtopics: ['Terms of Reference', 'Limits of Forensic Inquiry', 'Act 56 Mandatory Guidelines'] },

  // Section 1: Executive Summary
  { page: 7, section: 'Section 1', title: 'Executive Summary: Core Factual Findings', subtopics: ['2017 Geneva Veridian Settlement', 'USD 35M Escrow Facility', 'Biological Paternity Verification'] },
  { page: 8, section: 'Section 1', title: 'Key Documentary Themes & Inter-Agency Concordance', subtopics: ['Triangulated Identity Proof', 'SSM Corporate Integrity', 'Cross-Border AMLA Blacklisting'] },
  { page: 9, section: 'Section 1', title: 'Summary of Legal Implications & Adverse Claim Nullity', subtopics: ['Section 4(c) Partnership Act Bar', 'Criminal Forgery of Proxy Power of Attorney', 'Expungement of Adverse Filings'] },
  { page: 10, section: 'Section 1', title: 'Summary of Conclusive Forensic Conclusions & Reliefs Sought', subtopics: ['Conclusive Title Vesting', 'Judicial Decrees Sought', 'Summary of Immediate Remedies'] },

  // Section 2: Methodology & Evidentiary Standards
  { page: 11, section: 'Section 2', title: 'Forensic Methodology & High-Assurance Architecture', subtopics: ['Multi-Agency Ingestion', 'Deterministic Hashing Engine', 'Triangulation Protocol'] },
  { page: 12, section: 'Section 2', title: 'Catalog of Reviewed Documents & Institutional Repositories', subtopics: ['Primary Sovereign Registries', 'Swiss Banking Escrows', 'High Court Judicial Dockets'] },
  { page: 13, section: 'Section 2', title: 'Evidentiary Standards: Evidence Act 1950 S.3, S.45 & S.90A', subtopics: ['Proof Beyond Reasonable Doubt', 'Civil Standard of Probability', 'Section 90A Computer Output'] },
  { page: 14, section: 'Section 2', title: 'Chain of Custody & Cryptographic Verification Protocol', subtopics: ['SHA-256 Hashing Pipeline', 'Hardware Security Modules', 'FIPS 140-2 Level 3 Root Keys'] },
  { page: 15, section: 'Section 2', title: 'Analytical Assumptions & Rebuttal of Negative Inferences', subtopics: ['Adverse Nominee Absence', 'Non-Repudiation Architecture', 'Burden of Proof Inversion'] },

  // Section 3: Subject Identity and Lineage
  { page: 16, section: 'Section 3', title: 'Subject Identity Overview: Kavinath A/L Ganesan', subtopics: ['Full Biometric Profile', 'NRIC 960219-10-xxxx Verification', 'Sovereign Civil Registration'] },
  { page: 17, section: 'Section 3', title: 'Civil Registry Provenance: JPN Form B7 Birth Certificate', subtopics: ['Registration KL-1996-0219-96369', 'Certified True Copy Stamps', 'Act 299 Statutory Presumption'] },
  { page: 18, section: 'Section 3', title: 'Lineage Narrative: Patriarch Ganesan A/L Muthusamy', subtopics: ['Patriarchal Estate Foundation', 'Testamentary Intentions', 'Beneficial Succession Trust'] },
  { page: 19, section: 'Section 3', title: 'Parentage & Consanguinity Documentation', subtopics: ['Hospital Birth Records', 'Maternal Verification', 'Paternal Acknowledgment Instruments'] },
  { page: 20, section: 'Section 3', title: 'Sovereign Family Tree & Lineage Hierarchy Diagram', subtopics: ['Direct Paternal Descent', 'Collateral Branches', 'Absence of Competing Lawful Heirs'] },
  { page: 21, section: 'Section 3', title: 'Family Tree Notes & Documentary Cross-References', subtopics: ['Witness Confirmations', 'Arkib Negara Historical Deeds', 'Consanguinity Confirmation'] },
  { page: 22, section: 'Section 3', title: 'Statutory Heirship Analysis: Distribution Act 1958 S.6', subtopics: ['Intestate Succession Hierarchy', 'Sole Issue Entitlement', 'Statutory Exclusion of Non-Heirs'] },
  { page: 23, section: 'Section 3', title: 'Rebuttal of Collateral Adverse Succession Claims', subtopics: ['Nominee Incapacity to Inherit', 'Doctrine of Beneficial Ownership', 'Statutory Estoppel'] },
  { page: 24, section: 'Section 3', title: 'Multi-Agency Identity Corroboration Matrix (12 Databases)', subtopics: ['JPN, JPJ, SSM, LHDN, BNM', 'Immigration MyIMMs Gateway', 'Bar Council Registry Extract'] },
  { page: 25, section: 'Section 3', title: 'Cross-Document Concordance & Biometric Verification Seal', subtopics: ['Facial Biometrics Match', 'Thumbprint Minutiae Matching', 'Unbroken Provenance Seal'] },

  // Section 4: DNA / STR Analysis
  { page: 26, section: 'Section 4', title: 'Forensic DNA Evidence Overview: Jabatan Kimia Malaysia', subtopics: ['Forensic Science Division Audit', 'Accredited Laboratory Protocol', 'Genetic Identity Certification'] },
  { page: 27, section: 'Section 4', title: 'Sample Provenance, Preservation & Chain of Custody', subtopics: ['Reference Sample Sealed Tubes', 'Custody Log KIMIA/DNA/2024/KL-9812', 'Cold Chain Verification'] },
  { page: 28, section: 'Section 4', title: 'Complete 24-Loci STR Profiling Table (Loci 1 to 12)', subtopics: ['D3S1358, vWA, D16S539, CSF1PO', 'TPOX, D8S1179, D21S11, D18S51', 'D2S441, D19S433, TH01, FGA'] },
  { page: 29, section: 'Section 4', title: 'Complete 24-Loci STR Profiling Table (Loci 13 to 24)', subtopics: ['D22S1045, D5S818, D13S317, D7S820', 'SE33, D10S1248, D1S1656, D12S391', 'D2S1338, Penta E, Penta D, Amelogenin'] },
  { page: 30, section: 'Section 4', title: 'Technical Interpretation: Paternity Index & Likelihood Ratio', subtopics: ['Locus-Specific Likelihood Ratios', 'Combined Paternity Index (CPI)', 'Frequency Data Asian Sub-Populations'] },
  { page: 31, section: 'Section 4', title: 'Statistical Probability of Paternity: 99.99998%', subtopics: ['Prior Probability Assumptions', 'W-Value Calculation', 'Zero Exclusionary Allelic Mismatches'] },
  { page: 32, section: 'Section 4', title: 'Comparison Matrix: Subject vs Adverse Claimant Assertions', subtopics: ['Biological Exclusion of Nominee', 'Mathematical Impossibility', 'Genetic Singularity of Subject'] },
  { page: 33, section: 'Section 4', title: 'Concordance Analysis & Random Match Probability', subtopics: ['RMP < 1 in 4.7 x 10^18', 'Hardy-Weinberg Equilibrium', 'Unchallenged Laboratory Credentials'] },
  { page: 34, section: 'Section 4', title: 'Statutory Weight: Evidence Act 1950 S.45 & S.112', subtopics: ['Expert Witness Admissibility', 'Conclusive Presumption of Legitimacy', 'Federal Court Binding Precedents'] },
  { page: 35, section: 'Section 4', title: 'DNA Expert Witness Attestation & Judicial Certificate', subtopics: ['Senior Government Chemist Seal', 'Formal Court Oath Statement', 'Conclusive Biological Decree'] },

  // Section 5: Auto-Rectification Log
  { page: 36, section: 'Section 5', title: 'Auto-Rectification Engine: Architecture & Reconciliation', subtopics: ['Automated Discrepancy Parsing', 'Fuzzy Match Remediation', 'Immutable Audit Trails'] },
  { page: 37, section: 'Section 5', title: 'Reconciliation Workflow, Ingestion Triggers & Proofs', subtopics: ['Document Anomaly Detection', 'Biometric Normalization', 'Cryptographic State Locking'] },
  { page: 38, section: 'Section 5', title: 'AUTOCORR-2026-001 & AUTOCORR-2026-002 Detailed Logs', subtopics: ['NRIC Typography Normalization', 'Geneva Deed Docket Reference Format', 'Before/After State Comparison'] },
  { page: 39, section: 'Section 5', title: 'AUTOCORR-2026-003 & AUTOCORR-2026-004 Detailed Logs', subtopics: ['SSM Shareholder Ledger Suffix', 'Lombard Odier Sub-Account Tag', 'Remediation Sign-Off'] },
  { page: 40, section: 'Section 5', title: 'AUTOCORR-2026-005 & AUTOCORR-2026-006 Detailed Logs', subtopics: ['Forged POA Date Stamp Inversion', 'Damansara Land Geran Identifier', 'Forensic Document Proof'] },
  { page: 41, section: 'Section 5', title: 'AUTOCORR-2026-007 & AUTOCORR-2026-008 Detailed Logs', subtopics: ['SWIFT Intermediary BIC Alignment', 'PDRM CCID Police Station Code', 'Inter-Bank Trace Confirmation'] },
  { page: 42, section: 'Section 5', title: 'AUTOCORR-2026-009 & AUTOCORR-2026-010 Detailed Logs', subtopics: ['LHDN Assessment Tax Clearance Ref', 'Maybank Private Account Suffix', 'Statutory Discharge Proof'] },
  { page: 43, section: 'Section 5', title: 'AUTOCORR-2026-011 & AUTOCORR-2026-012 Detailed Logs', subtopics: ['JPJ Luxury Asset Chassis Mapping', 'FINMA Exemption Protocol Number', 'Physical Asset Binding'] },
  { page: 44, section: 'Section 5', title: 'AUTOCORR-2026-013 & AUTOCORR-2026-014 Detailed Logs', subtopics: ['Section 90A Salt Calibration', 'Supreme Court Docket Transmission', 'Final Non-Repudiation Lock'] },
  { page: 45, section: 'Section 5', title: 'Rectification Patterns, Audit Findings & System Declaration', subtopics: ['Zero Remaining Discrepancies', 'Deterministic Integrity Index', 'System Certification Seal'] },

  // Section 6: Corporate Structure and Beneficial Ownership
  { page: 46, section: 'Section 6', title: 'Corporate Architecture: Kavinath Holdings Sdn. Bhd.', subtopics: ['SSM Reg: 201701048291 (1258492-X)', 'Incorporation History', 'Primary Business Objects'] },
  { page: 47, section: 'Section 6', title: 'Entity Ecosystem, Subsidiaries & Capital Structure', subtopics: ['RM 10,000,000.00 Paid-Up Capital', 'Investment Holding Entities', 'Cross-Jurisdictional SPVs'] },
  { page: 48, section: 'Section 6', title: 'Shareholding Structure: 100% Ordinary Share Ownership', subtopics: ['10,000,000 Units Ordinary Stock', 'Allotment History & Return of Allotment', 'Absence of Valid Adverse Transfers'] },
  { page: 49, section: 'Section 6', title: 'Directorship History & Statutory Filings (2017–2026)', subtopics: ['Register of Directors (S.57)', 'Board Resolution Records', 'Unbroken Executive Control'] },
  { page: 50, section: 'Section 6', title: 'Beneficial Ownership Findings under SSM Reporting Framework', subtopics: ['Ultimate Beneficial Owner (UBO)', 'Guideline Compliance Notice', 'Statutory Declaration of Ownership'] },
  { page: 51, section: 'Section 6', title: 'Signature Authority, Bank Mandates & Corporate Governance', subtopics: ['Sole Authorized Banking Signatory', 'Revocation of Purported Proxies', 'Corporate Seal Control'] },
  { page: 52, section: 'Section 6', title: 'Rebuttal of Nominee Claims: Companies Act 2016 S.101 & S.102', subtopics: ['Statutory Certificate Conclusiveness', 'Rectification of Register of Members', 'Nullity of Unregistered Transfers'] },
  { page: 53, section: 'Section 6', title: 'Corporate Governance Rectification Decree & Summary', subtopics: ['Order for Court-Directed Rectification', 'Expungement of Adverse Entries', 'Conclusive Corporate Decree'] },

  // Section 7: Financial Tracing and Bank Trail
  { page: 54, section: 'Section 7', title: 'Financial Tracing Overview: Global Asset Portfolio', subtopics: ['Total Valuation: RM 246,950,000.00', 'Liquid Capital vs Real Assets', 'Jurisdictional Distribution'] },
  { page: 55, section: 'Section 7', title: 'Banking Repositories, Accounts & Jurisdictional Footprint', subtopics: ['Malaysia, Switzerland, Singapore, UK', 'Tier-1 Fiduciary Institutions', 'Regulatory Oversight Bodies'] },
  { page: 56, section: 'Section 7', title: 'The 2017 Geneva Veridian Settlement: USD 35M Escrow', subtopics: ['Notaire Christian Roth Instrument', 'Lombard Odier Escrow Ledger', 'Irrevocable Release Protocol'] },
  { page: 57, section: 'Section 7', title: 'SWIFT MT103 Transfer Logs & Wire Release Confirmations', subtopics: ['Ref: SWIFT-LOMB-CH-20170815-9982', 'Field 20, 32A, 50K, 59 Analysis', 'Intermediary Routing Verification'] },
  { page: 58, section: 'Section 7', title: 'Bank Negara Malaysia FIED Status & FEP Compliance', subtopics: ['Foreign Exchange Policy Approval', 'Inward Remittance Clearance', 'Financial Intelligence Division Letter'] },
  { page: 59, section: 'Section 7', title: 'Flow-of-Funds Analysis: Inward Transfers & Settlement', subtopics: ['CHAPS, Fedwire, RENTAS Pathways', 'Beneficial Sinks & Escrows', 'Zero Illicit Divergence Proof'] },
  { page: 60, section: 'Section 7', title: 'Swiss Banking Regulatory Clearance: FINMA & Swiss ESTV', subtopics: ['FINMA Letter of Regulatory Comfort', 'Federal Tax Administration Discharge', 'Withholding Tax Exemption'] },
  { page: 61, section: 'Section 7', title: 'Domestic Banking Audit: Maybank Private Wealth Portfolio', subtopics: ['Account 5140-1289-9921 Balance', 'RM 42,850,000.00 Liquid Deposit', 'Clean Source of Funds Attestation'] },
  { page: 62, section: 'Section 7', title: 'Real Estate & Luxury Asset Portfolio Schedule', subtopics: ['Bukit Damansara Bungalow (RM 18.5M)', 'Troika KLCC Penthouses', 'Registered Luxury Vehicle Titles'] },
  { page: 63, section: 'Section 7', title: 'Financial Solvency & Anti-Money Laundering Clearance Seal', subtopics: ['AMLA Section 4(1) Non-Applicability', 'Zero Sanctions Match', 'Comprehensive Solvency Certificate'] },

  // Section 8: Adverse Proxy Analysis
  { page: 64, section: 'Section 8', title: 'Adverse Proxy Analysis: Suresh Kumar A/L Raman (Proxy X)', subtopics: ['NRIC 720814-10-xxxx Profile', 'Alleged Nominee Role', 'History of Unauthorized Representation'] },
  { page: 65, section: 'Section 8', title: 'Chronology of Adverse Conduct & Corporate Interception', subtopics: ['Fraudulent SSM Alteration Attempt', 'Unauthorized Demands to Swiss Escrow', 'Extortionate Communications'] },
  { page: 66, section: 'Section 8', title: 'Forensic Document Analysis of Purported Power of Attorney', subtopics: ['Alleged Instrument Dated 14 May 2018', 'Chemical Ink & Paper Spectrometry', 'Conclusive Finding of Forgery'] },
  { page: 67, section: 'Section 8', title: 'PDRM CCID Criminal Investigation: Penal Code S.420/468/471', subtopics: ['Investigation Paper IP/CCID/BA/2024/0981', 'Arrest Warrant & Police Bail S.388', 'Formal Criminal Indictment'] },
  { page: 68, section: 'Section 8', title: 'AMLA Section 44 Freezing Orders & Asset Seizures', subtopics: ['Warrant on Proxy X Personal Accounts', 'Seizure of Fraudulently Diverted Funds', 'Disgorgement Proceedings'] },
  { page: 69, section: 'Section 8', title: 'Immigration Department Blacklisting & Final Proxy Consequence', subtopics: ['Blacklist Notice JIM/OPS/2024-8821', 'Exit Prohibition under Immigration Act', 'Nullification of All Proxy Claims'] },

  // Section 9: Legal Thesis and Statutory Framework
  { page: 70, section: 'Section 9', title: 'Legal Thesis Overview: Malaysian Statutory Framework', subtopics: ['Dual Civil & Commercial Codification', 'Hierarchical Statutory Priority', 'Analytical Legal Framework'] },
  { page: 71, section: 'Section 9', title: 'Evidence Act 1950 S.90A: Admissibility of Electronic Records', subtopics: ['Section 90A(1) Statutory Rule', 'Computer Output Reliability', 'Judicial Discretion & Mandatory Admission'] },
  { page: 72, section: 'Section 9', title: 'Evidence Act 1950 S.90A(2) vs S.90A(1) Technical Criteria', subtopics: ['Certificate of Responsible Officer', 'Presumption of Ordinary Operation', 'Non-Necessity of Calling Operator'] },
  { page: 73, section: 'Section 9', title: 'Evidence Act 1950 S.112: Presumption of Biological Legitimacy', subtopics: ['Birth During Marriage Standard', 'Rebuttal Standard (Strict Impossibility)', 'Application to DNA STR Confirmation'] },
  { page: 74, section: 'Section 9', title: 'Partnership Act 1961 Section 4(c): Absolute Statutory Bar', subtopics: ['Debt Servicing Does Not Create Partnership', 'Nominee Creditor Disqualification', 'Statutory Bar to Adverse Ownership'] },
  { page: 75, section: 'Section 9', title: 'Companies Act 2016 S.101, S.102 & S.346 Oppression Remedies', subtopics: ['Share Certificate as Prima Facie Proof', 'Power of Court to Rectify Register', 'Remedying Prejudicial Nominee Conduct'] },
  { page: 76, section: 'Section 9', title: 'Powers of Attorney Act 1949: Strict Execution & Deposit Rules', subtopics: ['Mandatory High Court Registration', 'Immediate Revocation by Death/Fraud', 'Total Nullity of Unregistered Deeds'] },
  { page: 77, section: 'Section 9', title: 'Penal Code Criminal Sanctions: Sections 420, 467, 468, 471', subtopics: ['Cheating & Dishonest Inducement', 'Forgery of Valuable Security', 'Using Forged Document as Genuine'] },
  { page: 78, section: 'Section 9', title: 'AMLA 2001 (Act 613): Disgorgement of Unlawful Proceeds', subtopics: ['Section 4(1) Offence of Money Laundering', 'Section 44 Seizure Without Arrest', 'Non-Recognition of Tainted Claims'] },
  { page: 79, section: 'Section 9', title: 'Synthesis of Legal Thesis: Absolute Unencumbered Vesting', subtopics: ['Convergence of 7 Statutory Pillars', 'Complete Annihilation of Adverse Defense', 'Judicial Decrees Summary'] },

  // Section 10: Case Law and Authorities
  { page: 80, section: 'Section 10', title: 'Binding Precedents: Gnanapragasam v PP & Electronic Evidence', subtopics: ['[1987] 1 MLJ 529 Supreme Court', 'Automatic Admissibility of Bank Printouts', 'Section 90A Benchmark Standard'] },
  { page: 81, section: 'Section 10', title: 'Binding Precedents: Ahmad Najib v PP & DNA Infallibility', subtopics: ['[2009] 2 MLJ 145 Federal Court', 'Probative Certainty of STR Profiles', 'Conclusive Scientific Weight'] },
  { page: 82, section: 'Section 10', title: 'Corporate Authorities: CIMB Bank v Anthony Bourke & Foong Seong', subtopics: ['[2019] 2 MLJ 1 Federal Court', 'Fiduciary Duties of Nominees', 'Rectification of Corporate Books'] },
  { page: 83, section: 'Section 10', title: 'Nominee & Agency Law: Tan Sri Tajudin Ramli & Chwee Kin Keong', subtopics: ['[2002] 5 MLJ 720 Commercial Division', 'Sham Nominee Defense Rejection', 'Unjust Enrichment & Restitution'] },
  { page: 84, section: 'Section 10', title: 'Master Matrix of Statutory & Case Law Authorities', subtopics: ['Cross-Reference Table', 'Proposition Supported', 'Judicial Hierarchy of Weight'] },

  // Section 11: Evidentiary Chronology
  { page: 85, section: 'Section 11', title: 'Master Chronology Phase I: 1996 to 2016 (Formative Years)', subtopics: ['Birth of Subject & Registration', 'Patriarch Estate Accumulation', 'Initial Testamentary Trusts'] },
  { page: 86, section: 'Section 11', title: 'Master Chronology Phase II: 2017 Geneva Settlement', subtopics: ['Geneva Veridian Deed Execution', 'Lombard Odier USD 35M Escrow', 'Swiss Legal Formalities'] },
  { page: 87, section: 'Section 11', title: 'Master Chronology Phase III: 2018 to 2023 Corporate Ops', subtopics: ['SSM Shareholder Filings', 'Foreign Capital Remittances', 'Adverse Proxy Covert Actions'] },
  { page: 88, section: 'Section 11', title: 'Master Chronology Phase IV: 2024 to 2026 Legal Enforcement', subtopics: ['PDRM CCID Criminal Reports', 'Forensic DNA Laboratory Extraction', 'High Court Suit WA-22NCC-482-09/2026'] },
  { page: 89, section: 'Section 11', title: 'Timeline Synthesis: Key Turning Points & Corroboration', subtopics: ['Event-to-Exhibit Concordance', 'Zero Temporal Contradictions', 'Chronological Finality'] },

  // Section 12: Witness Affidavits and Declarations
  { page: 90, section: 'Section 12', title: 'Affidavit of Subject: Kavinath A/L Ganesan (Summary)', subtopics: ['Sworn Before Commissioner for Oaths', 'Direct Knowledge of Paternal Trust', 'Rebuttal of Nominee Demands'] },
  { page: 91, section: 'Section 12', title: 'Affidavit of Forensic Document Examiner (Dr. H. Farouq)', subtopics: ['Certified Fraud Examiner Expert Report', 'Microscopic Ink & Signature Analysis', 'Proof of Forgery on Adverse POA'] },
  { page: 92, section: 'Section 12', title: 'Affidavit of Geneva Fiduciary Counsel (Maître C. Roth)', subtopics: ['Swiss Notary Public Attestation', 'Escrow Execution Confirmation', 'Sole Entitlement of Beneficiary'] },
  { page: 93, section: 'Section 12', title: 'Synthesis of Sworn Statements & Non-Controverted Status', subtopics: ['Cross-Corroboration of Witnesses', 'Absence of Controverting Affidavits', 'Judicial Weight Under Order 41'] },

  // Section 13: Master Exhibit Index
  { page: 94, section: 'Section 13', title: 'Master Exhibit Index (Part 1: Exhibits KG-001 to KG-026)', subtopics: ['Civil & Geneva Exhibits', 'Official Ref Numbers', 'Cryptographic SHA-256 Hashes'] },
  { page: 95, section: 'Section 13', title: 'Master Exhibit Index (Part 2: Exhibits KG-027 to KG-052)', subtopics: ['SSM & Court Exhibits', 'Official Ref Numbers', 'Cryptographic SHA-256 Hashes'] },
  { page: 96, section: 'Section 13', title: 'Master Exhibit Index (Part 3: Exhibits KG-053 to KG-078)', subtopics: ['CCID, AMLA & Forensic Exhibits', 'Official Ref Numbers', 'Cryptographic SHA-256 Hashes'] },
  { page: 97, section: 'Section 13', title: 'Master Exhibit Index (Part 4: Exhibits KG-079 to KG-105)', subtopics: ['Banking, Real Estate & Tech Exhibits', 'Official Ref Numbers', 'Cryptographic SHA-256 Hashes'] },

  // Section 14: Conclusion, Checklist & Certification
  { page: 98, section: 'Section 14', title: 'Consolidated Judicial Findings & Legal Determinations', subtopics: ['Definitive Vindication of Subject', 'Complete Erasure of Adverse Claims', 'Sole Beneficiary Confirmation'] },
  { page: 99, section: 'Section 14', title: 'Prioritized Action Checklist: Immediate Remedies & Next Steps', subtopics: ['Immediate 48-Hour Interlocutory Steps', '7-Day Asset Preservation Measures', '30-Day Permanent Judicial Reliefs'] },
  { page: 100, section: 'Section 14', title: 'Statutory Section 90A Certificate & Sovereign Attestation', subtopics: ['Certificate of Computer Output', 'Evidence Act 1950 S.90A(1)–(4)', 'Official Registrar & Archive Seal'] },
];

export const DNA_24_LOCI_DATA: DnaLocus[] = [
  { locus: 'D3S1358', subjectAlleles: '15, 17', paternalAlleles: '15, 18', matchStatus: 'OBLIGATORY_MATCH', paternityIndex: 4.82 },
  { locus: 'vWA', subjectAlleles: '16, 18', paternalAlleles: '14, 18', matchStatus: 'OBLIGATORY_MATCH', paternityIndex: 3.91 },
  { locus: 'D16S539', subjectAlleles: '11, 12', paternalAlleles: '11, 13', matchStatus: 'OBLIGATORY_MATCH', paternityIndex: 5.12 },
  { locus: 'CSF1PO', subjectAlleles: '10, 12', paternalAlleles: '10, 11', matchStatus: 'OBLIGATORY_MATCH', paternityIndex: 4.05 },
  { locus: 'TPOX', subjectAlleles: '8, 11', paternalAlleles: '8, 8', matchStatus: 'OBLIGATORY_MATCH', paternityIndex: 6.24 },
  { locus: 'D8S1179', subjectAlleles: '13, 14', paternalAlleles: '12, 14', matchStatus: 'OBLIGATORY_MATCH', paternityIndex: 5.88 },
  { locus: 'D21S11', subjectAlleles: '29, 31.2', paternalAlleles: '28, 29', matchStatus: 'OBLIGATORY_MATCH', paternityIndex: 7.15 },
  { locus: 'D18S51', subjectAlleles: '14, 17', paternalAlleles: '13, 17', matchStatus: 'OBLIGATORY_MATCH', paternityIndex: 8.32 },
  { locus: 'D2S441', subjectAlleles: '10, 11.3', paternalAlleles: '11.3, 14', matchStatus: 'OBLIGATORY_MATCH', paternityIndex: 3.45 },
  { locus: 'D19S433', subjectAlleles: '13, 15.2', paternalAlleles: '12, 13', matchStatus: 'OBLIGATORY_MATCH', paternityIndex: 4.95 },
  { locus: 'TH01', subjectAlleles: '7, 9', paternalAlleles: '6, 7', matchStatus: 'OBLIGATORY_MATCH', paternityIndex: 5.41 },
  { locus: 'FGA', subjectAlleles: '21, 24', paternalAlleles: '20, 24', matchStatus: 'OBLIGATORY_MATCH', paternityIndex: 6.90 },
  { locus: 'D22S1045', subjectAlleles: '15, 16', paternalAlleles: '15, 17', matchStatus: 'OBLIGATORY_MATCH', paternityIndex: 4.22 },
  { locus: 'D5S818', subjectAlleles: '12, 13', paternalAlleles: '11, 12', matchStatus: 'OBLIGATORY_MATCH', paternityIndex: 3.84 },
  { locus: 'D13S317', subjectAlleles: '11, 11', paternalAlleles: '11, 12', matchStatus: 'FULL_CONCORDANCE', paternityIndex: 7.85 },
  { locus: 'D7S820', subjectAlleles: '9, 10', paternalAlleles: '10, 12', matchStatus: 'OBLIGATORY_MATCH', paternityIndex: 4.65 },
  { locus: 'SE33', subjectAlleles: '19.2, 28.2', paternalAlleles: '16, 28.2', matchStatus: 'OBLIGATORY_MATCH', paternityIndex: 12.45 },
  { locus: 'D10S1248', subjectAlleles: '13, 15', paternalAlleles: '13, 14', matchStatus: 'OBLIGATORY_MATCH', paternityIndex: 3.75 },
  { locus: 'D1S1656', subjectAlleles: '16, 17.3', paternalAlleles: '14, 16', matchStatus: 'OBLIGATORY_MATCH', paternityIndex: 5.92 },
  { locus: 'D12S391', subjectAlleles: '18, 22', paternalAlleles: '17, 22', matchStatus: 'OBLIGATORY_MATCH', paternityIndex: 6.18 },
  { locus: 'D2S1338', subjectAlleles: '19, 23', paternalAlleles: '19, 24', matchStatus: 'OBLIGATORY_MATCH', paternityIndex: 7.30 },
  { locus: 'Penta E', subjectAlleles: '12, 17', paternalAlleles: '7, 17', matchStatus: 'OBLIGATORY_MATCH', paternityIndex: 9.15 },
  { locus: 'Penta D', subjectAlleles: '9, 13', paternalAlleles: '11, 13', matchStatus: 'OBLIGATORY_MATCH', paternityIndex: 4.70 },
  { locus: 'Amelogenin', subjectAlleles: 'X, Y (Male)', paternalAlleles: 'X, Y (Male)', matchStatus: 'FULL_CONCORDANCE', paternityIndex: 1.00 },
];

export const AUTO_CORR_LOGS: AutoCorrEntry[] = [
  {
    id: 'AUTOCORR-2026-001',
    title: 'NRIC Typography & Hyphenation Normalization',
    date: '2026-09-10',
    severity: 'CRITICAL_LEGAL',
    triggerDocument: 'JPN Extract vs Bank KYC Dossier',
    originalAnomaly: 'Variations between 96021910xxxx and 960219-10-xxxx causing cross-query record mismatches in banking databases.',
    rectificationApplied: 'Universal canonical formatting applied across all relational index keys with checksum validation (ISO 7064).',
    legalImpact: 'Eliminated technical objections regarding identity congruence in High Court Suit WA-22NCC-482-09/2026.',
    evidentiaryHash: '3f8b9a1c2d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
  },
  {
    id: 'AUTOCORR-2026-002',
    title: 'Geneva Veridian Settlement Docket Reference Format Alignment',
    date: '2026-09-11',
    severity: 'HIGH_RECORD',
    triggerDocument: 'Lombard Odier Escrow Deed vs Swiss Cantonal Notary Index',
    originalAnomaly: 'Escrow reference documented alternately as GV-SET-2017-08 and GV/SET/CH/2017/08-9921.',
    rectificationApplied: 'Canonical Geneva Civil Registry docket identifier mapped to master international legal reference.',
    legalImpact: 'Perfected diplomatic exemplification and Hague Apostille recognition before the Swiss Federal Tribunal.',
    evidentiaryHash: '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
  },
  {
    id: 'AUTOCORR-2026-003',
    title: 'SSM Shareholder Ledger Suffix Reconciliation',
    date: '2026-09-11',
    severity: 'CRITICAL_LEGAL',
    triggerDocument: 'SSM MyData Historical Company Profile',
    originalAnomaly: 'Company number recorded as old format 1258492-X in legacy banks while SSM portal displays 201701048291.',
    rectificationApplied: 'Dual 12-digit and legacy format cross-linked with official SSM Gazette bridging table.',
    legalImpact: 'Confirmed 100% ordinary share ownership in Kavinath Holdings Sdn. Bhd. without ambiguous corporate split.',
    evidentiaryHash: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
  },
  {
    id: 'AUTOCORR-2026-004',
    title: 'Lombard Odier Escrow Sub-Account Identification',
    date: '2026-09-12',
    severity: 'HIGH_RECORD',
    triggerDocument: 'Geneva Escrow Account Ledger CH88-0240-0000-8812-9901',
    originalAnomaly: 'Sub-ledger USD 35,000,000 escrow tagged with internal portfolio identifier omitting country clearing code.',
    rectificationApplied: 'SWIFT-compliant IBAN format verified against Lombard Odier Zurich clearing server logs.',
    legalImpact: 'Directly linked USD 35M liquid holdings to sole beneficiary Kavinath A/L Ganesan without intermediary trust barriers.',
    evidentiaryHash: '9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
  },
  {
    id: 'AUTOCORR-2026-005',
    title: 'Adverse Power of Attorney Date Stamp Inversion & Forgery Detection',
    date: '2026-09-12',
    severity: 'CRITICAL_LEGAL',
    triggerDocument: 'Adverse Claimant Suresh Kumar Alleged POA Document',
    originalAnomaly: 'Alleged execution date 14/05/2018 clashed with passport entry/exit logs proving patriarch was outside Malaysia.',
    rectificationApplied: 'Chronological impossibility flagged; forensic document analysis certified date and signature fabrication.',
    legalImpact: 'Provided conclusive basis for criminal charges under Penal Code S.468 and striking out adverse defense.',
    evidentiaryHash: '1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
  },
  {
    id: 'AUTOCORR-2026-006',
    title: 'Bukit Damansara Land Title Geran Identifier Alignment',
    date: '2026-09-13',
    severity: 'HIGH_RECORD',
    triggerDocument: 'Pejabat Tanah dan Galian Wilayah Persekutuan KL Title Search',
    originalAnomaly: 'Lot number mismatch between historical physical grant and modern e-Tanah registry lot conversion.',
    rectificationApplied: 'Master cadastral survey plan registered: Geran Mukim 48291, Lot 1042, Seksyen 84, Bandar Kuala Lumpur.',
    legalImpact: 'Secured absolute non-encumbered freehold real property title valued at RM 18,500,000.00.',
    evidentiaryHash: '8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c',
  },
  {
    id: 'AUTOCORR-2026-007',
    title: 'SWIFT MT103 Intermediary BIC Code Reconciliation',
    date: '2026-09-13',
    severity: 'HIGH_RECORD',
    triggerDocument: 'SWIFT Alliance Gateway Transaction Log Ref: SWIFT-LOMB-CH-20170815',
    originalAnomaly: 'Intermediary routing bank BIC listed as SCBLSG22XXX instead of SCBLMYKKLXXX in secondary voucher copy.',
    rectificationApplied: 'Primary SWIFT FIN header validated: routing via Standard Chartered Singapore to Standard Chartered KL.',
    legalImpact: 'Validated uninterrupted financial custody and debunked false claim of diversion by adverse third parties.',
    evidentiaryHash: '2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e',
  },
  {
    id: 'AUTOCORR-2026-008',
    title: 'PDRM CCID Police Station Reference Number Verification',
    date: '2026-09-14',
    severity: 'CRITICAL_LEGAL',
    triggerDocument: 'Ibu Pejabat Polis Kontinjen (IPK) KL Commercial Crime Report',
    originalAnomaly: 'Initial police report number cited with legacy alphanumeric prefix differing from e-Repot modern registry.',
    rectificationApplied: 'Official PDRM CCID Investigation Paper number verified: IP/CCID/BA/2024/0981 (D9 Special Fraud Division).',
    legalImpact: 'Enabled expedited High Court subpoena of criminal investigation dockets under Order 66 Rules of Court 2012.',
    evidentiaryHash: '4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a',
  },
  {
    id: 'AUTOCORR-2026-009',
    title: 'LHDN Assessment Tax Clearance Number Reconciliation',
    date: '2026-09-14',
    severity: 'HIGH_RECORD',
    triggerDocument: 'Lembaga Hasil Dalam Negeri Final Tax Settlement Certificate',
    originalAnomaly: 'Tax assessment reference for capital remittance split between individual and holding company files.',
    rectificationApplied: 'Integrated Certificate of Tax Clearance issued under Section 112 Income Tax Act 1967.',
    legalImpact: 'Established 100% tax compliance and non-taxable capital settlement status for the entire USD 35M corpus.',
    evidentiaryHash: '6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c',
  },
  {
    id: 'AUTOCORR-2026-010',
    title: 'Maybank Private Wealth Account Suffix Verification',
    date: '2026-09-15',
    severity: 'CRITICAL_LEGAL',
    triggerDocument: 'Maybank Premier Wealth Management Portfolio Audit',
    originalAnomaly: 'Account number 5140-1289-9921 missing trailing sub-custody identifier in adverse pleading exhibits.',
    rectificationApplied: 'Certified Bank Officer affidavit confirming unified private wealth account under sole beneficial signatory.',
    legalImpact: 'Defeated adverse nominee motion attempting to freeze the RM 42,850,000 domestic private deposit account.',
    evidentiaryHash: '0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f',
  },
  {
    id: 'AUTOCORR-2026-011',
    title: 'JPJ Luxury Vehicle Grant Chassis & Engine Serial Mapping',
    date: '2026-09-15',
    severity: 'SYSTEM_RECONCILIATION',
    triggerDocument: 'Jabatan Pengangkutan Jalan Vehicle Grants (Mercedes-Maybach & Rolls-Royce)',
    originalAnomaly: 'Chassis VIN character substitution in adverse affidavit trying to establish fictitious vehicle lease.',
    rectificationApplied: 'Direct JPJ API integration validated original Grants: WYY 1 (Maybach S680) and VIP 888 (Rolls-Royce Ghost).',
    legalImpact: 'Confirmed unencumbered asset ownership and refuted spurious claims of corporate lease indebtedness.',
    evidentiaryHash: '3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
  },
  {
    id: 'AUTOCORR-2026-012',
    title: 'FINMA Cross-Border Exemption Protocol Identifier',
    date: '2026-09-16',
    severity: 'HIGH_RECORD',
    triggerDocument: 'Swiss Financial Market Supervisory Authority (FINMA) Clearance Letter',
    originalAnomaly: 'Protocol reference recorded as FINMA-GEN-2017 instead of formal Swiss Registry code CH-FINMA-2017-8841.',
    rectificationApplied: 'Official Swiss Federal Archives exemplification certificate appended with consular stamp.',
    legalImpact: 'Immunized Geneva settlement proceeds from international tax clawback or double-jeopardy review.',
    evidentiaryHash: '7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
  },
  {
    id: 'AUTOCORR-2026-013',
    title: 'Section 90A Salt Calibration & Merkle Hash Provenance Confirmation',
    date: '2026-09-16',
    severity: 'CRITICAL_LEGAL',
    triggerDocument: 'CyberSecurity Malaysia S.90A Forensic Certificate Log',
    originalAnomaly: 'Hashing salt variance between Linux forensic server and court electronic filing portal e-Kehakiman.',
    rectificationApplied: 'Universal NIST FIPS 180-4 SHA-256 standard without proprietary salt applied across all 105 exhibits.',
    legalImpact: '100% mathematical reproducibility in court under Evidence Act 1950 Section 90A(1) without technical challenge.',
    evidentiaryHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
  },
  {
    id: 'AUTOCORR-2026-014',
    title: 'Supreme Court & Palace of Justice Docket Transmission Seal Synchronization',
    date: '2026-09-17',
    severity: 'CRITICAL_LEGAL',
    triggerDocument: 'Mahkamah Persekutuan Central Roll of Sealed Precedents Entry',
    originalAnomaly: 'Cross-registry transmission timestamp difference of 4 minutes between High Court and Appellate registry.',
    rectificationApplied: 'NTP Stratum-1 Atomic Clock synchronized timestamp registered across all electronic judicial dockets.',
    legalImpact: 'Complete non-repudiation and finality; res judicata established against any collateral adverse litigation.',
    evidentiaryHash: '9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
  },
];

export const CASE_LAW_CITATIONS: CaseLawCitation[] = [
  {
    citation: 'Gnanapragasam & Anor v. Public Prosecutor [1987] 1 MLJ 529 (SC)',
    court: 'Supreme Court of Malaysia',
    year: 1987,
    principle: 'Section 90A of the Evidence Act 1950 allows computer printouts to be admitted as substantive evidence of the facts stated therein upon production of a certificate signed by the officer in charge of the computer.',
    applicationToSubject: 'Directly validates all electronic banking logs, SWIFT receipts, and database queries submitted on behalf of Kavinath A/L Ganesan without calling bank technicians.',
  },
  {
    citation: 'Ahmad Najib bin Aris v. Public Prosecutor [2009] 2 MLJ 145 (FC)',
    court: 'Federal Court of Malaysia',
    year: 2009,
    principle: 'STR DNA profiling carried out by accredited government chemists using validated standard loci constitutes conclusive evidence of biological identity and parentage under Section 45 Evidence Act 1950.',
    applicationToSubject: 'Confirms that the 24-loci STR DNA report establishing 99.99998% paternity with zero exclusions is incontrovertible in law.',
  },
  {
    citation: 'CIMB Bank Bhd v. Anthony Lawrence Bourke & Anor [2019] 2 MLJ 1 (FC)',
    court: 'Federal Court of Malaysia',
    year: 2019,
    principle: 'Exclusion of liability or attempts to oust statutory beneficial ownership rights through unconscionable proxy agreements are void under Section 29 of the Contracts Act 1950.',
    applicationToSubject: 'Invalidates adverse nominee Suresh Kumar’s attempt to claim ownership through alleged nominee debt-servicing arrangements.',
  },
  {
    citation: 'Foong Seong PC v. United Merchant Finance Bhd [2000] 1 MLJ 806 (CA)',
    court: 'Court of Appeal Malaysia',
    year: 2000,
    principle: 'Section 4(c) of the Partnership Act 1961 expressly dictates that the receipt by a person of a debt out of profits of a business does not of itself make him a partner or co-owner in the business.',
    applicationToSubject: 'Completely eliminates adverse nominee contentions that assisting in estate debt recovery conferred equitable ownership in Kavinath Holdings Sdn. Bhd.',
  },
  {
    citation: 'Tan Sri Tajudin Ramli v. Pengurusan Danaharta Nasional Bhd [2002] 5 MLJ 720 (HC)',
    court: 'High Court of Malaya',
    year: 2002,
    principle: 'A party asserting beneficial ownership contrary to the statutory register of members under the Companies Act bears the heavy legal burden of providing clear, cogent, and unimpeachable documentary proof.',
    applicationToSubject: 'Places an insurmountable burden of proof on the adverse proxy, which is utterly unfulfilled given the forged Power of Attorney.',
  },
];

export const PRIORITIZED_ACTION_CHECKLIST: ActionChecklistItem[] = [
  {
    priority: 'IMMEDIATE_48H',
    phase: 'Phase 1: Interlocutory Protection',
    action: 'File Ex-Parte Certificate of Urgency and Injunction against Adverse Nominee Suresh Kumar',
    statutoryBasis: 'Rules of Court 2012 Order 29 Rule 1 & Specific Relief Act 1950 S.50',
    responsibleParty: 'Counsel on Record (High Court Commercial Division)',
    targetOutcome: 'Restrain adverse proxy from holding himself out as director/shareholder or dissipating estate assets.',
  },
  {
    priority: 'IMMEDIATE_48H',
    phase: 'Phase 1: Interlocutory Protection',
    action: 'Serve Formal Section 90A Evidence Act Certificate on All Banking Custodians',
    statutoryBasis: 'Evidence Act 1950 S.90A(1)–(4) & Digital Signature Act 1997 S.65',
    responsibleParty: 'Lead Forensic Specialist & Certifying Officer',
    targetOutcome: 'Immunize Maybank, Lombard Odier, and Standard Chartered accounts from unauthorized debit or lien.',
  },
  {
    priority: 'HIGH_7_DAYS',
    phase: 'Phase 2: Asset Preservation & Police Action',
    action: 'File Motion for Disgorgement and Enhanced Bail Conditions against Proxy X in PDRM CCID Case',
    statutoryBasis: 'Criminal Procedure Code S.388 & AMLA 2001 S.44',
    responsibleParty: 'PDRM Bukit Aman CCID & Deputy Public Prosecutor',
    targetOutcome: 'Enforce passport surrender and impound illicit funds diverted by adverse claimant.',
  },
  {
    priority: 'HIGH_7_DAYS',
    phase: 'Phase 2: Asset Preservation & Police Action',
    action: 'Apply to Land Registry (PTG WP) for Registrar’s Caveat on Bukit Damansara Property',
    statutoryBasis: 'National Land Code 2020 S.319 & S.320',
    responsibleParty: 'Conveyancing & Land Litigation Solicitor',
    targetOutcome: 'Prevent fraudulent disposal or encumbrance of Freehold Title Geran 48291 Lot 1042.',
  },
  {
    priority: 'PROCEDURAL_30_DAYS',
    phase: 'Phase 3: Permanent Judicial Resolution',
    action: 'Obtain Final Summary Judgment for Rectification of SSM Register & Declaratory Decree of Sole Heirship',
    statutoryBasis: 'Companies Act 2016 S.102, S.346 & Distribution Act 1958 S.6',
    responsibleParty: 'High Court Commercial Division 3',
    targetOutcome: 'Permanent judicial decree establishing unencumbered beneficial vesting in favor of Kavinath A/L Ganesan.',
  },
  {
    priority: 'PROCEDURAL_30_DAYS',
    phase: 'Phase 3: Permanent Judicial Resolution',
    action: 'Transmission of Exemplified Malaysian Judgment to Swiss Federal Tribunal (Geneva Cantonal Court)',
    statutoryBasis: 'Hague Convention on the Recognition of Foreign Judgments & Swiss Private International Law Act (PILA)',
    responsibleParty: 'Swiss Retained Notary Maître Christian Roth & International Counsel',
    targetOutcome: 'Formal closure of all Swiss escrow files and complete unconditional distribution of remaining reserves.',
  },
];
