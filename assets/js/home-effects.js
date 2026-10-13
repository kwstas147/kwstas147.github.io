// Home page effects: section bar, contact button on tap, counters and timeline progress.
(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // The section bar sticks directly under the main navigation
    const mainNav = document.querySelector('body > nav');
    function setNavHeight() {
        if (mainNav) {
            document.documentElement.style.setProperty('--nav-h', mainNav.offsetHeight + 'px');
        }
    }
    setNavHeight();
    window.addEventListener('resize', setNavHeight);

    // Mark the section bar link for the section currently in view
    const links = Array.from(document.querySelectorAll('.section-nav-link'));
    const sections = links.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    if ('IntersectionObserver' in window && sections.length) {
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const link = links.find(a => a.getAttribute('href') === '#' + entry.target.id);
                if (entry.isIntersecting) {
                    links.forEach(a => a.removeAttribute('aria-current'));
                    if (link) link.setAttribute('aria-current', 'true');
                } else if (link) {
                    link.removeAttribute('aria-current');
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(section => sectionObserver.observe(section));
    }

    // Contact button: open and close on tap
    const fab = document.querySelector('.fab-container');
    const fabMain = fab ? fab.querySelector('.fab-main') : null;
    if (fabMain) {
        fabMain.addEventListener('click', event => {
            event.stopPropagation();
            const open = fab.classList.toggle('is-open');
            fabMain.setAttribute('aria-expanded', String(open));
        });
        document.addEventListener('click', () => {
            fab.classList.remove('is-open');
            fabMain.setAttribute('aria-expanded', 'false');
        });
    }

    // Numbers count up when they come into view
    function countUp(el) {
        const target = Number(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const start = performance.now();
        el.textContent = '0' + suffix;
        function frame(now) {
            const t = Math.min((now - start) / 1400, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (t < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }
    const counters = Array.from(document.querySelectorAll('[data-count]'));
    if (!reduceMotion && 'IntersectionObserver' in window && counters.length) {
        const counterObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    countUp(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });
        counters.forEach(el => counterObserver.observe(el));
    }

    // The timeline line fills as the visitor scrolls through the experience
    const track = document.querySelector('.timeline-track');
    const fill = track ? track.querySelector('.timeline-fill') : null;
    let ticking = false;
    function updateTimeline() {
        ticking = false;
        const rect = track.getBoundingClientRect();
        const progress = (window.innerHeight * 0.6 - rect.top) / rect.height;
        fill.style.height = Math.min(Math.max(progress, 0), 1) * 100 + '%';
    }
    function requestTimeline() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateTimeline);
        }
    }
    if (track && fill) {
        window.addEventListener('scroll', requestTimeline, { passive: true });
        window.addEventListener('resize', requestTimeline);
        updateTimeline();
    }
})();
