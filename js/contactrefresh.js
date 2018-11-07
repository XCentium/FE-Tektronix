/**
 * @file
 * Add Drupal functions.
 */


(function (window, document, $, Drupal) {
  'use strict';
    attach: function (context, settings) {

      $('#refresh-callout-contact', context).first().once('processContact').each(function(){

          var url = '/load-ajaxified-contact-data';
          var call_info_time = '';
          $.ajax({
            url: url,
            success: function(data) {
              if (data.status_code == 200) {
                if(data.call_info_time.length) {
                  call_info_time = "<br />" + data.call_info_time;
                }
                // Replace Contact Content.
                $("#refresh-callout-contact").replaceWith("<div class='col'><a href='" + data.call_url +
                                  "' class='call icon-communication'><h6>" + data.call_title +
                                  "</h6><p class='description'>" + data.call_info + call_info_time + "</p></a></div>");
                // Replace Email Content.
                if ($('#refresh-callout-email').length) {
                  $("#refresh-callout-email").replaceWith("<div class='col'><a href=" + data.mail_url +
                                  " class='call icon-mail'><h6>" + data.mail_title +
                                  "</h6><p class='description'>" + data.mail_info +
                                  "<span class='icon-mail align-icon'></span></p></a></div>");
                }
                // Replace contact us Content in Footer link.
                if ($('#block-footer-second').length) {
                  $("#block-footer-second ul li:last-child").html("<a href='"+ data.call_url + "'>" + data.call_info + "</a>");
                }
                if ($('#block-footerseconduk').length) {
                  $("#block-footerseconduk ul li:last-child").html("<a href='"+ data.call_url + "'>" + data.call_info + "</a>");
                }
                if ($('#block-footersecondde').length) {
                  $("#block-footersecondde ul li:last-child").html("<a href='"+ data.call_url + "'>" + data.call_info + "</a>");
                }
                if ($('#block-footersecondjp').length) {
                  $("#block-footersecondjp ul li:last-child").html("<a href='"+ data.call_url + "'>" + data.call_info + "</a>");
                }
                if ($('#block-footersecondchina').length) {
                  $("#block-footersecondchina ul li:last-child").html("<a href='"+ data.call_url + "'>" + data.call_info + "</a>");
                }
                if ($('#block-footersecondkr').length) {
                  $("#block-footersecondkr ul li:last-child").html("<a href='"+ data.call_url + "'>" + data.call_info + "</a>");
                }
                if ($('#block-footersecondru').length) {
                  $("#block-footersecondru ul li:last-child").html("<a href='"+ data.call_url + "'>" + data.call_info + "</a>");
                }
                // Replace contact us Content in header link.
                if ($('.ajaxified-phone').length) {
                  $(".ajaxified-phone").replaceWith("<div class='buyquote-phone icon-phone'>" + data.contact_no + "</div>");
                }
              }
            }
          });
      });
    }
}(window, window.document, window.jQuery, window.Drupal));
