/* global importPackage Packages player context argv */
const DOMParser = require('xmldom').DOMParser
const DOMImplementation = require('xmldom').DOMImplementation /* eslint-disable-line no-unused-vars */
const toGeoJSON = require('togeojson')

const decode = require('./modules/decodePolygon')
const { draw, findGround, naturalBlock, oneBlockAbove, setBlock, printBlocks } = require('./modules/drawLines')
const { ignoredBlocks, allowedBlocks } = require('./modules/blocks')
const { readFile } = require('./modules/readFile')

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)

const usage = `/cs draw <file> <block> [flags]
 • §o/cs draw rails1 iron_block
 • §o/cs draw file3 stone u
Flags:
 • §lu§r§c Draws a block above`

context.checkArgs(2, 3, usage)

const blocks = context.remember()

const [block, flags] = argv.slice(2)

const up = flags && ('' + flags).includes('u')
const options = { block, up }

player.print('§7Please wait...')

process(argv[1])

function process (filename) {
  const file = context.getSafeOpenFile('drawings', filename, 'geojson', ['json', 'geojson', 'kml'])
  const data = readFile(file)

  if (!file.exists()) {
    player.printError(`No such file or directory: ${file}`)
    return
  }
  let drawing = data

  const path = file.toString()
  if (path.lastIndexOf('.kml') === -1) {
    drawing = JSON.parse(data)
    player.print('§7Imported GeoJSON...')
  } else {
    const dom = new DOMParser().parseFromString(data, 'text/xml')
    drawing = toGeoJSON.kml(dom)
    player.print('§7Imported KML...')
  }
  drawRaw(drawing)
}

function drawRaw (data) {
  const lines = decode(data)
  const findGround_ = findGround(ignoredBlocks, blocks)
  const naturalBlock_ = naturalBlock(allowedBlocks, blocks)
  const oneBlockAbove_ = oneBlockAbove(options)
  const setBlock_ = setBlock(blocks, context, block)
  draw(lines, (pos) => {
    pos = findGround_(pos)
    if (naturalBlock_(pos)) {
      pos = oneBlockAbove_(pos)
      setBlock_(pos)
    }
  })
  printBlocks()
}
