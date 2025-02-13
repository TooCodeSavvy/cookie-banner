<?php
namespace CookieBanner\Includes;

/**
 * Handles AJAX requests related to cookie operations, such as scanning for cookies
 * and managing excluded cookies or third-party cookies to remove.
 *
 * @author      Anouar
 */
class AjaxHandler {
    /**
     * @var SettingsManager Manages plugin settings.
     */
    private SettingsManager $settings_manager;

    /**
     * AjaxHandler constructor.
     *
     * @param SettingsManager $settings_manager The settings manager instance.
     */
    public function __construct(SettingsManager $settings_manager) {
        $this->settings_manager = $settings_manager;
    }

    /**
     * Register WordPress AJAX hooks for cookie operations.
     */
    public function register_hooks() {
        // Hook for handling the 'scan_cookies' AJAX action.
        add_action('wp_ajax_scan_cookies', [$this, 'scan_cookies']);
    }

    /**
     * Scan cookies available in the user's browser and filter them based on settings.
     *
     * - Retrieves all cookies from the `$_COOKIE` superglobal.
     * - Excludes specific cookies defined in the plugin settings.
     * - Identifies and includes third-party cookies for removal.
     * - Sends the filtered list of cookies back to the client.
     *
     * Sends a JSON response with the following structure:
     * - On success: `{ success: true, cookies: [array_of_cookies_to_remove] }`
     * - On failure: `{ success: false, message: "error_message" }`
     */
    public function scan_cookies() {
        // Ensure the current user has the required capability.
        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Unauthorized'], 403);
        }

        // Retrieve all cookies from the $_COOKIE superglobal.
        $cookies = isset($_COOKIE) ? array_keys($_COOKIE) : [];

        // Fetch the list of excluded cookies from settings.
        $excluded_cookies = $this->settings_manager->get_excluded_cookies();

        // Fetch the list of third-party cookies to remove.
        $third_party_cookies_to_remove = $this->settings_manager->get_third_party_cookies_to_remove();

        // Add third-party cookies to the list for removal.
        foreach ($third_party_cookies_to_remove as $third_party_cookie) {
            // Match all cookies that start with the third-party cookie name (e.g., _ga, _ga_*).
            foreach ($cookies as $cookie) {
                if (preg_match('/^' . preg_quote($third_party_cookie, '/') . '/', $cookie)) {
                    $cookies[] = $cookie; // Add the matching cookie to the list.
                }
            }
        }

        // Filter cookies by removing excluded cookies.
        $cookies_to_remove = array_filter($cookies, function($cookie) use ($excluded_cookies) {
            foreach ($excluded_cookies as $excluded_cookie) {
                if (strpos($cookie, $excluded_cookie) === 0) {
                    return false; // Skip cookies that start with any excluded name.
                }
            }
            return true;
        });

        // Send the filtered list of cookies back to the client as a JSON response.
        wp_send_json_success(['cookies' => $cookies_to_remove]);
    }
}
