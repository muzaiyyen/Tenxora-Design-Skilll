<?php
/**
 * Template Name: Tenxora 2026 design
 * Template Post Type: page, post
 *
 * Serves the redesigned page for the current URL from /site/ (built by the Next.js app), the same way
 * page-why-tenxora.php serves Why Tenxora. It is opt-in: nothing changes until this template is picked
 * in the page's (or post's) Template setting, and switching back to the default template undoes it.
 *
 * - The SEO layer is untouched: wp_head() and wp_footer() are spliced in, the built <title> and icon
 *   are removed, so title, description, canonical, Open Graph, schema, analytics and the cookie
 *   consent tool come from WordPress exactly as on the live page.
 * - Working integrations are kept: the built page has empty slots (data-tx-slot="...") where the
 *   forms and the booking calendar go. This template fills them with the live page's own markup:
 *     contact-form      [tenxora_contact] shortcode, else the first form in the page content
 *     engagement        first form in the page content (Partners hiring enquiry)
 *     checkout          first form in the page content (plan choice, terms checkbox, Stripe handoff)
 *     booking-calendar  the Calendly embed in the page content, else the same Calendly iframe as live
 *   Developers can override a slot with the 'tenxora_design_slot' filter ($html, $slot, $post).
 * - If a form slot cannot be filled, the page is NOT redesigned: the theme's normal template renders
 *   instead, so a form is never lost.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Built page for each live URL path (relative to the home URL, no slashes at the ends).
 */
if ( ! function_exists( 'tenxora_design_map' ) ) :
function tenxora_design_map() {
	$map = array(
		'why-tenxora'      => 'why-tenxora.html',
		'odoo-services'    => 'odoo-services.html',
		'contactus'        => 'contactus.html',
		'book-a-call'      => 'book-a-call.html',
		'privacy'          => 'privacy.html',
		'cookie-policy'    => 'cookie-policy.html',
		'partners'         => 'partners.html',
		'partners/pricing' => 'partners/pricing.html',
		'partners/terms'   => 'partners/terms.html',
		'2026/11/10/odoo-implementation-team-time' => 'blog/odoo-implementation-team-time.html',
	);
	foreach ( array( 'implementation', 'ai-assisted-implementation', 'consulting', 'integration', 'migration', 'customization', 'implementation-cost' ) as $tenxora_slug ) {
		$map[ 'odoo-services/' . $tenxora_slug ] = 'odoo-services/' . $tenxora_slug . '.html';
	}
	return $map;
}
endif;

/**
 * Elements matching an XPath query in an HTML fragment, as HTML strings.
 */
if ( ! function_exists( 'tenxora_design_pick' ) ) :
function tenxora_design_pick( $html, $query, $first = true ) {
	if ( '' === trim( (string) $html ) || ! class_exists( 'DOMDocument' ) ) {
		return '';
	}
	$doc  = new DOMDocument();
	$prev = libxml_use_internal_errors( true );
	$doc->loadHTML( '<?xml encoding="utf-8"?><div id="tx-root">' . $html . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
	libxml_clear_errors();
	libxml_use_internal_errors( $prev );
	$nodes = ( new DOMXPath( $doc ) )->query( $query );
	$out   = '';
	if ( $nodes ) {
		foreach ( $nodes as $node ) {
			$out .= $doc->saveHTML( $node );
			if ( $first ) {
				break;
			}
		}
	}
	return $out;
}
endif;

$tenxora_map = tenxora_design_map();
$tenxora_key = trim( (string) wp_parse_url( get_permalink(), PHP_URL_PATH ), '/' );
$tenxora_home = trim( (string) wp_parse_url( home_url( '/' ), PHP_URL_PATH ), '/' );
if ( '' !== $tenxora_home && 0 === strpos( $tenxora_key, $tenxora_home . '/' ) ) {
	$tenxora_key = substr( $tenxora_key, strlen( $tenxora_home ) + 1 );
}
$tenxora_file = isset( $tenxora_map[ $tenxora_key ] ) ? get_theme_file_path( 'site/' . $tenxora_map[ $tenxora_key ] ) : '';

$tenxora_fallback = function () {
	$tenxora_default = locate_template( array( 'singular.php', 'page.php', 'index.php' ) );
	if ( $tenxora_default ) {
		include $tenxora_default;
	}
	exit;
};

if ( ! $tenxora_file || ! is_readable( $tenxora_file ) ) {
	$tenxora_fallback();
}

if ( have_posts() ) {
	the_post();
}
$tenxora_post    = get_post();
$tenxora_content = $tenxora_post ? apply_filters( 'the_content', $tenxora_post->post_content ) : ''; // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- core filter
$tenxora_html    = file_get_contents( $tenxora_file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents

// Fill the slots before wp_head() runs, so scripts the forms enqueue are printed with the page.
$tenxora_scripts = tenxora_design_pick( $tenxora_content, '//script', false );
preg_match_all( '#<div[^>]*data-tx-slot="([a-z-]+)"[^>]*></div>#', $tenxora_html, $tenxora_slots, PREG_SET_ORDER );
foreach ( $tenxora_slots as $tenxora_slot ) {
	$tenxora_name = $tenxora_slot[1];
	$tenxora_fill = '';
	if ( 'contact-form' === $tenxora_name && shortcode_exists( 'tenxora_contact' ) ) {
		$tenxora_fill = do_shortcode( '[tenxora_contact]' );
	}
	if ( 'booking-calendar' === $tenxora_name ) {
		$tenxora_fill = tenxora_design_pick( $tenxora_content, '//*[contains(@class,"calendly-inline-widget")] | //iframe[contains(@src,"calendly.com")]' );
		if ( '' === $tenxora_fill ) {
			$tenxora_fill = '<iframe src="https://calendly.com/contact-tenxora/odoo-introduction?hide_gdpr_banner=1" title="Book your Odoo introduction with Tenxora" loading="lazy"></iframe>';
		}
	}
	if ( '' === $tenxora_fill ) {
		$tenxora_fill = tenxora_design_pick( $tenxora_content, '//form' );
	}
	$tenxora_fill = apply_filters( 'tenxora_design_slot', $tenxora_fill, $tenxora_name, $tenxora_post );
	if ( '' === trim( (string) $tenxora_fill ) ) {
		$tenxora_fallback(); // A form we cannot place: keep the live page as it is.
	}
	if ( 'booking-calendar' !== $tenxora_name ) {
		$tenxora_fill .= $tenxora_scripts;
	}
	$tenxora_open = substr( $tenxora_slot[0], 0, -6 );
	$tenxora_html = str_replace( $tenxora_slot[0], $tenxora_open . $tenxora_fill . '</div>', $tenxora_html );
}

$tenxora_html = preg_replace( '#<title>.*?</title>#s', '', $tenxora_html, 1 );
$tenxora_html = preg_replace( '#<link rel="icon"[^>]*>#', '', $tenxora_html );
$tenxora_html = preg_replace( '#<meta name="description"[^>]*>#', '', $tenxora_html ); // The SEO layer prints the description.

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

echo $tenxora_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- trusted theme file plus the page's own rendered content
