const req = $json;
const p = req.payload || {};
const now = new Date();
const nowIso = now.toISOString();
const store = $getWorkflowStaticData('global');

if (!store.clients) store.clients = {};
const clientId = String(req.clientId || p.clientId || 'default-demo');

function seedState() {
  const projects = [
    {id:'PRJ-001',name:'Mobile App v2 Launch',client:'Apex Retail',owner:'Maria Santos',collaborators:['Carlo Mendoza','John Reyes'],department:'Product',status:'Active',startDate:'2026-07-01',dueDate:'2026-09-30',plannedLaborHours:240,approvedLaborBudget:18000,currency:'USD'},
    {id:'PRJ-002',name:'Website Redesign 2026',client:'Northstar Health',owner:'John Reyes',collaborators:['Maria Santos'],department:'Digital',status:'Active',startDate:'2026-08-01',dueDate:'2026-10-15',plannedLaborHours:160,approvedLaborBudget:12000,currency:'USD'},
    {id:'PRJ-003',name:'CRM Automation Rollout',client:'BrightPath Logistics',owner:'Danica Boton',collaborators:['Maria Santos','Carlo Mendoza'],department:'Operations',status:'Active',startDate:'2026-08-15',dueDate:'2026-11-15',plannedLaborHours:180,approvedLaborBudget:14000,currency:'USD'}
  ];
  const tasks = [
    {id:'TSK-001',projectId:'PRJ-001',name:'API Integration - Payment Gateway',responsible:'Carlo Mendoza',collaborators:['Maria Santos'],reviewer:'Maria Santos',status:'Stuck',priority:'Critical',dueDate:'2026-08-25',plannedHours:72,acceptanceCriteria:'Payment authorization, callback handling, and failure states verified.',escalationStatus:'Escalated',escalationReason:'External payment gateway blocker',reviewState:'Working'},
    {id:'TSK-002',projectId:'PRJ-002',name:'Backend API Documentation',responsible:'John Reyes',collaborators:[],reviewer:'John Reyes',status:'In Progress',priority:'High',dueDate:'2026-09-05',plannedHours:32,acceptanceCriteria:'Endpoint reference, examples, error responses, and authentication notes complete.',escalationStatus:'None',escalationReason:null,reviewState:'Working'},
    {id:'TSK-003',projectId:'PRJ-001',name:'User Acceptance Testing - Phase 1',responsible:'Maria Santos',collaborators:['Carlo Mendoza'],reviewer:'Maria Santos',status:'For Review',priority:'High',dueDate:'2026-09-10',plannedHours:48,acceptanceCriteria:'Critical user journeys tested and defects documented.',escalationStatus:'None',escalationReason:null,reviewState:'For Review',submittedAt:'2026-09-02T07:10:00.000Z',submittedBy:'Maria Santos',submissionType:'ORIGINAL'},
    {id:'TSK-004',projectId:'PRJ-003',name:'Workflow Reliability & Reconciliation',responsible:'Danica Boton',collaborators:['Maria Santos'],reviewer:'Danica Boton',status:'In Progress',priority:'Medium',dueDate:'2026-09-22',plannedHours:56,acceptanceCriteria:'Idempotency, retry handling, audit logging, and scheduled reconciliation validated.',escalationStatus:'None',escalationReason:null,reviewState:'Working'}
  ];
  const sessions = [
    {id:'SES-001',worker:'Carlo Mendoza',projectId:'PRJ-001',taskId:'TSK-001',revisionId:null,sessionType:'ORIGINAL',state:'CLOSED',start:'2026-08-20T01:00:00.000Z',end:'2026-08-20T09:00:00.000Z',durationHours:8,startSource:'SEED',closeReason:'Completed work block',idempotencyKey:'seed:ses-001',correlationId:'SEED-001',executionId:'SEED'},
    {id:'SES-002',worker:'Carlo Mendoza',projectId:'PRJ-001',taskId:'TSK-001',revisionId:null,sessionType:'ORIGINAL',state:'CLOSED',start:'2026-08-21T01:00:00.000Z',end:'2026-08-21T09:00:00.000Z',durationHours:8,startSource:'SEED',closeReason:'Completed work block',idempotencyKey:'seed:ses-002',correlationId:'SEED-002',executionId:'SEED'},
    {id:'SES-003',worker:'Carlo Mendoza',projectId:'PRJ-001',taskId:'TSK-001',revisionId:'REV-001',sessionType:'REVISION',state:'CLOSED',start:'2026-08-22T01:00:00.000Z',end:'2026-08-22T05:00:00.000Z',durationHours:4,startSource:'SEED',closeReason:'Revision completed',idempotencyKey:'seed:ses-003',correlationId:'SEED-003',executionId:'SEED'},
    {id:'SES-004',worker:'John Reyes',projectId:'PRJ-002',taskId:'TSK-002',revisionId:null,sessionType:'ORIGINAL',state:'CLOSED',start:'2026-09-01T01:00:00.000Z',end:'2026-09-01T07:00:00.000Z',durationHours:6,startSource:'SEED',closeReason:'Completed work block',idempotencyKey:'seed:ses-004',correlationId:'SEED-004',executionId:'SEED'},
    {id:'SES-005',worker:'Maria Santos',projectId:'PRJ-001',taskId:'TSK-003',revisionId:null,sessionType:'ORIGINAL',state:'CLOSED',start:'2026-09-02T01:00:00.000Z',end:'2026-09-02T07:00:00.000Z',durationHours:6,startSource:'SEED',closeReason:'Completed work block',idempotencyKey:'seed:ses-005',correlationId:'SEED-005',executionId:'SEED'}
  ];
  const revisions = [
    {id:'REV-001',number:1,taskId:'TSK-001',projectId:'PRJ-001',requester:'Maria Santos',assignee:'Carlo Mendoza',reason:'Payment callback edge-case failure',reviewerNote:'Handle duplicate and malformed callback responses.',rootCause:'Third-party API response variance',deadline:'2026-08-24',state:'Resolved',resolutionEvidence:'Callback normalization implemented',createdAt:'2026-08-22T00:30:00.000Z',resolvedAt:'2026-08-22T05:15:00.000Z',resubmittedAt:'2026-08-22T05:15:00.000Z'}
  ];
  const rates = [
    {id:'RATE-001',worker:'Carlo Mendoza',role:'Backend Engineer',hourlyRate:82,currency:'USD',effectiveFrom:'2026-01-01',effectiveTo:null,status:'Active'},
    {id:'RATE-002',worker:'John Reyes',role:'Technical Writer',hourlyRate:58,currency:'USD',effectiveFrom:'2026-01-01',effectiveTo:null,status:'Active'},
    {id:'RATE-003',worker:'Maria Santos',role:'Project Lead',hourlyRate:90,currency:'USD',effectiveFrom:'2026-01-01',effectiveTo:null,status:'Active'},
    {id:'RATE-004',worker:'Danica Boton',role:'Automation Engineer',hourlyRate:95,currency:'USD',effectiveFrom:'2026-01-01',effectiveTo:null,status:'Active'}
  ];
  return {
    version:2,
    createdAt:nowIso,
    updatedAt:nowIso,
    counters:{project:4,task:5,session:6,revision:2,timesheet:1,ledger:1,event:1},
    projects,tasks,sessions,revisions,timesheets:[],rates,ledger:[],logs:[],processedKeys:{}
  };
}

