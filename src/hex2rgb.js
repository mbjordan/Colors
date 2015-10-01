var Utils = require('./utils');

function hex2rgb(h) {
    h = h.replace(/^\#/, '');

    if (h.length === 6) {
        var rgbArr = [
            parseInt(h.substr(0, 2), 16),
            parseInt(h.substr(2, 2), 16),
            parseInt(h.substr(4, 2), 16)
        ];

        return Utils.render(rgbArr, 'rgb');
    }

    return parseInt(h, 16);
}

module.exports = hex2rgb;
