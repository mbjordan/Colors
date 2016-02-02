var name2hex = require('./name2hex');
var hex2rgb = require('./hex2rgb');

var name2rgb = function(name) {
    return hex2rgb(name2hex(name));
};

module.exports = name2rgb;
