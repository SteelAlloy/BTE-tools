/* global importPackage Packages player context */
const overpass = require('./modules/overpass')
const getProjection = require('./modules/getProjection')
const draw = require('./modules/drawGeoJSON')

const projection = getProjection()

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)

const session = context.getSession()
const region = session.getRegionSelector(player.getWorld()).getRegion()

// player.printDebug(region.contains(new Vector(3145759, 367, -4796541)))

const radius = getRadius()
const points = transformPoints(getPoints(radius))
const s = findS(points)
const n = findN(points)

const query = `(way[railway~"^(rail|subway|tram)$"](${s.join(',')},${n.join(',')});>;);out;`
player.printDebug(query)

overpass(query, (err, data) => {
  if (err) throw err
  // player.printDebug(JSON.stringify(data, null, 4))
  draw(data, 'iron_block')
})

function getRadius () {
  const x = Math.abs(region.pos1.x - region.pos2.x)
  const z = Math.abs(region.pos1.z - region.pos2.z)
  return Math.sqrt(x * x + z * z) / 2
}

function getPoints (radius) {
  const center = region.center
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
