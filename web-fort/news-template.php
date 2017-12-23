<?php
/**
 * Template Name: News Page Template
 *
 * @package webfort
 */

get_header(); ?>
	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
			<div class="vert-pad">
                <div class="center">
                        <h1>Updates</h1>
                </div>
				<div class="container vert-pad">
                    
					<?php 

                    $paged = ( get_query_var('paged') ) ? get_query_var('paged') : 1;

                    $custom_args = array(
                         'post_type' => 'post',
                         'category_name' => 'News',
                         'posts_per_page' => 10,
                          'paged' => $paged
                        );

                    $custom_query = new WP_Query( $custom_args ); ?>

                    <?php if ( $custom_query->have_posts() ) : ?>

                    <!-- the loop -->
                    <?php while ( $custom_query->have_posts() ) : $custom_query->the_post(); ?>
                        <article class="loop col-xs-12" style="margin-bottom:50px;">
                            <div class="col-xs-12 col-md-4">
                                <a href="<?php the_permalink(); ?>">
				                <?php 
					                if ( has_post_thumbnail() ) { // check if the post has a Post Thumbnail assigned to it.
    						        the_post_thumbnail('medium', array('class' => 'img-responsive center'));
    					            } else { ?>
    				            <img src="<?php bloginfo('template_directory'); ?>/assets/logo-badge-white.png" alt="<?php the_title(); ?>" />
    			                <?php }	?></a>
                            </div>
                            <div class="col-xs-12 col-md-8">
                                <h3 style="margin-top: 0px;" ><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a><br /><small><?php echo human_time_diff( get_the_time('U'), current_time('timestamp') ) . ' ago'; ?></small></h3>
                                <div class="content">
                                    <?php the_excerpt(); ?>
                                </div>
                            </div>
                        </article>
                        <?php endwhile; ?>
                        <!-- end of the loop -->

                        <!-- pagination here -->
                        <div class="center">
                        <?php
                        if (function_exists(custom_pagination)) {
                            custom_pagination($custom_query->max_num_pages,"",$paged);
                        }
                        ?>
                        </div>

                    <?php wp_reset_postdata(); ?>

                    <?php else:  ?>
                        <p><?php _e( 'Sorry, no posts matched your criteria.' ); ?></p>
                    <?php endif; ?>

				</div>
			</div>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php

get_footer();
