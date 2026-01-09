/**
 * Scroll Progress Bar
 * Shows a progress bar at the top indicating scroll progress
 */

(function() {
    'use strict';

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        return; // Skip if user prefers reduced motion
    }

    let progressBar = null;

    // Create progress bar element
    function createProgressBar() {
        if (progressBar) return progressBar;

        progressBar = document.createElement('div');
        progressBar.classList.add('scroll-progress');
        progressBar.setAttribute('role', 'progressbar');
        progressBar.setAttribute('aria-valuemin', '0');
        progressBar.setAttribute('aria-valuemax', '100');
        progressBar.setAttribute('aria-valuenow', '0');
        progressBar.setAttribute('aria-label', 'Scroll progress');
        document.body.appendChild(progressBar);

        return progressBar;
    }

    // Update progress bar
    function updateProgress() {
        if (!progressBar) {
            progressBar = createProgressBar();
        }

        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Calculate scroll percentage
        const scrollableHeight = documentHeight - windowHeight;
        const scrollPercentage = scrollableHeight > 0 
            ? (scrollTop / scrollableHeight) * 100 
            : 0;

        // Update progress bar width
        progressBar.style.width = Math.min(100, Math.max(0, scrollPercentage)) + '%';
        progressBar.setAttribute('aria-valuenow', Math.round(scrollPercentage));
    }

    // Initialize scroll progress
    function initScrollProgress() {
        progressBar = createProgressBar();
        
        // Update on scroll (throttled)
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateProgress();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Initial update
        updateProgress();
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollProgress);
    } else {
        initScrollProgress();
    }

    // Update on window resize
    window.addEventListener('resize', updateProgress, { passive: true });
})();
