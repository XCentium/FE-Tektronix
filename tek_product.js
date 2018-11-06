/**
 * @file
 * Add Drupal functions.
 */

(function (window, document, $) {
  'use strict';
    attach: function (context) {
      $(document).ready(function() {

        // The code below would be replaced to directly use the Cloud flare based Country Variable (Javascript worker).
        // For time being I have created a web service call which would always give us a NON Cached version of country for the current User.
        var fetchCountryUrl = '/cf-country';

        $.ajax({
          url: fetchCountryUrl,
          success: function(data) {
            if (data.status_code == 200 && data.status == "success") {
              var country_code = data.country;

              // This functionality is for Product Configuration page like this one - tekstore/configure/[Product Title]
              if($('p#product-configuration-price').length){
                var product_model_name  =  drupalSettings.tek_product.tek_product_series_pricing.product_model_name;
                var custom_message = Drupal.t('Select from the list of required options to determine the price.');
                var url = '/ajax/pricing/model/' + product_model_name + '/' + country_code;
                $.ajax({
                  url: url,
                  success: function(data) {
                    if (data.status_code == 200) {
                      if (data.actual_price != '' && data.current_price_flag == 'product_min_price') {
                        $("p#product-configuration-price").replaceWith('<p class="configure-product__price">' + data.actual_price  + '</p>');
                      }
                      else if (data.current_price_flag == 'product_option_min_price') {
                        $("p#product-configuration-price").replaceWith('<p class="configure-product__price">' + custom_message  + '</p>');
                      }
                      else {
                        $("p#product-configuration-price").replaceWith('<p class="configure-product__price">' + custom_message  + '</p>');
                      }
                    }
                    else {
                      $("p#product-configuration-price").replaceWith('<p class="configure-product__price">' + custom_message  + '</p>');
                    }
                  }
                })
              }

              // This functionality is for Probe selector page i.e. probe-selector
              if($('.price').length) {
                $('.price').each(function () {
                  var product_title  =  this.id;
                  if (product_title != '') {
                    var urlnew = '/ajax/pricing/model/' + product_title + '/' + country_code;
                    var custom_message_two = Drupal.t('Price Unavailable');
                    $.ajax({
                      url: urlnew,
                      success: function(data) {
                        if (data.status_code == 200) {
                          if (data.actual_price != '') {
                            document.getElementById("currency-price-section-"+product_title).innerText = data.actual_price;
                          }
                          else {
                            document.getElementById("currency-price-section-"+product_title).innerText = custom_message_two;
                          }
                        }
                        else {
                          document.getElementById("currency-price-section-"+product_title).innerText = custom_message_two;
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
})(window, window.document, window.jQuery);
