(()=>{
 const form=document.getElementById('driver-registration');if(!form)return;
 const status=document.getElementById('registration-status');
 const submit=document.getElementById('register-submit');
 const ENDPOINT='https://hooked416-private-property.hooked416.workers.dev/api/register';
 // A licence PHOTO is downscaled in the browser before it is sent
 // (max 1600px, JPEG) so a multi-MB phone photo lands at a few
 // hundred KB — the same treatment the app gives job photos. A PDF
 // cannot be re-encoded in the browser and goes as-is (15 MB cap);
 // if the photo cannot be prepared here, the original is sent and
 // the server's 3 MB photo cap answers with a clear message.
 function prepareLicence(file){
  if(!file||file.type==='application/pdf'||!/^image\//.test(file.type||''))return Promise.resolve({blob:file,name:(file&&file.name)||'licence'});
  return new Promise(resolve=>{
   let url,img;const done=v=>{if(url)URL.revokeObjectURL(url);resolve(v);};
   try{
    url=URL.createObjectURL(file);img=new Image();
    img.onload=()=>{try{
     const w=img.naturalWidth,h=img.naturalHeight;if(!w||!h)return done({blob:file,name:file.name});
     const s=Math.min(1,1600/Math.max(w,h)),cw=Math.max(1,Math.round(w*s)),ch=Math.max(1,Math.round(h*s));
     const c=document.createElement('canvas');c.width=cw;c.height=ch;
     c.getContext('2d').drawImage(img,0,0,cw,ch);
     c.toBlob(b=>{done(b&&b.size>=3000?{blob:b,name:'licence.jpg'}:{blob:file,name:file.name});},'image/jpeg',0.82);
    }catch(e){done({blob:file,name:file.name});}};
    img.onerror=()=>done({blob:file,name:file.name});
    img.src=url;
   }catch(e){done({blob:file,name:file.name});}
  });
 }
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  const licence=form.elements.licence.files[0];
  if(!licence||!licence.size){status.textContent='Please attach a photo or PDF of your MTO tow driver licence.';return;}
  if(licence.size>15*1024*1024){status.textContent='Your licence copy is too large \u2014 the maximum is 15 MB. Try a smaller photo, then send again.';return;}
  const data=new FormData();
  data.append('first_name',form.elements.first_name.value.trim());
  data.append('last_name',form.elements.last_name.value.trim());
  data.append('nickname',form.elements.nickname.value.trim());
  data.append('phone',form.elements.phone.value.trim());
  data.append('tssea',form.elements.tssea.value.trim());
  data.append('email',form.elements.email.value.trim());
  submit.disabled=true;
  status.textContent='Sending your registration\u2026';
  try{
   const prep=await prepareLicence(licence);
   data.append('licence',prep.blob,prep.name);
   const response=await fetch(ENDPOINT,{method:'POST',body:data});
   const result=await response.json().catch(()=>null);
   if(response.ok){
    form.reset();
    status.textContent='Registration received \u2014 thank you. A Hooked416 manager will review it. Once you are approved, we will email you a link to set your own PIN and open the Private Property app.';
   }else{
    status.textContent=(result&&result.error)?result.error:'Something went wrong sending your registration. Please try again, or call the office at 416-301-0820.';
   }
  }catch(error){
   status.textContent='Your registration could not be sent \u2014 check your connection and try again, or call the office at 416-301-0820.';
  }finally{
   submit.disabled=false;
  }
 });
})();
