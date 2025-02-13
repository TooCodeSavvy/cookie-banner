<?php
/**
 * Plugin Name: Cookie Banner Plugin
 * Description: A plugin to manage cookie banners and integrate Google Tag Manager for GDPR compliance.
 * Version: 1.5.2
 * Author: Anouar
 * License: GPL2
 */

namespace CookieBanner;

use CookieBanner\Includes\SettingsManager;
use CookieBanner\Includes\AjaxHandler;
use CookieBanner\Includes\AdminSetup;
use CookieBanner\Includes\FrontendManager;
use CookieBanner\Includes\PluginActivator;

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Load Composer Autoloader
$autoload_path = plugin_dir_path(__FILE__) . 'vendor/autoload.php';
if (!file_exists($autoload_path)) {
    wp_die('Autoloader is missing. Run `composer install` to generate the autoload file.');
}
require_once $autoload_path;

// Initialize SettingsManager
$settings_file = plugin_dir_path(__FILE__) . 'settings.json';
if (!file_exists($settings_file)) {
    wp_die('Settings file is missing. Please ensure "settings.json" exists in the plugin directory.');
}
$settings_manager = new SettingsManager($settings_file);

// Initialize Classes
$ajax_handler = new AjaxHandler($settings_manager);
$admin_setup = new AdminSetup($settings_manager);
$frontend_manager = new FrontendManager($settings_manager);
$plugin_activator = new PluginActivator($settings_manager);

$admin_setup->register_hooks();
$ajax_handler->register_hooks();
$frontend_manager->register_hooks();
$plugin_activator->register_hooks();

// Activation Hook
register_activation_hook(__FILE__, [$plugin_activator, 'activate']);