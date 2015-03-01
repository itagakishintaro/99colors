'use strict';

$(function() {
    $.getJSON('/api/findallnames', function(json) {
        $("#name").typeahead({
            source: json,
            autoSelect: true
        });
    });
});