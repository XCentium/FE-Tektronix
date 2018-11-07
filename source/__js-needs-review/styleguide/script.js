/**
 * @file
 * Add custom functions.
 */

(function (window, document, $) {
  'use strict';

   // MQ presets.
  var small_desktop = '(min-width:48em) and (max-width:74.9375em)'; // 768-1199px.
  var mobileOnly = 'screen and (max-width:47.9375em)'; // 767px.
  var $html = $('html');
  var headerHeight = 65;
  var $sliderArrowsDots = $('.js-slider-arrows-dots');
  var slick_dotted_options = {
    arrows: false,
    dots: true,
    fade: true,
    adaptiveHeight: true
  };
  var slick_arrows_dots_options = {
    dots: true,
    fade: true,
    adaptiveHeight: true
  };
  var slick_arrows_dots_options_fade = {
    dots: true,
    fade: true,
    autoplay: true,
    speed: 600,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 991,
        settings: {
          adaptiveHeight: true
        }
      }
    ]
  };
  var slick_arrows_multiple_items = {
    autoplay: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 543,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false
        }
      }
    ]
  };
  var slick_thumb = {
    autoplay: false,
    arrows: true,
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    mobileFirst: true,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          arrows: false,
          dots: true,
          customPaging: function (slick, index) {
            var targetImage = slick.$slides.eq(index).find('img').attr('src') || '';
            return '<img src=" ' + targetImage + ' "/>';
          }
        }
      }
    ]
  };
  var $tekTabsWrap = $('.tek-tabs, .sticky-tabs');
  var $navTabs = $tekTabsWrap.find('.tek-tabs__nav, .sticky-tabs__nav');
  var $tabLinks = $navTabs.find('a');

  $('.js-slider').slick();
  $('.js-slider-dots').slick(slick_dotted_options);
  $('.js-multiple-items').slick(slick_arrows_multiple_items);
  $('.js-slider-thumb').slick(slick_thumb);

  // Slide animation will be applied for slider with class "slide".
  if ($sliderArrowsDots.hasClass('slide')) {
    $sliderArrowsDots.slick(slick_arrows_dots_options);
  }
  else {
    $sliderArrowsDots.slick(slick_arrows_dots_options_fade);
  }

  // Scroll to element.
  function scrollToElem(id) {
    if ($(id).length) {
      $('html, body').animate({
        scrollTop: $(id).offset().top - headerHeight
      }, 700);
    }
  }

  // Show-hide product specification details on mobile.
  var $specBtn = $('.js-btn-spec');
  var toggleClass = 'show-spec';
  $specBtn.on('click', function () {
    var $specList = $(this).parents('.product-spec').find('.product-spec__right');
    $(this).parents('.product-spec').siblings().find('.product-spec__right').removeClass(toggleClass);
    $(this).parents('.product-spec').find('.product-spec__right').toggleClass(toggleClass);
    if ($specList.length) {
      scrollToElem($specList);
    }
  });

  // Set class 'active' for the current element, remove this class for inactive one.
  function activeState($link) {
    $link.parents('.tek-tabs__nav, .sticky-tabs__nav').find('a').removeClass('active');
    $link.addClass('active');
  }

  // Tabs functionality.
  var $stickyTabs = $('.sticky-tabs');
  var $stickyTabsTitle = $stickyTabs.find('.sticky-tabs__title');
  var $stickyHead = $tekTabsWrap.find('.sticky-tabs__head');
  var activeFirst = function () {
    var $tab = $(this).find('.tek-tabs__nav, .sticky-tabs__nav').find('li');
    var $active = $tab.eq(0).find('a');
    var $tabsPane = $(this).find('.tab-pane');
    // Initially make active the first tab list element.
    $active.addClass('active');
    // Initially make active the first pane content.
    $tabsPane.eq(0).addClass('active');
  };
  var tabsToggle = function (e) {
    e.preventDefault();
    var $this = $(this);
    var index = $this.parents('li').index();
    var $tabsPane = $this.parents('.tek-tabs, .sticky-tabs').find('.tab-pane');
    activeState($this);
    $tabsPane.eq(index).addClass('active').siblings().removeClass('active');
    if ($stickyHead.hasClass('is-opened')) {
      $stickyHead.removeClass('is-opened');
    }
  };

  $('.learning-tabs__nav li a').on('click touch', function (e) {
    e.preventDefault();
    var contentId = $(this).attr('id');
    $(`.${contentId}`).fadeIn().siblings('.tab-pane').hide();
  });

  if (($tekTabsWrap.length) && (!$tekTabsWrap.hasClass('blog-tabs'))) {
    $tekTabsWrap.each(activeFirst);
    // Tabs toggle.
    $tabLinks.on('click', tabsToggle);
  }

  if (($tekTabsWrap.length) && ($tekTabsWrap.hasClass('blog-tabs'))) {
    enquire.register(mobileOnly, {
      match: function () {
        $tekTabsWrap.each(activeFirst);
        // Tabs toggle.
        $tabLinks.on('click', tabsToggle);
      },
      unmatch: function () {
        $tekTabsWrap.find('.tab-pane').removeClass('active');
        $tabLinks.removeClass('active').off('click', tabsToggle);
      }
    });
  }

  if ($stickyTabs.length) {
    // Toggle Sticky tabs dropdown on mobile.
    enquire.register(mobileOnly, {
      match: function () {
        $stickyTabsTitle.on('click', function () {
          $(this).closest('.sticky-tabs__head').toggleClass('is-opened');
        });
      },
      unmatch: function () {
        $stickyTabsTitle.off('click');
      }
    });
    var clasSticky = 'is-sticky';
    var tabsOffset = $stickyTabs.offset().top;
    var stickyFunctional = function () {
      if ($(window).scrollTop() >= (tabsOffset - headerHeight)) {
        $html.addClass(clasSticky);
      }
      else {
        $html.removeClass(clasSticky);
      }
    };

    $(window).on('scroll', stickyFunctional);
  }
  // End tabs functionality.
  // Main menu on mobile.
  var $menu_btn = $('#btn-menu');
  var $nav = $('.header__menu');
  var navClass = 'js-nav';
  var searchClass = 'js-search';
  var $headerSearch = $('.header-right .header-search-form');
  var $search_btn = $('#btn-search');
  var $search_form_mobile = $('.header__top-mobile .search-block-form');
  var $subMenu = $nav.find('.sub-menu');
  var showHideMenu = function (e) {
    e.preventDefault();
    if (!$html.hasClass(navClass)) {
      $html.addClass(navClass);
      $nav.slideDown('slow');
      $nav.find('.parent-item').parent().removeClass('expanded');
    }
    else {
      $html.removeClass(navClass);
      $nav.slideUp('slow');
      $subMenu.slideUp('slow');
    }
    if ($html.hasClass(searchClass)) {
      $html.removeClass(searchClass);
      $search_form_mobile.slideUp(800);
    }
  };

  if ($menu_btn.length) {
    $menu_btn.on('click', showHideMenu);
  }

  if ($search_btn.length) {
    $search_btn.on('click', function () {
      if ($html.hasClass(navClass)) {
        $html.removeClass(navClass);
        $nav.slideUp(800);
      }
      $html.toggleClass(searchClass);
      $search_form_mobile.slideToggle(800);
    });
  }

