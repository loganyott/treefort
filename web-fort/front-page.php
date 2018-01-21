<?php
/**
 * The template for displaying the front page.
 *
 * @package webfort
 */

get_header(); ?>

<!-- HEADER ANIMATION -->
<div id="homejumbo" class="jumbotron hidden-sm hidden-xs" style="background:transparent;">
    <div class="container">
        <img class="img-responsive center" src="<?php site_url(); ?>/wp-content/uploads/2017/08/headerblack.gif">
    </div>
    <div class="hrWave"></div>
</div>
<!-- END ANIMATION BANNER -->

<div class="frontpage">

    <!-- NEWS -->
    <div class="jumbotron">
        <!-- <div class="container">
            <div class="col-xs-12">
                <div class="row" style="margin:30px auto 10px auto;">
                    <h4 style="text-align:left;font-weight:bold;">Sign up to have Treefort news delivered straight to your inbox.</h4>
                    <div class="form-group">
                        <form action="https://treefortmusicfest.us4.list-manage.com/subscribe/post?u=aea21d6424cf3dab22d57ac8c&amp;id=feedfd37b7"
                        method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" target="_blank">
                            <div class="input-group">
                                <input class="form-control" type="email" placeholder="email address" name="EMAIL" id="mce-EMAIL" style="color:#ccc;font-size:1.2em;background:#ccc;"
                                onfocus="this.style.color='#ec6245'" required>
                                <span class="input-group-btn input-group-lg" style="margin-left:20px;">
                                    <button type="submit" class="btn btn-oct-b" style="font-size:18px;border:none !important;margin-left: 20px; margin-top: -25px;color:#fcd738;padding-top:10px;" name="subscribe" id="mc-embedded-subscribe">Sign up</button>
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div> -->
        
        <div class="container">
            <div class="col-xs-12 hidden-xs">
                <?php query_posts(
                    array('category_name'=>"News",
                    'showposts'=>3,
                    'order'=>DESC)
                ); ?>
                <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?> 
                <div class="col-xs-12 col-md-4">
                    <div style="width:300px;margin:auto;">
                        <a href="<?php the_permalink(); ?>">
                            <?php 
                                if ( has_post_thumbnail() ) { // check if the post has a Post Thumbnail assigned to it.
                                    the_post_thumbnail('medium', array('class' => 'img-responsive center yellow-drop'));
                                } else { ?>
                            <img style="padding-top:10px;margin-bottom:-10px;" src="<?php bloginfo('template_directory'); ?>/assets/logo-badge-white.png" alt="<?php the_title(); ?>" />
                        <?php }	?>
                        </a>
                        <div>
                            <a href="<?php the_permalink(); ?>"><h2 style="margin-top:40px;margin-bottom:0;line-height:35px;padding:0 10px;text-align:left;"><?php the_title(); ?></h2></a>
                            <p style="margin:5px;color:#868686;text-align:left;"><small><?php echo human_time_diff( get_the_time('U'), current_time('timestamp') ) . ' ago'; ?></small></p>
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
                        <a href="<?php the_permalink(); ?>"><h3 style="min-height:120px;margin-bottom:0;line-height:40px;padding:0 10px;"><?php the_title(); ?></h3></a>
                    </div>
                </div>
                <?php endwhile; else: ?> 
                <p><?php _e('Sorry, there are no posts.'); ?></p> 
                <?php endif; ?> 
            </div>
            <div class="col-xs-12">
                <div class="row center" style="margin:30px auto;">
                        <a href="news" class="btn btn-blue">NEWS</a>
                </div>
            </div>
        </div>
    </div>

    <!-- pink tickets on sale -->
    <div class="jumbotron rose-jumbo" style="overflow:hidden;position:relative;">
        <div class="container">
            <h2><a href="https://www.eventbrite.com/e/treefort-music-fest-2018-tickets-33252299523?aff=wbbnrfp" target="_blank">2018 TICKETS ON SALE NOW!</a></h2>
        </div>
    </div>
    
    <!-- lineup list -->
    <div id="lineup-frontpage" class="jumbotron white-jumbo" style="overflow:hidden;position:relative;">
        <?php 
        $query = new WP_Query( array( 'pagename' => 'lineup-frontpage' ) );
        ?>
        <?php while ( $query->have_posts() ) : $query->the_post(); ?>
        <div class="container">
            <h1 style="color:#000;" class="center"><?php the_title(); ?></h1>
            <?php the_content();?>
            <?php endwhile; ?>
        </div>
    </div>

    <!-- Explore section -->
    <div class="jumbotron" style="position:relative;padding:0;">
        <div class="container" style="background-image: url(<?php bloginfo('template_directory'); ?>/assets/images/footerperson.png); background-size: cover; background-position:left bottom; background-repeat:no-repeat;padding:48px;" class="img-responsive">
            <div class="container">
                <div class="embed-responsive col-xs-12 col-md-6">
                </div>
                <div class="col-xs-12 col-md-6">
                    <h2 style="color:#fcd738;margin-top:40px;">EXPLORE TREEFORT 7</h2>
                    <h3 style="color:#ef5e95;">Jump inside the land of Treefort Your digital flashlight is charged and waiting for you to discover bands on the initial lineup</h3>
                    <a class="btn btn-blue" href="https://www.treefortmusicfest.com/7/" target="_blank">EXPLORE</a>
                </div>
            </div>
        </div>
    </div>

    <!-- Don't miss a beat -->
    <div class="jumbotron yellow-jumbo" style="overflow:hidden;position:relative;">
        <div class="container h300">
            <div class="col-xs-12 col-md-6 v-center">
                    <h2>DON'T MISS A BEAT</h2>
                    <h3>Download the rockin Treefort app
                    Built right here in Boise.</h3>
            </div>
            <div class="col-xs-12 col-md-6 v-center">
                <a href="<?php echo get_permalink( get_page_by_path('app')) ?>" class="btn btn-lg">DOWNLOAD</a>
            </div>
        </div>
    </div>

    <!-- VIDEO EMBED -->
    <div class="jumbotron" style="position:relative;">
        <div class="home-video-recap container">
            <div class="container">
                <div class="col-xs-12 col-md-6">
                    <h2 style="color:#fcd738;margin-top:40px;">WATCH FORT FILES</h2>
                    <h3 style="color:#fff;">Get captivated by some of the most bizarre unsolved stories from Treefort Music Fest that have enthralled fans for years!</h3>
                    <a class="btn btn-blue" href="https://youtu.be/WO3EvxeZVn4" target="_blank">WATCH MORE</a>
                </div>
                <div class="embed-responsive col-xs-12 col-md-6">
                    <div class="embed-responsive embed-responsive-16by9">
                        <iframe width="560" height="315"  src="https://www.youtube.com/embed/WO3EvxeZVn4" frameborder="0" allowfullscreen></iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="hrWave"></div>

    <!-- LINEUPS -->
    <div  class="jumbotron row" style="position:relative;">
        <div class="container h300 center">
            <div class="col-xs-12 col-md-12">
                <a href="lineups"><span id="hot">HALL OF TREEFORT</span></a>
            </div>
            <div class="col-xs-12 col-md-12">
                <a class="btn-blue btn" href="<?php echo esc_url( get_permalink( get_page_by_title( '2012' ) ) ); ?>">2012</a>
                <a class="btn-blue btn" href="<?php echo esc_url( get_permalink( get_page_by_title( '2013' ) ) ); ?>">2013</a>
                <a class="btn-blue btn" href="<?php echo esc_url( get_permalink( get_page_by_title( '2014' ) ) ); ?>">2014</a>
                <a class="btn-blue btn" href="<?php echo esc_url( get_permalink( get_page_by_title( '2015' ) ) ); ?>">2015</a>
                <a class="btn-blue btn" href="<?php echo esc_url( get_permalink( get_page_by_title( '2016' ) ) ); ?>">2016</a>
                <a class="btn-blue btn" href="<?php site_url(); ?>/lineups/2017-lineup/">2017</a>
                <br/>
                <a class="btn-green btn visible-xs visible-sm" style="width:80%;margin-top:20px;margin-left:auto;margin-right:auto;" href="<?php echo get_permalink( get_page_by_path('lineup')) ?>">2018 - ROUND 1</a>
                <a class="btn-green btn visible-md visible-lg" style="width:334px;margin-top:20px;margin-left:auto;margin-right:auto;" href="<?php echo get_permalink( get_page_by_path('lineup')) ?>">2018 - ROUND 1</a>
            </div>
        </div>
    </div>

