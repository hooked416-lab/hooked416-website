(()=>{
 const input=document.getElementById('service-query');if(!input)return;
 const list=document.getElementById('service-results'),status=document.getElementById('search-status'),clear=document.getElementById('clear-service-search');let entries=null,failed=false;
 const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
 const aliases={repo:'repossession',bike:'motorcycle',motorbike:'motorcycle',jump:'battery',boost:'battery',locked:'lockout',gas:'fuel',junk:'scrap',atv:'off road',utv:'off road',rv:'camper',flatdeck:'flatbed',inclosed:'enclosed'};
 function render(){
  const raw=norm(input.value);clear.hidden=!input.value;list.replaceChildren();list.hidden=true;
  if(!raw){status.textContent='';return;}
  if(failed){status.textContent='Search is unavailable. Browse the services below or call 416-301-0820.';return;}
  if(!entries){status.textContent='Loading services…';return;}
  const words=raw.split(' ').map(w=>aliases[w]||w);
  const matches=entries.map(e=>({e,score:words.every(w=>e.search.includes(w))?(e.name.includes(raw)?2:1):0})).filter(x=>x.score).sort((a,b)=>b.score-a.score);
  status.textContent=matches.length?`${matches.length} matching ${matches.length===1?'page':'pages'}. Choose a result below.`:'No matches. Try “towing”, “roadside” or “apply”, or call 416-301-0820.';
  for(const {e} of matches){const li=document.createElement('li'),a=document.createElement('a'),title=document.createElement('strong'),desc=document.createElement('span');a.href=e.url;title.textContent=e.title;desc.textContent=e.description;a.append(title,desc);li.append(a);list.append(li);}
  list.hidden=!matches.length;
 }
 input.addEventListener('input',render);input.addEventListener('keydown',e=>{if(e.key==='Escape'){input.value='';render();}if(e.key==='ArrowDown'&&list.firstElementChild){e.preventDefault();list.querySelector('a').focus();}});
 clear.addEventListener('click',()=>{input.value='';render();input.focus();});
 fetch('/search-index.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{entries=data.map(e=>({...e,name:norm(e.title),search:norm(e.title+' '+e.description+' '+e.keywords)}));render();}).catch(()=>{failed=true;render();});
})();
