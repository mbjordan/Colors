var util = require('util');
var browserify = require('browserify');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var insert = require('gulp-insert');
var pack = require('./package.json');

var getLicense = function() {
    var fmt = util.format;

    var lines = [
        fmt('// %s - v%s', pack.name, pack.version),
        fmt('// Copyright 2012-%s %s', new Date().getFullYear(), pack.author),
        fmt('// %s License', pack.license),
        '' // KEEP this empty line
    ];

    return lines.join('\n');
};

var buildFn = function() {
    var b = browserify({
        entries: './index.js',
        debug: true
    }).bundle();

    // First, create unminified file
    b.pipe(source('colors.js'))
        .pipe(buffer())
        .pipe(insert.prepend(getLicense()))
        .on('error', gutil.log)
        .pipe(gulp.dest('./dist/'));

    // Then, create minified file
    return b.pipe(source('colors.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(insert.prepend(getLicense()))
        .on('error', gutil.log)
        .pipe(gulp.dest('./dist/'));
};

gulp.task('build', buildFn);
