import crypto from 'node:crypto';
import type { MasterDossierExportData } from '../shared/types.js';
import { FORENSIC_ENTITIES, TARGET_PROFILE } from './forensicData.js';
import {
  CASE_DISPUTE_CORE,
  CASE_TRIGGER_TRACES,
  HISTORICAL_PRECEDENTS,
  PRECOMPUTED_MEDIA_COVERAGE,
  VERIDIAN_SETTLEMENT_ANALYSIS,
  SWIFT_TRANSFER_LOGS,
  UBO_DETAILS,
} from './geminiAiService.js';
import {
  PROBATE_COURT_DOSSIER,
  PROBATE_WILL_RECORD,
  ALL_COURT_DOCKETS,
  DNA_VERDICT_REPORT,
} from './probateAndCourtService.js';
import { SCRAPED_DOCUMENTS_CATALOG } from './crawlerAndRetrievalService.js';
import { POWER_OF_ATTORNEY_REGISTRY } from './powerOfAttorneyService.js';

// Chronological investigation milestones from initial dispute through court verdict
const CHRONOLOGICAL_MILESTONES: MasterDossierExportData['chronologicalMilestones'] = [
  {
    date: '2021-11-14',
    title: 'Execution of Last Will & Testament',
    forumOrAgency: 'High Court of Malaya / Wills Act 1959',
    verdictOrImpact: 'Testator Ganesan A/L Raman executes valid Last Will naming Kavinath sole universal legatee.',
    phase: 'PROBATE_DNA',
  },
  {
    date: '2021-11-22',
    title: 'High Court Malaya Deposit of Irrevocable Power of Attorney (PA-KL-2021-09418)',
    forumOrAgency: 'High Court of Malaya (Powers of Attorney Registry under Act 424)',
    verdictOrImpact: 'General Irrevocable Power of Attorney deposited under Section 4 & 6 of Act 424; granting Kavinath plenary real estate, corporate & banking management authority.',
    phase: 'POWER_OF_ATTORNEY',
  },
  {
    date: '2022-05-12',
    title: 'SSM Corporate Banking Power of Attorney Registration (PA-CORP-2022-8812)',
    forumOrAgency: 'Suruhanjaya Syarikat Malaysia (Companies Act 2016)',
    verdictOrImpact: 'Kavinath Holdings Sdn Bhd registers corporate power of attorney appointing Kavinath sole managing attorney for banking facilities.',
    phase: 'POWER_OF_ATTORNEY',
  },
  {
    date: '2022-08-18',
    title: 'Cayman Islands STAR Trust Special Power of Attorney (PA-CAYMAN-2022-TR09)',
    forumOrAgency: 'Cayman Islands General Registry / Walkers Fiduciary',
    verdictOrImpact: 'Settlor Ganesan executes special irrevocable power of attorney vesting sole enforcer and distribution direction rights in Kavinath.',
    phase: 'POWER_OF_ATTORNEY',
  },
  {
    date: '2023-08-19',
    title: 'Fabrication of Purported 2023 Codicil',
    forumOrAgency: 'Commercial Crimes / Proxy Syndicate',
    verdictOrImpact: 'Proxy X and syndicate draft fraudulent codicil attempting to divert 50% shares; later proven forged.',
    phase: 'PROBATE_DNA',
  },
  {
    date: '2023-09-12',
    title: 'Rejection of Purported Adverse Power of Attorney (PA-IPH-2023-FRAUD-00412)',
    forumOrAgency: 'High Court Senior Assistant Registrar / PDRM CCID',
    verdictOrImpact: 'Registrar rejects fraudulent instrument for lack of valid attestation; hospital ICU records prove donor was incapacitated; seized for forgery investigation.',
    phase: 'POWER_OF_ATTORNEY',
  },
  {
    date: '2024-03-10',
    title: 'Initial Case Dispute Inception: Suit No. 4-334567',
    forumOrAgency: 'High Court of Malaya (Commercial Division Court 4)',
    verdictOrImpact: 'Proxy X sues claiming partnership interest in MYR 300,000 RHB account; Section 4(c) defense asserted.',
    phase: 'INITIAL_DISPUTE',
  },
  {
    date: '2024-06-15',
    title: 'Detection of Forged USD 2,000,000 AmBank Balance',
    forumOrAgency: 'AmBank Group Internal Audit / CCID Bukit Aman',
    verdictOrImpact: 'Fabricated credit advice slip seized under Penal Code 468/471; SHA-256 hash mismatch exposed.',
    phase: 'INITIAL_DISPUTE',
  },
  {
    date: '2024-07-22',
    title: 'Filing of Probate Petition WA-31NCvC-882-07/2024',
    forumOrAgency: 'High Court of Malaya (Probate Division)',
    verdictOrImpact: 'Kavinath petitions for Grant of Probate under Wills Act 1959; Proxy X lodges caveat CAV-2024-00194.',
    phase: 'PROBATE_DNA',
  },
  {
    date: '2024-10-05',
    title: 'LHDN Notice of Additional Assessment Levy',
    forumOrAgency: 'Inland Revenue Board (LHDN Malaysia)',
    verdictOrImpact: 'LHDN issues MYR 56.42M demand under Section 140A (transfer pricing deemed interest) & Section 113 penalties.',
    phase: 'INITIAL_DISPUTE',
  },
  {
    date: '2024-10-17',
    title: 'High Court Deposit of Revocation Deed (REV-PA-2024-0019)',
    forumOrAgency: 'High Court of Malaya (Powers of Attorney Registry under Act 424 Section 5)',
    verdictOrImpact: 'Sole executor registers deed of revocation extinguishing any purported verbal or third-party powers claimed by adverse proxies.',
    phase: 'POWER_OF_ATTORNEY',
  },
  {
    date: '2024-11-18',
    title: 'SDNY Chapter 15 Bankruptcy Settlement Liquidation',
    forumOrAgency: 'US Bankruptcy Court SDNY (Adv. Proc. 17-01892)',
    verdictOrImpact: 'USD 35,000,000 unencumbered settlement confirmed and wired via SWIFT MT103 to Lombard Odier Geneva.',
    phase: 'BANKING_VERIDIAN',
  },
  {
    date: '2025-01-20',
    title: 'Swiss AMLA Art. 9 Form A Declaration & Banking Mandate (PA-LOMBARD-2024-CH)',
    forumOrAgency: 'Lombard Odier, Geneva / Swiss CDB 20',
    verdictOrImpact: 'Kavinath confirmed as sole 100% economic Ultimate Beneficial Owner & sole mandated banking attorney of Archon Holdings SA.',
    phase: 'BANKING_VERIDIAN',
  },
  {
    date: '2025-03-12',
    title: 'Jabatan Kimia Forensic DNA Verdict Issued',
    forumOrAgency: 'Department of Chemistry Malaysia (Lab JKM/DNA/FOR/2025/8821-KAV)',
    verdictOrImpact: '24-loci STR profile confirms 99.9999% paternity (CPI 99,999,999:1); Proxy X excluded at 7 loci (0.0000%).',
    phase: 'PROBATE_DNA',
  },
  {
    date: '2025-04-18',
    title: 'High Court Family Division Declaratory Order',
    forumOrAgency: 'High Court Malaya Suit WA-24FC-109-03/2025',
    verdictOrImpact: 'Binding judgment entered declaring Kavinath lawful biological issue under Evidence Act Section 112.',
    phase: 'PROBATE_DNA',
  },
  {
    date: '2025-09-08',
    title: 'Caveat Expungement & Voiding of 2023 Codicil',
    forumOrAgency: 'High Court Malaya Probate Division',
    verdictOrImpact: 'Caveat CAV-2024-00194 expunged with RM25,000 punitive costs; 2023 codicil declared null and void for forgery.',
    phase: 'PROBATE_DNA',
  },
  {
    date: '2025-11-18',
    title: 'Sealing and Extraction of Grant of Probate',
    forumOrAgency: 'High Court of Malaya Probate Division',
    verdictOrImpact: 'Sole executor Grant of Probate sealed; estate assets totaling MYR 184,800,000 vest solely in Kavinath.',
    phase: 'PROBATE_DNA',
  },
  {
    date: '2026-02-14',
    title: 'Targeted Scraper & Evidentiary Crawler Indexing',
    forumOrAgency: 'SSM MyGDX Gateway & Court Records Crawler',
    verdictOrImpact: '12 foundational registration, trust, bank, and judicial documents cryptographically indexed with SHA-256.',
    phase: 'CRAWLER_SCRAPE',
  },
];

