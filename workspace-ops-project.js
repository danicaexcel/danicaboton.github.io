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
      category:'Monday.com · Project Operations',
      title:'Monday.com Project Operations Control Center',
      subtitle:'A connected Monday.com project-operations workspace that translates the Project Operations model into portfolio boards, execution tracking, append-only work sessions, revisions, approvals, labor rates, audit history, and management reporting.',
      status:'Implemented workspace · public reconstruction',
      role:'Systems Architect · Monday.com Automation Engineer',
      stack:['Monday.com','Monday Automations','n8n','Monday API','Dashboards','Gantt / Timeline'],
      metrics:[['7','connected boards'],['20','operational views'],['9','native automations'],['9','advanced workflows specified']],
      problem:'Project tracking alone does not provide reliable evidence of work sessions, rework, approvals, labor cost, or operational audit history. The requirement was to convert the existing Project Operations model into Monday.com without mixing it into the pre-existing workspace structures.',
      solution:'I structured an isolated Monday.com operating system around connected project, task, work-session, revision, timesheet, labor-rate, and activity-log boards. Native Monday views and automations handle platform-level operations, while advanced cross-board controls such as one-active-session enforcement, append-only session handling, aggregation, and audit orchestration are designed for n8n and the Monday API.',
      built:[
        'Seven isolated boards for projects, tasks, work sessions, revisions and rework, timesheets and approvals, labor rates, and activity / automation logs.',
        'Connected-board relationships from Project → Task → Work Session, with revisions, approvals, labor rates, and audit records tied back to the same operating model.',
        'Complete project and task schemas covering owners, members, dates, timelines, planned and actual effort, approvals, rework, cost, progress, health, and audit fields.',
        'Twenty operational views spanning active/at-risk/completed projects, My Tasks, overdue work, review/revision queues, active sessions, approvals, calendars, and timelines.',
        'Native Monday automations for review, completion, risk, approval, rejection/return, and revision-resolution notifications.',
        'Project Operations Control Center dashboard for portfolio KPIs, planned-versus-actual effort, task state, rework, labor cost, budget variance, timeline, and workload.',
        'n8n workflow specifications for one-active-session enforcement, Start/Pause/Resume/Complete, duration and recorded-hour aggregation, revision classification, timesheet generation, labor-cost calculation, and audit logging.'
      ],
      architecture:['Master Projects','Master Tasks','Work Sessions','Revisions & Rework','Timesheets & Approvals','Labor Rates','Activity & Automation Logs','Monday Native Views','Monday Automations','n8n + Monday API'],
      reliability:['Existing boards isolated from the project-operations workspace','Append-only work-session model','One-active-session rule designed fail-safe','Approved hours drive labor cost','Rework remains separately measurable','Connected-board source of truth','Audit records for major state changes','Native-first automation boundary'],
      outcome:'The implemented Monday.com workspace demonstrates how the same project-operations architecture can be moved from Google Workspace into a board-native operating environment. The public portfolio demo reconstructs the implemented interface with synthetic names and values; sensitive workspace and member information is not exposed.',
      demoLabel:'Launch Monday Project Operations Demo'
    });
  }

  window.DCODE_PROJECTS.forEach(project=>{if(orderMap[project.id]) project.order=orderMap[project.id];});
  window.DCODE_PROJECTS.sort((a,b)=>Number(a.order||99)-Number(b.order||99));
})();
