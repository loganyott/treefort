<?php
/**
 * Template Name: Flashlight Template
 *
 * @package webfort
 */

get_header(); ?>

	<div id="primary" class="content-area vert-pad">
		<main id="main" class="site-main container" role="main">
			<div id="flashlightdiv">
				<div class="visible-xs" style="height:30px;"></div>
					<?php if ( have_posts() ) {  /* Query and display the parent. */
						while ( have_posts() ) {
						the_post();					
						the_content();
						$thispage=$post->ID;
						}
					} ?>
			</div>
			<div id="log" style="display:none;"></div>  
			<div id="logDetails" style="display:none;"></div>  
		</main><!-- #main -->
	</div><!-- #primary -->

<?php
//get_sidebar();
get_footer();
