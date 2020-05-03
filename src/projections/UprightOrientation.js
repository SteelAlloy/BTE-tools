const ProjectionTransform = require('./ProjectionTransform')

class UprightOrientation extends ProjectionTransform {
  toGeo (x, y) {
    return this.input.toGeo(x, -y)
  }

  fromGeo (lon, lat) {
    const p = this.input.fromGeo(lon, lat)
    p[1] = -p[1]
    return p
  }

  upright () {
    return !this.input.upright()
  }

  bounds () {
    const b = this.input.bounds()
    return new [b[0], -b[3], b[2], -b[1]]()
  }
}

module.exports = UprightOrientation
