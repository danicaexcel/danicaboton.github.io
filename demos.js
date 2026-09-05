const params = new URLSearchParams(location.search);
if (params.get('embed') === '1') document.body.classList.add('embed-mode');
let id = params.get('id') || 'recruitment';
let project = getDcodeProject(id) || DCODE_PROJECTS[0];
const root = document.getElementById('demoRoot');
const title = document.getElementById('demoTitle');
const select = document.getElementById('projectSelect');
const openCase = document.getElementById('openCase');
const caseLink = document.getElementById('caseLink');
const n8nConnect = document.getElementById('n8nConnect');

document.body.classList.add(`project-${project.id}`);
DCODE_PROJECTS.forEach(p => {
  const o = document.createElement('option');
  o.value = p.id;
  o.textContent = `${p.order} ${p.title}${p.demoAvailable===false?' — case study only':''}`;
  o.selected = p.id === project.id;
  o.disabled = p.demoAvailable === false;
  select.appendChild(o);
});
select.onchange = () => location.href = `demo.html?id=${select.value}`;
openCase.href = caseLink.href = `case-study.html?id=${project.id}`;
openCase.target = caseLink.target = '_top';
title.textContent = project.title;
document.title = `${project.title} — Interactive Demo`;
n8nConnect.hidden = !window.DCodeN8n?.supported(project.id);
if (!n8nConnect.hidden) {
  const cfg = window.DCodeN8n.config(project.id);
  n8nConnect.textContent = 'View n8n workflow';
  n8nConnect.setAttribute('data-workflow-contact','');
  n8nConnect.classList.toggle('is-live', cfg.live);
  n8nConnect.onclick = () => window.DCodeN8n.openSettings(project.id);
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window._toast);
  window._toast = setTimeout(() => t.classList.remove('show'), 2400);
}
window.toast = toast;

