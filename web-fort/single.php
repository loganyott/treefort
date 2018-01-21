<?php
/**
 * The template for displaying all single posts.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package webfort
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
			<div class="vert-pad">
				<div class="container">
					<div class="col-xs-12 col-md-10 col-md-offset-1">

					<?php
					while ( have_posts() ) : the_post();

						get_template_part( 'template-parts/content', get_post_format() );

						// the_post_navigation();

						// If comments are open or we have at least one comment, load up the comment template.
						//if ( comments_open() || get_comments_number() ) :
						//	comments_template();
						//endif;

					endwhile; // End of the loop.
					?>
					</div>
				</div>
			</div>
			<div class="hrWave"></div>
			<!-- NEWS -->
			<div class="jumbotron">
				<div class="container center">
					<h1>Keep Reading</h1>
					<div class="col-xs-12 hidden-xs">
						<?php query_posts(
							array('category_name'=>"News",
							'showposts'=>6,
							'order'=>DESC)
						); ?>
						<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?> 
						<div class="col-xs-12 col-md-4">
							<div style="width:300px;height:400px;margin:auto;text-align:left;">
								<a href="<?php the_permalink(); ?>">
									<?php 
										if ( has_post_thumbnail() ) { // check if the post has a Post Thumbnail assigned to it.
											the_post_thumbnail('medium', array('class' => 'img-responsive center yellow-drop'));
										} else { ?>
									<img style="padding-top:10px;margin-bottom:-10px;" src="<?php bloginfo('template_directory'); ?>/assets/logo-badge-white.png" alt="<?php the_title(); ?>" />
								<?php }	?>
								</a>
								<div>
									<a href="<?php the_permalink(); ?>"><h3 style="margin-top:40px;margin-bottom:0;line-height:35px;padding:0 10px;"><?php the_title(); ?></h3></a>
									<p style="margin:5px;"><small><?php echo human_time_diff( get_the_time('U'), current_time('timestamp') ) . ' ago'; ?></small></p>
								</div>
							</div>
						</div>
						<?php endwhile; else: ?> 
						<p><?php _e('Sorry, there are no posts.'); ?></p> 
						<?php endif; ?> 
					</div>
					<!-- news for mobile -->
					<div class="col-xs-12 visible-xs">
						<?php query_posts(
							array('category_name'=>"News",
							'showposts'=>3,
							'order'=>DESC)
						); ?>
						<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?> 
						<div class="row">
							<div style="width:300px;margin:auto;">
								<a href="<?php the_permalink(); ?>">
									<?php 
										if ( has_post_thumbnail() ) { // check if the post has a Post Thumbnail assigned to it.
											the_post_thumbnail('medium', array('class' => 'img-responsive center'));
										} else { ?>
									<img src="<?php bloginfo('template_directory'); ?>/assets/logo-badge-white.png" alt="<?php the_title(); ?>" />
								<?php }	?>
								</a>
								<h3 style="min-height:120px;margin-bottom:0;line-height:40px;padding:0 10px;color:#1b2253;"><?php the_title(); ?></h3>
								<div style="text-align:right;padding:10px;">
									<a href="<?php the_permalink(); ?>" class="btn btn-oct-b">Read</a>
								</div>
							</div>
						</div>
						<?php endwhile; else: ?> 
						<p><?php _e('Sorry, there are no posts.'); ?></p> 
						<?php endif; ?> 
					</div>
					<div class="col-xs-12">
						<div class="row" style="margin:30px auto;">
								<a href="news" class="btn btn-blue">MORE</a>
						</div>
					</div>
				</div>
			</div>
			
		</main><!-- #main -->
	</div><!-- #primary -->

<?php
//get_sidebar();
get_footer();
