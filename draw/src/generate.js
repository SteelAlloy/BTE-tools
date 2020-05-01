const fs = require('fs')
const path = require('path')

const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.json'), 'utf-8'))

const json = {
  bte: true,
  block: config.block,
  geometry: []
}

console.log('Reading log file...')

const file = fs.readFileSync(config.logFile, 'utf-8').split(/\r?\n/)

let index = -1
let inside = false

for (let i = file.length - 1; i > 0; i--) {
  const line = file[i]
  // console.log(line)
  if (line.includes('End BTE-tools')) {
    inside = true
    continue
  } else if (line.includes('Start BTE-tools')) {
    inside = false
  } else if (!inside) continue
  else if (line.includes('Server')) continue
  else if (line.includes('----')) {
    index++
    json.geometry[index] = []
  } else {
    const data = line.substring(45, line.length).split(' ')
    const parsedData = [Number.parseFloat(data[0]), Number.parseFloat(data[1])]
    json.geometry[index].push(parsedData)
  }
}

fs.writeFileSync(path.resolve(__dirname, '../', config.output), JSON.stringify(json, null, 2))
fs.unlinkSync(path.resolve(__dirname, 'temp.json'))
