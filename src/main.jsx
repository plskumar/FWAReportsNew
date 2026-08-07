import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertTriangle, BadgeDollarSign, BarChart3, CheckCircle2, Download, FileJson, FileText, FolderOpen, Printer, RotateCcw, Search, ShieldAlert, Upload, Users } from 'lucide-react';
import './styles.css';

const nowIso = () => new Date().toISOString();

const seedReport = {
  run_id: 'demo-001',
  status: 'completed',
  schema_version: 'fwa-investigation-reports-2.0',
  generated_at: '2026-06-12T12:59:55Z',
  model_trace: 'report_writer model us.anthropic.claude-sonnet-4-6 prompt report_writer-1.0.1 (ok)',
  reports: {
    duplicate_billing: {
      label: 'Duplicate Billing',
      finding_id: 'F-DUP-000001',
      scenario: 'duplicate_billing',
      confidence_level: 'High',
      confidence_score: 0.91,
      subtitle: 'Potential duplicate professional claim lines with matching procedure, date, provider relationship, and no distinguishing modifier.',
      executive_summary: 'The duplicate billing review identified paid claim lines where a second line appears to duplicate a prior paid service. The flagged lines share the same procedure, service date, provider relationship, and absence of a distinguishing modifier, adjustment, or resubmission code. The redundant paid amount is treated as recoverable exposure pending validation against source adjudication history.',
      dollar_value: 506.70,
      currency: 'USD',
      flagged_claims: [
        { claim_id: 'C0000462910', line: '1', claim_date: '2024-03-12', service_provider: 'P0000731', amount_paid: 168.90, procedure: '99215', comparator_claim_id: 'C0000451027', comparator_line: '1', modifier: 'none', observation: 'Claim C0000462910 line 1: This line, also billed by provider P0000731, was paid 168.90 USD for the same procedure (99215), same date (2024-03-12), and same absence of modifier as claim C0000451027 line 1. No adjustment or resubmission code distinguishes this line from the first. This line carries the redundant paid amount of 168.90 USD identified for recovery.' },
        { claim_id: 'C0000462911', line: '2', claim_date: '2024-03-12', service_provider: 'P0000731', amount_paid: 169.15, procedure: '99214', comparator_claim_id: 'C0000451028', comparator_line: '1', modifier: 'none', observation: 'Claim C0000462911 line 2: This paid line matches claim C0000451028 line 1 on service provider P0000731, procedure 99214, service date 2024-03-12, and absence of a claim-line modifier. The available claim fields do not show an adjustment, void, replacement, or corrected-claim indicator that would separate the second billing from the original. The paid amount of 169.15 USD is treated as duplicate exposure pending recovery validation.' },
        { claim_id: 'C0000462912', line: '1', claim_date: '2024-03-13', service_provider: 'P0000731', amount_paid: 168.65, procedure: '99215', comparator_claim_id: 'C0000451029', comparator_line: '1', modifier: 'none', observation: 'Claim C0000462912 line 1: This line duplicates the payment pattern observed on claim C0000451029 line 1, with the same service provider P0000731, same procedure 99215, same service date 2024-03-13, and no modifier or adjustment code that would justify separate payment. The redundant paid amount identified for recovery is 168.65 USD.' }
      ],
      recommended_actions: [
        'Validate each duplicate pairing against the adjudication trail, including voids, reversals, replacement claims, and late adjustments.',
        'Confirm that no modifier, authorization, distinct-service indicator, or corrected-claim relationship supports separate reimbursement.',
        'Open provider outreach where payer policy requires notice before recovery.',
        'Recover confirmed duplicate paid amounts by recoupment, offset, or corrected-claim reversal.',
        'Add the provider and procedure pattern to post-payment monitoring for repeat duplicate submissions.'
      ]
    },
    upcoding: {
      label: 'Upcoding',
      finding_id: 'F-UP-000001',
      scenario: 'em_upcoding',
      confidence_level: 'Medium',
      confidence_score: 0.74,
      subtitle: 'Potentially unsupported high-level E&M coding based on coded-claim plausibility review.',
      executive_summary: 'The upcoding review identified high-level E&M claim lines where the billed code appears elevated relative to diagnosis support available in coded claim data. These lines require documentation review because coded diagnoses alone do not confirm medical decision-making, time, or visit complexity. Dollar exposure is the paid amount associated with lines requiring validation before recovery or corrective action.',
      dollar_value: 642.84,
      currency: 'USD',
      flagged_claims: [
        { claim_id: 'C0000528144', line: '1', claim_date: '2024-04-18', service_provider: 'P0000912', amount_paid: 186.14, procedure: '99215', lower_supported_code: '99213', observation: 'Claim C0000528144 line 1: This line was paid 186.14 USD for procedure 99215 by provider P0000912 on 2024-04-18. The coded diagnosis profile appears thin for the highest established-patient E&M level and does not, by itself, evidence the complexity usually associated with 99215. Documentation review should determine whether time, medical decision-making, or risk supports the billed level. If not supported, the difference between the paid level and supported level should be recovered according to policy.' },
        { claim_id: 'C0000528150', line: '1', claim_date: '2024-04-20', service_provider: 'P0000912', amount_paid: 192.49, procedure: '99205', lower_supported_code: '99202', observation: 'Claim C0000528150 line 1: This new-patient E&M line was billed as 99205 and paid 192.49 USD. The available coded-claim information suggests limited diagnosis complexity and does not distinguish this visit as requiring the highest new-patient code. Because clinical notes were not available in the automated review, the line should be audited for medical decision-making, total time, and documentation support before determining overpayment recovery.' },
        { claim_id: 'C0000528163', line: '2', claim_date: '2024-04-23', service_provider: 'P0000912', amount_paid: 264.21, procedure: '99215', lower_supported_code: '99214', observation: 'Claim C0000528163 line 2: This line was paid 264.21 USD for procedure 99215 on 2024-04-23. The billed level is flagged because the claim-level diagnosis information does not clearly support the highest established-patient level. The line should be reviewed for documented complexity, risk, and time. If the record supports only 99214 or below, the excess paid amount should be calculated and recovered.' }
      ],
      recommended_actions: [
        'Request clinical documentation for the flagged E&M lines before making a final fraud, waste, or abuse determination.',
        'Apply applicable E&M coding guidelines to determine the supported level for each visit.',
        'Calculate recoverable overpayment as the difference between the billed paid level and the supported level.',
        'Issue provider education when documentation gaps appear non-systemic; escalate to focused audit when gaps repeat.',
        'Track future level 4 and 5 billing rates against provider specialty peers and prior audit outcomes.'
      ]
    }
  }
};

