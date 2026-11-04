<?php
/**
 * Tenxora Home (child theme). The parent theme's functions.php loads first and still runs
 * everything it did before; this file only exists so WordPress treats the child as complete.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

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
