(function(){
  const id=new URLSearchParams(location.search).get('id');
  if(id!=='ocr') return;
  const style=document.createElement('style');
  style.textContent=`
    .spx-case-flow{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-top:28px}.spx-case-node{border:1px solid var(--line,#3b4148);background:rgba(255,255,255,.025);padding:18px;min-height:135px}.spx-case-node span{display:block;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#f1b877;margin-bottom:10px}.spx-case-node h3{margin:0 0 8px;font-size:16px}.spx-case-node p{margin:0;font-size:12px;line-height:1.55;color:#aab1b8}.spx-case-phase{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.spx-case-phase article{border:1px solid var(--line,#3b4148);padding:22px;background:rgba(255,255,255,.02)}.spx-case-phase span{font-size:10px;color:#f1b877;text-transform:uppercase;letter-spacing:.08em}.spx-case-phase h3{margin:8px 0 10px}.spx-case-phase p{margin:0;color:#aab1b8;line-height:1.65}.spx-field-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:20px}.spx-field-list span{border:1px solid var(--line,#3b4148);padding:10px 12px;font-size:11px;color:#c7cdd3}.spx-boundary{margin-top:22px;padding:16px 18px;border-left:3px solid #f1b877;background:rgba(241,184,119,.06);color:#cdd2d7;line-height:1.65;font-size:13px}@media(max-width:900px){.spx-case-flow{grid-template-columns:1fr 1fr}.spx-case-phase,.spx-field-list{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  const note=document.querySelector('.implementation-note');
  if(note){
    const label=note.querySelector('span'),copy=note.querySelector('p');
    if(label) label.textContent='Production operations automation + OCR intake extension';
    if(copy) copy.textContent='The implemented system uses a normalized operations sheet as the single source of truth, with self-hosted n8n handling five-minute driver monitoring, bounded WhatsApp follow-ups, admin escalation, and hourly owner reporting. Direct SPX API access was unavailable, so the SPX-to-sheet encoding boundary remained manual. The OCR encoder is presented as the next intake layer feeding the same operational model, not as a separate production system.';
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
  if(architecture && !document.getElementById('spx-process-evolution')){
    const section=document.createElement('section');
    section.className='case-section';
    section.id='spx-process-evolution';
    section.innerHTML=`<div class="wrap case-section-inner"><aside class="case-aside"><div class="sticky"><div class="kicker">Process evolution</div><p>Manual work →<br>operational automation →<br>OCR intake</p></div></aside><div class="case-content"><h2>What changed, and what remains to automate.</h2><div class="spx-case-phase"><article><span>Before</span><h3>Manual supervision</h3><p>Admins watched SPX, encoded updates into Excel, checked driver start times, called delayed drivers, monitored pickups, and manually sent hourly WhatsApp updates to the owner.</p></article><article><span>Implemented</span><h3>Operations automation</h3><p>The normalized sheet became the operational contract. n8n now detects lateness every five minutes, sends up to three follow-ups, escalates unresolved drivers, and produces hourly owner reports.</p></article><article><span>Next intake layer</span><h3>SPX screenshot encoder</h3><p>OCR targets the remaining manual SPX-to-sheet step. It classifies the screen, extracts operational fields, validates confidence, and writes only approved values into the existing normalized source of truth.</p></article></div><h3 style="margin-top:34px">Fields visible in the manual SPX screens</h3><div class="spx-field-list"><span>Task / reference ID</span><span>Seller / store</span><span>Pickup address</span><span>Telephone</span><span>Operating hours</span><span>Service tags</span><span>Pending count</span><span>Picked-up count</span><span>On-hold count</span><span>Weight / volume</span><span>Store pickup totals</span><span>Total orders / handed over</span></div></div></div>`;
    architecture.parentNode.insertBefore(section,architecture);
  }

  document.querySelectorAll('iframe.case-live-preview').forEach(frame=>{
    frame.src='demo.html?id=ocr&embed=1&v=20260903-spx-ops1';
  });
  document.querySelectorAll('a[href="demo.html?id=ocr"]').forEach(link=>link.href='demo.html?id=ocr&v=20260903-spx-ops1');
})();
