var Utils = require('./utils');

var rgb2hsl = function(RGB, G, B) {
    var r, g, b, min, max, h, s, l, d;

    if (typeof RGB === 'object') {
        r = RGB[0];
        g = RGB[1];
        b = RGB[2];
    } else {
        r = RGB;
        g = G;
        b = B;
    }

    r /= 255;
    g /= 255;
    b /= 255;

    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    l = (max + min) / 2;

    if (max == min) {
        h = s = 0;
    } else {
        d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
        }
        h /= 6;
    }

    return [
        Math.floor(h * 360),
        Utils.round((s * 100), 1),
        Utils.round((l * 100), 1)
    ];
};

module.exports = rgb2hsl;
