import JSZip from 'jszip';

export interface SkillManifest {
  id: string;
  name: string;
  filename: string;
  version: string;
  category: 'mcp' | 'forensics' | 'regulatory' | 'intelligence' | 'legal';
  description: string;
  toolsIncluded: string[];
  readme: string;
  schemaJson: object;
}

export const SKILL_PACKAGES: SkillManifest[] = [
  {
    id: 'courtlistener',
    name: 'CourtListener Legal & Docket MCP Skill',
    filename: 'courtlistener.skillux',
    version: '2.4.0',
    category: 'legal',
    description: 'Model Context Protocol server skill for searching Federal, State, and Appellate court dockets, oral arguments, judge profiles, judicial opinions, and Bluebook citations.',
    toolsIncluded: [
      'courtlistener_search_opinions',
      'courtlistener_search_dockets',
      'courtlistener_lookup_citation',
      'courtlistener_cross_jurisdiction_check',
    ],
    readme: `# CourtListener MCP Skill
Enables LLM agents to interface with CourtListener REST and RECAP APIs.
Supports search over 4M+ opinions, oral arguments, PACER dockets, and cross-jurisdictional litigation checks.

## Endpoints:
- MCP Server: /mcp/courtlistener
- REST API: /api/courtlistener/search

## Authentication:
Uses Free Law Project token passed via Authorization: Token <key> or MCP client environment variables.`,
    schemaJson: {
      type: 'skill',
      name: 'courtlistener',
      mcpEndpoints: ['/mcp/courtlistener', '/mcp'],
      capabilities: ['legal_search', 'citation_lookup', 'pacer_dockets'],
    },
  },
  {
    id: 'mygdx-ssm-middleware',
    name: 'MyGDX Restricted SSM Middleware MCP Skill',
    filename: 'mygdx-ssm-middleware.skillux',
    version: '3.1.0',
    category: 'regulatory',
    description: 'Malaysian Government Central Data Exchange (MyGDX) gateway skill for restricted SSM endpoints (ROC, ROB, LLP, Annual Returns, Section 198 Director Disqualifications, Financial Charges).',
    toolsIncluded: [
      'mygdx_ssm_query_roc',
      'mygdx_ssm_query_rob',
      'mygdx_ssm_query_llp',
      'mygdx_ssm_check_director_disqualification',
      'mygdx_ssm_charges_and_winding_up',
    ],
    readme: `# MyGDX Restricted SSM Middleware MCP Skill
Designed specifically for Government Agencies (LHDN, BNM, PDRM CCID, MAMPU), GLCs, and statutory bodies.
Enforces HMAC-SHA256 request signing, nonces, timestamp validation, and an internal cryptographic audit trail.`,
    schemaJson: {
      type: 'skill',
      name: 'mygdx-ssm-middleware',
      mcpEndpoints: ['/mcp/ssm', '/mcp'],
      capabilities: ['roc_query', 'rob_query', 'llp_query', 'director_screening', 'hmac_signing'],
    },
  },
  {
    id: 'icij-offshore-reconcile',
    name: 'ICIJ Offshore Leaks Reconcile Skill & MCP',
    filename: 'icij-offshore-reconcile.skillux',
    version: '1.9.0',
    category: 'intelligence',
    description: 'Integration skill for the International Consortium of Investigative Journalists (ICIJ) Offshore Leaks OpenRefine Reconciliation API (https://offshoreleaks.icij.org/api/v1/reconcile) across Panama, Paradise, and Pandora Papers.',
    toolsIncluded: [
      'icij_offshore_reconcile_entity',
      'icij_offshore_batch_reconcile',
      'icij_offshore_get_manifest',
    ],
    readme: `# ICIJ Offshore Leaks Reconciliation Skill
Connects to https://offshoreleaks.icij.org/api/v1/reconcile
Provides entity deduplication, fuzzy score matching, jurisdiction tracing, and linked officer/intermediary mapping.`,
    schemaJson: {
      type: 'skill',
      name: 'icij-offshore-reconcile',
      apiUrl: 'https://offshoreleaks.icij.org/api/v1/reconcile',
      mcpEndpoints: ['/mcp/offshoreleaks', '/mcp'],
      capabilities: ['entity_reconciliation', 'fuzzy_matching', 'panama_papers_lookup'],
    },
  },
  {
    id: 'ssm-privacy-safe-due-diligence',
    name: 'SSM Privacy-Safe Due Diligence Skill',
    filename: 'ssm-privacy-safe-due-diligence.skillux',
    version: '2.0.1',
    category: 'regulatory',
    description: 'Privacy-preserving due diligence protocols that sanitize NRIC/passport numbers, redact personal identifiable data (PDPA 2010 compliance), while extracting corporate compliance indicators.',
    toolsIncluded: [
      'sanitize_nric_and_pii',
      'validate_pdpa_compliance_profile',
      'generate_sanitized_ssm_extract',
    ],
    readme: `# SSM Privacy-Safe Due Diligence Skill
Ensures that due diligence workflows comply with the Personal Data Protection Act 2010 (Act 709) and Official Secrets Act 1972 standards.`,
    schemaJson: {
      type: 'skill',
      name: 'ssm-privacy-safe-due-diligence',
      capabilities: ['pii_sanitization', 'pdpa_compliance'],
    },
  },
  {
    id: 'advanced-corporate-forensics',
    name: 'Advanced Corporate Forensics & Beneficial Ownership',
    filename: 'advanced-corporate-forensics.skillux',
    version: '4.2.0',
    category: 'forensics',
    description: 'Multi-layer ultimate beneficial ownership (UBO) unwrapping, nominee director detection, circular holding analysis, and shell company scoring algorithms.',
    toolsIncluded: [
      'unwrap_beneficial_ownership_chain',
      'detect_nominee_proxy_patterns',
      'calculate_shell_risk_index',
    ],
    readme: `# Advanced Corporate Forensics Skill
Unravels offshore trust veils, nominee shareholding arrangements, and multi-tier parent-subsidiary structures across Labuan, BVI, Cayman, and Swiss jurisdictions.`,
    schemaJson: {
      type: 'skill',
      name: 'advanced-corporate-forensics',
      capabilities: ['ubo_unwrapping', 'proxy_detection', 'risk_scoring'],
    },
  },
  {
    id: 'legaiai-my',
    name: 'LegalAI-MY Court & Cause Papers Skill',
    filename: 'legaiai-my.skillux',
    version: '2.1.0',
    category: 'legal',
    description: 'Malaysian judiciary e-Kehakiman S/N protocol verification, High Court cause papers parsing, sub-judice filings audit, and Partnership Act 1961 Section 4(c) debt vs equity classification.',
    toolsIncluded: [
      'legalai_my_verify_cause_papers',
      'legalai_my_tax_demand_audit',
      'parse_e_kehakiman_cause_papers',
    ],
    readme: `# LegalAI-MY Skill
Automates statutory audit of legal cause papers issued by the High Court of Malaya and Sessions Courts. Cross-references Section 4(c) exceptions under the Partnership Act 1961.`,
    schemaJson: {
      type: 'skill',
      name: 'legaiai-my',
      capabilities: ['e_kehakiman_sn', 'cause_papers_audit', 'statutory_tax_recalculation'],
    },
  },
  {
    id: 'pwc-2026-discovery',
    name: 'PwC 2026 Discovery Evidentiary Protocol',
    filename: 'pwc-2026-discovery.skillux',
    version: '1.5.0',
    category: 'forensics',
    description: 'Statutory transfer pricing arm length assessment protocols based on Section 140A Income Tax Act 1967 and forensic e-discovery evidentiary standards.',
    toolsIncluded: [
      'simulate_section_140a_transfer_pricing',
      'compute_statutory_penalties_sec_113',
      'export_forensic_discovery_report',
    ],
    readme: `# PwC 2026 Discovery Skill
Standardized protocols for independent accounting, asset recovery, and transfer pricing interest calculations ($I = 1/12 \times A \times B$).`,
    schemaJson: {
      type: 'skill',
      name: 'pwc-2026-discovery',
      capabilities: ['transfer_pricing', 'statutory_audit', 'evidentiary_indexing'],
    },
  },
  {
    id: 'screenshot-target-identification',
    name: 'Screenshot Target & Visual OCR Forensics',
    filename: 'screenshot-target-identification.skillux',
    version: '1.2.0',
    category: 'intelligence',
    description: 'Automated optical character recognition, digital seal verification, font anomaly detection, and tamper analysis for government certificates and bank statements.',
    toolsIncluded: [
      'analyze_document_visual_tampering',
      'verify_digital_qr_watermark',
      'extract_scanned_tabular_ledger',
    ],
    readme: `# Screenshot Target Identification Skill
Detects fraudulent bank drafts, fabricated Swift MT103 receipts, and spliced notary certificates using visual layout fingerprinting.`,
    schemaJson: {
      type: 'skill',
      name: 'screenshot-target-identification',
      capabilities: ['tamper_detection', 'digital_seal_ocr'],
    },
  },
  {
    id: 'chat-context-investigation',
    name: 'Chat Context & Chain-of-Evidence Investigation',
    filename: 'chat-context-investigation.skillux',
    version: '1.1.0',
    category: 'forensics',
    description: 'Correlates fragmented chat transcripts, informal debt acknowledgements, and timestamped communications into an admissible forensic timeline.',
    toolsIncluded: [
      'build_admissible_timeline',
      'correlate_chat_entity_references',
    ],
    readme: `# Chat Context Investigation Skill
Converts informal WhatsApp, Telegram, and email threads into standardized court-ready timeline matrices.`,
    schemaJson: {
      type: 'skill',
      name: 'chat-context-investigation',
      capabilities: ['timeline_reconstruction', 'evidentiary_chain'],
    },
  },
  {
    id: 'open-banking-tracker-data',
    name: 'Open Banking & FIU Ledger Tracker',
    filename: 'open-banking-tracker-data.skillux',
    version: '2.0.0',
    category: 'forensics',
    description: 'Bank Negara Malaysia (BNM) FIU and Open Banking API integration skill for tracing high-value telegraphic transfers, SWIFT messaging, and accounts.',
    toolsIncluded: [
      'trace_swift_mt103_transfer',
      'reconcile_bank_ledger_balance',
      'check_aml_cft_str_flags',
    ],
    readme: `# Open Banking Tracker Data Skill
Integrates with Bank Negara Malaysia financial intelligence tracking specifications and SWIFT GPI tracking standards.`,
    schemaJson: {
      type: 'skill',
      name: 'open-banking-tracker-data',
      capabilities: ['swift_tracing', 'fiu_reporting', 'ledger_reconciliation'],
    },
  },
  {
    id: 'mykad-scraper-defensive',
    name: 'MyKad & JPN Defensive Identity Verification',
    filename: 'mykad-scraper-defensive.skillux',
    version: '1.8.0',
    category: 'regulatory',
    description: 'Jabatan Pendaftaran Negara (JPN) defensive identity validation, state-of-birth decoding, Luhn algorithm verification, and deceased record cross-checking.',
    toolsIncluded: [
      'validate_mykad_structure',
      'extract_jpn_demographics',
      'verify_identity_integrity_score',
    ],
    readme: `# MyKad Defensive Identity Skill
Validates 12-digit Malaysian MyKad numbers using checksum algorithms and JPN birth place codes to identify forged identity cards.`,
    schemaJson: {
      type: 'skill',
      name: 'mykad-scraper-defensive',
      capabilities: ['mykad_checksum', 'jpn_verification'],
    },
  },
  {
    id: 'bank-scraper',
    name: 'Banking Gateway & Statement Auditor',
    filename: 'bank-scraper.skillux',
    version: '2.2.0',
    category: 'forensics',
    description: 'Extracts, parses, and validates commercial bank statements (AmBank, RHB, Maybank, CIMB) for ledger discrepancies, shadow accounts, and phantom credits.',
    toolsIncluded: [
      'parse_bank_statement_pdf',
      'audit_transaction_velocity',
      'detect_phantom_credit_injections',
    ],
    readme: `# Bank Scraper & Auditor Skill
Audits domestic bank statements against core banking clearing system logs to detect fabricated transaction entries.`,
    schemaJson: {
      type: 'skill',
      name: 'bank-scraper',
      capabilities: ['statement_parsing', 'phantom_credit_detection'],
    },
  },
  {
    id: 'secure-osint-agent-review',
    name: 'Secure OSINT Agent & Registry Review',
    filename: 'secure-osint-agent-review.skillux',
    version: '1.4.0',
    category: 'intelligence',
    description: 'Privacy-hardened open source intelligence gathering across international corporate gazettes, trademark registers, and sanctions databases.',
    toolsIncluded: [
      'query_international_gazettes',
      'cross_reference_un_sanctions',
      'evaluate_pep_exposure',
    ],
    readme: `# Secure OSINT Agent Review Skill
Scrapes public regulatory gazettes without exposing the investigator IP or identity through proxy rotations and rate limits.`,
    schemaJson: {
      type: 'skill',
      name: 'secure-osint-agent-review',
      capabilities: ['osint_gazettes', 'sanctions_screening', 'pep_check'],
    },
  },
  {
    id: 'ai-research-skills',
    name: 'AI Evidentiary Research & Synthesis Skill',
    filename: 'ai-research-skills.skillux',
    version: '3.0.0',
    category: 'intelligence',
    description: 'LLM reasoning engine for cross-referencing multi-jurisdictional evidentiary artifacts, statutory citations, and synthesizing court-admissible dossiers.',
    toolsIncluded: [
      'synthesize_forensic_dossier',
      'cross_reference_statutory_acts',
      'generate_executive_briefing',
    ],
    readme: `# AI Evidentiary Research Skill
Provides specialized prompts and grounding mechanisms for generating executive summaries and statutory legal briefs.`,
    schemaJson: {
      type: 'skill',
      name: 'ai-research-skills',
      capabilities: ['evidentiary_synthesis', 'statutory_reasoning'],
    },
  },
  {
    id: 'sg-core-forensic-architecture',
    name: 'Singapore & Offshore Core Forensic Architecture',
    filename: 'sg-core-forensic-architecture.skillux',
    version: '2.3.0',
    category: 'forensics',
    description: 'Cross-border asset tracing framework linking ACRA Singapore, Labuan FSA, Cayman CIMA, and Swiss FINMA entities to Malaysian corporate directors.',
    toolsIncluded: [
      'trace_cross_border_capital_flows',
      'reconcile_acra_and_ssm_directorships',
      'map_offshore_trust_protector_links',
    ],
    readme: `# Singapore & Offshore Core Forensic Architecture Skill
Specialized in ASEAN cross-border capital repatriation, Labuan offshore banking conduits, and private trust company structures.`,
    schemaJson: {
      type: 'skill',
      name: 'sg-core-forensic-architecture',
      capabilities: ['acra_cross_ref', 'offshore_trust_tracing'],
    },
  },
];

