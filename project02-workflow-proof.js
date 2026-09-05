(() => {
  if (!/monday-project-ops-case-study\.html$/.test(location.pathname)) return;

  const apply = () => {
    if (!document.body || document.documentElement.dataset.project02WorkflowProof === 'removed') return;
    document.documentElement.dataset.project02WorkflowProof = 'removed';

    // Remove portfolio sections the case study no longer needs.
    document.getElementById('workflows')?.remove();
    document.querySelectorAll('.navlinks a[href="#workflows"]').forEach(link => link.remove());
    [...document.querySelectorAll('.case-section')].forEach(section => {
      const kicker = section.querySelector('.kicker')?.textContent || '';
      const heading = section.querySelector('h2')?.textContent || '';
      if (/Column revision/i.test(kicker) || /Schema changes made to support the objective functionality/i.test(heading)) {
        section.remove();
      }
    });

    // Preserve the accurate portfolio wording that does not imply a live Monday API connection.
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
    if (demoIntro) {
      demoIntro.textContent = 'The public demo reconstructs the Monday.com operating experience with synthetic data while the self-hosted n8n backend supplies the implemented automation and state logic.';
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, {once:true});
  else apply();
})();
