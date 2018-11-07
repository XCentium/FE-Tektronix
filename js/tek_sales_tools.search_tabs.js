/**
 * @file
 * TEK IP Country javascript actions.
 */

(function ($, window, document) {

  'use strict';

      $('.product-series-select select:not(.processed)').change(function (e) {
        window.location.href = $(this).val();
      }).addClass('processed');
})(jQuery, this, this.document);
