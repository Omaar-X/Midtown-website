// Gallery Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
  
  // Gallery filtering
  const filterButtons = document.querySelectorAll('.gallery-filter .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      const filterValue = this.getAttribute('data-filter');
      
      // Show/hide gallery items based on filter
      galleryItems.forEach(item => {
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
  
  // Lightbox functionality
  const galleryCards = document.querySelectorAll('.gallery-card');
  const modal = new bootstrap.Modal(document.getElementById('imageModal'));
  const modalImage = document.getElementById('modalImage');
  
  galleryCards.forEach(card => {
    card.addEventListener('click', function() {
      const imageSrc = this.querySelector('.gallery-image').getAttribute('src');
      const imageAlt = this.querySelector('.gallery-image').getAttribute('alt');
      
      modalImage.setAttribute('src', imageSrc);
      modalImage.setAttribute('alt', imageAlt);
      
      modal.show();
    });
  });
  
  // Video placeholder click
  const videoPlaceholders = document.querySelectorAll('.video-placeholder');
  videoPlaceholders.forEach(placeholder => {
    placeholder.addEventListener('click', function() {
      alert('Video feature will be implemented soon!');
    });
  });
});