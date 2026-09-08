(() => {
  const params = new URLSearchParams(location.search);
  if (!/demo\.html$/.test(location.pathname) || params.get('id') !== 'recruitment') return;

  const root = document.getElementById('demoRoot');
  if (!root) return;

  const style = document.createElement('style');
  style.id = 'p01-native-agent-route-guard-style';
  style.textContent = `
    #demoRoot [data-z5-top="Agents"],
    #demoRoot [data-z5-module="AI Agents"],
    #demoRoot .p01-ai-nav { display:none !important; }
  `;
  document.head.appendChild(style);

  function returnToHomeIfLegacyAgentScreen() {
    const heading = root.querySelector('.z5-module-title h1, .p01-agent-head h1');
    const text = root.textContent || '';
    const legacy =
      root.querySelector('.p01-agent-shell') ||
      /Recruitment AI Agents/i.test(heading?.textContent || '') ||
      ((heading?.textContent || '').trim() === 'Agents' && /External resume analysis layer/i.test(text));
    if (!legacy) return;

    const home = root.querySelector('[data-z5-top="Home"]');
    if (home) home.click();
  }

  function clean() {
    root.querySelectorAll('[data-z5-top="Agents"], [data-z5-module="AI Agents"], .p01-ai-nav').forEach(el => el.remove());
    returnToHomeIfLegacyAgentScreen();
  }

  document.addEventListener('click', event => {
    const legacyRoute = event.target.closest?.('[data-z5-top="Agents"], [data-z5-module="AI Agents"], .p01-ai-nav');
    if (!legacyRoute) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    setTimeout(returnToHomeIfLegacyAgentScreen, 0);
  }, true);

  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; clean(); });
  };
  new MutationObserver(schedule).observe(root, {childList:true, subtree:true});
  clean();
})();
