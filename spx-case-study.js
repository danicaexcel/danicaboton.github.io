(function(){
  const id=new URLSearchParams(location.search).get('id');
  if(id!=='ocr') return;
  location.replace('spx-case-study-v2.html?v=20260905-spx-modern1');
})();