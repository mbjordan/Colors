/**
    New render function to reduce filesize.
    280 bytes minified (201 bytes min & gzipped)
*/

render: function (map, type) { // Internal Function
    var r = [map[0], map[1], map[2]], rtn = [];
    if (typeof map != 'object') {
        return;
    }
    if (type == 'rgb') {
        var k = ['R', 'G', 'B', 'RGB'];
    }
    if (type == 'hsv') {
        var k = ['H', 'S', 'V', 'HSV'];
    }
    if (type == 'hsl') {
        var k = ['H', 'S', 'L', 'HSL'];
    }
    rtn[k[0]] = r[0];
    rtn[k[1]] = r[1];
    rtn[k[2]] = r[2];
    rtn[k[3]] = r[0] + ' ' + r[1] + ' ' + r[2];
    rtn['a'] = [r[0], r[1], r[1]]; // Need a better way to do this.
    return rtn;
}

