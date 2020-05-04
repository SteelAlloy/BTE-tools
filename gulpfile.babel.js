const { src, dest, series } = require('gulp')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const browserify = require('gulp-bro')
const fs = require('fs')
const path = require('path')

exports.default = series(bundle, copyData)

function bundle () {
  return src('src/*.js')
    .pipe(browserify())
    .pipe(babel())
    .pipe(uglify())
    .pipe(dest('craftscripts/'))
}

function copyData (cb) {
  fs.mkdir(path.resolve(__dirname, './craftscripts/data'), (err) => {
    if (err.code !== 'EEXIST') throw err
    fs.copyFile(path.resolve(__dirname, './src/data/conformal.txt'), path.resolve(__dirname, './craftscripts/data/conformal.txt'), (err) => {
      if (err) throw err
      cb()
    })
  })
}