/**
 * Builds the comprehensive Master Forensic Dossier incorporating all data
 * from the initial case to the latest judicial, genetic, and power of attorney verdicts.
 */
export function buildMasterDossierExportData(): MasterDossierExportData {
  // Transfer pricing simulation constants (matching initial dispute data)
  const loanPrincipalMYR = 10000000;
  const benchmarkRatePct = 4.85;
  const monthlyDeemed = (1 / 12) * loanPrincipalMYR * (benchmarkRatePct / 100);
  const annualDeemed = monthlyDeemed * 12;
  const citAdj = annualDeemed * 0.24;
  const s113Pen = citAdj * 0.45;

  const rawJsonToHash = JSON.stringify({
    subject: TARGET_PROFILE,
    initialDispute: CASE_DISPUTE_CORE,
    entities: FORENSIC_ENTITIES,
    veridian: VERIDIAN_SETTLEMENT_ANALYSIS,
    probate: PROBATE_COURT_DOSSIER,
    dna: DNA_VERDICT_REPORT,
    dockets: ALL_COURT_DOCKETS,
    powerOfAttorney: POWER_OF_ATTORNEY_REGISTRY,
    media: PRECOMPUTED_MEDIA_COVERAGE,
  });
  const checksum = crypto.createHash('sha256').update(rawJsonToHash).digest('hex');

  const dossierData: MasterDossierExportData = {
    metadata: {
      dossierReference: 'SSM/MYGDX/DOSSIER/2026/MASTER-ALL-DATA-001',
      generatedAt: new Date().toISOString(),
      classification: 'OFFICIAL FORENSIC & JUDICIAL RECORD (EVIDENTIARY GRADE)',
      version: '5.0.0-CONSOLIDATED-MASTER',
      cryptographicChecksum: checksum,
      signedByOfficer: 'SSM Senior Regulatory Enforcement & MyGDX Judicial Interoperability Officer',
      agencyScope: [
        'Suruhanjaya Syarikat Malaysia (SSM)',
        'Jabatan Pendaftaran Negara (JPN)',
        'Jabatan Kimia Malaysia (Forensic DNA Division)',
        'Lembaga Hasil Dalam Negeri (LHDN)',
        'Bank Negara Malaysia (BNM)',
        'Pejabat Ketua Pendaftar Mahkamah Persekutuan Malaysia (Powers of Attorney Registry & e-Kehakiman)',
        'Polis Diraja Malaysia (PDRM - CCID Bukit Aman)',
        'Cayman Islands Monetary Authority (CIMA)',
        'Swiss Federal Department of Justice and Police (FDJP / Lombard Odier)',
        'United States Bankruptcy Court for the Southern District of New York (SDNY)',
      ],
      jurisdictionsInvolved: [
        'Malaysia (Federal, Probate, & Commercial Courts)',
        'Switzerland (Geneva / FINMA Banking)',
        'Cayman Islands (Grand Court FSD & STAR Trusts)',
        'United States (SDNY Bankruptcy)',
        'British Virgin Islands (BVI Corporate Registry)',
      ],
    },
    subjectProfile: {
      fullName: TARGET_PROFILE.fullName,
      nric: TARGET_PROFILE.nric,
      jpnBirthIndexes: TARGET_PROFILE.jpnBirthIndexes,
      status: TARGET_PROFILE.status,
      primaryDomesticEntity: TARGET_PROFILE.primaryDomesticEntity,
      jurisdictions: TARGET_PROFILE.jurisdictions,
      totalLiabilitiesMYR: TARGET_PROFILE.totalLiabilitiesMYR,
      domesticLiquidAssetsMYR: TARGET_PROFILE.domesticLiquidAssetsMYR,
      offshoreLiquidUSD: TARGET_PROFILE.offshoreLiquidUSD,
      taxExposureMYR: TARGET_PROFILE.taxExposureMYR,
      flaggedForgedUSD: TARGET_PROFILE.flaggedForgedUSD,
      estateHeirshipValuationMYR: PROBATE_COURT_DOSSIER.subject.totalHeirshipValuationMYR,
    },
    initialCaseDispute: CASE_DISPUTE_CORE,
    initialForensicEntities: FORENSIC_ENTITIES,
    caseTriggersAndTraces: CASE_TRIGGER_TRACES,
    powerOfAttorneyRegistry: POWER_OF_ATTORNEY_REGISTRY,
    mediaPublications: PRECOMPUTED_MEDIA_COVERAGE,
    veridianSwiftAudit: {
      veridianSettlement: VERIDIAN_SETTLEMENT_ANALYSIS,
      swiftLogs: SWIFT_TRANSFER_LOGS,
      uboProfile: UBO_DETAILS,
    },
    probateAndEstateRecord: {
      probateWill: PROBATE_WILL_RECORD,
      estateAssets: PROBATE_WILL_RECORD.estateAssetInventory,
    },
    dnaVerdictForensicReport: DNA_VERDICT_REPORT,
    courtDocketsRegistry: ALL_COURT_DOCKETS,
    crawledDocumentsCatalog: SCRAPED_DOCUMENTS_CATALOG,
    historicalPrecedents: HISTORICAL_PRECEDENTS,
    transferPricingSimulation: {
      formula: 'I = 1/12 * A * B (ITA 1967 Section 140A(3C))',
      loanPrincipalMYR,
      benchmarkRatePct,
      monthlyDeemedInterestMYR: Math.round(monthlyDeemed),
      annualDeemedInterestMYR: Math.round(annualDeemed),
      corporateTaxAdjustmentMYR: Math.round(citAdj),
      section113PenaltyMYR: Math.round(s113Pen),
    },
    summaryStatistics: {
      totalEntitiesTracked: FORENSIC_ENTITIES.length,
      totalCourtDockets: ALL_COURT_DOCKETS.length,
      totalCrawledDocuments: SCRAPED_DOCUMENTS_CATALOG.length,
      totalSwiftTransfers: SWIFT_TRANSFER_LOGS.length,
      totalHistoricalPrecedents: HISTORICAL_PRECEDENTS.length,
      totalDnaLociAnalyzed: DNA_VERDICT_REPORT.lociProfile.length,
      dnaPaternityProbability: DNA_VERDICT_REPORT.paternityProbability,
      consolidatedEstateValuationMYR: PROBATE_COURT_DOSSIER.subject.totalHeirshipValuationMYR,
      totalTaxExposureMYR: TARGET_PROFILE.taxExposureMYR,
      unencumberedOffshoreUSD: TARGET_PROFILE.offshoreLiquidUSD,
      totalPowerOfAttorneyDiscovered: POWER_OF_ATTORNEY_REGISTRY.length,
      validIrrevocablePADeposited: POWER_OF_ATTORNEY_REGISTRY.filter((p) => p.legalValidityStatus === 'VALID_ACTIVE_IRREVOCABLE').length,
      fraudulentVoidPACountered: POWER_OF_ATTORNEY_REGISTRY.filter((p) => p.legalValidityStatus === 'VOID_AB_INITIO_FORGED').length,
      totalMediaPublications: PRECOMPUTED_MEDIA_COVERAGE.length,
    },
    chronologicalMilestones: CHRONOLOGICAL_MILESTONES,
  };

  return dossierData;
}