function numericSuffix(id) {
  const m = String(id || '').match(/-(\d+)$/);
  return m ? Number(m[1]) : 0;
}

function migrateState(state) {
  state.version = 2;
  state.projects ||= [];
  state.tasks ||= [];
  state.sessions ||= [];
  state.revisions ||= [];
  state.timesheets ||= [];
  state.rates ||= [];
  state.ledger ||= [];
  state.logs ||= [];
  state.processedKeys ||= {};
  state.counters ||= {};

  const ensureCounter = (kind, list, prefix) => {
    if (!Number(state.counters[kind])) {
      const max = Math.max(0, ...list.filter(x => String(x.id || '').startsWith(prefix + '-')).map(x => numericSuffix(x.id)));
      state.counters[kind] = max + 1;
    }
  };
  ensureCounter('project', state.projects, 'PRJ');
  ensureCounter('task', state.tasks, 'TSK');
  ensureCounter('session', state.sessions, 'SES');
  ensureCounter('revision', state.revisions, 'REV');
  ensureCounter('timesheet', state.timesheets, 'TS');
  ensureCounter('ledger', state.ledger, 'LED');
  ensureCounter('event', state.logs, 'EVT');

  for (const t of state.tasks) {
    const prj = state.projects.find(x => x.id === t.projectId);
    t.collaborators ||= [];
    t.reviewer ||= prj?.owner || null;
    t.acceptanceCriteria ||= null;
    t.reviewState ||= t.status === 'For Review' ? 'For Review' : t.status === 'Approved' ? 'Approved' : t.status === 'Revision' ? 'Revision Required' : 'Working';
    t.escalationStatus ||= 'None';
    if (t.qualityApprovalCycle == null) t.qualityApprovalCycle = 0;
    if (t.reviewSubmissionCycle == null) t.reviewSubmissionCycle = t.status === 'For Review' ? 1 : 0;
  }
  return state;
}

if (!store.clients[clientId]) store.clients[clientId] = seedState();
let s = migrateState(store.clients[clientId]);

