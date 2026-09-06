(function(){
  const state={name:'',size:0,dataUrl:'',loaded:false};
  const style=document.createElement('style');
  style.id='spx-encoder-upload-style-v2';
  style.textContent=`
    .spx-upload{margin-bottom:12px;border:1px dashed #52677d;border-radius:10px;background:#15202c;padding:12px;transition:.16s ease}
    .spx-upload.drag{border-color:var(--spx-accent);background:#1b2937}
    .spx-upload-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:9px}
    .spx-upload-head strong{display:block;font-size:10px;color:#fff;margin-bottom:3px}
    .spx-upload-head span{font-size:7px;color:var(--spx-muted);line-height:1.45}
    .spx-upload-badge{flex:0 0 auto;padding:4px 6px;border-radius:999px;background:rgba(85,214,194,.12);color:var(--spx-accent2)!important;font-weight:800}
    .spx-drop{min-height:96px;border:1px solid #34475a;border-radius:8px;background:#111a24;display:grid;place-items:center;text-align:center;padding:12px;cursor:pointer}
    .spx-drop:hover{border-color:#657b91}.spx-drop b{display:block;font-size:9px;color:#e9f0f7}.spx-drop span{display:block;margin-top:4px;font-size:7px;color:#8192a6}.spx-upload-icon{font-size:20px;line-height:1;margin-bottom:6px;color:var(--spx-accent)}
    .spx-upload-preview{display:none;margin-top:10px;border:1px solid #34475a;border-radius:8px;overflow:hidden;background:#0e1620}.spx-upload-preview.show{display:block}.spx-upload-preview img{display:block;width:100%;max-height:280px;object-fit:contain;background:#0b121a}
    .spx-upload-meta{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 9px;border-top:1px solid #2b3b4b}.spx-upload-meta b{font-size:8px;color:#e7eef6;max-width:70%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.spx-upload-meta span{font-size:7px;color:var(--spx-muted)}
    .spx-upload-actions{display:flex;gap:6px;margin-top:9px}.spx-upload-actions button{border:1px solid var(--spx-line);background:#172331;color:#dbe5ef;border-radius:7px;padding:7px 9px;font-size:8px;font-weight:700;cursor:pointer}.spx-upload-actions button.primary{background:var(--spx-accent);border-color:var(--spx-accent);color:#111820}
    .spx-upload-note{margin-top:8px;font-size:7px;line-height:1.45;color:#8192a6}.spx-upload-note b{color:#aebac8}
  `;
  if(!document.getElementById(style.id)) document.head.appendChild(style);

  function formatBytes(bytes){
    if(!bytes)return '0 KB';
    const kb=bytes/1024;
    return kb<1024?`${kb.toFixed(kb<100?1:0)} KB`:`${(kb/1024).toFixed(1)} MB`;
  }

  function toast(message){
    const el=document.getElementById('toast');
    if(!el)return;
    el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200);
  }

  function loadFile(file){
    if(!file||!file.type||!file.type.startsWith('image/')){toast('Choose an image screenshot (PNG, JPG, WEBP, etc.).');return;}
    const reader=new FileReader();
    reader.onload=()=>{state.name=file.name;state.size=file.size;state.dataUrl=String(reader.result||'');state.loaded=true;renderUpload(true)};
    reader.readAsDataURL(file);
  }

  function uploadMarkup(){
    return `
      <div class="spx-upload-head"><div><strong>Admin screenshot intake</strong><span>Upload the SPX mobile screenshot that should be encoded into the Daily Log.</span></div><span class="spx-upload-badge">IMAGE INPUT</span></div>
      <label class="spx-drop"><div><div class="spx-upload-icon">⇧</div><b>${state.loaded?'Replace screenshot':'Drop screenshot here or browse'}</b><span>PNG · JPG · WEBP · mobile screenshots</span></div><input class="spxScreenshotFile" type="file" accept="image/*" hidden></label>
      <div class="spx-upload-preview ${state.loaded?'show':''}">${state.loaded?`<img src="${state.dataUrl}" alt="Uploaded SPX screenshot preview"><div class="spx-upload-meta"><b>${state.name}</b><span>${formatBytes(state.size)}</span></div>`:''}</div>
      <div class="spx-upload-actions"><button type="button" class="primary spxBrowseUpload">${state.loaded?'Choose another image':'Choose screenshot'}</button>${state.loaded?'<button type="button" class="spxClearUpload">Remove</button>':''}</div>
      <div class="spx-upload-note"><b>Portfolio reconstruction:</b> the selected image stays in this browser preview. The extracted values shown here remain synthetic; no file is sent to a server.</div>`;
  }

  function wire(upload){
    const input=upload.querySelector('.spxScreenshotFile');
    const drop=upload.querySelector('.spx-drop');
    upload.querySelector('.spxBrowseUpload')?.addEventListener('click',e=>{e.preventDefault();input?.click()});
    upload.querySelector('.spxClearUpload')?.addEventListener('click',()=>{state.name='';state.size=0;state.dataUrl='';state.loaded=false;renderUpload(true)});
    input?.addEventListener('change',()=>loadFile(input.files&&input.files[0]));
    ['dragenter','dragover'].forEach(type=>drop?.addEventListener(type,e=>{e.preventDefault();upload.classList.add('drag')}));
    ['dragleave','drop'].forEach(type=>drop?.addEventListener(type,e=>{e.preventDefault();upload.classList.remove('drag')}));
    drop?.addEventListener('drop',e=>loadFile(e.dataTransfer?.files?.[0]));
  }

  function renderUpload(force){
    const encoder=document.querySelector('.spx-encoder');
    const phone=encoder?.querySelector('.spx-phone');
    if(!encoder||!phone) return false;
    let upload=phone.querySelector('.spx-upload');
    if(!upload){upload=document.createElement('div');upload.className='spx-upload';phone.prepend(upload);force=true;}
    const signature=`${state.loaded}|${state.name}|${state.size}`;
    if(force||upload.dataset.signature!==signature){upload.dataset.signature=signature;upload.innerHTML=uploadMarkup();wire(upload);}
    const process=document.getElementById('processSample');
    if(process){
      process.textContent=state.loaded?'Run OCR + validate + stage Daily Log':(process.textContent==='Processed'?'Processed':'Validate sample + write to log');
      process.title=state.loaded?'Simulated OCR/validation of the selected screenshot in this portfolio reconstruction':'';
    }
    return true;
  }

  renderUpload(false);
  setInterval(()=>renderUpload(false),250);
})();