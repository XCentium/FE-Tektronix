/**
 * @file
 * Add Drupal functions.
 */

(function (window, document, $, Drupal) {
  'use strict';
  Drupal.behaviors.tekMyService = {
    attach: function (context, drupalSettings) {
      $(document).ready(function() {
        // The code below would be replaced to directly use the Cloud flare based Country Variable (Javascript worker).
        // For time being I have created a web service call which would always give us a NON Cached version of country for the current User.
        var fetchCountryUrl = '/cf-country';
        $.ajax({
          url: fetchCountryUrl,
          success: function(data) {
            if (data.status_code == 200 && data.status == "success") {
              var country_code = data.country;
              if($('div.tek-custom-pricing-table-wrapper').length) {
                $('div.tek-custom-pricing-table-wrapper').each(function () {
                  var product_title  =  this.id;
                  if (product_title != '') {
                    var url = '/ajax/pricing/service/' + product_title + '/' + country_code;
                    $.ajax({
                      url: url,
                      beforeSend: function() {
                        $("div.tek-custom-pricing-table-wrapper").hide();
                      },
                      success: function(data) {
                        if (data.status_code == 200) {
                          $("div.tek-custom-pricing-table-wrapper").replaceWith('<div>' + data.result  + '</div>');
                          $("div.tek-custom-pricing-table-wrapper").show();
                        }
                      }
                    })
                  }
                });
              }
            }
          }
        })
      });
    }
  };
})(window, window.document, window.jQuery, window.Drupal);
