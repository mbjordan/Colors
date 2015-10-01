var Utils = require('./utils');

function rgb2hex(r, g, b) {
    r = Utils.paddedHex(r);
    g = (g !== undefined) ? Utils.paddedHex(g) : r;
    b = (b !== undefined) ? Utils.paddedHex(b) : r;

    return '#' + r + g + b;
}

module.exports = rgb2hex;
