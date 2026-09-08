(() => {
  const params=new URLSearchParams(location.search);
  if(!/demo\.html$/.test(location.pathname)||params.get('id')!=='recruitment')return;
  const root=document.getElementById('demoRoot');
  if(!root)return;

  const agents=[
    {key:'rediscovery',name:'Candidate Rediscovery Agent',desc:'Finds strong previous applicants for a newly active Job Opening.',deployment:'Digital Employee',context:'Job Openings + Applicants',trigger:'Conditional Job Opening trigger',initials:'CR'},
    {key:'posting',name:'Job Posting Content Agent',desc:'Creates approved channel-specific content for Indeed, Facebook, and Instagram.',deployment:'Connection',context:'Job Openings',trigger:'Manual custom button',initials:'JP'},
    {key:'operations',name:'Recruitment Operations Agent',desc:'Completeness, recruiter copilot, pipeline risk, interview prep, and approved follow-up.',deployment:'Digital Employee',context:'Applicants + activities',trigger:'Applicant condition + button',initials:'RO'},
    {key:'manager',name:'Recruitment Manager Assistant Agent',desc:'Proactive manager insights for workload, aging, source performance, and bottlenecks.',deployment:'Digital Employee',context:'Recruitment reporting',trigger:'Scheduled / autonomous reporting',initials:'MA'}
  ];

  const style=document.createElement('style');
  style.id='p01-crm-agent-cards-style';
  style.textContent=`
    .p01-crm-agent-head{display:flex;align-items:flex-start;gap:16px}.p01-crm-agent-head>div:first-child{flex:1}.p01-crm-agent-head h1{margin:0 0 5px!important}.p01-crm-agent-head p{margin:0!important;color:#687181!important;max-width:760px}.p01-crm-agent-actions{display:flex;gap:8px}.p01-crm-agent-actions button{height:32px;border:1px solid #cfd5df;background:#fff;border-radius:4px;padding:0 11px;color:#3e4654;font-size:10px;cursor:pointer}.p01-crm-agent-actions .primary{background:#356eea;border-color:#356eea;color:#fff}.p01-crm-tabs{display:flex;gap:20px;border-bottom:1px solid #e1e5ec;margin:22px 0 15px}.p01-crm-tabs button{border:0;background:none;padding:0 2px 10px;color:#667080;font-size:11px}.p01-crm-tabs button.active{border-bottom:2px solid #356eea;color:#25303e;font-weight:600}.p01-crm-search{display:flex;justify-content:flex-end;margin-bottom:14px}.p01-crm-search label{display:flex;align-items:center;gap:6px;width:220px;height:31px;border:1px solid #d9dee7;border-radius:4px;background:#fff;padding:0 9px;color:#7c8491;font-size:10px}.p01-crm-search input{border:0;outline:0;width:100%;font-size:10px}.p01-crm-agent-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.p01-crm-agent-card{border:1px solid #e0e4eb;border-radius:7px;background:#fff;padding:16px 14px;min-height:205px;text-align:center;cursor:pointer}.p01-crm-agent-card:hover{box-shadow:0 6px 18px rgba(44,62,90,.08)}.p01-crm-agent-avatar{width:74px;height:74px;margin:2px auto 12px;border-radius:50%;background:linear-gradient(145deg,#fff6e6,#eff2ff);border:1px solid #eee4d5;display:grid;place-items:center;position:relative}.p01-crm-agent-avatar:before{content:'';position:absolute;width:40px;height:34px;border-radius:12px;background:#2e333b}.p01-crm-agent-avatar:after{content:'••';position:absolute;color:#fff;font-size:16px;letter-spacing:6px;margin-left:6px;margin-top:-2px}.p01-crm-agent-card h3{font-size:11px;margin:0 0 7px;color:#303641}.p01-crm-agent-card p{font-size:8.5px;line-height:1.45;color:#727a88;margin:0 0 10px;min-height:38px}.p01-crm-agent-meta{display:flex;justify-content:center;gap:7px;font-size:7.5px;color:#747b88}.p01-crm-agent-meta .active{color:#128962;font-weight:700}.p01-crm-agent-meta .active:before{content:'';display:inline-block;width:6px;height:6px;background:#18ad7a;border-radius:50%;margin-right:4px}.p01-crm-agent-note{margin-top:15px;padding:10px 12px;border:1px solid #e1e5ec;background:#fafbfc;color:#657080;font-size:9px;line-height:1.5}.p01-crm-agent-note strong{color:#303844}.p01-crm-manage-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:14px;margin-top:18px}.p01-crm-manage-grid section{border:1px solid #e0e4eb;background:#fff;border-radius:6px;padding:15px}.p01-crm-manage-grid h3{margin:0 0 12px;font-size:12px}.p01-crm-facts{display:grid;grid-template-columns:150px 1fr;margin:0}.p01-crm-facts dt,.p01-crm-facts dd{margin:0;padding:9px 8px;border-top:1px solid #edf0f4;font-size:9px}.p01-crm-facts dt{color:#7b8390}.p01-crm-facts dd{color:#343b46}.p01-crm-back{border:1px solid #cfd5df;background:#fff;border-radius:4px;height:30px;padding:0 9px;font-size:9px;color:#4c5562;cursor:pointer;margin-bottom:12px}@media(max-width:1100px){.p01-crm-agent-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:760px){.p01-crm-agent-grid,.p01-crm-manage-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  function sidebar(){
    return `<a>Setup Home</a><label>⌕ <input placeholder="Search"></label><h3>General</h3><button>Personal Settings</button><button>Company Settings</button><button>Calendar Booking</button><button>Users</button><button>Security Control</button><button class="active">Agents ✦</button><h3>Customization</h3><button>Modules and Fields</button><button>Wizards</button><button>Canvas ✦</button><h3>Automation</h3><button>Workflow Rules</button><button>Actions</button><button>Schedules</button><button>Assignment</button><button>Scoring Rules</button><button>Cadences</button>`;
  }

  function restore(){
    if(typeof window.recruitmentV5==='function')window.recruitmentV5();
  }

  function openCrmAgents(){
    restore();
    setTimeout(()=>root.querySelector('[data-z5-top="Agents"]')?.click(),40);
  }

  function toast(message){
    const el=document.getElementById('toast');
    if(!el)return;
    el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200);
  }

  function render(){
    root.innerHTML=`<div class="z5-setup-shell"><header class="z5-setup-top"><b>Setup</b><button>Admin Panel</button><button class="active">CRM</button><span></span><button id="p01CrmAgentClose">×</button></header><div class="z5-setup-body"><aside class="z5-setup-side">${sidebar()}</aside><main class="z5-setup-main"><div class="z5-setup-content"><div class="p01-crm-agent-head"><div><h1>Agents</h1><p>Configure, manage, and optimize Zia Agents deployed into this Zoho CRM organization.</p></div><div class="p01-crm-agent-actions"><button id="p01ViewAgentPortal">View Agents</button><button class="primary" id="p01NewAgent">New Agent</button></div></div><div class="p01-crm-tabs"><button class="active">Configured (4)</button><button>Draft (0)</button></div><div class="p01-crm-search"><label>⌕ <input placeholder="Search agents"></label></div><div class="p01-crm-agent-grid">${agents.map(a=>`<article class="p01-crm-agent-card" data-p01-crm-agent="${a.key}"><div class="p01-crm-agent-avatar"></div><h3>${a.name}</h3><p>${a.desc}</p><div class="p01-crm-agent-meta"><span>${a.deployment}</span><span class="active">Active</span></div></article>`).join('')}</div><div class="p01-crm-agent-note"><strong>Configured custom agents:</strong> these are custom builds created in Zia Agent Studio and deployed into CRM. They are not Agent Store marketplace agents.</div></div></main></div></div>`;
    document.getElementById('p01CrmAgentClose').onclick=restore;
    root.querySelector('.z5-setup-top button:nth-of-type(2)').onclick=restore;
    document.getElementById('p01ViewAgentPortal').onclick=openCrmAgents;
    document.getElementById('p01NewAgent').onclick=()=>toast('New Agent opens Zia Agent Studio in production.');
    root.querySelectorAll('[data-p01-crm-agent]').forEach(card=>card.onclick=()=>manage(card.dataset.p01CrmAgent));
  }

  function manage(key){
    const a=agents.find(x=>x.key===key)||agents[0];
    root.innerHTML=`<div class="z5-setup-shell"><header class="z5-setup-top"><b>Setup</b><button>Admin Panel</button><button class="active">CRM</button><span></span><button id="p01CrmAgentClose">×</button></header><div class="z5-setup-body"><aside class="z5-setup-side">${sidebar()}</aside><main class="z5-setup-main"><div class="z5-setup-content"><button class="p01-crm-back" id="p01BackCrmAgents">← Agents</button><div class="p01-crm-agent-head"><div><h1>${a.name}</h1><p>${a.desc}</p></div><div class="p01-crm-agent-actions"><button>Deactivate</button><button class="primary">Active</button></div></div><div class="p01-crm-tabs"><button class="active">Setup</button><button>Activity</button><button>Access</button></div><div class="p01-crm-manage-grid"><section><h3>Agent activation condition</h3><dl class="p01-crm-facts"><dt>CRM context</dt><dd>${a.context}</dd><dt>Conditional trigger</dt><dd>${a.trigger}</dd><dt>Feed further information</dt><dd>Enabled · current record and related recruitment context</dd><dt>Manual trigger via button</dt><dd>Enabled where applicable</dd><dt>Tools parameter mapping</dt><dd>Mapped to CRM fields and approved external connections</dd></dl></section><section><h3>Deployment and access</h3><dl class="p01-crm-facts"><dt>Deployment</dt><dd>${a.deployment}</dd><dt>Status</dt><dd>Active</dd><dt>Audit identity</dt><dd>${a.deployment==='Digital Employee'?'Separate digital-employee identity':'Configured CRM connection identity'}</dd><dt>Source</dt><dd>Custom build · Zia Agent Studio</dd></dl></section></div></div></main></div></div>`;
    document.getElementById('p01CrmAgentClose').onclick=restore;
    root.querySelector('.z5-setup-top button:nth-of-type(2)').onclick=restore;
    document.getElementById('p01BackCrmAgents').onclick=render;
  }

  document.addEventListener('click',event=>{
    const settings=event.target.closest?.('.z5-toptools [title="Settings"]');
    if(!settings)return;
    event.preventDefault();event.stopImmediatePropagation();render();
  },true);
})();