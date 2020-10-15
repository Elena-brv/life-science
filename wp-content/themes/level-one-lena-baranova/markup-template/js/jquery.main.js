var $ = jQuery.noConflict();
jQuery(document).ready(function() {
	isElementExist(".nav-drop", initSmartMenu);
	isElementExist(".slider", initSlickSlider);
	isElementExist(".about-item", initTabs);
	isElementExist(".picture-small", initProductGallery);
});

//-------- -------- -------- --------
//-------- js custom start
//-------- -------- -------- --------

// Helper if element exist then call function
function isElementExist(_el, _cb) {
	var elem = document.querySelector(_el);

	if (document.body.contains(elem)) {
		_cb();
	}
}

// smart menu init
function initSmartMenu() {
	jQuery(".header-menu").smartmenus({
		collapsibleBehavior: "accordion",
		mainMenuSubOffsetY: 20
	});

	// changed date attribute to a class (need to reverse last item menu)
	jQuery('.header-menu').children().last().addClass('nav-sm-reverse');

	jQuery("body").mobileNav({
		menuActiveClass: "nav-active",
		menuOpener: ".nav-opener",
		hideOnClickOutside: true,
		menuDrop: ".nav-drop"
	}), "ontouchstart" in document.documentElement ||
			jQuery(window).on("resize orientationchange", function() {
				jQuery("body").removeClass("nav-active"), $.SmartMenus.hideAll();
	});
}

function initSlickSlider() {
	$('.slider').slick({
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		dots: true,
		initialSlide: 2,
	});
}

function initTabs() {
	$('.about-item').click(function(event) {
		event.preventDefault();

		$('.about-item').removeClass('active');
		$('.content-item').removeClass('selected');

		$(this).addClass('active');
		$($(this).attr('href')).addClass('selected');
	})
}

function initProductGallery() {
	$('.picture-small').click(function(event) {

		$('.picture-small').removeClass('current');
		$(this).addClass('current');

		$('.picture-main').attr('src', $(this).attr('src'));
	});
}
//-------- -------- -------- --------
//-------- js custom end
//-------- -------- -------- --------

//-------- -------- -------- --------
//-------- included js libs start
//-------- -------- -------- --------

// library smartmenus (if you dont have menu in the project - just remove)
//= vendors/smartmenus.js
//= vendors/slick.min.js
//-------- -------- -------- --------
//-------- included js libs end
//-------- -------- -------- --------
