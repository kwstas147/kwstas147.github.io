// Language switching functionality with JSON-based translations
class LanguageManager {
    constructor() {
        this.currentLang = this.getStoredLanguage() || 'el';
        this.translations = null;
        this.translationsLoaded = false;
        this.init();
    }

    async loadTranslations() {
        if (this.translationsLoaded && this.translations) {
            return this.translations;
        }

        try {
            const response = await fetch('./assets/lang/translations.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.translations = await response.json();
            this.translationsLoaded = true;
            return this.translations;
        } catch (error) {
            console.error('Error loading translations:', error);
            // Fallback to global translations object if it exists (backward compatibility)
            if (typeof translations !== 'undefined') {
                console.warn('Using fallback translations object');
                this.translations = translations;
                this.translationsLoaded = true;
                return this.translations;
            }
            throw error;
        }
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

    async initializeLanguage() {
        // Load translations first
        try {
            await this.loadTranslations();
        } catch (error) {
            console.error('Failed to load translations:', error);
            return;
        }

        // Check if we need to hide content for English
        const needsHiding = this.currentLang === 'en';
        
        // Wait a bit to ensure DOM is fully ready, but less delay for English
        const delay = needsHiding ? 0 : 10;
        setTimeout(() => {
            // Set initial language (this is the first load)
            this.isInitialLoad = true;
            this.setLanguage(this.currentLang);
            this.isInitialLoad = false;
            
            // Update language switcher and attach event listeners
            this.updateLanguageSwitcher();
            this.attachEventListeners();
        }, delay);
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

    async setLanguage(lang) {
        console.log('setLanguage called with:', lang);
        
        // Ensure translations are loaded
        if (!this.translationsLoaded) {
            try {
                await this.loadTranslations();
            } catch (error) {
                console.error('Failed to load translations:', error);
                return;
            }
        }
        
        if (!this.translations || !this.translations[lang]) {
            console.warn(`Language ${lang} not found`);
            return;
        }

        console.log('Changing language from', this.currentLang, 'to', lang);
        this.currentLang = lang;
        this.storeLanguage(lang);
        
        // Update HTML lang attribute for SEO
        document.documentElement.setAttribute('lang', lang);
        
        this.updateContent();
        this.updateLanguageSwitcher();
        
        // Dispatch event for Lucide icons re-initialization
        document.dispatchEvent(new CustomEvent('languageChanged'));
        
        console.log('Language changed successfully to:', this.currentLang);
    }

    toggleLanguage() {
        const newLang = this.currentLang === 'el' ? 'en' : 'el';
        this.setLanguage(newLang);
    }

    updateContent() {
        if (!this.translations || !this.translations[this.currentLang]) {
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
        
        // On initial load with 'en', apply translations immediately without fade to prevent flash
        const isInitialEnglishLoad = this.isInitialLoad && this.currentLang === 'en';
        
        elements.forEach(element => {
            // Skip title element as it's handled above
            if (element.tagName === 'TITLE') return;
            
            const key = element.getAttribute('data-i18n');
            if (!key) return;
            
            const translation = this.getTranslation(key);
            
            if (translation !== null && translation !== undefined) {
                if (isInitialEnglishLoad) {
                    // On initial load with English, apply translation immediately without fade
                    this.applyTranslation(element, translation);
                    // Mark as ready immediately to show content
                    element.classList.add('i18n-ready');
                } else {
                    // On language switch, use fade transition
                    const originalOpacity = element.style.opacity || '1';
                    element.style.opacity = '0';
                    element.style.transition = 'opacity 0.2s ease-in-out';
                    
                    setTimeout(() => {
                        this.applyTranslation(element, translation);
                        // Mark as ready
                        element.classList.add('i18n-ready');
                        // Fade in
                        element.style.opacity = '1';
                    }, 100);
                }
            } else {
                console.warn(`Translation not found for key: ${key}`);
                // Even if translation not found, mark as ready to avoid permanent hiding
                element.classList.add('i18n-ready');
            }
        });
        
        // Handle array-based translations (experience, education)
        this.updateArrayBasedTranslations();
        
        // Ensure all elements are marked as ready after translation
        // This handles cases where translation might have been applied but class wasn't added
        if (isInitialEnglishLoad) {
            // Immediate marking for faster display
            requestAnimationFrame(() => {
                elements.forEach(element => {
                    if (element.tagName !== 'TITLE' && !element.classList.contains('i18n-ready')) {
                        element.classList.add('i18n-ready');
                    }
                });
            });
        }
        
        // Fallback: Ensure elements are visible after a short timeout even if something goes wrong
        if (this.currentLang === 'en') {
            setTimeout(() => {
                elements.forEach(element => {
                    if (element.tagName !== 'TITLE' && !element.classList.contains('i18n-ready')) {
                        console.warn('Adding i18n-ready fallback for element:', element);
                        element.classList.add('i18n-ready');
                    }
                });
            }, 500);
        }
    }
    
    updateArrayBasedTranslations() {
        // Handle experience entries
        const experienceEntries = document.querySelectorAll('[data-i18n-experience]');
        if (experienceEntries.length > 0 && this.translations[this.currentLang]?.cv?.experience) {
            const experiences = this.translations[this.currentLang].cv.experience;
            experienceEntries.forEach((entry, index) => {
                if (experiences[index]) {
                    const exp = experiences[index];
                    const titleEl = entry.querySelector('[data-i18n-exp-title]');
                    const companyEl = entry.querySelector('[data-i18n-exp-company]');
                    const periodEl = entry.querySelector('[data-i18n-exp-period]');
                    const descList = entry.querySelectorAll('[data-i18n-exp-desc]');
                    
                    if (titleEl && exp.title) titleEl.textContent = exp.title;
                    if (companyEl && exp.company) companyEl.textContent = exp.company;
                    if (periodEl && exp.period) periodEl.textContent = exp.period;
                    
                    descList.forEach((descEl, descIndex) => {
                        if (exp.description && exp.description[descIndex]) {
                            descEl.textContent = exp.description[descIndex];
                        }
                    });
                }
            });
        }
        
        // Handle education entries
        const educationEntries = document.querySelectorAll('[data-i18n-education]');
        if (educationEntries.length > 0 && this.translations[this.currentLang]?.cv?.education) {
            const educations = this.translations[this.currentLang].cv.education;
            educationEntries.forEach((entry, index) => {
                if (educations[index]) {
                    const edu = educations[index];
                    const titleEl = entry.querySelector('[data-i18n-edu-title]');
                    const institutionEl = entry.querySelector('[data-i18n-edu-institution]');
                    const periodEl = entry.querySelector('[data-i18n-edu-period]');
                    const locationEl = entry.querySelector('[data-i18n-edu-location]');
                    const certEl = entry.querySelector('[data-i18n-edu-cert]');
                    const badgeEls = entry.querySelectorAll('[data-i18n-edu-badge]');
                    
                    if (titleEl && edu.title) titleEl.textContent = edu.title;
                    if (institutionEl && edu.institution) institutionEl.textContent = edu.institution;
                    if (periodEl && edu.period) periodEl.textContent = edu.period;
                    if (locationEl && edu.location) locationEl.textContent = edu.location;
                    if (certEl && edu.certification) certEl.textContent = edu.certification;
                    
                    badgeEls.forEach((badgeEl, badgeIndex) => {
                        if (edu.badges && edu.badges[badgeIndex]) {
                            badgeEl.textContent = edu.badges[badgeIndex];
                        }
                    });
                }
            });
        }
        
        // Handle tech projects
        const techProjectCards = document.querySelectorAll('[data-i18n-tech-project]');
        if (techProjectCards.length > 0 && this.translations[this.currentLang]?.cv?.techProjects?.projects) {
            const projects = this.translations[this.currentLang].cv.techProjects.projects;
            techProjectCards.forEach((card, index) => {
                if (projects[index]) {
                    const project = projects[index];
                    const titleEl = card.querySelector('[data-i18n-tech-title]');
                    const descEl = card.querySelector('[data-i18n-tech-desc]');
                    const aiDevEl = card.querySelector('[data-i18n-tech-aidev]');
                    const homelabEl = card.querySelector('[data-i18n-tech-homelab]');
                    
                    if (titleEl && project.title) titleEl.textContent = project.title;
                    if (descEl && project.description) descEl.textContent = project.description;
                    if (aiDevEl && project.aiDev) aiDevEl.textContent = project.aiDev;
                    if (homelabEl && project.homelab) homelabEl.textContent = project.homelab;
                }
            });
        }
    }
    
    applyTranslation(element, translation) {
        // Handle array values (for lists)
        if (Array.isArray(translation)) {
            translation = translation.join(', ');
        }
        
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
    }

    getTranslation(key) {
        if (!this.translations || !this.translations[this.currentLang]) {
            return null;
        }
        
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return null;
            }
        }
        
        // Return string value, or null if it's an object/array (those are handled separately)
        if (typeof value === 'string' || typeof value === 'number') {
            return String(value);
        }
        
        return null;
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
            console.log('Language button clicked:', lang);
            if (lang && (lang === 'el' || lang === 'en')) {
                console.log('Setting language to:', lang);
                self.setLanguage(lang);
            } else {
                console.warn('Invalid language:', lang);
            }
        };
        
        // Add listener to document (event delegation)
        document.addEventListener('click', this._languageClickHandler);
    }
}

// Initialize language manager
let languageManagerInitialized = false;

async function initializeLanguageManager() {
    // Prevent multiple initializations
    if (languageManagerInitialized) {
        return;
    }
    
    try {
        window.languageManager = new LanguageManager();
        languageManagerInitialized = true;
    } catch (error) {
        console.error('Failed to initialize language manager:', error);
        // Retry after a short delay (max 5 retries)
        let retries = 0;
        const maxRetries = 5;
        const checkInterval = setInterval(() => {
            retries++;
            try {
                window.languageManager = new LanguageManager();
                languageManagerInitialized = true;
                clearInterval(checkInterval);
            } catch (e) {
                if (retries >= maxRetries) {
                    console.error('Failed to initialize language manager after multiple retries');
                    clearInterval(checkInterval);
                }
            }
        }, 200);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLanguageManager);
} else {
    initializeLanguageManager();
}
