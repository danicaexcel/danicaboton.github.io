(function(){
  if(new URLSearchParams(location.search).get('id')!=='ocr') return;
  ['openCase','caseLink'].forEach(id=>{const el=document.getElementById(id);if(el){el.href='spx-case-study.html?v=20260906-spx-single1';el.target='_top';}});
})();