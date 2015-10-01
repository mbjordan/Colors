var Colors = require('./src/index');

if ('undefined' !== typeof module && module.exports) {
    module.exports = Colors;
    return;
}

if (typeof define === 'function' && define.amd) {
    define(function() {
        return Colors;
    });
    return;
}

window.jupiter = Colors;
