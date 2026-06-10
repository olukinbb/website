/* Olukin Lifestyle Boutique — script.js */

(function () {
  'use strict';

  /* ── Nav scroll shadow ── */
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  /* ── Mobile menu ── */
  const toggle   = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  toggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  window.closeMobileMenu = function () {
    mobileMenu.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
    mobileMenu.setAttribute('aria-hidden', true);
    document.body.style.overflow = '';
  };

  /* ── Category-strip & footer shop links jump to correct filter ── */
  document.querySelectorAll('[data-jump]').forEach(el => {
    el.addEventListener('click', () => {
      const cat = el.dataset.jump;
      if (cat) setTimeout(() => filterProducts(cat), 80);
    });
  });

  /* ── Product filter ── */
  window.filterProducts = function (category) {
    const cards = document.querySelectorAll('.product-card');
    const tabs  = document.querySelectorAll('.filter-tab');

    tabs.forEach(t => {
      const active = t.dataset.filter === category;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active);
    });

    cards.forEach(card => {
      const match = category === 'all' || card.dataset.category === category;
      if (match) {
        card.classList.remove('hidden');
        card.classList.remove('fade-in');
        void card.offsetWidth;         // force reflow to restart animation
        card.classList.add('fade-in');
      } else {
        card.classList.add('hidden');
        card.classList.remove('fade-in');
      }
    });
  };

  /* Wire filter tab buttons */
  document.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => filterProducts(btn.dataset.filter));
  });

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* Immediately reveal hero elements (already in viewport) */
  requestAnimationFrame(() => {
    document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible'));
  });

  /* ── Lazy-load videos when they enter the viewport ── */
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target;
          video.querySelectorAll('source').forEach(src => {
            if (!src.src && src.dataset.src) src.src = src.dataset.src;
          });
          video.load();
          videoObserver.unobserve(video);
        }
      });
    }, { rootMargin: '200px' });

    document.querySelectorAll('video[autoplay]').forEach(v => videoObserver.observe(v));
  }

  /* ── Smooth-scroll for all anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
