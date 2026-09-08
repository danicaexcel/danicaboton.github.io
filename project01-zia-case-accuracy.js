(() => {
  const params=new URLSearchParams(location.search);
  if(!/case-study\.html$/.test(location.pathname)||params.get('id')!=='recruitment')return;

  function apply(){
    const section=document.getElementById('ai-agents');
    if(!section)return false;
    if(document.documentElement.dataset.p01ZiaAccuracy==='1')return true;
    document.documentElement.dataset.p01ZiaAccuracy='1';

    const style=document.createElement('style');
    style.id='p01-zia-accuracy-style';
    style.textContent=`.p01-zia-origin-note{margin:0 0 18px;border:1px solid #414850;background:#20262c;padding:14px 16px;color:#b8c0c8;font-size:10px;line-height:1.6}.p01-zia-origin-note strong{color:#fff}.p01-zia-origin-note span{color:#f5b36d;font:700 8px/1.3 "IBM Plex Mono",monospace;letter-spacing:.08em;text-transform:uppercase;display:block;margin-bottom:6px}`;
    document.head.appendChild(style);

    const heroNote=document.querySelector('.implementation-note');
    if(heroNote){
      const label=heroNote.querySelector('span');
      const copy=heroNote.querySelector('p');
      if(label)label.textContent='Zoho CRM + custom Zia Agents built in Agent Studio';
      if(copy)copy.textContent='The four recruitment agents are custom agents created from scratch in Zia Agent Studio, tested there, and deployed into Zoho CRM using a connection or Digital Employee identity as appropriate. They are not hired from the Agent Store. Zoho CRM remains the system of record; cross-system posting, messaging, and the existing resume-analysis service use controlled external integrations.';
    }

    const casebar=document.querySelector('.casebar');
    if(casebar&&!Array.from(casebar.querySelectorAll('span')).some(x=>x.textContent.trim()==='Agent Studio')){
      const tag=document.createElement('span');tag.textContent='Agent Studio';casebar.appendChild(tag);
    }

    const head=section.querySelector('.p01-ai-head');
    const intro=head?.querySelector('p');
    if(intro)intro.textContent='These are custom Zia Agents built from scratch in Agent Studio for the recruitment operating model, not prebuilt Agent Store hires. After testing, each agent is deployed into Zoho CRM with the activation, CRM context, tools, access, and audit identity appropriate to its job.';
    if(head&&!section.querySelector('.p01-zia-origin-note')){
      head.insertAdjacentHTML('afterend','<div class="p01-zia-origin-note"><span>Agent origin</span><strong>Custom Agent Studio builds → tested → deployed to Zoho CRM</strong><br>The portfolio demo mirrors the Zia Agents portal with a custom-agent card library and agent-detail pages. The Agent Store is shown only as a separate marketplace destination and is not presented as the source of these recruitment agents.</div>');
    }

    const nav=document.querySelector('.navlinks a[href="#ai-agents"]');
    if(nav)nav.textContent='Custom Zia agents';
    return true;
  }

  if(!apply()){
    let attempts=0;
    const timer=setInterval(()=>{attempts+=1;if(apply()||attempts>30)clearInterval(timer);},100);
  }
})();