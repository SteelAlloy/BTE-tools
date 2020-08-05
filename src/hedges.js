/* global importPackage Packages player context argv */
import { request, getRadius } from './modules/OSMcommand'
import decode from './modules/decodePolygon'
import { draw, findGround, insideRegion, setWall, printBlocks } from './modules/drawLines'
import { ignoredBlocks } from './modules/blocks'

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)

const usage = `<mode> [...args] [flags]
Modes:
 • §lradius§r§c Select hedges in a radius
 • §lregion§r§c Select hedges in a region
 • §lregionEdge§r§c Select hedges in a region and draw only in the defined region
Flags:
 • §lu§r§c Draw a block above`

const radiusUsage = `<radius> [flags]
 • §o/cs hedges radius 7
 • §o/cs hedges radius 50 u
Flags:
 • §lu§r§c Draw a block above`

const regionUsage = `[flags]
 • §o/cs hedges region
 • §o/cs hedges region u
Flags:
 • §lu§r§c Draw a block above`

const regionEdgeUsage = `[flags]
 • §o/cs hedges regionEdge
 • §o/cs hedges regionEdge u
Flags:
 • §lu§r§c Draws a block above`

const session = context.getSession()
const blocks = context.remember()

let block, height, radius, center, region, region_

switch ('' + argv[1]) {
  case 'radius':
    context.checkArgs(2, 4, radiusUsage)
    radius = Number.parseFloat(argv[2])
    block = argv[3]
    height = Number.parseFloat(argv[4])
    center = player.getLocation()
    break

  case 'regionEdge':
    context.checkArgs(1, 3, regionEdgeUsage)
    region = session.getRegionSelector(player.getWorld()).getRegion()
    block = argv[2]
    height = Number.parseFloat(argv[3])
    radius = getRadius(region)
    center = region.center
    break

  case 'region':
    context.checkArgs(1, 3, regionUsage)
    region_ = session.getRegionSelector(player.getWorld()).getRegion()
    block = argv[2]
    height = Number.parseFloat(argv[3])
    radius = getRadius(region_)
    center = region_.center
    break

  default:
    if (argv[1]) {
      player.printError(argv[1] + ' is not a valid mode.')
    }
    context.checkArgs(1, 3, usage)
    break
}

block = block || 'leaves'
height = height || 2
const options = { region, block, height }

request(radius, center, (s, n) => {
  return `(way[landuse~"farmland"](${s.join(',')},${n.join(',')});>;);out;`
}, hedges)

function hedges (data) {
  const lines = decode(data)
  const insideRegion_ = insideRegion(options)
  const findGround_ = findGround(ignoredBlocks, blocks)
  const setWall_ = setWall(options, blocks, context, block)
  draw(lines, (pos) => {
    if (insideRegion_(pos)) {
      pos = findGround_(pos)
      setWall_(pos)
    }
  })
  printBlocks()
}
