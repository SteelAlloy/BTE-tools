import { DOMParser, DOMImplementation } from 'xmldom' /* eslint-disable-line no-unused-vars */
import toGeoJSON from 'togeojson'

import { draw as usage } from './modules/usage'
import decode from './modules/decodePolygon'
import { draw, findGround, ignoreBuildings, setOffset, setWall, printBlocks } from './modules/drawLines'
import { ignoredBlocks, allowedBlocks } from './modules/blocks'
import { readFile } from './modules/readFile'
import { transformIDs } from './modules/utils'

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)

context.checkArgs(1, 3, usage)

const options = {
  block: argv[2] || 'gold_block',
  offset: 0,
  height: 1,
  onGround: true,
  ignoreBuildings: true,
  ignoreVegetation: true,
  ignoredBlocks,
  allowedBlocks,
  ...JSON.parse(argv[3] || '{}')
}

transformIDs(options, 'ignoredBlocks')
transformIDs(options, 'allowedBlocks')

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
  const ignoreBuildings_ = ignoreBuildings(options)
  const setOffset_ = setOffset(options)
  const setWall_ = setWall(options)
  draw(lines, (pos) => {
    pos = findGround_(pos)
    if (ignoreBuildings_(pos)) {
      pos = setOffset_(pos)
      setWall_(pos)
    }
    player.print(pos)
  })
  printBlocks()
}
