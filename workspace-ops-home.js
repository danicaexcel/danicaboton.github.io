(function(){
  const root=document.getElementById('projectCards');
  if(!root||!Array.isArray(window.DCODE_PROJECTS)) return;
  const hidden=new Set(['sheets','ops-dashboard']);
  root.querySelectorAll('.project').forEach(card=>{if(hidden.has(card.dataset.id))card.remove();});

  const recruitmentProject=window.DCODE_PROJECTS.find(p=>p.id==='recruitment');
  if(recruitmentProject){
    recruitmentProject.category='Zoho CRM · Deluge · n8n · Custom Agent Extension';
    recruitmentProject.subtitle='One recruitment architecture with two connected operating surfaces: the Zoho CRM recruitment system and a separate custom AI agent platform connected through APIs/webhooks. Resume extraction + candidate scoring remain part of the CRM workflow; the agent extension adds governed recruiting specialists without embedding them inside Zoho.';
    recruitmentProject.status='Two connected demos · Zoho CRM + custom agent platform';
    recruitmentProject.stack=['Zoho CRM','Deluge','n8n','Custom AI Agents','REST APIs','Twilio / Meta'];
  }

  const mondayProject=window.DCODE_PROJECTS.find(p=>p.id==='monday-project-ops');
  if(mondayProject){
    mondayProject.category='Monday.com · AI Agents · Project Operations · n8n';
    mondayProject.subtitle='A Monday.com project operations system with native AI Project Manager and Planner agents for proactive daily/weekly reporting, task follow-up, recovery planning, Sprint/Agile planning, client proposal costing, approval-controlled plan changes, and n8n orchestration when work needs to leave Monday.';
    mondayProject.status='Interactive reconstruction · native Monday AI agent operating model';
    mondayProject.stack=['Monday.com','Monday AI Agents','n8n','Monday API','Dashboards','Gantt / Timeline'];
    mondayProject.metrics=[['2','native AI agents'],['Daily + weekly','proactive agent reports'],['Proposal → approval','costed plan + sprint baseline'],['8','connected data boards']];
  }

  const projects=['workspace-ops','monday-project-ops'].map(id=>window.DCODE_PROJECTS.find(p=>p.id===id)).filter(Boolean);
  function add(p){
    if(root.querySelector(`.project[data-id="${p.id}"]`)) return;
    const el=document.createElement('article');el.className='project';el.dataset.id=p.id;
    const screenId=`preview-${p.id}`,hasDemo=p.demoAvailable!==false,hasN8n=p.stack.some(item=>/\bn8n\b/i.test(item));
    const caseHref=p.id==='workspace-ops'?'workspace-ops-case-study.html':p.id==='monday-project-ops'?'monday-project-ops-case-study.html':`case-study.html?id=${p.id}`;
    const previewHref=p.id==='monday-project-ops'?'monday-project-ops-demo-native-v8.html?embed=1&v=20260907-agent-reports-board2':`demo.html?id=${p.id}&embed=1`;
    const workflowAction=hasN8n?'<button class="btn" type="button" data-workflow-contact>View n8n workflow</button>':'';
    const actions=hasDemo?`<a class="btn" href="${caseHref}">Read case study</a><button class="btn primary fullscreen-btn" type="button" data-target="${screenId}">Open demo ↗</button>${workflowAction}`:`<a class="btn primary" href="${caseHref}">View ongoing case study</a><span class="demo-pending">Public demo in development</span>`;
    const visual=hasDemo?`<div class="laptop-wrap"><div class="laptop-screen" id="${screenId}"><div class="laptop-bezel"><span class="camera-dot"></span><span class="screen-title">${p.title}</span><div class="screen-controls"><button type="button" class="screen-btn fullscreen-btn" data-target="${screenId}" aria-label="View ${p.title} demo fullscreen">⛶</button></div></div><div class="laptop-display"><iframe class="live-demo-preview" src="${previewHref}" title="Interactive reconstructed ${p.title} preview" loading="lazy" allowfullscreen></iframe></div></div><div class="laptop-base"><span></span></div><div class="demo-caption"><span>Interactive reconstruction</span><i></i><span>Synthetic data</span><i></i><span>Fullscreen available</span></div></div>`:'';
    el.innerHTML=`<div class="projectcopy"><div class="projecttop"><span class="num">${p.order} / ${p.category}</span><span class="status">${p.status}</span></div><h3>${p.title}</h3><p>${p.subtitle}</p><div class="chips">${p.stack.slice(0,5).map(x=>`<span class="chip">${x}</span>`).join('')}</div><div class="metricline">${p.metrics.slice(0,2).map(m=>`<div class="mini"><strong>${m[0]}</strong><span>${m[1]}</span></div>`).join('')}</div><div class="projectactions">${actions}</div></div><div class="projectvisual">${visual}</div>`;
    root.appendChild(el);
    const frame=el.querySelector('.live-demo-preview');
    if(frame&&typeof window.fitPreview==='function') window.fitPreview(frame);
  }
  projects.forEach(add);

  function enhanceRecruitmentCard(){
    const p=window.DCODE_PROJECTS.find(project=>project.id==='recruitment');
    const card=root.querySelector('.project[data-id="recruitment"]');
    if(!p||!card)return;
    const label=card.querySelector('.projecttop .num');if(label)label.textContent=`${p.order} / ${p.category}`;
    const status=card.querySelector('.projecttop .status');if(status)status.textContent=p.status;
    const subtitle=card.querySelector('.projectcopy > p');if(subtitle)subtitle.textContent=p.subtitle;
    const chips=card.querySelector('.chips');if(chips)chips.innerHTML=p.stack.slice(0,5).map(x=>`<span class="chip">${x}</span>`).join('');
    const frame=card.querySelector('.live-demo-preview');if(frame)frame.src='demo.html?id=recruitment&embed=1&v=20260908-agent-extension1';
    const actions=card.querySelector('.projectactions');
    if(actions&&!actions.querySelector('[data-p01-agent-demo]')){
      const crmButton=actions.querySelector('.fullscreen-btn');if(crmButton)crmButton.textContent='Open CRM demo ↗';
      const link=document.createElement('a');link.className='btn';link.dataset.p01AgentDemo='1';link.href='recruitment-agent-platform.html?v=20260908-agent-extension1';link.textContent='Open AI Agents demo ↗';
      if(crmButton)crmButton.insertAdjacentElement('afterend',link);else actions.appendChild(link);
    }
    if(subtitle&&!card.querySelector('.p01-dual-demo-note'))subtitle.insertAdjacentHTML('afterend','<div class="p01-dual-demo-note"><strong>Two connected demos</strong>CRM Demo = recruiter operating system. AI Agents Demo = separate custom agent control center using Zoho CRM as the system of record.</div>');
  }
  enhanceRecruitmentCard();

  if(!document.getElementById('project-home-extension-style')){
    const style=document.createElement('style');
    style.id='project-home-extension-style';
    style.textContent=`
      .project[data-id="monday-project-ops"] .p02-home-agent-note,.project[data-id="recruitment"] .p01-dual-demo-note{margin:14px 0 0;padding:11px 12px;border-left:3px solid #f5b36d;background:rgba(245,179,109,.055);color:#cbd2d9;font-size:10px;line-height:1.55}
      .project[data-id="monday-project-ops"] .p02-home-agent-note strong,.project[data-id="recruitment"] .p01-dual-demo-note strong{display:block;margin-bottom:4px;color:#f5b36d;font:700 8px/1.3 "IBM Plex Mono",monospace;letter-spacing:.08em;text-transform:uppercase}
    `;
    document.head.appendChild(style);
  }

  function enhanceMondayCard(){
    const p=window.DCODE_PROJECTS.find(project=>project.id==='monday-project-ops');
    const card=root.querySelector('.project[data-id="monday-project-ops"]');
    if(!p||!card)return;
    const label=card.querySelector('.projecttop .num');
    if(label)label.textContent=`${p.order} / ${p.category}`;
    const status=card.querySelector('.projecttop .status');
    if(status)status.textContent=p.status;
    const subtitle=card.querySelector('.projectcopy > p');
    if(subtitle)subtitle.textContent=p.subtitle;
    const chips=card.querySelector('.chips');
    if(chips)chips.innerHTML=p.stack.slice(0,5).map(x=>`<span class="chip">${x}</span>`).join('');
    const metrics=card.querySelector('.metricline');
    if(metrics)metrics.innerHTML=p.metrics.slice(0,2).map(m=>`<div class="mini"><strong>${m[0]}</strong><span>${m[1]}</span></div>`).join('');
    if(subtitle&&!card.querySelector('.p02-home-agent-note'))subtitle.insertAdjacentHTML('afterend','<div class="p02-home-agent-note"><strong>AI Agent layer</strong>Project Manager Agent proactively publishes daily attention and weekly project-health reports, then handles risk/follow-up. Planner Agent handles Sprint/Agile planning and client proposal costing. Proposal and plan changes stay approval-controlled before becoming the Monday baseline.</div>');
    const frame=card.querySelector('.live-demo-preview');
    if(frame)frame.src='monday-project-ops-demo-native-v8.html?embed=1&v=20260907-agent-reports-board2';
  }
  enhanceMondayCard();

  window.DCODE_PROJECTS.forEach(project=>{
    const card=root.querySelector(`.project[data-id="${project.id}"]`);
    const label=card?.querySelector('.projecttop .num');
    if(label) label.textContent=`${project.order} / ${project.category}`;
  });

  [...root.querySelectorAll('.project')].filter(card=>!hidden.has(card.dataset.id)).sort((a,b)=>{
    const pa=window.DCODE_PROJECTS.find(project=>project.id===a.dataset.id);
    const pb=window.DCODE_PROJECTS.find(project=>project.id===b.dataset.id);
    return Number(pa?.order||99)-Number(pb?.order||99);
  }).forEach(card=>root.appendChild(card));
})();