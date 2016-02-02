var rewire = require('rewire');

describe('hex2rgb', function() {
    var hex2rgb;
    var simpleReturnFn;

    beforeEach(function() {
        hex2rgb = rewire('../src/hex2rgb');
        simpleReturnFn = function(a) {
            return a;
        };
    });

    it('Should be a function', function(done) {
        expect(hex2rgb).toEqual(jasmine.any(Function));
        done();
    });

    it('Should return RBG value of passed hexof 6', function(done) {
        expect(hex2rgb('#ffffff')).toEqual([255, 255, 255]);
        done();
    });

    it('Should return RBG value of passed hexof 6 - WITHOUT hash', function(done) {
        expect(hex2rgb('ffffff')).toEqual([255, 255, 255]);
        done();
    });

    it('Should return RBG value of passed hex of 3', function(done) {
        expect(hex2rgb('#fff')).toEqual([255, 255, 255]);
        done();
    });

    it('Should return RBG value of passed hex of 3 - WITHOUT hash', function(done) {
        expect(hex2rgb('fff')).toEqual([255, 255, 255]);
        done();
    });

    it('Should return RBG value of passed hex of 2', function(done) {
        expect(hex2rgb('#ff')).toEqual(255);
        done();
    });


    it('Should return RBG value of passed hex of 2 - WITHOUT hash', function(done) {
        expect(hex2rgb('ff')).toEqual(255);
        done();
    });

    describe('hexToInt', function() {
        var hexToInt;

        beforeEach(function() {
            hexToInt = hex2rgb.__get__('hexToInt');
        });

        it('Should be a function', function(done) {
            expect(hexToInt).toEqual(jasmine.any(Function));
            done();
        });

        it('Should return an integer when passed a hex value', function(done) {
            expect(hexToInt('2e')).toBe(46);
            expect(hexToInt('ff')).toBe(255);
            expect(hexToInt('00')).toBe(0);
            done();
        });
    });

    describe('getRgbSubset', function() {
        var getRgbSubset;
        var hexStr;

        beforeEach(function() {
            getRgbSubset = hex2rgb.__get__('getRgbSubset');
            hexStr = 'eeffdd';

            hex2rgb.__set__('hexToInt', simpleReturnFn);
        });

        it('Should be a function', function(done) {
            expect(getRgbSubset).toEqual(jasmine.any(Function));
            done();
        });

        it('Should return trimmed results based on the idx(0)', function(done) {
            expect(getRgbSubset(hexStr, 0)).toBe('ee');
            done();
        });

        it('Should return trimmed results based on the idx(2)', function(done) {
            expect(getRgbSubset(hexStr, 2)).toBe('ff');
            done();
        });

        it('Should return trimmed results based on the idx(4)', function(done) {
            expect(getRgbSubset(hexStr, 4)).toBe('dd');
            done();
        });
    });

    describe('formatRgb', function() {
        var formatRgb;
        var hexStr;

        beforeEach(function() {
            formatRgb = hex2rgb.__get__('formatRgb');
            hexStr = 'eeffdd';

            hex2rgb.__set__('getRgbSubset', simpleReturnFn);
        });

        it('Should be a function', function(done) {
            expect(formatRgb).toEqual(jasmine.any(Function));
            done();
        });

        it('Should return an Array when called', function(done) {
            var results = formatRgb(hexStr);

            expect(results).toEqual(jasmine.any(Array));
            expect(results.length).toBe(3);
            done();
        });

        it('Should return an Array with expected data', function(done) {
            expect(formatRgb(hexStr)).toEqual([hexStr, hexStr, hexStr]);
            done();
        });
    });
});
