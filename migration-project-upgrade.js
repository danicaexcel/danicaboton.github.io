(() => {
  const projectId = new URLSearchParams(location.search).get('id');
  const isMigrationCase = /case-study\.html$/.test(location.pathname) && projectId === 'zoho-migration';

  const subtitle = 'Large-volume recruitment migration across JazzHR, Apploi, and Google Drive resumes with API ingestion, data cleaning, deduplication, AI professional-data extraction, facility mapping, controlled Zoho writes, checkpointed batch controls, and reconciliation.';

  function updateHomeCard() {
    const card = document.querySelector('.project[data-id="zoho-migration"]');
    if (!card || card.dataset.migrationPipelineUpdated === '1') return !!card;
    card.dataset.migrationPipelineUpdated = '1';
    const copy = card.querySelector('.projectcopy > p');
    if (copy) copy.textContent = subtitle;
    const status = card.querySelector('.projecttop .status');
    if (status) status.textContent = 'Production migration reconstruction · multi-source API + Drive + AI pipeline';
    const chips = card.querySelector('.chips');
    if (chips) chips.innerHTML = ['JazzHR API','Apploi API','Google Drive API','AI Resume Extraction','Data Cleaning + Dedupe'].map(x => `<span class="chip">${x}</span>`).join('');
    const metrics = card.querySelector('.metricline');
    if (metrics) metrics.innerHTML = '<div class="mini"><strong>120K+</strong><span>overall migration program</span></div><div class="mini"><strong>3 inputs</strong><span>JazzHR · Apploi · Google Drive</span></div>';
    return true;
  }

  function findContentByHeading(text) {
    return [...document.querySelectorAll('.case-content')].find(section => [...section.querySelectorAll('h2,h3')].some(h => h.textContent.trim() === text));
  }

  function setList(container, items) {
    const ul = container?.querySelector('ul');
    if (ul) ul.innerHTML = items.map(item => `<li>${item}</li>`).join('');
  }

  function addCaseStyle() {
    if (document.getElementById('migration-case-upgrade-style')) return;
    const style = document.createElement('style');
    style.id = 'migration-case-upgrade-style';
    style.textContent = `
      .migration-pipeline-evidence{margin:28px 0 8px;border:1px solid #414850;background:#22282e;padding:18px}
      .migration-pipeline-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;margin-bottom:16px}
      .migration-pipeline-head h3{margin:0;color:#fff;font-size:17px}.migration-pipeline-head p{margin:4px 0 0;color:#aeb6bf;font-size:11px;line-height:1.55;max-width:760px}
      .migration-source-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.migration-source{border:1px solid #46505a;background:#1b2025;padding:14px}.migration-source small{display:block;color:#f5b36d;font:700 8px/1.3 "IBM Plex Mono",monospace;text-transform:uppercase;letter-spacing:.06em}.migration-source strong{display:block;color:#fff;font-size:12px;margin:7px 0 5px}.migration-source code{display:block;color:#aeb6bf;font:8px/1.45 "IBM Plex Mono",monospace;overflow-wrap:anywhere}.migration-source span{display:block;color:#8f9aa6;font-size:9px;line-height:1.45;margin-top:6px}
      .migration-flow{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:7px;margin-top:12px}.migration-flow div{position:relative;border:1px solid #46505a;background:#282f36;padding:11px 9px;min-height:83px}.migration-flow div:not(:last-child):after{content:'→';position:absolute;right:-8px;top:31px;color:#f5b36d;z-index:2}.migration-flow b{display:block;color:#fff;font-size:9px}.migration-flow span{display:block;color:#9ea9b4;font-size:8px;line-height:1.4;margin-top:5px}
      .migration-case-note{margin-top:12px;padding:11px 13px;border-left:3px solid #f5b36d;background:rgba(245,179,109,.06);color:#bfc7cf;font-size:10px;line-height:1.55}
      @media(max-width:900px){.migration-source-grid{grid-template-columns:1fr}.migration-flow{grid-template-columns:repeat(2,minmax(0,1fr))}.migration-flow div:after{display:none}}
      @media(max-width:560px){.migration-flow{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function updateCaseStudy() {
    if (!isMigrationCase || !document.querySelector('.casehero')) return false;
    if (document.body.dataset.migrationCaseUpgraded === '1') return true;
    document.body.dataset.migrationCaseUpgraded = '1';
    addCaseStyle();

    const sub = document.querySelector('.casehero .casesub');
    if (sub) sub.textContent = subtitle;

    const noteLabel = document.querySelector('.casehero .implementation-note > span');
    const noteCopy = document.querySelector('.casehero .implementation-note > p');
    if (noteLabel) noteLabel.textContent = 'Multi-source migration + AI extraction architecture';
    if (noteCopy) noteCopy.textContent = 'JazzHR and Apploi provide source candidate records through their API integrations, while Google Drive provides the resume files referenced by the migration manifest. Records are normalized and deduplicated before resume text is extracted and converted into structured professional data with AI. Confidence, source conflicts, facility mapping, and duplicate decisions are validated before controlled Zoho CRM / Recruit writes. Batch state, checkpoints, retries, verification, and reconciliation make the migration resumable and auditable.';

    const casebar = document.querySelector('.casehero .casebar');
    if (casebar) {
      const existing = new Set([...casebar.querySelectorAll('span')].map(s => s.textContent.trim()));
      ['JazzHR API','Apploi API','Google Drive API','AI Resume Extraction','Data Cleaning & Deduplication'].forEach(label => {
        if (existing.has(label)) return;
        const span = document.createElement('span'); span.textContent = label; casebar.appendChild(span);
      });
    }

    const relationship = document.querySelector('.relationship-section');
    if (relationship && !relationship.querySelector('.migration-pipeline-evidence')) {
      const head = relationship.querySelector('.relationship-head p');
      if (head) head.textContent = 'The migration architecture begins with source APIs and Google Drive resume evidence, then applies normalization, duplicate controls, structured AI extraction, confidence review, facility resolution, controlled Zoho writes, and final reconciliation.';
      const shell = relationship.querySelector('.erd-shell');
      const block = document.createElement('div');
      block.className = 'migration-pipeline-evidence';
      block.innerHTML = `
        <div class="migration-pipeline-head"><div><h3>Source → clean → deduplicate → extract → validate → migrate</h3><p>The public case study shows sanitized endpoint contracts and synthetic records. Credentials, private tenant hosts, candidate PII, and resume bodies are intentionally excluded.</p></div></div>
        <div class="migration-source-grid">
          <div class="migration-source"><small>Source ATS 01</small><strong>JazzHR REST API</strong><code>GET https://api.resumatorapi.com/v1/applicants</code><span>Applicant IDs, contact metadata, application context, pagination checkpoint.</span></div>
          <div class="migration-source"><small>Source ATS 02</small><strong>Apploi API</strong><code>GET https://&lt;tenant-api-host&gt;/candidates</code><span>Tenant endpoint is sanitized in the public reconstruction; source candidate IDs remain the safe migration key.</span></div>
          <div class="migration-source"><small>Resume evidence</small><strong>Google Drive API</strong><code>GET https://www.googleapis.com/drive/v3/files/{fileId}?alt=media</code><span>Resume filename, file ID, MIME type, Drive link, SHA-256 fingerprint, and authorized file retrieval.</span></div>
        </div>
        <div class="migration-flow">
          <div><b>Normalize</b><span>Email, phone, name, date, facility aliases, nulls, encodings.</span></div>
          <div><b>Deduplicate</b><span>Source ID, normalized contact, resume hash, similarity review.</span></div>
          <div><b>Resume Text</b><span>PDF / DOCX / supported image extraction with file provenance.</span></div>
          <div><b>AI Professional Data</b><span>Role, company, skills, experience, education, employment history, licenses.</span></div>
          <div><b>Confidence Gate</b><span>Source conflicts and low-confidence fields route to controlled review.</span></div>
          <div><b>Zoho Write</b><span>Duplicate-safe search/create/update with facility lookup and read-back.</span></div>
          <div><b>Reconcile</b><span>Every row ends migrated, duplicate-handled, or exception-held.</span></div>
        </div>
        <div class="migration-case-note"><strong>Migration control:</strong> production-style batches are checkpointed. Start begins a controlled execution, Pause stops new reads while preserving the checkpoint, Resume continues from the next safe record, and Stop closes the run deliberately.</div>`;
      if (shell) relationship.querySelector('.wrap')?.insertBefore(block, shell); else relationship.querySelector('.wrap')?.appendChild(block);
    }

    const context = findContentByHeading('What needed to change');
    if (context) {
      const columns = context.querySelectorAll('.casegrid > div');
      if (columns[0]?.querySelector('p')) columns[0].querySelector('p').textContent = 'The migration program was not just a CSV import. Candidate records came from multiple recruitment systems, while many resumes were stored separately in Google Drive. Source values needed normalization, duplicate candidates had to be identified before destination creates, professional information had to be extracted from resumes, facility names had to resolve to the correct Zoho lookup, and uncertain records required a review path. Without those controls, a high-volume load could create duplicate candidates, overwrite better source data, lose resume provenance, or produce totals that could not be reconciled.';
      if (columns[1]?.querySelector('p')) columns[1].querySelector('p').textContent = 'I designed a staged migration pipeline that reads JazzHR and Apploi records through source API integrations, retrieves resume files from Google Drive, cleans and normalizes candidate data, applies deterministic and similarity-based duplicate rules, extracts structured professional data from resume content using AI, scores confidence and source conflicts, resolves facility lookups, and then performs controlled Zoho writes with verification. Batch execution is checkpointed so it can start, pause, resume, or stop safely, with every source row receiving a final migrated, duplicate, or exception disposition.';
    }

    const scope = findContentByHeading('What I built');
    if (scope) setList(scope, [
      'JazzHR source API ingestion with pagination, stable applicant IDs, bounded retries, and restart checkpoints.',
      'Apploi source API ingestion using tenant-scoped credentials and a preserved source candidate ID for traceability and safe reprocessing.',
      'Google Drive resume ingestion using file IDs / links, MIME validation, authorized file download, source filename preservation, and SHA-256 file fingerprints.',
      'A cleaning layer for email, phone, names, dates, null placeholders, Unicode / whitespace issues, address fields, and legacy facility aliases before matching or migration.',
      'A deduplication process using processed source IDs, normalized email + phone, resume file hashes, and controlled similarity review so ambiguous candidates are held rather than silently merged.',
      'Resume text extraction for PDF, DOC/DOCX, and supported image resumes while retaining file provenance and avoiding resume-body content in operational logs.',
      'Structured AI extraction of professional title, current / previous company, skills, years of experience, education, employment history, licenses / credentials, and a professional summary.',
      'Per-record confidence and conflict handling that combines trusted ATS fields with AI-derived fields under explicit precedence rules and routes uncertain values to review.',
      'Facility normalization and lookup resolution before the destination write, including exception handling for ambiguous or missing facility matches.',
      'Source-to-Zoho field mapping for candidate identity, contact, address, professional profile, credentials, resume evidence, facility, confidence, and source metadata.',
      'Controlled Zoho CRM / Recruit API search, create, and update operations with OAuth credentials isolated from candidate payloads and read-back verification after writes.',
      'Operational migration controls for Start, Pause, Resume, and Stop, with batch checkpoints that prevent an interrupted run from restarting blindly from row one.',
      'Retry and rate-limit handling, duplicate-create guards, correlation IDs, exception records, processing history, and final source-to-destination reconciliation.',
      'Compliance and processing-evidence reports that document PII inventory, access boundaries, API security, exception handling, audit history, and unresolved policy items without exposing real candidate data.'
    ]);

    const architecture = document.querySelector('#architecture .case-content');
    if (architecture) {
      const label = architecture.querySelector('.architecture-label');
      if (label) label.textContent = 'JazzHR + Apploi + Google Drive → cleaning / dedupe → AI extraction → Zoho CRM / Recruit';
      const arch = architecture.querySelector('.arch');
      if (arch) {
        const steps = ['JazzHR API Intake','Apploi API Intake','Google Drive Resume Retrieval','Normalize Source Fields','Deduplicate Candidate + Resume','Extract Resume Text','AI Professional Data Extraction','Confidence + Source Conflict Gate','Facility Lookup Resolution','Controlled Zoho Search / Write','Read-back Verification','Reconciliation + Audit'];
        arch.innerHTML = steps.map((step,i) => `<span class="archstep" data-index="${String(i+1).padStart(2,'0')}">${step}</span>`).join('');
      }
      const reliability = [...architecture.querySelectorAll('h3')].find(h => h.textContent.trim() === 'Reliability & controls')?.parentElement;
      if (reliability) setList(reliability, ['Source pagination checkpoints','Start / Pause / Resume / Stop batch state','Source-ID idempotency','Email / phone / resume-hash deduplication','Ambiguous duplicate review','Google Drive file provenance','Structured AI output validation','Confidence + source-conflict gate','Facility lookup validation','OAuth / secret isolation','Bounded retry + rate-limit backoff','Zoho read-back verification','Per-row disposition','Batch reconciliation and processing audit']);
      const outcome = [...architecture.querySelectorAll('h3')].find(h => h.textContent.trim() === 'Outcome / current state')?.parentElement?.querySelector('p');
      if (outcome) outcome.textContent = 'The migration is represented as an operable pipeline rather than a one-time import: source records and resume files retain provenance, candidate data is cleaned and duplicate-controlled before destination writes, professional resume information is extracted into structured fields with AI and confidence gates, and every controlled batch can be paused, resumed, stopped, verified, and reconciled. The public reconstruction uses synthetic records and sanitized API contracts while preserving the engineering responsibilities of the production work.';
    }

    const demoCta = document.querySelector('#demo .demo-cta');
    if (demoCta) {
      const kicker = demoCta.querySelector('.kicker');
      const h2 = demoCta.querySelector('h2');
      const p = demoCta.querySelector('p');
      if (kicker) kicker.textContent = 'Migration control center';
      if (h2) h2.textContent = 'Open the full migration pipeline.';
      if (p) p.textContent = 'The demo now exposes source API connections, Google Drive resume intake, cleaning and deduplication, structured AI professional-data extraction, field mapping, Start / Pause / Resume / Stop migration controls, cross-system API execution, reconciliation, compliance evidence, and processing history.';
    }
    return true;
  }

  function apply() {
    const homeDone = updateHomeCard();
    const caseDone = updateCaseStudy();
    return homeDone || caseDone;
  }

  let attempts = 0;
  const timer = setInterval(() => {
    attempts++;
    if (apply() || attempts > 80) clearInterval(timer);
  }, 100);
  apply();
})();