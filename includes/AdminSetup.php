<?php
namespace CookieBanner\Includes;

/**
 * This class handles the admin interface for the Cookie Banner plugin,
 * including rendering the setup wizard and saving configuration settings.
 *
 * @author      Anouar
 */
class AdminSetup {
    /**
     * @var SettingsManager Manages plugin settings.
     */
    private SettingsManager $settings_manager;

    /**
     * AdminSetup constructor.
     *
     * @param SettingsManager $settings_manager The settings manager instance.
     */
    public function __construct(SettingsManager $settings_manager) {
        $this->settings_manager = $settings_manager;
    }

    /**
     * Register WordPress hooks for admin functionality.
     */
    public function register_hooks()
    {
        // Hook to add the admin menu for the Cookie Banner Setup Wizard.
        add_action('admin_menu', [$this, 'add_admin_menu']);
        // Hook to handle saving settings via a custom admin-post action.
        add_action('admin_post_cb_save_settings', [$this, 'save_settings']);
    }

    /**
     * Add the Cookie Banner Setup Wizard submenu to the Settings menu in WordPress.
     */
    public function add_admin_menu() {
        add_submenu_page(
            'options-general.php', // Parent slug (Settings menu).
            'Cookie Banner Setup', // Page title.
            'Cookie Banner Setup', // Menu title.
            'manage_options', // Capability required to access this menu.
            'cookie-banner-setup', // Menu slug.
            [$this, 'render_setup_wizard'] // Callback function to render the page.
        );
    }

    /**
     * Render the Cookie Banner Setup Wizard page.
     *
     * This method fetches the current settings and includes the setup wizard template.
     */
    public function render_setup_wizard() {
        // Retrieve current plugin settings.
        $settings = $this->settings_manager->get_settings();
        // Include the setup wizard template file.
        include plugin_dir_path(__FILE__) . 'views/setup-wizard.php';
    }

    /**
     * Handle saving settings from the setup wizard form.
     */
    public function save_settings() {
        // Verify the nonce for security purposes.
        if (!isset($_POST['cb_nonce']) || !wp_verify_nonce($_POST['cb_nonce'], 'cb_save_settings_action')) {
            wp_die(__('Nonce verification failed', 'cookie-banner'));
        }

        // Ensure the current user has the required capability.
        if (!current_user_can('manage_options')) {
            wp_die(__('Unauthorized user', 'cookie-banner'));
        }

        // Sanitize and retrieve form data.
        $gtm_id = isset($_POST['cb_gtm_id']) ? sanitize_text_field($_POST['cb_gtm_id']) : '';
        $cookies_to_remove = isset($_POST['cookies_to_remove']) ? sanitize_textarea_field($_POST['cookies_to_remove']) : '';
        $excluded_cookies = isset($_POST['excluded_cookies']) ? sanitize_textarea_field($_POST['excluded_cookies']) : '';
        $third_party_cookies_to_remove = isset($_POST['third_party_cookies_to_remove']) ? sanitize_textarea_field($_POST['third_party_cookies_to_remove']) : '';
        $privacy_policy_url = isset($_POST['privacy_policy_url']) ? esc_url_raw($_POST['privacy_policy_url']) : '';

        // Process and sanitize the cookies to remove list.
        $cookies_to_remove = explode("\n", $cookies_to_remove); // Split on newlines.
        $cookies_to_remove = array_map('trim', $cookies_to_remove); // Trim whitespaces.
        $cookies_to_remove = array_filter($cookies_to_remove); // Remove empty entries.

        // Process and sanitize the excluded cookies list.
        $excluded_cookies = explode("\n", $excluded_cookies); // Split on newlines.
        $excluded_cookies = array_map('trim', $excluded_cookies); // Trim whitespaces.
        $excluded_cookies = array_filter($excluded_cookies); // Remove empty entries.

        // Process and sanitize the third-party cookies to remove list.
        $third_party_cookies_to_remove = explode("\n", $third_party_cookies_to_remove); // Split on newlines.
        $third_party_cookies_to_remove = array_map('trim', $third_party_cookies_to_remove); // Trim whitespaces.
        $third_party_cookies_to_remove = array_filter($third_party_cookies_to_remove); // Remove empty entries.

        // Prepare new settings to be saved.
        $new_settings = [
            'gtm_id' => $gtm_id,
            'cookies_to_remove' => array_values($cookies_to_remove), // Reindex array for consistency.
            'excluded_cookies' => array_values($excluded_cookies), // Save excluded cookies.
            'third_party_cookies_to_remove' => array_values($third_party_cookies_to_remove), // Save third-party cookies.
            'privacy_policy_url' => $privacy_policy_url, // Add privacy policy URL
        ];

        // Update settings using the settings manager.
        if ($this->settings_manager->update_settings($new_settings)) {
            // Redirect to the setup wizard page with a success message.
            wp_redirect(admin_url('options-general.php?page=cookie-banner-setup&success=1'));
            exit;
        } else {
            // Display an error message if settings could not be saved.
            wp_die(__('Failed to save settings', 'cookie-banner'));
        }
    }
}
