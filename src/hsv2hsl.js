var Utils = require('./utils');
var hsv2rgb = require('./hsv2rgb');

// ### hsv2hsl method
//
// Change HSV to an HSL object
//
// `hsv2hsl(HSV[, S, V])`
function hsv2hsl(H, S, V) {
    var h, s, l, _H, _S, _L, hsv, r1, g1, b1, maxColor, minColor;

    if (typeof H == 'object') {
        h = H[0];
        s = H[1];
        l = H[2];
    } else {
        h = H;
        s = S;
        l = V;
    }

    hsv = hsv2rgb(h, s, l);
    r1 = hsv.R / 255;
    g1 = hsv.G / 255;
    b1 = hsv.B / 255;
    maxColor = Math.max(r1, g1, b1);
    minColor = Math.min(r1, g1, b1);
    _L = (maxColor + minColor) / 2;
    _S = 0;
    _H = 0;
    if (maxColor != minColor) {
        if (_L < 0.5) {
            S = (maxColor - minColor) / (maxColor + minColor);
        } else {
            S = (maxColor - minColor) / (2.0 - maxColor - minColor);
        }
        if (r1 == maxColor) {
            H = (g1 - b1) / (maxColor - minColor);
        } else if (g1 == maxColor) {
            H = 2.0 + (b1 - r1) / (maxColor - minColor);
        } else {
            H = 4.0 + (r1 - g1) / (maxColor - minColor);
        }
    }
    _L = _L * 100;
    _S = _S * 100;
    _H = _H * 60;
    if (_H < 0) {
        _H += 360;
    }
    return Utils.render([Math.floor(H), Math.floor(S), Math.floor(V)], 'hsl');
}

module.exports = hsv2hsl;
