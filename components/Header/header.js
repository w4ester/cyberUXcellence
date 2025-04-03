function initHeader() {
  // DOM elements
  const header = document.getElementById('site-header');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.getElementById('nav-links');
  const navLinksItems = document.querySelectorAll('.nav-link');
  const nominateBtn = document.getElementById('open-nomination-modal-nav');
  
  // Toggle mobile menu
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      
      // Update aria-expanded attribute
      const isExpanded = hamburger.classList.contains('active');
      hamburger.setAttribute('aria-expanded', isExpanded);
      
      // Prevent scrolling when menu is open
      document.body.style.overflow = isExpanded ? 'hidden' : '';
    });
  }
  
  // Close mobile menu when clicking a link
  navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
      if (hamburger.classList.contains('active')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  });
  
  // Header scroll behavior
  function handleHeaderScroll() {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  // Initialize scroll handler
  window.addEventListener('scroll', handleHeaderScroll);
  
  // Initialize header state on page load
  handleHeaderScroll();
  
  // Connect nomination button to modal if exists
  if (nominateBtn) {
    nominateBtn.addEventListener('click', () => {
      const modal = document.getElementById('nomination-modal');
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }
}

// Export the initialization function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initHeader };
}