/**
 * @file
 * Add Drupal functions.
 */

(function (window, document, $, Drupal) {
  'use strict';
  Drupal.behaviors.marketoId = {
    attach: function (context, drupalSettings) {
      // Setup.
      var _COOKIE_DOMAIN = '.tek.com';
      var _MARKETO_ID = drupalSettings.tektronix.munchkinMarketo.marketoId;

      // Cookie manipulation library.
      var docCookies = {
          getItem: function(sKey) {
              if (!sKey) {
                  return null;
              }              return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
          },
          setItem: function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
              if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
                  return false;
              }
              var sExpires = "";
              if (vEnd) {
                  switch (vEnd.constructor) {
                      case Number:
                          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                          break;
                      case String:
                          sExpires = "; expires=" + vEnd;
                          break;
                      case Date:
                          sExpires = "; expires=" + vEnd.toUTCString();
                          break;
                  }
              }
              document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
              return true;
          },
          removeItem: function(sKey, sPath, sDomain) {
              if (!this.hasItem(sKey)) {
                  return false;
              }
              document.cookie = encodeURIComponent(sKey) + "=''; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
              return true;
          },
          hasItem: function(sKey) {
              if (!sKey) {
                  return false;
              }
              return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
          },
          keys: function() {
              var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
              for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
                  aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
              }
              return aKeys;
          }
      };

      // check for storage capability in browser.
      function storageAvailable(type) {
        try {
            var storage = window[type],
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return false;
        }
      }

      // Munchkin init script.
      function iMunchkin() {
          var didInit = false;

          function initMunchkin() {
              if (didInit === false) {
                  didInit = true;
                  window.Munchkin.init(_MARKETO_ID);
              }
          }
          var s = document.createElement('script');
          s.type = 'text/javascript';
          s.async = true;
          s.src = '//munchkin.marketo.net/munchkin.js';
          s.onreadystatechange = function() {
              if (this.readyState === 'complete' || this.readyState === 'loaded') {
                  initMunchkin();
              }
          };
          s.onload = initMunchkin;
          document.getElementsByTagName('head')[0].appendChild(s);
      }

      // Check state of cookie/localStorage variables.
      if (docCookies.getItem('_mkto_trk')) {
          if (storageAvailable('localStorage')) {
              if (localStorage.getItem('_postoct')) {
                  iMunchkin();
              } else {
                  docCookies.removeItem('_mkto_trk', '/', _COOKIE_DOMAIN);
                  setTimeout(function() {
                    localStorage.setItem('_postoct', true);
                    iMunchkin();
                  }, 500);

              }
          } else {
              if (docCookies.hasItem('_postoct')) {
                  iMunchkin();
              } else {
                docCookies.removeItem('_mkto_trk', '/', _COOKIE_DOMAIN);
                setTimeout(function() {
                  docCookies.setItem('_postoct', true);
                  iMunchkin();
                }, 500);
              }
          }
      } else {
        iMunchkin();
      }
    }
  };

}(window, window.document, window.jQuery, window.Drupal));
