(function(){
  const params=new URLSearchParams(location.search);
  if(params.get('id')!=='ocr') return;
  const root=document.getElementById('demoRoot');
  if(!root) return;

  const routeState={
    CO:{picked:570,handed:570},
    PR:{picked:612,handed:153},
    TA:{picked:1048,handed:1022}
  };
  Object.values(routeState).forEach(r=>r.pooled=Math.max(0,r.picked-r.handed));
  const totalPicked=Object.values(routeState).reduce((s,r)=>s+r.picked,0);
  const totalHanded=Object.values(routeState).reduce((s,r)=>s+r.handed,0);
  const totalPooled=Object.values(routeState).reduce((s,r)=>s+r.pooled,0);

  const style=document.createElement('style');
  style.textContent=`
    .spx-pool-flow{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin:10px 0}.spx-pool-step{padding:11px;border:1px solid var(--spx-line);border-radius:8px;background:#172331}.spx-pool-step span{display:block;color:var(--spx-accent);font-size:7px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px}.spx-pool-step b{display:block;font-size:9px;color:#fff;margin-bottom:4px}.spx-pool-step small{display:block;color:var(--spx-muted);font-size:7px;line-height:1.45}.spx-pool-balance{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin:10px 0}.spx-pool-balance div{padding:10px;border:1px solid var(--spx-line);border-radius:8px;background:#172331}.spx-pool-balance b{display:block;font-size:14px}.spx-pool-balance span{display:block;font-size:7px;color:var(--spx-muted);margin-top:3px}.spx-pool-note{padding:10px 12px;border:1px solid var(--spx-line);border-left:3px solid var(--spx-accent2);border-radius:7px;background:#172331;color:#b7c3d0;font-size:8px;line-height:1.55;margin:10px 0}.spx-pool-note strong{color:#fff}@media(max-width:900px){.spx-pool-flow{grid-template-columns:1fr 1fr}.spx-pool-balance{grid-template-columns:1fr 1fr}}
  `;
  document.head.appendChild(style);

  const flowHtml=`<div class="spx-pool-flow" data-pool-flow><div class="spx-pool-step"><span>01 · Pickup</span><b>Parcels collected</b><small>Store pickups increase the route's collected parcel pool.</small></div><div class="spx-pool-step"><span>02 · Pool</span><b>Held in the van</b><small>Picked-up parcels are not immediately treated as handed over.</small></div><div class="spx-pool-step"><span>03 · Trip trigger</span><b>Van fills / WH run</b><small>A warehouse trip moves only the load carried on that trip.</small></div><div class="spx-pool-step"><span>04 · Handover</span><b>Unload at warehouse</b><small>The trip's handed-over quantity becomes verified handover evidence.</small></div><div class="spx-pool-step"><span>05 · Carry forward</span><b>Remaining pool</b><small>Parcels not included in the trip remain pooled for the next warehouse run.</small></div></div>`;

  function addPoolColumn(table,routeCol,pickedCol,handedCol){
    if(!table||table.dataset.poolColumn==='1') return;
    const head=table.querySelector('thead tr');
    if(!head) return;
    const th=document.createElement('th');th.textContent='Pooled / Next Trip';
    const headers=[...head.children];
    const handedHeader=headers[handedCol];
    if(handedHeader) handedHeader.insertAdjacentElement('afterend',th); else head.appendChild(th);
    table.querySelectorAll('tbody tr').forEach(row=>{
      const cells=[...row.children],route=(cells[routeCol]?.textContent||'').trim();
      const picked=Number((cells[pickedCol]?.textContent||'0').replace(/,/g,''))||0;
      const handed=Number((cells[handedCol]?.textContent||'0').replace(/,/g,''))||0;
      const td=document.createElement('td');td.className='num';td.textContent=Math.max(0,picked-handed).toLocaleString();
      const handedCell=cells[handedCol];
      if(handedCell) handedCell.insertAdjacentElement('afterend',td); else row.appendChild(td);
      if(routeState[route]) td.title=`${route} picked ${routeState[route].picked.toLocaleString()} · handed over ${routeState[route].handed.toLocaleString()} · ${routeState[route].pooled.toLocaleString()} remains for next trip`;
    });
    table.dataset.poolColumn='1';
  }

  function patchOwner(){
    const main=root.querySelector('.spx-main');
    if(!main||main.querySelector('[data-owner-pool]')) return;
    const kpis=main.querySelector('.spx-kpis');
    if(kpis){
      kpis.insertAdjacentHTML('afterend',`<div class="spx-pool-balance" data-owner-pool><div><b>${totalPicked.toLocaleString()}</b><span>picked / collected parcels</span></div><div><b>${totalHanded.toLocaleString()}</b><span>already handed over on logged WH trips</span></div><div><b>${totalPooled.toLocaleString()}</b><span>still pooled in vans for a later trip</span></div><div><b>Next trip</b><span>remaining parcels carry forward until the next warehouse run</span></div></div><div class="spx-pool-note"><strong>Pickup ≠ handover.</strong> Store pickups accumulate in the van. A warehouse trip hands over only that trip's load; any remaining collected parcels stay pooled and roll into the next trip.</div>`);
    }
    const chartTitle=[...main.querySelectorAll('h3')].find(x=>/Handed-over parcels by trip/i.test(x.textContent));
    if(chartTitle){const p=chartTitle.parentElement?.querySelector('p');if(p)p.textContent='Each bar is a warehouse unload event from the accumulated pickup pool. Parcels not included in that trip remain in the van for the next run.';}
  }

  function patchDailyLogs(){
    const main=root.querySelector('.spx-main');
    if(!main||main.querySelector('[data-daily-pool-note]')) return;
    const panel=main.querySelector('.spx-panel');
    if(panel) panel.insertAdjacentHTML('afterend',`<div class="spx-pool-note" data-daily-pool-note><strong>Operational rule:</strong> Picked/scanned parcels in the Daily Log are collected inventory for the route. They enter the van pool first. They become handed-over parcels only when a warehouse-trip record confirms the unload. The $0.03 payout is therefore reconciled from trip-level handed-over quantities, while the familiar Daily Log fields remain preserved.</div>`);
  }

  function patchSummary(){
    const tables=root.querySelectorAll('.spx-table');
    const table=[...tables].find(t=>/Verified Handed Over/i.test(t.querySelector('thead')?.textContent||''));
    addPoolColumn(table,0,6,7);
    const main=root.querySelector('.spx-main');
    if(main&&!main.querySelector('[data-summary-pool-note]')){
      const tablePanel=table?.closest('.spx-panel');
      if(tablePanel)tablePanel.insertAdjacentHTML('afterend',`<div class="spx-pool-note" data-summary-pool-note><strong>Reconciliation:</strong> Picked parcels are the accumulated collection pool. Verified handover is the sum of warehouse-trip unloads. <b>${totalPooled.toLocaleString()} parcels</b> in this reconstructed view remain pooled for a later trip, so picked and handed-over totals are not expected to match in real time.</div>`);
    }
  }

  function patchRouteProgress(){
    const table=[...root.querySelectorAll('.spx-table')].find(t=>/Picked Parcels/i.test(t.querySelector('thead')?.textContent||''));
    addPoolColumn(table,0,6,7);
    const main=root.querySelector('.spx-main');
    if(main&&!main.querySelector('[data-route-pool-note]')){
      const panel=table?.closest('.spx-panel');
      if(panel)panel.insertAdjacentHTML('afterend',`<div class="spx-pool-note" data-route-pool-note><strong>Route progress has two separate stages:</strong> pickup completion measures stores/tasks collected; handover progress measures parcels actually unloaded at the warehouse. The difference is the live parcel pool still riding with the route team for the next trip.</div>`);
    }
  }

  function patchTripsPay(){
    const main=root.querySelector('.spx-main');
    if(!main||main.querySelector('[data-trip-pool-flow]')) return;
    const firstPanel=main.querySelector('.spx-panel');
    if(firstPanel){
      firstPanel.insertAdjacentHTML('beforebegin',`<section class="spx-panel" data-trip-pool-flow><div class="spx-panel-head"><div><h3>Pickup pool → warehouse trip → handover</h3><p>Trip quantities are batches taken from the accumulated van pool, not an immediate one-to-one handover after every store pickup.</p></div></div>${flowHtml}<div class="spx-pool-balance"><div><b>${routeState.CO.pooled}</b><span>CO pooled after logged trips</span></div><div><b>${routeState.PR.pooled}</b><span>PR pooled after logged trips</span></div><div><b>${routeState.TA.pooled}</b><span>TA pooled after logged trips</span></div><div><b>${totalPooled}</b><span>total awaiting a later WH trip</span></div></div></section>`);
      const para=firstPanel.querySelector('.spx-panel-head p');
      if(para)para.textContent='Each trip records only the parcels actually unloaded on that warehouse run. Compensation is credited from those handed-over quantities; parcels left in the van are paid only when a later trip hands them over.';
      const formula=firstPanel.querySelector('.spx-formula');
      if(formula)formula.innerHTML='<b>Compensation rule:</b> Only handed-over parcels on a completed warehouse trip are payable. Handed-over parcels × $0.03. Driver + assistant = 50/50 split; driver-only trip = 100% to the driver. Picked parcels still pooled in the van are not yet included in trip pay.';
    }
  }

  function patchEncoder(){
    const main=root.querySelector('.spx-main');
    if(!main||main.querySelector('[data-encoder-pool-note]')) return;
    const panel=main.querySelector('.spx-panel');
    if(panel)panel.insertAdjacentHTML('afterend',`<div class="spx-pool-note" data-encoder-pool-note><strong>Write behavior:</strong> A pickup screenshot updates the Daily Log and collected-parcel pool. It does not create a handover or payment record. Handover is recorded separately when the van makes a warehouse trip and the load is unloaded; any remainder stays pooled for the next trip.</div>`);
  }

  function patchStructure(){
    root.querySelectorAll('.spx-workspace-map article').forEach(card=>{
      const h=card.querySelector('h4'),p=card.querySelector('p');if(!h||!p)return;
      if(/Daily Summary/i.test(h.textContent))p.textContent='Route totals, completion, pending work, exceptions, picked parcels, pooled balance and verified handed-over parcels.';
      if(/Trips & Handover/i.test(h.textContent))p.textContent='Picked parcels pool in the van. Each warehouse trip unloads part or all of that pool; remaining parcels carry to the next trip.';
      if(/Driver \/ Assistant Pay/i.test(h.textContent))p.textContent='$0.03 × parcels actually handed over on each warehouse trip, with a 50/50 split when both driver and assistant are involved.';
    });
  }

  function patchCaseStudyParent(){
    try{
      if(window.parent===window||!/spx-case-study\.html$/i.test(window.parent.location.pathname)) return;
      const doc=window.parent.document;if(doc.getElementById('spxPoolingCaseNote'))return;
      const target=doc.querySelector('#architecture .spx-boundary')||doc.querySelector('#architecture .wrap');if(!target)return;
      const note=doc.createElement('div');note.id='spxPoolingCaseNote';note.className='spx-callout';note.innerHTML='<strong>Pickup-to-handover model:</strong> parcels collected from sellers accumulate in the van first. A warehouse trip unloads only the current load when the van is full or the team returns to the warehouse. Any remaining picked-up parcels stay in the pool and are carried into the next trip. Driver/assistant compensation is calculated from the parcels actually handed over per trip, not simply from parcels picked up at stores.';
      target.insertAdjacentElement('afterend',note);
    }catch(_){ }
  }

  function patch(){
    const title=root.querySelector('.spx-head h1')?.textContent.trim();
    const brandSmall=root.querySelector('.spx-brand small');if(brandSmall)brandSmall.textContent='Daily logs · pickup pool · WH trips · attendance · reporting';
    if(title==='Owner Dashboard')patchOwner();
    else if(title==='Daily Logs')patchDailyLogs();
    else if(title==='Daily Summary')patchSummary();
    else if(title==='Route Progress')patchRouteProgress();
    else if(title==='Trips & Pay')patchTripsPay();
    else if(title==='SPX Encoder')patchEncoder();
    else if(title==='Workspace Structure')patchStructure();
    patchCaseStudyParent();
  }

  let scheduled=false;
  const schedule=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;patch()})};
  new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
  schedule();
})();