'use strict';

$(function(){
	$('#top10link').click(function(){
		$.getJSON('/api/findtop10names/', function(json) {
			json.forEach(function(element){
				$('#top10 ul').append('<li class="list-group-item">' + element + '</li>');
			});
        });
	});
});