async function runN8n(action, payload = {}, successMessage = 'Workflow completed') {
  try {
    const result = await window.DCodeN8n.call(project.id, action, payload);
    toast(`${successMessage} · ${result.mode === 'live' ? 'live n8n' : 'synthetic mode'}`);
    return result;
  } catch (error) {
    toast(`Workflow error · ${error.message}`);
    throw error;
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function initials(name) {
  return String(name).split(/\s+/).slice(0,2).map(x => x[0]).join('').toUpperCase();
}

function modal(html, className='') {
  const wrap = document.createElement('div');
  wrap.className = `interactive-modal ${className}`;
  wrap.innerHTML = `<div class="interactive-modal__backdrop"></div><div class="interactive-modal__panel">${html}</div>`;
  document.body.appendChild(wrap);
  const close = () => wrap.remove();
  wrap.querySelector('.interactive-modal__backdrop').onclick = close;
  wrap.querySelectorAll('[data-close-modal]').forEach(b => b.onclick = close);
  return wrap;
}

function genericShell({brand, tabs=[], activeTab='', sideTitle='Workspace', sideItems=[], activeSide='', bodyClass='', content=''}) {
  return `
    <div class="demo-product ${bodyClass}">
      <header class="demo-top"><strong>${brand}</strong><div class="tabs">${tabs.map(t=>`<button class="demo-tab ${t===activeTab?'active':''}" data-top-tab="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join('')}</div><span class="demo-workspace-label">Demo Workspace</span></header>
      <div class="demo-app">
        <aside class="side"><h4>${escapeHtml(sideTitle)}</h4>${sideItems.map(x=>`<button class="navitem ${x===activeSide?'active':''}" data-side-item="${escapeHtml(x)}">${escapeHtml(x)}</button>`).join('')}</aside>
        <section class="main">${content}</section>
      </div>
    </div>`;
}

/* -------------------------------------------------------------------------- */
/* ZOHO RECRUITMENT RECONSTRUCTION                                             */
/* -------------------------------------------------------------------------- */
function recruitment() {
  const applicants = [
    {id:'A-10492',name:'Emily Carter',license:'RN',position:'Registered Nurse (RN)',employer:'North Harbor Medical',email:'emily.carter@example.test',phone:'+1 555 014 2198',source:'Indeed',score:92,fit:'Strong Fit',stage:'For Interview',kanban:'New/Active',badge:'For Screening',availability:'Tue–Thu · 9:00 AM–1:00 PM ET'},
    {id:'A-10491',name:'Calvin Brooks',license:'RRT',position:'Respiratory Therapist (CRT/RRT)',employer:'Metro Respiratory Group',email:'calvin.brooks@example.test',phone:'+1 555 018 4556',source:'Indeed',score:84,fit:'Good Fit',stage:'Submitted as Candidate',kanban:'New/Active',badge:'For Screening',availability:'Wed–Fri · 10:00 AM–3:00 PM ET'},
    {id:'A-10490',name:'Shivani Patel',license:'CNA',position:'Certified Nursing Assistant (CNA)',employer:'Greenfield Care',email:'shivani.patel@example.test',phone:'+1 555 016 2403',source:'Apploi',score:90,fit:'Strong Fit',stage:'For Interview',kanban:'New/Active',badge:'For Screening',availability:'Mon–Wed · 8:00 AM–12:00 PM ET'},
    {id:'A-10489',name:'Hannah Irving',license:'—',position:'Assistant Food Service Director',employer:'Harbor Senior Living',email:'hannah.irving@example.test',phone:'+1 555 013 5346',source:'Indeed',score:71,fit:'Review',stage:'Recruiter Review',kanban:'Inactive',badge:'Not Qualified',availability:'Flexible'},
    {id:'A-10488',name:'Francis Torres',license:'RN',position:'RN Supervisor Weekend (7-3 or 3-11)',employer:'Brookview Health',email:'francis.torres@example.test',phone:'+1 555 017 3154',source:'Indeed',score:88,fit:'Strong Fit',stage:'Offered',kanban:'New/Active',badge:'For Screening',availability:'Weekend'},
    {id:'A-10487',name:'Letoria Bush',license:'—',position:'Unit Clerk',employer:'Central Care Network',email:'letoria.bush@example.test',phone:'+1 555 015 5056',source:'ZipRecruiter',score:81,fit:'Good Fit',stage:'Submitted as Candidate',kanban:'Retap',badge:'Viewed',availability:'Tue–Fri'},
    {id:'A-10486',name:'Karla Osorio',license:'LPN',position:'Licensed Practical Nurse (LPN)',employer:'Cedar Grove Rehab',email:'karla.osorio@example.test',phone:'+1 555 012 9931',source:'LinkedIn',score:68,fit:'Review',stage:'Inactive',kanban:'Inactive',badge:'Not Qualified',availability:'Mon–Fri'},
    {id:'A-10485',name:'Kadira Reed',license:'CNA',position:'Certified Nursing Assistant (CNA)',employer:'Valley Skilled Nursing',email:'kadira.reed@example.test',phone:'+1 555 012 7721',source:'Indeed',score:76,fit:'Good Fit',stage:'New',kanban:'Inactive',badge:'New',availability:'Flexible'},
    {id:'A-10484',name:'Marissa Accurso',license:'RN',position:'Registered Nurse (RN)',employer:'Riverside Health',email:'marissa.accurso@example.test',phone:'+1 555 018 3488',source:'Indeed',score:64,fit:'Review',stage:'Inactive',kanban:'Inactive',badge:'Not Qualified',availability:'Tue–Thu'},
    {id:'A-10483',name:'Stephanie Garcia',license:'LPN',position:'Licensed Practical Nurse (LPN)',employer:'North Harbor Medical',email:'stephanie.garcia@example.test',phone:'+1 555 015 7212',source:'Indeed',score:79,fit:'Good Fit',stage:'Viewed',kanban:'Inactive',badge:'Viewed',availability:'Mon–Wed'},
    {id:'A-10482',name:'Jordan Kim',license:'CNA',position:'Certified Nursing Assistant (CNA)',employer:'Oak Meadow Care',email:'jordan.kim@example.test',phone:'+1 555 016 7421',source:'Referral',score:73,fit:'Good Fit',stage:'NCNS',kanban:'NCNS',badge:'NCNS',availability:'Evening'},
    {id:'A-10481',name:'Avery Morgan',license:'RN',position:'Registered Nurse (RN)',employer:'Pinecrest Health',email:'avery.morgan@example.test',phone:'+1 555 011 3284',source:'Job Fair',score:87,fit:'Strong Fit',stage:'Current Employee',kanban:'Current Employee',badge:'Employee',availability:'N/A'}
  ];

  const employees = [
    {id:'EMP-0214',name:'Emily Carter',email:'emily.carter@example.test',phone:'+1 555 014 2198',facility:'North Harbor Care',type:'FT',status:'A',source:'Indeed',department:'Nursing',position:'Registered Nurse'},
    {id:'EMP-0213',name:'Aayana Cuffie',email:'aayana.cuffie@example.test',phone:'+1 555 012 6717',facility:'—',type:'—',status:'A',source:'Indeed',department:'—',position:'Licensed Practical Nurse'},
    {id:'EMP-0212',name:'Ashley Bell',email:'ashley.bell@example.test',phone:'+1 555 019 0226',facility:'—',type:'—',status:'A',source:'Indeed',department:'—',position:'CNA'},
    {id:'EMP-0211',name:'Celeste Peterson',email:'celeste.peterson@example.test',phone:'+1 555 013 1028',facility:'—',type:'—',status:'A',source:'Indeed',department:'—',position:'Unit Clerk'},
    {id:'EMP-0210',name:'JayLinaa Arcee',email:'jaylinaa.arcee@example.test',phone:'+1 555 017 1423',facility:'—',type:'—',status:'A',source:'Career Page',department:'—',position:'Dietary Aide'},
    {id:'EMP-0209',name:'Elisiana Monk-Lopez',email:'elisiana.lopez@example.test',phone:'+1 555 018 9699',facility:'—',type:'—',status:'A',source:'Indeed',department:'—',position:'Respiratory Therapist'},
    {id:'EMP-0208',name:'Criseana Christian',email:'criseana.christian@example.test',phone:'+1 555 013 8794',facility:'—',type:'—',status:'A',source:'Indeed',department:'—',position:'RN Supervisor'},
    {id:'EMP-0207',name:'Marlaina Deshields',email:'marlaina.deshields@example.test',phone:'+1 555 019 4233',facility:'—',type:'—',status:'A',source:'Indeed',department:'—',position:'MDS Coordinator'}
  ];

  const jobs = [
    {id:'JOB-741',title:'CNA - North Harbor',facility:'North Harbor Care',group:'High Priority',visibility:'Confidential',openings:9,status:'Open'},
    {id:'JOB-740',title:'RN - Riverside',facility:'Riverside Health',group:'Urgent',visibility:'Public',openings:8,status:'Open'},
    {id:'JOB-739',title:'LPN - Pinecrest',facility:'Pinecrest Health',group:'High Priority',visibility:'Public',openings:5,status:'Open'},
    {id:'JOB-738',title:'Respiratory Therapist',facility:'Greenfield Care',group:'Urgent',visibility:'Public',openings:9,status:'Open'},
    {id:'JOB-737',title:'Unit Clerk',facility:'Central Care Network',group:'Open',visibility:'Public',openings:2,status:'Open'},
    {id:'JOB-736',title:'Dietary Aide',facility:'Oak Meadow Care',group:'Closed',visibility:'Public',openings:0,status:'Closed'},
    {id:'JOB-735',title:'RN Supervisor',facility:'Valley Skilled Nursing',group:'Critical',visibility:'Confidential',openings:3,status:'Open'}
  ];

  const facilities = [
    ['FC-01','North Harbor Care','Healthcare','New York','11','Active'],
    ['FC-02','Riverside Health','Healthcare','New Jersey','9','Active'],
    ['FC-03','Pinecrest Health','Healthcare','Pennsylvania','12','Active'],
    ['FC-04','Greenfield Care','Healthcare','New York','8','Active'],
    ['FC-05','Central Care Network','Healthcare','New Jersey','6','Active'],
    ['FC-06','Oak Meadow Care','Healthcare','Pennsylvania','5','Active'],
    ['FC-07','Valley Skilled Nursing','Healthcare','New York','7','Active'],
    ['FC-08','Brookview Health','Healthcare','New Jersey','4','Active'],
    ['FC-09','Cedar Grove Rehab','Healthcare','Pennsylvania','3','Active'],
    ['FC-10','Harbor Senior Living','Healthcare','New York','6','Active']
  ];

  const tasks = [
    ['Review AI screening exceptions','Recruiter A','Today','In Progress'],
    ['Confirm candidate availability','Recruiter B','Today','Open'],
    ['Validate facility lookup mapping','CRM Admin','Tomorrow','Open'],
    ['Reprocess failed application','Automation','Today','Completed']
  ];
  const meetings = [
    ['Emily Carter — RN Interview','FC-01','Sep 1 · 10:00 AM','Teams','Confirmed'],
    ['Shivani Patel — CNA Interview','FC-02','Sep 2 · 2:30 PM','Zoom','Confirmed'],
    ['Calvin Brooks — RT Interview','FC-03','Sep 3 · 11:00 AM','Teams','Pending']
  ];
  const calls = [
    ['Emily Carter','Outbound','Recruiter A','2m 18s','Completed'],
    ['Calvin Brooks','Outbound','Recruiter B','No answer','Follow-up'],
    ['Hannah Irving','Inbound','Recruiter A','4m 02s','Completed']
  ];

  const recruitmentActivity = [
    {facility:'North Harbor Care',position:'RN',submitted:35,interviews:25,ncns:3,withdrawn:4,hmRejected:5,offersRejected:2,offersAccepted:8,hired:6},
    {facility:'North Harbor Care',position:'CNA',submitted:28,interviews:18,ncns:2,withdrawn:3,hmRejected:4,offersRejected:1,offersAccepted:6,hired:4},
    {facility:'Riverside Health',position:'RN',submitted:42,interviews:30,ncns:4,withdrawn:6,hmRejected:7,offersRejected:3,offersAccepted:9,hired:5},
    {facility:'Riverside Health',position:'LPN',submitted:31,interviews:20,ncns:2,withdrawn:4,hmRejected:3,offersRejected:2,offersAccepted:7,hired:5},
    {facility:'Pinecrest Health',position:'CNA',submitted:39,interviews:27,ncns:3,withdrawn:5,hmRejected:5,offersRejected:2,offersAccepted:8,hired:6},
    {facility:'Greenfield Care',position:'RRT',submitted:22,interviews:16,ncns:1,withdrawn:2,hmRejected:2,offersRejected:1,offersAccepted:5,hired:4}
  ];

  const lostReasons = [
    {facility:'North Harbor Care',position:'RN',rejected:8,pay:3,benefits:1,schedule:2,distance:1,differentJob:1,otherOffer:0,withdrawn:10,otherJob:4,processDelay:3,noLongerInterested:2,otherWithdrawal:1},
    {facility:'North Harbor Care',position:'CNA',rejected:6,pay:2,benefits:1,schedule:1,distance:1,differentJob:1,otherOffer:0,withdrawn:7,otherJob:3,processDelay:2,noLongerInterested:1,otherWithdrawal:1},
    {facility:'Riverside Health',position:'RN',rejected:11,pay:4,benefits:2,schedule:2,distance:1,differentJob:2,otherOffer:0,withdrawn:12,otherJob:5,processDelay:3,noLongerInterested:3,otherWithdrawal:1},
    {facility:'Pinecrest Health',position:'CNA',rejected:7,pay:2,benefits:1,schedule:2,distance:1,differentJob:1,otherOffer:0,withdrawn:8,otherJob:3,processDelay:2,noLongerInterested:2,otherWithdrawal:1}
  ];

  const jobHistory = [
    {facility:'North Harbor Care',position:'RN',original:'Jan 5, 2026',closed:'Mar 15, 2026',reopened:'Apr 10, 2026',times:2,currentOpen:'Jun 1, 2026',status:'Open',days:91},
    {facility:'North Harbor Care',position:'CNA',original:'Feb 1, 2026',closed:'—',reopened:'—',times:0,currentOpen:'Feb 1, 2026',status:'Open',days:211},
    {facility:'Riverside Health',position:'RN',original:'Mar 8, 2026',closed:'Jul 2, 2026',reopened:'Jul 18, 2026',times:1,currentOpen:'Jul 18, 2026',status:'Open',days:44},
    {facility:'Pinecrest Health',position:'LPN',original:'Apr 12, 2026',closed:'Aug 5, 2026',reopened:'—',times:0,currentOpen:'—',status:'Closed',days:0},
    {facility:'Greenfield Care',position:'RRT',original:'May 20, 2026',closed:'—',reopened:'—',times:0,currentOpen:'May 20, 2026',status:'Open',days:103}
  ];

  const sourcingWeekly = [
    {facility:'North Harbor Care',position:'RN',week:'Week 1',applied:15,sourced:8,contacted:10,interviews:6,ra:15,rs:8,rc:10,ri:6},
    {facility:'North Harbor Care',position:'RN',week:'Week 2',applied:20,sourced:12,contacted:14,interviews:8,ra:35,rs:20,rc:24,ri:14},
    {facility:'North Harbor Care',position:'RN',week:'Week 3',applied:10,sourced:5,contacted:7,interviews:4,ra:45,rs:25,rc:31,ri:18},
    {facility:'North Harbor Care',position:'CNA',week:'Week 1',applied:12,sourced:7,contacted:9,interviews:5,ra:12,rs:7,rc:9,ri:5},
    {facility:'Riverside Health',position:'RN',week:'Week 1',applied:12,sourced:6,contacted:8,interviews:5,ra:12,rs:6,rc:8,ri:5},
    {facility:'Riverside Health',position:'RN',week:'Week 2',applied:14,sourced:7,contacted:10,interviews:6,ra:26,rs:13,rc:18,ri:11},
    {facility:'Pinecrest Health',position:'CNA',week:'Week 1',applied:16,sourced:9,contacted:11,interviews:7,ra:16,rs:9,rc:11,ri:7}
  ];

  let state = {
    module:'Applicants',
    applicantView:'kanban',
    employeeView:'tiles',
    jobView:'kanban',
    applicantTab:'All Applicants',
    sort:'none',
    filter:'All',
    report:'dashboard',
    reportPeriod:'Weekly',
    reportFacility:'All Facilities'
  };

  root.innerHTML = `
  <div class="zoho-rebuild zoho-reference-ui">
    <div class="zoho-topbar">
      <button class="zoho-icon-btn" title="Menu">☰</button>
      <nav class="zoho-mainnav">
        ${['Home','Workqueue','Modules','Reports','Analytics','Agents'].map(x=>`<button data-zoho-top="${x}" class="${x==='Modules'?'active':''}">${x}</button>`).join('')}
      </nav>
      <div class="zoho-top-right"><span class="zoho-brand-text">∞ Zoho CRM⌄</span><button class="zoho-icon-btn">⌕</button><button class="zoho-icon-btn">Zia</button><button class="zoho-icon-btn">＋</button><button class="zoho-icon-btn">▣</button><button class="zoho-icon-btn">◌</button><span class="zoho-avatar-small">DB</span></div>
    </div>
    <div class="zoho-workarea">
      <aside class="zoho-sidebar">
        <div class="zoho-app-title"><span class="zoho-rm">RM</span><strong>Recruitment M...</strong><span>⌄</span><button>•••</button></div>
        <label class="zoho-search"><span>⌕</span><input id="zohoSideSearch" placeholder="Search"></label>
        <div class="zoho-modules" id="zohoModules">
          ${['Applicants','Employees','Job Openings','Facilities','Tasks','Meetings','Calls','Recruitment Report Center','Recruiter Activity Reports','Services','Projects'].map((x,i)=>`<button data-module="${x}" class="${x==='Applicants'?'active':''}"><span class="zoho-module-icon">${['◎','◉','▤','⌂','☑','▦','☎','▥','▧','⌘','◆'][i]}</span>${x}</button>`).join('')}
        </div>
        <div class="zoho-sidebar-footer"><span>My Pins</span><span>Chats</span><span>Contacts</span></div>
      </aside>
      <main class="zoho-content" id="zohoContent"></main>
    </div>
  </div>`;

  const content = document.getElementById('zohoContent');
  const moduleButtons = [...document.querySelectorAll('[data-module]')];

  function setModule(name) {
    state.module = name;
    moduleButtons.forEach(b=>b.classList.toggle('active', b.dataset.module===name));
    renderModule();
  }

  function moduleHeader(title, tabs=[`All ${title}`]) {
    return `<div class="zoho-module-head"><h1>${title}</h1></div><div class="zoho-view-tabs">${tabs.map((t,i)=>`<button class="${i===0?'active':''}">${t}</button>`).join('')}<button>•••</button></div>`;
  }

  function iconToolbar(viewButtons='') {
    return `<div class="zoho-control-row"><div class="zoho-control-left"><button>⌕ Filter</button><button>⇅ Sort</button><span class="zoho-divider"></span><button>☷</button>${viewButtons}<button>◫</button><button>◴</button><button>⌞</button></div><div class="zoho-control-right"></div></div>`;
  }

  function listTable(title, headers, rows, createLabel) {
    return `${moduleHeader(title)}
      <div class="zoho-list-toolbar"><div><button>⌕ Filter</button><button>⇅ Sort</button><button>☷</button><button>▦</button></div><button class="zoho-create">${createLabel || `Create ${title.replace(/s$/,'')}`} <span>⌄</span></button></div>
      <div class="zoho-table-wrap"><table class="zoho-table"><thead><tr><th class="checkbox-col"><input type="checkbox"></th>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r,ri)=>`<tr data-row="${ri}"><td><input type="checkbox"></td>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table><div class="zoho-list-footer">Total Records <b>${rows.length}</b><span>1 to ${rows.length} ›</span></div></div>`;
  }

  function badgeClass(label='') {
    const l=label.toLowerCase();
    if(l.includes('screen')) return 'orange';
    if(l.includes('new')) return 'pink';
    if(l.includes('view')) return 'blue';
    if(l.includes('employee')) return 'green';
    if(l.includes('ncns')) return 'red';
    return 'neutral';
  }

  function renderApplicants() {
    let data = [...applicants];
    if (state.filter !== 'All') data = data.filter(x=>x.source===state.filter);
    if (state.sort==='score') data.sort((a,b)=>b.score-a.score);
    if (state.sort==='name') data.sort((a,b)=>a.name.localeCompare(b.name));
    const viewButtons = `<button data-app-view="kanban" class="${state.applicantView==='kanban'?'active-icon':''}" title="Kanban View">▥</button><button data-app-view="tiles" class="${state.applicantView==='tiles'?'active-icon':''}" title="Tile View">▦</button>`;
    content.innerHTML = `${moduleHeader('Applicants',['All Applicants','Basecamp View','All Locked Applicants'])}
      <div class="zoho-control-row">
        <div class="zoho-control-left"><button id="zohoFilterBtn">⌕ Filter</button><button id="zohoSortBtn">⇅ Sort <span class="zoho-count">1</span></button><span class="zoho-divider"></span>${viewButtons}<button>◫</button><button>◴</button><button>⌞</button></div>
        <div class="zoho-control-right"><button class="zoho-create" id="createApplicant">Create Applicant <span>⌄</span></button><button class="zoho-more">•••</button></div>
      </div>
      ${state.applicantView==='kanban' ? `<div class="zoho-kanban-subbar"><button>Recruitment Stage⌄</button><span></span><label>Layouts <button>Recruitment Layout⌄</button></label></div>${applicantKanban(data)}` : `<div class="zoho-subcontrols"><label><input type="checkbox"> Select All</label><button>Applicants - Tile View⌄</button><span class="spacer"></span><label>Records Per Page <button>100⌄</button></label><label>Filter By <button>${state.filter}⌄</button></label></div>${applicantTiles(data)}<div class="zoho-record-footer"><span>Total Records&nbsp; <b>55,841</b></span><span>‹ &nbsp; 1 to 100 &nbsp; ›</span></div>`}`;

    document.querySelectorAll('[data-app-view]').forEach(b=>b.onclick=()=>{state.applicantView=b.dataset.appView;renderApplicants()});
    document.querySelectorAll('[data-applicant]').forEach(el=>el.onclick=()=>openApplicant(el.dataset.applicant));
    document.getElementById('createApplicant').onclick=openCreateApplicant;
    document.getElementById('zohoFilterBtn').onclick=()=>{const opts=['All','Indeed','Apploi','ZipRecruiter','LinkedIn','Referral','Job Fair'];state.filter=opts[(opts.indexOf(state.filter)+1)%opts.length];renderApplicants();toast(`Filter: ${state.filter}`)};
    document.getElementById('zohoSortBtn').onclick=()=>{state.sort=state.sort==='score'?'name':'score';renderApplicants();toast(`Sorted by ${state.sort==='score'?'AI score':'applicant name'}`)};
  }

  function applicantTiles(data) {
    return `<div class="zoho-applicant-area"><div class="zoho-card-grid">${data.slice(0,9).map(a=>`<article class="zoho-applicant-card" data-applicant="${a.id}"><div class="zoho-card-name"><span class="zoho-avatar">${a.name[0]}</span><div><strong>${a.name}</strong><small>Applicant Name</small></div></div><dl><dt>License</dt><dd>${a.license}</dd><dt>Recent Job Position</dt><dd><b>${a.position}</b></dd><dt>Employer (Most Recent)</dt><dd>${a.employer}</dd><dt>Applicant Email</dt><dd class="zoho-link">${a.email}</dd><dt>Applicant Phone</dt><dd class="zoho-phone">${a.phone} ☎</dd><dt>Source</dt><dd><b>${a.source}</b></dd></dl></article>`).join('')}</div></div>`;
  }

  function applicantList(data) {
    return `<div class="zoho-table-wrap applicant-list"><table class="zoho-table"><thead><tr><th></th><th>Applicant Name</th><th>Recent Job Position</th><th>Email</th><th>Phone</th><th>Source</th><th>AI Score</th><th>Recruitment Stage</th></tr></thead><tbody>${data.map(a=>`<tr data-applicant="${a.id}"><td><input type="checkbox"></td><td class="zoho-link">${a.name}</td><td>${a.position}</td><td>${a.email}</td><td>${a.phone}</td><td>${a.source}</td><td><b>${a.score}</b></td><td>${a.stage}</td></tr>`).join('')}</tbody></table></div>`;
  }

  function applicantKanban(data) {
    const groups = [
      {name:'Inactive',class:'inactive',count:498,label:'0'},
      {name:'Current Employee',class:'employee',count:12,label:'0'},
      {name:'New/Active',class:'active',count:620,label:'0'},
      {name:'Retap',class:'retap',count:38,label:'0'},
      {name:'NCNS.',class:'ncns',count:14,label:'0'}
    ];
    return `<div class="zoho-kanban-scroll"><div class="zoho-kanban-board">${groups.map(g=>`<section class="zoho-kcol"><header class="${g.class}"><b>${g.name}</b><small>${g.count}</small><strong>${g.label}</strong></header><div class="zoho-kcards">${data.filter(a=>a.kanban===g.name.replace('.','')).map(a=>`<article class="zoho-kcard" data-applicant="${a.id}"><b>${a.name}</b><span>${a.email}</span><span>${a.phone} ☎</span><em class="zoho-stage-badge ${badgeClass(a.badge)}">${a.badge}</em><small>${a.source}</small></article>`).join('') || `<div class="zoho-empty-column">No Applicants found.</div>`}</div></section>`).join('')}<section class="zoho-kcol slim"><header class="critical"><b>Hired</b><small>8</small><strong>0</strong></header><div class="zoho-kcards"><div class="zoho-empty-column">No Applicants found.</div></div></section></div></div>`;
  }

  function renderEmployees() {
    const viewButtons=`<button data-emp-view="table" class="${state.employeeView==='table'?'active-icon':''}" title="Table View">☷</button><button data-emp-view="tiles" class="${state.employeeView==='tiles'?'active-icon':''}" title="Tile View">▦</button>`;
    content.innerHTML = `${moduleHeader('Employees',['All Employees'])}<div class="zoho-control-row"><div class="zoho-control-left"><button>⌕ Filter</button><button>⇅ Sort</button><span class="zoho-divider"></span>${viewButtons}<button>◫</button><button>◴</button><button>⌞</button></div><div class="zoho-control-right"><button class="zoho-create">Create Employee <span>⌄</span></button><button class="zoho-more">•••</button></div></div><div class="zoho-subcontrols"><label><input type="checkbox"> Select All</label><button>Employees - ${state.employeeView==='tiles'?'Tile':'Table'} View⌄</button><span class="spacer"></span><label>Records Per Page <button>100⌄</button></label><label>Filter By <button>All⌄</button></label></div>${state.employeeView==='tiles'?employeeTiles():employeeTable()}<div class="zoho-record-footer"><span>Total Records&nbsp; <b>33</b></span><span>‹ &nbsp; 1 to 33 &nbsp; ›</span></div>`;
    document.querySelectorAll('[data-emp-view]').forEach(b=>b.onclick=()=>{state.employeeView=b.dataset.empView;renderEmployees()});
  }

  function employeeTiles(){return `<div class="zoho-applicant-area"><div class="zoho-card-grid employee-grid">${employees.map(e=>`<article class="zoho-applicant-card employee-card"><div class="zoho-card-name"><span class="zoho-avatar">${e.name[0]}</span><div><strong>${e.name}</strong><small>Employee Name</small></div></div><div class="employee-contact"><span>✉ <b class="zoho-link">${e.email}</b></span><span>▯ ${e.phone} ☎</span></div><dl><dt>Current Facility</dt><dd><b>${e.facility}</b></dd><dt>Employment Type</dt><dd><b>${e.type}</b></dd><dt>Employee Status</dt><dd><b>${e.status}</b></dd><dt>Applicant Source</dt><dd>${e.source}</dd><dt>Department</dt><dd>${e.department}</dd></dl></article>`).join('')}</div></div>`}
  function employeeTable(){return `<div class="zoho-table-wrap"><table class="zoho-table"><thead><tr><th></th><th>Employee Name</th><th>Position</th><th>Email</th><th>Phone</th><th>Current Facility</th><th>Employment Type</th><th>Status</th><th>Applicant Source</th><th>Department</th></tr></thead><tbody>${employees.map(e=>`<tr><td><input type="checkbox"></td><td class="zoho-link">${e.name}</td><td>${e.position}</td><td>${e.email}</td><td>${e.phone}</td><td>${e.facility}</td><td>${e.type}</td><td>${e.status}</td><td>${e.source}</td><td>${e.department}</td></tr>`).join('')}</tbody></table></div>`}

  function renderJobs() {
    const viewButtons=`<button data-job-view="table" class="${state.jobView==='table'?'active-icon':''}" title="Table View">☷</button><button data-job-view="kanban" class="${state.jobView==='kanban'?'active-icon':''}" title="Kanban View">▥</button>`;
    content.innerHTML=`${moduleHeader('Job Openings',['All Job Openings'])}<div class="zoho-control-row"><div class="zoho-control-left"><button>⌕ Filter</button><button>⇅ Sort</button><span class="zoho-divider"></span>${viewButtons}<button>◫</button><button>◴</button><button>⌞</button></div><div class="zoho-control-right"><button class="zoho-create">Create Job Opening <span>⌄</span></button><button class="zoho-more">•••</button></div></div>${state.jobView==='kanban'?jobKanban():jobTable()}`;
    document.querySelectorAll('[data-job-view]').forEach(b=>b.onclick=()=>{state.jobView=b.dataset.jobView;renderJobs()});
  }

  function jobKanban(){const groups=[['Closed','closed'],['Open','open'],['High Priority','high'],['Urgent','urgent'],['Critical','critical']];return `<div class="zoho-kanban-subbar"><button>Job Opening⌄</button><span></span></div><div class="zoho-kanban-scroll jobs"><div class="zoho-kanban-board">${groups.map(([name,cls])=>`<section class="zoho-kcol"><header class="${cls}"><b>${name}</b><small>${jobs.filter(j=>j.group===name).length}</small><strong>${jobs.filter(j=>j.group===name).reduce((s,j)=>s+j.openings,0)}</strong></header><div class="zoho-kcards">${jobs.filter(j=>j.group===name).map(j=>`<article class="zoho-kcard job-card"><b>${j.title}</b><span>${j.facility}</span><em class="zoho-stage-badge ${j.visibility==='Public'?'green':'orange'}">${j.visibility}</em><small>${j.openings}</small></article>`).join('')||`<div class="zoho-empty-column">No Job Openings found.</div>`}</div></section>`).join('')}</div></div>`}
  function jobTable(){return `<div class="zoho-table-wrap"><table class="zoho-table"><thead><tr><th></th><th>Job Opening ID</th><th>Posting Title</th><th>Facility</th><th>Openings</th><th>Status</th><th>Priority</th><th>Visibility</th></tr></thead><tbody>${jobs.map(j=>`<tr><td><input type="checkbox"></td><td>${j.id}</td><td class="zoho-link">${j.title}</td><td>${j.facility}</td><td>${j.openings}</td><td>${j.status}</td><td>${j.group}</td><td>${j.visibility}</td></tr>`).join('')}</tbody></table><div class="zoho-list-footer">Total Records <b>${jobs.length}</b><span>1 to ${jobs.length} ›</span></div></div>`}

  function openApplicant(id) {
    const a=applicants.find(x=>x.id===id)||applicants[0];
    content.innerHTML=`<div class="zoho-detail-page"><div class="zoho-detail-toolbar"><button id="backApplicants">← Applicants</button><div><button id="openN8nFromApplicant">Open n8n Execution</button><button class="zoho-create">Edit</button><button>•••</button></div></div><div class="zoho-record-hero"><span class="zoho-record-avatar">${a.name[0]}</span><div><div class="zoho-record-kicker">Applicant</div><h1>${a.name}</h1><p>${a.position} · ${a.source} · ${a.id}</p></div><div class="zoho-record-score"><span>AI Score</span><strong>${a.score}</strong><em>${a.fit}</em></div></div><div class="zoho-record-tabs"><button class="active" data-detail-tab="Overview">Overview</button><button data-detail-tab="Related">Related</button><button data-detail-tab="AI Analysis">AI Analysis</button><button data-detail-tab="Timeline">Timeline</button></div><div id="zohoDetailBody"></div></div>`;
    const body=document.getElementById('zohoDetailBody');
    function draw(tab){document.querySelectorAll('[data-detail-tab]').forEach(b=>b.classList.toggle('active',b.dataset.detailTab===tab));if(tab==='Overview')body.innerHTML=`<div class="zoho-detail-columns"><section class="zoho-section-card"><h3>Applicant Information</h3><div class="zoho-fields"><label>Applicant Email<span>${a.email}</span></label><label>Applicant Phone<span>${a.phone}</span></label><label>Recent Job Position<span>${a.position}</span></label><label>Employer (Most Recent)<span>${a.employer}</span></label><label>Source<span>${a.source}</span></label><label>Availability<span>${a.availability}</span></label></div></section><section class="zoho-section-card"><h3>Recruitment Status</h3><div class="zoho-stage-chip">${a.stage}</div><div class="zoho-mini-timeline"><div><time>Aug 30 · 09:42</time><b>AI screening completed</b></div><div><time>Aug 30 · 09:41</time><b>Webhook sent to n8n</b></div><div><time>Aug 29 · 16:18</time><b>Application created</b></div></div></section></div>`;if(tab==='Related')body.innerHTML=`<div class="zoho-section-card"><h3>Application History</h3><table class="zoho-table"><thead><tr><th>Job Opening</th><th>Facility</th><th>Stage</th><th>Recruiter</th><th>Updated</th></tr></thead><tbody><tr><td>${a.position}</td><td>North Harbor Care</td><td>${a.stage}</td><td>Recruiter A</td><td>Aug 30, 2026</td></tr><tr><td>Clinical Float Pool</td><td>Riverside Health</td><td>Rejected</td><td>Recruiter B</td><td>Jul 11, 2026</td></tr></tbody></table></div><div class="zoho-section-card"><h3>Attachments</h3><div class="zoho-file-row"><span>▧</span><div><b>${a.name.replace(' ','_')}_Resume.pdf</b><small>PDF · synthetic document · stored in Zoho in the original implementation</small></div><button onclick="toast('Synthetic resume preview opened')">Preview</button></div></div>`;if(tab==='AI Analysis')body.innerHTML=`<div class="zoho-section-card zoho-ai-section"><h3>AI Analysis</h3><div class="zoho-ai-grid"><label>AI Score<span class="score-big">${a.score}</span></label><label>Fit Level<span>${a.fit}</span></label><label>Recommendation<span>${a.score>=80?'Proceed to Interview':'Recruiter Review'}</span></label><label>Processing Status<span>Completed</span></label><label class="wide">Justification<span>Candidate meets the core experience threshold, demonstrates relevant role alignment, and has evidence of the required operational or clinical background.</span></label><label>Key Skills<span>Clinical documentation, team coordination, patient care</span></label><label>Missing Skills<span>One preferred credential not confirmed</span></label><label>Experience Match<span>Strong</span></label><label>Education Match<span>Meets requirement</span></label></div></div>`;if(tab==='Timeline')body.innerHTML=`<div class="zoho-section-card"><h3>Timeline</h3><div class="zoho-full-timeline"><div><time>09:42:21</time><span class="dot success"></span><div><b>Applicant updated</b><p>AI fields written back to application record.</p></div></div><div><time>09:42:20</time><span class="dot success"></span><div><b>AI evaluation validated</b><p>Structured output schema passed.</p></div></div><div><time>09:42:18</time><span class="dot success"></span><div><b>Resume extraction completed</b><p>Supported attachment parsed.</p></div></div><div><time>09:42:12</time><span class="dot"></span><div><b>Webhook dispatched</b><p>Application ID and selected fields sent to n8n.</p></div></div></div></div>`;}
    draw('Overview');
    document.querySelectorAll('[data-detail-tab]').forEach(b=>b.onclick=()=>draw(b.dataset.detailTab));
    document.getElementById('backApplicants').onclick=renderApplicants;
    document.getElementById('openN8nFromApplicant').onclick=()=>renderN8n(a);
  }

  function openCreateApplicant(){const m=modal(`<div class="modal-head"><div><small>Zoho CRM · Reconstructed demo</small><h2>Create Applicant</h2></div><button data-close-modal>×</button></div><form id="newApplicantForm" class="modal-form"><label>Applicant Name<input name="name" required value="Taylor Morgan"></label><label>Recent Job Position<input name="position" value="Registered Nurse (RN)"></label><label>Email<input name="email" value="taylor.morgan@example.test"></label><label>Phone<input name="phone" value="+1 555 019 9912"></label><label>Source<select name="source"><option>Indeed</option><option>Apploi</option><option>ZipRecruiter</option><option>LinkedIn</option></select></label><div class="modal-actions"><button type="button" data-close-modal>Cancel</button><button class="primary" type="submit">Save</button></div></form>`,'zoho-modal');m.querySelector('#newApplicantForm').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target);applicants.unshift({id:`A-${10500+applicants.length}`,name:fd.get('name'),license:'RN',position:fd.get('position'),employer:'—',email:fd.get('email'),phone:fd.get('phone'),source:fd.get('source'),score:0,fit:'Pending',stage:'New',kanban:'New/Active',badge:'New',availability:'Not provided'});m.remove();renderApplicants();toast('Applicant created in synthetic demo data')}}

  function renderN8n(a){
    content.innerHTML=`<div class="n8n-inline-head"><button id="n8nBack">← Back to Applicant</button><div><strong>AI Resume Screening</strong><span>Zoho CRM → n8n → AI → Zoho write-back</span></div><button class="n8n-run" id="n8nRun">Execute workflow</button></div><div class="n8n-inline-body"><div class="n8n-inline-canvas" id="n8nCanvas"></div><aside class="n8n-inline-panel" id="n8nInspector"><small>Execution</small><h3>${a.id}</h3><p>Select a node to inspect it.</p></aside></div>`;
    const nodes=[{id:'hook',x:40,y:190,label:'Zoho Webhook',type:'trigger',desc:'Receives the Application ID and selected fields from Zoho.'},{id:'app',x:205,y:190,label:'Get Application',type:'zoho',desc:'Fetches the application record by ID.'},{id:'resume',x:370,y:190,label:'Get Resume',type:'zoho',desc:'Finds the candidate resume attachment.'},{id:'extract',x:535,y:190,label:'Extract Text',type:'code',desc:'Extracts text from the supported resume file.'},{id:'job',x:700,y:190,label:'Job Description',type:'zoho',desc:'Retrieves job criteria and description.'},{id:'ai',x:865,y:190,label:'AI Evaluation',type:'ai',desc:'Scores candidate-to-job fit using structured output.'},{id:'parse',x:1030,y:190,label:'Validate JSON',type:'code',desc:'Validates the response contract before write-back.'},{id:'update',x:1195,y:190,label:'Update Zoho',type:'zoho',desc:'Writes evaluation fields back to the record.'}];
    const canvas=document.getElementById('n8nCanvas');canvas.innerHTML=`<div class="n8n-grid"></div><svg class="n8n-lines" viewBox="0 0 1400 500" preserveAspectRatio="none">${nodes.slice(0,-1).map((n,i)=>`<line x1="${n.x+115}" y1="225" x2="${nodes[i+1].x}" y2="225"/>`).join('')}</svg>${nodes.map(n=>`<button class="n8n-node type-${n.type}" data-node="${n.id}" style="left:${n.x}px;top:${n.y}px"><span class="n8n-node-icon">${n.type==='trigger'?'⚡':n.type==='zoho'?'Z':n.type==='ai'?'✦':'{}'}</span><span><b>${n.label}</b><small>Not executed</small></span><i></i></button>`).join('')}`;
    const inspector=document.getElementById('n8nInspector');document.querySelectorAll('[data-node]').forEach(btn=>btn.onclick=()=>{const n=nodes.find(x=>x.id===btn.dataset.node);inspector.innerHTML=`<small>Node</small><h3>${n.label}</h3><p>${n.desc}</p><div class="n8n-inspect-kv"><span>Application</span><b>${a.id}</b><span>Status</span><b>Ready</b></div>`});
    document.getElementById('n8nBack').onclick=()=>openApplicant(a.id);document.getElementById('n8nRun').onclick=()=>{const els=[...document.querySelectorAll('[data-node]')];els.forEach((el,i)=>setTimeout(()=>{el.classList.add('executed');el.querySelector('small').textContent='Executed';if(i===els.length-1)toast('Workflow completed · synthetic execution')},i*260))};
  }

  function exportExcel(reportName, headers, rows){const html=`<html><head><meta charset="UTF-8"></head><body><table border="1"><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</table></body></html>`;const blob=new Blob([html],{type:'application/vnd.ms-excel'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`${reportName.replace(/[^a-z0-9]+/gi,'_')}_${state.reportPeriod}.xls`;a.click();setTimeout(()=>URL.revokeObjectURL(url),500);toast('Excel-compatible report downloaded')}

  function reportToolbar(title, description){return `<div class="zoho-report-titlebar"><div><button id="backToReportCenter">← Reports</button><h2>${title}</h2><p>${description}</p></div><div class="zoho-report-actions"><label>Time Period<select id="reportPeriod">${['Daily','Weekly','Monthly','YTD'].map(x=>`<option ${x===state.reportPeriod?'selected':''}>${x}</option>`).join('')}</select></label><label>Facility<select id="reportFacility"><option>All Facilities</option>${[...new Set(recruitmentActivity.map(x=>x.facility))].map(x=>`<option ${x===state.reportFacility?'selected':''}>${x}</option>`).join('')}</select></label><button class="zoho-export" id="exportReport">Export Excel</button></div></div>`}

  function filterReportRows(rows){return state.reportFacility==='All Facilities'?rows:rows.filter(r=>r.facility===state.reportFacility)}

  function wireReportControls(exporter){document.getElementById('backToReportCenter').onclick=()=>{state.report='center';renderReportsCenter()};document.getElementById('reportPeriod').onchange=e=>{state.reportPeriod=e.target.value;renderCurrentReport()};document.getElementById('reportFacility').onchange=e=>{state.reportFacility=e.target.value;renderCurrentReport()};document.getElementById('exportReport').onclick=exporter;document.querySelectorAll('.report-expander').forEach(b=>b.onclick=()=>{const key=b.dataset.group;document.querySelectorAll(`[data-group-row="${key}"]`).forEach(r=>r.classList.toggle('collapsed'));b.textContent=b.textContent==='▾'?'▸':'▾'})}

  function groupedRows(rows, rowRenderer){let current='';let out='';rows.forEach((r,i)=>{if(r.facility!==current){current=r.facility;out+=`<tr class="zoho-group-row"><td colspan="20"><button class="report-expander" data-group="g${i}">▾</button><b>${current}</b></td></tr>`}out+=rowRenderer(r,`g${rows.findIndex(x=>x.facility===r.facility)}`)});return out}

  function renderReport1(){state.report='activity';const rows=filterReportRows(recruitmentActivity);content.innerHTML=`${moduleHeader('Recruitment Report Center',['Saved Reports','Folders','Scheduled Reports'])}${reportToolbar('Report 1 — Recruitment Activity','Candidate movement through the recruitment process, organized by Facility → Position.')}<div class="zoho-report-surface"><div class="report-note">Current view: <b>${state.reportPeriod}</b>. Each position retains a running/YTD total even when the visible period is filtered.</div><div class="zoho-table-wrap report-table"><table class="zoho-table"><thead><tr><th>Facility / Position</th><th>Submitted</th><th>Interviews</th><th>NCNS</th><th>Withdrawn</th><th>HM Rejected</th><th>Offers Rejected</th><th>Offers Accepted</th><th>Hired</th><th>Running / YTD</th></tr></thead><tbody>${groupedRows(rows,(r,g)=>`<tr data-group-row="${g}"><td>${r.position}<small class="period-pill">${state.reportPeriod}</small></td><td>${Math.max(1,Math.round(r.submitted*.28))}</td><td>${Math.max(1,Math.round(r.interviews*.28))}</td><td>${Math.round(r.ncns*.28)}</td><td>${Math.round(r.withdrawn*.28)}</td><td>${Math.round(r.hmRejected*.28)}</td><td>${Math.round(r.offersRejected*.28)}</td><td>${Math.round(r.offersAccepted*.28)}</td><td>${Math.round(r.hired*.28)}</td><td><b>${r.submitted} submitted · ${r.interviews} interviews · ${r.hired} hired</b></td></tr>`)}</tbody></table></div></div>`;wireReportControls(()=>exportExcel('Recruitment Activity',['Facility','Position','Submitted','Interviews Scheduled','Interview NCNS','Withdrawn','HM Rejected','Offers Rejected','Offers Accepted','Hired'],rows.map(r=>[r.facility,r.position,r.submitted,r.interviews,r.ncns,r.withdrawn,r.hmRejected,r.offersRejected,r.offersAccepted,r.hired])))}

  function renderReport2(){state.report='lost';const rows=filterReportRows(lostReasons);content.innerHTML=`${moduleHeader('Recruitment Report Center',['Saved Reports','Folders','Scheduled Reports'])}${reportToolbar('Report 2 — Why Candidates Are Lost','Offer rejection and candidate withdrawal reasons by Facility → Position.')}<div class="zoho-report-surface"><h3 class="report-subhead">Offer Rejection Reasons</h3><div class="zoho-table-wrap report-table"><table class="zoho-table"><thead><tr><th>Facility</th><th>Position</th><th>Total Rejected</th><th>Pay Rate</th><th>Benefits</th><th>Schedule</th><th>Distance</th><th>Different Job Offer</th><th>Other</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.facility}</td><td>${r.position}</td><td><b>${r.rejected}</b></td><td>${r.pay}</td><td>${r.benefits}</td><td>${r.schedule}</td><td>${r.distance}</td><td>${r.differentJob}</td><td>${r.otherOffer}</td></tr>`).join('')}</tbody></table></div><h3 class="report-subhead">Withdrawal Reasons</h3><div class="zoho-table-wrap report-table"><table class="zoho-table"><thead><tr><th>Facility</th><th>Position</th><th>Total Withdrawn</th><th>Got Job Somewhere Else</th><th>Hiring Process Took Too Long</th><th>No Longer Interested</th><th>Other</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.facility}</td><td>${r.position}</td><td><b>${r.withdrawn}</b></td><td>${r.otherJob}</td><td>${r.processDelay}</td><td>${r.noLongerInterested}</td><td>${r.otherWithdrawal}</td></tr>`).join('')}</tbody></table></div></div>`;wireReportControls(()=>exportExcel('Why Candidates Are Lost',['Facility','Position','Total Rejected','Pay Rate','Benefits','Schedule','Distance','Different Job Offer','Other Offer Reason','Total Withdrawn','Got Job Somewhere Else','Process Delay','No Longer Interested','Other'],rows.map(r=>[r.facility,r.position,r.rejected,r.pay,r.benefits,r.schedule,r.distance,r.differentJob,r.otherOffer,r.withdrawn,r.otherJob,r.processDelay,r.noLongerInterested,r.otherWithdrawal])))}

  function renderReport3(){state.report='history';const rows=filterReportRows(jobHistory);content.innerHTML=`${moduleHeader('Recruitment Report Center',['Saved Reports','Folders','Scheduled Reports'])}${reportToolbar('Report 3 — Job Opening History','Opening, closing, reopening, and current aging history for each Facility → Position.')}<div class="zoho-report-surface"><div class="report-note">Original open dates are retained. Reopen events do not overwrite the initial opening history.</div><div class="zoho-table-wrap report-table"><table class="zoho-table"><thead><tr><th>Facility</th><th>Position</th><th>Original Open Date</th><th>Close Date</th><th>Reopen Date</th><th>Times Reopened</th><th>Current Open Date</th><th>Status</th><th>Current Days Open</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.facility}</td><td>${r.position}</td><td>${r.original}</td><td>${r.closed}</td><td>${r.reopened}</td><td>${r.times}</td><td>${r.currentOpen}</td><td><span class="zoho-stage-badge ${r.status==='Open'?'green':'neutral'}">${r.status}</span></td><td><b>${r.days}</b></td></tr>`).join('')}</tbody></table></div></div>`;wireReportControls(()=>exportExcel('Job Opening History',['Facility','Position','Original Open Date','Close Date','Reopen Date','Times Reopened','Current Open Date','Status','Current Days Open'],rows.map(r=>[r.facility,r.position,r.original,r.closed,r.reopened,r.times,r.currentOpen,r.status,r.days])))}

  function renderReport4(){state.report='sourcing';const rows=state.reportFacility==='All Facilities'?sourcingWeekly:sourcingWeekly.filter(r=>r.facility===state.reportFacility);content.innerHTML=`${moduleHeader('Recruiter Activity Reports',['Saved Reports','Folders','Scheduled Reports'])}${reportToolbar('Report 4 — Applicant & Sourcing Report','Applied → Sourced → Contacted → Interview Scheduled, with running totals by Facility → Position → Time Period.')}<div class="zoho-report-surface"><div class="report-note">Main view is weekly. Use the time-period control to switch Daily / Weekly / Monthly / YTD in this reconstruction.</div><div class="zoho-table-wrap report-table"><table class="zoho-table"><thead><tr><th>Facility</th><th>Position</th><th>Period</th><th>Applied</th><th>Sourced</th><th>Contacted</th><th>Interview Scheduled</th><th>Running Applied</th><th>Running Sourced</th><th>Running Contacted</th><th>Running Interviews</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.facility}</td><td>${r.position}</td><td>${state.reportPeriod==='Weekly'?r.week:state.reportPeriod}</td><td>${r.applied}</td><td>${r.sourced}</td><td>${r.contacted}</td><td>${r.interviews}</td><td><b>${r.ra}</b></td><td><b>${r.rs}</b></td><td><b>${r.rc}</b></td><td><b>${r.ri}</b></td></tr>`).join('')}</tbody></table></div></div>`;wireReportControls(()=>exportExcel('Applicant and Sourcing Report',['Facility','Position','Week','Applied','Sourced','Contacted','Interview Scheduled','Running Applied','Running Sourced','Running Contacted','Running Interviews'],rows.map(r=>[r.facility,r.position,r.week,r.applied,r.sourced,r.contacted,r.interviews,r.ra,r.rs,r.rc,r.ri])))}

  function renderCurrentReport(){if(state.report==='activity')renderReport1();else if(state.report==='lost')renderReport2();else if(state.report==='history')renderReport3();else if(state.report==='sourcing')renderReport4();else renderReportsCenter()}

  function renderReportsCenter(){state.report='center';content.innerHTML=`${moduleHeader('Recruitment Report Center',['All Reports','Favorites','Scheduled Reports'])}<div class="zoho-report-center-toolbar"><div><button>＋ Create Report</button><button>New Folder</button></div><label>Search reports <input placeholder="Search"></label></div><div class="zoho-report-list">${[
    ['report1','Recruitment Activity','Facility → Position · Submitted, Interviews, NCNS, Withdrawn, HM Rejected, Offers, Hired','Updated Aug 30, 2026'],
    ['report2','Why Candidates Are Lost','Offer rejection and withdrawal reasons','Updated Aug 30, 2026'],
    ['report3','Job Opening History','Open / Close / Reopen history and current days open','Updated Aug 30, 2026'],
    ['report4','Applicant & Sourcing Report','Applied → Sourced → Contacted → Interview Scheduled + running totals','Updated Aug 30, 2026']
  ].map((r,i)=>`<article class="zoho-saved-report" data-open-report="${i+1}"><div class="report-doc-icon">▤</div><div><h3>${r[1]}</h3><p>${r[2]}</p><small>${r[3]}</small></div><button>Open</button></article>`).join('')}</div><div class="zoho-report-rules"><h3>CRM data rules behind the reports</h3><div><span><b>Withdrawn</b> requires a withdrawal reason</span><span><b>Offer Rejected</b> requires an offer rejection reason</span><span><b>Open → Closed → Reopened</b> saves every status-change date</span><span><b>All reports</b> preserve Facility → Position separation</span></div></div>`;document.querySelectorAll('[data-open-report]').forEach(b=>b.onclick=()=>{const n=b.dataset.openReport;if(n==='1')renderReport1();if(n==='2')renderReport2();if(n==='3')renderReport3();if(n==='4')renderReport4()})}

  function donutSegments(items){let offset=0;return items.map(x=>{const start=offset;offset+=x[1];return `<circle r="33" cx="40" cy="40" fill="transparent" stroke="${x[2]}" stroke-width="14" stroke-dasharray="${x[1]} ${100-x[1]}" stroke-dashoffset="-${start}" pathLength="100"/>`}).join('')}

  function renderAnalytics(){
    content.innerHTML=`${moduleHeader('Recruitment Analytics',['Recruitment Executive Dashboard','Recruiter Activity','Job Opening Health'])}<div class="zoho-analytics-toolbar"><div><button>＋ Add Component</button><button>⋮</button></div><span>Recruitment Executive Dashboard</span><button>Refresh</button></div><div class="zoho-analytics-grid">
      <section class="zoho-analytic-component kpi"><header><span>KPI</span><button>⋮</button></header><div class="kpi-value">186</div><p>Applicants YTD</p><small>Facility + Position reporting source</small></section>
      <section class="zoho-analytic-component kpi"><header><span>KPI</span><button>⋮</button></header><div class="kpi-value">126</div><p>Interviews Scheduled YTD</p><small>67.7% of submitted</small></section>
      <section class="zoho-analytic-component kpi"><header><span>KPI</span><button>⋮</button></header><div class="kpi-value">30</div><p>Hired YTD</p><small>16.1% of submitted</small></section>
      <section class="zoho-analytic-component comparator"><header><span>Comparator</span><button>⋮</button></header><h3>Recruiting Conversion by Facility</h3><div class="zoho-comparator-bars">${[['North Harbor',72],['Riverside',66],['Pinecrest',69],['Greenfield',61]].map(x=>`<div><span>${x[0]}</span><i><b style="width:${x[1]}%"></b></i><strong>${x[1]}%</strong></div>`).join('')}</div></section>
      <section class="zoho-analytic-component funnel"><header><span>Funnel</span><button>⋮</button></header><h3>Applicant & Sourcing Funnel</h3><div class="zoho-native-funnel"><div style="width:100%">Applied <b>186</b></div><div style="width:78%">Sourced <b>142</b></div><div style="width:64%">Contacted <b>126</b></div><div style="width:48%">Interview Scheduled <b>77</b></div></div></section>
      <section class="zoho-analytic-component donut"><header><span>Donut Chart</span><button>⋮</button></header><h3>Offer Rejection Reasons</h3><div class="donut-layout"><svg viewBox="0 0 80 80">${donutSegments([['Pay Rate',34,'#5b77e8'],['Schedule',24,'#35b6b0'],['Benefits',17,'#f0a34b'],['Distance',13,'#de6a83'],['Other',12,'#8d72cf']])}</svg><div>${[['Pay Rate',34],['Schedule',24],['Benefits',17],['Distance',13],['Other',12]].map(x=>`<span><i></i>${x[0]} <b>${x[1]}%</b></span>`).join('')}</div></div></section>
      <section class="zoho-analytic-component bar"><header><span>Horizontal Bar Chart</span><button>⋮</button></header><h3>Withdrawal Reasons</h3><div class="zoho-hbars">${[['Got Job Somewhere Else',64],['Process Took Too Long',45],['No Longer Interested',32],['Other',18]].map(x=>`<div><span>${x[0]}</span><i><b style="width:${x[1]}%"></b></i><strong>${x[1]}</strong></div>`).join('')}</div></section>
      <section class="zoho-analytic-component line wide"><header><span>Line Chart</span><button>⋮</button></header><h3>Weekly Applicant & Sourcing Trend</h3><div class="zoho-line-chart"><div class="ylabels"><span>60</span><span>40</span><span>20</span><span>0</span></div><svg viewBox="0 0 600 150" preserveAspectRatio="none"><polyline points="0,112 100,86 200,96 300,57 400,70 500,38 600,51" fill="none" stroke="#5b77e8" stroke-width="3"/><polyline points="0,130 100,110 200,118 300,92 400,100 500,75 600,86" fill="none" stroke="#35b6b0" stroke-width="3"/></svg><div class="xlabels"><span>W1</span><span>W2</span><span>W3</span><span>W4</span><span>W5</span><span>W6</span><span>W7</span></div></div><div class="chart-legend"><span><i class="blue"></i>Applied</span><span><i class="teal"></i>Sourced</span></div></section>
      <section class="zoho-analytic-component tablechart wide"><header><span>Table Chart</span><button>⋮</button></header><h3>Job Opening Aging</h3><table><thead><tr><th>Facility</th><th>Position</th><th>Status</th><th>Days Open</th></tr></thead><tbody>${jobHistory.filter(x=>x.status==='Open').sort((a,b)=>b.days-a.days).map(r=>`<tr><td>${r.facility}</td><td>${r.position}</td><td>${r.status}</td><td><b>${r.days}</b></td></tr>`).join('')}</tbody></table></section>
    </div>`;
  }

  function renderModule(){
    if(state.module==='Applicants') return renderApplicants();
    if(state.module==='Employees') return renderEmployees();
    if(state.module==='Job Openings') return renderJobs();
    if(state.module==='Facilities') return content.innerHTML=listTable('Facilities',['Facility Code','Facility Name','Industry','State','Open Roles','Status'],facilities,'Create Facility');
    if(state.module==='Tasks') return content.innerHTML=listTable('Tasks',['Subject','Owner','Due Date','Status'],tasks,'Create Task');
    if(state.module==='Meetings') return content.innerHTML=listTable('Meetings',['Meeting','Facility','Time','Provider','Status'],meetings,'Create Meeting');
    if(state.module==='Calls') return content.innerHTML=listTable('Calls',['Contact','Direction','Owner','Duration','Status'],calls,'Log a Call');
    if(state.module==='Recruitment Report Center') return renderReportsCenter();
    if(state.module==='Recruiter Activity Reports') return renderReport4();
    if(state.module==='Services') return content.innerHTML=listTable('Services',['Service','Category','Owner','Status'],[['AI Resume Screening','Automation','Automation Team','Active'],['Interview Scheduling','Recruitment','Recruitment Ops','Active'],['CRM Migration Support','Data','CRM Admin','Active']],'Create Service');
    if(state.module==='Projects') return content.innerHTML=listTable('Projects',['Project','Owner','Status','Due Date'],[['Recruitment CRM','CRM Admin','Live','Ongoing'],['Reporting Upgrade','Analytics','In Progress','Sep 15, 2026'],['Hiring Manager Portal','Solutions','Validation','Sep 30, 2026']],'Create Project');
  }

  moduleButtons.forEach(b=>b.onclick=()=>setModule(b.dataset.module));
  document.querySelectorAll('[data-zoho-top]').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('[data-zoho-top]').forEach(x=>x.classList.remove('active'));b.classList.add('active');
    if(b.dataset.zohoTop==='Reports') setModule('Recruitment Report Center');
    else if(b.dataset.zohoTop==='Analytics') renderAnalytics();
    else if(b.dataset.zohoTop==='Home') {content.innerHTML=`<div class="zoho-module-head"><h1>Recruitment Home</h1></div><div class="zoho-home-panels"><div class="zoho-kpis home"><div><strong>55,841</strong><span>Applicants</span></div><div><strong>2,087</strong><span>Employees</span></div><div><strong>126</strong><span>Open Job Roles</span></div><div><strong>48/day</strong><span>AI Screening Calls</span></div></div><div class="zoho-section-card"><h3>Reporting</h3><p>Four recruitment report families are available from the Report Center and feed the Analytics dashboard.</p><button class="zoho-create" id="homeReports">Open Recruitment Reports</button></div></div>`;document.getElementById('homeReports').onclick=()=>setModule('Recruitment Report Center')}
    else if(b.dataset.zohoTop==='Agents') {content.innerHTML=`<div class="zoho-module-head"><h1>Agents</h1></div><div class="zoho-section-card"><h3>Automation handoff</h3><p>This implementation used external n8n orchestration for AI screening and integration work.</p><button class="zoho-create" id="agentsN8n">Open reconstructed n8n workflow</button></div>`;document.getElementById('agentsN8n').onclick=()=>renderN8n(applicants[0])}
    else setModule('Applicants');
  });

  renderApplicants();
}

