/**
 * Custom Animation Observer
 * Replaces/supplements AOS with native IntersectionObserver API
 * Simpler and more reliable for fade animations
 */

(function() {
  'use strict';
  
  // Only run if IntersectionObserver is supported
  if (!window.IntersectionObserver) {
    console.warn('IntersectionObserver not supported. Animations disabled.');
    return;
  }

  console.log('[Animation Observer] Initializing...');

  // Configuration
  const config = {
    root: null,
    rootMargin: '0px',
    threshold: [0, 0.1, 0.5]  // Trigger at different scroll positions
  };

  // Callback when element enters viewport
  function handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add animation class when element enters viewport
        entry.target.classList.add('aos-animate');
        
        // Optionally disconnect after animating once if data-aos-once="true"
        const once = entry.target.getAttribute('data-aos-once');
        if (once === 'true') {
          observer.unobserve(entry.target);
        }
        
        console.log('[Animation Observer] Animated:', entry.target.tagName, entry.target.className);
      } else {
        // Remove animation class if data-aos-once is false
        const once = entry.target.getAttribute('data-aos-once');
        if (once !== 'true') {
          entry.target.classList.remove('aos-animate');
        }
      }
    });
  }

  // Create observer
  const observer = new IntersectionObserver(handleIntersection, config);

  // Wait for DOM to be ready
  function observeAnimationElements() {
    const elements = document.querySelectorAll('[data-aos]');
    console.log(`[Animation Observer] Found ${elements.length} elements to animate`);
    
    elements.forEach((el, index) => {
      observer.observe(el);
      console.log(`[Animation Observer] Observing element ${index + 1}:`, el.className);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeAnimationElements);
  } else {
    observeAnimationElements();
  }

  // Also add CSS for animations if they don't exist
  function ensureAnimationCSS() {
    const styleId = 'custom-animation-styles';
    if (document.getElementById(styleId)) {
      return; // Already added
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Fade animations */
      [data-aos="fade-up"] { 
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
      }
      [data-aos="fade-up"].aos-animate { 
        opacity: 1;
        transform: translateY(0);
      }

      [data-aos="fade-down"] { 
        opacity: 0;
        transform: translateY(-30px);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
      }
      [data-aos="fade-down"].aos-animate { 
        opacity: 1;
        transform: translateY(0);
      }

      [data-aos="fade-left"] { 
        opacity: 0;
        transform: translateX(30px);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
      }
      [data-aos="fade-left"].aos-animate { 
        opacity: 1;
        transform: translateX(0);
      }

      [data-aos="fade-right"] { 
        opacity: 0;
        transform: translateX(-30px);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
      }
      [data-aos="fade-right"].aos-animate { 
        opacity: 1;
        transform: translateX(0);
      }

      [data-aos="zoom-in"] { 
        opacity: 0;
        transform: scale(0.9);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
      }
      [data-aos="zoom-in"].aos-animate { 
        opacity: 1;
        transform: scale(1);
      }

      /* Flip animations */
      [data-aos="flip-right"] {
        opacity: 0;
        transform: perspective(2500px) rotateY(100deg);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        backface-visibility: hidden;
      }
      [data-aos="flip-right"].aos-animate {
        opacity: 1;
        transform: perspective(2500px) rotateY(0);
      }

      [data-aos="flip-left"] {
        opacity: 0;
        transform: perspective(2500px) rotateY(-100deg);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        backface-visibility: hidden;
      }
      [data-aos="flip-left"].aos-animate {
        opacity: 1;
        transform: perspective(2500px) rotateY(0);
      }

      [data-aos="flip-up"] {
        opacity: 0;
        transform: perspective(2500px) rotateX(-100deg);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        backface-visibility: hidden;
      }
      [data-aos="flip-up"].aos-animate {
        opacity: 1;
        transform: perspective(2500px) rotateX(0);
      }

      [data-aos="flip-down"] {
        opacity: 0;
        transform: perspective(2500px) rotateX(100deg);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        backface-visibility: hidden;
      }
      [data-aos="flip-down"].aos-animate {
        opacity: 1;
        transform: perspective(2500px) rotateX(0);
      }

      /* Duration support */
      [data-aos-duration="600"] { transition-duration: 0.6s !important; }
      [data-aos-duration="900"] { transition-duration: 0.9s !important; }
      [data-aos-duration="1000"] { transition-duration: 1s !important; }
      [data-aos-duration="1200"] { transition-duration: 1.2s !important; }
    `;
    document.head.appendChild(style);
    console.log('[Animation Observer] CSS styles added');
  }

  ensureAnimationCSS();

  console.log('[Animation Observer] Initialization complete');
})();
