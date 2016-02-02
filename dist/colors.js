// colors.js - v2.0.0
// Copyright 2012-2016 Matt Jordan
// MIT License
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var colors = require('./src/index');

if ('undefined' === typeof window) {
    if ('undefined' !== typeof module && module.exports) {
        module.exports = colors;
        return;
    }
}

if ('function' === typeof define && define.amd) {
    return define(function() {
        return colors;
    });
}

window.Colors = window.$c = colors;

},{"./src/index":7}],2:[function(require,module,exports){
var Utils = require('./utils');
var hex2rgb = require('./hex2rgb');

var stringHandler = function(c) {
    var returnString = '#';

    c = c.replace(/^\x23/, '');

    if (c.length === 6) {
        returnString += Utils.paddedHex(255 - hex2rgb(c.substr(0, 2)));
        returnString += Utils.paddedHex(255 - hex2rgb(c.substr(2, 2)));
        returnString += Utils.paddedHex(255 - hex2rgb(c.substr(4, 2)));
    } else if (c.length === 3) {
        returnString += Utils.paddedHex(255 - hex2rgb(c.substr(0, 1) + c.substr(0, 1)));
        returnString += Utils.paddedHex(255 - hex2rgb(c.substr(1, 1) + c.substr(1, 1)));
        returnString += Utils.paddedHex(255 - hex2rgb(c.substr(2, 1) + c.substr(2, 1)));
    }

    return returnString;
};

var complement = function(c, g, b) {
    var colorValue;

    if (typeof c === 'string' && Utils.hexRegexMatch(c)) return stringHandler(c);

    if ('undefined' !== c && 'undefined' !== g && 'undefined' !== b) {
        colorValue = [(255 - c), (255 - g), (255 - b)];
    }

    if (typeof c == 'object') {
        colorValue = [(255 - c[0]), (255 - c[1]), (255 - c[2])];
    }

    return colorValue;
};

module.exports = complement;

},{"./hex2rgb":4,"./utils":14}],3:[function(require,module,exports){
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

},{"./utils":14}],4:[function(require,module,exports){
var hex2rgb = function(h) {
    h = h.replace(/^\#/, '');

    if (h.length === 6) {
        return [
            parseInt(h.substr(0, 2), 16),
            parseInt(h.substr(2, 2), 16),
            parseInt(h.substr(4, 2), 16)
        ];
    }

    return parseInt(h, 16);
};

module.exports = hex2rgb;

},{}],5:[function(require,module,exports){
var hsv2rgb = require('./hsv2rgb');

var hsv2hsl = function(H, S, V) {
    var h;
    var s;
    var l;
    var _H;
    var _S;
    var _L;
    var hsv;
    var r1;
    var g1;
    var b1;
    var maxColor;
    var minColor;

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
};

module.exports = hsv2hsl;

},{"./hsv2rgb":6}],6:[function(require,module,exports){
var hsv2rgb = function(HSV, S, V) {
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
};

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

var name2hex = function(n) {
    n = n.toLowerCase();
    if (!nameArray[n]) return 'Invalid Color Name';
    return nameArray[n];
};

module.exports = name2hex;

},{}],9:[function(require,module,exports){
var name2hex = require('./name2hex');
var hex2hsv = require('./hex2hsv');

var name2hsv = function(name) {
    return hex2hsv(name2hex(name));
};

module.exports = name2hsv;

},{"./hex2hsv":3,"./name2hex":8}],10:[function(require,module,exports){
var name2hex = require('./name2hex');
var hex2rgb = require('./hex2rgb');

var name2rgb = function(name) {
    return hex2rgb(name2hex(name));
};

module.exports = name2rgb;

},{"./hex2rgb":4,"./name2hex":8}],11:[function(require,module,exports){
var hexChars = '0123456789abcdef';

var hexMode = function() {
    var returnString = '';
    var idx = 0;
    var randChar;

    while (idx < 6) {
        randChar = Math.floor(Math.random() * hexChars.length);
        returnString += hexChars.substring(randChar, randChar + 1);
        idx += 1;
    }

    return '#' + returnString;
};

var rand = function(hexMode) {
    if (!!hexMode) return hexMode();

    return [
        Math.floor(Math.random() * (0 - 255 + 1) + 255),
        Math.floor(Math.random() * (0 - 255 + 1) + 255),
        Math.floor(Math.random() * (0 - 255 + 1) + 255)
    ];
};

module.exports = rand;

},{}],12:[function(require,module,exports){
var Utils = require('./utils');

var rgb2hex = function(r, g, b) {
    r = Utils.paddedHex(r);
    g = (g !== undefined) ? Utils.paddedHex(g) : r;
    b = (b !== undefined) ? Utils.paddedHex(b) : r;

    return '#' + r + g + b;
};

module.exports = rgb2hex;

},{"./utils":14}],13:[function(require,module,exports){
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

},{"./utils":14}],14:[function(require,module,exports){
// `map` is an object of data to render, `type` is deprecated.
exports.render = function render(map, type) {
    return map;
};

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

exports.hexRegexMatch = function hexRegexMatch(comparator) {
    return /^\x23[a-f0-9]{3}([a-f0-9]{3})?$/i.test(comparator);
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInNyYy9jb21wbGVtZW50LmpzIiwic3JjL2hleDJoc3YuanMiLCJzcmMvaGV4MnJnYi5qcyIsInNyYy9oc3YyaHNsLmpzIiwic3JjL2hzdjJyZ2IuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvbmFtZTJoZXguanMiLCJzcmMvbmFtZTJoc3YuanMiLCJzcmMvbmFtZTJyZ2IuanMiLCJzcmMvcmFuZC5qcyIsInNyYy9yZ2IyaGV4LmpzIiwic3JjL3JnYjJoc2wuanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY29sb3JzID0gcmVxdWlyZSgnLi9zcmMvaW5kZXgnKTtcblxuaWYgKCd1bmRlZmluZWQnID09PSB0eXBlb2Ygd2luZG93KSB7XG4gICAgaWYgKCd1bmRlZmluZWQnICE9PSB0eXBlb2YgbW9kdWxlICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gY29sb3JzO1xuICAgICAgICByZXR1cm47XG4gICAgfVxufVxuXG5pZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGRlZmluZSAmJiBkZWZpbmUuYW1kKSB7XG4gICAgcmV0dXJuIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNvbG9ycztcbiAgICB9KTtcbn1cblxud2luZG93LkNvbG9ycyA9IHdpbmRvdy4kYyA9IGNvbG9ycztcbiIsInZhciBVdGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBoZXgycmdiID0gcmVxdWlyZSgnLi9oZXgycmdiJyk7XG5cbnZhciBzdHJpbmdIYW5kbGVyID0gZnVuY3Rpb24oYykge1xuICAgIHZhciByZXR1cm5TdHJpbmcgPSAnIyc7XG5cbiAgICBjID0gYy5yZXBsYWNlKC9eXFx4MjMvLCAnJyk7XG5cbiAgICBpZiAoYy5sZW5ndGggPT09IDYpIHtcbiAgICAgICAgcmV0dXJuU3RyaW5nICs9IFV0aWxzLnBhZGRlZEhleCgyNTUgLSBoZXgycmdiKGMuc3Vic3RyKDAsIDIpKSk7XG4gICAgICAgIHJldHVyblN0cmluZyArPSBVdGlscy5wYWRkZWRIZXgoMjU1IC0gaGV4MnJnYihjLnN1YnN0cigyLCAyKSkpO1xuICAgICAgICByZXR1cm5TdHJpbmcgKz0gVXRpbHMucGFkZGVkSGV4KDI1NSAtIGhleDJyZ2IoYy5zdWJzdHIoNCwgMikpKTtcbiAgICB9IGVsc2UgaWYgKGMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgIHJldHVyblN0cmluZyArPSBVdGlscy5wYWRkZWRIZXgoMjU1IC0gaGV4MnJnYihjLnN1YnN0cigwLCAxKSArIGMuc3Vic3RyKDAsIDEpKSk7XG4gICAgICAgIHJldHVyblN0cmluZyArPSBVdGlscy5wYWRkZWRIZXgoMjU1IC0gaGV4MnJnYihjLnN1YnN0cigxLCAxKSArIGMuc3Vic3RyKDEsIDEpKSk7XG4gICAgICAgIHJldHVyblN0cmluZyArPSBVdGlscy5wYWRkZWRIZXgoMjU1IC0gaGV4MnJnYihjLnN1YnN0cigyLCAxKSArIGMuc3Vic3RyKDIsIDEpKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldHVyblN0cmluZztcbn07XG5cbnZhciBjb21wbGVtZW50ID0gZnVuY3Rpb24oYywgZywgYikge1xuICAgIHZhciBjb2xvclZhbHVlO1xuXG4gICAgaWYgKHR5cGVvZiBjID09PSAnc3RyaW5nJyAmJiBVdGlscy5oZXhSZWdleE1hdGNoKGMpKSByZXR1cm4gc3RyaW5nSGFuZGxlcihjKTtcblxuICAgIGlmICgndW5kZWZpbmVkJyAhPT0gYyAmJiAndW5kZWZpbmVkJyAhPT0gZyAmJiAndW5kZWZpbmVkJyAhPT0gYikge1xuICAgICAgICBjb2xvclZhbHVlID0gWygyNTUgLSBjKSwgKDI1NSAtIGcpLCAoMjU1IC0gYildO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgYyA9PSAnb2JqZWN0Jykge1xuICAgICAgICBjb2xvclZhbHVlID0gWygyNTUgLSBjWzBdKSwgKDI1NSAtIGNbMV0pLCAoMjU1IC0gY1syXSldO1xuICAgIH1cblxuICAgIHJldHVybiBjb2xvclZhbHVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb21wbGVtZW50O1xuIiwidmFyIFV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgaGV4MmhzdiA9IGZ1bmN0aW9uKGgpIHtcbiAgICBoID0gKGguY2hhckF0KDApID09ICcjJykgPyBoLnN1YnN0cmluZygxLCA3KSA6IGg7XG4gICAgdmFyIHIgPSBwYXJzZUludChoLnN1YnN0cmluZygwLCAyKSwgMTYpIC8gMjU1O1xuICAgIHZhciBnID0gcGFyc2VJbnQoaC5zdWJzdHJpbmcoMiwgNCksIDE2KSAvIDI1NTtcbiAgICB2YXIgYiA9IHBhcnNlSW50KGguc3Vic3RyaW5nKDQsIDYpLCAxNikgLyAyNTU7XG4gICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgJ2gnOiAwLFxuICAgICAgICAncyc6IDAsXG4gICAgICAgICd2JzogMFxuICAgIH07XG4gICAgdmFyIG1pblZhbCA9IE1hdGgubWluKHIsIGcsIGIpO1xuICAgIHZhciBtYXhWYWwgPSBNYXRoLm1heChyLCBnLCBiKTtcbiAgICB2YXIgZGVsdGEgPSAobWF4VmFsIC0gbWluVmFsKTtcbiAgICB2YXIgZGVsX1I7XG4gICAgdmFyIGRlbF9HO1xuICAgIHZhciBkZWxfQjtcbiAgICB2YXIgbWFwO1xuXG4gICAgcmVzdWx0LnYgPSBtYXhWYWw7XG4gICAgaWYgKGRlbHRhID09PSAwKSB7XG4gICAgICAgIHJlc3VsdC5oID0gMDtcbiAgICAgICAgcmVzdWx0LnMgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdC5zID0gZGVsdGEgLyBtYXhWYWw7XG4gICAgICAgIGRlbF9SID0gKCgobWF4VmFsIC0gcikgLyA2KSArIChkZWx0YSAvIDIpKSAvIGRlbHRhO1xuICAgICAgICBkZWxfRyA9ICgoKG1heFZhbCAtIGcpIC8gNikgKyAoZGVsdGEgLyAyKSkgLyBkZWx0YTtcbiAgICAgICAgZGVsX0IgPSAoKChtYXhWYWwgLSBiKSAvIDYpICsgKGRlbHRhIC8gMikpIC8gZGVsdGE7XG4gICAgICAgIGlmIChyID09IG1heFZhbCkge1xuICAgICAgICAgICAgcmVzdWx0LmggPSBkZWxfQiAtIGRlbF9HO1xuICAgICAgICB9IGVsc2UgaWYgKGcgPT0gbWF4VmFsKSB7XG4gICAgICAgICAgICByZXN1bHQuaCA9ICgxIC8gMykgKyBkZWxfUiAtIGRlbF9CO1xuICAgICAgICB9IGVsc2UgaWYgKGIgPT0gbWF4VmFsKSB7XG4gICAgICAgICAgICByZXN1bHQuaCA9ICgyIC8gMykgKyBkZWxfRyAtIGRlbF9SO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQuaCA8IDApIHtcbiAgICAgICAgICAgIHJlc3VsdC5oICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdC5oID4gMSkge1xuICAgICAgICAgICAgcmVzdWx0LmggLT0gMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBbXG4gICAgICAgIFV0aWxzLnJvdW5kKHJlc3VsdC5oICogMzYwKSxcbiAgICAgICAgVXRpbHMucm91bmQocmVzdWx0LnMgKiAxMDApLFxuICAgICAgICBVdGlscy5yb3VuZChyZXN1bHQudiAqIDEwMClcbiAgICBdO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBoZXgyaHN2O1xuIiwidmFyIGhleDJyZ2IgPSBmdW5jdGlvbihoKSB7XG4gICAgaCA9IGgucmVwbGFjZSgvXlxcIy8sICcnKTtcblxuICAgIGlmIChoLmxlbmd0aCA9PT0gNikge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgcGFyc2VJbnQoaC5zdWJzdHIoMCwgMiksIDE2KSxcbiAgICAgICAgICAgIHBhcnNlSW50KGguc3Vic3RyKDIsIDIpLCAxNiksXG4gICAgICAgICAgICBwYXJzZUludChoLnN1YnN0cig0LCAyKSwgMTYpXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnNlSW50KGgsIDE2KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaGV4MnJnYjtcbiIsInZhciBoc3YycmdiID0gcmVxdWlyZSgnLi9oc3YycmdiJyk7XG5cbnZhciBoc3YyaHNsID0gZnVuY3Rpb24oSCwgUywgVikge1xuICAgIHZhciBoO1xuICAgIHZhciBzO1xuICAgIHZhciBsO1xuICAgIHZhciBfSDtcbiAgICB2YXIgX1M7XG4gICAgdmFyIF9MO1xuICAgIHZhciBoc3Y7XG4gICAgdmFyIHIxO1xuICAgIHZhciBnMTtcbiAgICB2YXIgYjE7XG4gICAgdmFyIG1heENvbG9yO1xuICAgIHZhciBtaW5Db2xvcjtcblxuICAgIGlmICh0eXBlb2YgSCA9PSAnb2JqZWN0Jykge1xuICAgICAgICBoID0gSFswXTtcbiAgICAgICAgcyA9IEhbMV07XG4gICAgICAgIGwgPSBIWzJdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGggPSBIO1xuICAgICAgICBzID0gUztcbiAgICAgICAgbCA9IFY7XG4gICAgfVxuXG4gICAgaHN2ID0gaHN2MnJnYihoLCBzLCBsKTtcbiAgICByMSA9IGhzdi5SIC8gMjU1O1xuICAgIGcxID0gaHN2LkcgLyAyNTU7XG4gICAgYjEgPSBoc3YuQiAvIDI1NTtcbiAgICBtYXhDb2xvciA9IE1hdGgubWF4KHIxLCBnMSwgYjEpO1xuICAgIG1pbkNvbG9yID0gTWF0aC5taW4ocjEsIGcxLCBiMSk7XG4gICAgX0wgPSAobWF4Q29sb3IgKyBtaW5Db2xvcikgLyAyO1xuICAgIF9TID0gMDtcbiAgICBfSCA9IDA7XG4gICAgaWYgKG1heENvbG9yICE9IG1pbkNvbG9yKSB7XG4gICAgICAgIGlmIChfTCA8IDAuNSkge1xuICAgICAgICAgICAgUyA9IChtYXhDb2xvciAtIG1pbkNvbG9yKSAvIChtYXhDb2xvciArIG1pbkNvbG9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFMgPSAobWF4Q29sb3IgLSBtaW5Db2xvcikgLyAoMi4wIC0gbWF4Q29sb3IgLSBtaW5Db2xvcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHIxID09IG1heENvbG9yKSB7XG4gICAgICAgICAgICBIID0gKGcxIC0gYjEpIC8gKG1heENvbG9yIC0gbWluQ29sb3IpO1xuICAgICAgICB9IGVsc2UgaWYgKGcxID09IG1heENvbG9yKSB7XG4gICAgICAgICAgICBIID0gMi4wICsgKGIxIC0gcjEpIC8gKG1heENvbG9yIC0gbWluQ29sb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgSCA9IDQuMCArIChyMSAtIGcxKSAvIChtYXhDb2xvciAtIG1pbkNvbG9yKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfTCA9IF9MICogMTAwO1xuICAgIF9TID0gX1MgKiAxMDA7XG4gICAgX0ggPSBfSCAqIDYwO1xuICAgIGlmIChfSCA8IDApIHtcbiAgICAgICAgX0ggKz0gMzYwO1xuICAgIH1cblxuICAgIHJldHVybiBbXG4gICAgICAgIE1hdGguZmxvb3IoSCksXG4gICAgICAgIE1hdGguZmxvb3IoUyksXG4gICAgICAgIE1hdGguZmxvb3IoVilcbiAgICBdO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBoc3YyaHNsO1xuIiwidmFyIGhzdjJyZ2IgPSBmdW5jdGlvbihIU1YsIFMsIFYpIHtcbiAgICB2YXIgcmdiID0gW10sXG4gICAgICAgIGgsIHMsIHYsIGhpLCBmLCBwLCBxLCB0O1xuXG4gICAgaWYgKHR5cGVvZiBIU1YgPT0gJ29iamVjdCcpIHtcbiAgICAgICAgaCA9IEhTVlswXTtcbiAgICAgICAgcyA9IEhTVlsxXTtcbiAgICAgICAgdiA9IEhTVlsyXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBoID0gSFNWO1xuICAgICAgICBzID0gUztcbiAgICAgICAgdiA9IFY7XG4gICAgfVxuICAgIHMgPSBzIC8gMTAwO1xuICAgIHYgPSB2IC8gMTAwO1xuICAgIGhpID0gTWF0aC5mbG9vcigoaCAvIDYwKSAlIDYpO1xuICAgIGYgPSAoaCAvIDYwKSAtIGhpO1xuICAgIHAgPSB2ICogKDEgLSBzKTtcbiAgICBxID0gdiAqICgxIC0gZiAqIHMpO1xuICAgIHQgPSB2ICogKDEgLSAoMSAtIGYpICogcyk7XG4gICAgc3dpdGNoIChoaSkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICByZ2IgPSBbdiwgdCwgcF07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgcmdiID0gW3EsIHYsIHBdO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIHJnYiA9IFtwLCB2LCB0XTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICByZ2IgPSBbcCwgcSwgdl07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgcmdiID0gW3QsIHAsIHZdO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIHJnYiA9IFt2LCBwLCBxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gW1xuICAgICAgICBNYXRoLm1pbigyNTUsIE1hdGguZmxvb3IocmdiWzBdICogMjU2KSksXG4gICAgICAgIE1hdGgubWluKDI1NSwgTWF0aC5mbG9vcihyZ2JbMV0gKiAyNTYpKSxcbiAgICAgICAgTWF0aC5taW4oMjU1LCBNYXRoLmZsb29yKHJnYlsyXSAqIDI1NikpXG4gICAgXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaHN2MnJnYjtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgICdjb21wbGVtZW50JzogcmVxdWlyZSgnLi9jb21wbGVtZW50JyksXG4gICAgJ2hleDJoc3YnOiByZXF1aXJlKCcuL2hleDJoc3YnKSxcbiAgICAnaGV4MnJnYic6IHJlcXVpcmUoJy4vaGV4MnJnYicpLFxuICAgICdoc3YyaHNsJzogcmVxdWlyZSgnLi9oc3YyaHNsJyksXG4gICAgJ2hzdjJyZ2InOiByZXF1aXJlKCcuL2hzdjJyZ2InKSxcbiAgICAnbmFtZTJoZXgnOiByZXF1aXJlKCcuL25hbWUyaGV4JyksXG4gICAgJ25hbWUyaHN2JzogcmVxdWlyZSgnLi9uYW1lMmhzdicpLFxuICAgICduYW1lMnJnYic6IHJlcXVpcmUoJy4vbmFtZTJyZ2InKSxcbiAgICAncmFuZCc6IHJlcXVpcmUoJy4vcmFuZCcpLFxuICAgICdyZ2IyaGV4JzogcmVxdWlyZSgnLi9yZ2IyaGV4JyksXG4gICAgJ3JnYjJoc2wnOiByZXF1aXJlKCcuL3JnYjJoc2wnKSxcbiAgICAndXRpbHMnOiByZXF1aXJlKCcuL3V0aWxzJylcbn07XG4iLCJ2YXIgbmFtZUFycmF5ID0ge1xuICAgICdhbGljZWJsdWUnOiAnI2YwZjhmZicsXG4gICAgJ2FudGlxdWV3aGl0ZSc6ICcjZmFlYmQ3JyxcbiAgICAnYXF1YSc6ICcjMDBmZmZmJyxcbiAgICAnYXF1YW1hcmluZSc6ICcjN2ZmZmQ0JyxcbiAgICAnYXp1cmUnOiAnI2YwZmZmZicsXG4gICAgJ2JlaWdlJzogJyNmNWY1ZGMnLFxuICAgICdiaXNxdWUnOiAnI2ZmZTRjNCcsXG4gICAgJ2JsYWNrJzogJyMwMDAwMDAnLFxuICAgICdibGFuY2hlZGFsbW9uZCc6ICcjZmZlYmNkJyxcbiAgICAnYmx1ZSc6ICcjMDAwMGZmJyxcbiAgICAnYmx1ZXZpb2xldCc6ICcjOGEyYmUyJyxcbiAgICAnYnJvd24nOiAnI2E1MmEyYScsXG4gICAgJ2J1cmx5d29vZCc6ICcjZGViODg3JyxcbiAgICAnY2FkZXRibHVlJzogJyM1ZjllYTAnLFxuICAgICdjaGFydHJldXNlJzogJyM3ZmZmMDAnLFxuICAgICdjaG9jb2xhdGUnOiAnI2QyNjkxZScsXG4gICAgJ2NvcmFsJzogJyNmZjdmNTAnLFxuICAgICdjb3JuZmxvd2VyYmx1ZSc6ICcjNjQ5NWVkJyxcbiAgICAnY29ybnNpbGsnOiAnI2ZmZjhkYycsXG4gICAgJ2NyaW1zb24nOiAnI2RjMTQzYycsXG4gICAgJ2N5YW4nOiAnIzAwZmZmZicsXG4gICAgJ2RhcmtibHVlJzogJyMwMDAwOGInLFxuICAgICdkYXJrY3lhbic6ICcjMDA4YjhiJyxcbiAgICAnZGFya2dvbGRlbnJvZCc6ICcjYjg4NjBiJyxcbiAgICAnZGFya2dyYXknOiAnI2E5YTlhOScsXG4gICAgJ2RhcmtncmV5JzogJyNhOWE5YTknLFxuICAgICdkYXJrZ3JlZW4nOiAnIzAwNjQwMCcsXG4gICAgJ2RhcmtraGFraSc6ICcjYmRiNzZiJyxcbiAgICAnZGFya21hZ2VudGEnOiAnIzhiMDA4YicsXG4gICAgJ2RhcmtvbGl2ZWdyZWVuJzogJyM1NTZiMmYnLFxuICAgICdkYXJrb3JhbmdlJzogJyNmZjhjMDAnLFxuICAgICdkYXJrb3JjaGlkJzogJyM5OTMyY2MnLFxuICAgICdkYXJrcmVkJzogJyM4YjAwMDAnLFxuICAgICdkYXJrc2FsbW9uJzogJyNlOTk2N2EnLFxuICAgICdkYXJrc2VhZ3JlZW4nOiAnIzhmYmM4ZicsXG4gICAgJ2RhcmtzbGF0ZWJsdWUnOiAnIzQ4M2Q4YicsXG4gICAgJ2RhcmtzbGF0ZWdyYXknOiAnIzJmNGY0ZicsXG4gICAgJ2RhcmtzbGF0ZWdyZXknOiAnIzJmNGY0ZicsXG4gICAgJ2Rhcmt0dXJxdW9pc2UnOiAnIzAwY2VkMScsXG4gICAgJ2Rhcmt2aW9sZXQnOiAnIzk0MDBkMycsXG4gICAgJ2RlZXBwaW5rJzogJyNmZjE0OTMnLFxuICAgICdkZWVwc2t5Ymx1ZSc6ICcjMDBiZmZmJyxcbiAgICAnZGltZ3JheSc6ICcjNjk2OTY5JyxcbiAgICAnZGltZ3JleSc6ICcjNjk2OTY5JyxcbiAgICAnZG9kZ2VyYmx1ZSc6ICcjMWU5MGZmJyxcbiAgICAnZmlyZWJyaWNrJzogJyNiMjIyMjInLFxuICAgICdmbG9yYWx3aGl0ZSc6ICcjZmZmYWYwJyxcbiAgICAnZm9yZXN0Z3JlZW4nOiAnIzIyOGIyMicsXG4gICAgJ2Z1Y2hzaWEnOiAnI2ZmMDBmZicsXG4gICAgJ2dhaW5zYm9ybyc6ICcjZGNkY2RjJyxcbiAgICAnZ2hvc3R3aGl0ZSc6ICcjZjhmOGZmJyxcbiAgICAnZ29sZCc6ICcjZmZkNzAwJyxcbiAgICAnZ29sZGVucm9kJzogJyNkYWE1MjAnLFxuICAgICdncmF5JzogJyM4MDgwODAnLFxuICAgICdncmV5JzogJyM4MDgwODAnLFxuICAgICdncmVlbic6ICcjMDA4MDAwJyxcbiAgICAnZ3JlZW55ZWxsb3cnOiAnI2FkZmYyZicsXG4gICAgJ2hvbmV5ZGV3JzogJyNmMGZmZjAnLFxuICAgICdob3RwaW5rJzogJyNmZjY5YjQnLFxuICAgICdpbmRpYW5yZWQnOiAnI2NkNWM1YycsXG4gICAgJ2luZGlnbyc6ICcjNGIwMDgyJyxcbiAgICAnaXZvcnknOiAnI2ZmZmZmMCcsXG4gICAgJ2toYWtpJzogJyNmMGU2OGMnLFxuICAgICdsYXZlbmRlcic6ICcjZTZlNmZhJyxcbiAgICAnbGF2ZW5kZXJibHVzaCc6ICcjZmZmMGY1JyxcbiAgICAnbGF3bmdyZWVuJzogJyM3Y2ZjMDAnLFxuICAgICdsZW1vbmNoaWZmb24nOiAnI2ZmZmFjZCcsXG4gICAgJ2xpZ2h0Ymx1ZSc6ICcjYWRkOGU2JyxcbiAgICAnbGlnaHRjb3JhbCc6ICcjZjA4MDgwJyxcbiAgICAnbGlnaHRjeWFuJzogJyNlMGZmZmYnLFxuICAgICdsaWdodGdvbGRlbnJvZHllbGxvdyc6ICcjZmFmYWQyJyxcbiAgICAnbGlnaHRncmF5JzogJyNkM2QzZDMnLFxuICAgICdsaWdodGdyZXknOiAnI2QzZDNkMycsXG4gICAgJ2xpZ2h0Z3JlZW4nOiAnIzkwZWU5MCcsXG4gICAgJ2xpZ2h0cGluayc6ICcjZmZiNmMxJyxcbiAgICAnbGlnaHRzYWxtb24nOiAnI2ZmYTA3YScsXG4gICAgJ2xpZ2h0c2VhZ3JlZW4nOiAnIzIwYjJhYScsXG4gICAgJ2xpZ2h0c2t5Ymx1ZSc6ICcjODdjZWZhJyxcbiAgICAnbGlnaHRzbGF0ZWdyYXknOiAnIzc3ODg5OScsXG4gICAgJ2xpZ2h0c2xhdGVncmV5JzogJyM3Nzg4OTknLFxuICAgICdsaWdodHN0ZWVsYmx1ZSc6ICcjYjBjNGRlJyxcbiAgICAnbGlnaHR5ZWxsb3cnOiAnI2ZmZmZlMCcsXG4gICAgJ2xpbWUnOiAnIzAwZmYwMCcsXG4gICAgJ2xpbWVncmVlbic6ICcjMzJjZDMyJyxcbiAgICAnbGluZW4nOiAnI2ZhZjBlNicsXG4gICAgJ21hZ2VudGEnOiAnI2ZmMDBmZicsXG4gICAgJ21hcm9vbic6ICcjODAwMDAwJyxcbiAgICAnbWVkaXVtYXF1YW1hcmluZSc6ICcjNjZjZGFhJyxcbiAgICAnbWVkaXVtYmx1ZSc6ICcjMDAwMGNkJyxcbiAgICAnbWVkaXVtb3JjaGlkJzogJyNiYTU1ZDMnLFxuICAgICdtZWRpdW1wdXJwbGUnOiAnIzkzNzBkOCcsXG4gICAgJ21lZGl1bXNlYWdyZWVuJzogJyMzY2IzNzEnLFxuICAgICdtZWRpdW1zbGF0ZWJsdWUnOiAnIzdiNjhlZScsXG4gICAgJ21lZGl1bXNwcmluZ2dyZWVuJzogJyMwMGZhOWEnLFxuICAgICdtZWRpdW10dXJxdW9pc2UnOiAnIzQ4ZDFjYycsXG4gICAgJ21lZGl1bXZpb2xldHJlZCc6ICcjYzcxNTg1JyxcbiAgICAnbWlkbmlnaHRibHVlJzogJyMxOTE5NzAnLFxuICAgICdtaW50Y3JlYW0nOiAnI2Y1ZmZmYScsXG4gICAgJ21pc3R5cm9zZSc6ICcjZmZlNGUxJyxcbiAgICAnbW9jY2FzaW4nOiAnI2ZmZTRiNScsXG4gICAgJ25hdmFqb3doaXRlJzogJyNmZmRlYWQnLFxuICAgICduYXZ5JzogJyMwMDAwODAnLFxuICAgICdvbGRsYWNlJzogJyNmZGY1ZTYnLFxuICAgICdvbGl2ZSc6ICcjODA4MDAwJyxcbiAgICAnb2xpdmVkcmFiJzogJyM2YjhlMjMnLFxuICAgICdvcmFuZ2UnOiAnI2ZmYTUwMCcsXG4gICAgJ29yYW5nZXJlZCc6ICcjZmY0NTAwJyxcbiAgICAnb3JjaGlkJzogJyNkYTcwZDYnLFxuICAgICdwYWxlZ29sZGVucm9kJzogJyNlZWU4YWEnLFxuICAgICdwYWxlZ3JlZW4nOiAnIzk4ZmI5OCcsXG4gICAgJ3BhbGV0dXJxdW9pc2UnOiAnI2FmZWVlZScsXG4gICAgJ3BhbGV2aW9sZXRyZWQnOiAnI2Q4NzA5MycsXG4gICAgJ3BhcGF5YXdoaXAnOiAnI2ZmZWZkNScsXG4gICAgJ3BlYWNocHVmZic6ICcjZmZkYWI5JyxcbiAgICAncGVydSc6ICcjY2Q4NTNmJyxcbiAgICAncGluayc6ICcjZmZjMGNiJyxcbiAgICAncGx1bSc6ICcjZGRhMGRkJyxcbiAgICAncG93ZGVyYmx1ZSc6ICcjYjBlMGU2JyxcbiAgICAncHVycGxlJzogJyM4MDAwODAnLFxuICAgICdyZWQnOiAnI2ZmMDAwMCcsXG4gICAgJ3Jvc3licm93bic6ICcjYmM4ZjhmJyxcbiAgICAncm95YWxibHVlJzogJyM0MTY5ZTEnLFxuICAgICdzYWRkbGVicm93bic6ICcjOGI0NTEzJyxcbiAgICAnc2FsbW9uJzogJyNmYTgwNzInLFxuICAgICdzYW5keWJyb3duJzogJyNmNGE0NjAnLFxuICAgICdzZWFncmVlbic6ICcjMmU4YjU3JyxcbiAgICAnc2Vhc2hlbGwnOiAnI2ZmZjVlZScsXG4gICAgJ3NpZW5uYSc6ICcjYTA1MjJkJyxcbiAgICAnc2lsdmVyJzogJyNjMGMwYzAnLFxuICAgICdza3libHVlJzogJyM4N2NlZWInLFxuICAgICdzbGF0ZWJsdWUnOiAnIzZhNWFjZCcsXG4gICAgJ3NsYXRlZ3JheSc6ICcjNzA4MDkwJyxcbiAgICAnc2xhdGVncmV5JzogJyM3MDgwOTAnLFxuICAgICdzbm93JzogJyNmZmZhZmEnLFxuICAgICdzcHJpbmdncmVlbic6ICcjMDBmZjdmJyxcbiAgICAnc3RlZWxibHVlJzogJyM0NjgyYjQnLFxuICAgICd0YW4nOiAnI2QyYjQ4YycsXG4gICAgJ3RlYWwnOiAnIzAwODA4MCcsXG4gICAgJ3RoaXN0bGUnOiAnI2Q4YmZkOCcsXG4gICAgJ3RvbWF0byc6ICcjZmY2MzQ3JyxcbiAgICAndHVycXVvaXNlJzogJyM0MGUwZDAnLFxuICAgICd2aW9sZXQnOiAnI2VlODJlZScsXG4gICAgJ3doZWF0JzogJyNmNWRlYjMnLFxuICAgICd3aGl0ZSc6ICcjZmZmZmZmJyxcbiAgICAnd2hpdGVzbW9rZSc6ICcjZjVmNWY1JyxcbiAgICAneWVsbG93JzogJyNmZmZmMDAnLFxuICAgICd5ZWxsb3dncmVlbic6ICcjOWFjZDMyJ1xufTtcblxudmFyIG5hbWUyaGV4ID0gZnVuY3Rpb24obikge1xuICAgIG4gPSBuLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKCFuYW1lQXJyYXlbbl0pIHJldHVybiAnSW52YWxpZCBDb2xvciBOYW1lJztcbiAgICByZXR1cm4gbmFtZUFycmF5W25dO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBuYW1lMmhleDtcbiIsInZhciBuYW1lMmhleCA9IHJlcXVpcmUoJy4vbmFtZTJoZXgnKTtcbnZhciBoZXgyaHN2ID0gcmVxdWlyZSgnLi9oZXgyaHN2Jyk7XG5cbnZhciBuYW1lMmhzdiA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gaGV4MmhzdihuYW1lMmhleChuYW1lKSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hbWUyaHN2O1xuIiwidmFyIG5hbWUyaGV4ID0gcmVxdWlyZSgnLi9uYW1lMmhleCcpO1xudmFyIGhleDJyZ2IgPSByZXF1aXJlKCcuL2hleDJyZ2InKTtcblxudmFyIG5hbWUycmdiID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiBoZXgycmdiKG5hbWUyaGV4KG5hbWUpKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmFtZTJyZ2I7XG4iLCJ2YXIgaGV4Q2hhcnMgPSAnMDEyMzQ1Njc4OWFiY2RlZic7XG5cbnZhciBoZXhNb2RlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJldHVyblN0cmluZyA9ICcnO1xuICAgIHZhciBpZHggPSAwO1xuICAgIHZhciByYW5kQ2hhcjtcblxuICAgIHdoaWxlIChpZHggPCA2KSB7XG4gICAgICAgIHJhbmRDaGFyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogaGV4Q2hhcnMubGVuZ3RoKTtcbiAgICAgICAgcmV0dXJuU3RyaW5nICs9IGhleENoYXJzLnN1YnN0cmluZyhyYW5kQ2hhciwgcmFuZENoYXIgKyAxKTtcbiAgICAgICAgaWR4ICs9IDE7XG4gICAgfVxuXG4gICAgcmV0dXJuICcjJyArIHJldHVyblN0cmluZztcbn07XG5cbnZhciByYW5kID0gZnVuY3Rpb24oaGV4TW9kZSkge1xuICAgIGlmICghIWhleE1vZGUpIHJldHVybiBoZXhNb2RlKCk7XG5cbiAgICByZXR1cm4gW1xuICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMCAtIDI1NSArIDEpICsgMjU1KSxcbiAgICAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDAgLSAyNTUgKyAxKSArIDI1NSksXG4gICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgwIC0gMjU1ICsgMSkgKyAyNTUpXG4gICAgXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcmFuZDtcbiIsInZhciBVdGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyIHJnYjJoZXggPSBmdW5jdGlvbihyLCBnLCBiKSB7XG4gICAgciA9IFV0aWxzLnBhZGRlZEhleChyKTtcbiAgICBnID0gKGcgIT09IHVuZGVmaW5lZCkgPyBVdGlscy5wYWRkZWRIZXgoZykgOiByO1xuICAgIGIgPSAoYiAhPT0gdW5kZWZpbmVkKSA/IFV0aWxzLnBhZGRlZEhleChiKSA6IHI7XG5cbiAgICByZXR1cm4gJyMnICsgciArIGcgKyBiO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSByZ2IyaGV4O1xuIiwidmFyIFV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgcmdiMmhzbCA9IGZ1bmN0aW9uKFJHQiwgRywgQikge1xuICAgIHZhciByLCBnLCBiLCBtaW4sIG1heCwgaCwgcywgbCwgZDtcblxuICAgIGlmICh0eXBlb2YgUkdCID09PSAnb2JqZWN0Jykge1xuICAgICAgICByID0gUkdCWzBdO1xuICAgICAgICBnID0gUkdCWzFdO1xuICAgICAgICBiID0gUkdCWzJdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHIgPSBSR0I7XG4gICAgICAgIGcgPSBHO1xuICAgICAgICBiID0gQjtcbiAgICB9XG5cbiAgICByIC89IDI1NTtcbiAgICBnIC89IDI1NTtcbiAgICBiIC89IDI1NTtcblxuICAgIG1heCA9IE1hdGgubWF4KHIsIGcsIGIpO1xuICAgIG1pbiA9IE1hdGgubWluKHIsIGcsIGIpO1xuICAgIGwgPSAobWF4ICsgbWluKSAvIDI7XG5cbiAgICBpZiAobWF4ID09IG1pbikge1xuICAgICAgICBoID0gcyA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZCA9IG1heCAtIG1pbjtcbiAgICAgICAgcyA9IGwgPiAwLjUgPyBkIC8gKDIgLSBtYXggLSBtaW4pIDogZCAvIChtYXggKyBtaW4pO1xuICAgICAgICBzd2l0Y2ggKG1heCkge1xuICAgICAgICAgICAgY2FzZSByOlxuICAgICAgICAgICAgICAgIGggPSAoZyAtIGIpIC8gZCArIChnIDwgYiA/IDYgOiAwKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgZzpcbiAgICAgICAgICAgICAgICBoID0gKGIgLSByKSAvIGQgKyAyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBiOlxuICAgICAgICAgICAgICAgIGggPSAociAtIGcpIC8gZCArIDQ7XG4gICAgICAgIH1cbiAgICAgICAgaCAvPSA2O1xuICAgIH1cblxuICAgIHJldHVybiBbXG4gICAgICAgIE1hdGguZmxvb3IoaCAqIDM2MCksXG4gICAgICAgIFV0aWxzLnJvdW5kKChzICogMTAwKSwgMSksXG4gICAgICAgIFV0aWxzLnJvdW5kKChsICogMTAwKSwgMSlcbiAgICBdO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSByZ2IyaHNsO1xuIiwiLy8gYG1hcGAgaXMgYW4gb2JqZWN0IG9mIGRhdGEgdG8gcmVuZGVyLCBgdHlwZWAgaXMgZGVwcmVjYXRlZC5cbmV4cG9ydHMucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKG1hcCwgdHlwZSkge1xuICAgIHJldHVybiBtYXA7XG59O1xuXG4vLyBDcmVhdGVzIGEgaGV4YWRlY2ltYWwgbnVtYmVyLCBhbmQgYWRkcyBhIHplcm8gdG8gdGhlIGJlZ2lubmluZyBpZiBpdHMgb25seSBvbmUgZGlnaXQuXG5leHBvcnRzLnBhZGRlZEhleCA9IGZ1bmN0aW9uIHBhZGRlZEhleChuKSB7XG4gICAgdmFyIGhleCA9IChuIDwgMTApID8gJzAnIDogJyc7XG4gICAgaGV4ICs9IG4udG9TdHJpbmcoMTYpO1xuICAgIHJldHVybiAoaGV4Lmxlbmd0aCA9PT0gMSkgPyAnMCcgKyBoZXggOiBoZXg7XG59O1xuXG5leHBvcnRzLnJvdW5kID0gZnVuY3Rpb24gcm91bmQobnVtLCBwb2ludHMpIHtcbiAgICBwb2ludHMgPSBwb2ludHMgfHwgMTA7XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQobnVtLnRvRml4ZWQocG9pbnRzKSk7XG59O1xuXG5leHBvcnRzLmhleFJlZ2V4TWF0Y2ggPSBmdW5jdGlvbiBoZXhSZWdleE1hdGNoKGNvbXBhcmF0b3IpIHtcbiAgICByZXR1cm4gL15cXHgyM1thLWYwLTldezN9KFthLWYwLTldezN9KT8kL2kudGVzdChjb21wYXJhdG9yKTtcbn07XG4iXX0=
