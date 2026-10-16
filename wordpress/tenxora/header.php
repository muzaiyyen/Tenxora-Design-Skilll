<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#005bbb">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header class="tx-header">
	<div class="tx-wrap tx-header__inner">
		<a class="tx-logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="Tenxora home">
			<img src="<?php echo esc_url( get_theme_file_uri( 'site/brand/logo-black.svg' ) ); ?>" alt="" width="150" height="19">
		</a>
		<button class="tx-menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="tx-nav"
			onclick="var n=document.getElementById('tx-nav');var o=n.classList.toggle('is-open');this.setAttribute('aria-expanded',o);this.setAttribute('aria-label',o?'Close menu':'Open menu');this.textContent=o?'✕':'☰';">&#9776;</button>
		<nav class="tx-nav" id="tx-nav" aria-label="Main">
			<?php
			$tenxora_links = tenxora_nav_links();
			foreach ( $tenxora_links as $tenxora_i => $tenxora_link ) {
				printf(
					'<a href="%s"%s>%s</a>',
					esc_url( $tenxora_link['href'] ),
					count( $tenxora_links ) - 1 === $tenxora_i ? ' class="tx-cta"' : '',
					esc_html( $tenxora_link['label'] )
				);
			}
			?>
		</nav>
	</div>
</header>
