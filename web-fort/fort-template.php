<?php
/**
 * Template Name: Fort Page Template
 *
 * @package webfort
 */

get_header(); ?>

	<div class="navbar navbar-default fort-menu submenu hidden-xs hidden-sm" role="navigation">
 	       <?php wp_nav_menu( array( 'theme_location' => 'fort', 'menu_class' => 'menu dropdown-menu' ) ); ?>
	</div>

<div class="fort-content <?php echo get_post_meta($post->ID, 'fort', true); ?>">
	<div class="fortheader <?php echo get_post_meta($post->ID, 'fort', true); ?>header row-fluid">
		<div class="container">
			<div class="col-xs-12 col-md-4 center">
			<img class="responsive center" src="<?php bloginfo('template_directory'); ?>/assets/fort-badges/2018/<?php echo get_post_meta($post->ID, 'fort', true); ?>.png">
			</div>
			<div class="col-xs-12 col-md-8">
				<h1 style="margin-top:50px;"><?php echo get_post_meta($post->ID, 'fort', true); ?></h1>
			</div>
		</div>
	</div>
	<div id="primary" class="content-area">
		<main id="main" class="site-main container" role="main">
			<div class="visible-xs" style="height:30px;"></div>

			<?php
			while ( have_posts() ) : the_post();

				the_content();

				$thispage=$post->ID;

			endwhile; // End of the loop.
			?>

		</main><!-- #main -->
	</div><!-- #primary -->
    <div class="hrWave"></div>
	<!-- Setup our custom react app to filter based on the fort for this page -->
	<!-- div id="root" fort="< ?php echo get_post_meta($post->ID, 'fort', true); ?>" class="center container"></div -->

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
</div>
<?php

get_footer();
