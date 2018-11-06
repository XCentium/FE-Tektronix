/**
 * @file
 * Add Drupal functions.
 */

(function ($) {
  'use strict';
  var current_page = location.pathname;
  var register_page_pattern = /\/user\/register/;


      // Language of the current Domain the user is on.
      var current_language  =  drupalSettings.tek_user.tek_user.current_domain_language;
      var address_string  =  drupalSettings.tek_user.tek_user.translated_address_string;
      $("#edit-field-address-0 summary:contains('Address')").html(address_string);

      // var usercountry = $("#edit-field-address-wrapper .form-item-field-address-0-country-code .").val();
      // Using a bit different approach as the ID of Country Select Drop down changes on the fly once you select the Country.
      var usercountry = $(".form-item-field-address-0-address-country-code select").val();
      // Display furigana fields only if country is Japan
      if (usercountry == 'JP' ) {
        show_furigana_fields();
      }
      else {
        hide_furigana_fields();
      }

      // Hide Translated fields for Chinese domain for the registration page ONLY when the user lands on the registration page
      // Also the Country Drop down post defaulting it to China.
      if (current_language == 'zh-hans' && current_page.match(register_page_pattern)) {
        $('.english_translation_group').hide();
        $(target_field_wrapper).hide();

        // Hide the Country drop down for this condition.
        $('#edit-field-address-0-address-country-code').hide();
        $('.form-item-field-address-0-address-dependent-locality').hide();
        $('.form-item-field-address-0-address-postal-code').hide();
        $('.form-item-field-address-0-address-address-line1').hide();
        $('.form-item-field-address-0-address-address-line2').hide();
        $('.form-item-field-address-0-address-administrative-area').hide();
        
      }

      // On change of Country, display furigana fields if country selected is Japan
      $(".form-item-field-address-0-address-country-code select").change(function(){
        var selectedCountry = $(this).val();

        if (selectedCountry == 'JP' ) {
          show_furigana_fields();
        }
        else {
          hide_furigana_fields();
        }
      });

      function show_furigana_fields() {
        $("#edit-field-furigananame-wrapper").show();
        $("#edit-field-furiganacompany-wrapper").show();
        $("#edit-field-furiganadiv1-wrapper").show();
        $("#edit-field-furiganadiv2-wrapper").show();
        $("#edit-field-furiganadiv3-wrapper").show();
        $("#edit-field-furiganadiv4-wrapper").show();
      }

      function hide_furigana_fields() {
        $("#edit-field-furigananame-wrapper").hide();
        $("#edit-field-furiganacompany-wrapper").hide();
        $("#edit-field-furiganadiv1-wrapper").hide();
        $("#edit-field-furiganadiv2-wrapper").hide();
        $("#edit-field-furiganadiv3-wrapper").hide();
        $("#edit-field-furiganadiv4-wrapper").hide();
      }

      // To show or hide the translated fields based on English fields if any NON ASCII characters are inserted in them.

      // First Name related code.
      var base_field_value = $("#edit-field-firstname-0-value").val();
      var target_field_wrapper = '#edit-field-translatedfn-wrapper';
      evaluate_translated_field_display(base_field_value, target_field_wrapper);

      $("#edit-field-firstname-0-value").change(function() {
        var base_field_value = $(this).val();
        var target_field_wrapper = '#edit-field-translatedfn-wrapper';
        evaluate_translated_field_display(base_field_value, target_field_wrapper);
      });

      // Second Name related code.
      var base_field_value = $("#edit-field-lastname-0-value").val();
      var target_field_wrapper = '#edit-field-translatedln-wrapper';
      evaluate_translated_field_display(base_field_value, target_field_wrapper);

      $("#edit-field-lastname-0-value").change(function() {
        var base_field_value = $(this).val();
        var target_field_wrapper = '#edit-field-translatedln-wrapper';
        evaluate_translated_field_display(base_field_value, target_field_wrapper);
      });

      // Company Name related code.
      var base_field_value = $("#edit-field-organization-0-value").val();
      var target_field_wrapper = '#edit-field-translatedcn-wrapper';
      evaluate_translated_field_display(base_field_value, target_field_wrapper);

      $("#edit-field-organization-0-value").change(function() {
        var base_field_value = $(this).val();
        var target_field_wrapper = '#edit-field-translatedcn-wrapper';
        evaluate_translated_field_display(base_field_value, target_field_wrapper);
      });

      // Address Line 1 related code.
      var base_field_value = $("#edit-field-address-0-address-address-line1").val();
      var target_field_wrapper = '#edit-field-translatedal1-wrapper';
      evaluate_translated_field_display(base_field_value, target_field_wrapper);

      $("#edit-field-address-0-address-address-line1").change(function() {
        var base_field_value = $(this).val();
        var target_field_wrapper = '#edit-field-translatedal1-wrapper';
        evaluate_translated_field_display(base_field_value, target_field_wrapper);
      });

      // Address Line 2 related code.
      var base_field_value = $("#edit-field-address-0-address-address-line2").val();
      var target_field_wrapper = '#edit-field-translatedal2-wrapper';
      evaluate_translated_field_display(base_field_value, target_field_wrapper);

      $("#edit-field-address-0-address-address-line2").change(function() {
        var base_field_value = $(this).val();
        var target_field_wrapper = '#edit-field-translatedal2-wrapper';
        evaluate_translated_field_display(base_field_value, target_field_wrapper);
      });

      // City related code.
      var base_field_value = $("#edit-field-address-0-address-locality").val();
      var target_field_wrapper = '#edit-field-translatedct-wrapper';
      evaluate_translated_field_display(base_field_value, target_field_wrapper);

      $("#edit-field-address-0-address-locality").change(function() {
        var base_field_value = $(this).val();
        var target_field_wrapper = '#edit-field-translatedct-wrapper';
        evaluate_translated_field_display(base_field_value, target_field_wrapper);
      });



      // Master function to show or hide translated fields on User Profile Edit and Registration page based on ASCII charaters entered in main profile fields.
      function evaluate_translated_field_display(base_field_value, target_field_wrapper) {
        if (current_language == 'zh-hans' && current_page.match(register_page_pattern)) {
          $('.english_translation_group').hide();
          $(target_field_wrapper).hide();
          // Hide the Country drop down for this condition.
          $('#edit-field-address-0-address-country-code').hide();
          $('.form-item-field-address-0-address-dependent-locality').hide();
          $('.form-item-field-address-0-address-postal-code').hide();
          $('.form-item-field-address-0-address-address-line1').hide();
          $('.form-item-field-address-0-address-address-line2').hide();
          $('.form-item-field-address-0-address-administrative-area').hide();
        }
        else if (base_field_value != null) {
          // Trim white space.
          var text = base_field_value.replace(/^\s*|\s*$/g,"");
          // Matches non-English Latin characters.
          var re = new RegExp("[^\u0021-\u007e\s ]");
          // Matches character entities.
          var re2 = new RegExp("&.*?;");
          if (re.test(text)) {
            $('.english_translation_group').show();
            $(target_field_wrapper).show();
          }
          else if (re2.test(text)) {
            $('.english_translation_group').show();
            $(target_field_wrapper).show();
          }
          else {
            $('.english_translation_group').hide();
            $(target_field_wrapper).hide();
          }
        }
      }

      $("#edit-field-russian-citizen-value").change(function() {
        var ischecked= $(this).is(':checked');
        if(!ischecked) {
          $("#edit-field-russian-accept-value").attr("checked", false);
        }
      });

      var valid_msg = Drupal.t('✓ Valid Phone Number');
      var error_msg = Drupal.t('✗ Invalid Phone Number');
      // Added validation class to phone field wrapper
      $( '<div id="valid-msg" class="hidden">' + valid_msg + '</div>' +
        '<div id="error-msg" class="hidden">' + error_msg + '</div>' ).appendTo( '#edit-field-phone-wrapper' );

      // Bind the Telephone Country plugin
      var tel_input = $('#edit-field-phone-0-value');
      var errorMsg = $('#error-msg');
      var validMsg = $('#valid-msg');
      if (current_language == 'zh-hans') {
        tel_input.intlTelInput({
          utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/12.0.1/js/utils.js",
          separateDialCode: true,
          hiddenInput: "formatted_phone_value",
          preferredCountries: [ "cn", "us", "gb" ],
          nationalMode: false
        });
      }
      else {
        tel_input.intlTelInput({
          utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/12.0.1/js/utils.js",
          separateDialCode: true,
          hiddenInput: "formatted_phone_value",
          nationalMode: false
        });
      }
      // Hide all validation messages.
      var reset = function() {
        tel_input.removeClass("error");
        errorMsg.addClass("hidden");
        validMsg.addClass("hidden");
      };

      // Display valid message.
      var displayValidMessage = function(valid_msg, number) {
        if (validMsg.text() === valid_msg) {
          validMsg.append( ' <span class="phone-number__valid">' + number + '</span>');
        }
        else {
          validMsg.html( valid_msg + ' <span class="phone-number__valid">' + number + '</span>');
        }
      };

      // Display invalid message.
      var displayInValidMessage = function(error_msg, number) {
        if (errorMsg.text() === error_msg) {
          errorMsg.append( ' <span class="phone-number__invalid">' + number + '</span>');
        }
        else {
          errorMsg.html( error_msg + ' <span class="phone-number__invalid">' + number + '</span>');
        }
      };

      tel_input.blur(function() {
        reset();
        if ($.trim(tel_input.val())) {
          var number = tel_input.intlTelInput("getNumber");
          var numberExt = tel_input.intlTelInput("getExtension");
          if (numberExt !== null) {
            number = number + 'x' + numberExt;
          }

          if (current_language != 'zh-hans'){
            if (tel_input.intlTelInput("isValidNumber")) {
              validMsg.removeClass("hidden");
              displayValidMessage(valid_msg, number);
            }
            else {
              tel_input.addClass("error");
              errorMsg.removeClass("hidden");
              displayInValidMessage(error_msg, number);
            }
          }
        }
      });

      // on keyup / change flag: reset
      tel_input.on("keyup change", reset);

      $('.user-register-form, .user-form').submit(function(){
        var formatted_value = $('input[name="formatted_phone_value"]').val();
        tel_input.val(formatted_value);
      });
})(jQuery);
