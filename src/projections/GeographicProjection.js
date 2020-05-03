const UprightOrientation = require('./UprightOrientation')

class GeographicProjection {
  constructor () {
    this.Orientation = {
      none: 1, upright: 2, swapped: 3
    }
  }

  orientProjection (base) {
    if (base.upright()) {
      return base
    }
    return new UprightOrientation(base)
  }

  upright () {
    return this.fromGeo(0, 90)[1] <= this.fromGeo(0, -90)[1]
  }
}

module.exports = GeographicProjection
