var Colors = require('./src/index');

if ('undefined' === typeof window) {
    if ('undefined' !== typeof module && module.exports) {
        module.exports = Colors;
        return;
    }
}

if ('function' === typeof define && define.amd) {
    return define(function() {
        return Colors;
    });
}

window.Colors = window.$c = Colors;
