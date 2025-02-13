import TranslationService from './TranslationService.js';
import CookieManager from './CookieManager.js';

/**
 * Class representing the cookie consent banner.
 * Manages rendering the banner, handling user consent changes,
 * and updating Google Analytics consent settings.
 * 
 * @author      Anouar
 */
export default class Banner {
    /**
     * Initializes a new instance of the Banner class.
     * @param {Function} onConsentChange Callback for consent changes
     */
    constructor(onConsentChange) {
        this.onConsentChange = onConsentChange;
        $ = jQuery;
    }

    /**
     * Renders the cookie consent banner and the sticky reopen button.
     */
    render() {
        // Create the banner container and append it to the body.
        const $banner = $('<div class="v-cookies-consent">').appendTo('body');
        const privacyPolicyUrl = window.cookieBannerSettings?.privacy_policy_url;

        // Header with title and (optional) logo
        const $header = $('<h2>').appendTo($banner);

        // Check if a custom logo exists on the page
        const $customLogo = jQuery(".custom-logo-link > img.custom-logo").first();
        if ($customLogo.length) {
            // Add the logo image if found with size constraints
            $('<img>', {
                src: $customLogo.attr('src'),
                alt: '>',
                css: {
                    maxWidth: '40px',
                    maxHeight: '40px',
                },
            }).appendTo($header);
        }

        // Add the title text
        $('<span>')
            .text(TranslationService.translate('privacy_on_this_website'))
            .appendTo($header);

        // Create layout for content and buttons
        const $layout = $('<div class="v-cookies-layout">').appendTo($banner);
        const $left = $('<div>').appendTo($layout); // Left section for text content
        const $right = $('<div class="buttons">').appendTo($layout); // Right section for buttons

        // Add explanatory text and list of cookie uses
        $('<p>').text(TranslationService.translate('cookies_statement')).appendTo($left);
        $('<ul class="v-cookies-list">')
            .append(`<li>- ${TranslationService.translate('web_analytics')}</li>`)
            .append(`<li>- ${TranslationService.translate('conversion_tracking')}</li>`)
            .appendTo($left);

        // Create the privacy policy link only if a URL is present
        if (privacyPolicyUrl) {
            $('<a>', {
                href: privacyPolicyUrl,
                target: '_blank',
                text: TranslationService.translate('read_privacy_policy')
            }).appendTo($left);
        }

        // Agree button: grants consent
        const $agree = $('<a href="#" class="button">')
            .text(TranslationService.translate('agree'))
            .on('click', (e) => {
                e.preventDefault();
                this.onConsentChange('granted'); // Grant consent
                $banner.hide(); // Hide the banner after agreement
                $('.cookie-reopen-button').show(); // Show the reopen button
            })
            .appendTo($right);

        // Disagree button: denies consent
        const $disagree = $('<a href="#" class="button --disagree">')
            .text(TranslationService.translate('disagree'))
            .on('click', (e) => {
                e.preventDefault();
                this.onConsentChange('denied'); // Deny consent
                $banner.hide(); // Hide the banner after agreement
                $('.cookie-reopen-button').show(); // Show the reopen button
                setTimeout(() => window.location.reload(), 1000); // Reload page to clear cookies
            })
            .appendTo($right);

        jQuery(document).ready(function ($) {
            const $reopenButton = $('<button class="cookie-reopen-button">')
                .html('<i class="fas fa-cookie-bite"></i>')
                .hide() // Initially hidden.
                .on('click', function () {
                    $('.v-cookies-consent').show();
                    $(this).hide();
                })
                .appendTo('body');

            // Make sure it displays correctly based on cookie settings.
            const savedConsent = new CookieManager(Cookies).get('v_cookies');
            if (savedConsent === 'denied' || savedConsent === 'granted') {
                $('.v-cookies-consent').hide();
                $reopenButton.show();
            } else {
                $('.v-cookies-consent').show();
                $reopenButton.hide();
            }
        });
    }
}
