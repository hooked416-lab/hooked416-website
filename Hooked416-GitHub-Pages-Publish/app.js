// Append-only daily fact archive. One entry per Toronto calendar day from the epoch; never wrap or reorder.
(() => {
  'use strict';
  const factLink = document.getElementById('ticker-fact');
  if (!factLink) return;
  const facts = [
  {
    "text": "Did you know? An early tow truck was built from a 1913 Cadillac by Ernest Holmes Sr.",
    "source": "https://towingmuseum.com/about-the-museum/"
  },
  {
    "text": "Did you know? Ford introduced the Model T in 1908.",
    "source": "https://corporate.ford.com/articles/history/the-model-t/"
  },
  {
    "text": "Did you know? Volvo introduced Nils Bohlin's three-point safety belt in 1959.",
    "source": "https://www.volvocars.com/en-ca/safety/legacy/"
  },
  {
    "text": "Did you know? A Model T stuck in a ditch helped inspire Ernest Holmes Sr.'s tow-truck invention.",
    "source": "https://towingmuseum.com/about-the-museum/"
  },
  {
    "text": "Did you know? Early Model Ts came with a tool kit. Roadside preparedness has a long history!",
    "source": "https://corporate.ford.com/articles/history/the-model-t/"
  },
  {
    "text": "Did you know? Astronaut seating helped inspire Volvo's rear-facing child seat, introduced in 1972.",
    "source": "https://www.volvocars.com/en-ca/safety/legacy/"
  },
  {
    "text": "Did you know? Chattanooga, Tennessee, is credited as the birthplace of the tow truck.",
    "source": "https://towingmuseum.com/about-the-museum/"
  },
  {
    "text": "Did you know? A windshield was optional on early Model Ts before becoming standard.",
    "source": "https://corporate.ford.com/articles/history/the-model-t/"
  },
  {
    "text": "Did you know? Volvo introduced a booster cushion for older children in 1978.",
    "source": "https://www.volvocars.com/en-ca/safety/legacy/"
  },
  {
    "text": "Did you know? The towing museum began as a travelling exhibit inside a semi-trailer.",
    "source": "https://towingmuseum.com/about-the-museum/"
  },
  {
    "text": "Did you know? Early Model Ts were started with a hand crank.",
    "source": "https://corporate.ford.com/articles/history/the-model-t/"
  },
  {
    "text": "Did you know? In 1990, Volvo introduced a booster cushion built into the car seat.",
    "source": "https://www.volvocars.com/en-ca/safety/legacy/"
  },
  {
    "text": "Did you know? The towing museum chose Chattanooga as its permanent home in 1995.",
    "source": "https://towingmuseum.com/about-the-museum/"
  },
  {
    "text": "Did you know? The Model T's famous nickname was Tin Lizzie.",
    "source": "https://corporate.ford.com/articles/history/the-model-t/"
  },
  {
    "text": "Did you know? Volvo's first-generation blind-spot information system used cameras to detect nearby vehicles.",
    "source": "https://www.volvocars.com/en-ca/safety/legacy/"
  },
  {
    "text": "Did you know? The first Towing Hall of Fame class, in 1985, had 27 members.",
    "source": "https://towingmuseum.com/about-the-museum/"
  },
  {
    "text": "Did you know? Ford built and sold more than 15 million Model Ts.",
    "source": "https://corporate.ford.com/articles/history/the-model-t/"
  },
  {
    "text": "Did you know? Volvo introduced its Side Impact Protection System in 1991.",
    "source": "https://www.volvocars.com/en-ca/safety/legacy/"
  },
  {
    "text": "Did you know? Holmes designed a split-boom wrecker that could anchor on one side and recover from the other.",
    "source": "https://towingmuseum.com/about-the-museum/"
  },
  {
    "text": "Did you know? Ford built the Model T on a moving assembly line at its Highland Park plant.",
    "source": "https://corporate.ford.com/articles/history/the-model-t/"
  },
  {
    "text": "Did you know? Volvo shared its three-point safety-belt patent with the wider car industry.",
    "source": "https://www.volvocars.com/en-ca/safety/legacy/"
  },
  {
    "text": "Electric cars were already on the road in the nineteenth century.",
    "source": "https://www.energy.gov/articles/history-electric-car"
  },
  {
    "text": "Bosch's 1902 ignition system used a spark plug instead of mechanical break-spark rods.",
    "source": "https://www.bosch-mobility.com/en/company/milestones/"
  },
  {
    "text": "William Morrison's early electric vehicle carried six people and reached about 14 mph.",
    "source": "https://www.energy.gov/articles/history-electric-car"
  },
  {
    "text": "A 1921 Bosch horn borrowed an acoustic principle from pipe organs.",
    "source": "https://www.bosch-mobility.com/en/company/milestones/"
  },
  {
    "text": "New York City once had more than 60 electric taxis around the turn of the twentieth century.",
    "source": "https://www.energy.gov/articles/history-electric-car"
  },
  {
    "text": "Bosch's 1928 turn indicator was an illuminated arm that swung out from its housing.",
    "source": "https://www.bosch-mobility.com/en/company/milestones/"
  },
  {
    "text": "Early motorists could choose between steam, petrol and electric power.",
    "source": "https://www.energy.gov/articles/history-electric-car"
  },
  {
    "text": "The early Blaupunkt Auto-Super 5 car radio weighed about 12 kilograms.",
    "source": "https://www.bosch-mobility.com/en/company/milestones/"
  },
  {
    "text": "Some early steam cars needed as long as 45 minutes to start in cold weather.",
    "source": "https://www.energy.gov/articles/history-electric-car"
  },
  {
    "text": "Bosch began manufacturing its own vehicle batteries in 1922.",
    "source": "https://www.bosch-mobility.com/en/company/milestones/"
  },
  {
    "text": "Thomas Edison worked on improving batteries for electric vehicles.",
    "source": "https://www.energy.gov/articles/history-electric-car"
  },
  {
    "text": "Bosch introduced an electric windshield-wiper motor in 1926.",
    "source": "https://www.bosch-mobility.com/en/company/milestones/"
  },
  {
    "text": "Henry Ford and Thomas Edison explored an affordable electric car together in 1914.",
    "source": "https://www.energy.gov/articles/history-electric-car"
  },
  {
    "text": "Bosch's 1913 lighting system combined headlights, a generator, a battery and a voltage regulator.",
    "source": "https://www.bosch-mobility.com/en/company/milestones/"
  },
  {
    "text": "The US Postal Service tested electric delivery Jeeps in 1975.",
    "source": "https://www.energy.gov/articles/history-electric-car"
  },
  {
    "text": "Bosch's 1937 retrofit car heater also helped clear mist from windows.",
    "source": "https://www.bosch-mobility.com/en/company/milestones/"
  },
  {
    "text": "The Toyota Prius launched in Japan in 1997 before its worldwide release in 2000.",
    "source": "https://www.energy.gov/articles/history-electric-car"
  },
  {
    "text": "Bosch demonstrated petrol injection in two-stroke passenger cars at the 1951 Frankfurt motor show.",
    "source": "https://www.bosch-mobility.com/en/company/milestones/"
  },
  {
    "text": "The original Prius used a nickel-metal-hydride battery.",
    "source": "https://www.energy.gov/articles/history-electric-car"
  },
  {
    "text": "Bosch's 1959 three-phase alternator could charge a battery while the engine idled.",
    "source": "https://www.bosch-mobility.com/en/company/milestones/"
  }
];
  const dateFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit'
  });
  const epoch = Date.UTC(2026, 10, 5);
  function refreshDailyFact() {
    const parts = Object.fromEntries(dateFormatter.formatToParts(new Date()).map(p => [p.type, p.value]));
    const dateKey = parts.year + '-' + parts.month + '-' + parts.day;
    if (factLink.dataset.factDate === dateKey) return;
    const day = Math.floor((Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)) - epoch) / 86400000);
    // Never recycle a past fact if the publication queue runs out.
    const bar = document.querySelector('.fact-ticker');
    if (day < 0 || day >= facts.length) {
      if (bar) bar.style.display = 'none';
      return;
    }
    if (bar) bar.style.display = '';
    const fact = facts[day];
    factLink.textContent = fact.text;
    factLink.href = fact.source;
    factLink.dataset.factDate = dateKey;
    factLink.title = 'Daily fact for ' + dateKey + ' (Toronto time). Click to read the source.';
  }
  refreshDailyFact();
  // Date comparison handles daylight-saving changes and tabs left open overnight.
  setInterval(refreshDailyFact, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshDailyFact(); });
  window.addEventListener('pageshow', refreshDailyFact);
})();

