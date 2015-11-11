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
