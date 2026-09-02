(function () {
  const STORAGE_KEY = 'dcode-n8n-connections-v1';
  const projects = {
    monday: { label: 'Enterprise Operations Workspace', path: 'portfolio-enterprise-operations' },
    ocr: { label: 'SPX OCR Automated Encoder System', path: 'portfolio-spx-ocr' },
    'zoho-migration': { label: 'Enterprise Zoho CRM Engineering & Migration', path: 'portfolio-zoho-migration' },
    sheets: { label: 'Google Sheets-Powered Automation Systems', path: 'portfolio-sheets-automation' },
    'ops-dashboard': { label: 'Custom Operations Dashboard', path: 'portfolio-operations-api' }
  };

  const read = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch (_) { return {}; }
  };
  const write = value => localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  const defaultUrl = id => `https://YOUR-N8N-DOMAIN.example/webhook/${projects[id]?.path || id}`;

  window.DCodeN8n = {
    supported(id) { return Boolean(projects[id]); },
    config(id) {
      const saved = read()[id] || {};
      return { url: saved.url || '', token: saved.token || '', live: Boolean(saved.url) };
    },
    async call(id, action, payload = {}) {
      const cfg = this.config(id);
      const envelope = {
        action,
        project: id,
        requestId: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
        sentAt: new Date().toISOString(),
        payload
      };
      if (!cfg.live) {
        await new Promise(resolve => setTimeout(resolve, 420));
        return { ok: true, mode: 'synthetic', executionId: `DEMO-${Date.now()}`, data: envelope };
      }
      const response = await fetch(cfg.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(cfg.token ? { 'X-Portfolio-Token': cfg.token } : {})
        },
        body: JSON.stringify(envelope)
      });
      const text = await response.text();
      let data;
      try { data = text ? JSON.parse(text) : {}; } catch (_) { data = { message: text }; }
      if (!response.ok) throw new Error(data.message || `n8n returned HTTP ${response.status}`);
      return { ok: true, mode: 'live', ...data };
    },
    openSettings(id) {
      if (!projects[id]) return;
      const current = this.config(id);
      const panel = document.createElement('div');
      panel.className = 'interactive-modal n8n-config-modal';
      panel.innerHTML = `<div class="interactive-modal__backdrop"></div><div class="interactive-modal__panel">
        <div class="modal-head"><div><small>LIVE INTEGRATION</small><h2>Connect ${projects[id].label}</h2></div><button type="button" data-close-modal aria-label="Close">×</button></div>
        <form class="modal-form" id="n8nConfigForm">
          <p class="n8n-config-note">Import the matching JSON from <b>n8n-workflows</b>, activate it, then paste its production webhook URL. Leave blank to keep safe synthetic mode.</p>
          <label>Production webhook URL<input name="url" type="url" value="${current.url}" placeholder="${defaultUrl(id)}"></label>
          <label>Optional shared token<input name="token" type="password" value="${current.token}" autocomplete="off" placeholder="Sent as X-Portfolio-Token"></label>
          <div class="n8n-mode-line"><i class="${current.live ? 'live' : ''}"></i><span>${current.live ? 'Live webhook configured' : 'Synthetic mode active'}</span></div>
          <div class="modal-actions"><button type="button" data-test>Test connection</button><button type="button" data-disconnect>Use synthetic mode</button><button class="primary" type="submit">Save connection</button></div>
        </form></div>`;
      document.body.appendChild(panel);
      const close = () => panel.remove();
      panel.querySelector('.interactive-modal__backdrop').onclick = close;
      panel.querySelector('[data-close-modal]').onclick = close;
      panel.querySelector('[data-disconnect]').onclick = () => {
        const all = read(); delete all[id]; write(all); close(); location.reload();
      };
      panel.querySelector('[data-test]').onclick = async () => {
        const form = panel.querySelector('form');
        const url = form.elements.url.value.trim();
        if (!url) return window.toast?.('Enter a webhook URL first');
        const all = read(); all[id] = { url, token: form.elements.token.value.trim() }; write(all);
        try { await this.call(id, 'health.check', {}); window.toast?.('n8n webhook responded successfully'); }
        catch (error) { window.toast?.(`Connection failed: ${error.message}`); }
      };
      panel.querySelector('form').onsubmit = event => {
        event.preventDefault();
        const form = event.currentTarget;
        const all = read();
        const url = form.elements.url.value.trim();
        if (url) all[id] = { url, token: form.elements.token.value.trim() }; else delete all[id];
        write(all); close(); location.reload();
      };
    }
  };
})();
