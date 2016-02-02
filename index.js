var colors = require('./src/index');

if ('undefined' === typeof window) {
    if ('undefined' !== typeof module && module.exports) {
        module.exports = colors;
        return;
    }
}

if ('function' === typeof define && define.amd) {
    return define(function() {
        return colors;
    });
}

window.Colors = window.$c = colors;
