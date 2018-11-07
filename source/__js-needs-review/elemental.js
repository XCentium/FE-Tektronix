/**
 * @file
 * Elemental page scripts.
 */

(function (window, document, $, Drupal) {
  'use strict';

  Drupal.behaviors.elementalScrollMenu = {
    attach: function (context, settings) {
      var topMenu = $(".elemental__header__menu"),
        offset = 40,
        topMenuHeight = topMenu.outerHeight()+offset,
        // All list items
        menuItems =  topMenu.find('a[href*="#"]'),
        // Anchors corresponding to menu items
        scrollItems = menuItems.map(function(){
          var href = $(this).attr("href"),
            id = href.substring(href.indexOf('#')),
            item = $(id);
          if (item.length) { return item; }
        });

      // so we can get a fancy scroll animation
      menuItems.once().on('click touch', function(e){
        var href = $(this).attr("href"),
          id = href.substring(href.indexOf('#')),
          offsetTop = href === "#" ? 0 : $(id).offset().top-topMenuHeight+1;
        $('html, body').stop().animate({
          scrollTop: offsetTop
        }, 300);
        e.preventDefault();

        var mobile_and_tablet = 'screen and (max-width:61.9375em)'; // 991px.

        enquire.register(mobile_and_tablet, {
          match: function () {
            $('#btn-menu', context).click();
          },
          unmatch: function () {
            e.preventDefault();
          }
        });

      });

      // Bind to scroll
      $(window).scroll(function(){
        // Get container scroll position
        var fromTop = $(this).scrollTop()+topMenuHeight;

        // Get id of current scroll item
        var cur = scrollItems.map(function(){
          if ($(this).offset().top < fromTop)
            return this;
        });

        // Get the id of the current element
        cur = cur[cur.length-1];
        var id = cur && cur.length ? cur[0].id : "";

        menuItems.parent().removeClass("active");
        if(id){
          menuItems.parent().end().filter("[href*='#"+id+"']").parent().addClass("active");
        }
      })
    }
  };

  Drupal.behaviors.elementalSeries = {
    attach: function (context, settings) {
      $('.js-elemental-video-background, .js-elemental-video-icon').on('click touch', function() {
        $('.js-elemental-video-background').hide();
        $('.js-elemental-video-main').show().find('video').get(0).play();
      });

      $('.js-elemental-icon-scroll').on('click touch', function() {
        var container = $('html, body');

        container.animate({
          scrollTop: $(this).offset().top - container.offset().top + container.scrollTop()
        });
      });
    }
  };

  Drupal.behaviors.elementalDisplay = {
    attach: function (context, settings) {
      // Initial links behaviour on video progress.
      var interval = setInterval(checkTime, 1000);
      function checkTime() {
        var currentTime = $('.js-elemental-display-video video').get(0).currentTime;
        if (Math.floor(currentTime) == 0) {
          $('#elemental-tabs-item-1, #elemental-tabs-item-1-mobile').addClass('active').siblings('.active').removeClass('active');
        }
        if (Math.floor(currentTime) == 5) {
          $('#elemental-tabs-item-2, #elemental-tabs-item-2-mobile').addClass('active').siblings('.active').removeClass('active');
        }
        if (Math.floor(currentTime) == 12) {
          $('#elemental-tabs-item-3, #elemental-tabs-item-3-mobile').addClass('active').siblings('.active').removeClass('active');
        }
      }

      // On click animations will toggle.
      var mainVideo = $('.js-elemental-display-video');
      $('.js-elemental-tab').on('click touch', function() {
        clearInterval(interval);

        if (mainVideo.is(":visible")) {
          mainVideo.hide();
        }

        if (!$(this).hasClass('active')) {
          $(this).addClass('active').siblings('.active').removeClass('active');
        }

        var id  = $(this).attr('id');
        id = id.replace("-mobile", "");

        $('[data-tab-id='+ id +']', $('.js-elemental-gesture-videos')).show().siblings().hide();
      });
    }
  };

  Drupal.behaviors.elementalZoom = {
    attach: function (context, settings) {
      var $section = $('.js-elemental-zoom');
      $section.once().each(function () {

        var id  = $(this).attr('id');

        if (id.length !== 0) {
          var data = $('[data-buttons-id="'+ id +'"]');

          // $('[data-tab-id='+ id +']').show().siblings().hide();
          $(this).find('.js-elemental-panzoom').panzoom({
            $zoomIn: data.find(".zoom-in"),
            $zoomOut: data.find(".zoom-out"),
            $zoomRange: data.find(".zoom-range")
          });

          $(window).on('resize', function(){
            $('.js-elemental-panzoom').panzoom("reset");
          });
        }

      });
    }
  };


  Drupal.behaviors.modals = {
    attach: function (context, settings) {
      $(".js-elemental-modal").each(function () {
        $(this).dialog({
          autoOpen : false,
          modal : true,
          width: 'auto',
          height: 'auto',
          resizable: true,
          closeOnEscape: true,

          create: function(event, ui) {
            var widget = $(this).dialog("widget");
            $(".ui-dialog-titlebar-close span.ui-button-icon-primary", widget).removeClass("ui-button-icon-primary ui-icon ui-icon-closethick").addClass("icon-close");
          },

          open: function(event, ui)   {
            $('video', $(this)).get(0).play();
          },
          close: function(event, ui)   {
            $('video', $(this)).get(0).pause();
          }
        });
      });

      // next add the onclick handler
      $(".js-elemental-channels-watch").click(function() {
        $(".js-elemental-modal-channel").dialog("open");
        return false;
      });
      // next add the onclick handler
      $(".js-elemental-slider-watch").click(function() {
        $(".js-elemental-modal-testimonials").dialog("open");
        return false;
      });

    }
  };

}(window, window.document, window.jQuery, window.Drupal));
