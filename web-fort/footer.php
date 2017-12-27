<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package webfort
 */

?>

	</div><!-- #content -->
	<!--[if IE]>
      <style type="text/css">

        .foot-overlay {
          filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='<?php bloginfo('template_directory'); ?>/assets/images/overlay-plants.png', sizingMethod='scale');
          background:none !important;
        }

        </style>
    <![endif]-->
    <div id="footer">
        <div class="foot-overlay animated pulse"></div>
        <div id="top-link"><h2><a href="#" class="hvr-float scrollToTop"><i class="fa fa-2x fa-arrow-circle-up animated bounceInUp" aria-hidden="true"></i></a></h2></div>
        <footer id="colophon" class="site-footer box-shadow-up " role="contentinfo">
            <div class="tf-footer col-xs-12">
                <div class="col-xs-6 col-xs-offset-3" style="position:static;">
                <img src="<?php site_url(); ?>/wp-content/uploads/2017/08/footerAnimated.gif" class="img-responsive center" />
                </div>
            

            </div><!-- .site-info -->
            <div class="footer-social">
                <div class="col-xs-12" style="margin:80px auto;">
                    <a href="http://mayor.cityofboise.org/news-releases/2014/12/mayor-bieter-names-treefort-as-2015-cultural-ambassador/" target="_blank" class="city-of-boise hidden-xs hidden-sm"><img src="<?php site_url(); ?>/wp-content/uploads/2017/08/CA1.png" class="img-responsive hidden-xs hidden-sm" style="max-width:150px;margin:auto;"></a>
                    <a href="http://www.bcorporation.net/community/treefort-music-fest" target="_blank" class="b-corp hidden-xs hidden-sm"><img src="<?php bloginfo('template_directory'); ?>/assets/BCorp_logo.png" class="img-responsive hidden-xs hidden-sm"  style="max-height:150px;margin:auto;"></a>
                </div>
            </div>
            <a href="http://www.bcorporation.net/community/treefort-music-fest" target="_blank"><img src="<?php bloginfo('template_directory'); ?>/assets/BCorp_logo.png" class="img-responsive hidden-md hidden-lg"  style="max-width:200px;margin:auto;"></a>
            <a href="http://mayor.cityofboise.org/news-releases/2014/12/mayor-bieter-names-treefort-as-2015-cultural-ambassador/" target="_blank"><img src="<?php site_url(); ?>/wp-content/uploads/2017/08/CA1.png" class="img-responsive hidden-md hidden-lg"  style="max-width:200px;margin:auto;"></a>
            <!-- click the text to expose the branch and build currently running in production -->
            <div style="color:#fff;text-align: center;font-size: 80%;padding: 10px;margin:0;">
            <span onclick="document.getElementById('branch-and-build').style.display = ''">♥ lovingly built in Boise</span>
            <p id="branch-and-build" style="font-size: 80%; opacity: 0.5; display: none">__repo__/__branch__ #__build__</p>
            </div>
            <div class="container center vert-pad">
            <p><a href="<?php site_url(); ?>/privacy/" style="color:#fff;text-align: center;font-size: 80%;padding: 10px;margin:40px 0;">Privacy Policy</a></p>
            </div>
        </footer><!-- #colophon -->
    </div>
</div><!-- #page -->

<?php wp_footer(); ?>
<div style="display:none;">
    <!-- Google Code for Remarketing Tag -->
    <!--
    Remarketing tags may not be associated with personally identifiable information or placed on pages related to sensitive categories. See more information and instructions on how to setup the tag on: http://google.com/ads/remarketingsetup
    -->
    <script type="text/javascript">
    /* <![CDATA[ */
    var google_conversion_id = 981347023;
    var google_custom_params = window.google_tag_params;
    var google_remarketing_only = true;
    /* ]]> */
    </script>
    <script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">
    </script>
    <noscript>
    <div style="display:inline;">
    <img height="1" width="1" style="border-style:none;" alt="" src="//googleads.g.doubleclick.net/pagead/viewthroughconversion/981347023/?guid=ON&amp;script=0"/>
    </div>
    </noscript>
</div>
</body>
</html>
