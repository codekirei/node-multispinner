'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
let gulp = require('gulp')
let plumber = require('gulp-plumber')
let mocha = require('gulp-mocha')

//----------------------------------------------------------
// Tasks
//----------------------------------------------------------
gulp.task('test', () => {
  return gulp.src(['test/**/*.js'], {read: false})
    .pipe(plumber())
    .pipe(mocha({reporter: 'min'}))
})

gulp.task('test:watch', () => {
  gulp.watch([
    'lib/**/*.js',
    'test/*.js',
    'index.js'
  ], ['test'])
})

gulp.task('default', ['test:watch'])
