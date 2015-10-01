var Utils = require('./utils');

// ### rand method
//
// Get a random color in either hexadecimal or RGB color modes.
//
// `rand ( [color mode] )`
function rand(mode) {
    var R, G, B;

    if (mode === 'hex' || mode === undefined) {
        var chars = '0123456789abcdef',
            string_length = 6,
            hexStr = '',
            rnum, i;

        for (i = 0; i < string_length; i++) {
            rnum = Math.floor(Math.random() * chars.length);
            hexStr += chars.substring(rnum, rnum + 1);
        }
        return '#' + hexStr;
    }

    if (mode == 'rgb') {
        R = Math.floor(Math.random() * (0 - 255 + 1) + 255);
        G = Math.floor(Math.random() * (0 - 255 + 1) + 255);
        B = Math.floor(Math.random() * (0 - 255 + 1) + 255);
        return Utils.render([R, G, B], 'rgb');
    }
}


module.exports = rand;
