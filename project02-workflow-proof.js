(() => {
  if (!/monday-project-ops-case-study\.html$/.test(location.pathname)) return;

  const apply = () => {
    if (!document.body || document.documentElement.dataset.project02WorkflowProof === '1') return;
    document.documentElement.dataset.project02WorkflowProof = '1';

    const style = document.createElement('style');
    style.textContent = `
      .p02-workflow-proof{margin-top:26px;border:1px solid #46505a;background:#1d2227;padding:14px}
      .p02-workflow-proof__top{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;padding:8px 6px 16px}
      .p02-workflow-proof__eyebrow{display:block;color:#f5b36d;font:700 9px/1.3 "IBM Plex Mono",monospace;text-transform:uppercase;letter-spacing:.09em}
      .p02-workflow-proof h3{margin:7px 0 0;color:#fff;font-size:18px;letter-spacing:-.02em}
      .p02-workflow-proof__top p{margin:0;max-width:650px;color:#aeb6bf;font-size:11px;line-height:1.6}
      .p02-workflow-proof__image{display:block;width:100%;height:auto;border:1px solid #3c444c;background:#171717}
      .p02-workflow-proof__caption{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;margin-top:1px;background:#3c444c}
      .p02-workflow-proof__caption span{display:block;background:#22282e;padding:11px 12px;color:#aeb6bf;font-size:9px;line-height:1.45}
      .p02-workflow-proof__caption strong{display:block;margin-bottom:3px;color:#fff;font-size:10px}
      .p02-workflow-proof__actions{display:flex;justify-content:flex-end;margin-top:12px}
      .p02-workflow-proof__actions a{color:#f5b36d;font:700 9px/1.3 "IBM Plex Mono",monospace;text-transform:uppercase;letter-spacing:.06em;text-decoration:none}
      @media(max-width:820px){.p02-workflow-proof__top{display:block}.p02-workflow-proof__top p{margin-top:10px}.p02-workflow-proof__caption{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:520px){.p02-workflow-proof__caption{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);

    document.querySelectorAll('.casebar span').forEach(span => {
      if (span.textContent.trim() === 'Monday API') span.textContent = 'n8n Webhooks';
    });

    const implementationNote = document.querySelector('.implementation-note p');
    if (implementationNote) {
      implementationNote.textContent = 'The public reconstruction keeps the Monday.com-style operating interface, while the implemented n8n backend owns request routing, append-only work-session state, derived calculations, revision/rework controls, timesheet approval, locked cost posting, idempotency, audit evidence, and scheduled reconciliation. No live Monday.com account or Monday API connection is required for the portfolio demo.';
    }

    const statBoxes = [...document.querySelectorAll('.stats4 .statbox')];
    const workflowStat = statBoxes.find(box => /n8n workflow families/i.test(box.textContent));
    if (workflowStat) {
      const strong = workflowStat.querySelector('strong');
      const label = workflowStat.querySelector('span');
      if (strong) strong.textContent = '10';
      if (label) label.textContent = 'routed n8n business domains';
    }

    const workflowSection = document.getElementById('workflows');
    if (workflowSection) {
      const heading = workflowSection.querySelector('.sectionhead h2');
      const intro = workflowSection.querySelector('.sectionhead > p');
      if (heading) heading.textContent = 'One unified routed n8n workflow.';
      if (intro) intro.textContent = 'A single production webhook enters a true multi-output action router, sends each request through its business domain, and converges on one authoritative state and business-rules engine. Scheduled reconciliation enters the same audit domain but terminates in a non-HTTP audit summary.';

      const domains = [
        ['00 · System / State Control','Health, state read/reset, retry metadata, and controlled system operations.'],
        ['01 · Task Integrity & Project Sync','Task/project validation, one accountable owner, membership checks, and controlled source-field synchronization.'],
        ['02 · Work Session Lifecycle','Start, Pause, Resume, and Stop with one-active-session enforcement and append-only time evidence.'],
        ['03 · Effort Rollup Engine','Recompute ORIGINAL hours, REVISION hours, total recorded effort, and remaining planned effort.'],
        ['04 · Revision & Rework Control','Create and resolve revision evidence while keeping rework measurable separately from original execution.'],
        ['05 · Escalation & Overdue Engine','Create/clear escalations and evaluate overdue work dynamically from due date and terminal status.'],
        ['06 · Timesheet Builder & Submission','Build worker-period timesheets from CLOSED sessions and control submission/return/reject states.'],
        ['07–08 · Approval, Rate & Ledger','Approve timesheets, resolve effective-dated labor rates, and freeze locked Approved Work Ledger lines.'],
        ['09 · KPI & Dashboard Recalculation','Recompute approved hours/cost, rework cost, budget remaining, progress, overdue, escalation count, and health.'],
        ['10 · Reconciliation & Audit','Manual/API and scheduled integrity checks for active-session conflicts, links, ledger duplicates, rate issues, and safe repairs.']
      ];
      workflowSection.querySelectorAll('.p02-flow > div').forEach((card, index) => {
        if (!domains[index]) return;
        const b = card.querySelector('b');
        const span = card.querySelector('span');
        if (b) b.textContent = domains[index][0];
        if (span) span.textContent = domains[index][1];
      });

      if (!workflowSection.querySelector('.p02-workflow-proof')) {
        const proof = document.createElement('figure');
        proof.className = 'p02-workflow-proof';
        proof.innerHTML = `
          <div class="p02-workflow-proof__top">
            <div><span class="p02-workflow-proof__eyebrow">Implemented workflow</span><h3>Unified n8n Operations Control Center</h3></div>
            <p>Portfolio-safe architecture view of the deployed self-hosted n8n workflow: one webhook, one Switch action router, ten routed business domains, a shared state/business-rules engine, and a 15-minute reconciliation trigger with its own audit-summary terminal.</p>
          </div>
          <a href="assets/project02-n8n-unified-workflow.svg" target="_blank" rel="noopener" aria-label="Open Project 02 n8n workflow architecture image">
            <img class="p02-workflow-proof__image" src="assets/project02-n8n-unified-workflow.svg?v=20260904-unified2" alt="Project 02 unified n8n workflow with webhook action routing, business-domain branches, shared rules engine, and scheduled reconciliation">
          </a>
          <figcaption class="p02-workflow-proof__caption">
            <span><strong>Ingress</strong>One public Project 02 webhook normalizes requests before routing.</span>
            <span><strong>Routing</strong>A true Switch node sends each action to one business-domain path.</span>
            <span><strong>State + rules</strong>Domain paths converge on the authoritative calculation and state engine.</span>
            <span><strong>Reconciliation</strong>The 15-minute trigger enters the audit path and ends in a scheduled summary, not an HTTP response.</span>
          </figcaption>
          <div class="p02-workflow-proof__actions"><a href="assets/project02-n8n-unified-workflow.svg" target="_blank" rel="noopener">Open workflow architecture ↗</a></div>
        `;
        const flow = workflowSection.querySelector('.p02-flow');
        (flow || workflowSection.querySelector('.wrap')).after?.(proof);
        if (!proof.isConnected) workflowSection.querySelector('.wrap')?.appendChild(proof);
      }
    }

    const scope = [...document.querySelectorAll('.case-section')].find(section => /Scope boundary/i.test(section.textContent));
    if (scope) {
      const cols = scope.querySelectorAll('.casegrid > div');
      if (cols[0]) {
        const h = cols[0].querySelector('h3');
        const p = cols[0].querySelector('p');
        if (h) h.textContent = 'Monday-style operating interface';
        if (p) p.textContent = 'The public demo reconstructs projects, tasks, people, statuses, dates, views, Updates, files, dashboards, timeline/Gantt behavior, and operating controls with synthetic portfolio data. It is intentionally not connected to a live Monday.com tenant.';
      }
      if (cols[1]) {
        const h = cols[1].querySelector('h3');
        const p = cols[1].querySelector('p');
        if (h) h.textContent = 'Self-hosted n8n backend';
        if (p) p.textContent = 'The unified workflow handles action routing, one-active-session enforcement, append-only time evidence, idempotency, revisions, timesheets, effective-dated rate resolution, locked ledger posting, KPI recalculation, structured audit history, retries, and scheduled reconciliation.';
      }
    }

    const demoIntro = document.querySelector('#demo .sectionhead > p');
    if (demoIntro) demoIntro.textContent = 'The public demo reconstructs the Monday.com operating experience with synthetic data while the self-hosted n8n workflow provides the implemented automation/state architecture shown above.';
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, {once:true});
  else apply();
})();