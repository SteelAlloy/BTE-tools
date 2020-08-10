import overpass from './overpass'
import getProjection from './getProjection'

export function request (radius, center, getQuery, callback) {
  player.print('§7Please wait...')
  const points = transformPoints(getPoints(radius, center))
  const s = findS(points)
  const n = findN(points)
  const query = getQuery(s, n)

  overpass(query, (err, data) => {
    if (err) throw err
    callback(data)
  })
}

function getPoints (radius, center) {
  // Returns 8 points on a circle centered on the region
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
  // Get real world coordinates
  const projection = getProjection()
  for (let i = 0; i < points.length; i++) {
    points[i] = projection.toGeo(...points[i])
  }
  return points
}

function findS (points) {
  // Find minimum point (south)
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
  // Find maximum point (north)
  let s = [0, 0]
  let max = Number.NEGATIVE_INFINITY
  for (let i = 0; i < points.length; i++) {
    const norm = points[i][0] + points[i][1]
    if (norm > max) {
      s = points[i]
      max = norm
    }
  }
  return [s[1], s[0]]
}
