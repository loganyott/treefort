<?php
/**
 * Template Name: ITC Template
 *
 * @package webfort
 */

get_header(); ?>
	<div id="primary" class="content-area">
			<div class="visible-xs" style="height:40px;"></div>
		<main id="main" class="site-main" role="main">
			<?php
			while ( have_posts() ) : the_post();?>
			<div class="jumbotron">
				<div class="center" style="width:300px;">
					<div class="entry-header">
						<?php the_title( '<h1 class="entry-title center">', '</h1>' ); ?>
					</div><!-- .entry-header -->
				</div>
			</div>
            <div class="container">

          <!-- Visit Idaho Content -->
		  <div class="itc-container">
			<br>
			<div class="visit-idaho">
				<article class="itc-trip-guide featured">
				<a href="https://visitidaho.org/trip-guides/experience-boise-like-local/" target="_blank">
					<header>
					<div>
						<h3>Experience Boise Like a Local</h3>
						<span class="btn btn-long-t">Get Started</span>
					</div>
					</header>
					<img src="<?php bloginfo('template_directory'); ?>/assets/itc/8thstreet-1170x700.jpg" alt="8th Street - Boise, Idaho">
				</a>
				</article>
				<div class="cta">
					<div class="bookings itc-trip-guide">
						<header>
							<h2>Book Now</h2>
							<p>Treefort loves travelers! Get ready for your trip to Boise by finding the best deals on fresh Treefort gear, hotels, and flights. Booking through Treefort helps support the festival AND gets you the best deals.</p>
							<a class="btn btn-long-o" href="http://booking.boise.org/hotel/list/8097?Search%5BhotelRegion%5D=m3253&amp;Search%5BcheckInDate%5D=03%2F22%2F2017&amp;Search%5BcheckOutDate%5D=03%2F26%2F2017&amp;Search%5BnumberOfRooms%5D=1&amp;Search%5BnumberOfAdults%5D=2&amp;Search%5BnumberOfChildren%5D=0&amp;Search%5BkeywordSearch%5D=&amp;Search%5BstarRating%5D=&amp;Search%5BlowPrice%5D=&amp;Search%5BhighPrice%5D=&amp;Search%5Bsearch%5D=&amp;Search%5BhotelRegionText%5D=&amp;Search%5BpoiDistance%5D=" target="_blank">HOTELS</a>
							<a class="btn btn-long-o" href="http://delta.com/" target="_blank">FLIGHTS</a><div class="delta-container" style="width: 185px;height: 45px;float: right;margin-top: 5px;padding: 10px;"><img class="img-responsive" src="<?php site_url(); ?>/wp-content/uploads/2016/08/delta.png"></div>
						</header>
					</div>
					<div class="boise-green-bike itc-trip-guide">
						<header>
							<h2><span>Boise Green Bike</span></h2>
							<p>Why walk when you can ride? Use local bike share service Boise Green Bike for fast and easy transportation between venues and around town.</p>
							<a class="btn btn-long-o" href="http://boise.greenbike.com/#memberships" target="_blank">SIGN UP</a>
						</header>
					</div>
				</div>

				<div class="trip-guides">
				<article class="itc-trip-guide">
					<a href="https://visitidaho.org/trip-guides/boises-best-craft-coffee-shops/" target="_blank">
					<header>
						<h3>Boise's Best Craft Coffee Shops</h3>
						<span>by Tara Morgan</span>
					</header>
					<img src="<?php bloginfo('template_directory'); ?>/assets/itc/slow-by-slow-1170x700.jpg" alt="Slow by Slow Coffee - Boise, Idaho">
					</a>
				</article>
				<article class="itc-trip-guide">
					<a href="https://visitidaho.org/trip-guides/recover-repeat-boises-guide-hot-springs-bloody-marys/" target="_blank">
					<header>
						<h3>Recover and Repeat: Boise's Guide to Hot Springs and Bloody Marys</h3>
						<span>by Amy Rajkovich</span>
					</header>
					<img src="<?php bloginfo('template_directory'); ?>/assets/itc/recover-repeat-1170x700.jpg" alt="Bloody Mary">
					</a>
				</article>
				<article class="itc-trip-guide">
					<a href="https://visitidaho.org/trip-guides/your-food-guide-to-boise-part-one/" target="_blank">
					<header>
						<h3>14 Boise Restaurants to Try Between Sets at Treefort</h3>
						<span>by Visit Idaho</span>
					</header>
					<img src="<?php bloginfo('template_directory'); ?>/assets/itc/boise-restaurants-1170x700.jpg" alt="Burger and Sides">
					</a>
				</article>
				<article class="itc-trip-guide">
					<a href="https://visitidaho.org/trip-guides/boises-top-5-sweet-treats-near-treefort/" target="_blank">
					<header>
						<h3>Boise's Top 5 Sweet Treats Near Treefort</h3>
						<span>by Visit Idaho</span>
					</header>
					<img src="<?php bloginfo('template_directory'); ?>/assets/itc/sweet-treats-1170x700.jpg" alt="Ice Cream Potato">
					</a>
				</article>
				</div>

				<div class="row" style="background: transparent;">
					<a href="/travel/treeline"><img src="<?php bloginfo('template_directory'); ?>/assets/itc/ZoomBetweenLandscape.png" class="img-responsive center"></a>
				</div>
				<div class="row center" style="background: transparent;margin-top:80px;">
					<img class="img-responsive wp-image-655 aligncenter" src="<?php site_url(); ?>/wp-content/uploads/2016/05/visit-idaho-300x161.png" width="207" height="111" srcset="<?php site_url(); ?>/wp-content/uploads/2016/05/visit-idaho-300x161.png 300w, <?php site_url(); ?>/wp-content/uploads/2016/05/visit-idaho-768x413.png 768w, <?php site_url(); ?>/wp-content/uploads/2016/05/visit-idaho-1024x550.png 1024w, <?php site_url(); ?>/wp-content/uploads/2016/05/visit-idaho.png 1213w" sizes="(max-width: 207px) 100vw, 207px" />
				</div>
				<div class="row center" style="background: transparent;">
					<h4 style="font-size: 18px; line-height: 1.5; max-width: 760px; margin: 28px auto 20px;">Whether you're looking for an adventure to extend the party before or after the festival, planning your next rafting or ski vacation, or in search of a day trip between shows, Visit Idaho is the place to start dreaming and planning!</h4>
				</div>
				<div class="row center" style="background: transparent;">
					<a class="btn btn-long-b" style="position: static;" href="https://visitidaho.org/" target="_blank">Get Started</a>
				</div>
				</div>
			</div>
		  </div>
          <!-- /Visit Idaho Content -->
				<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
					

					<div class="entry-content">
						<?php
							the_content();

							wp_link_pages( array(
								'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'webfort' ),
								'after'  => '</div>',
							) );
						?>
					</div><!-- .entry-content -->

					<footer class="entry-footer">
						<?php
							edit_post_link(
								sprintf(
									/* translators: %s: Name of current post */
									esc_html__( 'Edit %s', 'webfort' ),
									the_title( '<span class="screen-reader-text">"', '"</span>', false )
								),
								'<span class="edit-link">',
								'</span>'
							);
						?>
					</footer><!-- .entry-footer -->
				</article><!-- #post-## -->

			<?php endwhile; // End of the loop.
			?>
            </div>
		</main><!-- #main -->
	</div><!-- #primary -->
</div>
<?php

get_footer();
