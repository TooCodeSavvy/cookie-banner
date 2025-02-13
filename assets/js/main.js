import Banner from './Banner.js';
import CookieManager from './CookieManager.js';
import GoogleAnalyticsService from './GoogleAnalyticsService.js';

jQuery(document).ready(() => {
    // Initialize the default consent mode (denied for all categories).
    // This ensures no storage or tracking is active until the user explicitly provides consent.
    GoogleAnalyticsService.initializeGAConsent();

    // Retrieve the Google Tag Manager (GTM) ID from global settings if available.
    // This ID is used for loading GTM scripts and configurations.
    const gtmId = window.cookieBannerSettings?.gtm_id || null;

    const cookieManager = new CookieManager(Cookies);

    /**
     * Handle consent changes by updating the relevant services.
     *
     * @param {string} consent - The user's consent choice ('granted' or 'denied').
     * This function saves the user's consent in cookies and updates Google Analytics consent mode.
     */
    const onConsentChange = consent => {
        // Save the user's consent status in cookies for future reference.
        cookieManager.set('v_cookies', consent);

        // Update Google Analytics consent mode based on the user's choice.
        GoogleAnalyticsService.updateGAConsent(consent);

        if (consent === 'granted') {
            // If consent is granted, load Google Tag Manager scripts.
            GoogleAnalyticsService.loadScripts(gtmId);
        } else {
            // If consent is denied, remove all non-consented cookies and data.
            cookieManager.clearNonConsentCookies();
        }
    };

    // Check for any existing consent status stored in cookies.
    // If the consent status is found, apply it, otherwise, show the banner to ask for consent.
    const savedConsent = cookieManager.get('v_cookies');

    // **Always** instantiate the banner (this ensures the reopen button is created)
    new Banner(onConsentChange).render();

    if (!savedConsent) {
        // Remove all non-consented cookies and data.
        cookieManager.clearNonConsentCookies();
    } else {
        // Apply the saved consent status from cookies.
        GoogleAnalyticsService.updateGAConsent(savedConsent);

        if (savedConsent === 'granted') {
            // If consent was previously granted, load the GTM scripts.
            GoogleAnalyticsService.loadScripts(gtmId);
        } else {
            // If consent is denied, remove all non-consented cookies and data.
            cookieManager.clearNonConsentCookies();
        }
    }
});