function nextId(kind, prefix) {
  const n = Number(s.counters[kind] || 1);
  s.counters[kind] = n + 1;
  return `${prefix}-${String(n).padStart(3,'0')}`;
}
function taskById(id) { return s.tasks.find(x => x.id === id); }
function projectById(id) { return s.projects.find(x => x.id === id); }
function revisionById(id) { return s.revisions.find(x => x.id === id); }
function timesheetById(id) { return s.timesheets.find(x => x.id === id); }
function activeSession(worker) { return s.sessions.find(x => x.worker === worker && x.state === 'ACTIVE'); }
function activeSessionForTask(taskId) { return s.sessions.find(x => x.taskId === taskId && x.state === 'ACTIVE'); }
function openRevisionForTask(taskId) { return s.revisions.filter(r => r.taskId === taskId && !['Resolved','Closed'].includes(r.state)).sort((a,b)=>Number(b.number||0)-Number(a.number||0))[0] || null; }
function latestRevisionForTask(taskId) { return s.revisions.filter(r => r.taskId === taskId).sort((a,b)=>Number(b.number||0)-Number(a.number||0))[0] || null; }
function hoursBetween(start, end) { return Math.max(0, (new Date(end)-new Date(start))/3600000); }
function terminal(status) { return ['Done','Completed','Cancelled','Approved'].includes(String(status || '')); }
function projectMembers(prj) { return prj ? [...new Set([prj.owner, ...(prj.collaborators || [])].filter(Boolean))] : []; }
function rateFor(worker, atDate) {
  const d = new Date(atDate).getTime();
  const matches = s.rates.filter(r => r.worker === worker && new Date(r.effectiveFrom).getTime() <= d && (!r.effectiveTo || new Date(r.effectiveTo).getTime() >= d));
  matches.sort((a,b)=>new Date(b.effectiveFrom)-new Date(a.effectiveFrom));
  return matches[0] || null;
}
function computeTask(t) {
  const closed = s.sessions.filter(x => x.taskId === t.id && x.state === 'CLOSED');
  const original = closed.filter(x=>x.sessionType==='ORIGINAL').reduce((a,x)=>a+Number(x.durationHours||0),0);
  const rework = closed.filter(x=>x.sessionType==='REVISION').reduce((a,x)=>a+Number(x.durationHours||0),0);
  const approved = s.ledger.filter(x=>x.taskId===t.id && x.locked).reduce((a,x)=>a+Number(x.approvedHours||0),0);
  return {
    actualOriginalHours:+original.toFixed(2),
    reworkHours:+rework.toFixed(2),
    totalRecordedHours:+(original+rework).toFixed(2),
    approvedHours:+approved.toFixed(2),
    remainingHours:+Math.max(Number(t.plannedHours||0)-(original+rework),0).toFixed(2)
  };
}
function computeProject(prj) {
  const taskIds = s.tasks.filter(t=>t.projectId===prj.id).map(t=>t.id);
  const sessions = s.sessions.filter(x=>taskIds.includes(x.taskId) && x.state==='CLOSED');
  const original = sessions.filter(x=>x.sessionType==='ORIGINAL').reduce((a,x)=>a+Number(x.durationHours||0),0);
  const rework = sessions.filter(x=>x.sessionType==='REVISION').reduce((a,x)=>a+Number(x.durationHours||0),0);
  const ledger = s.ledger.filter(x=>x.projectId===prj.id && x.locked);
  const approvedHours = ledger.reduce((a,x)=>a+Number(x.approvedHours||0),0);
  const laborCost = ledger.reduce((a,x)=>a+Number(x.laborCost||0),0);
  const reworkCost = ledger.filter(x=>x.workType==='REVISION').reduce((a,x)=>a+Number(x.laborCost||0),0);
  const tasks = s.tasks.filter(t=>t.projectId===prj.id);
  const overdue = tasks.filter(t=>!terminal(t.status) && t.dueDate && new Date(t.dueDate).getTime() < now.getTime()).length;
  const escalations = tasks.filter(t=>t.escalationStatus==='Escalated').length;
  const complete = tasks.filter(t=>terminal(t.status)).length;
  const progress = tasks.length ? Math.round((complete/tasks.length)*100) : 0;
  const remainingBudget = Number(prj.approvedLaborBudget||0)-laborCost;
  const health = escalations>0 || overdue>1 || remainingBudget<0 ? 'At Risk' : overdue>0 ? 'Watch' : 'On Track';
  return {
    actualOriginalHours:+original.toFixed(2),reworkHours:+rework.toFixed(2),totalRecordedHours:+(original+rework).toFixed(2),
    approvedHours:+approvedHours.toFixed(2),approvedLaborCost:+laborCost.toFixed(2),approvedReworkCost:+reworkCost.toFixed(2),
    remainingLaborBudget:+remainingBudget.toFixed(2),overdueTasks:overdue,openEscalations:escalations,progress,health
  };
}
function dashboard() {
  const projects = s.projects.map(pj=>({...pj,...computeProject(pj)}));
  const tasks = s.tasks.map(t=>({...t,...computeTask(t)}));
  const activeSessions = s.sessions.filter(x=>x.state==='ACTIVE');
  const overdueTasks = tasks.filter(t=>!terminal(t.status) && t.dueDate && new Date(t.dueDate).getTime()<now.getTime());
  const approvedLaborCost = s.ledger.filter(x=>x.locked).reduce((a,x)=>a+Number(x.laborCost||0),0);
  const approvedReworkCost = s.ledger.filter(x=>x.locked&&x.workType==='REVISION').reduce((a,x)=>a+Number(x.laborCost||0),0);
  const totalRecorded = tasks.reduce((a,t)=>a+Number(t.totalRecordedHours||0),0);
  const totalRework = tasks.reduce((a,t)=>a+Number(t.reworkHours||0),0);
  const planned = s.projects.reduce((a,pj)=>a+Number(pj.plannedLaborHours||0),0);
  return {
    summary:{
      projects:s.projects.length,tasks:s.tasks.length,activeSessions:activeSessions.length,overdueTasks:overdueTasks.length,
      openEscalations:tasks.filter(t=>t.escalationStatus==='Escalated').length,
      pendingTaskReviews:tasks.filter(t=>t.status==='For Review').length,
      openRevisions:s.revisions.filter(r=>!['Resolved','Closed'].includes(r.state)).length,
      submittedTimesheets:s.timesheets.filter(ts=>ts.status==='Submitted').length,
      totalRecordedHours:+totalRecorded.toFixed(2),reworkHours:+totalRework.toFixed(2),
      utilizationPct:planned?+Math.min(100,(totalRecorded/planned)*100).toFixed(1):0,
      reworkRatePct:totalRecorded?+(totalRework/totalRecorded*100).toFixed(1):0,
      approvedLaborCost:+approvedLaborCost.toFixed(2),approvedReworkCost:+approvedReworkCost.toFixed(2)
    },
    projects,tasks,activeSessions,overdueTasks,recentLogs:s.logs.slice(-20).reverse()
  };
}
function log(action, entityType, entityId, result, details={}) {
  const event = {
    id:nextId('event','EVT'),actor:p.actor||p.worker||p.reviewer||p.approver||'Portfolio Demo',action,entityType,entityId,
    previousState:details.previousState||null,newState:details.newState||null,result,
    workflow:'Project 02 Unified Operations Control Center',executionId:$execution.id,correlationId:req.correlationId||req.requestId,
    retryCount:Number(p.retryCount||0),at:nowIso
  };
  s.logs.push(event);
  if (s.logs.length>500) s.logs=s.logs.slice(-500);
  return event;
}
function response(data={}, message='OK') {
  s.updatedAt = nowIso;
  store.clients[clientId] = s;
  return [{json:{ok:true,mode:'live',clientId,executionId:$execution.id,action:req.action,message,data}}];
}
function fail(message, code='VALIDATION_ERROR') {
  log(req.action||'unknown','request',req.requestId||null,'Failed',{newState:{code,message}});
  s.updatedAt = nowIso;
  store.clients[clientId] = s;
  return [{json:{ok:false,mode:'live',clientId,executionId:$execution.id,action:req.action,error:{code,message}}}];
}
function taskView(t) {
  const project = projectById(t.projectId);
  const active = activeSessionForTask(t.id) || null;
  const latestRevision = latestRevisionForTask(t.id);
  const openRevision = openRevisionForTask(t.id);
  return {
    ...t,
    ...computeTask(t),
    project:project?{id:project.id,name:project.name,owner:project.owner}:null,
    activeSession:active,
    latestRevision,
    openRevision
  };
}
function reviewEvidence(t) {
  const sessions = s.sessions.filter(x=>x.taskId===t.id && x.state==='CLOSED').sort((a,b)=>new Date(b.start)-new Date(a.start));
  const revisions = s.revisions.filter(r=>r.taskId===t.id).sort((a,b)=>Number(b.number||0)-Number(a.number||0));
  return {task:taskView(t),sessions,revisions};
}

