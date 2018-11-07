/**
 * @file
 * Set target to _blank for downloads to allow downloads from within pathfactory iframe
 */
(function ($) {
  $( document ).ready(function() {
    $("a").each(function() {
      var href = this.href;
      if ( href.search('download.tek.com')) {
        this.setAttribute("target","_blank");
      }
    });
  });
})(jQuery);