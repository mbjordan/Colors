var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

gulp.task('build', function() {
    var b = browserify({
        entries: './index.js',
        debug: true
    });

    return b.bundle()
        .pipe(source('colors.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(uglify())
        .on('error', gutil.log)
        // .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/'));
});
