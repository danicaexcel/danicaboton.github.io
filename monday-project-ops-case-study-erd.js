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

  // The current case study already contains the production eight-board map inline.
  // Do not replace it with this legacy ERD enhancement if all eight boards are present.
  const currentBoards = document.querySelectorAll('#architecture .p02-board');
  if (currentBoards.length >= 8) return;

  const mount = document.querySelector('#architecture .m09-map');
  if (!mount || mount.dataset.erdUpgraded === '2') return;
  mount.dataset.erdUpgraded = '2';

  const section = mount.closest('#architecture');
  const heading = section?.querySelector('.sectionhead h2');
  const intro = section?.querySelector('.sectionhead p');
  if (heading) heading.textContent = 'Eight connected boards with explicit data ownership.';
  if (intro) intro.textContent = 'Operational boards stay usable in Monday.com while evidence boards preserve time, approval, historical rate, approved cost, and audit history. Derived project and task totals can always be reconstructed from those sources.';

  const style = document.createElement('style');
  style.id = 'm09-case-erd-style-v2';
  style.textContent = `
    .m09-erd-shell{margin-top:28px}
    .m09-erd-canvas{position:relative;min-width:1120px;height:900px}
    .m09-erd-canvas .erd-entity{width:300px;z-index:2}
    .m09-erd-canvas .erd-lines{position:absolute;inset:0;width:1120px;height:900px;overflow:visible;z-index:1;pointer-events:none}
    .m09-erd-canvas .erd-edge{fill:none;stroke:#7f8a96;stroke-width:1.4;marker-end:url(#m09Arrow)}
    .m09-erd-canvas .erd-edge.sync{stroke:#f2b77e;stroke-dasharray:7 5}
    .m09-erd-canvas .erd-label{font:600 9px/1 "IBM Plex Mono",monospace;fill:#aeb6bf;letter-spacing:.02em}
    .m09-erd-canvas .erd-label.sync{fill:#f2b77e}
    .m09-erd-caption-note{display:block;margin-top:4px}
    @media(max-width:700px){.m09-erd-shell .erd-scroll{overflow:auto hidden}.m09-erd-canvas{min-width:1120px}}
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
      <div class="erd-legend"><span><i class="relation"></i>authoritative relation</span><span><i class="sync"></i>derived write-back / audit</span></div>
    </div>
    <div class="erd-scroll">
      <div class="erd-canvas m09-erd-canvas">
        <svg class="erd-lines" viewBox="0 0 1120 900" aria-hidden="true">
          <defs><marker id="m09Arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#7f8a96"/></marker></defs>
          <path class="erd-edge" d="M340 157 H390"/><text class="erd-label" x="350" y="145">project → task</text>
          <path class="erd-edge" d="M690 157 H740"/><text class="erd-label" x="700" y="145">time evidence</text>
          <path class="erd-edge" d="M540 266 V325"/><text class="erd-label" x="550" y="298">revision context</text>
          <path class="erd-edge" d="M890 266 V325"/><text class="erd-label" x="900" y="298">period approval</text>
          <path class="erd-edge" d="M890 535 V610 H690"/><text class="erd-label" x="760" y="595">approved hours</text>
          <path class="erd-edge" d="M890 820 H690"/><text class="erd-label" x="752" y="806">effective rate</text>
          <path class="erd-edge sync" d="M390 700 H350 V210 H340"/><text class="erd-label sync" x="210" y="690">ledger totals → project/task</text>
          <path class="erd-edge sync" d="M390 735 H340"/><text class="erd-label sync" x="242" y="724">material events → audit</text>
          <path class="erd-edge sync" d="M740 205 H715 V765 H340"/>
        </svg>
        ${entity(1, 40, 48, 'Master Projects', 'Operational parent', [
          ['PK','Project_ID'],['FK','Owner_User_ID'],['','Approved_Labor_Budget'],['','Derived_Hours / Cost'],['','Progress / Health']
        ])}
        ${entity(2, 390, 48, 'Master Tasks', 'Operational execution', [
          ['PK','Task_ID'],['FK','Project_ID'],['FK','Responsible_User_ID'],['','Timer / Review_State'],['','Derived_Effort']
        ])}
        ${entity(3, 740, 48, 'Work Sessions', 'Append-only time evidence', [
          ['PK','Session_ID'],['FK','Project_ID / Task_ID'],['FK','User_ID / Revision_ID'],['','ORIGINAL / REVISION'],['','Start / End / Duration']
        ])}
        ${entity(4, 390, 325, 'Revisions & Rework', 'Rework evidence', [
          ['PK','Revision_ID'],['FK','Project_ID / Task_ID'],['','Root_Cause'],['','Resolution_Evidence'],['','Approved_Rework_Hours']
        ])}
        ${entity(5, 740, 325, 'Timesheets & Approvals', 'Approval source', [
          ['PK','Timesheet_ID'],['FK','Worker / Period'],['','Recorded_Hours'],['','Approved_Hours'],['','Approval_Lock']
        ])}
        ${entity(6, 390, 610, 'Approved Work Ledger', 'Approved cost source', [
          ['PK','Ledger_Line_ID'],['FK','Timesheet / Worker'],['FK','Project / Task'],['FK','Rate_ID'],['','Approved_Hours × Applied_Rate']
        ])}
        ${entity(7, 740, 610, 'Labor Rates', 'Effective-dated rate source', [
          ['PK','Rate_ID'],['FK','User_ID'],['','Hourly_Rate / Currency'],['','Effective_From'],['','Effective_To']
        ])}
        ${entity(8, 40, 610, 'Activity & Automation Logs', 'Audit evidence', [
          ['PK','Event_ID'],['FK','Project / Task / Entity'],['','Previous / New_State'],['','Correlation / Idempotency'],['','Execution / Retry / Error']
        ])}
      </div>
    </div>
    <div class="erd-caption">
      <p>Projects and Tasks are the operating records. Closed Work Sessions prove actual time. Timesheets approve eligible time. Effective-dated Labor Rates are resolved when approved work is posted. Locked Approved Work Ledger lines freeze the approved hour/rate/cost allocation used by project and task reporting. Material actions and reconciliation outcomes write to the audit log.</p>
      <span class="m09-erd-caption-note">Conceptual data architecture · field names simplified for portfolio clarity</span>
    </div>`;

  stripPrefixes(document.body);
})();
