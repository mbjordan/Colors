var hex2rgb = function(h) {
    h = h.replace(/^\#/, '');

    if (h.length === 6) {
        return [
            parseInt(h.substr(0, 2), 16),
            parseInt(h.substr(2, 2), 16),
            parseInt(h.substr(4, 2), 16)
        ];
    }

    if (h.length === 3) {
        return [
            parseInt(h.substr(0, 1) + h.substr(0, 1), 16),
            parseInt(h.substr(1, 1) + h.substr(1, 1), 16),
            parseInt(h.substr(2, 1) + h.substr(2, 1), 16)
        ];
    }

    return parseInt(h, 16);
};

module.exports = hex2rgb;
