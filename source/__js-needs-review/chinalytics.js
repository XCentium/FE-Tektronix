/**
 * @file
 */
(function ($, Drupal) {
  Drupal.behaviors.chinaAnalytics = {
    attach: function (context) {
      $('body', context).each(function () {
        var _paq = _paq || [];
        _paq.push(["setCookieDomain", ".tek.com.cn"]);
        _paq.push(["setDomains", ["www.tek.com.cn","www.stg.tek.com.cn"]]);
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function () {
          var u = "//chinalytics.cn/";
          _paq.push(['setTrackerUrl', u + 'js/tracker.php']);
          _paq.push(['setSiteId', 128]);
          var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
          g.type = 'text/javascript';
          g.async = true;
          g.defer = true;
          g.src = u + 'js/tracker.php';
          s.parentNode.insertBefore(g, s);
        })();
      });
    }
  };
})(jQuery, Drupal);
