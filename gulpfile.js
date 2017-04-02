const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const sass = require('gulp-sass');
const tscConfig = require('./tsconfig.json');
const tscAotConfig = require('./tsconfig-aot.json');
const inlineNg2Template = require('gulp-inline-ng2-template');
const Builder = require('systemjs-builder');
const runSequence = require('run-sequence');
const uglify = require('gulp-uglify');

var flags = {
    production: false
};

gulp.task('production', function () {
  flags.production = true;
});

// delete old JS
gulp.task('clean', function() {
  return del(['src/ts/**/*.js', 'src/ts/**/*.ngsummary.json', 'src/ts/**/*.js.map', 'src/ts/**/*.ngfactory.ts'])
})

// TypeScript --> JavaScript "transpilation"
gulp.task('compile', function() {
  return gulp
    .src([
      'src/ts/**/*.ts'
      // don't include aot main file if we aren't building production
      // don't include jit main file if we aren't building dev
      ].concat(flags.production ? [] : ['!src/ts/main-aot.ts']))
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(inlineNg2Template({
      target: 'es5',
      useRelativePaths: true
    }))
    .pipe(gulp.dest('src/ts'));
});

gulp.task('compile-aot', function () {
    return gulp
      .src('aot/**/*.ts')
      .pipe(typescript(tscAotConfig.compilerOptions))
      .pipe(inlineNg2Template({
          target: 'es5',
          useRelativePaths: true
      }))
      .pipe(gulp.dest('aot'));
});

gulp.task('sass', function() {
  return gulp.src('src/stylesheets/theme.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/stylesheets/'))
});

gulp.task('copy:libs', ['copy:css'], function() {
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

var builder = new Builder('./', 'systemjs.config.js');
gulp.task('bundle', function(cb) {
  return builder.buildStatic(flags.production ? 'src/ts/main-aot.js' : 'src/ts/main-jit.js', 'src/bundle.js', {
    globalName: (flags.production ? 'aot' : 'jit')
  })
});

gulp.task('compress', function() {
  return gulp.src('src/bundle.js').pipe(uglify()).pipe(gulp.dest('src')) 
});

gulp.task('build', function() {
  runSequence('clean', 'copy:libs', 'sass', 'compile', 'bundle');
});
gulp.task('default', ['build']);
gulp.task('build-prod', function() {
  runSequence('clean', 'production', 'copy:libs', 'sass', 'compile', 'compile-aot', 'bundle', 'compress');
})
