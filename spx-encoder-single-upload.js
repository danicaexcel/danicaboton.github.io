(function(){
  if(new URLSearchParams(location.search).get('id')!=='ocr') return;

  const state={mode:'New',file:null,dataUrl:'',processed:0,taskId:'PUP2025091805FWW'};
  const existingTasks=[
    ['PUP2025091805FWW','Toppingskids · picked up'],
    ['PUP2025091804QAA','Northpoint Seller · pending'],
    ['PUP2025091803LKM','Tampines Hub · on-hold']
  ];

  const style=document.createElement('style');
  style.id='spx-encoder-single-upload-style';
  style.textContent=`
    .spx-phone.spx-single-mode>.spx-phone-head,.spx-phone.spx-single-mode>.spx-phone-card{display:none!important}
    .spx-single-upload{margin-bottom:12px;border:1px dashed #52677d;border-radius:10px;background:#15202c;padding:12px}
    .spx-single-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:10px}
    .spx-single-head strong{display:block;font-size:10px;color:#fff;margin-bottom:3px}.spx-single-head span{font-size:7px;color:var(--spx-muted);line-height:1.45}
    .spx-single-badge{flex:0 0 auto;padding:4px 6px;border-radius:999px;background:rgba(85,214,194,.12);color:var(--spx-accent2)!important;font-weight:800}
    .spx-step{margin-top:10px}.spx-step-label{display:flex;align-items:center;gap:6px;margin-bottom:7px;color:#dfe8f1;font-size:8px;font-weight:800}.spx-step-label b{width:18px;height:18px;border-radius:50%;display:grid;place-items:center;background:#223247;color:var(--spx-accent);font-size:7px}
    .spx-mode-switch{display:grid;grid-template-columns:1fr 1fr;gap:7px}.spx-mode-btn{border:1px solid #3a4c5e;border-radius:8px;background:#111a24;color:#9fb0c1;padding:9px 8px;font-size:8px;font-weight:900;cursor:pointer;text-align:center}.spx-mode-btn.active{border-color:var(--spx-accent);background:rgba(255,159,67,.12);color:var(--spx-accent)}
    .spx-existing-wrap{margin-top:8px}.spx-existing-wrap label{display:block;color:#8fa1b4;font-size:7px;margin-bottom:5px}.spx-existing-select{width:100%;border:1px solid #3a4c5e;border-radius:7px;background:#111a24;color:#e6edf5;padding:8px;font-size:8px}
    .spx-single-drop{min-height:86px;border:1px solid #34475a;border-radius:8px;background:#111a24;display:grid;place-items:center;text-align:center;padding:12px;cursor:pointer;transition:.16s ease}.spx-single-drop.drag{border-color:var(--spx-accent);background:#1b2937}.spx-single-drop:hover{border-color:#657b91}.spx-single-drop b{display:block;font-size:9px;color:#e9f0f7}.spx-single-drop span{display:block;margin-top:4px;font-size:7px;color:#8192a6}.spx-single-icon{font-size:20px;line-height:1;margin-bottom:6px;color:var(--spx-accent)}
    .spx-single-actions{display:flex;gap:6px;margin-top:9px;flex-wrap:wrap}.spx-single-actions button{border:1px solid var(--spx-line);background:#172331;color:#dbe5ef;border-radius:7px;padding:7px 9px;font-size:8px;font-weight:700;cursor:pointer}.spx-single-actions button.primary{background:var(--spx-accent);border-color:var(--spx-accent);color:#111820}
    .spx-single-preview{display:none;margin-top:10px;border:1px solid #34475a;border-radius:8px;overflow:hidden;background:#0e1620}.spx-single-preview.show{display:block}.spx-single-preview img{display:block;width:100%;max-height:250px;object-fit:contain;background:#0b121a}.spx-single-meta{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 9px;border-top:1px solid #2b3b4b}.spx-single-meta b{font-size:8px;color:#e7eef6;max-width:68%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.spx-single-meta span{font-size:7px;color:var(--spx-muted)}
    .spx-single-summary{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:9px}.spx-single-summary span{padding:7px 8px;border:1px solid #34475a;border-radius:7px;background:#172331;color:#8192a6;font-size:7px}.spx-single-summary b{display:block;color:#e8eef5;font-size:10px;margin-bottom:2px}
    .spx-single-note{margin-top:8px;font-size:7px;line-height:1.45;color:#8192a6}.spx-single-note b{color:#aebac8}
    .spx-single-top-select{min-width:230px;max-width:330px}
  `;
  if(!document.getElementById(style.id)) document.head.appendChild(style);

  function esc(value){return String(value??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function formatBytes(bytes){if(!bytes)return '0 KB';const kb=bytes/1024;return kb<1024?`${kb.toFixed(kb<100?1:0)} KB`:`${(kb/1024).toFixed(1)} MB`;}
  function toast(message){const el=document.getElementById('toast');if(!el)return;el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2500);}

  function markup(){
    const update=state.mode==='Update';
    const taskOptions=existingTasks.map(([id,label])=>`<option value="${id}" ${state.taskId===id?'selected':''}>${id} · ${esc(label)}</option>`).join('');
    return `<div class="spx-single-head"><div><strong>Admin screenshot intake</strong><span>Select whether this screenshot creates a new task or updates an existing task, then upload one screenshot for processing.</span></div><span class="spx-single-badge">SINGLE IMAGE INPUT</span></div>
      <div class="spx-step"><div class="spx-step-label"><b>1</b>Select task action</div><div class="spx-mode-switch"><button type="button" class="spx-mode-btn ${!update?'active':''}" data-mode="New">NEW TASK</button><button type="button" class="spx-mode-btn ${update?'active':''}" data-mode="Update">TASK UPDATE</button></div>${update?`<div class="spx-existing-wrap"><label>Existing task to update</label><select class="spx-existing-select">${taskOptions}</select></div>`:''}</div>
      <div class="spx-step"><div class="spx-step-label"><b>2</b>Upload screenshot</div><label class="spx-single-drop"><div><div class="spx-single-icon">⇧</div><b>${state.file?'Replace screenshot':'Drop screenshot here or browse'}</b><span>One PNG · JPG · WEBP screenshot at a time</span></div><input class="spx-single-file" type="file" accept="image/*" hidden></label><div class="spx-single-actions"><button type="button" class="primary spx-single-browse">${state.file?'Replace screenshot':'Choose screenshot'}</button>${state.file?'<button type="button" class="spx-single-remove">Remove</button>':''}</div></div>
      <div class="spx-single-preview ${state.dataUrl?'show':''}">${state.dataUrl?`<img src="${state.dataUrl}" alt="Selected SPX screenshot preview"><div class="spx-single-meta"><b>${esc(state.file.name)}</b><span>${update?'Task update':'New task'} · ${formatBytes(state.file.size)}</span></div>`:''}</div>
      <div class="spx-single-summary"><span><b>${update?'TASK UPDATE':'NEW TASK'}</b>selected action</span><span><b>${state.processed}</b>processed this session</span></div>
      <div class="spx-single-note"><b>New task:</b> validates the screenshot and stages a new Daily Log record. <b>Task update:</b> applies the extracted values to the selected existing task after validation.</div>
      <div class="spx-single-note"><b>Portfolio reconstruction:</b> the selected image stays in this browser. OCR values shown by the demo remain synthetic.</div>`;
  }

  function render(force=false){
    const encoder=document.querySelector('.spx-encoder');
    const phone=encoder?.querySelector('.spx-phone');
    if(!encoder||!phone)return false;
    phone.classList.add('spx-single-mode');
    let panel=phone.querySelector('.spx-single-upload');
    if(!panel){panel=document.createElement('div');panel.className='spx-single-upload';phone.prepend(panel);force=true;}
    const sig=[state.mode,state.taskId,state.file?.name||'',state.file?.size||0,state.processed].join('|');
    if(force||panel.dataset.sig!==sig){panel.dataset.sig=sig;panel.innerHTML=markup();wire(panel);}
    mountTopSelect();
    setPendingState();
    bindProcess();
    return true;
  }

  function wire(panel){
    const input=panel.querySelector('.spx-single-file');
    const drop=panel.querySelector('.spx-single-drop');
    panel.querySelectorAll('.spx-mode-btn').forEach(btn=>btn.onclick=()=>{state.mode=btn.dataset.mode==='Update'?'Update':'New';render(true);});
    panel.querySelector('.spx-existing-select')?.addEventListener('change',e=>{state.taskId=e.target.value;render(true);});
    panel.querySelector('.spx-single-browse')?.addEventListener('click',e=>{e.preventDefault();input?.click();});
    panel.querySelector('.spx-single-remove')?.addEventListener('click',()=>{state.file=null;state.dataUrl='';render(true);});
    input?.addEventListener('change',()=>loadFile(input.files?.[0]));
    ['dragenter','dragover'].forEach(type=>drop?.addEventListener(type,e=>{e.preventDefault();drop.classList.add('drag');}));
    ['dragleave','drop'].forEach(type=>drop?.addEventListener(type,e=>{e.preventDefault();drop.classList.remove('drag');}));
    drop?.addEventListener('drop',e=>loadFile(e.dataTransfer?.files?.[0]));
  }

  function loadFile(file){
    if(!file||!file.type?.startsWith('image/')){toast('Choose one image screenshot.');return;}
    const reader=new FileReader();
    reader.onload=()=>{state.file=file;state.dataUrl=String(reader.result||'');render(true);toast(`${file.name} ready as ${state.mode==='Update'?'a task update':'a new task'}.`);};
    reader.readAsDataURL(file);
  }

  function mountTopSelect(){
    const sample=document.getElementById('sampleSelect');
    if(!sample)return;
    sample.style.display='none';sample.disabled=true;
    const parent=sample.parentElement;if(!parent)return;
    let select=parent.querySelector('.spx-single-top-select');
    if(!select){select=document.createElement('select');select.className='spx-select spx-single-top-select';parent.appendChild(select);}
    select.innerHTML=state.mode==='Update'?`<option>TASK UPDATE · ${state.taskId}</option>`:'<option>NEW TASK · new Daily Log record</option>';
    select.disabled=true;
  }

  function setPendingState(){
    const cards=[...document.querySelectorAll('.spx-encoder .spx-kpis .spx-card')];
    if(cards.length<4)return;
    const set=(card,value,delta)=>{const strong=card.querySelector('strong'),small=card.querySelector('.delta');if(strong)strong.textContent=value;if(small)small.textContent=delta;};
    if(!state.file){set(cards[0],state.mode==='Update'?'TASK UPDATE':'NEW TASK','selected action');set(cards[1],'—','upload screenshot');set(cards[2],'WAITING','not processed');set(cards[3],state.mode==='Update'?'Daily Log · update':'Daily Log · new row','after validation');return;}
    set(cards[0],state.mode==='Update'?'TASK UPDATE':'NEW TASK','screenshot ready');set(cards[1],'—','OCR not run yet');set(cards[2],'READY','validation pending');set(cards[3],state.mode==='Update'?'Daily Log · update':'Daily Log · new row','after validation');
  }

  function bindProcess(){
    const button=document.getElementById('processSample');
    if(!button)return;
    button.dataset.singleUploadBound='1';
    button.disabled=!state.file;
    button.textContent=state.file?`Process ${state.mode==='Update'?'TASK UPDATE':'NEW TASK'}`:'Upload screenshot first';
    button.title=state.file?'Run OCR, validate, and stage the selected action':'Select New/Update and upload one screenshot first';
    button.onclick=e=>{
      e?.preventDefault?.();
      if(!state.file){toast('Upload one screenshot first.');return;}
      const cards=[...document.querySelectorAll('.spx-encoder .spx-kpis .spx-card')];
      const set=(card,value,delta)=>{const strong=card?.querySelector('strong'),small=card?.querySelector('.delta');if(strong)strong.textContent=value;if(small)small.textContent=delta;};
      set(cards[0],'TASK_INFO','classified screenshot');set(cards[1],'97%','synthetic validation');set(cards[2],'ACCEPTED','review gate passed');set(cards[3],state.mode==='Update'?`Update · ${state.taskId}`:'Daily Log · new row','staged after validation');
      state.processed+=1;
      const name=state.file.name;
      toast(state.mode==='Update'?`${name} staged as an update to ${state.taskId}.`:`${name} staged as a new Daily Log task.`);
      state.file=null;state.dataUrl='';
      setTimeout(()=>render(true),700);
    };
  }

  render(true);
  setInterval(()=>render(false),300);
})();