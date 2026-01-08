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
    let lastScrollY = 0;

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

        // Initialize lastScrollY
        lastScrollY = window.scrollY;

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
        
        // Determine scroll direction
        const scrollDirection = scrollY > lastScrollY ? 'down' : (scrollY < lastScrollY ? 'up' : 'none');
        lastScrollY = scrollY;

        // Calculate how much the container section has scrolled from its initial position
        const containerScrollProgress = Math.max(0, scrollY - containerInitialTop);
        
        // Calculate total scrollable distance for main content
        // This is how much the main content can scroll within the container
        const mainContentScrollableDistance = Math.max(0, mainContentHeight - viewportHeight + navHeight);
        
        // Calculate total scrollable distance for sidebar
        const sidebarScrollableDistance = Math.max(0, sidebarHeight - viewportHeight + navHeight);

        // If sidebar fits in viewport, no sync needed - use relative positioning
        if (sidebarScrollableDistance <= 0) {
            sidebar.style.position = 'relative';
            sidebar.style.top = 'auto';
            sidebar.style.bottom = 'auto';
            sidebar.style.transform = 'none';
            return;
        }

        // Calculate scroll progress for main content (0 to 1)
        let mainContentScrollProgress = 0;
        if (mainContentScrollableDistance > 0) {
            mainContentScrollProgress = Math.min(1, Math.max(0, containerScrollProgress / mainContentScrollableDistance));
        }

        // Calculate scroll progress for sidebar based on main content (0 to 1)
        let sidebarScrollProgress = mainContentScrollProgress;

        // Check states
        const mainContentReachedEnd = mainContentScrollProgress >= 1;
        const mainContentReachedTop = mainContentScrollProgress <= 0;
        const sidebarReachedEnd = sidebarScrollProgress >= 1;
        const sidebarReachedStart = sidebarScrollProgress <= 0;

        isUpdating = true;

        // Calculate where sidebar should be positioned to "touch" viewport edges
        // When scrolling down: bottom of sidebar touches bottom of viewport
        // When scrolling up: top of sidebar touches top of viewport (below nav)
        
        // Use sticky positioning with dynamic top/bottom values
        // This allows the sidebar to "stick" to viewport edges while scrolling
        
        if (scrollDirection === 'down') {
            // Scrolling down: make bottom of sidebar touch bottom of viewport
            if (sidebarReachedEnd && !mainContentReachedEnd) {
                // Sidebar has reached its end - keep it at end using transform
                sidebar.style.position = 'relative';
                sidebar.style.top = 'auto';
                sidebar.style.bottom = 'auto';
                sidebar.style.transform = `translateY(${sidebarScrollableDistance}px)`;
            } else {
                // Use sticky positioning with bottom = 0 so bottom touches viewport bottom
                sidebar.style.position = 'sticky';
                sidebar.style.top = 'auto';
                sidebar.style.bottom = '0px';
                sidebar.style.transform = 'none';
            }
        } else if (scrollDirection === 'up') {
            // Scrolling up: make top of sidebar touch top of viewport (below nav)
            if (mainContentReachedTop) {
                // Main content has reached top - sidebar should be at top (relative)
                sidebar.style.position = 'relative';
                sidebar.style.top = 'auto';
                sidebar.style.bottom = 'auto';
                sidebar.style.transform = 'none';
            } else if (sidebarReachedEnd && !mainContentReachedEnd) {
                // Sidebar was at end, main content hasn't reached top yet - keep sidebar at end
                sidebar.style.position = 'relative';
                sidebar.style.top = 'auto';
                sidebar.style.bottom = 'auto';
                sidebar.style.transform = `translateY(${sidebarScrollableDistance}px)`;
            } else {
                // Use sticky positioning with top = navHeight so top touches viewport top (below nav)
                sidebar.style.position = 'sticky';
                sidebar.style.top = `${navHeight}px`;
                sidebar.style.bottom = 'auto';
                sidebar.style.transform = 'none';
            }
        } else {
            // Initial state or no movement - determine based on current position
            if (mainContentReachedTop) {
                sidebar.style.position = 'relative';
                sidebar.style.top = 'auto';
                sidebar.style.bottom = 'auto';
                sidebar.style.transform = 'none';
            } else if (sidebarReachedEnd) {
                sidebar.style.position = 'relative';
                sidebar.style.top = 'auto';
                sidebar.style.bottom = 'auto';
                sidebar.style.transform = `translateY(${sidebarScrollableDistance}px)`;
            } else {
                // Default: use sticky with bottom alignment (for scrolling down)
                sidebar.style.position = 'sticky';
                sidebar.style.top = 'auto';
                sidebar.style.bottom = '0px';
                sidebar.style.transform = 'none';
            }
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