const dedupeKey = p.idempotencyKey || req.idempotencyKey || null;
if (dedupeKey && s.processedKeys[dedupeKey]) {
  return response({duplicate:true,original:s.processedKeys[dedupeKey]},'Duplicate request ignored safely');
}

let out;
switch (req.action) {
  case 'health.check':
    out=response({stateVersion:s.version,updatedAt:s.updatedAt,counts:{projects:s.projects.length,tasks:s.tasks.length,sessions:s.sessions.length,revisions:s.revisions.length,timesheets:s.timesheets.length,rates:s.rates.length,ledger:s.ledger.length,logs:s.logs.length}},'Project 02 state engine is healthy');
    break;

  case 'state.get':
    out=response({state:s,dashboard:dashboard()},'Current Project 02 state');
    break;

  case 'state.reset':
    s=seedState();
    store.clients[clientId]=s;
    log('state.reset','client',clientId,'Successful');
    out=response({dashboard:dashboard()},'Demo state reset');
    break;

  case 'project.create': {
    const name=String(p.name||'').trim();
    const owner=String(p.owner||'').trim();
    if(!name){out=fail('Project name is required','PROJECT_NAME_REQUIRED');break;}
    if(!owner){out=fail('Project owner is required','PROJECT_OWNER_REQUIRED');break;}
    const duplicate=s.projects.find(x=>x.name.toLowerCase()===name.toLowerCase());
    if(duplicate){out=fail(`Project already exists: ${duplicate.id}`,'PROJECT_DUPLICATE');break;}
    const prj={
      id:nextId('project','PRJ'),name,client:p.client||null,owner,
      collaborators:[...new Set((p.collaborators||[]).filter(Boolean).filter(x=>x!==owner))],
      department:p.department||null,status:p.status||'Planning',startDate:p.startDate||null,dueDate:p.dueDate||null,
      plannedLaborHours:Number(p.plannedLaborHours||0),approvedLaborBudget:Number(p.approvedLaborBudget||0),currency:p.currency||'USD',
      notes:p.notes||null,createdAt:nowIso,updatedAt:nowIso
    };
    s.projects.push(prj);
    log('project.create','project',prj.id,'Successful',{newState:prj});
    out=response({project:{...prj,...computeProject(prj)},dashboard:dashboard()},'Project created');
    break;
  }

  case 'task.create': {
    const prj=projectById(p.projectId);
    if(!prj){out=fail('Task must link to one valid project','PROJECT_REQUIRED');break;}
    const name=String(p.name||'').trim();
    const responsible=String(p.responsible||'').trim();
    if(!name){out=fail('Task name is required','TASK_NAME_REQUIRED');break;}
    if(!responsible){out=fail('Task must have exactly one responsible worker','RESPONSIBLE_REQUIRED');break;}
    if(!projectMembers(prj).includes(responsible)){out=fail('Responsible worker must be the project owner or a project collaborator','RESPONSIBLE_NOT_PROJECT_MEMBER');break;}
    const t={
      id:nextId('task','TSK'),projectId:prj.id,name,responsible,
      collaborators:[...new Set((p.collaborators||[]).filter(Boolean).filter(x=>x!==responsible))],
      reviewer:p.reviewer||prj.owner,status:p.status||'Not Started',priority:p.priority||'Medium',dueDate:p.dueDate||null,
      plannedHours:Number(p.plannedHours||0),acceptanceCriteria:p.acceptanceCriteria||null,description:p.description||null,
      escalationStatus:'None',escalationReason:null,reviewState:'Not Submitted',reviewSubmissionCycle:0,qualityApprovalCycle:0,
      createdAt:nowIso,updatedAt:nowIso
    };
    s.tasks.push(t);
    log('task.create','task',t.id,'Successful',{newState:t});
    out=response({task:taskView(t),project:{...prj,...computeProject(prj)},dashboard:dashboard()},'Task created and assigned');
    break;
  }

  case 'task.validate': {
    const t=taskById(p.taskId);
    if(!t){out=fail('Task not found','TASK_NOT_FOUND');break;}
    const prj=projectById(t.projectId);
    const errors=[];
    if(!prj)errors.push('Task must link to exactly one valid project');
    if(!t.responsible)errors.push('Task must have exactly one responsible person');
    if(prj&&t.responsible&&!projectMembers(prj).includes(t.responsible))errors.push('Responsible person must be a project member');
    t.validationStatus=errors.length?'Invalid':'Valid';
    t.validationErrors=errors;
    t.lastCalculatedAt=nowIso;
    log('task.validate','task',t.id,errors.length?'Failed':'Successful',{newState:{validationStatus:t.validationStatus,errors}});
    out=response({task:taskView(t)},errors.length?'Task validation completed with errors':'Task validation passed');
    break;
  }

  case 'task.sync':
  case 'project.sync': {
    const entity=req.action==='task.sync'?taskById(p.taskId):projectById(p.projectId);
    if(!entity){out=fail('Requested entity not found','ENTITY_NOT_FOUND');break;}
    const blocked=['actualOriginalHours','reworkHours','totalRecordedHours','approvedHours','approvedLaborCost','approvedReworkCost','remainingLaborBudget','progress','health','qualityApprovalCycle'];
    Object.entries(p.changes||{}).forEach(([k,v])=>{if(!blocked.includes(k))entity[k]=v;});
    entity.updatedAt=nowIso;
    if(req.action==='task.sync'){
      const t=entity,prj=projectById(t.projectId);
      if(!prj||!t.responsible||!projectMembers(prj).includes(t.responsible)){out=fail('Task update violates project/responsible-person integrity','TASK_INTEGRITY_FAILED');break;}
    }
    log(req.action,req.action.startsWith('task')?'task':'project',entity.id,'Successful',{newState:p.changes||{}});
    out=response({entity},'Source fields synchronized; derived fields remain system-controlled');
    break;
  }

  case 'task.workQueue': {
    const worker=String(p.worker||'').trim();
    if(!worker){out=fail('Worker is required','WORKER_REQUIRED');break;}
    const mine=s.tasks.filter(t=>t.responsible===worker).map(taskView);
    const groups={
      active:mine.filter(t=>!terminal(t.status)&&t.status!=='For Review'&&t.status!=='Revision'&&!t.openRevision),
      revisionRequired:mine.filter(t=>t.status==='Revision'||t.reviewState==='Revision Required'||!!t.openRevision),
      forReview:mine.filter(t=>t.status==='For Review'),
      completed:mine.filter(t=>terminal(t.status))
    };
    const current=activeSession(worker)||null;
    out=response({worker,currentSession:current,summary:{assigned:mine.length,active:groups.active.length,revisionRequired:groups.revisionRequired.length,forReview:groups.forReview.length,completed:groups.completed.length},groups},'Worker My Work queue');
    break;
  }

  case 'task.reviewQueue': {
    const reviewer=String(p.reviewer||'').trim();
    const canSee=t=>{
      if(!reviewer)return true;
      const prj=projectById(t.projectId);
      return t.reviewer===reviewer||prj?.owner===reviewer;
    };
    const pending=s.tasks.filter(t=>t.status==='For Review'&&canSee(t)).map(reviewEvidence);
    const revisionResubmissions=pending.filter(x=>x.revisions[0]&&['Resolved','Closed'].includes(x.revisions[0].state));
    const firstSubmissions=pending.filter(x=>!x.revisions[0]);
    const approved=s.tasks.filter(t=>t.status==='Approved'&&canSee(t)).sort((a,b)=>new Date(b.approvedAt||0)-new Date(a.approvedAt||0)).slice(0,20).map(reviewEvidence);
    out=response({reviewer:reviewer||'all',summary:{awaitingReview:pending.length,revisionResubmissions:revisionResubmissions.length,firstSubmissions:firstSubmissions.length,recentApproved:approved.length},pending,revisionResubmissions,firstSubmissions,recentApproved:approved},'Review and Approval queue');
    break;
  }

  case 'task.complete':
  case 'task.sendReview':
  case 'task.approve': {
    const t=taskById(p.taskId);
    if(!t){out=fail('Task not found','TASK_NOT_FOUND');break;}
    const prev={status:t.status,reviewState:t.reviewState};
    if(req.action==='task.complete'){
      if(activeSessionForTask(t.id)){out=fail('Stop the active work session before completing the task','STOP_WORK_REQUIRED');break;}
      t.status='Completed';t.reviewState='Ready for Review';t.completedAt=nowIso;
    }
    if(req.action==='task.sendReview'){
      if(activeSessionForTask(t.id)){out=fail('Stop the active work session before submitting for review','STOP_WORK_REQUIRED');break;}
      const open=openRevisionForTask(t.id);
      if(open){out=fail(`Revision ${open.id} must be resolved before resubmission`,'REVISION_OPEN');break;}
      t.status='For Review';t.reviewState='For Review';t.submittedAt=nowIso;t.submittedBy=p.worker||p.actor||t.responsible;
      t.submissionType=latestRevisionForTask(t.id)?'REVISION':'ORIGINAL';
      t.reviewSubmissionCycle=Number(t.reviewSubmissionCycle||0)+1;
    }
    if(req.action==='task.approve'){
      if(t.status!=='For Review'){out=fail('Only tasks in For Review can be approved','TASK_NOT_FOR_REVIEW');break;}
      if(openRevisionForTask(t.id)){out=fail('Open revision must be resolved before approval','REVISION_OPEN');break;}
      t.status='Approved';t.reviewState='Approved';t.approvedAt=nowIso;t.approvedBy=p.approver||p.reviewer||p.actor||'Portfolio Reviewer';
      t.qualityApprovalCycle=Number(t.qualityApprovalCycle||0)+1;
    }
    t.updatedAt=nowIso;
    log(req.action,'task',t.id,'Successful',{previousState:prev,newState:{status:t.status,reviewState:t.reviewState,reviewSubmissionCycle:t.reviewSubmissionCycle,qualityApprovalCycle:t.qualityApprovalCycle}});
    out=response({task:taskView(t),dashboard:dashboard()},'Task state updated');
    break;
  }

  case 'session.start':
  case 'session.resume': {
    const t=taskById(p.taskId);
    if(!t){out=fail('Task not found','TASK_NOT_FOUND');break;}
    const worker=p.worker||t.responsible;
    if(!worker){out=fail('Worker is required','WORKER_REQUIRED');break;}
    const openRevision=openRevisionForTask(t.id);
    const allowedWorkers=new Set([t.responsible,openRevision?.assignee].filter(Boolean));
    if(!allowedWorkers.has(worker)){out=fail('Only the responsible worker or current revision assignee can start this task','WORKER_NOT_ASSIGNED');break;}
    if(['For Review','Approved','Cancelled'].includes(t.status)){out=fail(`Task is ${t.status}; it cannot start a work session`,'TASK_NOT_EXECUTABLE');break;}
    const active=activeSession(worker);
    if(active){out=fail(`Worker already has an active session: ${active.id}`,'ACTIVE_SESSION_EXISTS');break;}
    const type=p.sessionType||(openRevision?'REVISION':'ORIGINAL');
    if(type==='REVISION'&&!openRevision&&!p.revisionId){out=fail('Revision work requires an open revision','REVISION_REQUIRED');break;}
    const revisionId=type==='REVISION'?(p.revisionId||openRevision?.id||null):null;
    const ses={id:nextId('session','SES'),worker,projectId:t.projectId,taskId:t.id,revisionId,sessionType:type,state:'ACTIVE',start:p.start||nowIso,end:null,durationHours:0,startSource:req.action==='session.resume'?'RESUME':'START',closeReason:null,idempotencyKey:dedupeKey||`${req.action}:${worker}:${t.id}:${req.requestId}`,correlationId:req.correlationId||req.requestId,executionId:$execution.id};
    s.sessions.push(ses);
    t.status=type==='REVISION'?'Revision':'In Progress';
    t.reviewState=type==='REVISION'?'Revision Required':'Working';
    log(req.action,'session',ses.id,'Successful',{newState:ses});
    out=response({session:ses,task:taskView(t)},req.action==='session.resume'?'New append-only resume session created':'Work session started');
    break;
  }

  case 'session.pause':
  case 'session.stop': {
    let ses=p.sessionId?s.sessions.find(x=>x.id===p.sessionId):activeSession(p.worker||'');
    if(!ses&&p.taskId)ses=s.sessions.find(x=>x.taskId===p.taskId&&x.state==='ACTIVE');
    if(!ses){out=fail('No active session found','ACTIVE_SESSION_NOT_FOUND');break;}
    const end=p.end||nowIso;
    const dur=p.durationHours!=null?Number(p.durationHours):hoursBetween(ses.start,end);
    ses.end=end;ses.durationHours=+dur.toFixed(4);ses.state='CLOSED';ses.closeReason=p.closeReason||(req.action==='session.pause'?'Paused':'Stopped');
    log(req.action,'session',ses.id,'Successful',{newState:{state:ses.state,end:ses.end,durationHours:ses.durationHours,closeReason:ses.closeReason}});
    const t=taskById(ses.taskId);
    out=response({session:ses,task:t?taskView(t):null,dashboard:dashboard()},req.action==='session.pause'?'Session closed for pause; resume will create a new session':'Session stopped and closed');
    break;
  }

  case 'revision.create': {
    const t=taskById(p.taskId);
    if(!t){out=fail('Task not found','TASK_NOT_FOUND');break;}
    if(openRevisionForTask(t.id)){out=fail('Task already has an open revision','REVISION_ALREADY_OPEN');break;}
    const reason=String(p.reason||'').trim();
    if(!reason){out=fail('Revision reason is required','REVISION_REASON_REQUIRED');break;}
    if(!['For Review','Approved','Completed'].includes(t.status)){out=fail('Revision can only be requested from submitted, approved, or completed work','TASK_NOT_REVIEWABLE');break;}
    const number=Math.max(0,...s.revisions.filter(r=>r.taskId===t.id).map(r=>Number(r.number||0)))+1;
    const rev={
      id:nextId('revision','REV'),number,taskId:t.id,projectId:t.projectId,
      requester:p.requester||p.reviewer||'Reviewer',assignee:p.assignee||t.responsible,reason,reviewerNote:p.reviewerNote||reason,
      rootCause:p.rootCause||null,deadline:p.deadline||null,state:'Open',resolutionEvidence:null,createdAt:nowIso,resolvedAt:null,resubmittedAt:null
    };
    s.revisions.push(rev);
    const prev={status:t.status,reviewState:t.reviewState,approvedAt:t.approvedAt||null,approvedBy:t.approvedBy||null};
    t.status='Revision';t.reviewState='Revision Required';t.currentRevisionId=rev.id;t.updatedAt=nowIso;
    t.approvedAt=null;t.approvedBy=null;
    log('revision.create','revision',rev.id,'Successful',{previousState:prev,newState:rev});
    out=response({revision:rev,task:taskView(t)},'Revision created; new sessions on this task will be classified as rework');
    break;
  }

  case 'revision.update': {
    const rev=revisionById(p.revisionId);
    if(!rev){out=fail('Revision not found','REVISION_NOT_FOUND');break;}
    const prev={state:rev.state,resolutionEvidence:rev.resolutionEvidence};
    const requestedState=p.state||p.changes?.state||rev.state;
    const resolution=p.resolutionEvidence||p.changes?.resolutionEvidence||rev.resolutionEvidence;
    if(['Resolved','Closed'].includes(requestedState)&&!String(resolution||'').trim()){
      out=fail('Resolution evidence is required before a revision can be resubmitted','RESOLUTION_EVIDENCE_REQUIRED');break;
    }
    Object.assign(rev,p.changes||{});
    rev.state=requestedState;
    if(resolution)rev.resolutionEvidence=resolution;
    if(['Resolved','Closed'].includes(rev.state)){
      rev.resolvedAt=rev.resolvedAt||nowIso;
      rev.resubmittedAt=nowIso;
      const t=taskById(rev.taskId);
      if(t){
        if(activeSessionForTask(t.id)){out=fail('Stop revision work before resolving and resubmitting','STOP_WORK_REQUIRED');break;}
        t.status='For Review';t.reviewState='For Review';t.submittedAt=nowIso;t.submittedBy=p.worker||rev.assignee;t.submissionType='REVISION';
        t.reviewSubmissionCycle=Number(t.reviewSubmissionCycle||0)+1;t.currentRevisionId=rev.id;t.updatedAt=nowIso;
      }
    }
    log('revision.update','revision',rev.id,'Successful',{previousState:prev,newState:{state:rev.state,resolutionEvidence:rev.resolutionEvidence,resubmittedAt:rev.resubmittedAt}});
    const t=taskById(rev.taskId);
    out=response({revision:rev,task:t?taskView(t):null},['Resolved','Closed'].includes(rev.state)?'Revision resolved and resubmitted for approval':'Revision updated');
    break;
  }

  case 'timesheet.build': {
    const worker=p.worker;
    if(!worker){out=fail('Worker is required','WORKER_REQUIRED');break;}
    const period=p.period||nowIso.slice(0,7);
    const eligible=s.sessions.filter(x=>x.worker===worker&&x.state==='CLOSED'&&String(x.start).slice(0,7)===period);
    const original=eligible.filter(x=>x.sessionType==='ORIGINAL').reduce((a,x)=>a+Number(x.durationHours||0),0);
    const rework=eligible.filter(x=>x.sessionType==='REVISION').reduce((a,x)=>a+Number(x.durationHours||0),0);
    let ts=s.timesheets.find(x=>x.worker===worker&&x.period===period&&x.status!=='Approved');
    if(!ts){ts={id:nextId('timesheet','TS'),worker,period,status:'Draft',recordedOriginalHours:0,recordedReworkHours:0,approvedOriginalHours:0,approvedReworkHours:0,adjustments:0,approver:null,approvalTimestamp:null,ledgerPosted:false,locked:false,sessionIds:[]};s.timesheets.push(ts);}
    if(ts.locked){out=fail('Approved timesheet is locked','TIMESHEET_LOCKED');break;}
    ts.recordedOriginalHours=+original.toFixed(2);ts.recordedReworkHours=+rework.toFixed(2);ts.sessionIds=eligible.map(x=>x.id);ts.updatedAt=nowIso;
    log('timesheet.build','timesheet',ts.id,'Successful',{newState:{recordedOriginalHours:ts.recordedOriginalHours,recordedReworkHours:ts.recordedReworkHours,sessionCount:ts.sessionIds.length}});
    out=response({timesheet:ts},'Timesheet rebuilt from closed session evidence');
    break;
  }

  case 'timesheet.submit': {
    const ts=timesheetById(p.timesheetId);
    if(!ts){out=fail('Timesheet not found','TIMESHEET_NOT_FOUND');break;}
    if(ts.locked){out=fail('Timesheet is locked','TIMESHEET_LOCKED');break;}
    ts.status='Submitted';ts.submittedAt=nowIso;ts.submittedBy=p.worker||ts.worker;
    log('timesheet.submit','timesheet',ts.id,'Successful',{newState:{status:ts.status}});
    out=response({timesheet:ts},'Timesheet submitted for approval');
    break;
  }

  case 'timesheet.reviewQueue': {
    const approver=p.approver||null;
    const submitted=s.timesheets.filter(ts=>ts.status==='Submitted').map(ts=>({
      ...ts,
      sessions:s.sessions.filter(x=>ts.sessionIds.includes(x.id)),
      recordedTotalHours:+(Number(ts.recordedOriginalHours||0)+Number(ts.recordedReworkHours||0)).toFixed(2)
    }));
    const recentlyApproved=s.timesheets.filter(ts=>ts.status==='Approved').sort((a,b)=>new Date(b.approvalTimestamp||0)-new Date(a.approvalTimestamp||0)).slice(0,20);
    out=response({approver,summary:{submitted:submitted.length,recentApproved:recentlyApproved.length},submitted,recentlyApproved},'Timesheet approval queue');
    break;
  }

  case 'timesheet.return':
  case 'timesheet.reject': {
    const ts=timesheetById(p.timesheetId);
    if(!ts){out=fail('Timesheet not found','TIMESHEET_NOT_FOUND');break;}
    if(ts.locked){out=fail('Approved timesheet is locked','TIMESHEET_LOCKED');break;}
    ts.status=req.action==='timesheet.reject'?'Rejected':'Returned';ts.reviewNote=p.reviewNote||null;ts.reviewedAt=nowIso;ts.reviewedBy=p.approver||p.actor||null;
    log(req.action,'timesheet',ts.id,'Successful',{newState:{status:ts.status,reviewNote:ts.reviewNote}});
    out=response({timesheet:ts},`Timesheet ${ts.status.toLowerCase()}`);
    break;
  }

  case 'timesheet.approve': {
    const ts=timesheetById(p.timesheetId);
    if(!ts){out=fail('Timesheet not found','TIMESHEET_NOT_FOUND');break;}
    if(ts.status!=='Submitted'){out=fail('Only submitted timesheets can be approved','TIMESHEET_NOT_SUBMITTED');break;}
    if(ts.locked||ts.ledgerPosted){out=fail('Timesheet approval already posted','DUPLICATE_APPROVAL');break;}
    const sessions=s.sessions.filter(x=>ts.sessionIds.includes(x.id)&&x.state==='CLOSED');
    const newLines=[];
    for(const ses of sessions){
      if(s.ledger.some(l=>l.sessionId===ses.id&&l.timesheetId===ts.id))continue;
      const rate=rateFor(ts.worker,ses.start);
      if(!rate){out=fail(`No effective labor rate for ${ts.worker} on ${String(ses.start).slice(0,10)}`,'RATE_NOT_FOUND');break;}
      const hours=Number(ses.durationHours||0);
      const line={id:nextId('ledger','LED'),timesheetId:ts.id,worker:ts.worker,projectId:ses.projectId,taskId:ses.taskId,sessionId:ses.id,revisionId:ses.revisionId||null,workType:ses.sessionType,approvedHours:+hours.toFixed(4),appliedRateId:rate.id,appliedRate:Number(rate.hourlyRate),currency:rate.currency,laborCost:+(hours*Number(rate.hourlyRate)).toFixed(2),approvalDate:nowIso.slice(0,10),period:ts.period,locked:true,createdAt:nowIso};
      s.ledger.push(line);newLines.push(line);
    }
    if(out)break;
    ts.approvedOriginalHours=+newLines.filter(x=>x.workType==='ORIGINAL').reduce((a,x)=>a+x.approvedHours,0).toFixed(2);
    ts.approvedReworkHours=+newLines.filter(x=>x.workType==='REVISION').reduce((a,x)=>a+x.approvedHours,0).toFixed(2);
    ts.status='Approved';ts.approver=p.approver||'Portfolio Approver';ts.approvalTimestamp=nowIso;ts.ledgerPosted=true;ts.locked=true;
    log('timesheet.approve','timesheet',ts.id,'Successful',{newState:{status:ts.status,ledgerLines:newLines.length}});
    out=response({timesheet:ts,ledgerLines:newLines,dashboard:dashboard()},'Timesheet approved and locked ledger lines posted');
    break;
  }

  case 'rate.resolve': {
    const worker=p.worker;const at=p.at||nowIso;const rate=rateFor(worker,at);
    if(!rate){out=fail(`No effective labor rate for ${worker}`,'RATE_NOT_FOUND');break;}
    out=response({rate,at},'Effective-dated labor rate resolved');
    break;
  }

  case 'ledger.post':
    out=fail('Direct ledger posting is disabled. Approve a timesheet to create locked ledger lines.','LEDGER_SOURCE_ENFORCED');
    break;

  case 'escalation.create': {
    const t=taskById(p.taskId);
    if(!t){out=fail('Task not found','TASK_NOT_FOUND');break;}
    if(t.escalationStatus==='Escalated'){out=response({task:taskView(t),duplicate:true},'Task is already escalated');break;}
    t.escalationStatus='Escalated';t.escalationReason=p.reason||'Escalated from portfolio demo';t.escalatedAt=nowIso;t.status=t.status==='Done'?'Done':'Stuck';
    log('escalation.create','task',t.id,'Successful',{newState:{escalationStatus:t.escalationStatus,reason:t.escalationReason}});
    out=response({task:taskView(t),dashboard:dashboard()},'Escalation created');
    break;
  }

  case 'escalation.clear': {
    const t=taskById(p.taskId);
    if(!t){out=fail('Task not found','TASK_NOT_FOUND');break;}
    t.escalationStatus='None';t.escalationReason=null;t.escalationClearedAt=nowIso;if(t.status==='Stuck')t.status='In Progress';
    log('escalation.clear','task',t.id,'Successful',{newState:{escalationStatus:t.escalationStatus}});
    out=response({task:taskView(t),dashboard:dashboard()},'Escalation cleared');
    break;
  }

  case 'dashboard.refresh': {
    s.tasks.forEach(t=>Object.assign(t,computeTask(t),{lastCalculatedAt:nowIso}));
    s.projects.forEach(prj=>Object.assign(prj,computeProject(prj),{lastCalculatedAt:nowIso}));
    log('dashboard.refresh','dashboard','PROJECT-02','Successful');
    out=response({dashboard:dashboard()},'Dashboard recalculated from source evidence');
    break;
  }

  case 'reconciliation.run': {
    const issues=[];const repairs=[];
    const byWorker={};
    for(const ses of s.sessions.filter(x=>x.state==='ACTIVE'))(byWorker[ses.worker] ||= []).push(ses);
    for(const [worker,list] of Object.entries(byWorker)){
      if(list.length>1){
        list.sort((a,b)=>new Date(b.start)-new Date(a.start));
        for(const extra of list.slice(1)){
          extra.state='CLOSED';extra.end=extra.end||nowIso;extra.durationHours=+hoursBetween(extra.start,extra.end).toFixed(4);extra.closeReason='Reconciliation auto-close duplicate active session';repairs.push(`Closed duplicate active session ${extra.id} for ${worker}`);
        }
      }
    }
    for(const ses of s.sessions){
      if(!taskById(ses.taskId)){issues.push(`Orphan session ${ses.id}: task ${ses.taskId} missing`);continue;}
      const t=taskById(ses.taskId);
      if(ses.projectId!==t.projectId){ses.projectId=t.projectId;repairs.push(`Repaired project link on ${ses.id}`);}
      if(ses.state==='CLOSED'&&!ses.end)issues.push(`Closed session ${ses.id} has no end timestamp`);
    }
    for(const t of s.tasks){
      const open=openRevisionForTask(t.id);
      if(open&&t.status!=='Revision'){issues.push(`Task ${t.id} has open revision ${open.id} but status is ${t.status}`);}
      if(t.status==='For Review'&&activeSessionForTask(t.id)){issues.push(`Task ${t.id} is For Review but still has an active work session`);}
    }
    const ledgerKeys={};
    for(const line of s.ledger){
      const key=`${line.timesheetId}:${line.sessionId}`;
      if(ledgerKeys[key])issues.push(`Duplicate ledger evidence ${key}`);
      ledgerKeys[key]=true;
      if(!line.locked)issues.push(`Ledger line ${line.id} is not locked`);
    }
    for(const worker of [...new Set(s.rates.map(r=>r.worker))]){
      const rates=s.rates.filter(r=>r.worker===worker).sort((a,b)=>new Date(a.effectiveFrom)-new Date(b.effectiveFrom));
      for(let i=1;i<rates.length;i++){
        const prev=rates[i-1],cur=rates[i];
        if(!prev.effectiveTo||new Date(prev.effectiveTo)>=new Date(cur.effectiveFrom))issues.push(`Rate overlap for ${worker}: ${prev.id}/${cur.id}`);
      }
    }
    s.tasks.forEach(t=>Object.assign(t,computeTask(t),{lastCalculatedAt:nowIso}));
    s.projects.forEach(prj=>Object.assign(prj,computeProject(prj),{lastCalculatedAt:nowIso}));
    log('reconciliation.run','system','PROJECT-02',issues.length?'Warning':'Successful',{newState:{issues,repairs}});
    out=response({issues,repairs,dashboard:dashboard()},`Reconciliation complete: ${issues.length} issue(s), ${repairs.length} safe repair(s)`);
    break;
  }

  case 'automation.retry':
    log('automation.retry','automation',p.originalExecutionId||'unknown','Successful',{newState:{retryRequested:true}});
    out=response({accepted:true,originalExecutionId:p.originalExecutionId||null},'Retry request recorded');
    break;

  default:
    out=fail(`Unsupported action: ${req.action}`,'UNSUPPORTED_ACTION');
}

if(dedupeKey&&out?.[0]?.json?.ok){
  s.processedKeys[dedupeKey]={action:req.action,executionId:$execution.id,at:nowIso};
  const keys=Object.keys(s.processedKeys);
  if(keys.length>300){for(const k of keys.slice(0,keys.length-300))delete s.processedKeys[k];}
  store.clients[clientId]=s;
}
return out;
