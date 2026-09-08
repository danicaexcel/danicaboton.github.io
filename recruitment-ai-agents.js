(() => {
  const params = new URLSearchParams(location.search);
  if (!/demo\.html$/.test(location.pathname) || params.get('id') !== 'recruitment') return;

  const rediscovered = [
    {name:'Letoria Bush',id:'A-10487',role:'Unit Clerk',score:91,reason:'Prior administration experience + matching shift availability',status:'AI Rediscovered'},
    {name:'Karla Osorio',id:'A-10486',role:'LPN',score:88,reason:'Active LPN license + prior skilled-nursing experience',status:'AI Rediscovered'},
    {name:'Hannah Irving',id:'A-10489',role:'Dining Services',score:82,reason:'Prior leadership experience aligns with reopened dining role',status:'Recruiter Review'}
  ];

  const jobs = [
    {id:'JOB-741',title:'CNA - North Harbor',facility:'North Harbor Care'},
    {id:'JOB-740',title:'CNA - Riverside',facility:'Riverside Health'},
    {id:'JOB-739',title:'LPN - Pinecrest',facility:'Pinecrest Health'},
    {id:'JOB-738',title:'Respiratory Therapist',facility:'Greenfield Care'}
  ];

  let activeAgent = 'rediscovery';
  let postingGenerated = false;
  let postingApproved = false;

  function toastMessage(message){
    if (typeof window.toast === 'function') { window.toast(message); return; }
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'),2200);
  }

  function ensureStyle(){
    if (document.getElementById('p01-ai-agent-style')) return;
    const style = document.createElement('style');
    style.id = 'p01-ai-agent-style';
    style.textContent = `
      .p01-ai-nav{position:relative}.p01-ai-nav:after{content:'AI';position:absolute;right:8px;top:7px;padding:2px 4px;border-radius:3px;background:#6d5ce7;color:#fff;font-size:7px;font-weight:700}
      .p01-agent-shell{min-height:100%;background:#f7f8fb;color:#2b2c35;padding:22px 24px 40px}.p01-agent-head{display:flex;align-items:flex-start;gap:16px;margin-bottom:16px}.p01-agent-head-icon{width:42px;height:42px;border-radius:10px;background:#6d5ce7;color:#fff;display:grid;place-items:center;font-size:19px;font-weight:700}.p01-agent-head h1{margin:0;font-size:22px;font-weight:600}.p01-agent-head p{margin:5px 0 0;color:#6b6f7c;font-size:11px;line-height:1.5;max-width:760px}.p01-agent-head .state{margin-left:auto;display:inline-flex;align-items:center;gap:6px;padding:6px 9px;border:1px solid #cfd4e2;border-radius:5px;background:#fff;color:#4f5461;font-size:9px}.p01-agent-head .state:before{content:'';width:7px;height:7px;border-radius:50%;background:#00a86b}
      .p01-agent-tabs{display:flex;gap:6px;flex-wrap:wrap;border-bottom:1px solid #dfe3ee;padding-bottom:10px;margin-bottom:14px}.p01-agent-tabs button{border:1px solid #d1d6e2;background:#fff;color:#505563;border-radius:5px;padding:7px 10px;font-size:9px;cursor:pointer}.p01-agent-tabs button.active{background:#eef0ff;border-color:#887df0;color:#5147b8;font-weight:700}
      .p01-agent-grid{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(310px,.8fr);gap:12px}.p01-agent-card{background:#fff;border:1px solid #d9deea;border-radius:8px;overflow:hidden}.p01-agent-card-head{display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border-bottom:1px solid #e8ebf2}.p01-agent-card-head strong{font-size:11px;color:#323338}.p01-agent-card-head span{display:block;margin-top:3px;color:#8a8f9e;font-size:8px;line-height:1.4}.p01-agent-card-head em{margin-left:auto;font-style:normal;padding:3px 6px;border-radius:3px;background:#eef7f3;color:#087f5b;font-size:7px;font-weight:700}.p01-agent-body{padding:12px 14px}.p01-agent-note{padding:9px 10px;background:#f6f7fb;border-left:3px solid #6d5ce7;color:#5f6471;font-size:8.5px;line-height:1.5;margin-bottom:10px}
      .p01-agent-table{width:100%;border-collapse:collapse;font-size:8.5px}.p01-agent-table th,.p01-agent-table td{padding:8px 7px;border-bottom:1px solid #eceef3;text-align:left;vertical-align:top}.p01-agent-table th{color:#777d8b;background:#fafbfc;font-weight:600}.p01-agent-table td{color:#4d5260}.p01-agent-table td:first-child{color:#2f323a;font-weight:600}.p01-score{font-weight:700;color:#4b45b6}.p01-pill{display:inline-flex;padding:3px 6px;border-radius:3px;font-size:7px;font-weight:700}.p01-pill.ai{background:#e9e6ff;color:#5147b8}.p01-pill.review{background:#fff3dd;color:#8b5b00}.p01-pill.done{background:#e5f7ef;color:#087f5b}.p01-pill.draft{background:#e7f1ff;color:#2a6db5}
      .p01-agent-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}.p01-agent-btn{height:29px;border:1px solid #c7ccd9;border-radius:4px;background:#fff;color:#3e434f;padding:0 9px;font-size:8px;font-weight:600;cursor:pointer}.p01-agent-btn.primary{background:#6d5ce7;border-color:#6d5ce7;color:#fff}.p01-agent-btn.success{background:#00a86b;border-color:#00a86b;color:#fff}.p01-agent-btn[disabled]{opacity:.45;cursor:default}
      .p01-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-bottom:10px}.p01-kpi{background:#fafbfc;border:1px solid #e5e8ef;padding:8px}.p01-kpi span{display:block;color:#8a8f9e;font-size:7px;text-transform:uppercase}.p01-kpi b{display:block;margin-top:4px;color:#323338;font-size:14px;font-weight:500}.p01-list{margin:0;padding-left:16px;color:#535866;font-size:8.5px;line-height:1.5}.p01-list li{margin:5px 0}.p01-channel-row{display:grid;grid-template-columns:95px 1fr auto;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid #eceef3;font-size:8.5px}.p01-channel-row b{color:#323338}.p01-channel-row span{color:#6d7280}.p01-channel-row em{font-style:normal;color:#087f5b;font-weight:700}.p01-message{border:1px solid #e1e4ec;background:#fbfcfe;padding:9px;margin:8px 0;border-radius:5px;font-size:8.5px;line-height:1.5;color:#535866}.p01-message b{color:#323338}.p01-message .mention{color:#0060b9;font-weight:700}.p01-form-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}.p01-form-row label{font-size:8px;color:#676c78}.p01-form-row select,.p01-form-row textarea{width:100%;margin-top:4px;border:1px solid #cfd4df;border-radius:4px;background:#fff;color:#323338;padding:7px;font-size:8.5px}.p01-form-row textarea{min-height:78px;resize:vertical}.p01-stack{display:flex;gap:5px;flex-wrap:wrap}.p01-stack span{border:1px solid #d8dce5;background:#fff;border-radius:4px;padding:4px 6px;color:#5e6370;font-size:7.5px}
      .p01-job-distribution{margin-top:14px;border:1px solid #d9deea;background:#fff;border-radius:5px;padding:12px}.p01-job-distribution h4{margin:0 0 8px;font-size:12px;color:#323338}.p01-job-distribution p{margin:0 0 8px;color:#747987;font-size:9px}.p01-applicant-ai{margin-top:12px;border-top:1px solid #e6e9ef;padding-top:12px}.p01-applicant-ai h4{margin:0 0 8px;color:#323338;font-size:12px}
      @media(max-width:920px){.p01-agent-grid{grid-template-columns:1fr}.p01-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:620px){.p01-agent-shell{padding:14px}.p01-agent-head{flex-wrap:wrap}.p01-agent-head .state{margin-left:58px}.p01-form-row{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function rediscoveryView(){
    return `
      <div class="p01-agent-grid">
        <section class="p01-agent-card"><div class="p01-agent-card-head"><div><strong>Candidate Rediscovery Agent</strong><span>Runs when a new Job Opening becomes active and searches previous applicants against the new role.</span></div><em>Human-reviewed</em></div><div class="p01-agent-body"><div class="p01-agent-note">Strong matches are marked into an <b>AI Rediscovered</b> pipeline. The agent records why they were surfaced, but a recruiter still decides whether to contact, reject, or keep the candidate in the talent pool.</div><table class="p01-agent-table"><thead><tr><th>Candidate</th><th>Previous profile</th><th>Match</th><th>Why surfaced</th><th>Pipeline</th></tr></thead><tbody>${rediscovered.map(r=>`<tr><td>${r.name}<br><small>${r.id}</small></td><td>${r.role}</td><td class="p01-score">${r.score}%</td><td>${r.reason}</td><td><span class="p01-pill ${r.status==='AI Rediscovered'?'ai':'review'}">${r.status}</span></td></tr>`).join('')}</tbody></table><div class="p01-agent-actions"><button class="p01-agent-btn primary" data-p01-run-rediscovery>Run rediscovery for latest opening</button><button class="p01-agent-btn" data-p01-mark-all>Mark approved matches AI Rediscovered</button></div></div></section>
        <aside class="p01-agent-card"><div class="p01-agent-card-head"><div><strong>Rediscovery controls</strong><span>Evidence retained on the Applicant record.</span></div></div><div class="p01-agent-body"><ul class="p01-list"><li>Rediscovered By = AI</li><li>Rediscovered For = Job Opening ID</li><li>Rediscovery Score + Match Reason</li><li>Rediscovery Date</li><li>Recruiter Review Status</li><li>No automated qualification or hiring decision</li></ul></div></aside>
      </div>`;
  }

  function postingView(){
    return `
      <div class="p01-agent-grid">
        <section class="p01-agent-card"><div class="p01-agent-card-head"><div><strong>Job Posting Content Agent</strong><span>Converts one approved Zoho Job Opening into channel-specific copy before publishing.</span></div><em>${postingApproved?'Published':'Approval gate'}</em></div><div class="p01-agent-body"><div class="p01-form-row"><label>Job Opening<select id="p01JobSelect">${jobs.map(j=>`<option value="${j.id}">${j.id} · ${j.title}</option>`).join('')}</select></label><label>Channel policy<select><option>Recruiter approval required</option></select></label></div><div class="p01-message"><b>Core source:</b> title, facility, position, schedule, employment type, openings, salary range and approved job requirements from Zoho CRM. The AI can adapt tone/length, but it cannot invent qualifications or compensation.</div><div class="p01-channel-row"><b>Indeed</b><span>${postingGenerated?'Long-form job description generated':'Waiting for content generation'}</span><em>${postingApproved?'Published':'Draft'}</em></div><div class="p01-channel-row"><b>Facebook</b><span>${postingGenerated?'Recruitment post + CTA generated':'Waiting for content generation'}</span><em>${postingApproved?'Published':'Draft'}</em></div><div class="p01-channel-row"><b>Instagram</b><span>${postingGenerated?'Short caption + hashtags generated':'Waiting for content generation'}</span><em>${postingApproved?'Published':'Draft'}</em></div><div class="p01-agent-actions"><button class="p01-agent-btn primary" data-p01-generate-post>Generate channel content</button><button class="p01-agent-btn success" data-p01-approve-post ${postingGenerated?'':'disabled'}>Approve & publish</button></div></div></section>
        <aside class="p01-agent-card"><div class="p01-agent-card-head"><div><strong>Distribution architecture</strong><span>Job Opening creation starts the downstream publishing flow.</span></div></div><div class="p01-agent-body"><ul class="p01-list"><li>Zoho Job Opening = source of truth</li><li>Job Posting Content Agent = channel copy</li><li>Recruiter approval = publication boundary</li><li>Indeed / Facebook / Instagram = configured posting channels</li><li>Posting result + channel IDs written back for traceability</li></ul></div></aside>
      </div>`;
  }

  function operationsView(){
    return `
      <div class="p01-agent-grid">
        <section class="p01-agent-card"><div class="p01-agent-card-head"><div><strong>Recruitment Operations Agent</strong><span>One recruiter-facing agent combining completeness, pipeline risk, daily prioritization and interview prep.</span></div><em>Active</em></div><div class="p01-agent-body"><div class="p01-kpis"><div class="p01-kpi"><span>Needs review</span><b>5</b></div><div class="p01-kpi"><span>Missing info</span><b>3</b></div><div class="p01-kpi"><span>Pipeline risks</span><b>4</b></div><div class="p01-kpi"><span>Interviews today</span><b>3</b></div></div><div class="p01-message"><b>Daily recruiter briefing</b><br>5 applicants need review, 3 applications are missing required fields, 2 high-fit applicants have had no recruiter action for 48+ hours, and 3 interviews need preparation today.</div><div class="p01-message"><b>Application completeness</b><br>Kadira Reed is missing preferred start date and one credential confirmation. Send a prefilled Zoho form link first; use AI-assisted chat only for approved missing questions or applicant help.</div><div class="p01-message"><b>Pipeline risk</b><br>Respiratory Therapist · Greenfield Care has two candidates sitting in Recruiter Review beyond the target response window.</div><div class="p01-message"><b>Interview prep</b><br>Shivani Patel · Strong Fit (90). Verify shift commitment and recent CNA tenure. Suggested interview focus: patient-load handling, documentation and weekend availability.</div><div class="p01-agent-actions"><button class="p01-agent-btn primary" data-p01-followup>Prepare candidate follow-up</button><button class="p01-agent-btn" data-p01-prep>Generate interview prep</button></div></div></section>
        <aside class="p01-agent-card"><div class="p01-agent-card-head"><div><strong>AI-assisted applicant communication</strong><span>Messaging helps the applicant complete the process; structured data still belongs in Zoho.</span></div></div><div class="p01-agent-body"><div class="p01-stack"><span>Twilio SMS</span><span>Messenger</span><span>Microsoft Teams</span><span>Zoho Webform / Zoho Forms</span></div><div class="p01-message"><b>Example:</b><br>“Hi Kadira, your CNA application is almost complete. We still need your preferred start date. You can reply here or update the prefilled application form.”</div><ul class="p01-list"><li>Answers approved job/application questions</li><li>Collects only missing fields the workflow permits</li><li>Stops follow-up when the field or stage changes</li><li>Escalates uncertain or sensitive questions to the recruiter</li></ul></div></aside>
      </div>`;
  }

  function managerView(){
    return `
      <div class="p01-agent-grid">
        <section class="p01-agent-card"><div class="p01-agent-card-head"><div><strong>Recruitment Manager Assistant Agent</strong><span>Proactive manager-level reporting, bottleneck detection and recruitment oversight.</span></div><em>Scheduled</em></div><div class="p01-agent-body"><div class="p01-kpis"><div class="p01-kpi"><span>Active applicants</span><b>126</b></div><div class="p01-kpi"><span>Open jobs</span><b>11</b></div><div class="p01-kpi"><span>Aging >3d</span><b>17</b></div><div class="p01-kpi"><span>High-fit waiting</span><b>6</b></div></div><div class="p01-message"><b>Morning manager summary · generated automatically</b><br>126 active applicants across 11 openings. 17 candidates have remained in the same stage for more than 3 days, 6 high-fit candidates are waiting for recruiter review, and the Respiratory Therapist opening has the weakest applicant volume this week.</div><table class="p01-agent-table"><thead><tr><th>Source</th><th>Applicants</th><th>Interview rate</th><th>Attention</th></tr></thead><tbody><tr><td>Indeed</td><td>54</td><td>24%</td><td>Healthy</td></tr><tr><td>Facebook</td><td>31</td><td>18%</td><td>Monitor quality</td></tr><tr><td>Instagram</td><td>19</td><td>14%</td><td>Low conversion</td></tr><tr><td>Rediscovered</td><td>22</td><td>32%</td><td>Strong re-engagement</td></tr></tbody></table></div></section>
        <aside class="p01-agent-card"><div class="p01-agent-card-head"><div><strong>Manager questions</strong><span>Uses recruitment reports and current CRM state as context.</span></div></div><div class="p01-agent-body"><ul class="p01-list"><li>Which recruiter has the largest backlog?</li><li>Which openings are at risk?</li><li>Which source is producing the strongest interview conversion?</li><li>Show high-fit candidates waiting for action.</li><li>Why did conversion drop this week?</li></ul></div></aside>
      </div>`;
  }

  function existingView(){
    return `
      <div class="p01-agent-grid"><section class="p01-agent-card"><div class="p01-agent-card-head"><div><strong>Existing AI processing already in Project 01</strong><span>These remain processing capabilities, not separate new agents.</span></div><em>Existing</em></div><div class="p01-agent-body"><div class="p01-channel-row"><b>Resume Extraction</b><span>PDF, DOC/DOCX and image resume content is extracted and normalized.</span><em>Existing</em></div><div class="p01-channel-row"><b>Candidate Scoring</b><span>AI Score, Fit Level, recommendation, justification, key/missing skills, experience and education match.</span><em>Existing</em></div><div class="p01-agent-note" style="margin-top:10px">The new agents use the same Applicant, Job Opening, Facility, activity and reporting context. Final qualification, rejection, outreach approval and hiring decisions remain human-controlled.</div></div></section><aside class="p01-agent-card"><div class="p01-agent-card-head"><div><strong>Agent set</strong></div></div><div class="p01-agent-body"><ul class="p01-list"><li>Candidate Rediscovery Agent</li><li>Job Posting Content Agent</li><li>Recruitment Operations Agent</li><li>Recruitment Manager Assistant Agent</li></ul></div></aside></div>`;
  }

  function renderAgentCenter(){
    const main = document.getElementById('z5Main');
    if (!main) return;
    const renderBody = activeAgent==='posting'?postingView():activeAgent==='operations'?operationsView():activeAgent==='manager'?managerView():activeAgent==='existing'?existingView():rediscoveryView();
    main.innerHTML = `<div class="p01-agent-shell"><div class="p01-agent-head"><div class="p01-agent-head-icon">AI</div><div><h1>Recruitment AI Agents</h1><p>AI-assisted recruiting on top of the Zoho CRM operating model: distribution, rediscovery, applicant communication, recruiter support and manager reporting. Existing resume extraction and candidate scoring remain part of the current AI-processing workflow.</p></div><span class="state">Zoho CRM connected</span></div><div class="p01-agent-tabs"><button data-p01-agent="rediscovery" class="${activeAgent==='rediscovery'?'active':''}">Candidate Rediscovery</button><button data-p01-agent="posting" class="${activeAgent==='posting'?'active':''}">Job Posting Content</button><button data-p01-agent="operations" class="${activeAgent==='operations'?'active':''}">Recruitment Operations</button><button data-p01-agent="manager" class="${activeAgent==='manager'?'active':''}">Manager Assistant</button><button data-p01-agent="existing" class="${activeAgent==='existing'?'active':''}">Existing AI</button></div>${renderBody}</div>`;
    main.querySelectorAll('[data-p01-agent]').forEach(btn=>btn.onclick=()=>{activeAgent=btn.dataset.p01Agent;renderAgentCenter()});
    main.querySelector('[data-p01-run-rediscovery]')?.addEventListener('click',()=>toastMessage('Rediscovery completed · 3 past applicants surfaced for recruiter review'));
    main.querySelector('[data-p01-mark-all]')?.addEventListener('click',()=>toastMessage('Approved matches marked in the AI Rediscovered pipeline'));
    main.querySelector('[data-p01-generate-post]')?.addEventListener('click',()=>{postingGenerated=true;postingApproved=false;renderAgentCenter();toastMessage('Indeed, Facebook and Instagram drafts generated from the Zoho Job Opening')});
    main.querySelector('[data-p01-approve-post]')?.addEventListener('click',()=>{if(!postingGenerated)return;postingApproved=true;renderAgentCenter();toastMessage('Recruiter approval recorded · channel publishing completed in demo')});
    main.querySelector('[data-p01-followup]')?.addEventListener('click',()=>toastMessage('AI-assisted follow-up prepared for recruiter review'));
    main.querySelector('[data-p01-prep]')?.addEventListener('click',()=>toastMessage('Interview prep generated from Applicant + Job Opening context'));
  }

  function installNav(){
    const modules = document.querySelector('.z5-modules');
    if (!modules || modules.querySelector('[data-p01-ai-agents]')) return false;
    const btn = document.createElement('button');
    btn.className='p01-ai-nav';
    btn.dataset.p01AiAgents='1';
    btn.innerHTML='<span>✦</span>AI Agents';
    modules.appendChild(btn);
    btn.onclick=()=>{
      modules.querySelectorAll('button').forEach(x=>x.classList.remove('active'));
      btn.classList.add('active');
      renderAgentCenter();
    };
    modules.addEventListener('click',event=>{
      const standard=event.target.closest('[data-z5-module]');
      if(standard)btn.classList.remove('active');
    });
    return true;
  }

  function patchJobOpening(){
    const main=document.getElementById('z5Main');
    if(!main||main.querySelector('.p01-job-distribution'))return;
    const h1=main.querySelector('.z5-module-title h1');
    const record=main.querySelector('.z5-record-head h2');
    const scroll=main.querySelector('.z5-record-scroll');
    if(!h1||h1.textContent.trim()!=='Job Openings'||!record||!scroll)return;
    const section=document.createElement('section');
    section.className='z5-layout-section p01-job-distribution';
    section.innerHTML=`<h4>Automated Job Distribution + AI Content</h4><p>Creating/activating this Job Opening triggers channel-specific content generation, recruiter approval, then configured publishing.</p><div class="p01-channel-row"><b>Indeed</b><span>Long-form job posting</span><em>Connected</em></div><div class="p01-channel-row"><b>Facebook</b><span>Recruitment post + application CTA</span><em>Connected</em></div><div class="p01-channel-row"><b>Instagram</b><span>Short recruitment caption + hashtags</span><em>Connected</em></div><div class="p01-agent-actions"><button class="p01-agent-btn primary" data-p01-open-posting>Open Job Posting Content Agent</button></div>`;
    const first=scroll.querySelector('.z5-layout-section');
    if(first)first.insertAdjacentElement('afterend',section);else scroll.prepend(section);
    section.querySelector('[data-p01-open-posting]').onclick=()=>{activeAgent='posting';document.querySelector('[data-p01-ai-agents]')?.click()};
  }

  function patchApplicant(){
    const main=document.getElementById('z5Main');
    if(!main||main.querySelector('.p01-applicant-ai'))return;
    const h1=main.querySelector('.z5-module-title h1');
    const record=main.querySelector('.z5-record-head h2');
    const body=main.querySelector('#z5RecordBody .z5-record-scroll');
    if(!h1||h1.textContent.trim()!=='Applicants'||!record||!body)return;
    const section=document.createElement('section');
    section.className='z5-layout-section p01-applicant-ai';
    section.innerHTML=`<h4>AI-assisted Applicant Communication</h4><div class="p01-message"><b>Application assistant:</b> structured intake is handled through the Zoho application form. AI messaging is used for applicant help, missing-field follow-up and status/context questions through approved channels.</div><div class="p01-stack"><span>Twilio SMS</span><span>Messenger</span><span>Microsoft Teams</span><span>Zoho Webform / Zoho Forms</span></div><div class="p01-agent-actions"><button class="p01-agent-btn" data-p01-open-ops>Open Recruitment Operations Agent</button></div>`;
    body.appendChild(section);
    section.querySelector('[data-p01-open-ops]').onclick=()=>{activeAgent='operations';document.querySelector('[data-p01-ai-agents]')?.click()};
  }

  function apply(){
    ensureStyle();
    const installed=installNav();
    patchJobOpening();
    patchApplicant();
    return installed || !!document.querySelector('[data-p01-ai-agents]');
  }

  let tries=0;
  const timer=setInterval(()=>{tries++;apply();if(tries>180)clearInterval(timer)},100);
  document.addEventListener('click',event=>{
    if(event.target.closest('[data-z5-module],[data-z5-job],[data-z5-applicant],[data-z5-recordtab],[data-z5-jobview],[data-z5-appview]'))setTimeout(apply,60);
  },true);
})();
