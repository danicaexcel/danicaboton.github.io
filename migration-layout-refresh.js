(() => {
  const VERSION = '20260905-pipeline-layout1';

  function refreshMigrationUrls(root = document) {
    root.querySelectorAll?.('iframe[src*="migration-demo.html"],a[href*="migration-demo.html"]').forEach(el => {
      const attr = el.tagName === 'IFRAME' ? 'src' : 'href';
      const current = el.getAttribute(attr) || '';
      const isEmbed = /[?&]embed=1(?:&|$)/.test(current);
      const next = `migration-demo.html?${isEmbed ? 'embed=1&' : ''}v=${VERSION}`;
      if (current !== next) el.setAttribute(attr, next);
    });
  }

  refreshMigrationUrls();
  setTimeout(refreshMigrationUrls, 0);
  setTimeout(refreshMigrationUrls, 250);
  setTimeout(refreshMigrationUrls, 900);

  new MutationObserver(records => {
    let shouldRefresh = false;
    records.forEach(record => {
      if (record.type === 'attributes' && /^(src|href)$/.test(record.attributeName || '')) shouldRefresh = true;
      if (record.addedNodes?.length) shouldRefresh = true;
    });
    if (shouldRefresh) refreshMigrationUrls();
  }).observe(document.documentElement, {subtree:true, childList:true, attributes:true, attributeFilter:['src','href']});
})();