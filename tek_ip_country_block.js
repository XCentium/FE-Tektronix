/**
 * @file
 * TEK IP Country javascript actions.
 */

(function ($, window, document) {
  'use strict';
    attach: function (context, settings) {
      if (!$('#block-tekipcountryblock').hasClass('initialized') && typeof $.cookie('is_country_block_closed') === 'undefined' && typeof $.cookie('missing_redirect') === 'undefined') {
        Drupal.behaviors.tekIpCountryCheck.initialization(context);
      }
    },

    /**
     * Make some initialization.
     *
     * @param context
     */
    initialization: function (context) {
      // Close block feature.
      $('#block-tekipcountryblock .js-close, #block-tekipcountryblock .close-me').on('click', function (e) {
        e.preventDefault();
        $('#block-tekipcountryblock').slideUp('slow');
        $.post('/tek-ip-country/check', {op: 'close'})
          .done(function (data) {});
      });

      var path = $(location).attr('pathname');
      // Bypass IP call if language = zh-hans.
      var languageCode = $('html').attr('lang');

      if (languageCode != 'zh-hans') {

        // Check user country and show redirect banner block.
        // Fetch the Country from custom Cloudflare variable/JavaScript Worker.

        var req = new XMLHttpRequest();
        req.open('HEAD', '/themes/custom/tektronix/source/images/tek-monogram.svg', false);
        req.send(null);
        var cfCountry = req.getResponseHeader("x-cfw-country-code");
        var user_cf_country = cfCountry;

        if (user_cf_country === '' || user_cf_country === null) {
          var fetchCountryUrl = '/cf-country';
          $.ajax({
            url: fetchCountryUrl,
            success: function(data) {
              if (data.status_code == 200 && data.status == "success") {
                var user_cf_country = data.country;
              }
            }
          });
        }

        $.post('/tek-ip-country/check', {op: 'ajax', path: path, country: user_cf_country}).done(function (data) {
          try {
            if (data.link.length) {
              $('#block-tekipcountryblock .banner--redirect__msg').html($('#block-tekipcountryblock .banner--redirect__msg').html().replace('_link', data.link));
              $('#block-tekipcountryblock .banner--redirect__msg').html($('#block-tekipcountryblock .banner--redirect__msg').html().replace('_link_international', data.link_international));
              $('#block-tekipcountryblock').show();

              $('#block-tekipcountryblock a.close-me').on('click', function (e) {
                e.preventDefault();
                $('#block-tekipcountryblock .js-close').click();
              });
            }
          }
          catch (ex) {}
        });
      }
      else {
          // If language = zh-hans, hard code it.
          $('#block-tekipcountryblock .banner--redirect__msg').html($('#block-tekipcountryblock .banner--redirect__msg').html().replace('_link', '<a href="https://www.tek.com.cn">Tektronix China Site</a>'));
          $('#block-tekipcountryblock .banner--redirect__msg').html($('#block-tekipcountryblock .banner--redirect__msg').html().replace('_link_international', '<a href="https://www.tek.com">Tektronix International Site</a>'));
          $('#block-tekipcountryblock').show();
          $('#block-tekipcountryblock a.close-me').on('click', function (e) {
              e.preventDefault();
              $('#block-tekipcountryblock .js-close').click();
          });
      }
      $('#block-tekipcountryblock').addClass('initialized');
    }

})(jQuery, this, this.document);
