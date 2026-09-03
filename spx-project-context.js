(function(){
  if(!window.DCODE_PROJECTS) return;
  const p=window.DCODE_PROJECTS.find(x=>x.id==='ocr');
  if(!p) return;
  Object.assign(p,{
    category:'SPX · Logistics Operations · n8n · WhatsApp · OCR',
    title:'SPX Logistics Operations & Automated Encoding System',
    subtitle:'A first-mile logistics operations workspace that preserves the client’s familiar daily logs and summary reporting while adding route-progress visibility, driver/assistant attendance, trip handover and pay calculations, closing-time risk monitoring, automated WhatsApp escalation, owner oversight, and a screenshot OCR intake layer.',
    status:'Production operations automation · reconstructed unified workspace',
    role:'Enterprise Automation Architect · n8n Workflow Engineer · Operations Systems Designer',
    stack:['Self-hosted n8n','Google Sheets','Microsoft Excel','WhatsApp','SPX Mobile App','Cron Scheduling','Data Normalization','OCR / AI Extraction — Phase 2'],
    metrics:[['5 min','driver compliance monitoring cadence'],['3 attempts','automated follow-ups before admin escalation'],['Hourly','owner operations reporting'],['$0.03','per handed-over parcel compensation basis']],
    problem:'The logistics subcontractor ran a fast-moving first-mile pickup operation from an SPX mobile app and a familiar Excel reporting workbook. Admins continuously watched SPX, manually encoded seller and pickup activity, preserved store timing and closing constraints, tracked route and driver/assistant progress, monitored missed or unable-to-pickup tasks, recorded warehouse handover trips, maintained attendance, calculated trip-based compensation, chased late drivers, and repeatedly updated the owner. The workbook already contained operational knowledge the client depended on, so replacing it with a completely different reporting model would create unnecessary adoption risk.',
    solution:'I organized the existing operating model into one connected workspace rather than replacing the client’s familiar report. The Daily Operations Log remains the detailed seller/task ledger, including timing/closing hours, route, assigned driver/assistant, pickup orders, scanned parcels, on-hold parcels, remarks, tally and rate reference. The same records drive Daily Summary, Route Progress, Pickup Risk, and owner visibility. Warehouse trips retain handed-over parcel counts and responsible people because compensation is calculated from trip evidence at $0.03 per parcel, split 50/50 when a driver and assistant are involved and paid fully to the driver when working alone. Attendance is tracked separately for admins, drivers and assistants. Self-hosted n8n continues to run five-minute late-driver monitoring, bounded WhatsApp follow-ups, escalation and hourly owner reporting. Because SPX has no direct API access, screenshot OCR is positioned as an intake adapter that writes validated values into the same familiar Daily Log.',
    built:[
      'A unified operations workspace that preserves the client’s Daily Operations Log instead of forcing a new reporting vocabulary.',
      'Daily Log fields for Date, Seller Name, store Timing / Closing Time, Address, Route, Driver + Assistant, Pick Up Orders, Scanned Parcels, On-hold Parcels, Remarks, Tally, and the existing $0.03 rate reference.',
      'A Daily Summary generated from the underlying log rows with route totals, task completion, pending work, exceptions, picked parcels, verified handovers, and last-update timestamps.',
      'Route-progress reporting that treats each pickup row as part of the assigned driver/assistant workload so CO, PR, and TA progress can be monitored without a duplicate task tracker.',
      'Owner operations visibility showing when the log was last updated, current driver/assistant and trip state, route progress, and missed/unable-to-pickup risks.',
      'Closing-time monitoring that keeps store operating windows visible because late arrival can convert an open task into a missed pickup.',
      'Warehouse trip and handover records preserving trip number, route, responsible driver, assistant, handed-over parcel quantity, and unload status.',
      'Trip-based compensation logic: handed-over parcels × $0.03, split 50/50 when driver + assistant are involved and assigned 100% to the driver when no assistant participates.',
      'Attendance records for admins, drivers, and assistants with login, logout, elapsed time, status, and last activity.',
      'A five-minute n8n driver-compliance workflow that detects late starts from planned versus actual start state and sends bounded WhatsApp follow-ups.',
      'Escalation after a maximum of three unanswered follow-ups so automation handles routine supervision and admins intervene only on unresolved exceptions.',
      'An hourly owner-report workflow that aggregates route progress, driver status, escalation state, missed-pickup risk, and operational progress.',
      'A Phase 2 SPX screenshot encoder that classifies Task Info versus To-handover screens, extracts the same fields admins currently encode, validates confidence, and writes approved values into the Daily Log.',
      'Operational audit history showing who or what updated the workspace, when it happened, and which report or record was affected.'
    ],
    architecture:['SPX Mobile App','Manual Admin Encoding / Screenshot Intake','Daily Operations Log','Daily Summary + Route Progress','Driver / Assistant / Admin Attendance','Pickup Risk + Closing-Time Monitor','Warehouse Trips + Handover','Trip-Based Pay Calculation','Self-hosted n8n Monitoring + Escalation','Owner Dashboard + Hourly WhatsApp Report','Phase 2 OCR → Validation → Same Daily Log'],
    reliability:['Preserve familiar client report structure','Single operational source of truth','Store timing / closing-hour visibility','Route-to-team accountability','Five-minute scheduled driver monitoring','Maximum three automated follow-ups','Human intervention after escalation','Trip-level handover evidence for pay','Separate attendance records','Owner last-update visibility','Missed / unable pickup exception surfacing','OCR validation + human review','Operational update audit history'],
    outcome:'The portfolio reconstruction now represents the project as a shared logistics operations workspace rather than an isolated OCR utility. Admins retain the reporting structure they already know, drivers and assistants can be tracked through attendance, route work and warehouse trips, and the owner can see progress, last-update time, trip/team status and missed-pickup risk without continuously requesting manual updates. OCR remains a controlled next-step input adapter for removing SPX screenshot re-encoding while preserving the existing operational workflow and report structure.',
    demoLabel:'Launch SPX Operations Workspace'
  });
})();