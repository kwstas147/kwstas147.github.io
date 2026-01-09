/**
 * Ripple Effect on Click
 * Adds a ripple animation to buttons and cards on click
 */

(function() {
    'use strict';

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        return; // Skip if user prefers reduced motion
    }

    function createRipple(event, element) {
        // Remove existing ripples
        const existingRipples = element.querySelectorAll('.ripple');
        existingRipples.forEach(ripple => ripple.remove());

        // Get element dimensions and position
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        // Add to element
        element.appendChild(ripple);

        // Remove after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Initialize ripple effect on elements with class 'ripple-effect' or on buttons/cards
    function initRippleEffect() {
        // Add ripple-effect class to interactive elements if not present
        const buttons = document.querySelectorAll('button, a.bg-blue-600, .bg-blue-600');
        const cards = document.querySelectorAll('.category-card, .project-card');

        buttons.forEach(btn => {
            if (!btn.classList.contains('ripple-effect')) {
                btn.classList.add('ripple-effect');
            }
            btn.addEventListener('click', function(e) {
                createRipple(e, this);
            });
        });

        cards.forEach(card => {
            if (!card.classList.contains('ripple-effect')) {
                card.classList.add('ripple-effect');
            }
            // Only add ripple on cards if they're not links (to avoid double triggers)
            if (!card.tagName === 'A') {
                card.addEventListener('click', function(e) {
                    createRipple(e, this);
                });
            }
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRippleEffect);
    } else {
        initRippleEffect();
    }

    // Re-initialize when new content is added (e.g., after language change)
    document.addEventListener('contentLoaded', initRippleEffect);
})();
