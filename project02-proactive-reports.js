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
    if (window.__project02ProactiveReportsInstalled) return;
    window.__project02ProactiveReportsInstalled = true;

    const REPORT_DATE = new Date('2026-09-07T08:00:00');
    const reportHistory = [
      {id:'daily-20260907', kind:'daily', label:'Scheduled job · Sep 7, 08:00', automatic:true}
    ];

    const style = document.createElement('style');
    style.id = 'project02-proactive-report-style';
    style.textContent = `
      .p02-report-chip{border-color:#0073ea!important;color:#0060b9!important;background:#f4f9ff!important}
      .p02-report-card{border:1px solid #d7dce5;background:#fff;border-radius:8px;overflow:hidden}
      .p02-report-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:10px 12px;border-bottom:1px solid #edf0f4;background:#fafbfc}
      .p02-report-head strong{display:block;color:#323338;font-size:10px}.p02-report-head small{display:block;margin-top:3px;color:#8a8f9e;font-size:8px}.p02-report-auto{display:inline-flex;align-items:center;gap:5px;padding:4px 7px;border-radius:4px;background:#eaf8f2;color:#087f5b;font-size:8px;font-weight:700;white-space:nowrap}.p02-report-auto i{width:6px;height:6px;border-radius:50%;background:#00c875}
      .p02-report-body{padding:10px 12px;color:#53576a;font-size:9px;line-height:1.55}.p02-report-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-bottom:8px}.p02-report-kpi{border:1px solid #e6e9ef;background:#fafbfc;padding:7px}.p02-report-kpi span{display:block;color:#8a8f9e;font-size:7px;text-transform:uppercase;letter-spacing:.04em}.p02-report-kpi b{display:block;margin-top:3px;color:#323338;font-size:11px}.p02-report-list{margin:0;padding-left:16px}.p02-report-list li{margin:4px 0}.p02-report-note{margin-top:8px;padding-top:7px;border-top:1px solid #eef0f4;color:#676879;font-size:8px}
      .p02-report-settings{margin-top:12px;border:1px solid #d7dbe3;border-radius:6px;background:#fff;overflow:hidden}.p02-report-settings-head{padding:9px 10px;border-bottom:1px solid #eef0f4;background:#fafbfc}.p02-report-settings-head strong{display:block;color:#323338;font-size:9px}.p02-report-settings-head span{display:block;margin-top:2px;color:#8a8f9e;font-size:8px}.p02-report-job{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:9px 10px;border-bottom:1px solid #eef0f4}.p02-report-job:last-of-type{border-bottom:0}.p02-report-job b{display:block;color:#323338;font-size:9px}.p02-report-job span{display:block;margin-top:2px;color:#676879;font-size:8px;line-height:1.4}.p02-report-enabled{align-self:start;display:inline-flex;align-items:center;gap:4px;color:#087f5b!important;font-weight:700}.p02-report-enabled:before{content:'';width:6px;height:6px;border-radius:50%;background:#00c875}.p02-report-actions{display:flex;gap:6px;padding:8px 10px;border-top:1px solid #eef0f4}.p02-report-run{height:28px;border:1px solid #c3c7d5;border-radius:4px;background:#fff;color:#323338;padding:0 8px;font-size:8px;font-weight:600;cursor:pointer}.p02-report-run:hover{background:#f2f7ff;border-color:#0073ea;color:#0060b9}
      @media(max-width:620px){.p02-report-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.p02-report-job{grid-template-columns:1fr}.p02-report-actions{flex-wrap:wrap}}
    `;
    document.head.appendChild(style);

    function allTasks(){ return typeof tasks === 'undefined' ? [] : tasks; }
    function allProjects(){ return typeof projects === 'undefined' ? [] : projects; }
    function parseDate(value){ const d=new Date(value); return Number.isNaN(d.getTime())?null:d; }
    function isOverdue(task){
      const due=parseDate(task.deadline);
      return !!due && due < REPORT_DATE && !['Completed','Approved','Done','Cancelled'].includes(String(task.status||''));
    }
    function snapshot(){
      const taskRows=allTasks();
      const projectRows=allProjects();
      const active=taskRows.filter(t=>!['Completed','Approved','Done','Cancelled'].includes(String(t.status||'')));
      const overdue=active.filter(isOverdue);
      const stuck=active.filter(t=>/Stuck|Blocked/i.test(String(t.status||'')));
      const review=active.filter(t=>/For Review/i.test(String(t.status||t.reviewStatus||'')));
      const atRisk=projectRows.filter(p=>/At Risk|Critical/i.test(String(p.health||p.status||'')));
      const negativeVariance=projectRows.filter(p=>Number(p.variance||p.remainingBudget||0)<0);
      return {active,overdue,stuck,review,atRisk,negativeVariance};
    }
    function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
    function reportCard(entry){
      const s=snapshot();
      const weekly=entry.kind==='weekly';
      const title=weekly?'Weekly project-health report':'Daily attention report';
      const priorities=[];
      const critical=s.stuck[0]||s.overdue[0];
      if(critical) priorities.push(`${critical.id} · ${critical.item} — ${critical.status}${critical.deadline?` · due ${critical.deadline}`:''}`);
      const overdueSecond=s.overdue.find(t=>!critical||t.id!==critical.id);
      if(overdueSecond) priorities.push(`${overdueSecond.id} · ${overdueSecond.item} — overdue follow-up required`);
      if(s.review[0]) priorities.push(`${s.review[0].id} · ${s.review[0].item} — waiting for review/approval`);
      if(!priorities.length) priorities.push('No critical delivery exception requires action right now.');
      if(weekly && s.atRisk[0]) priorities.push(`${s.atRisk[0].id||''} ${s.atRisk[0].item||''} — portfolio health remains At Risk.`.trim());
      return `<div class="p02-report-card" data-p02-report-id="${esc(entry.id)}"><div class="p02-report-head"><div><strong>${title}</strong><small>${esc(entry.label)} · generated without a user prompt</small></div><span class="p02-report-auto"><i></i>${entry.automatic?'automatic':'test run'}</span></div><div class="p02-report-body"><div class="p02-report-kpis"><div class="p02-report-kpi"><span>Active tasks</span><b>${s.active.length}</b></div><div class="p02-report-kpi"><span>Overdue</span><b>${s.overdue.length}</b></div><div class="p02-report-kpi"><span>Stuck / blocked</span><b>${s.stuck.length}</b></div><div class="p02-report-kpi"><span>At-risk projects</span><b>${s.atRisk.length}</b></div></div><strong>Needs attention</strong><ul class="p02-report-list">${priorities.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><div class="p02-report-note">Delivery: Monday Updates / Project Operations. If this report also needs Gmail, Slack, Teams, Zoho, an external PDF archive, or cross-system data, route that delivery through n8n.</div></div></div>`;
    }

    function activeAgentIsPm(root){
      const select=root.querySelector('#p02NaSwitch');
      return !select || select.value==='pm';
    }
    function renderReports(root){
      if(!activeAgentIsPm(root)) return;
      const msgs=root.querySelector('.p02-na-msgs');
      if(!msgs) return;
      reportHistory.forEach(entry=>{
        if(msgs.querySelector(`[data-p02-report-id="${entry.id}"]`)) return;
        const row=document.createElement('div');
        row.className='p02-na-msg';
        row.innerHTML=`<span class="p02-na-msg-avatar" style="background:#f65f7c">PM</span><div class="p02-na-bubble"><strong>Project Manager Agent</strong>${reportCard(entry)}</div>`;
        msgs.prepend(row);
      });
    }
    function addReportChip(root){
      if(!activeAgentIsPm(root)) return;
      const chips=root.querySelector('.p02-na-chips');
      if(!chips||chips.querySelector('[data-p02-report-open]'))return;
      const b=document.createElement('button');
      b.type='button';b.className='p02-na-chip p02-report-chip';b.dataset.p02ReportOpen='1';b.textContent='↳ Scheduled reports';
      chips.appendChild(b);
    }
    function addReportSettings(root){
      if(!activeAgentIsPm(root)) return;
      const settings=root.querySelector('#p02NaSettings');
      if(!settings||settings.querySelector('.p02-report-settings'))return;
      const visibleText=settings.textContent||'';
      if(!/Agent triggers|Identity|Knowledge and access/i.test(visibleText))return;
      const section=document.createElement('div');
      section.className='p02-report-settings';
      section.innerHTML=`<div class="p02-report-settings-head"><strong>Proactive scheduled reports</strong><span>Runs even when nobody asks the agent a question.</span></div><div class="p02-report-job"><div><b>Daily attention report</b><span>Every weekday · 08:00 · overdue, blockers, reviews, risk</span></div><span class="p02-report-enabled">Enabled</span></div><div class="p02-report-job"><div><b>Weekly project-health report</b><span>Friday · 16:00 · delivery health, carry-over, budget/risk signals</span></div><span class="p02-report-enabled">Enabled</span></div><div class="p02-report-actions"><button type="button" class="p02-report-run" data-p02-run-report="daily">Run daily now</button><button type="button" class="p02-report-run" data-p02-run-report="weekly">Run weekly now</button></div>`;
      settings.appendChild(section);
    }
    function enhance(){
      const root=document.getElementById('p02NativeAgents');
      if(!root)return false;
      addReportChip(root);addReportSettings(root);renderReports(root);
      return true;
    }
    function runReport(kind){
      const id=`${kind}-${Date.now()}`;
      reportHistory.unshift({id,kind,label:'Manual test · just now',automatic:false});
      reportHistory.splice(4);
      enhance();
      const root=document.getElementById('p02NativeAgents');
      const thread=root?.querySelector('#p02NaThread');if(thread)thread.scrollTop=0;
    }

    document.addEventListener('click',event=>{
      const reportBtn=event.target.closest('[data-p02-run-report]');
      if(reportBtn){event.preventDefault();event.stopPropagation();runReport(reportBtn.dataset.p02RunReport);return;}
      const open=event.target.closest('[data-p02-report-open]');
      if(open){event.preventDefault();event.stopPropagation();enhance();const card=document.querySelector('[data-p02-report-id]');card?.scrollIntoView({block:'center',behavior:'smooth'});return;}
      if(event.target.closest('.p02-head-action,.native-rail-item,#p02NaSwitch,[data-p02-settings-tab],[data-p02-prompt]')) setTimeout(enhance,0);
    },true);
    document.addEventListener('change',event=>{if(event.target.id==='p02NaSwitch')setTimeout(enhance,0)},true);

    let tries=0;
    const timer=setInterval(()=>{tries++;if(enhance()||tries>240)clearInterval(timer)},100);
  }

  function install(){
    const doc=deepestDoc();
    if(!doc||!doc.body||!doc.getElementById('screen'))return false;
    if(doc.getElementById('project02-proactive-report-runtime'))return true;
    const script=doc.createElement('script');
    script.id='project02-proactive-report-runtime';
    script.textContent='('+runtime.toString()+')();';
    doc.body.appendChild(script);
    return true;
  }

  function start(){let tries=0;const timer=setInterval(()=>{tries++;if(install()||tries>240)clearInterval(timer)},100)}
  outer.addEventListener('load',start);start();
})();
