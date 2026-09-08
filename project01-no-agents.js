(() => {
  const params = new URLSearchParams(location.search);
  if (!/demo\.html$/.test(location.pathname) || params.get('id') !== 'recruitment') return;

  const root = document.getElementById('demoRoot');
  if (!root) return;

  function clean() {
    root.querySelectorAll('[data-z5-top="Agents"], [data-z5-module="AI Agents"], .p01-ai-nav, .p01-zia-launch, .p01-agent-page, .p01-agent-detail, .p01-zia-portal, .p01-crm-agent-card, .p01-zia-home-agent').forEach(el => el.remove());

    const heading = [...root.querySelectorAll('.z5-module-title h1, h1')].find(el => el.textContent.trim() === 'Agents');
    const legacy = /External resume analysis layer|Recruitment AI Agents|My Agents|Candidate Rediscovery Agent/.test(root.textContent || '');
    if (heading && legacy) {
      const home = root.querySelector('[data-z5-top="Home"]');
      if (home) home.click();
    }
  }

  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      clean();
    });
  };

  new MutationObserver(schedule).observe(root, {childList:true, subtree:true});
  clean();
})();
