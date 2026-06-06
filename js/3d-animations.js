/* ================================================================
   3D ANIMATION CONTROLLER — MIDTOWN AABASHON LTD
   GSAP-powered 3D scroll reveals + interactive tilt for all pages
   ================================================================ */

(function () {
  'use strict';

  var PAGE = (function () {
    var p = location.pathname.split('/').pop() || 'index.html';
    if (p === '' || p === 'index.html') return 'home';
    return p.replace('.html', '');
  })();

  var IS_MOBILE = window.matchMedia('(max-width: 768px)').matches;
  var P = 1200; /* default perspective value for GSAP 3D */

  /* Run after DOM is ready */
  function whenReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function hasGSAP() {
    return typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  }

  whenReady(function () {
    if (hasGSAP()) {
      gsap.registerPlugin(ScrollTrigger);
      runGSAPAnimations();
    } else {
      runCSSFallback();
    }

    if (!IS_MOBILE) {
      setupMouseTilt();
    }
    setupHeroParallax();
  });

  /* ============================================================
     GSAP ANIMATION ENTRY POINT
     ============================================================ */

  function runGSAPAnimations() {
    animateHeroIntro();
    animateSectionHeaders();
    animateFooter();
    animateFloatingElements();

    switch (PAGE) {
      case 'home':       setupHomePage();       break;
      case 'about':      setupAboutPage();      break;
      case 'projects':   setupProjectsPage();   break;
      case 'gallery':    setupGalleryPage();    break;
      case 'contact':    setupContactPage();    break;
      case 'management': setupManagementPage(); break;
    }
  }

  /* ============================================================
     GLOBAL — all pages
     ============================================================ */

  function animateSectionHeaders() {
    gsap.utils.toArray('.section-header').forEach(function (el) {
      var kicker = el.querySelector('.section-kicker');
      var title  = el.querySelector('.section-title, h2');
      var sub    = el.querySelector('.section-subtitle, p');
      var tl     = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 84%', once: true }
      });

      if (kicker) {
        tl.from(kicker, {
          z: -80, y: 28, opacity: 0,
          transformPerspective: P,
          duration: 0.65, ease: 'power3.out'
        });
      }
      if (title) {
        tl.from(title, {
          z: -120, y: 50, rotateX: -22,
          transformPerspective: P,
          transformOrigin: 'center bottom',
          opacity: 0, filter: 'blur(4px)',
          duration: 0.85, ease: 'power3.out'
        }, kicker ? '-=0.35' : 0);
      }
      if (sub) {
        tl.from(sub, {
          z: -60, y: 30, opacity: 0,
          transformPerspective: P,
          duration: 0.7, ease: 'power2.out'
        }, '-=0.4');
      }
    });
  }

  function animateFooter() {
    var footer = document.querySelector('.site-footer');
    if (!footer) return;
    var cols = footer.querySelectorAll(
      '[class*="col-md-3"], [class*="col-md-4"], [class*="col-lg-3"], [class*="col-lg-4"]'
    );
    if (!cols.length) return;
    gsap.from(cols, {
      scrollTrigger: { trigger: footer, start: 'top 92%', once: true },
      z: -140, y: 60, rotateX: 20, opacity: 0,
      transformPerspective: P,
      transformOrigin: 'center bottom',
      duration: 0.85, stagger: 0.13, ease: 'power3.out'
    });
  }

  function animateFloatingElements() {
    /* Add a continuous shine sweep to all cards */
    document.querySelectorAll(
      [
        '.feature-card',
        '.project-preview-card',
        '.project-showcase-card',
        '.project-card',
        '.project-video-card',
        '.mv-card',
        '.value-card',
        '.value-card-new',
        '.testimonial-card',
        '.chairman-card',
        '.highlight-card',
        '.message-box',
        '.team-cta',
        '.contact-info-section .contact-item',
        '.contact-form-section',
        '.map-card',
        '.map-container',
        '.gallery-card',
        '.gal-info-card',
        '.coming-soon-wrap',
        '.cta-box',
        '.projects-cta',
        '.location-section'
      ].join(',')
    ).forEach(function (card) {
      card.classList.add('card-3d-shine');
    });

    document.querySelectorAll('.hero-shapes .shape, .hero-3d-panel, .story-badge, .floating-preview-card').forEach(function (el) {
      el.classList.add('float-3d');
    });
  }

  function animateHeroIntro() {
    var hero = document.querySelector('.hero-section, .about-hero, .projects-hero, .gallery-hero, .page-header');
    if (!hero) return;

    hero.classList.add('hero-depth-ready', 'hero-intro-animated');

    if (PAGE === 'home') {
      var preview = hero.querySelector('.floating-preview-card');
      if (preview) {
        gsap.from(preview, {
          z: -260, x: 120, rotateY: -28, opacity: 0,
          transformPerspective: P,
          duration: 1.15, ease: 'power3.out', delay: 1.2
        });
      }
      return;
    }

    var els = hero.querySelectorAll(
      '.hero-kicker, .about-hero-kicker, h1, .hero-title, .about-hero-title, .lead, .hero-subtitle, .about-hero-subtitle, .about-hero-tagline, .hero-breadcrumb, .hero-scroll-hint'
    );

    if (!els.length) return;
    gsap.from(els, {
      z: -260,
      y: 48,
      rotateX: -24,
      opacity: 0,
      filter: 'blur(5px)',
      transformPerspective: P,
      transformOrigin: 'center bottom',
      duration: 0.95,
      stagger: 0.12,
      ease: 'power3.out',
      delay: 0.1
    });
  }

  /* ============================================================
     HOME PAGE
     ============================================================ */

  function setupHomePage() {
    /* Quick stat area — 3D rise (home.js handles the counting) */
    var statSection = document.querySelector('[class*="quick-stat"], [class*="stats-section"], .row-stats');
    if (!statSection) statSection = document.querySelector('section:nth-of-type(3)');
    if (statSection) {
      var statCols = statSection.querySelectorAll('.col, .col-6, .col-md-3, .col-sm-6');
      if (statCols.length) {
        gsap.from(statCols, {
          scrollTrigger: { trigger: statSection, start: 'top 82%', once: true },
          z: -160, y: 50, rotateX: 30, opacity: 0,
          transformPerspective: P,
          transformOrigin: 'center bottom',
          duration: 0.85, stagger: 0.1, ease: 'back.out(1.4)'
        });
      }
    }

    /* Features section — stagger 3D from depth (skip if home.js already handles) */
    var featureSection = document.querySelector('[class*="feature-section"], section:has(.feature-card)');
    if (featureSection) {
      gsap.from(featureSection.querySelectorAll('.feature-card'), {
        scrollTrigger: { trigger: featureSection, start: 'top 80%', once: true },
        z: -200, rotateY: function (i) { return i % 2 === 0 ? -60 : 60; },
        opacity: 0, transformPerspective: P,
        duration: 0.9, stagger: 0.12, ease: 'power3.out',
        overwrite: false
      });
    }

    /* CTA section depth reveal */
    var cta = document.querySelector('[class*="cta-section"], .section-cta');
    if (cta) {
      var ctaEls = cta.querySelectorAll('h2, .section-title, p, .btn-primary-gradient, .btn-outline-primary');
      gsap.from(ctaEls, {
        scrollTrigger: { trigger: cta, start: 'top 78%', once: true },
        z: -220, y: 50, rotateX: 22, opacity: 0,
        transformPerspective: P,
        duration: 0.9, stagger: 0.14, ease: 'power3.out'
      });
    }

    /* Testimonials 3D spread */
    var testimonials = document.querySelectorAll('.testimonial-card');
    if (testimonials.length) {
      gsap.from(testimonials, {
        scrollTrigger: { trigger: testimonials[0].closest('section') || testimonials[0], start: 'top 80%', once: true },
        z: -180, rotateY: function (i) { return (i - 1) * 30; },
        opacity: 0, transformPerspective: P,
        duration: 1, stagger: 0.15, ease: 'power3.out',
        overwrite: false
      });
    }

    /* Project preview cards 3D */
    var projPreviews = document.querySelectorAll('.project-preview-card');
    if (projPreviews.length) {
      gsap.from(projPreviews, {
        scrollTrigger: { trigger: projPreviews[0].closest('section') || projPreviews[0], start: 'top 80%', once: true },
        z: -250, y: 60, rotateX: 25, opacity: 0,
        transformPerspective: P,
        duration: 0.9, stagger: 0.12, ease: 'power3.out',
        overwrite: false
      });
    }
  }

  /* ============================================================
     ABOUT PAGE
     ============================================================ */

  function setupAboutPage() {
    /* Page header drop */
    headerDrop();

    /* Story images — alternating 3D flip */
    var storyImgs = document.querySelectorAll('[class*="story-img"], [class*="about-img"], .story-image');
    storyImgs.forEach(function (img, i) {
      gsap.from(img, {
        scrollTrigger: { trigger: img, start: 'top 82%', once: true },
        z: -240, x: i % 2 === 0 ? -100 : 100,
        rotateY: i % 2 === 0 ? 50 : -50,
        opacity: 0, transformPerspective: P,
        duration: 1.05, ease: 'power3.out'
      });
    });

    /* Story text blocks */
    var storyTexts = document.querySelectorAll('[class*="story-content"], [class*="story-text"], [class*="about-content"]');
    storyTexts.forEach(function (txt, i) {
      gsap.from(txt, {
        scrollTrigger: { trigger: txt, start: 'top 82%', once: true },
        z: -140, x: i % 2 === 0 ? 80 : -80,
        rotateY: i % 2 === 0 ? -30 : 30,
        opacity: 0, transformPerspective: P,
        duration: 0.95, ease: 'power3.out'
      });
    });

    /* Mission / Vision cards — 3D card flip */
    var mvCards = document.querySelectorAll('.mv-card, .mission-card, .vision-card');
    mvCards.forEach(function (card, i) {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 84%', once: true },
        rotateY: i % 2 === 0 ? -90 : 90,
        z: -120, opacity: 0,
        transformPerspective: P,
        transformOrigin: 'center center',
        duration: 1, ease: 'power3.out', delay: i * 0.1
      });
    });

    /* Values — stagger 3D stamp from above */
    var valueCards = document.querySelectorAll('.value-card, .value-card-new, [class*="value-item"]');
    if (valueCards.length) {
      gsap.from(valueCards, {
        scrollTrigger: { trigger: valueCards[0].closest('section') || valueCards[0], start: 'top 80%', once: true },
        z: -240, y: 70, rotateX: 45, opacity: 0,
        transformPerspective: P,
        transformOrigin: 'center bottom',
        duration: 0.9, stagger: 0.10, ease: 'back.out(1.5)'
      });
    }

    /* Achievements — glassmorphism panels from deep */
    var achieves = document.querySelectorAll('.achievement-item, .achieve-card, [class*="achievement-card"], [class*="achieve-item"]');
    if (achieves.length) {
      gsap.from(achieves, {
        scrollTrigger: { trigger: achieves[0].closest('section') || achieves[0], start: 'top 78%', once: true },
        z: -350, scale: 0.75, opacity: 0,
        transformPerspective: P,
        duration: 1.1, stagger: 0.15, ease: 'power3.out'
      });
    }

    /* Timeline — alternating 3D slide */
    var timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(function (item, i) {
      var left = i % 2 === 0;
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: 'top 84%', once: true },
        x: left ? -130 : 130,
        z: -100,
        rotateY: left ? 40 : -40,
        opacity: 0, transformPerspective: P,
        duration: 0.95, ease: 'power3.out'
      });
    });

    /* About feature cards */
    var aboutCards = document.querySelectorAll('.feature-card');
    if (aboutCards.length) {
      gsap.from(aboutCards, {
        scrollTrigger: { trigger: aboutCards[0].closest('section') || aboutCards[0], start: 'top 82%', once: true },
        z: -180, rotateX: 30, y: 50, opacity: 0,
        transformPerspective: P,
        duration: 0.85, stagger: 0.12, ease: 'power3.out'
      });
    }
  }

  /* ============================================================
     PROJECTS PAGE
     ============================================================ */

  function setupProjectsPage() {
    headerDrop();

    /* Filter buttons — 3D stamp appearance */
    var filters = document.querySelectorAll('.filter-btn');
    if (filters.length) {
      gsap.from(filters, {
        scrollTrigger: { trigger: filters[0].closest('div') || filters[0], start: 'top 88%', once: true },
        z: 120, scale: 1.4, rotateX: -30, opacity: 0,
        transformPerspective: 800,
        duration: 0.6, stagger: 0.07, ease: 'back.out(2)'
      });
    }

    /* Project cards — alternating 3D flip */
    var projCards = document.querySelectorAll('.project-card');
    projCards.forEach(function (card, i) {
      card.classList.add('show');
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 86%', once: true },
        z: -280,
        rotateY: i % 2 === 0 ? -65 : 65,
        rotateX: 10,
        opacity: 0,
        transformPerspective: P,
        duration: 1.05, ease: 'power3.out',
        delay: (i % 3) * 0.1
      });
    });

    var projectExtras = document.querySelectorAll('.location-section, .projects-cta, .project-video-card, .map-card');
    projectExtras.forEach(function (box, i) {
      box.classList.add('show');
      gsap.from(box, {
        scrollTrigger: { trigger: box, start: 'top 84%', once: true },
        z: -220,
        y: 55,
        rotateX: 22,
        opacity: 0,
        transformPerspective: P,
        duration: 0.9,
        delay: (i % 2) * 0.08,
        ease: 'power3.out'
      });
    });

    /* Info / location boxes */
    var infoBoxes = document.querySelectorAll('[class*="info-box"], [class*="project-info"]');
    if (infoBoxes.length) {
      gsap.from(infoBoxes, {
        scrollTrigger: { trigger: infoBoxes[0].closest('section') || infoBoxes[0], start: 'top 84%', once: true },
        z: -160, y: 45, rotateX: 28, opacity: 0,
        transformPerspective: P,
        duration: 0.85, stagger: 0.1, ease: 'power3.out'
      });
    }

    /* Feature cards on projects page */
    var featCards = document.querySelectorAll('.feature-card');
    if (featCards.length) {
      gsap.from(featCards, {
        scrollTrigger: { trigger: featCards[0].closest('section') || featCards[0], start: 'top 82%', once: true },
        z: -200, y: 55, rotateX: 32, opacity: 0,
        transformPerspective: P,
        duration: 0.88, stagger: 0.12, ease: 'back.out(1.4)'
      });
    }
  }

  /* ============================================================
     GALLERY PAGE
     ============================================================ */

  function setupGalleryPage() {
    headerDrop();

    /* Gallery nav tabs */
    var tabs = document.querySelectorAll('[class*="gallery-tab"], .nav-pills .nav-item, [class*="project-tab"]');
    if (tabs.length) {
      gsap.from(tabs, {
        z: -120, rotateY: -50, opacity: 0,
        transformPerspective: 1000,
        duration: 0.75, stagger: 0.1, ease: 'back.out(1.5)', delay: 0.4
      });
    }

    /* Main slider image */
    var mainImg = document.querySelector('[class*="main-img"], [class*="slider-main"], .gallery-main-img, .main-slide-img');
    if (mainImg) {
      gsap.from(mainImg, {
        scrollTrigger: { trigger: mainImg, start: 'top 82%', once: true },
        z: -450, rotateX: 18, opacity: 0,
        transformPerspective: P,
        duration: 1.3, ease: 'power3.out'
      });
    }

    /* Gallery slider wrapper */
    var slider = document.querySelector('[class*="gallery-slider"], [class*="slider-wrapper"]');
    if (slider && !mainImg) {
      gsap.from(slider, {
        scrollTrigger: { trigger: slider, start: 'top 82%', once: true },
        z: -350, rotateX: 15, opacity: 0,
        transformPerspective: P,
        duration: 1.2, ease: 'power3.out'
      });
    }

    /* Thumbnail images */
    var thumbs = document.querySelectorAll('[class*="gallery-thumb"], .thumbnail-item, [class*="thumb-img"]');
    if (thumbs.length) {
      gsap.from(thumbs, {
        scrollTrigger: { trigger: thumbs[0].closest('[class*="thumb"]') || thumbs[0], start: 'top 85%', once: true },
        z: -220, rotateX: 24, scale: 0.82, opacity: 0,
        transformPerspective: P,
        duration: 0.7, stagger: 0.055, ease: 'power3.out'
      });
    }

    /* Gallery info cards */
    var gInfoCards = document.querySelectorAll('.gal-info-card, [class*="gallery-info"], [class*="info-card"]');
    if (gInfoCards.length) {
      gsap.from(gInfoCards, {
        scrollTrigger: { trigger: gInfoCards[0].closest('section') || gInfoCards[0], start: 'top 84%', once: true },
        z: -160, rotateY: -80, opacity: 0,
        transformPerspective: P,
        duration: 0.95, stagger: 0.15, ease: 'power3.out'
      });
    }

    var galleryPanels = document.querySelectorAll('.gallery-card, .coming-soon-wrap, .cta-box');
    galleryPanels.forEach(function (panel, i) {
      gsap.from(panel, {
        scrollTrigger: { trigger: panel, start: 'top 84%', once: true },
        z: -260,
        y: 56,
        rotateX: 18,
        opacity: 0,
        transformPerspective: P,
        duration: 1,
        delay: (i % 2) * 0.08,
        ease: 'power3.out'
      });
    });
  }

  /* ============================================================
     CONTACT PAGE
     ============================================================ */

  function setupContactPage() {
    headerDrop();

    /* Contact info items 3D float */
    var infoItems = document.querySelectorAll(
      '.contact-info-card, .contact-item, .social-contact, .social-link, [class*="info-item"], [class*="contact-detail"]'
    );
    infoItems.forEach(function (card, i) {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 86%', once: true },
        z: -220, y: 55, rotateX: 32, opacity: 0,
        transformPerspective: P,
        duration: 0.85, delay: i * 0.1, ease: 'power3.out'
      });
    });

    /* Contact form 3D slide from right */
    var formWrap = document.querySelector('.contact-form-section, .contact-form, [class*="form-wrapper"], form');
    var form = document.querySelector('form');
    if (formWrap) {
      gsap.from(formWrap, {
        scrollTrigger: { trigger: formWrap, start: 'top 82%', once: true },
        z: -300, rotateY: -22, x: 80, opacity: 0,
        transformPerspective: P,
        duration: 1.1, ease: 'power3.out'
      });

      /* Form field stagger */
      var fields = form ? form.querySelectorAll('.mb-3, .form-group, .form-floating, .col-md-6, .col-12') : [];
      if (fields.length) {
        gsap.from(fields, {
          scrollTrigger: { trigger: formWrap, start: 'top 78%', once: true },
          z: -90, x: 35, opacity: 0,
          transformPerspective: 800,
          duration: 0.55, stagger: 0.08, ease: 'power2.out', delay: 0.3
        });
      }
    }

    /* Map 3D frame drop */
    var map = document.querySelector('[class*="map"], .map-container, iframe');
    if (map) {
      var mapWrap = map.closest('[class*="map"]') || map;
      gsap.from(mapWrap, {
        scrollTrigger: { trigger: mapWrap, start: 'top 82%', once: true },
        z: -250, rotateX: 22, opacity: 0,
        transformPerspective: P,
        duration: 1.1, ease: 'power3.out'
      });
    }
  }

  /* ============================================================
     MANAGEMENT PAGE
     ============================================================ */

  function setupManagementPage() {
    headerDrop();

    /* Chairman card grand entrance */
    var chairmanArea = document.querySelector(
      '.chairman-card, [class*="profile-card"], [class*="chairman-profile"]'
    );
    if (!chairmanArea) {
      chairmanArea = document.querySelector('[class*="chairman"]');
    }
    if (chairmanArea) {
      gsap.from(chairmanArea, {
        scrollTrigger: { trigger: chairmanArea, start: 'top 82%', once: true },
        z: -450, rotateY: -35, x: -120, opacity: 0,
        transformPerspective: P,
        duration: 1.3, ease: 'power3.out'
      });
    }

    /* Chairman info text */
    var chairmanInfo = document.querySelector(
      '.chairman-content, [class*="chairman-info"], [class*="chairman-text"], [class*="profile-info"], [class*="chairman-details"]'
    );
    if (chairmanInfo) {
      gsap.from(chairmanInfo, {
        scrollTrigger: { trigger: chairmanInfo, start: 'top 82%', once: true },
        z: -220, rotateY: 25, x: 90, opacity: 0,
        transformPerspective: P,
        duration: 1.1, ease: 'power3.out', delay: 0.25
      });
    }

    /* Highlight cards */
    var highlights = document.querySelectorAll('.highlight-card, [class*="highlight-item"], [class*="info-highlight"]');
    if (highlights.length) {
      gsap.from(highlights, {
        scrollTrigger: { trigger: highlights[0].closest('section') || highlights[0], start: 'top 82%', once: true },
        z: -220, y: 65, rotateX: 38, opacity: 0,
        transformPerspective: P,
        duration: 0.88, stagger: 0.13, ease: 'back.out(1.5)'
      });
    }

    /* Message / quote box */
    var msgBox = document.querySelector('[class*="message-box"], [class*="quote-box"], [class*="chairman-message"]');
    if (msgBox) {
      gsap.from(msgBox, {
        scrollTrigger: { trigger: msgBox, start: 'top 84%', once: true },
        z: -180, rotateX: -28, y: 55, opacity: 0,
        transformPerspective: P,
        duration: 1, ease: 'power3.out'
      });
    }

    var teamCta = document.querySelector('.team-cta');
    if (teamCta) {
      gsap.from(teamCta, {
        scrollTrigger: { trigger: teamCta, start: 'top 84%', once: true },
        z: -230,
        y: 50,
        rotateX: 18,
        opacity: 0,
        transformPerspective: P,
        duration: 0.95,
        ease: 'power3.out'
      });
    }

    /* Team tags / badges */
    var tags = document.querySelectorAll('[class*="tag"], [class*="badge"], [class*="kicker"]');
    if (tags.length) {
      gsap.from(tags, {
        scrollTrigger: { trigger: tags[0].closest('section') || tags[0], start: 'top 85%', once: true },
        z: 100, scale: 1.4, rotateX: -30, opacity: 0,
        transformPerspective: 800,
        duration: 0.6, stagger: 0.07, ease: 'back.out(2)'
      });
    }
  }

  /* ============================================================
     SHARED HELPER — page header 3D drop
     ============================================================ */

  function headerDrop() {
    var header = document.querySelector('.page-header, .about-hero, .projects-hero, .gallery-hero');
    if (!header) return;
    if (header.classList.contains('hero-intro-animated')) return;
    var els = header.querySelectorAll('h1, h2, .lead, p, nav, .hero-kicker, .about-hero-kicker, [class*="breadcrumb"]');
    if (!els.length) return;
    gsap.from(els, {
      y: -80, rotateX: -50, opacity: 0, filter: 'blur(5px)',
      transformPerspective: P,
      transformOrigin: 'center top',
      duration: 1, stagger: 0.18, ease: 'power3.out'
    });
  }

  /* ============================================================
     MOUSE TILT — premium 3D card interaction
     ============================================================ */

  function setupMouseTilt() {
    var TILT_SELECTORS = [
      '.feature-card',
      '.project-preview-card',
      '.project-showcase-card',
      '.project-card',
      '.project-video-card',
      '.testimonial-card',
      '.mv-card',
      '.mission-card',
      '.vision-card',
      '.value-card',
      '.value-card-new',
      '.contact-info-card',
      '.contact-info-section .contact-item',
      '.contact-form-section',
      '.highlight-card',
      '.achievement-item',
      '.achieve-card',
      '.chairman-card',
      '.message-box',
      '.team-cta',
      '.map-card',
      '.map-container',
      '.gallery-card',
      '.gal-info-card',
      '.coming-soon-wrap',
      '.cta-box',
      '.projects-cta',
      '.location-section',
      '[class*="info-card"]'
    ].join(',');

    document.querySelectorAll(TILT_SELECTORS).forEach(function (card) {
      card.style.transformStyle = 'preserve-3d';

      card.addEventListener('mousemove', function (e) {
        var r  = card.getBoundingClientRect();
        var x  = (e.clientX - r.left) / r.width  - 0.5;
        var y  = (e.clientY - r.top)  / r.height - 0.5;
        var rx = -y * 14;
        var ry =  x * 14;

        card.style.transition = 'transform 0.06s ease';
        card.style.transform  = [
          'perspective(900px)',
          'rotateX(' + rx + 'deg)',
          'rotateY(' + ry + 'deg)',
          'translateY(-10px)',
          'scale(1.025)'
        ].join(' ');

        card.style.boxShadow = [
          (ry * -1.5) + 'px ' + (Math.abs(rx) + 20) + 'px 50px rgba(0,0,0,0.16)',
          '0 40px 80px rgba(0,0,0,0.08)'
        ].join(', ');
      });

      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1), box-shadow 0.55s ease';
        card.style.transform  = '';
        card.style.boxShadow  = '';
      });

      card.addEventListener('mouseenter', function () {
        card.style.transition = 'transform 0.06s ease';
      });
    });
  }

  /* ============================================================
     HERO PARALLAX — multi-layer depth on scroll
     ============================================================ */

  function setupHeroParallax() {
    var hero = document.querySelector('.hero-section, .about-hero, .projects-hero, .gallery-hero');
    var header = document.querySelector('.page-header');
    var target = hero || header;
    if (!target) return;

    var ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var s = window.scrollY;
          if (s > window.innerHeight) { ticking = false; return; }

          /* Parallax background */
          target.style.backgroundPositionY = (s * 0.45) + 'px';

          /* Hero content subtle lift */
          var heroContent = target.querySelector(
            '.hero-content, [class*="hero-text"], [class*="hero-inner"], .company-name-animation, h1, .hero-title, .about-hero-content'
          );
          if (heroContent) {
            var pct = Math.min(s / (window.innerHeight * 0.75), 1);
            heroContent.style.transform = 'translateY(' + (s * 0.18) + 'px)';
            heroContent.style.opacity   = String(1 - pct * 0.65);
          }

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ============================================================
     CSS FALLBACK — IntersectionObserver (when GSAP not available)
     ============================================================ */

  function runCSSFallback() {
    if (!('IntersectionObserver' in window)) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('anim-3d-active');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    var map = [
      ['.section-header',                               'anim-fade-depth'],
      ['.section-title, h2',                            'anim-fade-depth'],
      ['.feature-card',                                 'anim-rise'],
      ['.project-preview-card, .project-showcase-card, .project-card, .project-video-card', 'anim-rise'],
      ['.mv-card, .mission-card, .vision-card',         'anim-flip-left'],
      ['.value-card, .value-card-new',                  'anim-rise'],
      ['.testimonial-card',                             'anim-rise'],
      ['.timeline-item:nth-child(odd)',                 'anim-slide-left'],
      ['.timeline-item:nth-child(even)',                'anim-slide-right'],
      ['.achievement-item, .achieve-card, [class*="achievement-card"]','anim-zoom'],
      ['.contact-info-card, .contact-info-section .contact-item, .contact-form-section, [class*="contact-detail"]', 'anim-rise'],
      ['.highlight-card, .chairman-card, .message-box, .team-cta, [class*="highlight-item"]', 'anim-rise'],
      ['.gallery-card, .gal-info-card, .coming-soon-wrap, .cta-box', 'anim-rise'],
      ['.location-section, .projects-cta, .map-card, .map-container', 'anim-rise'],
      ['.filter-btn',                                   'anim-rise']
    ];

    map.forEach(function (pair) {
      document.querySelectorAll(pair[0]).forEach(function (el) {
        el.classList.add('anim-3d-init', pair[1]);
        obs.observe(el);
      });
    });

    /* Page header drop */
    var hEls = document.querySelectorAll('.page-header h1, .page-header .lead, .about-hero h1, .projects-hero h1, .gallery-hero h1, .hero-kicker');
    hEls.forEach(function (el) {
      el.classList.add('anim-3d-init', 'anim-drop-top');
      obs.observe(el);
    });
  }

})();
