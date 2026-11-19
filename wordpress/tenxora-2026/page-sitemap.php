<?php
/**
 * Sitemap page (any WordPress page with the slug "sitemap"): serves the pre-built page from
 * /site/sitemap.html the same way page-our-team.php serves Our Team, with WordPress's head and
 * footer hooks. Every published post is printed into window.__TX_SITEMAP_POSTS so the Insights list
 * always matches the blog, with no rebuild when posts are added.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tenxora_file = get_theme_file_path( 'site/sitemap.html' );
if ( ! is_readable( $tenxora_file ) ) {
	wp_die( esc_html__( 'The Tenxora Sitemap bundle is missing from the theme.', 'tenxora' ) );
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

$tenxora_posts = array();
foreach ( get_posts(
	array(
		'post_type'        => 'post',
		'post_status'      => 'publish',
		'numberposts'      => -1,
		'orderby'          => 'date',
		'order'            => 'DESC',
		'suppress_filters' => false,
	)
) as $tenxora_post ) {
	$tenxora_posts[] = array(
		'title' => html_entity_decode( get_the_title( $tenxora_post ), ENT_QUOTES, 'UTF-8' ),
		'url'   => get_permalink( $tenxora_post ),
		'date'  => get_the_date( 'F j, Y', $tenxora_post ),
	);
}

ob_start();
wp_head();
if ( is_admin_bar_showing() ) {
	echo '<style>.header{top:32px}@media (max-width:782px){.header{top:46px}}</style>';
}
echo '<script>window.__TX_SITEMAP_POSTS=' . wp_json_encode( $tenxora_posts, JSON_HEX_TAG | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . ';</script>';
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