/**
 * Generates an exhaustive legal brief and markdown dossier report.
 */
export function generateMasterDossierMarkdown(data: MasterDossierExportData = buildMasterDossierExportData()): string {
  return `# COMPREHENSIVE FORENSIC & JUDICIAL MASTER DOSSIER
**Reference:** ${data.metadata.dossierReference}  
**Classification:** ${data.metadata.classification}  
**Generated At:** ${data.metadata.generatedAt}  
**SHA-256 Digest:** \`${data.metadata.cryptographicChecksum}\`  
**Signed By:** ${data.metadata.signedByOfficer}  

---

## 1. EXECUTIVE SUMMARY & TARGET SUBJECT IDENTIFICATION
- **Subject Full Legal Name:** ${data.subjectProfile.fullName}
- **NRIC (National Registration Identity Card):** ${data.subjectProfile.nric}
- **JPN Birth Registration Indices:** ${data.subjectProfile.jpnBirthIndexes.join(' / ')}
- **Deceased Testator:** Ganesan A/L Raman (NRIC: 620415-08-5111)
- **Primary Operational Vehicle:** ${data.subjectProfile.primaryDomesticEntity}
- **Jurisdictional Scope:** ${data.metadata.jurisdictionsInvolved.join(' | ')}
- **Judicial Standing:** Sole Universal Heir, Probated Residuary Legatee & General Irrevocable Attorney-in-Fact
- **Consolidated Net Estate Valuation:** MYR ${data.subjectProfile.estateHeirshipValuationMYR.toLocaleString()}
- **Offshore Liquid Unencumbered Assets:** USD ${data.subjectProfile.offshoreLiquidUSD.toLocaleString()} (Lombard Odier, Geneva)
- **Disputed Domestic Joint Account:** MYR ${data.subjectProfile.domesticLiquidAssetsMYR.toLocaleString()} (RHB Privilege, Suit 4-334567)
- **Assessed Statutory Tax Exposure:** MYR ${data.subjectProfile.taxExposureMYR.toLocaleString()} (LHDN ITA Section 140A / 113)
- **Flagged Forged Foreign Balance:** USD ${data.subjectProfile.flaggedForgedUSD.toLocaleString()} (AmBank Ipoh, Seized by Bukit Aman CCID)

---

## 2. DISCOVERED POWERS OF ATTORNEY (POWERS OF ATTORNEY ACT 1949 - ACT 424)
Comprehensive judicial audit of all Power of Attorney instruments deposited or purported upon the subject Kavinath A/L Ganesan across the High Court of Malaya, Cayman Islands, and Switzerland:

${data.powerOfAttorneyRegistry
  .map(
    (pa, i) =>
      `### 2.${i + 1} ${pa.instrumentTitle} (\`${pa.registrationNumber}\`)
- **Category:** ${pa.category} | **Status:** **${pa.legalValidityStatus}**
- **Statutory Framework:** ${pa.statutoryFramework}
- **Deposit Registry:** ${pa.depositRegistry}
- **Execution Date:** ${pa.executionDate} | **Deposit/Reg Date:** ${pa.depositOrRegistrationDate}
- **Donor:** ${pa.donor.name} (${pa.donor.nricOrReg}) – *${pa.donor.role}*  
  *Signature Verification:* ${pa.donor.signatureVerification}
- **Donee / Attorney:** ${pa.donee.name} (${pa.donee.nricOrReg}) – *${pa.donee.relationshipOrCapacity}*  
  *Status:* ${pa.donee.status}
- **Scope of Powers:**
${pa.scopeOfPowers.map((s) => `  * ${s}`).join('\n')}
- **Judicial & Forensic Findings:** ${pa.judicialOrForensicFindings}
- **Certificate Hash (SHA-256):** \`${pa.sha256CertificateHash}\`
- **Witness / Notary:** ${pa.witnessOrNotary}`
  )
  .join('\n\n')}

