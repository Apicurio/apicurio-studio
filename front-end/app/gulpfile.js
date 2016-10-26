var gulp = require('gulp');
var ts = require('gulp-typescript');
var inlineNg2Template = require('gulp-inline-ng2-template');
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
    runSequence('clean', 'compile_less', 'compile_ts', 'bundle', 'copy_assets', function() {
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

gulp.task('clean:css', function () {
    return gulp.src(['./studio/**/*.css', './assets/**/*.css'], {read: false})
        .pipe(clean());
});


/**********************************************
 *  Compile typescript and less
 **********************************************/

gulp.task('compile_less', ['clean:css'], function(done) {
    runSequence('compile_less:assets', 'compile_less:studio', function() {
        done();
    });
});

gulp.task('compile_less:assets', function () {
    return gulp.src(['./assets/**/*.less'])
        .pipe(less())
        .pipe(gulp.dest('./assets'));
});

gulp.task('compile_less:studio', function () {
    return gulp.src(['./studio/**/*.less'])
        .pipe(less())
        .pipe(gulp.dest('./studio'));
});

gulp.task('compile_ts', function () {
	return gulp.src(['typings/index.d.ts', 'studio/**/*.ts'], {base: './studio'})
		.pipe(inlineNg2Template({
			base: './studio',
			useRelativePaths: true
		}))
		.pipe(ts({
			"target": "es5",
			"module": "commonjs",
			"moduleResolution": "node",
			"sourceMap": true,
			"emitDecoratorMetadata": true,
			"experimentalDecorators": true,
			"removeComments": false,
			"noImplicitAny": false
		}))
        .pipe(gulp.dest('studio'));
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
 *  Copy misc assets
 **********************************************/

gulp.task('copy_assets', function() {
    return gulp.src(['./assets/**/*'], {base:"."})
        .pipe(gulp.dest('./dist'));
});
