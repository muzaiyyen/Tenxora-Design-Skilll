<?php
/**
 * Single posts and pages.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>
<main class="tx-main">
	<div class="tx-wrap">
		<?php
		while ( have_posts() ) :
			the_post();
			?>
			<article <?php post_class( 'tx-content' ); ?>>
				<h1><?php the_title(); ?></h1>
				<?php if ( is_single() ) : ?>
					<div class="tx-meta"><?php echo esc_html( get_the_date() ); ?></div>
				<?php endif; ?>
				<?php the_content(); ?>
			</article>
		<?php endwhile; ?>
	</div>
</main>
<?php
get_footer();
