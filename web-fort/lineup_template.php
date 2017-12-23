<?php
/**
 * Template Name: Lineup Template
 *
 * @package webfort
 */

get_header(); ?>
<!--
	<div class="navbar navbar-default lineup-menu submenu hidden-xs" role="navigation">
 	       <?php// wp_nav_menu( array( 'theme_location' => 'lineup', 'menu_class' => 'menu dropdown-menu' ) ); ?>
	</div>
-->
	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
            <div class="container vert-pad">
			<div class="visible-xs" style="height:30px;"></div>

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
