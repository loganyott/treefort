<?php
/**
 * Template Name: Submenu Top Template
 *
 * @package webfort
 */

get_header(); ?>
<!--
	<div class="navbar navbar-default involved-menu submenu hidden-xs" role="navigation">
 	       <?php// wp_nav_menu( array( 'theme_location' => 'involved', 'menu_class' => 'menu dropdown-menu' ) ); ?>
	</div>
-->
	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
            <div class="container vert-pad">
			<div class="visible-xs" style="height:30px;"></div>

			<?php
			while ( have_posts() ) : the_post(); ?>

			<div class="row">
				<div class="entry-header">
					<?php the_title( '<h1 class="entry-title center">', '</h1>' ); ?>
				</div><!-- .entry-header -->
			</div>
			<div class="hrWave"></div>
			<!-- sub nav -->
			<?php
			if ( has_children() OR $post->post_parent > 0 ) { ?>
				<div style="width:100%;" class="child-page-nav">
					<ul class="nav">
					<li<?php if (is_page('green')) { echo " class=\"current_page_item\""; }?>><a href="<?php echo get_the_permalink(get_top_ancestor_id()); ?>"><?php echo get_the_title(get_top_ancestor_id()); ?></a></li>
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
			<div class="row">
				<div class="col-xs-12">
					<?php the_content(); ?>
				</div><!-- .entry-header -->
			</div>
			<?php endwhile; // End of the loop.
			?>
            </div>
		</main><!-- #main -->
	</div><!-- #primary -->
</div>
<?php

get_footer();
