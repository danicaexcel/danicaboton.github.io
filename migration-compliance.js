(function () {
  const COMPLIANCE_PAGE = 'Compliance Report';
  const COMPLIANCE_TAB = 'Compliance';

  const controls = [
    ['DH-01','Personal Data Inventory','PASS','Candidate identity, contact, address, resume and qualification fields are identified in the migration map.'],
    ['DH-02','Data Minimization','PASS','Only recruitment and migration-required fields are included in the mapped data set.'],
    ['DH-03','Purpose Limitation','PASS','Processing is scoped to recruitment migration, validation, reconciliation, and operational review.'],
    ['DH-04','Access & Least Privilege','PARTIAL','Role and API-scope review is represented; production IAM evidence still requires owner validation.'],
    ['DH-05','Credential Protection','PASS','OAuth/API secrets are excluded from candidate records and generated report evidence.'],
    ['DH-06','Transport Security','PASS','REST/API integrations are represented as HTTPS/TLS-protected endpoints.'],
    ['DH-07','Migration Reconciliation','PASS','Each source row receives a migrated, duplicate, or exception disposition.'],
    ['DH-08','Data Accuracy & Confidence','PASS','Confidence scoring and exception review gate uncertain parsed candidate fields.'],
    ['DH-09','PII-safe Operational Logging','PARTIAL','Operational evidence is designed around IDs and statuses; production log sampling remains a review item.'],
    ['DH-10','Retention & Deletion','NOT ASSESSED','Retention periods and deletion schedules require data-owner and legal-basis configuration.'],
    ['DH-11','Auditability','PASS','Batch, API, exception, and reconciliation events provide traceable operational evidence.'],
    ['DH-12','Recovery & Reliability','PASS','Controlled batches, retries, and reconciliation support recoverable execution.'],
    ['DH-13','Third-party Processing','PARTIAL','Zoho, Google Drive, and source ATS dependencies are identified; contractual review is outside this demo.'],
    ['DH-14','Data Subject Rights Support','PASS','Mapped records remain addressable for access, correction, and deletion workflows.']
  ];

  const style = document.createElement('style');
  style.textContent = `
    .status.partial{background:#fff4d8;color:#8a6100}
    .status.review{background:#eef1f5;color:#5b6878}
    .compliance-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:12px}
    .compliance-summary .card{padding:17px}
    .compliance-report-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;margin-bottom:10px}
    .compliance-report-meta{font-size:9px;line-height:1.65;color:#68778a;text-align:right;max-width:380px}
    .compliance-note{padding:11px 13px;background:#f7f9fc;border:1px solid #e2e7ed;font-size:9px;line-height:1.5;color:#667487;margin-top:14px}
    .compliance-actions{display:flex;gap:8px;flex-wrap:wrap}
    @media(max-width:900px){.compliance-summary{grid-template-columns:repeat(2,1fr)}.compliance-report-head{display:block}.compliance-report-meta{text-align:left;margin-top:10px}}
  `;
  document.head.appendChild(style);

  if (!pages.includes(COMPLIANCE_PAGE)) pages.push(COMPLIANCE_PAGE);
  if (!tabs.includes(COMPLIANCE_TAB)) tabs.push(COMPLIANCE_TAB);
  tabToPage[COMPLIANCE_TAB] = COMPLIANCE_PAGE;

  const originalActiveTab = activeTab;
  activeTab = function () {
    return current === COMPLIANCE_PAGE ? COMPLIANCE_TAB : originalActiveTab();
  };

  function statusClass(status) {
    return status === 'PARTIAL' ? 'partial' : status === 'NOT ASSESSED' ? 'review' : '';
  }

  function counts() {
    return {
      pass: controls.filter(c => c[2] === 'PASS').length,
      partial: controls.filter(c => c[2] === 'PARTIAL').length,
      notAssessed: controls.filter(c => c[2] === 'NOT ASSESSED').length
    };
  }

  function reportMarkup() {
    const c = counts();
    return `
      <section class="compliance-summary">
        <article class="card"><strong>${controls.length}</strong><span>controls assessed</span></article>
        <article class="card"><strong>${c.pass}</strong><span>pass</span></article>
        <article class="card"><strong>${c.partial}</strong><span>partial</span></article>
        <article class="card"><strong>${c.notAssessed}</strong><span>not assessed</span></article>
      </section>
      <section class="panel">
        <div class="compliance-report-head">
          <div>
            <h3>Data Handling &amp; Compliance Assessment</h3>
            <p class="muted">Enterprise Zoho CRM Engineering &amp; Migration · Candidate PII · 59K+ JazzHR source scope · 120K+ overall migration program</p>
          </div>
          <div class="compliance-report-meta">Framework alignment<br><strong>Philippines DPA · GDPR principles · SOC 2 control concepts · API security</strong></div>
        </div>
        <table>
          <thead><tr><th>Control</th><th>Area</th><th>Status</th><th>Observed evidence / assessment</th></tr></thead>
          <tbody>${controls.map(c => `<tr><td><strong>${c[0]}</strong></td><td>${c[1]}</td><td><span class="status ${statusClass(c[2])}">${c[2]}</span></td><td>${c[3]}</td></tr>`).join('')}</tbody>
        </table>
        <div class="compliance-note"><strong>Assessment boundary:</strong> This demo documents technical and operational controls and supporting evidence. It is not a legal certification of GDPR, the Philippine Data Privacy Act, SOC 2, or any other regulatory framework.</div>
      </section>`;
  }

  function downloadableReport() {
    const date = new Date().toISOString().slice(0, 10);
    const rows = controls.map(c => `<tr><td>${c[0]}</td><td>${c[1]}</td><td>${c[2]}</td><td>${c[3]}</td></tr>`).join('');
    return {
      date,
      html: `<!doctype html><html><head><meta charset="utf-8"><title>Zoho Migration Compliance Assessment</title><style>body{font:14px/1.5 Arial,sans-serif;color:#1d2a3c;margin:40px}h1{margin-bottom:6px}.meta{color:#667487;margin-bottom:24px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #dce3eb;padding:9px;text-align:left;vertical-align:top}th{background:#f3f6fa}.note{margin-top:20px;padding:12px;background:#f7f9fc;border:1px solid #dce3eb;font-size:12px}</style></head><body><h1>Data Handling &amp; Compliance Assessment</h1><div class="meta">Enterprise Zoho CRM Engineering &amp; Migration<br>Generated: ${date}<br>Data classification: Confidential / Candidate PII<br>Scope: 59K+ JazzHR · 120K+ overall migration program<br>Framework alignment: Philippines DPA · GDPR principles · SOC 2 control concepts · API security</div><table><thead><tr><th>Control</th><th>Area</th><th>Status</th><th>Observed evidence / assessment</th></tr></thead><tbody>${rows}</tbody></table><div class="note"><strong>Assessment boundary:</strong> This report documents technical and operational controls and supporting evidence. It is not a legal certification of regulatory compliance.</div></body></html>`
    };
  }

  function downloadReport() {
    const report = downloadableReport();
    const url = URL.createObjectURL(new Blob([report.html], {type: 'text/html;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = `zoho-migration-compliance-${report.date}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function renderComplianceIntro() {
    page.innerHTML = `<section class="panel"><h3>Compliance report generator</h3><p class="muted">Generate an evidence-based assessment of privacy, data handling, migration integrity, access controls, API security, auditability, retention, and operational resilience for the migration workflow.</p><div class="compliance-note">The assessment uses <strong>PASS</strong>, <strong>PARTIAL</strong>, and <strong>NOT ASSESSED</strong> statuses instead of claiming formal regulatory certification.</div></section>`;
    actions.innerHTML = '<button class="btn primary" id="generateComplianceReport">Generate compliance report</button>';
    document.getElementById('generateComplianceReport').onclick = function () {
      page.innerHTML = reportMarkup();
      actions.innerHTML = '<div class="compliance-actions"><button class="btn" id="downloadComplianceReport">Download report</button><button class="btn" id="refreshComplianceReport">Regenerate</button></div>';
      document.getElementById('downloadComplianceReport').onclick = downloadReport;
      document.getElementById('refreshComplianceReport').onclick = function () { page.innerHTML = reportMarkup(); };
    };
  }

  const originalRender = render;
  render = function () {
    originalRender();
    if (current === COMPLIANCE_PAGE) {
      title.textContent = COMPLIANCE_PAGE;
      renderComplianceIntro();
    }
  };

  render();
})();
