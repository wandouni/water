var gulp = require('gulp'),
  less = require('gulp-less'),
  minifycss = require('gulp-minify-css'),
  livereload = require('gulp-livereload'),
  autoprefixer = require('gulp-autoprefixer'),
  cache = require('gulp-cache'),
  concat = require('gulp-concat'),
  imagemin = require('gulp-imagemin'),
  notify = require('gulp-notify'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  del = require('del'),
  jshint = require('gulp-jshint');

gulp.task('style', function () {
  /*less编译，自动前缀，重命名，压缩*/
  gulp.src('src/less/*.less')
    .pipe(less())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('static/style'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css/'))
    .pipe(notify({message: 'style done!'}));
});

gulp.task('javascript', function () {
  /*js 重命名 代码压缩*/
  gulp.src('src/js/*.js')
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'))
    .pipe(notify({message: 'js done!'}));
});

gulp.task('watch', function () {
  /*监听less文件，一变化，就执行style task*/
  gulp.watch('src/less/*.less', ['style']);

  /*开启浏览器端的监听模式*/
  livereload.listen();

  /*css文件变化时，在浏览器端自动刷新*/
  gulp.watch('dist/css/*.css').on('change', livereload.changed);
});

gulp.task('default', ['watch'], function () {
  // gulp.start('style', 'javascript');
  gulp.start('style');
});



