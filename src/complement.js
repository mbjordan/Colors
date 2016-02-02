var Utils = require('./utils');
var hex2rgb = require('./hex2rgb');

var subFrom255 = function(int) {
    return 255 - int;
};

var getColorSubset = function(color, idx) {
    return Utils.paddedHex(
        subFrom255(
            hex2rgb(color.substr(idx, 2))
        )
    );
};

var stringHandler = function(hexR) {
    var returnString = '#';
    var hex = Utils.parseHexColor(hexR);
    returnString += getColorSubset(hex, 0);
    returnString += getColorSubset(hex, 2);
    returnString += getColorSubset(hex, 4);
    return returnString;
};

var getFormattedArr = function(a0, a1, a2) {
    return [
        subFrom255(a0),
        subFrom255(a1),
        subFrom255(a2)
    ];
};

var complement = function(hexR, g, b) {
    if (typeof hexR === 'string' && Utils.hexRegexMatch(hexR)) {
        return stringHandler(hexR);
    }

    if (hexR && g && b) {
        return getFormattedArr(hexR, g, b);
    }

    Utils.err('Method complement called with invalid arguments');
};

module.exports = complement;
