// Hide the navigation while scrolling down, and show it again when scrolling up
(function () {
    const root = document.documentElement;
    const topZone = 120;   // always visible near the top of the page
    const minMove = 6;     // ignore tiny movements
    let lastY = window.scrollY;
    let ticking = false;

    function update() {
        ticking = false;
        const y = Math.max(window.scrollY, 0);
        const delta = y - lastY;
        lastY = y;
        if (y < topZone || document.body.classList.contains('mobile-menu-open')) {
            root.classList.remove('header-hidden');
        } else if (delta > minMove) {
            root.classList.add('header-hidden');
        } else if (delta < -minMove) {
            root.classList.remove('header-hidden');
        }
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }, { passive: true });

    // Keep the bars visible while keyboard focus is inside them
    document.addEventListener('focusin', event => {
        if (event.target instanceof Element && event.target.closest('nav')) {
            root.classList.remove('header-hidden');
        }
    });
})();
