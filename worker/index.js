const CONSENT_AND_ANALYTICS = `<style id="celebrity-salad-cookie-consent-styles">
.cookie-banner{position:fixed;z-index:1000;right:20px;bottom:20px;left:20px;width:min(760px,calc(100% - 40px));margin-inline:auto;padding:18px;display:flex;align-items:center;justify-content:space-between;gap:22px;border:1px solid rgba(255,255,255,.14);border-radius:18px;background:rgba(33,26,49,.98);color:#fff8ea;box-shadow:0 20px 60px rgba(20,10,50,.42);backdrop-filter:blur(18px);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",Inter,system-ui,sans-serif}.cookie-copy{max-width:510px}.cookie-copy strong{display:block;margin-bottom:6px;font-size:15px;font-weight:750}.cookie-copy p{margin:0;color:rgba(255,248,234,.76);font-size:13px;line-height:1.55}.cookie-copy a{color:#fff8ea;text-underline-offset:3px}.cookie-actions{display:flex;flex-shrink:0;gap:8px}.cookie-button{min-height:42px;padding:0 14px;border-radius:11px;font-family:inherit;font-size:13px;font-weight:750;cursor:pointer}.cookie-button-primary{border:1px solid #f5c84b;background:#f5c84b;color:#211a31}.cookie-button-secondary{border:1px solid rgba(255,255,255,.22);background:transparent;color:#fff8ea}.cookie-settings-link{padding:0;border:0;background:transparent;color:inherit;font:inherit;font-weight:700;cursor:pointer;text-decoration:none;opacity:.8}.cookie-settings-link:hover{opacity:1}@media(max-width:760px){.cookie-banner{align-items:stretch;flex-direction:column;gap:16px}.cookie-actions{width:100%}.cookie-button{flex:1}}
</style>
<script>
(function(){
  const GA_MEASUREMENT_ID = 'G-EK35PP7RER';
  const CONSENT_STORAGE_KEY = 'celebrity-salad-analytics-consent';
  let analyticsLoaded = false;

  function getConsentChoice(){
    try { return window.localStorage.getItem(CONSENT_STORAGE_KEY); } catch { return null; }
  }

  function saveConsentChoice(choice){
    try { window.localStorage.setItem(CONSENT_STORAGE_KEY, choice); } catch { /* no-op */ }
  }

  function deleteAnalyticsCookies(){
    document.cookie.split(';').forEach(function(cookie){
      const name = cookie.split('=')[0].trim();
      if (!name.startsWith('_ga')) return;
      const expires = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = name + '=; ' + expires + '; path=/; SameSite=Lax';
      document.cookie = name + '=; ' + expires + '; path=/; domain=.' + window.location.hostname + '; SameSite=Lax';
    });
  }

  function disableAnalytics(){
    window['ga-disable-' + GA_MEASUREMENT_ID] = true;
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }
    deleteAnalyticsCookies();
  }

  function loadAnalytics(){
    if (analyticsLoaded) {
      window['ga-disable-' + GA_MEASUREMENT_ID] = false;
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied'
        });
      }
      return;
    }

    analyticsLoaded = true;
    window['ga-disable-' + GA_MEASUREMENT_ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(){ window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(script);
  }

  function removeConsentBanner(){
    const existing = document.querySelector('[data-cookie-banner]');
    if (existing) existing.remove();
  }

  function applyConsent(choice){
    saveConsentChoice(choice);
    if (choice === 'accepted') loadAnalytics();
    else disableAnalytics();
    removeConsentBanner();
  }

  function showConsentBanner(){
    removeConsentBanner();
    const banner = document.createElement('section');
    banner.className = 'cookie-banner';
    banner.dataset.cookieBanner = '';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'cookie-title');
    banner.setAttribute('aria-describedby', 'cookie-description');
    banner.innerHTML = '<div class="cookie-copy"><strong id="cookie-title">Website analytics</strong><p id="cookie-description">We use optional Google Analytics cookies to understand how the Celebrity Salad website is used. Analytics stays off unless you accept. <a href="/privacy/#website">Privacy policy</a></p></div><div class="cookie-actions"><button type="button" class="cookie-button cookie-button-secondary" data-cookie-reject>Reject</button><button type="button" class="cookie-button cookie-button-primary" data-cookie-accept>Accept analytics</button></div>';
    banner.querySelector('[data-cookie-reject]').addEventListener('click', function(){ applyConsent('rejected'); });
    banner.querySelector('[data-cookie-accept]').addEventListener('click', function(){ applyConsent('accepted'); });
    document.body.appendChild(banner);
  }

  function addCookieSettingsLink(){
    const footer = document.querySelector('footer');
    if (!footer || footer.querySelector('[data-cookie-settings]')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cookie-settings-link';
    button.dataset.cookieSettings = '';
    button.textContent = 'Cookie settings';
    button.addEventListener('click', showConsentBanner);

    const links = footer.querySelector('nav') || footer.querySelector('.footer-inner > div:last-child') || footer.querySelector('.footer-grid > div:last-child');
    if (links) links.appendChild(button);
    else footer.appendChild(button);
  }

  const consentChoice = getConsentChoice();
  if (consentChoice === 'accepted') loadAnalytics();
  else disableAnalytics();

  function bootConsentUI(){
    addCookieSettingsLink();
    if (consentChoice !== 'accepted' && consentChoice !== 'rejected') showConsentBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootConsentUI, { once: true });
  } else {
    bootConsentUI();
  }
})();
</script>`;

const SITE_FOUNDATION_STYLES = '<link rel="stylesheet" href="/assets/m3-audit.css">';
const SITE_FAMILY_SCRIPT = '<script src="/assets/site-family.js" defer></script>';

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('text/html')) {
      return response;
    }

    return new HTMLRewriter()
      .on('head', {
        element(element) {
          element.prepend(CONSENT_AND_ANALYTICS, { html: true });
          element.append(SITE_FOUNDATION_STYLES, { html: true });
          element.append(SITE_FAMILY_SCRIPT, { html: true });
        },
      })
      .transform(response);
  },
};
