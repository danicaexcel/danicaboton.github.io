(() => {
  const important = (el, prop, value) => el && el.style.setProperty(prop, value, 'important');

  function fillMigrationViewport() {
    if (!document.body.classList.contains('project-zoho-migration')) return;

    const root = document.getElementById('demoRoot');
    const mount = document.getElementById('migrationMount');
    const product = mount?.querySelector(':scope > .demo-product');
    const top = product?.querySelector(':scope > .demo-top');
    const app = product?.querySelector(':scope > .demo-app');
    const side = app?.querySelector(':scope > .side');
    const main = app?.querySelector(':scope > .main');
    if (!root || !mount || !product || !app) return;

    [document.documentElement, document.body].forEach(el => {
      important(el, 'height', '100%');
      important(el, 'min-height', '100%');
      important(el, 'margin', '0');
      important(el, 'overflow', 'hidden');
    });

    const wrap = document.querySelector('main.demo-wrap');
    [wrap, root].forEach(el => {
      important(el, 'position', 'relative');
      important(el, 'width', '100%');
      important(el, 'height', '100vh');
      important(el, 'min-height', '100vh');
      important(el, 'max-height', '100vh');
      important(el, 'margin', '0');
      important(el, 'padding', '0');
      important(el, 'overflow', 'hidden');
    });

    important(root, 'background', '#f3f6fa');

    [mount, product].forEach(el => {
      important(el, 'position', 'absolute');
      important(el, 'inset', '0');
      important(el, 'width', '100%');
      important(el, 'height', '100%');
      important(el, 'min-height', '0');
      important(el, 'max-height', 'none');
      important(el, 'overflow', 'hidden');
      important(el, 'background', '#f3f6fa');
    });

    important(product, 'display', 'block');

    if (top) {
      important(top, 'position', 'absolute');
      important(top, 'left', '0');
      important(top, 'right', '0');
      important(top, 'top', '0');
      important(top, 'height', '54px');
      important(top, 'z-index', '2');
    }

    important(app, 'position', 'absolute');
    important(app, 'left', '0');
    important(app, 'right', '0');
    important(app, 'top', top ? '54px' : '0');
    important(app, 'bottom', '0');
    important(app, 'height', top ? 'calc(100% - 54px)' : '100%');
    important(app, 'min-height', '0');
    important(app, 'overflow', 'hidden');
    important(app, 'background', '#f3f6fa');

    [side, main].forEach(el => {
      important(el, 'height', '100%');
      important(el, 'min-height', '0');
    });
    important(main, 'background', '#f3f6fa');
  }

  const observer = new MutationObserver(fillMigrationViewport);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  addEventListener('resize', fillMigrationViewport);
  addEventListener('load', fillMigrationViewport);
  requestAnimationFrame(fillMigrationViewport);
})();
