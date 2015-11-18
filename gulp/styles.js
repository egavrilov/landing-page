'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

gulp.task('styles', function () {
  var sassOptions = {
    includePaths: [
      'bower_components',
      path.join(conf.paths.src, '/app')
    ]
  };

  var injectFiles = gulp.src([
    path.join(conf.paths.src, '/app/fonts.scss'),
    path.join(conf.paths.src, '/app/**/*.{sass,scss}'),
    path.join('!' + conf.paths.src, '/app/index.sass')
  ], {read: false});

  var injectOptions = {
    transform: function (filePath) {
      filePath = filePath.replace(conf.paths.src + '/app/', '');
      return '@import "' + filePath + '";';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };


  return gulp.src([
      path.join(conf.paths.src, '/app/index.sass')
    ])
    .pipe($.inject(injectFiles, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe($.sass(sassOptions).on('error', $.sass.logError))
    .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app/')))
    .pipe(browserSync.reload({stream: true}));
});
