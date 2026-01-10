// home.js - Home Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
  
  // Initialize GSAP
  gsap.registerPlugin(ScrollTrigger);
  
  // Preloader Animation
  const preloader = document.querySelector('.preloader');
  const loadingProgress = document.querySelector('.loading-progress');
  
  if (preloader) {
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
        
        // Add loaded class after animation completes
        setTimeout(() => {
          preloader.classList.add('loaded');
          document.body.style.overflow = 'auto';
        }, 500);
      }
      
      if (loadingProgress) {
        loadingProgress.style.width = progress + '%';
      }
    }, 100);
    
    // Prevent scrolling during preloader
    document.body.style.overflow = 'hidden';
  }
  
  // Company Name Letter Animation
  const letters = document.querySelectorAll('.letter');
  letters.forEach((letter, index) => {
    // Already animated via CSS, but we can add GSAP for extra control
    gsap.fromTo(letter,
      {
        y: 50,
        opacity: 0,
        rotationX: -90
      },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "back.out(1.7)"
      }
    );
  });
  
  // Tagline Animation
  const taglineParts = document.querySelectorAll('.tagline-part');
  taglineParts.forEach((part, index) => {
    gsap.fromTo(part,
      {
        x: -50,
        opacity: 0
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        delay: 1.8 + (index * 0.2),
        ease: "power3.out"
      }
    );
  });
  
  // Hero Subtitle Animation
  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle) {
    gsap.fromTo(heroSubtitle,
      {
        y: 30,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 2.2,
        ease: "power3.out"
      }
    );
  }
  
  // Text Highlight Animation
  const highlights = document.querySelectorAll('.text-highlight');
  highlights.forEach((highlight, index) => {
    gsap.fromTo(highlight.querySelector(':after') || highlight,
      {
        scaleX: 0
      },
      {
        scaleX: 1,
        duration: 0.8,
        delay: 2.5 + (index * 0.3),
        ease: "power2.out"
      }
    );
  });
  
  // CTA Buttons Animation
  const ctaButtons = document.querySelectorAll('.hero-cta-animation .btn');
  ctaButtons.forEach((btn, index) => {
    gsap.fromTo(btn,
      {
        y: 30,
        opacity: 0,
        scale: 0.9
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        delay: 2.8 + (index * 0.2),
        ease: "back.out(1.7)"
      }
    );
  });
  
  // Quick Stats Counter Animation
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-count'));
    const increment = target / 50;
    let current = 0;
    
    const updateCount = () => {
      if (current < target) {
        current += increment;
        if (current > target) current = target;
        stat.textContent = Math.floor(current) + (target > 100 ? '+' : '');
        requestAnimationFrame(updateCount);
      }
    };
    
    // Start counting when element is in view
    ScrollTrigger.create({
      trigger: stat,
      start: "top 80%",
      onEnter: updateCount,
      once: true
    });
  });
  
  // Feature Cards Animation
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach((card, index) => {
    gsap.fromTo(card,
      {
        y: 50,
        opacity: 0,
        rotationY: 10
      },
      {
        y: 0,
        opacity: 1,
        rotationY: 0,
        duration: 0.8,
        delay: index * 0.1,
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );
  });
  
  // Project Cards Animation
  const projectCards = document.querySelectorAll('.project-showcase-card');
  projectCards.forEach((card, index) => {
    gsap.fromTo(card,
      {
        y: 100,
        opacity: 0,
        scale: 0.9
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: index * 0.2,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        ease: "back.out(1.7)"
      }
    );
  });
  
  // Testimonial Cards Animation
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  testimonialCards.forEach((card, index) => {
    gsap.fromTo(card,
      {
        x: index % 2 === 0 ? -50 : 50,
        opacity: 0,
        rotationZ: 5
      },
      {
        x: 0,
        opacity: 1,
        rotationZ: 0,
        duration: 0.8,
        delay: index * 0.2,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        ease: "power3.out"
      }
    );
  });
  
  // Floating Card Animation
  const floatingCard = document.querySelector('.floating-preview-card');
  if (floatingCard) {
    gsap.to(floatingCard, {
      y: -20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }
  
  // Scroll Indicator
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    ScrollTrigger.create({
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        if (self.progress > 0.1) {
          gsap.to(scrollIndicator, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        } else {
          gsap.to(scrollIndicator, {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      }
    });
  }
  
  // Back to Top Button
  const backToTopBtn = document.querySelector('.back-to-top');
  
  if (backToTopBtn) {
    // Show/hide button on scroll
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    
    // Smooth scroll to top
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Hover effects for feature cards
  featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      gsap.to(this.querySelector('.feature-icon'), {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out"
      });
      
      gsap.to(this.querySelector('.feature-pulse'), {
        scale: 1.3,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      });
    });
    
    card.addEventListener('mouseleave', function() {
      gsap.to(this.querySelector('.feature-icon'), {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    });
  });
  
  // Project card hover effects
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      const image = this.querySelector('img');
      const overlay = this.querySelector('.project-overlay');
      
      gsap.to(image, {
        scale: 1.1,
        duration: 0.5,
        ease: "power2.out"
      });
      
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    card.addEventListener('mouseleave', function() {
      const image = this.querySelector('img');
      const overlay = this.querySelector('.project-overlay');
      
      gsap.to(image, {
        scale: 1,
        duration: 0.5,
        ease: "power2.out"
      });
      
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    });
  });
  
  // Navbar scroll effect
  const navbar = document.querySelector('.main-navbar');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.style.padding = '0.5rem 0';
      navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
      navbar.style.background = 'linear-gradient(90deg, #0b3d68, #0e4e82)';
    } else {
      navbar.style.padding = '0.8rem 0';
      navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      navbar.style.background = 'linear-gradient(90deg, #0b3d68, #0e4e82)';
    }
  });
  
  // Set current year in footer
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Add current page indicator in navigation
  const currentPage = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || 
        (currentPage === '' && linkPage === 'index.html') ||
        (currentPage === 'index.html' && linkPage === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // CTA button pulse animation
  const ctaButton = document.querySelector('.btn-primary-gradient.animate__pulse');
  if (ctaButton) {
    setInterval(() => {
      ctaButton.classList.remove('animate__pulse');
      void ctaButton.offsetWidth; // Trigger reflow
      ctaButton.classList.add('animate__pulse');
    }, 4000);
  }
  
  // Shape animations
  const shapes = document.querySelectorAll('.shape');
  shapes.forEach((shape, index) => {
    gsap.to(shape, {
      rotation: 360,
      duration: 20 + (index * 5),
      repeat: -1,
      ease: "none"
    });
  });
});