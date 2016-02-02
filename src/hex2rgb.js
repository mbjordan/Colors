var Utils = require('./utils');

var hexToInt = function(hex) {
    return parseInt(hex, 16);
};

var getRgbSubset = function(hex, idx) {
    return hexToInt(hex.substr(idx, 2));
};

var formatRgb = function(hex) {
    return [
        getRgbSubset(hex, 0),
        getRgbSubset(hex, 2),
        getRgbSubset(hex, 4)
    ];
};

var hex2rgb = function(str) {
    var hex = Utils.parseHexColor(str);

    if (hex.length === 2) {
        // Internal use, mostly
        return hexToInt(hex);
    }

    return formatRgb(hex);
};

module.exports = hex2rgb;
