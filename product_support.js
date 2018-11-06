/**
 * @file
 * Product Support functions.
 */

(function ($) {
  'use strict';

    attach: function (context) {
      $('.support-help-text', context).css('display', 'none');
      $('.support-help-text', context).removeClass('hidden-xs hidden-sm hidden-md hidden-lg');

      $('.support-help', context).on('click', function () {
        var link = $(this);
        $('.support-help-text', context).slideToggle('slow', function () {
          if ($(this).is(':visible')) {
            link.text('X Close Help');
          }
          else {
            link.text('How do I find my product?');
          }
        });
      });
    }
})(window.jQuery, window.Drupal);
