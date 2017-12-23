<?php
/**
 * Template Name: BOOYEAH Template
 *
 * @package webfort
 */

get_header(); ?>
	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
			<?php
			while ( have_posts() ) : the_post();?>
			<div style="background:#fcd738;">
				<div class="center" style="width:300px;">
					<div class="entry-header">
						<img src='<?php bloginfo('template_directory'); ?>/assets/images/WristbandJump.gif' class="img-responsive center" />
						<?php the_title( '<h1 class="entry-title center">', '</h1>' ); ?>
					</div><!-- .entry-header -->
				</div>
			</div>
            <div class="container vert-pad">
			<div class="visible-xs" style="height:30px;"></div>
				<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
					

					<div class="entry-content">
						<?php
							the_content();

							wp_link_pages( array(
								'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'webfort' ),
								'after'  => '</div>',
							) );
						?>
					</div><!-- .entry-content -->

					<footer class="entry-footer">
						<?php
							edit_post_link(
								sprintf(
									/* translators: %s: Name of current post */
									esc_html__( 'Edit %s', 'webfort' ),
									the_title( '<span class="screen-reader-text">"', '"</span>', false )
								),
								'<span class="edit-link">',
								'</span>'
							);
						?>
					</footer><!-- .entry-footer -->
				</article><!-- #post-## -->

			<?php endwhile; // End of the loop.
			?>
            </div>
		</main><!-- #main -->
	</div><!-- #primary -->
</div>
<?php

get_footer();
