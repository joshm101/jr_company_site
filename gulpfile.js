const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const sass = require('gulp-sass');
const tscConfig = require('./tsconfig.json');
const Builder = require('systemjs-builder');

// clean the contents of the distribution directory
gulp.task('clean', function() {
  return del('src/scripts/*');
});

// TypeScript --> JavaScript "transpilation"
gulp.task('compile', ['clean', 'copy:libs', 'sass'], function() {
  return gulp
    .src([
      'src/ts/**/*.ts'
      ])
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(gulp.dest('src/ts'));
});

gulp.task('sass', function() {
  return gulp.src('src/stylesheets/theme.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/stylesheets/'))
});

gulp.task('copy:libs', ['clean', 'copy:css'], function() {
  return gulp.src([
    'node_modules/angular2/bundles/angular2-polyfills.js',
    'node_modules/systemjs/dist/system.js',
    'node_modules/systemjs/dist/system.js.map',
    'node_modules/rxjs/bundles/Rx.js',
    'node_modules/angular2/bundles/angular2.dev.js',
    'node_modules/angular2/bundles/router.dev.js',
    'node_modules/jquery/dist/jquery.*js',
    'node_modules/bootstrap/dist/js/bootstrap.*js',
    'node_modules/reflect-metadata/temp/Reflect.js',
    'node_modules/reflect-metadata/temp/Reflect.js.map',
    'node_modules/zone.js/dist/zone.js',
    'node_modules/hammerjs/hammer.js'
  ])
    .pipe(gulp.dest('src'))
});

gulp.task('copy:css', function() {
  return gulp.src([
    'node_modules/bootstrap/dist/css/bootstrap.css'
  ])
    .pipe(gulp.dest('src/stylesheets'))
});


// Generate systemjs-based bundle (app/app.js)
gulp.task('bundle', ['compile'], function(cb) {
  var builder = new Builder('./', 'systemjs.config.js');
  builder.buildStatic('src/ts/main.js', 'src/bundle.js', {
    globalName: 'App'
  })
    .then(function(result) {
      cb()
    })
    .catch(function(error) {
      cb(new Error(error));
    });
});

gulp.task('build', ['bundle']);
gulp.task('default', ['build']);
