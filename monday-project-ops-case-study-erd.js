(() => {
  if (!/monday-project-ops-case-study\.html$/.test(location.pathname)) return;

  const stripPrefixes = root => {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (node.nodeValue && node.nodeValue.includes('[N]')) {
        node.nodeValue = node.nodeValue.replace(/\[N\]\s*/g, '');
      }
    });
  };
  stripPrefixes(document.body);

  const mount = document.querySelector('#architecture .m09-map');
  if (!mount || mount.dataset.erdUpgraded === '1') return;
  mount.dataset.erdUpgraded = '1';

  const section = mount.closest('#architecture');
  const heading = section?.querySelector('.sectionhead h2');
  const intro = section?.querySelector('.sectionhead p');
  if (heading) heading.textContent = 'How the modules relate and synchronize.';
  if (intro) intro.textContent = 'This map separates operational records from the automation that validates, aggregates, and synchronizes them. It is a conceptual data architecture view, not a production schema export.';

  const style = document.createElement('style');
  style.id = 'm09-case-erd-style';
  style.textContent = `
    .m09-erd-shell{margin-top:28px}
    .m09-erd-canvas{position:relative;min-width:1080px;height:850px}
    .m09-erd-canvas .erd-entity{width:300px;z-index:2}
    .m09-erd-canvas .erd-lines{position:absolute;inset:0;width:1080px;height:850px;overflow:visible;z-index:1;pointer-events:none}
    .m09-erd-canvas .erd-edge{fill:none;stroke:#7f8a96;stroke-width:1.4;marker-end:url(#m09Arrow)}
    .m09-erd-canvas .erd-edge.sync{stroke:#f2b77e;stroke-dasharray:7 5}
    .m09-erd-canvas .erd-label{font:600 9px/1 "IBM Plex Mono",monospace;fill:#aeb6bf;letter-spacing:.02em}
    .m09-erd-canvas .erd-label.sync{fill:#f2b77e}
    .m09-erd-caption-note{display:block;margin-top:4px}
    @media(max-width:700px){.m09-erd-shell .erd-scroll{overflow:auto hidden}.m09-erd-canvas{min-width:1080px}}
  `;
  document.head.appendChild(style);

  const entity = (index, x, y, name, type, fields) => `
    <article class="erd-entity" style="left:${x}px;top:${y}px">
      <header><div><strong>${name}</strong><span>${type}</span></div><i>${String(index).padStart(2,'0')}</i></header>
      <div class="erd-fields">${fields.map(([key,value]) => `<div><b class="${key ? key.toLowerCase() : ''}">${key || '•'}</b><span>${value}</span></div>`).join('')}<div><b>•</b><span>… more fields</span></div></div>
    </article>`;

  mount.className = 'erd-shell m09-erd-shell';
  mount.innerHTML = `
    <div class="erd-toolbar">
      <div><span>System data map</span><strong>Monday.com Project Operations Control Center</strong></div>
      <div class="erd-legend"><span><i class="relation"></i>relation</span><span><i class="sync"></i>sync / automation</span></div>
    </div>
    <div class="erd-scroll">
      <div class="erd-canvas m09-erd-canvas">
        <svg class="erd-lines" viewBox="0 0 1080 850" aria-hidden="true">
          <defs><marker id="m09Arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#7f8a96"/></marker></defs>
          <path class="erd-edge" d="M340 157 H390"/>
          <text class="erd-label" x="350" y="145">contains</text>
          <path class="erd-edge" d="M690 157 H740"/>
          <text class="erd-label" x="700" y="145">work evidence</text>
          <path class="erd-edge" d="M540 266 V325"/>
          <text class="erd-label" x="550" y="298">revision loop</text>
          <path class="erd-edge" d="M890 266 V325"/>
          <text class="erd-label" x="900" y="298">aggregates</text>
          <path class="erd-edge" d="M890 590 V535"/>
          <text class="erd-label" x="900" y="570">rate lookup</text>
          <path class="erd-edge sync" d="M390 205 H365 V700 H340"/>
          <text class="erd-label sync" x="205" y="686">task state → audit</text>
          <path class="erd-edge sync" d="M740 205 H715 V735 H340"/>
          <text class="erd-label sync" x="520" y="722">session / approval events → audit</text>
        </svg>
        ${entity(1, 40, 48, 'Master Projects', 'Monday portfolio board', [
          ['PK','Project_ID'],['FK','Owner_User_ID'],['','Project_Status'],['','Start_Date / Due_Date'],['','Collaborators / Informed']
        ])}
        ${entity(2, 390, 48, 'Master Tasks', 'Monday execution board', [
          ['PK','Task_ID'],['FK','Project_ID'],['FK','Responsible_User_ID'],['','Task_Status / Priority'],['','Due_Date / Scheduled_Work']
        ])}
        ${entity(3, 740, 48, 'Work Sessions', 'Append-only time evidence', [
          ['PK','Session_ID'],['FK','Project_ID'],['FK','Task_ID'],['FK','User_ID'],['','Start / End / Duration']
        ])}
        ${entity(4, 390, 325, 'Revisions & Rework', 'Returned-work record', [
          ['PK','Revision_ID'],['FK','Project_ID'],['FK','Task_ID'],['','Assigned_To / Due_Date'],['','Rework_Hours / Rework_Cost']
        ])}
        ${entity(5, 740, 325, 'Timesheets & Approvals', 'Approval + cost record', [
          ['PK','Timesheet_ID'],['FK','User_ID'],['','Period_Start / Period_End'],['','Approved_Hours'],['','Gross_Labor_Cost']
        ])}
        ${entity(6, 740, 590, 'Labor Rates', 'Controlled rate reference', [
          ['PK','Rate_ID'],['FK','User_ID'],['','Role'],['','Hourly_Rate_USD'],['','Effective_From / To']
        ])}
        ${entity(7, 40, 590, 'Activity & Automation Logs', 'Operational audit trail', [
          ['PK','Log_ID'],['FK','Project_ID'],['FK','Task_ID'],['','Actor / Action'],['','Previous_State / New_State']
        ])}
      </div>
    </div>
    <div class="erd-caption">
      <p>Projects are the parent operational record. Every task carries a mandatory project foreign key, work sessions and revisions retain both project and task context, approved timesheets consume session evidence and controlled labor rates, and significant state changes write to the audit log.</p>
      <span class="m09-erd-caption-note">Conceptual data architecture · field names simplified for portfolio clarity</span>
    </div>`;
  stripPrefixes(document.body);
})();