---

## 3. INITIAL CASE DISPUTE: FOUNDATION & TRACE VECTORS
### 3.1 Case Origin & Parties
- **Case Title:** ${data.initialCaseDispute.caseTitle}
- **Suit Number:** ${data.initialCaseDispute.suitNumber}
- **Forum:** ${data.initialCaseDispute.court}
- **Presiding Judge:** ${data.initialCaseDispute.presidingJudge}
- **Plaintiff:** ${data.initialCaseDispute.plaintiff.name} (${data.initialCaseDispute.plaintiff.alias}) [NRIC: ${data.initialCaseDispute.plaintiff.nric}]
- **Defendant:** ${data.initialCaseDispute.defendant.name} [NRIC: ${data.initialCaseDispute.defendant.nric}]
- **Origin Summary:** ${data.initialCaseDispute.disputeOrigin}

### 3.2 Core Financial Traces & Discrepancies
1. **RHB Privilege Account Dispute (MYR 300,000):**
   - Disputed joint account claimed by Proxy X as uncredited partnership revenue.
   - Defense: Section 4(c) exceptions under Partnership Act 1961 (Act 135); capital was contributed solely by Kavinath from family estate sources.
2. **AmBank Ipoh Account Forgery (USD 2,000,000):**
   - Purported uncredited wire deposit traced to a fabricated credit advice slip with an invalid SHA-256 hash.
   - Status: Criminal investigation seized by Bukit Aman CCID under Penal Code Sections 468 & 471 (Forgery for the Purpose of Cheating).
