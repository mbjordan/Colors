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
        expect(typeof hex2rgb).toBe('function');
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

    it('Should return RBG value of passed hex of 1', function(done) {
        expect(hex2rgb('#ff')).toEqual(255);
        done();
    });


    it('Should return RBG value of passed hex of 1 - WITHOUT hash', function(done) {
        expect(hex2rgb('ff')).toEqual(255);
        done();
    });
});
