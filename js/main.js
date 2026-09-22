document.addEventListener('DOMContentLoaded', () => {
  initHeroTypewriter();
  initAccordion();
  initFaqAccordion();
  initBackToTop();
  initWhySlider();
  initShowcaseSlider();
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
    const card = track.querySelector('.why__card');
    if (!card) return;
    const trackStyles = getComputedStyle(track);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || '0');
    const amount = (card.getBoundingClientRect().width + gap) * direction;
    slider.scrollBy({ left: amount, behavior: 'smooth' });
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
