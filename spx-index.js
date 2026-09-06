(function(){
  const card=document.querySelector('.project[data-id="ocr"]');
  if(!card) return;
  const top=card.querySelector('.projecttop');
  if(top){
    const num=top.querySelector('.num');
    const status=top.querySelector('.status');
    if(num) num.textContent='05 / SPX · LOGISTICS OPS · N8N · WHATSAPP · OCR';
    if(status) status.textContent='Production operations automation · reconstructed unified workspace';
  }
  const title=card.querySelector('h3');
  const copy=card.querySelector('.projectcopy > p');
  if(title) title.textContent='SPX Logistics Operations & Automated Encoding System';
  if(copy) copy.textContent='A first-mile operations workspace preserving the client’s familiar daily logs and summaries while adding route progress, warehouse-trip handover + compensation, attendance, closing-time risk, owner visibility, WhatsApp escalation, and screenshot OCR intake.';
  const chips=card.querySelector('.chips');
  if(chips) chips.innerHTML=['Self-hosted n8n','Google Sheets','Microsoft Excel','WhatsApp','SPX Mobile App'].map(x=>`<span class="chip">${x}</span>`).join('');
  const metrics=card.querySelector('.metricline');
  if(metrics) metrics.innerHTML='<div class="mini"><strong>5 min</strong><span>driver compliance monitoring cadence</span></div><div class="mini"><strong>$0.03</strong><span>verified handed-over parcel pay basis</span></div>';
  const caseLink=card.querySelector('a[href*="case-study.html"],a[href*="spx-case-study"]');
  if(caseLink) caseLink.href='spx-case-study.html?v=20260906-spx-queue5';
  const screenTitle=card.querySelector('.screen-title');
  if(screenTitle) screenTitle.textContent='SPX Logistics Operations & Automated Encoding System';
  const frame=card.querySelector('iframe.live-demo-preview');
  if(frame){
    frame.title='Interactive reconstructed SPX logistics operations workspace';
    frame.src='demo.html?id=ocr&embed=1&v=20260906-spx-queue5';
  }
  card.querySelectorAll('a[href*="demo.html?id=ocr"]').forEach(link=>{link.href='demo.html?id=ocr&v=20260906-spx-queue5';});
})();