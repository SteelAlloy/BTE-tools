const { src, dest, series } = require('gulp')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const bro = require('gulp-bro')
const fs = require('fs')
const path = require('path')

const files = ['tpll', 'tpdms', 'draw', 'list', 'help']

exports.default = series(bundle, copyData)

function bundle () {
  return src(`src/+(${files.join('|')}).js`)
    .pipe(bro())
    .pipe(babel())
    .pipe(uglify())
    .pipe(dest('craftscripts/'))
}

function copyData (cb) {
  fs.mkdirSync(path.resolve(__dirname, './craftscripts/data'))
  fs.copyFileSync(path.resolve(__dirname, './src/data/conformal.txt'), path.resolve(__dirname, './craftscripts/data/conformal.txt'))
  cb()
}
