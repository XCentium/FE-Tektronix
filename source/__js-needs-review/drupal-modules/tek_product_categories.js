/**
 * @file
 * Add Drupal functions.
 */

(function (window, document, $){
  'use strict';
      $(document).ready(function() {

        // This JS is called for Product Category page like this - /oscilloscope.

        // The code below would be replaced to directly use the Cloud flare based Country Variable (Javascript worker).
        // For time being I have created a web service call which would always give us a NON Cached version of country for the current User.
        var fetchCountryUrl = '/cf-country';
        var tp_contact_us_link  =  drupalSettings.tek_product_category.product_category.tp_contact_us_link;

        $.ajax({
          url: fetchCountryUrl,
          success: function(data) {
            if (data.status_code == 200 && data.status == "success") {
              var country_code = data.country;

              if($('.price').length) {
                $('.price').each(function () {
                  var node_id_of_product_series  =  this.id;
                  var url = '/ajax/pricing/series/' + node_id_of_product_series + '/' + country_code;

                  $.ajax({
                    url: url,
                    success: function(data) {
                      if (data.status_code == 200 && data.status == "success") {
                        // If the Prices returned are Individual Min & Max.
                        if (data.status_text == 'individual prices') {
                          document.getElementById("currency-sign-section-"+node_id_of_product_series).innerText = data.price_currency;
                          document.getElementById("currency-sign-section-"+node_id_of_product_series).setAttribute('content', data.currency_code);
                          document.getElementById("currency-price-section-"+node_id_of_product_series).innerText = data.price_low;
                          document.getElementById("currency-price-section-"+node_id_of_product_series).setAttribute('content', data.price_low);
                        }
                        // If the Prices returned are combined Price Range.
                        else if (data.status_text == 'price range') {
                          var price_currency_string = data.price_range;
                          var price_currency_array = price_currency_string.split(" - ");
                          if (price_currency_array[0] != '') {
                            document.getElementById("currency-sign-section-"+node_id_of_product_series).innerText = '';
                            document.getElementById("currency-sign-section-"+node_id_of_product_series).setAttribute('content', '');
                            document.getElementById("currency-price-section-"+node_id_of_product_series).innerText = price_currency_array[0];
                            document.getElementById("currency-price-section-"+node_id_of_product_series).setAttribute('content', price_currency_array[0]);
                          }
                        }
                        else if (data.status_text == 'no result found') {
                          $("div.price-"+node_id_of_product_series).replaceWith("<div class='price'>"+data.contact_us_link+"</div>");
                        }
                      }
                      else {
                        $("div.price-"+node_id_of_product_series).replaceWith("<div class='price'>"+ tp_contact_us_link +"</div>");
                      }
                    }
                  })
                });
              }
            }
          }
        })
      });
})(window, window.document, window.jQuery);
