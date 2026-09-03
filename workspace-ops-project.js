(function(){
  if(!Array.isArray(window.DCODE_PROJECTS)) return;
  const orderMap={
    recruitment:'01',
    'workspace-ops':'02',
    monday:'03',
    portal:'04',
    ocr:'05',
    'zoho-migration':'06',
    sheets:'07',
    'ops-dashboard':'08'
  };
  window.DCODE_PROJECTS.forEach(project=>{if(orderMap[project.id]) project.order=orderMap[project.id];});
  if(window.DCODE_PROJECTS.some(p=>p.id==='workspace-ops')) return;
  const project={
    id:'workspace-ops',
    order:'02',
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
  };
  const insertAt=Math.min(1,window.DCODE_PROJECTS.length);
  window.DCODE_PROJECTS.splice(insertAt,0,project);
})();
