(function(){
  const PROCESSING_PAGE='Processing History';
  const AUDIT_TAB='Audit Log';
  const PROGRAM_TOTAL=120000;
  const events=[
    ['2026-09-05 18:22:00','AUD-0001','RUN-01','CONTROL','BATCH','Migration controller','Source selection','JazzHR Drive + Apploi','Two source lanes selected; parallel mode enabled','STARTED'],
    ['2026-09-05 18:22:01','AUD-0002','RUN-01','CONTROL','BATCH','Migration controller','Checkpoint initialization','Independent source state','Drive index and Apploi cursor initialized separately','PASS'],
    ['2026-09-05 18:22:03','AUD-0003','DRV-481','JAZZHR-DRIVE','DRV-SYN-00481','Google Drive worker','Drive folder read','File metadata only','Authorized folder scope; file ID retained','PASS'],
    ['2026-09-05 18:22:04','AUD-0004','DRV-481','JAZZHR-DRIVE','DRV-SYN-00481','Google Drive worker','Resume download','PDF bytes','Resume body not emitted to operational log','PASS'],
    ['2026-09-05 18:22:05','AUD-0005','DRV-481','JAZZHR-DRIVE','DRV-SYN-00481','Basic extractor','Candidate basic extraction','Name / email / phone / address','Only extraction status and synthetic record ref logged','PASS'],
    ['2026-09-05 18:22:06','AUD-0006','DRV-481','JAZZHR-DRIVE','DRV-SYN-00481','Data-quality worker','Normalize + deduplicate','Contact keys + resume SHA-256','Candidate and resume duplicate checks completed before Zoho create','NO_MATCH'],
    ['2026-09-05 18:22:07','AUD-0007','DRV-481','JAZZHR-DRIVE','DRV-SYN-00481','AI extractor','Professional data extraction','Role / company / skills / experience / education / licenses','Structured output validated; resume body excluded from log','0.94 PASS'],
    ['2026-09-05 18:22:08','AUD-0008','DRV-481','JAZZHR-DRIVE','DRV-SYN-00481','Facility mapper','Facility lookup','Normalized facility alias','Stable Zoho facility lookup resolved','PASS'],
    ['2026-09-05 18:22:09','AUD-0009','DRV-481','JAZZHR-DRIVE','DRV-SYN-00481','Zoho API client','Candidate search','Normalized candidate keys','Duplicate-safe destination search','NO_MATCH'],
    ['2026-09-05 18:22:10','AUD-0010','DRV-481','JAZZHR-DRIVE','DRV-SYN-00481','Zoho API client','Candidate create','Validated candidate fields','OAuth token redacted; destination write accepted','201 CREATED'],
    ['2026-09-05 18:22:11','AUD-0011','DRV-481','JAZZHR-DRIVE','DRV-SYN-00481','Zoho API client','Candidate read-back','Zoho record ID + expected state','Destination candidate verified before file upload','PASS'],
    ['2026-09-05 18:22:12','AUD-0012','DRV-481','JAZZHR-DRIVE','DRV-SYN-00481','Zoho API client','Resume attachment upload','Original Drive resume bytes','Attachment posted to resolved candidate record','200 ATTACHED'],
    ['2026-09-05 18:22:13','AUD-0013','DRV-481','JAZZHR-DRIVE','DRV-SYN-00481','Reconciler','Record close','Candidate + attachment + source file','Final disposition stores candidate and resume attachment outcome','MIGRATED'],
    ['2026-09-05 18:22:03','AUD-0014','APP-311','APPLOI','APP-SYN-00311','Apploi worker','Candidate read','Configured source payload','Parallel source lane executes independently','PASS'],
    ['2026-09-05 18:22:06','AUD-0015','APP-311','APPLOI','APP-SYN-00311','Data-quality worker','Normalize + deduplicate','Candidate source fields','Destination duplicate guard applied','MATCH REVIEW'],
    ['2026-09-05 18:22:07','AUD-0016','APP-311','APPLOI','APP-SYN-00311','Review gate','Ambiguous candidate match','Similarity match','Auto-create blocked pending duplicate review','HELD'],
    ['2026-09-05 18:24:41','AUD-0017','RUN-01','CONTROL','ZOHO-WRITE','Zoho destination limiter','Rate limit','Shared destination concurrency','Parallel source intake retained; destination writes backed off','429 WAIT'],
    ['2026-09-05 18:24:43','AUD-0018','RUN-01','CONTROL','ZOHO-WRITE','Retry controller','Zoho retry','Request metadata only','Bounded retry after shared backoff','201 SUCCESS'],
    ['2026-09-05 18:36:00','AUD-0019','RUN-01','CONTROL','BATCH','Migration controller','Pause requested','Active source lanes','Stops new work after current safe record','PAUSING'],
    ['2026-09-05 18:36:01','AUD-0020','RUN-01','JAZZHR-DRIVE','CHECKPOINT','Migration controller','Drive checkpoint saved','Last safe Drive manifest index','JazzHR Drive lane checkpoint persisted independently','PAUSED'],
    ['2026-09-05 18:36:01','AUD-0021','RUN-01','APPLOI','CHECKPOINT','Migration controller','Apploi checkpoint saved','Source cursor + candidate ID','Apploi lane checkpoint persisted independently','PAUSED'],
    ['2026-09-05 18:41:10','AUD-0022','RUN-01','CONTROL','BATCH','Migration controller','Resume requested','Selected source checkpoints','Each lane continues from its own saved position','RUNNING'],
    ['2026-09-05 19:02:40','AUD-0023','RUN-01','CONTROL','BATCH','Reconciler','Per-source reconciliation','Candidate / duplicate / exception / attachment counts','All processed source items receive a final disposition','100% ACCOUNTED']
  ];
  const cols=['Timestamp','Event ID','Correlation','Source','Record ref','Actor / system','Operation','Data handled','Protection / handling rule','Result'];
  const style=document.createElement('style');style.textContent=`.audit-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:12px}.audit-toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:12px}.audit-toolbar select{height:31px;border:1px solid #d1d9e3;background:#fff;padding:0 9px;font-size:9px;color:#425168}.audit-table-wrap{overflow:auto;border:1px solid #dce3eb;background:#fff}.audit-table{min-width:1350px}.audit-pass{font-weight:700;color:#197450}.audit-warn{font-weight:700;color:#8a6100}.audit-note{margin-top:12px;padding:11px 13px;background:#f7f9fc;border:1px solid #e2e7ed;font-size:9px;line-height:1.55;color:#667487}@media(max-width:900px){.audit-summary{grid-template-columns:repeat(2,1fr)}}`;document.head.appendChild(style);
  if(!pages.includes(PROCESSING_PAGE))pages.push(PROCESSING_PAGE);if(!tabs.includes(AUDIT_TAB))tabs.push(AUDIT_TAB);tabToPage[AUDIT_TAB]=PROCESSING_PAGE;const prev=activeTab;activeTab=function(){return current===PROCESSING_PAGE?AUDIT_TAB:prev()};
  function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}function cls(v){return /PASS|SUCCESS|CREATED|ATTACHED|MIGRATED|ACCOUNTED|NO_MATCH/i.test(v)?'audit-pass':/REVIEW|HELD|429|WAIT|PAUS/i.test(v)?'audit-warn':''}
  function filtered(){const f=document.getElementById('auditSourceFilter');return !f||f.value==='ALL'?events:events.filter(r=>r[3]===f.value)}function table(rows){return `<div class="audit-table-wrap"><table class="audit-table"><thead><tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((v,i)=>`<td class="${i===9?cls(v):''}">${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}
  function renderAudit(){title.textContent='Data Processing Audit History';actions.innerHTML='';const src=['ALL',...new Set(events.map(r=>r[3]))];page.innerHTML=`<section class="audit-summary"><article class="card"><strong>${events.length}</strong><span>synthetic audit events</span></article><article class="card"><strong>2</strong><span>independent source lanes</span></article><article class="card"><strong>1</strong><span>shared Zoho destination limiter</span></article><article class="card"><strong>Resume</strong><span>candidate attachment outcome audited</span></article></section><div class="audit-toolbar"><label>Source <select id="auditSourceFilter">${src.map(s=>`<option>${s}</option>`).join('')}</select></label></div><div id="auditTableMount">${table(events)}</div><div class="audit-note"><strong>Corrected architecture:</strong> JazzHR processing starts from Google Drive files, not a JazzHR API. The audit trail explicitly records Drive discovery/download, basic-data extraction, AI professional-data extraction, Zoho candidate write, original-resume attachment upload, independent source checkpoints, and parallel-source destination throttling.</div>`;document.getElementById('auditSourceFilter').onchange=()=>{document.getElementById('auditTableMount').innerHTML=table(filtered())}}
  function syncProgramScale(){
    if(current!=='Migration Control')return;
    const control=document.getElementById('migrationControl');
    if(!control)return;
    const description=control.querySelector(':scope > .muted');
    if(description&&!/120,000/.test(description.textContent))description.textContent+=` Overall migration-program scope: ${PROGRAM_TOTAL.toLocaleString()}+ records.`;
    const metrics=control.querySelectorAll('.runmetrics .runmetric');
    if(metrics.length){
      const totalMetric=metrics[metrics.length-1];
      totalMetric.innerHTML=`<b>${PROGRAM_TOTAL.toLocaleString()}+</b><span>total migration records</span>`;
      totalMetric.dataset.programTotal='1';
    }
    const modeRow=control.querySelector('.mode-row');
    if(modeRow&&!modeRow.querySelector('[data-program-scope]')){
      const scope=document.createElement('span');
      scope.className='badge gray';
      scope.dataset.programScope='1';
      scope.textContent=`${PROGRAM_TOTAL.toLocaleString()}+ overall records`;
      modeRow.appendChild(scope);
    }
  }
  const baseRender=render;render=function(){if(current===PROCESSING_PAGE){nav();renderAudit();return}baseRender();syncProgramScale()};render();
})();