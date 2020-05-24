const getProjection = require('./getProjection')

const DataError = new Error('Incorrect data format')
module.exports = function decode (data) {
  const geometry = getGeometry(data)
  return getLines(geometry)
}

function getGeometry (data) {
  // Check data type
  if (data.type !== 'FeatureCollection') throw DataError
  if (!Array.isArray(data.features)) throw DataError

  // Extract shapes
  const geometry = []
  let lines = 0
  for (let i = 0; i < data.features.length; i++) {
    if (data.features[i].geometry.type === 'Polygon') {
      const shapes = data.features[i].geometry.coordinates
      for (let j = 0; j < shapes.length; j++) {
        const coordinates = shapes[j]
        geometry.push(coordinates)
        lines += coordinates.length
      }
    } else if (data.features[i].geometry.type === 'LineString') {
      const coordinates = data.features[i].geometry.coordinates
      geometry.push(coordinates)
      lines += coordinates.length
    }
  }

  player.print(`§7${lines} lines to draw`)

  return geometry
}

function getLines (geometry) {
  const projection = getProjection()

  // Convert shapes to lines
  const lines = []
  for (let i = 0; i < geometry.length; i++) {
    const shape = geometry[i]
    for (let j = 0; j < shape.length - 1; j++) {
      const [x1, z1] = projection.fromGeo(...shape[j])
      const [x2, z2] = projection.fromGeo(...shape[j + 1])
      lines.push([x1, z1, x2, z2])
    }
  }

  return lines
}
