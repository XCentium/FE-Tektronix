/**
 * @file
 * Add Livechat functions.
 */

(function (window, document, $) {
  'use strict';

    attach: function (context) {
      var license = drupalSettings.LiveChat.license;
      var skill = drupalSettings.LiveChat.skill;
      var languageCode = drupalSettings.LiveChat.languageCode;
      var tekGeoipCountry = drupalSettings.LiveChat.tekGeoipCountry;
      var countryCode = drupalSettings.LiveChat.countryCode;
      var displayPopupWidget = drupalSettings.LiveChat.displayPopupWidget;
      var isFront = drupalSettings.path.isFront;

      if (license && displayPopupWidget && !isFront ) {
        window.__lc = window.__lc || {};
        window.__lc.license = license;
        window.__lc.group = skill;
        window.__lc.lang = languageCode;
        (function () {
          var lc = document.createElement('script');
          lc.type = 'text/javascript';
          lc.async = true;
          lc.src = ('https:' === document.location.protocol ? 'https://' : 'http://') + 'cdn.livechatinc.com/tracking.js';
          var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(lc, s);
        })();
      }
      var allowed_countries = countryCode.toLowerCase().split(",");
      if($.inArray(tekGeoipCountry, allowed_countries) < 0) {
        $('#livechat_link', context).hide();
      }

      $('#livechat_link', context).click(function (event) {
        event.preventDefault();
        // Display livechat page.
        launchLiveChat(skill, license, languageCode);
      });
    }
}(window, window.document, window.jQuery));

function launchLiveChat(skill, license, langcode) {
  'use strict';
  var newWindow = window.open('https://secure.livechatinc.com/licence/' + license + '/open_chat.cgi?lang=' + langcode + '&groups=' +
    skill + '','','scrollbars=no,menubar=no,height=600,width=800,resizable=yes,toolbar=no,location=no,status=no');
}

if (typeof Cookiebot !== 'undefined' && Cookiebot.consent && Cookiebot.consent.preferences) {
  Drupal.behaviors.livechat.attach(document, drupalSettings);
}