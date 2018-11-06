/**
 * @file
 * JS Behaviors for Mark Reviewed Buttons/Links
 */

(function ($, window, document) {
  'use strict';

      // Apply filters when an option is selected.
      $('a.mark-reviewed-ajax').once('bindMarkReviewedLinks').each(function() {

        $(this).on('click', function(e) {
          e.preventDefault();
          e.stopPropagation();

          var link = $(this);
          var url = $(this).attr('href');
          var pattern = /sales-tools\/mark-reviewed\/[0-9]+/;

          // Don't attempt to process if URL is invalid.
          if (!url.match(pattern)) {
            return;
          }

          $.ajax({
            url: url,
            beforeSend: function() {
              var throbber = $('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div></div>');
              link.after(throbber);
            },
            success: function(data) {
              $('.ajax-progress-throbber').remove();
              if (data.status_code == 200) {
                $('img', link).attr('src', '/themes/custom/tektronix/source/images/approve-doc-on.svg');
              }
            }
          })
        });
      });

})(jQuery, this, this.document);