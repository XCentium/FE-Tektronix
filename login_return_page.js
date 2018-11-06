/**
 * @file
 * Add Drupal functions.
 */

(function ($) {
  'use strict';
  var url_login_page = document.location.origin + '/user/login';
  var current_page = location.pathname;
  var login_page = '/user/login';
  var login_page_pattern = /\/user\/login/;
    attach: function (context) {
      if (current_page != '/user/login' && current_page != '/user/register' && current_page != '/user/password') {

        // JS code for Local Drupal 8 set up.
        $(context).find("a[href='" + login_page + "']").once('login-processed-link').each(function () {
          $(this).attr('href', $(this).attr('href') + '?destination=' + current_page);
        });

        // JS code for DEV, STAGE & PROD Drupal 8 set ups.
        $(context).find("a[href='" + url_login_page + "']").once('login-processed-link').each(function () {
          $(this).attr('href', $(this).attr('href') + '?destination=' + current_page);
        });

      }

      // Set up redirect URL for Saml Authentication.
      if (current_page.match(login_page_pattern)) {
        var redirect;

        if (drupalSettings.path.hasOwnProperty('currentQuery')
        && drupalSettings.path.currentQuery.hasOwnProperty('destination')) {
          var destination = drupalSettings.path.currentQuery.destination;
          redirect = Drupal.url.toAbsolute(destination);
        }
        else {
          var base_path = drupalSettings.path.baseUrl;
          var path_prefix = drupalSettings.path.pathPrefix;
          redirect = Drupal.url.toAbsolute(base_path + path_prefix);
        }

        $.cookie('simplesamlphp_auth_returnto', redirect, {
          path: '/',
          expires: 1,
          domain: drupalSettings.cookieDomain
        });
      }
    }
})(jQuery, Drupal);
