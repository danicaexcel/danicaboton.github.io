(function(){
  const root=document.getElementById('projectCards');
  if(!root||!Array.isArray(window.DCODE_PROJECTS)) return;
  const hidden=new Set(['sheets','ops-dashboard']);
  root.querySelectorAll('.project').forEach(card=>{if(hidden.has(card.dataset.id))card.remove();});
  const projects=['workspace-ops','monday-project-ops'].map(id=>window.DCODE_PROJECTS.find(p=>p.id===id)).filter(Boolean);
  function add(p){
    if(root.querySelector(`.project[data-id="${p.id}"]`)) return;
    const el=document.createElement('article');el.className='project';el.dataset.id=p.id;
    const screenId=`preview-${p.id}`,hasDemo=p.demoAvailable!==false,hasN8n=p.stack.some(item=>/\bn8n\b/i.test(item));
    const caseHref=p.id==='workspace-ops'?'workspace-ops-case-study.html':p.id==='monday-project-ops'?'monday-project-ops-case-study.html':`case-study.html?id=${p.id}`;
    const previewHref=p.id==='monday-project-ops'?'monday-project-ops-demo-native-v3.html?embed=1&v=20260903-summary3':`demo.html?id=${p.id}&embed=1`;
    const workflowAction=hasN8n?'<button class="btn" type="button" data-workflow-contact>View n8n workflow</button>':'';
    const actions=hasDemo?`<a class="btn" href="${caseHref}">Read case study</a><button class="btn primary fullscreen-btn" type="button" data-target="${screenId}">Open demo ↗</button>${workflowAction}`:`<a class="btn primary" href="${caseHref}">View ongoing case study</a><span class="demo-pending">Public demo in development</span>`;
    const visual=hasDemo?`<div class="laptop-wrap"><div class="laptop-screen" id="${screenId}"><div class="laptop-bezel"><span class="camera-dot"></span><span class="screen-title">${p.title}</span><div class="screen-controls"><button type="button" class="screen-btn fullscreen-btn" data-target="${screenId}" aria-label="View ${p.title} demo fullscreen">⛶</button></div></div><div class="laptop-display"><iframe class="live-demo-preview" src="${previewHref}" title="Interactive reconstructed ${p.title} preview" loading="lazy" allowfullscreen></iframe></div></div><div class="laptop-base"><span></span></div><div class="demo-caption"><span>Interactive reconstruction</span><i></i><span>Synthetic data</span><i></i><span>Fullscreen available</span></div></div>`:'';
    el.innerHTML=`<div class="projectcopy"><div class="projecttop"><span class="num">${p.order} / ${p.category}</span><span class="status">${p.status}</span></div><h3>${p.title}</h3><p>${p.subtitle}</p><div class="chips">${p.stack.slice(0,5).map(x=>`<span class="chip">${x}</span>`).join('')}</div><div class="metricline">${p.metrics.slice(0,2).map(m=>`<div class="mini"><strong>${m[0]}</strong><span>${m[1]}</span></div>`).join('')}</div><div class="projectactions">${actions}</div></div><div class="projectvisual">${visual}</div>`;
    root.appendChild(el);
    const frame=el.querySelector('.live-demo-preview');
    if(frame&&typeof window.fitPreview==='function') window.fitPreview(frame);
  }
  projects.forEach(add);

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
