(() => {
  const EMAIL = 'boton.danicamarie@gmail.com';
  const RETIRED_PROJECTS = new Set(['monday']);
  const HIDDEN_PROJECTS = new Set(['sheets','ops-dashboard']);

  function currentProjectId() {
    const queryId = new URLSearchParams(location.search).get('id');
    if (queryId) return queryId;
    if (/monday-project-ops-case-study\.html$/.test(location.pathname)) return 'monday-project-ops';
    if (/workspace-ops-case-study\.html$/.test(location.pathname)) return 'workspace-ops';
    if (/migration-case-study\.html$/.test(location.pathname)) return 'zoho-migration';
    if (/spx-case-study-v2\.html$/.test(location.pathname)) return 'ocr';
    return null;
  }

  function retireProjectData() {
    if (!Array.isArray(window.DCODE_PROJECTS)) return;
    for (let i = window.DCODE_PROJECTS.length - 1; i >= 0; i -= 1) {
      if (RETIRED_PROJECTS.has(window.DCODE_PROJECTS[i]?.id)) window.DCODE_PROJECTS.splice(i, 1);
    }
    const orderMap = {recruitment:'01','monday-project-ops':'02','workspace-ops':'03',portal:'04',ocr:'05','zoho-migration':'06',sheets:'07','ops-dashboard':'08'};
    window.DCODE_PROJECTS.forEach(project => { if (orderMap[project.id]) project.order = orderMap[project.id]; });
    window.DCODE_PROJECTS.sort((a, b) => Number(a.order || 99) - Number(b.order || 99));
  }

  function removeRetiredProjects() {
    const currentId = currentProjectId();
    if (RETIRED_PROJECTS.has(currentId) && !/index\.html$/.test(location.pathname)) { location.replace('index.html#work'); return; }
    if (!RETIRED_PROJECTS.size) return;
    const selector = [...RETIRED_PROJECTS].flatMap(id => [`.project[data-id="${id}"]`, `option[value="${id}"]`]).join(',');
    document.querySelectorAll(selector).forEach(element => element.remove());
  }

  function removeHiddenProjects() {
    if (!HIDDEN_PROJECTS.size) return;
    const selector = [...HIDDEN_PROJECTS].flatMap(id => [`.project[data-id="${id}"]`, `option[value="${id}"]`]).join(',');
    document.querySelectorAll(selector).forEach(element => element.remove());
  }

  function ensureDialog() {
    let dialog = document.getElementById('workflowContactDialog'); if (dialog) return dialog;
    const style = document.createElement('style');
    style.textContent = `.workflow-contact-dialog{width:min(520px,calc(100vw - 32px));padding:0;border:1px solid rgba(255,255,255,.13);border-radius:22px;background:#2e343a;color:#f5f7fa;box-shadow:18px 18px 42px rgba(10,13,17,.5),-8px -8px 24px rgba(77,87,98,.2)}.workflow-contact-dialog::backdrop{background:rgba(7,9,12,.72);backdrop-filter:blur(6px)}.workflow-contact-dialog__body{position:relative;padding:34px}.workflow-contact-dialog__eyebrow{display:block;margin-bottom:12px;color:#f5b36d;font:700 9px/1.3 "IBM Plex Mono",monospace;letter-spacing:.12em;text-transform:uppercase}.workflow-contact-dialog h2{margin:0 42px 12px 0;color:#fff;font:600 clamp(28px,6vw,42px)/1 "Bricolage Grotesque",sans-serif;letter-spacing:-.045em}.workflow-contact-dialog p{margin:0;color:#b9c1cb;font-size:14px;line-height:1.65}.workflow-contact-dialog__actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:26px}.workflow-contact-dialog__actions a,.workflow-contact-dialog__actions button,.workflow-contact-dialog__close{min-height:44px;border:1px solid #4b5662;border-radius:11px;background:#293038;color:#f5f7fa;padding:0 16px;font:700 11px/1 "IBM Plex Mono",monospace;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}.workflow-contact-dialog__actions .primary{border-color:#f5b36d;background:#f5b36d;color:#20252a}.workflow-contact-dialog__close{position:absolute;top:18px;right:18px;width:44px;padding:0;border-radius:50%;font-size:18px}@media(max-width:520px){.workflow-contact-dialog__body{padding:28px 22px}.workflow-contact-dialog__actions{display:grid}.workflow-contact-dialog__actions a,.workflow-contact-dialog__actions button{width:100%}}`;
    document.head.appendChild(style);
    dialog = document.createElement('dialog'); dialog.id='workflowContactDialog'; dialog.className='workflow-contact-dialog'; dialog.setAttribute('aria-labelledby','workflowContactTitle');
    dialog.innerHTML=`<div class="workflow-contact-dialog__body"><button class="workflow-contact-dialog__close" type="button" aria-label="Close workflow contact dialog">×</button><span class="workflow-contact-dialog__eyebrow">Private implementation review</span><h2 id="workflowContactTitle">Contact me to view the n8n workflow.</h2><p>The public portfolio protects workflow credentials and implementation details. I can walk you through the actual architecture, nodes, error handling, and execution evidence during an interview or private review.</p><div class="workflow-contact-dialog__actions"><a class="primary" href="mailto:${EMAIL}?subject=n8n%20workflow%20review">Email Danica</a><a href="index.html#contact">Go to contact section</a></div></div>`;
    document.body.appendChild(dialog); dialog.querySelector('.workflow-contact-dialog__close').addEventListener('click',()=>dialog.close()); dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();}); return dialog;
  }

  function isN8nAction(element){if(!element)return false;if(element.hasAttribute('data-workflow-contact'))return true;const label=[element.textContent,element.getAttribute('aria-label'),element.getAttribute('title')].filter(Boolean).join(' ');return /\bn8n\b/i.test(label);}
  function prepareWorkflowActions(root=document){root.querySelectorAll?.('a,button').forEach(action=>{if(!isN8nAction(action))return;action.setAttribute('data-workflow-contact','');const visibleLabel=action.textContent.trim();if(visibleLabel.length>2&&/(connect|open|view)\b/i.test(visibleLabel))action.textContent='View n8n workflow';});}
  function projectUsesN8n(project){return project?.stack?.some(item=>/\bn8n\b/i.test(item));}
  function addWorkflowButton(container){if(!container||container.querySelector('[data-workflow-contact]'))return;const button=document.createElement('button');button.className='btn';button.type='button';button.setAttribute('data-workflow-contact','');button.textContent='View n8n workflow';container.appendChild(button);}
  function enrichProjectActions(){if(!Array.isArray(window.DCODE_PROJECTS))return;document.querySelectorAll('.project').forEach((card,index)=>{const project=card.dataset.id?window.DCODE_PROJECTS.find(item=>item.id===card.dataset.id):window.DCODE_PROJECTS[index];if(projectUsesN8n(project))addWorkflowButton(card.querySelector('.projectactions'));});const caseProject=window.DCODE_PROJECTS.find(item=>item.id===currentProjectId());if(projectUsesN8n(caseProject)){addWorkflowButton(document.querySelector('.casehero .actions'));addWorkflowButton(document.querySelector('.demo-cta .actions'));}}
  function refreshRecruitmentAgentLinks(root=document){
    const selector='a[href*="recruitment-agent-platform"],[data-p01-agent-demo],#agentDemoLink';
    const targets=[];
    if(root.matches?.(selector))targets.push(root);
    root.querySelectorAll?.(selector).forEach(el=>targets.push(el));
    targets.forEach(el=>el.remove());
    document.querySelectorAll('.project[data-id="recruitment"] .p01-dual-demo-note').forEach(note=>note.remove());

    const card=document.querySelector('.project[data-id="recruitment"]');
    if(card){
      const status=card.querySelector('.projecttop .status');
      if(status&&/Two connected demos/i.test(status.textContent)) status.textContent='CRM demo · custom agent extension architecture';
    }

    if(currentProjectId()==='recruitment'&&/case-study\.html$/.test(location.pathname)){
      const sub=document.querySelector('.casehero .casesub');
      if(sub&&/two connected demos/i.test(sub.textContent)) sub.textContent='One recruitment architecture with the Zoho CRM recruiter operating system and a separate custom AI agent extension connected through APIs, webhooks, n8n orchestration, governed tools, approvals, and audit.';
      document.querySelectorAll('.casebar span').forEach(span=>{if(span.textContent.trim()==='Two connected demos')span.textContent='Custom agent extension';});
      const extHead=document.querySelector('#agent-extension .p01-agent-ext-head h2');
      if(extHead&&/second demo/i.test(extHead.textContent)) extHead.textContent='External agent action layer.';
      const cards=document.querySelectorAll('#agent-extension .p01-demo-card');
      if(cards[0]){const small=cards[0].querySelector('small');if(small&&/^Demo 01/i.test(small.textContent))small.textContent='Core system';}
      if(cards[1]){const small=cards[1].querySelector('small');if(small&&/^Demo 02/i.test(small.textContent))small.textContent='Agent extension architecture';}
    }
  }
  function keepPortalInLab(){document.querySelectorAll('a[href*="demo.html?id=portal"],iframe[src*="demo.html?id=portal"]').forEach(element=>{const attribute=element.tagName==='IFRAME'?'src':'href';element.setAttribute(attribute,'secure-candidate-review.html');});}
  function useDedicatedMigrationDemo(){document.querySelectorAll('a[href*="demo.html?id=zoho-migration"],iframe[src*="demo.html?id=zoho-migration"],iframe[src*="migration-demo-control.html"],a[href*="migration-demo-control.html"]').forEach(element=>{const attribute=element.tagName==='IFRAME'?'src':'href';const original=element.getAttribute(attribute)||'';const isEmbed=element.tagName==='IFRAME'||/[?&]embed=1(?:&|$)/.test(original);element.setAttribute(attribute,`migration-demo-control.html?${isEmbed?'embed=1&':''}v=20260905-crashfix2`);});}
  function loadSpxEnhancement(){const currentId=currentProjectId();let src='';if(document.querySelector('.project[data-id="ocr"]'))src='spx-index.js?v=20260905-spx-modern1';else if(currentId==='ocr'&&/case-study\.html$/.test(location.pathname))src='spx-case-study.js?v=20260905-spx-modern1';else if(currentId==='ocr'&&/demo\.html$/.test(location.pathname))src='spx-operations-demo.js?v=20260905-spx-modern1';if(!src||document.querySelector(`script[data-spx-enhancement="${src}"]`))return;const script=document.createElement('script');script.src=src;script.dataset.spxEnhancement=src;document.body.appendChild(script);}
  function loadWorkspaceOpsEnhancement(){const finish=()=>{retireProjectData();const currentId=currentProjectId();if(document.getElementById('projectCards')&&!document.querySelector('script[data-workspace-home]')){const home=document.createElement('script');home.src='workspace-ops-home.js?v=20260908-home-cleanup1';home.dataset.workspaceHome='1';document.body.appendChild(home);}const currentProject=window.DCODE_PROJECTS?.find(project=>project.id===currentId);if(currentProject){document.querySelectorAll('.casehero .kicker').forEach(el=>{el.textContent=el.textContent.replace(/^\d+\s*\//,`${currentProject.order} /`);});const option=document.querySelector(`option[value="${currentId}"]`);if(option)option.textContent=option.textContent.replace(/^\d+\s+/,`${currentProject.order} `);}removeRetiredProjects();removeHiddenProjects();refreshRecruitmentAgentLinks();};if(window.DCODE_PROJECTS?.some(p=>p.id==='workspace-ops')&&window.DCODE_PROJECTS?.some(p=>p.id==='monday-project-ops')){finish();return;}if(!window.DCODE_PROJECTS)return;const existing=document.querySelector('script[data-workspace-project]');if(existing){existing.addEventListener('load',finish,{once:true});return;}const projectScript=document.createElement('script');projectScript.src='workspace-ops-project.js?v=20260905-remove-legacy-monday1';projectScript.dataset.workspaceProject='1';projectScript.addEventListener('load',finish,{once:true});document.body.appendChild(projectScript);}

  retireProjectData();removeRetiredProjects();removeHiddenProjects();enrichProjectActions();keepPortalInLab();useDedicatedMigrationDemo();loadSpxEnhancement();loadWorkspaceOpsEnhancement();prepareWorkflowActions();refreshRecruitmentAgentLinks();
  new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType!==1)return;removeRetiredProjects();removeHiddenProjects();prepareWorkflowActions(node);refreshRecruitmentAgentLinks(node);keepPortalInLab();useDedicatedMigrationDemo();}))).observe(document.body,{childList:true,subtree:true});
  document.querySelectorAll('#openCase,#caseLink,a[href*="case-study.html"]').forEach(link=>link.setAttribute('target','_top'));
  document.addEventListener('click',event=>{const action=event.target.closest('a,button');if(!isN8nAction(action))return;event.preventDefault();event.stopImmediatePropagation();const dialog=ensureDialog();if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');},true);
})();

(() => {if(!/monday-project-ops-case-study\.html$/.test(location.pathname))return;if(document.querySelector('script[data-m09-case-erd]'))return;const script=document.createElement('script');script.src='monday-project-ops-case-study-erd.js?v=20260903-erd1';script.dataset.m09CaseErd='1';document.body.appendChild(script);})();
(() => {const id=new URLSearchParams(location.search).get('id');if(!/case-study\.html$/.test(location.pathname)||id!=='recruitment')return;if(document.querySelector('script[data-project01-role-model]'))return;const script=document.createElement('script');script.src='project01-role-model.js?v=20260908-hide-p01-agent-demo1';script.dataset.project01RoleModel='1';document.body.appendChild(script);})();
(() => {const id=new URLSearchParams(location.search).get('id');const needsMigrationUpgrade=document.querySelector('.project[data-id="zoho-migration"]')||(/case-study\.html$/.test(location.pathname)&&id==='zoho-migration');if(!needsMigrationUpgrade||document.querySelector('script[data-migration-project-upgrade]'))return;const script=document.createElement('script');script.src='migration-project-upgrade.js?v=20260905-drive-parallel1';script.dataset.migrationProjectUpgrade='1';document.body.appendChild(script);})();