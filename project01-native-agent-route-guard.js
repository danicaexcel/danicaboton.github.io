(() => {
  const params = new URLSearchParams(location.search);
  if (!/demo\.html$/.test(location.pathname) || params.get('id') !== 'recruitment') return;

  const root = document.getElementById('demoRoot');
  if (!root) return;

  const agents = [
    {
      key:'rediscovery',
      name:'Candidate Rediscovery Agent',
      role:'Talent Rediscovery Specialist',
      description:'Finds strong previous applicants for newly active Job Openings and surfaces recruiter-approved matches into the AI Rediscovered pipeline.',
      deployment:'Digital Employee',
      context:'Job Openings + Applicants',
      trigger:'Active Job Opening meets rediscovery conditions',
      tools:'Applicant search · Job Opening context · Applicant update · Notes / audit',
      initials:'CR',
      tone:'violet'
    },
    {
      key:'posting',
      name:'Job Posting Content Agent',
      role:'Recruitment Content Specialist',
      description:'Creates channel-specific job content from one approved Zoho Job Opening for Indeed, Facebook, and Instagram without changing the approved requirements.',
      deployment:'Connection',
      context:'Job Openings',
      trigger:'Manual custom button on an approved Job Opening',
      tools:'Job Opening fields · Indeed · Facebook · Instagram',
      initials:'JP',
      tone:'blue'
    },
    {
      key:'operations',
      name:'Recruitment Operations Agent',
      role:'Recruitment Operations Specialist',
      description:'Combines application completeness, recruiter copilot, pipeline-risk detection, interview preparation, and approved applicant follow-up.',
      deployment:'Digital Employee',
      context:'Applicants + activities',
      trigger:'Applicant conditions + manual record button',
      tools:'Applicant context · Tasks · Meetings · Calls · Twilio SMS · Messenger · Teams',
      initials:'RO',
      tone:'teal'
    },
    {
      key:'manager',
      name:'Recruitment Manager Assistant Agent',
      role:'Recruitment Management Assistant',
      description:'Produces proactive recruitment summaries for workload, aging candidates, source performance, bottlenecks, high-fit applicants waiting for action, and openings at risk.',
      deployment:'Digital Employee',
      context:'Recruitment reports + pipeline',
      trigger:'Scheduled / autonomous manager reporting conditions',
      tools:'Recruitment reports · Applicant pipeline · Job Openings · Recruiter activity',
      initials:'MA',
      tone:'orange'
    }
  ];

  function ensureStyle(){
    let style = document.getElementById('p01-final-agent-page-style');
    if (style) return;
    style = document.createElement('style');
    style.id = 'p01-final-agent-page-style';
    style.textContent = `
      #demoRoot [data-z5-top="Agents"]{display:inline-flex!important}
      #demoRoot .p01-zia-launch,#demoRoot [data-z5-module="AI Agents"],#demoRoot .p01-ai-nav{display:none!important}
      #demoRoot .p01-zia-home-agent{display:none!important}
      .p01-agent-page{padding:0 14px 34px;background:#eef2f8;min-height:calc(100% - 48px)}
      .p01-agent-toolbar{display:flex;align-items:center;gap:10px;padding:13px 0 12px;border-bottom:1px solid #dfe5ee}
      .p01-agent-tabs{display:flex;align-items:center;gap:4px}.p01-agent-tabs button{height:30px;padding:0 12px;border:1px solid transparent;background:transparent;color:#596474;font-size:10px;border-radius:4px}.p01-agent-tabs button.active{background:#fff;border-color:#d8dee8;color:#273241;font-weight:600}
      .p01-agent-toolbar .spacer{flex:1}.p01-agent-search{height:31px;width:210px;border:1px solid #d2d9e4;background:#fff;border-radius:5px;padding:0 10px;font-size:10px;color:#5f6978}.p01-agent-action{height:31px;border:1px solid #ccd4df;background:#fff;border-radius:5px;padding:0 11px;font-size:9px;color:#3f4a59;cursor:pointer}.p01-agent-action.primary{background:#246ee9;border-color:#246ee9;color:#fff}
      .p01-agent-intro{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;padding:18px 2px 12px}.p01-agent-intro h2{margin:0;color:#283240;font-size:16px}.p01-agent-intro p{margin:5px 0 0;color:#6f7887;font-size:9px;line-height:1.5}.p01-agent-count{font-size:9px;color:#7a8391}
      .p01-agent-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.p01-agent-tile{border:1px solid #dfe4eb;background:#fff;border-radius:8px;overflow:hidden;cursor:pointer;min-height:265px;transition:box-shadow .15s ease,transform .15s ease}.p01-agent-tile:hover{box-shadow:0 7px 22px rgba(48,65,87,.11);transform:translateY(-1px)}
      .p01-agent-art{height:144px;margin:12px 12px 0;border-radius:7px;background:#f6f7f9;position:relative;overflow:hidden}.p01-agent-art:before,.p01-agent-art:after{content:'';position:absolute;border:1px solid rgba(71,112,176,.10);border-radius:50%}.p01-agent-art:before{width:160px;height:160px;right:-74px;top:-78px}.p01-agent-art:after{width:112px;height:112px;left:-52px;bottom:-62px}.p01-agent-zoho{position:absolute;right:10px;top:10px;font-size:8px;font-weight:700;color:#384759;display:flex;align-items:center;gap:5px}.p01-agent-zoho i{display:inline-block;width:17px;height:11px;border-radius:8px;border:2px solid #2683d9;transform:rotate(-18deg)}
      .p01-agent-person{position:absolute;left:50%;top:48%;transform:translate(-50%,-50%);width:84px;height:94px}.p01-agent-person .head{position:absolute;left:25px;top:7px;width:35px;height:38px;border:2px solid #283444;background:#fff;border-radius:48%}.p01-agent-person .hair{position:absolute;left:20px;top:3px;width:44px;height:22px;background:#29364b;border-radius:55% 45% 35% 25%}.p01-agent-person .eyes{position:absolute;left:35px;top:25px;width:3px;height:3px;background:#283444;border-radius:50%;box-shadow:12px 0 0 #283444}.p01-agent-person .body{position:absolute;left:8px;bottom:0;width:69px;height:52px;background:#6e64e8;border-radius:34px 34px 8px 8px}.p01-agent-art.blue .body{background:#568be0}.p01-agent-art.teal .body{background:#2bb19f}.p01-agent-art.orange .body{background:#f39a47}.p01-agent-roleband{position:absolute;left:0;right:0;bottom:0;height:22px;display:flex;align-items:center;justify-content:center;background:#6e64e8;color:#fff;font-size:7px;font-weight:700}.p01-agent-art.blue .p01-agent-roleband{background:#568be0}.p01-agent-art.teal .p01-agent-roleband{background:#2bb19f}.p01-agent-art.orange .p01-agent-roleband{background:#f39a47}
      .p01-agent-tile-body{padding:11px 13px 13px}.p01-agent-tile-body h3{margin:0 0 5px;color:#303945;font-size:11px}.p01-agent-tile-body p{margin:0;color:#737d8c;font-size:8px;line-height:1.45;min-height:35px}.p01-agent-meta{display:flex;align-items:center;gap:6px;margin-top:10px;font-size:7.5px}.p01-agent-pill{padding:3px 6px;border-radius:10px;background:#eeeaff;color:#5b50c9;font-weight:600}.p01-agent-status{margin-left:auto;color:#168b68;font-weight:600}.p01-agent-status:before{content:'';display:inline-block;width:6px;height:6px;border-radius:50%;background:#13b77d;margin-right:4px}
      .p01-agent-detail{padding:14px 16px 32px;background:#eef2f8;min-height:calc(100% - 48px)}.p01-agent-detail-head{display:flex;align-items:flex-start;gap:12px;padding:10px 0 14px}.p01-agent-back{width:31px;height:31px;border:1px solid #ced6e1;background:#fff;border-radius:5px;color:#4e5968;cursor:pointer}.p01-agent-detail-icon{width:54px;height:54px;border-radius:10px;background:#6e64e8;color:#fff;display:grid;place-items:center;font-size:15px;font-weight:700}.p01-agent-detail-title h2{margin:2px 0 4px;font-size:17px;color:#27313f}.p01-agent-detail-title p{margin:0;color:#717b89;font-size:9px;line-height:1.45;max-width:720px}.p01-agent-detail-actions{margin-left:auto;display:flex;gap:7px}.p01-agent-detail-tabs{display:flex;gap:18px;background:#fff;border:1px solid #dce2eb;border-radius:6px 6px 0 0;padding:0 15px}.p01-agent-detail-tabs button{height:38px;border:0;background:transparent;color:#667180;font-size:9px}.p01-agent-detail-tabs button.active{color:#246ee9;border-bottom:2px solid #246ee9;font-weight:600}.p01-agent-detail-grid{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(280px,.55fr);gap:12px;margin-top:12px}.p01-agent-panel{background:#fff;border:1px solid #dce2eb;border-radius:6px;padding:14px}.p01-agent-panel h3{margin:0 0 11px;color:#303a47;font-size:11px}.p01-agent-panel dl{display:grid;grid-template-columns:145px 1fr;margin:0;border-top:1px solid #edf0f4}.p01-agent-panel dt,.p01-agent-panel dd{margin:0;padding:9px 7px;border-bottom:1px solid #edf0f4;font-size:8.5px;line-height:1.45}.p01-agent-panel dt{color:#77808f}.p01-agent-panel dd{color:#384350}.p01-agent-panel .instruction{padding:11px;border:1px solid #e4e8ee;background:#f8f9fb;border-radius:5px;color:#596474;font-size:8.5px;line-height:1.55}
      @media(max-width:1120px){.p01-agent-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:760px){.p01-agent-grid,.p01-agent-detail-grid{grid-template-columns:1fr}.p01-agent-search{display:none}}
    `;
    document.head.appendChild(style);
  }

  function getMain(){
    const title = root.querySelector('.z5-module-title');
    if (title?.parentElement) return title.parentElement;
    const oldHeading = [...root.querySelectorAll('h1')].find(h => ['Home','Agents','Analytics','Reports','Workqueue'].includes(h.textContent.trim()));
    return oldHeading?.parentElement?.parentElement || null;
  }

  function setAgentsActive(){
    root.querySelectorAll('[data-z5-top]').forEach(btn => btn.classList.toggle('active', btn.dataset.z5Top === 'Agents'));
    root.querySelectorAll('[data-z5-module]').forEach(btn => btn.classList.remove('active'));
  }

  function art(agent){
    return `<div class="p01-agent-art ${agent.tone}"><div class="p01-agent-zoho"><i></i>Zoho CRM</div><div class="p01-agent-person"><span class="body"></span><span class="head"></span><span class="hair"></span><span class="eyes"></span></div><div class="p01-agent-roleband">${agent.role}</div></div>`;
  }

  function renderAgentsPage(){
    const main = getMain();
    if (!main) return;
    setAgentsActive();
    main.innerHTML = `<div class="z5-module-title"><h1>Agents</h1></div><div class="p01-agent-page">
      <div class="p01-agent-toolbar"><div class="p01-agent-tabs"><button class="active">My Agents</button><button>Draft</button></div><span class="spacer"></span><input class="p01-agent-search" placeholder="Search agents"><button class="p01-agent-action" data-p01-open-studio>Open Agent Studio</button><button class="p01-agent-action primary" data-p01-new-agent>New Agent</button></div>
      <div class="p01-agent-intro"><div><h2>My Agents</h2><p>Custom recruitment agents built in Zia Agent Studio and deployed into this Zoho CRM environment.</p></div><span class="p01-agent-count">4 custom agents · 4 active</span></div>
      <div class="p01-agent-grid">${agents.map(a=>`<article class="p01-agent-tile" data-p01-agent="${a.key}">${art(a)}<div class="p01-agent-tile-body"><h3>${a.name}</h3><p>${a.description}</p><div class="p01-agent-meta"><span class="p01-agent-pill">Custom Agent</span><span>${a.deployment}</span><span class="p01-agent-status">Active</span></div></div></article>`).join('')}</div>
    </div>`;
    main.querySelectorAll('[data-p01-agent]').forEach(card => card.onclick = () => renderAgentDetail(card.dataset.p01Agent));
    main.querySelector('[data-p01-open-studio]')?.addEventListener('click',()=>showToast('Agent Studio opens the custom-agent builder in production.'));
    main.querySelector('[data-p01-new-agent]')?.addEventListener('click',()=>showToast('New Agent opens Zia Agent Studio in production.'));
  }

  function renderAgentDetail(key){
    const agent = agents.find(a=>a.key===key) || agents[0];
    const main = getMain();
    if (!main) return;
    setAgentsActive();
    main.innerHTML = `<div class="z5-module-title"><h1>Agents</h1></div><div class="p01-agent-detail">
      <div class="p01-agent-detail-head"><button class="p01-agent-back" data-p01-back>←</button><div class="p01-agent-detail-icon">${agent.initials}</div><div class="p01-agent-detail-title"><h2>${agent.name}</h2><p>${agent.description}</p></div><div class="p01-agent-detail-actions"><button class="p01-agent-action">Test Agent</button><button class="p01-agent-action primary">Open in Agent Studio</button></div></div>
      <div class="p01-agent-detail-tabs"><button class="active">Overview</button><button>Integrate</button><button>Observability</button><button>Versions</button></div>
      <div class="p01-agent-detail-grid"><section class="p01-agent-panel"><h3>Overview</h3><div class="instruction">This is a custom recruitment agent. It uses approved Zoho CRM context and tools to assist recruitment operations while recruiter-controlled actions remain reviewable.</div><dl><dt>Agent role</dt><dd>${agent.role}</dd><dt>CRM context</dt><dd>${agent.context}</dd><dt>Activation</dt><dd>${agent.trigger}</dd><dt>Tools</dt><dd>${agent.tools}</dd></dl></section><section class="p01-agent-panel"><h3>Deployment</h3><dl><dt>Status</dt><dd><span class="p01-agent-status">Active</span></dd><dt>Type</dt><dd>Custom Agent</dd><dt>Deployment</dt><dd>${agent.deployment}</dd><dt>Built in</dt><dd>Zia Agent Studio</dd><dt>System of record</dt><dd>Zoho CRM</dd></dl></section></div>
    </div>`;
    main.querySelector('[data-p01-back]')?.addEventListener('click',renderAgentsPage);
  }

  function showToast(message){
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'),2200);
  }

  function cleanupNonNativePieces(){
    ensureStyle();
    root.querySelectorAll('[data-z5-module="AI Agents"],.p01-ai-nav,.p01-zia-launch').forEach(el=>{el.style.display='none';});
    const topAgents = root.querySelector('[data-z5-top="Agents"]');
    if (topAgents) topAgents.style.display = 'inline-flex';
  }

  root.addEventListener('click', event => {
    const button = event.target.closest?.('[data-z5-top="Agents"]');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    renderAgentsPage();
  }, true);

  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(()=>{queued=false;cleanupNonNativePieces();});
  };
  new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
  cleanupNonNativePieces();
})();