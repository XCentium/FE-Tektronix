/**
 * @file
 * TEK RMA Request form actions.
 */

(function ($, window, document) {

  'use strict';

      if (!$('#tek-service-rma-request-form', context).hasClass('inited')) {
        Drupal.behaviors.tekRmaRequestForm.initialization(context);
      }
    },

    initialization: function (context) {
      $('#edit-addresses-clear-clear-shipping', context).on('click', function () {
        Drupal.behaviors.tekRmaRequestForm.clearShippingAddress(context);
        return false;
      });
      $('#edit-addresses-clear-clear-billing', context).on('click', function () {
        Drupal.behaviors.tekRmaRequestForm.clearBillingAddress(context);
        return false;
      });

      $('#edit-clear').on('click', function () {
        $('[name^="step1[1][p_repair]"]').attr('checked', false).change();
        $('[name^="p_"]').val('').change();
        $('[name^="step1"]').val('').change();
        $('[name^="files"]').val('').change();
        return false;
      });

      // Trigger Clear forms after ajax submit.
      $(document).ajaxComplete(function (event, xhr, settings) {

        if (settings.extraData != undefined && settings.extraData._triggering_element_value == 'Add Another Product') {
          $('#edit-clear', context).click();
        }
      });

      $('#tek-service-rma-request-form').addClass('inited');
    },

    // Clear shipping address form.
    clearShippingAddress: function (context) {
      $('#edit-addresses-shipping-address-p-shippingname', context).val('').change();
      $('#edit-addresses-address1-shipping-address1', context).val('').change();
      $('#edit-addresses-address2-shipping-address2', context).val('').change();
      $('#edit-addresses-city-shipping-city', context).val('').change();
      $('#edit-addresses-state-shipping-state',context).val('').change();
      $('#edit-addresses-postal-code-shipping-postal-code', context).val('').change();
      $('#edit-addresses-phone-shipping-phone', context).val('').change();
      $('#edit-addresses-country-shipping-country', context).val('US').change();
    },

    // Clear billing address form.
    clearBillingAddress: function (context) {
      $('#edit-addresses-shipping-address-p-billingname', context).val('').change();
      $('#edit-addresses-address1-billing-address1', context).val('').change();
      $('#edit-addresses-address2-billing-address2', context).val('').change();
      $('#edit-addresses-city-billing-city', context).val('').change();
      $('#edit-addresses-state-billing-state', context).val('').change();
      $('#edit-addresses-postal-code-billing-postal-code', context).val('').change();
      $('#edit-addresses-phone-billing-phone', context).val('').change();
      $('#edit-addresses-country-billing-country', context).val('US').change();
    }

})(jQuery, this, this.document);
