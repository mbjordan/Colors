var rewire = require('rewire');

describe('utils', function() {
    var utils;
    var simpleReturnFn;

    beforeEach(function() {
        utils = rewire('../src/utils');
        simpleReturnFn = function(a) {
            return a;
        };
    });

    it('Should be an object', function(done) {
        expect(utils).toEqual(jasmine.any(Object));
        done();
    });

    describe('paddedHex', function() {
        it('Should always return with 2 digits', function(done) {
            expect(utils.paddedHex(1)).toBe('01');
            expect(utils.paddedHex(30)).toBe('1e');
            expect(utils.paddedHex('a')).toBe('0a');
            expect(utils.paddedHex('ca')).toBe('ca');
            done();
        });
    });

    describe('parseHexColor', function() {
        var parseHexColor;

        beforeEach(function() {
            parseHexColor = utils.parseHexColor;
        });

        it('Should take a 3 digit hex and return a 6 digit hex - no hash', function(done) {
            expect(parseHexColor('e1d')).toBe('ee11dd');
            done();
        });

        it('Should take a 3 digit hex and return a 6 digit hex - w/ hash', function(done) {
            expect(parseHexColor('#f0a')).toBe('ff00aa');
            done();
        });

        it('Should take a 6 digit hex and return the same 6 digit hex - no hash', function(done) {
            expect(parseHexColor('dd22cc')).toBe('dd22cc');
            done();
        });

        it('Should take a 6 digit hex and return the same 6 digit hex - w/ hash', function(done) {
            expect(parseHexColor('#aa66ff')).toBe('aa66ff');
            done();
        });
    });

});
