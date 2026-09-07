(() => {
  const outer=document.getElementById('native');
  if(!outer)return;
  function deepestDoc(){
    try{
      let doc=outer.contentDocument;if(!doc)return null;
      for(let i=0;i<18;i++){
        const frame=doc.querySelector('iframe');
        if(!frame||!frame.contentDocument)break;
        doc=frame.contentDocument;
      }
      return doc;
    }catch(_){return null}
  }
  function patchText(root){
    if(!root)return;
    const walker=root.ownerDocument.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      let text=node.nodeValue||'';
      text=text.replace(/In the production architecture this write is executed through n8n using the Monday API after approval\./g,'In production, the native monday Agent can apply this board update within its granted permissions after approval. n8n is reserved for external or cross-system orchestration.');
      text=text.replace(/production would perform the approved write through n8n \+ Monday API\./gi,'production can apply the approved sprint directly through the native monday Agent tools; n8n is used only when the flow leaves monday.');
      text=text.replace(/Monday context \+ n8n orchestration \+ approval controls/gi,'Native monday Agent · board context · approval controls');
      if(text!==node.nodeValue)node.nodeValue=text;
    });
  }
  function install(){
    const doc=deepestDoc();if(!doc||!doc.body)return false;
    const root=doc.getElementById('p02NativeAgents');if(!root)return false;
    patchText(root);
    if(!root.dataset.nativeArchitectureCopy){
      root.dataset.nativeArchitectureCopy='1';
      new MutationObserver(()=>patchText(root)).observe(root,{childList:true,subtree:true,characterData:true});
    }
    return true;
  }
  function start(){let tries=0;const t=setInterval(()=>{tries++;if(install()||tries>240)clearInterval(t)},100)}
  outer.addEventListener('load',start);start();
})();
