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
        const $banner = $('<div class="v-cookies-consent fixed bottom-0 left-0 w-full p-6 bg-white shadow-lg rounded-lg max-w-lg mx-auto z-50 ml-4 mb-2">').appendTo('body');
        const privacyPolicyUrl = window.cookieBannerSettings?.privacy_policy_url;

        // Header with title and (optional) logo
        const $header = $('<div class="flex justify-between items-center mb-4">').appendTo($banner);

        // Check if a custom logo exists on the page
        const $customLogo = jQuery(".custom-logo-link > img.custom-logo").first();
        if ($customLogo.length) {
            // Add the logo image if found with size constraints
            $('<img>', {
                src: $customLogo.attr('src'),
                alt: 'Logo',
                class: 'w-8 h-8 object-contain',
            }).appendTo($header);
        }

        // Add the title text
        $('<p class="text-lg font-semibold text-black">')
            .text(TranslationService.translate('privacy_on_this_website'))
            .appendTo($header);

        // Create layout for content and buttons
        const $content = $('<div class="space-y-4">').appendTo($banner);
        
        // Add explanatory text
        $('<p class="text-xs text-black">')
            .text(TranslationService.translate('cookies_statement'))
            .appendTo($content);

        // List of cookie uses (styled horizontally)
        const $cookieList = $('<div class="flex space-x-4 text-black">')
            .append(`<div>- ${TranslationService.translate('web_analytics')}</div>`)
            .append(`<div>- ${TranslationService.translate('conversion_tracking')}</div>`)
            .appendTo($content);

        // Create the privacy policy link only if a URL is present
        if (privacyPolicyUrl) {
            $('<a class="text-black hover:underline text-xs" href="' + privacyPolicyUrl + '" target="_blank">')
                .text(TranslationService.translate('read_privacy_policy'))
                .appendTo($content);
        }

        // Buttons container
        const $buttons = $('<div class="flex justify-between gap-4 mt-4">').appendTo($banner);

        // Agree button: grants consent
        const $agree = $('<button class="w-full py-2 px-4 bg-black text-white rounded-md font-semibold text-sm transition duration-200 hover:bg-gray-800">')
            .text(TranslationService.translate('agree'))
            .on('click', (e) => {
                e.preventDefault();
                this.onConsentChange('granted'); // Grant consent
                $banner.hide(); // Hide the banner after agreement
                $('.cookie-reopen-button').show(); // Show the reopen button
            })
            .appendTo($buttons);

        // Disagree button: denies consent
        const $disagree = $('<button class="w-full py-2 px-4 bg-black text-white rounded-md font-semibold text-sm transition duration-200 hover:bg-gray-800">')
            .text(TranslationService.translate('disagree'))
            .on('click', (e) => {
                e.preventDefault();
                this.onConsentChange('denied'); // Deny consent
                $banner.hide(); // Hide the banner after agreement
                $('.cookie-reopen-button').show(); // Show the reopen button
                setTimeout(() => window.location.reload(), 1000); // Reload page to clear cookies
            })
            .appendTo($buttons);

        // Reopen button for later
        jQuery(document).ready(function ($) {
            const $reopenButton = $('<button class="cookie-reopen-button fixed bottom-6 left-6 w-12 h-12 bg-black text-white rounded-full shadow-lg flex justify-center items-center text-xl transition duration-200 hover:bg-gray-800">')
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
