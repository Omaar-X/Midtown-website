// Projects Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
  
  // Project filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      const filterValue = this.getAttribute('data-filter');
      
      // Show/hide project items based on filter
      projectItems.forEach(item => {
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
  
  // Project enquiry buttons
  const enquiryButtons = document.querySelectorAll('.btn-outline-primary');
  enquiryButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const projectCard = this.closest('.project-card');
      const projectTitle = projectCard.querySelector('h4').textContent;
      
      // Store project name in sessionStorage to pre-fill contact form
      sessionStorage.setItem('selectedProject', projectTitle);
      
      // Redirect to contact page
      window.location.href = 'contact.html';
    });
  });
});