<?php
namespace CookieBanner\Includes;

/**
 * Manages the settings for the cookie banner by reading, updating, and saving
 * configuration settings stored in a JSON file. This class also provides methods
 * for retrieving specific settings related to cookies, such as excluded cookies
 * and third-party cookies to remove.
 *
 * @author      Anouar
 */
class SettingsManager {

    /**
     * @var string Path to the settings file that contains configuration data.
     */
    private $settings_file;

    /**
     * SettingsManager constructor.
     *
     * @param string $file_path The path to the settings file.
     */
    public function __construct($file_path) {
        $this->settings_file = $file_path;
    }

    /**
     * Get all settings from the settings file.
     *
     * This method reads the settings file, decodes the JSON data, and returns
     * it as an associative array. If the file is not accessible or the JSON is
     * invalid, default settings are returned.
     *
     * @return array The settings as an associative array.
     */
    public function get_settings() {
        // Check if the settings file exists and is readable
        if (file_exists($this->settings_file) && is_readable($this->settings_file)) {
            // Read the file contents
            $settings_json = file_get_contents($this->settings_file);

            // Decode JSON data into an associative array
            $settings = json_decode($settings_json, true);

            // Check if the JSON data is valid
            if (json_last_error() === JSON_ERROR_NONE) {
                return $settings;
            }
        }

        // Return default settings if the file cannot be read or JSON is invalid
        return [
            'gtm_id' => '',
            'cookies_to_remove' => [],
            'excluded_cookies' => [],
            'third_party_cookies_to_remove' => [],
            'privacy_policy_url' => ''
        ];
    }

    /**
     * Get the list of excluded cookies from the settings.
     *
     * This method returns an array of cookies that are excluded from removal.
     * If no excluded cookies are set, an empty array is returned.
     *
     * @return array The list of excluded cookies.
     */
    public function get_excluded_cookies() {
        // Retrieve general settings and return the excluded cookies
        $settings = $this->get_settings();
        return isset($settings['excluded_cookies']) ? $settings['excluded_cookies'] : [];
    }

    /**
     * Get the list of third-party cookies to remove from the settings.
     *
     * This method returns an array of third-party cookies that should be removed.
     * If no third-party cookies are set, an empty array is returned.
     *
     * @return array The list of third-party cookies to remove.
     */
    public function get_third_party_cookies_to_remove() {
        // Retrieve general settings and return the third-party cookies to remove
        $settings = $this->get_settings();
        return isset($settings['third_party_cookies_to_remove']) ? $settings['third_party_cookies_to_remove'] : [];
    }

    /**
     * Update the settings file with new settings.
     *
     * This method encodes the provided settings array into JSON and writes it to
     * the settings file. It ensures the JSON is formatted for readability.
     *
     * @param array $new_settings The new settings to save.
     *
     * @return bool True if the settings were successfully updated, false otherwise.
     */
    public function update_settings($new_settings) {
        // Encode the settings array into a JSON string with pretty print
        $settings_json = json_encode($new_settings, JSON_PRETTY_PRINT);

        // Return false if the JSON encoding fails
        if ($settings_json === false) return false;

        // Write the JSON to the settings file and return the result
        return file_put_contents($this->settings_file, $settings_json) !== false;
    }
}
