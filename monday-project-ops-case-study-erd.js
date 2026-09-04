(() => {
  if (!/monday-project-ops-case-study\.html$/.test(location.pathname)) return;

  const onReady = fn => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  };

  onReady(() => {
    if (document.documentElement.dataset.project02RoleModel === '1') return;
    document.documentElement.dataset.project02RoleModel = '1';

    const stripPrefixes = root => {
      if (!root) return;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(node => {
        if (node.nodeValue?.includes('[N]')) node.nodeValue = node.nodeValue.replace(/\[N\]\s*/g, '');
      });
    };
    stripPrefixes(document.body);

    if (!document.querySelector('script[data-project02-workflow-proof]')) {
      const proof = document.createElement('script');
      proof.src = 'project02-workflow-proof.js?v=20260904-roleflow2';
      proof.dataset.project02WorkflowProof = '1';
      document.body.appendChild(proof);
    }

    const style = document.createElement('style');
    style.id = 'project02-role-model-style';
    style.textContent = `
      .p02-role-model{border-top:1px solid #343c44;border-bottom:1px solid #343c44;background:#1b2025}
      .p02-role-model .wrap{padding-top:64px;padding-bottom:64px}
      .p02-role-head{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(320px,.9fr);gap:36px;align-items:end;margin-bottom:28px}
      .p02-role-head h2{margin:8px 0 0;color:#fff;font-size:clamp(28px,4vw,48px);line-height:1.02;letter-spacing:-.045em}
      .p02-role-head p{margin:0;color:#aeb6bf;font-size:13px;line-height:1.7}
      .p02-role-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
      .p02-role-card{border:1px solid #414850;background:#22282e;padding:17px;min-height:235px}
      .p02-role-card small{display:block;color:#f5b36d;font:700 8px/1.3 "IBM Plex Mono",monospace;letter-spacing:.09em;text-transform:uppercase}
      .p02-role-card h3{margin:9px 0 10px;color:#fff;font-size:15px;letter-spacing:-.02em}
      .p02-role-card p{margin:0 0 12px;color:#aeb6bf;font-size:10.5px;line-height:1.58}
      .p02-role-card ul{margin:0;padding-left:16px;color:#c3cbd2}
      .p02-role-card li{margin:7px 0;font-size:10px;line-height:1.45}
      .p02-role-card code{font:700 9px/1.3 "IBM Plex Mono",monospace;color:#f5b36d;background:transparent}
      .p02-role-lifecycle{margin-top:18px;border:1px solid #414850;background:#20262c;padding:18px}
      .p02-role-lifecycle-head{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;margin-bottom:16px}
      .p02-role-lifecycle-head h3{margin:0;color:#fff;font-size:16px}
      .p02-role-lifecycle-head p{margin:0;max-width:650px;color:#9ea9b4;font-size:10px;line-height:1.55}
      .p02-role-flow{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:7px}
      .p02-role-step{border:1px solid #46505a;background:#282f36;padding:12px;min-height:105px}
      .p02-role-step b{display:block;color:#fff;font-size:10px;line-height:1.35}
      .p02-role-step span{display:block;margin-top:5px;color:#9da8b2;font-size:8.5px;line-height:1.45}
      .p02-role-step em{display:block;margin-bottom:6px;color:#f5b36d;font:700 8px/1.3 "IBM Plex Mono",monospace;font-style:normal}
      .p02-review-loop{display:grid;grid-template-columns:1fr auto 1fr;gap:14px;align-items:center;margin-top:14px;padding:15px;border-left:3px solid #f5b36d;background:rgba(245,179,109,.055)}
      .p02-review-loop strong{display:block;color:#fff;font-size:11px;margin-bottom:5px}
      .p02-review-loop p{margin:0;color:#adb6be;font-size:9.5px;line-height:1.55}
      .p02-review-arrow{color:#f5b36d;font:700 18px/1 "IBM Plex Mono",monospace}
      .p02-approval-boundary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:14px}
      .p02-approval-box{border:1px solid #414850;background:#22282e;padding:15px}
      .p02-approval-box small{display:block;color:#f5b36d;font:700 8px/1.3 "IBM Plex Mono",monospace;text-transform:uppercase;letter-spacing:.08em}
      .p02-approval-box strong{display:block;color:#fff;font-size:12px;margin:7px 0}
      .p02-approval-box p{margin:0;color:#aeb6bf;font-size:10px;line-height:1.55}
      .p02-role-note{margin-top:14px;color:#8f99a3;font-size:9.5px;line-height:1.6}
      @media(max-width:1050px){.p02-role-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.p02-role-flow{grid-template-columns:repeat(4,minmax(0,1fr))}}
      @media(max-width:760px){.p02-role-head{grid-template-columns:1fr}.p02-role-grid,.p02-approval-boundary{grid-template-columns:1fr}.p02-role-flow{grid-template-columns:repeat(2,minmax(0,1fr))}.p02-review-loop{grid-template-columns:1fr}.p02-review-arrow{transform:rotate(90deg);justify-self:center}}
      @media(max-width:460px){.p02-role-flow{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);

    const nav = document.querySelector('.navlinks');
    if (nav && !nav.querySelector('a[href="#operating-model"]')) {
      const link = document.createElement('a');
      link.href = '#operating-model';
      link.textContent = 'How it works';
      const workflowLink = nav.querySelector('a[href="#workflows"]');
      if (workflowLink) nav.insertBefore(link, workflowLink);
      else nav.appendChild(link);
    }

    const controls = document.getElementById('controls');
    if (controls && !document.getElementById('operating-model')) {
      const section = document.createElement('section');
      section.className = 'case-section p02-role-model';
      section.id = 'operating-model';
      section.innerHTML = `
        <div class="wrap">
          <div class="p02-role-head">
            <div>
              <div class="kicker">Role-based operating model</div>
              <h2>From task assignment to approval, revision, and approved cost.</h2>
            </div>
            <p>The system is designed around four distinct responsibilities. Project managers plan and assign work, workers execute from a personal queue, reviewers approve the deliverable or return it for revision, and timesheet approvers authorize recorded hours before cost is posted. A completed revision never bypasses review: it returns to the approval queue for a new decision.</p>
          </div>

          <div class="p02-role-grid">
            <article class="p02-role-card">
              <small>01 · Project manager</small>
              <h3>Plan, create, assign, monitor</h3>
              <p>The manager owns the project and task plan. Every task belongs to exactly one project and has one accountable worker.</p>
              <ul>
                <li>Create project and task records</li>
                <li>Assign responsible worker and collaborators</li>
                <li>Set planned hours, priority, due date, and acceptance criteria</li>
                <li>Monitor progress, overdue work, escalations, and review state</li>
              </ul>
            </article>

            <article class="p02-role-card">
              <small>02 · Member / worker</small>
              <h3>My Work → time evidence → review</h3>
              <p>A worker operates from an assigned-work view rather than editing evidence boards directly.</p>
              <ul>
                <li><code>Start Work</code> opens one ACTIVE session</li>
                <li><code>Pause</code> closes it; <code>Resume</code> creates a new session</li>
                <li><code>Stop Work</code> closes the current work block</li>
                <li><code>Send for Review</code> moves the task out of active execution</li>
              </ul>
            </article>

            <article class="p02-role-card">
              <small>03 · Reviewer / approver</small>
              <h3>Review queue for deliverables</h3>
              <p>Submitted work appears in a dedicated review queue with the task, worker, original/rework hours, evidence, and revision history.</p>
              <ul>
                <li>Approve acceptable task work</li>
                <li>Return work with a required revision reason</li>
                <li>Set revision owner and deadline</li>
                <li>Review every revision resubmission again</li>
              </ul>
            </article>

            <article class="p02-role-card">
              <small>04 · Timesheet approver</small>
              <h3>Authorize hours before cost</h3>
              <p>Task approval proves the deliverable is acceptable. Timesheet approval separately determines which recorded hours become approved/payable cost evidence.</p>
              <ul>
                <li>Review original and rework hours separately</li>
                <li>Approve, return, reject, or adjust eligible hours</li>
                <li>Resolve the effective historical labor rate</li>
                <li>Post locked Approved Work Ledger lines</li>
              </ul>
            </article>
          </div>

          <div class="p02-role-lifecycle">
            <div class="p02-role-lifecycle-head">
              <h3>Normal task lifecycle</h3>
              <p>The task state and the work-session evidence move independently. The task can wait for review while all time evidence remains append-only and reconstructable.</p>
            </div>
            <div class="p02-role-flow">
              <div class="p02-role-step"><em>PM</em><b>Create + assign task</b><span>Project, worker, plan, due date, acceptance criteria.</span></div>
              <div class="p02-role-step"><em>WORKER</em><b>Start Work</b><span>Create an ACTIVE ORIGINAL work session.</span></div>
              <div class="p02-role-step"><em>WORKER</em><b>Pause / Resume</b><span>Close the current session; resume creates a new one.</span></div>
              <div class="p02-role-step"><em>WORKER</em><b>Stop + Submit</b><span>Close work and send the task to For Review.</span></div>
              <div class="p02-role-step"><em>REVIEWER</em><b>Review deliverable</b><span>Inspect evidence, hours, history, files, and completion note.</span></div>
              <div class="p02-role-step"><em>DECISION</em><b>Approve or revise</b><span>Approve the task, or create a required revision.</span></div>
              <div class="p02-role-step"><em>COST</em><b>Timesheet approval</b><span>Authorized hours become locked approved-cost evidence.</span></div>
            </div>
          </div>

          <div class="p02-review-loop">
            <div>
              <strong>Return for Revision</strong>
              <p>The reviewer supplies the reason, root-cause category, assignee, deadline, and reviewer note. A new Revision record is created and the task moves to <b>Revision Required</b>. Any new work sessions are classified as REVISION rather than ORIGINAL.</p>
            </div>
            <div class="p02-review-arrow">→</div>
            <div>
              <strong>Resolve & Resubmit → Review again</strong>
              <p>The worker completes revision work and adds resolution evidence. Resolving the revision moves the task back to <b>For Review</b>. The reviewer must approve it again or return it for Revision #2, #3, and so on. Revision completion is never automatic approval.</p>
            </div>
          </div>

          <div class="p02-approval-boundary">
            <div class="p02-approval-box">
              <small>Quality boundary</small>
              <strong>Task / deliverable approval</strong>
              <p>Answers: “Is the submitted deliverable acceptable?” The reviewer can approve it or return it for revision. This decision changes task/review state but does not by itself create approved labor cost.</p>
            </div>
            <div class="p02-approval-box">
              <small>Cost boundary</small>
              <strong>Timesheet approval</strong>
              <p>Answers: “Which recorded hours are authorized?” Approval resolves the effective-dated rate and creates locked Approved Work Ledger lines. Approved Rework Cost remains a breakout of Approved Labor Cost, not an additional cost.</p>
            </div>
          </div>

          <p class="p02-role-note"><strong>Portfolio implementation note:</strong> this section defines the role and state-transition contract used by the Project 02 backend. The public demo UI is being aligned to expose these controls directly as My Work, Review & Approval, task creation/assignment, revision resubmission, and timesheet approval views.</p>
        </div>
      `;
      controls.insertAdjacentElement('afterend', section);
    }

    const traceability = [...document.querySelectorAll('.case-section')].find(section => /Traceability/i.test(section.textContent));
    if (traceability) {
      const callout = traceability.querySelector('.p02-callout');
      if (callout && !/revision resubmission/i.test(callout.textContent)) {
        callout.insertAdjacentHTML('beforeend', ' <strong>Revision resubmission follows the same quality-approval gate:</strong> resolved rework returns to For Review and must be approved again before the task is considered accepted.');
      }
    }
  });
})();