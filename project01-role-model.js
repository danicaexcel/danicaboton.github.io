(() => {
  const params = new URLSearchParams(location.search);
  if (!/case-study\.html$/.test(location.pathname) || params.get('id') !== 'recruitment') return;

  const apply = () => {
    if (!document.body || document.documentElement.dataset.p01AiCase === '1') return;
    document.documentElement.dataset.p01AiCase = '1';

    const style = document.createElement('style');
    style.id = 'project01-role-model-style';
    style.textContent = `
      .p01-ai-case{border-top:1px solid #343c44;border-bottom:1px solid #343c44;background:#1b2025}.p01-ai-case .wrap{padding-top:64px;padding-bottom:64px}.p01-ai-head{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(320px,.95fr);gap:34px;align-items:end;margin-bottom:24px}.p01-ai-head h2{margin:8px 0 0;color:#fff;font-size:clamp(30px,4vw,48px);line-height:1.02;letter-spacing:-.045em}.p01-ai-head p{margin:0;color:#aeb6bf;font-size:13px;line-height:1.7}
      .p01-agent-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.p01-agent-card{border:1px solid #414850;background:#22282e;padding:18px;min-height:245px}.p01-agent-card small{display:block;color:#f5b36d;font:700 8px/1.3 "IBM Plex Mono",monospace;text-transform:uppercase;letter-spacing:.08em}.p01-agent-card h3{margin:9px 0;color:#fff;font-size:16px}.p01-agent-card p,.p01-agent-card li{color:#aeb6bf;font-size:10.5px;line-height:1.6}.p01-agent-card ul{margin:11px 0 0;padding-left:18px}.p01-agent-card strong{color:#fff}
      .p01-flow{margin-top:14px;border:1px solid #414850;background:#20262c;padding:16px}.p01-flow-title{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:12px}.p01-flow-title strong{color:#fff;font-size:12px}.p01-flow-title span{color:#9da8b2;font-size:9px;line-height:1.5;max-width:680px}.p01-flow-steps{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:7px}.p01-flow-steps div{border:1px solid #46505a;background:#282f36;padding:11px;min-height:104px}.p01-flow-steps b{display:block;color:#fff;font-size:9px;line-height:1.35}.p01-flow-steps span{display:block;margin-top:5px;color:#9da8b2;font-size:8px;line-height:1.45}.p01-flow-steps em{display:block;margin-bottom:6px;color:#f5b36d;font:700 8px/1.3 "IBM Plex Mono",monospace;font-style:normal}
      .p01-stack{display:flex;flex-wrap:wrap;gap:7px;margin-top:14px}.p01-stack span{border:1px solid #46505a;background:#252c32;color:#cbd2d9;padding:6px 8px;font-size:8px}.p01-boundary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:14px}.p01-boundary article{border:1px solid #414850;background:#22282e;padding:15px}.p01-boundary small{display:block;color:#f5b36d;font:700 8px/1.3 "IBM Plex Mono",monospace;text-transform:uppercase;letter-spacing:.08em}.p01-boundary strong{display:block;color:#fff;font-size:12px;margin:7px 0}.p01-boundary p{margin:0;color:#aeb6bf;font-size:10px;line-height:1.55}
      .p01-existing{margin-top:14px;border-left:3px solid #f5b36d;background:rgba(245,179,109,.055);padding:14px 16px;color:#c4ccd4;font-size:10px;line-height:1.6}.p01-existing strong{color:#fff}.p01-ai-case .kicker{color:#f5b36d}
      @media(max-width:1080px){.p01-flow-steps{grid-template-columns:repeat(4,minmax(0,1fr))}}@media(max-width:780px){.p01-ai-head,.p01-agent-grid,.p01-boundary{grid-template-columns:1fr}.p01-flow-steps{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:460px){.p01-flow-steps{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);

    const heroKicker = document.querySelector('.casehero .kicker');
    if (heroKicker) heroKicker.textContent = '01 / Zoho CRM · AI Agents · Recruitment Automation · APIs';
    const subtitle = document.querySelector('.casehero .casesub');
    if (subtitle) subtitle.textContent = 'A Zoho CRM recruitment operating platform with automated multi-channel job distribution, AI-assisted applicant communication, candidate rediscovery, recruiter operations support, manager reporting, and the existing resume extraction + candidate scoring workflow.';
    const implementation = document.querySelector('.implementation-note');
    if (implementation) {
      const label = implementation.querySelector('span');
      const copy = implementation.querySelector('p');
      if (label) label.textContent = 'Zoho CRM system of record + AI-assisted recruitment layer';
      if (copy) copy.textContent = 'Zoho CRM remains the recruiter operating surface and system of record. Job Openings trigger distribution to configured channels, applicant intake stays structured through Zoho Webforms / Zoho Forms, messaging channels assist applicants and follow up on approved missing information, and four AI agents support rediscovery, content, recruiter operations, and manager oversight. Existing resume extraction and candidate scoring remain part of the current processing workflow.';
    }

    const casebar = document.querySelector('.casebar');
    if (casebar) {
      const tags = ['AI Agents','Indeed','Facebook','Instagram','Twilio SMS','Messenger','Microsoft Teams','Zoho Forms'];
      tags.forEach(text => { if (![...casebar.querySelectorAll('span')].some(x=>x.textContent.trim()===text)) { const span=document.createElement('span'); span.textContent=text; casebar.appendChild(span); } });
    }
    const stats = [...document.querySelectorAll('.stats4 .statbox')];
    if (stats[0]) { stats[0].querySelector('strong').textContent='4'; stats[0].querySelector('span').textContent='AI agents added to recruitment operations'; }
    if (stats[1]) { stats[1].querySelector('strong').textContent='3'; stats[1].querySelector('span').textContent='automated posting channels'; }
    if (stats[2]) { stats[2].querySelector('strong').textContent='AI Rediscovered'; stats[2].querySelector('span').textContent='controlled talent-pool pipeline'; }
    if (stats[3]) { stats[3].querySelector('strong').textContent='Human-approved'; stats[3].querySelector('span').textContent='outreach and hiring decisions'; }

    const nav = document.querySelector('.navlinks');
    if (nav && !nav.querySelector('a[href="#ai-agents"]')) {
      const link=document.createElement('a'); link.href='#ai-agents'; link.textContent='AI agents';
      const arch=nav.querySelector('a[href="#architecture"]'); if(arch)nav.insertBefore(link,arch); else nav.appendChild(link);
    }

    document.getElementById('operating-model')?.remove();
    const context = [...document.querySelectorAll('.case-section')].find(section => /Context/i.test(section.querySelector('.kicker')?.textContent || ''));
    const anchor = context || document.getElementById('relationships');
    if (!anchor) return;

    const section=document.createElement('section');
    section.className='case-section p01-ai-case';
    section.id='ai-agents';
    section.innerHTML=`
      <div class="wrap">
        <div class="p01-ai-head"><div><div class="kicker">AI-assisted recruitment operating layer</div><h2>Four agents extend the existing Zoho recruitment system.</h2></div><p>The agents use the same Applicant, Job Opening, Facility, activity, workqueue, report, and AI-scoring context already present in Zoho CRM. They automate preparation, follow-up, rediscovery, and management visibility without giving AI authority to make the final hiring decision.</p></div>
        <div class="p01-agent-grid">
          <article class="p01-agent-card"><small>01 · Candidate Rediscovery Agent</small><h3>Search the existing talent pool when a new role opens</h3><p>When a new Job Opening becomes active, the agent compares past applicants against the new role and surfaces strong matches into a controlled <strong>AI Rediscovered</strong> pipeline.</p><ul><li>Searches previous applicant history, experience, skills and existing AI analysis</li><li>Writes Rediscovered For, Score, Match Reason and Rediscovery Date</li><li>Marks approved matches as AI Rediscovered for recruiter review</li><li>Does not automatically qualify, reject or contact the candidate</li></ul></article>
          <article class="p01-agent-card"><small>02 · Job Posting Content Agent</small><h3>One Job Opening, channel-specific content</h3><p>The agent turns the approved Zoho Job Opening into copy suited to each configured channel while preserving the same requirements, compensation and facility context.</p><ul><li>Indeed long-form job description</li><li>Facebook recruitment post + application CTA</li><li>Instagram short caption + hashtags</li><li>Recruiter approval before publishing; channel result written back for traceability</li></ul></article>
          <article class="p01-agent-card"><small>03 · Recruitment Operations Agent</small><h3>Recruiter copilot + completeness + risk + interview prep</h3><p>One recruiter-facing agent handles the daily operating work that would otherwise become four separate assistants.</p><ul><li>Daily recruiter briefing and priority queue</li><li>Application completeness checks and approved missing-field follow-up</li><li>Pipeline aging / bottleneck detection</li><li>Interview prep based on Applicant + Job Opening context</li><li>AI-assisted applicant communication through Twilio SMS, Messenger and Microsoft Teams</li></ul></article>
          <article class="p01-agent-card"><small>04 · Recruitment Manager Assistant Agent</small><h3>Proactive manager reporting and oversight</h3><p>The manager assistant publishes scheduled recruitment summaries and answers management questions using current CRM and reporting state.</p><ul><li>Daily / weekly recruitment summary</li><li>Recruiter workload and backlog</li><li>Applicants and conversion by source/channel</li><li>Aging candidates, high-fit candidates waiting for action and at-risk openings</li><li>Pipeline bottleneck and interview / offer trend explanations</li></ul></article>
        </div>
        <div class="p01-flow"><div class="p01-flow-title"><strong>End-to-end recruitment flow</strong><span>Structured application data stays in Zoho; AI assists where language, prioritization, matching, follow-up and reporting benefit from context.</span></div><div class="p01-flow-steps"><div><em>01</em><b>Job Opening</b><span>Recruiter creates/activates the role in Zoho CRM.</span></div><div><em>02</em><b>Posting content</b><span>AI produces approved channel variants.</span></div><div><em>03</em><b>Auto distribution</b><span>Indeed, Facebook and Instagram publishing integrations run.</span></div><div><em>04</em><b>Application intake</b><span>Zoho Webform / Zoho Forms captures structured applicant data.</span></div><div><em>05</em><b>Applicant assistance</b><span>AI messaging answers questions and requests approved missing fields.</span></div><div><em>06</em><b>Existing AI analysis</b><span>Resume extraction + candidate scoring write structured results to the Applicant.</span></div><div><em>07</em><b>Recruiter operations</b><span>Priorities, risk, completeness and interview prep are surfaced.</span></div><div><em>08</em><b>Manager oversight</b><span>Scheduled summaries and pipeline insights support leadership.</span></div></div></div>
        <div class="p01-stack"><span>Zoho CRM</span><span>Zoho Webforms / Zoho Forms</span><span>Indeed</span><span>Facebook</span><span>Instagram</span><span>Twilio SMS</span><span>Messenger</span><span>Microsoft Teams</span><span>Deluge</span><span>Workflow Rules</span><span>n8n / API orchestration where cross-system work is required</span></div>
        <div class="p01-existing"><strong>Existing AI capability retained:</strong> Resume Extraction and Candidate Scoring are already part of Project 01. They continue to extract resume content and write AI Score, Fit Level, recommendation, justification, key/missing skills, experience match and education match back to Zoho CRM. The new agents use those results; they do not replace them.</div>
        <div class="p01-boundary"><article><small>Applicant data boundary</small><strong>Forms first, chat second</strong><p>Core application fields are captured through structured Zoho forms. AI messaging helps the applicant, follows up on approved missing information and writes only permitted fields.</p></article><article><small>Recruiter boundary</small><strong>AI prepares; recruiter approves</strong><p>Rediscovery, outreach, publication and plan-changing actions remain visible and reviewable. Qualification, rejection and hiring stay human-owned.</p></article><article><small>System boundary</small><strong>Zoho stays the system of record</strong><p>Workflow/Deluge handles same-system CRM state. API orchestration is used where posting, messaging or external services cross the Zoho boundary.</p></article></div>
      </div>`;
    anchor.insertAdjacentElement('afterend',section);

    const architecture=document.getElementById('architecture');
    if(architecture){
      const label=architecture.querySelector('.architecture-label'); if(label)label.textContent='Zoho CRM + recruitment AI agents + channel integrations';
      const h2=architecture.querySelector('.case-content > h2'); if(h2)h2.textContent='How the recruitment system now moves.';
    }

    const demoIntro=document.querySelector('#demo .sectionhead > p');
    if(demoIntro)demoIntro.textContent='The interactive reconstruction now includes the four recruitment AI agents, AI Rediscovered pipeline, multi-channel job-posting flow, applicant-assistance integrations, and the existing resume extraction + candidate scoring workflow.';
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true}); else apply();
})();
