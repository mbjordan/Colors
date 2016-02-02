var hexChars = '0123456789abcdef';

var hexMode = function() {
    var returnString = '';
    var idx = 0;
    var randChar;

    while (idx < 6) {
        randChar = Math.floor(Math.random() * hexChars.length);
        returnString += hexChars.substring(randChar, randChar + 1);
        idx += 1;
    }

    return '#' + returnString;
};

var rand = function(hexMode) {
    if (!!hexMode) return hexMode();

    return [
        Math.floor(Math.random() * (0 - 255 + 1) + 255),
        Math.floor(Math.random() * (0 - 255 + 1) + 255),
        Math.floor(Math.random() * (0 - 255 + 1) + 255)
    ];
};

module.exports = rand;
