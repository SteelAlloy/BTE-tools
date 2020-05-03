class InvertableVectorField {
  constructor (vx, vy) {
    this.ROOT3 = Math.sqrt(3)

    this.sideLength = vx.length - 1
    this.VECTOR_X = vx
    this.VECTOR_Y = vy
  }

  getInterpolatedVector (x, y) {
    // scale up triangle to be triangleSize across
    x *= this.sideLength
    y *= this.sideLength

    // convert to triangle units
    const v = 2 * y / this.ROOT3
    const u = x - v * 0.5

    let u1 = Math.trunc(u)
    let v1 = Math.trunc(v)

    if (u1 < 0) u1 = 0
    else if (u1 >= this.sideLength) u1 = this.sideLength - 1

    if (v1 < 0) v1 = 0
    else if (v1 >= this.sideLength - u1) v1 = this.sideLength - u1 - 1

    let valx1, valy1, valx2, valy2, valx3, valy3
    let y3, x3

    let flip = 1

    if (y < -this.ROOT3 * (x - u1 - v1 - 1) || v1 === this.sideLength - u1 - 1) {
      valx1 = this.VECTOR_X[u1][v1]
      valy1 = this.VECTOR_Y[u1][v1]
      valx2 = this.VECTOR_X[u1][v1 + 1]
      valy2 = this.VECTOR_Y[u1][v1 + 1]
      valx3 = this.VECTOR_X[u1 + 1][v1]
      valy3 = this.VECTOR_Y[u1 + 1][v1]

      y3 = 0.5 * this.ROOT3 * v1
      x3 = (u1 + 1) + 0.5 * v1
    } else {
      valx1 = this.VECTOR_X[u1][v1 + 1]
      valy1 = this.VECTOR_Y[u1][v1 + 1]
      valx2 = this.VECTOR_X[u1 + 1][v1]
      valy2 = this.VECTOR_Y[u1 + 1][v1]
      valx3 = this.VECTOR_X[u1 + 1][v1 + 1]
      valy3 = this.VECTOR_Y[u1 + 1][v1 + 1]

      flip = -1
      y = -y

      y3 = -(0.5 * this.ROOT3 * (v1 + 1))
      x3 = (u1 + 1) + 0.5 * (v1 + 1)
    }

    // TODO: not sure if weights are right (but weirdly mirrors stuff so there may be simplifcation yet)
    const w1 = -(y - y3) / this.ROOT3 - (x - x3)
    const w2 = 2 * (y - y3) / this.ROOT3
    const w3 = 1 - w1 - w2

    return [valx1 * w1 + valx2 * w2 + valx3 * w3, valy1 * w1 + valy2 * w2 + valy3 * w3,
      (valx3 - valx1) * this.sideLength, this.sideLength * flip * (2 * valx2 - valx1 - valx3) / this.ROOT3,
      (valy3 - valy1) * this.sideLength, this.sideLength * flip * (2 * valy2 - valy1 - valy3) / this.ROOT3]
  }

  applyNewtonsMethod (expectedf, expectedg, xest, yest, iter) {
    for (let i = 0; i < iter; i++) {
      const c = this.getInterpolatedVector(xest, yest)

      const f = c[0] - expectedf
      const g = c[1] - expectedg
      const dfdx = c[2]; const dfdy = c[3]
      const dgdx = c[4]; const dgdy = c[5]

      const determinant = 1 / (dfdx * dgdy - dfdy * dgdx)

      xest -= determinant * (dgdy * f - dfdy * g)
      yest -= determinant * (-dgdx * f + dfdx * g)
    }

    return [xest, yest]
  }
}

module.exports = InvertableVectorField
