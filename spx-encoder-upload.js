(function(){
  const state={queue:[],selectedId:'',completed:0,seq:1};
  const style=document.createElement('style');
  style.id='spx-encoder-upload-style-v3';
  style.textContent=`
    .spx-upload{margin-bottom:12px;border:1px dashed #52677d;border-radius:10px;background:#15202c;padding:12px;transition:.16s ease}
    .spx-upload.drag{border-color:var(--spx-accent);background:#1b2937}
    .spx-upload-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:9px}
    .spx-upload-head strong{display:block;font-size:10px;color:#fff;margin-bottom:3px}.spx-upload-head span{font-size:7px;color:var(--spx-muted);line-height:1.45}
    .spx-upload-badge{flex:0 0 auto;padding:4px 6px;border-radius:999px;background:rgba(85,214,194,.12);color:var(--spx-accent2)!important;font-weight:800}
    .spx-drop{min-height:82px;border:1px solid #34475a;border-radius:8px;background:#111a24;display:grid;place-items:center;text-align:center;padding:12px;cursor:pointer}
    .spx-drop:hover{border-color:#657b91}.spx-drop b{display:block;font-size:9px;color:#e9f0f7}.spx-drop span{display:block;margin-top:4px;font-size:7px;color:#8192a6}.spx-upload-icon{font-size:20px;line-height:1;margin-bottom:6px;color:var(--spx-accent)}
    .spx-upload-actions{display:flex;gap:6px;margin-top:9px;flex-wrap:wrap}.spx-upload-actions button{border:1px solid var(--spx-line);background:#172331;color:#dbe5ef;border-radius:7px;padding:7px 9px;font-size:8px;font-weight:700;cursor:pointer}.spx-upload-actions button.primary{background:var(--spx-accent);border-color:var(--spx-accent);color:#111820}
    .spx-upload-note{margin-top:8px;font-size:7px;line-height:1.45;color:#8192a6}.spx-upload-note b{color:#aebac8}
    .spx-phone.spx-queue-mode>.spx-phone-head,.spx-phone.spx-queue-mode>.spx-phone-card{display:none!important}
    .spx-queue{margin-top:11px;border:1px solid #34475a;border-radius:8px;overflow:hidden;background:#101923}.spx-queue-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 10px;border-bottom:1px solid #2d3d4d;background:#172331}.spx-queue-head b{font-size:8px;color:#fff}.spx-queue-head span{font-size:7px;color:#8294a8}.spx-queue-list{max-height:184px;overflow:auto}.spx-queue-empty{padding:18px 10px;text-align:center;color:#72859a;font-size:8px;line-height:1.5}.spx-queue-row{display:grid;grid-template-columns:24px minmax(0,1fr) auto 18px;gap:7px;align-items:center;padding:8px 9px;border-bottom:1px solid #293847;cursor:pointer}.spx-queue-row:last-child{border-bottom:0}.spx-queue-row:hover,.spx-queue-row.selected{background:#1b2937}.spx-queue-pos{width:22px;height:22px;border-radius:6px;background:#223247;display:grid;place-items:center;color:#9db0c5;font-size:7px;font-weight:800}.spx-queue-row.next .spx-queue-pos{background:rgba(255,159,67,.16);color:var(--spx-accent)}.spx-queue-file{min-width:0}.spx-queue-file b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#e6edf5;font-size:8px}.spx-queue-file span{display:block;margin-top:2px;color:#7f91a4;font-size:7px}.spx-queue-state{font-size:7px;font-weight:800;color:#9db0c5}.spx-queue-row.next .spx-queue-state{color:var(--spx-accent)}.spx-queue-remove{border:0;background:transparent;color:#72859a;font-size:13px;line-height:1;cursor:pointer;padding:0}.spx-queue-remove:hover{color:#fff}
    .spx-queue-preview{display:none;margin-top:10px;border:1px solid #34475a;border-radius:8px;overflow:hidden;background:#0e1620}.spx-queue-preview.show{display:block}.spx-queue-preview img{display:block;width:100%;max-height:260px;object-fit:contain;background:#0b121a}.spx-upload-meta{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 9px;border-top:1px solid #2b3b4b}.spx-upload-meta b{font-size:8px;color:#e7eef6;max-width:70%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.spx-upload-meta span{font-size:7px;color:var(--spx-muted)}
    .spx-queue-select{min-width:210px;max-width:320px}.spx-queue-summary{display:flex;gap:7px;margin-top:8px}.spx-queue-summary span{flex:1;padding:7px 8px;border:1px solid #34475a;border-radius:7px;background:#172331;color:#8192a6;font-size:7px}.spx-queue-summary b{display:block;color:#e8eef5;font-size:11px;margin-bottom:2px}
  `;
  if(!document.getElementById(style.id)) document.head.appendChild(style);

  function esc(value){return String(value??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function formatBytes(bytes){if(!bytes)return '0 KB';const kb=bytes/1024;return kb<1024?`${kb.toFixed(kb<100?1:0)} KB`:`${(kb/1024).toFixed(1)} MB`;}
  function toast(message){const el=document.getElementById('toast');if(!el)return;el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2400);}
  function currentItem(){return state.queue.find(item=>item.id===state.selectedId)||state.queue[0]||null;}

  function readFile(file,index){
    return new Promise(resolve=>{
      if(!file||!file.type?.startsWith('image/')) return resolve(null);
      const reader=new FileReader();
      reader.onload=()=>resolve({id:`q${Date.now()}-${state.seq++}-${index}`,name:file.name,size:file.size,dataUrl:String(reader.result||''),status:'Queued'});
      reader.onerror=()=>resolve(null);
      reader.readAsDataURL(file);
    });
  }

  async function loadFiles(fileList){
    const files=[...(fileList||[])];
    if(!files.length)return;
    const items=(await Promise.all(files.map(readFile))).filter(Boolean);
    if(!items.length){toast('Choose image screenshots (PNG, JPG, WEBP, etc.).');return;}
    state.queue.push(...items);
    if(!state.selectedId) state.selectedId=state.queue[0].id;
    renderUpload(true);
    toast(`${items.length} screenshot${items.length===1?'':'s'} added to the processing queue.`);
  }

  function queueMarkup(){
    const selected=currentItem();
    const rows=state.queue.map((item,index)=>`<div class="spx-queue-row ${index===0?'next':''} ${selected?.id===item.id?'selected':''}" data-queue-id="${esc(item.id)}"><span class="spx-queue-pos">${String(index+1).padStart(2,'0')}</span><div class="spx-queue-file"><b>${esc(item.name)}</b><span>${formatBytes(item.size)} · uploaded screenshot</span></div><span class="spx-queue-state">${index===0?'NEXT':'QUEUED'}</span><button type="button" class="spx-queue-remove" data-remove-id="${esc(item.id)}" aria-label="Remove ${esc(item.name)}">×</button></div>`).join('');
    return `<div class="spx-queue"><div class="spx-queue-head"><b>Screenshot processing queue</b><span>${state.queue.length} waiting</span></div><div class="spx-queue-list">${rows||'<div class="spx-queue-empty">No screenshots waiting.<br>Upload one image or select multiple screenshots at once.</div>'}</div></div>`;
  }

  function uploadMarkup(){
    const selected=currentItem();
    return `
      <div class="spx-upload-head"><div><strong>Admin screenshot intake</strong><span>Upload one or many SPX mobile screenshots. New images are added to the queue and processed one at a time.</span></div><span class="spx-upload-badge">BULK IMAGE INPUT</span></div>
      <label class="spx-drop"><div><div class="spx-upload-icon">⇧</div><b>Drop screenshots here or browse</b><span>Multiple PNG · JPG · WEBP screenshots supported</span></div><input class="spxScreenshotFile" type="file" accept="image/*" multiple hidden></label>
      <div class="spx-upload-actions"><button type="button" class="primary spxBrowseUpload">Choose screenshots</button>${state.queue.length?'<button type="button" class="spxClearQueue">Clear queue</button>':''}</div>
      ${queueMarkup()}
      <div class="spx-queue-preview ${selected?.dataUrl?'show':''}">${selected?.dataUrl?`<img src="${selected.dataUrl}" alt="Queued SPX screenshot preview"><div class="spx-upload-meta"><b>${esc(selected.name)}</b><span>${formatBytes(selected.size)}</span></div>`:''}</div>
      <div class="spx-queue-summary"><span><b>${state.queue.length}</b>waiting</span><span><b>${state.completed}</b>processed this session</span></div>
      <div class="spx-upload-note"><b>Queue behavior:</b> the first screenshot is processed next. Selecting another row only changes the preview. Processed screenshots leave the waiting queue and the next image moves to the top automatically.</div>
      <div class="spx-upload-note"><b>Portfolio reconstruction:</b> selected files stay in this browser. OCR/extracted values remain synthetic and no screenshot is sent to a server.</div>`;
  }

  function removeItem(id){
    const wasSelected=state.selectedId===id;
    state.queue=state.queue.filter(item=>item.id!==id);
    if(wasSelected||!state.queue.some(item=>item.id===state.selectedId)) state.selectedId=state.queue[0]?.id||'';
    renderUpload(true);
  }

  function wireUpload(upload){
    const input=upload.querySelector('.spxScreenshotFile');
    const drop=upload.querySelector('.spx-drop');
    upload.querySelector('.spxBrowseUpload')?.addEventListener('click',e=>{e.preventDefault();input?.click()});
    upload.querySelector('.spxClearQueue')?.addEventListener('click',()=>{state.queue=[];state.selectedId='';renderUpload(true)});
    input?.addEventListener('change',()=>loadFiles(input.files));
    ['dragenter','dragover'].forEach(type=>drop?.addEventListener(type,e=>{e.preventDefault();upload.classList.add('drag')}));
    ['dragleave','drop'].forEach(type=>drop?.addEventListener(type,e=>{e.preventDefault();upload.classList.remove('drag')}));
    drop?.addEventListener('drop',e=>loadFiles(e.dataTransfer?.files));
    upload.querySelectorAll('.spx-queue-row').forEach(row=>row.addEventListener('click',e=>{if(e.target.closest('.spx-queue-remove'))return;state.selectedId=row.dataset.queueId||'';renderUpload(true)}));
    upload.querySelectorAll('.spx-queue-remove').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();removeItem(btn.dataset.removeId||'')}));
  }

  function mountQueueSelect(){
    const sample=document.getElementById('sampleSelect');
    if(!sample)return;
    sample.style.display='none';sample.disabled=true;
    const parent=sample.parentElement;
    if(!parent)return;
    let select=parent.querySelector('.spx-queue-select');
    if(!select){select=document.createElement('select');select.className='spx-select spx-queue-select';parent.appendChild(select);}
    const signature=state.queue.map(x=>x.id).join('|')+'|'+state.selectedId;
    if(select.dataset.signature!==signature){
      select.dataset.signature=signature;
      select.innerHTML=state.queue.length?state.queue.map((item,index)=>`<option value="${esc(item.id)}" ${state.selectedId===item.id?'selected':''}>${String(index+1).padStart(2,'0')} · ${esc(item.name)} · ${index===0?'NEXT':'QUEUED'}</option>`).join(''):'<option value="">Queue empty — upload screenshots</option>';
      select.disabled=!state.queue.length;
      select.onchange=()=>{state.selectedId=select.value;renderUpload(true)};
    }
  }

  function setPendingState(){
    const cards=[...document.querySelectorAll('.spx-encoder .spx-kpis .spx-card')];
    if(cards.length<4)return;
    const queued=state.queue.length>0;
    const set=(card,value,delta)=>{const strong=card.querySelector('strong'),small=card.querySelector('.delta');if(strong)strong.textContent=value;if(small)small.textContent=delta;};
    if(queued){set(cards[0],'PENDING OCR','queued screenshot');set(cards[1],'—','not processed yet');set(cards[2],'QUEUED','waiting for processor');set(cards[3],'Daily Log','write after validation');}
    else {set(cards[0],'WAITING','upload required');set(cards[1],'—','no screenshot selected');set(cards[2],'QUEUE EMPTY','nothing to process');set(cards[3],'Daily Log','target after validation');}
  }

  function bindProcess(){
    const process=document.getElementById('processSample');
    if(!process||process.dataset.queueBound==='1')return;
    const original=process.onclick;
    process.dataset.queueBound='1';
    process.onclick=e=>{
      if(!state.queue.length){e?.preventDefault?.();toast('The screenshot queue is empty. Upload one or more screenshots first.');return;}
      const item=state.queue.shift();
      state.completed+=1;
      if(state.selectedId===item.id||!state.queue.some(x=>x.id===state.selectedId)) state.selectedId=state.queue[0]?.id||'';
      toast(`${item.name} processed and staged for the Daily Log. ${state.queue.length} remaining.`);
      if(typeof original==='function') original.call(process,e);
      setTimeout(()=>renderUpload(true),0);
    };
  }

  function renderUpload(force){
    const encoder=document.querySelector('.spx-encoder');
    const phone=encoder?.querySelector('.spx-phone');
    if(!encoder||!phone)return false;
    phone.classList.add('spx-queue-mode');
    let upload=phone.querySelector('.spx-upload');
    if(!upload){upload=document.createElement('div');upload.className='spx-upload';phone.prepend(upload);force=true;}
    const signature=`${state.queue.map(x=>`${x.id}:${x.name}:${x.size}`).join('|')}|${state.selectedId}|${state.completed}`;
    if(force||upload.dataset.signature!==signature){upload.dataset.signature=signature;upload.innerHTML=uploadMarkup();wireUpload(upload);}
    mountQueueSelect();
    setPendingState();
    const process=document.getElementById('processSample');
    if(process){
      process.textContent=state.queue.length?`Process next · ${state.queue.length} queued`:'Queue empty';
      process.disabled=!state.queue.length;
      process.title=state.queue.length?'Process the first uploaded screenshot in the queue':'Upload screenshots before processing';
    }
    bindProcess();
    return true;
  }

  renderUpload(false);
  setInterval(()=>renderUpload(false),250);
})();