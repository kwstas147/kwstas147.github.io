// Synchronized scrolling for CV page columns
// Ensures main content and sidebar scroll together, with sidebar stopping at its end

(function() {
    'use strict';

    let isUpdating = false;
    let mainContent = null;
    let sidebar = null;
    let containerSection = null;
    let sidebarInitialTop = 0;
    let mainContentInitialTop = 0;
    let containerInitialTop = 0;
    let mainContentHeight = 0;
    let sidebarHeight = 0;
    let containerHeight = 0;
    let viewportHeight = 0;
    let navHeight = 0;

    function initScrollSync() {
        // Find the containers
        mainContent = document.getElementById('cv-main-content');
        sidebar = document.getElementById('cv-sidebar');
        containerSection = mainContent ? mainContent.closest('section') : null;

        if (!mainContent || !sidebar || !containerSection) {
            console.warn('CV scroll sync: Could not find required elements');
            return;
        }

        // Get navigation height for sticky calculations
        const nav = document.querySelector('nav');
        navHeight = nav ? nav.offsetHeight : 0;

        // Calculate initial positions and heights
        updateDimensions();

        // Listen to window scroll events
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Recalculate on window resize
        window.addEventListener('resize', () => {
            updateDimensions();
            handleScroll();
        }, { passive: true });

        // Initial sync
        handleScroll();
    }

    function updateDimensions() {
        if (!mainContent || !sidebar || !containerSection) return;

        // Get initial positions (when page loads at top)
        const containerRect = containerSection.getBoundingClientRect();
        const mainRect = mainContent.getBoundingClientRect();
        const sidebarRect = sidebar.getBoundingClientRect();

        containerInitialTop = containerRect.top + window.scrollY;
        mainContentInitialTop = mainRect.top + window.scrollY;
        sidebarInitialTop = sidebarRect.top + window.scrollY;

        // Get heights
        containerHeight = containerSection.offsetHeight;
        mainContentHeight = mainContent.offsetHeight;
        sidebarHeight = sidebar.offsetHeight;
        viewportHeight = window.innerHeight;
    }

    function handleScroll() {
        if (isUpdating) return;

        const scrollY = window.scrollY;

        // Calculate how much the container section has scrolled from its initial position
        const containerScrollProgress = Math.max(0, scrollY - containerInitialTop);
        
        // Calculate total scrollable distance for main content
        // This is how much the main content can scroll within the container
        const mainContentScrollableDistance = Math.max(0, mainContentHeight - viewportHeight + navHeight);
        
        // Calculate total scrollable distance for sidebar
        const sidebarScrollableDistance = Math.max(0, sidebarHeight - viewportHeight + navHeight);

        // If sidebar fits in viewport, no sync needed
        if (sidebarScrollableDistance <= 0) {
            sidebar.style.position = 'relative';
            sidebar.style.top = 'auto';
            sidebar.style.transform = 'none';
            return;
        }

        // Calculate scroll ratio based on main content progress (0 to 1)
        let scrollRatio = 0;
        if (mainContentScrollableDistance > 0) {
            scrollRatio = Math.min(1, Math.max(0, containerScrollProgress / mainContentScrollableDistance));
        }

        // Calculate target scroll offset for sidebar using transform
        const sidebarTargetOffset = scrollRatio * sidebarScrollableDistance;

        // Check if sidebar has reached its end
        const sidebarReachedEnd = scrollRatio >= 1;
        const sidebarReachedStart = scrollRatio <= 0;

        isUpdating = true;

        if (sidebarReachedEnd) {
            // Sidebar has reached its end - keep it at maximum offset
            sidebar.style.position = 'relative';
            sidebar.style.top = 'auto';
            sidebar.style.transform = `translateY(${sidebarScrollableDistance}px)`;
        } else if (sidebarReachedStart) {
            // Sidebar at start
            sidebar.style.position = 'relative';
            sidebar.style.top = 'auto';
            sidebar.style.transform = 'translateY(0)';
        } else {
            // Normal sync - use transform to move sidebar proportionally
            sidebar.style.position = 'relative';
            sidebar.style.top = 'auto';
            sidebar.style.transform = `translateY(${sidebarTargetOffset}px)`;
        }

        requestAnimationFrame(() => {
            isUpdating = false;
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Small delay to ensure layout is complete
            setTimeout(initScrollSync, 100);
        });
    } else {
        // Small delay to ensure layout is complete
        setTimeout(initScrollSync, 100);
    }
})();
