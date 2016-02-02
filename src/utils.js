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

exports.parseHexColor = function(color) {
    color = color.replace(/^\#/, '');

    if (color.length === 3) {
        color = color.replace(
            /^([a-f0-9]{1})([a-f0-9]{1})([a-f0-9]{1})$/i,
            '$1$1$2$2$3$3'
        );
    }

    return color;
};

exports.err = function(message) {
    throw new Error('[colors.js]: ' + message);
};
