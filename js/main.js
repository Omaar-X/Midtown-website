// main.js - General JavaScript for all pages

document.addEventListener('DOMContentLoaded', function() {
  
  // Set current year in footer
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Navbar scroll effect
  const navbar = document.querySelector('.main-navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.style.padding = '0.5rem 0';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
      } else {
        navbar.style.padding = '0.8rem 0';
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      }
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
  
  // Smooth scrolling for anchor links
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
        
        // Close mobile navbar if open
        const navbarCollapse = document.querySelector('.navbar-collapse.show');
        if (navbarCollapse) {
          const bsCollapse = new bootstrap.Collapse(navbarCollapse);
          bsCollapse.hide();
        }
      }
    });
  });
  
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
  
  // Initialize popovers
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.map(function(popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });
  
  // Form validation
  const forms = document.querySelectorAll('.needs-validation');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });
  
  // Mobile menu enhancement
  const navToggler = document.querySelector('.navbar-toggler');
  if (navToggler) {
    navToggler.addEventListener('click', function() {
      this.classList.toggle('active');
    });
  }
  
  // Add loading state to buttons
  const submitButtons = document.querySelectorAll('button[type="submit"]');
  submitButtons.forEach(button => {
    button.addEventListener('click', function() {
      const form = this.closest('form');
      if (form && form.checkValidity()) {
        this.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Processing...';
        this.disabled = true;
      }
    });
  });
  
  // Lazy loading images
  const lazyImages = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  }
  
  // Add animation on scroll for elements with animate-on-scroll class
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate__animated', 'animate__fadeInUp');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    animateElements.forEach(el => observer.observe(el));
  } else {
    animateElements.forEach(el => {
      el.classList.add('animate__animated', 'animate__fadeInUp');
    });
  }
});