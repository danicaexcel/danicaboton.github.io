(function(){
  const id=new URLSearchParams(location.search).get('id');
  if(id!=='ocr') return;
  location.replace('spx-case-study.html?v=20260903-spx-ops2');
})();