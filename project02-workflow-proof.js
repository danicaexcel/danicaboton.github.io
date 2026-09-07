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

    const style = document.createElement('style');
    style.id = 'project02-agent-case-style';
    style.textContent = `
      .p02-agent-case{border-top:1px solid #343c44;border-bottom:1px solid #343c44;background:#1b2025}
      .p02-agent-case .wrap{padding-top:64px;padding-bottom:64px}
      .p02-agent-case-head{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(320px,.95fr);gap:34px;align-items:end;margin-bottom:24px}
      .p02-agent-case-head h2{margin:8px 0 0;color:#fff;font-size:clamp(30px,4vw,48px);line-height:1.02;letter-spacing:-.045em}.p02-agent-case-head p{margin:0;color:#aeb6bf;font-size:13px;line-height:1.7}
      .p02-agent-case-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.p02-agent-case-card{border:1px solid #414850;background:#22282e;padding:18px}.p02-agent-case-card small{display:block;color:#f5b36d;font:700 8px/1.3 "IBM Plex Mono",monospace;text-transform:uppercase;letter-spacing:.08em}.p02-agent-case-card h3{margin:9px 0;color:#fff;font-size:16px}.p02-agent-case-card p,.p02-agent-case-card li{color:#aeb6bf;font-size:10.5px;line-height:1.6}.p02-agent-case-card ul{margin:12px 0 0;padding-left:18px}
      .p02-agent-flow{margin-top:14px;border:1px solid #414850;background:#20262c;padding:16px}.p02-agent-flow-title{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:12px}.p02-agent-flow-title strong{color:#fff;font-size:12px}.p02-agent-flow-title span{color:#9da8b2;font-size:9px;line-height:1.5;max-width:680px}.p02-agent-flow-steps{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:7px}.p02-agent-flow-steps div{border:1px solid #46505a;background:#282f36;padding:11px;min-height:95px}.p02-agent-flow-steps b{display:block;color:#fff;font-size:9px;line-height:1.35}.p02-agent-flow-steps span{display:block;margin-top:5px;color:#9da8b2;font-size:8px;line-height:1.45}.p02-agent-flow-steps em{display:block;margin-bottom:6px;color:#f5b36d;font:700 8px/1.3 "IBM Plex Mono",monospace;font-style:normal}
      .p02-agent-boundary{margin-top:14px;padding:14px 16px;border-left:3px solid #f5b36d;background:rgba(245,179,109,.055);color:#c5cdd4;font-size:10px;line-height:1.6}.p02-agent-boundary strong{color:#fff}
      @media(max-width:980px){.p02-agent-case-head{grid-template-columns:1fr}.p02-agent-flow-steps{grid-template-columns:repeat(4,minmax(0,1fr))}}
      @media(max-width:720px){.p02-agent-case-grid{grid-template-columns:1fr}.p02-agent-flow-steps{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:460px){.p02-agent-flow-steps{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);

    // Hero positioning now makes the agent layer visible instead of burying it in the demo.
    const kicker = document.querySelector('.casehero .kicker');
    if (kicker) kicker.textContent = '02 / Monday.com · AI Agents · Project Operations · n8n';
    const subtitle = document.querySelector('.casehero .casesub');
    if (subtitle) subtitle.textContent = 'A Monday.com project operations system combining auditable time/cost controls with a native-style AI Project Manager Agent and Planner Agent for project follow-up, recovery planning, Sprint/Agile planning, client proposal costing, revision, approval, and controlled plan changes.';

    const casebar = document.querySelector('.casebar');
    if (casebar && !/Monday AI Agents/i.test(casebar.textContent)) {
      const tags = ['Monday AI Agents','Project Manager Agent','Planner Agent'];
      tags.reverse().forEach(text => {
        const span = document.createElement('span');
        span.textContent = text;
        const n8n = [...casebar.querySelectorAll('span')].find(x => x.textContent.trim() === 'n8n');
        if (n8n) casebar.insertBefore(span, n8n); else casebar.appendChild(span);
      });
    }

    // Preserve accurate reconstruction wording without implying a live production tenant in the public demo.
    document.querySelectorAll('.casebar span').forEach(span => {
      if (span.textContent.trim() === 'Monday API') span.textContent = 'Monday API / Agent tools';
    });

    const implementationNote = document.querySelector('.implementation-note p');
    if (implementationNote) {
      implementationNote.textContent = 'The public portfolio reconstructs the Monday.com operating experience and AI-agent workflow with synthetic data. The target architecture is native-first inside Monday: Project Manager and Planner agents read board context and Updates, recommend actions, and use approval gates before changing dates, scope, sprint assignments, risk, or approved proposal baselines. n8n remains the orchestration layer when work must leave Monday or requires cross-system validation, audit, retries, or external APIs.';
    }

    const statBoxes = [...document.querySelectorAll('.stats4 .statbox')];
    if (statBoxes[0]) { statBoxes[0].querySelector('strong').textContent='8'; statBoxes[0].querySelector('span').textContent='connected data boards'; }
    if (statBoxes[1]) { statBoxes[1].querySelector('strong').textContent='2'; statBoxes[1].querySelector('span').textContent='AI agents in Project 02'; }
    if (statBoxes[2]) { statBoxes[2].querySelector('strong').textContent='10'; statBoxes[2].querySelector('span').textContent='n8n workflow domains'; }
    if (statBoxes[3]) { statBoxes[3].querySelector('strong').textContent='Proposal → approval'; statBoxes[3].querySelector('span').textContent='costed project baseline'; }

    document.querySelectorAll('a[href*="monday-project-ops-demo-native-v8.html"],iframe[src*="monday-project-ops-demo-native-v8.html"]').forEach(el => {
      const attr = el.tagName === 'IFRAME' ? 'src' : 'href';
      const current = el.getAttribute(attr) || '';
      el.setAttribute(attr, `monday-project-ops-demo-native-v8.html?${el.tagName === 'IFRAME' || /embed=1/.test(current) ? 'embed=1&' : ''}v=20260907-proposal-costing1`);
    });

    const nav = document.querySelector('.navlinks');
    if (nav && !nav.querySelector('a[href="#ai-agents"]')) {
      const link = document.createElement('a');
      link.href = '#ai-agents';
      link.textContent = 'AI agents';
      const architecture = nav.querySelector('a[href="#architecture"]');
      if (architecture) nav.insertBefore(link, architecture); else nav.appendChild(link);
    }

    const firstSection = document.querySelector('header.casehero + .case-section');
    if (firstSection && !document.getElementById('ai-agents')) {
      const section = document.createElement('section');
      section.className = 'case-section p02-agent-case';
      section.id = 'ai-agents';
      section.innerHTML = `
        <div class="wrap">
          <div class="p02-agent-case-head">
            <div><div class="kicker">AI agent operating layer</div><h2>Two agents sit on top of the project system.</h2></div>
            <p>The agents do not replace the project data model. They use the existing projects, tasks, Updates, dates, workload, approvals, labor rates, and audit evidence as context. Their authority is deliberately limited: they can analyze and recommend freely, but plan-changing actions require the appropriate human approval.</p>
          </div>
          <div class="p02-agent-case-grid">
            <article class="p02-agent-case-card"><small>01 · Project Manager Agent</small><h3>Follow up, diagnose, recover</h3><p>Monitors overdue and stuck work, reads the latest Monday Updates and blocker context, asks the assigned member for clarification, suggests another path when a task is blocked, and requests project-owner approval before changing the plan.</p><ul><li>Reads task status, dates, owner, dependencies and Updates</li><li>Follows up with the assigned member when context is missing</li><li>Suggests recovery actions instead of silently moving dates</li><li>Applies approved date/status/risk changes only after the approval gate</li></ul></article>
            <article class="p02-agent-case-card"><small>02 · Planner Agent · Sprint / Agile + costing</small><h3>Plan the work before it becomes the baseline</h3><p>Turns a client brief, target budget, timeline and team/rate inputs into a costed proposal plan. The same Planner also reviews backlog, workload, remaining hours and blockers to build realistic Sprint/Agile scope.</p><ul><li>Builds phased scope, estimated hours and project costing</li><li>Generates a proposal-plan file for review</li><li>Supports Request revision → revised version → Approve</li><li>Applies only the approved budget/hours/sprint baseline to Monday</li></ul></article>
          </div>
          <div class="p02-agent-flow"><div class="p02-agent-flow-title"><strong>Planner proposal workflow</strong><span>The proposal is treated as a controlled planning artifact, not an AI answer that immediately rewrites the board.</span></div><div class="p02-agent-flow-steps"><div><em>01</em><b>Client inputs</b><span>Brief, scope, budget, timeline, constraints.</span></div><div><em>02</em><b>Costing context</b><span>Roles, rates, capacity, project assumptions.</span></div><div><em>03</em><b>Planner analysis</b><span>Phases, hours, dependencies, reserve and delivery load.</span></div><div><em>04</em><b>Proposal file</b><span>Generated plan with scope, hours and cost breakdown.</span></div><div><em>05</em><b>Review</b><span>Project owner checks assumptions and commercial fit.</span></div><div><em>06</em><b>Revise / approve</b><span>Revision creates a new version; approval locks the decision.</span></div><div><em>07</em><b>Monday baseline</b><span>Approved hours, budget, dates and sprint scope become controlled plan values.</span></div></div></div>
          <div class="p02-agent-boundary"><strong>Architecture boundary:</strong> native Monday AI Agents are the preferred layer for reasoning and actions that stay inside Monday. n8n is used when the agent needs external systems, custom services, cross-platform orchestration, stronger retry/reconciliation logic, or a centralized audit path beyond the native agent surface.</div>
        </div>`;
      firstSection.insertAdjacentElement('afterend', section);
    }

    const scope = [...document.querySelectorAll('.case-section')].find(section => /Scope boundary/i.test(section.textContent));
    if (scope) {
      const side = scope.querySelector('.case-aside p');
      if (side) side.textContent = 'What stays native, what the agents own, and what moves to n8n.';
      const cols = scope.querySelectorAll('.casegrid > div');
      if (cols[0]) {
        const h = cols[0].querySelector('h3');
        const p = cols[0].querySelector('p');
        if (h) h.textContent = 'Monday operating layer + native AI Agents';
        if (p) p.textContent = 'Boards, relationships, people, statuses, dates, Updates, files, dashboards, workload and planning stay in Monday. The Project Manager and Planner agents use that context for follow-up, recovery, Sprint planning and proposal costing, with human approval before plan-changing writes.';
      }
      if (cols[1]) {
        const h = cols[1].querySelector('h3');
        const p = cols[1].querySelector('p');
        if (h) h.textContent = 'n8n + external orchestration';
        if (p) p.textContent = 'n8n handles the work that should not be forced into the native agent layer: cross-system APIs, external notifications, append-only evidence workflows, idempotency, complex cost posting, retries, reconciliation and centralized technical audit when required.';
      }
    }

    const demoIntro = document.querySelector('#demo .sectionhead > p');
    if (demoIntro) {
      demoIntro.textContent = 'The public demo reconstructs the Monday.com operating experience with synthetic data and now includes the Project Manager Agent plus the Planner Agent for Sprint/Agile planning and client proposal costing, revision, approval, and controlled baseline write-back.';
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, {once:true});
  else apply();
})();
