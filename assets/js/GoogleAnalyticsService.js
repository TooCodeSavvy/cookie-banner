/**
 * A service to manage Google Analytics and Tag Manager integration.
 * Provides functionality for consent initialization, updates, and loading scripts.
 *
 * @author      Anouar
 */
export default class GoogleAnalyticsService {
    /**
     *  Update consent mode to Google Analytics
     */
    static updateGA = function () {
        // Ensure the dataLayer exists; Google scripts depend on it.
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(arguments);
    };

    /**
     * Initialize Google Analytics consent mode with default settings.
     * Ensures compliance with privacy regulations until user consent is provided.
     */
    static initializeGAConsent = () => {
        // Ensure the dataLayer exists; Google scripts depend on it.
        window.dataLayer = window.dataLayer || [];

        // Set default consent settings.
        this.updateGA('consent', 'default', {
            // Sets storage (such as cookies) related to advertising.
            'ad_storage': 'denied',
            // Sets consent for sending user data related to advertising to Google.
            'ad_user_data': 'denied',
            // Sets consent for personalized advertising.
            'ad_personalization': 'denied',
            // Enables storage (such as cookies) related to analytics e.g. visit duration.
            'analytics_storage': 'denied',
            // Sets consent for storage related to security, like authentication and fraud prevention.
            'security_storage': 'denied',
            // Sets consent for storage that supports website or app functionality (e.g., language preferences).
            'functionality_storage': 'denied',
            // Sets consent for storage related to user personalization (e.g., content recommendations).
            'personalization_storage': 'denied'
        });
    };

    /**
     * Update the consent status in Google Analytics.
     * Allows toggling between 'granted' or 'denied' for various storage types.
     *
     * @param {string} consent - The user's consent choice ('granted' or 'denied').
     */
    static updateGAConsent = (consent) => {
        // Update analytics consent settings.
        this.updateGA('consent', 'update', {
            // Sets storage (such as cookies) related to advertising.
            'ad_storage': consent,
            // Sets consent for sending user data related to advertising to Google.
            'ad_user_data': consent,
            // Sets consent for personalized advertising.
            'ad_personalization': consent,
            // Enables storage (such as cookies) related to analytics e.g. visit duration.
            'analytics_storage': consent,
            // Sets consent for storage related to security, like authentication and fraud prevention.
            'security_storage': consent,
            // Sets consent for storage that supports website or app functionality (e.g., language preferences).
            'functionality_storage': consent,
            // Sets consent for storage related to user personalization (e.g., content recommendations).
            'personalization_storage': consent,
            // Optional delay for asynchronously loaded GA scripts.
            'wait_for_update': 500
        });
    };

    /**
     * Load Google Tag Manager scripts and inline configurations.
     * Ensures the GTM scripts are loaded only if a valid GTM ID is provided.
     * @param {string} gtmId - The Google Tag Manager ID.
     */
    static loadScripts(gtmId) {
        if (!gtmId) return;

        // Add the GTM script
        this.#addScript(`https://www.googletagmanager.com/gtm.js?id=${gtmId}`);

        // Add inline GTM configuration script
        this.#addInlineScript(`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtmId}');
        `);

        // Add the noscript fallback iframe
        this.#addIframe(`https://www.googletagmanager.com/ns.html?id=${gtmId}`);
    }
    /**
     * Add an external script to the document.
     * The script is loaded asynchronously to avoid blocking page load.
     * @param {string} src - The script source URL.
     */
    static #addScript(src) {
        jQuery('<script>', { src, async: true }).appendTo('head');
    }

    /**
     * Add an inline script to the document.
     * Used to inject configuration scripts directly into the page.
     * @param {string} content - The script content.
     */
    static #addInlineScript(content) {
        jQuery('<script>').text(content).appendTo('head');
    }

    /**
     * Add a noscript iframe to the document.
     * Provides a fallback for users with JavaScript disabled, required for GTM compliance.
     * @param {string} src - The iframe source URL.
     */
    static #addIframe(src) {
        jQuery('<iframe>', {
            src,
            style: 'display:none;visibility:hidden', // Ensure the iframe is hidden.
            width: 0, // Set minimal dimensions.
            height: 0, // Set minimal dimensions.
        }).appendTo('body');
    }
}
