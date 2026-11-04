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
