/* global importPackage Packages player context argv */
const { request, getRadius } = require('./modules/OSMcommand')
const decode = require('./modules/decodePolygon')
const { draw, findGround, insideRegion, naturalBlock, oneBlockAbove, setBlock, printBlocks } = require('./modules/drawLines')
const { ignoredBlocks, allowedBlocks } = require('./modules/blocks')

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)

const usage = `<mode> [...args] [flags]
Modes:
 • §lradius§r§c Select rails in a radius
 • §lregion§r§c Select rails in a region
 • §lregionEdge§r§c Select rails in a region and draw only in the defined region
Flags:
 • §lu§r§c Draw a block above`

const radiusUsage = `<radius> [block] [flags]
 • §o/cs rails radius 7
 • §o/cs rails radius 50 stone u
Flags:
 • §lu§r§c Draw a block above`

const regionUsage = `[block] [flags]
 • §o/cs rails region
 • §o/cs rails region stone u
Flags:
 • §lu§r§c Draw a block above`

const regionEdgeUsage = `[block] [flags]
 • §o/cs rails regionEdge
 • §o/cs rails regionEdge stone u
Flags:
 • §lu§r§c Draws a block above`

const session = context.getSession()
const blocks = context.remember()

let block, flags, radius, center, region, region_

switch ('' + argv[1]) {
  case 'radius':
    context.checkArgs(2, 4, radiusUsage);
    [block, flags] = argv.slice(3)
    radius = Number.parseFloat(argv[2])
    center = player.getLocation()
    break

  case 'regionEdge':
    context.checkArgs(1, 3, regionEdgeUsage)
    region = session.getRegionSelector(player.getWorld()).getRegion();
    [block, flags] = argv.slice(2)
    radius = getRadius(region)
    center = region.center
    break

  case 'region':
    context.checkArgs(1, 3, regionUsage)
    region_ = session.getRegionSelector(player.getWorld()).getRegion();
    [block, flags] = argv.slice(2)
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

const up = flags && ('' + flags).includes('u')
block = block || 'iron_block'
const options = { region, block, up }

request(radius, center, (s, n) => {
  return `(way[railway~"^.*$"](${s.join(',')},${n.join(',')});>;);out;`
}, rails)

function rails (data) {
  const lines = decode(data)
  const insideRegion_ = insideRegion(options)
  const findGround_ = findGround(ignoredBlocks, blocks)
  const naturalBlock_ = naturalBlock(allowedBlocks, blocks)
  const oneBlockAbove_ = oneBlockAbove(options)
  const setBlock_ = setBlock(blocks, context, block)
  draw(lines, (pos) => {
    if (insideRegion_(pos)) {
      pos = findGround_(pos)
      if (naturalBlock_(pos)) {
        pos = oneBlockAbove_(pos)
        setBlock_(pos)
      }
    }
  })
  printBlocks()
}
