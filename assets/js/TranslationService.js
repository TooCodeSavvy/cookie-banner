/**
 * TranslationService handles the translation of text based on the current language.
 * It provides functionality to retrieve translations and dynamically replace properties
 * within the translation strings.
 *
 * @author      Anouar
 */
export default class TranslationService {
    /**
     * A collection of translations for supported languages (e.g., Dutch and English).
     * The translations object holds keys and their corresponding text in different languages.
     */
    static #translations = {
        nl: {
            privacy_on_this_website: "Privacy op deze website",
            cookies_statement: "We verzamelen en verwerken uw gegevens om u optimaal gebruik van deze website te kunnen bieden. Functionele cookies zijn noodzakelijk voor het correct functioneren van de website. U kunt uw toestemming geven voor alle niet-functionele cookies, of u kunt ze allemaal weigeren:",
            web_analytics: "Webanalyse",
            conversion_tracking: "Conversietracking",
            read_privacy_policy: "Lees hier ons privacybeleid",
            agree: "Akkoord",
            disagree: "Niet akkoord",
        },
        en: {
            privacy_on_this_website: "Privacy on this website",
            cookies_statement: "We collect and process your data to provide you with optimal use of this website. Functional cookies are necessary for the proper functioning of the website. You can give your consent for all non-functional cookies, or you can refuse them all:",
            web_analytics: "Web Analytics",
            conversion_tracking: "Conversion Tracking",
            read_privacy_policy: "Read our privacy policy here",
            agree: "Agree",
            disagree: "Disagree",
        },
    };

    /**
     * Get the current language of the document based on the <html> lang attribute using jQuery.
     * Defaults to 'en' (English) if no language is detected or if the language is not supported.
     *
     * @returns {string} The current language code ('nl' for Dutch, 'en' for English).
     */
    static #getCurrentLanguage() {
        // Use jQuery to retrieve the language set in the <html> tag or default to 'en' if no language is set
        const lang = jQuery('html').attr('lang') || 'en';

        // Return 'nl' for Dutch if the language starts with 'nl', otherwise return 'en'
        return lang.startsWith('nl') ? 'nl' : 'en';
    }

    /**
     * Translate a given key to the current language and replace dynamic properties in the translation.
     *
     * @param {string} key - The translation key used to find the appropriate translation.
     * @param {Object} [properties={}] - An optional object of dynamic properties to replace in the translation string.
     * @returns {string} The translated text with replaced properties.
     */
    static translate(key, properties = {}) {
        // Determine the current language
        const language = this.#getCurrentLanguage();

        // Get the translation for the key in the current language, default to the key itself if no translation exists
        let text = this.#translations[language]?.[key] || key;

        // Replace dynamic properties in the translated text
        for (const [prop, value] of Object.entries(properties)) {
            text = text.replace(`:${prop}`, value);
        }

        return text;
    }
}
