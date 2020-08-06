const { src, dest, task, parallel } = require('gulp')
const bro = require('gulp-bro')
const fs = require('fs').promises
const path = require('path')
const glob = require('glob')
const dotenv = require('dotenv')

const files = glob.sync('src/*.js')
dotenv.config()

for (let i = 0; i < files.length; i++) {
  task(path.basename(files[i], '.js'), () => {
    return bundle(files[i])
  })
}

const transform = [
  ['babelify', {
    presets: [
      ['@babel/preset-env', {
        targets: { firefox: '2' }
      }]
    ]
  }]
]

const plugin = [
  ['tinyify', {
    env: { IGN_API_KEY: process.env.IGN_API_KEY || 'choisirgeoportail' }
  }]
]

function bundle (file) {
  return src(file)
    .pipe(bro({ transform, plugin }))
    .pipe(dest(process.env.CRAFTSCRIPTS_DIRECTORY || 'craftscripts/'))
}

task('copyData', cb => copyData().then(cb))

task('default', parallel(files.map((value) => path.basename(value, '.js')), 'copyData'))

async function copyData () {
  try {
    await fs.mkdir(resolve('craftscripts'))
  } catch (err) {
    if (err && err.code !== 'EEXIST') throw err
  }
  try {
    await fs.mkdir(resolve('./craftscripts/data'))
  } catch (err) {
    if (err && err.code !== 'EEXIST') throw err
  }
  await fs.copyFile(resolve('./src/data/conformal.txt'), resolve('./craftscripts/data/conformal.txt'))
  await fs.copyFile(resolve('./src/config.json'), resolve('./craftscripts/config.json'))
}

function resolve (p) {
  return path.resolve(__dirname, p)
}
