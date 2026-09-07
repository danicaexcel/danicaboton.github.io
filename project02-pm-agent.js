(() => {
  const outer = document.getElementById('native');
  if (!outer) return;

  function deepestDoc() {
    try {
      let doc = outer.contentDocument;
      if (!doc) return null;
      for (let i = 0; i < 18; i++) {
        const frame = doc.querySelector('iframe');
        if (!frame || !frame.contentDocument) break;
        doc = frame.contentDocument;
      }
      return doc;
    } catch (_) { return null; }
  }

  function runtime() {
    if (window.__project02NativeAgentSuiteInstalled) return;
    window.__project02NativeAgentSuiteInstalled = true;

    const DEMO_TODAY = new Date('2026-09-07T12:00:00');
    const activity = [];
    const pmApprovals = {};
    const sprintState = { approved:false, applied:false, sprint:'Sprint 18 · Sep 8–18', goal:'Complete UAT readiness and publish stable API documentation without pulling the blocked payment dependency into committed sprint scope.' };
    let activeAgent = 'pm';
    let activeTaskId = 'TSK-002';
    let settingsTab = 'Brain';
    let messages = {pm:[], planner:[]};

    const agents = {
      pm:{
        title:'Project Manager Agent, General...',
        name:'Project Manager Agent',
        type:'General Agent',
        avatar:'PM',
        accent:'#f65f7c',
        welcome:'Hi Team, how can I help you today?',
        prompts:['Catch me up','What are we working on?','Review project risks'],
        identity:'Act as a controlled project manager for the Monday workspace. Read projects, tasks, due dates, dependencies and Updates. Follow up with the assigned member when context is missing. Suggest recovery options before changing the plan. Never change a due date, task state or project risk until the assigned member and project owner approve the proposed action.',
        triggers:['Every 15 minutes: scan overdue and stuck work','When a task becomes Stuck or overdue','When a new Update changes blocker context','Manual run from Agents or a task row'],
        channels:['Monday Updates','Master Tasks','Master Projects','Escalations'],
        tools:['Read board items and column values','Read recent Updates and blocker notes','Post follow-up or approval-request Updates','Update Date / Status / Risk after approval','Write agent action to Activity & Automation Logs']
      },
      planner:{
        title:'Planner Agent, Sprint & Agile...',
        name:'Planner Agent',
        type:'Sprint & Agile Agent',
        avatar:'SP',
        accent:'#7c3aed',
        welcome:'Ready to plan the next sprint.',
        prompts:['Plan next sprint','Review backlog','Check sprint capacity'],
        identity:'Act as the sprint and Agile planning agent for the delivery team. Review backlog priority, current status, blockers, remaining hours, owner capacity and dependencies. Propose a sprint goal and realistic committed scope. Keep blocked external-dependency work out of committed scope unless the owner explicitly accepts the risk. Do not apply sprint assignments, due-date changes or scope changes until the project owner approves the proposal.',
        triggers:['Manual sprint-planning run','Weekly backlog review before sprint start','When carry-over work exceeds the configured threshold','When a blocker threatens committed sprint scope'],
        channels:['Monday backlog and task boards','Project Updates','Team workload','Sprint planning review'],
        tools:['Read backlog priority and remaining hours','Read workload and task dependencies','Build proposed sprint scope','Flag carry-over and blocked work','Apply approved Sprint value to selected items','Post sprint plan summary to Monday Updates']
      }
    };

    const style = document.createElement('style');
    style.id = 'project02-native-agent-suite-style';
    style.textContent = `
      .p02-agent-open{height:25px;border:1px solid #c3c7d5;border-radius:4px;background:#fff;color:#323338;padding:0 9px;font:500 9px/1 Arial,sans-serif;cursor:pointer;white-space:nowrap}.p02-agent-open:hover{background:#f0f6ff;border-color:#0073ea;color:#0060b9}
      .p02-na-backdrop{position:fixed;inset:0;z-index:9998;background:rgba(41,43,51,.32);display:none;padding:26px}.p02-na-backdrop.open{display:block}
      .p02-na-shell{height:100%;min-height:0;background:#fff;border:1px solid #d0d4e4;border-radius:14px;box-shadow:0 18px 50px rgba(50,51,56,.22);overflow:hidden;display:grid;grid-template-rows:58px minmax(0,1fr);font-family:Arial,sans-serif;color:#323338}
      .p02-na-top{display:flex;align-items:center;gap:10px;padding:0 16px;border-bottom:1px solid #e5e7ed;background:#fff}.p02-na-avatar{width:30px;height:30px;border-radius:8px;color:#fff;display:grid;place-items:center;font-size:9px;font-weight:700}.p02-na-title{font-size:13px;font-weight:500;max-width:310px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.p02-na-new{border:1px solid #aeb3bf;border-radius:3px;padding:3px 7px;font-size:9px;color:#53576a}.p02-na-top-actions{margin-left:auto;display:flex;align-items:center;gap:3px}.p02-na-top-btn{height:30px;min-width:30px;border:0;border-radius:4px;background:transparent;color:#53576a;padding:0 8px;font-size:11px;cursor:pointer}.p02-na-top-btn:hover{background:#f1f2f6}.p02-na-share{border:1px solid #c3c7d5;padding:0 10px}.p02-na-close{font-size:20px;line-height:1}
      .p02-na-main{min-height:0;display:grid;grid-template-columns:minmax(0,2.2fr) minmax(330px,.95fr);background:#f6f7fb}.p02-na-chat{min-width:0;min-height:0;display:grid;grid-template-rows:48px minmax(0,1fr) auto;background:#fff;border-right:1px solid #e2e4ea}.p02-na-chatbar{display:flex;align-items:center;padding:0 18px;border-bottom:1px solid #eef0f4;font-size:10px;color:#53576a}.p02-na-chattools{margin-left:auto;display:flex;gap:4px}.p02-na-chattools button{width:28px;height:28px;border:0;background:transparent;border-radius:4px;color:#53576a;cursor:pointer}.p02-na-chattools button:hover{background:#f1f2f6}
      .p02-na-thread{min-height:0;overflow:auto;padding:52px clamp(22px,6vw,86px) 24px}.p02-na-welcome{max-width:660px;margin:0 auto}.p02-na-welcome h2{margin:0 0 15px;font-size:13px;font-weight:500}.p02-na-chips{display:flex;gap:8px;flex-wrap:wrap}.p02-na-chip{height:31px;border:1px solid #c8ccd6;border-radius:8px;background:#fff;color:#53576a;padding:0 11px;font-size:10px;cursor:pointer}.p02-na-chip:hover{background:#f7f8fa;border-color:#9ca1ad}.p02-na-msgs{max-width:720px;margin:24px auto 0;display:grid;gap:14px}.p02-na-msg{display:grid;grid-template-columns:28px minmax(0,1fr);gap:9px;align-items:start}.p02-na-msg.user{grid-template-columns:minmax(0,1fr);}.p02-na-msg.user .p02-na-bubble{margin-left:auto;background:#f1f5ff;max-width:80%}.p02-na-msg-avatar{width:28px;height:28px;border-radius:8px;color:#fff;display:grid;place-items:center;font-size:8px;font-weight:700}.p02-na-bubble{border:1px solid #e0e3e9;background:#fff;border-radius:8px;padding:10px 12px;color:#53576a;font-size:10px;line-height:1.55}.p02-na-bubble strong{display:block;color:#323338;font-size:10px;margin-bottom:3px}.p02-na-bubble small{display:block;color:#8a8f9e;font-size:8px;margin-top:5px}.p02-na-plan{margin-top:8px;border-top:1px solid #eef0f4;padding-top:7px}.p02-na-plan div{display:flex;justify-content:space-between;gap:12px;padding:5px 0;font-size:9px}.p02-na-plan b{font-weight:600;color:#323338}.p02-na-plan span{color:#676879}.p02-na-inline-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}.p02-na-mini{height:29px;border:1px solid #c3c7d5;border-radius:4px;background:#fff;color:#323338;padding:0 9px;font-size:9px;font-weight:500;cursor:pointer}.p02-na-mini.primary{background:#0073ea;border-color:#0073ea;color:#fff}.p02-na-mini.approve{background:#7c3aed;border-color:#7c3aed;color:#fff}.p02-na-mini[disabled]{opacity:.45;cursor:not-allowed}
      .p02-na-composer{padding:12px clamp(22px,6vw,86px) 22px;background:#fff}.p02-na-input{max-width:720px;margin:0 auto;border:1px solid #bfc4cf;border-radius:10px;background:#fff;min-height:78px;padding:12px;display:grid;grid-template-rows:1fr auto;box-shadow:0 1px 2px rgba(50,51,56,.04)}.p02-na-input textarea{width:100%;min-height:34px;resize:none;border:0;outline:0;font:11px/1.4 Arial,sans-serif;color:#323338}.p02-na-compose-row{display:flex;align-items:center;gap:8px;color:#676879;font-size:13px}.p02-na-send{margin-left:auto;width:28px;height:28px;border:0;border-radius:50%;background:#dfe3eb;color:#fff;cursor:pointer}.p02-na-send.ready{background:#0073ea}
      .p02-na-settings{min-height:0;overflow:auto;background:#fff;padding:18px 18px 26px}.p02-na-settings-title{display:flex;align-items:center;justify-content:space-between;font-size:11px;font-weight:600;margin-bottom:14px}.p02-na-agent-card{display:grid;grid-template-columns:58px minmax(0,1fr);gap:12px;padding:13px;border-radius:12px;background:#f6f7fb}.p02-na-agent-photo{width:58px;height:58px;border-radius:10px;color:#fff;display:grid;place-items:center;font-size:15px;font-weight:700}.p02-na-agent-card small{display:block;color:#676879;font-size:8px}.p02-na-agent-card strong{display:block;margin:7px 0 0;font-size:13px;font-weight:500}.p02-na-live{display:inline-flex;align-items:center;gap:5px;margin-left:5px;color:#676879}.p02-na-live i{width:7px;height:7px;border-radius:50%;background:#00c875}.p02-na-tabs{display:flex;gap:20px;margin-top:15px;border-bottom:1px solid #e1e4e9}.p02-na-tab{border:0;background:transparent;padding:0 0 10px;color:#53576a;font-size:9px;cursor:pointer}.p02-na-tab.active{color:#323338;border-bottom:2px solid #323338}.p02-na-run{height:28px;margin-top:12px;border:1px solid #00a8d6;border-radius:6px;background:#fff;color:#323338;padding:0 9px;font-size:9px;cursor:pointer}.p02-na-section{margin-top:16px}.p02-na-section-head{font-size:9px;font-weight:600;color:#323338;margin-bottom:7px}.p02-na-box{border:1px solid #d7dbe3;border-radius:6px;background:#fff;padding:10px;color:#676879;font-size:9px;line-height:1.55}.p02-na-box strong{display:block;color:#323338;margin-bottom:4px}.p02-na-box ul{margin:5px 0 0;padding-left:15px}.p02-na-source{display:flex;align-items:center;gap:7px;padding:8px 0;border-bottom:1px solid #eef0f4}.p02-na-source:last-child{border-bottom:0}.p02-na-source b{color:#323338}.p02-na-dot{width:20px;height:20px;border-radius:5px;background:#f6f7fb;display:grid;place-items:center;font-size:9px}.p02-na-agent-switch{height:30px;border:1px solid #c3c7d5;border-radius:5px;background:#fff;padding:0 8px;color:#323338;font-size:9px;margin-left:4px}
      @media(max-width:980px){.p02-na-backdrop{padding:10px}.p02-na-main{grid-template-columns:1fr}.p02-na-settings{display:none}.p02-na-chat{border-right:0}.p02-na-thread{padding:35px 20px 20px}.p02-na-composer{padding:10px 20px 18px}}
      @media(max-width:620px){.p02-na-backdrop{padding:0}.p02-na-shell{border-radius:0;border:0}.p02-na-top{padding:0 9px}.p02-na-title{max-width:150px}.p02-na-new,.p02-na-share{display:none}.p02-na-thread{padding:28px 14px 18px}.p02-na-composer{padding:9px 14px 14px}}
    `;
    document.head.appendChild(style);

    function allTasks(){ return typeof tasks === 'undefined' ? [] : tasks; }
    function allProjects(){ return typeof projects === 'undefined' ? [] : projects; }
    function taskById(id){ return allTasks().find(t=>t.id===id); }
    function projectFor(task){ return allProjects().find(p=>p.item===task?.project); }
    function parseDate(value){ const d=new Date(value); return Number.isNaN(d.getTime())?null:d; }
    function overdueDays(task){ const d=parseDate(task?.deadline); return d?Math.max(0,Math.floor((DEMO_TODAY-d)/86400000)):0; }
    function log(action, detail){ activity.unshift({time:'Sep 7 · '+new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}), action, detail}); activity.splice(12); }
    function escapeHtml(value){ return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

    function pmRecommendation(task){
      const p=projectFor(task)||{};
      if(task?.id==='TSK-001') return {summary:'The payment integration is blocked by a vendor token dependency and is already affecting launch readiness.',alternative:'Continue sandbox validation with mock credentials while the vendor token is pending instead of leaving the whole task idle.',nextDate:'Sep 12, 2026',projectHealth:'At Risk',owner:p.owner||'Carlo Mendoza'};
      if(task?.id==='TSK-002') return {summary:'The navigation revision is overdue and has already consumed rework hours.',alternative:'Freeze the approved page layout and limit this revision to navigation behavior so completed design work is not reopened.',nextDate:'Sep 11, 2026',projectHealth:p.health||'On Track',owner:p.owner||'Maria Santos'};
      if(task?.id==='TSK-003') return {summary:'Documentation is slightly overdue but the stable sections can be released before the payment examples are complete.',alternative:'Publish authentication and integration documentation now and track payment examples as a linked follow-up item.',nextDate:'Sep 9, 2026',projectHealth:p.health||'On Track',owner:p.owner||'Maria Santos'};
      return {summary:'This task needs a project-management check before any automated plan change.',alternative:'Confirm the blocker and preserve the current assignee before proposing date or risk changes.',nextDate:task?.deadline||'Sep 10, 2026',projectHealth:p.health||'On Track',owner:p.owner||'Project owner'};
    }

    function sprintProposal(){
      const scope=[
        {id:'TSK-003',reason:'Finish and publish stable API documentation',hours:14},
        {id:'TSK-004',reason:'Complete UAT evidence and owner review',hours:2},
        {id:'TSK-002',reason:'Complete scoped navigation revision',hours:10}
      ];
      const deferred=[{id:'TSK-001',reason:'Vendor token dependency makes commitment unreliable'}];
      return {capacity:72,committed:26,buffer:46,scope,deferred};
    }

    function ensureMessages(){
      if(!messages.pm.length) messages.pm.push({agent:true,text:'I can monitor overdue or stuck work, read the latest task context, follow up with the assigned member, suggest a recovery plan, and wait for approval before changing Monday data.'});
      if(!messages.planner.length) messages.planner.push({agent:true,text:'I can review the backlog, remaining hours, blockers and team capacity, then propose a sprint goal and committed scope for owner approval.'});
    }
    ensureMessages();

    const backdrop=document.createElement('div');
    backdrop.className='p02-na-backdrop';
    backdrop.id='p02NativeAgents';
    backdrop.innerHTML=`<section class="p02-na-shell" role="dialog" aria-modal="true" aria-label="Monday AI Agents"><header class="p02-na-top"><div class="p02-na-avatar" id="p02NaAvatar">PM</div><div class="p02-na-title" id="p02NaTitle"></div><select class="p02-na-agent-switch" id="p02NaSwitch" aria-label="Choose agent"><option value="pm">Project Manager Agent</option><option value="planner">Planner Agent · Sprint / Agile</option></select><span class="p02-na-new">New</span><div class="p02-na-top-actions"><button class="p02-na-top-btn p02-na-share">♙ Share</button><button class="p02-na-top-btn" title="Copy link">↗</button><button class="p02-na-top-btn" title="More">•••</button><button class="p02-na-top-btn p02-na-close" id="p02NaClose" aria-label="Close">×</button></div></header><div class="p02-na-main"><section class="p02-na-chat"><div class="p02-na-chatbar"><span>New chat</span><div class="p02-na-chattools"><button title="Files">▱</button><button title="History">↶</button><button title="Compose">□</button></div></div><div class="p02-na-thread" id="p02NaThread"></div><form class="p02-na-composer" id="p02NaForm"><div class="p02-na-input"><textarea id="p02NaInput" rows="2" placeholder="Message agent..."></textarea><div class="p02-na-compose-row"><span>＋</span><span>⌕</span><span>♟</span><span style="margin-left:auto;font-size:9px">✧ Auto</span><button class="p02-na-send" id="p02NaSend" type="submit" aria-label="Send">↑</button></div></div></form></section><aside class="p02-na-settings" id="p02NaSettings"></aside></div></section>`;
    document.body.appendChild(backdrop);

    const thread=backdrop.querySelector('#p02NaThread');
    const settings=backdrop.querySelector('#p02NaSettings');
    const input=backdrop.querySelector('#p02NaInput');
    const send=backdrop.querySelector('#p02NaSend');

    function messageMarkup(m){
      if(!m.agent) return `<div class="p02-na-msg user"><div class="p02-na-bubble">${escapeHtml(m.text)}</div></div>`;
      const a=agents[activeAgent];
      return `<div class="p02-na-msg"><span class="p02-na-msg-avatar" style="background:${a.accent}">${a.avatar}</span><div class="p02-na-bubble"><strong>${a.name}</strong>${m.html||escapeHtml(m.text)}${m.time?`<small>${m.time}</small>`:''}</div></div>`;
    }

    function pmFocusedMarkup(){
      const task=taskById(activeTaskId)||allTasks().find(t=>!['Completed','Approved'].includes(t.status));
      if(!task) return '';
      const r=pmRecommendation(task), p=projectFor(task)||{}, days=overdueDays(task);
      const ap=pmApprovals[task.id]||(pmApprovals[task.id]={member:false,owner:false,applied:false});
      return `<div class="p02-na-msg"><span class="p02-na-msg-avatar" style="background:${agents.pm.accent}">PM</span><div class="p02-na-bubble"><strong>${escapeHtml(task.id)} · ${escapeHtml(task.item)}</strong>${escapeHtml(r.summary)}<div class="p02-na-plan"><div><b>Status</b><span>${escapeHtml(task.status)}${days?` · ${days}d overdue`:''}</span></div><div><b>Assigned member</b><span>${escapeHtml(task.person||'—')}</span></div><div><b>Project owner</b><span>${escapeHtml(p.owner||'—')}</span></div><div><b>Suggested recovery</b><span>${escapeHtml(r.alternative)}</span></div><div><b>Proposed due date</b><span>${escapeHtml(r.nextDate)}</span></div></div><div class="p02-na-inline-actions"><button class="p02-na-mini" data-p02-pm="member" ${ap.member?'disabled':''}>${ap.member?'Member approved':'Ask assigned member'}</button><button class="p02-na-mini" data-p02-pm="owner" ${!ap.member||ap.owner?'disabled':''}>${ap.owner?'Owner approved':'Request owner approval'}</button><button class="p02-na-mini approve" data-p02-pm="apply" ${!ap.member||!ap.owner||ap.applied?'disabled':''}>${ap.applied?'Applied to Monday':'Apply approved change'}</button></div></div></div>`;
    }

    function plannerMarkup(){
      const plan=sprintProposal();
      return `<div class="p02-na-msg"><span class="p02-na-msg-avatar" style="background:${agents.planner.accent}">SP</span><div class="p02-na-bubble"><strong>${sprintState.sprint}</strong>${escapeHtml(sprintState.goal)}<div class="p02-na-plan"><div><b>Available capacity</b><span>${plan.capacity} h</span></div><div><b>Proposed commitment</b><span>${plan.committed} h</span></div><div><b>Capacity buffer</b><span>${plan.buffer} h</span></div>${plan.scope.map(x=>`<div><b>${escapeHtml(x.id)}</b><span>${x.hours} h · ${escapeHtml(x.reason)}</span></div>`).join('')}<div><b>Deferred</b><span>TSK-001 · vendor dependency</span></div></div><div class="p02-na-inline-actions"><button class="p02-na-mini" data-p02-sprint="review">Review backlog assumptions</button><button class="p02-na-mini approve" data-p02-sprint="approve" ${sprintState.approved?'disabled':''}>${sprintState.approved?'Sprint approved':'Approve sprint proposal'}</button><button class="p02-na-mini primary" data-p02-sprint="apply" ${!sprintState.approved||sprintState.applied?'disabled':''}>${sprintState.applied?'Applied to Monday':'Apply approved sprint'}</button></div></div></div>`;
    }

    function renderThread(extra=''){
      const a=agents[activeAgent];
      thread.innerHTML=`<div class="p02-na-welcome"><h2>${a.welcome}</h2><div class="p02-na-chips">${a.prompts.map(p=>`<button class="p02-na-chip" data-p02-prompt="${escapeHtml(p)}">↳ ${escapeHtml(p)}</button>`).join('')}</div></div><div class="p02-na-msgs">${messages[activeAgent].map(messageMarkup).join('')}${extra}</div>`;
      thread.querySelectorAll('[data-p02-prompt]').forEach(b=>b.onclick=()=>runPrompt(b.dataset.p02Prompt));
      thread.querySelectorAll('[data-p02-pm]').forEach(b=>b.onclick=()=>handlePmAction(b.dataset.p02Pm));
      thread.querySelectorAll('[data-p02-sprint]').forEach(b=>b.onclick=()=>handleSprintAction(b.dataset.p02Sprint));
      thread.scrollTop=thread.scrollHeight;
    }

    function renderSettings(){
      const a=agents[activeAgent];
      const tabContent = settingsTab==='Brain'
        ? `<button class="p02-na-run" id="p02NaRun">◉ Run now</button><div class="p02-na-section"><div class="p02-na-section-head">⌄ Identity ⓘ</div><div class="p02-na-box"><strong>Define your agent's identity</strong>${escapeHtml(a.identity)}</div></div><div class="p02-na-section"><div class="p02-na-section-head">⌄ Knowledge and access ⓘ</div><div class="p02-na-box"><div class="p02-na-source"><span class="p02-na-dot">m</span><div><b>monday.com</b><br>Master Projects · Master Tasks · Updates</div></div><div class="p02-na-source"><span class="p02-na-dot">▦</span><div><b>Project Operations workspace</b><br>Read operational context and approved write targets</div></div></div></div><div class="p02-na-section"><div class="p02-na-section-head">⌄ Tools ⓘ</div><div class="p02-na-box"><ul>${a.tools.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul></div></div>`
        : settingsTab==='Triggers'
          ? `<div class="p02-na-section"><div class="p02-na-section-head">Agent triggers</div><div class="p02-na-box"><ul>${a.triggers.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul></div></div>`
          : settingsTab==='Channels'
            ? `<div class="p02-na-section"><div class="p02-na-section-head">Connected channels</div><div class="p02-na-box">${a.channels.map(x=>`<div class="p02-na-source"><span class="p02-na-dot">↗</span><b>${escapeHtml(x)}</b></div>`).join('')}</div></div>`
            : `<div class="p02-na-section"><div class="p02-na-section-head">Recent activity</div><div class="p02-na-box">${activity.length?activity.map(x=>`<div class="p02-na-source"><span class="p02-na-dot">✓</span><div><b>${escapeHtml(x.action)}</b><br>${escapeHtml(x.detail)}<br><small>${escapeHtml(x.time)}</small></div></div>`).join(''):'No agent actions yet in this session.'}</div></div>`;
      settings.innerHTML=`<div class="p02-na-settings-title"><span>☷ Agent's settings</span><span>»</span></div><div class="p02-na-agent-card"><div class="p02-na-agent-photo" style="background:${a.accent}">${a.avatar}</div><div><small>${a.name}<span class="p02-na-live"><i></i>Live</span></small><strong>${a.type}</strong></div></div><div class="p02-na-tabs">${['Brain','Triggers','Channels','Activity'].map(t=>`<button class="p02-na-tab ${settingsTab===t?'active':''}" data-p02-settings-tab="${t}">${t}</button>`).join('')}</div>${tabContent}`;
      settings.querySelectorAll('[data-p02-settings-tab]').forEach(b=>b.onclick=()=>{settingsTab=b.dataset.p02SettingsTab;renderSettings()});
      const run=settings.querySelector('#p02NaRun'); if(run)run.onclick=()=>runPrompt(activeAgent==='pm'?'Catch me up':'Plan next sprint');
    }

    function setAgent(key){
      if(!agents[key]) return;
      activeAgent=key; settingsTab='Brain';
      const a=agents[key];
      backdrop.querySelector('#p02NaTitle').textContent=a.title;
      const av=backdrop.querySelector('#p02NaAvatar'); av.textContent=a.avatar; av.style.background=a.accent;
      backdrop.querySelector('#p02NaSwitch').value=key;
      input.placeholder=`Message ${a.name}...`;
      renderThread(key==='pm'?pmFocusedMarkup():plannerMarkup());
      renderSettings();
    }

    function addAgentMessage(html,text){ messages[activeAgent].push({agent:true,html,text,time:'Just now'}); messages[activeAgent].splice(0,12); }
    function addUserMessage(text){ messages[activeAgent].push({agent:false,text}); messages[activeAgent].splice(0,12); }

    function runPrompt(prompt){
      addUserMessage(prompt);
      if(activeAgent==='pm'){
        if(/risk/i.test(prompt)) addAgentMessage(`<strong>Risk review</strong>Mobile App v2 Launch is At Risk because TSK-001 is blocked by the vendor token dependency. Website Redesign has two overdue items, but both have recoverable scope options. I would follow up on TSK-001 first because it is the only critical external blocker.`);
        else if(/working|catch/i.test(prompt)) addAgentMessage(`<strong>Current delivery summary</strong>There are ${allTasks().filter(t=>!['Completed','Approved'].includes(t.status)).length} active tasks. TSK-001 is stuck, TSK-002 is an overdue revision, TSK-003 is overdue documentation, and TSK-004 is waiting for owner review. No date or risk changes should be applied until the approval gate is satisfied.`);
        else addAgentMessage(`<strong>Project manager check</strong>I reviewed task status, dates, latest notes and project health. Open a task using the AI PM button if you want the approval flow for a specific item.`);
        log('Project Manager Agent run',prompt);
        renderThread(pmFocusedMarkup());
      }else{
        addAgentMessage(`<strong>Sprint planning result</strong>I recommend committing TSK-003, TSK-004 and the scoped portion of TSK-002. Keep TSK-001 out of committed sprint capacity until the vendor dependency clears. This protects the sprint goal while still allowing sandbox work as uncommitted progress.`);
        log('Planner Agent run',prompt);
        renderThread(plannerMarkup());
      }
      renderSettings();
    }

    function handlePmAction(action){
      const task=taskById(activeTaskId); if(!task)return;
      const p=projectFor(task)||{}, r=pmRecommendation(task); const ap=pmApprovals[task.id]||(pmApprovals[task.id]={member:false,owner:false,applied:false});
      if(action==='member'){
        ap.member=true; addAgentMessage(`<strong>Monday Update</strong>@${escapeHtml(task.person||'Assigned member')}, I checked the blocker and proposed recovery plan. The assigned member confirmed the approach and approved the task-level recommendation.`); log('Member approval recorded',`${task.id} · ${task.person||'Assigned member'}`);
      }else if(action==='owner'){
        if(!ap.member)return; ap.owner=true; addAgentMessage(`<strong>Owner approval</strong>@${escapeHtml(p.owner||'Project owner')} approved the recovery plan, including the proposed due date of ${escapeHtml(r.nextDate)}.`); log('Owner approval recorded',`${task.id} · ${p.owner||'Project owner'}`);
      }else if(action==='apply'){
        if(!(ap.member&&ap.owner)||ap.applied)return; task.deadline=r.nextDate; task.lastAutomation='Sep 7, 2026 14:18'; ap.applied=true; addAgentMessage(`<strong>Approved action applied</strong>Updated ${escapeHtml(task.id)} due date to ${escapeHtml(r.nextDate)}. In the production architecture this write is executed through n8n using the Monday API after approval.`); log('Approved Monday change applied',`${task.id} · Due date ${r.nextDate}`); if(typeof state!=='undefined'&&state.key==='tasks'&&typeof board==='function')board();
      }
      renderThread(pmFocusedMarkup()); renderSettings();
    }

    function handleSprintAction(action){
      const plan=sprintProposal();
      if(action==='review'){
        addAgentMessage(`<strong>Backlog assumptions checked</strong>TSK-003 has 14h remaining, TSK-004 has 2h remaining, and TSK-002 can be limited to a 10h navigation revision. TSK-001 remains blocked by an external vendor and is intentionally excluded from committed sprint scope.`); log('Sprint backlog reviewed','Capacity and blockers checked');
      }else if(action==='approve'){
        sprintState.approved=true; addAgentMessage(`<strong>Sprint owner approval</strong>The proposed Sprint 18 goal and committed scope are approved. The agent may now apply the Sprint value to the three selected Monday items.`); log('Sprint proposal approved',sprintState.sprint);
      }else if(action==='apply'){
        if(!sprintState.approved||sprintState.applied)return;
        if(typeof schemas!=='undefined'&&schemas.tasks&&!schemas.tasks.columns.some(c=>c[1]==='sprint')){
          const idx=schemas.tasks.columns.findIndex(c=>c[1]==='priority'); schemas.tasks.columns.splice(idx>=0?idx+1:10,0,['Sprint','sprint']);
        }
        plan.scope.forEach(x=>{const t=taskById(x.id);if(t){t.sprint='Sprint 18';t.lastAutomation='Sep 7, 2026 14:20';}});
        const blocked=taskById('TSK-001'); if(blocked) blocked.sprint='Backlog · blocked';
        sprintState.applied=true; addAgentMessage(`<strong>Approved sprint applied</strong>Sprint 18 was assigned to TSK-002, TSK-003 and TSK-004. TSK-001 remains in the backlog as blocked. The demo updates the board state; production would perform the approved write through n8n + Monday API.`); log('Sprint applied to Monday','TSK-002, TSK-003, TSK-004'); if(typeof state!=='undefined'&&state.key==='tasks'&&typeof board==='function')board();
      }
      renderThread(plannerMarkup()); renderSettings();
    }

    function openAgent(key='pm',taskId){
      if(taskId) activeTaskId=taskId;
      backdrop.classList.add('open');
      setAgent(key);
    }
    function closeAgent(){backdrop.classList.remove('open')}
    backdrop.querySelector('#p02NaClose').onclick=closeAgent;
    backdrop.addEventListener('click',e=>{if(e.target===backdrop)closeAgent()});
    backdrop.querySelector('#p02NaSwitch').onchange=e=>setAgent(e.target.value);
    input.addEventListener('input',()=>send.classList.toggle('ready',!!input.value.trim()));
    backdrop.querySelector('#p02NaForm').onsubmit=e=>{e.preventDefault();const text=input.value.trim();if(!text)return;input.value='';send.classList.remove('ready');runPrompt(text)};

    function refreshTaskAgentColumn(){
      if(typeof schemas==='undefined'||!schemas.tasks||typeof tasks==='undefined')return;
      if(!schemas.tasks.columns.some(c=>c[1]==='agentReview')){
        const idx=schemas.tasks.columns.findIndex(c=>c[1]==='notes'); schemas.tasks.columns.splice(idx>=0?idx:schemas.tasks.columns.length,0,['AI Agent','agentReview']);
      }
      tasks.forEach(t=>{t.agentReview=`<button type="button" class="p02-agent-open" data-p02-agent-task="${t.id}">Review</button>`});
    }
    refreshTaskAgentColumn();

    const screenEl=typeof screen!=='undefined'?screen:document.getElementById('screen');
    if(screenEl){
      screenEl.addEventListener('click',e=>{
        const btn=e.target.closest('[data-p02-agent-task]'); if(!btn)return; e.preventDefault();e.stopPropagation();openAgent('pm',btn.dataset.p02AgentTask);
      },true);
    }

    document.addEventListener('click',e=>{
      const el=e.target.closest('.p02-head-action,.native-rail-item');
      if(!el||!/Agents/i.test(el.textContent||el.getAttribute('aria-label')||''))return;
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openAgent('pm');
    },true);

    if(typeof state!=='undefined'&&state.key==='tasks'&&typeof board==='function')board();
  }

  function install(){
    const doc=deepestDoc();
    if(!doc||!doc.body||!doc.getElementById('screen'))return false;
    if(doc.getElementById('project02-native-agent-suite-runtime'))return true;
    const script=doc.createElement('script');
    script.id='project02-native-agent-suite-runtime';
    script.textContent='('+runtime.toString()+')();';
    doc.body.appendChild(script);
    return true;
  }

  function start(){
    let tries=0;
    const timer=setInterval(()=>{tries++;if(install()||tries>240)clearInterval(timer)},100);
  }
  outer.addEventListener('load',start);
  start();
})();
