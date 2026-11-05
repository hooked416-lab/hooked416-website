(() => {
'use strict';
  function advice(rows) {
    const conditions=rows.map(r=>r.condition).join(' ').toLowerCase();
    if (/freezing|ice pellets/.test(conditions)) return 'Freezing precipitation reported: consider delaying travel; reduce speed and leave extra stopping room.';
    if (/snow|blizzard/.test(conditions)) return 'Snow reported: ease off the speed, leave extra space and avoid sudden braking.';
    if (/thunder/.test(conditions)) return 'Thunderstorms reported: reduce speed as visibility falls and never drive through flooded roads.';
    if (/fog|mist/.test(conditions)) return 'Reduced visibility reported: slow down, use low beams and leave extra space.';
    if (/rain|drizzle|shower/.test(conditions)) return 'Rain reported: slow down for wet roads and give yourself more stopping room.';
    if (rows.some(r=>(r.gust??0)>=50 || (r.wind??0)>=40)) return 'Strong winds reported: reduce speed as needed and keep a firm grip on the wheel.';
    if (rows.some(r=>r.temperature<=2)) return 'Cold temperatures: watch for possible icy patches, especially on bridges, and adjust your speed to the road.';
    return 'Drive to the conditions: keep a safe following distance and reduce speed whenever visibility or grip drops.';
  }
const cities=[{"id": "on-79", "name": "Oakville", "lon": -79.69, "lat": 43.46}, {"id": "on-85", "name": "Markham", "lon": -79.26, "lat": 43.88}, {"id": "on-4", "name": "Brampton", "lon": -79.76, "lat": 43.69}, {"id": "on-68", "name": "Halton Hills", "lon": -79.95, "lat": 43.63}, {"id": "on-32", "name": "Caledon", "lon": -79.86, "lat": 43.87}, {"id": "on-143", "name": "Toronto", "lon": -79.38, "lat": 43.65}, {"id": "on-24", "name": "Mississauga", "lon": -79.66, "lat": 43.59}, {"id": "on-59", "name": "Richmond Hill", "lon": -79.43, "lat": 43.87}, {"id": "on-25", "name": "Newmarket", "lon": -79.46, "lat": 44.06}, {"id": "on-64", "name": "Vaughan", "lon": -79.54, "lat": 43.85}, {"id": "on-54", "name": "Pickering", "lon": -79.11, "lat": 43.83}, {"id": "on-119", "name": "Whitby", "lon": -78.94, "lat": 43.9}, {"id": "on-117", "name": "Oshawa", "lon": -78.86, "lat": 43.9}, {"id": "on-149", "name": "Port Perry", "lon": -78.95, "lat": 44.1}];
const MAX_AGE=3*3600000, REFRESH=10*60000, KEY='hooked416-local-weather-v1';
const numeric=v=>typeof v==='number'&&Number.isFinite(v)?v:null;
function distance(lat,lon,c){const rad=Math.PI/180,a=(c.lat-lat)*rad,b=(c.lon-lon)*rad;return 6371*2*Math.asin(Math.sqrt(Math.sin(a/2)**2+Math.cos(lat*rad)*Math.cos(c.lat*rad)*Math.sin(b/2)**2));}
function nearest(lat,lon){if(!Number.isFinite(lat)||!Number.isFinite(lon))return null;const c=[...cities].sort((a,b)=>distance(lat,lon,a)-distance(lat,lon,b))[0];return distance(lat,lon,c)<=40?c:null;}
function parse(feature,now=Date.now()){
 const p=feature?.properties;if(!p)throw Error('Missing weather data');
 const c=p.currentConditions,time=Date.parse(c?.timestamp?.en),temperature=numeric(c?.temperature?.value?.en);
 const observation=Number.isFinite(time)&&now-time<=MAX_AGE&&time-now<=600000&&temperature!==null?{time,temperature,condition:c?.condition?.en||'Sky conditions not reported',wind:numeric(c?.wind?.speed?.value?.en),gust:numeric(c?.wind?.gust?.value?.en),station:c?.station?.value?.en||'Nearby station'}:null;
 const updated=Date.parse(p.lastUpdated),alertFresh=Number.isFinite(updated)&&now-updated<=MAX_AGE&&updated-now<=600000;
 const warnings=Array.isArray(p.warnings)&&alertFresh?p.warnings.filter(w=>!Number.isFinite(Date.parse(w?.expiryTime?.en))||Date.parse(w.expiryTime.en)>now).map(w=>({title:w?.description?.en||w?.type?.en||'Weather alert',type:w?.type?.en||'',url:w?.url?.en,expiry:w?.expiryTime?.en})):null;
 return {observation,warnings,updated,fetched:now};
}
function safeURL(url,fallback){try{const u=new URL(url);return u.protocol==='https:'&&(u.hostname==='weather.gc.ca'||u.hostname.endsWith('.weather.gc.ca')||u.hostname==='meteo.gc.ca'||u.hostname.endsWith('.meteo.gc.ca'))?u.href:fallback;}catch{return fallback;}}
if(typeof module!=='undefined'&&module.exports){module.exports={parse,nearest,advice,safeURL};return;}
const card=document.getElementById('local-weather');if(!card)return;
const el=id=>document.getElementById(id),select=el('weather-city');let selected='on-59',data=null,busy=false,lastAttempt=0,request=0;
try{const saved=JSON.parse(sessionStorage.getItem(KEY));if(cities.some(c=>c.id===saved?.selected)){selected=saved.selected;data=saved.data;}}catch{}
for(const c of cities.sort((a,b)=>a.name.localeCompare(b.name))){const o=document.createElement('option');o.value=c.id;o.textContent=c.name;select.append(o);}select.options[0].remove();select.value=selected;
const format=t=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(t);
function render(){
 const city=cities.find(c=>c.id===selected),now=Date.now(),fallback='https://weather.gc.ca/en/location/index.html?coords='+city.lat+','+city.lon;
 el('weather-place').textContent=city.name;el('weather-official').href=fallback;
 const o=data?.observation&&now-data.observation.time<=MAX_AGE?data.observation:null;
 el('weather-reading').textContent=o?Math.round(o.temperature)+'°C · '+o.condition:'Local conditions unavailable';
 el('weather-observed').textContent=o?'Observed '+format(o.time)+' · '+o.station:'';
 el('weather-tip').textContent=o?advice([o]):'Drive to the conditions and leave a safe following distance.';
 const warnings=data&&now-data.fetched<=REFRESH*2&&now-data.updated<=MAX_AGE?data.warnings:null;
 const active=warnings?.filter(w=>!Number.isFinite(Date.parse(w.expiry))||Date.parse(w.expiry)>now);
 const box=el('weather-alerts');box.replaceChildren();
 card.classList.toggle('has-alert',!!active?.length);
 el('weather-alert-status').textContent=active===undefined||active===null?'Alerts unavailable — check official forecast':active.length?'⚠ '+active.map(w=>w.title).join(' · '):'No active alerts in the latest report';
 if(active?.length){for(const w of active){const p=document.createElement('p'),a=document.createElement('a');a.textContent=w.title+' — official details ↗';a.href=safeURL(w.url,fallback);p.append(a);box.append(p);}}
 if(data&&warnings!==null){const note=document.createElement('p');note.className='weather-note';note.textContent='Alerts checked '+format(data.fetched)+'.';box.append(note);}
}
async function refresh(force=false){
 if(!force)render();if(document.hidden||busy||(!force&&Date.now()-lastAttempt<REFRESH))return;
 busy=true;lastAttempt=Date.now();const seq=++request,id=selected;const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
 try{const response=await fetch('https://api.weather.gc.ca/collections/citypageweather-realtime/items/'+id+'?f=json',{signal:controller.signal,credentials:'omit'});if(!response.ok)throw Error('Unavailable');const next=parse(await response.json());if(seq===request&&id===selected){data=next;try{sessionStorage.setItem(KEY,JSON.stringify({selected,data}));}catch{}}}
 catch{if(id===selected&&data)data.warnings=null;}
 finally{clearTimeout(timer);if(seq===request){busy=false;render();}}
}
function choose(id,message){request++;busy=false;selected=id;select.value=id;data=null;lastAttempt=0;el('weather-location-status').textContent=message;try{sessionStorage.setItem(KEY,JSON.stringify({selected,data:null}));}catch{}render();refresh(true);}
select.addEventListener('change',()=>choose(select.value,'Showing your selected area.'));
el('weather-locate').addEventListener('click',()=>{
 if(!navigator.geolocation){el('weather-location-status').textContent='Location is unavailable. Please choose an area.';return;}
 const button=el('weather-locate');button.disabled=true;el('weather-location-status').textContent='Finding your nearest supported area…';
 navigator.geolocation.getCurrentPosition(position=>{button.disabled=false;const city=nearest(position.coords.latitude,position.coords.longitude);if(city)choose(city.id,'Nearest supported area: '+city.name+'. Your coordinates are not saved.');else el('weather-location-status').textContent='You are outside our supported GTA area. Choose an area manually or check Environment Canada.';},()=>{button.disabled=false;el('weather-location-status').textContent='Location was not available. Choose your area from the list.';},{enableHighAccuracy:false,timeout:10000,maximumAge:300000});
});
if(selected!=='on-59')el('weather-location-status').textContent='Using your previously selected area for this tab.';
render();refresh();setInterval(()=>refresh(),60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
})();
