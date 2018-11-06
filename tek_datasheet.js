/**
 * @file
 * Add Drupal functions.
 */

(function (window, document, $) {
  'use strict';
    attach: function (context) {
      $(document).ready(function() {
        // Just for testing purpose ONLY and would be removed.
        if($('#datasheet-price-block').length){
          var node_id_of_datasheet  =  drupalSettings.tek_datasheet.datasheet.datasheet_node_id_for_ajax_call;
          var url = '/fetch-datasheet-product-price/' + node_id_of_datasheet;
          var pattern = /fetch-datasheet-product-price\/[0-9]+/;

          // Don't attempt to process if URL is invalid.
          if (!url.match(pattern)) {
            return;
          }

          $.ajax({
            url: url,
            success: function(data) {
              if (data.status_code == 200) {
                // If the Prices returned are Individual Min & Max.
                if (data.status_text == 'datasheet price fetched') {
                  var low_price = data.price.split('-')[0];
                  $("div#datasheet-price").replaceWith("<div class='price'> <span itemprop='lowPrice' content='"+ low_price + "'>" + low_price + "</span></div>");
                }
                // If no price is found then we do not display any thing.
                else if (data.status_text == 'no result found') {
                  $("div#datasheet-price-block").replaceWith("");
                }
              }
              else {
                $("div#datasheet-price-block").replaceWith("");
              }
            }
          })
        }
      });
    }
})(window, window.document, window.jQuery);