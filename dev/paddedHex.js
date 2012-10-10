/*
  Added paddedHex function (internal)
  The previous method checked for the length of the number before conversion.
  This will allow checking both before and after conversion, making sure the returned hex has 2 chars.
*/
function paddedHex(n) {
    var hex = ((n < 10) ? '0' : '') + n.toString(16);
    return (hex.length === 1) ? '0' + hex : hex;
}
