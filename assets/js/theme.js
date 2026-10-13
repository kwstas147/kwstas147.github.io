// Theme switching functionality
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || 'midnight';
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeTheme();
            });
        } else {
            this.initializeTheme();
        }
    }

    initializeTheme() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Update theme switcher and attach event listeners
        this.updateThemeSwitcher();
        this.attachEventListeners();
    }

    getStoredTheme() {
        try {
            return localStorage.getItem('portfolio_theme') || 'midnight';
        } catch (e) {
            return 'midnight';
        }
    }

    storeTheme(theme) {
        try {
            localStorage.setItem('portfolio_theme', theme);
        } catch (e) {
            console.warn('Could not store theme preference');
        }
    }

    setTheme(theme) {
        if (theme !== 'midnight' && theme !== 'clean-office') {
            console.warn(`Theme ${theme} not found`);
            return;
        }

        this.currentTheme = theme;
        this.storeTheme(theme);
        this.applyTheme(theme);
        this.updateThemeSwitcher();
    }

    applyTheme(theme) {
        const body = document.body;
        const html = document.documentElement;
        
        // Remove existing theme classes
        body.classList.remove('theme-midnight', 'theme-clean-office');
        html.classList.remove('theme-midnight', 'theme-clean-office');
        
        // Add new theme class
        body.classList.add(`theme-${theme}`);
        html.classList.add(`theme-${theme}`);
        
        // Update theme attribute for CSS
        html.setAttribute('data-theme', theme);
    }

    setThemeAnimated(theme, event) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!document.startViewTransition || reduceMotion || theme === this.currentTheme) {
            this.setTheme(theme);
            return;
        }
        // The new theme grows as a circle from the clicked button
        const x = event && event.clientX ? event.clientX : window.innerWidth / 2;
        const y = event && event.clientY ? event.clientY : window.innerHeight / 2;
        const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
        const html = document.documentElement;
        html.classList.add('theme-transition');
        const transition = document.startViewTransition(() => this.setTheme(theme));
        transition.ready.then(() => {
            html.animate(
                { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
                { duration: 550, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
            );
        }).catch(() => {});
        transition.finished.finally(() => html.classList.remove('theme-transition'));
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'midnight' ? 'clean-office' : 'midnight';
        this.setTheme(newTheme);
    }

    updateThemeSwitcher() {
        const switchers = document.querySelectorAll('.theme-switcher');
        switchers.forEach(switcher => {
            const midnightBtn = switcher.querySelector('[data-theme="midnight"]');
            const cleanOfficeBtn = switcher.querySelector('[data-theme="clean-office"]');
            
            if (midnightBtn && cleanOfficeBtn) {
                if (this.currentTheme === 'midnight') {
                    midnightBtn.classList.add('active');
                    cleanOfficeBtn.classList.remove('active');
                } else {
                    cleanOfficeBtn.classList.add('active');
                    midnightBtn.classList.remove('active');
                }
            }
        });
    }

    attachEventListeners() {
        // Theme switcher buttons
        document.querySelectorAll('.theme-switcher button, .theme-switcher [data-theme]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const theme = btn.getAttribute('data-theme');
                if (theme && (theme === 'midnight' || theme === 'clean-office')) {
                    this.setThemeAnimated(theme, e);
                } else {
                    this.toggleTheme();
                }
            });
        });
    }
}

// Initialize theme manager when script loads
const themeManager = new ThemeManager();

