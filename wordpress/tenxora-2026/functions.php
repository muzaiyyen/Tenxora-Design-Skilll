<?php
/**
 * Tenxora theme.
 *
 * The home page is the pre-built site bundle in /site (see front-page.php).
 * Every other page uses the simple templates in this folder.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'after_setup_theme',
	function () {
		add_theme_support( 'title-tag' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
	}
);

/** The menu links, kept the same as the home page header. */
function tenxora_nav_links() {
	return array(
		array( 'label' => 'Odoo Services', 'href' => 'https://tenxora.services/odoo-services/' ),
		array( 'label' => 'Blog', 'href' => 'https://tenxora.services/blog/' ),
		array( 'label' => 'Our Team', 'href' => home_url( '/our-team/' ) ),
		array( 'label' => 'Why Tenxora', 'href' => 'https://tenxora.services/why-tenxora/' ),
		array( 'label' => 'Contact Us', 'href' => 'https://tenxora.services/contactus/' ),
	);
}

add_action(
	'wp_enqueue_scripts',
	function () {
		if ( is_front_page() || is_page( 'our-team' ) ) {
			// The home page bundle carries its own styles; WordPress's block styles would only add weight.
			wp_dequeue_style( 'wp-block-library' );
			wp_dequeue_style( 'wp-block-library-theme' );
			wp_dequeue_style( 'global-styles' );
			wp_dequeue_style( 'classic-theme-styles' );
			return;
		}
		wp_enqueue_style( 'tenxora-font', 'https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght,ROND@6..144,100..1000,0..100&display=swap', array(), null );
		wp_enqueue_style( 'tenxora', get_stylesheet_uri(), array(), wp_get_theme()->get( 'Version' ) );
	},
	20
);

// The emoji script is not needed anywhere on the site.
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );

/**
 * Our Team: the page is served by page-our-team.php, which WordPress only picks for a page with the
 * slug "our-team". Create that page when the theme is switched on, and serve the team page for
 * /our-team/ even if the page was deleted or permalinks are stale.
 */
function tenxora_ensure_team_page() {
	$page = get_page_by_path( 'our-team' );
	if ( $page && 'publish' === $page->post_status ) {
		return;
	}
	if ( $page ) {
		wp_update_post( array( 'ID' => $page->ID, 'post_status' => 'publish' ) );
		return;
	}
	wp_insert_post(
		array(
			'post_type'   => 'page',
			'post_title'  => 'Our Team',
			'post_name'   => 'our-team',
			'post_status' => 'publish',
		)
	);
}
add_action( 'after_switch_theme', 'tenxora_ensure_team_page' );
add_action(
	'admin_init',
	function () {
		if ( ! get_option( 'tenxora_team_page_checked' ) ) {
			tenxora_ensure_team_page();
			update_option( 'tenxora_team_page_checked', 1 );
		}
	}
);

add_filter(
	'template_include',
	function ( $template ) {
		$path = trim( (string) wp_parse_url( isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '', PHP_URL_PATH ), '/' ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$home = trim( (string) wp_parse_url( home_url( '/' ), PHP_URL_PATH ), '/' );
		if ( '' !== $home && 0 === strpos( $path, $home . '/' ) ) {
			$path = substr( $path, strlen( $home ) + 1 );
		}
		if ( 'our-team' === $path && ! is_page( 'our-team' ) ) {
			$team = locate_template( 'page-our-team.php' );
			if ( $team ) {
				status_header( 200 );
				global $wp_query;
				$wp_query->is_404 = false;
				return $team;
			}
		}
		return $template;
	},
	99
);

/**
 * Favicon on every page (home, Our Team, blog, posts, other pages). A Site Icon set under
 * Appearance > Customize takes over if there is one.
 */
add_action(
	'wp_head',
	function () {
		if ( has_site_icon() ) {
			return;
		}
		printf( '<link rel="icon" href="%s" type="image/svg+xml">' . "\n", esc_url( get_theme_file_uri( 'favicon.svg' ) ) );
		printf( '<link rel="icon" href="%s" sizes="32x32" type="image/png">' . "\n", esc_url( get_theme_file_uri( 'favicon-32.png' ) ) );
		printf( '<link rel="icon" href="%s" sizes="192x192" type="image/png">' . "\n", esc_url( get_theme_file_uri( 'favicon-192.png' ) ) );
		printf( '<link rel="apple-touch-icon" href="%s">' . "\n", esc_url( get_theme_file_uri( 'apple-touch-icon.png' ) ) );
	},
	2
);
