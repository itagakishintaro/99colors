'use strict';

$(function(){
	$('#top10link').click(function(){
		$('#top10 ul li').remove();
		$.getJSON('api/findTop10Names', function(json) {
			json.forEach(function(element){
				$('#top10 ul').append('<li class="list-group-item">' + element + '</li>');
			});
        });
	});
});