(() => {
  const params = new URLSearchParams(location.search);
  if (!/demo\.html$/.test(location.pathname) || params.get('id') !== 'recruitment') return;

  const root = document.getElementById('demoRoot');
  if (!root) return;

  const agents = {
    rediscovery: {
      name: 'Candidate Rediscovery Agent',
      deployment: 'Digital Employee',
      module: 'Job Openings',
      activation: 'When an active Job Opening meets rediscovery conditions',
      button: 'Run Candidate Rediscovery',
      access: 'Recruitment Operations · Recruiter Manager',
      tools: 'Applicant search · Job Opening context · Applicant update · Notes / audit',
      description: 'Searches previous applicants against a new opening and marks recruiter-approved matches as AI Rediscovered with score, reason, target opening, and rediscovery date.'
    },
    posting: {
      name: 'Job Posting Content Agent',
      deployment: 'Connection',
      module: 'Job Openings',
      activation: 'Manual button on an approved Job Opening',
      button: 'Generate Job Posting Content',
      access: 'Recruiters · Recruitment Operations',
      tools: 'Job Opening fields · Indeed connector · Facebook connector · Instagram connector',
      description: 'Creates channel-specific job copy from the approved CRM Job Opening. Publishing remains approval-controlled and external delivery is handled through configured connections.'
    },
    operations: {
      name: 'Recruitment Operations Agent',
      deployment: 'Digital Employee',
      module: 'Applicants',
      activation: 'Conditional Applicant trigger + manual record button',
      button: 'Run Recruitment Operations Agent',
      access: 'Recruiters · Recruitment Operations',
      tools: 'Applicant context · Job Opening context · Tasks · Meetings · Calls · Twilio / messaging connections',
      description: 'Combines application completeness, recruiter copilot, pipeline-risk detection, interview prep, and approved applicant follow-up.'
    },
    manager: {
      name: 'Recruitment Manager Assistant Agent',
      deployment: 'Digital Employee',
      module: 'Recruitment reporting context',
      activation: 'Autonomous conditions + Home Agent insights',
      button: 'Get Agent Insights',
      access: 'Recruitment Manager · Recruitment Operations Lead',
      tools: 'Recruitment reports · Applicant pipeline · Job Openings · Recruiter activity · Tasks / meetings / calls',
      description: 'Surfaces management insights for backlog, aging candidates, source performance, recruiter workload, high-fit candidates waiting for action, and at-risk openings.'
    }
  };

  function toast(message) {
    if (typeof window.toast === 'function') { window.toast(message); return; }
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2300);
  }

  function ensureStyle() {
    if (document.getElementById('p01-native-zia-style')) return;
    const style = document.createElement('style');
    style.id = 'p01-native-zia-style';
    style.textContent = `
      .p01-zia-home-agent{grid-column:span 2!important;position:relative}.p01-zia-home-agent .p01-zia-home-head{display:flex;align-items:center;gap:10px;margin-bottom:12px}.p01-zia-home-agent .p01-zia-home-head h3{margin:0!important}.p01-zia-home-agent .p01-zia-home-head button{margin-left:auto;border:1px solid #d7dce6;background:#fff;border-radius:4px;padding:5px 8px;color:#4c5464;font-size:10px;cursor:pointer}.p01-zia-home-agent .p01-zia-agent-state{display:inline-flex;align-items:center;gap:5px;color:#4c5464;font-size:9px}.p01-zia-home-agent .p01-zia-agent-state:before{content:'';width:7px;height:7px;border-radius:50%;background:#17a673}.p01-zia-home-agent table{width:100%;border-collapse:collapse;font-size:10px}.p01-zia-home-agent th,.p01-zia-home-agent td{padding:9px 10px;border-top:1px solid #e8ebf1;text-align:left;vertical-align:top}.p01-zia-home-agent th{font-weight:500;color:#707789;background:#fafbfc}.p01-zia-home-agent td{color:#4b5261}.p01-zia-home-agent td:first-child{font-weight:600;color:#2f3440}
      .p01-zia-setup-title{display:flex;align-items:flex-start;gap:12px}.p01-zia-setup-title>div:first-child{flex:1}.p01-zia-setup-title h1{margin-bottom:5px!important}.p01-zia-setup-title p{margin-top:0!important;max-width:760px}.p01-zia-setup-actions{display:flex;gap:8px}.p01-zia-setup-actions button{height:32px;border:1px solid #cfd5df;background:#fff;border-radius:4px;padding:0 11px;color:#3e4654;font-size:10px;cursor:pointer}.p01-zia-setup-actions .primary{background:#1f7ae0;border-color:#1f7ae0;color:#fff}.p01-zia-tabs{display:flex;gap:18px;border-bottom:1px solid #e1e5ec;margin-top:22px}.p01-zia-tabs button{border:0;background:none;padding:0 2px 10px;color:#5d6574;font-size:11px}.p01-zia-tabs button.active{color:#1d2733;border-bottom:2px solid #1f7ae0;font-weight:600}.p01-zia-table-wrap{margin-top:14px;border:1px solid #dde2ea;border-radius:4px;overflow:hidden;background:#fff}.p01-zia-table{width:100%;border-collapse:collapse;font-size:10px}.p01-zia-table th,.p01-zia-table td{padding:11px 10px;border-bottom:1px solid #edf0f4;text-align:left;vertical-align:top}.p01-zia-table th{background:#f8f9fb;color:#72798a;font-weight:500}.p01-zia-table td{color:#4b5260}.p01-zia-table td:first-child{font-weight:600;color:#2f3540}.p01-zia-status{display:inline-flex;align-items:center;gap:5px}.p01-zia-status:before{content:'';width:7px;height:7px;border-radius:50%;background:#17a673}.p01-zia-manage{border:1px solid #cbd2dc;background:#fff;border-radius:4px;padding:5px 8px;font-size:9px;color:#3e4654;cursor:pointer}.p01-zia-note{margin-top:14px;padding:11px 12px;border:1px solid #e0e5ed;background:#fafbfc;color:#626a78;font-size:9px;line-height:1.55}.p01-zia-note strong{color:#303742}.p01-zia-config{display:grid;grid-template-columns:minmax(0,1fr) 310px;gap:14px;margin-top:16px}.p01-zia-config section{border:1px solid #dde2ea;background:#fff;border-radius:4px;padding:14px}.p01-zia-config h3{margin:0 0 12px;font-size:12px}.p01-zia-fields{display:grid;grid-template-columns:160px 1fr;gap:0;border-top:1px solid #edf0f4}.p01-zia-fields dt,.p01-zia-fields dd{margin:0;padding:9px 8px;border-bottom:1px solid #edf0f4;font-size:9px}.p01-zia-fields dt{color:#747b89}.p01-zia-fields dd{color:#343b47}.p01-zia-config .secondary p{font-size:9px;line-height:1.55;color:#626a78}.p01-zia-breadcrumb{font-size:9px;color:#7b8290;margin-bottom:14px}.p01-record-agent-btn{white-space:nowrap}.p01-rediscovery-section .z5-fields-2{margin-top:4px}
      @media(max-width:980px){.p01-zia-config{grid-template-columns:1fr}.p01-zia-home-agent{grid-column:span 1!important}}
    `;
    document.head.appendChild(style);
  }

  function setupSidebar() {
    return `<a>Setup Home</a><label>⌕ <input placeholder="Search"></label>
      <h3>General</h3><button>Company Details</button><button>Personal Settings</button><button>Users</button><button>Security Control</button><button class="active" data-p01-zia-setup>Agents ✦</button>
      <h3>Customization</h3><button>Modules and Fields</button><button>Wizards</button><button>Canvas ✦</button>
      <h3>Automation</h3><button>Workflow Rules</button><button>Actions</button><button>Schedules</button><button>Assignment</button><button>Scoring Rules</button><button>Cadences</button>
      <h3>Zia</h3><button>Data Enrichment</button><button>Prediction</button><button>Recommendation</button><button>Communication</button><button>Custom AI Studio</button>`;
  }

  function renderAgentsSetup() {
    root.innerHTML = `<div class="z5-setup-shell">
      <header class="z5-setup-top"><b>Setup</b><button>Admin Panel</button><button class="active">CRM</button><span></span><button id="p01ZiaSetupClose">×</button></header>
      <div class="z5-setup-body"><aside class="z5-setup-side">${setupSidebar()}</aside><main class="z5-setup-main"><div class="z5-setup-content">
        <div class="p01-zia-setup-title"><div><div class="p01-zia-breadcrumb">Setup &nbsp;›&nbsp; General &nbsp;›&nbsp; Agents</div><h1>Agents</h1><p>Configure Zia Agents deployed into Zoho CRM, define activation conditions, profile access, and CRM tool parameter mappings.</p></div><div class="p01-zia-setup-actions"><button id="p01AgentPortal">View Agent Portal</button><button class="primary" id="p01NewAgent">New Agent</button></div></div>
        <div class="p01-zia-tabs"><button class="active">Active Agents (4)</button><button>Draft (0)</button></div>
        <div class="p01-zia-table-wrap"><table class="p01-zia-table"><thead><tr><th>Agent</th><th>Deployment</th><th>Module / context</th><th>Activation</th><th>Status</th><th></th></tr></thead><tbody>
          ${Object.entries(agents).map(([key,a])=>`<tr><td>${a.name}</td><td>${a.deployment}</td><td>${a.module}</td><td>${a.activation}</td><td><span class="p01-zia-status">Active</span></td><td><button class="p01-zia-manage" data-p01-manage-agent="${key}">Manage Agent</button></td></tr>`).join('')}
        </tbody></table></div>
        <div class="p01-zia-note"><strong>Native CRM pattern:</strong> agents are configured in <b>Setup → General → Agents</b>. Record-specific agents can run from conditional triggers or CRM custom buttons; agent actions remain governed by the deploying connection or Digital Employee role/profile.</div>
      </div></main></div></div>`;
    document.getElementById('p01ZiaSetupClose').onclick = restoreCRM;
    root.querySelector('.z5-setup-top button:nth-of-type(2)').onclick = restoreCRM;
    document.getElementById('p01AgentPortal').onclick = () => toast('Zia Agents portal opened in this public reconstruction');
    document.getElementById('p01NewAgent').onclick = () => toast('New Agent opens Zia Agent Studio in production');
    root.querySelectorAll('[data-p01-manage-agent]').forEach(btn => btn.onclick = () => renderAgentConfig(btn.dataset.p01ManageAgent));
  }

  function renderAgentConfig(key) {
    const a = agents[key] || agents.rediscovery;
    root.innerHTML = `<div class="z5-setup-shell">
      <header class="z5-setup-top"><b>Setup</b><button>Admin Panel</button><button class="active">CRM</button><span></span><button id="p01ZiaSetupClose">×</button></header>
      <div class="z5-setup-body"><aside class="z5-setup-side">${setupSidebar()}</aside><main class="z5-setup-main"><div class="z5-setup-content">
        <div class="p01-zia-breadcrumb"><button class="p01-zia-manage" id="p01BackAgents">← Agents</button> &nbsp;›&nbsp; Manage Agent</div>
        <div class="p01-zia-setup-title"><div><h1>${a.name}</h1><p>${a.description}</p></div><div class="p01-zia-setup-actions"><button>Update</button><button class="primary">Active</button></div></div>
        <div class="p01-zia-tabs"><button class="active">Setup</button><button>Activity</button><button>Access</button></div>
        <div class="p01-zia-config"><section><h3>Agent activation condition</h3><dl class="p01-zia-fields"><dt>Module / context</dt><dd>${a.module}</dd><dt>Conditional trigger</dt><dd>${a.activation}</dd><dt>Feed further information</dt><dd>Enabled · current record fields, related CRM records, activities, and approved signals</dd><dt>Manual trigger via button</dt><dd>${a.button}</dd><dt>Tools parameter mapping</dt><dd>${a.tools}</dd></dl></section><section class="secondary"><h3>Deployment and access</h3><dl class="p01-zia-fields"><dt>Deployment</dt><dd>${a.deployment}</dd><dt>Profile access</dt><dd>${a.access}</dd><dt>Audit identity</dt><dd>${a.deployment === 'Digital Employee' ? 'Agent identity recorded separately from human users' : 'Actions logged through the configured CRM connection'}</dd></dl><p>Production permissions should be limited to the modules, fields, tools, and external connections required by this agent.</p></section></div>
      </div></main></div></div>`;
    document.getElementById('p01ZiaSetupClose').onclick = restoreCRM;
    root.querySelector('.z5-setup-top button:nth-of-type(2)').onclick = restoreCRM;
    document.getElementById('p01BackAgents').onclick = renderAgentsSetup;
  }

  function restoreCRM() {
    if (typeof window.recruitmentV5 === 'function') window.recruitmentV5();
    setTimeout(apply, 20);
  }

  function removeNonNativeAgentRoutes() {
    root.querySelectorAll('[data-z5-top="Agents"]').forEach(el => el.remove());
    root.querySelectorAll('[data-z5-module="AI Agents"]').forEach(el => el.remove());
    const staleTitle = [...root.querySelectorAll('.z5-module-title h1')].find(h => h.textContent.trim() === 'Agents');
    if (staleTitle && /External resume analysis layer/i.test(root.textContent)) {
      const home = root.querySelector('[data-z5-top="Home"]');
      if (home) home.click();
    }
  }

  function bindSettings() {
    const settings = root.querySelector('.z5-toptools [title="Settings"]');
    if (!settings || settings.dataset.p01ZiaBound === '1') return;
    settings.dataset.p01ZiaBound = '1';
    settings.onclick = event => { event.preventDefault(); event.stopPropagation(); renderAgentsSetup(); };
  }

  function patchHomeAgentComponent() {
    const title = root.querySelector('.z5-module-title h1');
    if (!title || title.textContent.trim() !== 'Home') return;
    const dashboard = root.querySelector('.z5-dashboard');
    if (!dashboard || dashboard.querySelector('.p01-zia-home-agent')) return;
    const section = document.createElement('section');
    section.className = 'z5-widget table p01-zia-home-agent';
    section.innerHTML = `<small>AGENT</small><div class="p01-zia-home-head"><h3>Recruitment Manager Assistant Agent</h3><span class="p01-zia-agent-state">Active</span><button type="button" data-p01-home-refresh>↻ Refresh insights</button></div><table><thead><tr><th>Insight</th><th>Current signal</th><th>Suggested manager action</th></tr></thead><tbody><tr><td>High-fit candidates waiting</td><td>6 candidates above the review threshold have no recruiter action today</td><td>Review recruiter queues and assign next action</td></tr><tr><td>Pipeline aging</td><td>17 applicants have remained in the same stage for more than 3 days</td><td>Check blockers and follow-up ownership</td></tr><tr><td>Opening at risk</td><td>Respiratory Therapist · Greenfield has low qualified volume</td><td>Review sourcing mix and rediscovery candidates</td></tr><tr><td>Source performance</td><td>Indeed is producing the highest qualified volume this period</td><td>Compare cost and conversion before reallocating spend</td></tr></tbody></table>`;
    dashboard.prepend(section);
    section.querySelector('[data-p01-home-refresh]').onclick = () => toast('Recruitment Manager Assistant insights refreshed');
  }

  function patchApplicantKanban() {
    const title = root.querySelector('.z5-module-title h1');
    if (!title || title.textContent.trim() !== 'Applicants') return;
    const cols = [...root.querySelectorAll('.z5-kcol')];
    const retap = cols.find(col => col.querySelector('header b')?.textContent.trim() === 'Retap');
    if (!retap || retap.dataset.p01Rediscovery === '1') return;
    retap.dataset.p01Rediscovery = '1';
    const label = retap.querySelector('header b');
    if (label) label.textContent = 'AI Rediscovered';
    retap.querySelectorAll('.z5-kbody article').forEach(card => {
      const status = card.querySelector('em');
      if (status) status.textContent = 'AI Rediscovered';
    });
  }

  function patchRecordActions() {
    const page = root.querySelector('.z5-record-page');
    if (!page) return;
    const module = page.querySelector('.z5-module-title h1')?.textContent.trim();
    const actions = page.querySelector('.z5-record-head .actions');
    if (!actions) return;

    if (module === 'Job Openings') {
      if (!actions.querySelector('[data-p01-agent-action="posting"]')) {
        const post = document.createElement('button');
        post.className = 'p01-record-agent-btn'; post.dataset.p01AgentAction = 'posting'; post.textContent = 'Generate Posting Content';
        post.onclick = () => toast('Job Posting Content Agent started from the Job Opening record');
        actions.insertBefore(post, actions.firstChild);
      }
      if (!actions.querySelector('[data-p01-agent-action="rediscovery"]')) {
        const rediscover = document.createElement('button');
        rediscover.className = 'p01-record-agent-btn'; rediscover.dataset.p01AgentAction = 'rediscovery'; rediscover.textContent = 'Run Rediscovery';
        rediscover.onclick = () => toast('Candidate Rediscovery Agent started for this Job Opening');
        actions.insertBefore(rediscover, actions.firstChild);
      }
    }

    if (module === 'Applicants') {
      if (!actions.querySelector('[data-p01-agent-action="operations"]')) {
        const ops = document.createElement('button');
        ops.className = 'p01-record-agent-btn'; ops.dataset.p01AgentAction = 'operations'; ops.textContent = 'Run Recruitment Agent';
        ops.onclick = () => toast('Recruitment Operations Agent started from this Applicant record');
        actions.insertBefore(ops, actions.firstChild);
      }
      const name = page.querySelector('.z5-record-head .title h2')?.textContent.trim();
      if (name === 'Letoria Bush') patchRediscoveryRecord(page);
    }
  }

  function patchRediscoveryRecord(page) {
    const scroll = page.querySelector('#z5RecordBody .z5-record-scroll');
    if (!scroll || scroll.querySelector('.p01-rediscovery-section')) return;
    const section = document.createElement('section');
    section.className = 'z5-layout-section p01-rediscovery-section';
    section.innerHTML = `<h3>AI Rediscovery</h3><div class="z5-fields-2"><div class="z5-field"><span>Rediscovery Status</span><b>AI Rediscovered</b></div><div class="z5-field"><span>Rediscovered By</span><b>Candidate Rediscovery Agent</b></div><div class="z5-field"><span>Rediscovered For</span><b>JOB-737 · Unit Clerk</b></div><div class="z5-field"><span>Rediscovery Score</span><b>91%</b></div><div class="z5-field"><span>Match Reason</span><b>Prior administration experience + matching shift availability</b></div><div class="z5-field"><span>Recruiter Review Status</span><b>Pending review</b></div></div>`;
    scroll.prepend(section);
  }

  function apply() {
    ensureStyle();
    if (root.querySelector('.z5-setup-shell')) return;
    removeNonNativeAgentRoutes();
    bindSettings();
    patchHomeAgentComponent();
    patchApplicantKanban();
    patchRecordActions();
  }

  let scheduled = false;
  const scheduleApply = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; apply(); });
  };

  new MutationObserver(scheduleApply).observe(root, { childList: true, subtree: true });
  root.addEventListener('click', () => setTimeout(scheduleApply, 0), true);
  apply();
})();