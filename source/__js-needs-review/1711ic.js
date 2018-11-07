/**
 * @file
 * IC Landing page scripts.
 */

(function (window, document, $, Drupal) {
  'use strict';

  Drupal.behaviors.modals = {
    attach: function (context, settings) {

   $('.ic-landing .btn-download').on('click', function () {
      $('.ic-landing .popup-mask, .ic-landing .popup-window').fadeIn(300)
    });
    $('.ic-landing .popup-window-close').on('click', function () {
      $('.ic-landing .popup-mask, .ic-landing .popup-window').fadeOut(300)
    });

    }
  };

}(window, window.document, window.jQuery, window.Drupal));
// JavaScript Document