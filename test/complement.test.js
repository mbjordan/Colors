var rewire = require('rewire');

describe('complement', function() {
    var complement;
    var simpleReturnFn;

    beforeEach(function() {
        complement = rewire('../src/complement');
        simpleReturnFn = function(a) {
            return a;
        };
    });

    it('Should be a function', function(done) {
        expect(complement).toEqual(jasmine.any(Function));
        done();
    });

    it('Should return the same string passed when only passed a string', function(done) {
        var str = 'complement';

        complement.__set__('Utils', {
            'hexRegexMatch': simpleReturnFn.bind(null, true)
        });

        complement.__set__('stringHandler', function(a) {
            return a;
        });

        expect(complement(str)).toBe(str);

        done();
    });

    it('Should return an Array when passed a 3 args', function(done) {
        var arr = ['A1', 'A2', 'A3'];

        complement.__set__('subFrom255', simpleReturnFn);

        expect(complement('A1', 'A2', 'A3')).toEqual(arr);
        done();
    });

    it('Should return with #ffffff when passed #000000', function(done) {
        expect(complement('#ffffff')).toBe('#000000');
        done();
    });

    it('Should return with #fff when passed #000000', function(done) {
        expect(complement('#fff')).toBe('#000000');
        done();
    });

    it('Should return with [0, 0, 0] when passed (255, 255, 255)', function(done) {
        expect(complement(255, 255, 255)).toEqual([0, 0, 0]);
        done();
    });

    it('Should throw error if not passed any args', function(done) {
        expect(function() {
            return complement();
        }).toThrow();
        done();
    });

    describe('subFrom255', function() {
        var subFrom255;

        beforeEach(function() {
            subFrom255 = complement.__get__('subFrom255');
            complement.__set__('Utils', {
                'paddedHex': simpleReturnFn
            });
        });

        it('Should return 155 when passed 100', function(done) {
            expect(subFrom255(100)).toBe(155);
            done();
        });

        it('Should return 55 when passed 200', function(done) {
            expect(subFrom255(200)).toBe(55);
            done();
        });

        it('Should return -45 when passed 300', function(done) {
            expect(subFrom255(300)).toBe(-45);
            done();
        });
    });

    describe('getColorSubset', function() {
        var getColorSubset;

        beforeEach(function() {
            getColorSubset = complement.__get__('getColorSubset');
            complement.__set__('subFrom255', simpleReturnFn);
            complement.__set__('Utils', {
                'paddedHex': simpleReturnFn
            });
            complement.__set__('hex2rgb', simpleReturnFn);
        });

        it('Should return a string trimmed at the specified index', function(done) {
            var str = 'aabbcc';

            expect(getColorSubset(str, 0)).toBe('aa');
            expect(getColorSubset(str, 2)).toBe('bb');
            expect(getColorSubset(str, 4)).toBe('cc');
            done();
        });
    });

    describe('stringHandler', function() {
        var stringHandler;

        beforeEach(function() {
            stringHandler = complement.__get__('stringHandler');
            complement.__set__('getColorSubset', simpleReturnFn);
            complement.__set__('Utils', {
                'parseHexColor': simpleReturnFn
            });
        });

        it('Should return a string with the passed string appended twice with a hash prepended', function(done) {
            var str = 'a1';
            expect(stringHandler(str)).toBe('#' + str + str + str);
            done();
        });
    });

    describe('getFormattedArr', function() {
        var getFormattedArr;

        beforeEach(function() {
            getFormattedArr = complement.__get__('getFormattedArr');
            complement.__set__('subFrom255', simpleReturnFn);
        });

        it('Should return an array with three passed arguments', function(done) {
            var a0 = 'arg0';
            var a1 = 'arg1';
            var a2 = 'arg2';

            expect(getFormattedArr(a0, a1, a2)).toEqual([a0, a1, a2]);
            done();
        });
    });
});
