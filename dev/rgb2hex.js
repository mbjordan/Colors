/*
  Updated rgb2hex function
  Now uses the global paddedHex() function to return a valid hex.
*/
function rgb2hex(r, g, b) {
    r = paddedHex(r);
    g = (g !== undefined) ? paddedHex(g) : r;
    b = (b !== undefined) ? paddedHex(b) : r;
    return '#' + r + g + b;
}
