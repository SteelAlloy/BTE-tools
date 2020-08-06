/* global importPackage Packages player context argv */
import { DOMParser, DOMImplementation } from 'xmldom' /* eslint-disable-line no-unused-vars */
import toGeoJSON from 'togeojson'

import decode from './modules/decodePolygon'
import { draw, findGround, naturalBlock, setOffset, setWall, printBlocks } from './modules/drawLines'
import { ignoredBlocks, allowedBlocks } from './modules/blocks'
import { readFile } from './modules/readFile'

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)

const usage = `/cs draw <file> [block] [flags]
 • §o/cs draw rails1 iron_block
 • §o/cs draw file3 stone u
Flags:
 • §lu§r§c Draws a block above`

context.checkArgs(1, 3, usage)

const options = {
  block: argv[2] || 'gold_block',
  offset: 0,
  height: 1,
  onGround: true,
  ignoreBuildings: true,
  ignoreTrees: true,
  ignoredBlocks,
  allowedBlocks,
  ...JSON.parse(argv[3] || '{}')
}

options.ignoredBlocks = options.ignoredBlocks.map((id) => context.getBlock(id).id)
options.allowedBlocks = options.allowedBlocks.map((id) => context.getBlock(id).id)

player.print('§7Please wait...')

process(options)

function process (options) {
  const file = context.getSafeOpenFile('drawings', argv[1], 'geojson', ['json', 'geojson', 'kml'])
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
  drawRaw(drawing, options)
}

function drawRaw (data, options) {
  const lines = decode(data)
  const findGround_ = findGround(options)
  const naturalBlock_ = naturalBlock(options)
  const setOffset_ = setOffset(options)
  const setWall_ = setWall(options)
  draw(lines, (pos) => {
    pos = findGround_(pos)
    if (naturalBlock_(pos)) {
      pos = setOffset_(pos)
      setWall_(pos)
    }
  })
  printBlocks()
}
