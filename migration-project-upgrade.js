(() => {
  const id = new URLSearchParams(location.search).get('id');
  const isLegacyMigrationCase = /case-study\.html$/.test(location.pathname) && id === 'zoho-migration';

  if (isLegacyMigrationCase) {
    location.replace('migration-case-study.html?v=20260905-crashfix2');
    return;
  }

  const subtitle = 'Large-volume recruitment migration where JazzHR-sourced resumes/files are processed from Google Drive, candidate basics and professional data are extracted and cleaned, duplicates are controlled, Zoho records are verified, and the original resume file is uploaded to the Zoho candidate record.';

  function updateCard() {
    const card = document.querySelector('.project[data-id="zoho-migration"]');
    if (!card) return false;

    const copy = card.querySelector('.projectcopy > p');
    if (copy) copy.textContent = subtitle;

    const status = card.querySelector('.projecttop .status');
    if (status) status.textContent = 'Production migration reconstruction · Google Drive + AI extraction + Zoho resume upload';

    const chips = card.querySelector('.chips');
    if (chips) chips.innerHTML = [
      'Google Drive API',
      'Apploi Source',
      'AI Resume Extraction',
      'Data Cleaning + Dedupe',
      'Zoho Resume Upload'
    ].map(x => `<span class="chip">${x}</span>`).join('');

    const metrics = card.querySelector('.metricline');
    if (metrics) metrics.innerHTML = '<div class="mini"><strong>120K+</strong><span>overall migration program</span></div><div class="mini"><strong>2 lanes</strong><span>source-selectable / parallel capable</span></div>';

    const caseLink = card.querySelector('.projectactions a[href*="case-study"]');
    if (caseLink) caseLink.href = 'migration-case-study.html?v=20260905-crashfix2';

    const iframe = card.querySelector('iframe');
    if (iframe && /migration-demo/.test(iframe.src)) iframe.src = 'migration-demo-control.html?embed=1&v=20260905-crashfix2';

    return true;
  }

  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    if (updateCard() || tries > 100) clearInterval(timer);
  }, 100);
  updateCard();
})();