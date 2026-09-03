(function(){
  if(typeof projectRows==='undefined'||typeof tasks==='undefined'||typeof timeline!=='function')return;

  const projectSchedule={
    'PRJ-021':{start:'2026-08-03',deadline:'2026-10-30'},
    'PRJ-024':{start:'2026-08-17',deadline:'2026-11-13'},
    'PRJ-029':{start:'2026-08-03',deadline:'2026-09-18'},
    'PRJ-031':{start:'2026-09-01',deadline:'2026-11-20'},
    'PRJ-033':{start:'2026-08-10',deadline:'2026-10-09'},
    'PRJ-036':{start:'2026-08-24',deadline:'2026-10-23'}
  };
  const taskSchedule={
    'TASK-0241':{start:'2026-08-24',deadline:'2026-09-08'},
    'TASK-0242':{start:'2026-09-01',deadline:'2026-09-10'},
    'TASK-0243':{start:'2026-09-01',deadline:'2026-09-12'},
    'TASK-0244':{start:'2026-09-04',deadline:'2026-09-15'},
    'TASK-0245':{start:'2026-09-01',deadline:'2026-09-18'},
    'TASK-0246':{start:'2026-09-07',deadline:'2026-09-20'},
    'TASK-0247':{start:'2026-09-08',deadline:'2026-09-22'}
  };

  const dateLabel=iso=>new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(`${iso}T00:00:00Z`));
  const shortDate=iso=>new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',timeZone:'UTC'}).format(new Date(`${iso}T00:00:00Z`));
  projectRows.forEach(project=>Object.assign(project,projectSchedule[project.id]||{}));
  tasks.forEach(task=>{
    const schedule=taskSchedule[task.id];
    if(!schedule)return;
    task.start=schedule.start;
    task.deadline=schedule.deadline;
    task.due=dateLabel(schedule.deadline);
  });

  const style=document.createElement('style');
  style.textContent=`
    .project-meta.with-deadline{grid-template-columns:repeat(4,minmax(0,1fr))}
    .deadline-value{color:#8d392f!important}
    .wg-shell{overflow:auto;background:#fff}
    .wg-toolbar{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
    .wg-grid{display:grid;grid-template-columns:260px repeat(18,minmax(64px,1fr));min-width:1420px;position:relative}
    .wg-head{position:sticky;top:0;z-index:7;background:#f8faf9;border-bottom:1px solid #dfe7e2}
    .wg-head>div{padding:8px 6px;font-size:7px;color:#77877f;border-left:1px solid #e9efeb;white-space:nowrap}
    .wg-head>div:first-child{border-left:0;font-weight:800;color:#29463a}
    .wg-head .current-week{background:#fff4ef;color:#9d4036;font-weight:800}
    .wg-row{display:grid;grid-template-columns:260px repeat(18,minmax(64px,1fr));min-width:1420px;min-height:52px;align-items:center;border-bottom:1px solid #edf1ef;position:relative;background:#fff}
    .wg-row.task{min-height:45px;background:#fbfcfb}
    .wg-label{grid-column:1;align-self:stretch;display:flex;align-items:center;gap:8px;padding:7px 10px;position:sticky;left:0;z-index:5;background:inherit;border-right:1px solid #dfe7e2;min-width:0}
    .wg-toggle{width:25px;height:25px;border:1px solid #cad8d0;border-radius:6px;background:#fff;color:#1b6843;font-weight:900;cursor:pointer;flex:0 0 auto}
    .wg-label-copy{min-width:0;flex:1}.wg-label-copy b{display:block;font-size:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.wg-label-copy span{display:block;margin-top:2px;font-size:6px;color:#7b8a82;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .wg-deadline{font-size:6px;color:#9a4037;font-weight:800;white-space:nowrap}
    .wg-row.task .wg-label{padding-left:44px}.wg-row.task .wg-label-copy b{font-weight:700}.wg-row.task .wg-label-copy span{color:#87958e}
    .wg-cell{height:100%;border-left:1px solid #f0f3f1;grid-row:1}
    .wg-current-cell{background:rgba(208,64,56,.035)}
    .wg-bar{grid-row:1;height:20px;z-index:3;border-radius:5px;background:#d8e8df;overflow:hidden;align-self:center;position:relative;border:1px solid rgba(20,91,56,.12)}
    .wg-bar>i{display:block;height:100%;background:#2f8d5c;border-radius:4px;font-style:normal}
    .wg-bar.risk{background:#f5e6bf;border-color:#d6a438}.wg-bar.risk>i{background:#d6a438}.wg-bar.delayed{background:#f6d8d4;border-color:#c85d52}.wg-bar.delayed>i{background:#c85d52}
    .wg-row.task .wg-bar{height:12px;background:#e7eefb;border-color:#b6c6e7}.wg-row.task .wg-bar>i{background:#5277be}
    .wg-milestone{grid-row:1;z-index:4;width:2px;height:28px;background:#c6453c;justify-self:end;position:relative}.wg-milestone:after{content:'deadline';position:absolute;right:4px;top:-10px;color:#a53d35;font-size:5px;text-transform:uppercase;white-space:nowrap}
    .wg-summary{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:9px;font-size:7px;color:#718078}
    .wg-summary span{display:inline-flex;align-items:center;gap:4px}.wg-summary i{width:8px;height:8px;border-radius:2px;background:#2f8d5c}.wg-summary .task-key i{background:#5277be}.wg-summary .deadline-key i{width:2px;background:#c6453c}
    @media(max-width:760px){.project-meta.with-deadline{grid-template-columns:1fr 1fr}.wg-grid,.wg-row{grid-template-columns:210px repeat(18,minmax(62px,1fr));min-width:1326px}.wg-label{padding-inline:8px}.wg-row.task .wg-label{padding-left:34px}}
  `;
  document.head.appendChild(style);

  const baseProjectsWithOpen=projectsView;
  projectsView=function(){
    baseProjectsWithOpen();
    document.querySelectorAll('.project-card').forEach(card=>{
      const id=card.querySelector('header small')?.textContent.trim();
      const project=projectRows.find(row=>row.id===id);
      if(!project?.deadline)return;
      const meta=card.querySelector('.project-meta');
      if(meta&&!meta.querySelector('[data-project-deadline]')){
        meta.classList.add('with-deadline');
        meta.insertAdjacentHTML('beforeend',`<div data-project-deadline><span>Deadline</span><b class="deadline-value">${dateLabel(project.deadline)}</b></div>`);
      }
    });
  };

  const baseOverviewWithOpen=overview;
  overview=function(){
    baseOverviewWithOpen();
    const table=document.querySelector('.panel .table');
    if(!table||table.dataset.deadlinesAdded)return;
    table.dataset.deadlinesAdded='1';
    const headRow=table.querySelector('thead tr');
    const healthHead=headRow?.lastElementChild;
    if(healthHead)healthHead.insertAdjacentHTML('beforebegin','<th>Deadline</th>');
    table.querySelectorAll('tbody tr').forEach(row=>{
      const id=row.querySelector('.name span')?.textContent.trim();
      const project=projectRows.find(item=>item.id===id);
      const healthCell=row.lastElementChild;
      if(project?.deadline&&healthCell)healthCell.insertAdjacentHTML('beforebegin',`<td><strong class="deadline-value">${dateLabel(project.deadline)}</strong></td>`);
    });
  };

  const baseTaskBoardWithFilter=taskBoard;
  taskBoard=function(){
    baseTaskBoardWithFilter();
    document.querySelectorAll('.task-meta div').forEach(meta=>{
      const label=meta.querySelector('span');
      if(label?.textContent.trim()==='Due')label.textContent='Deadline';
    });
  };

  const baseWorkspace=workspace;
  workspace=function(){
    baseWorkspace();
    const task=typeof currentTask==='function'?currentTask():null;
    const meta=document.querySelector('.timer-meta');
    if(task?.deadline&&meta&&!meta.querySelector('[data-task-deadline]')){
      meta.style.gridTemplateColumns='repeat(4,1fr)';
      meta.insertAdjacentHTML('beforeend',`<div data-task-deadline><span>Deadline</span><b class="deadline-value">${dateLabel(task.deadline)}</b></div>`);
    }
  };

  const expandedProjects=new Set(['PRJ-021']);
  const weeks=['2026-08-03','2026-08-10','2026-08-17','2026-08-24','2026-08-31','2026-09-07','2026-09-14','2026-09-21','2026-09-28','2026-10-05','2026-10-12','2026-10-19','2026-10-26','2026-11-02','2026-11-09','2026-11-16','2026-11-23','2026-11-30'];
  const rangeStart=new Date(`${weeks[0]}T00:00:00Z`);
  const DAY=86400000,WEEK=7*DAY;
  const currentDate='2026-09-03';
  function weekIndex(iso){return Math.max(0,Math.min(17,Math.floor((new Date(`${iso}T00:00:00Z`)-rangeStart)/WEEK)));}
  function spanWeeks(start,end){return Math.max(1,Math.min(18-weekIndex(start),Math.ceil((new Date(`${end}T00:00:00Z`)-new Date(`${start}T00:00:00Z`)+DAY)/WEEK)));}
  function statusClass(project){return project.health==='Delayed'?'delayed':project.health==='At Risk'?'risk':'';}
  function cells(){return weeks.map((week,index)=>`<span class="wg-cell ${index===4?'wg-current-cell':''}" style="grid-column:${index+2}"></span>`).join('');}
  function bar(start,end,progress,klass=''){
    const startIndex=weekIndex(start),span=spanWeeks(start,end),deadlineColumn=Math.min(19,startIndex+2+span-1);
    return `${cells()}<span class="wg-bar ${klass}" style="grid-column:${startIndex+2}/span ${span}"><i style="width:${Math.max(4,Math.min(100,progress))}%"></i></span><span class="wg-milestone" style="grid-column:${deadlineColumn}"></span>`;
  }
  function renderProjectRow(project){
    const projectTasks=tasks.filter(task=>task.project===project.id);
    const expanded=expandedProjects.has(project.id);
    const taskRows=expanded?projectTasks.map(task=>`<div class="wg-row task"><div class="wg-label"><div class="wg-label-copy"><b>${task.name}</b><span>${task.id} · ${task.member} · ${task.status}</span></div><span class="wg-deadline">${shortDate(task.deadline)}</span></div>${bar(task.start,task.deadline,task.status==='Done'?100:Math.max(18,Math.min(92,(task.recorded/(task.planned*3600))*100)),'')}</div>`).join(''):'';
    return `<div class="wg-row project"><div class="wg-label"><button class="wg-toggle" type="button" data-gantt-toggle="${project.id}" aria-expanded="${expanded}">${expanded?'−':'+'}</button><div class="wg-label-copy"><b>${project.name}</b><span>${project.id} · ${projectTasks.length} task${projectTasks.length===1?'':'s'} · ${project.progress}% complete</span></div><span class="wg-deadline">${shortDate(project.deadline)}</span></div>${bar(project.start,project.deadline,project.progress,statusClass(project))}</div>${taskRows}`;
  }

  timeline=function(){
    document.getElementById('content').innerHTML=head(
      'Portfolio schedule',
      'Project & Task Timeline',
      'Every active project has a planned window and deadline. Expand any project to see its task-level schedule and task deadlines.',
      '<button class="btn" id="expandAllGantt">Expand all</button><button class="btn" id="collapseAllGantt">Collapse all</button>'
    )+`<section class="panel"><div class="panel-head"><div><h3>Portfolio Gantt Timeline</h3><p>August – November 2026 · project deadlines and task deadlines share the same schedule.</p></div><span class="pill blue">Current date · Sep 3</span></div><div class="wg-shell"><div class="wg-grid wg-head"><div>Project / task · deadline</div>${weeks.map((week,index)=>`<div class="${index===4?'current-week':''}">${shortDate(week)}</div>`).join('')}</div>${projectRows.map(renderProjectRow).join('')}</div></section><div class="wg-summary"><span><i></i>project planned window / progress</span><span class="task-key"><i></i>task window / recorded progress</span><span class="deadline-key"><i></i>deadline</span></div><div class="audit-note" style="margin-top:9px">Project deadlines provide the portfolio commitment date. Expanding a project exposes the task schedule underneath it, so managers can see which task deadlines are driving each project timeline.</div>`;
    document.querySelectorAll('[data-gantt-toggle]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.ganttToggle;if(expandedProjects.has(id))expandedProjects.delete(id);else expandedProjects.add(id);timeline();}));
    document.getElementById('expandAllGantt')?.addEventListener('click',()=>{projectRows.forEach(project=>expandedProjects.add(project.id));timeline();});
    document.getElementById('collapseAllGantt')?.addEventListener('click',()=>{expandedProjects.clear();timeline();});
  };

  nav();
  render();
})();
