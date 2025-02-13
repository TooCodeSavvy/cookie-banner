<?php
/**
 * Render the setup wizard page.
 *
 * @author      Anouar
 */
if (!current_user_can('manage_options')) {
    wp_die(__('You do not have sufficient permissions to access this page.'));
}
?>

<script src="https://cdn.tailwindcss.com"></script>
<style>
    #wpbody-content {
        padding-top: 20px;
    }
</style>

<div class="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
    <h1 class="text-2xl font-bold mb-6">Cookie Banner Setup Wizard</h1>

    <form method="POST" action="<?php echo admin_url('admin-post.php'); ?>">
        <?php wp_nonce_field('cb_save_settings_action', 'cb_nonce'); ?>
        <input type="hidden" name="action" value="cb_save_settings">

        <label class="block font-semibold mb-1" for="cb_gtm_id">Google Tag Manager ID:</label>
        <input type="text" name="cb_gtm_id" value="<?php echo esc_attr($settings['gtm_id']); ?>" required class="w-full p-2 border rounded mb-4">

        <label class="block font-semibold mb-1" for="privacy_policy_url">Privacy Policy URL:</label>
        <input type="url" id="privacy_policy_url" name="privacy_policy_url" value="<?php echo esc_url($settings['privacy_policy_url'] ?? ''); ?>" class="w-full p-2 border rounded mb-4">

        <label class="block font-semibold mb-1" for="excluded_cookies">Excluded Cookies:</label>
        <textarea id="excluded_cookies" name="excluded_cookies" rows="5" placeholder="Enter excluded cookies, one per line" class="w-full p-2 border rounded mb-4"><?php
            $excluded_cookies = $settings['excluded_cookies'] ?? [];
            echo esc_textarea(is_array($excluded_cookies) ? implode("\n", $excluded_cookies) : '');
            ?></textarea>

        <label class="block font-semibold mb-1" for="third_party_cookies_to_remove">Third Party Cookies to Remove:</label>
        <textarea id="third_party_cookies_to_remove" name="third_party_cookies_to_remove" rows="5" placeholder="Enter third party cookies, one per line" class="w-full p-2 border rounded mb-4"><?php
            $third_party_cookies_to_remove = $settings['third_party_cookies_to_remove'] ?? [];
            echo esc_textarea(is_array($third_party_cookies_to_remove) ? implode("\n", $third_party_cookies_to_remove) : '');
            ?></textarea>

        <!-- Flex container for label and scan button -->
        <div class="flex items-center justify-between mb-2">
            <label class="font-semibold" for="cookies_to_remove">Cookies to Remove:</label>
            <button type="button" id="scan-cookies-button" class="bg-gray-500 text-white px-4 py-2 text-sm rounded hover:bg-gray-600 transition">
                Scan Cookies
            </button>
        </div>
        <textarea id="cookies_to_remove" name="cookies_to_remove" rows="5" placeholder="Enter cookies, one per line" class="w-full p-2 border rounded mb-6"><?php
            $cookies_to_remove = $settings['cookies_to_remove'] ?? [];
            echo esc_textarea(is_array($cookies_to_remove) ? implode("\n", $cookies_to_remove) : '');
            ?></textarea>

        <!-- Save Settings button as a clear form-wide action -->
        <input type="submit" value="Save Settings" class="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer transition">
    </form>
</div>


<script>
    /**
     * Handles the "Scan Cookies" button click event using jQuery.
     * Sends an AJAX request to the WordPress admin-ajax endpoint to scan cookies,
     * and updates the textarea with the detected cookies.
     */
    jQuery(document).ready(function ($) {
        $('#scan-cookies-button').on('click', function () {
            $.ajax({
                url: '<?php echo admin_url('admin-ajax.php?action=scan_cookies'); ?>',
                method: 'POST',
                dataType: 'json',
                success: function (response) {
                    if (response.success) {
                        // Convert the cookies to an array
                        const scannedCookies = Object.values(response.data.cookies);

                        // Append scanned cookies to the textarea
                        const currentCookies = $('#cookies_to_remove').val().split("\n").filter(c => c.trim() !== '');
                        const newCookies = scannedCookies.filter(c => !currentCookies.includes(c));
                        $('#cookies_to_remove').val([...currentCookies, ...newCookies].join("\n"));
                    } else {
                        console.error('Error scanning cookies:', response.data.message || 'Unknown error.');
                        alert('Failed to scan cookies. Check console for details.');
                    }
                },
                error: function (xhr, status, error) {
                    console.error('AJAX error:', error);
                    alert('Unexpected error. Try again.');
                }
            });
        });
    });
</script>
