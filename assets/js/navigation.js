// Active navigation highlighting
// Automatically highlights the current page's navigation link

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

        // Find all navigation links
        const navLinks = document.querySelectorAll('nav a.nav-link, nav a[data-nav-page]');
        
        navLinks.forEach(link => {
            const navPage = link.getAttribute('data-nav-page');
            
            if (navPage === currentPage) {
                // Add active classes (text-xl, font-bold, text-blue-400)
                link.classList.add('text-xl', 'font-bold', 'text-blue-400');
            } else {
                // Remove active classes
                link.classList.remove('text-xl', 'font-bold', 'text-blue-400');
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', highlightActiveNav);
    } else {
        highlightActiveNav();
    }
})();
