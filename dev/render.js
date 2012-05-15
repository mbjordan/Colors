/**
    New render function to reduce filesize.
    244 bytes minified (177 bytes min & gzipped)
*/

function render(map, type) { // Internal Function
    var rtn = [],
        k;
    if (typeof map != 'object') {
        return;
    }
    if (type === 'rgb') {
        k = ['R', 'G', 'B', 'RGB'];
    }
    if (type === 'hsv') {
        k = ['H', 'S', 'V', 'HSV'];
    }
    if (type === 'hsl') {
        k = ['H', 'S', 'L', 'HSL'];
    }
    rtn[k[0]] = map[0];
    rtn[k[1]] = map[1];
    rtn[k[2]] = map[2];
    rtn[k[3]] = map[0] + ' ' + map[1] + ' ' + map[2];
    rtn.a = map;
    return rtn;
}
