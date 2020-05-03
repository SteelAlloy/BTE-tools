const GeographicProjection = require('./GeographicProjection')

class ProjectionTransform extends GeographicProjection {
  constructor (input) {
    super()
    this.input = input
  }

  upright () {
    return this.input.upright()
  }

  bounds () {
    return this.input.bounds()
  }

  metersPerUnit () {
    return this.input.metersPerUnit()
  }
}

module.exports = ProjectionTransform
