(() => {
  const params = new URLSearchParams(location.search);
  if (!/case-study\.html$/.test(location.pathname) || params.get('id') !== 'recruitment') return;

  const apply = () => {
    if (!document.body || document.getElementById('operating-model')) return;

    const style = document.createElement('style');
    style.id = 'project01-role-model-style';
    style.textContent = `
      .p01-role-model{border-top:1px solid #343c44;border-bottom:1px solid #343c44;background:#1b2025}
      .p01-role-model .wrap{padding-top:64px;padding-bottom:64px}
      .p01-role-head{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(320px,.9fr);gap:36px;align-items:end;margin-bottom:28px}
      .p01-role-head h2{margin:8px 0 0;color:#fff;font-size:clamp(28px,4vw,48px);line-height:1.02;letter-spacing:-.045em}
      .p01-role-head p{margin:0;color:#aeb6bf;font-size:13px;line-height:1.7}
      .p01-role-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
      .p01-role-card{border:1px solid #414850;background:#22282e;padding:17px;min-height:245px}
      .p01-role-card small{display:block;color:#f5b36d;font:700 8px/1.3 "IBM Plex Mono",monospace;letter-spacing:.09em;text-transform:uppercase}
      .p01-role-card h3{margin:9px 0 10px;color:#fff;font-size:15px;letter-spacing:-.02em}
      .p01-role-card p{margin:0 0 12px;color:#aeb6bf;font-size:10.5px;line-height:1.58}
      .p01-role-card ul{margin:0;padding-left:16px;color:#c3cbd2}
      .p01-role-card li{margin:7px 0;font-size:10px;line-height:1.45}
      .p01-role-lifecycle{margin-top:18px;border:1px solid #414850;background:#20262c;padding:18px}
      .p01-role-lifecycle-head{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;margin-bottom:16px}
      .p01-role-lifecycle-head h3{margin:0;color:#fff;font-size:16px}
      .p01-role-lifecycle-head p{margin:0;max-width:680px;color:#9ea9b4;font-size:10px;line-height:1.55}
      .p01-role-flow{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:7px}
      .p01-role-step{border:1px solid #46505a;background:#282f36;padding:12px;min-height:112px}
      .p01-role-step b{display:block;color:#fff;font-size:10px;line-height:1.35}
      .p01-role-step span{display:block;margin-top:5px;color:#9da8b2;font-size:8.5px;line-height:1.45}
      .p01-role-step em{display:block;margin-bottom:6px;color:#f5b36d;font:700 8px/1.3 "IBM Plex Mono",monospace;font-style:normal}
      .p01-boundary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:14px}
      .p01-boundary-box{border:1px solid #414850;background:#22282e;padding:15px}
      .p01-boundary-box small{display:block;color:#f5b36d;font:700 8px/1.3 "IBM Plex Mono",monospace;text-transform:uppercase;letter-spacing:.08em}
      .p01-boundary-box strong{display:block;color:#fff;font-size:12px;margin:7px 0}
      .p01-boundary-box p{margin:0;color:#aeb6bf;font-size:10px;line-height:1.55}
      @media(max-width:1050px){.p01-role-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.p01-role-flow{grid-template-columns:repeat(4,minmax(0,1fr))}}
      @media(max-width:760px){.p01-role-head{grid-template-columns:1fr}.p01-role-grid,.p01-boundary{grid-template-columns:1fr}.p01-role-flow{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:460px){.p01-role-flow{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);

    const nav = document.querySelector('.navlinks');
    if (nav && !nav.querySelector('a[href="#operating-model"]')) {
      const link = document.createElement('a');
      link.href = '#operating-model';
      link.textContent = 'How it works';
      const architecture = nav.querySelector('a[href="#architecture"]');
      if (architecture) nav.insertBefore(link, architecture);
      else nav.appendChild(link);
    }

    const context = [...document.querySelectorAll('.case-section')].find(section => /Context/i.test(section.querySelector('.kicker')?.textContent || ''));
    const anchor = context || document.getElementById('relationships');
    if (!anchor) return;

    const section = document.createElement('section');
    section.className = 'case-section p01-role-model';
    section.id = 'operating-model';
    section.innerHTML = `
      <div class="wrap">
        <div class="p01-role-head">
          <div>
            <div class="kicker">Role-based operating model</div>
            <h2>From applicant intake to recruiter decision, hiring outcome, and reporting.</h2>
          </div>
          <p>The recruitment platform separates day-to-day recruiter work from system automation. Recruiters work inside Zoho CRM, recruitment operations maintains openings and oversight, Zoho workflow rules and Deluge keep CRM state consistent, and n8n is isolated to resume analysis before returning structured results to the Applicant record.</p>
        </div>

        <div class="p01-role-grid">
          <article class="p01-role-card">
            <small>01 · Recruiter</small>
            <h3>Review, prioritize, follow up, decide</h3>
            <p>The recruiter works from applicant, job-opening, workqueue, task, meeting, call, and ranking views inside Zoho CRM.</p>
            <ul>
              <li>Review applicants against the connected job opening and facility</li>
              <li>Use AI Score and Fit Level as prioritization signals, not an automatic hiring decision</li>
              <li>Manage calls, meetings, tasks, submissions, qualification, rejection, and follow-up</li>
              <li>Maintain the applicant stage while recruitment history is preserved</li>
            </ul>
          </article>

          <article class="p01-role-card">
            <small>02 · Recruitment operations</small>
            <h3>Openings, facilities, workload, oversight</h3>
            <p>Operational owners maintain the recruiting context and use reporting views to see activity, sourcing, candidate loss, and opening history by facility and position.</p>
            <ul>
              <li>Maintain facility and job-opening context</li>
              <li>Monitor recruiter workqueues and activity</li>
              <li>Review operational exceptions and incomplete records</li>
              <li>Use Daily, Weekly, Monthly, and YTD reporting families for oversight</li>
            </ul>
          </article>

          <article class="p01-role-card">
            <small>03 · Zoho CRM automation</small>
            <h3>Workflow rules + Deluge keep the lifecycle consistent</h3>
            <p>Same-system recruitment automation stays inside Zoho CRM rather than being routed through an external orchestrator.</p>
            <ul>
              <li>Update stage and recruitment-history records</li>
              <li>Create or update employee outcomes when hiring completes</li>
              <li>Create recruiter tasks and maintain assignments</li>
              <li>Run defensive validation, recursive-trigger protection, and post-write verification</li>
            </ul>
          </article>

          <article class="p01-role-card">
            <small>04 · Resume analysis service</small>
            <h3>One isolated n8n responsibility</h3>
            <p>n8n is used only when the applicant resume needs extraction and structured AI comparison against the job requirements.</p>
            <ul>
              <li>Receive the Applicant Record ID as the stable processing key</li>
              <li>Retrieve and extract PDF, DOC/DOCX, or image resume content</li>
              <li>Compare the resume with job requirements through structured AI analysis</li>
              <li>Validate and write AI Score, Fit Level, recommendation, skills, and processing state back to Zoho CRM</li>
            </ul>
          </article>
        </div>

        <div class="p01-role-lifecycle">
          <div class="p01-role-lifecycle-head">
            <h3>Applicant operating lifecycle</h3>
            <p>Recruiter actions remain in Zoho CRM while workflow rules and Deluge preserve history and related records. The external resume-analysis branch returns evidence to the same Applicant record so recruiters never need a second operating system.</p>
          </div>
          <div class="p01-role-flow">
            <div class="p01-role-step"><em>OPS</em><b>Facility + opening ready</b><span>Position, facility, openings, status, and recruitment context are established.</span></div>
            <div class="p01-role-step"><em>CRM</em><b>Applicant enters Zoho</b><span>Applicant links to the relevant job opening and facility.</span></div>
            <div class="p01-role-step"><em>N8N</em><b>Resume analysis</b><span>Resume and job requirements are extracted, evaluated, validated, and written back.</span></div>
            <div class="p01-role-step"><em>RECRUITER</em><b>Prioritize + review</b><span>AI Score and Fit Level support ranking while the recruiter owns the decision.</span></div>
            <div class="p01-role-step"><em>RECRUITER</em><b>Work the lifecycle</b><span>Calls, meetings, tasks, submission, qualification, rejection, and stage progression.</span></div>
            <div class="p01-role-step"><em>DELUGE</em><b>Preserve outcome</b><span>History rows, assignment state, validation, and employee outcome records are maintained.</span></div>
            <div class="p01-role-step"><em>LEAD</em><b>Report + rediscover</b><span>Recruitment activity, loss reasons, opening history, sourcing, and past applicants remain searchable.</span></div>
          </div>
        </div>

        <div class="p01-boundary">
          <div class="p01-boundary-box">
            <small>Decision boundary</small>
            <strong>AI assists; the recruiter decides</strong>
            <p>Structured resume analysis supports ranking and consistent review. It does not replace qualification, rejection, submission, follow-up, or the recruiter’s final judgment.</p>
          </div>
          <div class="p01-boundary-box">
            <small>Automation boundary</small>
            <strong>Zoho owns recruitment operations; n8n owns resume analysis only</strong>
            <p>Workflow rules and Deluge handle CRM lifecycle automation. n8n stays isolated to resume extraction, AI evaluation, validation, error handling, and verified Applicant write-back.</p>
          </div>
        </div>
      </div>
    `;
    anchor.insertAdjacentElement('afterend', section);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, {once:true});
  else apply();
})();