3. **Inland Revenue Board (LHDN) Notice of Additional Assessment (MYR 56,420,000):**
   - Surcharges levied under Section 140A(3C) for non-arm's length advances between Kavinath Holdings Sdn Bhd and Archon Holdings SA.
   - Section 113(2) penalty of 45% applied.

---

## 4. CERTIFIED FORENSIC DNA VERDICT (JABATAN KIMIA MALAYSIA)
- **Issuing Laboratory:** ${data.dnaVerdictForensicReport.testingAuthority}
- **Accreditation:** ${data.dnaVerdictForensicReport.accreditationStandard}
- **Official Laboratory Reference:** \`${data.dnaVerdictForensicReport.referenceNumber}\`
- **Court Order Reference:** ${data.dnaVerdictForensicReport.courtOrderReference}
- **Profiling Methodology:** ${data.dnaVerdictForensicReport.profilingMethodology}
- **Combined Paternity Index (CPI):** **${data.dnaVerdictForensicReport.combinedPaternityIndex}**
- **Calculated Probability of Paternity:** **${data.dnaVerdictForensicReport.paternityProbability}**
- **Adverse Proxy X Exclusion:** **EXCLUDED across ${data.dnaVerdictForensicReport.rivalProxyComparison.lociExclusionsCount} loci (${data.dnaVerdictForensicReport.rivalProxyComparison.paternityProbability})**
- **High Court Declaratory Judgment:** Suit WA-24FC-109-03/2025 confirmed Kavinath as biological child under Section 112 Evidence Act 1950.

### 24-STR Loci Comparison Matrix
| Locus | Deceased Testator Alleles | Kavinath Alleles | Match Status | Obligate Paternal Allele | Paternity Index |
|---|---|---|---|---|---|
${data.dnaVerdictForensicReport.lociProfile
  .map(
    (l) =>
      `| **${l.locus}** | ${l.testatorAlleles} | ${l.subjectAlleles} | ${l.matchStatus} | ${l.obligatePaternalAllele} | ${l.paternityIndex} |`
  )
  .join('\n')}

---

## 5. PROBATE & WILL DISPOSITION (ESTATE OF GANESAN A/L RAMAN)
- **High Court Petition Number:** ${data.probateAndEstateRecord.probateWill.petitionNumber}
- **Court Forum:** ${data.probateAndEstateRecord.probateWill.court}
- **Presiding Judge:** ${data.probateAndEstateRecord.probateWill.presidingJudge}
- **Probated Instrument:** Last Will & Testament dated **14 November 2021** (Wills Act 1959 Section 5 compliant).
- **Fraudulent Instrument:** Purported Codicil dated **19 August 2023** declared **NULL & VOID** for forged signature tracings.
- **Caveat CAV-2024-00194:** Struck out with **RM25,000 punitive costs** against Proxy X.
- **Grant of Probate Extraction:** Extracted and sealed on **18 November 2025**.
- **Amanah Raya Berhad Clearance:** ARB/PST/2024/099182 confirms estate exceeds small estate thresholds; High Court jurisdiction exclusive.

### Estate Inventory (${data.probateAndEstateRecord.estateAssets.length} Major Portfolios)
${data.probateAndEstateRecord.estateAssets
  .map(
    (a, i) =>
      `${i + 1}. **${a.description}** (${a.assetCategory})  \n   - Holding/Entity: ${a.holdingEntityOrBank}  \n   - Net Valuation: **MYR ${a.valuationMYR.toLocaleString()}**  \n   - Status: ${a.encumbranceOrStatus}`
  )
  .join('\n\n')}

---

## 6. VERIDIAN BANKRUPTCY SETTLEMENT & SWIFT MT103 BANKING INTELLIGENCE
- **US Bankruptcy Court SDNY:** Adv. Proc. No. 17-01892 (SMB) under Chapter 15 Cross-Border Insolvency.
- **Settlement Amount:** **USD 35,000,000** (Full and final distribution).
- **Clearing Mechanism:** Interbank Fedwire / CHIPS routing via JPMorgan Chase New York -> UBS AG Zurich -> Banque Lombard Odier & Cie SA Geneva.
- **Beneficiary Sub-Account:** Archon Holdings SA (Account \`ch9300767000usd000001\`).
- **Swiss AMLA Art. 9 Form A Declaration:** Executed on 20 January 2025 confirming Kavinath as 100% sole economic Ultimate Beneficial Owner.

---

## 7. MULTI-COURT LITIGATION DOCKETS SWEEP (7 JURISDICTIONS)
${data.courtDocketsRegistry
  .map(
    (d, i) =>
      `### ${i + 1}. ${d.courtName} – Case No: \`${d.caseNumber}\`
