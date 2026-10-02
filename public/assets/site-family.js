document.documentElement.classList.add('js');

(function () {
  const path = window.location.pathname;
  const isHome = path === '/' || path === '';
  const isPrivacy = path === '/privacy/' || path === '/privacy';
  const isGuides = path === '/guides/' || path === '/guides';
  const is404 = document.title.startsWith('Page not found');

  function addSkipLink() {
    const main = document.querySelector('main');
    if (!main) return;
    if (!main.id) main.id = 'main';
    if (document.querySelector('.skip-link')) return;

    const link = document.createElement('a');
    link.className = 'skip-link';
    link.href = '#main';
    link.textContent = 'Skip to content';
    document.body.prepend(link);
  }

  function markCurrentNavigation(nav) {
    nav.querySelectorAll('a').forEach((link) => link.removeAttribute('aria-current'));
    if (isGuides) nav.querySelector('a[href="/guides/"]')?.setAttribute('aria-current', 'page');
    else if (isPrivacy) nav.querySelector('a[href="/privacy/"]')?.setAttribute('aria-current', 'page');
    else if (path === '/how-to-play-celebrity-salad/' || path === '/how-to-play-celebrity-salad') nav.querySelector('a[href="/how-to-play-celebrity-salad/"]')?.setAttribute('aria-current', 'page');
  }

  function addMobileNavigation() {
    document.querySelectorAll('header').forEach((header, index) => {
      header.classList.add('site-header');
      const nav = header.querySelector('nav');
      if (!nav) return;
      nav.classList.add('site-nav');
      nav.setAttribute('aria-label', nav.getAttribute('aria-label') || 'Primary navigation');
      markCurrentNavigation(nav);

      if (header.querySelector('.mobile-nav-toggle')) return;
      const navId = nav.id || `site-nav-${index + 1}`;
      nav.id = navId;

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mobile-nav-toggle';
      button.setAttribute('aria-controls', navId);
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Open navigation');
      button.innerHTML = '<span aria-hidden="true"></span>';
      header.appendChild(button);

      const close = () => {
        header.classList.remove('nav-open');
        document.body.classList.remove('mobile-nav-open');
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', 'Open navigation');
      };
      const open = () => {
        header.classList.add('nav-open');
        document.body.classList.add('mobile-nav-open');
        button.setAttribute('aria-expanded', 'true');
        button.setAttribute('aria-label', 'Close navigation');
      };

      button.addEventListener('click', () => header.classList.contains('nav-open') ? close() : open());
      nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && header.classList.contains('nav-open')) {
          close();
          button.focus();
        }
      });
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 600 && header.classList.contains('nav-open')) close();
      });
    });
  }

  function addBreadcrumbs() {
    if (isHome || is404 || document.querySelector('.breadcrumbs')) return;
    const main = document.querySelector('main.shell');
    if (!main) return;

    const currentTitle = isGuides
      ? 'Guides'
      : isPrivacy
        ? 'Privacy'
        : (document.querySelector('.hero h1')?.textContent || document.title.split('|')[0]).replace(/\s+/g, ' ').trim();

    const breadcrumbs = document.createElement('nav');
    breadcrumbs.className = 'breadcrumbs';
    breadcrumbs.setAttribute('aria-label', 'Breadcrumb');

    const parts = ['<a href="/">Home</a>'];
    if (isGuides) {
      parts.push('<span aria-current="page">Guides</span>');
    } else if (isPrivacy) {
      parts.push('<span aria-current="page">Privacy</span>');
    } else {
      parts.push('<a href="/guides/">Guides</a>');
      parts.push(`<span aria-current="page">${currentTitle.replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}</span>`);
    }

    breadcrumbs.innerHTML = parts.join('<span class="breadcrumb-separator" aria-hidden="true">/</span>');
    main.prepend(breadcrumbs);
  }

  function standardiseFooter() {
    document.querySelectorAll('footer').forEach((footer) => {
      footer.classList.add('site-footer');
      const inner = footer.querySelector('.footer-inner');
      if (inner) inner.classList.add('footer-grid');
      else if (footer.classList.contains('shell')) footer.classList.add('footer-grid');

      const nav = footer.querySelector('nav');
      if (nav) nav.setAttribute('aria-label', nav.getAttribute('aria-label') || 'Footer navigation');
    });
  }

  addSkipLink();
  addMobileNavigation();
  addBreadcrumbs();
  standardiseFooter();
})();
