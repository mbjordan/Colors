//## Internal Utilities
// ###Render method
//
// `render(map, type)`
//
// `map` is an object of data to render, `type` can be RGB, HSV or HSL
//
// TODO: This function is outdated and could be written better
module.render = function render(map, type) {
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
module.paddedHex = function paddedHex(n) {
    var hex = (n < 10) ? '0' : '';

    hex += n.toString(16);

    return (hex.length === 1) ? '0' + hex : hex;
};

module.round = function round(points) {
    points = points || 10;
    return parseFloat(this.toFixed(points));
};

module.hexRegexMatch = function hexRegexMatch(c) {
    return /^\x23[a-f0-9]{3}([a-f0-9]{3})?$/i.test(c);
};
