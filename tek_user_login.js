/**
 * @file
 * Add Drupal functions.
 */

(function ($) {
  Drupal.behaviors.userLoginForms = {
    attach: function (context, drupalSettings) {
      var restricted_email_address_domains  =  drupalSettings.tek_user.tek_user_login.restricted_email_address_domains;
      var login_popup_error_message  =  drupalSettings.tek_user.tek_user_login.restricted_email_address_domains_error_message;
      var restricted_email_address_domains_array = restricted_email_address_domains.split(",");
      var warning = $('<div id="login-warning" style=" background: #ffd none repeat scroll 0 0;border: 1px solid #f0c020;color: #220;margin:15px 0 15px 0;padding: 10px;">' + login_popup_error_message + '</div>').css('display', 'none');

      if ($('#login-warning').length == 0) {
        $('#user-login-form .js-form-type-email').before(warning);
      }

      $("#edit-name").change(function() {
        for (var i = 0; i < restricted_email_address_domains_array.length; i++) {
          var idx = $(this).val().indexOf(restricted_email_address_domains_array[i]);
          if (idx > -1) {
            warning.slideDown();
            $("#edit-submit").attr('disabled','disabled');
            break;
          }
          else {
            warning.slideUp();
            $("#edit-submit").removeAttr('disabled');
          }
        }
      });

    }
  };
})(jQuery);