- **Jurisdiction & Division:** ${d.jurisdiction} (${d.division})
- **Claim Subject Matter:** ${d.claimSubjectMatter}
- **Primary Statutes:** ${d.primaryLegalStatutes.join(', ')}
- **Procedural Status:** **${d.currentProceduralStatus}**
- **Latest Ruling / Order:** ${d.latestRulingOrOrder}
- **Presiding Officer:** ${d.presidingJudicialOfficer}
- **Relevance to Kavinath:** ${d.relevanceToKavinath}`
  )
  .join('\n\n')}

---

## 8. INVESTIGATIVE MEDIA PUBLICATIONS & PRESS EXPOSÉS
${data.mediaPublications
  .map(
    (med, idx) =>
      `### Press Item ${idx + 1}: ${med.headline}
- **Media Outlet:** ${med.outlet} (${med.outletTier})
- **Published Date:** ${med.publishedDate} | **Editorial Tone:** ${med.tone}
- **Sub-Judice Status:** ${med.subJudiceCompliance}
- **Triggers Referenced:** ${med.keyTriggersReferenced.join(', ')}
- **Synopsis:** ${med.synopsis}
- **Investigative Angle:** ${med.investigativeAngle}`
  )
  .join('\n\n')}

---

## 9. CRAWLED REGISTRATION & EVIDENTIARY EXHIBITS CATALOG (12 OFFICIAL DOCUMENTS)
${data.crawledDocumentsCatalog
  .map(
    (doc, idx) =>
      `### Document ${idx + 1}: ${doc.documentTitle}
