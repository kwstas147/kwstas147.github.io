/**
 * 3D Card Tilt Effect
 * Cards tilt based on mouse position for a 3D effect
 */

(function() {
    'use strict';

    // Tilt effect is globally disabled because it was
    // considered distracting / annoying in the UI.
    // We keep this early return so the rest of the script
    // never runs, but we don't have to touch the HTML.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Always return here to fully disable the effect everywhere.
    // (The previous condition for reduced motion / mobile remains,
    // but this unconditional return means no cards will tilt.)
    if (true || prefersReducedMotion || isMobile) {
        return;
    }

    class CardTilt {
        constructor(element) {
            this.element = element;
            this.boundingRect = null;
            this.mouseX = 0;
            this.mouseY = 0;
            this.rotateX = 0;
            this.rotateY = 0;

            // Configuration
            this.maxTilt = 10; // Maximum tilt angle in degrees
            this.perspective = 1000; // 3D perspective distance

            this.init();
        }

        init() {
            // Add tilt class if not present
            if (!this.element.classList.contains('card-tilt')) {
                this.element.classList.add('card-tilt');
            }

            // Set perspective
            this.element.style.perspective = this.perspective + 'px';
            this.element.style.transformStyle = 'preserve-3d';
            this.element.style.transition = 'transform 0.1s ease-out';

            // Event listeners
            this.element.addEventListener('mouseenter', () => this.onMouseEnter());
            this.element.addEventListener('mouseleave', () => this.onMouseLeave());
            this.element.addEventListener('mousemove', (e) => this.onMouseMove(e));
        }

        onMouseEnter() {
            this.boundingRect = this.element.getBoundingClientRect();
        }

        onMouseLeave() {
            // Reset to original position
            this.rotateX = 0;
            this.rotateY = 0;
            this.updateTransform();
            
            // Smooth return
            this.element.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
            setTimeout(() => {
                this.element.style.transition = 'transform 0.1s ease-out';
            }, 500);
        }

        onMouseMove(e) {
            if (!this.boundingRect) return;

            // Get mouse position relative to element
            const rect = this.boundingRect;
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate center of element
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate offset from center (-1 to 1)
            const offsetX = (x - centerX) / centerX;
            const offsetY = (y - centerY) / centerY;

            // Calculate tilt angles
            this.rotateY = offsetX * this.maxTilt;
            this.rotateX = -offsetY * this.maxTilt; // Negative for natural tilt

            this.updateTransform();
        }

        updateTransform() {
            // Apply 3D transform
            this.element.style.transform = `
                perspective(${this.perspective}px)
                rotateX(${this.rotateX}deg)
                rotateY(${this.rotateY}deg)
                translateZ(0)
            `;
        }
    }

    // Initialize tilt effect on cards
    function initCardTilt() {
        // Apply to project cards and category cards
        const cards = document.querySelectorAll('.project-card, .category-card, .tech-project-card');
        
        cards.forEach(card => {
            // Skip if already initialized or disabled
            if (card.classList.contains('tilt-initialized') || card.classList.contains('tilt-disabled')) {
                return;
            }
            
            card.classList.add('tilt-initialized');
            new CardTilt(card);
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCardTilt);
    } else {
        initCardTilt();
    }

    // Re-initialize when content changes (e.g., after language change or navigation)
    document.addEventListener('contentLoaded', () => {
        // Remove old tilt instances
        document.querySelectorAll('.tilt-initialized').forEach(card => {
            card.classList.remove('tilt-initialized');
        });
        setTimeout(initCardTilt, 100);
    });

    // Use Intersection Observer for better performance (only animate visible cards)
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    if (!card.classList.contains('tilt-initialized') && !card.classList.contains('tilt-disabled')) {
                        card.classList.add('tilt-initialized');
                        new CardTilt(card);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observe cards that are not yet initialized
        document.addEventListener('DOMContentLoaded', () => {
            const cards = document.querySelectorAll('.project-card, .category-card, .tech-project-card:not(.tilt-initialized)');
            cards.forEach(card => {
                observer.observe(card);
            });
        });
    }
})();
