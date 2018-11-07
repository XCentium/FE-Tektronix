/**
 * @file
 * TEK IP Country javascript actions.
 */

(function ($, window, document) {

  'use strict';

    attach: function (context, drupalSettings) {
      $('#sc-container').show();
      var configurator_id = drupalSettings.tek_serial_conf.configurator_id;
      var levels = drupalSettings.tek_serial_conf.levels;
      var level_count = drupalSettings.tek_serial_conf.level_count;
      // Get the taxonomy term data.
      var hierarchy_data = {};

      if (!$('#block-tektronixserialconfiguratorblock').hasClass('init')) {

        $.getJSON('/serial_configurator/terms/' + configurator_id, function (data) {
          hierarchy_data = data;
          // Pre-populate the sc-results div if term ids were passed as query strings.
          var tids = drupalSettings.tek_serial_conf.terms;
          if (tids.length > 0) {
            $.getJSON('/serial_configurator/term/' + configurator_id + '/' + tids.join('-') + '/parents', function (data) {
              $.each(data, function (tid, value) {
                var config_markup = hierarchy_data.config[tid];
                Drupal.behaviors.tek_serial_conf.addResultMarkup(config_markup, tid, hierarchy_data, value, drupalSettings);
                $('#sc-controls').show();
                $('#sc-print-email').show();
              });
            });
          }

          Drupal.behaviors.tek_serial_conf.initialization(context, configurator_id, levels, level_count, hierarchy_data, drupalSettings);

          // If the top-level dropdown is pre-selected, trigger a change so the second-level dropdown will get populated.
          if ($('#edit-level-0').val()) {
            $('#edit-level-0').trigger('change');
          }

        });

        $('#block-tektronixserialconfiguratorblock').addClass('init');
      }

    },

    initialization: function (context, configurator_id, levels, level_count, hierarchy_data, drupalSettings) {
      // When a dropdown is changed, populate the dropdown options for the next level down.
      $('#sc-container .form-select', context).change(function () {
        // #id looks like '#edit-level-[index]'. Extract the value of [index].
        var id_parts = $(this).attr('id').split('-');
        var changed_level = id_parts[2];
        var selected_tid = $(this).val();

        if (changed_level == level_count) {
          // We're at the leaf level, so add the configuration to config-holder.
          $('#description-label-left', context).html(drupalSettings.tek_serial_conf.description_label_left);
          $('#config-holder', context).html(hierarchy_data.config[selected_tid]);
          $('#config-holder-wrapper', context).show();
        }
        else {
          $('#config-holder-wrapper', context).hide();
          $('#missing-config', context).remove();

          $.each(levels, function (level, label) {
            if (level > changed_level) {
              $('#edit-level-' + level, context).find('option:gt(0)').remove();
              $('#level-' + level + '-wrapper', context).hide();
            }
            else {
              return; // Continue to next iteration.
            }

            var level_plus_one = +changed_level + 1;

            if (selected_tid && level == level_plus_one) {
              var data = hierarchy_data[level][selected_tid];

              if (data) {
                var key_store;
                var next_level_id = '#edit-level-' + level;
                $.each(data, function (key, value) {
                  $(next_level_id) // e.g. Revision = #edit-level-1-wrapper #edit-level-1.
                    .append($("<option></option>")
                      .attr('value', key)
                      .text(value));
                  key_store = key;
                });

                var next_level_wrapper_id = '#level-' + level + '-wrapper';

                if (Drupal.behaviors.tek_serial_conf.itemCount(data) == 1) {
                  // If there is only one item in the dropdown, make it be selected.
                  $(next_level_id).val(key_store);
                  $(next_level_id).trigger('change');
                  $(next_level_wrapper_id).show();
                  return false; // Exit the loop.
                }

                $(next_level_wrapper_id).show();
              }
              else {
                if (level > changed_level) {
                  var message = Drupal.t('No results were found for the current selection.');
                  $('#level-' + changed_level + '-wrapper').append('<div id="missing-config">' + message + '</div>');
                  for (var i = level; i <= level_count; i++) {
                    $('#level-' + i  + '-wrapper').hide();
                  }
                  return false; // Exit the loop.
                }
              }
            }
          });
        }
        Drupal.behaviors.tek_serial_conf.bindRemoveButton(context, drupalSettings);
      });

      // When the 'Add to Selection' button is clicked, add the selection to the sc-results div.
      $('#add-selection', context).click(function () {
        var last_select = $('#sc-selection').find('.form-select:last');
        var selected_tid = last_select.val();

        Drupal.behaviors.tek_serial_conf.addResultMarkup($('#config-holder').html(), selected_tid, hierarchy_data, false, drupalSettings);

        $('#sc-controls', context).show();
        $('#sc-print-email', context).show();
        $('#sc-email-form', context).hide();
        $('#sc-email-msg', context).hide();

        // Trigger a change on the top-level term to reset the selection form.
        $('#edit-level-0', context).trigger('change');

        if (drupalSettings.tek_serial_conf.encore == 1) {
          // Create/update the Encore cookie.
          Drupal.behaviors.tek_serial_conf.setEncoreCookie(drupalSettings, context);
        }
      });

      // When the Reset button is clicked, reset the form.
      $('#sc-reset', context).click(function () {
        $('#sc-results', context).empty();
        $('#sc-controls', context).hide();
        $('#sc-print-email', context).hide();
        $('#sc-email-form', context).hide();
        $('#sc-email-msg', context).hide();
        $('#edit-level-0', context).trigger('change');

        if (drupalSettings.tek_serial_conf.encore == 1) {
          // Reset button was clicked. Delete the cookie.
          Drupal.behaviors.tek_serial_conf.deleteEncoreCookie();
        }
      });

      // When the Email button is clicked, show the e-mail form.
      $('#sc-email', context).click(function () {
        $('#sc-email-form', context).show();
        $('#sc-email-msg', context).hide();
      });

      // When the Print button is clicked, open the print url in a new window.
      $('#sc-print', context).click(function () {
        var tids = Drupal.behaviors.tek_serial_conf.selectedTids(context);
        window.open('/configurator/print/' + tids.join('-') + '/' + configurator_id + '?page=' + window.location.pathname);
      });

      // When the Quote button is clicked, redirect to Quote Page.
      $('#sc-quote', context).click(function () {
        var tids = Drupal.behaviors.tek_serial_conf.selectedTids(context);
        window.location.href = '/tekstore/addSerialConfigToQuote/' + tids.join('-');
      });

      // When the Send button is clicked, send the email to the specified email address.
      $('#sc-send', context).click(function () {
        var email = $.trim($('#sc-email-address', context).val());
        if (email) {
          if (!Drupal.behaviors.tek_serial_conf.validateEmail(email)) {
            // Email was invalid. Show error message.
            $('#sc-email-msg', context).show();
          }
          else {
            var tids = Drupal.behaviors.tek_serial_conf.selectedTids(context);
            $.ajax({
              url: '/configurator/email',
              type: 'POST',
              dataType: 'json',
              data: {
                email: $('#sc-email-address', context).val(),
                tids: tids.join('-'),
                configurator_id: configurator_id,
                url: drupalSettings.tek_serial_conf.url
              },
              success: function (data) {
                $('#sc-email-msg', context).hide();
                $('#sc-email-form', context).hide();
                $('#sc-email-sent', context)
                  .fadeIn()
                  .animate({backgroundColor: '#fff'}, 3000) // Does nothing for 3000ms.
                  .fadeOut('fast');
              }
            });
          }
        }
      });

    },

    bindRemoveButton: function (context, drupalSettings) {
      // When the '[click to remove]' span is clicked, remove the selection from the results.
      $('.remove-selection', context).on('click', function () {
        var output_type = drupalSettings.tek_serial_conf.output_type;

        if (output_type == 'ul') {
          $(this).closest('.result').remove();

          if (!$.trim($('#sc-results', context).html()).length) {
            $('#sc-controls', context).hide();
            $('#sc-print-email', context).hide();
          }
        }
        else if (output_type == 'table') {
          $(this).closest('tr').remove();

          if (!$.trim($('#sc-results table tbody', context).html()).length) {
            $('#sc-results table', context).remove();
            $('#sc-controls', context).hide();
            $('#sc-print-email', context).hide();
          }
          else if (drupalSettings.tek_serial_conf.encore == 1) {
            Drupal.behaviors.tek_serial_conf.updateEncoreTotal();
          }
        }

        if (drupalSettings.tek_serial_conf.encore == 1) {
          // Create/update the Encore cookie.
          Drupal.behaviors.tek_serial_conf.setEncoreCookie(drupalSettings, context);
        }

        $('#sc-email-form', context).hide();
        $('#sc-email-msg', context).hide();
      });
    },

    // Generates full markup for the given selection, and places it in sc-results div.
    addResultMarkup: function (config_markup, tid, hierarchy_data, prepopulated_terms, drupalSettings) {
      // prepopulated_terms parameter will only be sent when prepopulating results from scid query string.
      prepopulated_terms = typeof prepopulated_terms !== 'undefined' ? prepopulated_terms : false;

      // e.g. Revision = #edit-level-1-wrapper #edit-level-1.
      var output_type = drupalSettings.tek_serial_conf.output_type;
      var result = '';

      if (output_type == 'ul') {
        result = '<div class="result">';
        // I'm hard-coding standard/revision/etc. under the assumption that only
        // the Serial Configurator will use the unordered list style.
        var standard, revision, dut, application;
        if (!prepopulated_terms) {
          standard = $("#edit-level-0").children("option").filter(":selected").text();
          revision = $("#edit-level-1").children("option").filter(":selected").text();
          dut = $("#edit-level-2").children("option").filter(":selected").text();
          application = $("#edit-level-3").children("option").filter(":selected").text();
        }
        else {
          standard = prepopulated_terms[0];
          revision = prepopulated_terms[1];
          dut = prepopulated_terms[2];
          application = prepopulated_terms[3];
        }

        result += '<p class="sc-standard-name">' + standard + ' (' + revision + ') ';
        result += '<span class="remove-selection">[click to remove]</span></p>';
        result += '<p class="sc-dut-name">DUT: ' + dut + '</p>';
        result += '<p class="sc-app-name">Application: ' + application + '</p>';
        result += config_markup;
        result += '</div>';

        $('#sc-results').append(result);
      }
      else if (output_type == 'table') {
        if ($('#sc-results table').length) {
          // Table exists, so add a row.
          $('#sc-results table tbody tr:last').after(Drupal.behaviors.tek_serial_conf.getTableRow(config_markup, tid, hierarchy_data, prepopulated_terms, drupalSettings));

          if (drupalSettings.tek_serial_conf.encore == 1) {
            Drupal.behaviors.tek_serial_conf.updateEncoreTotal();
          }
        }
        else {
          // Create the table.
          var labels = drupalSettings.tek_serial_conf.labels;

          result = '<table style="width:100%">';
          result += '<thead>';
          result += '<tr>';
          result += '<th></th>'; // Empty column header for the [x].
          $.each(labels, function (key, label) {
            result += '<th>' + label + '</th>';
          });
          result += '<th>' + drupalSettings.tek_serial_conf.description_label_right + '</th>';
          result += '</tr>';
          result += '</thead>';

          if (drupalSettings.tek_serial_conf.encore == 1) {
            // For Encore vocabs, show the total dollar amount in the table footer.
            result += '<tfoot>';
            result += '<tr>';
            result += '<td></td>'; // Empty column header for the [x].
            $.each(labels, function (key, label) {
              result += '<td></td>';
            });
            result += '<td id="encore-total"></td>';
            // Result +=   '<td></td>'; // Empty column header for the [x].
            result += '</tr>';
            result += '</tfoot>';
          }

          result += '<tbody>';
          result += Drupal.behaviors.tek_serial_conf.getTableRow(config_markup, tid, hierarchy_data, prepopulated_terms, drupalSettings);
          result += '</tbody>';
          result += '</table>';

          $('#sc-results').append(result);

          if (drupalSettings.tek_serial_conf.encore == 1) {
            Drupal.behaviors.tek_serial_conf.updateEncoreTotal();
          }
        }
      }
    },

    updateEncoreTotal: function () {
      var total = 0;
      $('#sc-results table tbody').find('tr').each(function () {
        var dollar_amount = $(this).find('td div').text();
        dollar_amount = dollar_amount.replace(',', '');
        dollar_amount = parseInt(dollar_amount.replace('$', ''));
        total += dollar_amount;
      });

      $('#encore-total').html('<b>Total: $' + Drupal.behaviors.tek_serial_conf.numberWithCommas(total) + '</b>');
    },

    numberWithCommas: function (str) {
      return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    getTableRow: function (config_markup, tid, hierarchy_data, prepopulated_terms, drupalSettings) {
      // prepopulated_terms parameter will only be sent when prepopulating results from scid query string.
      prepopulated_terms = typeof prepopulated_terms !== 'undefined' ? prepopulated_terms : false;

      var levels = drupalSettings.tek_serial_conf.levels;
      var hidden_level = drupalSettings.tek_serial_conf.level_count + 1;
      var result = '';

      var top_level_text;
      if (!prepopulated_terms) {
        top_level_text = $('#edit-level-0').children("option").filter(":selected").text();
      }
      else {
        top_level_text = prepopulated_terms[0];
      }

      result += '  <tr data-tid="' + tid + '">';
      result += '    <td><span class="remove-selection">[x]</span></td>';
      result += '    <td>' + top_level_text + '</td>';
      $.each(levels, function (level, label) {
        var text;
        if (!prepopulated_terms) {
          text = $('#edit-level-' + level).children("option").filter(":selected").text();
        }
        else {
          text = prepopulated_terms[level];
        }
        result += '    <td>' + text + '</td>';
      });
      if (hierarchy_data[hidden_level]) {
        $.each(hierarchy_data[hidden_level][tid], function (key, value) {
          result += '    <td>' + value + '</td>';
        });
      }
      result += '    <td>' + config_markup + '</td>';
      result += '  </tr>';

      return result;
    },

    selectedTids: function (context) {
      var tids = [];
      $('#sc-results', context).find('ul').each(function () {
        tids.push($(this).attr('data-tid'));
      });
      $('#sc-results table tbody', context).find('tr').each(function () {
        tids.push($(this).attr('data-tid'));
      });
      return tids;
    },

    itemCount: function (obj) {
      var count = 0;
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          count++; }
      }
      return count;
    },

    validateEmail: function (email) {
      var atpos = email.indexOf("@");
      var dotpos = email.lastIndexOf(".");
      if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length) {
        return false;
      }
      return true;
    },

    /**
     * Create/update the cookie containing the user's selected configuration values.
     */
    setEncoreCookie: function (drupalSettings, context) {
      // Get the expire time.
      var expireTime = new Date();
      var now = expireTime.getTime();
      expireTime.setTime(now + 1000 * 3600); // Cookie will expire in one hour.

      var cookie_value = '';
      $('#sc-results table tbody', context).find('tr').each(function () {
        var dollar_amount = $(this).find('td div').text();
        var model = $(this).find('td:nth-child(2)').text();

        if (cookie_value !== '') {
          // Separate multiple items with comma.
          cookie_value += ', ';
        }

        cookie_value += model + ' (' + dollar_amount.trim() + ')';
      });

      if (cookie_value === '') {
        // No items, so delete the cookie.
        Drupal.behaviors.tek_serial_conf.deleteEncoreCookie();
      }
      else {
        // Cookie value looks something like this: "Trade-in value: DPO2012 ($160), DPO2014B ($730)".
        cookie_value = drupalSettings.tek_serial_conf.description_label_right + ': ' + cookie_value;

        // Replace spaces with | in the cookie value (will need to convert | back to space when reading the value later)
        cookie_value = cookie_value.split(' ').join('|');

        document.cookie = "tek_encore=" + cookie_value + ";expires=" + expireTime.toGMTString() + ';path=/';
      }
    },

    deleteEncoreCookie: function () {
      document.cookie = "tek_encore=; expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    },


})(jQuery, Drupal, this, this.document);
