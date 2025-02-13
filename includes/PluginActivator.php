<?php
namespace CookieBanner\Includes;

/**
 * Handles the activation logic for the Cookie Banner plugin.
 * Specifically, this class manages the behavior when the plugin is activated, including:
 * - Checking if essential settings (such as `gtm_id`) are configured.
 * - Redirecting the user to the setup wizard if necessary.
 *
 * @author      Anouar
 */
class PluginActivator
{
    /**
     * @var SettingsManager Instance of the SettingsManager class used to manage plugin settings.
     */
    private SettingsManager $settings_manager;

    /**
     * PluginActivator constructor.
     *
     * @param SettingsManager $settings_manager The instance of SettingsManager used to manage settings.
     */
    public function __construct(SettingsManager $settings_manager)
    {
        $this->settings_manager = $settings_manager;
    }

    /**
     * Register necessary hooks for the plugin.
     *
     * This method registers the hook to redirect the user to the setup wizard after plugin activation.
     */
    public function register_hooks()
    {
        add_action('admin_init', [$this, 'redirect_to_setup_wizard']);
    }

    /**
     * Run when the plugin is activated.
     *
     * This method checks if the `gtm_id` setting is empty. If it is, it sets a transient to
     * display the setup wizard to the user.
     */
    public function activate()
    {
        // Retrieve plugin settings.
        $settings = $this->settings_manager->get_settings();

        // If no GTM ID is set, show the setup wizard after activation.
        if (empty($settings['gtm_id'])) {
            set_transient('cb_show_setup_wizard', true, 60); // Store the transient for 60 seconds.
        }
    }

    /**
     * Redirect the user to the setup wizard if the transient is set.
     *
     * This method checks if the `cb_show_setup_wizard` transient exists. If it does, the user
     * is redirected to the setup wizard page. The transient is then deleted to avoid future redirects.
     */
    public function redirect_to_setup_wizard()
    {
        // Check if the transient indicating that the setup wizard should be shown exists.
        if (get_transient('cb_show_setup_wizard')) {
            delete_transient('cb_show_setup_wizard'); // Delete the transient after redirecting.
            wp_redirect(admin_url('admin.php?page=cookie-banner-setup')); // Redirect to the setup wizard page.
            exit; // Ensure no further code execution.
        }
    }
}
