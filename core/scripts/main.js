/**
 * Main JavaScript file for the CyberUXcellence website
 * Orchestrates component initialization and global functionality
 */

// Component initialization map
const componentInitializers = {
  // Core components
  header: typeof initHeader === 'function' ? initHeader : null,
  hero: typeof initHero === 'function' ? initHero : null,
  about: typeof initAbout === 'function' ? initAbout : null,
  categories: typeof initCategories === 'function' ? initCategories : null,
  whyNominate: typeof initWhyNominate === 'function' ? initWhyNominate : null,
  timeline: typeof initTimeline === 'function' ? initTimeline : null,
  faq: typeof initFAQ === 'function' ? initFAQ : null,
  nominationForm: typeof initNominationForm === 'function' ? initNominationForm : null,
  footer: typeof initFooter === 'function' ? initFooter : null
};

// Initialize all components
document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS (Animate on Scroll) if available
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      disable: 'mobile'
    });
  }
  
  // Initialize each component if its initializer exists
  Object.entries(componentInitializers).forEach(([name, initializer]) => {
    if (typeof initializer === 'function') {
      try {
        initializer();
        console.log(`Initialized ${name} component`);
      } catch (error) {
        console.error(`Error initializing ${name} component:`, error);
      }
    }
  });
  
  // Initialize global elements
  initBackToTop();
  initCookieConsent();
  initModalHandlers();
  
  // Update copyright year
  updateCopyrightYear();
});

/**
 * Initialize the back-to-top button functionality
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  
  if (!backToTopBtn) return;
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  // Scroll to top when clicked
  backToTopBtn.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Initialize the cookie consent banner functionality
 */
function initCookieConsent() {
  const cookieConsent = document.getElementById('cookie-consent');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');
  
  if (!cookieConsent) return;
  
  // Check if user has already made a choice
  if (localStorage.getItem('cookieConsent') === 'accepted' || 
      localStorage.getItem('cookieConsent') === 'declined') {
    cookieConsent.style.display = 'none';
    return;
  }
  
  // Show the consent banner
  cookieConsent.style.display = 'block';
  
  // Handle accept
  if (acceptBtn) {
    acceptBtn.addEventListener('click', function() {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieConsent.style.display = 'none';
      
      // Here you would initialize any tracking that requires consent
    });
  }
  
  // Handle decline
  if (declineBtn) {
    declineBtn.addEventListener('click', function() {
      localStorage.setItem('cookieConsent', 'declined');
      cookieConsent.style.display = 'none';
    });
  }
}

/**
 * Initialize modal functionality
 */
function initModalHandlers() {
  const nominationModal = document.getElementById('nomination-modal');
  if (!nominationModal) return;
  
  // Get all elements that can open the nomination modal
  const modalOpeners = document.querySelectorAll('[id^="open-nomination-modal"]');
  const modalClose = nominationModal.querySelector('.modal-close');
  const modalBackdrop = nominationModal.querySelector('.modal-backdrop');
  
  // Open modal
  modalOpeners.forEach(opener => {
    opener.addEventListener('click', function() {
      nominationModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
  
  // Close modal
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  // Close on backdrop click
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeModal);
  }
  
  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && nominationModal.classList.contains('active')) {
      closeModal();
    }
  });
  
  function closeModal() {
    nominationModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Update the copyright year in the footer
 */
function updateCopyrightYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Export functionality for potential use by other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    initBackToTop, 
    initCookieConsent, 
    initModalHandlers, 
    updateCopyrightYear 
  };
}