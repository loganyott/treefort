<?php
/**
 * Template Name: All Forts
 *
 * @package webfort
 */

get_header(); ?>
	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
		<div class="visible-xs" style="height:30px;"></div>
<div class="jumbotron">
	<div class="container center">
        <img src="<?php bloginfo('template_directory'); ?>/assets/doodles/doodle_group.png" width="300">
        <h1><small>ENGAGING THE COMMUNITY <br />BEYOND THE MUSIC.<br />GO ON, EXPLORE SOMETHING NEW.</small></h1>
        <img src="<?php bloginfo('template_directory'); ?>/assets/doodles/doodle_group.png" width="300">
	</div>
</div>
<div class="jumbotron forts alefort">
	<div class="container center">
        <h2 class="fort">ALEFORT</h2>
        <?php
            $page = get_page_by_title( 'Alefort' );
            if( $page ) {
                echo apply_filters('the_content', $page->post_content);
            }
        ?>
	</div>
</div>
<div class="jumbotron forts comedyfort">
	<div class="container center">
    	<h2 class="fort">COMEDYFORT</h2>
        <?php
            $page = get_page_by_title( 'Comedyfort' );
            if( $page ) {
                echo apply_filters('the_content', $page->post_content);
            }
        ?>
    </div>
</div>
<div class="jumbotron forts filmfest">
	<div class="container center">
        <h2 class="fort">FILMFORT</h2>
        <?php
            $page = get_page_by_title( 'Filmfort' );
            if( $page ) {
                echo apply_filters('the_content', $page->post_content);
            }
        ?>
    </div>
</div>
<div class="jumbotron forts foodfort">
	<div class="container center">
        <h2 class="fort">FOODFORT</h2>
        <?php
            $page = get_page_by_title( 'Foodfort' );
            if( $page ) {
                echo apply_filters('the_content', $page->post_content);
            }
        ?>
    </div>
</div>
<div class="jumbotron forts hackfort">
	<div class="container center">
        <h2 class="fort">HACKFORT</h2>
        <?php
            $page = get_page_by_title( 'Hackfort' );
            if( $page ) {
                echo apply_filters('the_content', $page->post_content);
            }
        ?>
    </div>
</div>
<div class="jumbotron forts kidfort">
	<div class="container center">
        <h2 class="fort">KIDFORT</h2>
        <?php
            $page = get_page_by_title( 'Kidfort' );
            if( $page ) {
                echo apply_filters('the_content', $page->post_content);
            }
        ?>
    </div>
</div>
<div class="jumbotron forts performance-art">
	<div class="container center">
        <h2 class="fort">PERFORMANCE ART</h2>
        <?php
            $page = get_page_by_title( 'Performance art' );
            if( $page ) {
                echo apply_filters('the_content', $page->post_content);
            }
        ?>
	</div>
</div>
<div class="jumbotron forts skatefort">
	<div class="container center">
        <h2 class="fort">SKATEFORT</h2>
        <?php
            $page = get_page_by_title( 'Skatefort' );
            if( $page ) {
                echo apply_filters('the_content', $page->post_content);
            }
        ?>
    </div>
</div>
<div class="jumbotron forts storyfort">
	<div class="container center">
        <h2 class="fort">STORYFORT</h2>
        <?php
            $page = get_page_by_title( 'Storyfort' );
            if( $page ) {
                echo apply_filters('the_content', $page->post_content);
            }
        ?>
    </div>
</div>
<div class="jumbotron forts yogafort">
	<div class="container center">
        <h2 class="fort">YOGAFORT</h2>
        <?php
            $page = get_page_by_title( 'Yogafort' );
            if( $page ) {
                echo apply_filters('the_content', $page->post_content);
            }
        ?>
    </div>
</div>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php

get_footer();
