/**
 * @file
 * Survey Gizmo Widget.
 */

(function ($, Drupal) {
  Drupal.behaviors.sgSurvey = {
    attach: function (context) {
      $('.header__menu', context).once('#main-content').each(function () {
        var SG = {};
        function merge_data(data1, data2) {
          var temp;
          for (temp in data2) {
            if (data2.hasOwnProperty(temp)) {
              data1[temp] = data2[temp];
            }
          }
          return data1;
        }

        merge_data(SG, {
          extend: merge_data
        });

        function setcookie(name, value, days) {
          if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 1000));
            var expire = "; expires=" + date.toGMTString();
          }
          else var expire = '';
          document.cookie = name + "=" + value + expire + "; path=/;";
        }

        function getcookie(name) {
          var nameEQ = name + "=";
          var ca = document.cookie.split(';');
          for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
          }
          return null;
        }

        function deletecookie(name) {
          setcookie(name, "", -1);
        }

        SG.extend(SG, {
          createCookie: setcookie,
          readCookie: getcookie,
          eraseCookie: deletecookie
        });

        var languageCode = $('html').attr('lang');
        this.options = {
          repopupTime: 604800,
          popupdispRate: 100,
          ShowAgainCookie: 'sg_widget_showagain',
          InitiateCookie: 'sg_widget_initiate',
          PageClickCookie: 'sg_page_click',
          pagesClick: 5,
          WidgetPath: '/themes/custom/tektronix/source/js/sg_survey/sg_widget-' + languageCode + '.html'
        };

        // Don't display survey popup other than www, uk, de, ja, ko and cn sites.
        if (languageCode !== 'en' && languageCode !== 'en-gb' && languageCode !== 'de' && languageCode !== 'ja' && languageCode !== 'ko' && languageCode !== 'zh-hans') {
          return;
        }
        var pageval = this.options,
          clickcount = parseInt(SG.readCookie(pageval.PageClickCookie), 10) || 0;

        if (SG.readCookie(pageval.ShowAgainCookie)) {
          return;
        }

        if (!SG.readCookie(pageval.InitiateCookie)) {
          SG.createCookie(pageval.InitiateCookie, (Math.random() > 1 - (pageval.popupdispRate / 100)) ? "1" : "0");
        }

        clickcount += 1;
        SG.createCookie(pageval.PageClickCookie, clickcount);
        if (pageval.pagesClick && clickcount < pageval.pagesClick) {
          return;
        }

        if (SG.readCookie(pageval.InitiateCookie) === '1') {
          SG.createCookie(pageval.ShowAgainCookie, 1, pageval.repopupTime);
          var selector = '#main-content';
          display_survey_widget(selector);
        }

        function display_survey_widget(region) {
          var message = '<div id="sg_popup_dialog"></div>';
          $(region).prepend(message);

          $('#sg_popup_dialog').load(pageval.WidgetPath, function() {
            $(this).dialog({
              modal: true,
              width: 500,
              closeOnEscape: false,
              dialogClass: "sg-dialog",
              draggable: false,
              autoOpen: true
            });
          });
        }
      });
    }
  };
})(jQuery, Drupal);


function resetCookie(name, value, days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 1000));
    var expire = "; expires=" + date.toGMTString();
  }
  else var expire = '';
  document.cookie = name + "=" + value + expire + "; path=/;";
}

function close_survey() {
  resetCookie('sg_widget_showagain', 1, 7776000);
  jQuery('#sg_popup_dialog').dialog( "close" );
}

function open_survey() {
  resetCookie('sg_widget_showagain', 1, 7776000);
  show_survey_widget();
  jQuery('#sg_popup_dialog').dialog( "close" );
}

function close_icon_survey() {
  resetCookie('sg_widget_showagain', 1, 7776000);
  jQuery('#sg_popup_dialog').dialog( "close" );
}

/* START POPUNDER */
var puShown = false;
var PopWidth = 550;
var PopHeight = (screen.availHeight - 125).toString();
var PopFocus = 0;
var _Top = null;

