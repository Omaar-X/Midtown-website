// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
  
  // Pre-fill project selection if coming from projects page
  const selectedProject = sessionStorage.getItem('selectedProject');
  const projectSelect = document.getElementById('project');
  
  if (selectedProject && projectSelect) {
    // Find option that matches the project name
    for (let option of projectSelect.options) {
      if (option.text.includes(selectedProject)) {
        projectSelect.value = option.value;
        break;
      }
    }
    
    // Clear sessionStorage
    sessionStorage.removeItem('selectedProject');
  }
  
  // Form validation and submission
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate form
      let isValid = true;
      const requiredFields = this.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('is-invalid');
        } else {
          field.classList.remove('is-invalid');
        }
      });
      
      // Validate email format if provided
      const emailField = document.getElementById('email');
      if (emailField.value && !isValidEmail(emailField.value)) {
        isValid = false;
        emailField.classList.add('is-invalid');
      }
      
      // Validate phone number
      const phoneField = document.getElementById('phone');
      if (phoneField.value && !isValidPhone(phoneField.value)) {
        isValid = false;
        phoneField.classList.add('is-invalid');
      }
      
      if (!isValid) {
        alert('Please fill in all required fields correctly.');
        return;
      }
      
      // Get form data
      const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        project: document.getElementById('project').value,
        message: document.getElementById('message').value,
        newsletter: document.getElementById('newsletter').checked
      };
      
      // Here you would typically send the data to a server
      console.log('Contact form submitted:', formData);
      
      // Show success message
      alert('Thank you for your enquiry! We will contact you within 24 hours.');
      
      // Reset form
      this.reset();
      
      // Redirect to thank you page or home page
      // window.location.href = 'thank-you.html';
    });
  }
  
  // Helper functions
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function isValidPhone(phone) {
    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    return phoneRegex.test(phone);
  }
  
  // Real-time validation
  const formInputs = document.querySelectorAll('#contactForm input, #contactForm textarea, #contactForm select');
  formInputs.forEach(input => {
    input.addEventListener('input', function() {
      this.classList.remove('is-invalid');
    });
  });
});
// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Test API connection
async function testAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/test`);
    const data = await response.json();
    console.log('✅ API Connection Successful:', data);
  } catch (error) {
    console.error('❌ API Connection Failed:', error);
  }
}

// Call on page load
testAPI();