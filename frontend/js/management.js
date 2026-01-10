// management.js - Management Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
  
  // Set current year in footer
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Team card hover effect enhancement
  const managementCards = document.querySelectorAll('.management-card');
  
  managementCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      const badge = this.querySelector('.management-badge');
      if (badge) {
        badge.style.transform = 'translateY(0)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      const badge = this.querySelector('.management-badge');
      if (badge) {
        badge.style.transform = 'translateY(0)';
      }
    });
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Contact email copy functionality
  const contactLinks = document.querySelectorAll('.contact-link');
  
  contactLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const email = this.querySelector('span').textContent;
      
      // Copy to clipboard
      navigator.clipboard.writeText(email).then(() => {
        // Show success message
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fa-solid fa-check"></i> <span>Copied!</span>';
        
        setTimeout(() => {
          this.innerHTML = originalText;
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy email: ', err);
        // Fallback - open mail client
        window.location.href = `mailto:${email}`;
      });
    });
  });
  
  // Navbar scroll effect
  const navbar = document.querySelector('.main-navbar');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.style.padding = '0.5rem 0';
      navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
      navbar.style.padding = '0.8rem 0';
      navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    }
  });
  
  // Team introduction animation
  const teamIntro = document.querySelector('.team-intro');
  if (teamIntro) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate__animated', 'animate__fadeInUp');
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(teamIntro);
  }
  
  // Management cards animation
  const managementCardsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animate__animated', 'animate__fadeInUp');
        }, index * 200);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.management-card').forEach(card => {
    managementCardsObserver.observe(card);
  });
  
  // Philosophy cards animation
  const philosophyCards = document.querySelectorAll('.philosophy-card');
  const philosophyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animate__animated', 'animate__zoomIn');
        }, index * 300);
      }
    });
  }, { threshold: 0.1 });
  
  philosophyCards.forEach(card => {
    philosophyObserver.observe(card);
  });
  
  // CTA button click tracking
  const ctaButtons = document.querySelectorAll('.cta-buttons .btn');
  ctaButtons.forEach(button => {
    button.addEventListener('click', function() {
      const buttonText = this.textContent.trim();
      console.log(`CTA button clicked: ${buttonText}`);
      
      // You can add analytics tracking here
      // Example: ga('send', 'event', 'Button', 'Click', buttonText);
    });
  });
  
  // Mobile menu enhancement
  const navToggler = document.querySelector('.navbar-toggler');
  if (navToggler) {
    navToggler.addEventListener('click', function() {
      this.classList.toggle('active');
    });
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
});