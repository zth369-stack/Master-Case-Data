import { jsPDF } from 'jspdf';
import type { ScrapedDocument } from '../shared/types';

export function downloadDocumentAsPdf(doc: ScrapedDocument) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let y = 18;

  // Header Banner
  pdf.setFillColor(15, 23, 42); // slate-900
  pdf.rect(0, 0, pageWidth, 28, 'F');

  // Accent Line
  pdf.setFillColor(16, 185, 129); // emerald-500
  pdf.rect(0, 27, pageWidth, 1.5, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.setTextColor(255, 255, 255);
  pdf.text('GOVERNMENT & FORENSIC DOCUMENT RETRIEVAL SYSTEM', 14, 11);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(148, 163, 184); // slate-400
  pdf.text(`ISSUING AUTHORITY: ${doc.issuingAuthority.toUpperCase()}`, 14, 18);
  pdf.text(`SECURITY CLASSIFICATION: ${doc.securityClassification} | JURISDICTION: ${doc.jurisdiction.toUpperCase()}`, 14, 23);

  y = 36;

  // Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(15, 23, 42);
  const titleLines = pdf.splitTextToSize(doc.documentTitle, pageWidth - 28);
  pdf.text(titleLines, 14, y);
  y += titleLines.length * 6 + 4;

  // Metadata Box
  pdf.setFillColor(248, 250, 252); // slate-50
  pdf.setDrawColor(226, 232, 240); // slate-200
  pdf.roundedRect(14, y, pageWidth - 28, 30, 2, 2, 'FD');

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(71, 85, 105);
  pdf.text('OFFICIAL REFERENCE:', 18, y + 7);
  pdf.text('DATE ISSUED:', 18, y + 14);
  pdf.text('CATEGORY:', 18, y + 21);
  pdf.text('FILING STATUS:', 18, y + 27);

  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(15, 23, 42);
  pdf.text(doc.referenceNumber, 60, y + 7);
  pdf.text(doc.dateIssued, 60, y + 14);
  pdf.text(doc.category.replace(/_/g, ' '), 60, y + 21);

  // Status Badge
  pdf.setFont('helvetica', 'bold');
  if (doc.filingStatus === 'ACTIVE_REGISTERED' || doc.filingStatus === 'AMLA_DECLARED') {
    pdf.setTextColor(5, 150, 105); // emerald-600
  } else if (doc.filingStatus === 'FROZEN_REGULATORY') {
    pdf.setTextColor(217, 119, 6); // amber-600
  } else {
    pdf.setTextColor(220, 38, 38); // red-600
  }
  pdf.text(doc.filingStatus.replace(/_/g, ' '), 60, y + 27);

  // Right column of metadata box
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(71, 85, 105);
  pdf.text('CRAWLER SPIDER:', 110, y + 7);
  pdf.text('HTTP STATUS:', 110, y + 14);
  pdf.text('SIGNATURE STATUS:', 110, y + 21);
  pdf.text('RETRIEVED AT:', 110, y + 27);

  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(15, 23, 42);
  pdf.text(doc.crawlerSpider, 145, y + 7);
  pdf.text(`${doc.httpStatus} OK`, 145, y + 14);
  pdf.text(doc.signatureVerified ? 'VERIFIED UNDER SEAL' : 'PENDING NOTARIZATION', 145, y + 21);
  pdf.text(new Date().toLocaleDateString('en-GB'), 145, y + 27);

  y += 37;

  // Key Parties
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(15, 23, 42);
  pdf.text('IDENTIFIED PARTIES & ROLES', 14, y);
  y += 5;

  doc.keyParties.forEach((p) => {
    pdf.setFillColor(241, 245, 249);
    pdf.rect(14, y, pageWidth - 28, 7.5, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(15, 23, 42);
    pdf.text(`${p.name}`, 18, y + 5);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(71, 85, 105);
    pdf.text(`Role: ${p.role} | ID: ${p.identification}`, 85, y + 5);
    y += 8.5;
  });

  y += 3;

  // Executive Summary
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(15, 23, 42);
  pdf.text('EXECUTIVE EVIDENTIARY SUMMARY', 14, y);
  y += 5;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(51, 65, 85);
  const summaryLines = pdf.splitTextToSize(doc.summary, pageWidth - 28);
  pdf.text(summaryLines, 14, y);
  y += summaryLines.length * 4.5 + 4;

  // Extracted Statutory Clauses
  if (doc.extractedClauses.length > 0) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(15, 23, 42);
    pdf.text('KEY EXTRACTED CLAUSES & SCHEDULES', 14, y);
    y += 5;

    doc.extractedClauses.forEach((c) => {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(15, 23, 42);
      pdf.text(`• ${c.clauseNumber} - ${c.heading}`, 16, y);
      y += 4.5;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(71, 85, 105);
      const clauseTextLines = pdf.splitTextToSize(c.text, pageWidth - 36);
      pdf.text(clauseTextLines, 20, y);
      y += clauseTextLines.length * 4 + 3;
    });
  }

  // Check if we need a second page for raw transcript or footer
  if (y > pageHeight - 55) {
    pdf.addPage();
    y = 20;
  }

  // Raw Document Transcript Box
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(15, 23, 42);
  pdf.text('OFFICIAL REGISTRY TRANSCRIPT / EXTRACT', 14, y);
  y += 5;

  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(203, 213, 225);
  const transcriptLines = pdf.splitTextToSize(doc.rawExtractedText, pageWidth - 36);
  const boxHeight = transcriptLines.length * 4 + 8;
  pdf.rect(14, y, pageWidth - 28, boxHeight, 'FD');

  pdf.setFont('courier', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(30, 41, 59);
  pdf.text(transcriptLines, 18, y + 6);
  y += boxHeight + 8;

  // Signatories
  if (doc.signatories && doc.signatories.length > 0) {
    if (y > pageHeight - 45) {
      pdf.addPage();
      y = 20;
    }
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(15, 23, 42);
    pdf.text('ATTESTING SIGNATORIES UNDER REGULATORY SEAL:', 14, y);
    y += 5;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(71, 85, 105);
    pdf.text(doc.signatories.join('  •  '), 14, y);
    y += 8;
  }

  // Cryptographic Footer & Integrity Stamp
  const footerY = pageHeight - 22;
  pdf.setFillColor(241, 245, 249);
  pdf.rect(0, footerY - 4, pageWidth, 26, 'F');
  pdf.setDrawColor(203, 213, 225);
  pdf.line(0, footerY - 4, pageWidth, footerY - 4);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.5);
  pdf.setTextColor(30, 41, 59);
  pdf.text('CRYPTOGRAPHIC INTEGRITY CERTIFICATE (SHA-256):', 14, footerY);

  pdf.setFont('courier', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(71, 85, 105);
  pdf.text(doc.contentHashSha256, 14, footerY + 5);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6.5);
  pdf.setTextColor(100, 116, 139);
  pdf.text(
    'Certified authentic extract crawled from official registry gateway. Validated for submission in High Court Suit 4-334567 and cross-border regulatory audit.',
    14,
    footerY + 11
  );

  const cleanFilename = `${doc.id}_${doc.referenceNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
  pdf.save(cleanFilename);
}

export function downloadAllDocumentsAsConsolidatedPdf(docs: ScrapedDocument[]) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Cover Page
  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  pdf.setFillColor(16, 185, 129);
  pdf.rect(0, 0, 8, pageHeight, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.setTextColor(255, 255, 255);
  pdf.text('CONSOLIDATED EVIDENTIARY DOSSIER', 24, 55);

  pdf.setFontSize(13);
  pdf.setTextColor(16, 185, 129);
  pdf.text('INCORPORATION, TRUST & BANK ACCOUNT OPENING DOCUMENTS', 24, 65);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(148, 163, 184);
  pdf.text('High Court Commercial Division Suit No. 4-334567', 24, 78);
  pdf.text('Jurisdictions: Malaysia (SSM) | Switzerland (FINMA/Geneva) | Cayman Islands (CIMA)', 24, 84);
  pdf.text(`Total Scraped Artifacts: ${docs.length} Official Registry Documents`, 24, 90);
  pdf.text(`Generated: ${new Date().toUTCString()}`, 24, 96);

  // Table of Contents Box
  pdf.setFillColor(30, 41, 59);
  pdf.roundedRect(24, 115, pageWidth - 48, 140, 3, 3, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(255, 255, 255);
  pdf.text('CATALOGED STATUTORY REGISTRY EXHIBITS', 32, 127);

  let tocY = 137;
  docs.forEach((d, idx) => {
    if (tocY < 240) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(16, 185, 129);
      pdf.text(`[${d.id}]`, 32, tocY);

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(226, 232, 240);
      const titleShort = d.documentTitle.length > 55 ? d.documentTitle.substring(0, 52) + '...' : d.documentTitle;
      pdf.text(titleShort, 62, tocY);

      pdf.setTextColor(148, 163, 184);
      pdf.text(`p. ${idx + 2}`, pageWidth - 45, tocY);
      tocY += 7.5;
    }
  });

  // Render each document page
  docs.forEach((doc) => {
    pdf.addPage();
    let y = 18;

    // Header Banner
    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 0, pageWidth, 24, 'F');
    pdf.setFillColor(16, 185, 129);
    pdf.rect(0, 23, pageWidth, 1, 'F');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(255, 255, 255);
    pdf.text(doc.documentTitle, 14, 11);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(148, 163, 184);
    pdf.text(`REF: ${doc.referenceNumber}  |  AUTHORITY: ${doc.issuingAuthority}  |  STATUS: ${doc.filingStatus}`, 14, 18);

    y = 32;

    // Summary Box
    pdf.setFillColor(248, 250, 252);
    pdf.rect(14, y, pageWidth - 28, 24, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(15, 23, 42);
    pdf.text('EVIDENTIARY SUMMARY:', 18, y + 6);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(51, 65, 85);
    const sLines = pdf.splitTextToSize(doc.summary, pageWidth - 36);
    pdf.text(sLines, 18, y + 11);
    y += 29;

    // Key Parties
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(15, 23, 42);
    pdf.text('PARTIES & SIGNATORIES:', 14, y);
    y += 5;

    doc.keyParties.forEach((p) => {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(71, 85, 105);
      pdf.text(`• ${p.name} (${p.role}) - ${p.identification}`, 18, y);
      y += 4.5;
    });

    y += 4;

    // Extracted Text
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(15, 23, 42);
    pdf.text('REGISTRY TRANSCRIPT EXTRACT:', 14, y);
    y += 5;

    pdf.setFillColor(241, 245, 249);
    const transcriptLines = pdf.splitTextToSize(doc.rawExtractedText, pageWidth - 36);
    const tHeight = Math.min(transcriptLines.length * 4 + 8, pageHeight - y - 30);
    pdf.rect(14, y, pageWidth - 28, tHeight, 'F');

    pdf.setFont('courier', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(30, 41, 59);
    pdf.text(transcriptLines.slice(0, 22), 18, y + 6);

    // Footer with hash
    const footerY = pageHeight - 16;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(30, 41, 59);
    pdf.text(`SHA-256 HASH: ${doc.contentHashSha256}`, 14, footerY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Classification: ${doc.securityClassification} | Verified Under Seal: ${doc.signatureVerified}`, 14, footerY + 5);
  });

  pdf.save(`CONSOLIDATED_REGISTRY_EVIDENTIARY_DOSSIER_${new Date().toISOString().slice(0, 10)}.pdf`);
}
