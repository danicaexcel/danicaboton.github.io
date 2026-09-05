(() => {
  const VERSION = '20260905-crashfix2';

  function refreshMigrationUrls(root = document) {
    root.querySelectorAll?.('iframe[src*="migration-demo.html"],a[href*="migration-demo.html"],iframe[src*="migration-demo-enterprise.html"],a[href*="migration-demo-enterprise.html"],iframe[src*="migration-demo-control.html"],a[href*="migration-demo-control.html"]').forEach(el => {
      const attr = el.tagName === 'IFRAME' ? 'src' : 'href';
      const current = el.getAttribute(attr) || '';
      const isEmbed = /[?&]embed=1(?:&|$)/.test(current);
      const next = `migration-demo-control.html?${isEmbed ? 'embed=1&' : ''}v=${VERSION}`;
      if (current !== next) el.setAttribute(attr, next);
    });
  }

  function flattenCaseStudyFlow() {
    if (!document.querySelector('.mig-flow')) return;
    const css = `
      .mig-flow{counter-reset:mig-step;display:block!important;margin-top:18px!important;border-top:1px solid #414850!important}
      .mig-flow>div{counter-increment:mig-step;display:grid!important;grid-template-columns:38px minmax(170px,220px) minmax(0,1fr)!important;gap:14px!important;align-items:start!important;position:relative!important;min-height:0!important;padding:13px 15px 13px 12px!important;border:1px solid #414850!important;border-top:0!important;background:#20262c!important}
      .mig-flow>div:before{content:counter(mig-step,decimal-leading-zero)!important;position:static!important;display:block!important;min-width:0!important;width:auto!important;height:auto!important;padding:2px 0 0!important;border:0!important;border-radius:0!important;background:none!important;color:#7f8b96!important;font:700 9px/1.2 "IBM Plex Mono",monospace!important;letter-spacing:.03em!important}
      .mig-flow>div:after{content:""!important;position:absolute!important;left:0!important;top:0!important;bottom:0!important;right:auto!important;width:3px!important;height:auto!important;background:#59636d!important}
      .mig-flow b{margin:0!important;color:#f4f6f8!important;font-size:11px!important;line-height:1.45!important}
      .mig-flow span{margin:0!important;color:#aeb6bf!important;font-size:10px!important;line-height:1.55!important}
      @media(max-width:720px){.mig-flow>div{grid-template-columns:30px minmax(0,1fr)!important;gap:8px 12px!important}.mig-flow span{grid-column:2!important}}
    `;
    let style = document.getElementById('migration-enterprise-flow-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'migration-enterprise-flow-style';
      document.head.appendChild(style);
    }
    if (style.textContent !== css) style.textContent = css;
  }

  function init() {
    refreshMigrationUrls();
    flattenCaseStudyFlow();
  }

  init();
  setTimeout(init, 150);
  setTimeout(init, 700);
})();