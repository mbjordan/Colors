/*
  Updated rgb2hex function
  Using: Colors.rgb2hex(153) will now return: #999999 - instead of the old: 99 (No hash mark)	
*/

function rgb2hex(r, g, b) {
    if (g === undefined && b === undefined) {
        var value = r.toString(16);
        if (value.length == 1) {
            value = '0' + value;
        }
        return '#' + value + value + value;
    } else {
        var rgbv = [r, g, b],
            h = '';
        for (var x = 0; x < rgbv.length; x++) {
            var hex = rgbv[x].toString(16);
            if (hex.length == 1) {
                hex = '0' + hex;
            }
            h += hex;
        }
        return '#' + h;
    }
}
