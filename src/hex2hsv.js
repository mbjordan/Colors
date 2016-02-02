var Utils = require('./utils');

var hex2hsv = function(h) {
    h = (h.charAt(0) == '#') ? h.substring(1, 7) : h;
    var r = parseInt(h.substring(0, 2), 16) / 255;
    var g = parseInt(h.substring(2, 4), 16) / 255;
    var b = parseInt(h.substring(4, 6), 16) / 255;
    var result = {
        'h': 0,
        's': 0,
        'v': 0
    };
    var minVal = Math.min(r, g, b);
    var maxVal = Math.max(r, g, b);
    var delta = (maxVal - minVal);
    var del_R;
    var del_G;
    var del_B;
    var map;

    result.v = maxVal;
    if (delta === 0) {
        result.h = 0;
        result.s = 0;
    } else {
        result.s = delta / maxVal;
        del_R = (((maxVal - r) / 6) + (delta / 2)) / delta;
        del_G = (((maxVal - g) / 6) + (delta / 2)) / delta;
        del_B = (((maxVal - b) / 6) + (delta / 2)) / delta;
        if (r == maxVal) {
            result.h = del_B - del_G;
        } else if (g == maxVal) {
            result.h = (1 / 3) + del_R - del_B;
        } else if (b == maxVal) {
            result.h = (2 / 3) + del_G - del_R;
        }
        if (result.h < 0) {
            result.h += 1;
        }
        if (result.h > 1) {
            result.h -= 1;
        }
    }

    return [
        Utils.round(result.h * 360),
        Utils.round(result.s * 100),
        Utils.round(result.v * 100)
    ];
};

module.exports = hex2hsv;
