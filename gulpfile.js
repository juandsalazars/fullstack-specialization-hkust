'use strict';

var gulp = require('gulp'),
    gulp_sass = require('gulp-sass')(require('node-sass')),
    browserSync = require('browser-sync');

function sass () {
  return gulp.src('./css/*.scss')
    .pipe(gulp_sass().on('error', gulp_sass.logError))
    .pipe(gulp.dest('./css'));
}

function sassWatch () {
  gulp.watch('./css/*.scss', sass);
}

function browser_sync () {
   var files = [
      './*.html',
      './css/*.css',
      './img/*.{png,jpg,gif}',
      './js/*.js'
   ];

   browserSync.init(files, {
      server: {
         baseDir: "./"
      }
   });

}

// Default task
exports.default = gulp.parallel(sassWatch, browser_sync);