/* -------------------------------------------------------------------------- */
/* HIRING MANAGER PORTAL                                                      */
/* -------------------------------------------------------------------------- */
function portal() {
  const candidates = [
    {name:'Jessica Morgan',role:'Registered Nurse',facility:'Cherry Hill Care Center',experience:'8 years',availability:'Tue–Thu · 9:00 AM–1:00 PM ET',status:'Awaiting Review'},
    {name:'Marcus Reed',role:'Licensed Practical Nurse',facility:'Meadow Springs',experience:'5 years',availability:'Wed–Fri · 10:00 AM–3:00 PM ET',status:'Interview Requested'},
    {name:'Elena Santos',role:'Respiratory Therapist',facility:'Cherry Hill Care Center',experience:'6 years',availability:'Mon–Wed · 8:00 AM–12:00 PM ET',status:'Approved'}
  ];
  let admin=false, page='Dashboard';
  root.innerHTML=`<div id="portalMount"></div>`;
  const mount=document.getElementById('portalMount');
  function render(){
    const clientPages=['Dashboard','Endorsed Candidates','Interview Scheduling','Calendar','My Activity'];
    const adminPages=['Dashboard','Candidates','Candidate Shares','Interview Requests','Interviews','Recipients','Share Activity','Integrations','Audit Logs'];
    const pages=admin?adminPages:clientPages;
    if(!pages.includes(page)) page=pages[0];
    mount.innerHTML=genericShell({brand:'Secure Candidate Review',tabs:admin?['Admin','Candidate Shares','Integrations','Security']:['Candidates','Interviews','Activity'],activeTab:admin?'Admin':'Candidates',sideTitle:admin?'Recruiter Workspace':'Cherry Hill Care Center',sideItems:pages,activeSide:page,bodyClass:'portal-shell-v2 scr-demo',content:`<div class="toolbar scr-topline"><div><small class="page-eyebrow">${admin?'Recruiter workspace':'Secure review session'}</small><h2>${page}</h2></div><button class="ui-btn primary" id="portalMode">${admin?'Client View':'Admin Preview'}</button></div><div id="portalPage"></div>`});
    document.querySelectorAll('[data-side-item]').forEach(b=>b.onclick=()=>{page=b.dataset.sideItem;render()});
    document.getElementById('portalMode').onclick=()=>{admin=!admin;page='Dashboard';render()};
    drawPage();
  }
  function drawPage(){const el=document.getElementById('portalPage');
    if(!admin && page==='Dashboard') el.innerHTML=`<section class="scr-sharebanner"><span>SECURE SHARE-LINK MODEL</span><h1>3 candidates from the Recruitment Team</h1><p>Review shortlisted Zoho candidates from one temporary workspace. Download authorized résumé files, approve or decline candidates, and request interviews without creating a full portal account.</p><div class="scr-sharemeta"><i>sarah@cherryhillcare.com</i><i>Expires Sep 9, 2026</i><i>SHARE-00124</i></div></section><div class="scr-security"><b>Secure review link activated.</b> The emailed token has been converted into a temporary browser session. This workspace shows only the candidates included in this share.</div><div class="dashgrid"><div class="dashcard"><strong>3</strong><span>candidates awaiting review</span></div><div class="dashcard"><strong>2</strong><span>recipient decisions</span></div><div class="dashcard"><strong>1</strong><span>interview request</span></div><div class="dashcard"><strong>7d</strong><span>expiring access window</span></div></div>`;
    if(!admin && page==='Endorsed Candidates') {el.innerHTML=`<div class="candidate-list">${candidates.map((c,i)=>`<article class="candidate portal-candidate" data-candidate="${i}"><div class="personhead"><div class="avatar">${initials(c.name)}</div><div><h3>${c.name}</h3><div class="meta">${c.role} · ${c.facility}</div></div></div><div class="kv"><dt>Experience</dt><dd>${c.experience}</dd><dt>Availability</dt><dd>${c.availability}</dd><dt>Status</dt><dd><span class="tag ${c.status==='Approved'?'good':''}">${c.status}</span></dd></div><div class="decision"><button class="ui-btn resume">Resume</button><button class="ui-btn green proceed">Proceed</button><button class="ui-btn danger decline">Decline</button></div></article>`).join('')}</div>`;document.querySelectorAll('.portal-candidate').forEach((card,i)=>card.onclick=e=>{if(e.target.closest('button'))return;candidateModal(i)});document.querySelectorAll('.resume').forEach(b=>b.onclick=()=>toast('Authorization passed · synthetic resume download logged'));document.querySelectorAll('.proceed').forEach((b,i)=>b.onclick=()=>scheduleModal(i));document.querySelectorAll('.decline').forEach((b,i)=>b.onclick=()=>{candidates[i].status='Do Not Proceed';render()});}
    if(!admin && page==='Interview Scheduling') el.innerHTML=`<div class="panel"><h3>Scheduling requests</h3><table class="dbtable"><thead><tr><th>Candidate</th><th>Request status</th><th>Hiring manager availability</th><th>Candidate availability</th><th>Action</th></tr></thead><tbody><tr><td>Jordan Lee</td><td><span class="tag warn">Awaiting Recruiter</span></td><td>Wed 2–4 PM ET</td><td>Wed–Fri 10 AM–3 PM</td><td><button class="ui-btn" id="scheduleOpen">Open request</button></td></tr><tr><td>Avery Morgan</td><td><span class="tag good">Scheduled</span></td><td>Tue 10–12 PM ET</td><td>Tue–Thu 9 AM–1 PM</td><td><button class="ui-btn">View meeting</button></td></tr></tbody></table></div>`;document.getElementById('scheduleOpen').onclick=()=>scheduleModal(1);
    if(!admin && page==='Calendar') el.innerHTML=`<div class="panel"><div class="portal-calendar-head"><button>‹</button><h3>September 2026</h3><button>›</button></div><div class="calendar portal-calendar">${Array.from({length:35},(_,i)=>`<button class="day ${i===1||i===3?'has-event':''}"><b>${(i%30)+1}</b>${i===1?'<span class="meet">10:00 · Avery Morgan</span>':''}${i===3?'<span class="meet">14:30 · Jordan Lee</span>':''}</button>`).join('')}</div></div>`;document.querySelectorAll('.has-event').forEach(b=>b.onclick=()=>toast('Meeting details opened · join link authorization passed'));
    if(!admin && page==='My Activity') el.innerHTML=`<div class="panel"><h3>My activity</h3><div class="timeline"><div class="event"><time>Today 10:11</time><strong>Viewed Avery Morgan · Successful</strong></div><div class="event"><time>Today 09:42</time><strong>Downloaded résumé · Successful</strong></div><div class="event"><time>Aug 30</time><strong>Interview requested · Processing</strong></div><div class="event"><time>Aug 29</time><strong>Terms accepted · Successful</strong></div></div></div>`;
    if(admin && page==='Dashboard') el.innerHTML=`<section class="scr-sharebanner admin"><span>RECRUITER CONTROL CENTER</span><h1>Share selected Zoho candidates without creating client accounts.</h1><p>Select applicants, enter the hiring manager recipient, choose visible fields, and send one secure expiring review link. Decisions, résumé downloads, interview requests, retries, and Zoho sync outcomes remain auditable.</p><div class="scr-sharemeta"><i>Zoho Recruit</i><i>n8n screening workflow</i><i>Secure portal handoff</i></div></section><div class="dashgrid"><div class="dashcard"><strong>8</strong><span>active shares</span></div><div class="dashcard"><strong>6</strong><span>recipients opened</span></div><div class="dashcard"><strong>14</strong><span>candidate decisions</span></div><div class="dashcard"><strong>3</strong><span>interview requests</span></div></div><div class="split" style="margin-top:12px"><div class="panel"><h3>Recent candidate shares</h3><table class="dbtable"><thead><tr><th>Recipient</th><th>Client</th><th>Candidates</th><th>Opened</th><th>Status</th></tr></thead><tbody><tr><td>Sarah Leitner</td><td>Cherry Hill</td><td>3</td><td>Today 11:02 AM</td><td><span class="tag good">Active</span></td></tr><tr><td>John Davis</td><td>Meadow Springs</td><td>5</td><td>Yesterday 3:40 PM</td><td><span class="tag good">Active</span></td></tr></tbody></table></div><div class="panel"><h3>Reliability controls</h3><div class="chips"><span class="tag">Temporary sessions</span><span class="tag">Field visibility</span><span class="tag">Resume authorization</span><span class="tag">Outbox sync</span><span class="tag">Audit logs</span></div></div></div>`;
    if(admin && page==='Candidates') el.innerHTML=`<div class="gridcards">${candidates.map((c,i)=>`<article class="person-card"><div class="personhead"><div class="avatar">${initials(c.name)}</div><div><h3>${c.name}</h3><small>${c.role} · ${c.facility}</small></div></div><div class="kv"><dt>Source</dt><dd>Zoho Recruit</dd><dt>AI Fit</dt><dd>${i===0?'Strong':i===1?'Good':'Strong'}</dd><dt>Portal status</dt><dd>${c.status}</dd></div><button class="ui-btn primary openShareDemo">Share Candidate</button></article>`).join('')}</div>`;document.querySelectorAll('.openShareDemo').forEach(b=>b.onclick=()=>toast('Create Candidate Share modal opened · synthetic portfolio action'));
    if(admin && page==='Candidate Shares') el.innerHTML=listSimple(['Share','Recipient','Client','Candidates','Created','Opened','Decisions','Expires','Status'],[['SHARE-00124','Sarah Leitner','Cherry Hill','3','Sep 2 10:46 AM','Sep 2 11:02 AM','2 / 3','Sep 9','Active'],['SHARE-00123','John Davis','Meadow Springs','5','Sep 1 2:18 PM','Sep 1 3:40 PM','4 / 5','Sep 8','Active']]);
    if(admin && page==='Interview Requests') el.innerHTML=listSimple(['Candidate','Client','Hiring manager availability','Candidate availability','Status'],[['Jessica Morgan','Cherry Hill','Sep 7 · 10:00 AM–12:30 PM ET','Tue–Thu · 9:00 AM–1:00 PM ET','Awaiting recruiter'],['Marcus Reed','Meadow Springs','Sep 8 · 2:00–4:00 PM ET','Wed–Fri · 10:00 AM–3:00 PM ET','Requested']]);
    if(admin && page==='Interviews') el.innerHTML=listSimple(['Candidate','Client','Date','Time','Provider','Zoho Sync'],[['Marcus Reed','Meadow Springs','Sep 8, 2026','2:30–3:15 PM ET','Microsoft Teams','Synced']]);
    if(admin && page==='Recipients') el.innerHTML=listSimple(['Name','Email','Client','Shares','Last Opened','Status'],[['Sarah Leitner','sarah@cherryhillcare.com','Cherry Hill Care Center','3','Today 11:02 AM','Active'],['John Davis','john@meadowsprings.com','Meadow Springs','2','Yesterday 3:40 PM','Active']]);
    if(admin && page==='Share Activity') el.innerHTML=`<div class="panel"><h3>SHARE-00124 · sarah@cherryhillcare.com</h3><div class="timeline"><div class="event"><time>10:46</time><strong>Share created</strong></div><div class="event"><time>10:47</time><strong>Secure email sent</strong></div><div class="event"><time>11:02</time><strong>Temporary session activated</strong></div><div class="event"><time>11:07</time><strong>Proceed to Interview submitted</strong></div></div></div>`;
    if(admin && page==='Integrations') el.innerHTML=`<div class="split"><div class="panel"><h3>Connection</h3><div class="kv"><dt>Provider</dt><dd>Zoho Recruit</dd><dt>OAuth</dt><dd><span class="tag good">Connected</span></dd><dt>n8n</dt><dd>AI screening + portal handoff</dd><dt>Scopes</dt><dd>Applications · Candidates · Interviews · Attachments</dd></div><button class="ui-btn" id="testZoho">Test connection</button></div><div class="panel"><h3>Mappings</h3><div class="kv"><dt>Candidate</dt><dd>Candidates</dd><dt>Application</dt><dd>Applications</dd><dt>Interview</dt><dd>Interviews</dd><dt>Portal outbox</dt><dd>Decision + scheduling sync</dd></div></div></div>`;document.getElementById('testZoho').onclick=()=>toast('Connection test passed · read/write sandbox check successful');
    if(admin && page==='Audit Logs') el.innerHTML=listSimple(['Time','Actor','Business Action','Integration','Correlation ID'],[['10:12','Maya L.','Proceed to Interview','Zoho 200','decision-61fb770a'],['09:58','Worker','Retry scheduling request','Zoho 200','sched-992ac1'],['09:40','Liam R.','Resume download','Authorized','file-1a884b']]);
    if(admin && page==='Security Events') el.innerHTML=listSimple(['Time','Event','User','Result'],[['10:03','Successful login','maya@north.example','Allowed'],['09:37','Cross-client access attempt','viewer@test.example','Blocked'],['08:58','Rate limit triggered','anonymous','Blocked']]);
    if(admin && page==='Failed Jobs') el.innerHTML=`<div class="panel"><h3>Failed integration jobs</h3><table class="dbtable"><thead><tr><th>Job</th><th>Business action</th><th>Attempts</th><th>Last error</th><th></th></tr></thead><tbody><tr><td>JOB-1843</td><td>Scheduling request sync</td><td>3</td><td>429 rate limited</td><td><button class="ui-btn" id="retryPortalJob">Retry</button></td></tr></tbody></table></div>`; if(document.getElementById('retryPortalJob')) document.getElementById('retryPortalJob').onclick=()=>toast('Retry queued · idempotency key preserved');
  }
  function listSimple(headers,rows){return `<div class="panel"><table class="dbtable"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}
  function candidateModal(i){const c=candidates[i];modal(`<div class="modal-head"><div><small>Candidate profile</small><h2>${c.name}</h2></div><button data-close-modal>×</button></div><div class="modal-form"><div class="kv"><dt>Position</dt><dd>${c.role}</dd><dt>Facility</dt><dd>${c.facility}</dd><dt>Experience</dt><dd>${c.experience}</dd><dt>Availability</dt><dd>${c.availability}</dd></div><div class="modal-actions"><button onclick="toast('Synthetic résumé preview opened')">View résumé</button><button class="primary" id="candidateProceed">Proceed to Interview</button></div></div>`);setTimeout(()=>{const b=document.getElementById('candidateProceed');if(b)b.onclick=()=>scheduleModal(i)},0)}
  function scheduleModal(i){const c=candidates[i];const m=modal(`<div class="modal-head"><div><small>Interview scheduling</small><h2>${c.name}</h2></div><button data-close-modal>×</button></div><form id="scheduleForm" class="modal-form"><label>Preferred date<input type="date" value="2026-09-03"></label><label>Preferred start<input type="time" value="14:00"></label><label>Preferred end<input type="time" value="16:00"></label><label>Time zone<select><option>ET</option><option>CT</option><option>MT</option><option>PT</option></select></label><label class="full">Notes<textarea>Available for a 30-minute interview.</textarea></label><div class="modal-actions"><button type="button" data-close-modal>Cancel</button><button class="primary">Submit request</button></div></form>`);m.querySelector('#scheduleForm').onsubmit=e=>{e.preventDefault();c.status='Interview Requested';m.remove();toast('Request saved locally · outbox event queued · Zoho sync processing');render()}}
  render();
}


/* -------------------------------------------------------------------------- */
/* SHARED n8n WORKFLOW RECONSTRUCTION                                          */
/* -------------------------------------------------------------------------- */
function renderN8nStudio({title,subtitle='Workflow',nodes=[],links=[],onBack=null,note='',runLabel='Execute workflow'}) {
  const iconMap={schedule:'◷',monday:'M',code:'{ }',if:'◇',telegram:'➤',drive:'△',command:'>_',supabase:'S',sheets:'G',calendar:'31',webhook:'↯',respond:'↪',http:'↗',merge:'⇉',switch:'⇄',email:'✉'};
  const classMap={schedule:'schedule',monday:'monday',code:'code',if:'if',telegram:'telegram',drive:'drive',command:'command',supabase:'supabase',sheets:'sheets',calendar:'calendar',webhook:'webhook',respond:'respond',http:'http',merge:'merge',switch:'switch',email:'email'};
  const byId=Object.fromEntries(nodes.map(n=>[n.id,n]));
  const nodeW=112,nodeH=78,canvasW=Math.max(1680,...nodes.map(n=>n.x+nodeW+140)),canvasH=Math.max(760,...nodes.map(n=>n.y+nodeH+150));
  const pathFor=(l)=>{
    const a=byId[l.from],b=byId[l.to]; if(!a||!b)return'';
    const x1=a.x+64,y1=a.y+26,x2=b.x+4,y2=b.y+26,dx=Math.max(44,Math.abs(x2-x1)*.48);
    return `<path class="n8n3-link ${l.branch||''}" d="M${x1} ${y1} C${x1+dx} ${y1},${x2-dx} ${y2},${x2} ${y2}"/>`;
  };
  const nodeMarkup=nodes.map(n=>`<button class="n8n3-node type-${classMap[n.type]||'code'}" data-n8n3-node="${n.id}" style="left:${n.x}px;top:${n.y}px" aria-label="${escapeHtml(n.label)}">
      <span class="n8n3-card"><i class="n8n3-port in"></i><span class="n8n3-appicon">${iconMap[n.type]||'{ }'}</span><i class="n8n3-port out"></i></span>
      <b>${escapeHtml(n.label)}</b><small>${escapeHtml(n.sub||'')}</small>
    </button>`).join('');
  root.innerHTML=`<div class="n8n3-shell">
    <aside class="n8n3-sidebar">
      <div class="n8n3-brandrow">
        <span class="n8n3-symbol"><i></i><i></i><i></i></span><strong>n8n</strong>
        <button aria-label="Create">＋</button><button aria-label="Search">⌕</button><button aria-label="Toggle sidebar">▯</button>
      </div>
      <nav class="n8n3-primary">
        <button><span>⌂</span>Overview</button>
        <button class="active"><span>♙</span>Personal</button>
        <button><span>◯</span>Chat <em>Preview</em></button>
      </nav>
      <nav class="n8n3-bottom">
        <button><span>⌁</span>Admin Panel</button>
        <button><span>◈</span>Templates</button>
        <button><span>⌁</span>Insights</button>
        <button><span>?</span>Help <b>›</b></button>
        <button><span>⚙</span>Settings</button>
      </nav>
    </aside>
    <main class="n8n3-main">
      <header class="n8n3-topbar">
        <div class="n8n3-crumbs">${onBack?'<button id="n8n3Back" class="n8n3-back">←</button>':''}<span>♙ Personal</span><i>/</i><span>${escapeHtml(subtitle.replace(' / n8n',''))}</span><i>/</i><strong>${escapeHtml(title)}</strong><button class="n8n3-tag">＋ Add tag</button></div>
        <div class="n8n3-actions"><button class="publish">Publish</button><button title="History">◴</button><button>⋯</button></div>
      </header>
      <section class="n8n3-workspace">
        <div class="n8n3-tabs"><button class="active">Editor</button><button>Executions</button><button>Evaluations</button></div>
        <div class="n8n3-canvas" id="n8n3Canvas">
          <div class="n8n3-grid" style="width:${canvasW}px;height:${canvasH}px"></div>
          <svg class="n8n3-links" style="width:${canvasW}px;height:${canvasH}px" viewBox="0 0 ${canvasW} ${canvasH}" preserveAspectRatio="none">${links.map(pathFor).join('')}</svg>
          ${nodeMarkup}
          <div class="n8n3-righttools"><button>＋</button><button>⌕</button><button>▱</button><button>◫</button><button>✦</button></div>
          <div class="n8n3-canvas-tools"><button>⛶</button><button>⌕</button><button>⊖</button><button>↶</button><button>⌁</button></div>
          <button class="n8n3-execute" id="n8n3Execute">⚗ ${escapeHtml(runLabel)}</button>
        </div>
      </section>
    </main>
  </div>`;
  if(onBack) document.getElementById('n8n3Back').onclick=onBack;
  document.querySelectorAll('[data-n8n3-node]').forEach(el=>el.onclick=()=>{
    const n=byId[el.dataset.n8n3Node];
    document.querySelectorAll('[data-n8n3-node]').forEach(x=>x.classList.toggle('selected',x===el));
    const panel=modal(`<div class="modal-head n8n3-modal-head"><div><small>${escapeHtml(n.sub||'n8n node')}</small><h2>${escapeHtml(n.label)}</h2></div><button data-close-modal>×</button></div>
      <div class="n8n3-node-editor">
        <aside><b>INPUT</b><pre>${escapeHtml(n.input||'{\n  "items": 1\n}')}</pre></aside>
        <section><nav><button class="active">Parameters</button><button>Settings</button></nav><label>Purpose<p>${escapeHtml(n.desc||'Processes the current workflow item.')}</p></label><label>Operation<p>${escapeHtml(n.sub||'Configured node action')}</p></label></section>
        <aside><b>OUTPUT</b><pre>${escapeHtml(n.preview||'{\n  "status": "ready"\n}')}</pre></aside>
      </div>`);
    panel.classList.add('n8n3-modal');
  });
  document.getElementById('n8n3Execute').onclick=()=>{
    const order=nodes.map(n=>document.querySelector(`[data-n8n3-node="${n.id}"]`));
    order.forEach(x=>x&&x.classList.remove('executed','running'));
    let i=0;
    const step=()=>{ if(i>=order.length){toast('Workflow execution completed · synthetic run');return;}
      const el=order[i++]; if(!el)return step();
      el.classList.add('running');
      setTimeout(()=>{el.classList.remove('running');el.classList.add('executed');step();},220);
    };
    step();
  };
}

/* -------------------------------------------------------------------------- */
/* MONDAY.COM RECONSTRUCTION                                                   */
/* -------------------------------------------------------------------------- */
function monday() {
  const boards = {
    'Master Projects': {
      groups:[
        {name:'Active Projects',color:'#579bfc',rows:[
          {item:'Recruitment CRM Rollout',owner:'Danica',collaborators:'Alex, Maya',informed:'Leadership',status:'Working on it',priority:'High',due:'2026-09-08',dept:'Operations',health:'At Risk',manhours:'420 h planned',sharepoint:'Operations / CRM Rollout'},
          {item:'Hiring Manager Portal',owner:'Danica',collaborators:'Maya',informed:'Recruitment Leadership',status:'Working on it',priority:'Critical',due:'2026-09-12',dept:'Recruitment',health:'On Track',sharepoint:'Recruitment / Hiring Portal'},
          {item:'Data Migration Wave 3',owner:'Alex',status:'Stuck',priority:'High',due:'2026-08-30',dept:'Data',health:'At Risk'}]},
        {name:'Planned',color:'#a25ddc',rows:[{item:'Q4 Reporting Upgrade',owner:'Maya',status:'Not Started',priority:'Medium',due:'2026-09-28',dept:'Analytics',health:'On Track'}]}
      ], cols:['Project','Owner','Status','Priority','Due Date','Department','Health']
    },
    'Master Tasks': {
      groups:[
        {name:'This week',color:'#579bfc',rows:[
          {item:'Finalize client migration mapping',owner:'Danica',status:'Working on it',priority:'High',due:'2026-09-02',scheduled:'Sep 1 · 09:30–11:00',project:'Recruitment CRM Rollout',risk:'Normal'},
          {item:'Validate API mappings',owner:'Alex',status:'Stuck',priority:'Critical',due:'2026-08-30',scheduled:'Aug 30 · 13:00–15:00',project:'Recruitment CRM Rollout',risk:'Overdue'},
          {item:'UAT approval',owner:'Maya',status:'Waiting on client',priority:'Medium',due:'2026-09-04',scheduled:'Not scheduled',project:'Hiring Manager Portal',risk:'Normal'},
          {item:'Review retry queue',owner:'Danica',status:'Done',priority:'High',due:'2026-08-31',project:'Hiring Manager Portal',risk:'Normal'}]},
        {name:'Next week',color:'#a25ddc',rows:[
          {item:'Leadership dashboard review',owner:'Paul',status:'Not Started',priority:'Medium',due:'2026-09-07',project:'Operations Workspace',risk:'Normal'},
          {item:'Document escalation runbook',owner:'Danica',status:'Working on it',priority:'Low',due:'2026-09-08',project:'Operations Workspace',risk:'Normal'}]}
      ], cols:['Task','Owner','Status','Priority','Due Date','Project','Risk']
    },
    'Escalations': {
      groups:[{name:'Open Escalations',color:'#e2445c',rows:[
        {item:'API mapping validation overdue',owner:'Danica',status:'Working on it',priority:'Critical',due:'2026-08-31',project:'Recruitment CRM Rollout',risk:'Escalated'},
        {item:'Candidate sync failed 3x',owner:'Alex',status:'Stuck',priority:'High',due:'2026-09-01',project:'Recruitment CRM Rollout',risk:'Escalated'}]},
        {name:'Resolved',color:'#00c875',rows:[{item:'Portal staging auth issue',owner:'Danica',status:'Done',priority:'High',due:'2026-08-27',project:'Hiring Manager Portal',risk:'Resolved'}]}], cols:['Escalation','Owner','Status','Priority','Due Date','Project','Risk']
    },
    'Requests': {
      groups:[{name:'New Requests',color:'#fdab3d',rows:[
        {item:'Add finance approval field',owner:'Maya',status:'Not Started',priority:'Medium',due:'2026-09-03',project:'Operations Workspace',risk:'Normal'},
        {item:'New recruiter dashboard widget',owner:'Paul',status:'Working on it',priority:'Low',due:'2026-09-06',project:'Recruitment CRM Rollout',risk:'Normal'}]}], cols:['Request','Owner','Status','Priority','Due Date','Project','Risk']
    },
    'Departments': {
      groups:[{name:'Departments',color:'#00c875',rows:[
        {item:'Recruitment',owner:'Maya',status:'Working on it',priority:'High',due:'2026-09-30',project:'4 projects',risk:'Normal'},
        {item:'Operations',owner:'Paul',status:'Working on it',priority:'High',due:'2026-09-30',project:'6 projects',risk:'Normal'},
        {item:'Data',owner:'Alex',status:'Stuck',priority:'High',due:'2026-09-30',project:'3 projects',risk:'At Risk'}]}], cols:['Department','Lead','Status','Priority','Review Date','Portfolio','Risk']
    },
    'Approvals': {groups:[{name:'Pending Approval',color:'#fdab3d',rows:[{item:'CRM rollout production release',owner:'Maya',status:'Waiting on client',priority:'High',due:'2026-09-05',project:'Recruitment CRM Rollout',risk:'Approval Required'},{item:'Portal Phase 2 budget',owner:'Paul',status:'Not Started',priority:'Medium',due:'2026-09-09',project:'Hiring Manager Portal',risk:'Approval Required'}]},{name:'Decided',color:'#00c875',rows:[{item:'Migration Wave 3 scope',owner:'Maya',status:'Done',priority:'High',due:'2026-08-28',project:'Data Migration Wave 3',risk:'Approved'}]}],cols:['Approval','Approver','Decision','Priority','Due Date','Project','State']},
    'n8n Execution Logs': {groups:[{name:'Latest Executions',color:'#579bfc',rows:[{item:'EXE-10482 · Cross-board task sync',owner:'n8n',status:'Done',priority:'Low',due:'2026-09-01',project:'Master Tasks → Projects',risk:'842 ms'},{item:'EXE-10481 · Escalation propagation',owner:'n8n',status:'Done',priority:'Low',due:'2026-09-01',project:'Tasks → Escalations',risk:'1.2 s'},{item:'EXE-10480 · Approval dashboard refresh',owner:'n8n',status:'Stuck',priority:'High',due:'2026-09-01',project:'Approvals → Executive Dashboard',risk:'Retry 1'}]}],cols:['Execution','Workflow','Result','Severity','Run Date','Source → Target','Duration / Retry']}
  };
  let state={board:'Master Tasks',view:'Main Table',special:null,search:'',overdue:false,sort:false};

  root.innerHTML=`<div class="monday-rebuild"><aside class="monday-global-rail"><div class="monday-logo"><i></i><i></i><i></i></div><button>⌂</button><button class="active">▦</button><button>✓</button><button>▣</button><span></span><button>?</button><button class="monday-user">DB</button></aside><aside class="monday-sidebar"><div class="monday-workspace-title"><span class="workspace-icon">W</span><div><b>Operations Workspace</b><small>Company PM workspace</small></div><button>•••</button></div><label class="monday-side-search">⌕ <input id="mondayBoardSearch" placeholder="Search"></label><div class="monday-side-section"><small>My workspace</small><button data-special="My Work">✓ My Work</button><button data-special="Calendar">□ Calendar</button></div><div class="monday-side-section"><small>Favorites</small><button data-board="Master Tasks" class="active">▦ Master Tasks</button><button data-board="Master Projects">▦ Project Portfolio</button></div><div class="monday-side-section"><small>Governance</small><button data-board="Approvals">✓ Approvals</button><button data-board="Escalations">⚠ Escalations</button><button data-special="Leadership">▤ Executive Dashboard</button></div><div class="monday-side-section"><small>Workspace</small><button data-board="Requests">▦ Requests</button><button data-board="Departments">▦ Departments</button><button data-board="n8n Execution Logs">☷ n8n Execution Logs</button><button data-special="Company Agenda">◷ Company Agenda <em>Phase 2</em></button></div><div class="monday-side-bottom"><button id="mondayN8n">⚡ n8n cross-board orchestration</button></div></aside><main class="monday-main" id="mondayMain"></main><aside class="monday-drawer" id="mondayDrawer"></aside></div>`;
  const main=document.getElementById('mondayMain'),drawer=document.getElementById('mondayDrawer');

  function statusClass(s){return s==='Done'?'done':s==='Working on it'?'working':s==='Stuck'?'stuck':s==='Waiting on client'?'waiting':'notstarted'}
  function priorityClass(s){return s==='Critical'?'critical':s==='High'?'high':s==='Medium'?'medium':'low'}
  function allRows(){return boards[state.board].groups.flatMap((g,gi)=>g.rows.map((r,ri)=>({...r,group:g.name,gi,ri})));}
  function filteredRows(rows){let out=[...rows];if(state.search)out=out.filter(r=>Object.values(r).join(' ').toLowerCase().includes(state.search.toLowerCase()));if(state.overdue)out=out.filter(r=>r.risk==='Overdue'||r.risk==='Escalated'||new Date(r.due)<new Date('2026-08-31'));if(state.sort)out.sort((a,b)=>a.due.localeCompare(b.due));return out;}

  function renderHeader(){
    return `<div class="monday-board-head"><div class="monday-breadcrumb">Operations Workspace / ${state.board}</div><div class="monday-title-row"><h1>${state.board}</h1><button>☆</button><button>ⓘ</button><span class="monday-board-type">Main board</span><div class="monday-head-actions"><button>Invite / 4</button><button>•••</button></div></div><div class="monday-view-tabs">${['Main Table','Kanban','Dashboard','Activity Log'].map(v=>`<button data-monday-view="${v}" class="${state.view===v?'active':''}">${v==='Main Table'?'▦ ':v==='Kanban'?'▥ ':v==='Dashboard'?'▤ ':'☷ '}${v}</button>`).join('')}<button class="add-view">＋</button></div></div>`;
  }
  function toolbar(){return `<div class="monday-toolbar"><div><button class="monday-new" id="mondayNew">New Item⌄</button><button id="mondaySearchBtn">⌕ Search</button><button>♙ Person</button><button id="mondayFilter" class="${state.overdue?'selected':''}">▽ Filter${state.overdue?' · 1':''}</button><button id="mondaySort" class="${state.sort?'selected':''}">⇅ Sort${state.sort?' · 1':''}</button><button>⊟ Hide</button></div><div><button id="mondayIntegrate">⊞ Integrate</button><button id="mondayAutomate">⚡ Automate</button><button>•••</button></div></div><div class="monday-inline-search ${state.search?'show':''}" id="mondayInlineSearch"><input id="mondaySearchInput" placeholder="Search this board" value="${escapeHtml(state.search)}"><button id="clearMondaySearch">×</button></div>`}
  function tableView(){
    const board=boards[state.board];
    return `<div class="monday-board-table">${board.groups.map(g=>{let rows=filteredRows(g.rows.map((r,ri)=>({...r,group:g.name,ri})));if(!rows.length)return'';return `<section class="monday-group"><div class="monday-group-title" style="--group:${g.color}"><button>⌄</button><b>${g.name}</b><span>${rows.length} Items</span></div><div class="monday-table-scroll"><table><thead><tr><th class="select"><input type="checkbox"></th>${board.cols.map((c,i)=>`<th class="${i===0?'itemcol':''}">${c}${i===0?' <span class="info">ⓘ</span>':''}</th>`).join('')}<th class="addcol">＋</th></tr></thead><tbody>${rows.map((r,ri)=>`<tr data-monday-row="${g.name}|${r.ri??ri}"><td class="row-color" style="--group:${g.color}"><input type="checkbox"></td><td class="item-name"><button class="open-update">${escapeHtml(r.item)}</button><span class="update-icon">◯</span></td><td><span class="person-bubble" title="${r.owner}">${initials(r.owner)}</span></td><td><button class="monday-status ${statusClass(r.status)}" data-status>${r.status}</button></td><td><button class="monday-priority ${priorityClass(r.priority)}">${r.priority}</button></td><td><span class="date-cell ${r.risk==='Overdue'||r.risk==='Escalated'?'overdue':''}">${formatDate(r.due)}</span></td><td>${escapeHtml(r.project||r.dept||'—')}</td><td><span class="risk-cell ${String(r.risk).toLowerCase().replace(/\s/g,'-')}">${escapeHtml(r.risk||r.health||'Normal')}</span></td><td></td></tr>`).join('')}<tr class="add-item-row"><td style="--group:${g.color}"></td><td colspan="${board.cols.length+1}"><button data-add-group="${g.name}">＋ Add Item</button></td></tr></tbody></table></div></section>`}).join('')}</div>`;
  }
  function kanbanView(){const rows=filteredRows(allRows());const statuses=['Not Started','Working on it','Waiting on client','Stuck','Done'];return `<div class="monday-kanban">${statuses.map(s=>`<section><header class="${statusClass(s)}"><b>${s}</b><span>${rows.filter(r=>r.status===s).length}</span></header><div>${rows.filter(r=>r.status===s).map(r=>`<article data-kanban="${r.group}|${r.ri}"><b>${r.item}</b><p>${r.project||r.dept||''}</p><div><span class="person-bubble">${initials(r.owner)}</span><span class="monday-priority ${priorityClass(r.priority)}">${r.priority}</span></div></article>`).join('')}</div><button class="kanban-add">＋ Add item</button></section>`).join('')}</div>`}
  function dashboardView(){const rows=allRows();const done=rows.filter(r=>r.status==='Done').length,stuck=rows.filter(r=>r.status==='Stuck').length,working=rows.filter(r=>r.status==='Working on it').length;return `<div class="monday-dashboard"><section class="monday-widget numbers"><div><strong>${rows.length}</strong><span>Total items</span></div><div><strong>${stuck}</strong><span>Stuck</span></div><div><strong>${rows.filter(r=>r.risk==='Overdue'||r.risk==='Escalated').length}</strong><span>At risk</span></div></section><section class="monday-widget"><h3>Status overview</h3><div class="monday-status-chart"><div style="--w:${Math.max(10,done/rows.length*100)}%;--c:#00c875"><span>Done</span><i></i><b>${done}</b></div><div style="--w:${Math.max(10,working/rows.length*100)}%;--c:#fdab3d"><span>Working on it</span><i></i><b>${working}</b></div><div style="--w:${Math.max(10,stuck/rows.length*100)}%;--c:#e2445c"><span>Stuck</span><i></i><b>${stuck}</b></div></div></section><section class="monday-widget"><h3>Workload</h3><div class="monday-workload">${['Danica','Alex','Maya','Paul'].map((n,i)=>`<div><span class="person-bubble">${initials(n)}</span><b>${n}</b><i style="width:${[82,58,46,30][i]}%"></i><em>${[5,4,3,2][i]} items</em></div>`).join('')}</div></section><section class="monday-widget wide"><h3>Automation activity</h3><div class="timeline"><div class="event"><time>10:15</time><strong>n8n detected overdue task · escalation created</strong></div><div class="event"><time>10:15</time><strong>Project risk updated · Recruitment CRM Rollout</strong></div><div class="event"><time>10:16</time><strong>Leadership dashboard refreshed</strong></div></div></section></div>`}
  function activityView(){return `<div class="monday-activity"><div class="monday-activity-filter"><button>All activity⌄</button><button>Everyone⌄</button><input placeholder="Search activity"></div>${[['10:16','Danica','changed Status','Validate API mappings','Working on it → Stuck'],['10:15','n8n','created item','Escalations','API mapping validation overdue'],['10:15','n8n','changed Risk','Recruitment CRM Rollout','Normal → At Risk'],['09:42','Maya','added an update','Hiring Manager Portal','UAT feedback added']].map(x=>`<article><span class="person-bubble">${initials(x[1])}</span><div><b>${x[1]} <em>${x[2]}</em></b><p>${x[3]} · ${x[4]}</p></div><time>${x[0]}</time></article>`).join('')}</div>`}
  function specialView(){
    const tasks=boards['Master Tasks'].groups.flatMap(g=>g.rows);
    if(state.special==='My Work')return `<div class="monday-special-head"><div><small>PERSONAL TASK VIEW</small><h1>My Work</h1><p>Only tasks assigned to Danica. Every item remains linked to its project.</p></div><button class="monday-new" id="schedulePersonal">Schedule selected</button></div><div class="monday-personal-grid"><section><h3>Due this week</h3>${tasks.filter(t=>t.owner==='Danica').map(t=>`<article><span class="monday-status ${statusClass(t.status)}">${t.status}</span><b>${t.item}</b><p>${t.project}</p><small>Due ${formatDate(t.due)} · ${t.priority} priority</small></article>`).join('')}</section><section><h3>Escalated to me</h3><article class="attention"><span class="monday-priority critical">Required action</span><b>API mapping validation overdue</b><p>Alex escalated this item with a required note.</p><small>“Client dependency blocks tomorrow's test.”</small></article></section></div>`;
    if(state.special==='Calendar')return `<div class="monday-special-head"><div><small>PERSONAL CALENDAR</small><h1>Due dates vs scheduled work</h1><p>Deadlines remain separate from optional personal time blocks.</p></div><button class="monday-new" id="calendarSync">Sync personal calendar</button></div><div class="monday-calendar"><header><button>‹</button><b>September 2026</b><button>›</button></header><div class="monday-calendar-legend"><span><i></i>Due date</span><span><i class="scheduled"></i>Scheduled work</span><span><i class="priority"></i>Priority attention</span></div><div class="monday-week">${[['Mon 31','Review retry queue','Due'],['Tue 1','Migration mapping · 09:30','Scheduled'],['Wed 2','Migration mapping','Due'],['Thu 3','Portal UAT · 14:00','Scheduled'],['Fri 4','UAT approval','Due']].map(d=>`<article><small>${d[0]}</small><div class="${d[2].toLowerCase()}"><b>${d[1]}</b><span>${d[2]}</span></div></article>`).join('')}</div></div>`;
    if(state.special==='Leadership')return `<div class="monday-special-head"><div><small>NATIVE MONDAY DASHBOARD · EXECUTIVE ACCESS</small><h1>Executive project control center</h1><p>Native widgets connected to project, task, approval, escalation, and time-tracking boards.</p></div><div class="monday-leader-filters"><button>Active</button><button>Future</button><button>Closed</button><button>All departments</button></div></div><div class="monday-leader-kpis"><article><strong>13</strong><span>Active projects</span></article><article><strong>7</strong><span>Overdue tasks</span></article><article><strong>2</strong><span>Open escalations</span></article><article><strong>3</strong><span>Pending approvals</span></article></div><div class="monday-exec-grid"><section class="monday-widget exec-timeline"><header><div><small>TIMELINE WIDGET</small><h3>All project timelines</h3></div><button>Expand</button></header><div class="exec-timeline-bars"><div><span>CRM Rollout</span><i><b style="left:5%;width:56%;background:#579bfc"></b></i><em>Aug 12–Sep 8</em></div><div><span>Hiring Portal</span><i><b style="left:24%;width:58%;background:#a25ddc"></b></i><em>Aug 20–Sep 12</em></div><div><span>Migration Wave 3</span><i><b style="left:0;width:48%;background:#e2445c"></b></i><em>Aug 8–Aug 30</em></div></div><table class="dbtable exec-project-table"><tr><th>Project</th><th>Owner</th><th>Status</th><th>Timeline</th><th>Planned manhours</th><th>Time spent</th></tr><tr><td>Recruitment CRM Rollout</td><td>Danica</td><td>At Risk</td><td>Aug 12–Sep 8</td><td>420 h</td><td>286 h</td></tr><tr><td>Hiring Manager Portal</td><td>Danica</td><td>On Track</td><td>Aug 20–Sep 12</td><td>260 h</td><td>148 h</td></tr><tr><td>Data Migration Wave 3</td><td>Alex</td><td>At Risk</td><td>Aug 8–Aug 30</td><td>310 h</td><td>337 h</td></tr></table></section><section class="monday-widget exec-workload"><header><div><small>WORKLOAD WIDGET · COLOR BY PROJECT</small><h3>Member workload</h3></div><button>Expand</button></header>${[['Danica',92,'#579bfc'],['Alex',118,'#e2445c'],['Maya',74,'#a25ddc'],['Paul',56,'#00c875']].map(x=>`<button class="exec-person" data-exec-person="${x[0]}"><span class="person-bubble">${initials(x[0])}</span><b>${x[0]}</b><i><em style="width:${Math.min(100,x[1])}%;background:${x[2]}"></em></i><strong>${x[1]}%</strong></button>`).join('')}<div class="exec-workload-detail" id="execWorkloadDetail">Click a member to view tasks by project.</div></section><section class="monday-widget exec-governance"><header><div><small>APPROVALS + ESCALATIONS</small><h3>Decisions requiring action</h3></div><button>Open boards</button></header><div class="exec-queue"><article><span class="tag warn">Approval</span><b>CRM production release</b><small>Maya · due Sep 5</small></article><article><span class="tag bad">Escalation</span><b>API mapping validation overdue</b><small>Danica · required note attached</small></article><article><span class="tag warn">Approval</span><b>Portal Phase 2 budget</b><small>Paul · due Sep 9</small></article></div></section><section class="monday-widget exec-time"><header><div><small>TIME TRACKING WIDGET · SPLIT MODE</small><h3>Time spent by project</h3></div><button>View table</button></header><div class="exec-time-bars"><div><span>CRM Rollout</span><i><b style="width:68%"></b></i><strong>286 / 420 h</strong></div><div><span>Hiring Portal</span><i><b style="width:57%"></b></i><strong>148 / 260 h</strong></div><div><span>Migration Wave 3</span><i><b class="over" style="width:100%"></b></i><strong>337 / 310 h</strong></div></div></section><section class="monday-widget wide exec-kanban"><header><div><small>KANBAN WIDGET · ALL TASKS · COLOR BY PROJECT</small><h3>All-task execution view</h3></div><button>Expand</button></header><div class="exec-kanban-cols">${[['Not Started','#c4c4c4','Leadership dashboard review','Paul','Operations Workspace'],['Working on it','#579bfc','Finalize migration mapping','Danica','CRM Rollout'],['Waiting','#a25ddc','UAT approval','Maya','Hiring Portal'],['Stuck','#e2445c','Validate API mappings','Alex','CRM Rollout']].map(x=>`<section style="--project:${x[1]}"><h4>${x[0]}</h4><article><i></i><b>${x[2]}</b><small>${x[4]}</small><span class="person-bubble">${initials(x[3])}</span></article></section>`).join('')}</div></section></div>`;
    return `<div class="monday-special-head"><div><small>PHASE 2 CONCEPT</small><h1>Company Agenda</h1><p>Department-level recurring work and dependencies rolled into a company-wide schedule.</p></div><span class="monday-phase-badge">Not part of Phase 1</span></div><div class="monday-agenda"><article><time>09:00</time><div><b>Operations weekly planning</b><p>Operations · recurring every Monday</p></div><span>Recurring</span></article><article><time>11:00</time><div><b>CRM migration UAT</b><p>Blocked by “Validate API mappings”</p></div><span>Dependency</span></article><article><time>15:00</time><div><b>Recruitment portfolio review</b><p>Recruitment · leadership visibility</p></div><span>Department</span></article></div>`;
  }
  function expandMondayWidget(type){
    const title={timeline:'All Project Timelines',workload:'Team Workload',time:'Time Spent by Project',kanban:'All Tasks Kanban'}[type];
    const timeline=`<div class="monday-native-widget expanded"><header><h2>All Project Timelines</h2><div><button>▤ Baseline</button><button>▣ Auto Fit</button><button>Weeks⌄</button><button>−</button><button>＋</button><button>•••</button></div></header><div class="native-timeline"><aside><b>Project / task</b>${['Recruitment CRM Rollout','Verify OAuth credentials','Test bulk API write','Hiring Manager Portal','Complete UAT approval','Data Migration Wave 3'].map(x=>`<span>${x}</span>`).join('')}</aside><section><div class="native-week-head"><b>W23 · 1–7</b><b>W24 · 8–14</b><b>W25 · 15–21</b><b>W26 · 22–28</b><b>W27 · 29–5</b></div><div class="native-gantt-rows"><i style="--left:2%;--width:53%;--color:#579bfc">Danica Boton</i><i style="--left:7%;--width:12%;--color:#00c875">Danica</i><i style="--left:24%;--width:25%;--color:#00c875">Alex</i><i style="--left:28%;--width:56%;--color:#a25ddc">Danica Boton</i><i style="--left:52%;--width:21%;--color:#fdab3d">Maya</i><i style="--left:0%;--width:48%;--color:#e2445c">Alex</i></div></section></div><div class="native-widget-legend"><span><i class="blocked"></i>Blocked</span><span><i class="complete"></i>Completed</span><span><i class="working"></i>Working on it</span></div><table class="dbtable native-below-table"><tr><th>Project</th><th>Owner</th><th>Status</th><th>Timeline</th><th>Planned manhours</th><th>Time spent</th></tr><tr><td>Recruitment CRM Rollout</td><td>Danica</td><td>At Risk</td><td>Aug 12–Sep 8</td><td>420 h</td><td>286 h</td></tr><tr><td>Hiring Manager Portal</td><td>Danica</td><td>On Track</td><td>Aug 20–Sep 12</td><td>260 h</td><td>148 h</td></tr></table></div>`;
    const workload=`<div class="monday-native-widget expanded"><header><h2>Team Workload</h2><div><button>Today</button><button>Weeks⌄</button><button>•••</button></div></header><div class="native-workload"><aside>${['Danica Boton','Alex Rivera','Maya Lee','Paul Chen'].map((x,i)=>`<button data-native-person="${x}"><span class="person-bubble">${initials(x)}</span><b>${x}</b></button>`).join('')}</aside><section><div class="native-week-head"><b>W25 · 15–21</b><b>W26 · 22–28</b><b>W27 · 29–5</b><b>W28 · 6–12</b></div>${['Danica','Alex','Maya','Paul'].map((x,i)=>`<div class="native-workload-row"><span style="--load:${[72,108,84,56][i]}%">${[7.2,28.94,26.06,12.4][i]}</span><i style="left:${[3,14,7,18][i]}%;width:${[24,34,29,20][i]}%;background:${['#00c875','#e2445c','#a25ddc','#579bfc'][i]}">${['Validate records','Full migration','Portal UAT','Dashboard review'][i]}</i><i style="left:${[42,53,48,62][i]}%;width:20%;background:#fdab3d">Working</i></div>`).join('')}</section></div><div class="native-widget-legend"><span><i class="blocked"></i>Blocked</span><span><i class="complete"></i>Completed</span><span><i class="working"></i>Working on it</span></div><div class="native-person-detail" id="nativePersonDetail">Select a member to expand their tasks per project.</div></div>`;
    const time=`<div class="monday-native-widget expanded"><header><h2>Time Tracking · Split Mode</h2><div><button>This month</button><button>Projects⌄</button><button>•••</button></div></header><div class="native-time-summary"><article><strong>771 h</strong><span>Total time tracked</span></article><article><strong>990 h</strong><span>Planned manhours</span></article><article><strong>77.9%</strong><span>Capacity consumed</span></article></div><table class="dbtable"><tr><th>Project</th><th>Planned</th><th>Tracked</th><th>Variance</th><th>Primary owner</th></tr><tr><td>Recruitment CRM Rollout</td><td>420 h</td><td>286 h</td><td>−134 h</td><td>Danica</td></tr><tr><td>Hiring Manager Portal</td><td>260 h</td><td>148 h</td><td>−112 h</td><td>Danica</td></tr><tr><td>Data Migration Wave 3</td><td>310 h</td><td>337 h</td><td><span class="tag bad">+27 h</span></td><td>Alex</td></tr></table></div>`;
    const kanban=`<div class="monday-native-widget expanded"><header><h2>All Tasks Kanban</h2><div><button>Group by Status</button><button>Color by Project</button><button>•••</button></div></header><div class="native-expanded-kanban">${[['Not Started','#c4c4c4'],['Working on it','#fdab3d'],['Waiting','#a25ddc'],['Stuck','#e2445c'],['Done','#00c875']].map((c,ci)=>`<section><h3 style="border-color:${c[1]}">${c[0]}</h3>${['CRM Rollout','Hiring Portal'].map((p,pi)=>`<article style="--project:${pi?'#a25ddc':'#579bfc'}"><i></i><b>${['Leadership dashboard review','Finalize mapping','UAT approval','Validate APIs','Review retry queue'][(ci+pi)%5]}</b><small>${p}</small><span class="person-bubble">${['DB','AR','ML','PC'][(ci+pi)%4]}</span></article>`).join('')}</section>`).join('')}</div></div>`;
    const m=modal(`<div class="modal-head monday-widget-modal-head"><div><small>Native Monday dashboard widget</small><h2>${title}</h2></div><button data-close-modal>×</button></div>${type==='timeline'?timeline:type==='workload'?workload:type==='time'?time:kanban}`);m.classList.add('monday-widget-modal');m.querySelectorAll('[data-native-person]').forEach(b=>b.onclick=()=>{m.querySelector('#nativePersonDetail').innerHTML=`<b>${b.dataset.nativePerson}</b><span><i style="background:#579bfc"></i>CRM Rollout · Validate API mappings</span><span><i style="background:#a25ddc"></i>Hiring Portal · UAT approval</span><span><i style="background:#00c875"></i>Operations · Dashboard review</span>`});
  }
  function formatDate(d){const [y,m,day]=d.split('-');return `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(m)-1]} ${Number(day)}`}

  function render(){
    main.innerHTML=state.special?`<div class="monday-content-area monday-special">${specialView()}</div>`:renderHeader()+toolbar()+`<div class="monday-content-area">${state.view==='Main Table'?tableView():state.view==='Kanban'?kanbanView():state.view==='Dashboard'?dashboardView():activityView()}</div>`;
    document.querySelectorAll('[data-board]').forEach(b=>b.classList.toggle('active',b.dataset.board===state.board));
    document.querySelectorAll('[data-special]').forEach(b=>b.classList.toggle('active',b.dataset.special===state.special));
    if(state.special){const schedule=document.getElementById('schedulePersonal'),sync=document.getElementById('calendarSync');if(schedule)schedule.onclick=()=>toast('Task scheduled without changing its due date');if(sync)sync.onclick=()=>toast('Personal calendar handoff simulated');document.querySelectorAll('[data-exec-person]').forEach(b=>b.onclick=()=>{document.getElementById('execWorkloadDetail').innerHTML=`<b>${b.dataset.execPerson}</b><span><i style="background:#579bfc"></i>CRM Rollout · 3 tasks</span><span><i style="background:#a25ddc"></i>Hiring Portal · 2 tasks</span><span><i style="background:#00c875"></i>Operations Workspace · 1 task</span>`});const expanders=[['.exec-timeline header button','timeline'],['.exec-workload header button','workload'],['.exec-time header button','time'],['.exec-kanban header button','kanban']];expanders.forEach(([selector,type])=>{const b=document.querySelector(selector);if(b)b.onclick=()=>expandMondayWidget(type)});return;}
    document.querySelectorAll('[data-monday-view]').forEach(b=>b.onclick=()=>{state.view=b.dataset.mondayView;closeDrawer();render()});
    document.getElementById('mondaySearchBtn').onclick=()=>{document.getElementById('mondayInlineSearch').classList.toggle('show');setTimeout(()=>document.getElementById('mondaySearchInput').focus(),0)};
    document.getElementById('mondaySearchInput').oninput=e=>{state.search=e.target.value;render();setTimeout(()=>{const i=document.getElementById('mondaySearchInput');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}},0)};
    document.getElementById('clearMondaySearch').onclick=()=>{state.search='';render()};
    document.getElementById('mondayFilter').onclick=()=>{state.overdue=!state.overdue;render();toast(state.overdue?'Showing overdue / escalated items':'Filter cleared')};
    document.getElementById('mondaySort').onclick=()=>{state.sort=!state.sort;render();toast(state.sort?'Sorted by due date':'Sort cleared')};
    document.getElementById('mondayNew').onclick=()=>newMondayItem();
    document.getElementById('mondayIntegrate').onclick=()=>integrationModal('Integrations');
    document.getElementById('mondayAutomate').onclick=()=>integrationModal('Automations');
    document.querySelectorAll('[data-monday-row], [data-kanban]').forEach(row=>row.onclick=e=>{if(e.target.closest('[data-status]'))return;const key=(row.dataset.mondayRow||row.dataset.kanban).split('|');openItem(key[0],Number(key[1]))});
    document.querySelectorAll('[data-status]').forEach(btn=>btn.onclick=e=>{e.stopPropagation();cycleStatus(btn)});
    document.querySelectorAll('[data-add-group]').forEach(b=>b.onclick=()=>newMondayItem(b.dataset.addGroup));
  }
  function cycleStatus(btn){const seq=['Not Started','Working on it','Waiting on client','Stuck','Done'];const row=btn.closest('[data-monday-row]');const [groupName,index]=row.dataset.mondayRow.split('|');const g=boards[state.board].groups.find(g=>g.name===groupName);const r=g.rows[Number(index)];r.status=seq[(seq.indexOf(r.status)+1)%seq.length];render();toast(`Status changed to ${r.status}`)}
  function openItem(groupName,index){const g=boards[state.board].groups.find(x=>x.name===groupName);const r=g.rows[index];if(!r)return;const projectMode=state.board==='Master Projects';drawer.classList.add('open');drawer.innerHTML=`<div class="monday-drawer-head"><div><small>${state.board}</small><h2>${r.item}</h2></div><button id="closeMondayDrawer">×</button></div><div class="monday-item-tabs"><button class="active">${projectMode?'Overview':'Updates'}</button><button>${projectMode?'Project chat':'Activity Log'}</button><button>${projectMode?'Files':'Item Card'}</button></div><div class="monday-drawer-body"><div class="monday-item-fields"><label>${projectMode?'Project owner':'Responsible'}<span><span class="person-bubble">${initials(r.owner)}</span>${r.owner}</span></label>${projectMode?`<label>Collaborators<span>${r.collaborators||'Project members'}</span></label><label>Informed<span>${r.informed||'Leadership'}</span></label>`:''}<label>Status<span class="monday-status ${statusClass(r.status)}">${r.status}</span></label><label>Priority<span class="monday-priority ${priorityClass(r.priority)}">${r.priority}</span></label><label>Due date<span>${formatDate(r.due)}</span></label>${!projectMode?`<label>Scheduled work<span>${r.scheduled||'Not scheduled'}</span></label>`:''}<label>Project<span>${r.project||r.dept||r.item}</span></label><label>${projectMode?'SharePoint':'Working attachment'}<span>${projectMode?'↗ '+(r.sharepoint||'Project document library'):'📎 validation-notes.png'}</span></label></div><div class="monday-update-box"><textarea placeholder="${projectMode?'Message project members or tag a task…':'Write an update…'}"></textarea><button id="postMondayUpdate">${projectMode?'Send':'Update'}</button></div>${!projectMode?'<button class="monday-escalate" id="escalateMondayTask">Escalate task</button>':''}<div class="monday-updates"><article><span class="person-bubble">DB</span><div><b>Danica</b><p>${projectMode?'@Alex please confirm the dependency on Validate API mappings.':'Automation checked this item during the latest 15-minute run.'}</p><small>${projectMode?'Visible to project members only':'Today at 10:15'}</small></div></article></div></div>`;document.getElementById('closeMondayDrawer').onclick=closeDrawer;document.getElementById('postMondayUpdate').onclick=()=>toast(projectMode?'Project message posted · members only':'Update posted to synthetic item');const esc=document.getElementById('escalateMondayTask');if(esc)esc.onclick=()=>escalationModal(r)}
  function escalationModal(task){const m=modal(`<div class="modal-head monday-modal-head"><div><small>Required accountability record</small><h2>Escalate task</h2></div><button data-close-modal>×</button></div><form id="mondayEscalationForm" class="modal-form"><label>Escalate to<select name="recipient"><option>Danica</option><option>Maya</option><option>Paul</option></select></label><label>Source task<input value="${escapeHtml(task.item)}" disabled></label><label class="full">Escalation note<textarea name="note" required placeholder="Explain why this needs escalation and the action required"></textarea></label><div class="modal-actions"><button type="button" data-close-modal>Cancel</button><button class="primary">Create escalation</button></div></form>`);m.querySelector('#mondayEscalationForm').onsubmit=e=>{e.preventDefault();const note=new FormData(e.currentTarget).get('note').trim();if(!note){toast('Escalation note is required');return}m.remove();toast('Escalation created · recipient and leadership views updated')}}
  function closeDrawer(){drawer.classList.remove('open');drawer.innerHTML=''}
  function newMondayItem(groupName){const board=boards[state.board],g=board.groups.find(x=>x.name===groupName)||board.groups[0];const m=modal(`<div class="modal-head monday-modal-head"><div><small>${state.board}</small><h2>New Item</h2></div><button data-close-modal>×</button></div><form id="mondayNewForm" class="modal-form"><label>Item name<input name="item" value="New operational item" required></label><label>Owner<select name="owner"><option>Danica</option><option>Alex</option><option>Maya</option><option>Paul</option></select></label><label>Status<select name="status"><option>Not Started</option><option>Working on it</option><option>Waiting on client</option></select></label><label>Priority<select name="priority"><option>Medium</option><option>High</option><option>Critical</option></select></label><label>Due date<input type="date" name="due" value="2026-09-06"></label><div class="modal-actions"><button type="button" data-close-modal>Cancel</button><button class="primary">Add Item</button></div></form>`);m.querySelector('#mondayNewForm').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.currentTarget);g.rows.push({item:fd.get('item'),owner:fd.get('owner'),status:fd.get('status'),priority:fd.get('priority'),due:fd.get('due'),project:'Operations Workspace',risk:'Normal'});m.remove();render();toast('Item added to synthetic Monday board')}}
  function integrationModal(type){const m=modal(`<div class="modal-head monday-modal-head"><div><small>monday.com reconstruction</small><h2>${type}</h2></div><button data-close-modal>×</button></div><div class="monday-integration-modal"><div class="monday-recipe-card"><span>⚡</span><div><b>n8n orchestration layer</b><p>Scheduled every 15 minutes for overdue checks, escalation creation, and cross-board updates.</p></div><button id="openMondayN8n">Open workflow</button></div><div class="monday-recipe-card"><span>↔</span><div><b>Board relationships</b><p>Master Projects ↔ Master Tasks ↔ Escalations.</p></div><button onclick="toast('Relationship mapping previewed')">View mapping</button></div></div>`);setTimeout(()=>{const b=document.getElementById('openMondayN8n');if(b)b.onclick=()=>{m.remove();renderMondayN8n()}},0)}
  function renderMondayN8n(){
    renderN8nStudio({title:'Overdue + Escalation Orchestrator',subtitle:'Operations Workspace / n8n',onBack:monday,note:'Scheduled every 15 minutes. Detect overdue work, prevent duplicate escalations, create/update related Monday records, and refresh project risk state.',nodes:[
      {id:'schedule',label:'Schedule Trigger',sub:'Every 15 minutes',type:'schedule',x:70,y:300,desc:'Starts the operational scan on the configured cadence.'},
      {id:'tasks',label:'Monday.com',sub:'Get active tasks',type:'monday',x:300,y:300,desc:'Reads active items from the Master Tasks board.'},
      {id:'evaluate',label:'Code',sub:'Evaluate due date',type:'code',x:530,y:300,desc:'Normalizes due dates and calculates overdue state.',preview:'{\n  "is_overdue": true,\n  "days_overdue": 1\n}'},
      {id:'overdue',label:'If',sub:'Task overdue?',type:'if',x:760,y:300,desc:'Routes overdue items into the escalation branch.'},
      {id:'search',label:'Monday.com',sub:'Search escalations',type:'monday',x:990,y:175,desc:'Checks whether an escalation already exists for the task.'},
      {id:'exists',label:'If',sub:'Escalation exists?',type:'if',x:1210,y:175,desc:'Duplicate guard before any create operation.'},
      {id:'create',label:'Monday.com',sub:'Create escalation',type:'monday',x:990,y:420,desc:'Creates a linked escalation record when required.'},
      {id:'updateTask',label:'Monday.com',sub:'Update task risk',type:'monday',x:1210,y:420,desc:'Marks the source task as escalated and links the escalation.'},
      {id:'updateProject',label:'Monday.com',sub:'Update project risk',type:'monday',x:1210,y:560,desc:'Updates the related Master Project risk/health status.'}
    ],links:[{from:'schedule',to:'tasks'},{from:'tasks',to:'evaluate'},{from:'evaluate',to:'overdue'},{from:'overdue',to:'search',branch:'true'},{from:'search',to:'exists'},{from:'exists',to:'create',branch:'false'},{from:'create',to:'updateTask'},{from:'updateTask',to:'updateProject'}]});
  }
  document.querySelectorAll('[data-board]').forEach(b=>b.onclick=()=>{state.board=b.dataset.board;state.special=null;state.view='Main Table';state.search='';closeDrawer();render()});
  document.querySelectorAll('[data-special]').forEach(b=>b.onclick=()=>{state.special=b.dataset.special;closeDrawer();render()});
  document.getElementById('mondayBoardSearch').oninput=e=>{const q=e.target.value.toLowerCase();document.querySelectorAll('[data-board]').forEach(b=>b.style.display=b.dataset.board.toLowerCase().includes(q)?'':'none')};
  document.getElementById('mondayN8n').onclick=renderMondayN8n;
  render();
}

