(() => {
  const params = new URLSearchParams(location.search);
  if (!/case-study\.html$/.test(location.pathname) || params.get('id') !== 'recruitment') return;
  if (params.get('legacy') === '1') return;
  location.replace('recruitment-case-study-v2.html?v=20260908-secure-roles1');
})();
