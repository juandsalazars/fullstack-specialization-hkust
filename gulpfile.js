'use strict';

var gulp = require('gulp'),
    gulp_sass = require('gulp-sass')(require('node-sass')),
    browserSync = require('browser-sync'),
    rimraf = require('gulp-rimraf'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin');

function sass () {
  return gulp.src('./css/*.scss')
    .pipe(gulp_sass().on('error', gulp_sass.logError))
    .pipe(gulp.dest('./css'));
}

function sassWatch (cb) {
  gulp.watch('./css/*.scss', sass);
  cb();
}

function browser_sync (cb) {
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

   cb();
}

function clean () {
    return gulp.src('./dist', { read: false }) // much faster
   .pipe(rimraf());
}

function copyfonts (cb){
    gulp.src('./node_modules/font-awesome/fonts/**/*.*')
    .pipe(gulp.dest('./dist/fonts'));
    cb();
}

function image_min () {
    return gulp.src('img/*.{png,jpg,gif}')
    .pipe(imagemin({
        optimizationLevel: 3,
        progressive: true, 
        interlaced: true
    }))
    .pipe(gulp.dest('dist/img'));
}

function use_min () {
    return gulp.src('./*.html')
    .pipe(flatmap(function(stream, file){
        return stream
        .pipe(usemin({
            css: [rev()],
            html: [ function() {
                return htmlmin({collapseWhitespace: true})
            }],
            js: [uglify(), rev()],
            inlinejs: [uglify()],
            inlinecss: [cleanCss(), 'concat']
        }))
    }))
    .pipe(gulp.dest('./dist'));
}

exports.default = gulp.parallel(sassWatch, browser_sync);
exports.build = gulp.series(
    clean,
    gulp.parallel(copyfonts, image_min, use_min)
);