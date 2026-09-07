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

  const icons = {
    integrate: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6.1 3.2l2.3 2.3-2 2-2.3-2.3M13.9 16.8l-2.3-2.3 2-2 2.3 2.3M5.5 14.5l9-9M12.1 3.4l4.5 4.5M3.4 12.1l4.5 4.5"/></svg>',
    automate: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3V1.8M7.1 4.2h5.8a3 3 0 013 3v5.2a3 3 0 01-3 3H7.1a3 3 0 01-3-3V7.2a3 3 0 013-3zM7.1 9h.1M12.8 9h.1M7.2 12.1h5.6M2.2 9.1h1.9M15.9 9.1h1.9"/></svg>',
    agents: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6.2 14.8c1.1-1.1 1.7-2.4 1.7-3.8 0-1.8-1-3.5-2.6-4.4M13.8 5.2c-1.1 1.1-1.7 2.4-1.7 3.8 0 1.8 1 3.5 2.6 4.4M5.3 6.6L3.7 6l.2-1.7M14.7 13.4l1.6.6-.2 1.7"/></svg>',
    chat: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.1 4.3h11.8a2 2 0 012 2v6.3a2 2 0 01-2 2H9l-4.2 2.6.7-2.6H4.1a2 2 0 01-2-2V6.3a2 2 0 012-2z"/></svg>',
    link: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8.2 12.6l3.6-3.6M6.8 14H5.3a3.3 3.3 0 010-6.6h2.6M13.2 6h1.5a3.3 3.3 0 010 6.6h-2.6"/></svg>'
  };

  function ensureStyle(doc) {
    if (doc.getElementById('project02-header-actions-style')) return;
    const style = doc.createElement('style');
    style.id = 'project02-header-actions-style';
    style.textContent = `
      .title-row .actions{display:flex!important;align-items:center!important;gap:3px!important;color:#323338!important;font:400 12px/1 Arial,sans-serif!important}
      .title-row .actions .p02-head-action{height:32px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;padding:0 7px!important;border:0!important;border-radius:4px!important;background:transparent!important;color:#323338!important;white-space:nowrap!important;cursor:pointer!important;font-weight:400!important}
      .title-row .actions .p02-head-action:hover{background:#f1f2f6!important}
      .title-row .actions .p02-head-action svg{width:16px!important;height:16px!important;display:block!important;fill:none!important;stroke:#53576a!important;stroke-width:1.45!important;stroke-linecap:round!important;stroke-linejoin:round!important;flex:0 0 16px!important}
      .title-row .actions .p02-head-icon{width:32px!important;padding:0!important}
      .title-row .actions .p02-head-avatar{width:28px!important;height:28px!important;display:grid!important;place-items:center!important;border-radius:50%!important;background:#f65f7c!important;color:#fff!important;font:700 9px/1 Arial,sans-serif!important;margin:0 4px!important}
      .title-row .actions .p02-head-invite{height:30px!important;border:1px solid #c3c7d5!important;border-radius:4px 0 0 4px!important;padding:0 9px!important;margin-left:1px!important}
      .title-row .actions .p02-head-link{height:30px!important;width:31px!important;border:1px solid #c3c7d5!important;border-left:0!important;border-radius:0 4px 4px 0!important;margin-left:-3px!important}
      .title-row .actions .p02-head-more{width:30px!important;height:30px!important;display:grid!important;place-items:center!important;border-radius:4px!important;color:#323338!important;font-size:17px!important;letter-spacing:1px!important;font-weight:700!important;cursor:pointer!important}
      .title-row .actions .p02-head-more:hover{background:#f1f2f6!important}
      @media(max-width:1120px){.title-row .actions .p02-head-label{display:none!important}.title-row .actions .p02-head-action{width:32px!important;padding:0!important}.title-row .actions .p02-head-invite{width:auto!important;padding:0 8px!important}.title-row .actions .p02-head-invite .p02-head-label{display:inline!important}}
    `;
    doc.head.appendChild(style);
  }

  function setAction(el, type, label, extra='') {
    if (!el || el.dataset.p02HeaderFixed === type) return;
    el.dataset.p02HeaderFixed = type;
    el.classList.add('p02-head-action');
    if (extra) el.classList.add(extra);
    el.innerHTML = `${icons[type] || ''}${label ? `<span class="p02-head-label">${label}</span>` : ''}`;
    if (label) el.setAttribute('aria-label', label);
  }

  function bindHeaderAgent(doc, actions) {
    const agent = [...actions.children].find(el => /Agents/i.test(el.textContent || '') || el.getAttribute('aria-label') === 'Agents');
    if (!agent || agent.dataset.p02AgentProxyBound) return;
    agent.dataset.p02AgentProxyBound = '1';
    agent.setAttribute('title', 'Open AI Project Manager Agent');
    agent.addEventListener('click', event => {
      const rail = [...doc.querySelectorAll('.native-rail-item')].find(el => /Agents/i.test(el.textContent || ''));
      if (!rail) return;
      event.preventDefault();
      event.stopPropagation();
      rail.click();
    });
  }

  function apply() {
    const doc = deepestDoc();
    if (!doc || !doc.body) return false;
    ensureStyle(doc);
    doc.querySelectorAll('.title-row .actions').forEach(actions => {
      const children = [...actions.children];
      children.forEach(el => {
        const text = (el.textContent || '').trim();
        if (/Integrate/i.test(text)) setAction(el, 'integrate', 'Integrate');
        else if (/Automate/i.test(text)) setAction(el, 'automate', text.replace(/^[^A-Za-z]*/, '').trim() || 'Automate');
        else if (/Agents/i.test(text)) setAction(el, 'agents', 'Agents');
        else if (/Invite/i.test(text)) {
          el.dataset.p02HeaderFixed = 'invite';
          el.classList.add('p02-head-action','p02-head-invite');
          el.innerHTML = '<span class="p02-head-label">Invite / 1</span>';
          el.setAttribute('aria-label','Invite / 1');
        } else if (/^[◯○◌]$/.test(text)) setAction(el, 'chat', '', 'p02-head-icon');
        else if (/^•{3}$/.test(text) || /^\.{3}$/.test(text)) {
          el.dataset.p02HeaderFixed = 'more';
          el.classList.add('p02-head-more');
          el.textContent = '•••';
          el.setAttribute('aria-label','More');
        }
      });

      const invite = [...actions.children].find(el => /Invite/i.test(el.textContent || ''));
      if (invite && !actions.querySelector('.p02-head-avatar')) {
        const avatar = doc.createElement('span');
        avatar.className = 'p02-head-avatar'; avatar.textContent = 'T&'; avatar.setAttribute('aria-label','Workspace member');
        actions.insertBefore(avatar, invite);
      }
      if (invite && !actions.querySelector('.p02-head-link')) {
        const link = doc.createElement('button');
        link.type = 'button'; link.className = 'p02-head-action p02-head-link'; link.innerHTML = icons.link; link.setAttribute('aria-label','Copy board link');
        invite.insertAdjacentElement('afterend', link);
      }
      bindHeaderAgent(doc, actions);
    });
    return true;
  }

  function start() {
    let tries = 0;
    const timer = setInterval(() => { tries++; if (apply() || tries > 240) clearInterval(timer); }, 100);
    const watcher = setInterval(() => {
      const doc = deepestDoc();
      const screen = doc && doc.getElementById('screen');
      if (screen && !screen.dataset.p02HeaderActionsObserved) {
        screen.dataset.p02HeaderActionsObserved = '1';
        new MutationObserver(() => requestAnimationFrame(apply)).observe(screen, {childList:true, subtree:true});
        clearInterval(watcher);
      }
    }, 150);
    setTimeout(() => clearInterval(watcher), 30000);
  }

  outer.addEventListener('load', start);
  start();
})();
