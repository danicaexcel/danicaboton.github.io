(() => {
  const EMAIL = 'boton.danicamarie@gmail.com';

  function ensureDialog() {
    let dialog = document.getElementById('workflowContactDialog');
    if (dialog) return dialog;

    const style = document.createElement('style');
    style.textContent = `
      .workflow-contact-dialog{width:min(520px,calc(100vw - 32px));padding:0;border:1px solid rgba(255,255,255,.13);border-radius:22px;background:#2e343a;color:#f5f7fa;box-shadow:18px 18px 42px rgba(10,13,17,.5),-8px -8px 24px rgba(77,87,98,.2)}
      .workflow-contact-dialog::backdrop{background:rgba(7,9,12,.72);backdrop-filter:blur(6px)}
      .workflow-contact-dialog__body{position:relative;padding:34px}
      .workflow-contact-dialog__eyebrow{display:block;margin-bottom:12px;color:#f5b36d;font:700 9px/1.3 "IBM Plex Mono",monospace;letter-spacing:.12em;text-transform:uppercase}
      .workflow-contact-dialog h2{margin:0 42px 12px 0;color:#fff;font:600 clamp(28px,6vw,42px)/1 "Bricolage Grotesque",sans-serif;letter-spacing:-.045em}
      .workflow-contact-dialog p{margin:0;color:#b9c1cb;font-size:14px;line-height:1.65}
      .workflow-contact-dialog__actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:26px}
      .workflow-contact-dialog__actions a,.workflow-contact-dialog__actions button,.workflow-contact-dialog__close{min-height:44px;border:1px solid #4b5662;border-radius:11px;background:#293038;color:#f5f7fa;padding:0 16px;font:700 11px/1 "IBM Plex Mono",monospace;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}
      .workflow-contact-dialog__actions .primary{border-color:#f5b36d;background:#f5b36d;color:#20252a}
      .workflow-contact-dialog__close{position:absolute;top:18px;right:18px;width:44px;padding:0;border-radius:50%;font-size:18px}
      @media(max-width:520px){.workflow-contact-dialog__body{padding:28px 22px}.workflow-contact-dialog__actions{display:grid}.workflow-contact-dialog__actions a,.workflow-contact-dialog__actions button{width:100%}}
      @media(prefers-reduced-motion:reduce){.workflow-contact-dialog::backdrop{backdrop-filter:none}}
    `;
    document.head.appendChild(style);

    dialog = document.createElement('dialog');
    dialog.id = 'workflowContactDialog';
    dialog.className = 'workflow-contact-dialog';
    dialog.setAttribute('aria-labelledby', 'workflowContactTitle');
    dialog.innerHTML = `
      <div class="workflow-contact-dialog__body">
        <button class="workflow-contact-dialog__close" type="button" aria-label="Close workflow contact dialog">×</button>
        <span class="workflow-contact-dialog__eyebrow">Private implementation review</span>
        <h2 id="workflowContactTitle">Contact me to view the n8n workflow.</h2>
        <p>The public portfolio protects workflow credentials and implementation details. I can walk you through the actual architecture, nodes, error handling, and execution evidence during an interview or private review.</p>
        <div class="workflow-contact-dialog__actions">
          <a class="primary" href="mailto:${EMAIL}?subject=n8n%20workflow%20review">Email Danica</a>
          <a href="index.html#contact">Go to contact section</a>
        </div>
      </div>
    `;
    document.body.appendChild(dialog);

    dialog.querySelector('.workflow-contact-dialog__close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
    return dialog;
  }

  function isN8nAction(element) {
    if (!element) return false;
    if (element.hasAttribute('data-workflow-contact')) return true;
    const label = [element.textContent, element.getAttribute('aria-label'), element.getAttribute('title')].filter(Boolean).join(' ');
    return /\bn8n\b/i.test(label);
  }

  function prepareWorkflowActions(root = document) {
    root.querySelectorAll?.('a,button').forEach(action => {
      if (!isN8nAction(action)) return;
      action.setAttribute('data-workflow-contact', '');
      const visibleLabel = action.textContent.trim();
      if (visibleLabel.length > 2 && /(connect|open|view)\b/i.test(visibleLabel)) {
        action.textContent = 'View n8n workflow';
      }
    });
  }

  function projectUsesN8n(project) {
    return project?.stack?.some(item => /\bn8n\b/i.test(item));
  }

  function addWorkflowButton(container) {
    if (!container || container.querySelector('[data-workflow-contact]')) return;
    const button = document.createElement('button');
    button.className = 'btn';
    button.type = 'button';
    button.setAttribute('data-workflow-contact', '');
    button.textContent = 'View n8n workflow';
    container.appendChild(button);
  }

  function enrichProjectActions() {
    if (!Array.isArray(window.DCODE_PROJECTS)) return;
    document.querySelectorAll('.project').forEach((card, index) => {
      const project = card.dataset.id
        ? window.DCODE_PROJECTS.find(item => item.id === card.dataset.id)
        : window.DCODE_PROJECTS[index];
      if (projectUsesN8n(project)) addWorkflowButton(card.querySelector('.projectactions'));
    });

    const caseId = new URLSearchParams(location.search).get('id');
    const caseProject = window.DCODE_PROJECTS.find(item => item.id === caseId);
    if (projectUsesN8n(caseProject)) {
      addWorkflowButton(document.querySelector('.casehero .actions'));
      addWorkflowButton(document.querySelector('.demo-cta .actions'));
    }
  }

  function keepPortalInLab() {
    document.querySelectorAll('a[href*="demo.html?id=portal"],iframe[src*="demo.html?id=portal"]').forEach(element => {
      const attribute = element.tagName === 'IFRAME' ? 'src' : 'href';
      element.setAttribute(attribute, 'secure-candidate-review.html');
    });
  }

  enrichProjectActions();
  keepPortalInLab();
  prepareWorkflowActions();
  new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
    if (node.nodeType === 1) prepareWorkflowActions(node);
  }))).observe(document.body, {childList:true, subtree:true});

  document.querySelectorAll('#openCase,#caseLink,a[href*="case-study.html"]').forEach(link => {
    link.setAttribute('target', '_top');
  });

  document.addEventListener('click', event => {
    const action = event.target.closest('a,button');
    if (!isN8nAction(action)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const dialog = ensureDialog();
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }, true);
})();
