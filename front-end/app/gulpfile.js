var gulp = require('gulp');
var shell = require('gulp-shell');
var clean = require('gulp-clean');
var flatten = require('gulp-flatten');
var less = require('gulp-less');
var htmlreplace = require('gulp-html-replace');
var runSequence = require('run-sequence');
var Builder = require('systemjs-builder');
var builder = new Builder('', 'systemjs.config.js');

var bundleHash = new Date().getTime();
var mainBundleName = bundleHash + '.main.bundle.js';
var vendorBundleName = bundleHash + '.vendor.bundle.js';


////////////////////////////////////////////////////
// This is main task for production use
////////////////////////////////////////////////////
gulp.task('dist', function(done) {
    runSequence('clean', 'compile_ts', 'compile_less', 'bundle', 'copy_templates', 'copy_assets', function() {
        done();
    });
});


/**********************************************
 *  Clean tasks
 **********************************************/

gulp.task('clean', ['clean:ts', 'clean:dist']);

gulp.task('clean:dist', function () {
    return gulp.src(['./dist'], {read: false})
        .pipe(clean());
});

gulp.task('clean:ts', function () {
    return gulp.src(['./studio/**/*.js', './studio/**/*.js.map'], {read: false})
        .pipe(clean());
});


/**********************************************
 *  Compile typescript and less
 **********************************************/

gulp.task('compile_ts', ['clean:ts'], shell.task([
    'tsc'
]));

gulp.task('compile_less', function () {
    return gulp.src(['./studio/**/*.less', './assets/**/*.less'])
        .pipe(less())
        .pipe(gulp.dest('./dist'));
});

/**********************************************
 *  Bundle vendor and app code
 **********************************************/

gulp.task('bundle', ['bundle:vendor', 'bundle:studio'], function () {
    return gulp.src('index.html')
        .pipe(htmlreplace({
            'studio': mainBundleName,
            'vendor': vendorBundleName
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('bundle:vendor', function () {
    return builder
        .buildStatic('studio/vendor.js', './dist/' + vendorBundleName)
        .catch(function (err) {
            console.log('Vendor bundle error');
            console.log(err);
        });
});

gulp.task('bundle:studio', function () {
    return builder
        .buildStatic('studio/main.js', './dist/' + mainBundleName)
        .catch(function (err) {
            console.log('Studio bundle error');
            console.log(err);
        });
});


/**********************************************
 *  Copy component resources to dist
 **********************************************/

gulp.task('copy_templates', function () {
    return gulp.src(['studio/**/*.html', 'studio/**/*.css', 'studio/**/*.less'])
        .pipe(flatten())
        .pipe(gulp.dest('./dist'));
});


/**********************************************
 *  Copy misc assets
 **********************************************/

gulp.task('copy_assets', function() {
    return gulp.src(['./assets/**/*'], {base:"."})
        .pipe(gulp.dest('./dist'));
});
