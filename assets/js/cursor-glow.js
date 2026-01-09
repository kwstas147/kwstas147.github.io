/**
 * Custom Cursor Glow Effect
 * Creates a glowing effect that follows the cursor over interactive elements
 * 
 * DISABLED: User prefers default cursor
 */

(function() {
    'use strict';

    // DISABLED - Return early to disable custom cursor effect
    return;

    // Check if user prefers reduced motion or is on mobile
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (prefersReducedMotion || isMobile) {
        return; // Skip on mobile and for users who prefer reduced motion
    }

    let cursorGlow = null;
    let isOverInteractive = false;

    // Create cursor glow element
    function createCursorGlow() {
        cursorGlow = document.createElement('div');
        cursorGlow.classList.add('cursor-glow');
        document.body.appendChild(cursorGlow);
        
        // Hide default cursor on interactive elements
        document.body.style.cursor = 'none';
    }

    // Update cursor position
    function updateCursor(e) {
        if (!cursorGlow) return;

        const x = e.clientX;
        const y = e.clientY;

        cursorGlow.style.left = x + 'px';
        cursorGlow.style.top = y + 'px';
        cursorGlow.style.display = 'block';
    }

    // Handle mouse enter on interactive elements
    function onInteractiveEnter(e) {
        isOverInteractive = true;
        if (cursorGlow) {
            cursorGlow.classList.add('active');
            
            // Change color based on element type
            const element = e.currentTarget;
            if (element.classList.contains('category-card') || element.classList.contains('project-card')) {
                cursorGlow.style.background = 'radial-gradient(circle, rgba(59, 130, 246, 0.8), transparent)';
            } else if (element.tagName === 'A' || element.tagName === 'BUTTON') {
                cursorGlow.style.background = 'radial-gradient(circle, rgba(59, 130, 246, 0.6), transparent)';
            }
        }
    }

    // Handle mouse leave on interactive elements
    function onInteractiveLeave() {
        isOverInteractive = false;
        if (cursorGlow) {
            cursorGlow.classList.remove('active');
            cursorGlow.style.background = 'radial-gradient(circle, rgba(59, 130, 246, 0.8), transparent)';
        }
    }

    // Handle mouse leave from document
    function onMouseLeave() {
        if (cursorGlow) {
            cursorGlow.style.display = 'none';
        }
    }

    // Initialize cursor glow
    function initCursorGlow() {
        // Remove existing cursor glow if any
        const existing = document.querySelector('.cursor-glow');
        if (existing) {
            existing.remove();
        }

        createCursorGlow();

        // Track mouse movement
        document.addEventListener('mousemove', updateCursor);
        document.addEventListener('mouseleave', onMouseLeave);

        // Add to interactive elements
        const interactiveElements = document.querySelectorAll(
            'a, button, .category-card, .project-card, .tech-project-card, ' +
            '.nav-link, input, textarea, select, [role="button"], [tabindex]'
        );

        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', onInteractiveEnter);
            element.addEventListener('mouseleave', onInteractiveLeave);
        });
    }

    // Cleanup function
    function cleanup() {
        if (cursorGlow) {
            cursorGlow.remove();
            cursorGlow = null;
        }
        document.body.style.cursor = '';
        document.removeEventListener('mousemove', updateCursor);
        document.removeEventListener('mouseleave', onMouseLeave);
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCursorGlow);
    } else {
        initCursorGlow();
    }

    // Re-initialize when content changes
    document.addEventListener('contentLoaded', () => {
        cleanup();
        setTimeout(initCursorGlow, 100);
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);
})();
