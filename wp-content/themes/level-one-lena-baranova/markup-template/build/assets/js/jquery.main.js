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
/*
 * Simple Mobile Navigation
 */
(function($) {
	function MobileNav(options) {
		this.options = $.extend(
			{
				container: null,
				hideOnClickOutside: false,
				menuActiveClass: "nav-active",
				menuOpener: ".nav-opener",
				menuDrop: ".nav-drop",
				toggleEvent: "click",
				outsideClickEvent: "click touchstart pointerdown MSPointerDown"
			},
			options
		);
		this.initStructure();
		this.attachEvents();
	}
	MobileNav.prototype = {
		initStructure: function() {
			this.page = $("html");
			this.container = $(this.options.container);
			this.opener = this.container.find(this.options.menuOpener);
			this.drop = this.container.find(this.options.menuDrop);
		},
		attachEvents: function() {
			var self = this;
			if (activateResizeHandler) {
				activateResizeHandler();
				activateResizeHandler = null;
			}
			this.outsideClickHandler = function(e) {
				if (self.isOpened()) {
					var target = $(e.target);
					if (
						!target.closest(self.opener).length &&
						!target.closest(self.drop).length
					) {
						self.hide();
					}
				}
			};
			this.openerClickHandler = function(e) {
				e.preventDefault();
				self.toggle();
			};
			this.opener.on(this.options.toggleEvent, this.openerClickHandler);
		},
		isOpened: function() {
			return this.container.hasClass(this.options.menuActiveClass);
		},
		show: function() {
			this.container.addClass(this.options.menuActiveClass);
			if (this.options.hideOnClickOutside) {
				this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
			}
		},
		hide: function() {
			this.container.removeClass(this.options.menuActiveClass);
			if (this.options.hideOnClickOutside) {
				this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
			}
		},
		toggle: function() {
			if (this.isOpened()) {
				this.hide();
			} else {
				this.show();
			}
		},
		destroy: function() {
			this.container.removeClass(this.options.menuActiveClass);
			this.opener.off(this.options.toggleEvent, this.clickHandler);
			this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
		}
	};
	var activateResizeHandler = function() {
		var win = $(window),
			doc = $("html"),
			resizeClass = "resize-active",
			flag,
			timer;
		var removeClassHandler = function() {
			flag = false;
			doc.removeClass(resizeClass);
		};
		var resizeHandler = function() {
			if (!flag) {
				flag = true;
				doc.addClass(resizeClass);
			}
			clearTimeout(timer);
			timer = setTimeout(removeClassHandler, 500);
		};
		win.on("resize orientationchange", resizeHandler);
	};
	$.fn.mobileNav = function(opt) {
		var args = Array.prototype.slice.call(arguments);
		var method = args[0];
		return this.each(function() {
			var $container = jQuery(this);
			var instance = $container.data("MobileNav");
			if (typeof opt === "object" || typeof opt === "undefined") {
				$container.data(
					"MobileNav",
					new MobileNav(
						$.extend(
							{
								container: this
							},
							opt
						)
					)
				);
			} else if (typeof method === "string" && instance) {
				if (typeof instance[method] === "function") {
					args.shift();
					instance[method].apply(instance, args);
				}
			}
		});
	};
})(jQuery);
/*
 * SmartMenus jQuery v1.1.0+
 * http://www.smartmenus.org/
 *
 * Copyright Vasil Dinkov, Vadikom Web Ltd.
 * http://vadikom.com/
 *
 * Released under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
(function(factory) {
	if (typeof define === "function" && define.amd) {
		// AMD
		define(["jquery"], factory);
	} else if (typeof module === "object" && typeof module.exports === "object") {
		// CommonJS
		module.exports = factory(require("jquery"));
	} else {
		// Global jQuery
		factory(jQuery);
	}
})(function($) {
	var menuTrees = [],
		mouse = false, // optimize for touch by default - we will detect for mouse input
		touchEvents = "ontouchstart" in window, // we use this just to choose between toucn and pointer events, not for touch screen detection
		mouseDetectionEnabled = false,
		requestAnimationFrame =
			window.requestAnimationFrame ||
			function(callback) {
				return setTimeout(callback, 1000 / 60);
			},
		cancelAnimationFrame =
			window.cancelAnimationFrame ||
			function(id) {
				clearTimeout(id);
			},
		canAnimate = !!$.fn.animate;
	// Handle detection for mouse input (i.e. desktop browsers, tablets with a mouse, etc.)
	function initMouseDetection(disable) {
		var eNS = ".smartmenus_mouse";
		if (!mouseDetectionEnabled && !disable) {
			// if we get two consecutive mousemoves within 2 pixels from each other and within 300ms, we assume a real mouse/cursor is present
			// in practice, this seems like impossible to trick unintentianally with a real mouse and a pretty safe detection on touch devices (even with older browsers that do not support touch events)
			var firstTime = true,
				lastMove = null,
				events = {
					mousemove: function(e) {
						var thisMove = {
							x: e.pageX,
							y: e.pageY,
							timeStamp: new Date().getTime()
						};
						if (lastMove) {
							var deltaX = Math.abs(lastMove.x - thisMove.x),
								deltaY = Math.abs(lastMove.y - thisMove.y);
							if (
								(deltaX > 0 || deltaY > 0) &&
								deltaX <= 2 &&
								deltaY <= 2 &&
								thisMove.timeStamp - lastMove.timeStamp <= 300
							) {
								mouse = true;
								// if this is the first check after page load, check if we are not over some item by chance and call the mouseenter handler if yes
								if (firstTime) {
									var $a = $(e.target).closest("a");
									if ($a.is("a")) {
										$.each(menuTrees, function() {
											if ($.contains(this.$root[0], $a[0])) {
												this.itemEnter({ currentTarget: $a[0] });
												return false;
											}
										});
									}
									firstTime = false;
								}
							}
						}
						lastMove = thisMove;
					}
				};
			events[
				touchEvents
					? "touchstart"
					: "pointerover pointermove pointerout MSPointerOver MSPointerMove MSPointerOut"
			] = function(e) {
				if (isTouchEvent(e.originalEvent)) {
					mouse = false;
				}
			};
			$(document).on(getEventsNS(events, eNS));
			mouseDetectionEnabled = true;
		} else if (mouseDetectionEnabled && disable) {
			$(document).off(eNS);
			mouseDetectionEnabled = false;
		}
	}

	function isTouchEvent(e) {
		return !/^(4|mouse)$/.test(e.pointerType);
	}
	// returns a jQuery on() ready object
	function getEventsNS(events, eNS) {
		if (!eNS) {
			eNS = "";
		}
		var eventsNS = {};
		for (var i in events) {
			eventsNS[i.split(" ").join(eNS + " ") + eNS] = events[i];
		}
		return eventsNS;
	}
	$.SmartMenus = function(elm, options) {
		this.$root = $(elm);
		this.opts = options;
		this.rootId = ""; // internal
		this.accessIdPrefix = "";
		this.$subArrow = null;
		this.activatedItems = []; // stores last activated A's for each level
		this.visibleSubMenus = []; // stores visible sub menus UL's (might be in no particular order)
		this.showTimeout = 0;
		this.hideTimeout = 0;
		this.scrollTimeout = 0;
		this.clickActivated = false;
		this.focusActivated = false;
		this.zIndexInc = 0;
		this.idInc = 0;
		this.$firstLink = null; // we'll use these for some tests
		this.$firstSub = null; // at runtime so we'll cache them
		this.disabled = false;
		this.$disableOverlay = null;
		this.$touchScrollingSub = null;
		this.cssTransforms3d =
			"perspective" in elm.style || "webkitPerspective" in elm.style;
		this.wasCollapsible = false;
		this.init();
	};
	$.extend($.SmartMenus, {
		hideAll: function() {
			$.each(menuTrees, function() {
				this.menuHideAll();
			});
		},
		destroy: function() {
			while (menuTrees.length) {
				menuTrees[0].destroy();
			}
			initMouseDetection(true);
		},
		prototype: {
			init: function(refresh) {
				var self = this;
				if (!refresh) {
					menuTrees.push(this);
					this.rootId = (new Date().getTime() + Math.random() + "").replace(
						/\D/g,
						""
					);
					this.accessIdPrefix = "sm-" + this.rootId + "-";
					if (this.$root.hasClass("sm-rtl")) {
						this.opts.rightToLeftSubMenus = true;
					}
					// init root (main menu)
					var eNS = ".smartmenus";
					this.$root
						.data("smartmenus", this)
						.attr("data-smartmenus-id", this.rootId)
						.dataSM("level", 1)
						.on(
							getEventsNS(
								{
									"mouseover focusin": $.proxy(this.rootOver, this),
									"mouseout focusout": $.proxy(this.rootOut, this),
									keydown: $.proxy(this.rootKeyDown, this)
								},
								eNS
							)
						)
						.on(
							getEventsNS(
								{
									mouseenter: $.proxy(this.itemEnter, this),
									mouseleave: $.proxy(this.itemLeave, this),
									mousedown: $.proxy(this.itemDown, this),
									focus: $.proxy(this.itemFocus, this),
									blur: $.proxy(this.itemBlur, this),
									click: $.proxy(this.itemClick, this)
								},
								eNS
							),
							"a"
						);
					// hide menus on tap or click outside the root UL
					eNS += this.rootId;
					if (this.opts.hideOnClick) {
						$(document).on(
							getEventsNS(
								{
									touchstart: $.proxy(this.docTouchStart, this),
									touchmove: $.proxy(this.docTouchMove, this),
									touchend: $.proxy(this.docTouchEnd, this),
									// for Opera Mobile < 11.5, webOS browser, etc. we'll check click too
									click: $.proxy(this.docClick, this)
								},
								eNS
							)
						);
					}
					// hide sub menus on resize
					$(window).on(
						getEventsNS(
							{ "resize orientationchange": $.proxy(this.winResize, this) },
							eNS
						)
					);
					if (this.opts.subIndicators) {
						this.$subArrow = $("<span/>").addClass("sub-arrow");
						if (this.opts.subIndicatorsText) {
							this.$subArrow.html(this.opts.subIndicatorsText);
						}
					}
					// make sure mouse detection is enabled
					initMouseDetection();
				}
				// init sub menus
				this.$firstSub = this.$root
					.find("ul")
					.each(function() {
						self.menuInit($(this));
					})
					.eq(0);
				this.$firstLink = this.$root.find("a").eq(0);
				// find current item
				if (this.opts.markCurrentItem) {
					var reDefaultDoc = /(index|default)\.[^#\?\/]*/i,
						reHash = /#.*/,
						locHref = window.location.href.replace(reDefaultDoc, ""),
						locHrefNoHash = locHref.replace(reHash, "");
					this.$root.find("a:not(.mega-menu a)").each(function() {
						var href = this.href.replace(reDefaultDoc, ""),
							$this = $(this);
						if (href == locHref || href == locHrefNoHash) {
							$this.addClass("current");
							if (self.opts.markCurrentTree) {
								$this
									.parentsUntil("[data-smartmenus-id]", "ul")
									.each(function() {
										$(this)
											.dataSM("parent-a")
											.addClass("current");
									});
							}
						}
					});
				}
				// save initial state
				this.wasCollapsible = this.isCollapsible();
			},
			destroy: function(refresh) {
				if (!refresh) {
					var eNS = ".smartmenus";
					this.$root
						.removeData("smartmenus")
						.removeAttr("data-smartmenus-id")
						.removeDataSM("level")
						.off(eNS);
					eNS += this.rootId;
					$(document).off(eNS);
					$(window).off(eNS);
					if (this.opts.subIndicators) {
						this.$subArrow = null;
					}
				}
				this.menuHideAll();
				var self = this;
				this.$root
					.find("ul")
					.each(function() {
						var $this = $(this);
						if ($this.dataSM("scroll-arrows")) {
							$this.dataSM("scroll-arrows").remove();
						}
						if ($this.dataSM("shown-before")) {
							if (self.opts.subMenusMinWidth || self.opts.subMenusMaxWidth) {
								$this
									.css({ width: "", minWidth: "", maxWidth: "" })
									.removeClass("sm-nowrap");
							}
							if ($this.dataSM("scroll-arrows")) {
								$this.dataSM("scroll-arrows").remove();
							}
							$this.css({
								zIndex: "",
								top: "",
								left: "",
								marginLeft: "",
								marginTop: "",
								display: ""
							});
						}
						if (($this.attr("id") || "").indexOf(self.accessIdPrefix) == 0) {
							$this.removeAttr("id");
						}
					})
					.removeDataSM("in-mega")
					.removeDataSM("shown-before")
					.removeDataSM("scroll-arrows")
					.removeDataSM("parent-a")
					.removeDataSM("level")
					.removeDataSM("beforefirstshowfired")
					.removeAttr("role")
					.removeAttr("aria-hidden")
					.removeAttr("aria-labelledby")
					.removeAttr("aria-expanded");
				this.$root
					.find("a.has-submenu")
					.each(function() {
						var $this = $(this);
						if ($this.attr("id").indexOf(self.accessIdPrefix) == 0) {
							$this.removeAttr("id");
						}
					})
					.removeClass("has-submenu")
					.removeDataSM("sub")
					.removeAttr("aria-haspopup")
					.removeAttr("aria-controls")
					.removeAttr("aria-expanded")
					.closest("li")
					.removeDataSM("sub");
				if (this.opts.subIndicators) {
					this.$root.find("span.sub-arrow").remove();
				}
				if (this.opts.markCurrentItem) {
					this.$root.find("a.current").removeClass("current");
				}
				if (!refresh) {
					this.$root = null;
					this.$firstLink = null;
					this.$firstSub = null;
					if (this.$disableOverlay) {
						this.$disableOverlay.remove();
						this.$disableOverlay = null;
					}
					menuTrees.splice($.inArray(this, menuTrees), 1);
				}
			},
			disable: function(noOverlay) {
				if (!this.disabled) {
					this.menuHideAll();
					// display overlay over the menu to prevent interaction
					if (!noOverlay && !this.opts.isPopup && this.$root.is(":visible")) {
						var pos = this.$root.offset();
						this.$disableOverlay = $('<div class="sm-jquery-disable-overlay"/>')
							.css({
								position: "absolute",
								top: pos.top,
								left: pos.left,
								width: this.$root.outerWidth(),
								height: this.$root.outerHeight(),
								zIndex: this.getStartZIndex(true),
								opacity: 0
							})
							.appendTo(document.body);
					}
					this.disabled = true;
				}
			},
			docClick: function(e) {
				if (this.$touchScrollingSub) {
					this.$touchScrollingSub = null;
					return;
				}
				// hide on any click outside the menu or on a menu link
				if (
					(this.visibleSubMenus.length &&
						!$.contains(this.$root[0], e.target)) ||
					$(e.target).closest("a").length
				) {
					this.menuHideAll();
				}
			},
			docTouchEnd: function(e) {
				if (!this.lastTouch) {
					return;
				}
				if (
					this.visibleSubMenus.length &&
					(this.lastTouch.x2 === undefined ||
						this.lastTouch.x1 == this.lastTouch.x2) &&
					(this.lastTouch.y2 === undefined ||
						this.lastTouch.y1 == this.lastTouch.y2) &&
					(!this.lastTouch.target ||
						!$.contains(this.$root[0], this.lastTouch.target))
				) {
					if (this.hideTimeout) {
						clearTimeout(this.hideTimeout);
						this.hideTimeout = 0;
					}
					// hide with a delay to prevent triggering accidental unwanted click on some page element
					var self = this;
					this.hideTimeout = setTimeout(function() {
						self.menuHideAll();
					}, 350);
				}
				this.lastTouch = null;
			},
			docTouchMove: function(e) {
				if (!this.lastTouch) {
					return;
				}
				var touchPoint = e.originalEvent.touches[0];
				this.lastTouch.x2 = touchPoint.pageX;
				this.lastTouch.y2 = touchPoint.pageY;
			},
			docTouchStart: function(e) {
				var touchPoint = e.originalEvent.touches[0];
				this.lastTouch = {
					x1: touchPoint.pageX,
					y1: touchPoint.pageY,
					target: touchPoint.target
				};
			},
			enable: function() {
				if (this.disabled) {
					if (this.$disableOverlay) {
						this.$disableOverlay.remove();
						this.$disableOverlay = null;
					}
					this.disabled = false;
				}
			},
			getClosestMenu: function(elm) {
				var $closestMenu = $(elm).closest("ul");
				while ($closestMenu.dataSM("in-mega")) {
					$closestMenu = $closestMenu.parent().closest("ul");
				}
				return $closestMenu[0] || null;
			},
			getHeight: function($elm) {
				return this.getOffset($elm, true);
			},
			// returns precise width/height float values
			getOffset: function($elm, height) {
				var old;
				if ($elm.css("display") == "none") {
					old = {
						position: $elm[0].style.position,
						visibility: $elm[0].style.visibility
					};
					$elm.css({ position: "absolute", visibility: "hidden" }).show();
				}
				var box =
						$elm[0].getBoundingClientRect && $elm[0].getBoundingClientRect(),
					val =
						box &&
						(height
							? box.height || box.bottom - box.top
							: box.width || box.right - box.left);
				if (!val && val !== 0) {
					val = height ? $elm[0].offsetHeight : $elm[0].offsetWidth;
				}
				if (old) {
					$elm.hide().css(old);
				}
				return val;
			},
			getStartZIndex: function(root) {
				var zIndex = parseInt(
					this[root ? "$root" : "$firstSub"].css("z-index")
				);
				if (!root && isNaN(zIndex)) {
					zIndex = parseInt(this.$root.css("z-index"));
				}
				return !isNaN(zIndex) ? zIndex : 1;
			},
			getTouchPoint: function(e) {
				return (
					(e.touches && e.touches[0]) ||
					(e.changedTouches && e.changedTouches[0]) ||
					e
				);
			},
			getViewport: function(height) {
				var name = height ? "Height" : "Width",
					val = document.documentElement["client" + name],
					val2 = window["inner" + name];
				if (val2) {
					val = Math.min(val, val2);
				}
				return val;
			},
			getViewportHeight: function() {
				return this.getViewport(true);
			},
			getViewportWidth: function() {
				return this.getViewport();
			},
			getWidth: function($elm) {
				return this.getOffset($elm);
			},
			handleEvents: function() {
				return !this.disabled && this.isCSSOn();
			},
			handleItemEvents: function($a) {
				return this.handleEvents() && !this.isLinkInMegaMenu($a);
			},
			isCollapsible: function() {
				return this.$firstSub.css("position") == "static";
			},
			isCSSOn: function() {
				return this.$firstLink.css("display") != "inline";
			},
			isFixed: function() {
				var isFixed = this.$root.css("position") == "fixed";
				if (!isFixed) {
					this.$root.parentsUntil("body").each(function() {
						if ($(this).css("position") == "fixed") {
							isFixed = true;
							return false;
						}
					});
				}
				return isFixed;
			},
			isLinkInMegaMenu: function($a) {
				return $(this.getClosestMenu($a[0])).hasClass("mega-menu");
			},
			isTouchMode: function() {
				return !mouse || this.opts.noMouseOver || this.isCollapsible();
			},
			itemActivate: function($a, hideDeeperSubs) {
				var $ul = $a.closest("ul"),
					level = $ul.dataSM("level");
				// if for some reason the parent item is not activated (e.g. this is an API call to activate the item), activate all parent items first
				if (
					level > 1 &&
					(!this.activatedItems[level - 2] ||
						this.activatedItems[level - 2][0] != $ul.dataSM("parent-a")[0])
				) {
					var self = this;
					$(
						$ul
							.parentsUntil("[data-smartmenus-id]", "ul")
							.get()
							.reverse()
					)
						.add($ul)
						.each(function() {
							self.itemActivate($(this).dataSM("parent-a"));
						});
				}
				// hide any visible deeper level sub menus
				if (!this.isCollapsible() || hideDeeperSubs) {
					this.menuHideSubMenus(
						!this.activatedItems[level - 1] ||
							this.activatedItems[level - 1][0] != $a[0]
							? level - 1
							: level
					);
				}
				// save new active item for this level
				this.activatedItems[level - 1] = $a;
				if (this.$root.triggerHandler("activate.smapi", $a[0]) === false) {
					return;
				}
				// show the sub menu if this item has one
				var $sub = $a.dataSM("sub");
				if (
					$sub &&
					(this.isTouchMode() || !this.opts.showOnClick || this.clickActivated)
				) {
					this.menuShow($sub);
				}
			},
			itemBlur: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				this.$root.triggerHandler("blur.smapi", $a[0]);
			},
			itemClick: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				if (
					this.$touchScrollingSub &&
					this.$touchScrollingSub[0] == $a.closest("ul")[0]
				) {
					this.$touchScrollingSub = null;
					e.stopPropagation();
					return false;
				}
				if (this.$root.triggerHandler("click.smapi", $a[0]) === false) {
					return false;
				}
				var $sub = $a.dataSM("sub"),
					firstLevelSub = $sub ? $sub.dataSM("level") == 2 : false;
				if ($sub) {
					var subArrowClicked = $(e.target).is(".sub-arrow"),
						collapsible = this.isCollapsible(),
						behaviorToggle = /toggle$/.test(this.opts.collapsibleBehavior),
						behaviorLink = /link$/.test(this.opts.collapsibleBehavior),
						behaviorAccordion = /^accordion/.test(
							this.opts.collapsibleBehavior
						);
					// if the sub is hidden, try to show it
					if (!$sub.is(":visible")) {
						if (!behaviorLink || !collapsible || subArrowClicked) {
							if (this.opts.showOnClick && firstLevelSub) {
								this.clickActivated = true;
							}
							// try to activate the item and show the sub
							this.itemActivate($a, behaviorAccordion);
							// if "itemActivate" showed the sub, prevent the click so that the link is not loaded
							// if it couldn't show it, then the sub menus are disabled with an !important declaration (e.g. via mobile styles) so let the link get loaded
							if ($sub.is(":visible")) {
								this.focusActivated = true;
								return false;
							}
						}
						// if the sub is visible and we are in collapsible mode
					} else if (collapsible && (behaviorToggle || subArrowClicked)) {
						this.itemActivate($a, behaviorAccordion);
						this.menuHide($sub);
						if (behaviorToggle) {
							this.focusActivated = false;
						}
						return false;
					}
				}
				if (
					(this.opts.showOnClick && firstLevelSub) ||
					$a.hasClass("disabled") ||
					this.$root.triggerHandler("select.smapi", $a[0]) === false
				) {
					return false;
				}
			},
			itemDown: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				$a.dataSM("mousedown", true);
			},
			itemEnter: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				if (!this.isTouchMode()) {
					if (this.showTimeout) {
						clearTimeout(this.showTimeout);
						this.showTimeout = 0;
					}
					var self = this;
					this.showTimeout = setTimeout(
						function() {
							self.itemActivate($a);
						},
						this.opts.showOnClick && $a.closest("ul").dataSM("level") == 1
							? 1
							: this.opts.showTimeout
					);
				}
				this.$root.triggerHandler("mouseenter.smapi", $a[0]);
			},
			itemFocus: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				// fix (the mousedown check): in some browsers a tap/click produces consecutive focus + click events so we don't need to activate the item on focus
				if (
					this.focusActivated &&
					(!this.isTouchMode() || !$a.dataSM("mousedown")) &&
					(!this.activatedItems.length ||
						this.activatedItems[this.activatedItems.length - 1][0] != $a[0])
				) {
					this.itemActivate($a, true);
				}
				this.$root.triggerHandler("focus.smapi", $a[0]);
			},
			itemLeave: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				if (!this.isTouchMode()) {
					$a[0].blur();
					if (this.showTimeout) {
						clearTimeout(this.showTimeout);
						this.showTimeout = 0;
					}
				}
				$a.removeDataSM("mousedown");
				this.$root.triggerHandler("mouseleave.smapi", $a[0]);
			},
			menuHide: function($sub) {
				if (this.$root.triggerHandler("beforehide.smapi", $sub[0]) === false) {
					return;
				}
				if (canAnimate) {
					$sub.stop(true, true);
				}
				if ($sub.css("display") != "none") {
					var complete = function() {
						// unset z-index
						$sub.css("z-index", "");
					};
					// if sub is collapsible (mobile view)
					if (this.isCollapsible()) {
						if (canAnimate && this.opts.collapsibleHideFunction) {
							this.opts.collapsibleHideFunction.call(this, $sub, complete);
						} else {
							$sub.hide(this.opts.collapsibleHideDuration, complete);
						}
					} else {
						if (canAnimate && this.opts.hideFunction) {
							this.opts.hideFunction.call(this, $sub, complete);
						} else {
							$sub.hide(this.opts.hideDuration, complete);
						}
					}
					// deactivate scrolling if it is activated for this sub
					if ($sub.dataSM("scroll")) {
						this.menuScrollStop($sub);
						$sub
							.css({
								"touch-action": "",
								"-ms-touch-action": "",
								"-webkit-transform": "",
								transform: ""
							})
							.off(".smartmenus_scroll")
							.removeDataSM("scroll")
							.dataSM("scroll-arrows")
							.hide();
					}
					// unhighlight parent item + accessibility
					$sub
						.dataSM("parent-a")
						.removeClass("highlighted")
						.attr("aria-expanded", "false");
					$sub.attr({
						"aria-expanded": "false",
						"aria-hidden": "true"
					});
					var level = $sub.dataSM("level");
					this.activatedItems.splice(level - 1, 1);
					this.visibleSubMenus.splice($.inArray($sub, this.visibleSubMenus), 1);
					this.$root.triggerHandler("hide.smapi", $sub[0]);
				}
			},
			menuHideAll: function() {
				if (this.showTimeout) {
					clearTimeout(this.showTimeout);
					this.showTimeout = 0;
				}
				// hide all subs
				// if it's a popup, this.visibleSubMenus[0] is the root UL
				var level = this.opts.isPopup ? 1 : 0;
				for (var i = this.visibleSubMenus.length - 1; i >= level; i--) {
					this.menuHide(this.visibleSubMenus[i]);
				}
				// hide root if it's popup
				if (this.opts.isPopup) {
					if (canAnimate) {
						this.$root.stop(true, true);
					}
					if (this.$root.is(":visible")) {
						if (canAnimate && this.opts.hideFunction) {
							this.opts.hideFunction.call(this, this.$root);
						} else {
							this.$root.hide(this.opts.hideDuration);
						}
					}
				}
				this.activatedItems = [];
				this.visibleSubMenus = [];
				this.clickActivated = false;
				this.focusActivated = false;
				// reset z-index increment
				this.zIndexInc = 0;
				this.$root.triggerHandler("hideAll.smapi");
			},
			menuHideSubMenus: function(level) {
				for (var i = this.activatedItems.length - 1; i >= level; i--) {
					var $sub = this.activatedItems[i].dataSM("sub");
					if ($sub) {
						this.menuHide($sub);
					}
				}
			},
			menuInit: function($ul) {
				if (!$ul.dataSM("in-mega")) {
					// mark UL's in mega drop downs (if any) so we can neglect them
					if ($ul.hasClass("mega-menu")) {
						$ul.find("ul").dataSM("in-mega", true);
					}
					// get level (much faster than, for example, using parentsUntil)
					var level = 2,
						par = $ul[0];
					while ((par = par.parentNode.parentNode) != this.$root[0]) {
						level++;
					}
					// cache stuff for quick access
					var $a = $ul.prevAll("a").eq(-1);
					// if the link is nested (e.g. in a heading)
					if (!$a.length) {
						$a = $ul
							.prevAll()
							.find("a")
							.eq(-1);
					}
					$a.addClass("has-submenu").dataSM("sub", $ul);
					$ul
						.dataSM("parent-a", $a)
						.dataSM("level", level)
						.parent()
						.dataSM("sub", $ul);
					// accessibility
					var aId = $a.attr("id") || this.accessIdPrefix + ++this.idInc,
						ulId = $ul.attr("id") || this.accessIdPrefix + ++this.idInc;
					$a.attr({
						id: aId,
						"aria-haspopup": "true",
						"aria-controls": ulId,
						"aria-expanded": "false"
					});
					$ul.attr({
						id: ulId,
						role: "group",
						"aria-hidden": "true",
						"aria-labelledby": aId,
						"aria-expanded": "false"
					});
					// add sub indicator to parent item
					if (this.opts.subIndicators) {
						$a[this.opts.subIndicatorsPos](this.$subArrow.clone());
					}
				}
			},
			menuPosition: function($sub) {
				var $a = $sub.dataSM("parent-a"),
					$li = $a.closest("li"),
					$ul = $li.parent(),
					level = $sub.dataSM("level"),
					subW = this.getWidth($sub),
					subH = this.getHeight($sub),
					itemOffset = $a.offset(),
					itemX = itemOffset.left,
					itemY = itemOffset.top,
					itemW = this.getWidth($a),
					itemH = this.getHeight($a),
					$win = $(window),
					winX = $win.scrollLeft(),
					winY = $win.scrollTop(),
					winW = this.getViewportWidth(),
					winH = this.getViewportHeight(),
					horizontalParent =
						$ul.parent().is("[data-sm-horizontal-sub]") ||
						(level == 2 && !$ul.hasClass("sm-vertical")),
					rightToLeft =
						(this.opts.rightToLeftSubMenus && !$li.is(".nav-sm-reverse")) ||
						(!this.opts.rightToLeftSubMenus && $li.is(".nav-sm-reverse")),
					subOffsetX =
						level == 2
							? this.opts.mainMenuSubOffsetX
							: this.opts.subMenusSubOffsetX,
					subOffsetY =
						level == 2
							? this.opts.mainMenuSubOffsetY
							: this.opts.subMenusSubOffsetY,
					x,
					y;
				if (horizontalParent) {
					x = rightToLeft ? itemW - subW - subOffsetX : subOffsetX;
					y = this.opts.bottomToTopSubMenus
						? -subH - subOffsetY
						: itemH + subOffsetY;
				} else {
					x = rightToLeft ? subOffsetX - subW : itemW - subOffsetX;
					y = this.opts.bottomToTopSubMenus
						? itemH - subOffsetY - subH
						: subOffsetY;
				}
				if (this.opts.keepInViewport) {
					var absX = itemX + x,
						absY = itemY + y;
					if (rightToLeft && absX < winX) {
						x = horizontalParent ? winX - absX + x : itemW - subOffsetX;
					} else if (!rightToLeft && absX + subW > winX + winW) {
						x = horizontalParent
							? winX + winW - subW - absX + x
							: subOffsetX - subW;
					}
					if (!horizontalParent) {
						if (subH < winH && absY + subH > winY + winH) {
							y += winY + winH - subH - absY;
						} else if (subH >= winH || absY < winY) {
							y += winY - absY;
						}
					}
					// do we need scrolling?
					// 0.49 used for better precision when dealing with float values
					if (
						(horizontalParent &&
							(absY + subH > winY + winH + 0.49 || absY < winY)) ||
						(!horizontalParent && subH > winH + 0.49)
					) {
						var self = this;
						if (!$sub.dataSM("scroll-arrows")) {
							$sub.dataSM(
								"scroll-arrows",
								$([
									$(
										'<span class="scroll-up"><span class="scroll-up-arrow"></span></span>'
									)[0],
									$(
										'<span class="scroll-down"><span class="scroll-down-arrow"></span></span>'
									)[0]
								])
									.on({
										mouseenter: function() {
											$sub.dataSM("scroll").up = $(this).hasClass("scroll-up");
											self.menuScroll($sub);
										},
										mouseleave: function(e) {
											self.menuScrollStop($sub);
											self.menuScrollOut($sub, e);
										},
										"mousewheel DOMMouseScroll": function(e) {
											e.preventDefault();
										}
									})
									.insertAfter($sub)
							);
						}
						// bind scroll events and save scroll data for this sub
						var eNS = ".smartmenus_scroll";
						$sub
							.dataSM("scroll", {
								y: this.cssTransforms3d ? 0 : y - itemH,
								step: 1,
								// cache stuff for faster recalcs later
								itemH: itemH,
								subH: subH,
								arrowDownH: this.getHeight($sub.dataSM("scroll-arrows").eq(1))
							})
							.on(
								getEventsNS(
									{
										mouseover: function(e) {
											self.menuScrollOver($sub, e);
										},
										mouseout: function(e) {
											self.menuScrollOut($sub, e);
										},
										"mousewheel DOMMouseScroll": function(e) {
											self.menuScrollMousewheel($sub, e);
										}
									},
									eNS
								)
							)
							.dataSM("scroll-arrows")
							.css({
								top: "auto",
								left: "0",
								marginLeft: x + (parseInt($sub.css("border-left-width")) || 0),
								width:
									subW -
									(parseInt($sub.css("border-left-width")) || 0) -
									(parseInt($sub.css("border-right-width")) || 0),
								zIndex: $sub.css("z-index")
							})
							.eq(horizontalParent && this.opts.bottomToTopSubMenus ? 0 : 1)
							.show();
						// when a menu tree is fixed positioned we allow scrolling via touch too
						// since there is no other way to access such long sub menus if no mouse is present
						if (this.isFixed()) {
							var events = {};
							events[
								touchEvents
									? "touchstart touchmove touchend"
									: "pointerdown pointermove pointerup MSPointerDown MSPointerMove MSPointerUp"
							] = function(e) {
								self.menuScrollTouch($sub, e);
							};
							$sub
								.css({ "touch-action": "none", "-ms-touch-action": "none" })
								.on(getEventsNS(events, eNS));
						}
					}
				}
				$sub.css({
					top: "auto",
					left: "0",
					marginLeft: x,
					marginTop: y - itemH
				});
			},
			menuScroll: function($sub, once, step) {
				var data = $sub.dataSM("scroll"),
					$arrows = $sub.dataSM("scroll-arrows"),
					end = data.up ? data.upEnd : data.downEnd,
					diff;
				if (!once && data.momentum) {
					data.momentum *= 0.92;
					diff = data.momentum;
					if (diff < 0.5) {
						this.menuScrollStop($sub);
						return;
					}
				} else {
					diff =
						step ||
						(once || !this.opts.scrollAccelerate
							? this.opts.scrollStep
							: Math.floor(data.step));
				}
				// hide any visible deeper level sub menus
				var level = $sub.dataSM("level");
				if (
					this.activatedItems[level - 1] &&
					this.activatedItems[level - 1].dataSM("sub") &&
					this.activatedItems[level - 1].dataSM("sub").is(":visible")
				) {
					this.menuHideSubMenus(level - 1);
				}
				data.y =
					(data.up && end <= data.y) || (!data.up && end >= data.y)
						? data.y
						: Math.abs(end - data.y) > diff
						? data.y + (data.up ? diff : -diff)
						: end;
				$sub.css(
					this.cssTransforms3d
						? {
								"-webkit-transform": "translate3d(0, " + data.y + "px, 0)",
								transform: "translate3d(0, " + data.y + "px, 0)"
						  }
						: { marginTop: data.y }
				);
				// show opposite arrow if appropriate
				if (
					mouse &&
					((data.up && data.y > data.downEnd) ||
						(!data.up && data.y < data.upEnd))
				) {
					$arrows.eq(data.up ? 1 : 0).show();
				}
				// if we've reached the end
				if (data.y == end) {
					if (mouse) {
						$arrows.eq(data.up ? 0 : 1).hide();
					}
					this.menuScrollStop($sub);
				} else if (!once) {
					if (this.opts.scrollAccelerate && data.step < this.opts.scrollStep) {
						data.step += 0.2;
					}
					var self = this;
					this.scrollTimeout = requestAnimationFrame(function() {
						self.menuScroll($sub);
					});
				}
			},
			menuScrollMousewheel: function($sub, e) {
				if (this.getClosestMenu(e.target) == $sub[0]) {
					e = e.originalEvent;
					var up = (e.wheelDelta || -e.detail) > 0;
					if (
						$sub
							.dataSM("scroll-arrows")
							.eq(up ? 0 : 1)
							.is(":visible")
					) {
						$sub.dataSM("scroll").up = up;
						this.menuScroll($sub, true);
					}
				}
				e.preventDefault();
			},
			menuScrollOut: function($sub, e) {
				if (mouse) {
					if (
						!/^scroll-(up|down)/.test((e.relatedTarget || "").className) &&
						(($sub[0] != e.relatedTarget &&
							!$.contains($sub[0], e.relatedTarget)) ||
							this.getClosestMenu(e.relatedTarget) != $sub[0])
					) {
						$sub.dataSM("scroll-arrows").css("visibility", "hidden");
					}
				}
			},
			menuScrollOver: function($sub, e) {
				if (mouse) {
					if (
						!/^scroll-(up|down)/.test(e.target.className) &&
						this.getClosestMenu(e.target) == $sub[0]
					) {
						this.menuScrollRefreshData($sub);
						var data = $sub.dataSM("scroll"),
							upEnd =
								$(window).scrollTop() -
								$sub.dataSM("parent-a").offset().top -
								data.itemH;
						$sub
							.dataSM("scroll-arrows")
							.eq(0)
							.css("margin-top", upEnd)
							.end()
							.eq(1)
							.css(
								"margin-top",
								upEnd + this.getViewportHeight() - data.arrowDownH
							)
							.end()
							.css("visibility", "visible");
					}
				}
			},
			menuScrollRefreshData: function($sub) {
				var data = $sub.dataSM("scroll"),
					upEnd =
						$(window).scrollTop() -
						$sub.dataSM("parent-a").offset().top -
						data.itemH;
				if (this.cssTransforms3d) {
					upEnd = -(parseFloat($sub.css("margin-top")) - upEnd);
				}
				$.extend(data, {
					upEnd: upEnd,
					downEnd: upEnd + this.getViewportHeight() - data.subH
				});
			},
			menuScrollStop: function($sub) {
				if (this.scrollTimeout) {
					cancelAnimationFrame(this.scrollTimeout);
					this.scrollTimeout = 0;
					$sub.dataSM("scroll").step = 1;
					return true;
				}
			},
			menuScrollTouch: function($sub, e) {
				e = e.originalEvent;
				if (isTouchEvent(e)) {
					var touchPoint = this.getTouchPoint(e);
					// neglect event if we touched a visible deeper level sub menu
					if (this.getClosestMenu(touchPoint.target) == $sub[0]) {
						var data = $sub.dataSM("scroll");
						if (/(start|down)$/i.test(e.type)) {
							if (this.menuScrollStop($sub)) {
								// if we were scrolling, just stop and don't activate any link on the first touch
								e.preventDefault();
								this.$touchScrollingSub = $sub;
							} else {
								this.$touchScrollingSub = null;
							}
							// update scroll data since the user might have zoomed, etc.
							this.menuScrollRefreshData($sub);
							// extend it with the touch properties
							$.extend(data, {
								touchStartY: touchPoint.pageY,
								touchStartTime: e.timeStamp
							});
						} else if (/move$/i.test(e.type)) {
							var prevY =
								data.touchY !== undefined ? data.touchY : data.touchStartY;
							if (prevY !== undefined && prevY != touchPoint.pageY) {
								this.$touchScrollingSub = $sub;
								var up = prevY < touchPoint.pageY;
								// changed direction? reset...
								if (data.up !== undefined && data.up != up) {
									$.extend(data, {
										touchStartY: touchPoint.pageY,
										touchStartTime: e.timeStamp
									});
								}
								$.extend(data, {
									up: up,
									touchY: touchPoint.pageY
								});
								this.menuScroll($sub, true, Math.abs(touchPoint.pageY - prevY));
							}
							e.preventDefault();
						} else {
							// touchend/pointerup
							if (data.touchY !== undefined) {
								if (
									(data.momentum =
										Math.pow(
											Math.abs(touchPoint.pageY - data.touchStartY) /
												(e.timeStamp - data.touchStartTime),
											2
										) * 15)
								) {
									this.menuScrollStop($sub);
									this.menuScroll($sub);
									e.preventDefault();
								}
								delete data.touchY;
							}
						}
					}
				}
			},
			menuShow: function($sub) {
				if (!$sub.dataSM("beforefirstshowfired")) {
					$sub.dataSM("beforefirstshowfired", true);
					if (
						this.$root.triggerHandler("beforefirstshow.smapi", $sub[0]) ===
						false
					) {
						return;
					}
				}
				if (this.$root.triggerHandler("beforeshow.smapi", $sub[0]) === false) {
					return;
				}
				$sub.dataSM("shown-before", true);
				if (canAnimate) {
					$sub.stop(true, true);
				}
				if (!$sub.is(":visible")) {
					// highlight parent item
					var $a = $sub.dataSM("parent-a"),
						collapsible = this.isCollapsible();
					if (this.opts.keepHighlighted || collapsible) {
						$a.addClass("highlighted");
					}
					if (collapsible) {
						$sub
							.removeClass("sm-nowrap")
							.css({
								zIndex: "",
								width: "auto",
								minWidth: "",
								maxWidth: "",
								top: "",
								left: "",
								marginLeft: "",
								marginTop: ""
							});
					} else {
						// set z-index
						$sub.css(
							"z-index",
							(this.zIndexInc = (this.zIndexInc || this.getStartZIndex()) + 1)
						);
						// min/max-width fix - no way to rely purely on CSS as all UL's are nested
						if (this.opts.subMenusMinWidth || this.opts.subMenusMaxWidth) {
							$sub
								.css({ width: "auto", minWidth: "", maxWidth: "" })
								.addClass("sm-nowrap");
							if (this.opts.subMenusMinWidth) {
								$sub.css("min-width", this.opts.subMenusMinWidth);
							}
							if (this.opts.subMenusMaxWidth) {
								var noMaxWidth = this.getWidth($sub);
								$sub.css("max-width", this.opts.subMenusMaxWidth);
								if (noMaxWidth > this.getWidth($sub)) {
									$sub
										.removeClass("sm-nowrap")
										.css("width", this.opts.subMenusMaxWidth);
								}
							}
						}
						this.menuPosition($sub);
					}
					var complete = function() {
						// fix: "overflow: hidden;" is not reset on animation complete in jQuery < 1.9.0 in Chrome when global "box-sizing: border-box;" is used
						$sub.css("overflow", "");
					};
					// if sub is collapsible (mobile view)
					if (collapsible) {
						if (canAnimate && this.opts.collapsibleShowFunction) {
							this.opts.collapsibleShowFunction.call(this, $sub, complete);
						} else {
							$sub.show(this.opts.collapsibleShowDuration, complete);
						}
					} else {
						if (canAnimate && this.opts.showFunction) {
							this.opts.showFunction.call(this, $sub, complete);
						} else {
							$sub.show(this.opts.showDuration, complete);
						}
					}
					// accessibility
					$a.attr("aria-expanded", "true");
					$sub.attr({
						"aria-expanded": "true",
						"aria-hidden": "false"
					});
					// store sub menu in visible array
					this.visibleSubMenus.push($sub);
					this.$root.triggerHandler("show.smapi", $sub[0]);
				}
			},
			popupHide: function(noHideTimeout) {
				if (this.hideTimeout) {
					clearTimeout(this.hideTimeout);
					this.hideTimeout = 0;
				}
				var self = this;
				this.hideTimeout = setTimeout(
					function() {
						self.menuHideAll();
					},
					noHideTimeout ? 1 : this.opts.hideTimeout
				);
			},
			popupShow: function(left, top) {
				if (!this.opts.isPopup) {
					alert(
						'SmartMenus jQuery Error:\n\nIf you want to show this menu via the "popupShow" method, set the isPopup:true option.'
					);
					return;
				}
				if (this.hideTimeout) {
					clearTimeout(this.hideTimeout);
					this.hideTimeout = 0;
				}
				this.$root.dataSM("shown-before", true);
				if (canAnimate) {
					this.$root.stop(true, true);
				}
				if (!this.$root.is(":visible")) {
					this.$root.css({ left: left, top: top });
					// show menu
					var self = this,
						complete = function() {
							self.$root.css("overflow", "");
						};
					if (canAnimate && this.opts.showFunction) {
						this.opts.showFunction.call(this, this.$root, complete);
					} else {
						this.$root.show(this.opts.showDuration, complete);
					}
					this.visibleSubMenus[0] = this.$root;
				}
			},
			refresh: function() {
				this.destroy(true);
				this.init(true);
			},
			rootKeyDown: function(e) {
				if (!this.handleEvents()) {
					return;
				}
				switch (e.keyCode) {
					case 27: // reset on Esc
						var $activeTopItem = this.activatedItems[0];
						if ($activeTopItem) {
							this.menuHideAll();
							$activeTopItem[0].focus();
							var $sub = $activeTopItem.dataSM("sub");
							if ($sub) {
								this.menuHide($sub);
							}
						}
						break;
					case 32: // activate item's sub on Space
						var $target = $(e.target);
						if ($target.is("a") && this.handleItemEvents($target)) {
							var $sub = $target.dataSM("sub");
							if ($sub && !$sub.is(":visible")) {
								this.itemClick({ currentTarget: e.target });
								e.preventDefault();
							}
						}
						break;
				}
			},
			rootOut: function(e) {
				if (
					!this.handleEvents() ||
					this.isTouchMode() ||
					e.target == this.$root[0]
				) {
					return;
				}
				if (this.hideTimeout) {
					clearTimeout(this.hideTimeout);
					this.hideTimeout = 0;
				}
				if (!this.opts.showOnClick || !this.opts.hideOnClick) {
					var self = this;
					this.hideTimeout = setTimeout(function() {
						self.menuHideAll();
					}, this.opts.hideTimeout);
				}
			},
			rootOver: function(e) {
				if (
					!this.handleEvents() ||
					this.isTouchMode() ||
					e.target == this.$root[0]
				) {
					return;
				}
				if (this.hideTimeout) {
					clearTimeout(this.hideTimeout);
					this.hideTimeout = 0;
				}
			},
			winResize: function(e) {
				if (!this.handleEvents()) {
					// we still need to resize the disable overlay if it's visible
					if (this.$disableOverlay) {
						var pos = this.$root.offset();
						this.$disableOverlay.css({
							top: pos.top,
							left: pos.left,
							width: this.$root.outerWidth(),
							height: this.$root.outerHeight()
						});
					}
					return;
				}
				// hide sub menus on resize - on mobile do it only on orientation change
				if (
					!("onorientationchange" in window) ||
					e.type == "orientationchange"
				) {
					var collapsible = this.isCollapsible();
					// if it was collapsible before resize and still is, don't do it
					if (!(this.wasCollapsible && collapsible)) {
						if (this.activatedItems.length) {
							this.activatedItems[this.activatedItems.length - 1][0].blur();
						}
						this.menuHideAll();
					}
					this.wasCollapsible = collapsible;
				}
			}
		}
	});
	$.fn.dataSM = function(key, val) {
		if (val) {
			return this.data(key + "_smartmenus", val);
		}
		return this.data(key + "_smartmenus");
	};
	$.fn.removeDataSM = function(key) {
		return this.removeData(key + "_smartmenus");
	};
	$.fn.smartmenus = function(options) {
		if (typeof options == "string") {
			var args = arguments,
				method = options;
			Array.prototype.shift.call(args);
			return this.each(function() {
				var smartmenus = $(this).data("smartmenus");
				if (smartmenus && smartmenus[method]) {
					smartmenus[method].apply(smartmenus, args);
				}
			});
		}
		return this.each(function() {
			// [data-sm-options] attribute on the root UL
			var dataOpts = $(this).data("sm-options") || null;
			if (dataOpts) {
				try {
					dataOpts = eval("(" + dataOpts + ")");
				} catch (e) {
					dataOpts = null;
					alert(
						'ERROR\n\nSmartMenus jQuery init:\nInvalid "data-sm-options" attribute value syntax.'
					);
				}
			}
			new $.SmartMenus(
				this,
				$.extend({}, $.fn.smartmenus.defaults, options, dataOpts)
			);
		});
	};
	// default settings
	$.fn.smartmenus.defaults = {
		isPopup: false, // is this a popup menu (can be shown via the popupShow/popupHide methods) or a permanent menu bar
		mainMenuSubOffsetX: 0, // pixels offset from default position
		mainMenuSubOffsetY: 0, // pixels offset from default position
		subMenusSubOffsetX: 0, // pixels offset from default position
		subMenusSubOffsetY: 0, // pixels offset from default position
		subMenusMinWidth: "10em", // min-width for the sub menus (any CSS unit) - if set, the fixed width set in CSS will be ignored
		subMenusMaxWidth: "20em", // max-width for the sub menus (any CSS unit) - if set, the fixed width set in CSS will be ignored
		subIndicators: true, // create sub menu indicators - creates a SPAN and inserts it in the A
		subIndicatorsPos: "append", // position of the SPAN relative to the menu item content ('append', 'prepend')
		subIndicatorsText: "", // [optionally] add text in the SPAN (e.g. '+') (you may want to check the CSS for the sub indicators too)
		scrollStep: 30, // pixels step when scrolling long sub menus that do not fit in the viewport height
		scrollAccelerate: true, // accelerate scrolling or use a fixed step
		showTimeout: 250, // timeout before showing the sub menus
		hideTimeout: 500, // timeout before hiding the sub menus
		showDuration: 0, // duration for show animation - set to 0 for no animation - matters only if showFunction:null
		showFunction: null, // custom function to use when showing a sub menu (the default is the jQuery 'show')
		// don't forget to call complete() at the end of whatever you do
		// e.g.: function($ul, complete) { $ul.fadeIn(250, complete); }
		hideDuration: 0, // duration for hide animation - set to 0 for no animation - matters only if hideFunction:null
		hideFunction: function($ul, complete) {
			$ul.fadeOut(200, complete);
		}, // custom function to use when hiding a sub menu (the default is the jQuery 'hide')
		// don't forget to call complete() at the end of whatever you do
		// e.g.: function($ul, complete) { $ul.fadeOut(250, complete); }
		collapsibleShowDuration: 0, // duration for show animation for collapsible sub menus - matters only if collapsibleShowFunction:null
		collapsibleShowFunction: function($ul, complete) {
			$ul.slideDown(200, complete);
		}, // custom function to use when showing a collapsible sub menu
		// (i.e. when mobile styles are used to make the sub menus collapsible)
		collapsibleHideDuration: 0, // duration for hide animation for collapsible sub menus - matters only if collapsibleHideFunction:null
		collapsibleHideFunction: function($ul, complete) {
			$ul.slideUp(200, complete);
		}, // custom function to use when hiding a collapsible sub menu
		// (i.e. when mobile styles are used to make the sub menus collapsible)
		showOnClick: false, // show the first-level sub menus onclick instead of onmouseover (i.e. mimic desktop app menus) (matters only for mouse input)
		hideOnClick: true, // hide the sub menus on click/tap anywhere on the page
		noMouseOver: false, // disable sub menus activation onmouseover (i.e. behave like in touch mode - use just mouse clicks) (matters only for mouse input)
		keepInViewport: true, // reposition the sub menus if needed to make sure they always appear inside the viewport
		keepHighlighted: true, // keep all ancestor items of the current sub menu highlighted (adds the 'highlighted' class to the A's)
		markCurrentItem: false, // automatically add the 'current' class to the A element of the item linking to the current URL
		markCurrentTree: true, // add the 'current' class also to the A elements of all ancestor items of the current item
		rightToLeftSubMenus: false, // right to left display of the sub menus (check the CSS for the sub indicators' position)
		bottomToTopSubMenus: false, // bottom to top display of the sub menus
		collapsibleBehavior: "default" // parent items behavior in collapsible (mobile) view ('default', 'toggle', 'link', 'accordion', 'accordion-toggle', 'accordion-link')
		// 'default' - first tap on parent item expands sub, second tap loads its link
		// 'toggle' - the whole parent item acts just as a toggle button for its sub menu (expands/collapses on each tap)
		// 'link' - the parent item acts as a regular item (first tap loads its link), the sub menu can be expanded only via the +/- button
		// 'accordion' - like 'default' but on expand also resets any visible sub menus from deeper levels or other branches
		// 'accordion-toggle' - like 'toggle' but on expand also resets any visible sub menus from deeper levels or other branches
		// 'accordion-link' - like 'link' but on expand also resets any visible sub menus from deeper levels or other branches
	};
	return $;
});
!function(i){"use strict";"function"==typeof define&&define.amd?define(["jquery"],i):"undefined"!=typeof exports?module.exports=i(require("jquery")):i(jQuery)}(function(i){"use strict";var e=window.Slick||{};(e=function(){var e=0;return function(t,o){var s,n=this;n.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:i(t),appendDots:i(t),arrows:!0,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(e,t){return i('<button type="button" />').text(t+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,focusOnChange:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},n.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:!1,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,swiping:!1,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},i.extend(n,n.initials),n.activeBreakpoint=null,n.animType=null,n.animProp=null,n.breakpoints=[],n.breakpointSettings=[],n.cssTransitions=!1,n.focussed=!1,n.interrupted=!1,n.hidden="hidden",n.paused=!0,n.positionProp=null,n.respondTo=null,n.rowCount=1,n.shouldClick=!0,n.$slider=i(t),n.$slidesCache=null,n.transformType=null,n.transitionType=null,n.visibilityChange="visibilitychange",n.windowWidth=0,n.windowTimer=null,s=i(t).data("slick")||{},n.options=i.extend({},n.defaults,o,s),n.currentSlide=n.options.initialSlide,n.originalSettings=n.options,void 0!==document.mozHidden?(n.hidden="mozHidden",n.visibilityChange="mozvisibilitychange"):void 0!==document.webkitHidden&&(n.hidden="webkitHidden",n.visibilityChange="webkitvisibilitychange"),n.autoPlay=i.proxy(n.autoPlay,n),n.autoPlayClear=i.proxy(n.autoPlayClear,n),n.autoPlayIterator=i.proxy(n.autoPlayIterator,n),n.changeSlide=i.proxy(n.changeSlide,n),n.clickHandler=i.proxy(n.clickHandler,n),n.selectHandler=i.proxy(n.selectHandler,n),n.setPosition=i.proxy(n.setPosition,n),n.swipeHandler=i.proxy(n.swipeHandler,n),n.dragHandler=i.proxy(n.dragHandler,n),n.keyHandler=i.proxy(n.keyHandler,n),n.instanceUid=e++,n.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,n.registerBreakpoints(),n.init(!0)}}()).prototype.activateADA=function(){this.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},e.prototype.addSlide=e.prototype.slickAdd=function(e,t,o){var s=this;if("boolean"==typeof t)o=t,t=null;else if(t<0||t>=s.slideCount)return!1;s.unload(),"number"==typeof t?0===t&&0===s.$slides.length?i(e).appendTo(s.$slideTrack):o?i(e).insertBefore(s.$slides.eq(t)):i(e).insertAfter(s.$slides.eq(t)):!0===o?i(e).prependTo(s.$slideTrack):i(e).appendTo(s.$slideTrack),s.$slides=s.$slideTrack.children(this.options.slide),s.$slideTrack.children(this.options.slide).detach(),s.$slideTrack.append(s.$slides),s.$slides.each(function(e,t){i(t).attr("data-slick-index",e)}),s.$slidesCache=s.$slides,s.reinit()},e.prototype.animateHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.animate({height:e},i.options.speed)}},e.prototype.animateSlide=function(e,t){var o={},s=this;s.animateHeight(),!0===s.options.rtl&&!1===s.options.vertical&&(e=-e),!1===s.transformsEnabled?!1===s.options.vertical?s.$slideTrack.animate({left:e},s.options.speed,s.options.easing,t):s.$slideTrack.animate({top:e},s.options.speed,s.options.easing,t):!1===s.cssTransitions?(!0===s.options.rtl&&(s.currentLeft=-s.currentLeft),i({animStart:s.currentLeft}).animate({animStart:e},{duration:s.options.speed,easing:s.options.easing,step:function(i){i=Math.ceil(i),!1===s.options.vertical?(o[s.animType]="translate("+i+"px, 0px)",s.$slideTrack.css(o)):(o[s.animType]="translate(0px,"+i+"px)",s.$slideTrack.css(o))},complete:function(){t&&t.call()}})):(s.applyTransition(),e=Math.ceil(e),!1===s.options.vertical?o[s.animType]="translate3d("+e+"px, 0px, 0px)":o[s.animType]="translate3d(0px,"+e+"px, 0px)",s.$slideTrack.css(o),t&&setTimeout(function(){s.disableTransition(),t.call()},s.options.speed))},e.prototype.getNavTarget=function(){var e=this,t=e.options.asNavFor;return t&&null!==t&&(t=i(t).not(e.$slider)),t},e.prototype.asNavFor=function(e){var t=this.getNavTarget();null!==t&&"object"==typeof t&&t.each(function(){var t=i(this).slick("getSlick");t.unslicked||t.slideHandler(e,!0)})},e.prototype.applyTransition=function(i){var e=this,t={};!1===e.options.fade?t[e.transitionType]=e.transformType+" "+e.options.speed+"ms "+e.options.cssEase:t[e.transitionType]="opacity "+e.options.speed+"ms "+e.options.cssEase,!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.autoPlay=function(){var i=this;i.autoPlayClear(),i.slideCount>i.options.slidesToShow&&(i.autoPlayTimer=setInterval(i.autoPlayIterator,i.options.autoplaySpeed))},e.prototype.autoPlayClear=function(){var i=this;i.autoPlayTimer&&clearInterval(i.autoPlayTimer)},e.prototype.autoPlayIterator=function(){var i=this,e=i.currentSlide+i.options.slidesToScroll;i.paused||i.interrupted||i.focussed||(!1===i.options.infinite&&(1===i.direction&&i.currentSlide+1===i.slideCount-1?i.direction=0:0===i.direction&&(e=i.currentSlide-i.options.slidesToScroll,i.currentSlide-1==0&&(i.direction=1))),i.slideHandler(e))},e.prototype.buildArrows=function(){var e=this;!0===e.options.arrows&&(e.$prevArrow=i(e.options.prevArrow).addClass("slick-arrow"),e.$nextArrow=i(e.options.nextArrow).addClass("slick-arrow"),e.slideCount>e.options.slidesToShow?(e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.prependTo(e.options.appendArrows),e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.appendTo(e.options.appendArrows),!0!==e.options.infinite&&e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},e.prototype.buildDots=function(){var e,t,o=this;if(!0===o.options.dots){for(o.$slider.addClass("slick-dotted"),t=i("<ul />").addClass(o.options.dotsClass),e=0;e<=o.getDotCount();e+=1)t.append(i("<li />").append(o.options.customPaging.call(this,o,e)));o.$dots=t.appendTo(o.options.appendDots),o.$dots.find("li").first().addClass("slick-active")}},e.prototype.buildOut=function(){var e=this;e.$slides=e.$slider.children(e.options.slide+":not(.slick-cloned)").addClass("slick-slide"),e.slideCount=e.$slides.length,e.$slides.each(function(e,t){i(t).attr("data-slick-index",e).data("originalStyling",i(t).attr("style")||"")}),e.$slider.addClass("slick-slider"),e.$slideTrack=0===e.slideCount?i('<div class="slick-track"/>').appendTo(e.$slider):e.$slides.wrapAll('<div class="slick-track"/>').parent(),e.$list=e.$slideTrack.wrap('<div class="slick-list"/>').parent(),e.$slideTrack.css("opacity",0),!0!==e.options.centerMode&&!0!==e.options.swipeToSlide||(e.options.slidesToScroll=1),i("img[data-lazy]",e.$slider).not("[src]").addClass("slick-loading"),e.setupInfinite(),e.buildArrows(),e.buildDots(),e.updateDots(),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),!0===e.options.draggable&&e.$list.addClass("draggable")},e.prototype.buildRows=function(){var i,e,t,o,s,n,r,l=this;if(o=document.createDocumentFragment(),n=l.$slider.children(),l.options.rows>1){for(r=l.options.slidesPerRow*l.options.rows,s=Math.ceil(n.length/r),i=0;i<s;i++){var d=document.createElement("div");for(e=0;e<l.options.rows;e++){var a=document.createElement("div");for(t=0;t<l.options.slidesPerRow;t++){var c=i*r+(e*l.options.slidesPerRow+t);n.get(c)&&a.appendChild(n.get(c))}d.appendChild(a)}o.appendChild(d)}l.$slider.empty().append(o),l.$slider.children().children().children().css({width:100/l.options.slidesPerRow+"%",display:"inline-block"})}},e.prototype.checkResponsive=function(e,t){var o,s,n,r=this,l=!1,d=r.$slider.width(),a=window.innerWidth||i(window).width();if("window"===r.respondTo?n=a:"slider"===r.respondTo?n=d:"min"===r.respondTo&&(n=Math.min(a,d)),r.options.responsive&&r.options.responsive.length&&null!==r.options.responsive){s=null;for(o in r.breakpoints)r.breakpoints.hasOwnProperty(o)&&(!1===r.originalSettings.mobileFirst?n<r.breakpoints[o]&&(s=r.breakpoints[o]):n>r.breakpoints[o]&&(s=r.breakpoints[o]));null!==s?null!==r.activeBreakpoint?(s!==r.activeBreakpoint||t)&&(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):null!==r.activeBreakpoint&&(r.activeBreakpoint=null,r.options=r.originalSettings,!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e),l=s),e||!1===l||r.$slider.trigger("breakpoint",[r,l])}},e.prototype.changeSlide=function(e,t){var o,s,n,r=this,l=i(e.currentTarget);switch(l.is("a")&&e.preventDefault(),l.is("li")||(l=l.closest("li")),n=r.slideCount%r.options.slidesToScroll!=0,o=n?0:(r.slideCount-r.currentSlide)%r.options.slidesToScroll,e.data.message){case"previous":s=0===o?r.options.slidesToScroll:r.options.slidesToShow-o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide-s,!1,t);break;case"next":s=0===o?r.options.slidesToScroll:o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide+s,!1,t);break;case"index":var d=0===e.data.index?0:e.data.index||l.index()*r.options.slidesToScroll;r.slideHandler(r.checkNavigable(d),!1,t),l.children().trigger("focus");break;default:return}},e.prototype.checkNavigable=function(i){var e,t;if(e=this.getNavigableIndexes(),t=0,i>e[e.length-1])i=e[e.length-1];else for(var o in e){if(i<e[o]){i=t;break}t=e[o]}return i},e.prototype.cleanUpEvents=function(){var e=this;e.options.dots&&null!==e.$dots&&(i("li",e.$dots).off("click.slick",e.changeSlide).off("mouseenter.slick",i.proxy(e.interrupt,e,!0)).off("mouseleave.slick",i.proxy(e.interrupt,e,!1)),!0===e.options.accessibility&&e.$dots.off("keydown.slick",e.keyHandler)),e.$slider.off("focus.slick blur.slick"),!0===e.options.arrows&&e.slideCount>e.options.slidesToShow&&(e.$prevArrow&&e.$prevArrow.off("click.slick",e.changeSlide),e.$nextArrow&&e.$nextArrow.off("click.slick",e.changeSlide),!0===e.options.accessibility&&(e.$prevArrow&&e.$prevArrow.off("keydown.slick",e.keyHandler),e.$nextArrow&&e.$nextArrow.off("keydown.slick",e.keyHandler))),e.$list.off("touchstart.slick mousedown.slick",e.swipeHandler),e.$list.off("touchmove.slick mousemove.slick",e.swipeHandler),e.$list.off("touchend.slick mouseup.slick",e.swipeHandler),e.$list.off("touchcancel.slick mouseleave.slick",e.swipeHandler),e.$list.off("click.slick",e.clickHandler),i(document).off(e.visibilityChange,e.visibility),e.cleanUpSlideEvents(),!0===e.options.accessibility&&e.$list.off("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().off("click.slick",e.selectHandler),i(window).off("orientationchange.slick.slick-"+e.instanceUid,e.orientationChange),i(window).off("resize.slick.slick-"+e.instanceUid,e.resize),i("[draggable!=true]",e.$slideTrack).off("dragstart",e.preventDefault),i(window).off("load.slick.slick-"+e.instanceUid,e.setPosition)},e.prototype.cleanUpSlideEvents=function(){var e=this;e.$list.off("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.off("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.cleanUpRows=function(){var i,e=this;e.options.rows>1&&((i=e.$slides.children().children()).removeAttr("style"),e.$slider.empty().append(i))},e.prototype.clickHandler=function(i){!1===this.shouldClick&&(i.stopImmediatePropagation(),i.stopPropagation(),i.preventDefault())},e.prototype.destroy=function(e){var t=this;t.autoPlayClear(),t.touchObject={},t.cleanUpEvents(),i(".slick-cloned",t.$slider).detach(),t.$dots&&t.$dots.remove(),t.$prevArrow&&t.$prevArrow.length&&(t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.prevArrow)&&t.$prevArrow.remove()),t.$nextArrow&&t.$nextArrow.length&&(t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.nextArrow)&&t.$nextArrow.remove()),t.$slides&&(t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){i(this).attr("style",i(this).data("originalStyling"))}),t.$slideTrack.children(this.options.slide).detach(),t.$slideTrack.detach(),t.$list.detach(),t.$slider.append(t.$slides)),t.cleanUpRows(),t.$slider.removeClass("slick-slider"),t.$slider.removeClass("slick-initialized"),t.$slider.removeClass("slick-dotted"),t.unslicked=!0,e||t.$slider.trigger("destroy",[t])},e.prototype.disableTransition=function(i){var e=this,t={};t[e.transitionType]="",!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.fadeSlide=function(i,e){var t=this;!1===t.cssTransitions?(t.$slides.eq(i).css({zIndex:t.options.zIndex}),t.$slides.eq(i).animate({opacity:1},t.options.speed,t.options.easing,e)):(t.applyTransition(i),t.$slides.eq(i).css({opacity:1,zIndex:t.options.zIndex}),e&&setTimeout(function(){t.disableTransition(i),e.call()},t.options.speed))},e.prototype.fadeSlideOut=function(i){var e=this;!1===e.cssTransitions?e.$slides.eq(i).animate({opacity:0,zIndex:e.options.zIndex-2},e.options.speed,e.options.easing):(e.applyTransition(i),e.$slides.eq(i).css({opacity:0,zIndex:e.options.zIndex-2}))},e.prototype.filterSlides=e.prototype.slickFilter=function(i){var e=this;null!==i&&(e.$slidesCache=e.$slides,e.unload(),e.$slideTrack.children(this.options.slide).detach(),e.$slidesCache.filter(i).appendTo(e.$slideTrack),e.reinit())},e.prototype.focusHandler=function(){var e=this;e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick","*",function(t){t.stopImmediatePropagation();var o=i(this);setTimeout(function(){e.options.pauseOnFocus&&(e.focussed=o.is(":focus"),e.autoPlay())},0)})},e.prototype.getCurrent=e.prototype.slickCurrentSlide=function(){return this.currentSlide},e.prototype.getDotCount=function(){var i=this,e=0,t=0,o=0;if(!0===i.options.infinite)if(i.slideCount<=i.options.slidesToShow)++o;else for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else if(!0===i.options.centerMode)o=i.slideCount;else if(i.options.asNavFor)for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else o=1+Math.ceil((i.slideCount-i.options.slidesToShow)/i.options.slidesToScroll);return o-1},e.prototype.getLeft=function(i){var e,t,o,s,n=this,r=0;return n.slideOffset=0,t=n.$slides.first().outerHeight(!0),!0===n.options.infinite?(n.slideCount>n.options.slidesToShow&&(n.slideOffset=n.slideWidth*n.options.slidesToShow*-1,s=-1,!0===n.options.vertical&&!0===n.options.centerMode&&(2===n.options.slidesToShow?s=-1.5:1===n.options.slidesToShow&&(s=-2)),r=t*n.options.slidesToShow*s),n.slideCount%n.options.slidesToScroll!=0&&i+n.options.slidesToScroll>n.slideCount&&n.slideCount>n.options.slidesToShow&&(i>n.slideCount?(n.slideOffset=(n.options.slidesToShow-(i-n.slideCount))*n.slideWidth*-1,r=(n.options.slidesToShow-(i-n.slideCount))*t*-1):(n.slideOffset=n.slideCount%n.options.slidesToScroll*n.slideWidth*-1,r=n.slideCount%n.options.slidesToScroll*t*-1))):i+n.options.slidesToShow>n.slideCount&&(n.slideOffset=(i+n.options.slidesToShow-n.slideCount)*n.slideWidth,r=(i+n.options.slidesToShow-n.slideCount)*t),n.slideCount<=n.options.slidesToShow&&(n.slideOffset=0,r=0),!0===n.options.centerMode&&n.slideCount<=n.options.slidesToShow?n.slideOffset=n.slideWidth*Math.floor(n.options.slidesToShow)/2-n.slideWidth*n.slideCount/2:!0===n.options.centerMode&&!0===n.options.infinite?n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)-n.slideWidth:!0===n.options.centerMode&&(n.slideOffset=0,n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)),e=!1===n.options.vertical?i*n.slideWidth*-1+n.slideOffset:i*t*-1+r,!0===n.options.variableWidth&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,!0===n.options.centerMode&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow+1),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,e+=(n.$list.width()-o.outerWidth())/2)),e},e.prototype.getOption=e.prototype.slickGetOption=function(i){return this.options[i]},e.prototype.getNavigableIndexes=function(){var i,e=this,t=0,o=0,s=[];for(!1===e.options.infinite?i=e.slideCount:(t=-1*e.options.slidesToScroll,o=-1*e.options.slidesToScroll,i=2*e.slideCount);t<i;)s.push(t),t=o+e.options.slidesToScroll,o+=e.options.slidesToScroll<=e.options.slidesToShow?e.options.slidesToScroll:e.options.slidesToShow;return s},e.prototype.getSlick=function(){return this},e.prototype.getSlideCount=function(){var e,t,o=this;return t=!0===o.options.centerMode?o.slideWidth*Math.floor(o.options.slidesToShow/2):0,!0===o.options.swipeToSlide?(o.$slideTrack.find(".slick-slide").each(function(s,n){if(n.offsetLeft-t+i(n).outerWidth()/2>-1*o.swipeLeft)return e=n,!1}),Math.abs(i(e).attr("data-slick-index")-o.currentSlide)||1):o.options.slidesToScroll},e.prototype.goTo=e.prototype.slickGoTo=function(i,e){this.changeSlide({data:{message:"index",index:parseInt(i)}},e)},e.prototype.init=function(e){var t=this;i(t.$slider).hasClass("slick-initialized")||(i(t.$slider).addClass("slick-initialized"),t.buildRows(),t.buildOut(),t.setProps(),t.startLoad(),t.loadSlider(),t.initializeEvents(),t.updateArrows(),t.updateDots(),t.checkResponsive(!0),t.focusHandler()),e&&t.$slider.trigger("init",[t]),!0===t.options.accessibility&&t.initADA(),t.options.autoplay&&(t.paused=!1,t.autoPlay())},e.prototype.initADA=function(){var e=this,t=Math.ceil(e.slideCount/e.options.slidesToShow),o=e.getNavigableIndexes().filter(function(i){return i>=0&&i<e.slideCount});e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),null!==e.$dots&&(e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t){var s=o.indexOf(t);i(this).attr({role:"tabpanel",id:"slick-slide"+e.instanceUid+t,tabindex:-1}),-1!==s&&i(this).attr({"aria-describedby":"slick-slide-control"+e.instanceUid+s})}),e.$dots.attr("role","tablist").find("li").each(function(s){var n=o[s];i(this).attr({role:"presentation"}),i(this).find("button").first().attr({role:"tab",id:"slick-slide-control"+e.instanceUid+s,"aria-controls":"slick-slide"+e.instanceUid+n,"aria-label":s+1+" of "+t,"aria-selected":null,tabindex:"-1"})}).eq(e.currentSlide).find("button").attr({"aria-selected":"true",tabindex:"0"}).end());for(var s=e.currentSlide,n=s+e.options.slidesToShow;s<n;s++)e.$slides.eq(s).attr("tabindex",0);e.activateADA()},e.prototype.initArrowEvents=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},i.changeSlide),i.$nextArrow.off("click.slick").on("click.slick",{message:"next"},i.changeSlide),!0===i.options.accessibility&&(i.$prevArrow.on("keydown.slick",i.keyHandler),i.$nextArrow.on("keydown.slick",i.keyHandler)))},e.prototype.initDotEvents=function(){var e=this;!0===e.options.dots&&(i("li",e.$dots).on("click.slick",{message:"index"},e.changeSlide),!0===e.options.accessibility&&e.$dots.on("keydown.slick",e.keyHandler)),!0===e.options.dots&&!0===e.options.pauseOnDotsHover&&i("li",e.$dots).on("mouseenter.slick",i.proxy(e.interrupt,e,!0)).on("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.initSlideEvents=function(){var e=this;e.options.pauseOnHover&&(e.$list.on("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.on("mouseleave.slick",i.proxy(e.interrupt,e,!1)))},e.prototype.initializeEvents=function(){var e=this;e.initArrowEvents(),e.initDotEvents(),e.initSlideEvents(),e.$list.on("touchstart.slick mousedown.slick",{action:"start"},e.swipeHandler),e.$list.on("touchmove.slick mousemove.slick",{action:"move"},e.swipeHandler),e.$list.on("touchend.slick mouseup.slick",{action:"end"},e.swipeHandler),e.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},e.swipeHandler),e.$list.on("click.slick",e.clickHandler),i(document).on(e.visibilityChange,i.proxy(e.visibility,e)),!0===e.options.accessibility&&e.$list.on("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),i(window).on("orientationchange.slick.slick-"+e.instanceUid,i.proxy(e.orientationChange,e)),i(window).on("resize.slick.slick-"+e.instanceUid,i.proxy(e.resize,e)),i("[draggable!=true]",e.$slideTrack).on("dragstart",e.preventDefault),i(window).on("load.slick.slick-"+e.instanceUid,e.setPosition),i(e.setPosition)},e.prototype.initUI=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.show(),i.$nextArrow.show()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.show()},e.prototype.keyHandler=function(i){var e=this;i.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===i.keyCode&&!0===e.options.accessibility?e.changeSlide({data:{message:!0===e.options.rtl?"next":"previous"}}):39===i.keyCode&&!0===e.options.accessibility&&e.changeSlide({data:{message:!0===e.options.rtl?"previous":"next"}}))},e.prototype.lazyLoad=function(){function e(e){i("img[data-lazy]",e).each(function(){var e=i(this),t=i(this).attr("data-lazy"),o=i(this).attr("data-srcset"),s=i(this).attr("data-sizes")||n.$slider.attr("data-sizes"),r=document.createElement("img");r.onload=function(){e.animate({opacity:0},100,function(){o&&(e.attr("srcset",o),s&&e.attr("sizes",s)),e.attr("src",t).animate({opacity:1},200,function(){e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")}),n.$slider.trigger("lazyLoaded",[n,e,t])})},r.onerror=function(){e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),n.$slider.trigger("lazyLoadError",[n,e,t])},r.src=t})}var t,o,s,n=this;if(!0===n.options.centerMode?!0===n.options.infinite?s=(o=n.currentSlide+(n.options.slidesToShow/2+1))+n.options.slidesToShow+2:(o=Math.max(0,n.currentSlide-(n.options.slidesToShow/2+1)),s=n.options.slidesToShow/2+1+2+n.currentSlide):(o=n.options.infinite?n.options.slidesToShow+n.currentSlide:n.currentSlide,s=Math.ceil(o+n.options.slidesToShow),!0===n.options.fade&&(o>0&&o--,s<=n.slideCount&&s++)),t=n.$slider.find(".slick-slide").slice(o,s),"anticipated"===n.options.lazyLoad)for(var r=o-1,l=s,d=n.$slider.find(".slick-slide"),a=0;a<n.options.slidesToScroll;a++)r<0&&(r=n.slideCount-1),t=(t=t.add(d.eq(r))).add(d.eq(l)),r--,l++;e(t),n.slideCount<=n.options.slidesToShow?e(n.$slider.find(".slick-slide")):n.currentSlide>=n.slideCount-n.options.slidesToShow?e(n.$slider.find(".slick-cloned").slice(0,n.options.slidesToShow)):0===n.currentSlide&&e(n.$slider.find(".slick-cloned").slice(-1*n.options.slidesToShow))},e.prototype.loadSlider=function(){var i=this;i.setPosition(),i.$slideTrack.css({opacity:1}),i.$slider.removeClass("slick-loading"),i.initUI(),"progressive"===i.options.lazyLoad&&i.progressiveLazyLoad()},e.prototype.next=e.prototype.slickNext=function(){this.changeSlide({data:{message:"next"}})},e.prototype.orientationChange=function(){var i=this;i.checkResponsive(),i.setPosition()},e.prototype.pause=e.prototype.slickPause=function(){var i=this;i.autoPlayClear(),i.paused=!0},e.prototype.play=e.prototype.slickPlay=function(){var i=this;i.autoPlay(),i.options.autoplay=!0,i.paused=!1,i.focussed=!1,i.interrupted=!1},e.prototype.postSlide=function(e){var t=this;t.unslicked||(t.$slider.trigger("afterChange",[t,e]),t.animating=!1,t.slideCount>t.options.slidesToShow&&t.setPosition(),t.swipeLeft=null,t.options.autoplay&&t.autoPlay(),!0===t.options.accessibility&&(t.initADA(),t.options.focusOnChange&&i(t.$slides.get(t.currentSlide)).attr("tabindex",0).focus()))},e.prototype.prev=e.prototype.slickPrev=function(){this.changeSlide({data:{message:"previous"}})},e.prototype.preventDefault=function(i){i.preventDefault()},e.prototype.progressiveLazyLoad=function(e){e=e||1;var t,o,s,n,r,l=this,d=i("img[data-lazy]",l.$slider);d.length?(t=d.first(),o=t.attr("data-lazy"),s=t.attr("data-srcset"),n=t.attr("data-sizes")||l.$slider.attr("data-sizes"),(r=document.createElement("img")).onload=function(){s&&(t.attr("srcset",s),n&&t.attr("sizes",n)),t.attr("src",o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),!0===l.options.adaptiveHeight&&l.setPosition(),l.$slider.trigger("lazyLoaded",[l,t,o]),l.progressiveLazyLoad()},r.onerror=function(){e<3?setTimeout(function(){l.progressiveLazyLoad(e+1)},500):(t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),l.$slider.trigger("lazyLoadError",[l,t,o]),l.progressiveLazyLoad())},r.src=o):l.$slider.trigger("allImagesLoaded",[l])},e.prototype.refresh=function(e){var t,o,s=this;o=s.slideCount-s.options.slidesToShow,!s.options.infinite&&s.currentSlide>o&&(s.currentSlide=o),s.slideCount<=s.options.slidesToShow&&(s.currentSlide=0),t=s.currentSlide,s.destroy(!0),i.extend(s,s.initials,{currentSlide:t}),s.init(),e||s.changeSlide({data:{message:"index",index:t}},!1)},e.prototype.registerBreakpoints=function(){var e,t,o,s=this,n=s.options.responsive||null;if("array"===i.type(n)&&n.length){s.respondTo=s.options.respondTo||"window";for(e in n)if(o=s.breakpoints.length-1,n.hasOwnProperty(e)){for(t=n[e].breakpoint;o>=0;)s.breakpoints[o]&&s.breakpoints[o]===t&&s.breakpoints.splice(o,1),o--;s.breakpoints.push(t),s.breakpointSettings[t]=n[e].settings}s.breakpoints.sort(function(i,e){return s.options.mobileFirst?i-e:e-i})}},e.prototype.reinit=function(){var e=this;e.$slides=e.$slideTrack.children(e.options.slide).addClass("slick-slide"),e.slideCount=e.$slides.length,e.currentSlide>=e.slideCount&&0!==e.currentSlide&&(e.currentSlide=e.currentSlide-e.options.slidesToScroll),e.slideCount<=e.options.slidesToShow&&(e.currentSlide=0),e.registerBreakpoints(),e.setProps(),e.setupInfinite(),e.buildArrows(),e.updateArrows(),e.initArrowEvents(),e.buildDots(),e.updateDots(),e.initDotEvents(),e.cleanUpSlideEvents(),e.initSlideEvents(),e.checkResponsive(!1,!0),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),e.setPosition(),e.focusHandler(),e.paused=!e.options.autoplay,e.autoPlay(),e.$slider.trigger("reInit",[e])},e.prototype.resize=function(){var e=this;i(window).width()!==e.windowWidth&&(clearTimeout(e.windowDelay),e.windowDelay=window.setTimeout(function(){e.windowWidth=i(window).width(),e.checkResponsive(),e.unslicked||e.setPosition()},50))},e.prototype.removeSlide=e.prototype.slickRemove=function(i,e,t){var o=this;if(i="boolean"==typeof i?!0===(e=i)?0:o.slideCount-1:!0===e?--i:i,o.slideCount<1||i<0||i>o.slideCount-1)return!1;o.unload(),!0===t?o.$slideTrack.children().remove():o.$slideTrack.children(this.options.slide).eq(i).remove(),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slidesCache=o.$slides,o.reinit()},e.prototype.setCSS=function(i){var e,t,o=this,s={};!0===o.options.rtl&&(i=-i),e="left"==o.positionProp?Math.ceil(i)+"px":"0px",t="top"==o.positionProp?Math.ceil(i)+"px":"0px",s[o.positionProp]=i,!1===o.transformsEnabled?o.$slideTrack.css(s):(s={},!1===o.cssTransitions?(s[o.animType]="translate("+e+", "+t+")",o.$slideTrack.css(s)):(s[o.animType]="translate3d("+e+", "+t+", 0px)",o.$slideTrack.css(s)))},e.prototype.setDimensions=function(){var i=this;!1===i.options.vertical?!0===i.options.centerMode&&i.$list.css({padding:"0px "+i.options.centerPadding}):(i.$list.height(i.$slides.first().outerHeight(!0)*i.options.slidesToShow),!0===i.options.centerMode&&i.$list.css({padding:i.options.centerPadding+" 0px"})),i.listWidth=i.$list.width(),i.listHeight=i.$list.height(),!1===i.options.vertical&&!1===i.options.variableWidth?(i.slideWidth=Math.ceil(i.listWidth/i.options.slidesToShow),i.$slideTrack.width(Math.ceil(i.slideWidth*i.$slideTrack.children(".slick-slide").length))):!0===i.options.variableWidth?i.$slideTrack.width(5e3*i.slideCount):(i.slideWidth=Math.ceil(i.listWidth),i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0)*i.$slideTrack.children(".slick-slide").length)));var e=i.$slides.first().outerWidth(!0)-i.$slides.first().width();!1===i.options.variableWidth&&i.$slideTrack.children(".slick-slide").width(i.slideWidth-e)},e.prototype.setFade=function(){var e,t=this;t.$slides.each(function(o,s){e=t.slideWidth*o*-1,!0===t.options.rtl?i(s).css({position:"relative",right:e,top:0,zIndex:t.options.zIndex-2,opacity:0}):i(s).css({position:"relative",left:e,top:0,zIndex:t.options.zIndex-2,opacity:0})}),t.$slides.eq(t.currentSlide).css({zIndex:t.options.zIndex-1,opacity:1})},e.prototype.setHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.css("height",e)}},e.prototype.setOption=e.prototype.slickSetOption=function(){var e,t,o,s,n,r=this,l=!1;if("object"===i.type(arguments[0])?(o=arguments[0],l=arguments[1],n="multiple"):"string"===i.type(arguments[0])&&(o=arguments[0],s=arguments[1],l=arguments[2],"responsive"===arguments[0]&&"array"===i.type(arguments[1])?n="responsive":void 0!==arguments[1]&&(n="single")),"single"===n)r.options[o]=s;else if("multiple"===n)i.each(o,function(i,e){r.options[i]=e});else if("responsive"===n)for(t in s)if("array"!==i.type(r.options.responsive))r.options.responsive=[s[t]];else{for(e=r.options.responsive.length-1;e>=0;)r.options.responsive[e].breakpoint===s[t].breakpoint&&r.options.responsive.splice(e,1),e--;r.options.responsive.push(s[t])}l&&(r.unload(),r.reinit())},e.prototype.setPosition=function(){var i=this;i.setDimensions(),i.setHeight(),!1===i.options.fade?i.setCSS(i.getLeft(i.currentSlide)):i.setFade(),i.$slider.trigger("setPosition",[i])},e.prototype.setProps=function(){var i=this,e=document.body.style;i.positionProp=!0===i.options.vertical?"top":"left","top"===i.positionProp?i.$slider.addClass("slick-vertical"):i.$slider.removeClass("slick-vertical"),void 0===e.WebkitTransition&&void 0===e.MozTransition&&void 0===e.msTransition||!0===i.options.useCSS&&(i.cssTransitions=!0),i.options.fade&&("number"==typeof i.options.zIndex?i.options.zIndex<3&&(i.options.zIndex=3):i.options.zIndex=i.defaults.zIndex),void 0!==e.OTransform&&(i.animType="OTransform",i.transformType="-o-transform",i.transitionType="OTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.MozTransform&&(i.animType="MozTransform",i.transformType="-moz-transform",i.transitionType="MozTransition",void 0===e.perspectiveProperty&&void 0===e.MozPerspective&&(i.animType=!1)),void 0!==e.webkitTransform&&(i.animType="webkitTransform",i.transformType="-webkit-transform",i.transitionType="webkitTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.msTransform&&(i.animType="msTransform",i.transformType="-ms-transform",i.transitionType="msTransition",void 0===e.msTransform&&(i.animType=!1)),void 0!==e.transform&&!1!==i.animType&&(i.animType="transform",i.transformType="transform",i.transitionType="transition"),i.transformsEnabled=i.options.useTransform&&null!==i.animType&&!1!==i.animType},e.prototype.setSlideClasses=function(i){var e,t,o,s,n=this;if(t=n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),n.$slides.eq(i).addClass("slick-current"),!0===n.options.centerMode){var r=n.options.slidesToShow%2==0?1:0;e=Math.floor(n.options.slidesToShow/2),!0===n.options.infinite&&(i>=e&&i<=n.slideCount-1-e?n.$slides.slice(i-e+r,i+e+1).addClass("slick-active").attr("aria-hidden","false"):(o=n.options.slidesToShow+i,t.slice(o-e+1+r,o+e+2).addClass("slick-active").attr("aria-hidden","false")),0===i?t.eq(t.length-1-n.options.slidesToShow).addClass("slick-center"):i===n.slideCount-1&&t.eq(n.options.slidesToShow).addClass("slick-center")),n.$slides.eq(i).addClass("slick-center")}else i>=0&&i<=n.slideCount-n.options.slidesToShow?n.$slides.slice(i,i+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):t.length<=n.options.slidesToShow?t.addClass("slick-active").attr("aria-hidden","false"):(s=n.slideCount%n.options.slidesToShow,o=!0===n.options.infinite?n.options.slidesToShow+i:i,n.options.slidesToShow==n.options.slidesToScroll&&n.slideCount-i<n.options.slidesToShow?t.slice(o-(n.options.slidesToShow-s),o+s).addClass("slick-active").attr("aria-hidden","false"):t.slice(o,o+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"));"ondemand"!==n.options.lazyLoad&&"anticipated"!==n.options.lazyLoad||n.lazyLoad()},e.prototype.setupInfinite=function(){var e,t,o,s=this;if(!0===s.options.fade&&(s.options.centerMode=!1),!0===s.options.infinite&&!1===s.options.fade&&(t=null,s.slideCount>s.options.slidesToShow)){for(o=!0===s.options.centerMode?s.options.slidesToShow+1:s.options.slidesToShow,e=s.slideCount;e>s.slideCount-o;e-=1)t=e-1,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t-s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");for(e=0;e<o+s.slideCount;e+=1)t=e,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t+s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");s.$slideTrack.find(".slick-cloned").find("[id]").each(function(){i(this).attr("id","")})}},e.prototype.interrupt=function(i){var e=this;i||e.autoPlay(),e.interrupted=i},e.prototype.selectHandler=function(e){var t=this,o=i(e.target).is(".slick-slide")?i(e.target):i(e.target).parents(".slick-slide"),s=parseInt(o.attr("data-slick-index"));s||(s=0),t.slideCount<=t.options.slidesToShow?t.slideHandler(s,!1,!0):t.slideHandler(s)},e.prototype.slideHandler=function(i,e,t){var o,s,n,r,l,d=null,a=this;if(e=e||!1,!(!0===a.animating&&!0===a.options.waitForAnimate||!0===a.options.fade&&a.currentSlide===i))if(!1===e&&a.asNavFor(i),o=i,d=a.getLeft(o),r=a.getLeft(a.currentSlide),a.currentLeft=null===a.swipeLeft?r:a.swipeLeft,!1===a.options.infinite&&!1===a.options.centerMode&&(i<0||i>a.getDotCount()*a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else if(!1===a.options.infinite&&!0===a.options.centerMode&&(i<0||i>a.slideCount-a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else{if(a.options.autoplay&&clearInterval(a.autoPlayTimer),s=o<0?a.slideCount%a.options.slidesToScroll!=0?a.slideCount-a.slideCount%a.options.slidesToScroll:a.slideCount+o:o>=a.slideCount?a.slideCount%a.options.slidesToScroll!=0?0:o-a.slideCount:o,a.animating=!0,a.$slider.trigger("beforeChange",[a,a.currentSlide,s]),n=a.currentSlide,a.currentSlide=s,a.setSlideClasses(a.currentSlide),a.options.asNavFor&&(l=(l=a.getNavTarget()).slick("getSlick")).slideCount<=l.options.slidesToShow&&l.setSlideClasses(a.currentSlide),a.updateDots(),a.updateArrows(),!0===a.options.fade)return!0!==t?(a.fadeSlideOut(n),a.fadeSlide(s,function(){a.postSlide(s)})):a.postSlide(s),void a.animateHeight();!0!==t?a.animateSlide(d,function(){a.postSlide(s)}):a.postSlide(s)}},e.prototype.startLoad=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.hide(),i.$nextArrow.hide()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.hide(),i.$slider.addClass("slick-loading")},e.prototype.swipeDirection=function(){var i,e,t,o,s=this;return i=s.touchObject.startX-s.touchObject.curX,e=s.touchObject.startY-s.touchObject.curY,t=Math.atan2(e,i),(o=Math.round(180*t/Math.PI))<0&&(o=360-Math.abs(o)),o<=45&&o>=0?!1===s.options.rtl?"left":"right":o<=360&&o>=315?!1===s.options.rtl?"left":"right":o>=135&&o<=225?!1===s.options.rtl?"right":"left":!0===s.options.verticalSwiping?o>=35&&o<=135?"down":"up":"vertical"},e.prototype.swipeEnd=function(i){var e,t,o=this;if(o.dragging=!1,o.swiping=!1,o.scrolling)return o.scrolling=!1,!1;if(o.interrupted=!1,o.shouldClick=!(o.touchObject.swipeLength>10),void 0===o.touchObject.curX)return!1;if(!0===o.touchObject.edgeHit&&o.$slider.trigger("edge",[o,o.swipeDirection()]),o.touchObject.swipeLength>=o.touchObject.minSwipe){switch(t=o.swipeDirection()){case"left":case"down":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide+o.getSlideCount()):o.currentSlide+o.getSlideCount(),o.currentDirection=0;break;case"right":case"up":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide-o.getSlideCount()):o.currentSlide-o.getSlideCount(),o.currentDirection=1}"vertical"!=t&&(o.slideHandler(e),o.touchObject={},o.$slider.trigger("swipe",[o,t]))}else o.touchObject.startX!==o.touchObject.curX&&(o.slideHandler(o.currentSlide),o.touchObject={})},e.prototype.swipeHandler=function(i){var e=this;if(!(!1===e.options.swipe||"ontouchend"in document&&!1===e.options.swipe||!1===e.options.draggable&&-1!==i.type.indexOf("mouse")))switch(e.touchObject.fingerCount=i.originalEvent&&void 0!==i.originalEvent.touches?i.originalEvent.touches.length:1,e.touchObject.minSwipe=e.listWidth/e.options.touchThreshold,!0===e.options.verticalSwiping&&(e.touchObject.minSwipe=e.listHeight/e.options.touchThreshold),i.data.action){case"start":e.swipeStart(i);break;case"move":e.swipeMove(i);break;case"end":e.swipeEnd(i)}},e.prototype.swipeMove=function(i){var e,t,o,s,n,r,l=this;return n=void 0!==i.originalEvent?i.originalEvent.touches:null,!(!l.dragging||l.scrolling||n&&1!==n.length)&&(e=l.getLeft(l.currentSlide),l.touchObject.curX=void 0!==n?n[0].pageX:i.clientX,l.touchObject.curY=void 0!==n?n[0].pageY:i.clientY,l.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(l.touchObject.curX-l.touchObject.startX,2))),r=Math.round(Math.sqrt(Math.pow(l.touchObject.curY-l.touchObject.startY,2))),!l.options.verticalSwiping&&!l.swiping&&r>4?(l.scrolling=!0,!1):(!0===l.options.verticalSwiping&&(l.touchObject.swipeLength=r),t=l.swipeDirection(),void 0!==i.originalEvent&&l.touchObject.swipeLength>4&&(l.swiping=!0,i.preventDefault()),s=(!1===l.options.rtl?1:-1)*(l.touchObject.curX>l.touchObject.startX?1:-1),!0===l.options.verticalSwiping&&(s=l.touchObject.curY>l.touchObject.startY?1:-1),o=l.touchObject.swipeLength,l.touchObject.edgeHit=!1,!1===l.options.infinite&&(0===l.currentSlide&&"right"===t||l.currentSlide>=l.getDotCount()&&"left"===t)&&(o=l.touchObject.swipeLength*l.options.edgeFriction,l.touchObject.edgeHit=!0),!1===l.options.vertical?l.swipeLeft=e+o*s:l.swipeLeft=e+o*(l.$list.height()/l.listWidth)*s,!0===l.options.verticalSwiping&&(l.swipeLeft=e+o*s),!0!==l.options.fade&&!1!==l.options.touchMove&&(!0===l.animating?(l.swipeLeft=null,!1):void l.setCSS(l.swipeLeft))))},e.prototype.swipeStart=function(i){var e,t=this;if(t.interrupted=!0,1!==t.touchObject.fingerCount||t.slideCount<=t.options.slidesToShow)return t.touchObject={},!1;void 0!==i.originalEvent&&void 0!==i.originalEvent.touches&&(e=i.originalEvent.touches[0]),t.touchObject.startX=t.touchObject.curX=void 0!==e?e.pageX:i.clientX,t.touchObject.startY=t.touchObject.curY=void 0!==e?e.pageY:i.clientY,t.dragging=!0},e.prototype.unfilterSlides=e.prototype.slickUnfilter=function(){var i=this;null!==i.$slidesCache&&(i.unload(),i.$slideTrack.children(this.options.slide).detach(),i.$slidesCache.appendTo(i.$slideTrack),i.reinit())},e.prototype.unload=function(){var e=this;i(".slick-cloned",e.$slider).remove(),e.$dots&&e.$dots.remove(),e.$prevArrow&&e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.remove(),e.$nextArrow&&e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.remove(),e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},e.prototype.unslick=function(i){var e=this;e.$slider.trigger("unslick",[e,i]),e.destroy()},e.prototype.updateArrows=function(){var i=this;Math.floor(i.options.slidesToShow/2),!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&!i.options.infinite&&(i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===i.currentSlide?(i.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-i.options.slidesToShow&&!1===i.options.centerMode?(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-1&&!0===i.options.centerMode&&(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},e.prototype.updateDots=function(){var i=this;null!==i.$dots&&(i.$dots.find("li").removeClass("slick-active").end(),i.$dots.find("li").eq(Math.floor(i.currentSlide/i.options.slidesToScroll)).addClass("slick-active"))},e.prototype.visibility=function(){var i=this;i.options.autoplay&&(document[i.hidden]?i.interrupted=!0:i.interrupted=!1)},i.fn.slick=function(){var i,t,o=this,s=arguments[0],n=Array.prototype.slice.call(arguments,1),r=o.length;for(i=0;i<r;i++)if("object"==typeof s||void 0===s?o[i].slick=new e(o[i],s):t=o[i].slick[s].apply(o[i].slick,n),void 0!==t)return t;return o}});
//-------- -------- -------- --------
//-------- included js libs end
//-------- -------- -------- --------