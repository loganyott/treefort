<?php
/**
 * Template Name: About Main Template
 *
 * @package webfort
 */

get_header(); ?>
<!--
	<div class="navbar navbar-default about-menu submenu hidden-xs" role="navigation">
 	       <?php// wp_nav_menu( array( 'theme_location' => 'about', 'menu_class' => 'menu dropdown-menu' ) ); ?>
	</div>
-->
	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
			<div class="visible-xs" style="height:30px;">
			</div>
				<div class="container vert-pad">
					<?php if ( have_posts() ) {  /* Query and display the parent. */
					while ( have_posts() ) {
					the_post(); ?>
					<h2><?php the_title(); ?></h2>
					<?php
					the_content();
					$thispage=$post->ID;
					}
					} ?>
				</div>
			<?php $childpages = query_posts('orderby=menu_order&order=asc&post_type=page&post_parent='.$thispage);
			if($childpages){ /* display the children content  */
			foreach ($childpages as $post) :
			setup_postdata($post); ?>
			<div id="<?php global $post; echo $post->post_name; ?>" class="vert-pad">
				<div class="container">
					<h2 class="center"><?php the_title(); ?></h2>
					<?php the_content();?>
				</div>
			</div>
				<?php
				endforeach;
				} ?>

		</main><!-- #main -->
	</div><!-- #primary -->
</div>
<?php

get_footer();
