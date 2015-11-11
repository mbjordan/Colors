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
