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
      .p02-work-actions{display:flex;align-items:center;gap:5px;min-width:230px;overflow:visible}
      .p02-work-btn{height:25px;border:1px solid #c3c7d5;border-radius:4px;background:#fff;color:#323338;padding:0 8px;font:500 9px/1 Arial,sans-serif;cursor:pointer;white-space:nowrap}
      .p02-work-btn:hover{background:#f0f6ff;border-color:#0073ea;color:#0060b9}
      .p02-work-btn.primary{background:#0073ea;border-color:#0073ea;color:#fff}.p02-work-btn.primary:hover{background:#0060b9}
      .p02-work-btn.warn{background:#fff7e6;border-color:#fdab3d;color:#8a5500}
      .p02-work-btn.review{background:#f1edff;border-color:#a25ddc;color:#6f35a5}
      .p02-work-btn[disabled]{opacity:.5;cursor:wait}
      .p02-work-state{display:inline-flex;align-items:center;height:25px;padding:0 8px;border-radius:4px;background:#f1f3f6;color:#676879;font-size:9px;white-space:nowrap}
      .p02-work-state.review{background:#ede8fb;color:#6f35a5}.p02-work-state.done{background:#e7f7ef;color:#057a4d}
      .board-table th.p02-actions-head,.board-table td.p02-actions-cell{min-width:238px;max-width:238px;overflow:visible!important}
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

    function actionsFor(task) {
      if (isApproved(task)) return '<span class="p02-work-state done">✓ Approved / complete</span>';
      if (isReview(task)) return '<span class="p02-work-state review">Awaiting reviewer decision</span>';

      const stateValue = String(task.timerState || 'IDLE').toUpperCase();
      const revision = isRevision(task);
      const parts = [];
      if (stateValue === 'ACTIVE') {
        parts.push(button('Pause','session.pause',task.id,'warn'));
        parts.push(button('Stop Work','session.stop',task.id,''));
      } else if (stateValue === 'PAUSED') {
        parts.push(button(revision ? 'Resume Revision' : 'Resume Work','session.resume',task.id,'primary'));
      } else {
        parts.push(button(revision ? 'Start Revision' : 'Start Work','session.start',task.id,'primary'));
      }

      if (stateValue !== 'ACTIVE') {
        if (revision && openRevision(task)) parts.push(button('Resolve & Resubmit','revision.resolve',task.id,'review'));
        else parts.push(button('Send for Review','task.sendReview',task.id,'review'));
      }
      return `<div class="p02-work-actions">${parts.join('')}</div>`;
    }

    function refreshValues() {
      if (typeof tasks === 'undefined' || typeof schemas === 'undefined' || !schemas.tasks) return false;
      const columns = schemas.tasks.columns;
      if (!columns.some(c => c[1] === 'workActions')) {
        const sessionIndex = columns.findIndex(c => c[1] === 'currentSession');
        columns.splice(sessionIndex >= 0 ? sessionIndex + 1 : 8, 0, ['Work Actions','workActions']);
      }
      tasks.forEach(task => { task.workActions = actionsFor(task); });
      return true;
    }

    function decorateRenderedTable() {
      document.querySelectorAll('.board-table').forEach(table => {
        const headers = [...table.querySelectorAll('thead th')];
        const index = headers.findIndex(th => th.textContent.trim() === 'Work Actions');
        if (index < 0) return;
        headers[index].classList.add('p02-actions-head');
        table.querySelectorAll('tbody tr').forEach(row => row.children[index]?.classList.add('p02-actions-cell'));
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

      const rowButtons = buttonEl.closest('.p02-work-actions')?.querySelectorAll('button') || [buttonEl];
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
