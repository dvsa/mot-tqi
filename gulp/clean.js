/*
  clean.js
  ===========
  removes folders:
    - public
    - govuk_modules
*/
const config = require('./config.json')
const del = require('del')
const gulp = require('gulp')

gulp.task('clean', function (done) {
  return del([config.paths.public + '/*',
    '.port.tmp'])
})
