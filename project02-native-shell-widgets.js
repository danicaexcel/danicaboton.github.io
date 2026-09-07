(() => {
  const outer=document.getElementById('native');
  if(!outer)return;

  function deepestDoc(){
    try{
      let doc=outer.contentDocument;if(!doc)return null;
      for(let i=0;i<18;i++){
        const frame=doc.querySelector('iframe');
        if(!frame||!frame.contentDocument)break;
        doc=frame.contentDocument;
      }
      return doc;
    }catch(_){return null}
  }

  const icons={
    workspace:'<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="3" width="5" height="5" rx="1"/><rect x="12" y="3" width="5" height="5" rx="1"/><rect x="3" y="12" width="5" height="5" rx="1"/><rect x="12" y="12" width="5" height="5" rx="1"/></svg>',
    sidekick:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.8l1.2 3.4 3.4 1.2-3.4 1.2-1.2 3.4-1.2-3.4-3.4-1.2 3.4-1.2L10 2.8z"/><path d="M15.2 12.2l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7.7-1.9z"/></svg>',
    agents:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8.2 5.1 5.1 8.2a3 3 0 0 0 4.2 4.2l2.2-2.2"/><path d="m11.8 14.9 3.1-3.1a3 3 0 0 0-4.2-4.2L8.5 9.8"/></svg>',
    vibe:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.8l5.2 4.1-2 7.1L10 17.2 6.8 14l-2-7.1L10 2.8z"/><path d="M4.8 6.9h10.4M6.8 14h6.4"/></svg>',
    workflows:'<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="5" cy="5" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="10" cy="15" r="2"/><path d="M7 5h6M6.1 6.6l2.8 6.6M13.9 6.6l-2.8 6.6"/></svg>',
    notetaker:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 8v4M7 5.5v9M10 3.5v13M13 5.5v9M16 8v4"/></svg>',
    favorites:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.8l2.1 4.25 4.7.68-3.4 3.32.8 4.68L10 13.5l-4.2 2.23.8-4.68-3.4-3.32 4.7-.68L10 2.8z"/></svg>',
    docs:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 2.8h6.5L15 6.3v10.9H5z"/><path d="M11.5 2.8v3.5H15M7.5 10h5M7.5 13h5"/></svg>',
    more:'<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="4" cy="10" r="1.2" class="fill"/><circle cx="10" cy="10" r="1.2" class="fill"/><circle cx="16" cy="10" r="1.2" class="fill"/></svg>',
    credits:'<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="M10 6.2v7.6M6.2 10h7.6"/></svg>',
    bell:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5.2 13.4h9.6l-1.1-1.8V8.4a3.7 3.7 0 0 0-7.4 0v3.2l-1.1 1.8zM8.3 15.1a1.8 1.8 0 0 0 3.4 0"/></svg>',
    inbox:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.2 6.1h11.6l1.5 8.6H2.7z"/><path d="M3.3 11.2h4l1.2 1.7h3l1.2-1.7h4"/></svg>',
    invite:'<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="7.2" cy="6.6" r="2.7"/><path d="M2.8 15.3c.45-2.65 2.05-4.1 4.4-4.1 2.1 0 3.55 1.05 4.2 3M15 7.5v6M12 10.5h6"/></svg>',
    apps:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3.2a2.2 2.2 0 0 1 2.2 2.2v.45h.45a2.2 2.2 0 0 1 0 4.4h-.45v.45a2.2 2.2 0 0 1-4.4 0v-.45h-.45a2.2 2.2 0 0 1 0-4.4h.45V5.4A2.2 2.2 0 0 1 10 3.2z"/></svg>',
    help:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.4 7.2A2.9 2.9 0 0 1 10.2 5c1.8 0 3 1.05 3 2.55 0 1.25-.65 1.85-1.8 2.55-.9.55-1.35 1.05-1.35 2.05M10 15.3h.01"/></svg>',
    search:'<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.7" cy="8.7" r="4.8"/><path d="M12.3 12.3l4 4"/></svg>',
    diamond:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 4h10l2 4-7 8-7-8zM5 4l5 12 5-12M3 8h14"/></svg>'
  };

  function ensureStyle(doc){
    if(doc.getElementById('project02-native-shell-widget-style'))return;
    const style=doc.createElement('style');
    style.id='project02-native-shell-widget-style';
    style.textContent=`
      .native-rail-item .ri svg{width:18px;height:18px;display:block;fill:none;stroke:#4e5366;stroke-width:1.45;stroke-linecap:round;stroke-linejoin:round}.native-rail-item .ri svg .fill{fill:#4e5366;stroke:none}.native-rail-item.active .ri svg{stroke:#323338}.native-rail-item.active .ri svg .fill{fill:#323338}.native-rail-item:has(.ri[data-p02-icon="agents"]).active{background:#cce5ff!important}
      .native-top-icon svg{width:17px;height:17px;display:block;fill:none;stroke:#323338;stroke-width:1.45;stroke-linecap:round;stroke-linejoin:round}.native-search-icon{display:grid!important;place-items:center!important;width:18px!important;height:18px!important}.native-search-icon svg{width:14px;height:14px;fill:none;stroke:#676879;stroke-width:1.5;stroke-linecap:round}.native-upgrade .diamond{display:inline-grid!important;place-items:center!important;width:17px;height:17px}.native-upgrade .diamond svg{width:17px;height:17px;fill:none;stroke:#0073ea;stroke-width:1.45;stroke-linecap:round;stroke-linejoin:round}
      .p02-native-agent-table{grid-column:1/-1!important;border:1px solid #d0d4e4!important;border-radius:8px!important;background:#fff!important;box-shadow:none!important;overflow:hidden!important;padding:0!important}.p02-native-agent-table .monday-dw-head{height:40px;display:flex;align-items:center;justify-content:space-between;padding:0 12px 0 16px;border-bottom:1px solid #d0d4e4;background:#fff;color:#323338;font-size:13px;font-weight:500}.p02-native-agent-table .monday-dw-tools{display:flex;align-items:center;gap:14px;color:#676879;font-size:14px}.p02-native-agent-table .mini-table{width:100%;border-collapse:collapse;background:#fff}.p02-native-agent-table .mini-table th{background:#f8f9fb!important;color:#676879!important;font-weight:500;text-align:left}.p02-native-agent-table .mini-table th,.p02-native-agent-table .mini-table td{border-bottom:1px solid #e6e9f0!important;padding:10px 12px!important;font-size:10px!important;vertical-align:top}.p02-native-agent-table .mini-table td{color:#53576a}.p02-native-agent-table .mini-table td:first-child{color:#323338;font-weight:500}.p02-native-agent-table .p02-native-status{display:inline-flex;align-items:center;padding:3px 7px;border-radius:3px;font-size:8px;font-weight:600}.p02-native-agent-table .p02-native-status.done{background:#00c875;color:#fff}.p02-native-agent-table .p02-native-status.review{background:#fdab3d;color:#fff}.p02-native-agent-table .p02-native-status.draft{background:#579bfc;color:#fff}.p02-native-agent-table .p02-native-table-note{padding:8px 12px;color:#8a8f9e;font-size:8px;background:#fff}
      @media(max-width:780px){.p02-native-agent-table{overflow:auto!important}.p02-native-agent-table .mini-table{min-width:780px}}
    `;
    doc.head.appendChild(style);
  }

  function patchRail(doc){
    const map={Workspace:'workspace',Sidekick:'sidekick',Agents:'agents',Vibe:'vibe',Workflows:'workflows',Notetaker:'notetaker',Favorites:'favorites','Docs hub':'docs',More:'more','AI credits':'credits'};
    doc.querySelectorAll('.native-rail-item').forEach(item=>{
      const label=[...item.querySelectorAll('span')].map(x=>x.textContent.trim()).find(x=>map[x]);
      if(!label)return;
      const ri=item.querySelector('.ri');if(!ri)return;
      ri.dataset.p02Icon=map[label];ri.innerHTML=icons[map[label]];
    });
  }

  function patchTop(doc){
    const iconMap={Notifications:'bell',Inbox:'inbox',Invite:'invite',Apps:'apps',Help:'help'};
    Object.entries(iconMap).forEach(([title,key])=>{
      const el=doc.querySelector(`.native-top-icon[title="${title}"]`);if(!el)return;
      const count=el.querySelector('.count')?.outerHTML||'';
      const red=el.querySelector('.red-dot')?.outerHTML||'';
      el.innerHTML=icons[key]+count+red;
    });
    const search=doc.querySelector('.native-search-icon');if(search)search.innerHTML=icons.search;
    const diamond=doc.querySelector('.native-upgrade .diamond');if(diamond)diamond.innerHTML=icons.diamond;
  }

  function removeCustomAgentPanel(doc){
    doc.querySelectorAll('.p02-agent-dashboard').forEach(el=>el.remove());
  }

  function addNativeAgentTable(doc){
    const grid=doc.querySelector('.dashboard .dash-grid');if(!grid)return false;
    removeCustomAgentPanel(doc);
    if(grid.querySelector('.p02-native-agent-table'))return true;
    const widget=doc.createElement('section');
    widget.className='card p02-native-agent-table';
    widget.innerHTML=`
      <div class="monday-dw-head"><span>Agent Reports</span><div class="monday-dw-tools"><span title="Filter">▽</span><span title="More">...</span></div></div>
      <table class="mini-table" aria-label="Agent Reports table widget">
        <thead><tr><th>Report / plan</th><th>Agent</th><th>Run / schedule</th><th>Status</th><th>Summary</th></tr></thead>
        <tbody>
          <tr><td>Daily attention report</td><td>Project Manager Agent</td><td>Weekdays · 08:00</td><td><span class="p02-native-status done">Completed</span></td><td>Overdue work, blockers, reviews and project-risk items requiring attention.</td></tr>
          <tr><td>Weekly project-health report</td><td>Project Manager Agent</td><td>Friday · 16:00</td><td><span class="p02-native-status done">Completed</span></td><td>Delivery health, carry-over work, budget/risk signals and unresolved escalations.</td></tr>
          <tr><td>Sprint 18 proposal</td><td>Planner Agent</td><td>Sep 7 · planning run</td><td><span class="p02-native-status review">Review</span></td><td>26 h proposed commitment from 72 h available capacity; blocked vendor work deferred.</td></tr>
          <tr><td>Client proposal v1</td><td>Planner Agent</td><td>Sep 7 · costing run</td><td><span class="p02-native-status draft">Draft</span></td><td>Costed project plan generated from client scope, budget, timeline, roles and labor-rate inputs.</td></tr>
        </tbody>
      </table>
      <div class="p02-native-table-note">Native dashboard pattern: Table widget connected to an Agent Reports board. Detailed agent run history remains in Agents → Activity.</div>`;
    grid.appendChild(widget);
    return true;
  }

  function apply(){
    const doc=deepestDoc();if(!doc||!doc.body)return false;
    ensureStyle(doc);patchRail(doc);patchTop(doc);removeCustomAgentPanel(doc);addNativeAgentTable(doc);
    return true;
  }

  function start(){
    let tries=0;const timer=setInterval(()=>{tries++;apply();if(tries>180)clearInterval(timer)},100);
  }
  outer.addEventListener('load',start);
  document.addEventListener('click',()=>setTimeout(apply,60),true);
  start();
})();