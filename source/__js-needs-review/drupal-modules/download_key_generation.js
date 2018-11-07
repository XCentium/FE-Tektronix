/**
 * @file
 * Add Drupal functions.
 */

(function ($) {
  'use strict';
  var current_page = location.pathname;
    attach: function (context) {
      if (current_page == '/download-key-generation') {
        if ($("#one-time-key-message").text() != '') {
          $('#edit-one-time-key').prop('checked', true);
          $('#edit-one-time-key').prop('disabled',true);
        }
        else if ($("#one-time-key-message").text() == '') {
          $('#edit-one-time-key').prop('checked', false);
          $('#edit-one-time-key').prop('disabled',false);
        }
      }
    }
})(jQuery);
