# Tenxora WordPress theme

The home page is the same page as the Next.js site (phone and desktop layouts, all animations),
pre-built into `site/`. Blog posts and any other WordPress pages use the simple on-brand templates
(`index.php`, `singular.php`).

## Install

1. In WordPress go to **Appearance → Themes → Add New → Upload Theme** and upload `tenxora-theme.zip`, then **Activate**.
2. Under **Pages**, create an empty page called **Home** and one called **Blog**.
3. Under **Settings → Reading**, choose **A static page**, set Homepage to **Home** and Posts page to **Blog**.
4. Under **Settings → General**, set the Site Title (it is used in the browser tab).

The home page text is built into the theme, so it is changed in the site code (`lib/content.ts`),
not in the WordPress editor. SEO, analytics and cookie plugins still load on it.

## Rebuild after changing the site

    scripts/build-wp-theme.sh

This writes `dist/tenxora-theme.zip`. The build assumes WordPress is at the domain root
(theme served from `/wp-content/themes/tenxora`). If WordPress is in a subfolder, set
`WP_THEME_URL_PATH`, for example `WP_THEME_URL_PATH=/site/wp-content/themes/tenxora`.
Keep the theme folder named `tenxora`.
