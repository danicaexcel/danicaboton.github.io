(() => {
  const outer = document.getElementById('native');
  if (!outer) return;

  function fitCaseStudyPreview() {
    try {
      const frame = window.frameElement;
      if (!frame || !frame.classList.contains('case-live-preview')) return;
      const display = frame.parentElement;
      if (!display || !display.classList.contains('case-laptop-display')) return;
      const fit = () => {
        const rect = display.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const scale = Math.max(.35, Math.min(1, Math.min(rect.width / 1600, rect.height / 800)));
        frame.style.setProperty('width', (rect.width / scale) + 'px', 'important');
        frame.style.setProperty('height', (rect.height / scale) + 'px', 'important');
        frame.style.setProperty('transform', 'scale(' + scale + ')', 'important');
        frame.style.setProperty('transform-origin', 'top left', 'important');
        frame.style.setProperty('display', 'block', 'important');
        frame.style.setProperty('border', '0', 'important');
        display.style.setProperty('overflow', 'hidden', 'important');
      };
      fit();
      if ('ResizeObserver' in window) new ResizeObserver(fit).observe(display);
      else window.addEventListener('resize', fit);
    } catch (_) {}
  }

  function deepestDoc() {
    try {
      let doc = outer.contentDocument;
      if (!doc) return null;
      for (let i = 0; i < 18; i++) {
        const frame = doc.querySelector('iframe');
        if (!frame || !frame.contentDocument) break;
        doc = frame.contentDocument;
      }
      return doc;
    } catch (_) { return null; }
  }

  function ensureStyle(doc) {
    if (doc.getElementById('project02-clean-ui-style')) return;
    const style = doc.createElement('style');
    style.id = 'project02-clean-ui-style';
    style.textContent = `
      .dcode-chevron{display:inline-block!important;width:7px!important;height:7px!important;flex:0 0 7px!important;margin-left:7px!important;border-right:1.5px solid currentColor!important;border-bottom:1.5px solid currentColor!important;transform:rotate(45deg) translateY(-2px)!important;transform-origin:center!important;vertical-align:middle!important;color:#676879!important;background:transparent!important}
      .dcode-chevron-slot{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:19px!important;height:19px!important;margin-left:auto!important;color:#676879!important}
      .dcode-chevron-slot .dcode-chevron{margin:0!important}
      .title-row h1 .dcode-chevron{margin-left:10px!important;margin-bottom:3px!important}
      .group-title .dcode-chevron{width:6px!important;height:6px!important;margin:0 2px 3px 1px!important;color:#676879!important}
      .dcode-filter-icon{display:inline-block;width:12px;height:10px;margin-right:6px;position:relative;vertical-align:-1px}
      .dcode-filter-icon:before{content:"";position:absolute;left:1px;top:1px;width:10px;height:6px;border-top:1.5px solid currentColor;border-left:1.5px solid transparent;border-right:1.5px solid transparent;clip-path:polygon(0 0,100% 0,62% 55%,62% 100%,38% 100%,38% 55%)}
      .monday-dw-tools [title="Filter"].dcode-filter-only{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:24px!important;height:24px!important}.monday-dw-tools [title="Filter"].dcode-filter-only .dcode-filter-icon{margin:0!important}
      .native-working-table-widget{grid-column:auto!important;width:100%!important;min-width:0!important;min-height:214px!important;padding:0!important;overflow:hidden!important;border:1px solid #d0d4e4!important;border-radius:8px!important;background:#fff!important;box-shadow:none!important}
      .native-working-table-widget .panel-title,.native-working-table-widget>.monday-dw-head{display:none!important}
      .mwt-head{height:44px;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:0 12px 0 16px;border-bottom:1px solid #d0d4e4;background:#fff;color:#323338}
      .mwt-title{min-width:0;display:flex;align-items:baseline;gap:10px}.mwt-title strong{font-size:14px;font-weight:500;white-space:nowrap}.mwt-title span{font-size:10px;color:#8a8f9e;white-space:nowrap}
      .mwt-tools{display:flex;align-items:center;gap:8px}.mwt-filter{height:28px;display:inline-flex;align-items:center;border:1px solid #c3c7d5;border-radius:4px;background:#fff;color:#53576a;padding:0 9px;font:400 11px/1 Arial,sans-serif}.mwt-more{width:28px;height:28px;border:0;background:transparent;color:#53576a;font-size:17px;letter-spacing:1px}
      .mwt-scroll{width:100%;max-width:100%;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}.mwt-scroll::-webkit-scrollbar{display:none;width:0;height:0}
      .mwt-table{width:100%;min-width:100%;border-collapse:collapse;table-layout:fixed;background:#fff;color:#323338;font-size:10px}.mwt-table th{height:34px;padding:0 8px;text-align:left;background:#f6f7fb;color:#676879;font-weight:500;border-bottom:1px solid #d0d4e4;border-right:1px solid #e6e9ef;white-space:nowrap}.mwt-table td{height:45px;padding:0 8px;border-bottom:1px solid #e6e9ef;border-right:1px solid #eef0f4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;vertical-align:middle}.mwt-table tr:last-child td{border-bottom:0}.mwt-table th:last-child,.mwt-table td:last-child{border-right:0}
      .mwt-table th:nth-child(1),.mwt-table td:nth-child(1){width:27%}.mwt-table th:nth-child(2),.mwt-table td:nth-child(2){width:16%}.mwt-table th:nth-child(3),.mwt-table td:nth-child(3){width:14%}.mwt-table th:nth-child(4),.mwt-table td:nth-child(4){width:19%}.mwt-table th:nth-child(5),.mwt-table td:nth-child(5){width:13%}.mwt-table th:nth-child(6),.mwt-table td:nth-child(6){width:11%}
      .mwt-task{font-weight:500}.mwt-person{display:flex;align-items:center;gap:6px;min-width:0}.mwt-avatar{width:23px;height:23px;min-width:23px;border-radius:50%;display:grid;place-items:center;background:#cce5ff;color:#323338;font-size:8px;font-weight:600}.mwt-status{display:inline-flex;align-items:center;justify-content:center;min-width:68px;height:23px;border-radius:3px;padding:0 6px;font-size:9px;font-weight:500}.mwt-status.stuck{background:#e2445c;color:#fff}.mwt-status.progress{background:#fdab3d;color:#323338}.mwt-status.review{background:#579bfc;color:#fff}
      .native-quality-chart{padding:18px 18px 15px!important;background:#fff!important}.native-quality-chart .barrow{grid-template-columns:92px 1fr 48px!important;margin:18px 0!important}.native-quality-chart .bars{gap:0!important}.native-quality-chart .bar{height:22px!important;border-radius:2px!important;display:block!important}.native-quality-chart .bar.utilization{background:#bb3354!important}.native-quality-chart .bar.rework-rate{background:#4eccc6!important}.native-quality-chart .legend span:before{background:#bb3354!important}.native-quality-chart .legend span+span:before{background:#4eccc6!important}
      @media(max-width:1000px){.native-working-table-widget{grid-column:auto!important}.mwt-table{min-width:720px}.mwt-scroll{overflow-x:auto}}
      @media(max-width:720px){.mwt-title span{display:none}.mwt-table{min-width:720px}.mwt-filter{display:none}}
    `;
    doc.head.appendChild(style);
  }

  function stripN(doc) {
    if (!doc.body) return;
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (node.nodeValue && node.nodeValue.includes('[N]')) node.nodeValue = node.nodeValue.replace(/\[N\]\s*/g, '');
    });
  }

  function removeArrowText(el) {
    if (!el) return;
    [...el.childNodes].forEach(node => {
      if (node.nodeType === 3) node.nodeValue = node.nodeValue.replace(/[⌄▾▼▽]\s*/g, '').replace(/\s+[vV]\s*$/, '');
      else if (node.nodeType === 1 && !node.classList.contains('dcode-chevron')) removeArrowText(node);
    });
  }
  function addChevron(el) {
    if (!el || el.querySelector(':scope > .dcode-chevron')) return;
    const icon = el.ownerDocument.createElement('i');
    icon.className = 'dcode-chevron'; icon.setAttribute('aria-hidden','true'); el.appendChild(icon);
  }
  function polishDropdowns(doc) {
    const workspace = doc.querySelector('.workspace');
    if (workspace) {
      const last = workspace.lastElementChild;
      if (last && /[⌄▾▼▽vV]/.test(last.textContent.trim())) { last.className='dcode-chevron-slot'; last.innerHTML='<i class="dcode-chevron" aria-hidden="true"></i>'; }
    }
    const title = doc.querySelector('.title-row h1');
    if (title && /[⌄▾▼▽]/.test(title.textContent)) { removeArrowText(title); addChevron(title); }
    doc.querySelectorAll('.newbtn,.native-wl-select,.current-wl-select,.mwt-filter').forEach(el => { if (/[⌄▾▼▽]/.test(el.textContent)) { removeArrowText(el); addChevron(el); } });
    doc.querySelectorAll('.group-title').forEach(el => { const first=el.firstElementChild; if (first && /[⌄▾▼▽]/.test(first.textContent.trim())) first.innerHTML='<i class="dcode-chevron" aria-hidden="true"></i>'; });
    doc.querySelectorAll('.wl-filter').forEach(el => { if (/[⌄▾▼▽]/.test(el.textContent)) el.innerHTML='<i class="dcode-chevron" aria-hidden="true"></i>'; });
    doc.querySelectorAll('.tool').forEach(el => { if (/^\s*▽\s*Filter/i.test(el.textContent)) el.innerHTML='<i class="dcode-filter-icon" aria-hidden="true"></i>Filter'; });
    doc.querySelectorAll('.monday-dw-tools [title="Filter"]').forEach(el => { el.classList.add('dcode-filter-only'); el.innerHTML='<i class="dcode-filter-icon" aria-hidden="true"></i>'; });
  }

  function ensureWorkingTable(doc) {
    const cards = [...doc.querySelectorAll('section.card')].filter(card => /Working Now/i.test(card.textContent || ''));
    cards.sort((a,b)=>(a.textContent||'').length-(b.textContent||'').length);
    const widget = cards[0];
    if (!widget || widget.dataset.nativeWorkingTable === '5') return;
    widget.classList.add('native-working-table-widget'); widget.dataset.nativeWorkingTable='5';
    widget.innerHTML = `
      <div class="mwt-head"><div class="mwt-title"><strong>Working Now</strong><span>Table widget · active tasks</span></div><div class="mwt-tools"><button class="mwt-filter" type="button">In Progress<i class="dcode-chevron" aria-hidden="true"></i></button><button class="mwt-more" type="button" aria-label="Widget options">...</button></div></div>
      <div class="mwt-scroll"><table class="mwt-table"><thead><tr><th>Task</th><th>Person</th><th>Status</th><th>Project</th><th>Due date</th><th>Time tracked</th></tr></thead><tbody>
        <tr><td class="mwt-task">API Integration - Payment Gateway</td><td><span class="mwt-person"><span class="mwt-avatar">CM</span>Carlo Mendoza</span></td><td><span class="mwt-status stuck">Stuck</span></td><td>Mobile App v2 Launch</td><td>Aug 25, 2026</td><td>62 h</td></tr>
        <tr><td class="mwt-task">Backend API Documentation</td><td><span class="mwt-person"><span class="mwt-avatar">JR</span>John Reyes</span></td><td><span class="mwt-status progress">In Progress</span></td><td>Website Redesign 2026</td><td>Sep 5, 2026</td><td>10 h</td></tr>
        <tr><td class="mwt-task">User Acceptance Testing - Phase 1</td><td><span class="mwt-person"><span class="mwt-avatar">MS</span>Maria Santos</span></td><td><span class="mwt-status review">For Review</span></td><td>Mobile App v2 Launch</td><td>Sep 10, 2026</td><td>30 h</td></tr>
      </tbody></table></div>`;
  }

  function ensureQuality(doc) {
    const cards=[...doc.querySelectorAll('section.card')].filter(card=>/Effort Quality/i.test(card.textContent||''));
    cards.sort((a,b)=>(a.textContent||'').length-(b.textContent||'').length);
    const host=cards[0];
    if(!host||host.dataset.qualityClean==='1') return;
    host.dataset.qualityClean='1';
    host.innerHTML=`<div class="monday-dw-head"><span>Effort Quality — Utilization vs Rework</span><div class="monday-dw-tools"><span title="Filter" class="dcode-filter-only"><i class="dcode-filter-icon" aria-hidden="true"></i></span><span class="monday-dw-more">...</span></div></div><div class="chart native-quality-chart"><div class="barrow"><span>Utilization</span><div class="bars"><i class="bar utilization" style="width:72%"></i></div><b>72%</b></div><div class="barrow"><span>Rework rate</span><div class="bars"><i class="bar rework-rate" style="width:8%"></i></div><b>8%</b></div><div class="legend"><span>Utilization</span><span>Rework rate</span></div></div>`;
  }

  let applying=false;
  function apply(){
    if(applying) return false;
    const doc=deepestDoc(); if(!doc||!doc.body) return false;
    applying=true;
    try { ensureStyle(doc); ensureWorkingTable(doc); ensureQuality(doc); stripN(doc); polishDropdowns(doc); }
    finally { applying=false; }
    return true;
  }

  function start(){
    fitCaseStudyPreview(); let tries=0;
    const timer=setInterval(()=>{ tries++; if(apply()||tries>240) clearInterval(timer); },100);
    const watch=setInterval(()=>{
      const doc=deepestDoc(), screen=doc&&doc.getElementById('screen');
      if(screen&&!screen.dataset.project02CleanObserved){
        screen.dataset.project02CleanObserved='1';
        new MutationObserver(()=>requestAnimationFrame(apply)).observe(screen,{childList:true,subtree:true,characterData:true});
        clearInterval(watch);
      }
    },150);
    setTimeout(()=>clearInterval(watch),30000);
  }
  outer.addEventListener('load',start); start();
})();
