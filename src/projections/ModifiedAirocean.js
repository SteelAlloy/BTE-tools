const ConformalEstimate = require('./ConformalEstimate')

class ModifiedAirocean extends ConformalEstimate {
  constructor () {
    super()

    this.THETA = -150 * this.TO_RADIANS
    this.SIN_THETA = Math.sin(this.THETA)
    this.COS_THETA = Math.cos(this.THETA)

    this.BERING_X = -0.3420420960118339// -0.3282152608138795;
    this.BERING_Y = -0.322211064085279// -0.3281491467713469;
    this.ARCTIC_Y = -0.2// -0.3281491467713469;

    this.ARCTIC_M = (this.ARCTIC_Y - this.ROOT3 * this.ARC / 4) / (this.BERING_X - -0.5 * this.ARC)
    this.ARCTIC_B = this.ARCTIC_Y - this.ARCTIC_M * this.BERING_X

    this.ALEUTIAN_Y = -0.5000446805492526// -0.5127463765943157;
    this.ALEUTIAN_XL = -0.5149231279757507// -0.4957832938238718;
    this.ALEUTIAN_XR = -0.45

    this.ALEUTIAN_M = (this.BERING_Y - this.ALEUTIAN_Y) / (this.BERING_X - this.ALEUTIAN_XR)
    this.ALEUTIAN_B = this.BERING_Y - this.ALEUTIAN_M * this.BERING_X
  }

  fromGeo (lon, lat) {
    const c = super.fromGeo(lon, lat)
    let x = c[0]
    let y = c[1]

    const easia = this.isEurasianPart(x, y)

    y -= 0.75 * this.ARC * this.ROOT3

    if (easia) {
      x += this.ARC

      const t = x
      x = this.COS_THETA * x - this.SIN_THETA * y
      y = this.SIN_THETA * t + this.COS_THETA * y
    } else {
      x -= this.ARC
    }

    c[0] = y; c[1] = -x
    return c
  }

  toGeo (x, y) {
    let easia
    if (y < 0) easia = x > 0
    else if (y > this.ARC / 2) easia = x > -this.ROOT3 * this.ARC / 2
    else easia = y * -this.ROOT3 < x

    let t = x
    x = -y
    y = t

    if (easia) {
      t = x
      x = this.COS_THETA * x + this.SIN_THETA * y
      y = this.COS_THETA * y - this.SIN_THETA * t
      x -= this.ARC
    } else {
      x += this.ARC
    }

    y += 0.75 * this.ARC * this.ROOT3

    // check to make sure still in right part
    if (easia !== this.isEurasianPart(x, y)) {
      return this.OUT_OF_BOUNDS
    }

    return super.toGeo(x, y)
  }

  isEurasianPart (x, y) {
    // catch vast majority of cases in not near boundary
    if (x > 0) return false
    if (x < -0.5 * this.ARC) return true

    if (y > this.ROOT3 * this.ARC / 4) { // above arctic ocean
      return x < 0
    }

    if (y < this.ALEUTIAN_Y) { // below bering sea
      return y < (this.ALEUTIAN_Y + this.ALEUTIAN_XL) - x
    }

    if (y > this.BERING_Y) { // boundary across arctic ocean
      if (y < this.ARCTIC_Y) return x < this.BERING_X // in strait

      return y < this.ARCTIC_M * x + this.ARCTIC_B // above strait
    }

    return y > this.ALEUTIAN_M * x + this.ALEUTIAN_B
  }

  bounds () {
    return [-1.5 * this.ARC * this.ROOT3, -1.5 * this.ARC, 3 * this.ARC, this.ROOT3 * this.ARC] // TODO: 3*ARC is prly to high
  }
}

module.exports = ModifiedAirocean
