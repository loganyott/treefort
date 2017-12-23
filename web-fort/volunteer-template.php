<?php
/**
 * Template Name: Volunteer Page Template
 *
 * @package webfort
 */

get_header(); ?>
	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
			<div class="vert-pad">
			<div class="visible-xs" style="height:30px;"></div>
				<div class="container vert-pad">
				<?php if ( have_posts() ) {  /* Query and display the parent. */
				while ( have_posts() ) {
				the_post();
					the_title( '<h1 class="entry-title center">', '</h1>' );
				the_content();
				$thispage=$post->ID;
				}
				} ?>
				</div>
			</div>
			<?php $childpages = query_posts('orderby=menu_order&order=asc&post_type=page&post_parent='.$thispage);
			if($childpages){ /* display the children content  */
	       	foreach ($childpages as $post) :
	        setup_postdata($post); ?>
			<div id="<?php global $post; echo $post->post_name; ?>" class="vert-pad">
				<div class="container">
	      	  <h2><?php the_title(); ?></h2>
			<?php the_content();?>
				</div>
			</div>
			<?php
	  		endforeach;
	 		} ?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php

get_footer();
