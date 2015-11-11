var hexChars = '0123456789abcdef';

function hexMode() {
    var returnString = '';
    var idx = 0;
    var randChar;

    while (idx < 6) {
        randChar = Math.floor(Math.random() * hexChars.length);
        returnString += hexChars.substring(randChar, randChar + 1);
        idx += 1;
    }

    return '#' + returnString;
}

// ### rand method
//
// Get a random color in either hexadecimal or RGB color modes.
//
// `rand ( [color mode] )`
function rand(mode) {
    if (!mode || mode === 'hex') return hexMode();

    return [
        Math.floor(Math.random() * (0 - 255 + 1) + 255),
        Math.floor(Math.random() * (0 - 255 + 1) + 255),
        Math.floor(Math.random() * (0 - 255 + 1) + 255)
    ];
}

module.exports = rand;
