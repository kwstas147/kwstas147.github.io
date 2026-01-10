// Active navigation highlighting and mobile menu functionality
// Automatically highlights the current page's navigation link and handles mobile menu toggle

(function() {
    'use strict';

    // Map of page filenames to their corresponding data-nav-page values
    const pageMap = {
        'index.html': 'index',
        '': 'index', // root path also maps to index
        'programming.html': 'programming',
        '3d-printing.html': '3d-printing',
        'design.html': 'design',
        'cv.html': 'cv'
    };

    function getCurrentPage() {
        const pathname = window.location.pathname;
        const filename = pathname.split('/').pop() || 'index.html';
        return pageMap[filename] || pageMap[pathname] || null;
    }

    function highlightActiveNav() {
        const currentPage = getCurrentPage();
        
        if (!currentPage) {
            console.warn('Could not determine current page for navigation highlighting');
            return;
        }

        // Find all navigation links (desktop and mobile)
        const navLinks = document.querySelectorAll('nav a.nav-link, nav a[data-nav-page], .mobile-nav-links a[data-nav-page]');
        
        navLinks.forEach(link => {
            const navPage = link.getAttribute('data-nav-page');
            
            if (navPage === currentPage) {
                // Add active classes for desktop navigation
                if (link.closest('.hidden.md\\:flex') || link.closest('nav:not(.mobile-nav-links)')) {
                    link.classList.add('text-xl', 'font-bold', 'text-blue-400');
                }
                // Add active class for mobile navigation
                if (link.closest('.mobile-nav-links')) {
                    link.classList.add('active');
                }
            } else {
                // Remove active classes from desktop navigation
                if (link.closest('.hidden.md\\:flex') || link.closest('nav:not(.mobile-nav-links)')) {
                    link.classList.remove('text-xl', 'font-bold', 'text-blue-400');
                }
                // Remove active class from mobile navigation
                if (link.closest('.mobile-nav-links')) {
                    link.classList.remove('active');
                }
            }
        });
    }

    // Mobile Menu Functions
    function openMobileMenu() {
        const overlay = document.getElementById('mobile-menu-overlay');
        const body = document.body;
        
        if (overlay) {
            overlay.classList.add('active');
            body.classList.add('mobile-menu-open');
            // Prevent body scroll when menu is open
            document.body.style.overflow = 'hidden';
        }
    }

    function closeMobileMenu() {
        const overlay = document.getElementById('mobile-menu-overlay');
        const body = document.body;
        
        if (overlay) {
            overlay.classList.remove('active');
            body.classList.remove('mobile-menu-open');
            // Restore body scroll
            document.body.style.overflow = '';
        }
    }

    function toggleMobileMenu() {
        const overlay = document.getElementById('mobile-menu-overlay');
        
        if (overlay && overlay.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function initMobileMenu() {
        // Get mobile menu elements
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const menuClose = document.getElementById('mobile-menu-close');
        const menuOverlay = document.getElementById('mobile-menu-overlay');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

        // Hamburger button click handler
        if (menuToggle) {
            menuToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleMobileMenu();
            });
        }

        // Close button click handler
        if (menuClose) {
            menuClose.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeMobileMenu();
            });
        }

        // Overlay click handler (close menu when clicking outside panel)
        if (menuOverlay) {
            menuOverlay.addEventListener('click', function(e) {
                // Only close if clicking directly on overlay, not on panel
                if (e.target === menuOverlay) {
                    closeMobileMenu();
                }
            });
        }

        // Close menu when clicking on navigation links
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Small delay to allow navigation to start
                setTimeout(closeMobileMenu, 150);
            });
        });

        // ESC key handler to close menu
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menuOverlay && menuOverlay.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Close menu on window resize if switching from mobile to desktop
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth >= 768 && menuOverlay && menuOverlay.classList.contains('active')) {
                    closeMobileMenu();
                }
            }, 250);
        });

        // Close menu if it's open when page loads on desktop
        if (window.innerWidth >= 768 && menuOverlay && menuOverlay.classList.contains('active')) {
            closeMobileMenu();
        }
    }

    // Initialize when DOM is ready
    function init() {
        highlightActiveNav();
        initMobileMenu();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
