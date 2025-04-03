/**
 * Utility functions for CyberUXcellence website
 */

// DOM helper functions
const DOM = {
  /**
   * Get an element by ID
   * @param {string} id - Element ID
   * @returns {HTMLElement|null}
   */
  byId: (id) => document.getElementById(id),
  
  /**
   * Get elements by a CSS selector
   * @param {string} selector - CSS selector
   * @param {HTMLElement|Document} parent - Parent element (defaults to document)
   * @returns {NodeList}
   */
  query: (selector, parent = document) => parent.querySelectorAll(selector),
  
  /**
   * Get the first element matching a CSS selector
   * @param {string} selector - CSS selector
   * @param {HTMLElement|Document} parent - Parent element (defaults to document)
   * @returns {HTMLElement|null}
   */
  queryFirst: (selector, parent = document) => parent.querySelector(selector),
  
  /**
   * Create an element with attributes and content
   * @param {string} tag - HTML tag
   * @param {Object} attributes - Element attributes
   * @param {string|HTMLElement|Array} content - Element content
   * @returns {HTMLElement}
   */
  create: (tag, attributes = {}, content = null) => {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'dataset') {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = dataValue;
        });
      } else {
        element.setAttribute(key, value);
      }
    });
    
    // Add content
    if (content) {
      if (Array.isArray(content)) {
        content.forEach(item => {
          if (typeof item === 'string') {
            element.appendChild(document.createTextNode(item));
          } else if (item instanceof HTMLElement) {
            element.appendChild(item);
          }
        });
      } else if (typeof content === 'string') {
        element.textContent = content;
      } else if (content instanceof HTMLElement) {
        element.appendChild(content);
      }
    }
    
    return element;
  },
  
  /**
   * Add event listener to element(s)
   * @param {HTMLElement|NodeList|Array} elements - Element(s) to add listener to
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   * @param {Object} options - Event options
   */
  on: (elements, event, callback, options = {}) => {
    if (elements instanceof NodeList || Array.isArray(elements)) {
      elements.forEach(el => el.addEventListener(event, callback, options));
    } else if (elements instanceof HTMLElement) {
      elements.addEventListener(event, callback, options);
    }
  },
  
  /**
   * Remove event listener from element(s)
   * @param {HTMLElement|NodeList|Array} elements - Element(s) to remove listener from
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  off: (elements, event, callback) => {
    if (elements instanceof NodeList || Array.isArray(elements)) {
      elements.forEach(el => el.removeEventListener(event, callback));
    } else if (elements instanceof HTMLElement) {
      elements.removeEventListener(event, callback);
    }
  }
};

// Animation helper functions
const Animation = {
  /**
   * Animate an element with CSS transitions
   * @param {HTMLElement} element - Element to animate
   * @param {Object} properties - CSS properties to animate
   * @param {number} duration - Animation duration in ms
   * @param {string} easing - CSS easing function
   * @returns {Promise} - Promise that resolves when animation is complete
   */
  transition: (element, properties, duration = 300, easing = 'ease') => {
    return new Promise(resolve => {
      element.style.transition = `all ${duration}ms ${easing}`;
      
      // Set properties
      Object.entries(properties).forEach(([prop, value]) => {
        element.style[prop] = value;
      });
      
      // Listen for transition end
      const onTransitionEnd = () => {
        element.removeEventListener('transitionend', onTransitionEnd);
        resolve();
      };
      
      element.addEventListener('transitionend', onTransitionEnd);
    });
  },
  
  /**
   * Fade in an element
   * @param {HTMLElement} element - Element to fade in
   * @param {number} duration - Animation duration in ms
   * @returns {Promise} - Promise that resolves when animation is complete
   */
  fadeIn: (element, duration = 300) => {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    // Force reflow
    void element.offsetWidth;
    
    return Animation.transition(element, { opacity: '1' }, duration);
  },
  
  /**
   * Fade out an element
   * @param {HTMLElement} element - Element to fade out
   * @param {number} duration - Animation duration in ms
   * @returns {Promise} - Promise that resolves when animation is complete
   */
  fadeOut: (element, duration = 300) => {
    return Animation.transition(element, { opacity: '0' }, duration)
      .then(() => {
        element.style.display = 'none';
      });
  },
  
  /**
   * Slide down an element
   * @param {HTMLElement} element - Element to slide down
   * @param {number} duration - Animation duration in ms
   * @returns {Promise} - Promise that resolves when animation is complete
   */
  slideDown: (element, duration = 300) => {
    element.style.overflow = 'hidden';
    element.style.height = '0';
    element.style.paddingTop = '0';
    element.style.paddingBottom = '0';
    element.style.marginTop = '0';
    element.style.marginBottom = '0';
    element.style.display = 'block';
    
    // Get target height
    const height = element.scrollHeight;
    
    // Force reflow
    void element.offsetWidth;
    
    // Animate
    return Animation.transition(
      element, 
      { 
        height: `${height}px`,
        paddingTop: '',
        paddingBottom: '',
        marginTop: '',
        marginBottom: ''
      }, 
      duration
    ).then(() => {
      element.style.height = '';
      element.style.overflow = '';
    });
  },
  
  /**
   * Slide up an element
   * @param {HTMLElement} element - Element to slide up
   * @param {number} duration - Animation duration in ms
   * @returns {Promise} - Promise that resolves when animation is complete
   */
  slideUp: (element, duration = 300) => {
    element.style.overflow = 'hidden';
    element.style.height = `${element.scrollHeight}px`;
    
    // Force reflow
    void element.offsetWidth;
    
    // Animate
    return Animation.transition(
      element, 
      { 
        height: '0',
        paddingTop: '0',
        paddingBottom: '0',
        marginTop: '0',
        marginBottom: '0'
      }, 
      duration
    ).then(() => {
      element.style.display = 'none';
      element.style.height = '';
      element.style.overflow = '';
      element.style.paddingTop = '';
      element.style.paddingBottom = '';
      element.style.marginTop = '';
      element.style.marginBottom = '';
    });
  }
};