// End main menu on mobile.

  enquire.register(small_desktop, {
    match: function () {
      $headerSearch.addClass('sub-menu');
    },
    unmatch: function () {
      $headerSearch.removeClass('sub-menu');
    }
  });

// Header menu show/hide functionality.

  var $menu_items = $('.header__menu .parent-item'),
    expand_class = 'expanded',
    active_class = 'is-active',
    menuItemToggle = function (e) {
      e.preventDefault();

      var $this = $(this),
        $parent_item = $this.parent();
      $menu_items.not($this).removeClass(active_class).parent().removeClass(expand_class).find('.sub-menu').slideUp(800);
      $parent_item.find('.sub-menu').slideToggle(800);
      $this.toggleClass(active_class);
      $parent_item.toggleClass(expand_class);
    };
  $menu_items.on('click', menuItemToggle);

  // Close dropdown when click outside it.
  $('html').on('touchstart click', function (e) {
    var $expanded_item = $('.header__menu .expanded');
    if ($expanded_item.length) {
      if (!$expanded_item.is(e.target) && $expanded_item.has(e.target).length === 0) {
        $expanded_item.removeClass(expand_class).find('.sub-menu').slideUp(800);
      }
    }
  });

  // End Header menu show/hide functionality.

  // Social links animation on Blog pages.
  var $togglerShow = $('.link-share'),
    $togglerHide = $('.share-links .icon-close');

  $togglerShow.on('click', function () {
    $(this).parents('.action-lists').addClass('show-social');
  });

  $togglerHide.on('click', function () {
    $(this).parents('.action-lists').removeClass('show-social');
  });
  // End Social links animation on Blog pages.

  // Button with dropdown.
  var $dropdown = $('.dropdown');
  var $dropdownToggle = $dropdown.find('.btn, .js-toggle-dropdown');
  var open_class = 'opened';
  $dropdownToggle.on('click', function (e) {
    e.preventDefault();
    $(this).parents('.dropdown').toggleClass(open_class);
  });
  // Close dropdown when click outside it.
  $('html').on('touchstart click', function (e) {
    if ($dropdown.length) {
      if (!$dropdown.is(e.target) && $dropdown.has(e.target).length === 0) {
        $dropdown.removeClass(open_class);
      }
    }
  });
  // End Button with dropdown.
  // Close redirect banner.
  var $redirectBanner = $('.banner--redirect'),
    $closeRedirect = $redirectBanner.find('.js-close');
  $closeRedirect.on('click', function (e) {
    e.preventDefault();
    $(this).closest('.banner--redirect').slideUp('slow');
  });
  // End Close redirect banner.
  // Sticky buttons show/hide callout.
  var $stickyBtn = $('.sticky-btn'),
    $showCallout = $stickyBtn.find('.icon'),
    $hideCallout = $stickyBtn.find('.callout__close');

  $showCallout.on('click', function () {
    $(this).parents('.sticky-btn').addClass('show-callout')
      .parents('.sticky-btn-group').addClass('active');
  });

  $hideCallout.on('click', function () {
    $(this).parents('.sticky-btn').removeClass('show-callout')
      .parents('.sticky-btn-group').removeClass('active');
  });

  // End Sticky buttons show/hide callout.
  // Go to top functionality.
  var $linkTotop = $('.scroll-top');

  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 1000) {
      $linkTotop.addClass('visible');
    }
    else {
      $linkTotop.removeClass('visible');
    }
  });

  // Click event to scroll to top.
  $linkTotop.on('click', function () {
    $('html, body').animate({scrollTop: 0}, 800);
    return false;
  });
  // End Go to top functionality.

  // Apply basictable functionality on responsive tables.
  var $responsiveTable = $('.responsive-data table');
  $responsiveTable.basictable({
    breakpoint: 767
  });
  // End Apply basictable functionality on responsive tables.

  // Sales Tool Icon Changes
  var $changeImage = $('.changeImage');

  $changeImage.on('click', function () {
    var path_to_image = $(this).attr('src');

    if ( path_to_image === "/themes/custom/tektronix/source/images/star.svg") {
      path_to_image = "/themes/custom/tektronix/source/images/star-on.svg";
    }
    else if (path_to_image === "/themes/custom/tektronix/source/images/star-on.svg") {
      path_to_image = "/themes/custom/tektronix/source/images/star.svg";
    }

    else if ( path_to_image === "/themes/custom/tektronix/source/images/thumbs-up.svg") {
        path_to_image = "/themes/custom/tektronix/source/images/thumbs-up-on.svg";
    }
    else if (path_to_image === "/themes/custom/tektronix/source/images/thumbs-up-on.svg"){
        path_to_image = "/themes/custom/tektronix/source/images/thumbs-up.svg";
    }

    else if ( path_to_image === "/themes/custom/tektronix/source/images/thumbs-down.svg") {
        path_to_image = "/themes/custom/tektronix/source/images/thumbs-down-on.svg";
    }
    else if (path_to_image === "/themes/custom/tektronix/source/images/thumbs-down-on.svg"){
        path_to_image = "/themes/custom/tektronix/source/images/thumbs-down.svg";
    }

    return $(this).attr('src', path_to_image);
  });
  
  // Language Selector Sidebar Functionality
  var $langSelectorGlobe = $('.icon-earth.header-right__item');
  var $sideNavLangSelector = $('.side-nav__lang-selector');
  var $sideNavLangSelectorClose = $('.side-nav__lang-selector .side-nav__lang-selector--header');
  
  $langSelectorGlobe.on('click', function(e) {
    e.preventDefault();
    $sideNavLangSelector.width(250);
  });
  
  
  $sideNavLangSelectorClose.on('click', function(e) {
    e.preventDefault();
    $sideNavLangSelector.width(0);
  });
  
  // Header menu show/hide functionality.

  var $langMenu = $('.lang-selector-nav__region-menu .parent-item'),
    expand_class = 'expanded',
    active_class = 'is-active',
    langMenuItemToggle = function (e) {
      e.preventDefault();

      var $this = $(this),
        $parent_item = $this.parent();
      $langMenu.not($this).removeClass(active_class).parent().removeClass(expand_class).find('.lang-sub-menu').slideUp(800);
      $parent_item.find('.lang-sub-menu').slideToggle(800);
      $this.toggleClass(active_class);
      $parent_item.toggleClass(expand_class);
    };
  $langMenu.on('mouseenter', langMenuItemToggle);


}(window, window.document, window.jQuery));
