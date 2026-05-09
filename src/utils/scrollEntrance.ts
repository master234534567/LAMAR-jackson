// SCROLL ENTRANCE ANIMATION INITIALIZATION
// Applies slide-in-left/right classes and sets up Intersection Observer

export function initScrollEntranceAnimations() {
  document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECT ALL ELEMENTS THAT SHOULD ANIMATE
    const elements = document.querySelectorAll(
      '.glass, ' +
      '.stats-card, ' +
      '[class*="card"], ' +
      '[class*="timeline"], ' +
      '[class*="entry"], ' +
      '.gallery-item > div, ' +
      'section > div > div:first-child, ' +
      '.stat-item, ' +
      '.filter-pill, ' +
      'img'
    );

    // 2. ASSIGN CLASSES AND DATA ATTRIBUTES
    elements.forEach((el, index) => {
      const slideClass = index % 2 === 0 ? 'slide-in-left' : 'slide-in-right';
      el.classList.add(slideClass);
      el.setAttribute('data-index', String(Math.floor(index / 8) % 8)); // Cycle through 0-7 for stagger
    });

    // 3. SET UP INTERSECTION OBSERVER
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // 4. OBSERVE ALL ANIMATED ELEMENTS
    document.querySelectorAll('.slide-in-left, .slide-in-right').forEach((el) => {
      observer.observe(el);
    });
  });
}

// Call on module load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollEntranceAnimations);
  } else {
    initScrollEntranceAnimations();
  }
}
