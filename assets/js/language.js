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
        console.log('setLanguage called with:', lang); // Debug
        
        if (typeof translations === 'undefined') {
            console.error('Translations object not loaded');
            return;
        }
        
        if (!translations[lang]) {
            console.warn(`Language ${lang} not found`);
            return;
        }

        console.log('Changing language from', this.currentLang, 'to', lang); // Debug
        this.currentLang = lang;
        this.storeLanguage(lang);
        this.updateContent();
        this.updateLanguageSwitcher();
        console.log('Language changed successfully to:', this.currentLang); // Debug
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
                    } else if (element.tagName === 'A' || element.tagName === 'BUTTON') {
                        // For links and buttons, preserve any child elements but update text
                        const children = element.children;
                        if (children.length === 0) {
                            element.textContent = translation;
                        } else {
                            // If there are child elements, find text nodes or update first text node
                            let textNode = null;
                            for (let node of element.childNodes) {
                                if (node.nodeType === Node.TEXT_NODE) {
                                    textNode = node;
                                    break;
                                }
                            }
                            if (textNode) {
                                textNode.textContent = translation;
                            } else {
                                // If no text node, prepend text
                                element.insertBefore(document.createTextNode(translation), element.firstChild);
                            }
                        }
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
        // Remove all existing listeners first by using a single delegated listener on document
        // This prevents duplicate listeners
        const self = this;
        
        // Remove old listener if it exists
        if (this._languageClickHandler) {
            document.removeEventListener('click', this._languageClickHandler);
        }
        
        // Create new handler
        this._languageClickHandler = function(e) {
            // Check if click is on a language switcher button
            const button = e.target.closest('.lang-switcher button, .lang-switcher [data-lang]');
            if (!button) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            const lang = button.getAttribute('data-lang');
            console.log('Language button clicked:', lang); // Debug
            if (lang && (lang === 'el' || lang === 'en')) {
                console.log('Setting language to:', lang); // Debug
                self.setLanguage(lang);
            } else {
                console.warn('Invalid language:', lang); // Debug
            }
        };
        
        // Add listener to document (event delegation)
        document.addEventListener('click', this._languageClickHandler);
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

