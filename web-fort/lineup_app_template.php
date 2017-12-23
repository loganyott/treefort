<?php
/**
 * Template Name: Lineup App Template
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
				<div class="site-main yo" role="main">
					<h1 style="text-align: center;">Lineup</h1>
					<img src="<?php bloginfo('template_directory'); ?>/assets/images/wave.gif" class="img-responsive center" style="margin-bottom:50px;">
        			<div id="root"></div>
      			</div>
            </div>
			<img src="<?php bloginfo('template_directory'); ?>/assets/images/footerperson.png" class="img-responsive" style="margin-right:0px;margin-left:auto;">
		</main><!-- #main -->
	</div><!-- #primary -->
</div>
<?php

get_footer();
