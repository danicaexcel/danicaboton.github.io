(function () {
  const PROCESSING_PAGE = 'Processing History';
  const AUDIT_TAB = 'Audit Log';

  const events = [
    ['2026-09-03 10:07:00','AUD-0001','COR-JHR028','JHR-028','BATCH','Migration service','Batch opened','Source manifest metadata','Manifest created; candidate payload not logged','STARTED','EV-12 · DH-11'],
    ['2026-09-03 10:07:01','AUD-0002','COR-JHR028','JHR-028','BATCH','Migration service','Manifest locked','Source row count + schema','SHA-256 manifest fingerprint stored','PASS','EV-09 · DH-08'],
    ['2026-09-03 10:07:02','AUD-0003','COR-JHR028','JHR-028','BATCH','Migration service','Required-field validation','16 mapped columns','Only approved migration fields accepted','PASS','EV-01 · DH-02'],
    ['2026-09-03 10:07:14','AUD-0004','COR-28-184','JHR-028','SRC-000184','Parser worker','Source row read','Candidate row + resume file reference','Log uses synthetic record ref; direct PII suppressed','PASS','EV-02 · DH-09'],
    ['2026-09-03 10:07:14','AUD-0005','COR-28-184','JHR-028','SRC-000184','Drive validator','Resume link validation','gdrive_link / file reference','HTTPS check; file identifier masked in logs','PASS','EV-08 · DH-06'],
    ['2026-09-03 10:07:15','AUD-0006','COR-28-184','JHR-028','SRC-000184','Parser worker','Resume extraction','Name, contact, employment, education, license','Parsed body not written to operational log','PASS','EV-01 · DH-01'],
    ['2026-09-03 10:07:15','AUD-0007','COR-28-184','JHR-028','SRC-000184','Field mapper','Candidate field mapping','Parsed candidate and contact fields','Approved source-to-Zoho mapping applied; log stores status only','PASS','EV-07 · DH-09'],
    ['2026-09-03 10:07:16','AUD-0008','COR-28-184','JHR-028','SRC-000184','Validation service','Required-field validation','Mapped candidate and facility fields','Validation status only; direct values omitted','PASS','EV-02 · DH-05'],
    ['2026-09-03 10:07:16','AUD-0009','COR-28-184','JHR-028','SRC-000184','Facility mapper','Facility mapping','facility-applied','Approved lookup map; ambiguous values routed to review','PASS','EV-05 · DH-08'],
    ['2026-09-03 10:07:16','AUD-0010','COR-28-184','JHR-028','SRC-000184','Confidence engine','Confidence scoring','Parsed candidate fields','Score stored as operational metadata, not PII','0.96 PASS','EV-05 · DH-08'],
    ['2026-09-03 10:07:17','AUD-0011','COR-28-184','JHR-028','SRC-000184','Zoho API client','Create candidate','Approved mapped fields only','OAuth token redacted; HTTPS endpoint','201 CREATED','EV-04 · DH-05'],
    ['2026-09-03 10:07:18','AUD-0012','COR-28-184','JHR-028','SRC-000184','Zoho API client','Destination verification','Destination record ID + expected fields','Read-back verifies write; values not copied to log','PASS','EV-09 · DH-08'],
    ['2026-09-03 10:07:18','AUD-0013','COR-28-184','JHR-028','SRC-000184','Migration service','Resume reference write','Authorized Drive file reference','Reference retained; file content not copied into log','PASS','EV-08 · DH-03'],
    ['2026-09-03 10:07:18','AUD-0014','COR-28-184','JHR-028','SRC-000184','Migration service','Temporary payload cleanup','Parser working object','Temporary object released after verified disposition','COMPLETED','EV-12 · DH-12'],
    ['2026-09-03 10:07:19','AUD-0015','COR-28-185','JHR-028','SRC-000185','Parser worker','Source row read','Candidate row + resume reference','Direct PII suppressed from audit log','PASS','EV-07 · DH-09'],
    ['2026-09-03 10:07:19','AUD-0016','COR-28-185','JHR-028','SRC-000185','Confidence engine','Confidence scoring','Facility + parsed qualification','Low-confidence result creates exception instead of auto-write','0.63 REVIEW','EV-05 · DH-08'],
    ['2026-09-03 10:07:20','AUD-0017','COR-28-185','JHR-028','SRC-000185','Exception handler','Exception created','Record reference + reason code','No resume body/contact values stored in exception log','EX-0037 OPEN','EV-05 · DH-09'],
    ['2026-09-03 10:07:21','AUD-0018','COR-28-185','JHR-028','SRC-000185','Review queue','Auto-write blocked','Candidate mapped payload','Destination write prevented pending controlled review','HELD','EV-05 · DH-08'],
    ['2026-09-03 10:07:22','AUD-0019','COR-28-186','JHR-028','SRC-000186','Parser worker','Source row read','Candidate row + resume reference','Direct PII suppressed from audit log','PASS','EV-07 · DH-09'],
    ['2026-09-03 10:07:22','AUD-0020','COR-28-186','JHR-028','SRC-000186','Field mapper','Candidate field mapping','Parsed candidate and facility fields','Approved mapping applied without logging direct values','PASS','EV-02 · DH-05'],
    ['2026-09-03 10:07:23','AUD-0021','COR-28-186','JHR-028','SRC-000186','Zoho API client','Create candidate','Approved mapped fields','OAuth token redacted; HTTPS endpoint','201 CREATED','EV-03 · DH-07'],
    ['2026-09-03 10:08:09','AUD-0022','COR-28-207','JHR-028','SRC-000207','Zoho API client','Destination update','Approved mapped fields','HTTPS + OAuth token redacted','429 RATE_LIMIT','EV-04 · DH-12'],
    ['2026-09-03 10:08:09','AUD-0023','COR-28-207','JHR-028','SRC-000207','Retry controller','Retry scheduled','Request metadata only','Bounded retry; payload not emitted to log','WAIT 2s','EV-04 · DH-12'],
    ['2026-09-03 10:08:11','AUD-0024','COR-28-207','JHR-028','SRC-000207','Zoho API client','Retry 1','Same approved mapped fields','HTTPS + redacted credentials','200 SUCCESS','EV-04 · DH-06'],
    ['2026-09-03 10:08:12','AUD-0025','COR-28-207','JHR-028','SRC-000207','Migration service','Write verification','Destination record ID','Read-back confirms expected record state','PASS','EV-09 · DH-11'],
    ['2026-09-03 10:08:15','AUD-0026','COR-28-244','JHR-028','SRC-000244','Drive validator','Resume access check','Masked Drive file reference','403 routed to exception; no unauthorized bypass attempted','EXCEPTION','EV-08 · DH-06'],
    ['2026-09-03 10:08:16','AUD-0027','COR-28-244','JHR-028','SRC-000244','Exception handler','File-access exception','Record ref + reason code','Candidate data not copied into exception detail','EX-0044 OPEN','EV-05 · DH-09'],
    ['2026-09-03 10:11:42','AUD-0028','COR-JHR028','JHR-028','BATCH','Migration service','Processing totals calculated','Disposition counts only','No candidate-level PII in batch summary','PASS','EV-03 · DH-11'],
    ['2026-09-03 10:11:43','AUD-0029','COR-JHR028','JHR-028','BATCH','Reconciler','Reconciliation','5,000 source rows / 5,000 dispositions','Count-based verification detects silent loss','100% ACCOUNTED','EV-03 · DH-07'],
    ['2026-09-03 10:11:44','AUD-0030','COR-JHR028','JHR-028','BATCH','Reconciler','Exception register verification','45 exception references','Every held/error row linked to exception record','PASS','EV-05 · DH-11'],
    ['2026-09-03 10:11:45','AUD-0031','COR-JHR028','JHR-028','BATCH','Audit service','Security-log review','Tokens / direct PII / resume bodies','Expected redaction rules checked in reconstructed log','PARTIAL','EV-07 · DH-09'],
    ['2026-09-03 10:11:46','AUD-0032','COR-JHR028','JHR-028','BATCH','Migration service','Batch closed','Batch state + final counts','Final state immutable in demo audit trail','COMPLETED','EV-12 · DH-11'],
    ['2026-09-03 10:11:47','AUD-0033','COR-JHR028','JHR-028','BATCH','Governance check','Temporary exports / logs','Retention schedule not attached; no false PASS issued','NOT ASSESSED','EV-10 · DH-10'],
    ['2026-09-03 10:11:48','AUD-0034','COR-JHR028','JHR-028','BATCH','Report generator','Evidence index generated','Control IDs + evidence IDs + aggregate metrics','Public report contains synthetic references only','COMPLETED','EV-12 · DH-11']
  ];

  const cols = ['Timestamp','Event ID','Correlation','Batch','Record ref','Actor / system','Operation','Data handled','Protection / handling rule','Result','Evidence / control'];

  const style = document.createElement('style');
  style.textContent = `
    .audit-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:12px}
    .audit-toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:0 0 12px}
    .audit-toolbar label{font-size:9px;color:#68778a;font-weight:700}.audit-toolbar select{height:31px;border:1px solid #d1d9e3;background:#fff;padding:0 9px;font-size:9px;color:#425168}
    .audit-table-wrap{overflow:auto;border:1px solid #dce3eb;background:#fff}.audit-table{min-width:1450px}.audit-table th{position:sticky;top:0;z-index:1}.audit-table td{line-height:1.35}
    .audit-code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:9px;color:#33455d;white-space:nowrap}
    .audit-pass{font-weight:700;color:#197450}.audit-warn{font-weight:700;color:#8a6100}.audit-note{margin-top:12px;padding:11px 13px;background:#f7f9fc;border:1px solid #e2e7ed;font-size:9px;line-height:1.55;color:#667487}
    @media(max-width:900px){.audit-summary{grid-template-columns:repeat(2,1fr)}}
  `;
  document.head.appendChild(style);

  if (!pages.includes(PROCESSING_PAGE)) pages.push(PROCESSING_PAGE);
  if (!tabs.includes(AUDIT_TAB)) tabs.push(AUDIT_TAB);
  tabToPage[AUDIT_TAB] = PROCESSING_PAGE;

  const previousActiveTab = activeTab;
  activeTab = function () {
    return current === PROCESSING_PAGE ? AUDIT_TAB : previousActiveTab();
  };

  function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function resultClass(v){return /PASS|SUCCESS|CREATED|COMPLETED|ACCOUNTED|NO_MATCH/i.test(v)?'audit-pass':/PARTIAL|REVIEW|EXCEPTION|HELD|429|NOT ASSESSED/i.test(v)?'audit-warn':'';}

  function filteredEvents(){
    const filter = document.getElementById('auditRecordFilter');
    if (!filter || filter.value === 'ALL') return events;
    return events.filter(r => r[4] === filter.value || (filter.value === 'BATCH' && r[4] === 'BATCH'));
  }

  function tableMarkup(rows){
    return `<div class="audit-table-wrap"><table class="audit-table"><thead><tr>${cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((v,i)=>`<td class="${i===1||i===2||i===4?'audit-code':''} ${i===9?resultClass(v):''}">${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }

  function refreshTable(){
    const mount=document.getElementById('auditTableMount');
    if(mount) mount.innerHTML=tableMarkup(filteredEvents());
    const shown=document.getElementById('auditShownCount');
    if(shown) shown.textContent=filteredEvents().length;
  }

  function toCsv(rows){
    const q=v=>'"'+String(v).replace(/"/g,'""')+'"';
    return [cols.map(q).join(','),...rows.map(r=>r.map(q).join(','))].join('\r\n');
  }

  function downloadBlob(text,type,name){
    const u=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),0);
  }

  function downloadCsv(){
    const d=new Date().toISOString().slice(0,10);downloadBlob(toCsv(filteredEvents()),'text/csv;charset=utf-8',`zoho-migration-processing-audit-${d}.csv`);
  }

  function downloadAuditHtml(){
    const d=new Date().toISOString().slice(0,10),rows=filteredEvents();
    const html=`<!doctype html><html><head><meta charset="utf-8"><title>Zoho Migration Processing Audit History</title><style>body{font:12px/1.45 Arial,sans-serif;color:#1d2a3c;margin:32px}h1{margin-bottom:4px}.meta{color:#667487;margin-bottom:20px}.note{padding:10px;background:#f7f9fc;border:1px solid #dce3eb;margin:16px 0}table{width:100%;border-collapse:collapse}th,td{border:1px solid #dce3eb;padding:6px;text-align:left;vertical-align:top}th{background:#f3f6fa;font-size:10px}</style></head><body><h1>Data Processing Audit History</h1><div class="meta">Enterprise Zoho CRM Engineering &amp; Migration<br>Generated: ${d}<br>Batch: JHR-028 · Public reconstruction with synthetic identifiers<br>Events exported: ${rows.length}</div><div class="note"><strong>Purpose:</strong> This audit history records the end-to-end handling path used to support the data-handling assessment: ingestion, validation, extraction, mapping, confidence review, API writes, retries, exceptions, verification, reconciliation, and batch closure. It is a synthetic portfolio reconstruction, not an original client production log.</div>${tableMarkup(rows)}<div class="note"><strong>Privacy boundary:</strong> Candidate names, emails, phone numbers, resume bodies, access tokens, and private client identifiers are intentionally excluded or represented by synthetic references.</div></body></html>`;
    downloadBlob(html,'text/html;charset=utf-8',`zoho-migration-processing-audit-${d}.html`);
  }

  function renderAudit(){
    const refs=['ALL','BATCH',...Array.from(new Set(events.filter(r=>r[4]!=='BATCH').map(r=>r[4])))];
    title.textContent='Data Processing Audit History';
    actions.innerHTML='<div class="compliance-actions"><button class="btn" id="auditCsv">Download CSV log</button><button class="btn primary" id="auditHtml">Download audit report</button></div>';
    page.innerHTML=`<section class="audit-summary"><article class="card"><strong>${events.length}</strong><span>audit events reconstructed</span></article><article class="card"><strong>${new Set(events.filter(r=>r[4]!=='BATCH').map(r=>r[4])).size}</strong><span>sample records traced end-to-end</span></article><article class="card"><strong>0</strong><span>unaccounted rows in reconciliation</span></article><article class="card"><strong id="auditShownCount">${events.length}</strong><span>events currently shown</span></article></section><section class="panel"><h3>End-to-end processing history</h3><p class="muted">This is the supporting audit trail behind the assessment. It shows what happened to the data at each stage, which system or function performed the action, what data category was touched, what protection was applied, the result, and which evidence/control it supports.</p><div class="audit-toolbar"><label for="auditRecordFilter">Filter trace</label><select id="auditRecordFilter">${refs.map(r=>`<option value="${r}">${r==='ALL'?'All events':r==='BATCH'?'Batch-level events':r}</option>`).join('')}</select></div><div id="auditTableMount">${tableMarkup(events)}</div><div class="audit-note"><strong>Important:</strong> this public portfolio cannot truthfully expose the original client production audit log. The history shown here is a synthetic reconstruction of the logging/audit model. For a real compliance evidence package, export the equivalent sanitized rows from the actual migration runner, Zoho API logs, Drive access checks, exception register, and reconciliation output.</div></section>`;
    document.getElementById('auditRecordFilter').onchange=refreshTable;
    document.getElementById('auditCsv').onclick=downloadCsv;
    document.getElementById('auditHtml').onclick=downloadAuditHtml;
  }

  const previousRender = render;
  render = function () {
    previousRender();
    if (current === PROCESSING_PAGE) renderAudit();
  };

  render();
})();
