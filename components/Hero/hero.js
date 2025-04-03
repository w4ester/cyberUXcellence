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