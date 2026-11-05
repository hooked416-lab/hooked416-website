(() => {
  'use strict';
  const ID = 'G-HZW01R1R5P';
  const KEY = 'h416-analytics-consent-v1';
  const LIFETIME = 180 * 24 * 60 * 60 * 1000;
  const live = ['hooked416.com', 'www.hooked416.com'].includes(location.hostname);
  const disableKey = `ga-disable-${ID}`;
  let choice = null;
  let started = false;
  let lastFocus = null;
  window[disableKey] = true;

  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && ['accepted', 'declined'].includes(saved.choice) &&
        saved.at <= Date.now() && Date.now() - saved.at < LIFETIME) choice = saved.choice;
  } catch { /* Storage can be unavailable in private browsing. */ }

  // Only the published canonical page and referrer's origin enter reports.
  // Never send query strings, fragment identifiers, form contents or SMS bodies.
  const canonical = document.querySelector('link[rel="canonical"]');
  let pageLocation = 'https://hooked416.com/';
  try {
    const url = new URL(canonical?.href || pageLocation);
    if (url.origin === 'https://hooked416.com') pageLocation = url.origin + url.pathname;
  } catch { /* Use the safe homepage fallback. */ }
  let referrer = '';
  try {
    const url = new URL(document.referrer);
    if (['http:', 'https:'].includes(url.protocol)) referrer = url.origin + '/';
  } catch { /* Direct visits have no referrer. */ }

  // Recognize only the campaign labels we publish, never arbitrary query values.
  // Page addresses remain query-free, including customer details and click IDs.
  const campaignData = {};
  try {
    const params = new URL(location.href).searchParams;
    const source = params.get('utm_source');
    const medium = params.get('utm_medium');
    const name = params.get('utm_campaign');
    const knownGoogle = source === 'google' && medium === 'organic' && name === 'google_business_profile';
    const knownInstagram = source === 'instagram' && medium === 'social' &&
      ['instagram_bio', 'roadside_help', 'collision_support', 'recovery', 'vehicle_storage'].includes(name);
    const knownTikTok = source === 'tiktok' && medium === 'social' &&
      ['tiktok_bio', 'roadside_help', 'collision_support', 'recovery', 'vehicle_storage'].includes(name);
    if (knownGoogle || knownInstagram || knownTikTok) {
      campaignData.campaign_source = source;
      campaignData.campaign_medium = medium;
      campaignData.campaign_name = name;
      const content = params.get('utm_content');
      if (['profile_website', 'story', 'feed', 'google_post'].includes(content)) campaignData.campaign_content = content;
    }
  } catch { /* Ignore invalid campaign URLs. */ }

  function clearAnalyticsCookies() {
    for (const part of document.cookie.split(';')) {
      const name = part.trim().split('=')[0];
      if (!/^_ga(?:_|$)/.test(name)) continue;
      for (const domain of ['', location.hostname, '.hooked416.com', 'hooked416.com']) {
        document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${domain ? `; domain=${domain}` : ''}`;
      }
    }
  }

  function startAnalytics() {
    if (choice !== 'accepted' || !live) return;
    window[disableKey] = false;
    if (started) {
      window.gtag('consent', 'update', {analytics_storage: 'granted'});
      return;
    }
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('set', {
      page_location: pageLocation, page_referrer: referrer,
      page_title: document.title, allow_google_signals: false,
      allow_ad_personalization_signals: false, ads_data_redaction: true
    });
    window.gtag('consent', 'update', {analytics_storage: 'granted'});
    window.gtag('js', new Date());
    window.gtag('config', ID, {
      send_page_view: false, cookie_expires: LIFETIME / 1000,
      cookie_flags: 'SameSite=Lax;Secure',
      allow_google_signals: false, allow_ad_personalization_signals: false,
      page_location: pageLocation, page_referrer: referrer,
      ...campaignData
    });
    window.gtag('event', 'page_view', {send_to: ID});
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
    document.head.append(script);
  }

  const panel = document.createElement('section');
  panel.className = 'h416-analytics-choice';
  panel.hidden = true;
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-labelledby', 'h416-analytics-title');
  panel.innerHTML = '<h2 id="h416-analytics-title">Website analytics</h2>' +
    '<p>Allow Google Analytics cookies to help us understand visits and improve our website? Your choice won’t affect getting help.</p>' +
    '<div class="h416-analytics-actions"><button type="button" data-analytics-accept>Allow analytics</button><button type="button" data-analytics-decline>Decline</button></div>' +
    '<a href="/privacy/#website-analytics">Privacy &amp; analytics details</a>';
  document.body.append(panel);
  const settings = document.querySelectorAll('[data-analytics-settings]');
  const status = document.querySelector('[data-analytics-status]');
  function showStatus() {
    if (status) status.textContent = choice === 'accepted' ? 'Analytics is allowed in this browser.' :
      choice === 'declined' ? 'Analytics is turned off in this browser.' : 'Analytics is off until you choose to allow it.';
  }
  function select(value) {
    choice = value;
    try { localStorage.setItem(KEY, JSON.stringify({choice, at: Date.now()})); } catch { /* Keep choice for this page. */ }
    if (choice === 'accepted') startAnalytics();
    else {
      window[disableKey] = true;
      if (started) window.gtag('consent', 'update', {analytics_storage: 'denied'});
      clearAnalyticsCookies();
    }
    panel.hidden = true;
    showStatus();
    if (lastFocus?.isConnected) lastFocus.focus({preventScroll: true});
    lastFocus = null;
  }
  panel.querySelector('[data-analytics-accept]').addEventListener('click', () => select('accepted'));
  panel.querySelector('[data-analytics-decline]').addEventListener('click', () => select('declined'));
  for (const button of settings) {
    button.hidden = false;
    button.addEventListener('click', () => {
      lastFocus = button;
      panel.hidden = false;
      panel.querySelector('button').focus({preventScroll: true});
    });
  }
  document.addEventListener('click', event => {
    if (choice !== 'accepted' || !started || window[disableKey]) return;
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    let name = '';
    if (/^tel:/i.test(href)) name = 'call_click';
    else if (/^sms:/i.test(href)) name = 'text_click';
    else {
      try {
        const url = new URL(href, location.href);
        if (url.origin === location.origin && (url.hash === '#contact' || url.pathname === '/private-property-tow/')) name = 'request_click';
      } catch { /* Ignore malformed links. */ }
    }
    if (name) window.gtag('event', name, {send_to: ID});
  });
  showStatus();
  if (choice === 'accepted') startAnalytics();
  else {
    clearAnalyticsCookies();
    if (!choice) panel.hidden = false;
  }
})();
