var browserify = require('browserify');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

gulp.task('build', function() {
    var b = browserify({
        entries: './index.js',
        debug: true
    });

    // First, create unminified file
    b.bundle()
        .pipe(source('colors.js'))
        .pipe(buffer())
        .on('error', gutil.log)
        .pipe(gulp.dest('./dist/'));

    // Then, create minified file
    return b.bundle()
        .pipe(source('colors.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(gulp.dest('./dist/'));
});
