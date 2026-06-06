(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  ready(function () {
    animateHero();
    revealOnScroll();
    setupNavbarState();
  });

  function animateHero() {
    var hero = document.querySelector('.hero-section, .about-hero, .projects-hero, .gallery-hero, .page-header');
    if (!hero) return;

    var selectors = [
      '.hero-kicker',
      '.about-hero-kicker',
      'h1',
      '.hero-title',
      '.about-hero-title',
      '.hero-subtitle',
      '.about-hero-subtitle',
      '.lead',
      '.hero-breadcrumb',
      '.hero-cta-animation',
      '.quick-stats'
    ];

    hero.querySelectorAll(selectors.join(',')).forEach(function (el, index) {
      el.classList.add('hero-normal-in');
      if (index === 1) el.classList.add('delay-1');
      if (index === 2) el.classList.add('delay-2');
      if (index > 2) el.classList.add('delay-3');
    });
  }

  function revealOnScroll() {
    var targets = document.querySelectorAll([
      '.section-header',
      '.feature-card',
      '.project-showcase-card',
      '.project-card',
      '.testimonial-card',
      '.mv-card',
      '.value-card-new',
      '.achieve-card',
      '.timeline-item',
      '.highlight-card',
      '.chairman-card',
      '.message-box',
      '.team-cta',
      '.contact-info-section .contact-item',
      '.contact-form-section',
      '.map-section',
      '.map-card',
      '.gallery-card',
      '.gal-info-card',
      '.coming-soon-wrap',
      '.cta-box',
      '.location-section',
      '.projects-cta'
    ].join(','));

    targets.forEach(function (el, index) {
      if (el.classList.contains('normal-reveal')) return;
      el.classList.add('normal-reveal');
      if (el.classList.contains('timeline-item') || index % 5 === 1) el.classList.add('reveal-left');
      if (index % 5 === 2) el.classList.add('reveal-right');
      if (index % 5 === 3) el.classList.add('reveal-scale');
    });

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(function (el) { observer.observe(el); });
  }

  function setupNavbarState() {
    var navbar = document.querySelector('.main-navbar');
    if (!navbar) return;

    var update = function () {
      if (window.scrollY > 50) {
        navbar.classList.add('normal-scrolled');
      } else {
        navbar.classList.remove('normal-scrolled');
      }
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
  }
})();
