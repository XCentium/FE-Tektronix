(function ($) {
    attach: function (context, drupalSettings) {
      var unit = drupalSettings.tek_specification.specification.unit;
      $('.use-category input', context).once('specificationUnit').after(
        '<span class="unit">&nbsp;' + unit + '</span>'
      );
    }

  /**
   * Populates Specification hidden title field from select_or_other other field value.
   *
   * @type {{attach: attach}}
   */
  Drupal.behaviors.specifictionCopyOtherNameToTitle = {
    attach: function (context, drupalSettings) {
      var $catOther = null;
      if (drupalSettings.tek_specification.specification.inline_form) {
        // Specification inline entity form.
        $catOther = $('[name$="[field_category][other]"]', context);
        if ($catOther !== null) {
          $catOther.on('blur', function () {
            $(this).closest('.ief-form').find('[name$="[title][0][value]"]').val($(this).val());
          });
        }
      }
      else {
        // Default specification form.
        $('#edit-field-category-other', context).on('blur', function () {
          $('#edit-title-0-value').val($(this).val());
        });
      }
    }
  };
})(jQuery);
