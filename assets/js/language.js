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
        // Set initial language
        this.setLanguage(this.currentLang);
        
        // Update language switcher and attach event listeners
        this.updateLanguageSwitcher();
        this.attachEventListeners();
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
        
        elements.forEach(element => {
            // Skip title element as it's handled above
            if (element.tagName === 'TITLE') return;
            
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            
            if (translation !== null) {
                // Add fade transition
                element.style.opacity = '0';
                element.style.transition = 'opacity 0.2s ease-in-out';
                
                setTimeout(() => {
                    // Update text content or innerHTML based on element type
                    if (element.tagName === 'INPUT' && element.type === 'button') {
                        element.value = translation;
                    } else if (element.hasAttribute('placeholder')) {
                        element.placeholder = translation;
                    } else {
                        element.textContent = translation;
                    }
                    
                    // Fade in
                    element.style.opacity = '1';
                }, 100);
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
        // Language switcher buttons
        document.querySelectorAll('.lang-switcher button, .lang-switcher [data-lang]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');
                if (lang && (lang === 'el' || lang === 'en')) {
                    this.setLanguage(lang);
                } else {
                    this.toggleLanguage();
                }
            });
        });
    }
}

// Initialize language manager when script loads
const languageManager = new LanguageManager();