/**
 * Builds a valid ZIP file in memory containing all skills
 */
export async function buildSkillsZipBuffer(): Promise<Uint8Array> {
  const zip = new JSZip();

  // Root README
  zip.file(
    'README.md',
    `# Malaysian Government Agencies & GLCs - Evidentiary Skill & MCP Suite
Version: 2026.1
Target: MyGDX SSM Middleware, CourtListener MCP, ICIJ Offshore Leaks Reconcile, LegalAI-MY

## Included Skills in this Package:
${SKILL_PACKAGES.map((s, i) => `${i + 1}. **${s.name}** (\`${s.filename}\`) - ${s.description}`).join('\n')}

## Connecting to the MCP Server:
Add the following to your Claude Desktop, Cursor, or AI Studio \`mcpServers\` configuration:
\`\`\`json
{
  "mcpServers": {
    "mygdx-ssm-gateway": {
      "url": "https://<YOUR_DEPLOYED_URL>/mcp",
      "transport": "sse"
    }
  }
}
\`\`\`

## Offshore Leaks Reconcile Endpoint:
- https://offshoreleaks.icij.org/api/v1/reconcile
- Local Middleware Proxy: /api/icij/reconcile

Confidential & Restricted to Authorized Statutory Enforcement Personnel.`
  );

  // Manifest file
  zip.file(
    'skills-manifest.json',
    JSON.stringify(
      {
        packageVersion: '2026.1.0',
        generatedAt: new Date().toISOString(),
        skillsCount: SKILL_PACKAGES.length,
        skills: SKILL_PACKAGES,
      },
      null,
      2
    )
  );

  // Each skill package
  for (const skill of SKILL_PACKAGES) {
    const skillFolder = zip.folder(skill.id);
    if (skillFolder) {
      skillFolder.file('README.md', skill.readme);
      skillFolder.file('manifest.json', JSON.stringify(skill.schemaJson, null, 2));
      skillFolder.file(
        'SKILL.md',
        `---
name: ${skill.id}
description: ${skill.description}
version: ${skill.version}
tools:
${skill.toolsIncluded.map((t) => `  - ${t}`).join('\n')}
---

# ${skill.name}

${skill.readme}
`
      );
      skillFolder.file(
        skill.filename,
        JSON.stringify(
          {
            header: 'SKILLUX_BINARY_FORMAT_V2',
            skillId: skill.id,
            name: skill.name,
            version: skill.version,
            checksum: 'sha256-verified',
            manifest: skill.schemaJson,
            documentation: skill.readme,
          },
          null,
          2
        )
      );
    }
  }

  return await zip.generateAsync({
    type: 'uint8array',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });
}
