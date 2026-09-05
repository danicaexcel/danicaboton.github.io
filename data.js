window.DCODE_PROJECTS = [
  {
    id: 'recruitment',
    order: '01',
    category: 'Zoho CRM · Deluge · n8n Resume Analysis',
    title: 'Recruitment Operations Platform',
    subtitle: 'A custom Zoho CRM recruitment platform that centralizes applicant operations, automates the recruitment lifecycle through Zoho CRM workflow-triggered Deluge functions, and uses n8n only for resume analysis.',
    status: 'Production Zoho CRM + n8n resume-analysis evidence · reconstructed interface',
    role: 'Systems Architect · Zoho CRM Engineer · Automation Developer',
    stack: ['Zoho CRM','Deluge','Workflow Rules','Custom Modules','Subforms & Lookups','Reports & Analytics','Webhooks','n8n','OpenAI / Gemini-ready'],
    metrics: [
      ['1,432','documented Zoho CRM resume-analysis webhook calls'],
      ['48/day','documented resume-analysis call average'],
      ['7-12 sec','typical n8n resume-analysis execution'],
      ['88','sample AI score written back to Zoho CRM']
    ],
    problem: 'Recruitment information and activity were fragmented across separate applicant, job-opening, facility, follow-up, and reporting processes. This created duplicated work, manual coordination, inconsistent stage and activity history, and limited visibility into each applicant’s full recruitment lifecycle. Recruiters spent too much time reconciling records and tracking updates instead of candidate engagement and decision-making, while past applicants were difficult to rediscover for future openings.',
    solution: 'I designed a centralized recruitment operating platform in Zoho CRM. Applicants, Employees, Job Openings, Facilities, Workqueue, Tasks, Meetings, Calls, reports, and analytics are connected through Zoho CRM modules and relationships. Workflow rules trigger Deluge functions that manage record updates, recruitment history, assignments, reporting, validation, and other operational actions inside Zoho CRM. n8n is deliberately isolated to resume processing: it receives an applicant record reference, extracts the resume, compares it with job requirements through structured AI analysis, validates the output, and writes the result back to the Zoho CRM applicant record. No other recruitment automation is delegated to n8n.',
    built: [
      'A centralized Zoho CRM recruitment data model covering Applicants, Employees, Job Openings, Facilities, Workqueue, Tasks, Meetings, Calls, Recruitment Report Center, and Recruiter Activity Reports.',
      'Custom modules, fields, layouts, related lists, lookups, and subforms that connect applicants with job openings, facilities, employee records, recruiter ownership, and historical recruitment activity.',
      'Zoho CRM workflow rules that trigger custom Deluge functions for operational automation without routing same-system logic through n8n.',
      'Defensive Deluge functions for stage-history updates, applicant submission, qualification and rejection handling, employee creation or update, recruiter-task creation, validation, recursive-trigger prevention, and post-write verification.',
      'A persistent recruitment-history subform that preserves earlier rows and records stage changes with the recruiter, facility, department, position, employment type, and event date.',
      'Zoho CRM Workqueue views for assigned applicants, employees, tasks, meetings, and calls so recruiters can manage open work from the same operating platform.',
      'Four Facility → Position reporting families: Recruitment Activity, Candidate Loss Reasons, Job Opening History, and Applicant & Sourcing Activity, with Daily, Weekly, Monthly, and YTD views, running totals, and Excel-ready exports.',
      'A recruitment analytics dashboard available from both Home and Analytics using Zoho CRM KPI, comparator, funnel, donut, bar, line, and table components.',
      'One external n8n workflow used only for resume analysis, triggered from Zoho CRM using the Applicant Record ID as the stable retrieval, logging, reprocessing, and write-back key.',
      'Resume attachment retrieval, file-type detection for PDF, DOC/DOCX, and image resumes, text extraction, job-requirement extraction, structured AI evaluation, output validation, and an explicit resume-analysis error path in n8n.',
      'Structured AI analysis written back to the Zoho CRM applicant record: AI Score, Fit Level, Recommendation, Justification, Key Skills, Missing Skills, Experience Match, Education Match, Processing Date, and Processing Status.',
      'Applicant list views that expose AI Score and Fit Level for recruiter ranking, filtering, prioritization, and consistent review while keeping the final decision with the recruiter.',
      'A model-flexible resume-analysis contract that allows the AI provider to change without changing the Zoho CRM webhook, structured output, validation, or write-back design.',
      'Automation evidence modeled on Zoho CRM Setup: workflow rules, schedules, Deluge functions, execution logs, and function analytics are reconstructed with synthetic names and non-client operational evidence.'
    ],
    architecture: ['Zoho CRM Applicant / Job / Facility Records','Zoho CRM Workflow Rule','Zoho CRM Deluge Function','Record / Subform / Workqueue Updates','Resume Analysis Webhook — only external branch','n8n Resume Extraction + AI Analysis','Validated Zoho CRM Applicant Write-back','Recruiter Ranking View','Reports / Analytics'],
    reliability: ['Defensive Deluge checks','Record-state validation','Recursive-trigger prevention','Duplicate-processing protection','Resume file-type validation','Structured-output validation','Resume-analysis retry and error path','Post-write verification','Execution history','Failure visibility'],
    outcome: 'The implemented platform gives recruiters a centralized view of applicants, job openings, facilities, recruitment history, employee outcomes, assigned work, and reporting inside Zoho CRM. Recruiters can trace the recruitment lifecycle, rediscover past applicants, and use structured resume-analysis results without moving operational CRM logic into an external workflow. The public portfolio demo reconstructs the Zoho CRM environment from surviving interface screenshots, workflow documentation, Deluge execution evidence, n8n resume-analysis runs, and report requirements. Applicant and employee records are synthetic; retained webhook and execution metrics are non-client operational evidence.',
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
    subtitle: 'Large-volume recruitment resume migration with Google Drive resume links, parsed candidate fields, facility mapping, confidence scoring, controlled Zoho writes, reconciliation, and workflow reliability.',
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
    solution: 'I treated each source row as a controlled migration record: resume_filename and gdrive_link preserved file traceability, parsed candidate fields mapped into Zoho Applicant records, facility-applied drove lookup alignment, confidence flagged review risk, and filename_date and license supported validation, reconciliation, and post-write verification.',
    built: [
      'Field mapping, validation, exception handling, and reconciliation rules for resume_filename, gdrive_link, first_name, last_name, email, mobile, secondary_email, company, designation, street, state, zip, facility-applied, confidence, filename_date, and license.',
      'Source-to-Zoho mapping where parsed candidate identity, contact, address, facility, resume link, confidence, and license fields are retained as auditable migration inputs.',
      'Deluge functions for stage-based history, subform preservation, lookup handling, file transfer, safe updates, and verification.',
      'Webhook and REST API integrations with named connections and external processing layers.',
      'Failure analysis and live execution monitoring for HTTP/data-type issues.'
    ],
    architecture: ['Recruitment Source Data','Resume File Traceability','Parsed Candidate Fields','Field Mapping','Facility + License Mapping','Confidence Review Gate','Controlled Zoho Write','Reconcile + Verify','UAT / Acceptance'],
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
    id: 'workspace-ops',
    order: '07',
    category: 'Google Workspace · Project Operations',
    title: 'Google Workspace Project Operations System',
    subtitle: 'A Google-powered project management workspace connecting task execution, live work-session tracking, planned-versus-actual man-hours, revisions, approvals, and project labor-cost reporting.',
    status: 'Interactive portfolio reconstruction',
    role: 'Systems Architect · Google Workspace Automation Developer',
    stack: ['Google Sheets','Apps Script','AppSheet','Looker Studio','Google Drive','Gmail','Google Calendar'],
    metrics: [
      ['6','active projects'],
      ['180+','managed tasks'],
      ['1,200+','auditable work logs'],
      ['Real-time','task punching']
    ],
    problem: 'Project plans, employee work logs, approvals, and labor-cost calculations are often maintained in disconnected spreadsheets. This makes it difficult to compare planned and actual effort, prevent overlapping time entries, distinguish rework, and determine which approved hours should feed compensation.',
    solution: 'I designed a Google Workspace operating system where Sheets acts as a structured datastore, Apps Script enforces task and timekeeping rules, and a role-based member interface turns Start, Pause, Resume, Complete, and Revision actions into append-only work sessions. Approved logs then drive project variance, utilization, and labor-cost reporting.',
    built: [
      'Project dashboard with health, progress, planned-versus-actual hours, and labor-cost variance.',
      'Project workspaces with task lists, Kanban status, dependencies, milestones, and Gantt timelines.',
      'Member workspace with Start, Pause, Resume, Complete, and Revision task actions.',
      'Single-active-task enforcement to prevent simultaneous timers and inflated hours.',
      'Append-only work sessions, revision records, weekly timesheets, supervisor approvals, and audit history.',
      'Approved work-log based compensation inputs and resource-utilization reporting.'
    ],
    architecture: ['AppSheet / Apps Script UI','Projects + Phases','Tasks + Assignments','Apps Script Workflow Engine','Append-only Time Sessions','Revisions + Approvals','Approved Timesheets','Labor Cost + Looker Studio'],
    reliability: ['Single active timer per member','Append-only time sessions','Role-based actions','Protected rate fields','Approval before payable hours','Revision-hour separation','Audit trail','Threshold notifications'],
    outcome: 'The reconstruction demonstrates how familiar Google tools can operate as a governed project-delivery workspace. Managers see schedule and labor risk early, while members record work through controlled task actions rather than editable timesheet totals.',
    demoLabel: 'Launch Project Operations Demo'
  },
  {
    id: 'ops-dashboard',
    order: '08',
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
