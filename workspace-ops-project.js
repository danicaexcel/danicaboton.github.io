(function(){
  if(!Array.isArray(window.DCODE_PROJECTS)) return;
  const orderMap={
    recruitment:'01',
    'monday-project-ops':'02',
    'workspace-ops':'03',
    monday:'04',
    portal:'05',
    ocr:'06',
    'zoho-migration':'07',
    sheets:'08',
    'ops-dashboard':'09'
  };
  window.DCODE_PROJECTS.forEach(project=>{if(orderMap[project.id]) project.order=orderMap[project.id];});

  if(!window.DCODE_PROJECTS.some(p=>p.id==='workspace-ops')){
    window.DCODE_PROJECTS.splice(Math.min(1,window.DCODE_PROJECTS.length),0,{
      id:'workspace-ops',
      order:'03',
      category:'Google Workspace · Project Operations',
      title:'Google Workspace Project Operations System',
      subtitle:'A Google-powered project management workspace connecting task execution, live work-session tracking, planned-versus-actual man-hours, revisions, approvals, and project labor-cost reporting.',
      status:'Interactive portfolio reconstruction',
      role:'Systems Architect · Google Workspace Automation Developer',
      stack:['Google Sheets','Google Apps Script','AppSheet','Looker Studio','Google Drive','Gmail','Google Calendar'],
      metrics:[['6','active projects'],['180+','managed tasks'],['1,200+','auditable work logs'],['Real-time','task punching']],
      problem:'Project plans, employee work logs, approvals, and labor-cost calculations are often maintained in disconnected spreadsheets. This makes it difficult to compare planned and actual effort, prevent overlapping time entries, distinguish rework, and determine which approved hours should feed employee compensation.',
      solution:'I designed a Google Workspace operating system where Google Sheets acts as the structured operational datastore, Google Apps Script enforces task and timekeeping rules, and a role-based member interface converts Start, Pause, Resume, Complete, and Revision actions into append-only work sessions. Approved work logs drive project progress, planned-versus-actual effort, resource utilization, rework analysis, timesheet approval, payable-hour calculations, project labor costs, and labor-budget variance.',
      built:[
        'Structured Google Sheets datastore covering Projects, Project Phases, Tasks, Members, Assignments, Time Sessions, Revisions, Timesheets, Approvals, Labor Rates, Activity Log, Notifications, and Settings.',
        'Apps Script task-state controls for Start, Pause, Resume, Complete, Revision / Redo, timesheet submission, approval, notification, and audit logging.',
        'Single-active-task enforcement that requires a member to pause the current task before another timer can start.',
        'Append-only time sessions used to calculate actual hours instead of storing actual time only as an editable total.',
        'Revision records and revision work sessions kept separate from original execution so rework remains measurable.',
        'Supervisor review and timesheet approval gates so only approved hours become compensation inputs and project labor costs.',
        'Role-based member and manager workspace using AppSheet or an Apps Script web app, with Looker Studio used for reporting.',
        'Project health, planned-versus-actual effort, utilization, rework, labor-cost, and budget-variance reporting.',
        'Audit events for task, timer, revision, approval, and notification actions.'
      ],
      architecture:['Project Plan','Project Phases','Tasks','Member Assignments','Planned Man-hours','Start / Pause / Resume / Complete','Append-only Time Sessions','Revision / Redo Work','Supervisor Review','Timesheet Approval','Approved Hours','Labor-Cost + Compensation Input'],
      reliability:['One active timer per member','Append-only session history','Actual hours calculated from sessions','Revision work separated','Approval before payable labor input','Controlled labor-rate records','Audit-log entries for actions','Validation and notification rules'],
      outcome:'The reconstruction demonstrates a Google Workspace project-operations system that keeps planning, task execution, time evidence, rework, approvals, and labor-cost reporting connected. It provides approved work-log based compensation inputs and time-based compensation calculation, but it is not presented as a complete payroll system; taxes, statutory deductions, benefits, payslips, and other payroll functions remain outside the demonstrated scope.',
      demoLabel:'Launch Project Operations Demo'
    });
  }

  if(!window.DCODE_PROJECTS.some(p=>p.id==='monday-project-ops')){
    window.DCODE_PROJECTS.push({
      id:'monday-project-ops',
      order:'02',
      category:'Monday.com · Project Operations · n8n',
      title:'Monday.com Project Operations Control Center',
      subtitle:'A production-oriented Monday.com operating model connecting projects, tasks, append-only work sessions, rework, approval, effective-dated labor rates, an approved work ledger, audit history, and n8n orchestration.',
      status:'Implemented workspace · production architecture revision · public reconstruction',
      role:'Systems Architect · Monday.com Automation & n8n Engineer',
      stack:['Monday.com','Monday Automations','n8n','Monday API','Dashboards','Gantt / Timeline'],
      metrics:[['8','connected data boards'],['20+','operational views'],['9','native automations'],['10','production n8n workflows designed']],
      problem:'Project tracking alone does not provide reliable evidence of who worked when, which effort was original versus rework, which hours were approved, which historical labor rate applied, or how approved cost should be allocated back to a project and task. The system therefore needed both a usable Monday.com workspace and an auditable data model underneath it.',
      solution:'I structured an isolated Monday.com operating system around eight connected data boards. Projects and Tasks remain the operational interface; Work Sessions are the append-only source of actual time; Revisions preserve rework context; Timesheets represent approval state; Labor Rates are effective-dated; an Approved Work Ledger freezes approved project/task/hour/rate/cost allocations; and Activity & Automation Logs preserve technical and business history. Native Monday features handle day-to-day work, while n8n and the Monday API enforce cross-board rules, derived calculations, retries, reconciliation, and audit orchestration.',
      built:[
        'Eight isolated boards for Master Projects, Master Tasks, Work Sessions, Revisions & Rework, Timesheets & Approvals, Labor Rates, Approved Work Ledger, and Activity & Automation Logs.',
        'Explicit data ownership: project/task metadata is operational input, Work Sessions are the time-evidence source, Timesheets are the approval source, Labor Rates are the historical rate source, and the Approved Work Ledger is the approved-cost source.',
        'Mandatory Project → Task relationships and a single responsible task owner constrained to the project owner or collaborator set.',
        'Append-only Start / Pause / Resume / Complete work-session handling where pause closes a session and resume creates a new session rather than mutating historical time evidence.',
        'Separate original-work and revision-work session classification so rework hours, rework rate, and rework cost remain measurable without rewriting original execution history.',
        'Timesheet headers with approval state, approved original/rework hours, adjustments, locking, and links to immutable approved work lines.',
        'Effective-dated labor-rate history so historical project cost does not change when a person receives a new rate.',
        'Approved Work Ledger lines that allocate approved hours to worker, project, task, work type, applied rate, and approved labor cost for project reporting and compensation inputs.',
        'Derived-only operating fields for actual hours, approved hours, project labor cost, rework cost, remaining budget, cost variance, progress, workload, and project health.',
        'Activity and automation logging with correlation IDs, idempotency keys, n8n execution IDs, retry counts, state transitions, and failure details.',
        'Leadership reporting for active/closed/future projects, overdue work, escalations, planned-versus-actual effort, approved labor cost, rework, utilization, workload, and labor-budget variance.',
        'Ten production n8n workflow families covering work-session control, project/task validation, aggregation, rework, timesheets, approval and cost posting, escalations, project health, audit logging, and reconciliation/repair.'
      ],
      architecture:['Master Projects','Master Tasks','Work Sessions','Revisions & Rework','Timesheets & Approvals','Labor Rates','Approved Work Ledger','Activity & Automation Logs','Monday Native Views & Automations','n8n + Monday API'],
      reliability:['One active session per member','Append-only session evidence','Authoritative vs derived field separation','Idempotent cross-board writes','Effective-dated labor rates','Approved ledger lines locked after approval','Rework separately measurable','Correlation IDs + execution audit','Nightly reconciliation and repair','Native-first automation boundary'],
      outcome:'The revised architecture keeps Monday.com usable as the operating interface while making the underlying time, approval, cost, rework, and audit calculations reproducible. A manager can see a simple project or task total, while the system can trace that total back to individual work sessions, approval decisions, applied historical rates, approved ledger lines, and n8n execution evidence. The public reconstruction uses synthetic people and values and does not expose the original client workspace.',
      demoLabel:'Launch Monday Project Operations Demo'
    });
  }

  window.DCODE_PROJECTS.forEach(project=>{if(orderMap[project.id]) project.order=orderMap[project.id];});
  window.DCODE_PROJECTS.sort((a,b)=>Number(a.order||99)-Number(b.order||99));
})();
