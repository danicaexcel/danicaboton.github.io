(function(){
  if(!window.DCODE_PROJECTS) return;
  const p=window.DCODE_PROJECTS.find(x=>x.id==='ocr');
  if(!p) return;
  Object.assign(p,{
    category:'SPX · Logistics Ops · n8n · WhatsApp · OCR',
    title:'SPX Logistics Operations & Automated Encoding System',
    subtitle:'A first-mile logistics operations system that normalizes SPX activity, automates late-driver follow-up and escalation, generates hourly owner visibility, and isolates screenshot OCR as the next intake layer where direct SPX API access is unavailable.',
    status:'Production operations automation · OCR intake phase reconstructed',
    role:'Enterprise Automation Architect · n8n Workflow Engineer',
    stack:['Self-hosted n8n','Google Sheets','Microsoft Excel','WhatsApp','SPX Mobile App','Cron Scheduling','Data Normalization','OCR / AI Extraction — Phase 2'],
    metrics:[
      ['5 min','driver compliance monitoring cadence'],
      ['3 attempts','automated follow-ups before admin escalation'],
      ['Hourly','owner operations reporting'],
      ['1 source','normalized operational source of truth']
    ],
    problem:'The logistics subcontractor operated a fast-moving first-mile pickup process with admins continuously watching the SPX mobile app, manually encoding operational updates into Excel, checking whether drivers started on time, following up delayed drivers by phone, monitoring pickup progress and missed pickups, and sending hourly WhatsApp updates to the owner. Late starts could cause store closures, missed pickups, financial penalties, and delayed warehouse handovers, while repetitive monitoring consumed most of the admin team’s attention.',
    solution:'I designed the automation around a single normalized operational source of truth instead of adding disconnected trackers. Raw operational sheets were normalized into an automation-safe driver-operation table, then self-hosted n8n ran a five-minute compliance monitor that compared planned and actual start times, sent WhatsApp follow-ups, bounded retries to three attempts, and escalated unresponsive drivers to admins. A separate hourly workflow aggregated active, delayed, completed, and escalated operations into a structured owner report. Because SPX did not provide direct API access, the remaining manual boundary was intentionally isolated at SPX-to-sheet encoding so a screenshot OCR encoder could later replace that step without redesigning the downstream monitoring architecture.',
    built:[
      'A normalized automation-ready operations layer using one row per driver operation with Date, Driver Name, Phone, Route / Area, Planned Start Time, Actual Start Time, Actual End Time, Status, Followup Count, and Remarks.',
      'A five-minute n8n driver-compliance workflow that detects a late start when planned time has passed and actual start time is still empty.',
      'Automated WhatsApp follow-ups to drivers with a bounded maximum of three attempts before the workflow changes the operation to an unresponsive/escalated state.',
      'Admin escalation logic that moves only unresolved exceptions to human intervention instead of forcing admins to manually chase every driver.',
      'An hourly owner-report workflow that aggregates active drivers, delayed drivers, route assignments, escalation state, and operational progress into a structured WhatsApp update.',
      'Centralized status management so driver monitoring, escalation, and management reporting read from the same normalized operational record rather than separate spreadsheets.',
      'Operational auditability through follow-up counters, status transitions, timestamps, remarks, escalation records, and workflow execution evidence.',
      'A Phase 2 SPX screenshot encoder design that classifies Task Info versus To-handover screens, extracts operational fields, validates the result, and writes approved values into the same normalized data layer.',
      'Screenshot extraction targets based on the real manual encoding process: task/reference ID, seller/store, pickup address, operating hours, service tags, pending/picked-up/on-hold quantities, weight, volume, store-level pickup totals, total orders, and handed-over counts.',
      'Human review handling for uncertain screenshot extraction so ambiguous OCR values do not silently enter the operational source of truth.'
    ],
    architecture:['SPX Mobile App','Manual Admin Encoding — current boundary','Raw Excel / Operations Input','Normalization Layer','Automation-Ready Operations Sheet','Self-hosted n8n','5-Minute Driver Compliance Monitor','WhatsApp Follow-up + Escalation','Hourly Owner Operations Report','Phase 2: SPX Screenshot → OCR → Validation → Same Operations Sheet'],
    reliability:['Single source of operational truth','One row per driver operation','No merged/title/summary rows in automation layer','Five-minute scheduled monitoring','Maximum three automated follow-ups','Human intervention only after escalation','Centralized status synchronization','Audit trail for follow-ups and status changes','OCR validation + review queue','Manual fallback when extraction is uncertain'],
    outcome:'The implemented automation moved routine driver supervision and hourly management reporting out of manual admin work while preserving a clear human escalation path for real exceptions. The architecture also isolated the one unavoidable manual dependency—reading SPX and encoding its operational state—because direct SPX API access was unavailable. The reconstructed OCR encoder demonstrates how screenshots from Task Info and To-handover screens can feed the same normalized source of truth, extending the system without creating a second operational tracker.',
    demoLabel:'Launch SPX Operations Demo'
  });
})();
