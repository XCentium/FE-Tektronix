/**
 * @file
 * Add Drupal functions.
 */

(function (window, document, $) {

    'use strict';
        attach: function (context) {
            // This is for price spider.
            $('.ps-widget', context).first().once('processPriceSpider').each(function(){
                $("table.model-table thead tr th:last-child").hide();
                $("table.model-table tbody tr td:last-child").hide();
                $("div.model-item__price-spider").hide();

                var $ajax_url = '/ajax/enable_price_spider';
                $.ajax({
                    url: $ajax_url,
                    success: function (data) {
                        if (data.show_spider) {
                            // Add spider script. Show button or div.
                            $.getScript("//cdn.pricespider.com/1/lib/ps-widget.js");
                            $("table.model-table thead tr th:last-child").show();
                            $("table.model-table tbody tr td:last-child").show();
                            $("div.model-item__price-spider").show();
                        }
                        else {
                            // Delete spider column or div.
                            $("table.model-table thead tr th:last-child").remove();
                            $("table.model-table tbody tr td:last-child").remove();
                            $("div.model-item__price-spider").remove();
                        }
                    }
                });
            });

            // The code below would be replaced to directly use the Cloud flare based Country Variable (Javascript worker).
            // For time being I have created a web service call which would always give us a NON Cached version of country for the current User.
            var fetchCountryUrl = '/cf-country';
            $.ajax({
              url: fetchCountryUrl,
              success: function(data) {
                if (data.status_code == 200 && data.status == "success") {
                  var country_code = data.country;

                  // This is for models table which is Views listing displayed on Product Series pages.
                  $('.price', context).first().once('processPrice').each(function(){
                      $('.price').each(function () {
                          var product_title  =  this.id;
                          if (product_title != '') {
                            var urlnew = '/ajax/pricing/model/' + product_title + '/' + country_code;
                            $.ajax({
                              url: urlnew,
                              success: function(data) {
                                if (data.status_code == 200) {
                                  $("div.inner-price-wrapper-psi-"+product_title).replaceWith('' + data.actual_price  + '');
                                  $("div.price-"+product_title).removeClass("price");
                                }
                                else {
                                  $("div.inner-price-wrapper-psi-"+product_title).replaceWith('');
                                  $("div.price-"+product_title).removeClass("price");
                                }
                              }
                            });
                          }
                      });
                  });

                  // The code below displays Price Range on Product Series main page display's Block on Top Left corrner..
                  $('#price-block', context).first().once('processPriceBlock').each(function(){
                      var node_id_of_product_series  =  drupalSettings.tek_product_series.product_series.product_series_node_id_for_ajax_call;
                      var url = '/ajax/pricing/series/' + node_id_of_product_series + '/' + country_code;
                      $.ajax({
                          url: url,
                          success: function(data) {
                            if (data.status_code == 200) {
                              // If the Prices returned are Individual Min & Max.
                              if (data.status_text == 'individual prices') {
                                $("div#price-block").replaceWith("<div class='value'><span itemprop='priceCurrency' content='"
                                  + data.currency_code + "'>" + data.price_currency +
                                  "</span><span itemprop='lowPrice' content='"
                                  + data.price_low + "'>" + data.price_low +
                                  "</span> - <span itemprop='priceCurrency' content='"
                                  + data.currency_code + "'>" + data.price_currency +
                                  "</span><span itemprop='highPrice' content='"
                                  + data.price_high + "'>" + data.price_high +
                                  "</span><link itemprop='availability' href='http://schema.org/InStock' /></div>");
                              }
                              // If the Prices returned are combined Price Range.
                              else if (data.status_text == 'price range') {
                                $("div#price-block").replaceWith("<div class='value'><span itemprop='priceCurrency' content=''></span><span itemprop='lowPrice' content='"
                                  + data.price_range + "'>" + data.price_range +
                                  "</span><link itemprop='availability' href='http://schema.org/InStock' /></div>");
                              }
                              // If no price is found then we do not display any thing.
                              else if (data.status_text == 'no result found') {
                                $("div#price-block").replaceWith("");
                                $("div#tek-product-series-label-div-block").replaceWith("");
                              }
                            }
                            else {
                              $("div#price-block").replaceWith("");
                              $("div#tek-product-series-label-div-block").replaceWith("");
                            }
                          }
                      });
                  });
                }
              }
            })

            var $dropdownToggle = $('.price-band__dropdown .btn', context);
            $dropdownToggle.on('click', function (e) {
                e.preventDefault();
                $(this).parents('.price-band__dropdown').toggleClass('opened');
                $(this).closest('.price-band__col').siblings().find('.price-band__dropdown').removeClass('opened');
            });




        }

})(window, window.document, window.jQuery);

