var hsv2rgb = function(HSV, S, V) {
    var rgb = [],
        h, s, v, hi, f, p, q, t;

    if (typeof HSV == 'object') {
        h = HSV[0];
        s = HSV[1];
        v = HSV[2];
    } else {
        h = HSV;
        s = S;
        v = V;
    }
    s = s / 100;
    v = v / 100;
    hi = Math.floor((h / 60) % 6);
    f = (h / 60) - hi;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (hi) {
        case 0:
            rgb = [v, t, p];
            break;
        case 1:
            rgb = [q, v, p];
            break;
        case 2:
            rgb = [p, v, t];
            break;
        case 3:
            rgb = [p, q, v];
            break;
        case 4:
            rgb = [t, p, v];
            break;
        case 5:
            rgb = [v, p, q];
    }

    return [
        Math.min(255, Math.floor(rgb[0] * 256)),
        Math.min(255, Math.floor(rgb[1] * 256)),
        Math.min(255, Math.floor(rgb[2] * 256))
    ];
};

module.exports = hsv2rgb;
