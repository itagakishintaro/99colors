'use strict';


$(function() {
	createPalette();

    $('.color-code').keyup(function() {
        $(this).next('.sample').css('background-color', $(this).val());
    });

    $('[name=ok]').click(function() {
        var color = $(this).prevAll('input').val();
        $(this).parent().parent().append('<div class="color" data-clipboard-text="' + color + '" data-toggle="modal" data-target="#myModal"></div>');
        var sample = $(this).parent().next('.color');
        sample.css('background-color', color);

        sample.click(function(){
        	var clip = new ZeroClipboard(sample);
        });
        // $(this).parent().next('.color').draggable();
    });
});

function createPalette(){
	for(var i = 1; i <= 100; i++){
		$('.palette').append('<div id="' + i + '" class="area"></div>');
		$('#' + i).append('<div class="input"></div>');
		$('#' + i + ' .input').append('<input type="text" class="form-control color-code" placeholder="Color code">');
		$('#' + i + ' .input').append('<div class="sample"></div>');
		$('#' + i + ' .input').append('<div name="ok" class="btn btn-sm btn-default pull-right">OK</div>');
	}	
}
