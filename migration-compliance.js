(function () {
  const COMPLIANCE_PAGE = 'Compliance Report';
  const COMPLIANCE_TAB = 'Compliance';

  const controls = [
    ['DH-01','Personal Data Inventory','PASS','Candidate identity, contact, address, resume and qualification fields are identified in the migration map.',['EV-01','EV-07']],
    ['DH-02','Data Minimization','PASS','Only recruitment and migration-required fields are included in the mapped data set.',['EV-01']],
    ['DH-03','Purpose Limitation','PASS','Processing is scoped to recruitment migration, validation, reconciliation, and operational review.',['EV-01','EV-11']],
    ['DH-04','Access & Least Privilege','PARTIAL','Role and API-scope review is represented; production IAM evidence still requires owner validation.',['EV-06']],
    ['DH-05','Credential Protection','PASS','OAuth/API secrets are excluded from candidate records and generated report evidence.',['EV-04','EV-07']],
    ['DH-06','Transport Security','PASS','REST/API integrations are represented as HTTPS/TLS-protected endpoints.',['EV-04']],
    ['DH-07','Migration Reconciliation','PASS','Each source row receives a migrated or exception disposition.',['EV-02','EV-03']],
    ['DH-08','Data Accuracy & Confidence','PASS','Confidence scoring and exception review gate uncertain parsed candidate fields.',['EV-02','EV-05','EV-09']],
    ['DH-09','PII-safe Operational Logging','PARTIAL','Operational evidence is designed around IDs and statuses; production log sampling remains a review item.',['EV-07']],
    ['DH-10','Retention & Deletion','NOT ASSESSED','Retention periods and deletion schedules require data-owner and legal-basis configuration.',['EV-10']],
    ['DH-11','Auditability','PASS','Batch, API, exception, and reconciliation events provide traceable operational evidence.',['EV-02','EV-04','EV-12']],
    ['DH-12','Recovery & Reliability','PASS','Controlled batches, retries, and reconciliation support recoverable execution.',['EV-03','EV-04','EV-12']],
    ['DH-13','Third-party Processing','PARTIAL','Zoho, Google Drive, and source ATS dependencies are identified; contractual review is outside this demo.',['EV-11']],
    ['DH-14','Data Subject Rights Support','PASS','Mapped records remain addressable for access, correction, and deletion workflows.',['EV-01','EV-10']]
  ];

  const evidenceDocs = [
    {id:'EV-01',title:'Data Mapping & PII Inventory',type:'Control evidence',status:'AVAILABLE',supports:['DH-01','DH-02','DH-03','DH-14'],summary:'Documents the source-to-Zoho field map, PII classification, processing purpose, and whether each field is required.',columns:['Source field','Target field','Classification','Purpose','Required'],rows:[
      ['resume_filename','Source Resume Filename','Operational metadata','Trace source record and resume','Yes'],
      ['gdrive_link','Resume File Link','Personal data reference','Preserve authorized recruiter access path','Yes'],
      ['first_name / last_name','Candidate identity','PII','Candidate identification','Yes'],
      ['email / mobile','Contact fields','PII','Recruitment contact','Yes'],
      ['street / state / zip','Candidate address','PII','Recruitment record migration','Conditional'],
      ['facility-applied','Facility Lookup','Recruitment data','Route candidate to target facility','Yes'],
      ['confidence','Migration Confidence','Operational metadata','Manual review gate','Yes'],
      ['license','License','Qualification data','Credential / qualification mapping','Conditional']
    ]},
    {id:'EV-02',title:'Migration Processing Log',type:'Operational log',status:'AVAILABLE',supports:['DH-07','DH-08','DH-11'],summary:'Synthetic execution log showing traceable batch processing without exposing candidate names, email addresses, resume contents, or access tokens.',columns:['Timestamp','Batch','Record ref','Stage','Result'],rows:[
      ['2026-09-03 10:07:14','JHR-028','SRC-000184','Manifest validation','PASS'],
      ['2026-09-03 10:07:15','JHR-028','SRC-000184','Candidate field mapping','PASS'],
      ['2026-09-03 10:07:16','JHR-028','SRC-000184','Facility lookup','PASS'],
      ['2026-09-03 10:07:17','JHR-028','SRC-000184','Zoho write','CREATED'],
      ['2026-09-03 10:07:19','JHR-028','SRC-000185','Confidence validation','REVIEW_REQUIRED'],
      ['2026-09-03 10:07:22','JHR-028','SRC-000186','Zoho write verification','PASS']
    ]},
    {id:'EV-03',title:'Migration Reconciliation Report',type:'Reconciliation',status:'AVAILABLE',supports:['DH-07','DH-12'],summary:'Shows that processed source rows reconcile to a final disposition so records are not silently lost.',columns:['Metric','Count','Validation'],rows:[
      ['Source rows in sample batch','5,000','Locked manifest'],
      ['Migrated','4,955','Destination record verified'],
      ['Exceptions','45','Exception register created'],
      ['Unaccounted rows','0','PASS — all rows have a disposition'],
      ['Reconciliation rate','100.0%','5,000 / 5,000 accounted for']
    ]},
    {id:'EV-04',title:'API Request, Retry & Security Log',type:'Integration evidence',status:'AVAILABLE',supports:['DH-05','DH-06','DH-11','DH-12'],summary:'Demonstrates HTTPS API usage, token redaction, response tracking, and bounded retries.',columns:['Time','Operation','Endpoint / security','HTTP','Outcome'],rows:[
      ['10:08:02','Get Record','https://www.zohoapis.com/... · OAuth token REDACTED','200','Success'],
      ['10:08:05','Search Records','https://www.zohoapis.com/... · OAuth token REDACTED','200','Success'],
      ['10:08:09','Update Record','https://www.zohoapis.com/... · OAuth token REDACTED','429','Retry scheduled'],
      ['10:08:11','Update Record retry 1','HTTPS · backoff 2s','200','Success'],
      ['10:08:15','Drive link check','HTTPS · file ID masked','403','Exception routed for review']
    ]},
    {id:'EV-05',title:'Exception & Manual Review Register',type:'Exception evidence',status:'AVAILABLE',supports:['DH-08'],summary:'Records low-confidence or validation failures that require controlled manual review instead of being silently accepted.',columns:['Exception ID','Reason','Confidence','Disposition','Owner state'],rows:[
      ['EX-0037','Facility name ambiguous','0.63','Manual mapping required','OPEN'],
      ['EX-0041','License value requires normalization','0.71','Qualification review','OPEN'],
      ['EX-0044','Resume link inaccessible','0.92','Source link validation','OPEN'],
    ]},
    {id:'EV-06',title:'Access & OAuth Scope Review',type:'Access review',status:'PARTIAL',supports:['DH-04'],summary:'Documents the intended least-privilege access model. Production user-role exports and owner approval remain external evidence.',columns:['Identity / integration','Required access','Excluded access','Assessment'],rows:[
      ['Migration operator','Candidate migration modules only','Admin/security configuration','Least-privilege design documented'],
      ['Zoho OAuth client','Read/write required CRM/Recruit records','Unrelated modules','Scope review represented'],
      ['Google Drive integration','Read authorized resume files','Unrelated Drive content','Folder/file boundary expected'],
      ['Production IAM export','Owner-provided evidence','—','NOT ATTACHED / requires validation']
    ]},
    {id:'EV-07',title:'PII-safe Logging Review',type:'Logging evidence',status:'PARTIAL',supports:['DH-01','DH-05','DH-09'],summary:'Shows the logging pattern expected for operational traceability while suppressing direct PII and secrets. Production log sampling remains required.',columns:['Log element','Allowed example','Prohibited example','Result'],rows:[
      ['Record identifier','SRC-000184 / ZOHO-83F2','Candidate full name','PASS pattern'],
      ['Contact data','[redacted]','Full email / phone','PASS pattern'],
      ['Resume content','File reference only','Parsed resume body','PASS pattern'],
      ['Credentials','TOKEN_REDACTED','OAuth access token','PASS pattern'],
      ['Production sample review','Pending owner evidence','—','PARTIAL']
    ]},
    {id:'EV-08',title:'Resume Link Integrity Check',type:'File evidence',status:'AVAILABLE',supports:['DH-08'],summary:'Validates that migrated resume references resolve or are routed to an exception rather than being accepted blindly.',columns:['File ref','Link check','Access result','Disposition'],rows:[
      ['DRV-2A91','HTTPS URL format valid','200 / accessible','PASS'],
      ['DRV-2A92','HTTPS URL format valid','200 / accessible','PASS'],
      ['DRV-2A93','HTTPS URL format valid','403 / restricted','EXCEPTION'],
      ['DRV-2A94','Missing link','N/A','EXCEPTION']
    ]},
    {id:'EV-09',title:'Data Integrity Manifest',type:'Integrity evidence',status:'AVAILABLE',supports:['DH-08'],summary:'Demonstrates count, schema, and sample checksum controls used to detect accidental transformation or transfer errors.',columns:['Check','Source','Destination','Result'],rows:[
      ['Required columns','16 mapped fields','16 mapped fields','PASS'],
      ['Sample record count','5,000','5,000 dispositions','PASS'],
      ['Null check: candidate identity','0 invalid accepted','0 invalid accepted','PASS'],
      ['Sample manifest checksum','sha256: 9f8c…2a41','sha256: 9f8c…2a41','MATCH']
    ]},
    {id:'EV-10',title:'Retention & Deletion Assessment',type:'Policy evidence',status:'NOT ASSESSED',supports:['DH-10','DH-14'],summary:'Makes the missing policy explicit rather than falsely treating retention as implemented.',columns:['Data set','Current evidence','Required decision','Status'],rows:[
      ['Temporary migration exports','No approved retention schedule attached','Define retention and secure deletion window','NOT ASSESSED'],
      ['Operational logs','No approved retention schedule attached','Define operational/security retention','NOT ASSESSED'],
      ['Exception review files','No approved retention schedule attached','Define closure/deletion rule','NOT ASSESSED'],
      ['Deletion request workflow','Record identifiers remain addressable','Connect to approved privacy procedure','DESIGN SUPPORTS']
    ]},
    {id:'EV-11',title:'Third-party Processing Register',type:'Processor register',status:'PARTIAL',supports:['DH-03','DH-13'],summary:'Identifies external systems that receive or store recruitment data; contractual/DPA review is intentionally marked external.',columns:['Processor / system','Role','Data involved','Evidence state'],rows:[
      ['JazzHR / source ATS','Source system','Candidate records / resume references','Identified'],
      ['Google Drive','Document storage','Resume files / file links','Identified'],
      ['Zoho Recruit / CRM','Destination system','Candidate and recruitment records','Identified'],
      ['Processor contracts / DPAs','Legal/vendor evidence','Contractual safeguards','NOT ATTACHED']
    ]},
    {id:'EV-12',title:'Execution Audit Trail & Recovery Record',type:'Audit evidence',status:'AVAILABLE',supports:['DH-11','DH-12'],summary:'Shows batch state transitions, retry events, exception creation, and final reconciliation as a recoverable execution trail.',columns:['Sequence','Event','State before','State after','Evidence'],rows:[
      ['01','Manifest locked','Prepared','Running','Batch JHR-028'],
      ['02','Rate limit received','Running','Retry wait','HTTP 429 captured'],
      ['03','Retry succeeded','Retry wait','Running','HTTP 200'],
      ['04','45 exceptions registered','Running','Review pending','Exception register'],
      ['05','Reconciliation completed','Review pending','Completed','0 unaccounted rows']
    ]}
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
    .evidence-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:12px}
    .evidence-card{border:1px solid #dce3eb;background:#fff;padding:13px;min-height:118px}
    .evidence-card .evidence-id{font-size:9px;font-weight:700;color:#315fd7;letter-spacing:.05em}
    .evidence-card h4{font-size:11px;margin:6px 0;color:#27364a}
    .evidence-card p{font-size:9px;line-height:1.45;color:#68778a;margin:0 0 9px}
    .evidence-meta{display:flex;justify-content:space-between;gap:8px;font-size:8px;color:#7b8999}
    .evidence-link{border:0;background:#eef3ff;color:#315fd7;font-size:8px;font-weight:700;padding:4px 6px;cursor:pointer;margin:1px 2px 1px 0}
    .evidence-viewer{margin-top:12px;border:1px solid #cfd8e4;background:#fff;padding:16px}
    .evidence-viewer-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:12px}
    .evidence-viewer h3{margin:0 0 4px}
    .evidence-viewer .evidence-sub{font-size:9px;color:#68778a;line-height:1.5}
    .evidence-status{font-size:8px;font-weight:700;padding:5px 7px;background:#e8f7ef;color:#197450;white-space:nowrap}
    .evidence-status.partial{background:#fff4d8;color:#8a6100}.evidence-status.na{background:#eef1f5;color:#5b6878}
    .evidence-section-title{font-size:12px;margin:0 0 4px}.evidence-section-copy{font-size:9px;color:#68778a;line-height:1.5;margin:0}
    .evidence-pack-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
    @media(max-width:1100px){.evidence-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:900px){.compliance-summary{grid-template-columns:repeat(2,1fr)}.compliance-report-head,.evidence-pack-head{display:block}.compliance-report-meta{text-align:left;margin-top:10px}.evidence-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  if (!pages.includes(COMPLIANCE_PAGE)) pages.push(COMPLIANCE_PAGE);
  if (!tabs.includes(COMPLIANCE_TAB)) tabs.push(COMPLIANCE_TAB);
  tabToPage[COMPLIANCE_TAB] = COMPLIANCE_PAGE;

  const originalActiveTab = activeTab;
  activeTab = function () {
    return current === COMPLIANCE_PAGE ? COMPLIANCE_TAB : originalActiveTab();
  };

  function esc(value) {
    return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function statusClass(status) {
    return status === 'PARTIAL' ? 'partial' : status === 'NOT ASSESSED' ? 'review' : '';
  }

  function evidenceStatusClass(status) {
    return status === 'PARTIAL' ? 'partial' : status === 'NOT ASSESSED' ? 'na' : '';
  }

  function counts() {
    return {
      pass: controls.filter(c => c[2] === 'PASS').length,
      partial: controls.filter(c => c[2] === 'PARTIAL').length,
      notAssessed: controls.filter(c => c[2] === 'NOT ASSESSED').length
    };
  }

  function evidenceButtons(ids) {
    return ids.map(id => `<button class="evidence-link" type="button" data-evidence="${id}">${id}</button>`).join('');
  }

  function evidenceViewerMarkup(doc) {
    return `<section class="evidence-viewer" id="evidenceViewer"><div class="evidence-viewer-head"><div><h3>${doc.id} · ${doc.title}</h3><div class="evidence-sub">${doc.type} · Supports ${doc.supports.join(', ')}<br>${doc.summary}</div></div><span class="evidence-status ${evidenceStatusClass(doc.status)}">${doc.status}</span></div><table><thead><tr>${doc.columns.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${doc.rows.map(row=>`<tr>${row.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table><div class="compliance-note"><strong>Evidence boundary:</strong> This is a synthetic reconstruction of the type of supporting document the migration process should retain. It demonstrates the control design and expected audit trail; it is not a claim that original client production logs are publicly available.</div></section>`;
  }

  function evidencePackMarkup() {
    return `<section class="panel"><div class="evidence-pack-head"><div><h3 class="evidence-section-title">Supporting Evidence Pack</h3><p class="evidence-section-copy">The assessment is backed by reconstructed operational artifacts: processing logs, reconciliation, API/retry evidence, exception records, access review, PII-safe logging review, integrity checks, retention gaps, processor register, and execution audit trail.</p></div><div class="compliance-report-meta"><strong>${evidenceDocs.length} supporting artifacts</strong><br>Evidence IDs are linked to each compliance control.</div></div><div class="evidence-grid">${evidenceDocs.map(doc=>`<article class="evidence-card"><span class="evidence-id">${doc.id} · ${doc.status}</span><h4>${doc.title}</h4><p>${doc.summary}</p><div class="evidence-meta"><span>${doc.type}</span><button class="evidence-link" type="button" data-evidence="${doc.id}">View evidence</button></div></article>`).join('')}</div><div id="evidenceMount"></div></section>`;
  }

  function reportMarkup() {
    const c = counts();
    return `<section class="compliance-summary"><article class="card"><strong>${controls.length}</strong><span>controls assessed</span></article><article class="card"><strong>${c.pass}</strong><span>pass</span></article><article class="card"><strong>${c.partial}</strong><span>partial</span></article><article class="card"><strong>${c.notAssessed}</strong><span>not assessed</span></article></section><section class="panel"><div class="compliance-report-head"><div><h3>Data Handling &amp; Compliance Assessment</h3><p class="muted">Enterprise Zoho CRM Engineering &amp; Migration · Candidate PII · 59K+ JazzHR source scope · 120K+ overall migration program</p></div><div class="compliance-report-meta">Framework alignment<br><strong>Philippines DPA · GDPR principles · SOC 2 control concepts · API security</strong></div></div><table><thead><tr><th>Control</th><th>Area</th><th>Status</th><th>Supporting evidence</th><th>Observed evidence / assessment</th></tr></thead><tbody>${controls.map(c => `<tr><td><strong>${c[0]}</strong></td><td>${c[1]}</td><td><span class="status ${statusClass(c[2])}">${c[2]}</span></td><td>${evidenceButtons(c[4])}</td><td>${c[3]}</td></tr>`).join('')}</tbody></table><div class="compliance-note"><strong>Assessment boundary:</strong> This demo documents technical and operational controls and reconstructed supporting evidence. It is not a legal certification of GDPR, the Philippine Data Privacy Act, SOC 2, or any other regulatory framework.</div></section>${evidencePackMarkup()}`;
  }

  function bindEvidenceLinks() {
    page.querySelectorAll('[data-evidence]').forEach(btn => {
      btn.onclick = function () {
        const doc = evidenceDocs.find(d => d.id === btn.dataset.evidence);
        if (!doc) return;
        let mount = document.getElementById('evidenceMount');
        if (!mount) {
          page.insertAdjacentHTML('beforeend','<div id="evidenceMount"></div>');
          mount = document.getElementById('evidenceMount');
        }
        mount.innerHTML = evidenceViewerMarkup(doc);
        const viewer = document.getElementById('evidenceViewer');
        if (viewer) viewer.scrollIntoView({behavior:'smooth',block:'start'});
      };
    });
  }

  function htmlTable(columns, rows) {
    return `<table><thead><tr>${columns.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }

  function downloadableReport(includeEvidence) {
    const date = new Date().toISOString().slice(0, 10);
    const rows = controls.map(c => `<tr><td>${c[0]}</td><td>${c[1]}</td><td>${c[2]}</td><td>${c[4].join(', ')}</td><td>${c[3]}</td></tr>`).join('');
    const evidence = includeEvidence ? evidenceDocs.map(doc => `<section><h2>${doc.id} · ${doc.title}</h2><p><strong>${doc.status}</strong> · ${doc.type} · Supports ${doc.supports.join(', ')}</p><p>${doc.summary}</p>${htmlTable(doc.columns,doc.rows)}</section>`).join('') : '';
    return {date,html:`<!doctype html><html><head><meta charset="utf-8"><title>Zoho Migration Compliance ${includeEvidence?'Evidence Pack':'Assessment'}</title><style>body{font:14px/1.5 Arial,sans-serif;color:#1d2a3c;margin:40px}h1{margin-bottom:6px}h2{font-size:18px;margin-top:34px}.meta{color:#667487;margin-bottom:24px}table{width:100%;border-collapse:collapse;margin:12px 0 20px}th,td{border:1px solid #dce3eb;padding:9px;text-align:left;vertical-align:top}th{background:#f3f6fa}.note{margin-top:20px;padding:12px;background:#f7f9fc;border:1px solid #dce3eb;font-size:12px}section{page-break-inside:avoid}</style></head><body><h1>Data Handling &amp; Compliance Assessment</h1><div class="meta">Enterprise Zoho CRM Engineering &amp; Migration<br>Generated: ${date}<br>Data classification: Confidential / Candidate PII<br>Scope: 59K+ JazzHR · 120K+ overall migration program<br>Framework alignment: Philippines DPA · GDPR principles · SOC 2 control concepts · API security</div><table><thead><tr><th>Control</th><th>Area</th><th>Status</th><th>Supporting evidence</th><th>Assessment</th></tr></thead><tbody>${rows}</tbody></table>${evidence}<div class="note"><strong>Evidence boundary:</strong> Supporting artifacts in this public portfolio are synthetic reconstructions demonstrating expected control evidence and auditability. They do not expose original candidate PII, credentials, or private client production logs and do not constitute legal certification.</div></body></html>`};
  }

  function downloadHtml(report, filename) {
    const url = URL.createObjectURL(new Blob([report.html], {type:'text/html;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function downloadReport() {
    const report = downloadableReport(false);
    downloadHtml(report, `zoho-migration-compliance-${report.date}.html`);
  }

  function downloadEvidencePack() {
    const report = downloadableReport(true);
    downloadHtml(report, `zoho-migration-compliance-evidence-pack-${report.date}.html`);
  }

  function renderGeneratedReport() {
    page.innerHTML = reportMarkup();
    actions.innerHTML = '<div class="compliance-actions"><button class="btn" id="downloadComplianceReport">Download report</button><button class="btn primary" id="downloadEvidencePack">Download evidence pack</button><button class="btn" id="refreshComplianceReport">Regenerate</button></div>';
    document.getElementById('downloadComplianceReport').onclick = downloadReport;
    document.getElementById('downloadEvidencePack').onclick = downloadEvidencePack;
    document.getElementById('refreshComplianceReport').onclick = renderGeneratedReport;
    bindEvidenceLinks();
  }

  function renderComplianceIntro() {
    page.innerHTML = `<section class="panel"><h3>Compliance report generator</h3><p class="muted">Generate an evidence-based assessment of privacy, data handling, migration integrity, access controls, API security, auditability, retention, and operational resilience for the migration workflow.</p><div class="compliance-note"><strong>Evidence-backed reporting:</strong> each control is linked to supporting reconstructed artifacts such as processing logs, reconciliation reports, API/retry logs, exception registers, access reviews, PII-safe log samples, integrity checks, retention assessments, and processor records. Public evidence uses synthetic identifiers so no candidate PII or client secrets are exposed.</div></section>`;
    actions.innerHTML = '<button class="btn primary" id="generateComplianceReport">Generate compliance report + evidence</button>';
    document.getElementById('generateComplianceReport').onclick = renderGeneratedReport;
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
