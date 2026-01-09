/**
 * Magnetic Hover Effect
 * Makes buttons and links "attract" the cursor when nearby
 */

(function() {
    'use strict';

    // Check if user prefers reduced motion or is on mobile
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (prefersReducedMotion || isMobile) {
        return; // Skip on mobile and for users who prefer reduced motion
    }

    class MagneticHover {
        constructor(element) {
            this.element = element;
            this.boundingRect = null;
            this.mouseX = 0;
            this.mouseY = 0;
            this.elementX = 0;
            this.elementY = 0;
            this.x = 0;
            this.y = 0;

            // Configuration
            this.strength = 0.3; // Magnetic strength (0-1)
            this.radius = 150; // Attraction radius in pixels

            this.init();
        }

        init() {
            this.element.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
            
            this.element.addEventListener('mouseenter', () => this.onMouseEnter());
            this.element.addEventListener('mouseleave', () => this.onMouseLeave());
            this.element.addEventListener('mousemove', (e) => this.onMouseMove(e));
        }

        onMouseEnter() {
            this.boundingRect = this.element.getBoundingClientRect();
            this.animate();
        }

        onMouseLeave() {
            // Reset position
            this.x = 0;
            this.y = 0;
            this.updateTransform();
            
            // Smooth return to original position
            setTimeout(() => {
                this.element.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
                this.updateTransform();
                setTimeout(() => {
                    this.element.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
                }, 500);
            }, 10);
        }

        onMouseMove(e) {
            if (!this.boundingRect) return;

            // Get mouse position relative to viewport
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            // Get element center position
            this.elementX = this.boundingRect.left + this.boundingRect.width / 2;
            this.elementY = this.boundingRect.top + this.boundingRect.height / 2;

            // Calculate distance from cursor to element center
            const deltaX = this.mouseX - this.elementX;
            const deltaY = this.mouseY - this.elementY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Only apply magnetic effect if cursor is within radius
            if (distance < this.radius) {
                // Calculate attraction strength based on distance
                const force = (this.radius - distance) / this.radius;
                
                // Apply magnetic effect
                this.x = deltaX * force * this.strength;
                this.y = deltaY * force * this.strength;
            } else {
                // Reset if outside radius
                this.x = 0;
                this.y = 0;
            }

            this.updateTransform();
        }

        updateTransform() {
            this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
        }

        animate() {
            // Use requestAnimationFrame for smooth animation
            requestAnimationFrame(() => {
                if (this.boundingRect) {
                    this.animate();
                }
            });
        }
    }

    // Initialize magnetic effect on specific elements
    function initMagneticHover() {
        // Apply to navigation links
        const navLinks = document.querySelectorAll('nav a, .nav-link');
        navLinks.forEach(link => {
            if (!link.classList.contains('magnetic-disabled')) {
                new MagneticHover(link);
            }
        });

        // Apply to buttons
        const buttons = document.querySelectorAll('button.bg-blue-600, .bg-blue-600, a.bg-blue-600');
        buttons.forEach(btn => {
            if (!btn.classList.contains('magnetic-disabled')) {
                new MagneticHover(btn);
            }
        });

        // Apply to category cards (optional - can be disabled if too much)
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach((card, index) => {
            // Only apply to first few cards to avoid performance issues
            if (index < 6 && !card.classList.contains('magnetic-disabled')) {
                const magneticCard = new MagneticHover(card);
                // Reduce strength for cards
                magneticCard.strength = 0.15;
                magneticCard.radius = 200;
            }
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMagneticHover);
    } else {
        initMagneticHover();
    }

    // Re-initialize when content changes (e.g., after navigation)
    document.addEventListener('contentLoaded', initMagneticHover);
})();
