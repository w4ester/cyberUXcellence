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