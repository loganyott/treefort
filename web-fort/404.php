<?php
/**
 * The template for displaying 404 pages (not found).
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package webfort
 */

 
 get_header(); ?>
 <!--
	 <div class="navbar navbar-default about-menu submenu hidden-xs" role="navigation">
			 < ?php// wp_nav_menu( array( 'theme_location' => 'about', 'menu_class' => 'menu dropdown-menu' ) ); ?>
	 </div>
 -->
	 <div id="primary" class="content-area">
		 <main id="main" class="site-main" role="main">
			<div class="visible-xs" style="height:30px;">
			</div>
			<div class="container vert-pad">
			<h1>Uh oh... I can't find that page.</h1>
			<a href="<?php site_url(); ?>/" style="color:#fcd738;"><h2>But there's still so much more to discover!</h2></a>
			</div> 
		 </main><!-- #main -->
	 </div><!-- #primary -->
 </div>
 <?php
 
 get_footer();
 