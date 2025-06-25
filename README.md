# Cookie Banner Plugin

Contributors: Anouar  
Tags: cookies, GDPR, Google Tag Manager, privacy  
Requires PHP: 8.0  
Stable tag: 1.5.2, 
License: GPLv2 or later  
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A simple WordPress plugin to manage cookie banners and integrate Google Tag Manager (GTM) for compliance with GDPR.

## Features

- Integrates Google Tag Manager (GTM).
- Customizable company name and GTM container ID via the WordPress admin dashboard.
- Easy-to-use interface for WordPress administrators.
- Multilingual support (Dutch and English).
- Basic styling options for the cookie banner.

## Installation

1. Download the plugin as a `.zip` file.
2. Go to your WordPress admin dashboard.
3. Navigate to Plugins → Add New → Upload Plugin.
4. Select the `.zip` file and click Install Now.
5. Activate the plugin via the Plugins menu in WordPress.

## Usage

1. Go to Cookie Banner in your WordPress admin dashboard.
2. Configure the required settings:
    - GTM Container ID: Add your Google Tag Manager container ID.
    - Excluded Cookies: These are pre-configured by default (e.g., name_cookies) and don't need to be modified unless you wish to add or remove cookies.
    - Third-Party Cookies to Remove: Default third-party cookies are already configured. You only need to update this if you want to add additional cookies to be removed.
3. Save the changes.

The GTM script will be automatically included in the site's <head>, and the dynamic cookie management system will be active based on your configuration.

## Multilingual Support

The plugin supports the following languages:
- Dutch (nl)
- English (en)

## Changelog

### 1.5.2
- Added a sticky icon to allow users to change their consent after clicking "Agree" or "Disagree".
- Grouped the "Scan Cookies" button with the relevant textarea for better UX.
- Enhanced button styling for clearer action hierarchy.

### 1.5.1
- Dynamically added the privacy policy URL to the cookie banner.
- Updated the setup wizard page UI to a cleaner and more modern design.

### 1.5
- Enhanced the cookie consent banner to dynamically handle the website logo:
  - Checks for the presence of a logo using .custom-logo.
  - Uses the detected logo's src for the banner image if available.
  - Applies size constraints (max 40px for both width and height) to ensure consistent styling regardless of image dimensions or type.

### 1.4
- Separated the code logic for better maintainability and readability.
- Added dynamic cookie removal functionality, allowing users to scan and update cookies in real-time.
- Improved code structure for easier future updates and better separation of concerns.
- Added new values to the settings.json file:
   - `third_party_cookies_to_remove` for handling third-party cookies.
   - `excluded_cookies` to ensure essential cookies (e.g., v_cookies) are always skipped during removal.
- Introduced handling for third-party cookies not detected by the site scan button through `third_party_cookies_to_remove`.
- Integrated Composer for using namespaces, and added checks for the existence of settings.json and autoload.php.
- Enhanced the `scan_cookies` method to include third-party cookies and excluded cookies.
- Added nonce verification for saving settings to settings.json for security.
- Added simple styling for the setup wizard page.
- Enhanced the setup wizard dashboard to display and allow editing of `excluded_cookies` and `third_party_cookies_to_remove`.
- Updated the `clearNonConsentCookies` method and integrated it into multiple places to ensure cookies and storage data are consistently removed when no consent is provided.

### 1.3
- Refactored GoogleAnalyticsService to follow updated consent handling standard.
- Resolved issue in Tag Assistant where multiple events were triggered and the Event Consent State was not visible in Tag Manager.
- Added $ = jQuery; to Banner.js constructor to ensure jQuery is accessible within the class.
- Replaced $ with jQuery throughout the codebase for consistency.
- Updated TranslationService to use jQuery('html').attr('lang') || 'en'; instead of $.

### 1.2
- Ensured CookieManager has proper access to the Cookies variable for improved cookie management operations.
- Updated the Banner class to accept an onConsentChange callback parameter, enhancing flexibility and separation of concerns.
- Refactored consent management to align with updated logic.

### 1.1
- Moved the setup wizard under the 'Options' tab instead of the parent menu.
- Refactored code to separate logic and responsibilities for better maintainability.
- Added extra checks when reading the `settings.json` file to ensure proper handling of settings.
- Removed unused values from the `settings.json` file.
- Improved overall error handling and code structure.

### 1.0
- Initial release
- Basic cookie banner functionality
- Google Tag Manager integration
- Multilingual support

## License

This plugin is licensed under the GPLv2 or later. See https://www.gnu.org/licenses/gpl-2.0.html for details.
