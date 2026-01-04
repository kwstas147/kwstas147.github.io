// Language switching functionality
class LanguageManager {
    constructor() {
        this.currentLang = this.getStoredLanguage() || 'el';
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeLanguage();
            });
        } else {
            this.initializeLanguage();
        }
    }

    initializeLanguage() {
        // Wait a bit to ensure DOM is fully ready
        setTimeout(() => {
            // Set initial language
            this.setLanguage(this.currentLang);
            
            // Update language switcher and attach event listeners
            this.updateLanguageSwitcher();
            this.attachEventListeners();
        }, 10);
    }

    getStoredLanguage() {
        try {
            return localStorage.getItem('portfolio_language') || 'el';
        } catch (e) {
            return 'el';
        }
    }

    storeLanguage(lang) {
        try {
            localStorage.setItem('portfolio_language', lang);
        } catch (e) {
            console.warn('Could not store language preference');
        }
    }

    setLanguage(lang) {
        if (typeof translations === 'undefined') {
            console.error('Translations object not loaded');
            return;
        }
        
        if (!translations[lang]) {
            console.warn(`Language ${lang} not found`);
            return;
        }

        this.currentLang = lang;
        this.storeLanguage(lang);
        this.updateContent();
        this.updateLanguageSwitcher();
    }

    toggleLanguage() {
        const newLang = this.currentLang === 'el' ? 'en' : 'el';
        this.setLanguage(newLang);
    }

    updateContent() {
        if (typeof translations === 'undefined' || !translations[this.currentLang]) {
            console.error('Translations not available');
            return;
        }
        
        // Update page title if it has data-i18n
        const titleElement = document.querySelector('title[data-i18n]');
        if (titleElement) {
            const titleKey = titleElement.getAttribute('data-i18n');
            const titleTranslation = this.getTranslation(titleKey);
            if (titleTranslation !== null) {
                document.title = titleTranslation;
            }
        }
        
        // Find all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        
        if (elements.length === 0) {
            console.warn('No elements with data-i18n attribute found');
            return;
        }
        
        elements.forEach(element => {
            // Skip title element as it's handled above
            if (element.tagName === 'TITLE') return;
            
            const key = element.getAttribute('data-i18n');
            if (!key) return;
            
            const translation = this.getTranslation(key);
            
            if (translation !== null && translation !== undefined) {
                // Add fade transition
                const originalOpacity = element.style.opacity || '1';
                element.style.opacity = '0';
                element.style.transition = 'opacity 0.2s ease-in-out';
                
                setTimeout(() => {
                    // Update text content or innerHTML based on element type
                    if (element.tagName === 'INPUT' && (element.type === 'button' || element.type === 'submit')) {
                        element.value = translation;
                    } else if (element.hasAttribute('placeholder')) {
                        element.placeholder = translation;
                    } else {
                        element.textContent = translation;
                    }
                    
                    // Fade in
                    element.style.opacity = '1';
                }, 100);
            } else {
                console.warn(`Translation not found for key: ${key}`);
            }
        });
    }

    getTranslation(key) {
        const keys = key.split('.');
        let value = translations[this.currentLang];
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return null;
            }
        }
        
        return value;
    }

    updateLanguageSwitcher() {
        const switchers = document.querySelectorAll('.lang-switcher');
        switchers.forEach(switcher => {
            const elBtn = switcher.querySelector('[data-lang="el"]');
            const enBtn = switcher.querySelector('[data-lang="en"]');
            
            if (elBtn && enBtn) {
                if (this.currentLang === 'el') {
                    elBtn.classList.add('active');
                    enBtn.classList.remove('active');
                } else {
                    enBtn.classList.add('active');
                    elBtn.classList.remove('active');
                }
            }
        });
    }

    attachEventListeners() {
        // Use event delegation for better reliability
        const langSwitchers = document.querySelectorAll('.lang-switcher');
        const self = this; // Preserve 'this' context
        
        langSwitchers.forEach(switcher => {
            // Remove any existing listeners by cloning the container
            const newSwitcher = switcher.cloneNode(true);
            switcher.parentNode.replaceChild(newSwitcher, switcher);
            
            // Add click listener to the container (event delegation)
            newSwitcher.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const button = e.target.closest('button, [data-lang]');
                if (!button) return;
                
                const lang = button.getAttribute('data-lang');
                if (lang && (lang === 'el' || lang === 'en')) {
                    self.setLanguage(lang);
                }
            });
        });
    }
}

// Wait for translations to be available before initializing
let languageManagerInitialized = false;

function initializeLanguageManager() {
    // Prevent multiple initializations
    if (languageManagerInitialized) {
        return;
    }
    
    if (typeof translations !== 'undefined' && translations.el && translations.en) {
        window.languageManager = new LanguageManager();
        languageManagerInitialized = true;
    } else {
        // Retry after a short delay if translations aren't ready (max 10 retries)
        let retries = 0;
        const maxRetries = 10;
        const checkTranslations = setInterval(() => {
            retries++;
            if (typeof translations !== 'undefined' && translations.el && translations.en) {
                window.languageManager = new LanguageManager();
                languageManagerInitialized = true;
                clearInterval(checkTranslations);
            } else if (retries >= maxRetries) {
                console.error('Failed to load translations after multiple retries');
                clearInterval(checkTranslations);
            }
        }, 50);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLanguageManager);
} else {
    initializeLanguageManager();
}

