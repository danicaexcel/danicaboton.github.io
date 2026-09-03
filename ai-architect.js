(() => {
  const config = window.DCODE_AI_CONFIG || { mode: 'demo', endpoint: '' };
  const form = document.getElementById('architectForm');
  const input = document.getElementById('architectInput');
  const conversation = document.getElementById('conversation');
  const resultPanel = document.getElementById('resultPanel');
  const runtimeStatus = document.getElementById('runtimeStatus');
  const modeLabel = document.getElementById('modeLabel');
  const sendButton = form.querySelector('.send');
  let currentMode = 'design';

  const sessionKey = 'dcode-ai-architect-session';
  let sessionId = sessionStorage.getItem(sessionKey);
  if (!sessionId) {
    sessionId = `dcode-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(sessionKey, sessionId);
  }

  runtimeStatus.textContent = config.mode === 'live' && config.endpoint
    ? 'Live agent connected · n8n execution enabled'
    : 'Demo intelligence active · n8n connection ready';

  const labels = { design: 'Design an automation', audit: 'Audit a workflow', match: 'Find a DCode project' };
  document.querySelectorAll('.mode').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.mode').forEach(x => x.classList.remove('active'));
      button.classList.add('active');
      currentMode = button.dataset.mode;
      modeLabel.textContent = labels[currentMode];
      const placeholders = {
        design: 'Describe the process, tools, volume, and what you want to improve...',
        audit: 'Describe your current workflow from trigger to final action...',
        match: 'Describe the type of system or project you are looking for...'
      };
      input.placeholder = placeholders[currentMode];
    });
  });

  document.querySelectorAll('#quickPrompts button').forEach(button => {
    button.addEventListener('click', () => {
      input.value = button.textContent;
      input.focus();
    });
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    addMessage('user', message);
    input.value = '';
    setLoading(true);
    try {
      const result = config.mode === 'live' && config.endpoint
        ? await callLiveAgent(message)
        : await demoAgent(message, currentMode);
      validateResult(result);
      addMessage('agent', result.summary, 'Architecture analysis complete');
      renderResult(result);
    } catch (error) {
      console.error(error);
      addMessage('agent', 'I could not complete the architecture analysis. The agent endpoint may be unavailable or returned an unexpected response.', 'Connection issue');
    } finally {
      setLoading(false);
    }
  });

  function addMessage(role, text, title) {
    const article = document.createElement('article');
    article.className = `message ${role}`;
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = role === 'agent' ? 'AI' : 'YOU';
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    if (title) {
      const strong = document.createElement('b');
      strong.textContent = title;
      bubble.appendChild(strong);
    }
    const p = document.createElement('p');
    p.textContent = text;
    bubble.appendChild(p);
    article.append(avatar, bubble);
    conversation.appendChild(article);
    conversation.scrollTop = conversation.scrollHeight;
  }

  function setLoading(loading) {
    sendButton.disabled = loading;
    sendButton.textContent = loading ? 'Analyzing…' : 'Analyze →';
    if (loading) addThinking(); else document.getElementById('thinkingMessage')?.remove();
  }

  function addThinking() {
    const article = document.createElement('article');
    article.id = 'thinkingMessage';
    article.className = 'message agent';
    article.innerHTML = '<div class="avatar">AI</div><div class="bubble thinking"><i></i><i></i><i></i><span>Mapping systems and constraints</span></div>';
    conversation.appendChild(article);
    conversation.scrollTop = conversation.scrollHeight;
  }

  async function callLiveAgent(message) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.timeoutMs || 45000);
    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: config.requestHeaders || { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          sessionId,
          mode: currentMode,
          message,
          context: { source: 'dcode-portfolio', page: 'ai-architect' }
        })
      });
      if (!response.ok) throw new Error(`Agent HTTP ${response.status}`);
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }

  function validateResult(result) {
    if (!result || typeof result !== 'object') throw new Error('Invalid agent response');
    ['title','summary','architecture','recommendations','controls','relatedProjects','followUpQuestions'].forEach(key => {
      if (!(key in result)) throw new Error(`Missing response field: ${key}`);
    });
  }

  function renderResult(result) {
    document.getElementById('resultTitle').textContent = result.title;
    document.getElementById('resultSummary').textContent = result.summary;
    document.getElementById('complexityBadge').textContent = result.complexity || 'Moderate';
    renderArchitecture(result.architecture || []);
    renderList('recommendationList', result.recommendations || []);
    renderList('controlList', result.controls || []);
    renderProjects(result.relatedProjects || []);
    const followups = document.getElementById('followupQuestions');
    followups.replaceChildren(...(result.followUpQuestions || []).map((q, i) => {
      const div = document.createElement('div');
      const n = document.createElement('span'); n.textContent = String(i + 1).padStart(2, '0');
      const text = document.createElement('p'); text.textContent = q;
      div.append(n, text); return div;
    }));
    resultPanel.classList.remove('hidden');
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderArchitecture(items) {
    const root = document.getElementById('architectureFlow');
    root.innerHTML = '';
    items.forEach((item, index) => {
      const node = document.createElement('div');
      node.className = 'arch-node';
      const num = document.createElement('span'); num.textContent = String(index + 1).padStart(2, '0');
      const wrap = document.createElement('div');
      const name = document.createElement('b'); name.textContent = item.name || item;
      const detail = document.createElement('small'); detail.textContent = item.detail || '';
      wrap.append(name, detail); node.append(num, wrap); root.appendChild(node);
      if (index < items.length - 1) {
        const arrow = document.createElement('div'); arrow.className = 'arch-arrow'; arrow.textContent = '→'; root.appendChild(arrow);
      }
    });
  }

  function renderList(id, items) {
    const root = document.getElementById(id);
    root.replaceChildren(...items.map(item => {
      const li = document.createElement('li'); li.textContent = item; return li;
    }));
  }

  function renderProjects(projects) {
    const root = document.getElementById('projectMatches');
    root.innerHTML = '';
    projects.forEach(project => {
      const a = document.createElement('a');
      a.className = 'project-match';
      a.href = project.href || `case-study.html?id=${encodeURIComponent(project.id || '')}`;
      const text = document.createElement('div');
      const title = document.createElement('b'); title.textContent = project.title;
      const reason = document.createElement('p'); reason.textContent = project.reason;
      text.append(title, reason);
      const arrow = document.createElement('span'); arrow.textContent = 'View case study ↗';
      a.append(text, arrow); root.appendChild(a);
    });
  }

  async function demoAgent(message, mode) {
    await new Promise(resolve => setTimeout(resolve, 850));
    const q = message.toLowerCase();
    const recruitment = /resume|candidate|applicant|recruit|hiring|indeed|job/.test(q);
    const documentFlow = /document|ocr|pdf|image|extract|invoice|file/.test(q);
    const migration = /migrat|records|legacy|import|dedup|apploi|jazz/.test(q);
    const crm = /crm|zoho|spreadsheet|sheet|sync|form/.test(q);

    if (mode === 'match') return projectMatchResponse(message, recruitment, documentFlow, migration, crm);
    if (mode === 'audit') return auditResponse(message, recruitment, documentFlow, crm);
    if (recruitment || migration) return recruitmentResponse(message, migration);
    if (documentFlow) return documentResponse(message);
    if (crm) return integrationResponse(message);
    return generalResponse(message);
  }

  const commonControls = [
    'Use idempotent writes so retries cannot create duplicate business records.',
    'Keep an execution audit trail with source IDs, timestamps, outcomes, and error context.',
    'Separate retryable technical failures from records that require human review.',
    'Require approval before high-impact or ambiguous AI decisions write to the system of record.'
  ];

  function recruitmentResponse(message, migration) {
    return {
      title: migration ? 'Controlled recruitment data migration architecture' : 'AI-assisted recruitment operations architecture',
      complexity: 'Moderate–High',
      summary: migration
        ? 'I would treat this as a resumable data pipeline rather than a one-time import: ingest source records and files, extract structured candidate data, normalize identities, deduplicate deterministically, then create or update the CRM with reconciliation and progress checkpoints.'
        : 'I would centralize candidate intake before the CRM, normalize every source into one candidate contract, use AI only for extraction and assistive scoring, and preserve recruiter approval for hiring decisions.',
      architecture: migration ? [
        {name:'Source ingestion',detail:'APIs · Drive · exports · resumes'},
        {name:'Parse & extract',detail:'PDF/DOC/image → structured fields'},
        {name:'Normalize',detail:'email · phone · dates · names'},
        {name:'Deduplicate',detail:'deterministic identity rules'},
        {name:'Zoho upsert',detail:'update existing · create missing'},
        {name:'Reconcile',detail:'checkpoint · audit · retry queue'}
      ] : [
        {name:'Candidate sources',detail:'job boards · forms · email'},
        {name:'n8n intake',detail:'normalize · validate · deduplicate'},
        {name:'AI screening',detail:'extract · classify · assist'},
        {name:'Zoho CRM',detail:'applicant · logs · history'},
        {name:'Recruiter review',detail:'approve · reject · schedule'}
      ],
      recommendations: [
        'Define one canonical candidate schema before connecting additional sources.',
        'Keep AI output structured and validate required fields before CRM writes.',
        migration ? 'Persist a processing checkpoint per source record so large migrations can resume safely.' : 'Store AI score, rationale, model version, and recruiter decision separately for traceability.',
        'Route uncertain matches and incomplete records to an exception queue instead of silently guessing.'
      ],
      controls: commonControls,
      relatedProjects: [
        {id:'recruitment',title:'Smart Recruitment Management',reason:'Multi-source recruitment intake, AI screening, deduplication, CRM write-back, and scheduling.',href:'case-study.html?id=recruitment'},
        {id:'zoho-migration',title:'Zoho Recruitment Data Migration',reason:'Large-scale applicant migration with document parsing, deduplication, progress tracking, and CRM synchronization.',href:'case-study.html?id=zoho-migration'}
      ],
      followUpQuestions:['How many records or applicants enter the process per day/week?','Which system must remain the source of truth?','What should happen when AI confidence is low or candidate identity is ambiguous?','Which actions require recruiter or HR approval?']
    };
  }

  function documentResponse() {
    return {
      title:'Document intelligence and validation pipeline', complexity:'Moderate',
      summary:'I would separate document ingestion, extraction, validation, and business-system write-back. OCR or an LLM should produce a strict schema, while deterministic rules verify required fields and route low-confidence documents for review.',
      architecture:[{name:'Upload',detail:'Drive · portal · email'},{name:'Pre-process',detail:'type · quality · OCR'},{name:'AI extraction',detail:'strict JSON schema'},{name:'Validation',detail:'rules · confidence · duplicates'},{name:'Database',detail:'normalized operational record'},{name:'Action',detail:'CRM · alert · dashboard'}],
      recommendations:['Preserve the original file and extraction metadata for auditability.','Use deterministic validation after AI extraction rather than trusting model output directly.','Version extraction schemas so downstream workflows remain stable as prompts evolve.','Create a human-review lane for missing, conflicting, or low-confidence fields.'],
      controls:commonControls,
      relatedProjects:[{id:'spx-ocr',title:'SPX OCR Automated Encoder System',reason:'OCR-driven logistics document ingestion, structured extraction, storage, and operational visibility.',href:'case-study.html?id=spx-ocr'},{id:'zoho-migration',title:'Zoho Recruitment Data Migration',reason:'Resume parsing and structured applicant extraction before CRM synchronization.',href:'case-study.html?id=zoho-migration'}],
      followUpQuestions:['Which document formats and layouts must be supported?','Which fields are mandatory and which can be uncertain?','What volume and processing latency are expected?','Where should rejected or low-confidence documents be reviewed?']
    };
  }

  function integrationResponse() {
    return {
      title:'Connected operations and CRM synchronization layer', complexity:'Moderate',
      summary:'The main risk is allowing several tools to behave like competing sources of truth. I would define data ownership first, then use event-driven n8n workflows to synchronize only the fields and state transitions each downstream system actually needs.',
      architecture:[{name:'Business inputs',detail:'forms · sheets · CRM events'},{name:'Event contract',detail:'IDs · ownership · timestamps'},{name:'n8n',detail:'route · transform · reconcile'},{name:'System of record',detail:'authoritative business state'},{name:'Operating views',detail:'dashboards · alerts · actions'}],
      recommendations:['Assign ownership for every shared business field before implementing sync.','Prefer event-driven updates with scheduled reconciliation as a safety net.','Use stable external IDs rather than names as cross-system keys.','Avoid bi-directional synchronization unless the business truly requires both systems to edit the same field.'],
      controls:commonControls,
      relatedProjects:[{id:'monday',title:'Enterprise Operations Workspace',reason:'Centralized operating architecture with cross-system orchestration and governance.',href:'case-study.html?id=monday'},{id:'recruitment',title:'Smart Recruitment Management',reason:'Multiple acquisition channels normalized before CRM write-back.',href:'case-study.html?id=recruitment'}],
      followUpQuestions:['Which application should own each shared record?','What fields can users edit in more than one system?','How quickly must changes propagate?','How should conflicts between two updates be resolved?']
    };
  }

  function auditResponse(message, recruitment, documentFlow, crm) {
    const base = recruitment ? recruitmentResponse(message, false) : documentFlow ? documentResponse(message) : crm ? integrationResponse(message) : generalResponse(message);
    base.title = `Workflow audit: ${base.title}`;
    base.summary = 'I would first map the trigger, transformations, ownership changes, external calls, and final write-back. The most common scaling failures are hidden manual handoffs, duplicate writes, unclear data ownership, and workflows that have no recovery path when an API or AI step fails.';
    base.recommendations.unshift('Document the current workflow as trigger → transformations → decisions → writes → notifications before changing tools.');
    return base;
  }

  function projectMatchResponse(message, recruitment, documentFlow, migration, crm) {
    const base = recruitment || migration ? recruitmentResponse(message, migration) : documentFlow ? documentResponse(message) : crm ? integrationResponse(message) : generalResponse(message);
    base.title = 'Closest DCode portfolio matches';
    base.summary = 'I matched your requirement against the systems represented in this portfolio. These projects are the strongest evidence because their architecture contains similar data, orchestration, AI, integration, or operational-control patterns.';
    return base;
  }

  function generalResponse() {
    return {
      title:'Business automation architecture', complexity:'Discovery required',
      summary:'I would begin with the business state and handoffs rather than selecting an automation tool immediately. Once the source of truth, events, decisions, exceptions, and desired outcome are clear, the implementation can be split between platform-native logic, n8n orchestration, AI assistance, and custom code only where necessary.',
      architecture:[{name:'Business event',detail:'what starts the process'},{name:'Canonical data',detail:'required state and ownership'},{name:'Orchestration',detail:'rules · APIs · transformations'},{name:'Decision layer',detail:'deterministic rules · AI where useful'},{name:'System action',detail:'write · notify · schedule'},{name:'Operations',detail:'audit · retry · exceptions'}],
      recommendations:['Define the system of record and desired final state first.','Automate deterministic rules before adding AI.','Use AI for unstructured inputs, classification, reasoning, or assistance—not as a replacement for basic business rules.','Design exception handling and observability as part of the workflow, not after deployment.'],
      controls:commonControls,
      relatedProjects:[{id:'monday',title:'Enterprise Operations Workspace',reason:'Shows system-of-record design, orchestration, operational governance, and reporting.',href:'case-study.html?id=monday'},{id:'dee',title:'DEE Agentic Automation Runtime',reason:'Explores governed multi-agent orchestration, permissions, memory, approvals, and tool execution.',href:'case-study.html?id=dee'}],
      followUpQuestions:['What event starts the process?','Which system currently owns the authoritative data?','Where does manual work or waiting happen today?','What would a successful automated outcome look like?']
    };
  }
})();