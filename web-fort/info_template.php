<?php
/**
 * Template Name: Info Page Template
 *
 * @package webfort
 */

get_header(); ?>
<!--
	<div class="navbar navbar-default info-menu submenu hidden-xs" role="navigation">
 	       <?php// wp_nav_menu( array( 'theme_location' => 'info', 'menu_class' => 'menu dropdown-menu' ) ); ?>
	</div>
-->
	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
			<div>
				<div class="container vert-pad">
					<div class="visible-xs" style="height:30px;"></div>
					<?php if ( have_posts() ) {  /* Query and display the parent. */
					while ( have_posts() ) {
					the_post();
					the_title( '<h1 class="entry-title center">', '</h1><br />' );					
					the_content();
					$thispage=$post->ID;
					}
					} ?>
					</div>
				</div>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php

get_footer();
