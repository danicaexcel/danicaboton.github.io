(function(){
  const projectTaskMap={
    'TASK-0241':'PRJ-021',
    'TASK-0242':'PRJ-021',
    'TASK-0243':'PRJ-024',
    'TASK-0244':'PRJ-029',
    'TASK-0245':'PRJ-031'
  };
  tasks.forEach(task=>{task.project=projectTaskMap[task.id]||task.project||'PRJ-021';});
  const extraTasks=[
    {id:'TASK-0246',name:'Finalize Reporting Data Model',status:'In Progress',priority:'Medium',member:'Ana Cruz',phase:'Reporting',planned:9,recorded:4*3600+35*60,due:'Sep 20',project:'PRJ-033'},
    {id:'TASK-0247',name:'Refactor Workflow Notification Rules',status:'Ready',priority:'High',member:'John Reyes',phase:'Automation Development',planned:11,recorded:1*3600+20*60,due:'Sep 22',project:'PRJ-036'}
  ];
  extraTasks.forEach(task=>{if(!tasks.some(existing=>existing.id===task.id))tasks.push(task);});

  let taskProjectFilter=null;
  icons[8]='$';
  const portfolioLabel=document.querySelector('.portfolio-bar strong');
  if(portfolioLabel)portfolioLabel.textContent='DCode · Project 02';

  const style=document.createElement('style');
  style.textContent='.project-card[data-project-open]{cursor:pointer;transition:border-color .15s,transform .15s}.project-card[data-project-open]:hover,.project-card[data-project-open]:focus{border-color:#78aa8d;transform:translateY(-1px);outline:none}.project-card[data-project-open]::after{content:"Open project tasks →";display:block;margin-top:10px;color:#18864f;font-size:7px;font-weight:800}.project-filter-note{display:inline-flex;align-items:center;gap:6px;padding:6px 8px;border-radius:999px;background:#e7f4ec;color:#176d43;font-size:7px;font-weight:800}';
  document.head.appendChild(style);

  function projectName(projectId){return projectRows.find(project=>project.id===projectId)?.name||projectId;}
  function openProjectTasks(projectId){
    taskProjectFilter=projectId;
    view='Task Board';
    nav();
    render();
    toast(`${projectName(projectId)} · showing project tasks only`);
  }
  function bindProjectCards(){
    document.querySelectorAll('.project-card').forEach(card=>{
      const id=card.querySelector('header small')?.textContent.trim();
      if(!id)return;
      card.dataset.projectOpen=id;
      card.tabIndex=0;
      card.setAttribute('role','button');
      card.setAttribute('aria-label',`Open tasks for ${projectName(id)}`);
      card.onclick=()=>openProjectTasks(id);
      card.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openProjectTasks(id);}};
    });
  }

  const baseProjectsView=projectsView;
  projectsView=function(){baseProjectsView();bindProjectCards();};

  const baseOverview=overview;
  overview=function(){
    baseOverview();
    document.querySelectorAll('.table tbody tr').forEach(row=>{
      const id=row.querySelector('.name span')?.textContent.trim();
      if(!id||!projectRows.some(project=>project.id===id))return;
      row.style.cursor='pointer';
      row.title=`Open ${projectName(id)} tasks`;
      row.onclick=()=>openProjectTasks(id);
    });
  };

  taskBoard=function(){
    const cols=['Backlog','Ready','In Progress','Review','Done'];
    const selectedProject=taskProjectFilter?projectRows.find(project=>project.id===taskProjectFilter):null;
    const visibleTasks=selectedProject?tasks.filter(task=>task.project===selectedProject.id):tasks;
    const actions=selectedProject?`<span class="project-filter-note">${selectedProject.id} · ${selectedProject.name}</span><button class="btn" id="allProjectTasks">All projects</button>`:'';
    document.getElementById('content').innerHTML=head(
      selectedProject?'Project task execution':'Execution control',
      selectedProject?`${selectedProject.name} · Tasks`:'Task Board',
      selectedProject?'Only tasks assigned to this project are shown. Click a task to open its member execution workspace.':'Click a project first to filter this board, or work across all visible project tasks.',
      actions
    )+`<div class="kanban">${cols.map(col=>`<section class="kanban-col"><div class="kanban-head"><span>${col}</span><span>${visibleTasks.filter(task=>task.status===col).length}</span></div>${visibleTasks.filter(task=>task.status===col).map(task=>`<article class="task-card" data-open-task="${task.id}"><header><small>${task.id}</small>${pill(task.priority)}</header><h4>${task.name}</h4><div class="task-meta"><div><span>Assigned</span><b>${task.member}</b></div><div><span>Due</span><b>${task.due}</b></div><div><span>Planned</span><b>${task.planned} h</b></div><div><span>Actual</span><b>${(task.recorded/3600).toFixed(2)} h</b></div></div><div class="task-foot"><span class="pill blue">${task.phase}</span><button data-quick-start="${task.id}">Start</button></div></article>`).join('')}</section>`).join('')}</div>`;
    document.querySelectorAll('[data-open-task]').forEach(card=>card.onclick=event=>{if(event.target.closest('[data-quick-start]'))return;selectedTask=card.dataset.openTask;view='My Workspace';nav();render();});
    document.querySelectorAll('[data-quick-start]').forEach(button=>button.onclick=event=>{event.stopPropagation();attemptStart(button.dataset.quickStart);});
    document.getElementById('allProjectTasks')?.addEventListener('click',()=>{taskProjectFilter=null;render();});
  };

  approvalsView=function(){
    const rate=35,gross=39.25*rate;
    document.getElementById('content').innerHTML=head('Week 36','Approvals','Supervisor review separates recorded work from approved payable labor input.')+`<div class="kpis"><div class="kpi"><span>Regular Work</span><strong>36.50 h</strong><small>standard sessions</small></div><div class="kpi warn"><span>Revision Work</span><strong>2.75 h</strong><small>separate rework</small></div><div class="kpi"><span>Total Submitted</span><strong>39.25 h</strong><small>Maria Santos</small></div><div class="kpi"><span>Rate</span><strong>$${rate}</strong><small>USD per hour</small></div><div class="kpi good"><span>Gross Labor Input</span><strong>$${gross.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong><small>approved work-log input</small></div></div><section class="panel"><div class="panel-head"><div><h3>Maria Santos · Week 36 Timesheet</h3><p>Only an approved timesheet feeds project labor-cost and compensation input calculations.</p></div>${pill(timesheetStatus)}</div><div class="panel-body"><div class="actions" style="justify-content:flex-start"><button class="btn warn" id="adjustBtn">Request Adjustment</button><button class="btn primary" id="approveBtn" ${timesheetStatus==='Approved'?'disabled':''}>Approve Timesheet</button></div></div></section><div class="audit-note">This is approved work-log based compensation input, not a complete payroll system. Taxes, statutory deductions, benefits, payslips, and other payroll functions are outside the demonstrated scope.</div>`;
    document.getElementById('adjustBtn').onclick=()=>{timesheetStatus='Adjustment Requested';addActivity('Alex Rivera','requested timesheet adjustment','TS-W36-MS');render();toast('Adjustment requested · member notified');};
    document.getElementById('approveBtn').onclick=()=>{timesheetStatus='Approved';addActivity('Alex Rivera','approved timesheet','TS-W36-MS');render();toast('Timesheet approved · labor input released');};
  };

  costsView=function(){
    const phases=[['Discovery',48,44],['Development',180,197],['Testing',92,88],['Deployment',45,39],['Documentation',55,50]];
    document.getElementById('content').innerHTML=head('Approved labor analytics','Labor Costs','Planned-versus-actual effort and project labor-cost reporting from approved work sessions.')+`<div class="kpis"><div class="kpi"><span>Labor Budget</span><strong>$10,500</strong><small>USD project baseline</small></div><div class="kpi good"><span>Actual Labor Cost</span><strong>$9,925</strong><small>approved work</small></div><div class="kpi good"><span>Variance</span><strong>−$575</strong><small>under budget</small></div><div class="kpi warn"><span>Rework Cost</span><strong>$525</strong><small>revision sessions</small></div><div class="kpi"><span>Approved-hours rule</span><strong style="font-size:13px">Enforced</strong><small>pending hours excluded</small></div></div><section class="panel"><div class="panel-head"><div><h3>Planned vs actual hours by phase</h3><p>Green = planned · blue = actual.</p></div></div><div class="panel-body">${phases.map(row=>`<div class="cost-row"><label>${row[0]}</label><div class="series"><i style="width:${row[1]/200*100}%"></i></div><div class="series actual"><i style="width:${row[2]/200*100}%"></i></div><b>${row[1]} / ${row[2]}h</b></div>`).join('')}</div></section><div class="audit-note">Labor cost is calculated in USD from approved hours × controlled labor rate. Revision cost remains separately reportable for rework analysis and project-budget variance.</div>`;
  };

  nav();
  render();
})();
