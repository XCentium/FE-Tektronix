/**
 * @file
 * Javascript for the Content Moderation.
 */

(function ($) {
  'use strict';

  /**
   * Behaviors for setting active submit button.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches summary behaviors on media bundle edit forms.
   */
    attach: function (context) {

      var $context = $(context);
      var id = 'edit-field-stage-for-publication-value';
      var $stageForPublish = $context.find('#' + id);
      if (!$stageForPublish.length) {
        return false;
      }

      var $buttons = $context.find('ul.dropbutton');
      var $publish = $buttons.find('.publish');
      var $unpublish = $buttons.find('.unpublish');

      $stageForPublish.click(function () {
        if($stageForPublish.is(":checked")) {
          $publish.addClass('secondary-action');
          $unpublish.removeClass('secondary-action');
        } else {
          $unpublish.addClass('secondary-action');
          $publish.removeClass('secondary-action');
        }
      });
    }
})(jQuery);