function GetWindowHeight() {
  var myHeight = 0;
  if( typeof( _Top.window.innerHeight ) === 'number' ) {
    myHeight = _Top.window.innerHeight;
  }
  else if( _Top.document.documentElement && _Top.document.documentElement.clientHeight ) {
    myHeight = _Top.document.documentElement.clientHeight;
  }
  else if( _Top.document.body && _Top.document.body.clientHeight ) {
    myHeight = _Top.document.body.clientHeight;
  }
  return myHeight;
}


function GetWindowWidth() {
  var myWidth = 0;
  if( typeof( _Top.window.innerWidth ) === 'number' ) {
    myWidth = _Top.window.innerWidth;
  }
  else if( _Top.document.documentElement && _Top.document.documentElement.clientWidth ) {
    myWidth = _Top.document.documentElement.clientWidth;
  }
  else if( _Top.document.body && _Top.document.body.clientWidth ) {
    myWidth = _Top.document.body.clientWidth;
  }
  return myWidth;
}

function GetWindowTop() {
  return (_Top.window.screenTop !== undefined) ? _Top.window.screenTop : _Top.window.screenY;
}

function GetWindowLeft() {
  return (_Top.window.screenLeft !== undefined) ? _Top.window.screenLeft : _Top.window.screenX;
}


function doOpen(url) {
  var popURL = "about:blank";
  var popID = "ad_" + Math.floor(89999999*Math.random()+10000000);
  var pxLeft = 0;
  var pxTop = 0;
  pxLeft = (GetWindowLeft() + (GetWindowWidth() / 2) - (PopWidth / 2));
  pxTop = (GetWindowTop() + (GetWindowHeight() / 2) - (PopHeight / 2));

  if ( puShown === true ) {
    return true;
  }

  var PopWin=_Top.window.open(popURL,popID,'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=0,top=' + pxTop + ',left=' + pxLeft + ',width=' + PopWidth + ',height=' + PopHeight);

  if (PopWin) {
    puShown = true;

    if (PopFocus === 0) {
      PopWin.blur();
      if (navigator.userAgent.toLowerCase().indexOf("applewebkit") > -1) {
        _Top.window.blur();
        _Top.window.focus();
      }
    }

    PopWin.Init = function(e) {
      with (e) {
        Params = e.Params;
        Main = function() {
          if (typeof window.mozPaintCount !== "undefined") {
            var x = window.open("about:blank");
            x.close();
          }

          var popURL = Params.PopURL;
          try { opener.window.focus(); }
          catch (err) { }

          window.location = popURL;
        };
        Main();
      }
    };

    PopWin.Params = {
      PopURL: url
    };

    PopWin.Init(PopWin);
  }

  return PopWin;
}

function show_survey_widget() {
  _Top = self;

  if (top !== self) {
    try {
      if (top.document.location.toString())
        _Top = top;
    }
    catch(err) { }
  }

  if ( document.attachEvent ) {
    document.attachEvent( 'onclick', checkTarget );
  }
  else if ( document.addEventListener ) {
    document.addEventListener( 'click', checkTarget, false );
  }
}

function checkTarget(e) {
  var e = e || window.event;
  var languageCode = jQuery('html').attr('lang');
  if (languageCode === 'en') {
    survey_path = 'http://www.surveygizmo.com/s3/4165364/www-nps-web-survey';
  } 
  else if (languageCode === 'en-gb') {
    survey_path = 'http://www.surveygizmo.com/s3/4165364/en-nps-web-survey';
  }
  else if (languageCode === 'de') {
    survey_path = 'http://www.surveygizmo.com/s3/4165364/de-nps-web-survey';
  }
  else if (languageCode === 'ja') {
    survey_path = 'http://www.surveygizmo.com/s3/4165364/jp-nps-web-survey';
  }
  else if (languageCode === 'ko') {
    survey_path = 'http://www.surveygizmo.com/s3/4165364/kr-nps-web-survey';
  }
  else {
    survey_path = 'http://www.surveygizmo.com/s3/4165364/cn-nps-web-survey';
  }

  var win = doOpen(survey_path);
}

if (typeof Cookiebot !== 'undefined' && Cookiebot.consent && Cookiebot.consent.preferences) {
  Drupal.behaviors.sgSurvey.attach();
}
