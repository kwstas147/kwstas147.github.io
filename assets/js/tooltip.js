/**
 * Animated Tooltips
 * Adds animated tooltips to elements with data-tooltip attribute
 */

(function() {
    'use strict';

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let tooltipElement = null;
    let currentTarget = null;
    let showTimeout = null;
    let hideTimeout = null;

    // Create tooltip element
    function createTooltip() {
        if (tooltipElement) return tooltipElement;

        tooltipElement = document.createElement('div');
        tooltipElement.classList.add('tooltip');
        tooltipElement.setAttribute('role', 'tooltip');
        tooltipElement.setAttribute('aria-hidden', 'true');
        document.body.appendChild(tooltipElement);

        return tooltipElement;
    }

    // Show tooltip
    function showTooltip(element, text) {
        if (!text) return;

        // Clear any existing timeouts
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }

        // Create tooltip if doesn't exist
        const tooltip = createTooltip();
        tooltip.textContent = text;
        tooltip.setAttribute('aria-hidden', 'false');

        // Get element position
        const rect = element.getBoundingClientRect();
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        // Position tooltip above element by default
        let top = rect.top + scrollY - tooltip.offsetHeight - 10;
        let left = rect.left + scrollX + (rect.width / 2) - (tooltip.offsetWidth / 2);

        // Adjust if tooltip goes off screen
        const tooltipRect = tooltip.getBoundingClientRect();
        
        // Check horizontal bounds
        if (left < 10) {
            left = 10;
        } else if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }

        // Check if tooltip fits above, otherwise position below
        if (top < scrollY + 10) {
            top = rect.bottom + scrollY + 10;
            tooltip.classList.add('tooltip-below');
        } else {
            tooltip.classList.remove('tooltip-below');
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';

        // Show with animation
        requestAnimationFrame(() => {
            tooltip.classList.add('visible');
        });

        currentTarget = element;
    }

    // Hide tooltip
    function hideTooltip(immediate = false) {
        if (!tooltipElement) return;

        const hide = () => {
            tooltipElement.classList.remove('visible');
            tooltipElement.setAttribute('aria-hidden', 'true');
            
            // Remove from DOM after animation
            setTimeout(() => {
                if (tooltipElement && !tooltipElement.classList.contains('visible')) {
                    tooltipElement.textContent = '';
                    currentTarget = null;
                }
            }, 300);
        };

        if (immediate) {
            hide();
        } else {
            // Delay hide slightly to allow moving between elements
            hideTimeout = setTimeout(hide, 100);
        }
    }

    // Handle mouse enter
    function onMouseEnter(e) {
        const element = e.currentTarget;
        const tooltipText = element.getAttribute('data-tooltip') || 
                           element.getAttribute('title') || 
                           element.getAttribute('aria-label');

        if (!tooltipText) return;

        // Remove title attribute to prevent default tooltip
        if (element.hasAttribute('title')) {
            element.setAttribute('data-original-title', element.getAttribute('title'));
            element.removeAttribute('title');
        }

        // Delay show slightly for smoother UX
        showTimeout = setTimeout(() => {
            showTooltip(element, tooltipText);
        }, prefersReducedMotion ? 0 : 300);
    }

    // Handle mouse leave
    function onMouseLeave() {
        if (showTimeout) {
            clearTimeout(showTimeout);
            showTimeout = null;
        }
        hideTooltip();
    }

    // Handle focus (for accessibility)
    function onFocus(e) {
        onMouseEnter(e);
    }

    // Handle blur (for accessibility)
    function onBlur() {
        hideTooltip(true);
    }

    // Initialize tooltips
    function initTooltips() {
        // Find all elements with data-tooltip attribute
        const elements = document.querySelectorAll('[data-tooltip]');

        elements.forEach(element => {
            // Skip if already initialized
            if (element.classList.contains('tooltip-initialized')) {
                return;
            }

            element.classList.add('tooltip-initialized');
            
            // Add event listeners
            element.addEventListener('mouseenter', onMouseEnter);
            element.addEventListener('mouseleave', onMouseLeave);
            element.addEventListener('focus', onFocus);
            element.addEventListener('blur', onBlur);
        });

        // Also add tooltips to navigation links, icons, and buttons without explicit tooltips
        const navLinks = document.querySelectorAll('nav a, .nav-link');
        navLinks.forEach(link => {
            if (!link.hasAttribute('data-tooltip') && !link.classList.contains('tooltip-initialized')) {
                const text = link.textContent.trim();
                if (text) {
                    link.setAttribute('data-tooltip', text);
                    link.classList.add('tooltip-initialized');
                    link.addEventListener('mouseenter', onMouseEnter);
                    link.addEventListener('mouseleave', onMouseLeave);
                    link.addEventListener('focus', onFocus);
                    link.addEventListener('blur', onBlur);
                }
            }
        });

        // Add tooltips to social icons in footer
        const socialIcons = document.querySelectorAll('footer a[title], footer a[aria-label]');
        socialIcons.forEach(icon => {
            if (!icon.classList.contains('tooltip-initialized')) {
                const tooltipText = icon.getAttribute('title') || icon.getAttribute('aria-label');
                if (tooltipText) {
                    icon.setAttribute('data-tooltip', tooltipText);
                    icon.classList.add('tooltip-initialized');
                    icon.addEventListener('mouseenter', onMouseEnter);
                    icon.addEventListener('mouseleave', onMouseLeave);
                    icon.addEventListener('focus', onFocus);
                    icon.addEventListener('blur', onBlur);
                }
            }
        });
    }

    // Cleanup tooltip on scroll
    function onScroll() {
        if (tooltipElement && tooltipElement.classList.contains('visible')) {
            hideTooltip(true);
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initTooltips();
            window.addEventListener('scroll', onScroll, { passive: true });
        });
    } else {
        initTooltips();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Re-initialize when content changes
    document.addEventListener('contentLoaded', () => {
        // Remove old tooltip instances
        document.querySelectorAll('.tooltip-initialized').forEach(el => {
            el.classList.remove('tooltip-initialized');
            el.removeEventListener('mouseenter', onMouseEnter);
            el.removeEventListener('mouseleave', onMouseLeave);
            el.removeEventListener('focus', onFocus);
            el.removeEventListener('blur', onBlur);
            
            // Restore original title if it existed
            if (el.hasAttribute('data-original-title')) {
                el.setAttribute('title', el.getAttribute('data-original-title'));
                el.removeAttribute('data-original-title');
            }
        });

        setTimeout(initTooltips, 100);
    });

    // Hide tooltip on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && tooltipElement && tooltipElement.classList.contains('visible')) {
            hideTooltip(true);
        }
    });
})();
