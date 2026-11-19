<?php
/**
 * Why Tenxora (the WordPress page with the slug "why-tenxora"): serves the pre-built page from
 * /site/why-tenxora.html the same way page-our-team.php serves Our Team. WordPress's own head and
 * footer hooks are spliced in, so the title, description, canonical, schema and tracking from the
 * SEO layer stay exactly as they are.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tenxora_file = get_theme_file_path( 'site/why-tenxora.html' );
if ( ! is_readable( $tenxora_file ) ) {
	wp_die( esc_html__( 'The Tenxora Why Tenxora bundle is missing from the theme.', 'tenxora' ) );
}
$tenxora_html = file_get_contents( $tenxora_file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
$tenxora_html = preg_replace( '#<title>.*?</title>#s', '', $tenxora_html, 1 );
$tenxora_html = preg_replace( '#<link rel="icon"[^>]*>#', '', $tenxora_html );

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
