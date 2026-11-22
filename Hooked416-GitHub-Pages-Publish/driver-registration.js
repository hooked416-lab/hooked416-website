(()=>{
 const form=document.getElementById('driver-registration');if(!form)return;
 const status=document.getElementById('registration-status');
 const submit=document.getElementById('register-submit');
 const ENDPOINT='https://hooked416-private-property.hooked416.workers.dev/api/register';
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
  data.append('licence',licence);
  submit.disabled=true;
  status.textContent='Sending your registration\u2026';
  try{
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
