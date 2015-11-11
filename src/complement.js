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
