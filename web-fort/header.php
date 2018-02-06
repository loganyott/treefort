<?php
/**
 * The header for our theme.
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package webfort
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">

<?php wp_head(); ?>
<script src="https://use.fontawesome.com/94700a0d83.js"></script>
<!-- banner animation JavaScript -->
<script src="<?php bloginfo('template_directory'); ?>/js/spine.js"></script>
<script src="<?php bloginfo('template_directory'); ?>/js/spine-canvas.js"></script>
<script type="text/javascript">var templateUrl = '<?= get_bloginfo("template_url"); ?>';</script>

<!-- Google Analytics JavaScript -->
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-35961177-2', 'auto');
  ga('send', 'pageview');
</script>

<!-- CSS for our React app in ./tf-app & ./tf-sched -->
<link rel="stylesheet" href="https://unpkg.com/tachyons@4.5.5/css/tachyons.min.css"/>

<?php
switch ($_SERVER[SERVER_NAME]) {
  case 'localhost':
    $__PERFORMER_BUNDLE_JS__ = 'http://localhost:3000/static/js/bundle.js';
    $__PERFORMER_BUNDLE_CSS__ = '';
    $__SCHEDULE_BUNDLE_JS__ = 'http://localhost:3000/static/js/bundle.js';
    $__SCHEDULE_BUNDLE_CSS__ = '';
    break;
  default:
    $__PERFORMER_BUNDLE_JS__ = bloginfo('template_directory') . '__PERFORMER_REACT_BUNDLE_JS__';
    $__PERFORMER_BUNDLE_CSS__ = bloginfo('template_directory') . '__PERFORMER_REACT_BUNDLE_CSS__';
    $__SCHEDULE_BUNDLE_JS__ = bloginfo('template_directory') . '__SCHEDULE_REACT_BUNDLE_JS__';
    $__SCHEDULE_BUNDLE_CSS__ = bloginfo('template_directory') . '__SCHEDULE_REACT_BUNDLE_CSS__';
    break;
}
?>

<script type="text/javascript" src="<?php echo $__PERFORMER_BUNDLE_JS__?>" async></script>
<link rel="stylesheet" href="<?php echo $__PERFORMER_BUNDLE_CSS__?>" />
<script type="text/javascript" src="<?php echo $__SCHEDULE_BUNDLE_JS__?>" async></script>
<link rel="stylesheet" href="<?php echo $__SCHEDULE_BUNDLE_CSS__?>"/>

</head>

<body <?php body_class(); ?>>

<div id="top" class="top"></div>
    <div class="flashlight-left-bg hidden-xs hidden-sm"></div>
    <div class="flashlight-right-bg hidden-xs hidden-sm"></div>
    <div class="flashlight-left hidden-xs hidden-sm"></div>
    <div class="flashlight-right hidden-xs hidden-sm"></div>

<div id="page" class="site">
	<a class="skip-link screen-reader-text" href="#main"><?php esc_html_e( 'Skip to content', 'webfort' ); ?></a>

	<header id="masthead" class="site-header" role="banner">
        <div class="stick-yellow"></div>
        <div class="headermenu navbar navbar-default hidden-sm hidden-xs animated zoomInDown" role="navigation">
            <?php wp_nav_menu( array( 
                'theme_location'    => 'header', 
                'menu_class'        => 'menu headeritems',
                'depth'             => 2,
                'fallback_cb'       => 'wp_bootstrap_navwalker::fallback',
                'walker'            => new wp_bootstrap_navwalker())
                    ); ?>
        </div>
        <!-- <div class="headermenu hidden-sm hidden-xs">
             <button id="fpticketbtn" type="button" data-hover="9-8-17" data-active="NOT YET..." class="btn btn-noanim"><span>TICKETS</span></button>
            <a href="" class="btn btn-noanim"><span>FORTS</span></a>
            <a href="http://treefortmusicfest.bigcartel.com/" class="btn btn-noanim"><span>SHOP</span></a> 
        </div> -->
        <div class="headerbrand hidden-xs hidden-sm">
            <a id="logolink" href="<?php echo home_url(); ?>"><img src="<?php bloginfo('template_directory'); ?>/assets/images/navheader.jpg" class="img-responsive"></a>
        </div>
        <div class="headerbrand-mobile visible-xs visible -sm">
            <a id="logolink" href="<?php echo home_url(); ?>"><img src="<?php bloginfo('template_directory'); ?>/assets/images/navheader.jpg" class="img-responsive"></a>
            <p class="hidedate">March 21 - 25, 2018 IN DOWNTOWN BOISE, ID</p>
        </div>
        <div id="headersocial">
            <a class="hidden-xs" href="https://www.facebook.com/treefortmusicfest" target="_blank">
                <img class="headericon" src="<?php bloginfo('template_directory'); ?>/assets/social/Facebook.png" data-src="<?php bloginfo('template_directory'); ?>/assets/social/Facebook.png" data-hover="<?php bloginfo('template_directory'); ?>/assets/social/Facebookp.png" width="70">
            </a>
            <a class="hidden-xs" href="https://twitter.com/treefortfest" target="_blank">
                <img class="headericon" src="<?php bloginfo('template_directory'); ?>/assets/social/twitter.png" data-src="<?php bloginfo('template_directory'); ?>/assets/social/twitter.png" data-hover="<?php bloginfo('template_directory'); ?>/assets/social/twitterp.png" width="70">
            </a>
            <a class="hidden-xs" href="http://instagram.com/treefortfest" target="_blank">
                <img class="headericon" src="<?php bloginfo('template_directory'); ?>/assets/social/Instagram.png" data-src="<?php bloginfo('template_directory'); ?>/assets/social/Instagram.png" data-hover="<?php bloginfo('template_directory'); ?>/assets/social/Instagramp.png" width="70">
            </a>
            <a class="hidden-xs" href="https://www.youtube.com/user/treefortmusicfest" target="_blank">
                <img class="headericon" src="<?php bloginfo('template_directory'); ?>/assets/social/Youtube.png" data-src="<?php bloginfo('template_directory'); ?>/assets/social/Youtube.png" data-hover="<?php bloginfo('template_directory'); ?>/assets/social/Youtubep.png" width="70">
            </a>
            <a class="hidden-xs" href="https://www.snapchat.com/add/treefortfest" target="_blank">
                <img class="headericon" src="<?php bloginfo('template_directory'); ?>/assets/social/snapchat.png" data-src="<?php bloginfo('template_directory'); ?>/assets/social/snapchat.png" data-hover="<?php bloginfo('template_directory'); ?>/assets/social/snapchatp.png" width="70">
            </a>
        </div>

		<nav id="navbar-main" style="right:10px;" class="navbar navbar-default" role="navigation">
            <button type="button" class="stickburger navbar-toggle" data-toggle="collapse" data-target="#tfMenu" style="position:absolute;top:0;left:0;padding:3px;width:42px;border:none;">
                <span class="sr-only">Toggle navigation</span>
                <img src="<?php bloginfo('template_directory'); ?>/assets/stickburger.png" style="width:100%;"/>
            </button>
        <?php
            wp_nav_menu( array(
                'menu'              => 'primary',
                'theme_location'    => 'primary',
                'depth'             => 2,
                'container'         => 'div',
                'container_class'   => 'collapse navbar-collapse',
                'container_id'      => 'tfMenu',
                'menu_class'        => 'nav navbar-nav',
                'fallback_cb'       => 'wp_bootstrap_navwalker::fallback',
                'walker'            => new wp_bootstrap_navwalker())
            );
        ?>

        </nav><!-- #site-navigation -->
	</header><!-- #masthead -->

	<div id="content" class="site-content">
