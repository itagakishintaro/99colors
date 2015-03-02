'use strict';

$(function() {
    $.getJSON('api/findAllNames', function(json) {
        $("#name").typeahead({
            source: json,
            autoSelect: true
        });
    });
});