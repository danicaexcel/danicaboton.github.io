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
    if (window.__project02PMAgentInstalled) return;
    window.__project02PMAgentInstalled = true;

    const DEMO_TODAY = new Date('2026-09-07T12:00:00');
    const approvals = {};
    const conversations = {};
    let activeTaskId = null;

    const style = document.createElement('style');
    style.id = 'project02-pm-agent-style';
    style.textContent = `
      .p02-agent-open{height:25px;border:1px solid #8b5cf6;border-radius:4px;background:#f4efff;color:#6f35a5;padding:0 9px;font:600 9px/1 Arial,sans-serif;cursor:pointer;white-space:nowrap}.p02-agent-open:hover{background:#ede4ff}
      .p02-agent-overlay{position:fixed;inset:0;z-index:9998;background:rgba(28,30,38,.38);display:none;align-items:stretch;justify-content:flex-end}.p02-agent-overlay.open{display:flex}
      .p02-agent-panel{width:min(540px,96vw);height:100%;background:#fff;border-left:1px solid #d0d4e4;box-shadow:-12px 0 36px rgba(50,51,56,.16);display:flex;flex-direction:column;color:#323338;font-family:Arial,sans-serif}
      .p02-agent-head{height:62px;display:flex;align-items:center;gap:11px;padding:0 16px;border-bottom:1px solid #d0d4e4;background:#fff}.p02-agent-mark{width:30px;height:30px;border-radius:8px;background:#7c3aed;color:#fff;display:grid;place-items:center;font-weight:700;font-size:13px}.p02-agent-head strong{display:block;font-size:14px}.p02-agent-head small{display:block;margin-top:2px;color:#676879;font-size:9px}.p02-agent-close{margin-left:auto;width:32px;height:32px;border:0;background:transparent;color:#676879;font-size:20px;cursor:pointer}
      .p02-agent-body{flex:1;overflow:auto;background:#f6f7fb;padding:14px}.p02-agent-mode{display:flex;align-items:center;gap:8px;padding:9px 11px;border:1px solid #d0d4e4;background:#fff;font-size:9px;color:#53576a}.p02-agent-mode i{width:7px;height:7px;border-radius:50%;background:#00c875}.p02-agent-mode b{color:#323338}.p02-agent-mode span:last-child{margin-left:auto;color:#6f35a5;font-weight:600}
      .p02-agent-taskbar{margin-top:10px;display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center}.p02-agent-taskbar select{height:34px;border:1px solid #c3c7d5;border-radius:4px;background:#fff;color:#323338;padding:0 9px;font-size:10px;min-width:0}.p02-agent-scan{height:34px;border:1px solid #0073ea;border-radius:4px;background:#0073ea;color:#fff;padding:0 12px;font-size:10px;font-weight:600;cursor:pointer}
      .p02-agent-card{margin-top:10px;border:1px solid #d0d4e4;background:#fff;border-radius:6px;overflow:hidden}.p02-agent-card-head{padding:11px 12px;border-bottom:1px solid #e7e9ef;display:flex;align-items:center;justify-content:space-between;gap:8px}.p02-agent-card-head strong{font-size:11px}.p02-agent-chip{display:inline-flex;align-items:center;padding:4px 7px;border-radius:3px;background:#fff1f3;color:#c43e55;font-size:8px;font-weight:700}.p02-agent-chip.ok{background:#eaf8f2;color:#087f5b}.p02-agent-chip.wait{background:#fff7e6;color:#8a5500}.p02-agent-section{padding:11px 12px}.p02-agent-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.p02-agent-kv{border:1px solid #e4e7ed;background:#fafbfc;padding:8px}.p02-agent-kv span{display:block;color:#8a8f9e;font-size:8px;text-transform:uppercase;letter-spacing:.04em}.p02-agent-kv b{display:block;margin-top:3px;font-size:10px;color:#323338;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .p02-agent-analysis{font-size:10px;line-height:1.55;color:#53576a}.p02-agent-analysis b{color:#323338}.p02-agent-plan{margin:8px 0 0;padding:0;list-style:none}.p02-agent-plan li{display:grid;grid-template-columns:18px 1fr;gap:7px;padding:6px 0;border-top:1px solid #eef0f4;font-size:9px;line-height:1.4}.p02-agent-plan i{width:16px;height:16px;border-radius:50%;background:#ede9fe;color:#6f35a5;display:grid;place-items:center;font-style:normal;font-size:8px;font-weight:700}
      .p02-agent-thread{display:grid;gap:7px}.p02-agent-msg{display:grid;grid-template-columns:26px 1fr;gap:7px;align-items:start}.p02-agent-avatar{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:#e6f4ff;color:#0060b9;font-size:8px;font-weight:700}.p02-agent-avatar.ai{background:#ede9fe;color:#6f35a5}.p02-agent-bubble{border:1px solid #e1e4eb;background:#fff;padding:8px 9px;font-size:9px;line-height:1.5;color:#53576a}.p02-agent-bubble b{display:block;color:#323338;margin-bottom:2px;font-size:9px}.p02-agent-bubble small{display:block;margin-top:4px;color:#8a8f9e;font-size:8px}
      .p02-agent-approvals{display:grid;grid-template-columns:1fr 1fr;gap:7px}.p02-agent-approval{border:1px solid #dfe3ea;background:#fafbfc;padding:9px}.p02-agent-approval span{display:block;color:#676879;font-size:8px}.p02-agent-approval b{display:block;margin-top:3px;font-size:9px}.p02-agent-approval em{display:inline-flex;margin-top:6px;padding:3px 6px;border-radius:3px;background:#fff7e6;color:#8a5500;font-size:8px;font-style:normal;font-weight:700}.p02-agent-approval.approved em{background:#eaf8f2;color:#087f5b}
      .p02-agent-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:9px}.p02-agent-btn{min-height:34px;border:1px solid #c3c7d5;border-radius:4px;background:#fff;color:#323338;padding:7px 9px;font-size:9px;font-weight:600;cursor:pointer}.p02-agent-btn:hover{background:#f2f7ff}.p02-agent-btn.primary{background:#0073ea;border-color:#0073ea;color:#fff}.p02-agent-btn.apply{grid-column:1/-1;background:#7c3aed;border-color:#7c3aed;color:#fff}.p02-agent-btn[disabled]{opacity:.45;cursor:not-allowed}
      .p02-agent-audit{margin-top:8px;padding:9px;border:1px solid #d8e4da;background:#f4fbf7;color:#3b5f4d;font:8px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap;display:none}.p02-agent-audit.show{display:block}
      .p02-agent-footer{padding:10px 14px;border-top:1px solid #d0d4e4;background:#fff;color:#676879;font-size:8px;line-height:1.5}.p02-agent-footer b{color:#323338}
      @media(max-width:620px){.p02-agent-panel{width:100vw}.p02-agent-grid,.p02-agent-approvals,.p02-agent-actions{grid-template-columns:1fr}.p02-agent-btn.apply{grid-column:auto}}
    `;
    document.head.appendChild(style);

    function projectFor(task) {
      return typeof projects !== 'undefined' ? projects.find(p => p.item === task.project || p.id === task.projectId) : null;
    }
    function initials(name='') { return name.split(/\s+/).filter(Boolean).map(x=>x[0]).slice(0,2).join('').toUpperCase() || 'AI'; }
    function parseDate(value) { const d = new Date(value); return Number.isNaN(d.getTime()) ? null : d; }
    function overdueDays(task) {
      const d=parseDate(task.deadline); if(!d) return 0;
      return Math.max(0, Math.floor((DEMO_TODAY-d)/86400000));
    }
    function suggestedDeadline(task) {
      const map={'TSK-001':'Sep 12, 2026','TSK-002':'Sep 11, 2026','TSK-003':'Sep 9, 2026','TSK-004':'Sep 10, 2026'};
      return map[task.id] || task.deadline;
    }
    function recommendation(task) {
      if (task.id === 'TSK-001') return {
        summary:'Critical payment integration is stuck on an external dependency. The agent should confirm the blocker before changing the plan.',
        alternative:'Continue sandbox validation with mock credentials while the vendor token issue is pending, then swap in production credentials after approval.',
        actions:[`Keep ${task.person} accountable for the task`,`Move due date to ${suggestedDeadline(task)}`,'Keep task marked Stuck until vendor dependency clears','Keep Mobile App v2 Launch marked At Risk']
      };
      if (task.id === 'TSK-002') return {
        summary:'The revision is overdue and has already consumed rework hours. The latest note says the client requested a navigation redesign.',
        alternative:'Freeze the approved page structure and limit this revision to navigation behavior, so completed layout work is not reopened.',
        actions:[`Ask ${task.person} to confirm remaining revision scope`,`Move due date to ${suggestedDeadline(task)}`,'Keep Revision state until review evidence is ready','Notify project owner before the date change']
      };
      if (task.id === 'TSK-003') return {
        summary:'Documentation is overdue but still moving. The better recovery is to split stable documentation from the dependency that is still changing.',
        alternative:'Publish completed authentication/integration documentation now and track payment API examples as a linked follow-up item.',
        actions:[`Ask ${task.person} for the current blocker`,`Move due date to ${suggestedDeadline(task)}`,'Keep task In Progress','Create a clear next-action update for the project owner']
      };
      return {
        summary:'The agent found a task that needs a project-management check before any automated change.',
        alternative:'Confirm the blocker, preserve the current assignee, and only change project dates or risk after approval.',
        actions:[`Ask ${task.person||'assigned member'} for status`,`Propose due date ${suggestedDeadline(task)}`,'Request project-owner approval','Apply only approved Monday changes']
      };
    }
    function memberReply(task) {
      if(task.id==='TSK-001') return 'Confirmed. The vendor token refresh is the blocker. I can continue sandbox checks with mock credentials while we wait.';
      if(task.id==='TSK-002') return 'Confirmed. The remaining work is the navigation revision only. Sep 11 is realistic if we keep the approved page layout unchanged.';
      if(task.id==='TSK-003') return 'Auth documentation is complete. I am waiting on the final payment API examples. I can publish the stable sections first.';
      return 'Confirmed. The proposed recovery plan is workable from my side.';
    }
    function ownerReply(task) {
      const p=projectFor(task);
      if(task.id==='TSK-002') return 'Approved. Keep the revision scope limited, move the date to Sep 11, and leave the project health unchanged unless another dependency appears.';
      if(task.id==='TSK-003') return 'Approved. Publish the stable documentation first and move the task due date to Sep 9.';
      if(task.id==='TSK-001') return 'Approved. Continue sandbox validation, keep the project At Risk, and move the task date while the vendor dependency is open.';
      return `Approved. Apply the proposed task-level changes and keep ${p?.item||'the project'} under review.`;
    }

    function ensureThread(task) {
      if(!conversations[task.id]) conversations[task.id]=[
        {who:'AI Project Manager',kind:'ai',text:`I checked the task, due date, project state, latest notes, and recent activity. ${recommendation(task).summary}`,time:'Agent check · Sep 7'},
        {who:task.person||'Assigned member',kind:'user',text:task.notes||'No new update has been posted yet.',time:`Latest Monday Update · ${task.last||'recent'}`}
      ];
      return conversations[task.id];
    }

    const overlay=document.createElement('div');
    overlay.className='p02-agent-overlay';
    overlay.id='p02ProjectManagerAgent';
    overlay.innerHTML=`<aside class="p02-agent-panel"><div class="p02-agent-head"><div class="p02-agent-mark">AI</div><div><strong>Project Manager Agent</strong><small>Monday context + n8n orchestration + approval controls</small></div><button class="p02-agent-close" type="button" aria-label="Close">×</button></div><div class="p02-agent-body" id="p02AgentBody"></div><div class="p02-agent-footer"><b>Authority boundary:</b> the agent may read, summarize, follow up, and recommend. Date/status/risk changes are applied only after the required assigned-member and project-owner approvals.</div></aside>`;
    document.body.appendChild(overlay);
    const body=overlay.querySelector('#p02AgentBody');

    function eligibleTasks(){
      return (typeof tasks==='undefined'?[]:tasks).filter(t=>!['Completed','Approved','Done'].includes(String(t.status||'')));
    }
    function pickDefault(){
      const list=eligibleTasks();
      return list.find(t=>t.id==='TSK-002') || list.find(t=>overdueDays(t)>0) || list[0] || null;
    }
    function approvalState(task){
      if(!approvals[task.id]) approvals[task.id]={member:false,owner:false,applied:false};
      return approvals[task.id];
    }

    function render(taskId=activeTaskId){
      const list=eligibleTasks();
      let task=list.find(t=>t.id===taskId) || pickDefault();
      if(!task){body.innerHTML='<div class="p02-agent-card"><div class="p02-agent-section">No active tasks available.</div></div>';return;}
      activeTaskId=task.id;
      const p=projectFor(task)||{};
      const days=overdueDays(task);
      const rec=recommendation(task);
      const ap=approvalState(task);
      const thread=ensureThread(task);
      body.innerHTML=`
        <div class="p02-agent-mode"><i></i><span><b>Monitoring mode</b> · reads Monday Updates and project/task state</span><span>Approval required to act</span></div>
        <div class="p02-agent-taskbar"><select id="p02AgentTaskSelect">${list.map(t=>`<option value="${t.id}" ${t.id===task.id?'selected':''}>${t.id} · ${t.item}</option>`).join('')}</select><button class="p02-agent-scan" id="p02AgentScan">Check task</button></div>
        <section class="p02-agent-card"><div class="p02-agent-card-head"><strong>${task.item}</strong><span class="p02-agent-chip ${days?'':'ok'}">${days?`${days}d overdue`:'within date'}</span></div><div class="p02-agent-section"><div class="p02-agent-grid"><div class="p02-agent-kv"><span>Assigned member</span><b>${task.person||'—'}</b></div><div class="p02-agent-kv"><span>Project owner</span><b>${p.owner||'—'}</b></div><div class="p02-agent-kv"><span>Current due date</span><b>${task.deadline||'—'}</b></div><div class="p02-agent-kv"><span>Progress / remaining</span><b>${task.progress||0}% · ${task.remaining??'—'}h</b></div></div></div></section>
        <section class="p02-agent-card"><div class="p02-agent-card-head"><strong>Agent analysis + recovery option</strong><span class="p02-agent-chip wait">suggest only</span></div><div class="p02-agent-section p02-agent-analysis"><b>${rec.summary}</b><br><br><span>Alternative solution: ${rec.alternative}</span><ul class="p02-agent-plan">${rec.actions.map((x,i)=>`<li><i>${i+1}</i><span>${x}</span></li>`).join('')}</ul></div></section>
        <section class="p02-agent-card"><div class="p02-agent-card-head"><strong>Monday Updates checked by agent</strong><span class="p02-agent-chip ok">context read</span></div><div class="p02-agent-section"><div class="p02-agent-thread">${thread.map(m=>`<div class="p02-agent-msg"><span class="p02-agent-avatar ${m.kind==='ai'?'ai':''}">${m.kind==='ai'?'AI':initials(m.who)}</span><div class="p02-agent-bubble"><b>${m.who}</b>${m.text}<small>${m.time}</small></div></div>`).join('')}</div></div></section>
        <section class="p02-agent-card"><div class="p02-agent-card-head"><strong>Approval gate</strong><span class="p02-agent-chip ${ap.member&&ap.owner?'ok':'wait'}">${ap.member&&ap.owner?'ready to apply':'waiting approval'}</span></div><div class="p02-agent-section"><div class="p02-agent-approvals"><div class="p02-agent-approval ${ap.member?'approved':''}"><span>Assigned member</span><b>${task.person||'—'}</b><em>${ap.member?'Approved':'Pending'}</em></div><div class="p02-agent-approval ${ap.owner?'approved':''}"><span>Project owner</span><b>${p.owner||'—'}</b><em>${ap.owner?'Approved':'Pending'}</em></div></div><div class="p02-agent-actions"><button class="p02-agent-btn" id="p02AskMember" ${ap.member?'disabled':''}>Ask assigned member</button><button class="p02-agent-btn" id="p02AskOwner" ${!ap.member||ap.owner?'disabled':''}>Request owner approval</button><button class="p02-agent-btn apply" id="p02ApplyAgent" ${!ap.member||!ap.owner||ap.applied?'disabled':''}>${ap.applied?'Approved actions applied':'Apply approved actions'}</button></div><pre class="p02-agent-audit ${ap.applied?'show':''}" id="p02AgentAudit">${ap.applied?`APPROVED CHANGE\nTask: ${task.id}\nDue date: ${task.deadline}\nStatus: ${task.status}\nApproved by: ${task.person} + ${p.owner}\nWrite path: Monday API via n8n\nAudit: PMA-${task.id}-20260907`:''}</pre></div></section>`;

      body.querySelector('#p02AgentTaskSelect').onchange=e=>{activeTaskId=e.target.value;render(activeTaskId)};
      body.querySelector('#p02AgentScan').onclick=()=>{
        thread.push({who:'AI Project Manager',kind:'ai',text:`Rechecked task state and Updates. ${rec.summary} Recommended next due date remains ${suggestedDeadline(task)}. No board change made.`,time:'Just now'});
        render(task.id);
      };
      body.querySelector('#p02AskMember').onclick=()=>{
        thread.push({who:'AI Project Manager',kind:'ai',text:`@${task.person}, I found this task needs a recovery decision. Can you confirm the blocker and whether the proposed plan and ${suggestedDeadline(task)} target are realistic?`,time:'Agent follow-up · just now'});
        thread.push({who:task.person||'Assigned member',kind:'user',text:memberReply(task),time:'Member response · just now'});
        ap.member=true; render(task.id);
      };
      body.querySelector('#p02AskOwner').onclick=()=>{
        thread.push({who:'AI Project Manager',kind:'ai',text:`@${p.owner||'Project owner'}, ${task.person} confirmed the recovery plan. Approval requested before I change the due date or project/task state.`,time:'Approval request · just now'});
        thread.push({who:p.owner||'Project owner',kind:'user',text:ownerReply(task),time:'Owner approval · just now'});
        ap.owner=true; render(task.id);
      };
      body.querySelector('#p02ApplyAgent').onclick=()=>{
        if(!(ap.member&&ap.owner)) return;
        const nextDate=suggestedDeadline(task);
        task.deadline=nextDate;
        task.lastAutomation='Sep 7, 2026 13:54';
        if(task.id==='TSK-003') task.status='In Progress';
        if(task.id==='TSK-001') task.status='Stuck';
        task.notes=`AI PM recovery plan approved by ${task.person} and ${p.owner}. ${rec.alternative}`;
        if(task.id==='TSK-001' && p) {p.health='At Risk';p.status='At Risk';}
        if(typeof logs!=='undefined') logs.unshift({group:'AI Project Manager',item:`PM Agent · ${task.id}`,id:`PMA-${task.id}-20260907`,time:'Sep 7, 2026 13:54',actor:'AI Project Manager',action:'Approved recovery plan applied',type:'Task',record:task.id,previous:'Pending approval',next:`Due ${nextDate}`,workflow:'Project Manager Agent',execution:'PMA-20260907',result:'Success',notes:`Approved by ${task.person} + ${p.owner}`});
        thread.push({who:'AI Project Manager',kind:'ai',text:`Approved actions applied. I updated the task due date to ${nextDate}, preserved the agreed task state, and wrote an audit event.`,time:'Action completed · just now'});
        ap.applied=true;
        if(typeof state!=='undefined'&&state.key==='tasks'&&typeof board==='function') board();
        render(task.id);
      };
    }

    function openAgent(taskId){
      activeTaskId=taskId||activeTaskId||pickDefault()?.id||null;
      render(activeTaskId);
      overlay.classList.add('open');
      const agentRail=[...document.querySelectorAll('.native-rail-item')].find(b=>/Agents/i.test(b.textContent));
      if(agentRail) agentRail.classList.add('active');
    }
    function closeAgent(){
      overlay.classList.remove('open');
      const agentRail=[...document.querySelectorAll('.native-rail-item')].find(b=>/Agents/i.test(b.textContent));
      if(agentRail) agentRail.classList.remove('active');
    }
    overlay.querySelector('.p02-agent-close').onclick=closeAgent;
    overlay.addEventListener('click',e=>{if(e.target===overlay)closeAgent()});

    function installTaskColumn(){
      if(typeof schemas==='undefined'||!schemas.tasks||typeof tasks==='undefined') return;
      const cols=schemas.tasks.columns;
      if(!cols.some(c=>c[1]==='pmAgent')){
        const statusIndex=cols.findIndex(c=>c[1]==='status');
        cols.splice(statusIndex>=0?statusIndex+1:6,0,['AI PM','pmAgent']);
      }
      tasks.forEach(t=>t.pmAgent=`<button type="button" class="p02-agent-open" data-p02-agent-task="${t.id}">Review</button>`);
      if(typeof state!=='undefined'&&state.key==='tasks'&&typeof board==='function') board();
    }

    if(typeof screen!=='undefined'&&!screen.dataset.p02PMAgentBound){
      screen.dataset.p02PMAgentBound='1';
      screen.addEventListener('click',e=>{
        const btn=e.target.closest('[data-p02-agent-task]');
        if(!btn)return;
        e.preventDefault();e.stopPropagation();openAgent(btn.dataset.p02AgentTask);
      });
    }

    function bindRail(){
      const rail=[...document.querySelectorAll('.native-rail-item')].find(b=>/Agents/i.test(b.textContent));
      if(!rail||rail.dataset.p02PMAgentBound)return false;
      rail.dataset.p02PMAgentBound='1';
      rail.style.cursor='pointer';
      rail.title='Open AI Project Manager Agent';
      rail.addEventListener('click',e=>{e.preventDefault();openAgent()});
      return true;
    }

    installTaskColumn();
    bindRail();
    setTimeout(bindRail,250);
    setTimeout(bindRail,900);
  }

  function install() {
    const doc = deepestDoc();
    if (!doc || !doc.body || !doc.getElementById('screen')) return false;
    if (doc.getElementById('project02-pm-agent-runtime')) return true;
    const script = doc.createElement('script');
    script.id = 'project02-pm-agent-runtime';
    script.textContent = `(${runtime.toString()})();`;
    doc.body.appendChild(script);
    return true;
  }

  function start() {
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (install() || tries > 220) clearInterval(timer);
    }, 100);
  }

  outer.addEventListener('load', start);
  start();
})();
