(function(){
  const card=document.querySelector('.project[data-id="ocr"]');
  if(!card) return;
  const frame=card.querySelector('iframe.live-demo-preview');
  if(frame) frame.src='demo.html?id=ocr&embed=1&v=20260903-spx-ops1';
})();
