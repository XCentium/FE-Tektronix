/**
 * @file
 * Add Drupal functions.
 */

(function (window, document, $, Drupal) {
  'use strict';

  // Compare checkboxes and button functionality.
  Drupal.behaviors.productCompare = {
    attach: function (context, settings) {
      if (!$('.view--probe-selector', context).hasClass('init')) {
        Drupal.behaviors.productCompare.initialization(context);
      }
      var $prodCompare = $('.product-series-grid input[type=checkbox]', context);

      // Toggle class on checkboxes used to select series for comparison.
      $prodCompare.on('click', function (event) {
        var productObj;
        var checkLen = $('.compare-container input[type=checkbox]:checked', context).length;
        if (checkLen > 3) {
          $(this, context).prop('checked', false);
          $(this, context).removeClass('compare-check');
//          alert(Drupal.t('You can only compare up to 3 products. To compare this item, uncheck one of the other 3 products.'));
          return;
        }
        productObj = $(this, context).parents('.compare-container');
        if ($(this).prop('checked')) {
          $(productObj).addClass('compare-check');
        }
        else {
          $(productObj).removeClass('compare-check');
          $(productObj).find('.checkbox-wrap .btn-primary').hide();
        }


        if (checkLen === 1) {
          $('.compare-check', context).each(function () {
            $(this).find('.checkbox-wrap .btn-primary').hide();
          });
        }

        if (checkLen > 1) {
          $('.compare-check', context).each(function () {
            $(this).find('.checkbox-wrap .btn-primary').html(Drupal.t('COMPARE ') + checkLen + '/3').show();
          });
        }

        if (checkLen <= 3) {
          $(this, context).toggleClass('compareon');
        }
      });

      // Handle submitting the form.
      var $compSubmit = $('.compare-submit', context);
      $compSubmit.on('click', function (event) {
        event.preventDefault();
        var nids = [];
        $('.compareon', context).each(function () {
          nids.push($(this).attr('id'));
        });
        if (nids.length >= 2) {
          var baseurl = drupalSettings.baseurl;
          var comparisonUrl = baseurl + '/product-category-wizard/';
          if (drupalSettings.currentPage === 'probe-selector') {
            comparisonUrl = baseurl + '/product-probe/comparison/';
          }
          var url = comparisonUrl + encodeURIComponent(nids.join(',')) + '?_wrapper_format=drupal_modal';
          Drupal.ajax.instances.forEach(function (instance) {
            if (instance.selector === '#probe-comparison-display') {
              instance.options.url = url;
            }
          });
          $('#probe-comparison-display').trigger('click');
        }
        else {
          alert(Drupal.t('Please select at least two product series first.'));
        }
      });
    },
    initialization: function (context) {
      $('.compare-submit', context).each(function () {
        $(this).hide();
      });
      $('.view--probe-selector', context).addClass('init');
    }
  };

  // Define GLOBAL variables.
  var $html = $('html');
  var stickyHeaderHeight = $('.header').height();
  // MQ presets.
  var mobileOnly = 'screen and (max-width:47.9375em)'; // 767px.
  var mobile_and_tablet = 'screen and (max-width:61.9375em)'; // 991px.
  var small_desktop = '(min-width:48em) and (max-width:79.9375em)'; // 768-1279px.
  var desktop = '(min-width:62em)'; // 992px.
  // Scroll to element.
  function scrollToElem(id) {
    if ($(id).length) {
      $('html, body').animate({
        scrollTop: $(id).offset().top - stickyHeaderHeight
      }, 700);
    }
  }
  
  // Slider init.
  Drupal.behaviors.sliderInit = {
    attach: function (context, settings) {
      var $sliderArrowsDots = $('.js-slider-arrows-dots', context);
      var slick_dotted_options = {
        arrows: false,
        dots: true,
        fade: true,
        adaptiveHeight: true,
        autoplay: true
      };
      var slick_arrows_dots_options = {
        dots: true,
        autoplay: true
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

      var slick_elemental_thumb = {
        autoplay: true,
        arrows: true,
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        mobileFirst: true,
        swipe: false,
        customPaging: function (slick, index) {
          var targetImage = slick.$slides.eq(index).find('.elemental__slider--products__thumb').prop('outerHTML') || '';
          var targetImageCaption = slick.$slides.eq(index).find('.elemental__slider--products__caption').prop('outerHTML') || '';
          return '<div class="slider-indicator--inner">' + targetImage + targetImageCaption + '</div>';
        }
      };

      $('.js-slider', context).slick();
      $('.js-slider-dots', context).slick(slick_dotted_options);
      $('.js-multiple-items', context).slick(slick_arrows_multiple_items);
      $('.js-slider-thumb', context).slick(slick_thumb);
      $('.js-elemental-slider-thumb', context).slick(slick_elemental_thumb);
      // Slide animation will be applied for slider with class "slide".
      if ($sliderArrowsDots.hasClass('slide')) {
        $sliderArrowsDots.slick(slick_arrows_dots_options);
      }
      else {
        $sliderArrowsDots.slick(slick_arrows_dots_options_fade);
      }
    }
  };

  // Show-hide product specification details on mobile.
  Drupal.behaviors.productSpec = {
    attach: function (context, settings) {
      var $specBtn = $('.js-btn-spec', context);
      var toggleClass = 'show-spec';

      $specBtn.on('click', function (e) {
        e.preventDefault();
        var $specList = $(this).parents('.product-spec').find('.product-spec__right');
        $(this).parents('.product-spec').siblings().find('.product-spec__right').removeClass(toggleClass);
        $(this).parents('.product-spec').find('.product-spec__right').toggleClass(toggleClass);
        if ($specList.length && $specList.hasClass(toggleClass)) {
          scrollToElem($specList);
        }
      });
    }
  };
  // Show-hide Compatible Instruments.
  Drupal.behaviors.productSpecInstruments = {
    attach: function (context, settings) {
      var $toggleLink = $('.probe_view_compatible a', context);
      var toggleClass = 'show-table';
      if ($toggleLink.length) {
        $toggleLink.on('click', function (e) {
          e.preventDefault();
          $(this).closest('.probe_view_compatible').find('.probe__table').toggleClass(toggleClass).slideToggle(800);
        });
      }
    }
  };
    // Show-hide Compatible Instruments.
  Drupal.behaviors.productSpecCompatibleInstruments = {
    attach: function (context, settings) {
      // Cache jQuery element
      var _$ = $('.model-table', context),
      
      // Define variables
      mainElementClassName = '.probe_view_compatible_table',
      eventTriggerElement = ' a.view-hide-trigger',
      tableClassName = '.probe__table',
      toggleClass = 'show-table',
      triggerEventType = 'click',
      $mainObject = {},
      $this = {},
      
      // Get the number of TD elemets to cater to
      colspan = _$.find('tbody > tr:first-child > td').length,
      
      // Create empty TR with needed TD colspan
      tr = '<tr><td colspan="' + colspan + '"></td></tr><tr></tr>';
      
      _$.find(mainElementClassName + eventTriggerElement, context).on(triggerEventType, function(e){
          showHideElement(e, this);
      });
      
      function showHideElement(e, _this) {
          
          e.preventDefault();
          
          // Cache jQuery 'this' element
          $this = $(_this);
          
          // Construct the new row or target the right table if exists
          ($this.hasClass('exists')) ? _whichTable($this) : _constructNewRow($this);
          
          // Check if the element is already opened
          ($this.hasClass('opened')) ? _closeElement($this) : _openElement($this);
      }
      
      function _constructNewRow($this) {
          
          // Store the element where the compat table is placed
          $mainObject.tableHolder = $this.parents(mainElementClassName);
          
          // Store parent row (TR) element
          $mainObject.parentRow = $mainObject.tableHolder.parents('tr');
          
          // Store table itself
          $mainObject.table = $mainObject.tableHolder.find(tableClassName);
              
          // Add TR to the tbody
          $mainObject.parentRow.after(tr);
          
          // Store new parent row (TR) element
          $mainObject.newParentRow = $mainObject.parentRow.next('tr');
          
          // Move the table to the new row and adjust CSS background
          $mainObject.newParentRow.css('background-color', $mainObject.parentRow
              .css('background-color'))
              .find('td')
              .append($mainObject.table);
          
          // Store the relocated table
          $mainObject.movedTable = $mainObject.newParentRow.find(tableClassName);
          
          // Mark as 'exists' in order to avoid going thru this process again
          $this.addClass('exists');
      }
      
      function _whichTable($this) {
          $mainObject.movedTable = $this.parents('tr').next('tr').find(tableClassName);
      }
      
      function _closeElement($this) {
          $this.removeClass('opened');
          $mainObject.movedTable.removeClass(toggleClass).stop( true, false ).slideToggle(300);
      }
      
      function _openElement($this) {
          $this.addClass('opened');
          $mainObject.movedTable.addClass(toggleClass).stop( true, false ).slideToggle(800);
      }
    }
  };
  // Tek tabs.
  Drupal.behaviors.tekTabs = {
    attach: function (context, settings) {
      var $tekTabsWrap = $('.tek-tabs, .sticky-tabs', context);
      var $navTabs = $tekTabsWrap.find('.tek-tabs__nav, .sticky-tabs__nav');
      var $stickyHead = $tekTabsWrap.find('.sticky-tabs__head');
      var $tabLinks = $navTabs.find('a');
      var activeFirst = function () {
        var $tab = $(this).find('.tek-tabs__nav, .sticky-tabs__nav').find('li');
        var $activeIndex;
        var pageurl = decodeURIComponent(window.location.href);
        var $anchor_id = pageurl.split('#')[1];
        $.each($tab, function(index, val) {
          if ( typeof $anchor_id != 'undefined') {
            var $series_tab_id = $tab.eq(index).attr('id');
            if ($series_tab_id == $anchor_id) {
              $activeIndex = index;
              return false;
            }
          }
        });
        var $tabsPane = $(this).find('.tab-pane');
        if( $activeIndex ) {
          $tab.eq(0).find('a').removeClass('active');
          $tabsPane.eq(0).removeClass('active');
        }
        else {
          $activeIndex = 0;
        } 
        var $active = $tab.eq($activeIndex).find('a');
        // Initially make active the first tab list element.
        $active.addClass('active');
        // Initially make active the first pane content.
        $tabsPane.eq($activeIndex).addClass('active');
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

      // Set class 'active' for the current element, remove this class for inactive one.
      function activeState($link) {
        $link.parents('.tek-tabs__nav, .sticky-tabs__nav').find('a').removeClass('active');
        $link.addClass('active');
        // Jog the scroll when tab changes to get price spider script to reevaluate the widgets.
        $(window).scrollTop($(window).scrollTop()-1);
        $(window).scrollTop($(window).scrollTop()+1);
      }

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
    }
  };
  // Sticky tabs functionality.
  Drupal.behaviors.stickyTabs = {
    attach: function (context, settings) {
      var $stickyTabs = $('.sticky-tabs', context);
      if ($stickyTabs.length) {
        var $stickyTabsTitle = $stickyTabs.find('.sticky-tabs__title');
        var clasSticky = 'is-sticky';
        var tabsOffset = $stickyTabs.offset().top;
        var stickyFunctional = function () {
          if ($(window).scrollTop() >= (tabsOffset - stickyHeaderHeight)) {
            $html.addClass(clasSticky);
          }
          else {
            $html.removeClass(clasSticky);
          }
        };
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
        $(window).on('scroll', stickyFunctional);
      }
    }
  };

  // Learning center top tier tabs
  Drupal.behaviors.learningTabs = {
    attach: function (context, settings) {  
        $('form[class*="learning-center-form"] .button').click(function(e){
        e.preventDefault();
        $(this).addClass('active').siblings().removeClass('active');
        e.stopImmediatePropagation();
      }); 
      $('.learning-tabs__nav li a').on('click touch', function (e) {
        e.preventDefault();
        var contentId = $(this).attr('id');
        $('.' + contentId).fadeIn().siblings('.tab-pane').hide();
      });
      
    }
  };

  // Main menu functionality on mobile.
  Drupal.behaviors.mainMenu = {
    attach: function (context, settings) {
      $('.header', context).once('mainMenu').each(function () {
        
        var $menu_btn           = $('#btn-menu', context);
        var $nav                = $('.header__menu', context);
        var navClass            = 'js-nav';
        var searchClass         = 'js-search';
        var $subMenu            = $nav.find('.sub-menu');
        var $headerSearch       = $('.header-right .header-search-form', context);
        var $search_btn         = $('#btn-search', context);
        var class_search_form   = '.header__top-mobile .search-block-form';
        var $search_form_mobile = $(class_search_form, context);
        
        var showHideMenu = function (e) {
          
          e.preventDefault();
          e.stopPropagation();
          if (!$html.hasClass(navClass)) {
            $html.addClass(navClass);
            $nav.slideDown('slow');
            $nav.find('.parent-item').parent().removeClass('expanded');
          } else {
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
          $menu_btn.once('main-menu-dropdown').on('click', showHideMenu);
        }
        
        if ($search_btn.length) {
          $search_btn.on('click', function (e) {
            e.preventDefault();
            
            // In some cases the search bar, which is dynamically added,
            // would not be attached to DOM,
            // in this case we need to try defining it again
            ($search_form_mobile.length === 0) ? $search_form_mobile = $html.find(class_search_form, context) : $search_form_mobile;
            
            if ($html.hasClass(navClass)) {
              $html.removeClass(navClass);
              $nav.slideUp(800);
            }
            
            $html.toggleClass(searchClass);
            $search_form_mobile.slideToggle(800);
          });
        }

        enquire.register(small_desktop, {
          match: function () {
            $headerSearch.addClass('sub-menu');
          },
          unmatch: function () {
            $headerSearch.removeClass('sub-menu');
          }
        });
      });
    }
  };

  // Header menu show/hide functionality.

  Drupal.behaviors.headerShowHide = {
    attach: function (context, settings) {
      $('.header__menu', context).once('headerShowHide').each(function () {
        
        var $menu_items       = $('.header__menu .parent-item', context);
        var expand_class      = 'expanded';
        var class_btn_search  = '.header__menu .btn--search';
        var class_search_form = '.header__menu .header-search-form';
        var $search_btn       = $html.find(class_btn_search, context);
        var $search_form      = $html.find(class_search_form, context);
        
        var menuItemToggle = function (e) {
          
          e.preventDefault();
          
          var $this = $(this);
          var $parent_item = $this.parent();
          var $menu_items = $('.header__menu .parent-item');
          
          //console.log('__exec menuItemToggle');
          
          $menu_items.not($this).parent().removeClass(expand_class).find('.sub-menu').slideUp(800);
          $parent_item.find('.sub-menu').slideToggle(800);
          $parent_item.toggleClass(expand_class);
        };
        
        var activateSearchBar = function (retries, delay) {
          
          delay   = delay || 100;
          retries = retries || 5;
          
          // We need to wait while those elements get added to DOM
          // Which means we need to look for them with each try
          $search_btn   = $html.find(class_btn_search, context);
          $search_form  = $html.find(class_search_form, context);
          
          // In some cases the search bar, which is dynamically added,
          // would not be attached to DOM,
          // in this case we need to try defining it again
          if ($search_btn.length === 0 || $search_form.length === 0) {
            
            // $('.header__menu .search-block-form .header-search-form')
            
            //console.log('__exec activateSearchBar');
            //console.log('__result error');
            //console.log($search_btn);
            //console.log($search_form);
            //console.log(retries); // print retry count
            
            retries > 0 && setTimeout(function(){
              activateSearchBar(--retries);
            }, delay);
          } else {
            
            //console.log('__exec activateSearchBar');
            //console.log('__result success');
            //console.log($search_btn);
            //console.log($search_form);
            //console.log(retries); // print retry count
            
            enquire.register(small_desktop, {
              match: function () {
                $search_form.addClass('sub-menu');
              },
              unmatch : function() {
                $search_form.removeClass('sub-menu');
              }
            });
            
            
            $search_btn.on('click', menuItemToggle);
          }
        };
        
        
        // In some cases the search bar, which is dynamically added,
        // would not be attached to DOM,
        // in this case we need to try defining it again
        if ($search_btn.length === 0 || $search_form.length === 0)
          activateSearchBar();
        
        //console.log('__exec .continues.')
        
        $menu_items.on('click', menuItemToggle);
        
        // Close dropdown when click outside it.
        $html.on('touchstart click', function (e) {
          var $expanded_item = $('.header__menu .expanded', context);
          if ($expanded_item.length) {
            if (!$expanded_item.is(e.target) && $expanded_item.has(e.target).length === 0) {
              $expanded_item.removeClass(expand_class).find('.sub-menu').slideUp(800);
            }
          }
        });
        
      });
    }
  };

  // Mark the menu dropdown columns that contains buttons to add bottom space for them.
  Drupal.behaviors.mainMenuBtn = {
    attach: function (context, settings) {
      var $header_menu_col = $('.header-left', context).find('.menu-col');
      if ($header_menu_col.length) {
        $header_menu_col.each(function () {
          if ($(this).find('.btn').length) {
            $(this).addClass('bottom-btn');
          }
        });
      }
    }
  };

  Drupal.behaviors.stickyHeaderMobile = {
    attach: function (context, settings) {
      var stickyHeader = function () {
        var $toolBarHeight = 0;
        if ($('.toolbar-bar').length) {
          $toolBarHeight = $('.toolbar-bar').height();
        }
        if ($(window).scrollTop() > $toolBarHeight) {
          $('.header').addClass('sticky');
        }
        else {
          $('.header').removeClass('sticky');
        }
      };

      enquire.register(mobile_and_tablet, {
        match: function () {
          $(window).on('scroll', stickyHeader);
        },
        unmatch: function () {
          $(window).off('scroll', stickyHeader);
        }
      });
    }
  };

  Drupal.behaviors.dropdownBtn = {
    attach: function (context, settings) {
      // Button with dropdown.
      var $dropdown = $('.dropdown', context);
      var $dropdownToggle = $dropdown.find('.btn, .top-icon');
      var open_class = 'opened';
      if ($dropdown.length) {
        $dropdownToggle.on('click', function (e) {
          e.preventDefault();
          $(this).parents('.dropdown').toggleClass(open_class);
        });
        // Close dropdown when click outside it.
        $('html').on('touchstart click', function (e) {
          if (!$dropdown.is(e.target) && $dropdown.has(e.target).length === 0) {
            $dropdown.removeClass(open_class);
          }
        });
      }
    }
  };

  Drupal.behaviors.calloutShowHide = {
    attach: function (context, settings) {
      var $stickyBtn = $('.sticky-btn', context);
      var $showCallout = $stickyBtn.find('.icon');
      var $hideCallout = $stickyBtn.find('.callout__close');

      $showCallout.on('click', function () {
        $(this).parents('.sticky-btn').addClass('show-callout')
          .parents('.sticky-btn-group').addClass('active');
      });

      $hideCallout.on('click', function () {
        $(this).parents('.sticky-btn').removeClass('show-callout')
          .parents('.sticky-btn-group').removeClass('active');
      });
    }
  };

  Drupal.behaviors.configureSummaryAddClass = {
    attach: function (context, settings) {
      var $configSummary = $('.configure-product__single-option--container details summary', context);
      $configSummary.addClass('icon-chevron-down');
    }
  };

  // Go to top functionality.
  Drupal.behaviors.goToTop = {
    attach: function (context, settings) {
      var $linkToTop = $('.scroll-top', context);
      var visibleOnScroll = function () {
        if ($(this).scrollTop() > 1000) {
          $linkToTop.addClass('visible');
        }
        else {
          $linkToTop.removeClass('visible');
        }
      };

      enquire.register(desktop, {
        match: function () {
          $(window).on('scroll', visibleOnScroll);
          // Click event to scroll to top.
          $linkToTop.on('click', function () {
            $('html, body').animate({scrollTop: 0}, 800);
            return false;
          });
        },
        unmatch: function () {
          $(window).off('scroll', visibleOnScroll);
        }
      });
    }
  };
  // Adds and Removes Classs on Registration Fields for Interaction to occur.
  Drupal.behaviors.registrationFormLabels = {
    attach: function (context, settings) {
      var $registrationfields = $('form.user-register-form input:not([id*="edit-field-address"]), form.user-register-form textarea', context);
      var $registrationErrorFields = $('form.user-register-form input.error');
      $($registrationfields).each(function( index ) {
        if ($(this).val()) {
          $(this).prev('label').addClass('hasValue');
        }
      });
      $($registrationErrorFields).each(function( index ) {
        $(this).prev('label').addClass('error');
      });      
      $registrationfields.focus(function () {
        $(this).prev('label').addClass('registration-label__selected');
      });
      $registrationfields.blur(function () {
        $(this).prev('label').removeClass('registration-label__selected');
        if ($(this).val()) {
          $(this).prev('label').addClass('hasValue');
        }
        else {
          $(this).prev('label').removeClass('hasValue');
        }
      });
    }
  };
  // Apply 'basictable' to make tables responsive on mobile.
  Drupal.behaviors.responsiveTable = {
    attach: function (context) {
      var $responsiveTable = $('.responsive-data table', context);
      if ($responsiveTable.length) {
        $responsiveTable.basictable({
          breakpoint: 767
        });
      }
    }
  };

  // Add wrapper to table to add scroll on mobile.
  Drupal.behaviors.scrollTable = {
    attach: function (context) {
      $('.compare-table', context).once('.compareTable').each(function () {
        var tableWrapper = $('<div>', {
          class: 'scroll-table-wrap'
        });
        $(this).wrap(tableWrapper);
      });
    }
  };

  // Init Bootstrap Carousel.
  Drupal.behaviors.carouselInit = {
    attach: function (context) {
      $('.carousel', context).once('carouselInit').each(function () {
        var carouselItem = $(this).find('.carousel-inner div');
        $(this).carousel({
          interval: 8000
        });
        carouselItem.first().addClass('active');
      });
    }
  };

  // Show-hide Filters for Sales Tool Search.
  Drupal.behaviors.salesExpandFilters = {
    attach: function (context) {
      var $toggleButton = $('.filter-toggle', context);
      var $salesFilters = $('#sales-filters');

      $toggleButton.on('click', function(e) {
        e.preventDefault();
        $salesFilters.toggleClass('hidden-filters');
      });
    }
  };
  
  // Sales Tool Icon Changes
  Drupal.behaviors.changeImage = {
    attach: function (context) {
      var $changeImage = $('.changeImage', context);

      $changeImage.on('click', function () {
        var path_to_image = $(this).attr('src');

        if ( path_to_image === "/themes/custom/tektronix/source/images/star.svg") {
          path_to_image = "/themes/custom/tektronix/source/images/star-on.svg";
        }
        else if (path_to_image === "/themes/custom/tektronix/source/images/star-on.svg") {
          path_to_image = "/themes/custom/tektronix/source/images/star.svg";
        }

        return $(this).attr('src', path_to_image);
      });
    }
  };


  // Sales Tools Thumbs Voting
  Drupal.behaviors.thumbs = {
    attach: function (context) {

      var path_to_image_up = "/themes/custom/tektronix/source/images/thumbs-up.svg";
      var path_to_image_up_on = "/themes/custom/tektronix/source/images/thumbs-up-on.svg";
      var path_to_image_down = "/themes/custom/tektronix/source/images/thumbs-down.svg";
      var path_to_image_down_on = "/themes/custom/tektronix/source/images/thumbs-down-on.svg";

      $('.thumbs-up').on('click', function () {
        var $parent = $(this).parents('.sales-tool--search-result').eq(0);
        var $thumbUp = $parent.find('.thumbs-up-icon');
        var $thumbDown = $parent.find('.thumbs-down-icon');
        $thumbUp.attr('src', path_to_image_up_on);
        $thumbDown.attr('src', path_to_image_down);
      });

      $('.thumbs-down').on('click', function () {
        var $parent = $(this).parents('.sales-tool--search-result').eq(0);
        var $thumbDown = $parent.find('.thumbs-down-icon');
        var $thumbUp = $parent.find('.thumbs-up-icon');
        $thumbDown.attr('src', path_to_image_down_on);
        $thumbUp.attr('src', path_to_image_up);
      });

    }
  }

  // Show-hide Filters for Video Page.
  Drupal.behaviors.videosExpandFilters = {
    attach: function (context) {
      var $toggleButton = $('#js-show-video-filter', context);
      var $videosFilters = $('#views-exposed-form-media-related-videos-all-videos');

      $toggleButton.on('click', function(e) {
        e.preventDefault();
        $videosFilters.toggleClass('show-video-filters');
      });
    }
  };
  
  // Adds Class to .featured-video__media class if Youku video
  Drupal.behaviors.addYoukuVideoClass = {
    attach: function (context, settings) {
      var $isYoukuVideo = $('.field--field_youku_video', context);
      $($isYoukuVideo).each(function( index ) {
        $(this).parent().addClass('youku_video');
      });      
    }
  };
  
  // Language Selector Sidebar Functionality
  Drupal.behaviors.languageSelectSidebar = {
    attach: function (context, settings) {
      var $langSelectorGlobe = $('.icon-earth.header-right__item', context);
      var $sideNavLangSelector = $('.side-nav__lang-selector', context);
      var $sideNavLangSelectorClose = $('.side-nav__lang-selector .side-nav__lang-selector--header', context);
      
      $langSelectorGlobe.on('click', function(e) {
        e.preventDefault();
        $sideNavLangSelector.width(250);
      });
      
      $sideNavLangSelectorClose.on('click', function(e) {
        e.preventDefault();
        $sideNavLangSelector.width(0);
      });
    }
  };
  
  Drupal.behaviors.langShowHide = {
    attach: function (context, settings) {
      $('.lang-selector-nav__region-menu', context).once('langShowHide').each(function () {
        var $langMenu       = $('.lang-selector-nav__region-menu .parent-item', context);
        var expand_class      = 'expanded';
        var langMenuItemToggle = function (e) {
          e.preventDefault();
          var $this = $(this);
          var $parent_item = $this.parent();
          var $menu_items = $('.header__menu .parent-item');
          $langMenu.not($this).parent().removeClass(expand_class).find('.lang-sub-menu').slideUp(800);
          $parent_item.find('.lang-sub-menu').slideToggle(800);
          $parent_item.toggleClass(expand_class);
        };
        
        $langMenu.on('click', langMenuItemToggle);
    
      });
    }
  };

  // Show hide Software Download Agreement.
    Drupal.behaviors.hideShowSoftwareAgreement = {
        attach: function (context) {
            $('.software-download-agreement-text', context).css('display', 'none');
            $('.software-download-agreement-text', context).removeClass('hidden-xs hidden-sm hidden-md hidden-lg');

            $('.software-download-agreement', context).on('click', function () {
                var link = $(this);
                $('.software-download-agreement-text', context).slideToggle('slow', function () {
                    if ($(this).is(':visible')) {
                        link.text(Drupal.t('Hide Agreement'));
                    }
                    else {
                        link.text(Drupal.t('Software Download Agreement'));
                    }
                });
            });
        }
    };

    // Show hide Manual Download Agreement.
    Drupal.behaviors.hideShowManualAgreement = {
        attach: function (context) {
            $('.manual-download-agreement-text', context).css('display', 'none');
            $('.manual-download-agreement-text', context).removeClass('hidden-xs hidden-sm hidden-md hidden-lg');

            $('.manual-download-agreement', context).on('click', function () {
                var link = $(this);
                $('.manual-download-agreement-text', context).slideToggle('slow', function () {
                    if ($(this).is(':visible')) {
                        link.text(Drupal.t('Hide Agreement'));
                    }
                    else {
                        link.text(Drupal.t('Manuals Download Agreement'));
                    }
                });
            });
        }
    };

}(window, window.document, window.jQuery, window.Drupal));
