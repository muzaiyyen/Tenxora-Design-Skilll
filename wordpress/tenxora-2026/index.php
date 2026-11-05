<?php
/**
 * Blog index, archives and anything without a more specific template.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>
<main class="tx-main">
	<div class="tx-wrap">
		<h1>
			<?php
			if ( is_home() ) {
				echo esc_html( get_the_title( (int) get_option( 'page_for_posts' ) ) ? get_the_title( (int) get_option( 'page_for_posts' ) ) : __( 'Blog', 'tenxora' ) );
			} elseif ( is_search() ) {
				/* translators: %s: search query */
				printf( esc_html__( 'Results for "%s"', 'tenxora' ), esc_html( get_search_query() ) );
			} else {
				the_archive_title();
			}
			?>
		</h1>
		<?php if ( have_posts() ) : ?>
			<div class="tx-posts">
				<?php
				while ( have_posts() ) :
					the_post();
					?>
					<a class="tx-card" href="<?php the_permalink(); ?>">
						<h2><?php the_title(); ?></h2>
						<p><?php echo esc_html( wp_trim_words( get_the_excerpt(), 26 ) ); ?></p>
					</a>
				<?php endwhile; ?>
			</div>
			<div class="tx-pager">
				<span><?php previous_posts_link( __( '&larr; Newer', 'tenxora' ) ); ?></span>
				<span><?php next_posts_link( __( 'Older &rarr;', 'tenxora' ) ); ?></span>
			</div>
		<?php else : ?>
			<p><?php esc_html_e( 'Nothing here yet.', 'tenxora' ); ?></p>
		<?php endif; ?>
	</div>
</main>
<?php
get_footer();
