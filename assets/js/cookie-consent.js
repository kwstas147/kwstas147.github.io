/**
 * Cookie Consent Banner — GDPR Compliant
 * 
 * Χρησιμοποιεί Google Consent Mode v2 για τη διαχείριση
 * της συναίνεσης του χρήστη πριν τη φόρτωση cookies.
 * Υποστηρίζει EL/EN localization και Dark/Light theme.
 * 
 * @version 1.0.0
 */
(function() {
    'use strict';

    // === Μεταφράσεις Cookie Banner ===
    const COOKIE_TRANSLATIONS = {
        el: {
            title: '🍪 Χρήση Cookies',
            message: 'Αυτός ο ιστότοπος χρησιμοποιεί cookies από το Google Analytics για την ανάλυση της επισκεψιμότητας. Τα δεδομένα συλλέγονται ανώνυμα και βοηθούν στη βελτίωση της εμπειρίας σας.',
            accept: 'Αποδοχή',
            reject: 'Απόρριψη',
            privacy: 'Πολιτική Απορρήτου',
            manage: 'Διαχείριση Cookies'
        },
        en: {
            title: '🍪 Cookie Usage',
            message: 'This website uses Google Analytics cookies to analyze traffic. Data is collected anonymously and helps improve your experience.',
            accept: 'Accept',
            reject: 'Reject',
            privacy: 'Privacy Policy',
            manage: 'Manage Cookies'
        }
    };

    // === Σταθερές ===
    const CONSENT_KEY = 'cookie_consent';
    const CONSENT_TIMESTAMP_KEY = 'cookie_consent_timestamp';
    const GA_ID = 'G-Z3D154BR9R';
    // Η συναίνεση λήγει μετά από 6 μήνες (GDPR best practice)
    const CONSENT_EXPIRY_DAYS = 180;

    // === Βοηθητικές Συναρτήσεις ===

    /**
     * Ανιχνεύει την τρέχουσα γλώσσα από το HTML element
     */
    function getCurrentLanguage() {
        return document.documentElement.getAttribute('lang') || 'en';
    }

    /**
     * Παίρνει τις μεταφράσεις για την τρέχουσα γλώσσα
     */
    function getTranslations() {
        const lang = getCurrentLanguage();
        return COOKIE_TRANSLATIONS[lang] || COOKIE_TRANSLATIONS.en;
    }

    /**
     * Ελέγχει αν η αποθηκευμένη συναίνεση έχει λήξει
     */
    function isConsentExpired() {
        const timestamp = localStorage.getItem(CONSENT_TIMESTAMP_KEY);
        if (!timestamp) return true;
        
        const consentDate = new Date(parseInt(timestamp, 10));
        const now = new Date();
        const diffDays = (now - consentDate) / (1000 * 60 * 60 * 24);
        
        return diffDays > CONSENT_EXPIRY_DAYS;
    }

    /**
     * Επιστρέφει την αποθηκευμένη κατάσταση συναίνεσης
     * @returns {'granted'|'denied'|null}
     */
    function getStoredConsent() {
        const consent = localStorage.getItem(CONSENT_KEY);
        if (!consent) return null;
        if (isConsentExpired()) {
            // Η συναίνεση έχει λήξει, καθαρισμός
            localStorage.removeItem(CONSENT_KEY);
            localStorage.removeItem(CONSENT_TIMESTAMP_KEY);
            return null;
        }
        return consent;
    }

    /**
     * Αποθηκεύει τη συναίνεση στο localStorage
     */
    function saveConsent(value) {
        localStorage.setItem(CONSENT_KEY, value);
        localStorage.setItem(CONSENT_TIMESTAMP_KEY, Date.now().toString());
    }

    /**
     * Ενημερώνει το Google Consent Mode
     */
    function updateGoogleConsent(granted) {
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': granted ? 'granted' : 'denied'
            });
        }
    }

    // === UI Δημιουργία Banner ===

    /**
     * Δημιουργεί και εμφανίζει το cookie consent banner
     */
    function createBanner() {
        const t = getTranslations();

        // Container
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-consent-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', t.title);
        banner.setAttribute('aria-modal', 'false');

        banner.innerHTML = `
            <div class="cookie-consent-inner">
                <div class="cookie-consent-content">
                    <h3 class="cookie-consent-title">${t.title}</h3>
                    <p class="cookie-consent-message">${t.message}</p>
                    <a href="privacy.html" class="cookie-consent-privacy-link">${t.privacy}</a>
                </div>
                <div class="cookie-consent-actions">
                    <button id="cookie-reject-btn" class="cookie-consent-btn cookie-consent-btn-reject" type="button">
                        ${t.reject}
                    </button>
                    <button id="cookie-accept-btn" class="cookie-consent-btn cookie-consent-btn-accept" type="button">
                        ${t.accept}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        // Trigger animation μετά από μικρό delay
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                banner.classList.add('cookie-consent-visible');
            });
        });

        // Event Listeners
        document.getElementById('cookie-accept-btn').addEventListener('click', function() {
            handleConsent(true);
        });

        document.getElementById('cookie-reject-btn').addEventListener('click', function() {
            handleConsent(false);
        });
    }

    /**
     * Διαχειρίζεται την απόφαση του χρήστη
     */
    function handleConsent(accepted) {
        const value = accepted ? 'granted' : 'denied';
        saveConsent(value);
        updateGoogleConsent(accepted);
        hideBanner();
    }

    /**
     * Κρύβει το banner με animation
     */
    function hideBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('cookie-consent-visible');
            banner.classList.add('cookie-consent-hidden');
            // Αφαίρεση από DOM μετά το animation
            setTimeout(() => {
                if (banner.parentNode) {
                    banner.parentNode.removeChild(banner);
                }
            }, 400);
        }
    }

    // === Footer "Manage Cookies" Link ===

    /**
     * Δημιουργεί link "Διαχείριση Cookies" στο footer
     */
    function addManageCookiesLink() {
        const footers = document.querySelectorAll('footer');
        if (footers.length === 0) return;

        const footer = footers[footers.length - 1];
        const borderDiv = footer.querySelector('.border-t.border-theme');
        if (!borderDiv) return;

        const t = getTranslations();
        const link = document.createElement('a');
        link.href = '#';
        link.id = 'manage-cookies-link';
        link.className = 'cookie-manage-link';
        link.textContent = t.manage;
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Καθαρισμός παλιάς συναίνεσης για εκ νέου εμφάνιση
            localStorage.removeItem(CONSENT_KEY);
            localStorage.removeItem(CONSENT_TIMESTAMP_KEY);
            // Εμφάνιση banner ξανά
            const existingBanner = document.getElementById('cookie-consent-banner');
            if (!existingBanner) {
                createBanner();
            }
        });

        // Προσθήκη δίπλα στο copyright
        const copyright = borderDiv.querySelector('p');
        if (copyright) {
            const separator = document.createTextNode(' · ');
            copyright.parentNode.insertBefore(separator, copyright.nextSibling);
            copyright.parentNode.insertBefore(link, separator.nextSibling);
        }
    }

    // === Language Change Listener ===

    /**
     * Ακούει αλλαγές γλώσσας και ενημερώνει τα κείμενα
     */
    function setupLanguageListener() {
        document.addEventListener('languageChanged', function() {
            const banner = document.getElementById('cookie-consent-banner');
            if (banner) {
                const t = getTranslations();
                const title = banner.querySelector('.cookie-consent-title');
                const message = banner.querySelector('.cookie-consent-message');
                const privacyLink = banner.querySelector('.cookie-consent-privacy-link');
                const acceptBtn = document.getElementById('cookie-accept-btn');
                const rejectBtn = document.getElementById('cookie-reject-btn');

                if (title) title.textContent = t.title;
                if (message) message.textContent = t.message;
                if (privacyLink) privacyLink.textContent = t.privacy;
                if (acceptBtn) acceptBtn.textContent = t.accept;
                if (rejectBtn) rejectBtn.textContent = t.reject;
            }

            // Ενημέρωση "Manage Cookies" link
            const manageLink = document.getElementById('manage-cookies-link');
            if (manageLink) {
                const t = getTranslations();
                manageLink.textContent = t.manage;
            }
        });
    }

    // === Αρχικοποίηση ===

    function init() {
        const storedConsent = getStoredConsent();

        if (storedConsent === null) {
            // Δεν υπάρχει συναίνεση — εμφάνιση banner
            // Μικρό delay για να φορτώσει η σελίδα
            setTimeout(createBanner, 800);
        } else {
            // Εφαρμογή αποθηκευμένης συναίνεσης
            updateGoogleConsent(storedConsent === 'granted');
        }

        // Προσθήκη "Manage Cookies" στο footer
        addManageCookiesLink();

        // Ενεργοποίηση γλωσσικού listener
        setupLanguageListener();
    }

    // Εκκίνηση όταν το DOM είναι έτοιμο
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
