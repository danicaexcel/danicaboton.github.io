(function(){
  const params=new URLSearchParams(location.search);
  if(params.get('id')!=='monday')return;

  const TODAY='2026-09-03';
  const events=[
    {date:'2026-08-31',title:'Review retry queue',type:'task',time:'09:00',owner:'Danica'},
    {date:'2026-09-01',title:'Migration mapping',type:'scheduled',time:'09:30',owner:'Danica'},
    {date:'2026-09-02',title:'Migration mapping',type:'task',time:'',owner:'Danica'},
    {date:'2026-09-03',title:'Portal UAT',type:'scheduled',time:'14:00',owner:'Maya'},
    {date:'2026-09-04',title:'UAT approval',type:'priority',time:'',owner:'Maya'},
    {date:'2026-09-05',title:'CRM production release',type:'priority',time:'',owner:'Maya'},
    {date:'2026-09-08',title:'Recruitment CRM Rollout',type:'project',time:'',owner:'Danica'},
    {date:'2026-09-09',title:'Portal Phase 2 budget',type:'priority',time:'',owner:'Paul'},
    {date:'2026-09-12',title:'Hiring Manager Portal',type:'project',time:'',owner:'Danica'},
    {date:'2026-09-18',title:'Migration Wave 3 review',type:'project',time:'',owner:'Alex'},
    {date:'2026-09-22',title:'Leadership dashboard review',type:'task',time:'11:00',owner:'Paul'},
    {date:'2026-09-28',title:'Operations workspace closeout',type:'project',time:'',owner:'Danica'}
  ];

  const style=document.createElement('style');
  style.textContent=`
    .mcal-native{background:#fff;color:#323338;min-height:100%;font-family:Inter,Arial,sans-serif}
    .mcal-board-head{padding:20px 26px 0;border-bottom:1px solid #d0d4e4;background:#fff}
    .mcal-title-row{display:flex;align-items:center;justify-content:space-between;gap:20px}
    .mcal-title-row h1{font-size:23px;line-height:1.15;margin:0;font-weight:500;letter-spacing:-.02em;color:#323338}
    .mcal-title-row .mcal-board-actions{display:flex;gap:14px;align-items:center;color:#45475a;font-size:11px}
    .mcal-board-actions button,.mcal-tabs button,.mcal-toolbar button,.mcal-controls button{border:0;background:transparent;color:#45475a;cursor:pointer;font:inherit}
    .mcal-tabs{display:flex;gap:4px;align-items:flex-end;margin-top:13px;height:36px}
    .mcal-tabs button{height:36px;padding:0 14px;border-bottom:2px solid transparent;font-size:11px}
    .mcal-tabs button.active{border-bottom-color:#0073ea;color:#323338;font-weight:600}
    .mcal-toolbar{min-height:57px;padding:12px 26px;display:flex;justify-content:space-between;gap:14px;align-items:center;border-bottom:1px solid #d0d4e4;background:#fff}
    .mcal-toolbar-left,.mcal-toolbar-right,.mcal-controls{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .mcal-new{background:#0073ea!important;color:#fff!important;border-radius:4px!important;padding:8px 14px!important;font-weight:600!important}
    .mcal-add{border:1px solid #c5c7d0!important;border-radius:4px!important;padding:7px 12px!important;background:#fff!important}
    .mcal-tool{padding:7px 8px!important;border-radius:4px!important}
    .mcal-tool:hover{background:#f0f1f5!important}
    .mcal-controls .today{border:1px solid #c5c7d0!important;border-radius:4px!important;padding:7px 12px!important;background:#fff!important}
    .mcal-controls .arrow{width:30px;height:30px;border-radius:4px!important;font-size:18px!important}
    .mcal-controls .arrow:hover{background:#f0f1f5!important}
    .mcal-period{min-width:112px;text-align:center;font-size:12px;color:#323338;font-weight:500}
    .mcal-mode{height:30px;border:1px solid #c5c7d0;border-radius:4px;background:#fff;color:#323338;padding:0 28px 0 10px;font-size:11px}
    .mcal-shell{padding:0 26px 22px;background:#fff;overflow:auto}
    .mcal-month{min-width:920px;border-left:1px solid #d0d4e4;border-top:1px solid #d0d4e4}
    .mcal-weekdays{display:grid;grid-template-columns:repeat(7,1fr);height:30px}
    .mcal-weekdays span{display:grid;place-items:center;border-right:1px solid #d0d4e4;border-bottom:1px solid #d0d4e4;font-size:10px;color:#323338}
    .mcal-month-grid{display:grid;grid-template-columns:repeat(7,1fr);grid-auto-rows:120px}
    .mcal-day{position:relative;border-right:1px solid #d0d4e4;border-bottom:1px solid #d0d4e4;padding:8px 8px 6px;min-width:0;background:#fff}
    .mcal-day.outside{background:#fafafa;color:#9b9dad}
    .mcal-day-num{position:absolute;right:8px;top:6px;font-size:10px;color:#5b5d70}
    .mcal-day.today .mcal-day-num{background:#0073ea;color:#fff;border-radius:4px;padding:3px 5px;font-weight:700}
    .mcal-events{display:grid;gap:4px;margin-top:22px}
    .mcal-event{display:block;width:100%;border:0;border-left:3px solid #579bfc;background:#eef6ff;color:#323338;text-align:left;padding:5px 6px;cursor:pointer;font-size:8px;line-height:1.25;overflow:hidden}
    .mcal-event b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600}
    .mcal-event small{display:block;margin-top:2px;color:#676879;font-size:7px}
    .mcal-event.scheduled{border-left-color:#a25ddc;background:#f5ecfb}.mcal-event.priority{border-left-color:#e2445c;background:#fff0f2}.mcal-event.project{border-left-color:#00c875;background:#ecfbf4}
    .mcal-time-view{min-width:980px;border:1px solid #d0d4e4;border-top:0;background:#fff}
    .mcal-time-head{display:grid;grid-template-columns:66px repeat(var(--cols),1fr);height:76px;border-bottom:1px solid #d0d4e4}
    .mcal-time-head>div{border-right:1px solid #d0d4e4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font-size:10px}
    .mcal-time-head b{font-size:11px;font-weight:500}.mcal-time-head .current b{color:#0073ea}.mcal-current-date{display:inline-grid;place-items:center;width:23px;height:23px;background:#0073ea;color:#fff;border-radius:5px;font-weight:700}
    .mcal-time-body{position:relative;display:grid;grid-template-columns:66px 1fr}
    .mcal-times{display:grid;grid-template-rows:repeat(14,40px);border-right:1px solid #d0d4e4}
    .mcal-times span{font-size:9px;padding:6px 8px 0;color:#323338;border-bottom:1px solid #d0d4e4;white-space:nowrap}
    .mcal-time-grid{position:relative;display:grid;grid-template-columns:repeat(var(--cols),1fr);grid-template-rows:repeat(14,40px)}
    .mcal-slot{border-right:1px solid #d0d4e4;border-bottom:1px solid #d0d4e4}
    .mcal-time-event{position:absolute;z-index:4;border-left:3px solid #a25ddc;background:#f5ecfb;padding:5px 7px;font-size:8px;line-height:1.25;overflow:hidden;cursor:pointer}
    .mcal-now{position:absolute;z-index:5;height:2px;background:#0073ea;left:0;right:0;top:390px;pointer-events:none}.mcal-now:before{content:"";position:absolute;left:-4px;top:-4px;width:9px;height:9px;border-radius:50%;background:#0073ea}
    .mcal-empty-note{padding:10px 26px 0;color:#676879;font-size:9px}
    @media(max-width:900px){.mcal-board-head,.mcal-toolbar{padding-left:14px;padding-right:14px}.mcal-shell{padding-left:14px;padding-right:14px}.mcal-title-row{align-items:flex-start}.mcal-board-actions{display:none!important}.mcal-toolbar{align-items:flex-start}.mcal-toolbar-left,.mcal-toolbar-right{width:100%}.mcal-toolbar{flex-direction:column}.mcal-month{min-width:760px}.mcal-time-view{min-width:760px}}
  `;
  document.head.appendChild(style);

  const pad=n=>String(n).padStart(2,'0');
  const iso=d=>`${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}`;
  const sameDay=(a,b)=>iso(a)===b;
  const addDays=(d,n)=>{const x=new Date(d);x.setUTCDate(x.getUTCDate()+n);return x};
  const startMonday=d=>{const x=new Date(d);const day=x.getUTCDay()||7;return addDays(x,1-day)};
  const monthName=d=>d.toLocaleString('en-US',{month:'long',year:'numeric',timeZone:'UTC'});
  const dayLabel=d=>d.toLocaleString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
  const ordinal=n=>n+(n%10===1&&n%100!==11?'st':n%10===2&&n%100!==12?'nd':n%10===3&&n%100!==13?'rd':'th');
  const eventHtml=e=>`<button type="button" class="mcal-event ${e.type}" data-mcal-event="${e.title}"><b>${e.time?`${e.title} · ${e.time}`:e.title}</b><small>${e.type==='project'?'Project deadline':e.type==='scheduled'?'Scheduled work':e.type==='priority'?'Priority attention':'Due date'}</small></button>`;

  function periodLabel(mode,cursor){
    if(mode==='Month')return monthName(cursor);
    if(mode==='Week'){
      const s=startMonday(cursor),e=addDays(s,6);
      return s.getUTCMonth()===e.getUTCMonth()?monthName(s):`${s.toLocaleString('en-US',{month:'short',timeZone:'UTC'})} – ${e.toLocaleString('en-US',{month:'short',year:'numeric',timeZone:'UTC'})}`;
    }
    return `${cursor.toLocaleString('en-US',{month:'short',timeZone:'UTC'})} ${ordinal(cursor.getUTCDate())}, ${cursor.getUTCFullYear()}`;
  }

  function monthBody(cursor){
    const first=new Date(Date.UTC(cursor.getUTCFullYear(),cursor.getUTCMonth(),1));
    const start=startMonday(first);
    const days=Array.from({length:35},(_,i)=>addDays(start,i));
    return `<div class="mcal-month"><div class="mcal-weekdays">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>`<span>${d}</span>`).join('')}</div><div class="mcal-month-grid">${days.map(d=>{const key=iso(d),outside=d.getUTCMonth()!==cursor.getUTCMonth(),today=key===TODAY;return `<div class="mcal-day ${outside?'outside':''} ${today?'today':''}"><span class="mcal-day-num">${pad(d.getUTCDate())}</span><div class="mcal-events">${events.filter(e=>e.date===key).map(eventHtml).join('')}</div></div>`}).join('')}</div></div>`;
  }

  function timeBody(mode,cursor){
    const cols=mode==='Day'?1:7;
    const start=mode==='Day'?new Date(cursor):startMonday(cursor);
    const days=Array.from({length:cols},(_,i)=>addDays(start,i));
    const hours=Array.from({length:14},(_,i)=>i+8);
    const slots=Array.from({length:cols*14},()=>'<div class="mcal-slot"></div>').join('');
    const timed=events.filter(e=>e.time&&days.some(d=>sameDay(d,e.date)));
    const positioned=timed.map(e=>{const d=days.findIndex(x=>sameDay(x,e.date));const [h,m]=e.time.split(':').map(Number);const top=((h-8)*40)+(m/60*40)+4;const left=`calc(${d} * (100% / ${cols}) + 5px)`;const width=`calc((100% / ${cols}) - 10px)`;return `<button type="button" class="mcal-time-event" data-mcal-event="${e.title}" style="top:${top}px;left:${left};width:${width};height:32px"><b>${e.title}</b> · ${e.time}</button>`}).join('');
    const now=(days.some(d=>sameDay(d,TODAY)))?'<div class="mcal-now" title="Current time"></div>':'';
    return `<div class="mcal-time-view" style="--cols:${cols}"><div class="mcal-time-head"><div></div>${days.map(d=>`<div class="${sameDay(d,TODAY)?'current':''}"><b>${d.toLocaleString('en-US',{weekday:mode==='Day'?'long':'short',timeZone:'UTC'})}</b>${sameDay(d,TODAY)?`<span class="mcal-current-date">${d.getUTCDate()}</span>`:`<span>${d.getUTCDate()}</span>`}</div>`).join('')}</div><div class="mcal-time-body"><div class="mcal-times">${hours.map(h=>`<span>${h===12?'12:00 PM':h>12?`${h-12}:00 PM`:`${h}:00 AM`}</span>`).join('')}</div><div class="mcal-time-grid">${slots}${positioned}${now}</div></div></div>`;
  }

  function mount(container){
    if(container.dataset.mcalNative==='1')return;
    container.dataset.mcalNative='1';
    let mode='Month';
    let cursor=new Date(Date.UTC(2026,8,3));
    container.innerHTML=`<div class="mcal-native"><section class="mcal-board-head"><div class="mcal-title-row"><h1>Master Projects⌄</h1><div class="mcal-board-actions"><button type="button" data-mcal-toast="Integrate">⚒ Integrate</button><button type="button" data-mcal-toast="Automate">◉ Automate</button><button type="button" data-mcal-toast="Agents">♧ Agents</button><button type="button" data-mcal-toast="Updates">◯</button><button type="button" data-mcal-toast="Invite">Invite / 1</button><button type="button" data-mcal-toast="More">•••</button></div></div><div class="mcal-tabs"><button type="button" id="mcalMainTable">Main table</button><button type="button" data-mcal-toast="Build Vibe view">💗 Build Vibe view</button><button type="button" class="active">Calendar</button><button type="button" data-mcal-toast="Add view">+</button></div></section><section class="mcal-toolbar"><div class="mcal-toolbar-left"><button type="button" class="mcal-new" data-mcal-toast="New project">New project name⌄</button><button type="button" class="mcal-add" data-mcal-toast="Add widget">＋ Add widget</button><button type="button" class="mcal-tool" data-mcal-toast="Search">⌕ Search</button><button type="button" class="mcal-tool" data-mcal-toast="Person filter">◎ Person</button><button type="button" class="mcal-tool" data-mcal-toast="Filter">▽ Filter⌄</button></div><div class="mcal-toolbar-right"><div class="mcal-controls"><button type="button" class="today" id="mcalToday">Today</button><button type="button" class="arrow" id="mcalPrev">‹</button><button type="button" class="arrow" id="mcalNext">›</button><span class="mcal-period" id="mcalPeriod"></span><select class="mcal-mode" id="mcalMode"><option>Month</option><option>Week</option><option>Day</option></select><button type="button" class="mcal-tool" data-mcal-toast="Calendar settings">▣</button><button type="button" class="mcal-tool" data-mcal-toast="Export">⇧</button><button type="button" class="mcal-tool" data-mcal-toast="Expand view">⌗</button><button type="button" class="mcal-tool" data-mcal-toast="Settings">⚙</button><button type="button" class="mcal-tool" data-mcal-toast="Collapse">⌃</button></div></div></section><div class="mcal-empty-note">Calendar reconstruction follows the native Monday.com board calendar pattern: project/task dates remain board data and the calendar is a view over those records.</div><section class="mcal-shell" id="mcalBody"></section></div>`;

    const body=container.querySelector('#mcalBody'),period=container.querySelector('#mcalPeriod'),modeSelect=container.querySelector('#mcalMode');
    function draw(){period.textContent=periodLabel(mode,cursor);body.innerHTML=mode==='Month'?monthBody(cursor):timeBody(mode,cursor);body.querySelectorAll('[data-mcal-event]').forEach(btn=>btn.onclick=()=>window.toast?.(`${btn.dataset.mcalEvent} · calendar item opened`));}
    container.querySelector('#mcalToday').onclick=()=>{cursor=new Date(Date.UTC(2026,8,3));draw()};
    container.querySelector('#mcalPrev').onclick=()=>{if(mode==='Month')cursor=new Date(Date.UTC(cursor.getUTCFullYear(),cursor.getUTCMonth()-1,1));else cursor=addDays(cursor,mode==='Week'?-7:-1);draw()};
    container.querySelector('#mcalNext').onclick=()=>{if(mode==='Month')cursor=new Date(Date.UTC(cursor.getUTCFullYear(),cursor.getUTCMonth()+1,1));else cursor=addDays(cursor,mode==='Week'?7:1);draw()};
    modeSelect.onchange=()=>{mode=modeSelect.value;draw()};
    container.querySelector('#mcalMainTable').onclick=()=>document.querySelector('[data-board="Master Projects"]')?.click();
    container.querySelectorAll('[data-mcal-toast]').forEach(btn=>btn.onclick=()=>window.toast?.(`${btn.dataset.mcalToast} · Monday.com control simulated`));
    draw();
  }

  function upgrade(){
    const special=document.querySelector('.monday-content-area.monday-special');
    if(!special||special.dataset.mcalNative==='1')return;
    const heading=special.querySelector('h1');
    if(!heading||heading.textContent.trim()!=='Due dates vs scheduled work')return;
    mount(special);
  }

  const observer=new MutationObserver(upgrade);
  observer.observe(document.body,{childList:true,subtree:true});
  upgrade();
})();
