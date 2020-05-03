const { src, dest } = require('gulp')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const bro = require('gulp-bro')

const files = ['tpll', 'tpdms', 'draw']

exports.default = function () {
  return src(`src/+(${files.join('|')}).js`)
    .pipe(bro())
    .pipe(babel())
    .pipe(uglify())
    .pipe(dest('craftscripts/'))
}
