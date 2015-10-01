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
