(()=>{
 const form=document.getElementById('driver-application');if(!form)return;
 const status=document.getElementById('application-status');
 const certification=form.elements.certificate,certificateFile=form.elements.attachment5,certificatePanel=document.getElementById('tow-certificate-upload'),training=document.getElementById('tow-training');
 function syncCertificate(){const certified=certification.value==='Certified';certificateFile.required=certified;certificateFile.disabled=!certified;certificatePanel.hidden=!certified;training.hidden=certified;}
 certification.addEventListener('change',syncCertificate);window.addEventListener('pageshow',syncCertificate);syncCertificate();
 form.addEventListener('submit',event=>{
  const resume=form.elements.attachment.files[0],survey=form.elements.attachment2.files[0],abstract=form.elements.attachment3.files[0],licence=form.elements.attachment4.files[0],towCertificate=certification.value==='Certified'?certificateFile.files[0]:null;
  let error='';
  if(!resume||!resume.size||resume.size>5000000||!(/\.pdf$/i.test(resume.name)))error='Please attach a PDF résumé of up to 5 MB.';
  else if(!survey||!survey.size||survey.size>5000000||!(/\.(pdf|doc|docx)$/i.test(survey.name)))error='Please attach your completed Intact survey as a PDF, DOC or DOCX of up to 5 MB.';
  else if(!abstract||!abstract.size||abstract.size>5000000||!(/\.pdf$/i.test(abstract.name)))error='Please attach your driver’s abstract as a PDF of up to 5 MB.';
  else if(!licence||!licence.size||licence.size>5000000||!(/\.(jpe?g|png|heic|heif)$/i.test(licence.name)))error='Please attach a driver’s licence photo as JPG, PNG or HEIC/HEIF of up to 5 MB.';
  else if(certification.value==='Certified'&&(!towCertificate||!towCertificate.size||towCertificate.size>5000000||!(/\.(pdf|jpe?g|png|heic|heif)$/i.test(towCertificate.name))))error='Please attach your tow driver certificate as a photo or PDF of up to 5 MB.';
  else if(resume.size+survey.size+abstract.size+licence.size+(towCertificate?.size||0)>10000000)error='All your attachments must total 10 MB or less. Reduce the photo size or compress your PDFs, then try again.';
  if(error){event.preventDefault();status.textContent=error;return;}
  status.textContent='Continue on the next screen to verify and send your answers, résumé, Intact survey, driver’s abstract and licence photo.';
 });
})();
