const ProjectionTransform = require('./ProjectionTransform')

class ScaleProjection extends ProjectionTransform {
  constructor (input, scaleX, scaleY) {
    super(input)
    this.scaleX = scaleX
    this.scaleY = scaleY || scaleX
  }

  toGeo (x, y) {
    return this.input.toGeo(x / this.scaleX, y / this.scaleY)
  }

  fromGeo (lon, lat) {
    const p = this.input.fromGeo(lon, lat)
    p[0] *= this.scaleX
    p[1] *= this.scaleY
    return p
  }

  upright () {
    return !!((this.scaleY < 0) ^ this.input.upright())
  }

  bounds () {
    const b = this.input.bounds()
    b[0] *= this.scaleX
    b[1] *= this.scaleY
    b[2] *= this.scaleX
    b[3] *= this.scaleY
    return b
  }

  metersPerUnit () {
    return this.input.metersPerUnit() / Math.sqrt((this.scaleX * this.scaleX + this.scaleY * this.scaleY) / 2) // TODO: better transform
  }
}

module.exports = ScaleProjection
