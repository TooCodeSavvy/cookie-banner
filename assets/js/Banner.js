import TranslationService from './TranslationService.js';
import CookieManager from './CookieManager.js';

export default class Banner {
    constructor(onConsentChange) {
        this.onConsentChange = onConsentChange;
        $ = jQuery;
    }

    render() {
        const $banner = $('<div>').addClass('fixed bottom-0 left-0 right-0 bg-blue-500 text-white p-6 shadow-md z-50').appendTo('body');
        const privacyPolicyUrl = window.cookieBannerSettings?.privacy_policy_url;

        const $header = $('<h2>').addClass('text-lg font-semibold flex items-center gap-2 mb-4').appendTo($banner);
        const $customLogo = jQuery(".custom-logo-link > img.custom-logo").first();
        if ($customLogo.length) {
            $('<img>', {
                src: $customLogo.attr('src'),
                alt: 'Logo',
                class: 'w-10 h-10'
            }).appendTo($header);
        }
        $('<span>').text(TranslationService.translate('privacy_on_this_website')).appendTo($header);

        const $layout = $('<div>').addClass('flex flex-col md:flex-row justify-between items-center gap-4').appendTo($banner);
        const $left = $('<div>').addClass('flex-1').appendTo($layout);
        const $right = $('<div>').addClass('flex flex-col gap-2 md:flex-row').appendTo($layout);

        $('<p>').addClass('text-sm').text(TranslationService.translate('cookies_statement')).appendTo($left);
        $('<ul>').addClass('list-disc list-inside text-sm').append(
            `<li>${TranslationService.translate('web_analytics')}</li>`
        ).append(
            `<li>${TranslationService.translate('conversion_tracking')}</li>`
        ).appendTo($left);

        if (privacyPolicyUrl) {
            $('<a>', {
                href: privacyPolicyUrl,
                target: '_blank',
                text: TranslationService.translate('read_privacy_policy'),
                class: 'text-white underline text-sm'
            }).appendTo($left);
        }

        const $agree = $('<a href="#">')
            .addClass('bg-orange-500 px-4 py-2 text-white rounded-md text-sm hover:bg-orange-600 transition')
            .text(TranslationService.translate('agree'))
            .on('click', (e) => {
                e.preventDefault();
                this.onConsentChange('granted');
                $banner.hide();
                $('.cookie-reopen-button').show();
            })
            .appendTo($right);

        const $disagree = $('<a href="#">')
            .addClass('bg-gray-700 px-4 py-2 text-white rounded-md text-sm hover:bg-gray-800 transition')
            .text(TranslationService.translate('disagree'))
            .on('click', (e) => {
                e.preventDefault();
                this.onConsentChange('denied');
                $banner.hide();
                $('.cookie-reopen-button').show();
                setTimeout(() => window.location.reload(), 1000);
            })
            .appendTo($right);

        jQuery(document).ready(function ($) {
            const $reopenButton = $('<button>')
                .addClass('cookie-reopen-button fixed bottom-5 left-5 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg hidden')
                .html('<i class="fas fa-cookie-bite"></i>')
                .on('click', function () {
                    $('.fixed.bottom-0').show();
                    $(this).hide();
                })
                .appendTo('body');

            const savedConsent = new CookieManager(Cookies).get('v_cookies');
            if (savedConsent === 'denied' || savedConsent === 'granted') {
                $banner.hide();
                $reopenButton.show();
            }
        });
    }
}
