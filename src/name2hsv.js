var name2hex = require('./name2hex');
var hex2hsv = require('./hex2hsv');

var name2hsv = function(name) {
    return hex2hsv(name2hex(name));
};

module.exports = name2hsv;