<div class="hrWave"></div>

    <!-- VIDEO EMBED -->
    <div class="jumbotron" style="position:relative;">
        <div class="home-video-recap container">
            <div class="container">
                <div class="embed-responsive col-xs-12 col-md-6">
                    <div class="embed-responsive embed-responsive-16by9">
                        <iframe width="560" height="315"  src="https://www.youtube.com/embed/vR7buqV45iE?ecver=1" frameborder="0" allowfullscreen></iframe>
                    </div>
                </div>
                <div class="col-xs-12 col-md-6" style="padding-left:40px;">
                    <h2 style="color:#fcd738;margin-top:40px;">TRAVEL BACK IN TIME</h2>
                    <h3 style="color:#fff;">TAKE A LOOK AT ALL THE FUN YOU AND YOUR BUDS COULD HAVE AT TREEFORT MUSIC FEST!</h3>
                    <a class="btn btn-blue" href="https://www.youtube.com/playlist?list=PLFPP29FFc_SC6DgXy8J2BTrgdHP3LcIEs" target="_blank">WATCH MORE</a>
                </div>
            </div>
        </div>
    </div>

    <!-- email signup to be replaced with playlists -->
    <div class="jumbotron yellow-jumbo" style="overflow:hidden;position:relative;">
        <div class="container h300">
            <div class="col-xs-12 col-md-8 v-center">
                    <h2>GET SECRET INSIDER INFORMATION</h2>
                    <form class="form-inline" role="form" action="https://treefortmusicfest.us4.list-manage.com/subscribe/post?u=aea21d6424cf3dab22d57ac8c&amp;id=feedfd37b7"
                    method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" target="_blank">
                        <div class="form-group">
                            <input class="form-control input-lg" type="email" value="email address" name="EMAIL" id="mce-EMAIL" style="color:#ccc;font-size:1.5em;height: 58px; border-radius: 0;"
                            onfocus="if(this.value == 'email address'){this.value = '';this.style.color='#ec6245'}" required>
                        </div>
                        <button type="submit" class="btn btn-blue" style="margin:0;" name="subscribe" id="mc-embedded-subscribe">Sign up</button>
                    </form>
            </div>
            <div class="col-xs-12 col-md-4 v-center">
                <img src="<?php bloginfo('template_directory'); ?>/assets/doodles/SecretInfo.gif" class="img-responsive" style="margin:0 auto; height:300px">
            </div>
        </div>
    </div>

    <!-- MERCH -->
    <!-- div class="jumbotron" style="overflow:hidden;position:relative;">
        <div class="pattern-dark"></div>
        <div class="container">
        <div class="col-xs-12 col-md-6">
        <a href="< ?php site_url(); ?>/2017-box-office/">
            <img src="< ?php site_url(); ?>/wp-content/uploads/2017/03/Box_Office_Doodle1.png" class="img-responsive" style="margin:0 auto;"></a>
        </div>
        <div class="col-xs-12 col-md-6" style="height:420px;">
            <div class="v-center">
                <h2 style="color:#fff;">2017 BOX OFFICE</h2>
                <ul style="list-style: none;">
                <li style="font-weight:700;">The Owyhee</li>
                <li>WED 3.22 | 3:00-10:00PM</li>
                <li>THU 3.23 | 3:00-10:00PM</li>
                </ul>
                <ul style="list-style: none;">
                <li style="font-weight:700;">Main Stage</li>
                <li>FRI 3.24 | 12:00-10:00PM</li> 
                <li>SAT 3.25 | 12:00-10:00PM </li>
                <li>SUN 3.26 | 12:00-8:00PM </li>
                </ul>
            </div>
        </div>
        </div>
    </div -->

    <!-- Random Quotes -->

    <div class="jumbotron" style="width:100%;overflow:hidden;text-align:center;position:relative;">
        <div class="pattern-light"></div>
        <div id="randomQuote" class="container" style="overflow:hidden;background-size:100%;position:relative;z-index:9;">
            <div class="h300">
                <script src="<?php bloginfo('template_directory'); ?>/js/randomQuotes.js"></script>
            </div>
        </div>
    </div>

    <!-- Sponsors -->
    <div id="FPsponsor" class="jumbotron" style="overflow:hidden;">
        <?php
            $page = get_page_by_title( 'Sponsors' );
            if( $page ) {
                echo apply_filters('the_content', $page->post_content);
            }
        ?>
    </div>

    
    <!-- Mark your Calendars
    <div class="jumbotron  " style="overflow:hidden;">
        <div class="container h200">
        <div class="col-xs-12 col-md-7 v-center">
            <h2>Treefort Music Fest<br>March 22 - 26, 2017</h2>
        </div>
        <div class="col-xs-12 col-md-4 col-md-offset-1 v-center">
            <img src="< ?php bloginfo('template_directory'); ?>/assets/doodles/targetInvert.png" class="img-responsive" style="max-height:250px;">
        </div>
        </div>
    </div>
     -->

</div>
<?php
get_footer(); ?>
