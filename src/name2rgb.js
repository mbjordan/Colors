var Utils = require('./utils');

// ### name2rgb method
//
// Get an RGB object value of an HTML named color.
//
// `name2rgb ( 'color name' )`
function name2rgb(n) {
    var v = this.name2hex(n),
        t = /^[a-fA-F0-9#]{7}$/,
        icn = 'Invalid Color Name';

    if (t.test(v)) {
        return this.hex2rgb(v);
    }

    return Utils.render([icn, icn, icn], 'rgb');
}

module.exports = name2rgb;