// Validation helper functions
const Validation = {
  /**
   * Validate an email address
   * @param {string} email - Email address to validate
   * @returns {boolean} - Whether the email is valid
   */
  isValidEmail: (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },
  
  /**
   * Validate a URL
   * @param {string} url - URL to validate
   * @returns {boolean} - Whether the URL is valid
   */
  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  },
  
  /**
   * Validate form fields
   * @param {HTMLFormElement} form - Form to validate
   * @returns {Object} - Validation result
   */
  validateForm: (form) => {
    const fields = Array.from(form.elements);
    const errors = {};
    let isValid = true;
    
    fields.forEach(field => {
      // Skip buttons, fieldsets, etc.
      if (!field.name || field.type === 'button' || field.type === 'submit' || field.type === 'reset') {
        return;
      }
      
      // Check required fields
      if (field.hasAttribute('required') && !field.value.trim()) {
        errors[field.name] = 'This field is required';
        isValid = false;
        return;
      }
      
      // Validate by type
      switch (field.type) {
        case 'email':
          if (field.value && !Validation.isValidEmail(field.value)) {
            errors[field.name] = 'Please enter a valid email address';
            isValid = false;
          }
          break;
        case 'url':
          if (field.value && !Validation.isValidUrl(field.value)) {
            errors[field.name] = 'Please enter a valid URL';
            isValid = false;
          }
          break;
        case 'tel':
          if (field.value && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(field.value)) {
            errors[field.name] = 'Please enter a valid phone number';
            isValid = false;
          }
          break;
      }
    });
    
    return { isValid, errors };
  }
};

// Utility functions for handling common tasks
const Utils = {
  /**
   * Debounce a function call
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function} - Debounced function
   */
  debounce: (func, wait = 100) => {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },
  
  /**
   * Throttle a function call
   * @param {Function} func - Function to throttle
   * @param {number} limit - Throttle limit in ms
   * @returns {Function} - Throttled function
   */
  throttle: (func, limit = 100) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  /**
   * Format a date
   * @param {Date|string} date - Date to format
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string} - Formatted date
   */
  formatDate: (date, options = {}) => {
    const defaultOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return new Intl.DateTimeFormat(
      'en-US', 
      { ...defaultOptions, ...options }
    ).format(dateObj);
  },
  
  /**
   * Get query parameters from URL
   * @returns {Object} - Query parameters
   */
  getQueryParams: () => {
    const params = {};
    new URLSearchParams(window.location.search).forEach((value, key) => {
      params[key] = value;
    });
    return params;
  },
  
  /**
   * Generate a unique ID
   * @param {string} prefix - ID prefix
   * @returns {string} - Unique ID
   */
  uniqueId: (prefix = 'id') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },
  
  /**
   * Check if an element is in viewport
   * @param {HTMLElement} element - Element to check
   * @param {number} offset - Offset in pixels
   * @returns {boolean} - Whether the element is in viewport
   */
  isInViewport: (element, offset = 0) => {
    const rect = element.getBoundingClientRect();
    
    return (
      rect.top + offset < window.innerHeight &&
      rect.bottom - offset > 0 &&
      rect.left + offset < window.innerWidth &&
      rect.right - offset > 0
    );
  }
};

// Export all utilities
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DOM, Animation, Validation, Utils };
}
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
/* Header Component Script */
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
/* Hero Component Script */
function initHero() {
  // DOM elements
  const heroSection = document.getElementById('hero');
  const heroParticles = document.querySelector('.hero-particles');
  const nominateBtn = document.getElementById('open-nomination-modal-hero');
  
  // Initialize particles if needed
  if (heroParticles) {
    createParticles();
  }
  
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
  
  // Create particle effect
  function createParticles() {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('span');
      particle.classList.add('particle');
      
      // Random position
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const size = Math.random() * 5 + 1;
      const animDuration = Math.random() * 10 + 10;
      const opacity = Math.random() * 0.5 + 0.1;
      
      // Apply styles
      particle.style.cssText = `
        position: absolute;
        top: ${posY}%;
        left: ${posX}%;
        width: ${size}px;
        height: ${size}px;
        background-color: rgba(255, 255, 255, ${opacity});
        border-radius: 50%;
        animation: float ${animDuration}s linear infinite;
      `;
      
      // Add to the container
      heroParticles.appendChild(particle);
    }
  }
}

// CSS Animation for particles
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0% {
      transform: translateY(0) translateX(0);
      opacity: 0;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      transform: translateY(-100px) translateX(20px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Export the initialization function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initHero };
}
