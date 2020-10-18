var $ = jQuery.noConflict();
jQuery(document).ready(function() {
	isElementExist(".nav-drop", initSmartMenu);
	isElementExist(".slider", initSlickSlider);
	isElementExist(".about-item", initTabs);
	isElementExist(".picture-small", initProductGallery);
	isElementExist(".card-picture", showLightbox);
	isElementExist(".lightbox-close, .overlay", closeLightBox);
	isElementExist(".minus", decreaseCounter);
	isElementExist(".plus", increaseCounter);
	isElementExist(".buy, .purchase-buy", initCountCart);
	isElementExist(".price-label", selectPrice);
	isElementExist(".promos", showHidePromos);
	isElementExist(".mobile-menu", initMobileMenu);
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

function initMobileMenu() {
	$('.mobile-menu').click(function() {
    $('.nav').toggleClass('nav-mobile');
    $('.mobile-menu-toggler').toggleClass('mobile-menu-toggler--active');
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

		$(this).closest('.about').find('.about-item').removeClass('active');
		$(this).closest('.about').find('.content-item').removeClass('selected');

		$(this).addClass('active');
		$($(this).attr('href')).addClass('selected');
	})
}

function initProductGallery() {
	$('.picture-small').click(function(event) {

		$(this).closest('.gallery').find('.picture-small').removeClass('current');
		$(this).addClass('current');

		$(this).closest('.gallery').children('.picture-main').attr('src', $(this).attr('src'));
	});
}

function showLightbox() {
	$('.card-picture').click(function() {
		$(this).siblings('.lightbox').css('display', 'block');
		$(this).siblings('.lightbox').children('.overlay').css('display', 'block');
	})
}

function closeLightBox() {
	$('.lightbox-close, .overlay').click(function() {
		$('.lightbox').css('display', 'none');
		$('.overlay').css('display', 'none');
	})
}

function decreaseCounter() {
	$('.minus').click(function() {
		const count = $('.count');
		if (+count.val() > 1) {
			count.val(+count.val() - 1);
		}
	})
}

function increaseCounter() {
	$('.plus').click(function() {
		const count = $('.count');
		if (+count.val() < 99) {
			count.val(+count.val() + 1);
		}
	})
}

function initCountCart() {
	$('.buy, .purchase-buy').click(function() {
		const newCount = +($('.cart-count').text()) + 1;
		$('.cart-count').text('' + newCount);
	})
}

function selectPrice() {
	$('.price-label').click(function() {
		$('.price-types').removeClass('selected');
		$(this).children().addClass('selected');
	})
}

function showHidePromos() {
	$('.promos').mouseover(function() {
		$('.actions').css('display', 'grid');
	})

	$('.promos').mouseout(function() {
		$('.actions').css('display', 'none');
	})
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
