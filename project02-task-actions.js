(() => {
  const outer = document.getElementById('native');
  if (!outer) return;

  function deepestDoc() {
    try {
      let doc = outer.contentDocument;
      if (!doc) return null;
      for (let i = 0; i < 18; i++) {
        const frame = doc.querySelector('iframe');
        if (!frame || !frame.contentDocument) break;
        doc = frame.contentDocument;
      }
      return doc;
    } catch (_) { return null; }
  }

  function runtime() {
    if (window.__project02WorkerActionsInstalled) return;
    window.__project02WorkerActionsInstalled = true;

    const PROJECT_ID = 'monday-project-ops';
    const STORAGE_KEY = 'dcode-n8n-connections-v1';
    const DEFAULT_WEBHOOK = 'https://herta-unbedabbled-unsynchronously.ngrok-free.dev/webhook/portfolio-enterprise-operations';

    const style = document.createElement('style');
    style.id = 'project02-worker-action-style';
    style.textContent = `
      .p02-work-btn{height:25px;min-width:74px;border:1px solid #c3c7d5;border-radius:4px;background:#fff;color:#323338;padding:0 8px;font:500 9px/1 Arial,sans-serif;cursor:pointer;white-space:nowrap}
      .p02-work-btn:hover{background:#f0f6ff;border-color:#0073ea;color:#0060b9}
      .p02-work-btn.primary{background:#0073ea;border-color:#0073ea;color:#fff}.p02-work-btn.primary:hover{background:#0060b9}
      .p02-work-btn.warn{background:#fff7e6;border-color:#fdab3d;color:#8a5500}
      .p02-work-btn.review{background:#f1edff;border-color:#a25ddc;color:#6f35a5}
      .p02-work-btn[disabled]{opacity:.5;cursor:wait}
      .p02-action-empty{display:inline-flex;align-items:center;justify-content:center;width:100%;color:#b2b6c2;font-size:10px}
      .board-table th.p02-button-head,.board-table td.p02-button-cell{min-width:104px;max-width:124px;text-align:center!important;overflow:visible!important}
      .board-table th.p02-button-head{font-size:10px!important;white-space:normal!important;line-height:1.2!important}
      .p02-toast{position:fixed;right:18px;bottom:18px;z-index:9999;max-width:360px;padding:11px 14px;border-radius:6px;background:#323338;color:#fff;font-size:11px;line-height:1.45;box-shadow:0 8px 30px rgba(0,0,0,.18)}
    `;
    document.head.appendChild(style);

    function toast(message) {
      if (typeof window.toast === 'function') { window.toast(message); return; }
      document.querySelector('.p02-toast')?.remove();
      const el = document.createElement('div');
      el.className = 'p02-toast'; el.textContent = message; document.body.appendChild(el);
      setTimeout(() => el.remove(), 3000);
    }

    function readConfig() {
      try {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        return all[PROJECT_ID] || {};
      } catch (_) { return {}; }
    }

    function clientId() {
      let id = localStorage.getItem('dcode-project02-client-id');
      if (!id) {
        id = (crypto.randomUUID ? crypto.randomUUID() : `client-${Date.now()}-${Math.random().toString(16).slice(2)}`);
        localStorage.setItem('dcode-project02-client-id', id);
      }
      return id;
    }

    async function callBackend(action, payload) {
      const cfg = readConfig();
      const url = cfg.url || DEFAULT_WEBHOOK;
      const envelope = {
        action,
        project: PROJECT_ID,
        clientId: clientId(),
        requestId: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
        sentAt: new Date().toISOString(),
        payload
      };
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(cfg.token ? {'X-Portfolio-Token': cfg.token} : {})
        },
        body: JSON.stringify(envelope)
      });
      const text = await response.text();
      let data = {};
      try { data = text ? JSON.parse(text) : {}; } catch (_) { data = {message:text}; }
      if (!response.ok || data.ok === false) throw new Error(data?.error?.message || data?.message || `n8n HTTP ${response.status}`);
      return data;
    }

    function taskWorker(task) { return task.person || task.responsible || ''; }
    function isReview(task) { return task.status === 'For Review' || task.reviewStatus === 'For Review'; }
    function isApproved(task) { return ['Approved','Completed','Done','Cancelled'].includes(String(task.status || '')) || task.reviewStatus === 'Approved'; }
    function isRevision(task) { return task.status === 'Revision' || /Revision/i.test(String(task.reviewStatus || '')); }

    function openRevision(task) {
      if (typeof revisions === 'undefined') return null;
      return [...revisions]
        .filter(r => {
          const taskMatch = r.task === task.item || r.taskId === task.id || r.task === task.id;
          return taskMatch && !['Resolved','Closed','Approved'].includes(String(r.status || r.state || ''));
        })
        .sort((a,b) => Number(b.revisionNumber || String(b.id||'').replace(/\D/g,'') || 0) - Number(a.revisionNumber || String(a.id||'').replace(/\D/g,'') || 0))[0] || null;
    }

    function button(label, action, taskId, cls='') {
      return `<button type="button" class="p02-work-btn ${cls}" data-p02-work-action="${action}" data-p02-task="${taskId}">${label}</button>`;
    }
    function empty() { return '<span class="p02-action-empty">—</span>'; }

    function actionCellsFor(task) {
      const cells = {
        actionStart: empty(),
        actionPause: empty(),
        actionResume: empty(),
        actionStop: empty(),
        actionReview: empty(),
        actionResolve: empty()
      };
      if (isApproved(task) || isReview(task)) return cells;

      const stateValue = String(task.timerState || 'IDLE').toUpperCase();
      const revision = isRevision(task);
      const hasOpenRevision = revision && !!openRevision(task);

      if (stateValue === 'ACTIVE') {
        cells.actionPause = button('Pause','session.pause',task.id,'warn');
        cells.actionStop = button('Stop','session.stop',task.id,'');
      } else if (stateValue === 'PAUSED') {
        cells.actionResume = button('Resume','session.resume',task.id,'primary');
      } else {
        cells.actionStart = button('Start','session.start',task.id,'primary');
      }

      if (stateValue !== 'ACTIVE') {
        if (hasOpenRevision) cells.actionResolve = button('Resolve','revision.resolve',task.id,'review');
        else cells.actionReview = button('Send','task.sendReview',task.id,'review');
      }
      return cells;
    }

    const ACTION_COLUMNS = [
      ['Start','actionStart'],
      ['Pause','actionPause'],
      ['Resume','actionResume'],
      ['Stop','actionStop'],
      ['Send for Review','actionReview'],
      ['Resolve & Resubmit','actionResolve']
    ];
    const ACTION_KEYS = new Set(['workActions', ...ACTION_COLUMNS.map(c => c[1])]);

    function refreshValues() {
      if (typeof tasks === 'undefined' || typeof schemas === 'undefined' || !schemas.tasks) return false;
      const columns = schemas.tasks.columns;
      for (let i = columns.length - 1; i >= 0; i--) {
        if (ACTION_KEYS.has(columns[i][1])) columns.splice(i, 1);
      }
      const sessionIndex = columns.findIndex(c => c[1] === 'currentSession');
      columns.splice(sessionIndex >= 0 ? sessionIndex + 1 : 8, 0, ...ACTION_COLUMNS.map(c => [...c]));
      tasks.forEach(task => Object.assign(task, actionCellsFor(task)));
      return true;
    }

    function decorateRenderedTable() {
      document.querySelectorAll('.board-table').forEach(table => {
        const headers = [...table.querySelectorAll('thead th')];
        ACTION_COLUMNS.forEach(([label]) => {
          const index = headers.findIndex(th => th.textContent.trim() === label);
          if (index < 0) return;
          headers[index].classList.add('p02-button-head');
          table.querySelectorAll('tbody tr').forEach(row => row.children[index]?.classList.add('p02-button-cell'));
        });
      });
    }

    function rerender() {
      refreshValues();
      if (typeof state !== 'undefined' && state.key === 'tasks' && typeof board === 'function') board();
      requestAnimationFrame(decorateRenderedTable);
    }

    function applyLiveResult(task, action, result) {
      const data = result?.data || {};
      if (data.task) {
        if (data.task.status) task.status = data.task.status;
        if (data.task.reviewState) task.reviewStatus = data.task.reviewState;
        if (data.task.reworkHours != null) task.rework = data.task.reworkHours;
        if (data.task.totalRecordedHours != null) task.totalRecorded = data.task.totalRecordedHours;
      }
      if (['session.start','session.resume'].includes(action)) {
        task.timerState = 'ACTIVE';
        task.currentSession = data.session?.id || task.currentSession || `SES-${Date.now()}`;
      }
      if (action === 'session.pause') { task.timerState='PAUSED'; task.currentSession=''; }
      if (action === 'session.stop') { task.timerState='IDLE'; task.currentSession=''; }
      if (action === 'task.sendReview' || action === 'revision.resolve') {
        task.timerState='IDLE'; task.currentSession=''; task.status='For Review'; task.reviewStatus='For Review';
      }
    }

    function applySynthetic(task, action) {
      if (['session.start','session.resume'].includes(action)) {
        task.timerState='ACTIVE'; task.currentSession=`SES-DEMO-${String(Date.now()).slice(-5)}`;
      } else if (action === 'session.pause') {
        task.timerState='PAUSED'; task.currentSession='';
      } else if (action === 'session.stop') {
        task.timerState='IDLE'; task.currentSession='';
      } else if (action === 'task.sendReview' || action === 'revision.resolve') {
        task.timerState='IDLE'; task.currentSession=''; task.status='For Review'; task.reviewStatus='For Review';
      }
    }

    async function execute(task, action, buttonEl) {
      const worker = taskWorker(task);
      let backendAction = action;
      let payload = {taskId:task.id, worker, actor:worker || 'Portfolio Worker'};

      if (action === 'session.pause' || action === 'session.stop') {
        payload.sessionId = task.currentSession || undefined;
      }
      if (action === 'revision.resolve') {
        const revision = openRevision(task);
        if (!revision) {
          toast('No open revision was found for this task.');
          return;
        }
        backendAction = 'revision.update';
        payload = {
          revisionId: revision.id,
          state: 'Resolved',
          resolutionEvidence: 'Revision completed and resubmitted from the worker task view.',
          actor: worker || 'Portfolio Worker'
        };
      }
      if (action === 'task.sendReview') payload.completionNote = 'Submitted from worker task view.';

      const rowButtons = buttonEl.closest('tr')?.querySelectorAll('[data-p02-work-action]') || [buttonEl];
      rowButtons.forEach(btn => btn.disabled = true);
      try {
        const result = await callBackend(backendAction, payload);
        applyLiveResult(task, action, result);
        toast(`${buttonEl.textContent.trim()} completed in n8n.`);
      } catch (error) {
        applySynthetic(task, action);
        toast(`${buttonEl.textContent.trim()} updated in demo. Live n8n: ${error.message}`);
      } finally {
        rerender();
      }
    }

    if (typeof screen !== 'undefined' && !screen.dataset.project02WorkActionsBound) {
      screen.dataset.project02WorkActionsBound = '1';
      screen.addEventListener('click', event => {
        const btn = event.target.closest('[data-p02-work-action]');
        if (!btn) return;
        event.preventDefault(); event.stopPropagation();
        const task = typeof tasks !== 'undefined' ? tasks.find(t => t.id === btn.dataset.p02Task) : null;
        if (!task) { toast('Task could not be resolved.'); return; }
        execute(task, btn.dataset.p02WorkAction, btn);
      });
    }

    refreshValues();
    if (typeof state !== 'undefined' && state.key === 'tasks' && typeof board === 'function') board();
    requestAnimationFrame(decorateRenderedTable);

    if (typeof screen !== 'undefined') {
      new MutationObserver(() => requestAnimationFrame(() => {
        refreshValues(); decorateRenderedTable();
      })).observe(screen, {childList:true, subtree:true});
    }
  }

  function install() {
    const doc = deepestDoc();
    if (!doc || !doc.body || !doc.getElementById('screen')) return false;
    if (doc.getElementById('project02-worker-actions-runtime')) return true;
    const script = doc.createElement('script');
    script.id = 'project02-worker-actions-runtime';
    script.textContent = `(${runtime.toString()})();`;
    doc.body.appendChild(script);
    return true;
  }

  function start() {
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      if (install() || tries > 240) clearInterval(timer);
    }, 100);
  }

  outer.addEventListener('load', start);
  start();
})();
