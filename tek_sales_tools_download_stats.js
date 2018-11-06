/**
 * @file
 * JS Behaviors for Sales Tools Download Stats Page
 */

(function ($, window, document) {
  'use strict';

      // Apply filters when an option is selected.
      $('#sales-tools-download-statistics-form select').change(function() {
        var name = $(this).attr('name');
        var value = $(this).val();
        var safe_value = encodeURI(value);
        var base_path = drupalSettings.path.baseUrl + drupalSettings.path.pathPrefix + drupalSettings.path.currentPath;
        window.location.href = base_path + "?" + name + "=" + safe_value;
      });
})(jQuery, this, this.document);