function money(value, code = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: code }).format(Number(value || 0));
}

function dateTime(value) {
  const d = value ? new Date(value) : new Date();
  if (Number.isNaN(d.getTime())) return String(value || 'Not available');
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'medium' }).format(d);
}

function pct(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 'N/A';
  return `${Math.round(n * 100)}%`;
}

function confidence(report) {
  const level = report.confidence_level || report.confidence?.level || report.score?.band || 'Not stated';
  const rawScore = report.confidence_score ?? report.confidence?.score ?? report.score?.value;
  return { level: String(level), score: rawScore === undefined || rawScore === null || rawScore === '' ? null : rawScore };
}

function confidenceClass(level) {
  const v = String(level || '').toLowerCase();
  if (v.includes('high')) return 'high';
  if (v.includes('medium') || v.includes('moderate')) return 'medium';
  if (v.includes('low')) return 'low';
  return 'neutral';
}

function exportFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function toCsv(report) {
  const rows = [['claim_id', 'claim_line', 'claim_date', 'service_provider', 'amount_paid', 'procedure', 'observation']];
  (report.flagged_claims || []).forEach(c => rows.push([c.claim_id, c.line, c.claim_date, c.service_provider, c.amount_paid, c.procedure || '', c.observation || '']));
  return rows.map(r => r.map(v => `"${String(v ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function openPopupWindow(title, bodyHtml) {
  const win = window.open('', '_blank', 'noopener,noreferrer,width=1200,height=800');
  if (!win) {
    alert('Popup blocked. Please allow popups for this site and try again.');
    return;
  }
  win.document.write(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <style>
      body { font-family: "Segoe UI", Arial, sans-serif; margin: 18px; color: #172033; }
      h1 { margin-top: 0; font-size: 24px; }
      .sub { color: #475569; margin-bottom: 14px; }
      table { width: 100%; border-collapse: collapse; min-width: 860px; }
      th { text-align: left; background: #f8fafc; color: #475569; font-size: 13px; padding: 10px 12px; border-bottom: 1px solid #dfe8f5; }
      td { padding: 12px; border-bottom: 1px solid #eaf0f8; vertical-align: top; font-size: 14px; }
      .obs p { margin: 0 0 10px; padding: 10px 12px; border-left: 4px solid #2563eb; background: #f8fafc; border-radius: 8px; line-height: 1.45; }
    </style>
  </head>
  <body>${bodyHtml}</body>
</html>`);
  win.document.close();
}

function normalizeBasysFinding(finding) {
  const lines = (finding.sampled_claim_lines || []).filter(l => String(l.diagnosis_support).toLowerCase() === 'inconsistent');
  const flagged = lines.map(line => ({
    claim_id: line.CLAIM_NBR,
    line: line.CLAIM_LINE_NBR,
    claim_date: line.CLAIM_DATE || line.SERVICE_DATE || 'Not provided',
    service_provider: finding.servicing_provider_id,
    amount_paid: Number(line.DER_ACTUAL_PAYMENT_COMP_AMT || 0),
    procedure: line.PRIMARY_SERVICE_CODE,
    diagnosis_support: line.diagnosis_support,
    observation: `Claim ${line.CLAIM_NBR} line ${line.CLAIM_LINE_NBR}: This line was billed by provider ${finding.servicing_provider_id} and paid ${Number(line.DER_ACTUAL_PAYMENT_COMP_AMT || 0).toFixed(2)} ${finding.exposure?.currency || 'USD'} for procedure ${line.PRIMARY_SERVICE_CODE}. The coded-claim review marked diagnosis support as inconsistent with the billed level. Clinical documentation should be reviewed before confirming recovery because this automated review evaluates coded-data plausibility, not the medical record.`
  }));
  return {
    label: 'Upcoding',
    finding_id: finding.finding_id,
    scenario: finding.scenario,
    finding_type: finding.finding_type,
    service_provider: finding.servicing_provider_id,
    provider_npi: finding.provider_npi,
    confidence_level: finding.score?.band || 'Not stated',
    confidence_score: finding.score?.value,
    subtitle: 'Provider-pattern E&M upcoding signal converted from BASYS/FWA finding schema.',
    executive_summary: finding.reasoning_chain?.judge || finding.reasoning_chain?.critique || seedReport.reports.upcoding.executive_summary,
    dollar_value: Number(finding.exposure?.flagged_paid_amt || 0),
    currency: finding.exposure?.currency || 'USD',
    flagged_claims: flagged.length ? flagged : seedReport.reports.upcoding.flagged_claims,
    recommended_actions: seedReport.reports.upcoding.recommended_actions,
    source_finding: finding
  };
}

function normalizeInput(input) {
  if (input?.reports?.duplicate_billing && input?.reports?.upcoding) {
    return {
      reports: input.reports,
      meta: {
        runId: input.run_id,
        status: input.status,
        schemaVersion: input.schema_version,
        sourceGeneratedAt: input.generated_at,
        modelTrace: input.model_trace || input.reasoning_model_steps
      }
    };
  }

  const findings = Array.isArray(input?.findings) ? input.findings : [];
  const upcodingFindings = findings.filter(f => String(f.scenario || '').toLowerCase().includes('upcoding'));
  const primary = upcodingFindings[0] || findings[0];
  return {
    reports: {
      duplicate_billing: seedReport.reports.duplicate_billing,
      upcoding: primary ? normalizeBasysFinding(primary) : seedReport.reports.upcoding
    },
    meta: {
      runId: input?.run_id || seedReport.run_id,
      status: input?.status || seedReport.status,
      schemaVersion: input?.schema_version || seedReport.schema_version,
      sourceGeneratedAt: input?.generated_at || input?.generatedAt || seedReport.generated_at,
      modelTrace: input?.model_trace || input?.reasoning_model_steps || seedReport.model_trace,
      findingCount: findings.length
    }
  };
}

function consolidateScenarioReport(reportKey, reports, fileCount) {
  const fallback = seedReport.reports[reportKey];
  if (!reports.length) return fallback;

  const base = reports[0] || fallback;
  const flaggedClaims = reports.flatMap(r => r.flagged_claims || []);
  const totalExposure = reports.reduce((sum, r) => sum + Number(r.dollar_value || 0), 0);
  const weightedScore = flaggedClaims.length
    ? reports.reduce((sum, r) => sum + (Number(r.confidence_score || 0) * ((r.flagged_claims || []).length || 0)), 0) / flaggedClaims.length
    : Number(base.confidence_score || 0);

  let confidenceLevel = 'Not stated';
  if (weightedScore >= 0.85) confidenceLevel = 'High';
  else if (weightedScore >= 0.6) confidenceLevel = 'Medium';
  else if (weightedScore > 0) confidenceLevel = 'Low';

  const uniqueActions = [];
  const seenActions = new Set();
  reports.forEach(r => {
    (r.recommended_actions || []).forEach(action => {
      if (!seenActions.has(action)) {
        seenActions.add(action);
        uniqueActions.push(action);
      }
    });
  });

  return {
    ...base,
    finding_id: `F-CONSOLIDATED-${reportKey === 'duplicate_billing' ? 'DUP' : 'UP'}`,
    subtitle: `Consolidated from ${fileCount} JSON file${fileCount === 1 ? '' : 's'} loaded from folder.`,
    executive_summary: `This consolidated ${base.label.toLowerCase()} report combines findings from ${fileCount} source JSON file${fileCount === 1 ? '' : 's'}. It includes ${flaggedClaims.length} flagged claim line${flaggedClaims.length === 1 ? '' : 's'} with total exposure of ${money(totalExposure, base.currency)} pending validation and recovery workflow decisions.`,
    confidence_level: confidenceLevel,
    confidence_score: Number.isFinite(weightedScore) ? Number(weightedScore.toFixed(2)) : null,
    dollar_value: Number(totalExposure.toFixed(2)),
    flagged_claims: flaggedClaims,
    recommended_actions: uniqueActions.length ? uniqueActions : base.recommended_actions
  };
}

function buildConsolidatedPayload(parsedInputs, loadedFromFolderName) {
  const normalized = parsedInputs.map(item => normalizeInput(item));
  const duplicateReports = normalized.map(n => n.reports?.duplicate_billing).filter(Boolean);
  const upcodingReports = normalized.map(n => n.reports?.upcoding).filter(Boolean);
  const totalFindingCount = normalized.reduce((sum, n) => sum + Number(n.meta?.findingCount || 0), 0);
  const fileCount = parsedInputs.length;
  const generatedAt = nowIso();

  return {
    run_id: `folder-consolidated-${generatedAt}`,
    status: 'completed',
    schema_version: 'fwa-investigation-reports-2.0-consolidated',
    generated_at: generatedAt,
    model_trace: `consolidated from ${fileCount} JSON file${fileCount === 1 ? '' : 's'} in folder ${loadedFromFolderName}`,
    reports: {
      duplicate_billing: consolidateScenarioReport('duplicate_billing', duplicateReports, fileCount),
      upcoding: consolidateScenarioReport('upcoding', upcodingReports, fileCount)
    },
    consolidated_meta: {
      source_files: fileCount,
      source_folder: loadedFromFolderName,
      total_findings_seen: totalFindingCount
    }
  };
}

function buildFooter(report, meta, activeKey) {
  const finding = report.source_finding || report;
  return [
    'Confidential. For authorized investigators only. Contains no protected health information; demonstration data may be synthetic unless otherwise identified by the source file.',
    `Audit: run ${meta.runId || 'not provided'}, finding ${report.finding_id || finding.finding_id || 'not provided'}, report generated ${nowIso()}.`,
    `Source details: schema ${meta.schemaVersion || 'not provided'}, status ${meta.status || 'not provided'}, source generated ${meta.sourceGeneratedAt ? dateTime(meta.sourceGeneratedAt) : 'not provided'}, tab ${activeKey}.`,
    `Finding details: scenario ${finding.scenario || report.scenario || 'not provided'}, type ${finding.finding_type || report.finding_type || 'not provided'}, provider ${finding.servicing_provider_id || report.service_provider || 'not provided'}, NPI ${finding.provider_npi || report.provider_npi || 'not provided'}, score ${finding.score?.value ?? report.confidence_score ?? 'not provided'} (${finding.score?.band || report.confidence_level || 'not provided'}), needs_review ${String(finding.needs_review ?? report.needs_review ?? 'not provided')}.`,
    `Reasoning model steps: ${meta.modelTrace || report.model_trace || 'not provided'}.`
  ];
}

function TopBar({ onLoad, onLoadFolder, onReset, loadedName }) {
  return (
    <header className="topbar">
      <div className="brand"><ShieldAlert /><div><strong>FWAReports</strong><span>Investigator portal for duplicate billing and upcoding recovery reports</span></div></div>
      <div className="topActions">
        <label className="upload"><Upload size={17}/> Upload JSON<input type="file" accept="application/json" onChange={onLoad}/></label>
        <label className="upload"><FolderOpen size={17}/> Load from Folder<input type="file" accept="application/json" multiple webkitdirectory="" directory="" onChange={onLoadFolder}/></label>
        <button className="secondary" onClick={onReset}><RotateCcw size={17}/> Reset to default JSON</button>
        {loadedName && <span className="loaded">Loaded: {loadedName}</span>}
      </div>
    </header>
  );
}

function KpiCards({ report }) {
  const totalClaims = report.flagged_claims?.length || 0;
  const providers = new Set((report.flagged_claims || []).map(c => c.service_provider).filter(Boolean)).size;
  const avg = totalClaims ? Number(report.dollar_value || 0) / totalClaims : 0;
  return (
    <div className="cards">
      <div className="card"><BadgeDollarSign /><span>Total exposure</span><strong>{money(report.dollar_value, report.currency)}</strong></div>
      <div className="card"><FileText /><span>Flagged claims</span><strong>{totalClaims}</strong></div>
      <div className="card"><Users /><span>Providers flagged</span><strong>{providers || 'N/A'}</strong></div>
      <div className="card"><BarChart3 /><span>Average paid</span><strong>{money(avg, report.currency)}</strong></div>
    </div>
  );
}

function ConfidenceBanner({ report }) {
  const c = confidence(report);
  const scoreText = typeof c.score === 'number' ? (c.score <= 1 ? pct(c.score) : String(c.score)) : c.score;
  return (
    <section className={`confidenceBanner ${confidenceClass(c.level)}`}>
      <AlertTriangle size={18} />
      <span>Confidence level</span>
      <strong>{c.level}</strong>
      {scoreText && <em>Score: {scoreText}</em>}
    </section>
  );
}

function TabButton({ id, active, onClick, children }) {
  return <button className={active ? 'tab active' : 'tab'} onClick={() => onClick(id)}>{children}</button>;
}

function FolderSummaryBadge({ summary }) {
  if (!summary) return null;
  return (
    <div className="folderSummaryWrap">
      <div className="folderSummary">
        <strong>Folder run</strong>
        <span>{summary.folderName}</span>
        <span>{summary.loadedCount} loaded</span>
        <span>{summary.failedCount} failed</span>
        <span>{summary.totalFiles} total</span>
      </div>
    </div>
  );
}

function ClaimsTable({ claims, currencyCode, search, onOpenAllClaims }) {
  const filtered = (claims || []).filter(c => JSON.stringify(c).toLowerCase().includes(search.toLowerCase()));
  const visibleClaims = filtered.slice(0, 20);
  const extraClaimsCount = filtered.length - visibleClaims.length;
  return (
    <div className="tableWrap">
      <table>
        <thead><tr><th>Claim ID</th><th>Claim Date</th><th>Service Provider</th><th>Amount Paid</th></tr></thead>
        <tbody>
          {visibleClaims.map((claim, i) => (
            <tr key={`${claim.claim_id}-${claim.line}-${i}`}>
              <td>
                <strong>{claim.claim_id}</strong>
                <span className="claimInline"> Line {claim.line || 'N/A'} {claim.procedure ? `| ${claim.procedure}` : ''}</span>
              </td>
              <td>{claim.claim_date || 'Not provided'}</td>
              <td>{claim.service_provider || 'Not provided'}</td>
              <td>{money(claim.amount_paid, currencyCode)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!filtered.length && <div className="empty">No claims match the current search.</div>}
      {extraClaimsCount > 0 && <button type="button" className="more" onClick={() => onOpenAllClaims(filtered)}>More... ({extraClaimsCount} additional claims)</button>}
    </div>
  );
}

function ReportTab({ report, meta, activeKey }) {
  const [search, setSearch] = useState('');
  const footnotes = useMemo(() => buildFooter(report, meta, activeKey), [report, meta, activeKey]);
  const safeId = String(report.finding_id || activeKey).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const filtered = (report.flagged_claims || []).filter(c => JSON.stringify(c).toLowerCase().includes(search.toLowerCase()));
  const visibleObservations = filtered.slice(0, 20);
  const extraObservationsCount = filtered.length - visibleObservations.length;
  const exportJson = () => exportFile(`${safeId}.json`, JSON.stringify({ run_id: meta.runId, report_generated_at: nowIso(), report }, null, 2), 'application/json');
  const exportCsv = () => exportFile(`${safeId}-flagged-claims.csv`, toCsv(report), 'text/csv');
  const openAllClaimsWindow = claimsList => {
    const rows = claimsList.map(claim => `
      <tr>
        <td><strong>${escapeHtml(claim.claim_id || 'Not provided')}</strong> | Line ${escapeHtml(claim.line || 'N/A')} ${claim.procedure ? `| ${escapeHtml(claim.procedure)}` : ''}</td>
        <td>${escapeHtml(claim.claim_date || 'Not provided')}</td>
        <td>${escapeHtml(claim.service_provider || 'Not provided')}</td>
        <td>${escapeHtml(money(claim.amount_paid, report.currency))}</td>
      </tr>
    `).join('');
    openPopupWindow(`${report.label} - All Claims`, `
      <h1>${escapeHtml(report.label)} - All Flagged Claims</h1>
      <div class="sub">Showing ${claimsList.length} matching claims.</div>
      <table>
        <thead><tr><th>Claim ID</th><th>Claim Date</th><th>Service Provider</th><th>Amount Paid</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `);
  };
  const openAllObservationsWindow = claimsList => {
    const items = claimsList.map(claim => `<p>${escapeHtml(claim.observation || `Claim ${claim.claim_id} line ${claim.line}: Observation not provided in source JSON.`)}</p>`).join('');
    openPopupWindow(`${report.label} - All Observations`, `
      <h1>${escapeHtml(report.label)} - Per-Claim Line Observations</h1>
      <div class="sub">Showing ${claimsList.length} matching observations.</div>
      <div class="obs">${items}</div>
    `);
  };

  return (
    <main className="report">
      <section className="hero">
        <div>
          <p className="eyebrow">{report.finding_id || activeKey}</p>
          <h1>{report.label}</h1>
          <p>{report.subtitle}</p>
        </div>
        <div className="buttonStack">
          <button className="secondary" onClick={exportJson}><FileJson size={17}/> JSON</button>
          <button className="secondary" onClick={exportCsv}><Download size={17}/> CSV</button>
          <button className="secondary" onClick={() => window.print()}><Printer size={17}/> Print/PDF</button>
        </div>
      </section>

      <ConfidenceBanner report={report} />
      <KpiCards report={report} />

      <section className="panel executive">
        <h2>Executive summary of findings</h2>
        <p>{report.executive_summary}</p>
        <div className="dollarCallout">Dollar value involved in {report.label.toLowerCase()}: <strong>{money(report.dollar_value, report.currency)}</strong></div>
      </section>

      <section className="panel">
        <div className="sectionHeader">
          <h2>Flagged claims</h2>
          <label className="search"><Search size={16}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search claim, provider, procedure..." /></label>
        </div>
        <ClaimsTable claims={report.flagged_claims || []} currencyCode={report.currency} search={search} onOpenAllClaims={openAllClaimsWindow} />
      </section>

      <section className="panel">
        <h2>Per-claim line observations</h2>
        <div className="observations">
          {visibleObservations.map((claim, i) => <p key={`${claim.claim_id}-${claim.line}-obs-${i}`}>{claim.observation || `Claim ${claim.claim_id} line ${claim.line}: Observation not provided in source JSON.`}</p>)}
        </div>
        {extraObservationsCount > 0 && <button type="button" className="more morePanel" onClick={() => openAllObservationsWindow(filtered)}>More... ({extraObservationsCount} additional observations)</button>}
      </section>

      <section className="panel actions">
        <h2>Recommended actions for recovery</h2>
        <ol>{(report.recommended_actions || []).map((a, i) => <li key={i}>{a}</li>)}</ol>
      </section>

      <footer>{footnotes.map((note, i) => <React.Fragment key={i}>{note}<br /></React.Fragment>)}</footer>
    </main>
  );
}

function App() {
  const [active, setActive] = useState('duplicate_billing');
  const [rawData, setRawData] = useState(seedReport);
  const [loadedName, setLoadedName] = useState('demo seed data');
  const [folderSummary, setFolderSummary] = useState(null);
  const normalized = useMemo(() => normalizeInput(rawData), [rawData]);
  const report = normalized.reports[active] || normalized.reports.duplicate_billing;

  const onLoad = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      setRawData(parsed);
      setLoadedName(file.name);
      setFolderSummary(null);
    } catch (error) {
      alert(`Could not parse JSON: ${error.message}`);
    }
  };

  const onReset = () => {
    setRawData(seedReport);
    setLoadedName('demo seed data');
    setFolderSummary(null);
  };

  const onLoadFolder = async event => {
    const files = Array.from(event.target.files || []).filter(file => file.name.toLowerCase().endsWith('.json'));
    if (!files.length) {
      alert('No JSON files were found in the selected folder.');
      return;
    }

    const parsed = [];
    const failures = [];
    for (const file of files) {
      try {
        parsed.push(JSON.parse(await file.text()));
      } catch (error) {
        failures.push(`${file.name}: ${error.message}`);
      }
    }

    if (!parsed.length) {
      alert(`Could not parse any JSON files from the selected folder.\n\n${failures.join('\n')}`);
      return;
    }

    const folderName = files[0].webkitRelativePath?.split('/')[0] || 'selected folder';
    const consolidated = buildConsolidatedPayload(parsed, folderName);
    setRawData(consolidated);
    setLoadedName(`Folder: ${folderName} (${parsed.length} JSON file${parsed.length === 1 ? '' : 's'})`);
    setFolderSummary({
      folderName,
      totalFiles: files.length,
      loadedCount: parsed.length,
      failedCount: failures.length
    });

    if (failures.length) {
      alert(`Loaded ${parsed.length} JSON file${parsed.length === 1 ? '' : 's'} with ${failures.length} parse failure${failures.length === 1 ? '' : 's'}.\n\n${failures.join('\n')}`);
    }
  };

  return (
    <div className="app">
      <TopBar onLoad={onLoad} onLoadFolder={onLoadFolder} onReset={onReset} loadedName={loadedName} />
      <nav className="tabs">
        <TabButton id="duplicate_billing" active={active === 'duplicate_billing'} onClick={setActive}>Duplicate Billing</TabButton>
        <TabButton id="upcoding" active={active === 'upcoding'} onClick={setActive}>Upcoding</TabButton>
      </nav>
      <FolderSummaryBadge summary={folderSummary} />
      <ReportTab report={report} meta={{ ...normalized.meta }} activeKey={active} />
      <div className="status"><CheckCircle2 size={16}/> GitHub Actions deployment ready</div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