(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const nav = $('#main-nav');
  const toggle = $('.menu-toggle');
  function closeMenu() {
    nav?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Open navigation');
  }
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => { if (!e.target.closest('.site-header')) closeMenu(); });

  const checks = [...document.querySelectorAll('[data-release-check]')];
  checks.forEach(c => c.addEventListener('change', () => {
    $('#release-progress').textContent = `${checks.filter(c => c.checked).length} of 4 preparation steps checked`;
  }));

  const form = $('#request-form');
  if (!form) return;
  const fields = ['service', 'name', 'phone', 'location', 'vehicle', 'timing', 'destination', 'date', 'notes'];
  const controls = Object.fromEntries(fields.map(id => [id, document.getElementById(id)]));
  let message = '';
  const focusForm = () => {
    $('#request-preview').hidden = true;
    $('#form-status').textContent = '';
  };
  function setService(value) {
    if ([...controls.service.options].some(o => o.value === value)) controls.service.value = value;
    focusForm();
  }
  document.querySelectorAll('[data-service]').forEach(a => a.addEventListener('click', () => setService(a.dataset.service)));
  document.querySelectorAll('[data-area]').forEach(a => a.addEventListener('click', () => {
    controls.location.value = a.dataset.area;
    focusForm();
    $('#location-status').textContent = 'Add an exact address or intersection so we can find you.';
  }));
  const params = new URLSearchParams(window.location.search);
  if (params.has('service')) setService(params.get('service'));

  const now = new Date();
  const localDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  controls.date.min = localDate;
  controls.timing.addEventListener('change', () => {
    const scheduled = controls.timing.value === 'Scheduled date';
    $('#date-field').hidden = !scheduled;
    controls.date.required = scheduled;
    if (!scheduled) controls.date.value = '';
  });
  ['name', 'phone', 'location', 'vehicle'].forEach(id => controls[id].addEventListener('input', () => controls[id].setCustomValidity('')));

  $('#get-location')?.addEventListener('click', () => {
    const status = $('#location-status');
    const button = $('#get-location');
    if (!navigator.geolocation) {
      status.textContent = 'Location is unavailable in this browser. Enter an address or intersection.';
      return;
    }
    button.disabled = true;
    status.textContent = 'Waiting for location permission…';
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude.toFixed(6);
      const lon = position.coords.longitude.toFixed(6);
      controls.location.value = `https://maps.google.com/?q=${lat},${lon}`;
      controls.location.setCustomValidity('');
      status.textContent = `Location added (approx. ${Math.round(position.coords.accuracy)} m accuracy). Check that it is your pickup location.`;
      button.disabled = false;
    }, error => {
      status.textContent = error.code === 1 ? 'Location permission was declined. Enter an address or intersection instead.' : 'Could not find your location. Enter an address or intersection instead.';
      button.disabled = false;
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 });
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    for (const id of ['name', 'location', 'vehicle']) {
      controls[id].setCustomValidity(controls[id].value.trim() ? '' : 'Please enter this detail.');
    }
    const digits = controls.phone.value.replace(/\D/g, '');
    controls.phone.setCustomValidity(digits.length >= 10 && digits.length <= 15 ? '' : 'Please enter a callback number with at least 10 digits.');
    if (!form.reportValidity()) return;
    const val = (id) => controls[id].value.trim();
    message = [
      'Hello Hooked416, I would like to request assistance.',
      '',
      `Service: ${val('service')}`,
      `Name: ${val('name')}`,
      `Callback: ${val('phone')}`,
      `Location: ${val('location')}`,
      `Vehicle/equipment: ${val('vehicle')}`,
      `Timing: ${val('timing')}${val('date') ? ' — ' + val('date') : ''}`,
      val('destination') ? `Destination: ${val('destination')}` : '',
      val('notes') ? `Details: ${val('notes')}` : '',
      '',
      'Please confirm availability, pricing and arrangements. Thank you.'
    ].filter((line, i, arr) => line || i === 1 || i === arr.length - 2).join('\n');
    $('#message-preview').textContent = message;
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    $('#send-sms').href = `sms:+14163010820${ios ? '&' : '?'}body=${encodeURIComponent(message)}`;
    $('#request-preview').hidden = false;
    $('#copy-status').textContent = '';
    $('#form-status').textContent = '';
    $('#request-preview').scrollIntoView({behavior:'smooth',block:'center'});
    $('#send-sms').focus({preventScroll:true});
  });
  $('#edit-request').addEventListener('click', () => {
    focusForm();
    controls.service.focus();
  });
  $('#copy-request').addEventListener('click', async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(message);
      else {
        const textarea = document.createElement('textarea');
        textarea.value = message;
        textarea.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
        document.body.append(textarea);
        textarea.select();
        const copied = document.execCommand('copy');
        textarea.remove();
        if (!copied) throw new Error('Copy unavailable');
      }
      $('#copy-status').textContent = 'Copied. Paste into your messaging app and send to 416-301-0820.';
    } catch {
      $('#copy-status').textContent = 'Copy is unavailable in this browser. Select the message above and copy it manually, or call 416-301-0820.';
    }
  });
})();

