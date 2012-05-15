/*
  Updated rgb2hex function
  Using: Colors.rgb2hex(153) will now return: #999999 - instead of the old: 99 (No hash mark)	
*/

function rgb2hex(r, g, b) {
    r = (r < 10 ? '0' : '') + r.toString(16);
    g = (g !== undefined) ? (g < 10 ? '0' : '') + g.toString(16) : r;
    b = (b !== undefined) ? (b < 10 ? '0' : '') + b.toString(16) : r;
    return '#' + r + g + b;
}
