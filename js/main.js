document.addEventListener('DOMContentLoaded', () => {
  initBackToTop();
  initStickyHeader();
  runContentInits();
  initAjaxNav();
});

// Inits that depend on the header/content region and must re-run every time
// that region is swapped in by the AJAX navigation below.
function runContentInits() {
  initHeroTypewriter();
  initAccordion();
  initFaqAccordion();
  initWhySlider();
  initShowcaseSlider();
  initStoriesShowcase();
  initHelpDarkSlider();
  initVideoPosters();
  initCalendlyButtons();
  initRealityCheckModal();
  initScrollReveal();
  initMobileNav();
}

function initFaqAccordion() {
  const items = document.querySelectorAll('.ppc-faq__item');
  if (!items.length) return;

  items.forEach((item) => {
    const trigger = item.querySelector('.ppc-faq__trigger');

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('is-active');

      items.forEach((other) => {
        other.classList.remove('is-active');
        other.querySelector('.ppc-faq__trigger').setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('is-active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

function initShowcaseSlider() {
  const track = document.getElementById('showcaseTrack');
  const dotsWrap = document.getElementById('showcaseDots');
  const prevBtn = document.querySelector('.showcase__arrow--prev');
  const nextBtn = document.querySelector('.showcase__arrow--next');
  if (!track || !dotsWrap || !prevBtn || !nextBtn) return;

  const slides = track.querySelectorAll('.showcase__slide');
  if (!slides.length) return;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'showcase__dot';
    dot.setAttribute('aria-label', `Go to project ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = dotsWrap.querySelectorAll('.showcase__dot');
  let index = 0;

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, di) => dot.classList.toggle('is-active', di === index));
  }

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));

  goTo(0);
}

function initStoriesShowcase() {
  const viewport = document.getElementById('storiesShowcaseViewport');
  const track = document.getElementById('storiesShowcaseTrack');
  const dotsWrap = document.getElementById('storiesShowcaseDots');
  const prevBtn = document.querySelector('.stories-showcase__arrow--prev');
  const nextBtn = document.querySelector('.stories-showcase__arrow--next');
  if (!viewport || !track || !dotsWrap || !prevBtn || !nextBtn) return;

  const slides = track.querySelectorAll('.stories-showcase__slide');
  if (!slides.length) return;

  function getPerView() {
    return window.matchMedia('(max-width: 900px)').matches ? 1 : 3;
  }

  let perView = getPerView();
  let maxIndex = Math.max(0, slides.length - perView);
  let index = 0;

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'stories-showcase__dot';
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function update() {
    const dots = dotsWrap.querySelectorAll('.stories-showcase__dot');
    dots.forEach((dot, di) => dot.classList.toggle('is-active', di === index));

    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = slides[0].getBoundingClientRect().width + gap;
    track.style.transform = `translateX(-${index * step}px)`;
  }

  function goTo(i) {
    index = Math.min(Math.max(i, 0), maxIndex);
    update();
  }

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newPerView = getPerView();
      if (newPerView !== perView) {
        perView = newPerView;
        maxIndex = Math.max(0, slides.length - perView);
        index = Math.min(index, maxIndex);
        buildDots();
      }
      update();
    }, 150);
  });

  buildDots();
  update();
}

function initHelpDarkSlider() {
  const slider = document.getElementById('helpDarkSlider');
  const track = document.getElementById('helpDarkTrack');
  const prevBtn = document.getElementById('helpDarkPrev');
  const nextBtn = document.getElementById('helpDarkNext');
  if (!slider || !track || !prevBtn || !nextBtn) return;

  function scrollStep(direction) {
    const cards = track.querySelectorAll('.help-dark__card');
    if (!cards.length) return;
    const trackStyles = getComputedStyle(track);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || '0');
    const step = cards[0].getBoundingClientRect().width + gap;

    const currentIndex = Math.round(slider.scrollLeft / step);
    const maxIndex = cards.length - 1;
    const nextIndex = Math.min(Math.max(currentIndex + direction, 0), maxIndex);

    slider.scrollTo({ left: nextIndex * step, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', () => scrollStep(-1));
  nextBtn.addEventListener('click', () => scrollStep(1));
}

function initVideoPosters() {
  const posters = document.querySelectorAll('.hero__video--poster');
  if (!posters.length) return;

  posters.forEach((poster) => {
    poster.addEventListener('click', () => {
      const src = poster.dataset.embedSrc;
      const title = poster.dataset.embedTitle || '';
      if (!src) return;

      const iframe = document.createElement('iframe');
      iframe.src = `${src}${src.includes('?') ? '&' : '?'}autoplay=1`;
      iframe.title = title;
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.setAttribute('allowfullscreen', '');

      poster.classList.remove('hero__video--poster');
      poster.replaceChildren(iframe);
    });
  });
}

function initCalendlyButtons() {
  const buttons = document.querySelectorAll('.calendly-button');
  if (!buttons.length) return;

  function repositionCloseButton() {
    const content = document.querySelector('.calendly-popup-content');
    const closeBtn = document.querySelector('.calendly-popup-close');
    if (!content || !closeBtn) return;
    const rect = content.getBoundingClientRect();
    closeBtn.style.top = `${Math.max(rect.top - 14, 8)}px`;
    closeBtn.style.left = `${rect.right - 14}px`;
    closeBtn.style.right = 'auto';
  }

  function watchPopup() {
    // The iframe loads async and can change the popup's size shortly after
    // it first appears, so keep nudging the close button into place for a bit.
    [0, 100, 300, 600, 1000].forEach((delay) => setTimeout(repositionCloseButton, delay));

    const observer = new MutationObserver(() => {
      if (document.querySelector('.calendly-overlay')) {
        repositionCloseButton();
      } else {
        observer.disconnect();
        window.removeEventListener('resize', repositionCloseButton);
      }
    });
    observer.observe(document.body, { childList: true });
    window.addEventListener('resize', repositionCloseButton);
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      if (!window.Calendly) return;
      event.preventDefault();
      window.Calendly.initPopupWidget({ url: 'https://calendly.com/danny-kemp/30min' });
      watchPopup();
    });
  });
}

function initRealityCheckModal() {
  const triggerPattern = /^start (your |the )?(reality|health) check now$/i;
  const triggers = Array.from(document.querySelectorAll('a, button')).filter((el) =>
    triggerPattern.test(el.textContent.trim())
  );
  if (!triggers.length) return;

  // The modal itself lives outside the AJAX-swapped region, so it's only
  // ever created once; on later page swaps we just rebind the new triggers.
  let modal = document.querySelector('.rc-modal');

  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'rc-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="rc-modal__overlay" data-rc-close></div>
      <div class="rc-modal__card" role="dialog" aria-modal="true" aria-labelledby="realityCheckModalHeading">
        <button type="button" class="rc-modal__close" aria-label="Close" data-rc-close>
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
        <h3 id="realityCheckModalHeading" class="rc-modal__heading">Take The SME Reality Check</h3>
        <p class="rc-modal__text">See your best-ever results over the next 12 months. Get your personalised report and recommendations now.</p>
        <div class="rc-modal__frame-wrap">
          <iframe class="rc-modal__frame" data-src="https://realitycheck.digitalgroupmedia.com/form" frameborder="0" title="Sales & Marketing Reality Check form"></iframe>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const iframe = modal.querySelector('.rc-modal__frame');

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('rc-modal-open');
    }

    modal.__openModal = function openModal(event) {
      event.preventDefault();
      if (!iframe.src) {
        iframe.src = iframe.dataset.src;
      }
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('rc-modal-open');
    };

    modal.querySelectorAll('[data-rc-close]').forEach((el) => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  triggers.forEach((trigger) => trigger.addEventListener('click', modal.__openModal));
}

function initMobileNav() {
  const headerInner = document.querySelector('.site-header__inner');
  const nav = document.querySelector('.main-nav');
  if (!headerInner || !nav) return;

  const mobileQuery = window.matchMedia('(max-width: 980px)');

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-toggle';
  toggle.setAttribute('aria-label', 'Toggle menu');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span></span><span></span><span></span>';
  headerInner.appendChild(toggle);

  function closeNav() {
    nav.classList.remove('is-open');
    toggle.classList.remove('is-active');
    toggle.setAttribute('aria-expanded', 'false');
    nav.querySelectorAll('.has-dropdown.is-open').forEach((li) => li.classList.remove('is-open'));
  }

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.classList.toggle('is-active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('li.has-dropdown > a').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!mobileQuery.matches) return;
      event.preventDefault();
      const parentLi = link.parentElement;
      const isOpen = parentLi.classList.toggle('is-open');

      parentLi.parentElement.querySelectorAll(':scope > li.has-dropdown').forEach((li) => {
        if (li !== parentLi) li.classList.remove('is-open');
      });

      void isOpen;
    });
  });

  nav.querySelectorAll('li:not(.has-dropdown) > a, .main-nav__dropdown-menu a').forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileQuery.matches) closeNav();
    });
  });

  mobileQuery.addEventListener('change', () => closeNav());
}

function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  });

  targets.forEach((el) => observer.observe(el));
}

function initStickyHeader() {
  if (window.__stickyHeaderBound) return;
  window.__stickyHeaderBound = true;

  // Looks the header up fresh on every scroll (rather than once) so this
  // keeps working after the AJAX nav below swaps in a new header element.
  window.addEventListener('scroll', () => {
    const header = document.getElementById('siteHeader');
    if (header) header.classList.toggle('is-stuck', window.scrollY > 4);
  });
}

function initAccordion() {
  const items = document.querySelectorAll('.accordion__item');
  if (!items.length) return;

  items.forEach((item) => {
    const trigger = item.querySelector('.accordion__trigger');

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('is-active');

      items.forEach((other) => {
        other.classList.remove('is-active');
        other.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('is-active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

function initWhySlider() {
  const slider = document.querySelector('.why__slider');
  const track = document.getElementById('whyTrack');
  const prevBtn = document.getElementById('whyPrev');
  const nextBtn = document.getElementById('whyNext');
  if (!slider || !track || !prevBtn || !nextBtn) return;

  function scrollStep(direction) {
    const cards = track.querySelectorAll('.why__card');
    if (!cards.length) return;
    const trackStyles = getComputedStyle(track);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || '0');
    const step = cards[0].getBoundingClientRect().width + gap;

    const currentIndex = Math.round(slider.scrollLeft / step);
    const maxIndex = cards.length - 1;
    const nextIndex = Math.min(Math.max(currentIndex + direction, 0), maxIndex);

    slider.scrollTo({ left: nextIndex * step, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', () => scrollStep(-1));
  nextBtn.addEventListener('click', () => scrollStep(1));
}

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 500);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initHeroTypewriter() {
  const el = document.getElementById('heroTypedWord');
  if (!el) return;

  let words = ['love', 'trust', 'buy from', 'understand', 'respect', 'learn from', 'find'];
  if (el.dataset.words) {
    try {
      words = JSON.parse(el.dataset.words);
    } catch (err) {
      /* fall back to default words */
    }
  }
  const typeSpeed = 80;
  const deleteSpeed = 45;
  const holdDelay = 1400;
  const nextWordDelay = 300;

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    // Stop once this hero has been swapped out by the AJAX nav below,
    // otherwise this loop would keep running forever in the background.
    if (!el.isConnected) return;

    const current = words[wordIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, holdDelay);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(tick, nextWordDelay);
        return;
      }
    }

    setTimeout(tick, deleting ? deleteSpeed : typeSpeed);
  }

  tick();
}

// ==========================================================================
// AJAX navigation: fetches internal pages and swaps the header+content
// region in place, so the URL changes but there's no full page reload.
// Progressive enhancement — if anything's unsupported or a fetch fails,
// it falls back to a normal browser navigation.
// ==========================================================================
function initAjaxNav() {
  if (!window.history || !window.history.pushState || typeof DOMParser === 'undefined') return;

  const footer = document.querySelector('footer.site-footer');
  if (!footer) return;

  let region = document.getElementById('ajaxRegion');
  if (!region) {
    region = document.createElement('div');
    region.id = 'ajaxRegion';
    footer.parentNode.insertBefore(region, footer);
    while (region.previousSibling) {
      region.insertBefore(region.previousSibling, region.firstChild);
    }
  }

  let overlay = document.getElementById('ajaxTransition');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'ajaxTransition';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SWEEP_MS = reducedMotion ? 0 : 420;

  let navToken = 0;

  function extractRegionNodes(doc) {
    const docFooter = doc.querySelector('footer.site-footer');
    const nodes = [];
    let el = doc.body.firstElementChild;
    while (el && el !== docFooter) {
      nodes.push(el);
      el = el.nextElementSibling;
    }
    return nodes;
  }

  function runInlineScripts(container) {
    container.querySelectorAll('script').forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
      newScript.textContent = oldScript.textContent;
      oldScript.replaceWith(newScript);
    });
  }

  function shouldIntercept(link) {
    if (!link) return false;
    if (link.origin !== location.origin) return false;
    if (link.protocol !== 'http:' && link.protocol !== 'https:') return false;
    if (link.target && link.target !== '_self') return false;
    if (link.hasAttribute('download')) return false;
    if (link.dataset.noAjax !== undefined) return false;

    const lastSegment = link.pathname.substring(link.pathname.lastIndexOf('/') + 1);
    if (lastSegment.includes('.') && !/\.html?$/i.test(lastSegment)) return false;

    // Same-page hash anchors (#lets-talk, #contact, etc.) — let the browser
    // handle the native in-page scroll instead of re-fetching the page.
    if (link.pathname === location.pathname && link.search === location.search && link.hash) return false;

    return true;
  }

  function navigate(url, push) {
    const token = ++navToken;
    const targetUrl = new URL(url, location.href);

    // Reset the beam to its off-screen starting position (in case a
    // previous sweep-out is still mid-flight), then sweep it in.
    overlay.classList.remove('is-sweeping-out');
    void overlay.offsetWidth; // force reflow so the reset above isn't skipped
    overlay.classList.add('is-sweeping-in');
    region.classList.add('is-navigating');

    const sweepIn = new Promise((resolve) => window.setTimeout(resolve, SWEEP_MS));
    const fetchHtml = fetch(targetUrl.href, { credentials: 'same-origin' }).then((res) => {
      if (!res.ok) throw new Error('Bad response: ' + res.status);
      return res.text();
    });

    Promise.all([fetchHtml, sweepIn])
      .then(([html]) => {
        if (token !== navToken) return;

        const doc = new DOMParser().parseFromString(html, 'text/html');
        const newNodes = extractRegionNodes(doc).map((n) => document.importNode(n, true));
        const newTitle = doc.title;
        const newDescEl = doc.querySelector('meta[name="description"]');
        const newDesc = newDescEl ? newDescEl.getAttribute('content') : null;

        // The beam is now fully covering the viewport, so the swap below
        // happens out of sight underneath it.
        region.replaceChildren(...newNodes);
        runInlineScripts(region);

        document.title = newTitle;
        if (newDesc !== null) {
          let descEl = document.querySelector('meta[name="description"]');
          if (!descEl) {
            descEl = document.createElement('meta');
            descEl.setAttribute('name', 'description');
            document.head.appendChild(descEl);
          }
          descEl.setAttribute('content', newDesc);
        }

        if (push) {
          history.pushState({}, '', targetUrl.href);
        }

        if (targetUrl.hash) {
          const target = document.getElementById(targetUrl.hash.slice(1));
          if (target) {
            target.scrollIntoView();
          } else {
            window.scrollTo(0, 0);
          }
        } else {
          window.scrollTo(0, 0);
        }

        // Sweep the beam onward off the right edge while the new content
        // settles in from a soft blur/scale into full focus underneath it.
        overlay.classList.remove('is-sweeping-in');
        overlay.classList.add('is-sweeping-out');
        region.classList.remove('is-navigating');
        runContentInits();

        window.setTimeout(() => {
          if (token !== navToken) return;
          overlay.classList.remove('is-sweeping-out');
        }, SWEEP_MS);
      })
      .catch(() => {
        if (token !== navToken) return;
        window.location.href = targetUrl.href;
      });
  }

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest('a[href]');
    if (!shouldIntercept(link)) return;

    event.preventDefault();
    navigate(link.href, true);
  });

  window.addEventListener('popstate', () => {
    navigate(location.href, false);
  });
}
