<?php
/**
 * Home page: serves the pre-built Tenxora page from /site/index.html and adds WordPress's
 * head and footer hooks so plugins (SEO, analytics, cookie tools) still work.
 *
 * The bundle's files are built for /wp-content/themes/tenxora/. If WordPress lives somewhere
 * else, rebuild with scripts/build-wp-theme.sh and the matching WP_THEME_URL_PATH.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tenxora_file = get_theme_file_path( 'site/index.html' );
if ( ! is_readable( $tenxora_file ) ) {
	wp_die( esc_html__( 'The Tenxora home page bundle is missing from the theme. Rebuild the theme zip.', 'tenxora' ) );
}
$tenxora_html = file_get_contents( $tenxora_file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents

// WordPress prints the <title> (title-tag support), so drop the bundle's own.
$tenxora_html = preg_replace( '#<title>.*?</title>#s', '', $tenxora_html, 1 );

ob_start();
wp_head();
if ( is_admin_bar_showing() ) {
	echo '<style>.header{top:32px}@media (max-width:782px){.header{top:46px}}</style>';
}
$tenxora_head = ob_get_clean();

ob_start();
wp_footer();
$tenxora_foot = ob_get_clean();

// plain string splicing, so nothing printed by plugins is read as a regex replacement
$tenxora_at = strpos( $tenxora_html, '</head>' );
if ( false !== $tenxora_at ) {
	$tenxora_html = substr_replace( $tenxora_html, $tenxora_head, $tenxora_at, 0 );
}
$tenxora_at = strrpos( $tenxora_html, '</body>' );
if ( false !== $tenxora_at ) {
	$tenxora_html = substr_replace( $tenxora_html, $tenxora_foot, $tenxora_at, 0 );
}

echo $tenxora_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- trusted theme file
