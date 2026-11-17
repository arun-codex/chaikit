# WordPress Integration Guide

ChaiKit can be added to WordPress websites that allow custom HTML or script embeds.

---

## 1. Using Custom HTML Block (Gutenberg)

If your user account has administrator or editor privileges allowing custom HTML:

1. Open the post, page, or site footer in the WordPress Block Editor.
2. Add a **Custom HTML** block.
3. Paste the ChaiKit embed snippet:

```html
<!-- Load ChaiKit -->
<script defer src="https://cdn.jsdelivr.net/npm/chaikit@1.0.0/dist/chaikit.iife.js"></script>

<!-- Add ChaiKit Element -->
<chai-support
  creator-name="Your Name"
  upi-id="yourname@bank"
  theme="auto"
  position="bottom-right"
></chai-support>
```
4. Save or Publish the page.

---

## 2. Using `wp_footer` in `functions.php` (Theme / Child Theme)

To make the floating button appear globally across every page on your WordPress site:

Add this snippet to your theme's `functions.php`:

```php
function enqueue_chaikit_widget() {
    ?>
    <script defer src="https://cdn.jsdelivr.net/npm/chaikit@1.0.0/dist/chaikit.iife.js"></script>
    <chai-support
        creator-name="<?php echo esc_attr(get_bloginfo('name')); ?>"
        upi-id="yourname@bank"
        theme="auto"
        position="bottom-right">
    </chai-support>
    <?php
}
add_action('wp_footer', 'enqueue_chaikit_widget');
```

---

## 3. Important WordPress Considerations & Sanitizers

- **WordPress.com (Free / Personal):** Free WordPress.com accounts restrict custom JavaScript embeds for security. ChaiKit requires a business/creator plan or a self-hosted WordPress.org installation.
- **Security & Minification Plugins:** Plugins such as Autoptimize or Cloudflare Rocket Loader may defer or merge scripts. Ensure `chaikit.iife.js` is not blocked by script minifiers.
- **Theme z-index:** If your WordPress theme features sticky navigation bars with an unusually high z-index, ChaiKit's floating launcher defaults to `z-index: 2147483640` to ensure it floats above standard theme elements.
