/**
 * @file
 * Transforms links into radio buttons.
 */

(function ($) {

  'use strict';

  Drupal.facets = Drupal.facets || {};
    attach: function (context, settings) {
      Drupal.facets.makeRadios();
    }

  /**
   * Turns all facet links into radio buttons.
   */
  Drupal.facets.makeRadios = function () {
    // Find all radio facet links and give them a radio.
    var $links = $('.js-facets-radio-links .facet-item a');
    $links.once('facets-radio-transform').each(Drupal.facets.makeRadio);
    // Set indeterminate value on parents having an active trail.
    $('.facet-item--expanded.facet-item--active-trail > input').prop('indeterminate', true);
  };

  /**
   * Replace a link with a radio button.
   */
  Drupal.facets.makeRadio = function () {
    var $link = $(this);
    var $ul = $link.parents('.js-facets-checkbox-links');
    var active = $link.hasClass('is-active');
    var description = $link.html();
    var href = $link.attr('href');
    var id = $link.data('drupal-facet-item-id');
    var name = $ul.data('drupal-facet-id');

    var radio = $('<input type="radio" class="facets-radio">')
      .attr('id', id)
      .attr('name', 'name')
      .data($link.data())
      .data('facetsredir', href);
    var label = $('<label for="' + id + '">' + description + '</label>');

    radio.on('change.facets', function (e) {
      Drupal.facets.disableFacet($link.parents('.js-facets-radio-links'));
      window.location.href = $(this).data('facetsredir');
    });

    if (active) {
      radio.attr('checked', true);
      label.find('.js-facet-deactivate').remove();
    }

    $link.before(radio).before(label).remove();

  };

  /**
   * Disable all facet radios in the facet and apply a 'disabled' class.
   *
   * @param {object} $facet
   *   jQuery object of the facet.
   */
  Drupal.facets.disableFacet = function ($facet) {
    $facet.addClass('facets-disabled');
    $('input.facets-radio').click(Drupal.facets.preventDefault);
    $('input.facetapi-radio', $facet).attr('disabled', true);
  };

  /**
   * Event listener for easy prevention of event propagation.
   *
   * @param {object} e
   *   Event.
   */
  Drupal.facets.preventDefault = function (e) {
    e.preventDefault();
  };

})(jQuery);
