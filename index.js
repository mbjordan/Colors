var Colors = require('./src/index');

if ('undefined' === typeof window) {
    if ('undefined' !== typeof module && module.exports) {
        module.exports = Colors;
        return;
    }
}

if ('function' === typeof define && define.amd) {
    define(function() {
        return Colors;
    });
    return;
}

window.ColorsTmp = Colors;
