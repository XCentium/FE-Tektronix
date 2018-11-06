/**
 * @file
 * TEK Ecomm Quick Quote javascript actions.
 */

(function ($, window, document) {

  'use strict';

    attach: function (context, settings) {
      var $fieldset = $('#quick-quote-add-item', context);
      $('#toggle-add-model', context).on('click', function () {
        $fieldset.toggleClass('hide');
      });
    }

})(jQuery, this, this.document);
