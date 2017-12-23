/**
 * Theme javascript
 */

(function ($) {
	'use strict';

	$(document).ready(function () {

		//Sticky Main Nav
		if ($("#homejumbo").length >0) {
			$('.headerbrand').addClass('hidebrand');
		}
		$(window).bind('scroll', function () {
			var navHeight = 145;
			var loc = window.location.href;
			if ($(window).scrollTop() > navHeight) {
				$('nav').addClass('stuck');
				$('.headerbrand').addClass('stuck');
				$('.headerbrand-mobile').addClass('stuck');
				$('.fort-menu').addClass('stuck');
				$('.hidebrand').css({
					"visibility" : "visible", 
					"opacity" : "1"
				});
				$('.hidedate').css({
					"visibility" : "hidden", 
					"opacity" : "0"
				});
			}
			else {
				$('nav').removeClass('stuck');
				$('.headerbrand').removeClass('stuck');
				$('.headerbrand-mobile').removeClass('stuck');
				$('.fort-menu').removeClass('stuck');
				$('.hidebrand').css({
					"visibility" : "hidden", 
					"opacity" : "0"
				});
				$('.hidedate').css({
					"visibility" : "visible", 
					"opacity" : "1"
				});
			}
		});

		$(window).bind('scroll', function () {
			var navHeight = 150;
			if ($(window).scrollTop() > navHeight) {
				$('.submenu').addClass('sub-stuck');
			}
			else {
				$('.submenu').removeClass('sub-stuck');
			}
		});

		// Yellow Stickburger box
		$('.stickburger').click(function () {
			$('.stick-yellow').addClass('active');
		});

		// hide burger menu when cliking outside
		$(window).on('click',function(){
			$('#tfMenu').collapse('hide');
		});
		$('.headeritems').on('click',function(){
			$('#tfMenu').collapse('hide');
		});
		$('.dropdown').on('show.bs.dropdown', function() {
			$('.stick-yellow').removeClass('active');
		});
		$('#tfMenu').on('hidden.bs.collapse', function() {
			$('.stick-yellow').removeClass('active');
		});

		// social icon pink on hover
		$(".headericon").mouseover(function () {
			$(this).attr('src', $(this).data("hover"));
		}).mouseout(function () {
			$(this).attr('src', $(this).data("src"));
		});

		// header menu icons
		$('.headeritems').find(' > li:nth-child(1)').prepend('<img src="/wp-content/uploads/2017/08/tickets.png" height=30 />');
		$('.headeritems').find(' > li:nth-child(2)').prepend('<img src="/wp-content/uploads/2017/08/forts.png" height=30 />');
		$('.headeritems').find(' > li:nth-child(3)').prepend('<img src="/wp-content/uploads/2017/08/info.png" height=30 />');
		$('.headeritems').find(' > li:nth-child(4)').prepend('<img src="/wp-content/uploads/2017/12/mic.png" height=30 />');


		// append header menu to mobile stickburger menu
		function moveMenu() {
			if($(window).width() < 990) {
				$('#menu-header').prependTo('#tfMenu');
			} else {
				$('#menu-header').appendTo('.menu-header-container');}
		}
		moveMenu();
		$(window).resize(moveMenu);

		// animate buttons
		$('.btn').hover(
			function (){
				$(this).toggleClass('hvr-wobble-vertical');
			}
		);

        // Scroll To Top Button
		$(window).scroll(function () {
			if ($(this).scrollTop() > 100) {
				$('.scrollToTop').fadeIn();
			} else {
				$('.scrollToTop').fadeOut();
			}
		});
		$('.scrollToTop').click(function () {
			$('html, body').animate({ scrollTop: 0 }, 800);
			return false;
		});
        // Keep dropdown open when parent is active
		// if ($(".menu-item-has-children").is(".current-menu-parent")) {
		// 	$(".menu-item-has-children.current-menu-parent").addClass("open");
		// 	$(".site-content").addClass("open-pad");

		// 	$(".site-content").click(function(e) {
		// 		e.stopPropagation();
		// 	});

		// }
		// else
		// {
		// 	$(".dropdown").removeClass("open open-menu");
		// }

		// spinning fort badges
		$('.fort-badge').hover(function () {
			$(this).toggleClass('animated flip');
		});
		//flashlights		
		$('.flashlight-left').click(function (){
			$('.flashlight-left-bg').toggleClass("active");
			$('.flashlight-left').addClass('animated shake');
			$('.flashlight-left').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
				$(this).removeClass('animated shake');
				$('.flashlight-left-bg').removeClass('active');
			})
		});
		$('.flashlight-right').click(function (){
			$('.flashlight-right-bg').toggleClass("active");
			$('.flashlight-right').addClass('animated shake');
			$('.flashlight-right').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
				$(this).removeClass('animated shake');
				$('.flashlight-right-bg').removeClass('active');
			})
		});
    });

})(jQuery);