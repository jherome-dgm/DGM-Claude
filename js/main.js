document.addEventListener('DOMContentLoaded', () => {
  initHeroTypewriter();
  initAccordion();
  initFaqAccordion();
  initBackToTop();
  initWhySlider();
  initShowcaseSlider();
  initStoriesShowcase();
  initHelpDarkSlider();
  initVideoPosters();
  initStickyHeader();
  initScrollReveal();
  initMobileNav();
});

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
  const header = document.getElementById('siteHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('is-stuck', window.scrollY > 4);
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
