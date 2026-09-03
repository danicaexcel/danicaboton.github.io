(function(){
  const card=document.querySelector('.project[data-id="ocr"]');
  if(!card) return;
  const top=card.querySelector('.projecttop');
  if(top){
    const num=top.querySelector('.num');
    const status=top.querySelector('.status');
    if(num) num.textContent='04 / SPX · LOGISTICS OPS · N8N · WHATSAPP · OCR';
    if(status) status.textContent='Production operations automation · OCR intake phase reconstructed';
  }
  const title=card.querySelector('h3');
  const copy=card.querySelector('.projectcopy > p');
  if(title) title.textContent='SPX Logistics Operations & Automated Encoding System';
  if(copy) copy.textContent='A first-mile logistics operations system that normalizes SPX activity, automates late-driver follow-up and escalation, generates hourly owner visibility, and isolates screenshot OCR as the next intake layer where direct SPX API access is unavailable.';
  const chips=card.querySelector('.chips');
  if(chips) chips.innerHTML=['Self-hosted n8n','Google Sheets','Microsoft Excel','WhatsApp','SPX Mobile App'].map(x=>`<span class="chip">${x}</span>`).join('');
  const metrics=card.querySelector('.metricline');
  if(metrics) metrics.innerHTML='<div class="mini"><strong>5 min</strong><span>driver compliance monitoring cadence</span></div><div class="mini"><strong>3 attempts</strong><span>automated follow-ups before admin escalation</span></div>';
  const screenTitle=card.querySelector('.screen-title');
  if(screenTitle) screenTitle.textContent='SPX Logistics Operations & Automated Encoding System';
  const frame=card.querySelector('iframe.live-demo-preview');
  if(frame){
    frame.title='Interactive reconstructed SPX logistics operations and automated encoding preview';
    frame.src='demo.html?id=ocr&embed=1&v=20260903-spx-ops1';
  }
})();
