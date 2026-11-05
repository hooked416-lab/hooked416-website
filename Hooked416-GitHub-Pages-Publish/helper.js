/* Free, scripted service helper. No AI, tracking, network requests or message storage. */
(()=>{
const host=document.createElement('div');host.className='h416-helper';
host.innerHTML=`<button class="h416-launch" type="button" aria-expanded="false" aria-controls="h416-panel">Chat with Hooked416</button>
<section id="h416-panel" class="h416-panel" aria-label="Hooked416 service helper" hidden>
<header class="h416-head"><div><strong>How can we help?</strong><span>Quick answers · Call or text Mike</span></div><button type="button" class="h416-close" aria-label="Close service helper">×</button></header>
<div class="h416-body"><p class="h416-note">This is an automated menu, not AI or a live agent. For immediate assistance, call Mike.</p>
<div class="h416-topics" aria-label="Choose a question"></div><div class="h416-answer" role="status" aria-live="polite" aria-atomic="true">Choose a topic above, or prepare a text below.</div>
<form class="h416-form"><h3>Tell Mike what you need</h3><label for="h416-location">Location or nearest intersection</label><input id="h416-location" name="location" maxlength="160" autocomplete="off" placeholder="Street, city or highway exit">
<label for="h416-vehicle">Vehicle</label><input id="h416-vehicle" name="vehicle" maxlength="100" autocomplete="off" placeholder="Year, make and model">
<label for="h416-need">What do you need help with?</label><textarea id="h416-need" name="need" maxlength="500" rows="2" placeholder="Tell us what happened"></textarea>
<p class="h416-note">Details stay on this page until you choose to send them. Please don’t enter payment details or identity documents.</p><button class="h416-text" type="submit">Prepare text to Mike</button></form>
<div class="h416-draft" hidden><label for="h416-message">Your message</label><textarea id="h416-message" rows="4" readonly></textarea><a class="h416-send" href="sms:+14163010820">Open text message</a><button type="button" class="h416-copy">Copy message</button><p class="h416-note">Your messaging app opens with a draft. Tap Send there. Nothing has been sent from this website. If texting isn’t available on this device, copy the message and send it to 416-301-0820.</p></div>
<p class="h416-notice" role="status"></p><p class="h416-note">Requests need confirmation from the team. This helper does not dispatch a truck or confirm a price or arrival time.</p></div>
<footer class="h416-foot"><a href="tel:+14163010820">Call Mike · 416-301-0820</a></footer></section>`;
document.body.append(host);
const $=s=>host.querySelector(s),launch=$('.h416-launch'),panel=$('.h416-panel');
function close(){panel.hidden=true;launch.setAttribute('aria-expanded','false');launch.focus();}
launch.addEventListener('click',()=>{if(!panel.hidden){close();return;}panel.hidden=false;launch.setAttribute('aria-expanded','true');$('.h416-close').focus();});
$('.h416-close').addEventListener('click',close);host.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.preventDefault();close();}});
const topics=[
['Towing & roadside','We offer towing, flatbed transport, battery boosts, tire changes, lockouts and fuel delivery. Tell Mike your location, vehicle and what happened so the team can confirm the right assistance.','/#services','Browse all 20 services'],
['Specialty transport','Motorcycles, off-road vehicles, enclosed transport, boats, trailers, goosenecks and campers can be discussed with the team. Share dimensions, weight, vehicle condition and access before booking.','/#services','Explore transport services'],
['Price & arrival time','Prices and arrival times depend on the job, location, vehicle and availability. Call or text Mike for confirmation. Posted rates and certificates are available on the website.','/#rates','View rates & certificates'],
['Vehicle release','Vehicle releases are by appointment only. Call before visiting or sending a carrier so the team can confirm release status, required arrangements and your pickup time.','/#vehicle-release','Vehicle release information'],
['Private property tow','Authorized property representatives can complete our private-property towing request form. Requests require team review and do not automatically dispatch a truck.','/private-property-tow/','Open property towing request'],
['Apply to drive','Our driver application includes a questionnaire and document uploads. Use the application page to submit your résumé and required documents.','/careers/','Apply to become a driver']
];
for(const [label,answer,url,linkText] of topics){const button=document.createElement('button');button.type='button';button.textContent=label;$('.h416-topics').append(button);button.addEventListener('click',()=>{const box=$('.h416-answer'),p=document.createElement('p'),a=document.createElement('a');p.textContent=answer;a.href=url;a.textContent=linkText;box.replaceChildren(p,a);});}
$('.h416-form').addEventListener('submit',e=>{e.preventDefault();const fields=[['Location',$('#h416-location').value.trim()],['Vehicle',$('#h416-vehicle').value.trim()],['Help needed',$('#h416-need').value.trim()]];const message='Hi Mike, I’m contacting Hooked416 through your website.\n'+fields.filter(x=>x[1]).map(x=>x.join(': ')).join('\n');$('#h416-message').value=message;const apple=/iPhone|iPad|iPod/.test(navigator.userAgent)||(/Mac/.test(navigator.platform)&&navigator.maxTouchPoints>1);$('.h416-send').href='sms:+14163010820'+(apple?'&':'?')+'body='+encodeURIComponent(message);$('.h416-draft').hidden=false;$('.h416-notice').textContent='Draft ready. Review it, then open your messaging app to send.';$('.h416-send').focus();});
$('.h416-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#h416-message').value);$('.h416-notice').textContent='Copied. Paste into a text to 416-301-0820.';}catch{ $('#h416-message').focus();$('#h416-message').select();$('.h416-notice').textContent='Select and copy the message, then text 416-301-0820.';}});
})();
