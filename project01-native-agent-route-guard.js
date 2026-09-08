(() => {
  const params = new URLSearchParams(location.search);
  if (!/demo\.html$/.test(location.pathname) || params.get('id') !== 'recruitment') return;

  const root = document.getElementById('demoRoot');
  if (!root) return;

  const agents = [
    {
      key:'rediscovery',
      name:'Candidate Rediscovery Agent',
      short:'Rediscovery',
      description:'Finds strong previous applicants for newly active Job Openings and surfaces recruiter-approved matches into the AI Rediscovered pipeline.',
      role:'Talent Rediscovery Specialist',
      deployment:'Digital Employee',
      crmContext:'Job Openings + Applicants',
      trigger:'Active Job Opening meets rediscovery conditions',
      tools:['Zoho CRM Applicant search','Job Opening context','Applicant update','Notes / audit'],
      knowledge:['Recruitment eligibility rules','Approved role requirements'],
      initials:'CR',
      tone:'violet'
    },
    {
      key:'posting',
      name:'Job Posting Content Agent',
      short:'Job Content',
      description:'Creates approved channel-specific job copy from one Zoho Job Opening for Indeed, Facebook, and Instagram without changing requirements.',
      role:'Recruitment Content Specialist',
      deployment:'Connection',
      crmContext:'Job Openings',
      trigger:'Manual custom button on approved Job Opening',
      tools:['Zoho CRM Job Opening','Indeed integration','Facebook integration','Instagram integration'],
      knowledge:['Employer brand guide','Approved posting templates'],
      initials:'JP',
      tone:'blue'
    },
    {
      key:'operations',
      name:'Recruitment Operations Agent',
      short:'Recruitment Ops',
      description:'Combines application completeness, recruiter copilot, pipeline-risk detection, interview preparation, and approved applicant follow-up.',
      role:'Recruitment Operations Specialist',
      deployment:'Digital Employee',
      crmContext:'Applicants + activities',
      trigger:'Applicant conditions + manual record button',
      tools:['Zoho CRM Applicant context','Tasks / Meetings / Calls','Twilio SMS','Messenger / Teams'],
      knowledge:['Recruitment SOP','Applicant communication guide'],
      initials:'RO',
      tone:'teal'
    },
    {
      key:'manager',
      name:'Recruitment Manager Assistant Agent',
      short:'Manager Assistant',
      description:'Publishes proactive recruitment insights for workload, aging candidates, source performance, bottlenecks, and openings at risk.',
      role:'Recruitment Management Assistant',
      deployment:'Digital Employee',
      crmContext:'Recruitment reporting context',
      trigger:'Autonomous conditions + Home Agent insights',
      tools:['Recruitment reports','Applicant pipeline','Job Openings','Recruiter activity'],
      knowledge:['Recruitment KPI definitions','Escalation thresholds'],
      initials:'MA',
      tone:'orange'
    }
  ];

  const icon = (name) => {
    const icons = {
      home:'<path d="M4 10.5 10 5l6 5.5V17a1 1 0 0 1-1 1h-3.7v-4.8H8.7V18H5a1 1 0 0 1-1-1z"/>',
      studio:'<path d="M5 14.8 14.8 5l1.2 1.2-9.8 9.8-2.2.6z"/><path d="m12.4 4.4 1.2-1.2 3.2 3.2-1.2 1.2M4 7.5h4M6 5.5v4M12.5 13h4M14.5 11v4"/>',
      agents:'<rect x="4" y="6" width="12" height="10" rx="3"/><path d="M7 6V4.7M13 6V4.7M7.4 11h.1M12.5 11h.1M8 14h4"/>',
      multi:'<rect x="3" y="4" width="6" height="6" rx="1.5"/><rect x="11" y="10" width="6" height="6" rx="1.5"/><path d="M9 7h3v3"/>',
      tools:'<path d="M5 4h3v12H5zM12 4h3v12h-3z"/><path d="M8 7h4M8 13h4"/>',
      knowledge:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H10v13H6.5A2.5 2.5 0 0 0 4 18.5zM16 5.5A2.5 2.5 0 0 0 13.5 3H10v13h3.5a2.5 2.5 0 0 1 2.5 2.5z"/>',
      store:'<path d="M4 8h12l-1 9H5zM6 8V6a4 4 0 0 1 8 0v2"/>',
      observe:'<path d="M3 10s2.5-4 7-4 7 4 7 4-2.5 4-7 4-7-4-7-4Z"/><circle cx="10" cy="10" r="2"/>',
      search:'<circle cx="8.5" cy="8.5" r="4.5"/><path d="m12 12 4 4"/>',
      gear:'<circle cx="10" cy="10" r="2.6"/><path d="M10 2.8v1.4M10 15.8v1.4M2.8 10h1.4M15.8 10h1.4M4.9 4.9l1 1M14.1 14.1l1 1M15.1 4.9l-1 1M5.9 14.1l-1 1"/>',
      back:'<path d="m12.5 5-5 5 5 5"/>'
    };
    return `<svg viewBox="0 0 20 20" aria-hidden="true">${icons[name]||icons.agents}</svg>`;
  };

  function ensureStyle() {
    if (document.getElementById('p01-zia-portal-style')) return;
    const style = document.createElement('style');
    style.id = 'p01-zia-portal-style';
    style.textContent = `
      #demoRoot [data-z5-top="Agents"],#demoRoot [data-z5-module="AI Agents"],#demoRoot .p01-ai-nav{display:none!important}
      .p01-zia-launch{border:0!important;background:transparent!important;color:#fff!important;font:600 11px/1 inherit!important;padding:0 15px!important;height:38px!important;cursor:pointer!important;position:relative!important}
      .p01-zia-launch:hover{background:rgba(255,255,255,.08)!important}.p01-zia-launch.active:after{content:'';position:absolute;left:10px;right:10px;bottom:0;height:2px;background:#fff}
      .p01-zia-portal{height:100%;min-height:720px;background:#f7f7fb;color:#26272c;font-family:Inter,Arial,sans-serif;display:grid;grid-template-rows:58px minmax(0,1fr)}
      .p01-zia-portal *{box-sizing:border-box}.p01-zia-productbar{display:flex;align-items:center;padding:0 20px;border-bottom:1px solid #e8e8ef;background:#fff;gap:12px}.p01-zia-brandmark{width:28px;height:28px;border:2px solid #6c63e7;border-radius:8px;display:grid;place-items:center;color:#6c63e7;font-weight:800;font-size:13px;position:relative}.p01-zia-brandmark:after{content:'✦';position:absolute;right:-5px;top:-7px;color:#10a97d;font-size:11px}.p01-zia-brand{display:flex;flex-direction:column;line-height:1}.p01-zia-brand small{font-size:8px;color:#3d4654}.p01-zia-brand strong{font-size:16px;margin-top:2px}.p01-zia-productbar .spacer{flex:1}.p01-zia-productbar button{border:0;background:transparent;color:#4a505a;display:grid;place-items:center;cursor:pointer}.p01-zia-productbar button svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.4}.p01-zia-avatar{width:30px;height:30px;border-radius:50%;background:#d8e7ef;color:#355263;font-size:10px;font-weight:700;display:grid;place-items:center}
      .p01-zia-body{display:grid;grid-template-columns:76px minmax(0,1fr);min-height:0}.p01-zia-rail{border-right:1px solid #e7e7ef;background:#f4f3fb;padding:12px 7px;display:flex;flex-direction:column;gap:5px}.p01-zia-rail button{border:0;background:transparent;border-radius:8px;min-height:58px;padding:6px 2px;color:#363942;font-size:8px;line-height:1.15;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;cursor:pointer}.p01-zia-rail button svg{width:21px;height:21px;fill:none;stroke:#343941;stroke-width:1.35}.p01-zia-rail button.active{background:#ebe8ff;color:#5549cf}.p01-zia-rail button.active svg{stroke:#5549cf}.p01-zia-rail .push{margin-top:auto}.p01-zia-workspace{padding:24px 28px 36px;overflow:auto}.p01-zia-pagehead{display:flex;align-items:flex-start;gap:18px;margin-bottom:18px}.p01-zia-pagehead h1{margin:0;font-size:20px;letter-spacing:-.02em}.p01-zia-pagehead p{margin:5px 0 0;color:#6e7280;font-size:10px;line-height:1.5}.p01-zia-pagehead .actions{margin-left:auto;display:flex;gap:8px}.p01-zia-btn{height:32px;border:1px solid #d9d9e4;border-radius:6px;background:#fff;color:#3f424c;padding:0 11px;font-size:9px;cursor:pointer}.p01-zia-btn.primary{background:#6857e8;border-color:#6857e8;color:#fff}
      .p01-zia-controls{display:flex;align-items:center;gap:9px;padding:13px 14px;background:#fff;border:1px solid #e6e6ee;border-radius:9px;margin-bottom:18px}.p01-zia-controls select,.p01-zia-controls label{height:31px;border:1px solid #dfdfe8;border-radius:6px;background:#fff;color:#565b67;font-size:9px;padding:0 10px}.p01-zia-controls label{margin-left:auto;display:flex;align-items:center;gap:7px;min-width:190px}.p01-zia-controls label svg{width:15px;height:15px;fill:none;stroke:#7a7e89;stroke-width:1.4}.p01-zia-controls input{border:0;outline:0;font-size:9px;width:100%}.p01-zia-section-title{display:flex;align-items:center;justify-content:space-between;margin:0 0 10px}.p01-zia-section-title h2{margin:0;font-size:13px}.p01-zia-section-title span{font-size:8px;color:#858995}.p01-zia-cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.p01-zia-card{border:1px solid #ececf2;border-radius:10px;background:#fff;overflow:hidden;cursor:pointer;transition:transform .15s ease,box-shadow .15s ease;min-height:258px}.p01-zia-card:hover{transform:translateY(-2px);box-shadow:0 9px 24px rgba(55,50,95,.08)}.p01-zia-art{height:138px;margin:12px;border-radius:8px;background:#f7f7fa;position:relative;overflow:hidden;display:flex;align-items:flex-end;padding:14px}.p01-zia-art:before{content:'';position:absolute;width:150px;height:150px;border:1px solid rgba(112,103,220,.12);border-radius:50%;right:-65px;top:-75px;box-shadow:0 0 0 22px rgba(112,103,220,.025),0 0 0 45px rgba(112,103,220,.02)}.p01-zia-art .agent-person{position:absolute;left:50%;top:51%;transform:translate(-50%,-50%);width:72px;height:84px}.p01-zia-art .head{position:absolute;left:19px;top:2px;width:34px;height:36px;border-radius:50% 50% 46% 46%;background:#fff;border:2px solid #2f3240}.p01-zia-art .hair{position:absolute;left:15px;top:-1px;width:42px;height:24px;border-radius:52% 48% 42% 24%;background:#252b44}.p01-zia-art .body{position:absolute;left:5px;bottom:0;width:62px;height:45px;border-radius:32px 32px 9px 9px;background:#6c63e7}.p01-zia-art.blue .body{background:#5085d7}.p01-zia-art.teal .body{background:#21aa9b}.p01-zia-art.orange .body{background:#f29b48}.p01-zia-art .face{position:absolute;left:26px;top:20px;width:4px;height:4px;border-radius:50%;background:#2f3240;box-shadow:14px 0 0 #2f3240}.p01-zia-art .smile{position:absolute;left:30px;top:29px;width:12px;height:6px;border-bottom:1.5px solid #2f3240;border-radius:0 0 10px 10px}.p01-zia-art .zoho-label{position:relative;z-index:2;margin-left:auto;background:rgba(255,255,255,.88);border-radius:4px;padding:4px 6px;font-size:7px;font-weight:700;color:#454a54}.p01-zia-cardbody{padding:0 14px 14px}.p01-zia-cardbody h3{font-size:11px;margin:0 0 5px;color:#30323a}.p01-zia-cardbody p{font-size:8px;line-height:1.45;color:#777b87;margin:0 0 9px;min-height:35px}.p01-zia-meta{display:flex;align-items:center;gap:6px;font-size:7.5px;color:#858995}.p01-zia-pill{padding:3px 6px;border-radius:10px;background:#edeaff;color:#594ed0;font-weight:600}.p01-zia-state{margin-left:auto;color:#15956f;font-weight:600}.p01-zia-state:before{content:'';display:inline-block;width:6px;height:6px;border-radius:50%;background:#18b881;margin-right:4px}
      .p01-zia-not-store{margin-top:15px;border:1px solid #e7e7ef;background:#fff;border-radius:8px;padding:10px 12px;color:#6b707c;font-size:8.5px;line-height:1.55}.p01-zia-not-store strong{color:#333740}
      .p01-zia-detail-head{display:flex;align-items:flex-start;gap:14px;margin-bottom:14px}.p01-zia-back{width:30px;height:30px;border:1px solid #e1e1e9;border-radius:6px;background:#fff;display:grid;place-items:center;cursor:pointer}.p01-zia-back svg{width:17px;height:17px;fill:none;stroke:#565b66;stroke-width:1.5}.p01-zia-detail-icon{width:58px;height:58px;border-radius:13px;background:linear-gradient(145deg,#7e70f5,#5b4bdd);color:#fff;display:grid;place-items:center;font-size:16px;font-weight:800}.p01-zia-detail-title h1{font-size:19px;margin:2px 0 4px}.p01-zia-detail-title p{font-size:9px;color:#747986;margin:0;line-height:1.45;max-width:620px}.p01-zia-detail-actions{margin-left:auto;display:flex;gap:8px}.p01-zia-tabs{display:flex;gap:22px;border-bottom:1px solid #e2e2ea;margin-bottom:16px}.p01-zia-tabs button{border:0;background:transparent;padding:0 2px 10px;font-size:9px;color:#666b77}.p01-zia-tabs button.active{color:#5b4bd3;border-bottom:2px solid #6857e8;font-weight:700}.p01-zia-detail-grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(280px,.85fr);gap:14px}.p01-zia-panel{border:1px solid #e5e5ed;background:#fff;border-radius:9px;padding:15px;margin-bottom:12px}.p01-zia-panel h3{font-size:11px;margin:0 0 9px}.p01-zia-panel p,.p01-zia-panel li{font-size:8.5px;line-height:1.55;color:#666b76}.p01-zia-panel ul{margin:0;padding-left:17px}.p01-zia-facts{display:grid;grid-template-columns:135px 1fr;margin:0}.p01-zia-facts dt,.p01-zia-facts dd{font-size:8.5px;padding:8px 0;border-top:1px solid #eeeeF3;margin:0}.p01-zia-facts dt{color:#818692}.p01-zia-facts dd{color:#373b44}.p01-zia-tool-list{display:grid;gap:8px}.p01-zia-tool{border:1px solid #ececf2;border-radius:7px;padding:9px 10px}.p01-zia-tool b{display:block;font-size:9px}.p01-zia-tool span{display:block;margin-top:3px;font-size:7.8px;color:#777c87}.p01-zia-observe{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.p01-zia-observe div{border:1px solid #ececf2;border-radius:7px;padding:10px}.p01-zia-observe strong{display:block;font-size:18px}.p01-zia-observe span{font-size:7.5px;color:#7b808b}
      @media(max-width:1180px){.p01-zia-cards{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:760px){.p01-zia-body{grid-template-columns:60px 1fr}.p01-zia-workspace{padding:18px 14px}.p01-zia-cards{grid-template-columns:1fr}.p01-zia-detail-grid{grid-template-columns:1fr}.p01-zia-controls{flex-wrap:wrap}.p01-zia-controls label{margin-left:0}.p01-zia-detail-actions{display:none}}
    `;
    document.head.appendChild(style);
  }

  function rail(active='agents') {
    const item=(key,label,ic)=>`<button type="button" class="${active===key?'active':''}" data-p01-zia-nav="${key}">${icon(ic)}<span>${label}</span></button>`;
    return `${item('home','Home','home')}${item('studio','Agent Studio','studio')}${item('agents','Agents','agents')}${item('multi','Multi-Agent','multi')}${item('tools','Tools','tools')}${item('knowledge','Knowledge','knowledge')}${item('store','Store','store')}<div class="push"></div>${item('observe','Observability','observe')}`;
  }

  function shell(content,active='agents') {
    return `<div class="p01-zia-portal">
      <header class="p01-zia-productbar"><div class="p01-zia-brandmark">Z</div><div class="p01-zia-brand"><small>Zoho</small><strong>Zia Agents</strong></div><div class="spacer"></div><button type="button" data-p01-back-crm title="Back to Zoho CRM">${icon('back')}</button><button type="button" title="Settings">${icon('gear')}</button><span class="p01-zia-avatar">DB</span></header>
      <div class="p01-zia-body"><aside class="p01-zia-rail">${rail(active)}</aside><main class="p01-zia-workspace">${content}</main></div>
    </div>`;
  }

  function agentArt(a) {
    return `<div class="p01-zia-art ${a.tone}"><div class="agent-person"><div class="body"></div><div class="head"></div><div class="hair"></div><div class="face"></div><div class="smile"></div></div><span class="zoho-label">Zoho CRM</span></div>`;
  }

  function renderAgentsPage() {
    root.innerHTML = shell(`<div class="p01-zia-pagehead"><div><h1>Agents</h1><p>Custom recruitment agents built in Agent Studio and deployed into the recruitment CRM.</p></div><div class="actions"><button class="p01-zia-btn" type="button" data-p01-open-crm>Open Zoho CRM</button><button class="p01-zia-btn primary" type="button" data-p01-create-agent>Create Agent</button></div></div>
      <div class="p01-zia-controls"><select><option>All agents</option></select><select><option>Status: Active</option></select><label>${icon('search')}<input placeholder="Search agents"></label></div>
      <div class="p01-zia-section-title"><h2>My Agents</h2><span>4 custom agents · deployed to Zoho CRM</span></div>
      <div class="p01-zia-cards">${agents.map(a=>`<article class="p01-zia-card" data-p01-agent-card="${a.key}">${agentArt(a)}<div class="p01-zia-cardbody"><h3>${a.name}</h3><p>${a.description}</p><div class="p01-zia-meta"><span class="p01-zia-pill">Custom agent</span><span>${a.deployment}</span><span class="p01-zia-state">Active</span></div></div></article>`).join('')}</div>
      <div class="p01-zia-not-store"><strong>Custom build, not Agent Store:</strong> these four agents are created from scratch in Zia Agent Studio for this recruitment operating model. The Store remains available for prebuilt agents, but it is not the source of these cards.</div>`,'agents');
    bindPortal();
  }

  function renderDetail(key) {
    const a=agents.find(x=>x.key===key)||agents[0];
    root.innerHTML = shell(`<div class="p01-zia-detail-head"><button class="p01-zia-back" type="button" data-p01-agent-back>${icon('back')}</button><div class="p01-zia-detail-icon">${a.initials}</div><div class="p01-zia-detail-title"><h1>${a.name}</h1><p>${a.description}</p><div class="p01-zia-meta" style="margin-top:7px"><span class="p01-zia-pill">Custom agent</span><span>Zoho CRM</span><span class="p01-zia-state">Deployed</span></div></div><div class="p01-zia-detail-actions"><button class="p01-zia-btn">Test Agent</button><button class="p01-zia-btn primary">Deploy ▾</button></div></div>
      <div class="p01-zia-tabs"><button class="active">Overview</button><button>Integrate</button><button>Observability</button><button>Versions <span>3</span></button></div>
      <div class="p01-zia-detail-grid"><div><section class="p01-zia-panel"><h3>Instructions for Agent</h3><p>Operate as the <b>${a.role}</b> for the recruitment team. Use current Zoho CRM record context, follow approved recruitment rules, keep actions traceable, and do not make final qualification, rejection, or hiring decisions without the responsible human user.</p><ul><li>Use the current ${a.crmContext} context before acting.</li><li>Respect recruiter approval boundaries for candidate-facing or publication actions.</li><li>Write material results back to the appropriate CRM record or audit trail.</li></ul></section><section class="p01-zia-panel"><h3>Agent Role</h3><p>${a.role}</p></section><section class="p01-zia-panel"><h3>Deployment</h3><dl class="p01-zia-facts"><dt>Target service</dt><dd>Zoho CRM</dd><dt>Deployment method</dt><dd>${a.deployment}</dd><dt>CRM context</dt><dd>${a.crmContext}</dd><dt>Activation</dt><dd>${a.trigger}</dd></dl></section></div><div><section class="p01-zia-panel"><h3>Knowledge Base <span style="font-size:8px;color:#858995">${a.knowledge.length}</span></h3><div class="p01-zia-tool-list">${a.knowledge.map(x=>`<div class="p01-zia-tool"><b>${x}</b><span>Recruitment knowledge source</span></div>`).join('')}</div></section><section class="p01-zia-panel"><h3>Tools <span style="font-size:8px;color:#858995">${a.tools.length}</span></h3><div class="p01-zia-tool-list">${a.tools.map(x=>`<div class="p01-zia-tool"><b>${x}</b><span>Configured tool / connection</span></div>`).join('')}</div></section><section class="p01-zia-panel"><h3>Observability</h3><div class="p01-zia-observe"><div><strong>24</strong><span>runs this week</span></div><div><strong>96%</strong><span>successful</span></div><div><strong>0</strong><span>unreviewed critical actions</span></div></div></section></div></div>`,'agents');
    bindPortal();
  }

  function restoreCRM() {
    if (typeof window.recruitmentV5 === 'function') window.recruitmentV5();
    setTimeout(cleanAndEnsure,35);
  }

  function bindPortal() {
    root.querySelectorAll('[data-p01-agent-card]').forEach(card=>card.onclick=()=>renderDetail(card.dataset.p01AgentCard));
    root.querySelector('[data-p01-agent-back]')?.addEventListener('click',renderAgentsPage);
    root.querySelectorAll('[data-p01-back-crm],[data-p01-open-crm]').forEach(btn=>btn.onclick=restoreCRM);
    root.querySelector('[data-p01-create-agent]')?.addEventListener('click',()=>{
      const toast=document.getElementById('toast');if(toast){toast.textContent='Create Agent opens Agent Studio in production.';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200);}
    });
    root.querySelectorAll('[data-p01-zia-nav]').forEach(btn=>btn.onclick=()=>{
      const key=btn.dataset.p01ZiaNav;
      if(key==='agents'){renderAgentsPage();return;}
      const toast=document.getElementById('toast');if(toast){toast.textContent=key==='store'?'Agent Store contains prebuilt marketplace agents; these recruitment agents are custom builds.':`${btn.textContent.trim()} is represented as a Zia Agents portal destination in this reconstruction.`;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200);}
    });
  }

  function returnToHomeIfLegacyAgentScreen() {
    if (root.querySelector('.p01-zia-portal')) return;
    const heading = root.querySelector('.z5-module-title h1, .p01-agent-head h1');
    const text = root.textContent || '';
    const legacy = root.querySelector('.p01-agent-shell') || /Recruitment AI Agents/i.test(heading?.textContent || '') || (((heading?.textContent || '').trim() === 'Agents') && /External resume analysis layer/i.test(text));
    if (!legacy) return;
    const home = root.querySelector('[data-z5-top="Home"]');
    if (home) home.click();
  }

  function ensureAgentsLaunch() {
    if (root.querySelector('.p01-zia-portal')) return;
    const nav=root.querySelector('.z5-topnav');
    if(!nav||nav.querySelector('[data-p01-zia-launch]'))return;
    const button=document.createElement('button');
    button.type='button';button.className='p01-zia-launch';button.dataset.p01ZiaLaunch='1';button.textContent='Agents';
    button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();renderAgentsPage();});
    nav.appendChild(button);
  }

  function cleanAndEnsure() {
    ensureStyle();
    if (root.querySelector('.p01-zia-portal')) return;
    root.querySelectorAll('[data-z5-top="Agents"],[data-z5-module="AI Agents"],.p01-ai-nav').forEach(el=>el.remove());
    returnToHomeIfLegacyAgentScreen();
    ensureAgentsLaunch();
  }

  document.addEventListener('click',event=>{
    const legacyRoute=event.target.closest?.('[data-z5-top="Agents"],[data-z5-module="AI Agents"],.p01-ai-nav');
    if(!legacyRoute)return;
    event.preventDefault();event.stopImmediatePropagation();renderAgentsPage();
  },true);

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;cleanAndEnsure();});};
  new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
  cleanAndEnsure();
})();
