'use strict';

var input_dom = '<div class="input"></div>';
var color_dom = '<input type="text" class="form-control color-code" placeholder="Color code">';
var ok_dom = '<div name="ok" class="btn btn-sm btn-default pull-right">OK</div>';
var sample_dom = '<div class="sample"></div>';

$(function() {
    createPalette();

    $('.color-code').keyup(function() {
        $(this).next('.sample').css('background-color', $(this).val());
    });

    $('[name=ok]').click(function() {
        var color_code = $(this).prevAll('input').val();
        $(this).parent().parent().append('<div class="color" data-clipboard-text="' + color_code + '"></div>');
        // $(this).parent().parent().append('<div class="color" data-clipboard-text="' + color_code + '" data-toggle="modal" data-target="#myModal"></div>');
        setColor($(this).parent().next('.color'), color_code);
        // $(this).parent().next('.color').draggable();
    });

    $('#save').click(function() {
        save();
    });

    $('#load').click(function() {
        load();
    });
});

function setColor(color, color_code) {
    color.css('background-color', color_code);

    color.click(function() {
        var clip = new ZeroClipboard(color);
        $(this).addClass('animated pulse').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass('animated pulse');
        });
    });
}

function createPalette() {
    for (var i = 1; i <= 99; i++) {
        $('.palette').append('<div id="' + i + '" class="area"></div>');
        $('#' + i).append(input_dom);
        $('#' + i + ' .input').append(color_dom);
        $('#' + i + ' .input').append(sample_dom);
        $('#' + i + ' .input').append(ok_dom);
    }
}

function save() {
    var colors = {};
    for (var i = 1; i <= 99; i++) {
        var color_code = $('#' + i + ' .color-code').val();
        colors[i] = {
            color_code: color_code
        };
    }
    console.log(JSON.stringify(colors));
    $.post('/api/update/itagaki', colors);
}

function load() {
    $.getJSON('/api/find/itagaki', function(json) {
        $('.color').remove();
        for (var i = 1; i <= 99; i++) {
            var color_code = json[0].palette[i].color_code;
            if (color_code === '') {
                return;
            }
            $('#' + i + ' .input .color-code').val(color_code);
            $('#' + i + ' .input .sample').css('background-color', color_code);
            $('#' + i).append('<div class="color" data-clipboard-text="' + color_code + '"></div>');
            setColor($('#' + i + ' .color'), color_code);
        }
    });
}