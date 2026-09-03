(function(){
  const id=new URLSearchParams(location.search).get('id');
  if(id!=='ocr') return;
  const style=document.createElement('style');
  style.textContent=`
    .spx-case-flow{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-top:28px}.spx-case-node{border:1px solid var(--line,#3b4148);background:rgba(255,255,255,.025);padding:18px;min-height:135px}.spx-case-node span{display:block;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#f1b877;margin-bottom:10px}.spx-case-node h3{margin:0 0 8px;font-size:16px}.spx-case-node p{margin:0;font-size:12px;line-height:1.55;color:#aab1b8}.spx-case-phase{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.spx-case-phase article{border:1px solid var(--line,#3b4148);padding:22px;background:rgba(255,255,255,.02)}.spx-case-phase span{font-size:10px;color:#f1b877;text-transform:uppercase;letter-spacing:.08em}.spx-case-phase h3{margin:8px 0 10px}.spx-case-phase p{margin:0;color:#aab1b8;line-height:1.65}.spx-field-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:20px}.spx-field-list span{border:1px solid var(--line,#3b4148);padding:10px 12px;font-size:11px;color:#c7cdd3}.spx-boundary{margin-top:22px;padding:16px 18px;border-left:3px solid #f1b877;background:rgba(241,184,119,.06);color:#cdd2d7;line-height:1.65;font-size:13px}@media(max-width:900px){.spx-case-flow{grid-template-columns:1fr 1fr}.spx-case-phase,.spx-field-list{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  const hero=document.querySelector('.casehero');
  if(hero){
    const kicker=hero.querySelector('.kicker');
    const h1=hero.querySelector('h1');
    const sub=hero.querySelector('.casesub');
    const bar=hero.querySelector('.casebar');
    const stats=hero.querySelector('.stats4');
    if(kicker) kicker.textContent='04 / SPX · Logistics Ops · n8n · WhatsApp · OCR';
    if(h1) h1.textContent='SPX Logistics Operations & Automated Encoding System';
    if(sub) sub.textContent='A first-mile logistics operations system that normalizes SPX activity, automates late-driver follow-up and escalation, generates hourly owner visibility, and isolates screenshot OCR as the next intake layer where direct SPX API access is unavailable.';
    if(bar) bar.innerHTML='<span>Production operations automation · OCR intake phase reconstructed</span><span>Enterprise Automation Architect · n8n Workflow Engineer</span><span>Self-hosted n8n</span><span>Google Sheets</span><span>Microsoft Excel</span><span>WhatsApp</span><span>SPX Mobile App</span><span>Data Normalization</span><span>OCR / AI Extraction — Phase 2</span>';
    if(stats) stats.innerHTML='<div class="statbox"><strong>5 min</strong><span>driver compliance monitoring cadence</span></div><div class="statbox"><strong>3 attempts</strong><span>automated follow-ups before admin escalation</span></div><div class="statbox"><strong>Hourly</strong><span>owner operations reporting</span></div><div class="statbox"><strong>1 source</strong><span>normalized operational source of truth</span></div>';
    const primary=hero.querySelector('.actions .btn.primary');
    if(primary) primary.textContent='Launch SPX Operations Demo ↗';
  }

  const note=document.querySelector('.implementation-note');
  if(note){
    const label=note.querySelector('span'),copy=note.querySelector('p');
    if(label) label.textContent='Production operations automation + OCR intake extension';
    if(copy) copy.textContent='The implemented system uses a normalized operations sheet as the single source of truth, with self-hosted n8n handling five-minute driver monitoring, bounded WhatsApp follow-ups, admin escalation, and hourly owner reporting. Direct SPX API access was unavailable, so the SPX-to-sheet encoding boundary remained manual. The OCR encoder is presented as the next intake layer feeding the same operational model, not as a separate production system.';
  }

  const contentHeadings=[...document.querySelectorAll('.case-content h3')];
  const problemHeading=contentHeadings.find(x=>x.textContent.trim()==='What needed to change');
  if(problemHeading && problemHeading.nextElementSibling) problemHeading.nextElementSibling.textContent='Admins continuously monitored the SPX mobile app, manually encoded operational updates into Excel, checked planned versus actual driver start times, called delayed drivers, monitored pickup progress and missed pickups, and sent hourly WhatsApp status updates to the owner. Late starts could lead to store closures, missed pickups, financial penalties, and delayed warehouse handovers, while repetitive monitoring consumed most of the admin team’s attention.';
  const solutionHeading=contentHeadings.find(x=>x.textContent.trim()==='What I designed');
  if(solutionHeading && solutionHeading.nextElementSibling) solutionHeading.nextElementSibling.textContent='I designed the system around a single normalized operational source of truth. Raw operational sheets were converted into an automation-safe driver-operation table, then self-hosted n8n ran a five-minute compliance monitor that compared planned and actual start times, sent WhatsApp follow-ups, limited retries to three attempts, and escalated unresolved drivers to admins. A separate hourly workflow aggregated active, delayed, completed, and escalated operations into a structured owner report. The unavailable SPX API was treated as a clear system boundary, with screenshot OCR designed as a future intake adapter into the same normalized sheet.';

  const builtHeading=[...document.querySelectorAll('.case-content h2')].find(x=>x.textContent.trim()==='What I built');
  if(builtHeading){
    const ul=builtHeading.nextElementSibling;
    if(ul) ul.innerHTML=[
      'A normalized operations layer using one row per driver operation with Date, Driver Name, Phone, Route / Area, Planned Start Time, Actual Start Time, Actual End Time, Status, Followup Count, and Remarks.',
      'A five-minute n8n driver-compliance workflow that flags a late start when planned time has passed and actual start time is still empty.',
      'Automated WhatsApp driver follow-ups with a maximum of three attempts before the record moves to an unresponsive / escalated state.',
      'Admin escalation logic that reserves human intervention for unresolved operational exceptions rather than routine supervision.',
      'An hourly owner-report workflow aggregating active drivers, delays, routes, escalation state, and operational progress.',
      'Centralized status management so monitoring, escalation, and reporting use the same normalized operational record.',
      'Follow-up counters, status transitions, timestamps, remarks, and workflow execution evidence for operational auditability.',
      'A Phase 2 SPX screenshot encoder design that classifies Task Info versus To-handover screens and extracts task IDs, seller/store, addresses, operating hours, service tags, pending/picked-up/on-hold counts, weight, volume, store pickup totals, total orders, and handed-over counts.',
      'Confidence and required-field validation with a human-review path so uncertain screenshot extraction cannot silently enter the operational source of truth.'
    ].map(x=>`<li>${x}</li>`).join('');
  }

  const relationship=document.getElementById('relationships');
  if(relationship){
    const wrap=relationship.querySelector('.wrap');
    if(wrap) wrap.innerHTML=`
      <div class="relationship-head"><div><div class="kicker">Operational data architecture</div><h2>One operational truth, with automation downstream.</h2></div><p>The core design avoids parallel trackers. SPX activity is normalized once, then the same record drives monitoring, escalation, and management reporting.</p></div>
      <div class="spx-case-flow">
        <article class="spx-case-node"><span>01 · Source</span><h3>SPX Mobile App</h3><p>Pickup assignments, task state, seller/store details, pending / picked-up / on-hold counts, and handover status.</p></article>
        <article class="spx-case-node"><span>02 · Current boundary</span><h3>Admin Encoding</h3><p>Admins manually read SPX screens because direct API access is unavailable.</p></article>
        <article class="spx-case-node"><span>03 · Data contract</span><h3>Normalized Operations Sheet</h3><p>One row per driver operation with planned/actual times, route, status, follow-up count, and remarks.</p></article>
        <article class="spx-case-node"><span>04 · Orchestration</span><h3>Self-hosted n8n</h3><p>Five-minute driver compliance monitor, retries, escalation, status synchronization, and hourly aggregation.</p></article>
        <article class="spx-case-node"><span>05 · Operating surface</span><h3>WhatsApp</h3><p>Driver reminders, admin escalation, and structured owner operations reports.</p></article>
      </div>
      <div class="spx-boundary"><strong>Phase 2 intake:</strong> SPX screenshot → screen classification → OCR / field parsing → confidence + required-field validation → human review when uncertain → the same normalized operations sheet.</div>`;
  }

  const architecture=document.getElementById('architecture');
  if(architecture){
    const label=architecture.querySelector('.architecture-label');
    const arch=architecture.querySelector('.arch');
    const casegrid=architecture.querySelector('.casegrid');
    if(label) label.textContent='Operational automation with an isolated manual SPX boundary';
    if(arch){
      const steps=['SPX Mobile App','Manual Admin Encoding — current boundary','Raw Excel / Operations Input','Normalization Layer','Automation-Ready Operations Sheet','Self-hosted n8n','5-Minute Driver Compliance Monitor','WhatsApp Follow-up + Escalation','Hourly Owner Operations Report','Phase 2: SPX Screenshot → OCR → Validation → Same Operations Sheet'];
      arch.innerHTML=steps.map((x,i)=>`<span class="archstep" data-index="${String(i+1).padStart(2,'0')}">${x}</span>`).join('');
    }
    if(casegrid){
      const cols=casegrid.children;
      if(cols[0]) cols[0].innerHTML='<h3>Reliability & controls</h3><ul><li>Single source of operational truth</li><li>One row per driver operation</li><li>Five-minute scheduled monitoring</li><li>Maximum three automated follow-ups</li><li>Human intervention only after escalation</li><li>Centralized status synchronization</li><li>Audit trail for follow-ups and status changes</li><li>OCR validation + review queue</li><li>Manual fallback when extraction is uncertain</li></ul>';
      if(cols[1]) cols[1].innerHTML='<h3>Outcome / current state</h3><p>The implemented automation moved routine driver supervision and hourly management reporting out of manual admin work while preserving a clear human escalation path for real exceptions. Direct SPX API access was unavailable, so manual reading and encoding of SPX remained the final input dependency. The OCR encoder is reconstructed as the next phase: an ingestion adapter that feeds the same normalized source of truth instead of creating a second tracker.</p>';
    }
  }

  if(architecture && !document.getElementById('spx-process-evolution')){
    const section=document.createElement('section');
    section.className='case-section';
    section.id='spx-process-evolution';
    section.innerHTML=`<div class="wrap case-section-inner"><aside class="case-aside"><div class="sticky"><div class="kicker">Process evolution</div><p>Manual work →<br>operational automation →<br>OCR intake</p></div></aside><div class="case-content"><h2>What changed, and what remains to automate.</h2><div class="spx-case-phase"><article><span>Before</span><h3>Manual supervision</h3><p>Admins watched SPX, encoded updates into Excel, checked driver start times, called delayed drivers, monitored pickups, and manually sent hourly WhatsApp updates to the owner.</p></article><article><span>Implemented</span><h3>Operations automation</h3><p>The normalized sheet became the operational contract. n8n detects lateness every five minutes, sends up to three follow-ups, escalates unresolved drivers, and produces hourly owner reports.</p></article><article><span>Next intake layer</span><h3>SPX screenshot encoder</h3><p>OCR targets the remaining manual SPX-to-sheet step. It classifies the screen, extracts operational fields, validates confidence, and writes only approved values into the existing normalized source of truth.</p></article></div><h3 style="margin-top:34px">Fields visible in the manual SPX screens</h3><div class="spx-field-list"><span>Task / reference ID</span><span>Seller / store</span><span>Pickup address</span><span>Telephone</span><span>Operating hours</span><span>Service tags</span><span>Pending count</span><span>Picked-up count</span><span>On-hold count</span><span>Weight / volume</span><span>Store pickup totals</span><span>Total orders / handed over</span></div></div></div>`;
    architecture.parentNode.insertBefore(section,architecture);
  }

  const demo=document.getElementById('demo');
  if(demo){
    const h2=demo.querySelector('h2');
    const p=demo.querySelector('.demo-cta p');
    const primary=demo.querySelector('.btn.primary');
    if(h2) h2.textContent='Open the operations control system.';
    if(p) p.textContent='The reconstruction demonstrates driver monitoring, bounded follow-up, escalation, hourly owner reporting, SPX screenshot field extraction, validation, and processing logs using synthetic operational records.';
    if(primary) primary.textContent='Launch SPX Operations Demo ↗';
  }

  document.title='SPX Logistics Operations & Automated Encoding System — DCode';
  document.querySelectorAll('iframe.case-live-preview').forEach(frame=>{
    frame.title='Live reconstructed SPX logistics operations and automated encoding preview';
    frame.src='demo.html?id=ocr&embed=1&v=20260903-spx-ops1';
  });
  document.querySelectorAll('a[href="demo.html?id=ocr"]').forEach(link=>link.href='demo.html?id=ocr&v=20260903-spx-ops1');
})();
