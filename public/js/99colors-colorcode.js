'use strict';

function judgeFormat(code) {
    var HEX_RE = /#+/;
    var RGBA_RE = /rgb+/i;
    var HSLA_RE = /hsl+/i;

    if (HEX_RE.test(code)) {
        return 'HEX';
    } else if (RGBA_RE.test(code)) {
        return 'RGBA';
    } else if (HSLA_RE.test(code)) {
        return 'HSLA';
    } else {
        return null;
    }
}

function convert(code, current_format, format) {
    var trim_code = code.replace(/\s/g, '');

    if (current_format === 'HEX' && format === 'RGBA') {
        return HEXtoRGBA(trim_code);
    } else if (current_format === 'HEX' && format === 'HSLA') {
        return HEXtoHSLA(trim_code);
    } else if (current_format === 'RGBA' && format === 'HEX') {
        return RGBAtoHEX(trim_code);
    } else if (current_format === 'RGBA' && format === 'HSLA') {
        return RGBAtoHSLA(trim_code);
    } else if (current_format === 'HSLA' && format === 'HEX') {
        return HSLAtoHEX(trim_code);
    } else if (current_format === 'HSLA' && format === 'RGBA') {
        return HSLAtoRGBA(trim_code);
    } else {
        return trim_code;
    }
}

function HEXtoRGBA(trim_code) {
    if (trim_code.length === 4) {
        return 'rgba(' + parseInt(trim_code.slice(1, 2) + trim_code.slice(1, 2), 16) + ',' + parseInt(trim_code.slice(2, 3) + trim_code.slice(2, 3), 16) + ',' + parseInt(trim_code.slice(3, 4) + trim_code.slice(3, 4), 16) + ',1)';
    } else if (trim_code.length === 7) {
        return 'rgba(' + parseInt(trim_code.slice(1, 3), 16) + ',' + parseInt(trim_code.slice(3, 5), 16) + ',' + parseInt(trim_code.slice(5, 7), 16) + ',1)';
    } else {
        return trim_code;
    }
}

function HEXtoHSLA(trim_code) {
    var rgba = HEXtoRGBA(trim_code);
    return RGBAtoHSLA(rgba);
}

function RGBAtoHEX(trim_code){
    var array = getArray(trim_code);
    return '#' + Number(array[0]).toString(16) + Number(array[1]).toString(16) + Number(array[2]).toString(16);
}

function RGBAtoHSLA(trim_code) {
    var array = getArray(trim_code);
    var a = 1;
    if(array.length === 3){
        a = array[3];
    }
    var hsl = rgbToHsl(array[0], array[1], array[2]);
    return 'hsla(' + hsl.h + ',' + hsl.s + ',' + hsl.l + ',' + a + ')';
}

function HSLAtoRGBA(trim_code){
    var array = getArray(trim_code);
    var a = 1;
    if(array.length === 3){
        a = array[3];
    }
    var rgb = hslToRgb(array[0], array[1], array[2]);
    return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + a + ')';
}

function HSLAtoHEX(trim_code){
    var rgba = HSLAtoRGBA(trim_code);
    return RGBAtoHEX(rgba);
}

function getArray(trim_code){
    var r_index;
    if(trim_code.slice(3, 4) === 'a' || trim_code.slice(3, 4) === 'A'){
        r_index = 5;
    } else {
        r_index = 4;
    }
    return trim_code.slice(r_index, trim_code.length - 1).split(',');
}
// <----- from here got by
// http://blog.asial.co.jp/893

/**
 *  hslからrgbに変換する関数
 *
 *  hue 色相。0〜360の数値を指定
 *  saturation 彩度 0〜100%の値を指定
 *  lightness 明度 0〜100%の値を指定
 */
var hslToRgb = function(hue, saturation, lightness) {
    var h = Number(hue),
        s = Number(saturation.replace('%', '')) / 100,
        l = Number(lightness.replace('%', '')) / 100,
        max = l <= 0.5 ? l * (1 + s) : l * (1 - s) + s,
        min = 2 * l - max,
        rgb = {};

    if (s == 0) {
        rgb.r = rgb.g = rgb.b = l;
    } else {
        var list = {};

        list['r'] = h >= 240 ? h - 240 : h + 120;
        list['g'] = h;
        list['b'] = h < 120 ? h + 240 : h - 120;

        for (var key in list) {
            var val = list[key],
                res;

            switch (true) {
                case val < 60:
                    res = min + (max - min) * val / 60;
                    break;

                case val < 180:
                    res = max;
                    break;

                case val < 240:
                    res = min + (max - min) * (240 - val) / 60;
                    break;

                case val < 360:
                    res = min;
                    break;
            }

            rgb[key] = res;
        }
    }

    // CSS用に変換して返す
    return {r:Math.round(rgb.r * 255), g:Math.round(rgb.g * 255), b:Math.round(rgb.b * 255)};
    // return 'rgb(' + Math.round(rgb.r * 255) + ',' + Math.round(rgb.g * 255) + ',' + Math.round(rgb.b * 255) + ')';
};

/**
 *  rgbからhslに変換する関数
 *
 *  red 赤。0〜255の数値を指定
 *  green 緑。 0〜255の値を指定
 *  blue 青。 0〜255の値を指定
 */
var rgbToHsl = function(red, green, blue) {
    var r = red / 255,
        g = green / 255,
        b = blue / 255,
        rgb = {
            'r': r,
            'g': g,
            'b': b
        },
        max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        hsl = {
            'h': 0,
            's': 0,
            'l': (max + min) / 2
        };

    // 彩度と色相の算出
    if (max != min) {
        // 彩度
        var m = hsl.l <= 0.5 ? (max + min) : (2 - max - min);
        hsl.s = (max - min) / m;

        // 色相
        var c = {};
        for (var k in rgb) {
            var v = rgb[k];
            c[k] = (max - v) / (max - min);
        }

        var h;
        switch (max) {
            case r:
                h = c.b - c.g;
                break;

            case g:
                h = 2 + c.r - c.b;
                break;
            case b:
                h = 4 + c.g - c.r;
                break;
        }

        h = h * 60;

        hsl.h = h < 0 ? h + 360 : h;
    }

    // CSS用に変換して返す
    return {h:Math.round(hsl.h), s:Math.round(hsl.s * 100) + '%', l:Math.round(hsl.l * 100) + '%'};
    // return 'hsla(' + hsl.h + ', ' + hsl.s * 100 + '%, ' + hsl.l * 100 + '%)';
};