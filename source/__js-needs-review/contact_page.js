/**
 * @file
 * Add Drupal functions.
 */

(function ($, Drupal) {
  Drupal.behaviors.contactUsTabs = {
    attach: function (context, drupalSettings) {
      var path = drupalSettings.path;
      var currentLanguage = path.currentLanguage;
      var tekCentralAmericaDomains = [];
      var tekEuroDomains = ['es', 'de', 'fr', 'it', 'en-uk'];
      var tekIndiaDomains = ['en-in'];
      var tekAsiaPacDomains = ['zh-hans', 'zh-hant'];
      var tekAseanDomains = ['en-sg'];
      var tekJapanDomains = ['ja'];
      var tekKoreanDomains = ['ko'];
      var tekRussiaDomains = ['ru'];
      var tab = '';
      if ($.inArray(currentLanguage, tekCentralAmericaDomains) !== -1) {
        tab = 'tab-1';
      }
      else if ($.inArray(currentLanguage, tekEuroDomains) !== -1) {
        tab = 'tab-2';
      }
      else if ($.inArray(currentLanguage, tekIndiaDomains) !== -1) {
        tab = 'tab-3';
      }
      else if ($.inArray(currentLanguage, tekAsiaPacDomains) !== -1) {
        tab = 'tab-4';
      }
      else if ($.inArray(currentLanguage, tekAseanDomains) !== -1) {
        tab = 'tab-5';
      }
      else if ($.inArray(currentLanguage, tekJapanDomains) !== -1) {
        tab = 'tab-6';
      }
      else if ($.inArray(currentLanguage, tekKoreanDomains) !== -1) {
        tab = 'tab-7';
      }
      else if ($.inArray(currentLanguage, tekRussiaDomains) !== -1) {
        tab = 'tab-8';
      }
      else if ($.inArray(currentLanguage, tekRussiaDomains) !== -1) {
        tab = 'tab-8';
      }
      if (tab.length) {
        var activeTab = $('.tek-tabs .tek-tabs__nav li.' + tab);
        if (activeTab.length) {
          $('.tek-tabs .tek-tabs__nav').find('a.active').removeClass('active');
          activeTab.find('a').addClass('active');
          var index = activeTab.index();
          $('.tek-tabs .tek-tabs__content').find('.tab-pane').eq(index).addClass('active').siblings().removeClass('active');
        }
      }
    }
  };
})(jQuery, Drupal);
