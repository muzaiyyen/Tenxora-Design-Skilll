<?php
/**
 * Our Team page (any WordPress page with the slug "our-team"): serves the pre-built page from
 * /site/our-team.html, the same way front-page.php serves the home page, with WordPress's head
 * and footer hooks so plugins still work.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tenxora_file = get_theme_file_path( 'site/our-team.html' );
if ( ! is_readable( $tenxora_file ) ) {
	wp_die( esc_html__( 'The Tenxora Our Team bundle is missing from the theme. Rebuild the theme zip.', 'tenxora' ) );
}
$tenxora_html = file_get_contents( $tenxora_file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
$tenxora_html = preg_replace( '#<title>.*?</title>#s', '', $tenxora_html, 1 );

// the bundle carries its own styles, so leave out the theme and block styles here
add_action(
	'wp_enqueue_scripts',
	function () {
		foreach ( array( 'tenxora', 'tenxora-font', 'wp-block-library', 'wp-block-library-theme', 'global-styles', 'classic-theme-styles' ) as $tenxora_handle ) {
			wp_dequeue_style( $tenxora_handle );
		}
	},
	99
);

ob_start();
wp_head();
if ( is_admin_bar_showing() ) {
	echo '<style>.header{top:32px}@media (max-width:782px){.header{top:46px}}</style>';
}
$tenxora_head = ob_get_clean();

ob_start();
wp_footer();
$tenxora_foot = ob_get_clean();

$tenxora_at = strpos( $tenxora_html, '</head>' );
if ( false !== $tenxora_at ) {
	$tenxora_html = substr_replace( $tenxora_html, $tenxora_head, $tenxora_at, 0 );
}
$tenxora_at = strrpos( $tenxora_html, '</body>' );
if ( false !== $tenxora_at ) {
	$tenxora_html = substr_replace( $tenxora_html, $tenxora_foot, $tenxora_at, 0 );
}

echo $tenxora_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- trusted theme file
