(function (window, document, $) {
  var fullPath = '../../fonts/selection.json';

  $.getJSON(fullPath, function (data) {
    var items = [];

    $.each(data.icons, function (key, value) {
      items.push('<div class="icon-box">' +
        '<span class="icon-' + value.properties.name + '"></span>' +
        '<p>Code: <ins> \\' + value.properties.code.toString(16) + '</ins></p>' +
        '<p>Class name:</p>' +
        '<p class="icon-class">icon-' + value.properties.name + '</p>' +
        '</div>');
    });

    $('#icons-wrapper').html(items.join(""));
  });

}(window, window.document, window.jQuery));
