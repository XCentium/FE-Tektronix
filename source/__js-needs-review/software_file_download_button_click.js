/**
 * @file
 * Add Drupal functions.
 */

(function ($, Drupal) {
  Drupal.behaviors.softwareFileDonwloadButtonClick = {
    attach: function (context, drupalSettings) {
      var duration  =  drupalSettings.tek_util.display_wait_message_for_file_download.file_download_wait_message;
      $("li a.download").click(function(){
        $(".intermediate-file-download-wait-message").show().delay(duration).fadeOut();
      });
    }
  };
})(jQuery, Drupal);
