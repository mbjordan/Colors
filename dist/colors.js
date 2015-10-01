(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Colors = require('./src/index');

if ('undefined' === typeof window) {
    if ('undefined' !== typeof module && module.exports) {
        module.exports = Colors;
        return;
    }
}

if ('function' === typeof define && define.amd) {
    define(function() {
        return Colors;
    });
    return;
}

window.ColorsTmp = Colors;

},{"./src/index":7}],2:[function(require,module,exports){
var Utils = require('./utils');
var hex2rgb = require('./hex2rgb');

function stringHandler(c) {
    var returnString = '#';

    c = c.replace(/^\x23/, '');

    if (c.length === 6) {
        returnString += Utils.paddedHex(255 - hex2rgb(c.substr(0, 2)));
        returnString += Utils.paddedHex(255 - hex2rgb(c.substr(2, 2)));
        returnString += Utils.paddedHex(255 - hex2rgb(c.substr(4, 2)));
    }
    if (c.length === 3) {
        returnString += Utils.paddedHex(255 - hex2rgb(c.substr(0, 1) + c.substr(0, 1)));
        returnString += Utils.paddedHex(255 - hex2rgb(c.substr(1, 1) + c.substr(1, 1)));
        returnString += Utils.paddedHex(255 - hex2rgb(c.substr(2, 1) + c.substr(2, 1)));
    }

    return returnString;
}

function complement(c, g, b) {
    var colorValue;

    if (typeof c === 'string' && Utils.hexRegexMatch(c)) {
        return stringHandler(c);
    }

    if ('undefined' !== c && 'undefined' !== g && 'undefined' !== b) {
        colorValue = [(255 - c), (255 - g), (255 - b)];
    }

    if (typeof c == 'object') {
        colorValue = [(255 - c[0]), (255 - c[1]), (255 - c[2])];
    }

    return Utils.render(colorValue, 'rgb');
}

module.exports = complement;

},{"./hex2rgb":4,"./utils":14}],3:[function(require,module,exports){
var Utils = require('./utils');

function hex2hsv(h) {
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

    map = [
        Utils.round(result.h * 360),
        Utils.round(result.s * 100),
        Utils.round(result.v * 100)
    ];

    return Utils.render(map, 'hsv');
}

module.exports = hex2hsv;

},{"./utils":14}],4:[function(require,module,exports){
var Utils = require('./utils');

function hex2rgb(h) {
    h = h.replace(/^\#/, '');

    if (h.length === 6) {
        var rgbArr = [
            parseInt(h.substr(0, 2), 16),
            parseInt(h.substr(2, 2), 16),
            parseInt(h.substr(4, 2), 16)
        ];

        return Utils.render(rgbArr, 'rgb');
    }

    return parseInt(h, 16);
}

module.exports = hex2rgb;

},{"./utils":14}],5:[function(require,module,exports){
var Utils = require('./utils');
var hsv2rgb = require('./hsv2rgb');

// ### hsv2hsl method
//
// Change HSV to an HSL object
//
// `hsv2hsl(HSV[, S, V])`
function hsv2hsl(H, S, V) {
    var h, s, l, _H, _S, _L, hsv, r1, g1, b1, maxColor, minColor;

    if (typeof H == 'object') {
        h = H[0];
        s = H[1];
        l = H[2];
    } else {
        h = H;
        s = S;
        l = V;
    }

    hsv = hsv2rgb(h, s, l);
    r1 = hsv.R / 255;
    g1 = hsv.G / 255;
    b1 = hsv.B / 255;
    maxColor = Math.max(r1, g1, b1);
    minColor = Math.min(r1, g1, b1);
    _L = (maxColor + minColor) / 2;
    _S = 0;
    _H = 0;
    if (maxColor != minColor) {
        if (_L < 0.5) {
            S = (maxColor - minColor) / (maxColor + minColor);
        } else {
            S = (maxColor - minColor) / (2.0 - maxColor - minColor);
        }
        if (r1 == maxColor) {
            H = (g1 - b1) / (maxColor - minColor);
        } else if (g1 == maxColor) {
            H = 2.0 + (b1 - r1) / (maxColor - minColor);
        } else {
            H = 4.0 + (r1 - g1) / (maxColor - minColor);
        }
    }
    _L = _L * 100;
    _S = _S * 100;
    _H = _H * 60;
    if (_H < 0) {
        _H += 360;
    }
    return Utils.render([Math.floor(H), Math.floor(S), Math.floor(V)], 'hsl');
}

module.exports = hsv2hsl;

},{"./hsv2rgb":6,"./utils":14}],6:[function(require,module,exports){
var Utils = require('./utils');

// ### hsv2rgb method
//
// Change an HSV color object or Int string to an RGB color object.
//
// `hsv2rgb ([obj H, S, V] or [Int H, S, V]).[obj R, G, B, RGB or a]`
function hsv2rgb(HSV, S, V) {
    var rgb = [],
        h, s, v, hi, f, p, q, t;

    if (typeof HSV == 'object') {
        h = HSV[0];
        s = HSV[1];
        v = HSV[2];
    } else {
        h = HSV;
        s = S;
        v = V;
    }
    s = s / 100;
    v = v / 100;
    hi = Math.floor((h / 60) % 6);
    f = (h / 60) - hi;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (hi) {
        case 0:
            rgb = [v, t, p];
            break;
        case 1:
            rgb = [q, v, p];
            break;
        case 2:
            rgb = [p, v, t];
            break;
        case 3:
            rgb = [p, q, v];
            break;
        case 4:
            rgb = [t, p, v];
            break;
        case 5:
            rgb = [v, p, q];
    }
    return Utils.render([Math.min(255, Math.floor(rgb[0] * 256)), Math.min(255, Math.floor(rgb[1] * 256)), Math.min(255, Math.floor(rgb[2] * 256))], 'rgb');
}

module.exports = hsv2rgb;

},{"./utils":14}],7:[function(require,module,exports){
module.exports = {
    'complement': require('./complement'),
    'hex2hsv': require('./hex2hsv'),
    'hex2rgb': require('./hex2rgb'),
    'hsv2hsl': require('./hsv2hsl'),
    'hsv2rgb': require('./hsv2rgb'),
    'name2hex': require('./name2hex'),
    'name2hsv': require('./name2hsv'),
    'name2rgb': require('./name2rgb'),
    'rand': require('./rand'),
    'rgb2hex': require('./rgb2hex'),
    'rgb2hsl': require('./rgb2hsl'),
    'utils': require('./utils')
};

},{"./complement":2,"./hex2hsv":3,"./hex2rgb":4,"./hsv2hsl":5,"./hsv2rgb":6,"./name2hex":8,"./name2hsv":9,"./name2rgb":10,"./rand":11,"./rgb2hex":12,"./rgb2hsl":13,"./utils":14}],8:[function(require,module,exports){
// ### name2hex method
//
// Get the hexadecimal value of an HTML color name. Must be one of the 176 HTML color names as defined by the HTML & CSS standards.
//
// `name2hex ( 'color name' )`
function name2hex(n) {
    n = n.toLowerCase();
    var nar = {
            'aliceblue': '#f0f8ff',
            'antiquewhite': '#faebd7',
            'aqua': '#00ffff',
            'aquamarine': '#7fffd4',
            'azure': '#f0ffff',
            'beige': '#f5f5dc',
            'bisque': '#ffe4c4',
            'black': '#000000',
            'blanchedalmond': '#ffebcd',
            'blue': '#0000ff',
            'blueviolet': '#8a2be2',
            'brown': '#a52a2a',
            'burlywood': '#deb887',
            'cadetblue': '#5f9ea0',
            'chartreuse': '#7fff00',
            'chocolate': '#d2691e',
            'coral': '#ff7f50',
            'cornflowerblue': '#6495ed',
            'cornsilk': '#fff8dc',
            'crimson': '#dc143c',
            'cyan': '#00ffff',
            'darkblue': '#00008b',
            'darkcyan': '#008b8b',
            'darkgoldenrod': '#b8860b',
            'darkgray': '#a9a9a9',
            'darkgrey': '#a9a9a9',
            'darkgreen': '#006400',
            'darkkhaki': '#bdb76b',
            'darkmagenta': '#8b008b',
            'darkolivegreen': '#556b2f',
            'darkorange': '#ff8c00',
            'darkorchid': '#9932cc',
            'darkred': '#8b0000',
            'darksalmon': '#e9967a',
            'darkseagreen': '#8fbc8f',
            'darkslateblue': '#483d8b',
            'darkslategray': '#2f4f4f',
            'darkslategrey': '#2f4f4f',
            'darkturquoise': '#00ced1',
            'darkviolet': '#9400d3',
            'deeppink': '#ff1493',
            'deepskyblue': '#00bfff',
            'dimgray': '#696969',
            'dimgrey': '#696969',
            'dodgerblue': '#1e90ff',
            'firebrick': '#b22222',
            'floralwhite': '#fffaf0',
            'forestgreen': '#228b22',
            'fuchsia': '#ff00ff',
            'gainsboro': '#dcdcdc',
            'ghostwhite': '#f8f8ff',
            'gold': '#ffd700',
            'goldenrod': '#daa520',
            'gray': '#808080',
            'grey': '#808080',
            'green': '#008000',
            'greenyellow': '#adff2f',
            'honeydew': '#f0fff0',
            'hotpink': '#ff69b4',
            'indianred': '#cd5c5c',
            'indigo': '#4b0082',
            'ivory': '#fffff0',
            'khaki': '#f0e68c',
            'lavender': '#e6e6fa',
            'lavenderblush': '#fff0f5',
            'lawngreen': '#7cfc00',
            'lemonchiffon': '#fffacd',
            'lightblue': '#add8e6',
            'lightcoral': '#f08080',
            'lightcyan': '#e0ffff',
            'lightgoldenrodyellow': '#fafad2',
            'lightgray': '#d3d3d3',
            'lightgrey': '#d3d3d3',
            'lightgreen': '#90ee90',
            'lightpink': '#ffb6c1',
            'lightsalmon': '#ffa07a',
            'lightseagreen': '#20b2aa',
            'lightskyblue': '#87cefa',
            'lightslategray': '#778899',
            'lightslategrey': '#778899',
            'lightsteelblue': '#b0c4de',
            'lightyellow': '#ffffe0',
            'lime': '#00ff00',
            'limegreen': '#32cd32',
            'linen': '#faf0e6',
            'magenta': '#ff00ff',
            'maroon': '#800000',
            'mediumaquamarine': '#66cdaa',
            'mediumblue': '#0000cd',
            'mediumorchid': '#ba55d3',
            'mediumpurple': '#9370d8',
            'mediumseagreen': '#3cb371',
            'mediumslateblue': '#7b68ee',
            'mediumspringgreen': '#00fa9a',
            'mediumturquoise': '#48d1cc',
            'mediumvioletred': '#c71585',
            'midnightblue': '#191970',
            'mintcream': '#f5fffa',
            'mistyrose': '#ffe4e1',
            'moccasin': '#ffe4b5',
            'navajowhite': '#ffdead',
            'navy': '#000080',
            'oldlace': '#fdf5e6',
            'olive': '#808000',
            'olivedrab': '#6b8e23',
            'orange': '#ffa500',
            'orangered': '#ff4500',
            'orchid': '#da70d6',
            'palegoldenrod': '#eee8aa',
            'palegreen': '#98fb98',
            'paleturquoise': '#afeeee',
            'palevioletred': '#d87093',
            'papayawhip': '#ffefd5',
            'peachpuff': '#ffdab9',
            'peru': '#cd853f',
            'pink': '#ffc0cb',
            'plum': '#dda0dd',
            'powderblue': '#b0e0e6',
            'purple': '#800080',
            'red': '#ff0000',
            'rosybrown': '#bc8f8f',
            'royalblue': '#4169e1',
            'saddlebrown': '#8b4513',
            'salmon': '#fa8072',
            'sandybrown': '#f4a460',
            'seagreen': '#2e8b57',
            'seashell': '#fff5ee',
            'sienna': '#a0522d',
            'silver': '#c0c0c0',
            'skyblue': '#87ceeb',
            'slateblue': '#6a5acd',
            'slategray': '#708090',
            'slategrey': '#708090',
            'snow': '#fffafa',
            'springgreen': '#00ff7f',
            'steelblue': '#4682b4',
            'tan': '#d2b48c',
            'teal': '#008080',
            'thistle': '#d8bfd8',
            'tomato': '#ff6347',
            'turquoise': '#40e0d0',
            'violet': '#ee82ee',
            'wheat': '#f5deb3',
            'white': '#ffffff',
            'whitesmoke': '#f5f5f5',
            'yellow': '#ffff00',
            'yellowgreen': '#9acd32'
        },
        r = nar[n];
    if (r === undefined) {
        return 'Invalid Color Name';
    }

    return r;
}
module.exports = name2hex;

},{}],9:[function(require,module,exports){
var Utils = require('./utils');
var name2hex = require('./name2hex');
var hex2hsv = require('./hex2hsv');

// ### name2hsv method
//
// Get an HSV object value of an HTML named color.
//
// `name2hsv ( 'color name' )`
function name2hsv(n) {
    var v = name2hex(n),
        t = /^[a-fA-F0-9#]{7}$/,
        icn = 'Invalid Color Name';
    if (t.test(v)) {
        return hex2hsv(v);
    }

    return Utils.render([icn, icn, icn], 'hsv');
}

module.exports = name2hsv;

},{"./hex2hsv":3,"./name2hex":8,"./utils":14}],10:[function(require,module,exports){
var Utils = require('./utils');
var name2hex = require('./name2hex');
var hex2rgb = require('./hex2rgb');

// ### name2rgb method
//
// Get an RGB object value of an HTML named color.
//
// `name2rgb ( 'color name' )`
function name2rgb(n) {
    var v = name2hex(n),
        t = /^[a-fA-F0-9#]{7}$/,
        icn = 'Invalid Color Name';

    if (t.test(v)) {
        return hex2rgb(v);
    }

    return Utils.render([icn, icn, icn], 'rgb');
}

module.exports = name2rgb;

},{"./hex2rgb":4,"./name2hex":8,"./utils":14}],11:[function(require,module,exports){
var Utils = require('./utils');

// ### rand method
//
// Get a random color in either hexadecimal or RGB color modes.
//
// `rand ( [color mode] )`
function rand(mode) {
    var R, G, B;

    if (mode === 'hex' || mode === undefined) {
        var chars = '0123456789abcdef',
            string_length = 6,
            hexStr = '',
            rnum, i;

        for (i = 0; i < string_length; i++) {
            rnum = Math.floor(Math.random() * chars.length);
            hexStr += chars.substring(rnum, rnum + 1);
        }
        return '#' + hexStr;
    }

    if (mode == 'rgb') {
        R = Math.floor(Math.random() * (0 - 255 + 1) + 255);
        G = Math.floor(Math.random() * (0 - 255 + 1) + 255);
        B = Math.floor(Math.random() * (0 - 255 + 1) + 255);
        return Utils.render([R, G, B], 'rgb');
    }
}


module.exports = rand;

},{"./utils":14}],12:[function(require,module,exports){
var Utils = require('./utils');

function rgb2hex(r, g, b) {
    r = Utils.paddedHex(r);
    g = (g !== undefined) ? Utils.paddedHex(g) : r;
    b = (b !== undefined) ? Utils.paddedHex(b) : r;

    return '#' + r + g + b;
}

module.exports = rgb2hex;

},{"./utils":14}],13:[function(require,module,exports){
var Utils = require('./utils');

// ### rgb2hsl method
//
// Change RGB to an HSL object.
//
// `rgb2hsl(RGB[, G, B])`
function rgb2hsl(RGB, G, B) {
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

    return Utils.render([Math.floor(h * 360), Utils.round((s * 100), 1), Utils.round((l * 100), 1)], 'hsl');
}

module.exports = rgb2hsl;

},{"./utils":14}],14:[function(require,module,exports){
//## Internal Utilities
// ###Render method
//
// `render(map, type)`
//
// `map` is an object of data to render, `type` can be RGB, HSV or HSL
//
// TODO: This function is outdated and could be written better
exports.render = function render(map, type) {
    var rtn = {};
    var keys;

    if (typeof map != 'object') {
        return;
    }

    if (type === 'rgb') {
        keys = ['R', 'G', 'B', 'RGB'];
    }

    if (type === 'hsv') {
        keys = ['H', 'S', 'V', 'HSV'];
    }

    if (type === 'hsl') {
        keys = ['H', 'S', 'L', 'HSL'];
    }

    rtn[keys[0]] = map[0];
    rtn[keys[1]] = map[1];
    rtn[keys[2]] = map[2];
    rtn[keys[3]] = map[0] + ' ' + map[1] + ' ' + map[2];
    rtn.a = map;

    return rtn;
};

// ### Padded Hex method
//
// `paddedHex(number)`
//
// Creates a hexadecimal number, and adds a zero to the beginning if its only one digit.
exports.paddedHex = function paddedHex(n) {
    var hex = (n < 10) ? '0' : '';

    hex += n.toString(16);

    return (hex.length === 1) ? '0' + hex : hex;
};

exports.round = function round(num, points) {
    points = points || 10;
    return parseFloat(num.toFixed(points));
};

exports.hexRegexMatch = function hexRegexMatch(c) {
    return /^\x23[a-f0-9]{3}([a-f0-9]{3})?$/i.test(c);
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInNyYy9jb21wbGVtZW50LmpzIiwic3JjL2hleDJoc3YuanMiLCJzcmMvaGV4MnJnYi5qcyIsInNyYy9oc3YyaHNsLmpzIiwic3JjL2hzdjJyZ2IuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvbmFtZTJoZXguanMiLCJzcmMvbmFtZTJoc3YuanMiLCJzcmMvbmFtZTJyZ2IuanMiLCJzcmMvcmFuZC5qcyIsInNyYy9yZ2IyaGV4LmpzIiwic3JjL3JnYjJoc2wuanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQ29sb3JzID0gcmVxdWlyZSgnLi9zcmMvaW5kZXgnKTtcblxuaWYgKCd1bmRlZmluZWQnID09PSB0eXBlb2Ygd2luZG93KSB7XG4gICAgaWYgKCd1bmRlZmluZWQnICE9PSB0eXBlb2YgbW9kdWxlICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gQ29sb3JzO1xuICAgICAgICByZXR1cm47XG4gICAgfVxufVxuXG5pZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGRlZmluZSAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gQ29sb3JzO1xuICAgIH0pO1xuICAgIHJldHVybjtcbn1cblxud2luZG93LkNvbG9yc1RtcCA9IENvbG9ycztcbiIsInZhciBVdGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBoZXgycmdiID0gcmVxdWlyZSgnLi9oZXgycmdiJyk7XG5cbmZ1bmN0aW9uIHN0cmluZ0hhbmRsZXIoYykge1xuICAgIHZhciByZXR1cm5TdHJpbmcgPSAnIyc7XG5cbiAgICBjID0gYy5yZXBsYWNlKC9eXFx4MjMvLCAnJyk7XG5cbiAgICBpZiAoYy5sZW5ndGggPT09IDYpIHtcbiAgICAgICAgcmV0dXJuU3RyaW5nICs9IFV0aWxzLnBhZGRlZEhleCgyNTUgLSBoZXgycmdiKGMuc3Vic3RyKDAsIDIpKSk7XG4gICAgICAgIHJldHVyblN0cmluZyArPSBVdGlscy5wYWRkZWRIZXgoMjU1IC0gaGV4MnJnYihjLnN1YnN0cigyLCAyKSkpO1xuICAgICAgICByZXR1cm5TdHJpbmcgKz0gVXRpbHMucGFkZGVkSGV4KDI1NSAtIGhleDJyZ2IoYy5zdWJzdHIoNCwgMikpKTtcbiAgICB9XG4gICAgaWYgKGMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgIHJldHVyblN0cmluZyArPSBVdGlscy5wYWRkZWRIZXgoMjU1IC0gaGV4MnJnYihjLnN1YnN0cigwLCAxKSArIGMuc3Vic3RyKDAsIDEpKSk7XG4gICAgICAgIHJldHVyblN0cmluZyArPSBVdGlscy5wYWRkZWRIZXgoMjU1IC0gaGV4MnJnYihjLnN1YnN0cigxLCAxKSArIGMuc3Vic3RyKDEsIDEpKSk7XG4gICAgICAgIHJldHVyblN0cmluZyArPSBVdGlscy5wYWRkZWRIZXgoMjU1IC0gaGV4MnJnYihjLnN1YnN0cigyLCAxKSArIGMuc3Vic3RyKDIsIDEpKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldHVyblN0cmluZztcbn1cblxuZnVuY3Rpb24gY29tcGxlbWVudChjLCBnLCBiKSB7XG4gICAgdmFyIGNvbG9yVmFsdWU7XG5cbiAgICBpZiAodHlwZW9mIGMgPT09ICdzdHJpbmcnICYmIFV0aWxzLmhleFJlZ2V4TWF0Y2goYykpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZ0hhbmRsZXIoYyk7XG4gICAgfVxuXG4gICAgaWYgKCd1bmRlZmluZWQnICE9PSBjICYmICd1bmRlZmluZWQnICE9PSBnICYmICd1bmRlZmluZWQnICE9PSBiKSB7XG4gICAgICAgIGNvbG9yVmFsdWUgPSBbKDI1NSAtIGMpLCAoMjU1IC0gZyksICgyNTUgLSBiKV07XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjID09ICdvYmplY3QnKSB7XG4gICAgICAgIGNvbG9yVmFsdWUgPSBbKDI1NSAtIGNbMF0pLCAoMjU1IC0gY1sxXSksICgyNTUgLSBjWzJdKV07XG4gICAgfVxuXG4gICAgcmV0dXJuIFV0aWxzLnJlbmRlcihjb2xvclZhbHVlLCAncmdiJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29tcGxlbWVudDtcbiIsInZhciBVdGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuZnVuY3Rpb24gaGV4MmhzdihoKSB7XG4gICAgaCA9IChoLmNoYXJBdCgwKSA9PSAnIycpID8gaC5zdWJzdHJpbmcoMSwgNykgOiBoO1xuICAgIHZhciByID0gcGFyc2VJbnQoaC5zdWJzdHJpbmcoMCwgMiksIDE2KSAvIDI1NTtcbiAgICB2YXIgZyA9IHBhcnNlSW50KGguc3Vic3RyaW5nKDIsIDQpLCAxNikgLyAyNTU7XG4gICAgdmFyIGIgPSBwYXJzZUludChoLnN1YnN0cmluZyg0LCA2KSwgMTYpIC8gMjU1O1xuICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgICdoJzogMCxcbiAgICAgICAgJ3MnOiAwLFxuICAgICAgICAndic6IDBcbiAgICB9O1xuICAgIHZhciBtaW5WYWwgPSBNYXRoLm1pbihyLCBnLCBiKTtcbiAgICB2YXIgbWF4VmFsID0gTWF0aC5tYXgociwgZywgYik7XG4gICAgdmFyIGRlbHRhID0gKG1heFZhbCAtIG1pblZhbCk7XG4gICAgdmFyIGRlbF9SO1xuICAgIHZhciBkZWxfRztcbiAgICB2YXIgZGVsX0I7XG4gICAgdmFyIG1hcDtcblxuICAgIHJlc3VsdC52ID0gbWF4VmFsO1xuICAgIGlmIChkZWx0YSA9PT0gMCkge1xuICAgICAgICByZXN1bHQuaCA9IDA7XG4gICAgICAgIHJlc3VsdC5zID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQucyA9IGRlbHRhIC8gbWF4VmFsO1xuICAgICAgICBkZWxfUiA9ICgoKG1heFZhbCAtIHIpIC8gNikgKyAoZGVsdGEgLyAyKSkgLyBkZWx0YTtcbiAgICAgICAgZGVsX0cgPSAoKChtYXhWYWwgLSBnKSAvIDYpICsgKGRlbHRhIC8gMikpIC8gZGVsdGE7XG4gICAgICAgIGRlbF9CID0gKCgobWF4VmFsIC0gYikgLyA2KSArIChkZWx0YSAvIDIpKSAvIGRlbHRhO1xuICAgICAgICBpZiAociA9PSBtYXhWYWwpIHtcbiAgICAgICAgICAgIHJlc3VsdC5oID0gZGVsX0IgLSBkZWxfRztcbiAgICAgICAgfSBlbHNlIGlmIChnID09IG1heFZhbCkge1xuICAgICAgICAgICAgcmVzdWx0LmggPSAoMSAvIDMpICsgZGVsX1IgLSBkZWxfQjtcbiAgICAgICAgfSBlbHNlIGlmIChiID09IG1heFZhbCkge1xuICAgICAgICAgICAgcmVzdWx0LmggPSAoMiAvIDMpICsgZGVsX0cgLSBkZWxfUjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0LmggPCAwKSB7XG4gICAgICAgICAgICByZXN1bHQuaCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQuaCA+IDEpIHtcbiAgICAgICAgICAgIHJlc3VsdC5oIC09IDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtYXAgPSBbXG4gICAgICAgIFV0aWxzLnJvdW5kKHJlc3VsdC5oICogMzYwKSxcbiAgICAgICAgVXRpbHMucm91bmQocmVzdWx0LnMgKiAxMDApLFxuICAgICAgICBVdGlscy5yb3VuZChyZXN1bHQudiAqIDEwMClcbiAgICBdO1xuXG4gICAgcmV0dXJuIFV0aWxzLnJlbmRlcihtYXAsICdoc3YnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoZXgyaHN2O1xuIiwidmFyIFV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5mdW5jdGlvbiBoZXgycmdiKGgpIHtcbiAgICBoID0gaC5yZXBsYWNlKC9eXFwjLywgJycpO1xuXG4gICAgaWYgKGgubGVuZ3RoID09PSA2KSB7XG4gICAgICAgIHZhciByZ2JBcnIgPSBbXG4gICAgICAgICAgICBwYXJzZUludChoLnN1YnN0cigwLCAyKSwgMTYpLFxuICAgICAgICAgICAgcGFyc2VJbnQoaC5zdWJzdHIoMiwgMiksIDE2KSxcbiAgICAgICAgICAgIHBhcnNlSW50KGguc3Vic3RyKDQsIDIpLCAxNilcbiAgICAgICAgXTtcblxuICAgICAgICByZXR1cm4gVXRpbHMucmVuZGVyKHJnYkFyciwgJ3JnYicpO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJzZUludChoLCAxNik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGV4MnJnYjtcbiIsInZhciBVdGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBoc3YycmdiID0gcmVxdWlyZSgnLi9oc3YycmdiJyk7XG5cbi8vICMjIyBoc3YyaHNsIG1ldGhvZFxuLy9cbi8vIENoYW5nZSBIU1YgdG8gYW4gSFNMIG9iamVjdFxuLy9cbi8vIGBoc3YyaHNsKEhTVlssIFMsIFZdKWBcbmZ1bmN0aW9uIGhzdjJoc2woSCwgUywgVikge1xuICAgIHZhciBoLCBzLCBsLCBfSCwgX1MsIF9MLCBoc3YsIHIxLCBnMSwgYjEsIG1heENvbG9yLCBtaW5Db2xvcjtcblxuICAgIGlmICh0eXBlb2YgSCA9PSAnb2JqZWN0Jykge1xuICAgICAgICBoID0gSFswXTtcbiAgICAgICAgcyA9IEhbMV07XG4gICAgICAgIGwgPSBIWzJdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGggPSBIO1xuICAgICAgICBzID0gUztcbiAgICAgICAgbCA9IFY7XG4gICAgfVxuXG4gICAgaHN2ID0gaHN2MnJnYihoLCBzLCBsKTtcbiAgICByMSA9IGhzdi5SIC8gMjU1O1xuICAgIGcxID0gaHN2LkcgLyAyNTU7XG4gICAgYjEgPSBoc3YuQiAvIDI1NTtcbiAgICBtYXhDb2xvciA9IE1hdGgubWF4KHIxLCBnMSwgYjEpO1xuICAgIG1pbkNvbG9yID0gTWF0aC5taW4ocjEsIGcxLCBiMSk7XG4gICAgX0wgPSAobWF4Q29sb3IgKyBtaW5Db2xvcikgLyAyO1xuICAgIF9TID0gMDtcbiAgICBfSCA9IDA7XG4gICAgaWYgKG1heENvbG9yICE9IG1pbkNvbG9yKSB7XG4gICAgICAgIGlmIChfTCA8IDAuNSkge1xuICAgICAgICAgICAgUyA9IChtYXhDb2xvciAtIG1pbkNvbG9yKSAvIChtYXhDb2xvciArIG1pbkNvbG9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFMgPSAobWF4Q29sb3IgLSBtaW5Db2xvcikgLyAoMi4wIC0gbWF4Q29sb3IgLSBtaW5Db2xvcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHIxID09IG1heENvbG9yKSB7XG4gICAgICAgICAgICBIID0gKGcxIC0gYjEpIC8gKG1heENvbG9yIC0gbWluQ29sb3IpO1xuICAgICAgICB9IGVsc2UgaWYgKGcxID09IG1heENvbG9yKSB7XG4gICAgICAgICAgICBIID0gMi4wICsgKGIxIC0gcjEpIC8gKG1heENvbG9yIC0gbWluQ29sb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgSCA9IDQuMCArIChyMSAtIGcxKSAvIChtYXhDb2xvciAtIG1pbkNvbG9yKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfTCA9IF9MICogMTAwO1xuICAgIF9TID0gX1MgKiAxMDA7XG4gICAgX0ggPSBfSCAqIDYwO1xuICAgIGlmIChfSCA8IDApIHtcbiAgICAgICAgX0ggKz0gMzYwO1xuICAgIH1cbiAgICByZXR1cm4gVXRpbHMucmVuZGVyKFtNYXRoLmZsb29yKEgpLCBNYXRoLmZsb29yKFMpLCBNYXRoLmZsb29yKFYpXSwgJ2hzbCcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhzdjJoc2w7XG4iLCJ2YXIgVXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbi8vICMjIyBoc3YycmdiIG1ldGhvZFxuLy9cbi8vIENoYW5nZSBhbiBIU1YgY29sb3Igb2JqZWN0IG9yIEludCBzdHJpbmcgdG8gYW4gUkdCIGNvbG9yIG9iamVjdC5cbi8vXG4vLyBgaHN2MnJnYiAoW29iaiBILCBTLCBWXSBvciBbSW50IEgsIFMsIFZdKS5bb2JqIFIsIEcsIEIsIFJHQiBvciBhXWBcbmZ1bmN0aW9uIGhzdjJyZ2IoSFNWLCBTLCBWKSB7XG4gICAgdmFyIHJnYiA9IFtdLFxuICAgICAgICBoLCBzLCB2LCBoaSwgZiwgcCwgcSwgdDtcblxuICAgIGlmICh0eXBlb2YgSFNWID09ICdvYmplY3QnKSB7XG4gICAgICAgIGggPSBIU1ZbMF07XG4gICAgICAgIHMgPSBIU1ZbMV07XG4gICAgICAgIHYgPSBIU1ZbMl07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaCA9IEhTVjtcbiAgICAgICAgcyA9IFM7XG4gICAgICAgIHYgPSBWO1xuICAgIH1cbiAgICBzID0gcyAvIDEwMDtcbiAgICB2ID0gdiAvIDEwMDtcbiAgICBoaSA9IE1hdGguZmxvb3IoKGggLyA2MCkgJSA2KTtcbiAgICBmID0gKGggLyA2MCkgLSBoaTtcbiAgICBwID0gdiAqICgxIC0gcyk7XG4gICAgcSA9IHYgKiAoMSAtIGYgKiBzKTtcbiAgICB0ID0gdiAqICgxIC0gKDEgLSBmKSAqIHMpO1xuICAgIHN3aXRjaCAoaGkpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgcmdiID0gW3YsIHQsIHBdO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHJnYiA9IFtxLCB2LCBwXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICByZ2IgPSBbcCwgdiwgdF07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgcmdiID0gW3AsIHEsIHZdO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHJnYiA9IFt0LCBwLCB2XTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICByZ2IgPSBbdiwgcCwgcV07XG4gICAgfVxuICAgIHJldHVybiBVdGlscy5yZW5kZXIoW01hdGgubWluKDI1NSwgTWF0aC5mbG9vcihyZ2JbMF0gKiAyNTYpKSwgTWF0aC5taW4oMjU1LCBNYXRoLmZsb29yKHJnYlsxXSAqIDI1NikpLCBNYXRoLm1pbigyNTUsIE1hdGguZmxvb3IocmdiWzJdICogMjU2KSldLCAncmdiJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaHN2MnJnYjtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICdjb21wbGVtZW50JzogcmVxdWlyZSgnLi9jb21wbGVtZW50JyksXG4gICAgJ2hleDJoc3YnOiByZXF1aXJlKCcuL2hleDJoc3YnKSxcbiAgICAnaGV4MnJnYic6IHJlcXVpcmUoJy4vaGV4MnJnYicpLFxuICAgICdoc3YyaHNsJzogcmVxdWlyZSgnLi9oc3YyaHNsJyksXG4gICAgJ2hzdjJyZ2InOiByZXF1aXJlKCcuL2hzdjJyZ2InKSxcbiAgICAnbmFtZTJoZXgnOiByZXF1aXJlKCcuL25hbWUyaGV4JyksXG4gICAgJ25hbWUyaHN2JzogcmVxdWlyZSgnLi9uYW1lMmhzdicpLFxuICAgICduYW1lMnJnYic6IHJlcXVpcmUoJy4vbmFtZTJyZ2InKSxcbiAgICAncmFuZCc6IHJlcXVpcmUoJy4vcmFuZCcpLFxuICAgICdyZ2IyaGV4JzogcmVxdWlyZSgnLi9yZ2IyaGV4JyksXG4gICAgJ3JnYjJoc2wnOiByZXF1aXJlKCcuL3JnYjJoc2wnKSxcbiAgICAndXRpbHMnOiByZXF1aXJlKCcuL3V0aWxzJylcbn07XG4iLCIvLyAjIyMgbmFtZTJoZXggbWV0aG9kXG4vL1xuLy8gR2V0IHRoZSBoZXhhZGVjaW1hbCB2YWx1ZSBvZiBhbiBIVE1MIGNvbG9yIG5hbWUuIE11c3QgYmUgb25lIG9mIHRoZSAxNzYgSFRNTCBjb2xvciBuYW1lcyBhcyBkZWZpbmVkIGJ5IHRoZSBIVE1MICYgQ1NTIHN0YW5kYXJkcy5cbi8vXG4vLyBgbmFtZTJoZXggKCAnY29sb3IgbmFtZScgKWBcbmZ1bmN0aW9uIG5hbWUyaGV4KG4pIHtcbiAgICBuID0gbi50b0xvd2VyQ2FzZSgpO1xuICAgIHZhciBuYXIgPSB7XG4gICAgICAgICAgICAnYWxpY2VibHVlJzogJyNmMGY4ZmYnLFxuICAgICAgICAgICAgJ2FudGlxdWV3aGl0ZSc6ICcjZmFlYmQ3JyxcbiAgICAgICAgICAgICdhcXVhJzogJyMwMGZmZmYnLFxuICAgICAgICAgICAgJ2FxdWFtYXJpbmUnOiAnIzdmZmZkNCcsXG4gICAgICAgICAgICAnYXp1cmUnOiAnI2YwZmZmZicsXG4gICAgICAgICAgICAnYmVpZ2UnOiAnI2Y1ZjVkYycsXG4gICAgICAgICAgICAnYmlzcXVlJzogJyNmZmU0YzQnLFxuICAgICAgICAgICAgJ2JsYWNrJzogJyMwMDAwMDAnLFxuICAgICAgICAgICAgJ2JsYW5jaGVkYWxtb25kJzogJyNmZmViY2QnLFxuICAgICAgICAgICAgJ2JsdWUnOiAnIzAwMDBmZicsXG4gICAgICAgICAgICAnYmx1ZXZpb2xldCc6ICcjOGEyYmUyJyxcbiAgICAgICAgICAgICdicm93bic6ICcjYTUyYTJhJyxcbiAgICAgICAgICAgICdidXJseXdvb2QnOiAnI2RlYjg4NycsXG4gICAgICAgICAgICAnY2FkZXRibHVlJzogJyM1ZjllYTAnLFxuICAgICAgICAgICAgJ2NoYXJ0cmV1c2UnOiAnIzdmZmYwMCcsXG4gICAgICAgICAgICAnY2hvY29sYXRlJzogJyNkMjY5MWUnLFxuICAgICAgICAgICAgJ2NvcmFsJzogJyNmZjdmNTAnLFxuICAgICAgICAgICAgJ2Nvcm5mbG93ZXJibHVlJzogJyM2NDk1ZWQnLFxuICAgICAgICAgICAgJ2Nvcm5zaWxrJzogJyNmZmY4ZGMnLFxuICAgICAgICAgICAgJ2NyaW1zb24nOiAnI2RjMTQzYycsXG4gICAgICAgICAgICAnY3lhbic6ICcjMDBmZmZmJyxcbiAgICAgICAgICAgICdkYXJrYmx1ZSc6ICcjMDAwMDhiJyxcbiAgICAgICAgICAgICdkYXJrY3lhbic6ICcjMDA4YjhiJyxcbiAgICAgICAgICAgICdkYXJrZ29sZGVucm9kJzogJyNiODg2MGInLFxuICAgICAgICAgICAgJ2RhcmtncmF5JzogJyNhOWE5YTknLFxuICAgICAgICAgICAgJ2RhcmtncmV5JzogJyNhOWE5YTknLFxuICAgICAgICAgICAgJ2RhcmtncmVlbic6ICcjMDA2NDAwJyxcbiAgICAgICAgICAgICdkYXJra2hha2knOiAnI2JkYjc2YicsXG4gICAgICAgICAgICAnZGFya21hZ2VudGEnOiAnIzhiMDA4YicsXG4gICAgICAgICAgICAnZGFya29saXZlZ3JlZW4nOiAnIzU1NmIyZicsXG4gICAgICAgICAgICAnZGFya29yYW5nZSc6ICcjZmY4YzAwJyxcbiAgICAgICAgICAgICdkYXJrb3JjaGlkJzogJyM5OTMyY2MnLFxuICAgICAgICAgICAgJ2RhcmtyZWQnOiAnIzhiMDAwMCcsXG4gICAgICAgICAgICAnZGFya3NhbG1vbic6ICcjZTk5NjdhJyxcbiAgICAgICAgICAgICdkYXJrc2VhZ3JlZW4nOiAnIzhmYmM4ZicsXG4gICAgICAgICAgICAnZGFya3NsYXRlYmx1ZSc6ICcjNDgzZDhiJyxcbiAgICAgICAgICAgICdkYXJrc2xhdGVncmF5JzogJyMyZjRmNGYnLFxuICAgICAgICAgICAgJ2RhcmtzbGF0ZWdyZXknOiAnIzJmNGY0ZicsXG4gICAgICAgICAgICAnZGFya3R1cnF1b2lzZSc6ICcjMDBjZWQxJyxcbiAgICAgICAgICAgICdkYXJrdmlvbGV0JzogJyM5NDAwZDMnLFxuICAgICAgICAgICAgJ2RlZXBwaW5rJzogJyNmZjE0OTMnLFxuICAgICAgICAgICAgJ2RlZXBza3libHVlJzogJyMwMGJmZmYnLFxuICAgICAgICAgICAgJ2RpbWdyYXknOiAnIzY5Njk2OScsXG4gICAgICAgICAgICAnZGltZ3JleSc6ICcjNjk2OTY5JyxcbiAgICAgICAgICAgICdkb2RnZXJibHVlJzogJyMxZTkwZmYnLFxuICAgICAgICAgICAgJ2ZpcmVicmljayc6ICcjYjIyMjIyJyxcbiAgICAgICAgICAgICdmbG9yYWx3aGl0ZSc6ICcjZmZmYWYwJyxcbiAgICAgICAgICAgICdmb3Jlc3RncmVlbic6ICcjMjI4YjIyJyxcbiAgICAgICAgICAgICdmdWNoc2lhJzogJyNmZjAwZmYnLFxuICAgICAgICAgICAgJ2dhaW5zYm9ybyc6ICcjZGNkY2RjJyxcbiAgICAgICAgICAgICdnaG9zdHdoaXRlJzogJyNmOGY4ZmYnLFxuICAgICAgICAgICAgJ2dvbGQnOiAnI2ZmZDcwMCcsXG4gICAgICAgICAgICAnZ29sZGVucm9kJzogJyNkYWE1MjAnLFxuICAgICAgICAgICAgJ2dyYXknOiAnIzgwODA4MCcsXG4gICAgICAgICAgICAnZ3JleSc6ICcjODA4MDgwJyxcbiAgICAgICAgICAgICdncmVlbic6ICcjMDA4MDAwJyxcbiAgICAgICAgICAgICdncmVlbnllbGxvdyc6ICcjYWRmZjJmJyxcbiAgICAgICAgICAgICdob25leWRldyc6ICcjZjBmZmYwJyxcbiAgICAgICAgICAgICdob3RwaW5rJzogJyNmZjY5YjQnLFxuICAgICAgICAgICAgJ2luZGlhbnJlZCc6ICcjY2Q1YzVjJyxcbiAgICAgICAgICAgICdpbmRpZ28nOiAnIzRiMDA4MicsXG4gICAgICAgICAgICAnaXZvcnknOiAnI2ZmZmZmMCcsXG4gICAgICAgICAgICAna2hha2knOiAnI2YwZTY4YycsXG4gICAgICAgICAgICAnbGF2ZW5kZXInOiAnI2U2ZTZmYScsXG4gICAgICAgICAgICAnbGF2ZW5kZXJibHVzaCc6ICcjZmZmMGY1JyxcbiAgICAgICAgICAgICdsYXduZ3JlZW4nOiAnIzdjZmMwMCcsXG4gICAgICAgICAgICAnbGVtb25jaGlmZm9uJzogJyNmZmZhY2QnLFxuICAgICAgICAgICAgJ2xpZ2h0Ymx1ZSc6ICcjYWRkOGU2JyxcbiAgICAgICAgICAgICdsaWdodGNvcmFsJzogJyNmMDgwODAnLFxuICAgICAgICAgICAgJ2xpZ2h0Y3lhbic6ICcjZTBmZmZmJyxcbiAgICAgICAgICAgICdsaWdodGdvbGRlbnJvZHllbGxvdyc6ICcjZmFmYWQyJyxcbiAgICAgICAgICAgICdsaWdodGdyYXknOiAnI2QzZDNkMycsXG4gICAgICAgICAgICAnbGlnaHRncmV5JzogJyNkM2QzZDMnLFxuICAgICAgICAgICAgJ2xpZ2h0Z3JlZW4nOiAnIzkwZWU5MCcsXG4gICAgICAgICAgICAnbGlnaHRwaW5rJzogJyNmZmI2YzEnLFxuICAgICAgICAgICAgJ2xpZ2h0c2FsbW9uJzogJyNmZmEwN2EnLFxuICAgICAgICAgICAgJ2xpZ2h0c2VhZ3JlZW4nOiAnIzIwYjJhYScsXG4gICAgICAgICAgICAnbGlnaHRza3libHVlJzogJyM4N2NlZmEnLFxuICAgICAgICAgICAgJ2xpZ2h0c2xhdGVncmF5JzogJyM3Nzg4OTknLFxuICAgICAgICAgICAgJ2xpZ2h0c2xhdGVncmV5JzogJyM3Nzg4OTknLFxuICAgICAgICAgICAgJ2xpZ2h0c3RlZWxibHVlJzogJyNiMGM0ZGUnLFxuICAgICAgICAgICAgJ2xpZ2h0eWVsbG93JzogJyNmZmZmZTAnLFxuICAgICAgICAgICAgJ2xpbWUnOiAnIzAwZmYwMCcsXG4gICAgICAgICAgICAnbGltZWdyZWVuJzogJyMzMmNkMzInLFxuICAgICAgICAgICAgJ2xpbmVuJzogJyNmYWYwZTYnLFxuICAgICAgICAgICAgJ21hZ2VudGEnOiAnI2ZmMDBmZicsXG4gICAgICAgICAgICAnbWFyb29uJzogJyM4MDAwMDAnLFxuICAgICAgICAgICAgJ21lZGl1bWFxdWFtYXJpbmUnOiAnIzY2Y2RhYScsXG4gICAgICAgICAgICAnbWVkaXVtYmx1ZSc6ICcjMDAwMGNkJyxcbiAgICAgICAgICAgICdtZWRpdW1vcmNoaWQnOiAnI2JhNTVkMycsXG4gICAgICAgICAgICAnbWVkaXVtcHVycGxlJzogJyM5MzcwZDgnLFxuICAgICAgICAgICAgJ21lZGl1bXNlYWdyZWVuJzogJyMzY2IzNzEnLFxuICAgICAgICAgICAgJ21lZGl1bXNsYXRlYmx1ZSc6ICcjN2I2OGVlJyxcbiAgICAgICAgICAgICdtZWRpdW1zcHJpbmdncmVlbic6ICcjMDBmYTlhJyxcbiAgICAgICAgICAgICdtZWRpdW10dXJxdW9pc2UnOiAnIzQ4ZDFjYycsXG4gICAgICAgICAgICAnbWVkaXVtdmlvbGV0cmVkJzogJyNjNzE1ODUnLFxuICAgICAgICAgICAgJ21pZG5pZ2h0Ymx1ZSc6ICcjMTkxOTcwJyxcbiAgICAgICAgICAgICdtaW50Y3JlYW0nOiAnI2Y1ZmZmYScsXG4gICAgICAgICAgICAnbWlzdHlyb3NlJzogJyNmZmU0ZTEnLFxuICAgICAgICAgICAgJ21vY2Nhc2luJzogJyNmZmU0YjUnLFxuICAgICAgICAgICAgJ25hdmFqb3doaXRlJzogJyNmZmRlYWQnLFxuICAgICAgICAgICAgJ25hdnknOiAnIzAwMDA4MCcsXG4gICAgICAgICAgICAnb2xkbGFjZSc6ICcjZmRmNWU2JyxcbiAgICAgICAgICAgICdvbGl2ZSc6ICcjODA4MDAwJyxcbiAgICAgICAgICAgICdvbGl2ZWRyYWInOiAnIzZiOGUyMycsXG4gICAgICAgICAgICAnb3JhbmdlJzogJyNmZmE1MDAnLFxuICAgICAgICAgICAgJ29yYW5nZXJlZCc6ICcjZmY0NTAwJyxcbiAgICAgICAgICAgICdvcmNoaWQnOiAnI2RhNzBkNicsXG4gICAgICAgICAgICAncGFsZWdvbGRlbnJvZCc6ICcjZWVlOGFhJyxcbiAgICAgICAgICAgICdwYWxlZ3JlZW4nOiAnIzk4ZmI5OCcsXG4gICAgICAgICAgICAncGFsZXR1cnF1b2lzZSc6ICcjYWZlZWVlJyxcbiAgICAgICAgICAgICdwYWxldmlvbGV0cmVkJzogJyNkODcwOTMnLFxuICAgICAgICAgICAgJ3BhcGF5YXdoaXAnOiAnI2ZmZWZkNScsXG4gICAgICAgICAgICAncGVhY2hwdWZmJzogJyNmZmRhYjknLFxuICAgICAgICAgICAgJ3BlcnUnOiAnI2NkODUzZicsXG4gICAgICAgICAgICAncGluayc6ICcjZmZjMGNiJyxcbiAgICAgICAgICAgICdwbHVtJzogJyNkZGEwZGQnLFxuICAgICAgICAgICAgJ3Bvd2RlcmJsdWUnOiAnI2IwZTBlNicsXG4gICAgICAgICAgICAncHVycGxlJzogJyM4MDAwODAnLFxuICAgICAgICAgICAgJ3JlZCc6ICcjZmYwMDAwJyxcbiAgICAgICAgICAgICdyb3N5YnJvd24nOiAnI2JjOGY4ZicsXG4gICAgICAgICAgICAncm95YWxibHVlJzogJyM0MTY5ZTEnLFxuICAgICAgICAgICAgJ3NhZGRsZWJyb3duJzogJyM4YjQ1MTMnLFxuICAgICAgICAgICAgJ3NhbG1vbic6ICcjZmE4MDcyJyxcbiAgICAgICAgICAgICdzYW5keWJyb3duJzogJyNmNGE0NjAnLFxuICAgICAgICAgICAgJ3NlYWdyZWVuJzogJyMyZThiNTcnLFxuICAgICAgICAgICAgJ3NlYXNoZWxsJzogJyNmZmY1ZWUnLFxuICAgICAgICAgICAgJ3NpZW5uYSc6ICcjYTA1MjJkJyxcbiAgICAgICAgICAgICdzaWx2ZXInOiAnI2MwYzBjMCcsXG4gICAgICAgICAgICAnc2t5Ymx1ZSc6ICcjODdjZWViJyxcbiAgICAgICAgICAgICdzbGF0ZWJsdWUnOiAnIzZhNWFjZCcsXG4gICAgICAgICAgICAnc2xhdGVncmF5JzogJyM3MDgwOTAnLFxuICAgICAgICAgICAgJ3NsYXRlZ3JleSc6ICcjNzA4MDkwJyxcbiAgICAgICAgICAgICdzbm93JzogJyNmZmZhZmEnLFxuICAgICAgICAgICAgJ3NwcmluZ2dyZWVuJzogJyMwMGZmN2YnLFxuICAgICAgICAgICAgJ3N0ZWVsYmx1ZSc6ICcjNDY4MmI0JyxcbiAgICAgICAgICAgICd0YW4nOiAnI2QyYjQ4YycsXG4gICAgICAgICAgICAndGVhbCc6ICcjMDA4MDgwJyxcbiAgICAgICAgICAgICd0aGlzdGxlJzogJyNkOGJmZDgnLFxuICAgICAgICAgICAgJ3RvbWF0byc6ICcjZmY2MzQ3JyxcbiAgICAgICAgICAgICd0dXJxdW9pc2UnOiAnIzQwZTBkMCcsXG4gICAgICAgICAgICAndmlvbGV0JzogJyNlZTgyZWUnLFxuICAgICAgICAgICAgJ3doZWF0JzogJyNmNWRlYjMnLFxuICAgICAgICAgICAgJ3doaXRlJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgJ3doaXRlc21va2UnOiAnI2Y1ZjVmNScsXG4gICAgICAgICAgICAneWVsbG93JzogJyNmZmZmMDAnLFxuICAgICAgICAgICAgJ3llbGxvd2dyZWVuJzogJyM5YWNkMzInXG4gICAgICAgIH0sXG4gICAgICAgIHIgPSBuYXJbbl07XG4gICAgaWYgKHIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gJ0ludmFsaWQgQ29sb3IgTmFtZSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IG5hbWUyaGV4O1xuIiwidmFyIFV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIG5hbWUyaGV4ID0gcmVxdWlyZSgnLi9uYW1lMmhleCcpO1xudmFyIGhleDJoc3YgPSByZXF1aXJlKCcuL2hleDJoc3YnKTtcblxuLy8gIyMjIG5hbWUyaHN2IG1ldGhvZFxuLy9cbi8vIEdldCBhbiBIU1Ygb2JqZWN0IHZhbHVlIG9mIGFuIEhUTUwgbmFtZWQgY29sb3IuXG4vL1xuLy8gYG5hbWUyaHN2ICggJ2NvbG9yIG5hbWUnIClgXG5mdW5jdGlvbiBuYW1lMmhzdihuKSB7XG4gICAgdmFyIHYgPSBuYW1lMmhleChuKSxcbiAgICAgICAgdCA9IC9eW2EtZkEtRjAtOSNdezd9JC8sXG4gICAgICAgIGljbiA9ICdJbnZhbGlkIENvbG9yIE5hbWUnO1xuICAgIGlmICh0LnRlc3QodikpIHtcbiAgICAgICAgcmV0dXJuIGhleDJoc3Yodik7XG4gICAgfVxuXG4gICAgcmV0dXJuIFV0aWxzLnJlbmRlcihbaWNuLCBpY24sIGljbl0sICdoc3YnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuYW1lMmhzdjtcbiIsInZhciBVdGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBuYW1lMmhleCA9IHJlcXVpcmUoJy4vbmFtZTJoZXgnKTtcbnZhciBoZXgycmdiID0gcmVxdWlyZSgnLi9oZXgycmdiJyk7XG5cbi8vICMjIyBuYW1lMnJnYiBtZXRob2Rcbi8vXG4vLyBHZXQgYW4gUkdCIG9iamVjdCB2YWx1ZSBvZiBhbiBIVE1MIG5hbWVkIGNvbG9yLlxuLy9cbi8vIGBuYW1lMnJnYiAoICdjb2xvciBuYW1lJyApYFxuZnVuY3Rpb24gbmFtZTJyZ2Iobikge1xuICAgIHZhciB2ID0gbmFtZTJoZXgobiksXG4gICAgICAgIHQgPSAvXlthLWZBLUYwLTkjXXs3fSQvLFxuICAgICAgICBpY24gPSAnSW52YWxpZCBDb2xvciBOYW1lJztcblxuICAgIGlmICh0LnRlc3QodikpIHtcbiAgICAgICAgcmV0dXJuIGhleDJyZ2Iodik7XG4gICAgfVxuXG4gICAgcmV0dXJuIFV0aWxzLnJlbmRlcihbaWNuLCBpY24sIGljbl0sICdyZ2InKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuYW1lMnJnYjtcbiIsInZhciBVdGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuLy8gIyMjIHJhbmQgbWV0aG9kXG4vL1xuLy8gR2V0IGEgcmFuZG9tIGNvbG9yIGluIGVpdGhlciBoZXhhZGVjaW1hbCBvciBSR0IgY29sb3IgbW9kZXMuXG4vL1xuLy8gYHJhbmQgKCBbY29sb3IgbW9kZV0gKWBcbmZ1bmN0aW9uIHJhbmQobW9kZSkge1xuICAgIHZhciBSLCBHLCBCO1xuXG4gICAgaWYgKG1vZGUgPT09ICdoZXgnIHx8IG1vZGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YXIgY2hhcnMgPSAnMDEyMzQ1Njc4OWFiY2RlZicsXG4gICAgICAgICAgICBzdHJpbmdfbGVuZ3RoID0gNixcbiAgICAgICAgICAgIGhleFN0ciA9ICcnLFxuICAgICAgICAgICAgcm51bSwgaTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc3RyaW5nX2xlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBybnVtID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcnMubGVuZ3RoKTtcbiAgICAgICAgICAgIGhleFN0ciArPSBjaGFycy5zdWJzdHJpbmcocm51bSwgcm51bSArIDEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnIycgKyBoZXhTdHI7XG4gICAgfVxuXG4gICAgaWYgKG1vZGUgPT0gJ3JnYicpIHtcbiAgICAgICAgUiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgwIC0gMjU1ICsgMSkgKyAyNTUpO1xuICAgICAgICBHID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDAgLSAyNTUgKyAxKSArIDI1NSk7XG4gICAgICAgIEIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMCAtIDI1NSArIDEpICsgMjU1KTtcbiAgICAgICAgcmV0dXJuIFV0aWxzLnJlbmRlcihbUiwgRywgQl0sICdyZ2InKTtcbiAgICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSByYW5kO1xuIiwidmFyIFV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5mdW5jdGlvbiByZ2IyaGV4KHIsIGcsIGIpIHtcbiAgICByID0gVXRpbHMucGFkZGVkSGV4KHIpO1xuICAgIGcgPSAoZyAhPT0gdW5kZWZpbmVkKSA/IFV0aWxzLnBhZGRlZEhleChnKSA6IHI7XG4gICAgYiA9IChiICE9PSB1bmRlZmluZWQpID8gVXRpbHMucGFkZGVkSGV4KGIpIDogcjtcblxuICAgIHJldHVybiAnIycgKyByICsgZyArIGI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmdiMmhleDtcbiIsInZhciBVdGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuLy8gIyMjIHJnYjJoc2wgbWV0aG9kXG4vL1xuLy8gQ2hhbmdlIFJHQiB0byBhbiBIU0wgb2JqZWN0LlxuLy9cbi8vIGByZ2IyaHNsKFJHQlssIEcsIEJdKWBcbmZ1bmN0aW9uIHJnYjJoc2woUkdCLCBHLCBCKSB7XG4gICAgdmFyIHIsIGcsIGIsIG1pbiwgbWF4LCBoLCBzLCBsLCBkO1xuXG4gICAgaWYgKHR5cGVvZiBSR0IgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHIgPSBSR0JbMF07XG4gICAgICAgIGcgPSBSR0JbMV07XG4gICAgICAgIGIgPSBSR0JbMl07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgciA9IFJHQjtcbiAgICAgICAgZyA9IEc7XG4gICAgICAgIGIgPSBCO1xuICAgIH1cblxuICAgIHIgLz0gMjU1O1xuICAgIGcgLz0gMjU1O1xuICAgIGIgLz0gMjU1O1xuXG4gICAgbWF4ID0gTWF0aC5tYXgociwgZywgYik7XG4gICAgbWluID0gTWF0aC5taW4ociwgZywgYik7XG4gICAgbCA9IChtYXggKyBtaW4pIC8gMjtcblxuICAgIGlmIChtYXggPT0gbWluKSB7XG4gICAgICAgIGggPSBzID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBkID0gbWF4IC0gbWluO1xuICAgICAgICBzID0gbCA+IDAuNSA/IGQgLyAoMiAtIG1heCAtIG1pbikgOiBkIC8gKG1heCArIG1pbik7XG4gICAgICAgIHN3aXRjaCAobWF4KSB7XG4gICAgICAgICAgICBjYXNlIHI6XG4gICAgICAgICAgICAgICAgaCA9IChnIC0gYikgLyBkICsgKGcgPCBiID8gNiA6IDApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBnOlxuICAgICAgICAgICAgICAgIGggPSAoYiAtIHIpIC8gZCArIDI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGI6XG4gICAgICAgICAgICAgICAgaCA9IChyIC0gZykgLyBkICsgNDtcbiAgICAgICAgfVxuICAgICAgICBoIC89IDY7XG4gICAgfVxuXG4gICAgcmV0dXJuIFV0aWxzLnJlbmRlcihbTWF0aC5mbG9vcihoICogMzYwKSwgVXRpbHMucm91bmQoKHMgKiAxMDApLCAxKSwgVXRpbHMucm91bmQoKGwgKiAxMDApLCAxKV0sICdoc2wnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZ2IyaHNsO1xuIiwiLy8jIyBJbnRlcm5hbCBVdGlsaXRpZXNcbi8vICMjI1JlbmRlciBtZXRob2Rcbi8vXG4vLyBgcmVuZGVyKG1hcCwgdHlwZSlgXG4vL1xuLy8gYG1hcGAgaXMgYW4gb2JqZWN0IG9mIGRhdGEgdG8gcmVuZGVyLCBgdHlwZWAgY2FuIGJlIFJHQiwgSFNWIG9yIEhTTFxuLy9cbi8vIFRPRE86IFRoaXMgZnVuY3Rpb24gaXMgb3V0ZGF0ZWQgYW5kIGNvdWxkIGJlIHdyaXR0ZW4gYmV0dGVyXG5leHBvcnRzLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcihtYXAsIHR5cGUpIHtcbiAgICB2YXIgcnRuID0ge307XG4gICAgdmFyIGtleXM7XG5cbiAgICBpZiAodHlwZW9mIG1hcCAhPSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHR5cGUgPT09ICdyZ2InKSB7XG4gICAgICAgIGtleXMgPSBbJ1InLCAnRycsICdCJywgJ1JHQiddO1xuICAgIH1cblxuICAgIGlmICh0eXBlID09PSAnaHN2Jykge1xuICAgICAgICBrZXlzID0gWydIJywgJ1MnLCAnVicsICdIU1YnXTtcbiAgICB9XG5cbiAgICBpZiAodHlwZSA9PT0gJ2hzbCcpIHtcbiAgICAgICAga2V5cyA9IFsnSCcsICdTJywgJ0wnLCAnSFNMJ107XG4gICAgfVxuXG4gICAgcnRuW2tleXNbMF1dID0gbWFwWzBdO1xuICAgIHJ0bltrZXlzWzFdXSA9IG1hcFsxXTtcbiAgICBydG5ba2V5c1syXV0gPSBtYXBbMl07XG4gICAgcnRuW2tleXNbM11dID0gbWFwWzBdICsgJyAnICsgbWFwWzFdICsgJyAnICsgbWFwWzJdO1xuICAgIHJ0bi5hID0gbWFwO1xuXG4gICAgcmV0dXJuIHJ0bjtcbn07XG5cbi8vICMjIyBQYWRkZWQgSGV4IG1ldGhvZFxuLy9cbi8vIGBwYWRkZWRIZXgobnVtYmVyKWBcbi8vXG4vLyBDcmVhdGVzIGEgaGV4YWRlY2ltYWwgbnVtYmVyLCBhbmQgYWRkcyBhIHplcm8gdG8gdGhlIGJlZ2lubmluZyBpZiBpdHMgb25seSBvbmUgZGlnaXQuXG5leHBvcnRzLnBhZGRlZEhleCA9IGZ1bmN0aW9uIHBhZGRlZEhleChuKSB7XG4gICAgdmFyIGhleCA9IChuIDwgMTApID8gJzAnIDogJyc7XG5cbiAgICBoZXggKz0gbi50b1N0cmluZygxNik7XG5cbiAgICByZXR1cm4gKGhleC5sZW5ndGggPT09IDEpID8gJzAnICsgaGV4IDogaGV4O1xufTtcblxuZXhwb3J0cy5yb3VuZCA9IGZ1bmN0aW9uIHJvdW5kKG51bSwgcG9pbnRzKSB7XG4gICAgcG9pbnRzID0gcG9pbnRzIHx8IDEwO1xuICAgIHJldHVybiBwYXJzZUZsb2F0KG51bS50b0ZpeGVkKHBvaW50cykpO1xufTtcblxuZXhwb3J0cy5oZXhSZWdleE1hdGNoID0gZnVuY3Rpb24gaGV4UmVnZXhNYXRjaChjKSB7XG4gICAgcmV0dXJuIC9eXFx4MjNbYS1mMC05XXszfShbYS1mMC05XXszfSk/JC9pLnRlc3QoYyk7XG59O1xuIl19
