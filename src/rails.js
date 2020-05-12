/* global importPackage Packages player context argv */
const overpass = require('./modules/overpass')
const getProjection = require('./modules/getProjection')
const draw = require('./modules/drawGeoJSON')

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

const radiusUsage = `<radius> [flags]
 • §o/cs rails radius 7
 • §o/cs rails radius 50 u
Flags:
 • §lu§r§c Draw a block above`

const regionUsage = `[flags]
 • §o/cs rails region
 • §o/cs rails region u
Flags:
 • §lu§r§c Draw a block above`

const regionEdgeUsage = `[flags]
 • §o/cs rails regionEdge
 • §o/cs rails regionEdge u
Flags:
 • §lu§r§c Draw a block above`

const session = context.getSession()

let radius, center, region

switch ('' + argv[1]) {
  case 'radius':
    context.checkArgs(2, 3, radiusUsage)
    radius = Number.parseFloat(argv[2])
    center = { x: player.getPosition().x, z: player.getPosition().z }
    request(radius, center, { up: argv[3] && ('' + argv[3]).includes('u') })
    break

  case 'region':
    context.checkArgs(1, 2, regionUsage)
    region = session.getRegionSelector(player.getWorld()).getRegion()
    radius = getRadius()
    center = region.center
    request(radius, center, { up: argv[2] && ('' + argv[2]).includes('u') })
    break

  case 'regionEdge':
    context.checkArgs(1, 2, regionEdgeUsage)
    region = session.getRegionSelector(player.getWorld()).getRegion()
    radius = getRadius()
    center = region.center
    request(radius, center, { region, up: argv[2] && ('' + argv[2]).includes('u') })
    break

  default:
    if (argv[1]) {
      player.printError(argv[1] + ' is not a valid mode.')
    }
    context.checkArgs(1, 3, usage)
    break
}

function request (radius, center, options) {
  player.print('§7Please wait...')
  const points = transformPoints(getPoints(radius, center))
  const s = findS(points)
  const n = findN(points)

  const query = `(way[railway~"^.*$"](${s.join(',')},${n.join(',')});>;);out;`

  overpass(query, (err, data) => {
    if (err) throw err
    draw(data, 'iron_block', options)
  })
}

function getRadius () {
  const x = Math.abs(region.pos1.x - region.pos2.x)
  const z = Math.abs(region.pos1.z - region.pos2.z)
  return Math.sqrt(x * x + z * z) / 2
}

function getPoints (radius, center) {
  const diag = Math.sqrt(2) / 2 * radius
  return [
    [center.x + radius, center.z],
    [center.x - radius, center.z],
    [center.x, center.z - radius],
    [center.x, center.z + radius],
    [center.x + diag, center.z + diag],
    [center.x - diag, center.z - diag],
    [center.x + diag, center.z - diag],
    [center.x - diag, center.z + diag]
  ]
}

function transformPoints (points) {
  const projection = getProjection()
  for (let i = 0; i < points.length; i++) {
    points[i] = projection.toGeo(...points[i])
  }
  return points
}

function findS (points) {
  let s = [0, 0]
  let min = Number.MAX_VALUE
  for (let i = 0; i < points.length; i++) {
    const norm = points[i][0] + points[i][1]
    if (norm < min) {
      s = points[i]
      min = norm
    }
  }
  return [s[1], s[0]]
}

function findN (points) {
  let s = [0, 0]
  let max = Number.MIN_VALUE
  for (let i = 0; i < points.length; i++) {
    const norm = points[i][0] + points[i][1]
    if (norm > max) {
      s = points[i]
      max = norm
    }
  }
  return [s[1], s[0]]
}