// Independent, accessible fleet and OPP photo slideshows.
document.querySelectorAll('[data-carousel]').forEach(carousel => {
 const slides = [...carousel.querySelectorAll('.carousel-slide')];
 const controls = carousel.querySelector('.carousel-controls');
 const play = carousel.querySelector('[data-play]');
 const count = carousel.querySelector('[data-count]');
 let current = 0, running = !matchMedia('(prefers-reduced-motion: reduce)').matches, timer;
 const show = index => {
  current = (index + slides.length) % slides.length;
  slides.forEach((slide,i) => { slide.hidden = i !== current; });
  count.textContent = `${current + 1} / ${slides.length}`;
 };
 const stopTimer = () => clearInterval(timer);
 const sync = () => {
  stopTimer(); play.textContent = running ? 'Pause slideshow' : 'Play slideshow';
  count.setAttribute('aria-live', running ? 'off' : 'polite');
  if (running && !document.hidden && !carousel.matches(':hover') && !carousel.contains(document.activeElement)) timer = setInterval(() => show(current + 1), 6000);
 };
 const manual = direction => { running = false; show(current + direction); sync(); };
 controls.hidden = false; show(0); sync();
 carousel.querySelector('[data-prev]').addEventListener('click', () => manual(-1));
 carousel.querySelector('[data-next]').addEventListener('click', () => manual(1));
 play.addEventListener('click', () => { running = !running; sync(); });
 carousel.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); manual(event.key === 'ArrowLeft' ? -1 : 1); }
 });
 carousel.addEventListener('mouseenter', stopTimer);
 carousel.addEventListener('mouseleave', sync);
 carousel.addEventListener('focusin', stopTimer);
 carousel.addEventListener('focusout', () => setTimeout(sync,0));
 document.addEventListener('visibilitychange', sync);
 let touchStart;
 carousel.addEventListener('touchstart', e => { touchStart = e.changedTouches[0].clientX; }, {passive:true});
 carousel.addEventListener('touchend', e => { const delta=e.changedTouches[0].clientX-touchStart; if(Math.abs(delta)>50)manual(delta<0?1:-1); }, {passive:true});
});

