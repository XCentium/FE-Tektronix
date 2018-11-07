/**
 * @file
 * Fast Quote integration.
 */
(function ($) {
  $(document).ready(function(){
    
    // Run the check on page load and direct users to conact info if needed
    (function checkIfStep2() {
      
      var go_to_contact_information_section_value = drupalSettings.tek_fast_quote.tek_user_login_form.go_to_contact_information_section;
      
      if (go_to_contact_information_section_value == 'Y') {
        if($('#edit-first-name').val() == '') {
          $('#edit-first-name').focus();
          var divPosition = $('#fast_quote_second_section_sroller').offset();
          $('html, body').animate({scrollTop: divPosition.top}, 'fast');
        }
      }
    })();
    
    // Adding event listener on proceed to step 2 button
    $('#edit-submit-for-step-one').on('click', checkIfStep2());
    
  });
})(jQuery);

(function ($) {
    attach: function (context) {
      
      $(document).ajaxComplete(function(e, xhr, settings){
        $('div#fastquote_add_this_item_button input.button').mousedown(function() {
            if ( $( 'input#edit-manufacturer' ).val().length !== 0 &&
                 $( 'input#edit-model' ).val().length !== 0 &&
                 $( 'select#edit-quantity option:selected' ).text() != '' &&
                 $( 'select#edit-calibration-interval option:selected' ).text() != 'Select One' &&
                 $( 'select#edit-calibration-certificate option:selected' ).text() != 'Select One') {
              
              // Set Default Values for all fields. Keep manufacturer set.
              //$('input#edit-manufacturer').val('');
              $('input#edit-model').val('');
              $('select#edit-quantity').val('');
              $('#edit-description').val('');
              $('select#edit-calibration-interval').val('').change();
              $('select#edit-calibration-certificate').val('').change();
              $('#fastquote-go-to-step-two-error-message').slideUp('slow');
            }
        });
      });

      $('#edit-submit-for-step-one').on('click', function() {
        if ( $( 'input#edit-manufacturer' ).val().length !== 0 &&
             $( 'input#edit-model' ).val().length !== 0 &&
             $( 'select#edit-quantity option:selected' ).text() != '' &&
             $( 'select#edit-calibration-interval option:selected' ).text() != 'Select One' &&
             $( 'select#edit-calibration-certificate option:selected' ).text() != 'Select One') {

          $('#fastquote-go-to-step-two-error-message').slideDown('slow');
          return false;
        }
      });
      // This helps prevent focus from shifting back to the element after its autocomplete close.
      $(document.activeElement).blur();
    }
})(jQuery);



