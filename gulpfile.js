var gulp = require('gulp');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var nodemon = require('gulp-nodemon');
var htmlmin = require('gulp-htmlmin');
var angularTemplateCache = require('gulp-angular-templatecache');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var addStream = require('add-stream');
var jshint = require('gulp-jshint');

function isProduction() {
  return gutil.env.type === 'production';
}

function prepareTemplates() {
  return gulp.src('./client/app/**/*.tpl.html')
    .pipe(isProduction() ? htmlmin({collapseWhitespace: true}) : gutil.noop())
    .pipe(angularTemplateCache());
}

gulp.task('app', function () {
  return gulp.src('./client/app/**/*.js')
    .pipe(addStream.obj(prepareTemplates()))
    .pipe(concat('app.js'))
    .pipe(isProduction() ? ngAnnotate() : gutil.noop())
    .pipe(isProduction() ? uglify() : gutil.noop())
    .pipe(gulp.dest('./dist'));
});

gulp.task('html', function () {
  return gulp.src('./client/app/*.html')
    .pipe(isProduction() ? htmlmin({collapseWhitespace: true}) : gutil.noop())
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass', function () {
  return gulp.src('./client/sass/**/*.scss')
    .pipe(sass())
    .pipe(isProduction() ? cleanCss() : gutil.noop())
    .pipe(gulp.dest('./dist/assets/styles'));
});

gulp.task('assets', function () {
  return gulp.src('./client/assets/**/*')
    .pipe(gulp.dest('./dist/assets'));
});

gulp.task('lint', function() {
  return gulp.src(['./client/**/*.js', './server/**/*.js', './gulpfile.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', function () {
  gulp.watch(['./client/**/*.js', './server/**/*.js', './gulpfile.js'], ['lint']);
  gulp.watch(['./client/app/**/*.js', './client/app/**/*.tpl.html'], ['app']);
  gulp.watch('./client/app/*.html', ['html']);
  gulp.watch('./client/assets/**/*', ['assets']);
  gulp.watch('./client/sass/**/*.scss', ['sass']);
});

gulp.task('nodemon', function () {
  return nodemon({
    script: './server/bin/www',
    ext: 'js',
    ignore: [
      'client/',
      'node_modules/'
    ],
    env: {'NODE_ENV': 'development'}
  });
});

gulp.task('build', ['lint', 'assets', 'sass', 'html', 'app']);
gulp.task('run', ['watch', 'nodemon']);
gulp.task('default', ['build', 'run']);
