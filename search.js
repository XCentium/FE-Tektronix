/**
 * @file
 * Add Drupal functions.
 */

(function ($) {
  'use strict';

  /**
   * Attaches searchFilters to Content Type/Taxonomy filters from search view.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   */
    attach: function (context) {
      $('.search-view__filter ul', context).once('searchFilters').each(function () {
        var displayLimit = 7;
        var more = Drupal.t('+ Show more filters');
        var less = Drupal.t('- Show fewer filters');
        var $this = $(this);
        var $facetItem = $this.find('.facet-item');
        if ($facetItem.length > displayLimit) {
          var $toggle = $this.closest('.facets').find('.js-toggle');
          $toggle.text(more);
          for (var i = displayLimit; i < $facetItem.length; i++) {
            $facetItem.eq(i).addClass('toggled').toggle();
          }
        // Add a click event listener to Toggle element.
          $toggle.on('click', function () {
            var $this = $(this);
            var text = $this.text() === more ? less : more;
            $this.text(text);
            $this.closest('.facets').find('.toggled').toggle();
          });
        }
      });
    }
})(jQuery, Drupal);
