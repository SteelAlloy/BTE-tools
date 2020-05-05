/* global importPackage Packages player context argv */
const overpass = require('./modules/overpass')
const getProjection = require('./modules/getProjection')
const draw = require('./modules/drawGeoJSON')

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)

const usage = `<mode> [args]
 • §o/cs tpll 47.58523 6.89725
 • §o/cs tpll 47.58523, 6.89725 370`

context.checkArgs(1, 2, usage)

const session = context.getSession()

let radius, center, region

switch ('' + argv[1]) {
  case 'radius':
    radius = Number.parseFloat(argv[2])
    center = { x: player.getPosition().x, z: player.getPosition().z }
    request(radius, center)
    break

  case 'region':
    region = session.getRegionSelector(player.getWorld()).getRegion()
    radius = getRadius()
    center = region.center
    request(radius, center)
    break

  case 'regionEdge':
    region = session.getRegionSelector(player.getWorld()).getRegion()
    radius = getRadius()
    center = region.center
    request(radius, center, { region })
    break

  default:
    player.printError(argv[1] + ' is not a valid mode.')
    break
}

function request (radius, center, options) {
  const points = transformPoints(getPoints(radius, center))
  const s = findS(points)
  const n = findN(points)

  const query = `(way[railway~"^(rail|subway|tram)$"](${s.join(',')},${n.join(',')});>;);out;`

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