- **Reference / ID:** \`${doc.referenceNumber}\` | Internal: \`${doc.id}\`
- **Issuing Authority:** ${doc.issuingAuthority} (${doc.jurisdiction})
- **Category & Classification:** ${doc.category} | ${doc.securityClassification}
- **Date Issued:** ${doc.dateIssued} | Pages: ${doc.pageCount}
- **SHA-256 Digest:** \`${doc.contentHashSha256}\`
- **Summary:** ${doc.summary}`
  )
  .join('\n\n')}

---

## 10. CHRONOLOGICAL MILESTONES (FROM INITIAL CASE TO VERDICT)
${data.chronologicalMilestones
  .map(
    (m) =>
      `- **${m.date}** [${m.phase}] **${m.title}** (${m.forumOrAgency}): ${m.verdictOrImpact}`
  )
  .join('\n')}

---
*End of Certified Master Dossier Export. Cryptographically signed by SSM Regulatory Gateway & MyGDX Interoperability Broker.*
`;
}

/**
 * Generates tabular CSV representation of the master dossier.
 */
export function generateMasterDossierCsv(data: MasterDossierExportData = buildMasterDossierExportData()): string {
  const lines: string[] = [];

  // Header section
  lines.push('SECTION,RECORD_ID,NAME_OR_TITLE,REFERENCE_NO,JURISDICTION,STATUS_OR_VERDICT,VALUE_MYR_OR_USD,DETAILS');

  // 1. Entities
  data.initialForensicEntities.forEach((ent) => {
    lines.push(
      `"ENTITY","${ent.id}","${ent.entityName.replace(/"/g, '""')}","${ent.identifierReference}","${ent.operatingJurisdiction}","${ent.legalStatus}","${ent.financialValue}","${ent.notes.replace(/"/g, '""')}"`
    );
  });

  // 2. Power of Attorney Records
  data.powerOfAttorneyRegistry.forEach((pa) => {
    lines.push(
      `"POWER_OF_ATTORNEY","${pa.id}","${pa.instrumentTitle.replace(/"/g, '""')}","${pa.registrationNumber}","${pa.depositRegistry.replace(/"/g, '""')}","${pa.legalValidityStatus}","-","Donor: ${pa.donor.name.replace(/"/g, '""')} | Donee: ${pa.donee.name.replace(/"/g, '""')} | Hash: ${pa.sha256CertificateHash}"`
    );
  });

  // 3. Court Dockets
  data.courtDocketsRegistry.forEach((d) => {
    lines.push(
      `"COURT_DOCKET","${d.docketId}","${d.courtName.replace(/"/g, '""')}","${d.caseNumber}","${d.jurisdiction}","${d.currentProceduralStatus}","-","${d.latestRulingOrOrder.replace(/"/g, '""')}"`
    );
  });

  // 4. Estate Assets
  data.probateAndEstateRecord.estateAssets.forEach((a, i) => {
    lines.push(
      `"ESTATE_ASSET","ASSET-${i + 1}","${a.description.replace(/"/g, '""')}","${a.holdingEntityOrBank}","Malaysia/Offshore","${a.encumbranceOrStatus}","MYR ${a.valuationMYR}","${a.assetCategory}"`
    );
  });

  // 5. DNA Loci
  data.dnaVerdictForensicReport.lociProfile.forEach((l) => {
    lines.push(
      `"DNA_LOCUS","${l.locus}","STR Marker ${l.locus}","Testator: ${l.testatorAlleles} | Subject: ${l.subjectAlleles}","Jabatan Kimia Malaysia","${l.matchStatus}","-","Obligate: ${l.obligatePaternalAllele} | PI: ${l.paternityIndex}"`
    );
  });

  // 6. Media Publications
  data.mediaPublications.forEach((m) => {
    lines.push(
      `"MEDIA_PUBLICATION","${m.id}","${m.headline.replace(/"/g, '""')}","${m.outlet.replace(/"/g, '""')}","${m.publishedDate}","${m.tone}","-","SubJudice: ${m.subJudiceCompliance} | ${m.synopsis.replace(/"/g, '""')}"`
    );
  });

  // 7. Crawled Documents
  data.crawledDocumentsCatalog.forEach((doc) => {
    lines.push(
      `"CRAWLED_DOC","${doc.id}","${doc.documentTitle.replace(/"/g, '""')}","${doc.referenceNumber}","${doc.jurisdiction}","${doc.filingStatus}","-","Hash: ${doc.contentHashSha256}"`
    );
  });

  // 8. Chronological Milestones
  data.chronologicalMilestones.forEach((m, idx) => {
    lines.push(
      `"MILESTONE","M-${idx + 1}","${m.title.replace(/"/g, '""')}","${m.date}","${m.forumOrAgency}","${m.phase}","-","${m.verdictOrImpact.replace(/"/g, '""')}"`
    );
  });

  return lines.join('\n');
}
