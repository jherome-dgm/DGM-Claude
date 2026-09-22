document.addEventListener('DOMContentLoaded', () => {
  initHeroTypewriter();
  initAccordion();
  initBackToTop();
  initWhySlider();
  initStickyHeader();
  initScrollReveal();
  initMobileNav();
});

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

  const words = ['love', 'trust', 'buy from', 'understand', 'respect', 'learn from', 'find'];
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
