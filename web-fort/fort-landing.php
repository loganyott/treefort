<?php
/**
 * Template Name: Forts Landing Template
 *
 * @package webfort
 */

get_header(); ?>

<!-- NEWS -->
<div class="jumbotron">
    <div class="container center">
        <h1>ENGAGING THE COMMUNITY <br />BEYOND THE MUSIC.<br />GO ON, EXPLORE SOMETHING NEW.</h1>
        <div class="fortlineup col-xs-12">
        <?php if ( have_posts() ) {  /* Query and display the parent. */
        while ( have_posts() ) {
        the_post();
        the_content();
        $thispage=$post->ID;
        }
        } 
        $childpages = query_posts('orderby=post_name&order=asc&post_type=page&post_parent='.$thispage);
        if($childpages){ /* display the children content  */
        foreach ($childpages as $post) :
        setup_postdata($post); ?>
        <a href="<?php the_permalink(); ?>" class="<?php global $post; echo $post->post_name; ?>badge col-xs-12 col-md-4 fort-badge"></a>
            <?php
            endforeach;
            } ?>
        </div>
    </div>
</div>

<?php

get_footer();