<?php
namespace CookieBanner\Includes;

/**
 * Handles the frontend logic for managing and displaying the cookie banner.
 * This includes enqueuing necessary CSS and JavaScript files, injecting plugin settings
 * into the frontend JavaScript, and managing the script initialization.
 *
 * @author      Anouar
 */
class FrontendManager
{
    /**
     * @var SettingsManager Manages the settings for the cookie banner.
     */
    private SettingsManager $settings_manager;

    /**
     * FrontendManager constructor.
     *
     * @param SettingsManager $settings_manager The instance of SettingsManager used for managing settings.
     */
    public function __construct(SettingsManager $settings_manager)
    {
        $this->settings_manager = $settings_manager;
    }

    /**
     * Register hooks for enqueuing assets and injecting settings into the frontend.
     */
    public function register_hooks()
    {
        // Hook to enqueue styles and scripts for the frontend.
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets']);

        // Hook to inject settings into the frontend on wp_head.
        add_action('wp_head', [$this, 'inject_settings']);
    }

    /**
     * Enqueue necessary CSS and JavaScript assets for the frontend.
     *
     * This method enqueues the plugin's main stylesheet, the js-cookie library,
     * and the plugin's main JavaScript file. It also passes the settings to the JS.
     */
    public function enqueue_assets()
    {
        $plugin_url = plugin_dir_url(dirname(__FILE__));

        // Enqueue FontAwesome for cookie icon
        wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css', [], '6.7.2', 'all');

        // Enqueue the CSS for the cookie banner styling.
        wp_enqueue_style('cb-style', $plugin_url . 'assets/css/style.css', [], '1.5', 'all');

        // Enqueue the js-cookie library, which is used to handle cookies on the frontend.
        wp_enqueue_script('js-cookie', 'https://cdnjs.cloudflare.com/ajax/libs/js-cookie/3.0.1/js.cookie.min.js', [], '3.0.1', true);

        // Enqueue the main JavaScript file responsible for cookie banner behavior.
        wp_enqueue_script_module('cb-script', $plugin_url . 'assets/js/main.js', [], '1.5', true);

        // Localize script to pass plugin settings to JavaScript.
        wp_localize_script('cb-script', 'cookieBannerSettings', $this->settings_manager->get_settings());
    }

    /**
     * Inject settings into the frontend as a JavaScript object.
     *
     * This method outputs a script tag that contains the plugin settings as a global
     * JavaScript object, which can be accessed by the frontend JavaScript code.
     */
    public function inject_settings()
    {
        // Get the plugin settings from the SettingsManager.
        $settings = $this->settings_manager->get_settings();

        // Echo a script that defines `cookieBannerSettings` on the frontend.
        echo "<script type='text/javascript'>
            window.cookieBannerSettings = " . json_encode(
                [
                    'gtm_id' => $settings['gtm_id'] ?? '',
                    'cookies_to_remove' => $settings['cookies_to_remove'] ?? [],
                    'third_party_cookies_to_remove' => $settings['third_party_cookies_to_remove'] ?? [],
                    'privacy_policy_url' => $settings['privacy_policy_url'] ?? '',
                ],
                JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT // Escape special characters in JSON.
            ) . ";
        </script>";
    }
}
