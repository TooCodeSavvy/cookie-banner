/**
 * A utility class for managing cookies and clearing non-consent data.
 * This class abstracts common cookie operations like setting, getting,
 * and removing cookies, while also providing functionality for clearing
 * non-consent cookies and local/session storage.
 *
 * @author      Anouar
 */
export default class CookieManager {
    constructor(Cookies) {
        this.Cookies = Cookies;
        this.cookiesToRemove = [
            ...(window.cookieBannerSettings.cookies_to_remove || []),
            ...(window.cookieBannerSettings.third_party_cookies_to_remove || []),
        ];
    }

    /**
     * Returns default options for setting cookies.
     * These options ensure that cookies are secure and adhere to privacy standards.
     *
     * @returns {Object} The default cookie options.
     */
    #getOptions() {
        return {
            expires: 365, // The cookie expires in 365 days.
            secure: true, // Cookies are only sent over secure HTTPS connections.
            samesite: "none", // Cookies can be sent across sites for third-party usage.
        };
    }

    /**
     * Sets a cookie with the given name and value.
     * Uses the default options from `getOptions()`.
     *
     * @param {string} name - The name of the cookie.
     * @param {string} value - The value to store in the cookie.
     */
    set(name, value) {
        this.Cookies.set(name, value, this.#getOptions());
    }

    /**
     * Retrieves the value of a cookie by its name.
     *
     * @param {string} name - The name of the cookie.
     * @returns {string|undefined} The value of the cookie, or undefined if not found.
     */
    get(name) {
        return this.Cookies.get(name);
    }

    /**
     * Removes a cookie by its name.
     * Ensures the cookie is removed with the proper path and security options.
     *
     * @param {string} name - The name of the cookie to remove.
     */
    remove(name) {
        this.Cookies.remove(name, { path: '/', sameSite: 'None', secure: true });
    }

    /**
     * Clears non-consent cookies and local storage.
     * This method removes a predefined list of cookies that are non-essential
     * and not permitted without user consent. It also clears the local and session storage.
     */
    clearNonConsentCookies() {
        // List of non-consent cookies to remove.
        this.cookiesToRemove.forEach(name => this.remove(name));

        // Clear all local storage and session storage data.
        localStorage.clear();
        sessionStorage.clear();
    }
}