// Scrolling controls for the daily fact, including reduced-motion support.
(()=>{const bar=document.querySelector('.fact-ticker'),button=document.getElementById('ticker-pause');if(!bar)return;let paused=matchMedia('(prefers-reduced-motion: reduce)').matches;function sync(){bar.classList.toggle('is-paused',paused);button.textContent=paused?'Play':'Pause';button.setAttribute('aria-label',paused?'Play scrolling fact':'Pause scrolling fact');}button.addEventListener('click',()=>{paused=!paused;sync();});sync();})();
(()=>{const box=document.querySelector('.review-carousel');if(!box)return;const slides=[...box.querySelectorAll('.review-slide')];let index=0,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;const toggle=document.getElementById('review-pause');function render(){slides.forEach((s,i)=>s.hidden=i!==index);document.getElementById('review-position').textContent=(index+1)+' / '+slides.length;toggle.textContent=paused?'Play reviews':'Pause reviews';}function move(n){index=(index+n+slides.length)%slides.length;render();}document.getElementById('review-prev').addEventListener('click',()=>{paused=true;move(-1);});document.getElementById('review-next').addEventListener('click',()=>{paused=true;move(1);});toggle.addEventListener('click',()=>{paused=!paused;render();});setInterval(()=>{if(!paused&&!document.hidden&&!box.matches(':hover')&&!box.contains(document.activeElement))move(1);},8000);render();})();
