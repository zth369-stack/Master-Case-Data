export type EnvironmentMode = 'sandbox' | 'staging' | 'production';

export type CredentialStrength = 'strong' | 'moderate' | 'weak' | 'missing';

export interface CredentialStatus {
  keyName: string;
  isConfigured: boolean;
  maskedValue: string;
  strength: CredentialStrength;
  description: string;
  notes?: string;
}

export interface SanitizedMyGdxConfig {
  gatewayUrl: string;
  agencyCode: string;
  environment: EnvironmentMode;
  timeoutMs: number;
  consumerKeyStatus: CredentialStatus;
  consumerSecretStatus: CredentialStatus;
}

export interface SanitizedSsmConfig {
  apiBaseUrl: string;
  environment: EnvironmentMode;
  allowedEndpoints: string[];
  userIdStatus: CredentialStatus;
  secretTokenStatus: CredentialStatus;
  signingSecretStatus: CredentialStatus;
}

export interface SecurityPosture {
  enforceHttps: boolean;
  auditLoggingEnabled: boolean;
  isProductionReady: boolean;
  complianceRating: 'COMPLIANT' | 'WARNING' | 'NON_COMPLIANT';
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

export interface SanitizedConfigReport {
  timestamp: string;
  environment: EnvironmentMode;
  mygdx: SanitizedMyGdxConfig;
  ssm: SanitizedSsmConfig;
  security: SecurityPosture;
}

export interface SsmCompanyStatus {
  entityType: 'ROC' | 'ROB' | 'LLP';
  registrationNumber: string;
  oldRegistrationNumber?: string;
  companyName: string;
  incorporationDate: string;
  companyStatus: 'EXISTING' | 'DISSOLVED' | 'WINDING_UP' | 'STRUCK_OFF' | 'ACTIVE' | 'EXPIRED';
  companyType: string;
  registeredAddress: {
    addressLine1: string;
    addressLine2?: string;
    postcode: string;
    city: string;
    state: string;
  };
  complianceStatus: {
    lastAnnualReturnYear?: number;
    lastFinancialStatementYear?: number;
    hasActiveCompound: boolean;
    compoundCount: number;
    isDirectorBlacklisted: boolean;
  };
  verifiedBy: string;
  retrievedAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  agencyCode: string;
  endpoint: string;
  queryParam: string;
  httpStatus: number;
  statusText: string;
  hmacVerified: boolean;
  durationMs: number;
}

// -------------------------------------------------------------
// Account Management & Key Ingestion Types
// -------------------------------------------------------------
export type ClearanceLevel = 'RESTRICTED' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET';

export interface IngestedKeySet {
  mygdxConsumerKey: string;
  mygdxConsumerSecret: string;
  ssmUserId: string;
  ssmSecretToken: string;
  ssmSigningSecret: string;
  eKehakimanToken: string;
  icijApiKey: string;
}

export interface OfficerAccount {
  id: string;
  fullName: string;
  badgeNumber: string;
  email: string;
  organization: string; // e.g. "Inland Revenue Board of Malaysia (LHDN)", "Suruhanjaya Syarikat Malaysia (SSM)", "Bank Negara Malaysia (BNM)", "Approved GLC / Financial Institution"
  role: string;
  clearanceLevel: ClearanceLevel;
  createdAt: string;
  lastLogin: string;
  keyFingerprint: string;
  ingestionStatus: {
    mygdx: boolean;
    ssm: boolean;
    eKehakiman: boolean;
    icij: boolean;
  };
}

// -------------------------------------------------------------
// Forensic Document Verification & Entity Reconciliation Types
// -------------------------------------------------------------
export interface ForensicEntity {
  id: string;
  entityName: string;
  identifierType: 'NRIC' | 'SSM' | 'LOMBARD_ODIER' | 'CIMA_INSTRUMENT' | 'COURT_DOCKET' | 'BANK_ACCOUNT' | 'LHDN_FILE';
  identifierReference: string;
  operatingJurisdiction: string;
  operationalRole: string;
  legalStatus: string;
  financialValue: string;
  riskRating: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  notes: string;
}

export interface VerifiableDocument {
  id: string;
  documentTitle: string;
  documentCategory: 'SSM_REGISTRATION' | 'COURT_DOCKET' | 'BANK_LEDGER' | 'TAX_ASSESSMENT' | 'CIMA_FREEZE_ORDER' | 'OFFSHORE_AGREEMENT';
  issuingAuthority: string;
  referenceNumber: string;
  dateIssued: string;
  fileFormat: string;
  fileSizeBytes: number;
  expectedSha256: string;
  actualSha256: string;
  verificationStatus: 'VERIFIED' | 'TAMPERED_FORGED' | 'FROZEN' | 'UNDER_LITIGATION' | 'PENDING';
  summaryDescription: string;
  extractedMetadata: Record<string, string | number | boolean>;
  verificationChecks: {
    sha256Match: boolean;
    ssmStatusConfirmed: boolean;
    mygdxHmacSigned: boolean;
    eKehakimanVerified: boolean;
    icijReconciled: boolean;
  };
  forensicAlerts: string[];
  statutoryProvisions: string[];
}

export interface DocumentVerificationReport {
  timestamp: string;
  verifiedByOfficer: string;
  officerBadge: string;
  agency: string;
  document: VerifiableDocument;
  forensicScore: number; // 0 to 100
  authenticityStatus: 'GENUINE_VERIFIED' | 'FRAUD_DETECTED' | 'REGULATORY_RESTRICTED';
  recommendedActions: string[];
}

// -------------------------------------------------------------
// Case Dispute, Trigger Trace & AI Media Coverage Types
// -------------------------------------------------------------
export interface CaseDisputeCore {
  caseTitle: string;
  suitNumber: string;
  court: string;
  presidingJudge: string;
  plaintiff: {
    name: string;
    alias: string;
    nric: string;
    claimedRole: string;
    legalCounsel: string;
  };
  defendant: {
    name: string;
    nric: string;
    corporateRole: string;
    legalCounsel: string;
  };
  disputeOrigin: string;
  primaryLegalIssues: {
    issueId: string;
    title: string;
    statutoryBasis: string;
    description: string;
    significance: string;
  }[];
  financialWeb: {
    domesticDisputeMYR: number;
    disputedAccount: string;
    offshoreLombardOdierUSD: number;
    offshoreEntity: string;
    caymanTrustUSD: number;
    lhdnTaxDemandMYR: number;
    fraudulentCreditTraceUSD: number;
  };
  keyCorporateEntities: {
    entityName: string;
    jurisdiction: string;
    registrationOrAccount: string;
    roleInDispute: string;
  }[];
  criticalContradictions: string[];
}

export interface CaseTrigger {
  triggerId: string;
  code: string;
  timestamp: string;
  sourceAgency: string;
  eventType: string;
  summary: string;
  evidentiaryArtifact: string;
  cascadingTriggers: string[];
  status: 'ACTIVE_SUB_JUDICE' | 'FLAGGED_FRAUD' | 'FROZEN_CIMA' | 'STATUTORY_DEMAND' | 'UNENCUMBERED_OFFSHORE' | 'TRACED_RECONCILED';
  riskScore: number;
  mediaProbability: number;
  subJudiceSensitivity: 'EXTREME' | 'HIGH' | 'MODERATE' | 'LOW';
  crossJurisdictionScope: string[];
  tracedRippleEffect: string;
}

export interface HistoricalPrecedent {
  citation: string;
  caseName: string;
  courtAndYear: string;
  keyLegalPrinciple: string;
  applicabilityToCurrentDispute: string;
  judicialOutcomeRatio: string;
  mediaRelevance: string;
}

export interface MediaCoverageItem {
  id: string;
  outlet: string;
  outletTier: 'Tier 1 Financial' | 'National Investigative' | 'International Wire' | 'Legal Bar Review';
  headline: string;
  publishedDate: string;
  tone: 'CRITICAL_EXPOSE' | 'NEUTRAL_LEGAL' | 'SENSATIONAL_BREAKING' | 'REGULATORY_ALERT';
  synopsis: string;
  subJudiceCompliance: 'COMPLIANT' | 'BORDERLINE_SUB_JUDICE' | 'FLAGGED_PREJUDICIAL';
  keyTriggersReferenced: string[];
  investigativeAngle: string;
}

export interface SwiftLogEntry {
  id: string;
  transferId: string;
  messageType: 'MT103' | 'MT202_COV' | 'MT799' | 'RENTAS_IBG' | 'LHDN_ATTACHMENT';
  date: string;
  uetr: string; // SWIFT Unique End-to-end Transaction Reference
  senderBic: string;
  senderBank: string;
  senderAccount: string;
  senderEntity: string;
  receiverBic: string;
  receiverBank: string;
  receiverAccount: string;
  receiverEntity: string;
  intermediaryBic?: string;
  intermediaryBank?: string;
  clearingSystem: 'CHIPS / Fedwire' | 'Swiss Interbank Clearing (SIC)' | 'RENTAS (Malaysia)' | 'Fabricated / Unverified Core';
  amount: number;
  currency: 'USD' | 'MYR' | 'CHF';
  purposeCode: string;
  status: 'SETTLED_UNENCUMBERED' | 'FROZEN_REGULATORY' | 'FORGED_REJECTED' | 'SUB_JUDICE_FROZEN' | 'STATUTORY_GARNISHMENT';
  cryptographicHash: string;
  hashVerificationResult: 'MATCH_VALID' | 'FORGED_MISMATCH' | 'IMMOBILIZED';
  forensicNotes: string;
  rawSwiftPayload: string;
}

export interface UboProfile {
  uboName: string;
  nric: string;
  jpnRegistration: string;
  taxIdentificationNumber: string;
  primaryJurisdiction: string;
  crossBorderStatus: string;
  totalTracedNetWorthUSD: number;
  effectiveTaxLiabilityMYR: number;
  entitiesControlled: {
    entityId: string;
    entityName: string;
    jurisdiction: string;
    instrumentOrAccount: string;
    ownershipType: 'DIRECT_EQUITY' | 'BENEFICIAL_FORM_A' | 'TRUST_SETTLOR' | 'DISPUTED_PROXY_SIGNATORY';
    percentageOwnership: number;
    financialValue: string;
    encumbranceStatus: 'UNENCUMBERED' | 'CIMA_FROZEN' | 'SUB_JUDICE_LITIGATED' | 'AUDIT_FLAGGED';
    uboDisclosureStandard: string;
  }[];
  proxyRelationships: {
    proxyName: string;
    nric: string;
    claimedCapacity: string;
    actualLegalStanding: string;
    partnershipActDefense: string;
  }[];
  statutoryDeclarations: {
    authority: string;
    filingRef: string;
    filingDate: string;
    declarationSummary: string;
  }[];
}

export interface GenerateMediaAnalysisResponse {
  source: 'gemini-3.8-flash' | 'evidentiary_simulation';
  timestamp: string;
  generatedHeadline: string;
  mediaArticleHtml: string;
  subJudiceRiskAnalysis: {
    riskRating: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    contemptOfCourtWarning: string;
    safeHarborRecommendations: string[];
  };
  historicalPrecedentMatch: {
    caseName: string;
    citation: string;
    correlationFactor: string;
    practicalLesson: string;
  };
  tracedRippleEffects: string[];
  keyQuotes: {
    speaker: string;
    quote: string;
  }[];
}

export interface VeridianSettlementAnalysis {
  isCryptoLiquidation: boolean;
  actualSettlementNature: string;
  legalOrigin: string;
  docketReference: string;
  jurisdiction: string;
  settlementTotalUSD: number;
  settlementDate: string;
  distributionChannel: string;
  cryptoLayeringAttemptDetails: {
    attemptDetected: boolean;
    layeringDescription: string;
    involvedEntities: string[];
    whyCryptoWasSuspected: string;
    forensicConclusion: string;
  };
  swiftAuditTrailSummary: {
    totalHops: number;
    unencumberedUSD: number;
    frozenOffshoreUSD: number;
    fabricatedUSD: number;
    disputedDomesticMYR: number;
    sovereignTaxDemandMYR: number;
  };
}

// -------------------------------------------------------------
// Targeted Document Crawler, Scraper & Modern AI Code Retrieval Types
// -------------------------------------------------------------
export type TargetDocumentCategory =
  | 'INCORPORATION_DOCUMENTS'
  | 'TRUST_DOCUMENTS'
  | 'BANK_ACCOUNT_OPENING'
  | 'COMPANY_REGISTRATION';

export interface ScrapedDocument {
  id: string;
  documentTitle: string;
  category: TargetDocumentCategory;
  issuingAuthority: string;
  jurisdiction: string;
  referenceNumber: string;
  dateIssued: string;
  filingStatus: 'ACTIVE_REGISTERED' | 'FROZEN_REGULATORY' | 'LITIGATION_EXHIBIT' | 'AMLA_DECLARED' | 'SUSPECT_ALTERED';
  sourceUrlOrTarget: string;
  crawlerSpider: string;
  httpStatus: number;
  contentHashSha256: string;
  pageCount: number;
  summary: string;
  keyParties: {
    name: string;
    role: string;
    identification: string;
  }[];
  extractedClauses: {
    clauseNumber: string;
    heading: string;
    text: string;
  }[];
  rawExtractedText: string;
  codeSnippetRef?: string;
  securityClassification: 'PUBLIC_RECORD' | 'CONFIDENTIAL_BANKING' | 'COURT_EVIDENCE' | 'CIMA_RESTRICTED';
  signatureVerified: boolean;
  signatories: string[];
}

export interface CrawlerTargetConfig {
  id: string;
  name: string;
  targetCategory: TargetDocumentCategory;
  baseUrl: string;
  scrapingMethod: 'HEADLESS_DOM' | 'REST_API_SPIDER' | 'SWIFT_ALLIANCE_CONNECTOR' | 'COURT_PACER_PARSER';
  rateLimitMs: number;
  requiresAuth: boolean;
  jurisdiction: string;
  lastCrawledAt: string;
  documentsFound: number;
  status: 'IDLE' | 'ACTIVE_CRAWLING' | 'COMPLETED' | 'RATE_LIMITED';
  selectorPatterns: string[];
}

export interface CrawlerExecutionLog {
  id: string;
  timestamp: string;
  spiderName: string;
  targetEndpoint: string;
  category: TargetDocumentCategory;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  httpStatus: number;
  documentsHarvested: number;
  bytesHarvested: number;
  durationMs: number;
  details: string;
}

export interface AiCodeRetrievalSnippet {
  id: string;
  title: string;
  language: 'typescript' | 'python' | 'solidity' | 'swift_mt' | 'json_schema';
  category: TargetDocumentCategory | 'CORE_PARSER';
  astType: 'FUNCTION_DECLARATION' | 'INTERFACE_SCHEMA' | 'SECURITY_RULE' | 'VALIDATOR_HOOK';
  relevanceScore: number; // 0.0 to 1.0 (cosine semantic similarity)
  description: string;
  code: string;
  targetDocumentIds: string[];
  semanticTags: string[];
}

export interface AiDocumentRetrievalRequest {
  query: string;
  categoryFilter?: TargetDocumentCategory | 'ALL';
  jurisdictionFilter?: string;
  includeCodeSnippets?: boolean;
  minSimilarityScore?: number;
}

export interface AiDocumentRetrievalResponse {
  source: 'gemini-3.8-flash' | 'semantic_vector_retrieval';
  query: string;
  timestamp: string;
  aiSynthesis: string;
  topDocuments: {
    document: ScrapedDocument;
    similarityScore: number;
    matchingPassages: string[];
  }[];
  retrievedCodeSnippets: AiCodeRetrievalSnippet[];
  recommendedLegalActions: string[];
}

// -------------------------------------------------------------
// Probate, Wills, Court Dockets & DNA Verdict Types
// -------------------------------------------------------------
export interface StrLocusAnalysis {
  locus: string;
  testatorAlleles: string;
  subjectAlleles: string;
  obligatePaternalAllele: string;
  matchStatus: 'MATCH' | 'EXCLUSION' | 'INFORMATIVE';
  paternityIndex: number;
}

export interface DnaVerdictForensicReport {
  reportId: string;
  referenceNumber: string;
  subjectName: string;
  subjectNric: string;
  deceasedTestatorName: string;
  deceasedTestatorNric: string;
  testingAuthority: string;
  accreditationStandard: string;
  leadForensicGeneticist: string;
  courtOrderReference: string;
  courtOrderDate: string;
  testingDate: string;
  certifiedDate: string;
  admissibilityRulingDate: string;
  profilingMethodology: string;
  combinedPaternityIndex: string;
  paternityProbability: string; // e.g. "99.9999%"
  verdictDetermination: 'PATERNITY_CONFIRMED' | 'EXCLUDED' | 'INCONCLUSIVE';
  biologicalRelationshipStatement: string;
  rivalProxyComparison: {
    proxyName: string;
    proxyNric: string;
    lociExclusionsCount: number;
    paternityProbability: string;
    judicialConclusion: string;
  };
  lociProfile: StrLocusAnalysis[];
  judicialVerdictOrder: {
    presidingJudge: string;
    court: string;
    rulingSummary: string;
    statutoryProvisionsInvoked: string[];
    adverseCaveatStatus: string;
  };
  cryptographicHashSha256: string;
}

export interface ProbateWillRecord {
  estateId: string;
  estateName: string;
  petitionNumber: string;
  court: string;
  presidingJudge: string;
  deceasedName: string;
  deceasedNric: string;
  dateOfDeath: string;
  placeOfDeath: string;
  lastKnownAddress: string;
  willDate: string;
  witnessesToWill: string[];
  namedExecutor: string;
  namedBeneficiaries: {
    beneficiaryName: string;
    nric: string;
    relationship: string;
    allocatedShare: string;
    inheritanceType: 'SPECIFIC_BEQUEST' | 'RESIDUARY_ESTATE' | 'TRUST_BENEFICIARY';
  }[];
  disputedCodicil: {
    codicilDate: string;
    proponentName: string;
    claimedVariation: string;
    judicialDisposition: 'DECLARED_NULL_AND_VOID' | 'PENDING' | 'PROBATED';
    groundsForInvalidity: string[];
  };
  caveatProceedings: {
    caveatReference: string;
    caveatorName: string;
    groundsAlleged: string;
    disposition: 'STRUCK_OUT_WITH_COSTS' | 'ACTIVE' | 'SETTLED';
    courtOrderDate: string;
  };
  probateGrantStatus: 'PROBATE_GRANTED' | 'PETITION_PENDING' | 'CAVEATED' | 'LETTERS_OF_ADMINISTRATION';
  probateGrantDate: string;
  totalEstimatedEstateMYR: number;
  estateAssetInventory: {
    assetCategory: 'REAL_ESTATE' | 'CORPORATE_EQUITY' | 'BANK_DEPOSITS' | 'OFFSHORE_TRUST' | 'PERSONAL_PROPERTY';
    description: string;
    valuationMYR: number;
    holdingEntityOrBank: string;
    encumbranceOrStatus: string;
  }[];
  smallEstatesAndAmanahRayaClearance: {
    agencyRef: string;
    clearanceStatus: string;
    statutoryCeilingExceeded: boolean;
  };
}

export interface CourtDocketRecord {
  docketId: string;
  caseNumber: string;
  courtName: string;
  jurisdiction: 'MALAYSIA_HIGH_COURT' | 'MALAYSIA_SESSIONS_COURT' | 'CAYMAN_GRAND_COURT' | 'SWISS_GENEVA_TRIBUNAL' | 'US_BANKRUPTCY_SDNY';
  division: 'PROBATE_ADMINISTRATION' | 'FAMILY_CIVIL' | 'COMMERCIAL' | 'CYBER_COMMERCIAL_CRIMES' | 'OFFSHORE_FIDUCIARY' | 'CROSS_BORDER_INSOLVENCY';
  filingDate: string;
  parties: {
    plaintiffsOrPetitioners: string[];
    defendantsOrRespondents: string[];
  };
  claimSubjectMatter: string;
  primaryLegalStatutes: string[];
  currentProceduralStatus: 'FINAL_JUDGMENT_ENTERED' | 'PROBATE_GRANTED' | 'SUB_JUDICE_ACTIVE' | 'POLICE_INVESTIGATION_SEIZED' | 'DISMISSED_RES_JUDICATA';
  latestRulingOrOrder: string;
  presidingJudicialOfficer: string;
  relevanceToKavinath: string;
  evidenceArtifacts: string[];
}

export interface ProbateCourtInvestigationDossier {
  subject: {
    fullName: string;
    nric: string;
    jpnBirthPlace: string;
    fatherName: string;
    statusInEstate: string;
    dnaVerificationStatus: string;
    totalHeirshipValuationMYR: number;
  };
  probateRecord: ProbateWillRecord;
  courtDockets: CourtDocketRecord[];
  dnaVerdict: DnaVerdictForensicReport;
  keyLegalContradictionsResolved: string[];
  executiveSummary: string;
}

export interface AiProbateInvestigationRequest {
  query: string;
  focusArea?: 'DNA_VERDICT' | 'PROBATE_WILL' | 'ALL_COURTS' | 'CROSS_JURISDICTION' | 'GENERAL';
}

export interface AiProbateInvestigationResponse {
  source: 'gemini-3.8-flash' | 'forensic_evidentiary_engine';
  query: string;
  timestamp: string;
  investigationAnalysis: string;
  dnaEvidenceWeight: string;
  probateStandingAssessment: string;
  courtJurisdictionMatrix: {
    court: string;
    caseNumber: string;
    relevance: string;
    status: string;
  }[];
  actionableFindings: string[];
}

export interface PowerOfAttorneyRecord {
  id: string;
  registrationNumber: string;
  instrumentTitle: string;
  category:
    | 'HIGH_COURT_DEPOSITED_GENERAL'
    | 'IRREVOCABLE_COMMERCIAL'
    | 'OFFSHORE_TRUST_MANDATE'
    | 'CORPORATE_BANKING'
    | 'FRAUDULENT_PURPORTED'
    | 'STATUTORY_REVOCATION';
  statutoryFramework: string;
  depositRegistry: string;
  executionDate: string;
  depositOrRegistrationDate: string;
  donor: {
    name: string;
    nricOrReg: string;
    role: string;
    signatureVerification: string;
  };
  donee: {
    name: string;
    nricOrReg: string;
    relationshipOrCapacity: string;
    status: string;
  };
  scopeOfPowers: string[];
  legalValidityStatus:
    | 'VALID_ACTIVE_IRREVOCABLE'
    | 'VALID_EXECUTED_DEPOSITED'
    | 'VOID_AB_INITIO_FORGED'
    | 'SUPERSEDED_REVOKED';
  judicialOrForensicFindings: string;
  sha256CertificateHash: string;
  witnessOrNotary: string;
  isHeldByKavinath: boolean;
}

export interface MasterDossierExportData {
  metadata: {
    dossierReference: string;
    generatedAt: string;
    classification: string;
    version: string;
    cryptographicChecksum: string;
    signedByOfficer: string;
    agencyScope: string[];
    jurisdictionsInvolved: string[];
  };
  subjectProfile: {
    fullName: string;
    nric: string;
    jpnBirthIndexes: string[];
    status: string;
    primaryDomesticEntity: string;
    jurisdictions: string[];
    totalLiabilitiesMYR: number;
    domesticLiquidAssetsMYR: number;
    offshoreLiquidUSD: number;
    taxExposureMYR: number;
    flaggedForgedUSD: number;
    estateHeirshipValuationMYR: number;
  };
  initialCaseDispute: CaseDisputeCore;
  initialForensicEntities: ForensicEntity[];
  caseTriggersAndTraces: CaseTrigger[];
  powerOfAttorneyRegistry: PowerOfAttorneyRecord[];
  mediaPublications: MediaCoverageItem[];
  veridianSwiftAudit: {
    veridianSettlement: VeridianSettlementAnalysis;
    swiftLogs: SwiftLogEntry[];
    uboProfile: UboProfile;
  };
  probateAndEstateRecord: {
    probateWill: ProbateWillRecord;
    estateAssets: ProbateWillRecord['estateAssetInventory'];
  };
  dnaVerdictForensicReport: DnaVerdictForensicReport;
  courtDocketsRegistry: CourtDocketRecord[];
  crawledDocumentsCatalog: ScrapedDocument[];
  historicalPrecedents: HistoricalPrecedent[];
  transferPricingSimulation: {
    formula: string;
    loanPrincipalMYR: number;
    benchmarkRatePct: number;
    monthlyDeemedInterestMYR: number;
    annualDeemedInterestMYR: number;
    corporateTaxAdjustmentMYR: number;
    section113PenaltyMYR: number;
  };
  summaryStatistics: {
    totalEntitiesTracked: number;
    totalCourtDockets: number;
    totalCrawledDocuments: number;
    totalSwiftTransfers: number;
    totalHistoricalPrecedents: number;
    totalDnaLociAnalyzed: number;
    dnaPaternityProbability: string;
    consolidatedEstateValuationMYR: number;
    totalTaxExposureMYR: number;
    unencumberedOffshoreUSD: number;
    totalPowerOfAttorneyDiscovered: number;
    validIrrevocablePADeposited: number;
    fraudulentVoidPACountered: number;
    totalMediaPublications: number;
  };
  chronologicalMilestones: {
    date: string;
    title: string;
    forumOrAgency: string;
    verdictOrImpact: string;
    phase: 'INITIAL_DISPUTE' | 'BANKING_VERIDIAN' | 'PROBATE_DNA' | 'CRAWLER_SCRAPE' | 'POWER_OF_ATTORNEY';
  }[];
}

export interface AdditionalEvidentiaryDocument {
  id: string;
  documentTitle: string;
  agencyOrRegistry: string;
  officialReferenceNumber: string;
  issuanceDate: string;
  statutoryBasis: string;
  evidentiaryClassification: 'PRIMA_FACIE' | 'CONCLUSIVE_PROOF' | 'FORENSIC_CERTIFICATE' | 'APEX_JUDGMENT' | 'CRIMINAL_EXHIBIT';
  summaryFindings: string;
  relevanceToDispute: string;
  counterpartsExcludedOrRebutted: string;
  sha256VerificationHash: string;
  custodianSeal: string;
}

export interface PatriarchAndLineageDetails {
  patriarch: {
    fullName: string;
    nric: string;
    dateOfBirth: string;
    dateOfDeath: string;
    placeOfDeath: string;
    deathCertificateNumber: string;
    deathRegistryOffice: string;
    causeOfDeath: string;
    certifyingPathologist: string;
    estateReference: string;
    legacyStatus: string;
  };
  maternalParent: {
    fullName: string;
    nric: string;
    relationship: string;
    status: string;
  };
  subjectBirthCertificate: {
    certificateNumber: string;
    registrationNumber: string;
    issuingRegistry: string;
    registrationAct: string;
    fatherStated: string;
    fatherNric: string;
    motherStated: string;
    motherNric: string;
    legalStatus: string;
  };
  adoptionVerification: {
    searchCertificateNumber: string;
    statutoryActs: string[];
    officialFinding: string;
    registryStatus: string;
    presumptionOfBiologicalLegitimacy: string;
  };
}

export interface PersonalAssetProfile {
  bankAccounts: {
    institution: string;
    accountNumber: string;
    accountType: string;
    currency: string;
    status: string;
    verificationReference: string;
    tier: string;
  }[];
  realEstateProperties: {
    propertyName: string;
    titleReference: string;
    propertyType: string;
    location: string;
    encumbranceStatus: string;
    certifiedValuationMYR: number;
    valuationAgency: string;
  }[];
  vehicles: {
    makeModel: string;
    registrationPlate: string;
    chassisVin: string;
    ownershipCertNumber: string;
    yearOfManufacture: number;
    valuationMYR: number;
    status: string;
  }[];
}

export interface CorporateStructureHierarchy {
  holdingCompany: {
    companyName: string;
    ssmRegistrationNumber: string;
    incorporationDate: string;
    paidUpCapitalMYR: number;
    shareholdingPercentage: number;
    soleDirectorAndShareholder: string;
    companyStatus: string;
  };
  subsidiaries: {
    name: string;
    ssmOrRegistrationNumber: string;
    jurisdiction: string;
    equityOwnershipPct: number;
    principalActivity: string;
    status: string;
  }[];
  shareCapitalSummary: {
    authorizedShares: number;
    issuedShares: number;
    parValueMYR: number;
    votingControl: string;
  };
}

export interface LawEnforcementAndAmlaInvestigation {
  policeCcid: {
    investigatingAgency: string;
    investigatingOfficerName: string;
    ioRankAndDivision: string;
    seniorApprovingOfficer: string;
    policeReportNumber: string;
    investigationPaperRef: string;
    statutoryOffencesInvestigated: string[];
    ioStatementUnderS112Cpc: string;
    forensicDocumentReportRef: string;
    status: string;
  };
  bankNegaraMalaysiaAmla: {
    investigatingAgency: string;
    leadAmlaOfficerName: string;
    officerDesignation: string;
    amlaReportReference: string;
    statutoryProvisions: string;
    investigationFindings: string;
    assetFreezingOrderTarget: string;
    sourceOfFundsClearance: string;
    status: string;
  };
  lawyersOnRecord: {
    firmName: string;
    leadCounsel: string;
    barCouncilNumber: string;
    coCounsel: string;
    chamberAddress: string;
    activeCourtSuits: string[];
    warrantToActFilingDate: string;
    formalLegalStanding: string;
  };
}

export interface UnmaskedProxyXProfile {
  legalFullName: string;
  nricNumber: string;
  passportNumber: string;
  knownAliases: string[];
  residentialAddress: string;
  registeredVehicle: string;
  ssmDisqualificationRef: string;
  criminalCourtCaseNumber: string;
  penalCodeCharges: string[];
  amlaCharges: string[];
  currentLegalAndBailStatus: string;
  borderBlacklistNotice: string;
  scInvestorAlertStatus: string;
}

export interface ForensicThesisChapter {
  chapterNumber: string;
  romanNumeral: string;
  title: string;
  subtitle: string;
  statutoryAnchors: string[];
  keyEvidencesCited: string[];
  fullBodyText: string;
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  keyFindings: string[];
  adjudicatedConclusions: string;
}

export interface CompleteForensicThesisDossier {
  thesisMetadata: {
    thesisReference: string;
    academicAndJudicialTitle: string;
    classification: string;
    submissionGrade: string;
    issuingBodies: string[];
    principalSubject: {
      fullName: string;
      nric: string;
      birthCertificateRegistration: string;
      fiduciaryStanding: string;
    };
    deceasedPrincipal: {
      fullName: string;
      nric: string;
      dateOfDeath: string;
      deathCertificateNumber: string;
    };
    totalDocumentCount: number;
    totalExhibitsIndexed: number;
    totalCourtsAdjudicated: number;
    sha256MasterIntegrityDigest: string;
    compiledAt: string;
    leadCertifyingOfficer: string;
  };
  patriarchAndLineage: PatriarchAndLineageDetails;
  personalAssets: PersonalAssetProfile;
  corporateStructure: CorporateStructureHierarchy;
  lawEnforcementAndAmla: LawEnforcementAndAmlaInvestigation;
  unmaskedProxyX: UnmaskedProxyXProfile;
  additionalEvidences: AdditionalEvidentiaryDocument[];
  chapters: ForensicThesisChapter[];
  bindingLegalTheses: {
    thesisStatement: string;
    statutorySection: string;
    evidentiaryProof: string;
    unanimousJudicialPrecedent: string;
  }[];
}


