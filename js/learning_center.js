/**
 * @file
 * Product Support functions.
 */

(function ($) {
    'use strict';

        attach: function (context) {

            $('.more-items', context).on('click', function () {
                var link = $(this);
                var moretext = Drupal.t('See more');
                var lesstext = Drupal.t('See less');
                if ($('.see-more').length) {
                    $('.search-result', context).removeClass('hidden');
                    $('.more-items', context).removeClass('see-more icon-chevron-down');
                    $('.more-items', context).addClass('see-less icon-chevron-up');
                    link.text(lesstext);
                }
                else if ($('.see-less').length) {
                    $('.extra', context).addClass('hidden');
                    $('.more-items', context).removeClass('see-less icon-chevron-up');
                    $('.more-items', context).addClass('see-more icon-chevron-down');
                    link.text(moretext);
                }
            });
        }
})(window.jQuery);