/* -------------------------------------------------------------------------- */
/* DEE                                                                         */
/* -------------------------------------------------------------------------- */
function dee() {
  root.innerHTML=`<div class="dee-dev-shell">
    <aside class="dee-dev-rail">
      <div class="dee-dev-brand"><span>DEE</span><small>V4 · PRIVATE BUILD</small></div>
      <nav><button class="active">Architecture</button><button>Runtime</button><button>Governance</button><button>Testing</button></nav>
      <div class="dee-dev-foot">Public demo intentionally withheld until the runtime reaches a stable release milestone.</div>
    </aside>
    <main class="dee-dev-main">
      <header><div><span class="dee-dev-status"><i></i> ONGOING PRODUCT / R&amp;D</span><h1>DEE Agentic Automation Runtime</h1><p>Governed multi-agent runtime for persistent specialist agents, exact tool permissions, approvals, memory, retries, schedules, and observable execution.</p></div><span class="dee-private-badge">PRIVATE DEVELOPMENT</span></header>
      <section class="dee-dev-map">
        <svg viewBox="0 0 1120 470" aria-hidden="true"><path d="M155 230 C260 230 255 135 370 135"/><path d="M155 230 C260 230 255 325 370 325"/><path d="M560 135 C655 135 650 230 755 230"/><path d="M560 325 C655 325 650 230 755 230"/><path d="M900 230 C980 230 970 130 1040 130"/><path d="M900 230 C980 230 970 330 1040 330"/></svg>
        <article style="left:35px;top:185px"><small>ENTRY</small><b>User / Trigger</b><span>Task + context</span></article>
        <article style="left:315px;top:90px"><small>ROUTING</small><b>Orchestrator</b><span>Decompose · route · reconcile</span></article>
        <article style="left:315px;top:280px"><small>SPECIALISTS</small><b>Persistent Agents</b><span>Scoped roles + model profiles</span></article>
        <article class="accent" style="left:710px;top:185px"><small>GOVERNANCE</small><b>Permission + Approval Gate</b><span>Named actions · owner re-auth</span></article>
        <article style="left:970px;top:80px"><small>EXECUTION</small><b>External Actions</b><span>HTTPS · idempotency · retry</span></article>
        <article style="left:970px;top:280px"><small>STATE</small><b>Memory + Audit</b><span>Persistent records · schedules</span></article>
      </section>
      <section class="dee-dev-proof"><article><strong>612+</strong><span>backend tests in latest recorded phase</span></article><article><strong>57</strong><span>frontend tests</span></article><article><strong>10</strong><span>SDK tests</span></article><article><strong>Governed</strong><span>approvals · idempotency · audit · DLQ</span></article></section>
      <div class="dee-dev-note"><b>No simulated public runtime.</b> This portfolio intentionally shows the architecture and verified implementation progress only. A public interactive demo will be added after a stable release milestone.</div>
    </main>
  </div>`;
}

