window.DCODE_PROJECTS = [
  {
    id: 'recruitment',
    order: '01',
    category: 'Zoho Recruit · Deluge · n8n AI Screening',
    title: 'Recruitment Operations Platform',
    subtitle: 'A Zoho Recruit operating system with native CRM automation, Deluge controls, recruiter reports, and an n8n AI screening workflow connected to a secure hiring-manager portal.',
    status: 'Production Zoho + n8n evidence · reconstructed interface',
    role: 'Systems Architect · Zoho Recruit Engineer · Automation Developer',
    stack: ['Zoho CRM / Recruit','Deluge','Workflow Rules','Blueprint','Reports & Analytics','Webhooks','n8n','OpenAI / Gemini-ready'],
    metrics: [
      ['1,432','documented Zoho Recruit webhook calls'],
      ['48/day','documented AI screening call average'],
      ['7-12 sec','typical n8n screening execution'],
      ['88','sample AI score written back to Zoho']
    ],
    problem: 'Recruitment activity was spread across candidates, applications, job openings, facilities, recruiter follow-up, reporting, and hiring-manager decisions. Recruiters needed AI-assisted ranking inside Zoho Recruit without giving external hiring managers unrestricted access to the ATS or Zoho credentials.',
    solution: 'I kept Zoho Recruit as the system of record and used native configuration, workflow rules, Blueprints, reports, and Deluge where the logic belonged inside Zoho. For resume screening and hiring-manager handoff, I used a controlled external n8n layer: Zoho Recruit sends the Application ID, n8n retrieves the application, resume, and job context, runs structured AI evaluation, validates the output, writes the result back to Zoho, and exposes approved candidate data to the secure client portal.',
    built: [
      'Applicant/Application, candidate, job opening, facility, task, meeting, and activity structures in Zoho Recruit/CRM, including familiar Kanban, tile, and table views.',
      'Zoho-native workflow rules, schedules, Blueprint stages, approval behavior, and custom Deluge functions for operational automation.',
      'Stage-based recruitment history and defensive Deluge functions that preserve prior subform rows, validate record state, and verify updates.',
      'Custom fields and layouts for structured evaluation, recruiter decisions, processing state, experience, education, skills, and supporting evidence.',
      'Zoho Recruit Applications list configuration where AI Score and Fit Level are visible for recruiter ranking, filtering, and prioritization.',
      'n8n AI Resume Screening workflow triggered from the Applications module webhook using Application ID as the stable retrieval, logging, reprocessing, and write-back key.',
      'Resume attachment lookup, download, file-type detection, text extraction, job-description extraction, payload preparation, AI model call, output parsing, and explicit error path inside n8n.',
      'Structured AI analysis fields written directly to the Zoho Recruit record: AI Score, Fit Level, Recommendation, Justification, Key Skills, Missing Skills, Experience Match, Education Match, Processing Date, and Processing Status.',
      'Secure Hiring Manager Client Portal handoff pattern where only approved candidate data, score/verdict context, interview actions, and decision updates leave the internal Zoho Recruit workspace.',
      'Model-flexible architecture proven with OpenAI GPT-4.1 nano and designed so the model layer can be swapped to Google Gemini while retaining the same Zoho webhook, n8n validation, and write-back contract.',
      'API and webhook integrations only where an external system genuinely required them, with validation, deduplication, and post-write verification.',
      'Four Facility → Position reporting families: Recruitment Activity, Candidate Loss Reasons, Job Opening History, and Applicant & Sourcing activity, with Daily/Weekly/Monthly/YTD views, running totals, and Excel-ready exports.',
      'Recruitment analytics dashboard available from both Home and Analytics using Zoho CRM-native component types such as KPI, comparator, funnel, donut/bar/line charts, and table charts.',
      'Zoho-style Workqueue reconstruction for recruiter open activities and personal work queues, plus native Reports list navigation.',
      'Automation evidence area modeled on Zoho Setup: workflow rules and schedules use synthetic names/data, while Deluge function analytics and execution-log metrics reproduce non-client operational evidence from the surviving production screenshots.'
    ],
    architecture: ['Zoho Recruit Application Event','Applications Webhook','n8n Resume Screening Run','Resume + Job Context Extraction','Structured AI Evaluation','Validated Zoho Write-back','Recruiter Ranking View','Secure Portal Handoff','Reports / Analytics'],
    reliability: ['Defensive Deluge checks','Processing status fields','Structured-output validation','Duplicate-processing protection','Retry and error paths','Post-write verification','Execution history','Portal access boundaries','Failure visibility'],
    outcome: 'The portfolio demo reconstructs the recruiter-facing Zoho environment from surviving interface screenshots, workflow documentation, n8n execution evidence, and report requirements. Applications show AI Score and Fit Level for prioritization; record details show the structured AI analysis written back to Zoho; Home and Analytics expose reporting; and Settings demonstrates workflow rules, schedules, Deluge functions, execution logs, and function analytics. Candidate and client records are synthetic; retained webhook and execution metrics are non-client operational evidence.',
    demoLabel: 'Launch Zoho CRM Demo'
  },
  {
    id: 'portal',
    order: '02',
    category: 'Secure Client Portal · Zoho Recruit · n8n AI',
    title: 'Secure Hiring Manager Client Portal',
    subtitle: 'A secure hiring-manager workspace connected to a production Zoho Recruit and n8n AI-screening workflow for candidate review, structured evaluation, interview coordination, and controlled write-back.',
    status: 'Production workflow evidence · reconstructed portal',
    role: 'Solutions Architect · Automation Developer · Full-Stack System Designer',
    stack: ['Zoho Recruit','Webhooks','n8n','OpenAI / Gemini','React','TypeScript','Cloudflare Workers','Supabase PostgreSQL'],
    metrics: [
      ['1,432','documented Zoho webhook calls'],
      ['48/day','documented webhook average'],
      ['7–12 sec','typical screening execution'],
      ['0','direct client access to Zoho secrets']
    ],
    problem: 'Recruiters needed repeatable AI-assisted screening inside Zoho Recruit, while hiring managers needed a controlled place to review approved candidate information and respond without direct access to the internal ATS, credentials, or unrestricted records.',
    solution: 'Zoho Recruit remains the recruitment system of record. Its Applications webhook triggers n8n, which retrieves the application, resume, and job description; extracts and normalizes the content; runs the AI evaluation; validates the structured output; and writes the result back to Zoho. The secure portal presents only approved fields and queues hiring-manager decisions and interview actions through a protected integration layer.',
    built: [
      'Invitation-only authentication and role-based access for system admins, client admins, hiring managers, and restricted viewers.',
      'Candidate review with configurable field visibility, resume download authorization, and client-specific access policies.',
      'Candidate decisions, interview requests, availability submission, confirmed meeting views, join links, and rescheduling workflows.',
      'Zoho Recruit Applications webhook using the Application ID as a stable key for record retrieval, logging, safe reprocessing, and write-back.',
      'n8n resume-screening workflow for application lookup, resume attachment retrieval, file-type detection, text extraction, job-description extraction, AI payload preparation, model evaluation, output parsing, and explicit error handling.',
      'Structured evaluation fields for AI score, fit level, recommendation, justification, key and missing skills, experience match, education match, and processing status.',
      'Admin console for organizations, users, Zoho OAuth, module/field mappings, audit logs, security events, retries, and integration health.',
      'Transactional outbox, idempotency keys, correlation IDs, duplicate-Zoho protection, append-only audit events, and server-side tenant isolation.'
    ],
    architecture: ['Zoho Job + Application','Webhook to n8n','Resume + JD Extraction','Structured AI Evaluation','Validation + Error Path','Zoho Write-back + Ranking','Approved Portal View','Client Action Outbox'],
    reliability: ['Structured-output validation','Processing states','Retry and error paths','Idempotent updates','Duplicate-processing protection','Tenant isolation','Audit logs and manual reprocessing'],
    outcome: 'The case study connects the secure hiring-manager experience to the demonstrated backend scope: a production Zoho Recruit webhook and n8n screening workflow with repeated successful runs, structured AI results written to recruitment records, and clear operational evidence. The public portal uses synthetic data and reconstructs the client-facing and administrative surfaces without exposing private records or credentials.',
    demoLabel: 'Launch Client Portal Demo'
  },
  {
    id: 'monday',
    order: '03',
    category: 'Monday.com · PMO · n8n Orchestration',
    title: 'Enterprise Operations Workspace',
    subtitle: 'A governed company project workspace with portfolio, personal-work, calendar, escalation, communication, document-linking, and leadership visibility layers.',
    status: 'Production reconstruction',
    role: 'Automation Systems Architect · Monday.com & n8n Engineer',
    stack: ['Monday.com','n8n','REST APIs','Microsoft SharePoint','Calendars','Leadership Dashboards'],
    metrics: [
      ['5','connected operating boards'],
      ['15 min','automation cadence'],
      ['~860','workflow runs / month'],
      ['0','Monday automation credits for n8n logic']
    ],
    problem: 'The client needed one governed PM environment where every task belonged to a project, one accountable person owned each task, project access controlled collaboration and chat, and both employees and leadership could see the right work. Due dates, scheduled work, priorities, escalations, documents, and department-level plans also had to remain visible without creating disconnected trackers.',
    solution: 'I designed Monday.com as the native operating and reporting interface, using built-in boards, columns, views, dashboards, widgets, updates, notifications, and same-board automations first. Projects define membership, ownership, SharePoint links, dates, planned manhours, and approval state; tasks inherit project context, enforce one responsible assignee, and capture time spent. n8n is reserved for cross-board synchronization and writes every execution to a dedicated Automation Logs board.',
    built: [
      'General project portfolio with active, future, closed, owner, collaborator, informed, department, status, and project-date fields.',
      'Master task board where each task belongs to a project and has exactly one responsible project member, its own due date, status, priority, attachments, and optional schedule window.',
      'Personal My Work and calendar views that distinguish task due dates from time-blocked scheduled work, with a personal-calendar handoff pattern.',
      'Priority logic that marks work for attention without silently rewriting the agreed schedule.',
      'Escalation records with a required note, source-task relationship, accountable recipient, and visibility on personal and leadership dashboards.',
      'Project-scoped chat and tagging restricted to project members, SharePoint links at project level, and task attachments for working files or screenshots.',
      'Leadership portfolio views for active, closed, and future projects plus all overdue projects, overdue tasks, and open escalations.',
      'Dedicated executive dashboard using native Timeline, Table, Workload, Kanban, Time Tracking, Numbers, and filtered board widgets.',
      'Timeline-to-table project review, workload drill-down by member with task bars colored by project, and an all-task Kanban showing project color and responsible person.',
      'Approval board and dashboard queue for pending, approved, rejected, and returned decisions with accountable approvers.',
      'Project-level planned manhours and task-level time tracking, aggregated into time-spent-per-project reporting.',
      'Native Monday automations for notifications and updates within the same board; n8n only where records must be synchronized across boards or require external orchestration.',
      'Dedicated n8n Execution Logs board containing workflow, execution ID, source and target board, affected item, result, duration, retry count, and error details.',
      'Native-first cost controls: Marketplace apps are proposed only when a required capability cannot be met natively, with subscription cost and permissions documented before installation.',
      'Phase 2 design for recurring tasks, task dependencies, department organization, and a company-wide agenda.',
      'Scheduled n8n controls for overdue evaluation, duplicate-safe escalation creation, risk propagation, and dashboard refresh.'
    ],
    architecture: ['Projects + Planned Manhours','Tasks + Time Tracking','Native Views + Automations','Executive Native Dashboard','Approvals + Escalations','n8n Cross-board Sync','n8n Execution Log Board','Project Chat + Files','Phase 2 Agenda + Dependencies'],
    reliability: ['Native-first / lowest viable subscription','Every task linked to a project','Single accountable task owner','Required escalation reason','Approval accountability','Duplicate escalation guard','n8n execution audit board','Controlled cross-board updates'],
    outcome: 'The reconstructed workspace now demonstrates the client requirement as a connected operating model: teams work from projects, personal tasks, calendars, chat, and files; escalation accountability is explicit; and leadership can filter the whole portfolio while n8n maintains risk and exception state. Phase 2 concepts are visibly separated from the core operational workflow rather than presented as already deployed.',
    demoLabel: 'Launch Monday + n8n Demo'
  },
  {
    id: 'ocr',
    order: '04',
    category: 'n8n · OCR · Document Data Pipeline',
    title: 'SPX OCR Automated Encoder System',
    subtitle: 'A drag-and-drop and Google Drive processing system that converts collection documents into validated operational records, exception queues, and management-ready reports.',
    status: 'Production system / reconstructed demo',
    role: 'Automation Systems Architect · n8n Workflow Engineer',
    stack: ['n8n','Web Upload','Google Drive','Tesseract OCR','Supabase / PostgreSQL','Excel Reports','JavaScript / Python'],
    metrics: [
      ['400','store-scale operating context'],
      ['2 paths','UI upload + Drive intake'],
      ['OCR','structured collection records'],
      ['Reports','operations + reconciliation']
    ],
    problem: 'Daily collection data arrived through images and manually maintained workbooks. Staff had to re-encode seller, route, driver, order, pickup, parcel, attendance, payment, and discrepancy values before producing daily summaries and reconciliation reports. Duplicate files, unclear scans, broken references, and inconsistent daily sheets made reporting slow and difficult to audit.',
    solution: 'I designed a shared n8n processing pipeline for both drag-and-drop UI uploads and Google Drive intake. It preserves the source document, runs OCR, maps the extracted values to operational entities, validates confidence and required fields, and writes clean records to a structured database. Validated records then feed repeatable daily collection, route-volume, attendance, driver-performance, payout, and profit/loss reports; uncertain documents remain in a review queue with their source and validation reasons.',
    built: [
      'Two intake paths: browser drag-and-drop for an operator and monitored Google Drive folders for scheduled or batch processing.',
      'Sequential n8n processing that preserves per-file context and completes the batch before returning a run summary.',
      'Original-file storage in Supabase, followed by Tesseract OCR and normalized response handling.',
      'Structured extraction for date, seller, route, driver, orders, pickup orders, scanned parcels, on-hold parcels, remarks, and payment-related values.',
      'Confidence thresholds and required-field rules that separate validated records from review exceptions.',
      'Duplicate-safe database upserts keyed to the source Drive file, with archive and review-folder routing.',
      'Normalized collection, seller, attendance, payment, and reconciliation records instead of isolated daily worksheets.',
      'Generated daily collection summaries, parcel totals by route, attendance and driver activity, pickup discrepancies, payout, and profit/loss reports.',
      'Exception records, report-run evidence, execution summaries, and run-level audit logs for troubleshooting and recovery.'
    ],
    architecture: ['UI Dropzone / Drive Intake','n8n Request Validation','Sequential File Processing','OCR + Field Mapping','Validation Decision','Operational Record Store','Review Queue','Report Builder','Excel / Dashboard Output','Archive + Run Audit'],
    reliability: ['Source-file deduplication','Sequential batch control','Confidence + required-field gates','Idempotent record upsert','Human review queue','Report-to-record traceability','Archive / review routing','Per-run audit evidence'],
    outcome: 'The resulting design replaces one-off OCR and manually linked daily sheets with an operable records-and-reporting pipeline. Valid documents become normalized, duplicate-safe operational records that can be filtered by date, seller, route, and driver. Ambiguous documents stay visible for review, while approved records generate repeatable operational and reconciliation reports with links back to the source file and processing run.',
    demoLabel: 'Launch OCR Pipeline Demo'
  },
  {
    id: 'zoho-migration',
    order: '05',
    category: 'Zoho · Migration · Deluge · APIs',
    title: 'Enterprise Zoho CRM Engineering & Migration',
    subtitle: 'Large-volume recruitment resume migration with Google Drive resume links, parsed candidate fields, facility mapping, confidence scoring, custom Deluge functions, API integrations, reconciliation, and workflow reliability.',
    status: 'Production work reconstruction',
    role: 'Zoho CRM Engineer · Migration & Automation Specialist',
    stack: ['Zoho CRM','Zoho Recruit','Deluge','Workflow Rules','REST APIs','OAuth2','CSV / Batch Processing'],
    metrics: [
      ['120K+','overall migration program'],
      ['59K+','JazzHR source scope'],
      ['62K+','Apploi source scope'],
      ['240K','API-call usage evidence in portfolio material']
    ],
    problem: 'Large legacy recruitment datasets needed controlled migration into a structured Zoho environment without losing traceability between the resume filename, Google Drive resume file, parsed candidate identity, facility applied, license details, and confidence score.',
    solution: 'I treated each source row as a controlled migration record: resume_filename and gdrive_link preserved file traceability, candidate fields mapped into Zoho records, facility-applied drove lookup alignment, confidence flagged review risk, and filename_date/license supported validation, deduplication, reconciliation, UAT, and post-write verification.',
    built: [
      'Field mapping, cleansing, deduplication, exception handling, and reconciliation rules for resume_filename, gdrive_link, first_name, last_name, email, mobile, secondary_email, company, designation, street, state, zip, facility-applied, confidence, filename_date, and license.',
      'Source-to-Zoho mapping where parsed candidate identity, contact, address, facility, resume link, confidence, and license fields are retained as auditable migration inputs.',
      'Deluge functions for stage-based history, subform preservation, lookup handling, file transfer, safe updates, and verification.',
      'Webhook and REST API integrations with named connections and external processing layers.',
      'Failure analysis and live execution monitoring for HTTP/data-type issues.'
    ],
    architecture: ['Resume File Inventory','Drive Link Traceability','Parsed Candidate Fields','Facility + License Mapping','Confidence Review Gate','Map + Deduplicate','Batch Import','Reconcile','UAT / Acceptance'],
    reliability: ['Disposition for every source record','Resume-to-record traceability','Confidence-based exception review','Facility lookup verification','Post-write verification','Named connections','Failure logs'],
    outcome: 'The demo presents a migration control center rather than pretending the old client tenant is still available. Visitors can inspect mappings, batches, reconciliation, and function execution evidence using synthetic data.',
    demoLabel: 'Launch Migration Control Demo'
  },
  {
    id: 'sheets',
    order: '06',
    category: 'Google Workspace · Lightweight Apps',
    title: 'Google Sheets-Powered Automation Systems',
    subtitle: 'Spreadsheet-driven payroll, attendance, planning, and scheduling workflows that behave like lightweight business applications.',
    status: 'Portfolio project family',
    role: 'Automation Developer',
    stack: ['Google Sheets','Apps Script','n8n','Google Calendar','Formulas','Triggers'],
    metrics: [
      ['4','demonstrated workflow modules'],
      ['Sheets','familiar operating layer'],
      ['Apps Script','automation engine'],
      ['Low','infrastructure overhead']
    ],
    problem: 'Small teams often need structured workflow automation without introducing a full CRM, ERP, or custom backend.',
    solution: 'I use Google Sheets as a familiar operating surface, with Apps Script for sheet-native behavior and n8n for cross-system orchestration, scheduled processing, API handoffs, and downstream synchronization.',
    built: [
      'Automated payroll calculations and pay-summary logic.',
      'Attendance time-in / time-out tracking.',
      'Project Gantt and timeline automation.',
      'Calendar scheduling synchronization.',
      'n8n orchestration for scheduled cross-system processing and API-connected handoffs.'
    ],
    architecture: ['Sheet Input','Apps Script Validation','n8n Schedule / Trigger','Business Logic + Routing','Calendar / External APIs','Audit Sheet'],
    reliability: ['Validation rules','Protected formula areas','Trigger logging','Repeatable templates'],
    outcome: 'The demo provides interactive spreadsheet tabs for payroll, attendance, Gantt planning, and calendar scheduling, plus a reconstructed n8n workflow showing the orchestration layer using synthetic data.',
    demoLabel: 'Launch Sheets Automation Demo'
  },
  {
    id: 'ops-dashboard',
    order: '07',
    category: 'Custom UI · API-Driven Operations',
    title: 'Custom Operations Dashboard',
    subtitle: 'A focused control surface for teams that need operational visibility and workflow actions without buying a full CRM or PM suite.',
    status: 'Portfolio solution',
    role: 'Systems Designer · Automation Developer',
    stack: ['Custom Web UI','n8n','REST API','Supabase','JavaScript'],
    metrics: [
      ['1','focused operating surface'],
      ['REST','integration layer'],
      ['n8n','workflow routing'],
      ['Low','licensing overhead']
    ],
    problem: 'Some teams need structured tracking and automation but do not need the breadth, cost, or complexity of a full CRM/PM platform.',
    solution: 'I designed a custom dashboard pattern where a lightweight web UI captures and presents operational data while n8n REST endpoints handle validation, routing, notifications, and external synchronization.',
    built: [
      'Custom record and status views.',
      'REST endpoints for validated actions.',
      'n8n workflow routing and notifications.',
      'Supabase-backed operational data model.'
    ],
    architecture: ['Custom UI','REST Webhook','n8n Validation + Routing','Supabase Persistence','Escalation Branch','Notifications / Integrations'],
    reliability: ['Input validation','API status visibility','Retryable workflows','Centralized records'],
    outcome: 'The demo shows a neutral client operations dashboard, API activity, workflow status, and a dedicated n8n-style orchestration view for webhook intake, validation, Supabase persistence, escalation branching, notification, and response handling.',
    demoLabel: 'Launch Operations Dashboard Demo'
  }
];

window.getDcodeProject = id => window.DCODE_PROJECTS.find(project => project.id === id);
