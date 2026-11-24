/* Hooked416 website helper chat — "Your car was towed?"
   A small self-contained widget: grounded FAQ answers + a live
   licence-plate lookup, served by the Hooked416 app Worker
   (POST /api/site-chat and /api/site-lookup). The FAQ below is baked
   in so the common questions answer instantly and still work if the
   chat service is unreachable; anything else goes to the endpoint,
   which answers only from hooked416.com content and never quotes a
   price. Loading this file adds no tracking and stores nothing. */
(function () {
  'use strict';
  var API = 'https://hooked416-private-property.hooked416.workers.dev';
  var PHONE = '416-301-0820';

  var FAQ = [
    { q: 'How do I get my car back?', a: 'Call 416-301-0820 first, bring your driver’s licence and the vehicle ownership (registration), then pick up at our yard at 125 16th Ave, Richmond Hill. Releases are by appointment, so please call before you come.' },
    { q: 'What do I need to bring?', a: 'Your driver’s licence and the vehicle ownership (registration) — and a quick call first, so everything is ready for you when you arrive.' },
    { q: 'Where do I go?', a: '125 16th Ave, Richmond Hill, ON. Releases are by appointment, so please call 416-301-0820 before heading out.' },
    { q: 'What are your hours? Can I pick up my vehicle any time?', a: 'We’re here day and night. Vehicle releases are by appointment only, so call 416-301-0820 any time and we’ll set up your pickup.' },
    { q: 'The vehicle isn’t in my name. Can I still get it back?', a: 'Call us and ask — we’ll explain exactly what you’ll need based on your situation.' },
    { q: 'Why was my car towed?', a: 'Private-property tows are carried out at the request of the property owner or manager, under municipal bylaw, when a vehicle is parked without authorization. Every vehicle we tow is documented and photographed.' },
    { q: 'How much will I owe?', a: 'The amount depends on the tow and the number of days the vehicle has been in storage. Call us and we’ll give you the exact amount owing on your vehicle before you come — no surprises.' },
    { q: 'Does the amount owing change the longer my vehicle stays?', a: 'Yes — storage charges apply for each day the vehicle is in the yard, starting the day it arrives. Call us and we’ll confirm the exact amount owing on your vehicle before you come.' }
  ];
  var CHIPS = ['How do I get my car back?', 'What do I need to bring?', 'Where do I go?', 'What are your hours?', 'Why was my car towed?', 'How much will I owe?'];

  var CSS = [
    '.h416c-launch{position:fixed;right:18px;bottom:24px;z-index:9998;background:#c8102e;color:#fff;border:0;border-radius:999px;padding:13px 20px;font:600 15px/1.2 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;box-shadow:0 6px 22px rgba(0,0,0,.35);cursor:pointer}',
    '.h416c-launch:hover{background:#a50d26}',
    '@media (max-width:820px){.h416c-launch{bottom:86px;right:14px;padding:12px 16px;font-size:14px}}',
    '.h416c-panel{position:fixed;right:18px;bottom:86px;z-index:9999;width:362px;max-width:calc(100vw - 24px);height:520px;max-height:calc(100dvh - 120px);background:#171717;color:#f2f2f2;border-radius:16px;box-shadow:0 14px 44px rgba(0,0,0,.5);display:none;flex-direction:column;overflow:hidden;font:400 14.5px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}',
    '@media (max-width:820px){.h416c-panel{bottom:140px}}',
    '.h416c-panel.open{display:flex}',
    '.h416c-head{background:#c8102e;color:#fff;padding:12px 14px;display:flex;align-items:center;gap:10px}',
    '.h416c-head b{font-size:15.5px;display:block}',
    '.h416c-head span{font-size:12.5px;opacity:.92;display:block}',
    '.h416c-head a{color:#fff;font-weight:700;text-decoration:none;white-space:nowrap}',
    '.h416c-x{margin-left:auto;background:transparent;border:0;color:#fff;font-size:20px;cursor:pointer;padding:2px 6px;line-height:1}',
    '.h416c-msgs{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}',
    '.h416c-m{max-width:86%;padding:9px 12px;border-radius:13px;white-space:pre-wrap;word-wrap:break-word}',
    '.h416c-m.bot{background:#262626;align-self:flex-start;border-bottom-left-radius:4px}',
    '.h416c-m.me{background:#c8102e;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}',
    '.h416c-m a{color:#ffb3ba}',
    '.h416c-m.me a{color:#fff}',
    '.h416c-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 10px}',
    '.h416c-chip{background:#262626;color:#f2f2f2;border:1px solid #3d3d3d;border-radius:999px;padding:6px 11px;font-size:13px;cursor:pointer}',
    '.h416c-chip:hover{border-color:#c8102e}',
    '.h416c-chip.plate{background:#c8102e;border-color:#c8102e;color:#fff;font-weight:600}',
    '.h416c-mode{display:none;padding:0 12px 8px;gap:6px;align-items:center;font-size:13px}',
    '.h416c-mode.on{display:flex}',
    '.h416c-mode button{background:#262626;color:#f2f2f2;border:1px solid #3d3d3d;border-radius:8px;padding:5px 10px;cursor:pointer;font-size:13px}',
    '.h416c-mode button.sel{background:#c8102e;border-color:#c8102e;color:#fff}',
    '.h416c-mode .back{margin-left:auto;color:#ffb3ba;background:none;border:0;text-decoration:underline}',
    '.h416c-form{display:flex;gap:8px;padding:10px 12px calc(10px + env(safe-area-inset-bottom));border-top:1px solid #2c2c2c;background:#1d1d1d}',
    '.h416c-in{flex:1;background:#262626;border:1px solid #3d3d3d;border-radius:10px;color:#fff;padding:10px 11px;font-size:14.5px;min-width:0}',
    '.h416c-in::placeholder{color:#9a9a9a}',
    '.h416c-send{background:#c8102e;color:#fff;border:0;border-radius:10px;padding:0 16px;font-weight:700;cursor:pointer;font-size:14.5px}',
    '.h416c-send:disabled{opacity:.55;cursor:default}',
    '.h416c-typing{opacity:.65;font-style:italic}'
  ].join('\n');

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function init() {
    if (document.querySelector('.h416c-launch')) return;
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var launch = el('button', 'h416c-launch', '🚗 Your car was towed? Chat');
    launch.type = 'button';
    launch.setAttribute('aria-label', 'Open the Hooked416 helper chat');

    var panel = el('section', 'h416c-panel');
    panel.setAttribute('aria-label', 'Hooked416 helper chat');
    var head = el('div', 'h416c-head');
    var htxt = el('div');
    htxt.appendChild(el('b', null, 'Your car was towed?'));
    htxt.appendChild(el('span', null, 'Hooked416 · here day & night'));
    var call = el('a', null, '📞 ' + PHONE);
    call.href = 'tel:+14163010820';
    var x = el('button', 'h416c-x', '×');
    x.type = 'button';
    x.setAttribute('aria-label', 'Close chat');
    head.appendChild(htxt); head.appendChild(call); head.appendChild(x);

    var msgs = el('div', 'h416c-msgs');
    var chips = el('div', 'h416c-chips');
    var mode = el('div', 'h416c-mode');
    var form = el('form', 'h416c-form');
    var input = el('input', 'h416c-in');
    input.type = 'text';
    input.maxLength = 500;
    input.placeholder = 'Ask a question…';
    input.setAttribute('aria-label', 'Type your question');
    var send = el('button', 'h416c-send', 'Send');
    send.type = 'submit';
    form.appendChild(input); form.appendChild(send);
    panel.appendChild(head); panel.appendChild(msgs); panel.appendChild(chips); panel.appendChild(mode); panel.appendChild(form);
    document.body.appendChild(launch);
    document.body.appendChild(panel);

    var history = [];
    var lookupMode = null; // null | 'plate' | 'vin'
    var busy = false;

    function addMsg(text, who) {
      var m = el('div', 'h416c-m ' + who, text);
      msgs.appendChild(m);
      msgs.scrollTop = msgs.scrollHeight;
      return m;
    }
    function pushHistory(role, text) {
      history.push({ role: role, text: text });
      if (history.length > 6) history = history.slice(-6);
    }
    function faqAnswer(q) {
      for (var i = 0; i < FAQ.length; i++) if (FAQ[i].q === q) return FAQ[i].a;
      return null;
    }
    function showFaqList() {
      addMsg('Here are the questions I can answer right away — tap one, or call us at ' + PHONE + ':', 'bot');
      FAQ.forEach(function (f) {
        var c = el('button', 'h416c-chip', f.q);
        c.type = 'button';
        c.addEventListener('click', function () {
          addMsg(f.q, 'me'); addMsg(f.a, 'bot');
          pushHistory('user', f.q); pushHistory('assistant', f.a);
        });
        var wrap = el('div');
        wrap.appendChild(c);
        msgs.appendChild(wrap);
      });
      msgs.scrollTop = msgs.scrollHeight;
    }

    CHIPS.forEach(function (q) {
      var c = el('button', 'h416c-chip', q);
      c.type = 'button';
      c.addEventListener('click', function () {
        if (busy) return;
        addMsg(q, 'me');
        var a = faqAnswer(q === 'What are your hours?' ? 'What are your hours? Can I pick up my vehicle any time?' : q);
        if (a) { addMsg(a, 'bot'); pushHistory('user', q); pushHistory('assistant', a); }
      });
      chips.appendChild(c);
    });
    var plateChip = el('button', 'h416c-chip plate', '🔎 Check my licence plate');
    plateChip.type = 'button';
    plateChip.addEventListener('click', function () { setLookup('plate'); });
    chips.appendChild(plateChip);

    var modeLabel = el('span', null, 'Look up by:');
    var bPlate = el('button', null, 'Licence plate'); bPlate.type = 'button';
    var bVin = el('button', null, 'VIN (last 6)'); bVin.type = 'button';
    var bBack = el('button', 'back', 'Back to questions'); bBack.type = 'button';
    mode.appendChild(modeLabel); mode.appendChild(bPlate); mode.appendChild(bVin); mode.appendChild(bBack);
    function setLookup(kind) {
      lookupMode = kind;
      mode.classList.add('on');
      bPlate.classList.toggle('sel', kind === 'plate');
      bVin.classList.toggle('sel', kind === 'vin');
      input.maxLength = kind === 'plate' ? 12 : 17;
      input.placeholder = kind === 'plate' ? 'Enter your licence plate…' : 'Enter the last 6 of the VIN…';
      if (kind === 'plate') addMsg('Enter your licence plate and I’ll check whether we have the vehicle. You can also use the last 6 characters of the VIN instead.', 'bot');
      input.focus();
    }
    bPlate.addEventListener('click', function () { setLookup('plate'); });
    bVin.addEventListener('click', function () { setLookup('vin'); });
    bBack.addEventListener('click', function () {
      lookupMode = null;
      mode.classList.remove('on');
      input.maxLength = 500;
      input.placeholder = 'Ask a question…';
      input.focus();
    });

    function post(path, body) {
      return fetch(API + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).then(function (r) {
        return r.json().then(function (j) { return { status: r.status, body: j }; });
      });
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var text = input.value.trim();
      if (!text || busy) return;
      input.value = '';
      addMsg(text, 'me');
      busy = true; send.disabled = true;
      var typing = addMsg('One moment…', 'bot h416c-typing');
      var done = function () { typing.remove(); busy = false; send.disabled = false; input.focus(); };

      if (lookupMode) {
        var payload = lookupMode === 'plate' ? { plate: text } : { vin: text };
        post('/api/site-lookup', payload).then(function (res) {
          done();
          var rep = (res.body && res.body.reply) || 'I couldn’t complete that check — please call us at ' + PHONE + ' and we’ll check right away.';
          addMsg(rep, 'bot');
        }).catch(function () {
          done();
          addMsg('I couldn’t reach the lookup just now — please call us at ' + PHONE + ' and we’ll check right away, day or night.', 'bot');
        });
        return;
      }

      post('/api/site-chat', { message: text, history: history }).then(function (res) {
        done();
        var b = res.body || {};
        if (b.reply) {
          addMsg(b.reply, 'bot');
          pushHistory('user', text); pushHistory('assistant', b.reply);
        } else if (b.degraded || b.faq) {
          showFaqList();
        } else {
          addMsg('Sorry, I don’t have that detail — call us at ' + PHONE + ' any time, day or night, and a real person will help.', 'bot');
        }
      }).catch(function () {
        done();
        showFaqList();
      });
    });

    var greeted = false;
    function toggle(open) {
      panel.classList.toggle('open', open);
      if (open && !greeted) {
        greeted = true;
        addMsg('Hi — I’m the Hooked416 helper. If your car was towed from private property, I can tell you how to get it back, or check our yard by licence plate. For anything urgent, call us at ' + PHONE + ' — a real person answers day and night.', 'bot');
      }
      if (open) input.focus();
    }
    launch.addEventListener('click', function () { toggle(!panel.classList.contains('open')); });
    x.addEventListener('click', function () { toggle(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggle(false); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
