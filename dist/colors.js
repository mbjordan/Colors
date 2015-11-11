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

window.Colors = window.$c = Colors;

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

    return colorValue;
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

    return [
        Utils.round(result.h * 360),
        Utils.round(result.s * 100),
        Utils.round(result.v * 100)
    ];
}

module.exports = hex2hsv;

},{"./utils":14}],4:[function(require,module,exports){
function hex2rgb(h) {
    h = h.replace(/^\#/, '');

    if (h.length === 6) {
        return [
            parseInt(h.substr(0, 2), 16),
            parseInt(h.substr(2, 2), 16),
            parseInt(h.substr(4, 2), 16)
        ];
    }

    return parseInt(h, 16);
}

module.exports = hex2rgb;

},{}],5:[function(require,module,exports){
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

    return [
        Math.floor(H),
        Math.floor(S),
        Math.floor(V)
    ];
}

module.exports = hsv2hsl;

},{"./hsv2rgb":6}],6:[function(require,module,exports){
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

    return [
        Math.min(255, Math.floor(rgb[0] * 256)),
        Math.min(255, Math.floor(rgb[1] * 256)),
        Math.min(255, Math.floor(rgb[2] * 256))
    ];
}

module.exports = hsv2rgb;

},{}],7:[function(require,module,exports){
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
var nameArray = {
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
};

// ### name2hex method
//
// Get the hexadecimal value of an HTML color name. Must be one of the 176 HTML color names as defined by the HTML & CSS standards.
//
// `name2hex ( 'color name' )`
function name2hex(n) {
    n = n.toLowerCase();
    if (!nameArray[n]) return 'Invalid Color Name';
    return nameArray[n];
}

module.exports = name2hex;

},{}],9:[function(require,module,exports){
var name2hex = require('./name2hex');
var hex2hsv = require('./hex2hsv');

// ### name2hsv method
//
// Get an HSV object value of an HTML named color.
//
// `name2hsv ( 'color name' )`
function name2hsv(name) {
    return hex2hsv(name2hex(name));
}

module.exports = name2hsv;

},{"./hex2hsv":3,"./name2hex":8}],10:[function(require,module,exports){
var name2hex = require('./name2hex');
var hex2rgb = require('./hex2rgb');

// ### name2rgb method
//
// Get an RGB object value of an HTML named color.
//
// `name2rgb ( 'color name' )`
function name2rgb(name) {
    return hex2rgb(name2hex(name));
}

module.exports = name2rgb;

},{"./hex2rgb":4,"./name2hex":8}],11:[function(require,module,exports){
var hexChars = '0123456789abcdef';

function hexMode() {
    var returnString = '';
    var idx = 0;
    var randChar;

    while (idx < 6) {
        randChar = Math.floor(Math.random() * hexChars.length);
        returnString += hexChars.substring(randChar, randChar + 1);
        idx += 1;
    }

    return '#' + returnString;
}

// ### rand method
//
// Get a random color in either hexadecimal or RGB color modes.
//
// `rand ( [color mode] )`
function rand(mode) {
    if (!mode || mode === 'hex') return hexMode();

    return [
        Math.floor(Math.random() * (0 - 255 + 1) + 255),
        Math.floor(Math.random() * (0 - 255 + 1) + 255),
        Math.floor(Math.random() * (0 - 255 + 1) + 255)
    ];
}

module.exports = rand;

},{}],12:[function(require,module,exports){
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

    return [
        Math.floor(h * 360),
        Utils.round((s * 100), 1),
        Utils.round((l * 100), 1)
    ];
}

module.exports = rgb2hsl;

},{"./utils":14}],14:[function(require,module,exports){
//## Internal Utilities
// ###Render method
//
// `render(map, type)`
//
// `map` is an object of data to render, `type` can be RGB, HSV or HSL
exports.render = function render(map, type) {
    return map;
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInNyYy9jb21wbGVtZW50LmpzIiwic3JjL2hleDJoc3YuanMiLCJzcmMvaGV4MnJnYi5qcyIsInNyYy9oc3YyaHNsLmpzIiwic3JjL2hzdjJyZ2IuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvbmFtZTJoZXguanMiLCJzcmMvbmFtZTJoc3YuanMiLCJzcmMvbmFtZTJyZ2IuanMiLCJzcmMvcmFuZC5qcyIsInNyYy9yZ2IyaGV4LmpzIiwic3JjL3JnYjJoc2wuanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQ29sb3JzID0gcmVxdWlyZSgnLi9zcmMvaW5kZXgnKTtcblxuaWYgKCd1bmRlZmluZWQnID09PSB0eXBlb2Ygd2luZG93KSB7XG4gICAgaWYgKCd1bmRlZmluZWQnICE9PSB0eXBlb2YgbW9kdWxlICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gQ29sb3JzO1xuICAgICAgICByZXR1cm47XG4gICAgfVxufVxuXG5pZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGRlZmluZSAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gQ29sb3JzO1xuICAgIH0pO1xuICAgIHJldHVybjtcbn1cblxud2luZG93LkNvbG9ycyA9IHdpbmRvdy4kYyA9IENvbG9ycztcbiIsInZhciBVdGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBoZXgycmdiID0gcmVxdWlyZSgnLi9oZXgycmdiJyk7XG5cbmZ1bmN0aW9uIHN0cmluZ0hhbmRsZXIoYykge1xuICAgIHZhciByZXR1cm5TdHJpbmcgPSAnIyc7XG5cbiAgICBjID0gYy5yZXBsYWNlKC9eXFx4MjMvLCAnJyk7XG5cbiAgICBpZiAoYy5sZW5ndGggPT09IDYpIHtcbiAgICAgICAgcmV0dXJuU3RyaW5nICs9IFV0aWxzLnBhZGRlZEhleCgyNTUgLSBoZXgycmdiKGMuc3Vic3RyKDAsIDIpKSk7XG4gICAgICAgIHJldHVyblN0cmluZyArPSBVdGlscy5wYWRkZWRIZXgoMjU1IC0gaGV4MnJnYihjLnN1YnN0cigyLCAyKSkpO1xuICAgICAgICByZXR1cm5TdHJpbmcgKz0gVXRpbHMucGFkZGVkSGV4KDI1NSAtIGhleDJyZ2IoYy5zdWJzdHIoNCwgMikpKTtcbiAgICB9XG4gICAgaWYgKGMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgIHJldHVyblN0cmluZyArPSBVdGlscy5wYWRkZWRIZXgoMjU1IC0gaGV4MnJnYihjLnN1YnN0cigwLCAxKSArIGMuc3Vic3RyKDAsIDEpKSk7XG4gICAgICAgIHJldHVyblN0cmluZyArPSBVdGlscy5wYWRkZWRIZXgoMjU1IC0gaGV4MnJnYihjLnN1YnN0cigxLCAxKSArIGMuc3Vic3RyKDEsIDEpKSk7XG4gICAgICAgIHJldHVyblN0cmluZyArPSBVdGlscy5wYWRkZWRIZXgoMjU1IC0gaGV4MnJnYihjLnN1YnN0cigyLCAxKSArIGMuc3Vic3RyKDIsIDEpKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldHVyblN0cmluZztcbn1cblxuZnVuY3Rpb24gY29tcGxlbWVudChjLCBnLCBiKSB7XG4gICAgdmFyIGNvbG9yVmFsdWU7XG5cbiAgICBpZiAodHlwZW9mIGMgPT09ICdzdHJpbmcnICYmIFV0aWxzLmhleFJlZ2V4TWF0Y2goYykpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZ0hhbmRsZXIoYyk7XG4gICAgfVxuXG4gICAgaWYgKCd1bmRlZmluZWQnICE9PSBjICYmICd1bmRlZmluZWQnICE9PSBnICYmICd1bmRlZmluZWQnICE9PSBiKSB7XG4gICAgICAgIGNvbG9yVmFsdWUgPSBbKDI1NSAtIGMpLCAoMjU1IC0gZyksICgyNTUgLSBiKV07XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjID09ICdvYmplY3QnKSB7XG4gICAgICAgIGNvbG9yVmFsdWUgPSBbKDI1NSAtIGNbMF0pLCAoMjU1IC0gY1sxXSksICgyNTUgLSBjWzJdKV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbG9yVmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29tcGxlbWVudDtcbiIsInZhciBVdGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuZnVuY3Rpb24gaGV4MmhzdihoKSB7XG4gICAgaCA9IChoLmNoYXJBdCgwKSA9PSAnIycpID8gaC5zdWJzdHJpbmcoMSwgNykgOiBoO1xuICAgIHZhciByID0gcGFyc2VJbnQoaC5zdWJzdHJpbmcoMCwgMiksIDE2KSAvIDI1NTtcbiAgICB2YXIgZyA9IHBhcnNlSW50KGguc3Vic3RyaW5nKDIsIDQpLCAxNikgLyAyNTU7XG4gICAgdmFyIGIgPSBwYXJzZUludChoLnN1YnN0cmluZyg0LCA2KSwgMTYpIC8gMjU1O1xuICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgICdoJzogMCxcbiAgICAgICAgJ3MnOiAwLFxuICAgICAgICAndic6IDBcbiAgICB9O1xuICAgIHZhciBtaW5WYWwgPSBNYXRoLm1pbihyLCBnLCBiKTtcbiAgICB2YXIgbWF4VmFsID0gTWF0aC5tYXgociwgZywgYik7XG4gICAgdmFyIGRlbHRhID0gKG1heFZhbCAtIG1pblZhbCk7XG4gICAgdmFyIGRlbF9SO1xuICAgIHZhciBkZWxfRztcbiAgICB2YXIgZGVsX0I7XG4gICAgdmFyIG1hcDtcblxuICAgIHJlc3VsdC52ID0gbWF4VmFsO1xuICAgIGlmIChkZWx0YSA9PT0gMCkge1xuICAgICAgICByZXN1bHQuaCA9IDA7XG4gICAgICAgIHJlc3VsdC5zID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQucyA9IGRlbHRhIC8gbWF4VmFsO1xuICAgICAgICBkZWxfUiA9ICgoKG1heFZhbCAtIHIpIC8gNikgKyAoZGVsdGEgLyAyKSkgLyBkZWx0YTtcbiAgICAgICAgZGVsX0cgPSAoKChtYXhWYWwgLSBnKSAvIDYpICsgKGRlbHRhIC8gMikpIC8gZGVsdGE7XG4gICAgICAgIGRlbF9CID0gKCgobWF4VmFsIC0gYikgLyA2KSArIChkZWx0YSAvIDIpKSAvIGRlbHRhO1xuICAgICAgICBpZiAociA9PSBtYXhWYWwpIHtcbiAgICAgICAgICAgIHJlc3VsdC5oID0gZGVsX0IgLSBkZWxfRztcbiAgICAgICAgfSBlbHNlIGlmIChnID09IG1heFZhbCkge1xuICAgICAgICAgICAgcmVzdWx0LmggPSAoMSAvIDMpICsgZGVsX1IgLSBkZWxfQjtcbiAgICAgICAgfSBlbHNlIGlmIChiID09IG1heFZhbCkge1xuICAgICAgICAgICAgcmVzdWx0LmggPSAoMiAvIDMpICsgZGVsX0cgLSBkZWxfUjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0LmggPCAwKSB7XG4gICAgICAgICAgICByZXN1bHQuaCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQuaCA+IDEpIHtcbiAgICAgICAgICAgIHJlc3VsdC5oIC09IDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gW1xuICAgICAgICBVdGlscy5yb3VuZChyZXN1bHQuaCAqIDM2MCksXG4gICAgICAgIFV0aWxzLnJvdW5kKHJlc3VsdC5zICogMTAwKSxcbiAgICAgICAgVXRpbHMucm91bmQocmVzdWx0LnYgKiAxMDApXG4gICAgXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoZXgyaHN2O1xuIiwiZnVuY3Rpb24gaGV4MnJnYihoKSB7XG4gICAgaCA9IGgucmVwbGFjZSgvXlxcIy8sICcnKTtcblxuICAgIGlmIChoLmxlbmd0aCA9PT0gNikge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgcGFyc2VJbnQoaC5zdWJzdHIoMCwgMiksIDE2KSxcbiAgICAgICAgICAgIHBhcnNlSW50KGguc3Vic3RyKDIsIDIpLCAxNiksXG4gICAgICAgICAgICBwYXJzZUludChoLnN1YnN0cig0LCAyKSwgMTYpXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnNlSW50KGgsIDE2KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoZXgycmdiO1xuIiwidmFyIGhzdjJyZ2IgPSByZXF1aXJlKCcuL2hzdjJyZ2InKTtcblxuLy8gIyMjIGhzdjJoc2wgbWV0aG9kXG4vL1xuLy8gQ2hhbmdlIEhTViB0byBhbiBIU0wgb2JqZWN0XG4vL1xuLy8gYGhzdjJoc2woSFNWWywgUywgVl0pYFxuZnVuY3Rpb24gaHN2MmhzbChILCBTLCBWKSB7XG4gICAgdmFyIGgsIHMsIGwsIF9ILCBfUywgX0wsIGhzdiwgcjEsIGcxLCBiMSwgbWF4Q29sb3IsIG1pbkNvbG9yO1xuXG4gICAgaWYgKHR5cGVvZiBIID09ICdvYmplY3QnKSB7XG4gICAgICAgIGggPSBIWzBdO1xuICAgICAgICBzID0gSFsxXTtcbiAgICAgICAgbCA9IEhbMl07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaCA9IEg7XG4gICAgICAgIHMgPSBTO1xuICAgICAgICBsID0gVjtcbiAgICB9XG5cbiAgICBoc3YgPSBoc3YycmdiKGgsIHMsIGwpO1xuICAgIHIxID0gaHN2LlIgLyAyNTU7XG4gICAgZzEgPSBoc3YuRyAvIDI1NTtcbiAgICBiMSA9IGhzdi5CIC8gMjU1O1xuICAgIG1heENvbG9yID0gTWF0aC5tYXgocjEsIGcxLCBiMSk7XG4gICAgbWluQ29sb3IgPSBNYXRoLm1pbihyMSwgZzEsIGIxKTtcbiAgICBfTCA9IChtYXhDb2xvciArIG1pbkNvbG9yKSAvIDI7XG4gICAgX1MgPSAwO1xuICAgIF9IID0gMDtcbiAgICBpZiAobWF4Q29sb3IgIT0gbWluQ29sb3IpIHtcbiAgICAgICAgaWYgKF9MIDwgMC41KSB7XG4gICAgICAgICAgICBTID0gKG1heENvbG9yIC0gbWluQ29sb3IpIC8gKG1heENvbG9yICsgbWluQ29sb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgUyA9IChtYXhDb2xvciAtIG1pbkNvbG9yKSAvICgyLjAgLSBtYXhDb2xvciAtIG1pbkNvbG9yKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocjEgPT0gbWF4Q29sb3IpIHtcbiAgICAgICAgICAgIEggPSAoZzEgLSBiMSkgLyAobWF4Q29sb3IgLSBtaW5Db2xvcik7XG4gICAgICAgIH0gZWxzZSBpZiAoZzEgPT0gbWF4Q29sb3IpIHtcbiAgICAgICAgICAgIEggPSAyLjAgKyAoYjEgLSByMSkgLyAobWF4Q29sb3IgLSBtaW5Db2xvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBIID0gNC4wICsgKHIxIC0gZzEpIC8gKG1heENvbG9yIC0gbWluQ29sb3IpO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9MID0gX0wgKiAxMDA7XG4gICAgX1MgPSBfUyAqIDEwMDtcbiAgICBfSCA9IF9IICogNjA7XG4gICAgaWYgKF9IIDwgMCkge1xuICAgICAgICBfSCArPSAzNjA7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtcbiAgICAgICAgTWF0aC5mbG9vcihIKSxcbiAgICAgICAgTWF0aC5mbG9vcihTKSxcbiAgICAgICAgTWF0aC5mbG9vcihWKVxuICAgIF07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaHN2MmhzbDtcbiIsIi8vICMjIyBoc3YycmdiIG1ldGhvZFxuLy9cbi8vIENoYW5nZSBhbiBIU1YgY29sb3Igb2JqZWN0IG9yIEludCBzdHJpbmcgdG8gYW4gUkdCIGNvbG9yIG9iamVjdC5cbi8vXG4vLyBgaHN2MnJnYiAoW29iaiBILCBTLCBWXSBvciBbSW50IEgsIFMsIFZdKS5bb2JqIFIsIEcsIEIsIFJHQiBvciBhXWBcbmZ1bmN0aW9uIGhzdjJyZ2IoSFNWLCBTLCBWKSB7XG4gICAgdmFyIHJnYiA9IFtdLFxuICAgICAgICBoLCBzLCB2LCBoaSwgZiwgcCwgcSwgdDtcblxuICAgIGlmICh0eXBlb2YgSFNWID09ICdvYmplY3QnKSB7XG4gICAgICAgIGggPSBIU1ZbMF07XG4gICAgICAgIHMgPSBIU1ZbMV07XG4gICAgICAgIHYgPSBIU1ZbMl07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaCA9IEhTVjtcbiAgICAgICAgcyA9IFM7XG4gICAgICAgIHYgPSBWO1xuICAgIH1cbiAgICBzID0gcyAvIDEwMDtcbiAgICB2ID0gdiAvIDEwMDtcbiAgICBoaSA9IE1hdGguZmxvb3IoKGggLyA2MCkgJSA2KTtcbiAgICBmID0gKGggLyA2MCkgLSBoaTtcbiAgICBwID0gdiAqICgxIC0gcyk7XG4gICAgcSA9IHYgKiAoMSAtIGYgKiBzKTtcbiAgICB0ID0gdiAqICgxIC0gKDEgLSBmKSAqIHMpO1xuICAgIHN3aXRjaCAoaGkpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgcmdiID0gW3YsIHQsIHBdO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHJnYiA9IFtxLCB2LCBwXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICByZ2IgPSBbcCwgdiwgdF07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgcmdiID0gW3AsIHEsIHZdO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHJnYiA9IFt0LCBwLCB2XTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICByZ2IgPSBbdiwgcCwgcV07XG4gICAgfVxuXG4gICAgcmV0dXJuIFtcbiAgICAgICAgTWF0aC5taW4oMjU1LCBNYXRoLmZsb29yKHJnYlswXSAqIDI1NikpLFxuICAgICAgICBNYXRoLm1pbigyNTUsIE1hdGguZmxvb3IocmdiWzFdICogMjU2KSksXG4gICAgICAgIE1hdGgubWluKDI1NSwgTWF0aC5mbG9vcihyZ2JbMl0gKiAyNTYpKVxuICAgIF07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaHN2MnJnYjtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICdjb21wbGVtZW50JzogcmVxdWlyZSgnLi9jb21wbGVtZW50JyksXG4gICAgJ2hleDJoc3YnOiByZXF1aXJlKCcuL2hleDJoc3YnKSxcbiAgICAnaGV4MnJnYic6IHJlcXVpcmUoJy4vaGV4MnJnYicpLFxuICAgICdoc3YyaHNsJzogcmVxdWlyZSgnLi9oc3YyaHNsJyksXG4gICAgJ2hzdjJyZ2InOiByZXF1aXJlKCcuL2hzdjJyZ2InKSxcbiAgICAnbmFtZTJoZXgnOiByZXF1aXJlKCcuL25hbWUyaGV4JyksXG4gICAgJ25hbWUyaHN2JzogcmVxdWlyZSgnLi9uYW1lMmhzdicpLFxuICAgICduYW1lMnJnYic6IHJlcXVpcmUoJy4vbmFtZTJyZ2InKSxcbiAgICAncmFuZCc6IHJlcXVpcmUoJy4vcmFuZCcpLFxuICAgICdyZ2IyaGV4JzogcmVxdWlyZSgnLi9yZ2IyaGV4JyksXG4gICAgJ3JnYjJoc2wnOiByZXF1aXJlKCcuL3JnYjJoc2wnKSxcbiAgICAndXRpbHMnOiByZXF1aXJlKCcuL3V0aWxzJylcbn07XG4iLCJ2YXIgbmFtZUFycmF5ID0ge1xuICAgICdhbGljZWJsdWUnOiAnI2YwZjhmZicsXG4gICAgJ2FudGlxdWV3aGl0ZSc6ICcjZmFlYmQ3JyxcbiAgICAnYXF1YSc6ICcjMDBmZmZmJyxcbiAgICAnYXF1YW1hcmluZSc6ICcjN2ZmZmQ0JyxcbiAgICAnYXp1cmUnOiAnI2YwZmZmZicsXG4gICAgJ2JlaWdlJzogJyNmNWY1ZGMnLFxuICAgICdiaXNxdWUnOiAnI2ZmZTRjNCcsXG4gICAgJ2JsYWNrJzogJyMwMDAwMDAnLFxuICAgICdibGFuY2hlZGFsbW9uZCc6ICcjZmZlYmNkJyxcbiAgICAnYmx1ZSc6ICcjMDAwMGZmJyxcbiAgICAnYmx1ZXZpb2xldCc6ICcjOGEyYmUyJyxcbiAgICAnYnJvd24nOiAnI2E1MmEyYScsXG4gICAgJ2J1cmx5d29vZCc6ICcjZGViODg3JyxcbiAgICAnY2FkZXRibHVlJzogJyM1ZjllYTAnLFxuICAgICdjaGFydHJldXNlJzogJyM3ZmZmMDAnLFxuICAgICdjaG9jb2xhdGUnOiAnI2QyNjkxZScsXG4gICAgJ2NvcmFsJzogJyNmZjdmNTAnLFxuICAgICdjb3JuZmxvd2VyYmx1ZSc6ICcjNjQ5NWVkJyxcbiAgICAnY29ybnNpbGsnOiAnI2ZmZjhkYycsXG4gICAgJ2NyaW1zb24nOiAnI2RjMTQzYycsXG4gICAgJ2N5YW4nOiAnIzAwZmZmZicsXG4gICAgJ2RhcmtibHVlJzogJyMwMDAwOGInLFxuICAgICdkYXJrY3lhbic6ICcjMDA4YjhiJyxcbiAgICAnZGFya2dvbGRlbnJvZCc6ICcjYjg4NjBiJyxcbiAgICAnZGFya2dyYXknOiAnI2E5YTlhOScsXG4gICAgJ2RhcmtncmV5JzogJyNhOWE5YTknLFxuICAgICdkYXJrZ3JlZW4nOiAnIzAwNjQwMCcsXG4gICAgJ2RhcmtraGFraSc6ICcjYmRiNzZiJyxcbiAgICAnZGFya21hZ2VudGEnOiAnIzhiMDA4YicsXG4gICAgJ2RhcmtvbGl2ZWdyZWVuJzogJyM1NTZiMmYnLFxuICAgICdkYXJrb3JhbmdlJzogJyNmZjhjMDAnLFxuICAgICdkYXJrb3JjaGlkJzogJyM5OTMyY2MnLFxuICAgICdkYXJrcmVkJzogJyM4YjAwMDAnLFxuICAgICdkYXJrc2FsbW9uJzogJyNlOTk2N2EnLFxuICAgICdkYXJrc2VhZ3JlZW4nOiAnIzhmYmM4ZicsXG4gICAgJ2RhcmtzbGF0ZWJsdWUnOiAnIzQ4M2Q4YicsXG4gICAgJ2RhcmtzbGF0ZWdyYXknOiAnIzJmNGY0ZicsXG4gICAgJ2RhcmtzbGF0ZWdyZXknOiAnIzJmNGY0ZicsXG4gICAgJ2Rhcmt0dXJxdW9pc2UnOiAnIzAwY2VkMScsXG4gICAgJ2Rhcmt2aW9sZXQnOiAnIzk0MDBkMycsXG4gICAgJ2RlZXBwaW5rJzogJyNmZjE0OTMnLFxuICAgICdkZWVwc2t5Ymx1ZSc6ICcjMDBiZmZmJyxcbiAgICAnZGltZ3JheSc6ICcjNjk2OTY5JyxcbiAgICAnZGltZ3JleSc6ICcjNjk2OTY5JyxcbiAgICAnZG9kZ2VyYmx1ZSc6ICcjMWU5MGZmJyxcbiAgICAnZmlyZWJyaWNrJzogJyNiMjIyMjInLFxuICAgICdmbG9yYWx3aGl0ZSc6ICcjZmZmYWYwJyxcbiAgICAnZm9yZXN0Z3JlZW4nOiAnIzIyOGIyMicsXG4gICAgJ2Z1Y2hzaWEnOiAnI2ZmMDBmZicsXG4gICAgJ2dhaW5zYm9ybyc6ICcjZGNkY2RjJyxcbiAgICAnZ2hvc3R3aGl0ZSc6ICcjZjhmOGZmJyxcbiAgICAnZ29sZCc6ICcjZmZkNzAwJyxcbiAgICAnZ29sZGVucm9kJzogJyNkYWE1MjAnLFxuICAgICdncmF5JzogJyM4MDgwODAnLFxuICAgICdncmV5JzogJyM4MDgwODAnLFxuICAgICdncmVlbic6ICcjMDA4MDAwJyxcbiAgICAnZ3JlZW55ZWxsb3cnOiAnI2FkZmYyZicsXG4gICAgJ2hvbmV5ZGV3JzogJyNmMGZmZjAnLFxuICAgICdob3RwaW5rJzogJyNmZjY5YjQnLFxuICAgICdpbmRpYW5yZWQnOiAnI2NkNWM1YycsXG4gICAgJ2luZGlnbyc6ICcjNGIwMDgyJyxcbiAgICAnaXZvcnknOiAnI2ZmZmZmMCcsXG4gICAgJ2toYWtpJzogJyNmMGU2OGMnLFxuICAgICdsYXZlbmRlcic6ICcjZTZlNmZhJyxcbiAgICAnbGF2ZW5kZXJibHVzaCc6ICcjZmZmMGY1JyxcbiAgICAnbGF3bmdyZWVuJzogJyM3Y2ZjMDAnLFxuICAgICdsZW1vbmNoaWZmb24nOiAnI2ZmZmFjZCcsXG4gICAgJ2xpZ2h0Ymx1ZSc6ICcjYWRkOGU2JyxcbiAgICAnbGlnaHRjb3JhbCc6ICcjZjA4MDgwJyxcbiAgICAnbGlnaHRjeWFuJzogJyNlMGZmZmYnLFxuICAgICdsaWdodGdvbGRlbnJvZHllbGxvdyc6ICcjZmFmYWQyJyxcbiAgICAnbGlnaHRncmF5JzogJyNkM2QzZDMnLFxuICAgICdsaWdodGdyZXknOiAnI2QzZDNkMycsXG4gICAgJ2xpZ2h0Z3JlZW4nOiAnIzkwZWU5MCcsXG4gICAgJ2xpZ2h0cGluayc6ICcjZmZiNmMxJyxcbiAgICAnbGlnaHRzYWxtb24nOiAnI2ZmYTA3YScsXG4gICAgJ2xpZ2h0c2VhZ3JlZW4nOiAnIzIwYjJhYScsXG4gICAgJ2xpZ2h0c2t5Ymx1ZSc6ICcjODdjZWZhJyxcbiAgICAnbGlnaHRzbGF0ZWdyYXknOiAnIzc3ODg5OScsXG4gICAgJ2xpZ2h0c2xhdGVncmV5JzogJyM3Nzg4OTknLFxuICAgICdsaWdodHN0ZWVsYmx1ZSc6ICcjYjBjNGRlJyxcbiAgICAnbGlnaHR5ZWxsb3cnOiAnI2ZmZmZlMCcsXG4gICAgJ2xpbWUnOiAnIzAwZmYwMCcsXG4gICAgJ2xpbWVncmVlbic6ICcjMzJjZDMyJyxcbiAgICAnbGluZW4nOiAnI2ZhZjBlNicsXG4gICAgJ21hZ2VudGEnOiAnI2ZmMDBmZicsXG4gICAgJ21hcm9vbic6ICcjODAwMDAwJyxcbiAgICAnbWVkaXVtYXF1YW1hcmluZSc6ICcjNjZjZGFhJyxcbiAgICAnbWVkaXVtYmx1ZSc6ICcjMDAwMGNkJyxcbiAgICAnbWVkaXVtb3JjaGlkJzogJyNiYTU1ZDMnLFxuICAgICdtZWRpdW1wdXJwbGUnOiAnIzkzNzBkOCcsXG4gICAgJ21lZGl1bXNlYWdyZWVuJzogJyMzY2IzNzEnLFxuICAgICdtZWRpdW1zbGF0ZWJsdWUnOiAnIzdiNjhlZScsXG4gICAgJ21lZGl1bXNwcmluZ2dyZWVuJzogJyMwMGZhOWEnLFxuICAgICdtZWRpdW10dXJxdW9pc2UnOiAnIzQ4ZDFjYycsXG4gICAgJ21lZGl1bXZpb2xldHJlZCc6ICcjYzcxNTg1JyxcbiAgICAnbWlkbmlnaHRibHVlJzogJyMxOTE5NzAnLFxuICAgICdtaW50Y3JlYW0nOiAnI2Y1ZmZmYScsXG4gICAgJ21pc3R5cm9zZSc6ICcjZmZlNGUxJyxcbiAgICAnbW9jY2FzaW4nOiAnI2ZmZTRiNScsXG4gICAgJ25hdmFqb3doaXRlJzogJyNmZmRlYWQnLFxuICAgICduYXZ5JzogJyMwMDAwODAnLFxuICAgICdvbGRsYWNlJzogJyNmZGY1ZTYnLFxuICAgICdvbGl2ZSc6ICcjODA4MDAwJyxcbiAgICAnb2xpdmVkcmFiJzogJyM2YjhlMjMnLFxuICAgICdvcmFuZ2UnOiAnI2ZmYTUwMCcsXG4gICAgJ29yYW5nZXJlZCc6ICcjZmY0NTAwJyxcbiAgICAnb3JjaGlkJzogJyNkYTcwZDYnLFxuICAgICdwYWxlZ29sZGVucm9kJzogJyNlZWU4YWEnLFxuICAgICdwYWxlZ3JlZW4nOiAnIzk4ZmI5OCcsXG4gICAgJ3BhbGV0dXJxdW9pc2UnOiAnI2FmZWVlZScsXG4gICAgJ3BhbGV2aW9sZXRyZWQnOiAnI2Q4NzA5MycsXG4gICAgJ3BhcGF5YXdoaXAnOiAnI2ZmZWZkNScsXG4gICAgJ3BlYWNocHVmZic6ICcjZmZkYWI5JyxcbiAgICAncGVydSc6ICcjY2Q4NTNmJyxcbiAgICAncGluayc6ICcjZmZjMGNiJyxcbiAgICAncGx1bSc6ICcjZGRhMGRkJyxcbiAgICAncG93ZGVyYmx1ZSc6ICcjYjBlMGU2JyxcbiAgICAncHVycGxlJzogJyM4MDAwODAnLFxuICAgICdyZWQnOiAnI2ZmMDAwMCcsXG4gICAgJ3Jvc3licm93bic6ICcjYmM4ZjhmJyxcbiAgICAncm95YWxibHVlJzogJyM0MTY5ZTEnLFxuICAgICdzYWRkbGVicm93bic6ICcjOGI0NTEzJyxcbiAgICAnc2FsbW9uJzogJyNmYTgwNzInLFxuICAgICdzYW5keWJyb3duJzogJyNmNGE0NjAnLFxuICAgICdzZWFncmVlbic6ICcjMmU4YjU3JyxcbiAgICAnc2Vhc2hlbGwnOiAnI2ZmZjVlZScsXG4gICAgJ3NpZW5uYSc6ICcjYTA1MjJkJyxcbiAgICAnc2lsdmVyJzogJyNjMGMwYzAnLFxuICAgICdza3libHVlJzogJyM4N2NlZWInLFxuICAgICdzbGF0ZWJsdWUnOiAnIzZhNWFjZCcsXG4gICAgJ3NsYXRlZ3JheSc6ICcjNzA4MDkwJyxcbiAgICAnc2xhdGVncmV5JzogJyM3MDgwOTAnLFxuICAgICdzbm93JzogJyNmZmZhZmEnLFxuICAgICdzcHJpbmdncmVlbic6ICcjMDBmZjdmJyxcbiAgICAnc3RlZWxibHVlJzogJyM0NjgyYjQnLFxuICAgICd0YW4nOiAnI2QyYjQ4YycsXG4gICAgJ3RlYWwnOiAnIzAwODA4MCcsXG4gICAgJ3RoaXN0bGUnOiAnI2Q4YmZkOCcsXG4gICAgJ3RvbWF0byc6ICcjZmY2MzQ3JyxcbiAgICAndHVycXVvaXNlJzogJyM0MGUwZDAnLFxuICAgICd2aW9sZXQnOiAnI2VlODJlZScsXG4gICAgJ3doZWF0JzogJyNmNWRlYjMnLFxuICAgICd3aGl0ZSc6ICcjZmZmZmZmJyxcbiAgICAnd2hpdGVzbW9rZSc6ICcjZjVmNWY1JyxcbiAgICAneWVsbG93JzogJyNmZmZmMDAnLFxuICAgICd5ZWxsb3dncmVlbic6ICcjOWFjZDMyJ1xufTtcblxuLy8gIyMjIG5hbWUyaGV4IG1ldGhvZFxuLy9cbi8vIEdldCB0aGUgaGV4YWRlY2ltYWwgdmFsdWUgb2YgYW4gSFRNTCBjb2xvciBuYW1lLiBNdXN0IGJlIG9uZSBvZiB0aGUgMTc2IEhUTUwgY29sb3IgbmFtZXMgYXMgZGVmaW5lZCBieSB0aGUgSFRNTCAmIENTUyBzdGFuZGFyZHMuXG4vL1xuLy8gYG5hbWUyaGV4ICggJ2NvbG9yIG5hbWUnIClgXG5mdW5jdGlvbiBuYW1lMmhleChuKSB7XG4gICAgbiA9IG4udG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoIW5hbWVBcnJheVtuXSkgcmV0dXJuICdJbnZhbGlkIENvbG9yIE5hbWUnO1xuICAgIHJldHVybiBuYW1lQXJyYXlbbl07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmFtZTJoZXg7XG4iLCJ2YXIgbmFtZTJoZXggPSByZXF1aXJlKCcuL25hbWUyaGV4Jyk7XG52YXIgaGV4MmhzdiA9IHJlcXVpcmUoJy4vaGV4MmhzdicpO1xuXG4vLyAjIyMgbmFtZTJoc3YgbWV0aG9kXG4vL1xuLy8gR2V0IGFuIEhTViBvYmplY3QgdmFsdWUgb2YgYW4gSFRNTCBuYW1lZCBjb2xvci5cbi8vXG4vLyBgbmFtZTJoc3YgKCAnY29sb3IgbmFtZScgKWBcbmZ1bmN0aW9uIG5hbWUyaHN2KG5hbWUpIHtcbiAgICByZXR1cm4gaGV4MmhzdihuYW1lMmhleChuYW1lKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmFtZTJoc3Y7XG4iLCJ2YXIgbmFtZTJoZXggPSByZXF1aXJlKCcuL25hbWUyaGV4Jyk7XG52YXIgaGV4MnJnYiA9IHJlcXVpcmUoJy4vaGV4MnJnYicpO1xuXG4vLyAjIyMgbmFtZTJyZ2IgbWV0aG9kXG4vL1xuLy8gR2V0IGFuIFJHQiBvYmplY3QgdmFsdWUgb2YgYW4gSFRNTCBuYW1lZCBjb2xvci5cbi8vXG4vLyBgbmFtZTJyZ2IgKCAnY29sb3IgbmFtZScgKWBcbmZ1bmN0aW9uIG5hbWUycmdiKG5hbWUpIHtcbiAgICByZXR1cm4gaGV4MnJnYihuYW1lMmhleChuYW1lKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmFtZTJyZ2I7XG4iLCJ2YXIgaGV4Q2hhcnMgPSAnMDEyMzQ1Njc4OWFiY2RlZic7XG5cbmZ1bmN0aW9uIGhleE1vZGUoKSB7XG4gICAgdmFyIHJldHVyblN0cmluZyA9ICcnO1xuICAgIHZhciBpZHggPSAwO1xuICAgIHZhciByYW5kQ2hhcjtcblxuICAgIHdoaWxlIChpZHggPCA2KSB7XG4gICAgICAgIHJhbmRDaGFyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogaGV4Q2hhcnMubGVuZ3RoKTtcbiAgICAgICAgcmV0dXJuU3RyaW5nICs9IGhleENoYXJzLnN1YnN0cmluZyhyYW5kQ2hhciwgcmFuZENoYXIgKyAxKTtcbiAgICAgICAgaWR4ICs9IDE7XG4gICAgfVxuXG4gICAgcmV0dXJuICcjJyArIHJldHVyblN0cmluZztcbn1cblxuLy8gIyMjIHJhbmQgbWV0aG9kXG4vL1xuLy8gR2V0IGEgcmFuZG9tIGNvbG9yIGluIGVpdGhlciBoZXhhZGVjaW1hbCBvciBSR0IgY29sb3IgbW9kZXMuXG4vL1xuLy8gYHJhbmQgKCBbY29sb3IgbW9kZV0gKWBcbmZ1bmN0aW9uIHJhbmQobW9kZSkge1xuICAgIGlmICghbW9kZSB8fCBtb2RlID09PSAnaGV4JykgcmV0dXJuIGhleE1vZGUoKTtcblxuICAgIHJldHVybiBbXG4gICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgwIC0gMjU1ICsgMSkgKyAyNTUpLFxuICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMCAtIDI1NSArIDEpICsgMjU1KSxcbiAgICAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDAgLSAyNTUgKyAxKSArIDI1NSlcbiAgICBdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJhbmQ7XG4iLCJ2YXIgVXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIHJnYjJoZXgociwgZywgYikge1xuICAgIHIgPSBVdGlscy5wYWRkZWRIZXgocik7XG4gICAgZyA9IChnICE9PSB1bmRlZmluZWQpID8gVXRpbHMucGFkZGVkSGV4KGcpIDogcjtcbiAgICBiID0gKGIgIT09IHVuZGVmaW5lZCkgPyBVdGlscy5wYWRkZWRIZXgoYikgOiByO1xuXG4gICAgcmV0dXJuICcjJyArIHIgKyBnICsgYjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZ2IyaGV4O1xuIiwidmFyIFV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG4vLyAjIyMgcmdiMmhzbCBtZXRob2Rcbi8vXG4vLyBDaGFuZ2UgUkdCIHRvIGFuIEhTTCBvYmplY3QuXG4vL1xuLy8gYHJnYjJoc2woUkdCWywgRywgQl0pYFxuZnVuY3Rpb24gcmdiMmhzbChSR0IsIEcsIEIpIHtcbiAgICB2YXIgciwgZywgYiwgbWluLCBtYXgsIGgsIHMsIGwsIGQ7XG5cbiAgICBpZiAodHlwZW9mIFJHQiA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgciA9IFJHQlswXTtcbiAgICAgICAgZyA9IFJHQlsxXTtcbiAgICAgICAgYiA9IFJHQlsyXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByID0gUkdCO1xuICAgICAgICBnID0gRztcbiAgICAgICAgYiA9IEI7XG4gICAgfVxuXG4gICAgciAvPSAyNTU7XG4gICAgZyAvPSAyNTU7XG4gICAgYiAvPSAyNTU7XG5cbiAgICBtYXggPSBNYXRoLm1heChyLCBnLCBiKTtcbiAgICBtaW4gPSBNYXRoLm1pbihyLCBnLCBiKTtcbiAgICBsID0gKG1heCArIG1pbikgLyAyO1xuXG4gICAgaWYgKG1heCA9PSBtaW4pIHtcbiAgICAgICAgaCA9IHMgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGQgPSBtYXggLSBtaW47XG4gICAgICAgIHMgPSBsID4gMC41ID8gZCAvICgyIC0gbWF4IC0gbWluKSA6IGQgLyAobWF4ICsgbWluKTtcbiAgICAgICAgc3dpdGNoIChtYXgpIHtcbiAgICAgICAgICAgIGNhc2UgcjpcbiAgICAgICAgICAgICAgICBoID0gKGcgLSBiKSAvIGQgKyAoZyA8IGIgPyA2IDogMCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGc6XG4gICAgICAgICAgICAgICAgaCA9IChiIC0gcikgLyBkICsgMjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgYjpcbiAgICAgICAgICAgICAgICBoID0gKHIgLSBnKSAvIGQgKyA0O1xuICAgICAgICB9XG4gICAgICAgIGggLz0gNjtcbiAgICB9XG5cbiAgICByZXR1cm4gW1xuICAgICAgICBNYXRoLmZsb29yKGggKiAzNjApLFxuICAgICAgICBVdGlscy5yb3VuZCgocyAqIDEwMCksIDEpLFxuICAgICAgICBVdGlscy5yb3VuZCgobCAqIDEwMCksIDEpXG4gICAgXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZ2IyaHNsO1xuIiwiLy8jIyBJbnRlcm5hbCBVdGlsaXRpZXNcbi8vICMjI1JlbmRlciBtZXRob2Rcbi8vXG4vLyBgcmVuZGVyKG1hcCwgdHlwZSlgXG4vL1xuLy8gYG1hcGAgaXMgYW4gb2JqZWN0IG9mIGRhdGEgdG8gcmVuZGVyLCBgdHlwZWAgY2FuIGJlIFJHQiwgSFNWIG9yIEhTTFxuZXhwb3J0cy5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIobWFwLCB0eXBlKSB7XG4gICAgcmV0dXJuIG1hcDtcbn07XG5cbi8vICMjIyBQYWRkZWQgSGV4IG1ldGhvZFxuLy9cbi8vIGBwYWRkZWRIZXgobnVtYmVyKWBcbi8vXG4vLyBDcmVhdGVzIGEgaGV4YWRlY2ltYWwgbnVtYmVyLCBhbmQgYWRkcyBhIHplcm8gdG8gdGhlIGJlZ2lubmluZyBpZiBpdHMgb25seSBvbmUgZGlnaXQuXG5leHBvcnRzLnBhZGRlZEhleCA9IGZ1bmN0aW9uIHBhZGRlZEhleChuKSB7XG4gICAgdmFyIGhleCA9IChuIDwgMTApID8gJzAnIDogJyc7XG5cbiAgICBoZXggKz0gbi50b1N0cmluZygxNik7XG5cbiAgICByZXR1cm4gKGhleC5sZW5ndGggPT09IDEpID8gJzAnICsgaGV4IDogaGV4O1xufTtcblxuZXhwb3J0cy5yb3VuZCA9IGZ1bmN0aW9uIHJvdW5kKG51bSwgcG9pbnRzKSB7XG4gICAgcG9pbnRzID0gcG9pbnRzIHx8IDEwO1xuICAgIHJldHVybiBwYXJzZUZsb2F0KG51bS50b0ZpeGVkKHBvaW50cykpO1xufTtcblxuZXhwb3J0cy5oZXhSZWdleE1hdGNoID0gZnVuY3Rpb24gaGV4UmVnZXhNYXRjaChjKSB7XG4gICAgcmV0dXJuIC9eXFx4MjNbYS1mMC05XXszfShbYS1mMC05XXszfSk/JC9pLnRlc3QoYyk7XG59O1xuIl19