/* -------------------------------------------------------------------------- */
/* OCR                                                                         */
/* -------------------------------------------------------------------------- */
function ocr() {
  let page='Upload / Intake',processing=false;root.innerHTML=`<div id="ocrMount" class="ocr-console"></div>`;const mount=document.getElementById('ocrMount');
  const records=[
    ['2026-01-28','ShieldMonster','CO','Att Prince','232','191','41','Validated'],
    ['2026-01-28','Paw Lobby','CO','Att Prince','21','21','0','Validated'],
    ['2026-01-27','RED SUN Official Store','CO','Att Satraj','13','13','0','Validated']
  ];
  const renderOcrN8n=()=>renderN8nStudio({title:'Document Intake, Records + Reporting',subtitle:'SPX Operations / n8n',onBack:ocr,note:'Synthetic reconstruction: UI uploads and Google Drive files converge into one binary-file contract. n8n preserves the source, runs OCR, maps and validates collection fields, upserts operational records, routes exceptions, and generates traceable reports.',nodes:[
    {id:'web',type:'webhook',label:'UI Upload Webhook',sub:'Binary + metadata',x:45,y:150,desc:'Receives a drag-and-drop image or PDF from the operator console.',input:'multipart file + source metadata',output:'Normalized intake item'},
    {id:'drive',type:'drive',label:'Drive Intake',sub:'Folder watch / batch',x:45,y:350,desc:'Lists approved files from the monitored Google Drive folder.',input:'Folder id',output:'Drive file item'},
    {id:'file',type:'code',label:'Validate + Dedupe',sub:'Code',x:270,y:250,desc:'Checks file type, size, request fields, and stable source identity before processing.',input:'UI or Drive item',output:'Validated binary contract'},
    {id:'store',type:'supabase',label:'Store Original',sub:'Supabase Storage',x:490,y:150,desc:'Preserves the original document for audit and human review.',input:'Binary file',output:'Storage path'},
    {id:'ocr',type:'command',label:'Run Tesseract OCR',sub:'OCR service',x:490,y:350,desc:'Extracts raw text and confidence evidence from the document.',input:'Binary file',output:'Text + confidence'},
    {id:'map',type:'code',label:'Map Collection Fields',sub:'Code',x:720,y:250,desc:'Normalizes seller, route, driver, orders, pickups, parcels, remarks, and payment values.',input:'OCR response',output:'Collection record'},
    {id:'valid',type:'if',label:'Record Valid?',sub:'Confidence + rules',x:940,y:250,desc:'Requires the business fields and acceptable OCR confidence.',input:'Mapped record',output:'valid / review'},
    {id:'db',type:'supabase',label:'Upsert Records',sub:'PostgreSQL',x:1160,y:130,desc:'Writes duplicate-safe operational records linked to the source file.',input:'Validated record',output:'Record id'},
    {id:'review',type:'telegram',label:'Create Exception',sub:'Review queue',x:1160,y:370,desc:'Keeps ambiguous documents visible with validation reasons.',input:'Invalid record + source',output:'Review item'},
    {id:'report',type:'code',label:'Build Reports',sub:'Aggregate records',x:1370,y:130,desc:'Generates route totals, attendance, payout, discrepancy, and profit/loss outputs.',input:'Approved records',output:'Report run + export'}
  ],links:[{from:'web',to:'file'},{from:'drive',to:'file'},{from:'file',to:'store'},{from:'file',to:'ocr'},{from:'ocr',to:'map'},{from:'map',to:'valid'},{from:'valid',to:'db',branch:'true'},{from:'valid',to:'review',branch:'false'},{from:'db',to:'report'}]});
  const activeTab=()=>page==='Upload / Intake'?'Intake':page==='OCR Queue'?'Queue':page==='Validated Records'?'Records':page==='Reports'?'Reports':page==='Exceptions'?'Exceptions':'Automation';
  function render(){mount.innerHTML=genericShell({brand:'SPX Operations Console',tabs:['Intake','Queue','Records','Reports','Exceptions','Automation'],activeTab:activeTab(),sideTitle:'Document operations',sideItems:['Upload / Intake','OCR Queue','Validated Records','Reports','Exceptions','Automation Workflow','System Health'],activeSide:page,content:`<div class="toolbar ocr-toolbar"><div><span class="ocr-eyebrow">Document intelligence</span><h2>${page}</h2></div><button class="ui-btn n8n-launch" id="ocrN8n">Open n8n workflow ↗</button></div><div id="ocrPage"></div>`});document.querySelectorAll('[data-side-item]').forEach(b=>b.onclick=()=>{page=b.dataset.sideItem;render()});document.querySelectorAll('[data-top-tab]').forEach(b=>b.onclick=()=>{const map={Intake:'Upload / Intake',Queue:'OCR Queue',Records:'Validated Records',Reports:'Reports',Exceptions:'Exceptions',Automation:'Automation Workflow'};page=map[b.dataset.topTab]||page;render()});document.getElementById('ocrN8n').onclick=renderOcrN8n;draw()}
  async function runSample(source='UI upload',filename='spx_collection_28jan.jpg'){processing=true;const status=document.getElementById('ocrResult');if(status)status.innerHTML=`<div class="ocr-processing"><i></i><div><h3>Processing ${escapeHtml(filename)}</h3><p>Validating file → preserving original → running OCR → mapping fields</p></div></div>`;try{const result=await runN8n('file.intake',{source,fileName:filename,confidence:.96,seller:'OKONZ',route:'CO',driver:'Att Prince',orders:40,pickupOrders:37},'OCR intake completed');records.unshift(['2026-01-28','OKONZ','CO','Att Prince','40','37','3','Validated']);if(status)status.innerHTML=`<div class="ocr-result-head"><div><span class="tag good">Validated · 96% confidence</span><h3>Collection record created</h3><p>${escapeHtml(source)} · ${escapeHtml(filename)}</p></div><button class="ui-btn" id="viewCreatedRecord">View record</button></div><div class="ocr-field-grid"><div><small>Seller</small><b>OKONZ</b></div><div><small>Route</small><b>CO</b></div><div><small>Driver</small><b>Att Prince</b></div><div><small>Orders</small><b>40</b></div><div><small>Pickup orders</small><b>37</b></div><div><small>Discrepancy</small><b>3</b></div></div><div class="ocr-run-proof"><span>Source preserved</span><span>Record upserted</span><span>Reports refreshed</span><span>Run ${escapeHtml(result.executionId||'OCR-260128-1042')}</span></div>`;const view=document.getElementById('viewCreatedRecord');if(view)view.onclick=()=>{page='Validated Records';render()};}catch(error){if(status)status.innerHTML=`<div class="ocr-empty-state"><span>!</span><div><h3>Processing stopped</h3><p>${escapeHtml(error.message)}</p></div></div>`;}finally{processing=false}}
  function draw(){const el=document.getElementById('ocrPage');
    if(page==='Upload / Intake'){el.innerHTML=`<div class="ocr-intake-grid"><section class="ocr-upload-card"><div class="ocr-source-pill">01 · Browser upload</div><div class="ocr-dropzone" id="ocrDropzone" tabindex="0" role="button" aria-label="Upload a source document"><input id="ocrFile" type="file" accept="image/png,image/jpeg,image/webp,image/tiff,application/pdf" hidden><div class="ocr-upload-icon">⇧</div><h3>Drag and drop a collection document</h3><p>Image or PDF · maximum 15 MB</p><button class="ui-btn primary" id="chooseOcrFile">Choose file</button></div></section><section class="ocr-drive-card"><div class="ocr-source-pill">02 · Google Drive</div><div class="ocr-drive-mark">G</div><h3>Process monitored folder</h3><p>Discover approved files, deduplicate them by Drive ID, and process the batch sequentially.</p><div class="ocr-folder"><span>SPX / 2026 / January / Intake</span><b>3 ready</b></div><button class="ui-btn" id="processDrive">Process Drive files</button></section></div><section class="panel ocr-extraction" id="ocrResult"><div class="ocr-empty-state"><span>OCR</span><div><h3>Extraction and validation result</h3><p>Select a file or run the Drive sample. Both sources enter the same n8n processing contract.</p></div></div></section>`;const input=document.getElementById('ocrFile'),drop=document.getElementById('ocrDropzone');document.getElementById('chooseOcrFile').onclick=()=>input.click();input.onchange=()=>{if(input.files[0])runSample('UI upload',input.files[0].name)};drop.ondragover=e=>{e.preventDefault();drop.classList.add('dragging')};drop.ondragleave=()=>drop.classList.remove('dragging');drop.ondrop=e=>{e.preventDefault();drop.classList.remove('dragging');const f=e.dataTransfer.files[0];if(f)runSample('UI drag-and-drop',f.name)};drop.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();input.click()}};document.getElementById('processDrive').onclick=()=>runSample('Google Drive','spx_collection_28jan.jpg')}
    if(page==='OCR Queue')el.innerHTML=`<div class="ocr-kpis"><article><small>Ready</small><strong>3</strong><span>Drive intake</span></article><article><small>Processing</small><strong>1</strong><span>UI upload</span></article><article><small>Validated today</small><strong>184</strong><span>records</span></article><article><small>Needs review</small><strong>3</strong><span>1.6% of intake</span></article></div><div class="panel"><table class="dbtable"><thead><tr><th>Received</th><th>Source document</th><th>Channel</th><th>Stage</th><th>Run ID</th></tr></thead><tbody><tr><td>10:42</td><td>spx_collection_28jan.jpg</td><td>UI upload</td><td><span class="tag warn">Mapping fields</span></td><td>OCR-260128-1042</td></tr><tr><td>10:38</td><td>route_co_batch_03.pdf</td><td>Google Drive</td><td><span class="tag good">Validated</span></td><td>OCR-260128-1038</td></tr><tr><td>10:31</td><td>seller_update_118.jpg</td><td>Google Drive</td><td><span class="tag">Stored</span></td><td>OCR-260128-1031</td></tr></tbody></table></div>`;
    if(page==='Validated Records')el.innerHTML=`<div class="ocr-filterbar"><div><button class="ui-btn">28 Jan 2026</button><button class="ui-btn">All routes</button><button class="ui-btn">All drivers</button></div><span>${records.length} synthetic records</span></div><div class="panel ocr-record-table"><table class="dbtable"><thead><tr><th>Date</th><th>Seller</th><th>Route</th><th>Driver</th><th>Orders</th><th>Pickup</th><th>Variance</th><th>Status</th></tr></thead><tbody>${records.map(r=>`<tr>${r.map((c,i)=>`<td>${i===7?`<span class="tag good">${c}</span>`:c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    if(page==='Reports')el.innerHTML=`<div class="ocr-report-head"><div><span class="ocr-eyebrow">Generated from approved records</span><h3>January operations report</h3><p>Filters apply to the underlying records—not copied daily worksheets.</p></div><div><button class="ui-btn">01–28 Jan 2026</button><button class="ui-btn primary" id="exportOcrReport">Export Excel</button></div></div><div class="ocr-report-kpis"><article><small>Total pickup orders</small><strong>109,842</strong><span>all routes</span></article><article><small>Scanned parcels</small><strong>108,731</strong><span>99.0% reconciled</span></article><article><small>Pickup variance</small><strong>1,111</strong><span>requires explanation</span></article><article><small>Calculated payout</small><strong>SGD 32,952.60</strong><span>at configured rate</span></article></div><div class="ocr-report-grid"><section class="panel"><h3>Parcel volume by route</h3><div class="ocr-bars"><div><span>CO</span><i><b style="width:92%"></b></i><strong>38,420</strong></div><div><span>TA</span><i><b style="width:78%"></b></i><strong>32,118</strong></div><div><span>PR</span><i><b style="width:93%"></b></i><strong>38,193</strong></div></div></section><section class="panel"><h3>Report outputs</h3><div class="ocr-report-list"><button data-report="Daily collection"><span>▦</span><b>Daily collection</b><small>Seller · route · driver · orders</small></button><button data-report="Driver attendance"><span>◷</span><b>Driver attendance</b><small>Time in/out · scanned parcels</small></button><button data-report="Payout and profit/loss"><span>↗</span><b>Payout &amp; profit/loss</b><small>Revenue · driver cost · variance</small></button></div></section></div><div class="panel ocr-report-table"><h3>Daily route summary</h3><table class="dbtable"><tr><th>Date</th><th>Route</th><th>Orders</th><th>Pickup</th><th>Scanned</th><th>Variance</th><th>Report status</th></tr><tr><td>28 Jan</td><td>CO</td><td>2,019</td><td>1,948</td><td>1,932</td><td>16</td><td><span class="tag good">Ready</span></td></tr><tr><td>28 Jan</td><td>TA</td><td>1,521</td><td>1,489</td><td>1,476</td><td>13</td><td><span class="tag good">Ready</span></td></tr><tr><td>28 Jan</td><td>PR</td><td>2,166</td><td>2,105</td><td>2,089</td><td>16</td><td><span class="tag warn">Review 2 rows</span></td></tr></table></div>`;document.getElementById('exportOcrReport').onclick=()=>toast('Synthetic Excel report generated from approved records');document.querySelectorAll('[data-report]').forEach(b=>b.onclick=()=>toast(`${b.dataset.report} report opened`));
    if(page==='Exceptions')el.innerHTML=`<div class="ocr-kpis compact"><article><small>Open</small><strong>3</strong><span>manual review</span></article><article><small>Low confidence</small><strong>2</strong><span>below 70%</span></article><article><small>Missing field</small><strong>1</strong><span>pickup orders</span></article></div><div class="panel"><table class="dbtable"><tr><th>Source file</th><th>Record</th><th>Validation reason</th><th>Confidence</th><th>Disposition</th></tr><tr><td>seller_0398.jpg</td><td>RED SUN / CO</td><td>Pickup order count ambiguous</td><td>61%</td><td><button class="ui-btn" onclick="toast('Review record opened with source image')">Review source</button></td></tr><tr><td>route_pr_012.jpg</td><td>PUP2024…</td><td>Driver name missing</td><td>83%</td><td><button class="ui-btn" onclick="toast('Review record opened with source image')">Complete fields</button></td></tr></table></div>`;
    if(page==='Automation Workflow')el.innerHTML=`<div class="automation-callout ocr-automation"><span class="n8n-mark">n8n</span><div><h3>One orchestration layer for intake, records, and reports</h3><p>UI upload / Google Drive → source preservation → OCR → field mapping → validation → database or review → report generation and audit.</p></div><button class="ui-btn n8n-launch" id="ocrN8nInline">Open workflow</button></div>`;
    if(page==='System Health')el.innerHTML=`<div class="ocr-kpis"><article><small>n8n</small><strong>Healthy</strong><span>last run 42 sec ago</span></article><article><small>Supabase</small><strong>Healthy</strong><span>records + storage</span></article><article><small>OCR pass rate</small><strong>98.4%</strong><span>approved without review</span></article><article><small>Report freshness</small><strong>10:42</strong><span>28 Jan dataset</span></article></div><div class="panel"><h3>Latest execution evidence</h3><div class="timeline"><div class="event"><time>10:42:14</time><strong>Source file preserved · UI upload</strong></div><div class="event"><time>10:42:16</time><strong>OCR complete · 96% confidence</strong></div><div class="event"><time>10:42:17</time><strong>Collection record upserted · duplicate check passed</strong></div><div class="event"><time>10:42:18</time><strong>Daily route report refreshed</strong></div></div></div>`;
    const inline=document.getElementById('ocrN8nInline');if(inline)inline.onclick=renderOcrN8n;
  }render();
}

/* -------------------------------------------------------------------------- */
/* ZOHO MIGRATION                                                              */
/* -------------------------------------------------------------------------- */
function migration() {
  let page = 'Migration Overview';
  const fieldMappings = [
    ['resume_filename', 'Source Resume Filename', 'Trace source row and match to stored resume file'],
    ['gdrive_link', 'Resume File Link', 'Preserve Google Drive evidence and recruiter access path'],
    ['first_name', 'First Name', 'Candidate identity'],
    ['last_name', 'Last Name', 'Candidate identity'],
    ['email', 'Email', 'Candidate email and contact field'],
    ['mobile', 'Mobile', 'Candidate mobile number'],
    ['secondary_email', 'Secondary Email', 'Secondary contact field'],
    ['company', 'Current / Previous Company', 'Employment context'],
    ['designation', 'Designation', 'Role title / experience context'],
    ['street', 'Street', 'Candidate address'],
    ['state', 'State', 'Candidate address'],
    ['zip', 'Zip Code', 'Candidate address'],
    ['facility-applied', 'Facility Lookup', 'Target facility relationship in Zoho'],
    ['confidence', 'Migration Confidence', 'Review gate for uncertain parsed data'],
    ['filename_date', 'Source File Date', 'Source timing and batch validation'],
    ['license', 'License', 'Credential / qualification field']
  ];
  root.innerHTML = `<div id="migrationMount"></div>`;
  const mount = document.getElementById('migrationMount');
  function render() {
    mount.innerHTML = genericShell({
      brand: 'Zoho Migration Control Center',
      tabs: ['Overview', 'Mappings', 'Batches', 'Functions', 'Reconciliation'],
      activeTab: page === 'Migration Overview' ? 'Overview' : page === 'Field Mapping' ? 'Mappings' : page === 'Import Batches' ? 'Batches' : page === 'Deluge Functions' ? 'Functions' : 'Reconciliation',
      sideTitle: 'Migration',
      sideItems: ['Migration Overview', 'Field Mapping', 'Import Batches', 'Deluge Functions', 'API Usage', 'Reconciliation'],
      activeSide: page,
      content: `<div class="toolbar"><h2>${page}</h2>${page === 'Import Batches' ? '<button class="ui-btn" id="runBatch">Run synthetic batch</button>' : ''}</div><div id="migrationPage"></div>`
    });
    document.querySelectorAll('[data-side-item]').forEach(b => b.onclick = () => {
      page = b.dataset.sideItem;
      render();
    });
    draw();
  }
  function draw() {
    const el = document.getElementById('migrationPage');
    if (page === 'Migration Overview') {
      el.innerHTML = `<div class="migration-grid"><div class="migr-card"><strong>120,000+</strong><span>overall source program</span></div><div class="migr-card"><strong>59,000+</strong><span>JazzHR scope</span></div><div class="migr-card"><strong>62,000+</strong><span>Apploi scope</span></div><div class="migr-card"><strong>99.1%</strong><span>demo reconciliation rate</span></div></div>`;
    }
    if (page === 'Field Mapping') {
      el.innerHTML = `<div class="panel"><h3>Resume migration field map</h3><p class="mapping-note">Source resume rows are mapped into Zoho candidate, contact, address, facility, evidence, and review fields before batch import.</p><div class="mapping migration-field-map">${fieldMappings.map(row => `<div><strong>${row[0]}</strong><small>Source column</small></div><div class="maparrow">-></div><div><strong>${row[1]}</strong><small>${row[2]}</small></div>`).join('')}</div></div>`;
    }
    if (page === 'Import Batches') {
      el.innerHTML = `<div class="panel" id="batchLog"><h3>Batch Progress</h3><div><small>Batch JHR-027</small><div class="progress"><i style="width:88%"></i></div></div><div style="margin-top:12px"><small>Batch APP-014</small><div class="progress"><i style="width:62%"></i></div></div></div>`;
      document.getElementById('runBatch').onclick = () => {
        document.getElementById('batchLog').innerHTML = '<h3>Synthetic batch JHR-028</h3><div class="timeline"><div class="event"><time>Step 1</time><strong>Source manifest locked · resume_filename + gdrive_link verified</strong></div><div class="event"><time>Step 2</time><strong>Parsed candidate fields reviewed · 37 confidence exceptions</strong></div><div class="event"><time>Step 3</time><strong>Facility lookup and license validation complete</strong></div><div class="event"><time>Step 4</time><strong>Controlled import complete · every source row received a disposition</strong></div></div>';
        toast('Batch complete · every source record received a disposition');
      };
    }
    if (page === 'Deluge Functions') {
      el.innerHTML = `<div class="panel"><h3>automation.FillRecruitmentLogs1</h3><pre class="code-box">validate record ID\nfetch live Lead\npreserve Recruitment_Logs subform rows\nappend new stage log\nupdate record with triggers suppressed\nrefetch + verify expected row count</pre><button class="ui-btn" onclick="toast('Synthetic Deluge execution · HTTP 200 Success')">Run test execution</button></div>`;
    }
    if (page === 'API Usage') {
      el.innerHTML = `<div class="panel"><h3>API Operations</h3><div class="timeline"><div class="event"><time>10:08</time><strong>Get Record by ID · 200</strong></div><div class="event"><time>10:08</time><strong>Search Records · 200</strong></div><div class="event"><time>10:09</time><strong>Update Record · 200</strong></div></div></div>`;
    }
    if (page === 'Reconciliation') {
      el.innerHTML = `<div class="panel"><table class="dbtable"><tr><th>Disposition</th><th>Count</th><th>Rule</th></tr><tr><td>Migrated</td><td>4,955</td><td>Accepted + verified</td></tr><tr><td>Exception</td><td>45</td><td>Low confidence, missing facility, or license review</td></tr></table></div>`;
    }
  }
  render();
}

/* -------------------------------------------------------------------------- */
/* SHEETS                                                                      */
/* -------------------------------------------------------------------------- */
function sheets() {
  const renderSheetsN8n=()=>renderN8nStudio({title:'Google Workspace Operations Orchestrator',subtitle:'Sheets Systems / n8n',onBack:sheets,note:'Apps Script handles workbook-local calculations and validation. n8n handles cross-system orchestration, scheduled reads, branching, audit writes, and calendar handoffs.',nodes:[
    {id:'schedule',type:'schedule',label:'Schedule Trigger',sub:'Every workday',x:60,y:255,desc:'Starts the operational synchronization on a controlled schedule.'},
    {id:'read',type:'sheets',label:'Read Control Sheet',sub:'Google Sheets',x:280,y:255,desc:'Reads rows marked Ready from the control workbook.',input:'Workbook + worksheet',output:'Ready rows'},
    {id:'validate',type:'code',label:'Validate Rows',sub:'Code',x:500,y:255,desc:'Normalizes row values and blocks incomplete records before downstream actions.'},
    {id:'switch',type:'switch',label:'Route Workflow Type',sub:'Switch',x:720,y:255,desc:'Routes Payroll, Attendance, Project, and Calendar rows to the correct workflow branch.'},
    {id:'pay',type:'code',label:'Payroll Rules',sub:'Code',x:950,y:80,desc:'Applies payroll-specific transformation rules before writing results.'},
    {id:'att',type:'code',label:'Attendance Rules',sub:'Code',x:950,y:205,desc:'Applies attendance and exception logic.'},
    {id:'gantt',type:'sheets',label:'Update Project Gantt',sub:'Google Sheets',x:950,y:330,desc:'Updates timeline/status values used by the project workbook.'},
    {id:'calendar',type:'calendar',label:'Sync Calendar Event',sub:'Google Calendar',x:950,y:455,desc:'Creates or updates approved schedule events.'},
    {id:'merge',type:'merge',label:'Merge Results',sub:'Merge',x:1180,y:255,desc:'Combines branch outputs into one standardized audit result.'},
    {id:'audit',type:'sheets',label:'Write Automation Log',sub:'Google Sheets',x:1395,y:255,desc:'Writes completion status and timestamps back to the operations log.'}
  ],links:[{from:'schedule',to:'read'},{from:'read',to:'validate'},{from:'validate',to:'switch'},{from:'switch',to:'pay'},{from:'switch',to:'att'},{from:'switch',to:'gantt'},{from:'switch',to:'calendar'},{from:'pay',to:'merge'},{from:'att',to:'merge'},{from:'gantt',to:'merge'},{from:'calendar',to:'merge'},{from:'merge',to:'audit'}]});
  root.innerHTML=genericShell({brand:'Google Workspace Automation',tabs:['Payroll','Attendance','Gantt','Calendar','Automation'],activeTab:'Payroll',sideTitle:'Workbook',sideItems:['Payroll System','Attendance','Project Gantt','Calendar Sync','Automation Workflow','Automation Log'],activeSide:'Payroll System',content:`<div class="toolbar"><h2 id="sheetTitle">Payroll Automation</h2><div><button class="ui-btn n8n-launch" id="sheetsN8n">Open n8n workflow ↗</button><button class="ui-btn green" id="sheetRun">Run Apps Script</button></div></div><div class="sheet" id="sheetView"></div><div class="sheet-tabs" id="sheetTabs"></div><div class="panel" id="sheetLog" style="margin-top:12px"><h3>Automation Log</h3><p>Protected formulas, validation rules, Apps Script, and n8n orchestration turn the spreadsheet into a lightweight operating system.</p></div>`});
  const tabs=['Payroll','Attendance','Gantt','Calendar'];const data={Payroll:[['Employee','Hours','Rate','Gross','Deductions','Net'],['A. Cruz','80','12.00','=B2*C2','96.00','=D2-E2'],['M. Santos','76','12.00','=B3*C3','82.00','=D3-E3'],['J. Reyes','80','13.50','=B4*C4','108.00','=D4-E4']],Attendance:[['Employee','Date','Time In','Time Out','Hours','Status'],['A. Cruz','Aug 31','08:02','17:01','=D2-C2','Present'],['M. Santos','Aug 31','08:17','17:05','=D3-C3','Late'],['J. Reyes','Aug 31','07:58','17:00','=D4-C4','Present']],Gantt:[['Task','Owner','Start','End','Progress','Dependency'],['Discovery','Danica','Sep 1','Sep 3','100%','—'],['Build','Danica','Sep 4','Sep 12','60%','Discovery'],['UAT','Client','Sep 13','Sep 16','0%','Build']],Calendar:[['Request','Owner','Preferred Slot','Calendar Event','Sync'],['Client review','Danica','Sep 3 10:00','=CREATE_EVENT()','Ready'],['UAT call','Client','Sep 15 14:00','=CREATE_EVENT()','Ready'],['Handover','Danica','Sep 18 09:00','=CREATE_EVENT()','Ready']]};
  const draw=t=>{document.getElementById('sheetTitle').textContent=t==='Payroll'?'Payroll Automation':t==='Attendance'?'Attendance Monitor':t==='Gantt'?'Project Gantt':'Calendar Scheduling';document.getElementById('sheetView').innerHTML=`<table>${data[t].map((r,i)=>`<tr>${r.map(c=>i===0?`<th>${c}</th>`:`<td class="${String(c).startsWith('=')?'formula':''}">${c}</td>`).join('')}</tr>`).join('')}</table>`;document.querySelectorAll('.sheet-tab').forEach(x=>x.classList.toggle('active',x.dataset.tab===t))};
  document.getElementById('sheetTabs').innerHTML=tabs.map(t=>`<button class="sheet-tab" data-tab="${t}">${t}</button>`).join('');document.querySelectorAll('.sheet-tab').forEach(b=>b.onclick=()=>draw(b.dataset.tab));draw('Payroll');document.getElementById('sheetRun').onclick=()=>{document.getElementById('sheetLog').innerHTML='<h3>Apps Script Execution</h3><div class="timeline"><div class="event"><time>10:01:02</time><strong>Input validation passed</strong></div><div class="event"><time>10:01:03</time><strong>Workbook calculations completed</strong></div><div class="event"><time>10:01:04</time><strong>n8n handoff queued for cross-system synchronization</strong></div></div>';toast('Apps Script automation completed')};document.getElementById('sheetsN8n').onclick=renderSheetsN8n;
  document.querySelectorAll('[data-top-tab]').forEach(b=>{if(b.dataset.topTab==='Automation')b.onclick=renderSheetsN8n});document.querySelectorAll('[data-side-item]').forEach(b=>{if(b.dataset.sideItem==='Automation Workflow')b.onclick=renderSheetsN8n});
}

/* -------------------------------------------------------------------------- */
/* CUSTOM OPS DASHBOARD                                                        */
/* -------------------------------------------------------------------------- */
function dashboard() {
  let page='Overview';root.innerHTML=`<div id="opsMount"></div>`;const mount=document.getElementById('opsMount');
  const renderOpsN8n=()=>renderN8nStudio({title:'Operations API + Escalation Workflow',subtitle:'Custom Operations Dashboard / n8n',onBack:dashboard,note:'The custom dashboard is the user-facing control surface. n8n receives validated REST payloads, persists operational records, branches critical work into escalation handling, and returns a clean response to the UI.',nodes:[
    {id:'webhook',type:'webhook',label:'Dashboard Webhook',sub:'POST /requests',x:60,y:255,desc:'Receives structured requests from the custom operations UI.',input:'JSON request payload',output:'Request item'},
    {id:'validate',type:'code',label:'Validate Payload',sub:'Code',x:285,y:255,desc:'Validates required fields, normalizes status/priority, and rejects malformed requests.'},
    {id:'upsert',type:'supabase',label:'Upsert Work Record',sub:'Supabase',x:510,y:255,desc:'Persists the business action before depending on downstream notifications.',output:'Stored work item + id'},
    {id:'critical',type:'if',label:'Critical Priority?',sub:'If',x:735,y:255,desc:'Separates routine work from items that require an escalation path.'},
    {id:'escalate',type:'code',label:'Build Escalation',sub:'Code',x:965,y:125,desc:'Creates an escalation payload with ownership and correlation metadata.'},
    {id:'notify',type:'email',label:'Notify Owner',sub:'Email / Messaging',x:1190,y:125,desc:'Notifies the responsible operator for high-priority work.'},
    {id:'normal',type:'code',label:'Standard Route',sub:'Code',x:965,y:385,desc:'Applies normal routing and SLA values for routine requests.'},
    {id:'merge',type:'merge',label:'Merge Result',sub:'Merge',x:1390,y:255,desc:'Normalizes both branches before returning a response.'},
    {id:'respond',type:'respond',label:'Respond to Webhook',sub:'200 / 201',x:1595,y:255,desc:'Returns a business-friendly result to the custom dashboard.'}
  ],links:[{from:'webhook',to:'validate'},{from:'validate',to:'upsert'},{from:'upsert',to:'critical'},{from:'critical',to:'escalate',branch:'true'},{from:'escalate',to:'notify'},{from:'notify',to:'merge'},{from:'critical',to:'normal',branch:'false'},{from:'normal',to:'merge'},{from:'merge',to:'respond'}]});
  function render(){mount.innerHTML=genericShell({brand:'Operations Control Center',tabs:['Overview','Work Queue','Requests','API Activity','Automation'],activeTab:page,sideTitle:'Operations',sideItems:['Overview','Open Work','Requests','Escalations','API Activity','Automation Workflow','Settings'],activeSide:page==='Work Queue'?'Open Work':page,content:`<div class="toolbar"><h2>${page}</h2><div>${page==='Overview'||page==='Requests'?'<button class="ui-btn primary" id="newRequest">+ New request</button>':''}<button class="ui-btn n8n-launch" id="opsN8n">Open n8n workflow ↗</button></div></div><div id="opsPage"></div>`});document.querySelectorAll('[data-side-item]').forEach(b=>b.onclick=()=>{if(b.dataset.sideItem==='Automation Workflow'){renderOpsN8n();return}page=b.dataset.sideItem==='Open Work'?'Work Queue':b.dataset.sideItem;render()});document.querySelectorAll('[data-top-tab]').forEach(b=>b.onclick=()=>{if(b.dataset.topTab==='Automation'){renderOpsN8n();return}page=b.dataset.topTab;render()});document.getElementById('opsN8n').onclick=renderOpsN8n;draw()}
  function draw(){const el=document.getElementById('opsPage');if(page==='Overview')el.innerHTML=`<div class="dashgrid"><div class="dashcard"><strong>42</strong><span>open items</span></div><div class="dashcard"><strong>11</strong><span>due today</span></div><div class="dashcard"><strong>4</strong><span>needs attention</span></div><div class="dashcard"><strong>98.7%</strong><span>successful API actions</span></div></div><div class="automation-callout"><span class="n8n-mark">n8n</span><div><h3>API orchestration layer</h3><p>The custom interface submits structured REST payloads while n8n handles validation, persistence, escalation branching, and downstream notifications.</p></div><button class="ui-btn n8n-launch" id="opsN8nInline">Inspect workflow</button></div>`;if(page==='Work Queue'||page==='Requests')el.innerHTML=`<div class="board"><table><thead><tr><th>Request</th><th>Owner</th><th>Status</th><th>Priority</th></tr></thead><tbody><tr><td>Update client routing</td><td>Ops</td><td><span class="statuspill st-blue">Working</span></td><td>High</td></tr><tr><td>Validate onboarding payload</td><td>Admin</td><td><span class="statuspill st-yellow">Waiting</span></td><td>Medium</td></tr><tr><td>Resolve failed sync</td><td>Automation</td><td><span class="statuspill st-red">Stuck</span></td><td>Critical</td></tr></tbody></table></div>`;if(page==='Escalations')el.innerHTML=`<div class="panel"><table class="dbtable"><tr><th>Issue</th><th>Owner</th><th>Age</th><th>Status</th></tr><tr><td>Failed CRM sync</td><td>Automation</td><td>48m</td><td><span class="tag bad">Open</span></td></tr></table></div>`;if(page==='API Activity')el.innerHTML=`<div class="panel"><h3>API Activity</h3><div class="timeline"><div class="event"><time>10:31</time><strong>POST /requests · 201</strong></div><div class="event"><time>10:29</time><strong>PATCH /records/184 · 200</strong></div><div class="event"><time>10:27</time><strong>n8n notification route · success</strong></div></div></div>`;if(page==='Settings')el.innerHTML=`<div class="panel"><h3>Settings</h3><div class="kv"><dt>API Base</dt><dd>Configured</dd><dt>Database</dt><dd>Supabase</dd><dt>Workflow engine</dt><dd>n8n</dd></div></div>`;if(document.getElementById('newRequest'))document.getElementById('newRequest').onclick=()=>{modal(`<div class="modal-head"><div><small>Operations</small><h2>New request</h2></div><button data-close-modal>×</button></div><form class="modal-form" id="opsRequestForm"><label>Request<input value="Validate new client routing"></label><label>Priority<select><option>High</option><option>Medium</option></select></label><div class="modal-actions"><button type="button" data-close-modal>Cancel</button><button class="primary">Create</button></div></form>`).querySelector('#opsRequestForm').onsubmit=e=>{e.preventDefault();document.querySelector('.interactive-modal').remove();toast('REST endpoint accepted · n8n route queued · record committed')}};const inline=document.getElementById('opsN8nInline');if(inline)inline.onclick=renderOpsN8n}render();
}


function sheetsV2() {
  const rows = {
    Payroll: [['EMP-104','A. Cruz','80.0','$12.00','$864.00','Ready'],['EMP-118','M. Santos','76.0','$12.00','$830.00','Review'],['EMP-127','J. Reyes','80.0','$13.50','$972.00','Ready']],
    Attendance: [['Sep 01','A. Cruz','08:02','17:01','8.0h','Present'],['Sep 01','M. Santos','08:17','17:05','7.8h','Late'],['Sep 01','J. Reyes','07:58','17:00','8.0h','Present']],
    Projects: [['PRJ-021','CRM migration','Sep 01','Sep 18','64%','On track'],['PRJ-024','OCR rollout','Sep 04','Sep 26','41%','At risk'],['PRJ-029','Payroll controls','Sep 11','Sep 21','18%','Planned']],
    Calendar: [['EVT-044','Client review','Sep 03 · 10:00','Danica','Google Calendar','Synced'],['EVT-047','UAT session','Sep 15 · 14:00','Client','Google Calendar','Queued'],['EVT-051','Handover','Sep 18 · 09:00','Danica','Google Calendar','Draft']]
  };
  const headers = {Payroll:['ID','Employee','Hours','Rate','Net pay','State'],Attendance:['Date','Employee','Time in','Time out','Hours','State'],Projects:['Project','Name','Start','End','Progress','Health'],Calendar:['ID','Event','Schedule','Owner','Target','State']};
  let tab = 'Payroll';
  root.innerHTML = `<div class="sheets-os"><header class="sheets-os__top"><div class="sheets-os__brand"><span class="sheets-os__glyph">S</span><div><strong>Ops Workbook</strong><small>Google Sheets automation layer</small></div></div><div class="sheets-os__status"><i></i> Apps Script healthy · n8n ${window.DCodeN8n.config('sheets').live?'connected':'synthetic'}</div><button class="sheets-icon-btn" id="sheetsConfigure" aria-label="Configure n8n">⚙</button></header><div class="sheets-os__body"><aside class="sheets-os__rail"><small>WORKFLOWS</small>${Object.keys(rows).map((name,i)=>`<button data-sheet-view="${name}" class="${i===0?'active':''}"><span>${['$','◷','▥','31'][i]}</span>${name}<em>${rows[name].length}</em></button>`).join('')}<small>OPERATIONS</small><button id="sheetsRun"><span>↻</span>Run queue<em>4</em></button><button id="sheetsWorkflow"><span>⌁</span>n8n map</button><button data-sheet-log><span>≡</span>Run history</button></aside><main class="sheets-os__main"><section class="sheets-os__hero"><div><small>LIVE CONTROL SHEET</small><h1 id="sheetsHeading">Payroll processing</h1><p>Validated rows become controlled workflow jobs while formulas remain protected.</p></div><button class="sheets-run" id="sheetsRunTop"><span>▶</span> Process ready rows</button></section><section class="sheets-os__metrics"><article><small>READY</small><strong>12</strong><span>rows queued</span></article><article><small>LAST RUN</small><strong>1m 42s</strong><span>all branches</span></article><article><small>QUALITY</small><strong>99.2%</strong><span>validation pass</span></article><article><small>SYNC</small><strong>Healthy</strong><span>Calendar + APIs</span></article></section><section class="sheets-grid-panel"><div class="sheets-grid-toolbar"><div><span class="sheets-file">Operations_Master.xlsx</span><span id="sheetsRange">Payroll!A1:F4</span></div><div><button>Filter</button><button>Columns</button><button>Export</button></div></div><div class="sheets-formula"><b>fx</b><span id="sheetsFormula">=ROUND((C2*D2)-E2,2)</span></div><div class="sheets-table-wrap"><table id="sheetsData"></table></div><footer><span id="sheetsTabLabel">Payroll</span><span>Protected formulas · editable input cells</span></footer></section><section class="sheets-os__bottom"><div><div class="sheets-section-head"><h2>Automation queue</h2><span>Live handoff</span></div><div id="sheetsQueue" class="sheets-queue"><article><i class="ready"></i><div><b>PAY-2026-09</b><span>Payroll · 12 rows</span></div><em>Ready</em></article><article><i class="running"></i><div><b>CAL-044</b><span>Calendar sync · 3 events</span></div><em>Running</em></article><article><i></i><div><b>ATT-0901</b><span>Attendance · 1 exception</span></div><em>Review</em></article></div></div><div class="sheets-runlog"><div class="sheets-section-head"><h2>Latest execution</h2><button id="sheetsWorkflowInline">View n8n</button></div><ol id="sheetsRunLog"><li><time>10:01:02</time><span>Workbook validation passed</span></li><li><time>10:01:03</time><span>Protected formulas recalculated</span></li><li><time>10:01:04</time><span>Cross-system handoff queued</span></li></ol></div></section></main></div></div>`;
  const table = document.getElementById('sheetsData');
  function draw(name){tab=name;document.querySelectorAll('[data-sheet-view]').forEach(b=>b.classList.toggle('active',b.dataset.sheetView===name));document.getElementById('sheetsHeading').textContent={Payroll:'Payroll processing',Attendance:'Attendance control',Projects:'Project planning',Calendar:'Calendar synchronization'}[name];document.getElementById('sheetsRange').textContent=`${name}!A1:F${rows[name].length+1}`;document.getElementById('sheetsTabLabel').textContent=name;document.getElementById('sheetsFormula').textContent=name==='Payroll'?'=ROUND((C2*D2)-E2,2)':name==='Attendance'?'=ROUND((D2-C2)*24,2)':name==='Projects'?'=SPARKLINE(E2,{"charttype","bar"})':'=SYNC_EVENT(B2,C2,D2)';table.innerHTML=`<thead><tr><th class="rownum"></th>${headers[name].map((h,i)=>`<th><span>${String.fromCharCode(65+i)}</span>${h}</th>`).join('')}</tr></thead><tbody>${rows[name].map((r,ri)=>`<tr><th class="rownum">${ri+2}</th>${r.map((c,ci)=>`<td class="${ci===r.length-1?'state':''}" contenteditable="${ci>0&&ci<4?'true':'false'}">${escapeHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody>`;}
  const run = async()=>{const button=document.getElementById('sheetsRunTop');button.disabled=true;button.innerHTML='<span>↻</span> Processing…';try{const result=await runN8n('workbook.process',{module:tab,rows:rows[tab]},`${tab} workflow completed`);document.getElementById('sheetsRunLog').innerHTML=`<li><time>Now</time><span>Payload validated</span></li><li><time>Now</time><span>${result.mode==='live'?'n8n execution accepted':'Synthetic branch completed'}</span></li><li><time>Now</time><span>Audit row written · ${escapeHtml(result.executionId||'queued')}</span></li>`;}finally{button.disabled=false;button.innerHTML='<span>▶</span> Process ready rows';}};
  document.querySelectorAll('[data-sheet-view]').forEach(b=>b.onclick=()=>draw(b.dataset.sheetView));document.getElementById('sheetsRun').onclick=run;document.getElementById('sheetsRunTop').onclick=run;document.getElementById('sheetsConfigure').onclick=()=>window.DCodeN8n.openSettings('sheets');
  const renderFlow=()=>renderN8nStudio({title:'Google Workspace Operations Orchestrator',subtitle:'Sheets Systems / n8n',onBack:sheetsV2,note:'Apps Script owns workbook-local validation and calculation. n8n accepts controlled jobs, routes each module, synchronizes external systems, and writes an audit result.',nodes:[{id:'hook',type:'webhook',label:'Workbook Webhook',sub:'POST /portfolio-sheets-automation',x:50,y:250},{id:'validate',type:'code',label:'Validate Job',sub:'Code',x:280,y:250},{id:'route',type:'switch',label:'Route Module',sub:'Switch',x:510,y:250},{id:'pay',type:'code',label:'Payroll Rules',sub:'Code',x:760,y:80},{id:'att',type:'code',label:'Attendance Rules',sub:'Code',x:760,y:200},{id:'project',type:'sheets',label:'Update Project Plan',sub:'Google Sheets',x:760,y:320},{id:'cal',type:'calendar',label:'Sync Calendar',sub:'Google Calendar',x:760,y:440},{id:'audit',type:'sheets',label:'Write Run Log',sub:'Google Sheets',x:1030,y:250},{id:'respond',type:'respond',label:'Return Result',sub:'JSON',x:1270,y:250}],links:[{from:'hook',to:'validate'},{from:'validate',to:'route'},{from:'route',to:'pay'},{from:'route',to:'att'},{from:'route',to:'project'},{from:'route',to:'cal'},{from:'pay',to:'audit'},{from:'att',to:'audit'},{from:'project',to:'audit'},{from:'cal',to:'audit'},{from:'audit',to:'respond'}]});
  document.getElementById('sheetsWorkflow').onclick=renderFlow;document.getElementById('sheetsWorkflowInline').onclick=renderFlow;draw(tab);
}

function dashboardV2() {
  let view='Command Center';
  const nav=['Command Center','Work Queue','Requests','Escalations','API Activity'];
  root.innerHTML=`<div class="ops-command"><aside class="ops-command__rail"><div class="ops-command__brand"><span>OC</span><div><b>OPERATIONS</b><small>CONTROL PLANE</small></div></div><nav>${nav.map((n,i)=>`<button data-ops-view="${n}" class="${i===0?'active':''}"><span>${['⌂','▤','＋','!','⌁'][i]}</span>${n}</button>`).join('')}</nav><div class="ops-command__rail-foot"><i></i><div><b>All systems nominal</b><small>Last checked 38s ago</small></div></div></aside><main class="ops-command__main"><header class="ops-command__top"><div><small>WORKSPACE / LIVE OPERATIONS</small><h1 id="opsTitle">Command Center</h1></div><div><span class="ops-live"><i></i>${window.DCodeN8n.config('ops-dashboard').live?'LIVE N8N':'SYNTHETIC'}</span><button class="ops-icon" id="opsSettings" aria-label="Configure n8n">⚙</button><button class="ops-create" id="opsCreate">Create request</button></div></header><div id="opsContent"></div></main></div>`;
  const content=document.getElementById('opsContent');
  const cards=`<section class="ops-signal-grid"><article><small>OPEN WORK</small><strong>42</strong><span><i class="up"></i> 8% this week</span></article><article><small>DUE TODAY</small><strong>11</strong><span>5 assigned</span></article><article><small>NEEDS ATTENTION</small><strong class="warm">04</strong><span>2 critical</span></article><article><small>AUTOMATION SLA</small><strong>98.7%</strong><span><i class="up"></i> within target</span></article></section>`;
  const activity=`<section class="ops-activity"><div class="ops-panel-head"><div><small>EVENT STREAM</small><h2>Automation activity</h2></div><button id="opsOpenFlow">Inspect workflow</button></div><div class="ops-stream"><article><time>10:31:42</time><span class="ok">201</span><div><b>Request persisted</b><small>POST /requests · REQ-2048</small></div><em>428 ms</em></article><article><time>10:29:17</time><span class="ok">200</span><div><b>Work record synchronized</b><small>PATCH /records/184 · owner updated</small></div><em>691 ms</em></article><article><time>10:27:04</time><span class="warn">202</span><div><b>Escalation branch queued</b><small>Critical priority · OPS-775</small></div><em>1.2 s</em></article><article><time>10:21:33</time><span class="ok">200</span><div><b>Notification delivered</b><small>Owner + operations channel</small></div><em>512 ms</em></article></div></section>`;
  function draw(){document.getElementById('opsTitle').textContent=view;document.querySelectorAll('[data-ops-view]').forEach(b=>b.classList.toggle('active',b.dataset.opsView===view));if(view==='Command Center')content.innerHTML=`${cards}<section class="ops-command-grid"><div class="ops-priority"><div class="ops-panel-head"><div><small>PRIORITY LANE</small><h2>Work requiring action</h2></div><button data-ops-view="Work Queue">View all</button></div><div class="ops-lanes"><article><span class="ops-severity critical">P0</span><div><b>Resolve failed CRM synchronization</b><small>Automation · 48 minutes open</small></div><em>Critical</em></article><article><span class="ops-severity high">P1</span><div><b>Validate onboarding payload</b><small>Client Operations · due 11:30</small></div><em>High</em></article><article><span class="ops-severity med">P2</span><div><b>Update client routing rules</b><small>Operations · due today</small></div><em>Medium</em></article></div></div><div class="ops-health"><div class="ops-panel-head"><div><small>WORKFLOW HEALTH</small><h2>Services</h2></div></div>${[['n8n','Operational','99.9%'],['Supabase','Operational','99.8%'],['REST API','Operational','99.9%'],['Notifications','Degraded','97.4%']].map((r,i)=>`<div><i class="${i===3?'warn':''}"></i><b>${r[0]}</b><span>${r[1]}</span><em>${r[2]}</em></div>`).join('')}</div></section>${activity}`;else if(view==='Work Queue'||view==='Requests')content.innerHTML=`<section class="ops-list-panel"><div class="ops-panel-head"><div><small>CONTROLLED RECORDS</small><h2>${view}</h2></div><div><button>Filter</button><button>Export</button></div></div><table><thead><tr><th>ID</th><th>Work item</th><th>Owner</th><th>Status</th><th>Priority</th><th>SLA</th></tr></thead><tbody><tr><td>REQ-2048</td><td>Update client routing</td><td>Operations</td><td><span class="ops-chip working">Working</span></td><td>High</td><td>2h 14m</td></tr><tr><td>REQ-2047</td><td>Validate onboarding payload</td><td>Admin</td><td><span class="ops-chip waiting">Waiting</span></td><td>Medium</td><td>5h 02m</td></tr><tr><td>OPS-775</td><td>Resolve failed synchronization</td><td>Automation</td><td><span class="ops-chip blocked">Blocked</span></td><td>Critical</td><td>48m</td></tr></tbody></table></section>`;else if(view==='Escalations')content.innerHTML=`${cards}<section class="ops-list-panel"><div class="ops-panel-head"><div><small>EXCEPTION CONTROL</small><h2>Open escalations</h2></div></div><table><thead><tr><th>Severity</th><th>Incident</th><th>Owner</th><th>Age</th><th>State</th></tr></thead><tbody><tr><td><span class="ops-severity critical">P0</span></td><td>Failed CRM synchronization</td><td>Automation</td><td>48m</td><td><span class="ops-chip blocked">Open</span></td></tr><tr><td><span class="ops-severity high">P1</span></td><td>Client routing mismatch</td><td>Operations</td><td>1h 12m</td><td><span class="ops-chip working">Investigating</span></td></tr></tbody></table></section>`;else content.innerHTML=activity;content.querySelectorAll('[data-ops-view]').forEach(b=>b.onclick=()=>{view=b.dataset.opsView;draw()});const open=document.getElementById('opsOpenFlow');if(open)open.onclick=renderFlow;}
  const create=()=>{const m=modal(`<div class="modal-head"><div><small>OPERATIONS INTAKE</small><h2>Create controlled request</h2></div><button data-close-modal aria-label="Close">×</button></div><form class="modal-form" id="opsLiveForm"><label>Request title<input name="title" required value="Validate new client routing"></label><label>Owner<input name="owner" required value="Operations"></label><label>Priority<select name="priority"><option>Critical</option><option selected>High</option><option>Medium</option><option>Low</option></select></label><label>Details<textarea name="details">Confirm that the new routing policy maps each client segment to an accountable owner.</textarea></label><div class="modal-actions"><button type="button" data-close-modal>Cancel</button><button class="primary" type="submit">Submit to workflow</button></div></form>`);m.querySelector('form').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.currentTarget);const submit=e.currentTarget.querySelector('[type=submit]');submit.disabled=true;submit.textContent='Submitting…';try{await runN8n('request.create',Object.fromEntries(f),'Request accepted');m.remove();}catch(_){submit.disabled=false;submit.textContent='Retry';}};};
  const renderFlow=()=>renderN8nStudio({title:'Operations Intake + Escalation Router',subtitle:'Custom Operations Dashboard / n8n',onBack:dashboardV2,note:'The command center submits a typed request envelope. n8n validates it, persists the record, applies priority/SLA rules, branches critical work, logs the execution, and returns a stable JSON response.',nodes:[{id:'hook',type:'webhook',label:'Operations Webhook',sub:'POST /portfolio-operations-api',x:50,y:250},{id:'validate',type:'code',label:'Validate Envelope',sub:'Code',x:280,y:250},{id:'persist',type:'supabase',label:'Persist Request',sub:'Supabase',x:510,y:250},{id:'critical',type:'if',label:'Critical?',sub:'If',x:740,y:250},{id:'escalate',type:'code',label:'Create Escalation',sub:'Code',x:980,y:110},{id:'route',type:'code',label:'Apply Standard SLA',sub:'Code',x:980,y:390},{id:'audit',type:'supabase',label:'Write Audit Event',sub:'Supabase',x:1220,y:250},{id:'respond',type:'respond',label:'Return JSON',sub:'201 / 200',x:1460,y:250}],links:[{from:'hook',to:'validate'},{from:'validate',to:'persist'},{from:'persist',to:'critical'},{from:'critical',to:'escalate',branch:'true'},{from:'critical',to:'route',branch:'false'},{from:'escalate',to:'audit'},{from:'route',to:'audit'},{from:'audit',to:'respond'}]});
  document.querySelectorAll('[data-ops-view]').forEach(b=>b.onclick=()=>{view=b.dataset.opsView;draw()});document.getElementById('opsCreate').onclick=create;document.getElementById('opsSettings').onclick=()=>window.DCodeN8n.openSettings('ops-dashboard');draw();
}

const renderers={recruitment:recruitmentV5,portal,monday,ocr,'zoho-migration':migration,sheets:sheetsV2,'ops-dashboard':dashboardV2};
(renderers[project.id]||recruitment)();
