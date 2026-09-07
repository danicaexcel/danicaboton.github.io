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

  const svg = {
    workspace:'<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="3" width="5" height="5" rx="1"/><rect x="12" y="3" width="5" height="5" rx="1"/><rect x="3" y="12" width="5" height="5" rx="1"/><rect x="12" y="12" width="5" height="5" rx="1"/></svg>',
    sidekick:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.8l1.25 3.55L14.8 7.6l-3.55 1.25L10 12.4 8.75 8.85 5.2 7.6l3.55-1.25L10 2.8z"/><path d="M15.2 12.1l.7 1.95 1.9.7-1.9.7-.7 1.95-.7-1.95-1.9-.7 1.9-.7.7-1.95z"/></svg>',
    agents:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 14.8c1.15-1.1 1.8-2.45 1.8-3.85 0-1.85-.95-3.5-2.55-4.4M14 5.2c-1.15 1.1-1.8 2.45-1.8 3.85 0 1.85.95 3.5 2.55 4.4M5.25 6.55l-1.7-.55.2-1.7M14.75 13.45l1.7.55-.2 1.7"/></svg>',
    vibe:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.8l5.2 4.1-2 7.1L10 17.2 6.8 14l-2-7.1L10 2.8z"/><path d="M4.8 6.9h10.4M6.8 14h6.4"/></svg>',
    workflows:'<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="5" cy="5" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="10" cy="15" r="2"/><path d="M7 5h6M6.1 6.6l2.8 6.6M13.9 6.6l-2.8 6.6"/></svg>',
    notetaker:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 8v4M7 5.5v9M10 3.5v13M13 5.5v9M16 8v4"/></svg>',
    favorites:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.8l2.1 4.25 4.7.68-3.4 3.32.8 4.68L10 13.5l-4.2 2.23.8-4.68-3.4-3.32 4.7-.68L10 2.8z"/></svg>',
    docs:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 2.8h6.5L15 6.3v10.9H5z"/><path d="M11.5 2.8v3.5H15M7.5 10h5M7.5 13h5"/></svg>',
    more:'<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="4" cy="10" r="1.2" class="fill"/><circle cx="10" cy="10" r="1.2" class="fill"/><circle cx="16" cy="10" r="1.2" class="fill"/></svg>',
    credits:'<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="M10 6.2v7.6M6.2 10h7.6"/></svg>',
    bell:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5.2 13.4h9.6l-1.1-1.8V8.4a3.7 3.7 0 00-7.4 0v3.2l-1.1 1.8zM8.3 15.1a1.8 1.8 0 003.4 0"/></svg>',
    inbox:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.2 6.1h11.6l1.5 8.6H2.7z"/><path d="M3.3 11.2h4l1.2 1.7h3l1.2-1.7h4"/></svg>',
    invite:'<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="7.2" cy="6.6" r="2.7"/><path d="M2.8 15.3c.45-2.65 2.05-4.1 4.4-4.1 2.1 0 3.55 1.05 4.2 3M15 7.5v6M12 10.5h6"/></svg>',
    apps:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3.2a2.2 2.2 0 012.2 2.2v.45h.45a2.2 2.2 0 010 4.4h-.45v.45a2.2 2.2 0 01-4.4 0v-.45h-.45a2.2 2.2 0 010-4.4h.45V5.4A2.2 2.2 0 0110 3.2z"/></svg>',
    help:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.4 7.2A2.9 2.9 0 0110.2 5c1.8 0 3 1.05 3 2.55 0 1.25-.65 1.85-1.8 2.55-.9.55-1.35 1.05-1.35 2.05M10 15.3h.01"/></svg>',
    search:'<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.7" cy="8.7" r="4.8"/><path d="M12.3 12.3l4 4"/></svg>',
    diamond:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 4h10l2 4-7 8-7-8zM5 4l5 12 5-12M3 8h14"/></svg>',
    report:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 3.2h12v13.6H4z"/><path d="M7 12.8V9.5M10 12.8V6.8M13 12.8v-5M7 14.8h6"/></svg>',
    activity:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h3l1.4-4.2L10.1 14l1.8-5 1.2 1H17"/></svg>',
    clock:'<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="M10 6.2v4.1l2.8 1.8"/></svg>'
  };

  function ensureStyle(doc) {
    if (doc.getElementById('project02-shell-icon-dashboard-style')) return;
    const style = doc.createElement('style');
    style.id = 'project02-shell-icon-dashboard-style';
    style.textContent = `
      .native-rail-item .ri svg{width:18px;height:18px;display:block;fill:none;stroke:#4e5366;stroke-width:1.45;stroke-linecap:round;stroke-linejoin:round}.native-rail-item .ri svg .fill{fill:#4e5366;stroke:none}.native-rail-item.active .ri svg{stroke:#323338}.native-rail-item.active .ri svg .fill{fill:#323338}
      .native-top-icon svg{width:17px;height:17px;display:block;fill:none;stroke:#323338;stroke-width:1.45;stroke-linecap:round;stroke-linejoin:round}.native-top-icon svg .fill{fill:#323338;stroke:none}.native-top-icon[title="Apps"]{position:relative}.native-top-icon[title="Help"]{font:500 15px/1 Arial,sans-serif}.native-search-icon{display:grid!important;place-items:center!important;width:18px!important;height:18px!important}.native-search-icon svg{width:14px;height:14px;fill:none;stroke:#676879;stroke-width:1.5;stroke-linecap:round}.native-upgrade .diamond{display:inline-grid!important;place-items:center!important;width:17px;height:17px}.native-upgrade .diamond svg{width:17px;height:17px;fill:none;stroke:#0073ea;stroke-width:1.45;stroke-linecap:round;stroke-linejoin:round}
      .p02-agent-dashboard{grid-column:1/-1!important;border:1px solid #d0d4e4!important;border-radius:8px!important;background:#fff!important;box-shadow:none!important;overflow:hidden!important;padding:0!important;min-height:250px!important}.p02-ad-head{height:44px;display:flex;align-items:center;gap:10px;padding:0 14px 0 16px;border-bottom:1px solid #d0d4e4;background:#fff}.p02-ad-title{display:flex;align-items:center;gap:8px;min-width:0}.p02-ad-title svg{width:17px;height:17px;fill:none;stroke:#53576a;stroke-width:1.45;stroke-linecap:round;stroke-linejoin:round}.p02-ad-title strong{font-size:13px;font-weight:500;color:#323338}.p02-ad-title span{font-size:9px;color:#8a8f9e}.p02-ad-actions{margin-left:auto;display:flex;align-items:center;gap:6px}.p02-ad-btn{height:28px;border:1px solid #c3c7d5;border-radius:4px;background:#fff;color:#323338;padding:0 9px;font:500 9px/1 Arial,sans-serif;cursor:pointer}.p02-ad-btn:hover{background:#f2f7ff;border-color:#0073ea;color:#0060b9}.p02-ad-body{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(300px,.85fr);min-height:205px}.p02-ad-report{padding:14px 16px;border-right:1px solid #e4e7ed}.p02-ad-label{display:flex;align-items:center;gap:7px;margin-bottom:10px;color:#676879;font-size:9px;text-transform:uppercase;letter-spacing:.04em}.p02-ad-label svg{width:14px;height:14px;fill:none;stroke:#676879;stroke-width:1.45;stroke-linecap:round}.p02-ad-auto{display:inline-flex;align-items:center;gap:5px;margin-left:auto;color:#087f5b;font-size:8px;font-weight:700;text-transform:none;letter-spacing:0}.p02-ad-auto:before{content:"";width:6px;height:6px;border-radius:50%;background:#00c875}.p02-ad-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.p02-ad-kpi{border:1px solid #e6e9ef;background:#fafbfc;padding:8px}.p02-ad-kpi span{display:block;color:#8a8f9e;font-size:7px;text-transform:uppercase;letter-spacing:.04em}.p02-ad-kpi b{display:block;margin-top:4px;color:#323338;font-size:14px;font-weight:500}.p02-ad-attention{margin-top:10px}.p02-ad-attention strong{display:block;color:#323338;font-size:9px;margin-bottom:5px}.p02-ad-attention ul{margin:0;padding-left:17px;color:#53576a;font-size:9px;line-height:1.5}.p02-ad-attention li{margin:3px 0}.p02-ad-side{padding:14px}.p02-ad-job{display:grid;grid-template-columns:27px minmax(0,1fr) auto;gap:8px;align-items:start;padding:9px 0;border-bottom:1px solid #eef0f4}.p02-ad-job:last-child{border-bottom:0}.p02-ad-icon{width:27px;height:27px;border-radius:5px;background:#f6f7fb;display:grid;place-items:center}.p02-ad-icon svg{width:14px;height:14px;fill:none;stroke:#53576a;stroke-width:1.45;stroke-linecap:round;stroke-linejoin:round}.p02-ad-job b{display:block;color:#323338;font-size:9px}.p02-ad-job span{display:block;margin-top:3px;color:#8a8f9e;font-size:8px;line-height:1.35}.p02-ad-state{display:inline-flex!important;align-items:center;gap:4px!important;color:#087f5b!important;font-weight:700!important;white-space:nowrap}.p02-ad-state:before{content:"";width:6px;height:6px;border-radius:50%;background:#00c875}.p02-ad-activity{margin-top:10px;padding-top:9px;border-top:1px solid #eef0f4}.p02-ad-activity strong{display:block;margin-bottom:5px;color:#323338;font-size:9px}.p02-ad-activity p{margin:0;color:#676879;font-size:8px;line-height:1.45}
      @media(max-width:880px){.p02-ad-body{grid-template-columns:1fr}.p02-ad-report{border-right:0;border-bottom:1px solid #e4e7ed}.p02-ad-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:620px){.p02-ad-title span{display:none}.p02-ad-actions .p02-ad-btn:first-child{display:none}}
    `;
    doc.head.appendChild(style);
  }

  function patchRail(doc) {
    const map = {Workspace:'workspace',Sidekick:'sidekick',Agents:'agents',Vibe:'vibe',Workflows:'workflows',Notetaker:'notetaker',Favorites:'favorites','Docs hub':'docs',More:'more','AI credits':'credits'};
    doc.querySelectorAll('.native-rail-item').forEach(item => {
      const label = [...item.querySelectorAll('span')].map(x=>x.textContent.trim()).find(x=>map[x]);
      if (!label) return;
      const ri = item.querySelector('.ri');
      if (!ri || ri.dataset.p02Icon === map[label]) return;
      ri.dataset.p02Icon = map[label];
      ri.innerHTML = svg[map[label]];
    });
  }

  function patchTop(doc) {
    const iconMap = {Notifications:'bell',Inbox:'inbox',Invite:'invite',Apps:'apps'};
    Object.entries(iconMap).forEach(([title,key]) => {
      const el = doc.querySelector(`.native-top-icon[title="${title}"]`);
      if (!el || el.dataset.p02Icon === key) return;
      const count = el.querySelector('.count')?.outerHTML || '';
      const red = el.querySelector('.red-dot')?.outerHTML || '';
      el.dataset.p02Icon = key;
      el.innerHTML = `${svg[key]}${count}${red}`;
    });
    const help = doc.querySelector('.native-top-icon[title="Help"]');
    if (help) help.textContent = '?';
    const search = doc.querySelector('.native-search-icon');
    if (search && search.dataset.p02Icon !== 'search') { search.dataset.p02Icon='search'; search.innerHTML=svg.search; }
    const diamond = doc.querySelector('.native-upgrade .diamond');
    if (diamond && diamond.dataset.p02Icon !== 'diamond') { diamond.dataset.p02Icon='diamond'; diamond.innerHTML=svg.diamond; }
  }

  function snapshot(doc) {
    try {
      const win = doc.defaultView;
      const rows = Array.isArray(win.tasks) ? win.tasks : [];
      const projects = Array.isArray(win.projects) ? win.projects : [];
      const now = new Date('2026-09-07T08:00:00');
      const active = rows.filter(t=>!['Completed','Approved','Done','Cancelled'].includes(String(t.status||'')));
      const overdue = active.filter(t=>{ const d=new Date(t.deadline); return !Number.isNaN(d.getTime()) && d<now; });
      const stuck = active.filter(t=>/Stuck|Blocked/i.test(String(t.status||'')));
      const review = active.filter(t=>/For Review/i.test(String(t.reviewStatus||t.status||'')));
      const atRisk = projects.filter(p=>/At Risk|Critical/i.test(String(p.health||p.status||'')));
      return {active,overdue,stuck,review,atRisk};
    } catch (_) { return {active:[],overdue:[],stuck:[],review:[],atRisk:[]}; }
  }

  function openAgents(doc, reports=false) {
    const target=[...doc.querySelectorAll('.p02-head-action,.native-rail-item')].find(el=>/Agents/i.test(el.textContent||el.getAttribute('aria-label')||''));
    if (target) target.click();
    if (reports) setTimeout(()=>{
      const root=doc.getElementById('p02NativeAgents');
      const pm=root?.querySelector('#p02NaSwitch');
      if(pm && pm.value!=='pm'){pm.value='pm';pm.dispatchEvent(new Event('change',{bubbles:true}));}
      setTimeout(()=>root?.querySelector('[data-p02-report-open]')?.click(),50);
    },80);
  }

  function ensureAgentWidget(doc) {
    const grid = doc.querySelector('.dashboard .dash-grid');
    if (!grid) return false;
    let card = grid.querySelector('.p02-agent-dashboard');
    const s = snapshot(doc);
    const attention=[];
    const critical=s.stuck[0]||s.overdue[0];
    if(critical) attention.push(`${critical.id} · ${critical.item} — ${critical.status}${critical.deadline?` · due ${critical.deadline}`:''}`);
    const second=s.overdue.find(t=>!critical||t.id!==critical.id);
    if(second) attention.push(`${second.id} · ${second.item} — overdue follow-up required`);
    if(s.review[0]) attention.push(`${s.review[0].id} · ${s.review[0].item} — waiting for review / approval`);
    if(!attention.length) attention.push('No critical delivery exception requires attention right now.');
    const markup = `
      <div class="p02-ad-head"><div class="p02-ad-title">${svg.activity}<strong>AI Agent Activity & Reports</strong><span>Project Manager + Planner</span></div><div class="p02-ad-actions"><button type="button" class="p02-ad-btn" data-p02-dashboard-open-agents>Open Agents</button><button type="button" class="p02-ad-btn" data-p02-dashboard-open-reports>Scheduled reports</button></div></div>
      <div class="p02-ad-body"><div class="p02-ad-report"><div class="p02-ad-label">${svg.report}<span>Latest proactive report · Sep 7, 08:00</span><span class="p02-ad-auto">generated automatically</span></div><div class="p02-ad-kpis"><div class="p02-ad-kpi"><span>Active tasks</span><b>${s.active.length}</b></div><div class="p02-ad-kpi"><span>Overdue</span><b>${s.overdue.length}</b></div><div class="p02-ad-kpi"><span>Stuck / blocked</span><b>${s.stuck.length}</b></div><div class="p02-ad-kpi"><span>At-risk projects</span><b>${s.atRisk.length}</b></div></div><div class="p02-ad-attention"><strong>Needs attention</strong><ul>${attention.map(x=>`<li>${String(x).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</li>`).join('')}</ul></div></div><div class="p02-ad-side"><div class="p02-ad-job"><span class="p02-ad-icon">${svg.clock}</span><div><b>Daily attention report</b><span>Weekdays · 08:00 · overdue, blockers, review, risk</span></div><span class="p02-ad-state">Enabled</span></div><div class="p02-ad-job"><span class="p02-ad-icon">${svg.report}</span><div><b>Weekly project-health report</b><span>Friday · 16:00 · delivery health, carry-over, budget/risk</span></div><span class="p02-ad-state">Enabled</span></div><div class="p02-ad-activity"><strong>Recent agent activity</strong><p>Project Manager Agent: delivery scan completed · Planner Agent: Sprint 18 / proposal costing available · plan-changing actions remain approval-controlled.</p></div></div></div>`;
    if (!card) {
      card=doc.createElement('section');
      card.className='card p02-agent-dashboard';
      const workload=grid.querySelector('.native-team-workload');
      if(workload) grid.insertBefore(card,workload); else grid.appendChild(card);
    }
    if(card.dataset.p02Snapshot!==`${s.active.length}-${s.overdue.length}-${s.stuck.length}-${s.review.length}-${s.atRisk.length}`){
      card.dataset.p02Snapshot=`${s.active.length}-${s.overdue.length}-${s.stuck.length}-${s.review.length}-${s.atRisk.length}`;
      card.innerHTML=markup;
      card.querySelector('[data-p02-dashboard-open-agents]')?.addEventListener('click',()=>openAgents(doc,false));
      card.querySelector('[data-p02-dashboard-open-reports]')?.addEventListener('click',()=>openAgents(doc,true));
    }
    return true;
  }

  let applying=false;
  function apply() {
    if(applying) return false;
    const doc=deepestDoc(); if(!doc||!doc.body) return false;
    applying=true;
    try { ensureStyle(doc); patchRail(doc); patchTop(doc); ensureAgentWidget(doc); }
    finally { applying=false; }
    return true;
  }

  function start(){
    let tries=0;
    const timer=setInterval(()=>{tries++;apply();if(tries>180)clearInterval(timer)},100);
    const watcher=setInterval(()=>{
      const doc=deepestDoc(), screen=doc&&doc.getElementById('screen');
      if(screen&&!screen.dataset.p02ShellAgentObserved){
        screen.dataset.p02ShellAgentObserved='1';
        new MutationObserver(()=>requestAnimationFrame(apply)).observe(screen,{childList:true,subtree:true});
        clearInterval(watcher);
      }
    },150);
    setTimeout(()=>clearInterval(watcher),30000);
  }
  outer.addEventListener('load',start); start();
})();