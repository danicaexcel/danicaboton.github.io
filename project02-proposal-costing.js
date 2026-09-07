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
    if (window.__project02ProposalCostingInstalled) return;
    window.__project02ProposalCostingInstalled = true;

    const state = {
      version: 1,
      status: 'Draft',
      approved: false,
      applied: false,
      revisionNote: '',
      fileText: '',
      lastPlan: null
    };

    const style = document.createElement('style');
    style.id = 'project02-proposal-costing-style';
    style.textContent = `
      .p02-proposal-chip{border-color:#7c3aed!important;color:#6f35a5!important;background:#faf8ff!important}.p02-proposal-chip:hover{background:#f2edff!important}
      .p02-proposal-card{border:1px solid #d7dbe3;background:#fff;border-radius:9px;padding:12px}.p02-proposal-card h3{margin:0 0 4px;font-size:11px;color:#323338}.p02-proposal-card p{margin:0;color:#676879;font-size:9px;line-height:1.5}
      .p02-proposal-form{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.p02-proposal-form label{display:grid;gap:4px;color:#676879;font-size:8px}.p02-proposal-form label.wide{grid-column:1/-1}.p02-proposal-form input,.p02-proposal-form select,.p02-proposal-form textarea{width:100%;border:1px solid #c7cbd5;border-radius:5px;background:#fff;color:#323338;padding:7px 8px;font:9px/1.4 Arial,sans-serif}.p02-proposal-form textarea{min-height:60px;resize:vertical}
      .p02-proposal-actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}.p02-proposal-btn{min-height:30px;border:1px solid #c3c7d5;border-radius:4px;background:#fff;color:#323338;padding:0 9px;font:600 9px/1 Arial,sans-serif;cursor:pointer}.p02-proposal-btn.primary{background:#0073ea;border-color:#0073ea;color:#fff}.p02-proposal-btn.approve{background:#7c3aed;border-color:#7c3aed;color:#fff}.p02-proposal-btn[disabled]{opacity:.45;cursor:not-allowed}
      .p02-proposal-output{margin-top:10px;border-top:1px solid #eef0f4;padding-top:10px}.p02-proposal-meta{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.p02-proposal-kpi{border:1px solid #e2e5eb;background:#fafbfc;padding:7px}.p02-proposal-kpi span{display:block;color:#8a8f9e;font-size:7px;text-transform:uppercase}.p02-proposal-kpi b{display:block;margin-top:3px;color:#323338;font-size:9px}
      .p02-proposal-table{width:100%;border-collapse:collapse;margin-top:9px;font-size:8px}.p02-proposal-table th,.p02-proposal-table td{padding:6px 7px;border-bottom:1px solid #eceef3;text-align:left}.p02-proposal-table th{color:#676879;font-weight:600;background:#fafbfc}.p02-proposal-table td:last-child,.p02-proposal-table th:last-child{text-align:right}
      .p02-proposal-file{display:flex;align-items:center;gap:8px;margin-top:9px;padding:8px;border:1px solid #d9dde5;border-radius:6px;background:#f8f9fb}.p02-proposal-file-icon{width:28px;height:32px;border-radius:4px;background:#ece9ff;color:#6f35a5;display:grid;place-items:center;font-size:8px;font-weight:700}.p02-proposal-file div{min-width:0}.p02-proposal-file b{display:block;color:#323338;font-size:9px}.p02-proposal-file small{display:block;color:#8a8f9e;font-size:7px;margin-top:2px}.p02-proposal-file-actions{margin-left:auto;display:flex;gap:5px}
      .p02-proposal-status{display:inline-flex;align-items:center;padding:3px 6px;border-radius:4px;background:#fff7e6;color:#8a5500;font-size:7px;font-weight:700}.p02-proposal-status.approved{background:#eaf8f2;color:#087f5b}.p02-proposal-note{margin-top:8px;padding:8px;border-left:3px solid #fdab3d;background:#fffaf0;color:#675b46;font-size:8px;line-height:1.5}.p02-proposal-note.ok{border-left-color:#00c875;background:#f2fbf7;color:#375f4b}
      .p02-proposal-preview{position:fixed;inset:0;z-index:10020;background:rgba(41,43,51,.45);display:none;align-items:center;justify-content:center;padding:24px}.p02-proposal-preview.open{display:flex}.p02-proposal-sheet{width:min(760px,96vw);max-height:90vh;overflow:auto;background:#fff;border-radius:10px;border:1px solid #d0d4e4;padding:28px;color:#323338;box-shadow:0 20px 55px rgba(50,51,56,.25)}.p02-proposal-sheet-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding-bottom:14px;border-bottom:1px solid #e1e4ea}.p02-proposal-sheet h2{margin:0;font-size:20px}.p02-proposal-sheet h3{margin:18px 0 8px;font-size:12px}.p02-proposal-sheet p,.p02-proposal-sheet li{font-size:10px;line-height:1.6;color:#53576a}.p02-proposal-sheet table{width:100%;border-collapse:collapse;font-size:9px}.p02-proposal-sheet th,.p02-proposal-sheet td{padding:7px;border:1px solid #e2e5eb;text-align:left}.p02-proposal-sheet .close{border:0;background:#f1f2f6;border-radius:4px;width:30px;height:30px;cursor:pointer}
      @media(max-width:700px){.p02-proposal-form,.p02-proposal-meta{grid-template-columns:1fr 1fr}.p02-proposal-file{align-items:flex-start}.p02-proposal-file-actions{flex-direction:column}.p02-proposal-sheet{padding:18px}}
      @media(max-width:460px){.p02-proposal-form,.p02-proposal-meta{grid-template-columns:1fr}.p02-proposal-form label.wide{grid-column:auto}}
    `;
    document.head.appendChild(style);

    const preview = document.createElement('div');
    preview.className = 'p02-proposal-preview';
    preview.id = 'p02ProposalPreview';
    preview.innerHTML = '<article class="p02-proposal-sheet"><div class="p02-proposal-sheet-head"><div><small>Generated proposal file · demo preview</small><h2>Project Proposal Plan</h2></div><button class="close" type="button" aria-label="Close proposal preview">×</button></div><div id="p02ProposalPreviewBody"></div></article>';
    document.body.appendChild(preview);
    preview.querySelector('.close').addEventListener('click', () => preview.classList.remove('open'));
    preview.addEventListener('click', event => { if (event.target === preview) preview.classList.remove('open'); });

    const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const money = value => '$' + Number(value || 0).toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0});
    const num = (value, fallback=0) => { const n = Number(value); return Number.isFinite(n) ? n : fallback; };

    function projectOptions() {
      const rows = typeof projects === 'undefined' ? [] : projects;
      return rows.map(p => `<option value="${esc(p.id)}">${esc(p.item)}</option>`).join('');
    }

    function calculate(budget, weeks, reservePct) {
      budget = Math.max(1000, num(budget, 12000));
      weeks = Math.max(1, Math.round(num(weeks, 8)));
      reservePct = Math.min(25, Math.max(0, num(reservePct, 8)));
      const phases = [
        {phase:'Discovery & scope', role:'PM / BA', rate:55, pct:.10},
        {phase:'UX / UI planning', role:'Designer', rate:40, pct:.15},
        {phase:'Build & integration', role:'Engineer', rate:45, pct:.50},
        {phase:'QA / UAT', role:'QA', rate:38, pct:.15},
        {phase:'PM, handover & release', role:'PM', rate:55, pct:.10}
      ];
      const laborBudget = budget * (1 - reservePct / 100);
      let subtotal = 0, hours = 0;
      const rows = phases.map(phase => {
        const cost = laborBudget * phase.pct;
        const phaseHours = cost / phase.rate;
        subtotal += cost; hours += phaseHours;
        return {...phase, cost, hours:phaseHours};
      });
      const reserve = budget - subtotal;
      const weeklyHours = hours / weeks;
      return {budget,weeks,reservePct,rows,subtotal,reserve,total:subtotal+reserve,hours,weeklyHours};
    }

    function proposalMarkdown(plan, form) {
      const rows = plan.rows.map(r => `| ${r.phase} | ${r.role} | $${r.rate}/h | ${r.hours.toFixed(1)} h | ${money(r.cost)} |`).join('\n');
      return `# ${form.projectName} — Proposal Plan v${state.version}\n\n**Client / project:** ${form.projectName}\n**Target budget:** ${money(plan.budget)}\n**Timeline:** ${plan.weeks} weeks\n**Status:** ${state.status}\n\n## Client brief\n${form.brief}\n\n## Costed delivery plan\n| Phase | Role | Rate | Hours | Cost |\n|---|---|---:|---:|---:|\n${rows}\n\n**Planned labor:** ${money(plan.subtotal)}\n**Risk reserve (${plan.reservePct}%):** ${money(plan.reserve)}\n**Proposal total:** ${money(plan.total)}\n**Estimated effort:** ${plan.hours.toFixed(1)} hours\n**Average delivery load:** ${plan.weeklyHours.toFixed(1)} hours/week\n\n## Approval workflow\nDraft → Request revision or Approve → Approved baseline → Monday project plan\n\n${state.revisionNote ? `## Revision note\n${state.revisionNote}\n` : ''}`;
    }

    function previewHtml(plan, form) {
      return `<p><strong>${esc(form.projectName)}</strong></p><p>${esc(form.brief)}</p><h3>Costed delivery plan</h3><table><thead><tr><th>Phase</th><th>Role</th><th>Rate</th><th>Hours</th><th>Cost</th></tr></thead><tbody>${plan.rows.map(r=>`<tr><td>${esc(r.phase)}</td><td>${esc(r.role)}</td><td>$${r.rate}/h</td><td>${r.hours.toFixed(1)}</td><td>${money(r.cost)}</td></tr>`).join('')}</tbody></table><h3>Commercial summary</h3><p>Planned labor: <strong>${money(plan.subtotal)}</strong><br>Risk reserve (${plan.reservePct}%): <strong>${money(plan.reserve)}</strong><br>Proposal total: <strong>${money(plan.total)}</strong><br>Estimated effort: <strong>${plan.hours.toFixed(1)} h</strong><br>Timeline: <strong>${plan.weeks} weeks</strong></p><h3>Approval state</h3><p>${esc(state.status)}${state.revisionNote ? `<br>Revision note: ${esc(state.revisionNote)}` : ''}</p>`;
    }

    function currentForm(card) {
      const projectId = card.querySelector('[name="proposalProject"]')?.value || '';
      const project = typeof projects === 'undefined' ? null : projects.find(p => p.id === projectId);
      return {
        projectId,
        projectName: project?.item || 'Client Project',
        brief: card.querySelector('[name="proposalBrief"]')?.value.trim() || 'Client brief pending.',
        budget: num(card.querySelector('[name="proposalBudget"]')?.value, 12000),
        weeks: num(card.querySelector('[name="proposalWeeks"]')?.value, 8),
        reservePct: num(card.querySelector('[name="proposalReserve"]')?.value, 8)
      };
    }

    function resultMarkup(plan, form) {
      const fileName = `${form.projectName.replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'') || 'Project'}-Proposal-v${state.version}.md`;
      return `<div class="p02-proposal-output"><div class="p02-proposal-meta"><div class="p02-proposal-kpi"><span>Target budget</span><b>${money(plan.budget)}</b></div><div class="p02-proposal-kpi"><span>Estimated effort</span><b>${plan.hours.toFixed(1)} h</b></div><div class="p02-proposal-kpi"><span>Timeline</span><b>${plan.weeks} weeks</b></div><div class="p02-proposal-kpi"><span>Status</span><b><span class="p02-proposal-status ${state.approved?'approved':''}">${esc(state.status)}</span></b></div></div><table class="p02-proposal-table"><thead><tr><th>Phase</th><th>Role</th><th>Hours</th><th>Cost</th></tr></thead><tbody>${plan.rows.map(r=>`<tr><td>${esc(r.phase)}</td><td>${esc(r.role)} · $${r.rate}/h</td><td>${r.hours.toFixed(1)}</td><td>${money(r.cost)}</td></tr>`).join('')}<tr><td colspan="3"><b>Risk reserve (${plan.reservePct}%)</b></td><td><b>${money(plan.reserve)}</b></td></tr><tr><td colspan="3"><b>Proposal total</b></td><td><b>${money(plan.total)}</b></td></tr></tbody></table><div class="p02-proposal-file"><span class="p02-proposal-file-icon">FILE</span><div><b>${esc(fileName)}</b><small>Generated proposal plan · client brief + scope + hours + costing + approval state</small></div><div class="p02-proposal-file-actions"><button class="p02-proposal-btn" type="button" data-p02-proposal="preview">Preview</button><button class="p02-proposal-btn" type="button" data-p02-proposal="download">Download</button></div></div>${state.revisionNote?`<div class="p02-proposal-note">Revision requested: ${esc(state.revisionNote)}</div>`:''}${state.approved?`<div class="p02-proposal-note ok">Approved by project owner. The proposal can now become the Monday project baseline.</div>`:''}<div class="p02-proposal-actions"><button class="p02-proposal-btn" type="button" data-p02-proposal="revision" ${state.approved?'disabled':''}>Request revision</button><button class="p02-proposal-btn approve" type="button" data-p02-proposal="approve" ${state.approved?'disabled':''}>${state.approved?'Proposal approved':'Approve proposal'}</button><button class="p02-proposal-btn primary" type="button" data-p02-proposal="apply" ${!state.approved||state.applied?'disabled':''}>${state.applied?'Baseline applied to Monday':'Apply approved baseline'}</button></div></div>`;
    }

    function renderProposalCard() {
      const messages = document.querySelector('#p02NativeAgents .p02-na-msgs');
      if (!messages) return;
      messages.querySelector('#p02CostingCard')?.remove();
      const wrapper = document.createElement('div');
      wrapper.className = 'p02-na-msg';
      wrapper.id = 'p02CostingCard';
      wrapper.innerHTML = `<span class="p02-na-msg-avatar" style="background:#7c3aed">SP</span><div class="p02-na-bubble"><strong>Planner Agent · Client proposal + costing</strong><div class="p02-proposal-card"><h3>Turn the client brief into a costed proposal plan.</h3><p>Give the Planner the scope, target budget, timeline and project. It will build a phased plan, estimate hours/cost, generate a proposal file, then wait for revision or approval.</p><div class="p02-proposal-form"><label class="wide">Client brief<textarea name="proposalBrief">Build the approved client scope with discovery, UX planning, implementation, QA/UAT, project management and handover. Keep the plan within budget and preserve a delivery-risk reserve.</textarea></label><label>Monday project<select name="proposalProject">${projectOptions()}</select></label><label>Target budget (USD)<input name="proposalBudget" type="number" min="1000" step="500" value="12000"></label><label>Timeline (weeks)<input name="proposalWeeks" type="number" min="1" max="52" value="8"></label><label>Risk reserve %<input name="proposalReserve" type="number" min="0" max="25" value="8"></label></div><div class="p02-proposal-actions"><button class="p02-proposal-btn primary" type="button" data-p02-proposal="generate">Generate proposal plan</button></div><div id="p02ProposalResult"></div></div></div>`;
      messages.appendChild(wrapper);
      wrapper.scrollIntoView({behavior:'smooth',block:'nearest'});
    }

    function regenerate(card, isRevision=false) {
      if (isRevision) {
        const note = window.prompt('What should the Planner revise?', state.revisionNote || 'Reduce unnecessary scope while keeping QA/UAT and the approved delivery outcome.');
        if (note === null) return;
        state.revisionNote = note.trim() || 'Revise proposal based on project-owner feedback.';
        state.version += 1;
        state.status = 'Revised draft';
        state.approved = false;
        state.applied = false;
      }
      const form = currentForm(card);
      const plan = calculate(form.budget, form.weeks, form.reservePct);
      state.lastPlan = {plan, form};
      state.fileText = proposalMarkdown(plan, form);
      const result = card.querySelector('#p02ProposalResult');
      if (result) result.innerHTML = resultMarkup(plan, form);
    }

    function downloadFile() {
      if (!state.fileText || !state.lastPlan) return;
      const name = `${state.lastPlan.form.projectName.replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'') || 'Project'}-Proposal-v${state.version}.md`;
      const blob = new Blob([state.fileText], {type:'text/markdown;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 500);
    }

    function applyBaseline() {
      if (!state.approved || !state.lastPlan || state.applied) return;
      const {plan, form} = state.lastPlan;
      const project = typeof projects === 'undefined' ? null : projects.find(p => p.id === form.projectId);
      if (project) {
        project.planned = Math.round(plan.hours * 10) / 10;
        project.budget = Math.round(plan.budget);
        project.notes = `Approved Planner Agent proposal v${state.version}: ${form.brief}`;
        project.updated = 'Sep 7, 2026';
      }
      if (typeof logs !== 'undefined' && Array.isArray(logs)) {
        logs.unshift({group:'Agent Actions',item:`Planner proposal v${state.version} approved`,id:`LOG-AI-${Date.now()}`,time:'Sep 7, 2026',actor:'Monday Planner Agent',action:'Apply approved proposal baseline',project:form.projectName,task:'',type:'Project',record:form.projectId,previous:'Draft proposal',next:'Approved baseline',result:'Success',workflow:'Native Monday Agent',execution:`AGENT-${Date.now()}`,notes:'Client brief, costed phases, planned hours and approved budget applied after project-owner approval.'});
      }
      state.applied = true;
      state.status = 'Approved · baseline applied';
      state.fileText = proposalMarkdown(plan, form);
      const card = document.querySelector('#p02CostingCard .p02-proposal-card');
      if (card) card.querySelector('#p02ProposalResult').innerHTML = resultMarkup(plan, form);
      if (typeof state !== 'undefined' && state.key === 'projects' && typeof board === 'function') board();
    }

    function ensureChip() {
      const backdrop = document.getElementById('p02NativeAgents');
      if (!backdrop) return false;
      const switcher = backdrop.querySelector('#p02NaSwitch');
      const chips = backdrop.querySelector('.p02-na-chips');
      if (!switcher || switcher.value !== 'planner' || !chips) return true;
      if (chips.querySelector('[data-p02-proposal-open]')) return true;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'p02-na-chip p02-proposal-chip';
      button.dataset.p02ProposalOpen = '1';
      button.textContent = 'Build client proposal + costing';
      chips.appendChild(button);
      return true;
    }

    document.addEventListener('click', event => {
      const open = event.target.closest('[data-p02-proposal-open]');
      if (open) { event.preventDefault(); renderProposalCard(); return; }
      const action = event.target.closest('[data-p02-proposal]');
      if (!action) return;
      const card = action.closest('.p02-proposal-card');
      if (!card) return;
      const key = action.dataset.p02Proposal;
      if (key === 'generate') regenerate(card, false);
      if (key === 'revision') regenerate(card, true);
      if (key === 'approve' && state.lastPlan) {
        state.approved = true; state.status = 'Approved'; state.applied = false;
        state.fileText = proposalMarkdown(state.lastPlan.plan, state.lastPlan.form);
        card.querySelector('#p02ProposalResult').innerHTML = resultMarkup(state.lastPlan.plan, state.lastPlan.form);
      }
      if (key === 'apply') applyBaseline();
      if (key === 'preview' && state.lastPlan) {
        preview.querySelector('#p02ProposalPreviewBody').innerHTML = previewHtml(state.lastPlan.plan, state.lastPlan.form);
        preview.classList.add('open');
      }
      if (key === 'download') downloadFile();
    });

    document.addEventListener('change', event => {
      if (event.target?.id === 'p02NaSwitch') setTimeout(ensureChip, 0);
    });

    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      const backdrop = document.getElementById('p02NativeAgents');
      if (backdrop) {
        ensureChip();
        if (!backdrop.dataset.p02ProposalObserved) {
          backdrop.dataset.p02ProposalObserved = '1';
          new MutationObserver(() => ensureChip()).observe(backdrop, {childList:true, subtree:true});
        }
        clearInterval(timer);
      }
      if (tries > 240) clearInterval(timer);
    }, 100);
  }

  function install() {
    const doc = deepestDoc();
    if (!doc || !doc.body || doc.getElementById('project02-proposal-costing-runtime')) return !!doc?.getElementById('project02-proposal-costing-runtime');
    const script = doc.createElement('script');
    script.id = 'project02-proposal-costing-runtime';
    script.textContent = `(${runtime.toString()})();`;
    doc.body.appendChild(script);
    return true;
  }

  function start() {
    let tries = 0;
    const timer = setInterval(() => { tries += 1; if (install() || tries > 240) clearInterval(timer); }, 100);
  }

  outer.addEventListener('load', start);
  start();
})();
