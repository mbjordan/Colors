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
