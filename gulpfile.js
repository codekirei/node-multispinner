'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
let gulp = require('gulp')
let mocha = require('gulp-mocha')

//----------------------------------------------------------
// Tasks
//----------------------------------------------------------
gulp.task('test', () => {
  return gulp.src(['test/*.js'], {read: false})
    .pipe(mocha())
})

gulp.task('test:watch', () => {
  gulp.watch([
    'lib/**/*.js',
    'test/**/*.js',
    'index.js'
  ], ['test'])
})

gulp.task('default', ['test:watch'])
