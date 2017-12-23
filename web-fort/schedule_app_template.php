<?php
/**
 * Template Name: Schedule App Template
 *
 * @package webfort
 */

get_header(); ?>
<!--
	<div class="navbar navbar-default lineup-menu submenu hidden-xs" role="navigation">
 	       <?php// wp_nav_menu( array( 'theme_location' => 'lineup', 'menu_class' => 'menu dropdown-menu' ) ); ?>
	</div>
-->
	<div id="primary" class="content-area" style="background:#1b2253;color:#eee;">
		<main id="main" class="site-main" role="main">
			<?php
			while ( have_posts() ) : the_post();?>
            <div class="container vert-pad">
				<div class="visible-xs" style="height:30px;"></div>
				<main id="main" class="site-main yo" role="main">
					<?php the_title( '<h1 class="entry-title center">', '</h1>' ); ?>
        			<div id="schedule"></div>
					<?php endwhile; // End of the loop.	?>
      			</main>
            </div>
		</main><!-- #main -->
	</div><!-- #primary -->
</div>
<?php

get_footer();
