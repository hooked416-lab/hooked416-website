(()=>{
 const f=document.getElementById('property-tow-form');if(!f)return;
 const date=document.getElementById('tow-date');
 if(!date.value)date.value=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const signedTime=document.getElementById('tow-time');
 if(!signedTime.value)signedTime.value=new Intl.DateTimeFormat('en-GB',{timeZone:'America/Toronto',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date());
 const status=document.getElementById('tow-form-status'),canvas=document.getElementById('signature-pad'),ctx=canvas.getContext('2d'),panel=document.getElementById('drawn-signature-panel'),attachment=document.getElementById('signature-attachment'),state=document.getElementById('signature-state'),choice=document.getElementById('signature-choice');
 let activePointer=null,last=null,ink=0,busy=false;
 const mode=()=>f.elements.signature_method.value;
 function reset(){ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ink=0;last=null;activePointer=null;attachment.value='';state.textContent='No signature drawn yet.';}
 function sync(){const draw=mode()==='Drawn';panel.hidden=!draw;attachment.disabled=!draw;document.getElementById('signature-name-label').textContent=draw?'Print your full name *':'Type your full name as your signature *';if(!draw)attachment.value='';status.textContent='';}
 if(ctx&&typeof DataTransfer!=='undefined'&&typeof File!=='undefined'){choice.hidden=false;reset();f.querySelectorAll('[name="signature_method"]').forEach(r=>r.addEventListener('change',sync));sync();}
 function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height};}
 canvas.addEventListener('pointerdown',e=>{if(activePointer!==null||e.button>0)return;e.preventDefault();activePointer=e.pointerId;last=point(e);canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{if(e.pointerId!==activePointer||!last)return;e.preventDefault();const p=point(e);ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.strokeStyle='#111';ctx.lineWidth=5;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();ink+=Math.hypot(p.x-last.x,p.y-last.y);last=p;if(ink>=20)state.textContent='Signature drawn. Use Clear signature to start again.';});
 function end(e){if(e.pointerId===activePointer){activePointer=null;last=null;}}
 canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);canvas.addEventListener('lostpointercapture',end);
 document.getElementById('clear-signature').addEventListener('click',()=>{reset();status.textContent='';});
 f.addEventListener('submit',async e=>{
  e.preventDefault();if(busy)return;status.textContent='';
  const files=[f.elements.attachment.files[0],f.elements.attachment2.files[0]];
  for(let i=0;i<files.length;i++){const file=files[i];if(!file)continue;const allowed=i===0?/\.(jpe?g|png|heic|heif)$/i:/\.(pdf|jpe?g|png|heic|heif)$/i;if(!file.size||file.size>4000000||!allowed.test(file.name)){status.textContent='Please choose a supported file no larger than 4 MB for each upload.';return;}}
  if(!f.elements.signer_full_name.value.trim()||!f.elements.requester.value.trim()||!f.elements.reason.value.trim()){status.textContent='Please enter your full name, reason for removal and signature name.';return;}
  if(mode()==='Drawn'&&ink<20){status.textContent='Please draw your signature in the box, or choose Type my signature.';return;}
  busy=true;const button=f.querySelector('button[type="submit"]');button.disabled=true;
  try{
   if(mode()==='Drawn'){
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('signature');
    if(files.reduce((n,x)=>n+(x?.size||0),0)+blob.size>10000000)throw Error('size');
    const transfer=new DataTransfer();transfer.items.add(new File([blob],'hooked416-property-towing-signature.png',{type:'image/png'}));attachment.files=transfer.files;attachment.disabled=false;
   }else{attachment.disabled=true;attachment.value='';}
   status.textContent='Opening verification. Your request is not confirmed until our team contacts you.';
   const submittedAt=new Date();
   f.elements.request_submitted_toronto.value=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23',timeZoneName:'short'}).format(submittedAt);
   f.elements.request_submitted_utc.value=submittedAt.toISOString();
   HTMLFormElement.prototype.submit.call(f);
  }catch(error){status.textContent='We could not prepare your signature. Please try again or choose Type my signature.';}
  finally{busy=false;button.disabled=false;}
 });
})();
