var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var globby = require('globby');
var through = require('through2');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var reactify = require('reactify');

gulp.task('build', function() {
    // gulp expects tasks to return a stream, so we create one here.
    var bundledStream = through();

    bundledStream
    // turns the output bundle stream into a stream containing
    // the normal attributes gulp plugins expect.
        .pipe(source('colors.js'))
        // the rest of the gulp task, as you would normally write it.
        // here we're copying from the Browserify + Uglify2 recipe.
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        // Add gulp plugins to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/'));

    // "globby" replaces the normal "gulp.src" as Browserify
    // creates it's own readable stream.
    globby(['./entries/*.js'], function(err, entries) {
        // ensure any errors from globby are handled
        if (err) {
            bundledStream.emit('error', err);
            return;
        }

        // create the Browserify instance.
        var b = browserify({
            entries: entries,
            debug: true,
            transform: [reactify]
        });

        // pipe the Browserify stream into the stream we created earlier
        // this starts our gulp pipeline.
        b.bundle().pipe(bundledStream);
    });

    // finally, we return the stream, so gulp knows when this task is done.
    return bundledStream;
});
