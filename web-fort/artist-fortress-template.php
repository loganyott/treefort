<?php
/**
 * Template Name: Artist Fortress Template
 *
 * @package webfort
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
            <div class="container vert-pad">

	<!-- sub nav -->
		<?php
		if ( has_children() OR $post->post_parent > 0 ) { ?>
			<div>
				<ul class="nav nav-tabs">
				<li<?php if (is_page('ARTIST FORTRESS')) { echo " class=\"current_page_item\""; }?>><a href="<?php echo get_the_permalink(get_top_ancestor_id()); ?>"><?php echo get_the_title(get_top_ancestor_id()); ?></a></li>
					<?php
					$args = array(
						'child_of' => get_top_ancestor_id(),
						'title_li' => ''
					);
					?>
					<?php wp_list_pages($args); ?>
				</ul>
			</div>
		<?php } ?>
		<!-- end sub nav -->

			<div style="height:30px;"></div>

			<?php
			while ( have_posts() ) : the_post();

				get_template_part( 'template-parts/content', 'page' );

			endwhile; // End of the loop.
			?>
            </div>
		</main><!-- #main -->
	</div><!-- #primary -->
</div>

<?php

get_footer();
