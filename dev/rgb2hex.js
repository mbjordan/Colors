/*
  Updated rgb2hex function
*/

function rgb2hex(r, g, b) {
    if (g === undefined && b === undefined) {
        var value = r.toString(16);
        var hex = '#' + value + value + value;
        if (hex.length == 1) {
            hex = '0' + hex;
        }
        return hex;
    } else {
        var rgbv = [r, g, b],
            h = '#';
        for (var x = 0; x < rgbv.length; x++) {
            var hex = rgbv[x].toString(16);
            if (hex.length == 1) {
                hex = '0' + hex;
            }
            h = h + hex;
        }
        return h;
    }
}
