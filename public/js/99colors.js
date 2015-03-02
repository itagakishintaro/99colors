'use strict';

var input_dom = '<div class="input"></div>';
var color_dom = '<input type="text" class="form-control color-code" placeholder="Color code">';
var ok_dom = '<div name="ok" class="btn btn-sm btn-default pull-right">OK</div>';
var sample_dom = '<div class="sample"></div>';

$(function() {
    alertHide();
    setIcon();
    readAnchor();
    createPalette();
    setColorSample();
    setButtons();
});

function alertHide() {
    $('#alert').hide();
    $('.close').click(function() {
        $('#alert').hide();
    });
}

function readAnchor() {
    var name = $.uriAnchor.makeAnchorMap().name;
    if (name) {
        load(name);
        $('#name').val(name)
    }
}

function createPalette() {
    for (var i = 1; i <= 99; i++) {
        $('.palette').append('<div id="' + i + '" class="area area-color"></div>');
        $('#' + i).append(input_dom);
        $('#' + i + ' .input').append(color_dom);
        $('#' + i + ' .input').append(sample_dom);
        $('#' + i + ' .input').append(ok_dom);
    }
}

function setColorSample() {
    $('.color-code').keyup(function() {
        $(this).next('.sample').css('background-color', $(this).val());
    });
}

function setButtons() {
    $('[name=ok]').click(function() {
        var id = $(this).parent().parent('div').attr('id');
        var color_code = $(this).prevAll('input').val();
        if (color_code === '') {
            return;
        }
        $(this).parent().parent().append(createColorbox(color_code));
        setColorbox($(this).parent().next('.color'), color_code);
    });

    $('#save').click(function() {
        save($('#name').val(), $('#password').val());
    });

    $('#load').click(function() {
        var name = $('#name').val();
        load(name);
        $.uriAnchor.setAnchor({
            name: name
        });
    });

    $('#delete').click(function() {
        remove($('#name').val(), $('#password').val());
    });
}

// <---------- From here, helper functions

function setColorbox(colorbox, color_code) {
    colorbox.css('background-color', color_code);

    var client = new ZeroClipboard(colorbox);
    client.on('ready', function(readyEvent) {
        client.on( 'copy', function(event) {
            var current_format = judgeFormat(event.target.dataset.clipboardText);
            var format = $('#format').val();
            var converted_code = convert(event.target.dataset.clipboardText, current_format, format);
            event.clipboardData.setData('text/plain', converted_code);
        } );
    });

    colorbox.click(function(e) {
        if (e.offsetX >= 430 && e.offsetY <= 55) {
            colorbox.remove();
        } else {
            $(this).children('.copied').text('COPIED!');
            colorbox.addClass('animated pulse').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $(this).removeClass('animated pulse');
                $(this).children('.copied').text('');
            });
        }
    });
}

function createColorbox(color_code) {
    var colorbox = '<div class="color" data-clipboard-text="' + color_code + '">';
    colorbox = colorbox + '<div class="pull-right del-btn">&times;</div>';
    colorbox = colorbox + '<div class="copied"></div>';
    colorbox = colorbox + '</div>';
    return colorbox;
}

function save(name, password) {
    if (name === '') {
        fail({
            status: 'local',
            responseText: 'Name is required!'
        });
        return;
    }
    var colors = {};
    for (var i = 1; i <= 99; i++) {
        var color_code = '';
        if ($('#' + i + ' .color').length > 0) {
            color_code = $('#' + i + ' .color')[0].dataset.clipboardText;
        }
        colors['color-' + i] = color_code;
    }
    var res = $.post('api/update/' + name, {
            password: password,
            colors: colors
        })
        .done(done)
        .fail(function(xhr) {
            fail(xhr);
        });
}

function load(name) {
    clearAll();
    $.getJSON('api/find/' + name, function(json) {
            for (var i = 1; i <= 99; i++) {
                var color_code = json[0].palette['color-' + i];
                if (color_code === '') {
                    continue;
                }
                $('#' + i + ' .color-code').val(color_code);
                $('#' + i + ' .sample').css('background-color', color_code);
                $('#' + i).append(createColorbox(color_code));
                setColorbox($('#' + i + ' .color'), color_code);
            }
            setTweet();
        })
        .done()
        .fail(function(xhr) {
            fail(xhr)
        });

}

function remove(name, password) {
    $.post('api/delete/' + name, {
        password: password
    }).done(done).fail(function(xhr) {
        fail(xhr)
    });
}

function done() {
    $('#alert').removeClass('alert-danger');
    $('#alert').addClass('alert-success');
    $('#alert-message').text('Success!');
    $('#alert').show();
    setTimeout(function() {
        $('#alert').hide();
    }, 1000);
}

function fail(xhr) {
    $('#alert').removeClass('alert-success');
    $('#alert').addClass('alert-danger');
    $('#alert-message').text(xhr.status + ' : ' + xhr.responseText);
    $('#alert').show();
    $('#alert').addClass('animated flash').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $(this).removeClass('animated flash');
    });
}

function clearAll() {
    $('.color').remove();
    $('.color-code').val('');
    $('.sample').css('background-color', 'lightgray');
}

function setIcon() {
    for (var i = 1; i <= 9; i++) {
        var r = Math.round(Math.random() * 255);
        var g = Math.round(Math.random() * 255);
        var b = Math.round(Math.random() * 255);
        var a = Math.random();
        $('#icon-' + i).css('fill', 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')');
    }
}