const { src, dest, parallel } = require('gulp')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
var concat = require('gulp-concat')

exports.default = parallel(requireProjection('tpll.js'), requireProjection('tpdms.js'))

function requireProjection (file) {
  return function requireProjection () {
    return src('src/projection.js')
      .pipe(src('src/' + file))
      .pipe(babel())
      .pipe(uglify())
      .pipe(concat(file))
      .pipe(dest('craftscripts/'))
  }
}
