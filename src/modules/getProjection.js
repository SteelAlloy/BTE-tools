/* global importPackage Packages BufferedReader FileReader player context */

importPackage(Packages.java.io)
importPackage(Packages.java.awt)

class GeographicProjection {
  constructor () {
    this.Orientation = {
      none: 1, upright: 2, swapped: 3
    }
    this.EARTH_CIRCUMFERENCE = 40075017
    this.EARTH_POLAR_CIRCUMFERENCE = 40008000
  }

  orientProjection (base) {
    if (base.upright()) {
      return base
    }
    return new UprightOrientation(base)
  }

  toGeo (x, y) {
    return [x, y]
  }

  fromGeo (lon, lat) {
    return [lon, lat]
  }

  upright () {
    return this.fromGeo(0, 90)[1] <= this.fromGeo(0, -90)[1]
  }

  vector (x, y, north, east) {
    const geo = this.toGeo(x, y)

    // TODO: east may be slightly off because earth not a sphere
    const off = this.fromGeo(geo[0] + east * 360.0 / (Math.cos(geo[1] * Math.PI / 180.0) * this.EARTH_CIRCUMFERENCE),
      geo[1] + north * 360.0 / this.EARTH_POLAR_CIRCUMFERENCE)

    return [off[0] - x, off[1] - y]
  }
}
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

class Airocean extends GeographicProjection {
  constructor () {
    super()

    this.ARC = 2 * Math.asin(Math.sqrt(5 - Math.sqrt(5)) / Math.sqrt(10))

    this.TO_RADIANS = Math.PI / 180.0
    this.ROOT3 = Math.sqrt(3)

    this.newton = 5

    this.VERT = [
      10.536199, 64.700000,
      -5.245390, 2.300882,
      58.157706, 10.447378,
      122.300000, 39.100000,
      -143.478490, 50.103201,
      -67.132330, 23.717925,
      36.521510, -50.103200,
      112.867673, -23.717930,
      174.754610, -2.300882,
      -121.842290, -10.447350,
      -57.700000, -39.100000,
      -169.463800, -64.700000
    ]

    this.ISO = [
      2, 1, 6,
      1, 0, 2,
      0, 1, 5,
      1, 5, 10,
      1, 6, 10,
      7, 2, 6,
      2, 3, 7,
      3, 0, 2,
      0, 3, 4,
      4, 0, 5, // 9, qubec
      5, 4, 9,
      9, 5, 10,
      10, 9, 11,
      11, 6, 10,
      6, 7, 11,
      8, 3, 7,
      8, 3, 4,
      8, 4, 9,
      9, 8, 11,
      7, 8, 11,
      11, 6, 7, // child of 14
      3, 7, 8 // child of 15
    ]

    this.CENTER_MAP = [
      -3, 7,
      -2, 5,
      -1, 7,
      2, 5,
      4, 5,
      -4, 1,
      -3, -1,
      -2, 1,
      -1, -1,
      0, 1,
      1, -1,
      2, 1,
      3, -1,
      4, 1,
      5, -1, // 14, left side, right to be cut
      -3, -5,
      -1, -5,
      1, -5,
      2, -7,
      -4, -7,
      -5, -5, // 20, pseudo triangle, child of 14
      -2, -7 // 21 , pseudo triangle, child of 15
    ]

    this.FLIP_TRIANGLE = [
      1, 0, 1, 0, 0,
      1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
      1, 1, 1, 0, 0,
      1, 0
    ]

    this.CENTROID = new Array(66)
    this.ROTATION_MATRIX = new Array(198)
    this.INVERSE_ROTATION_MATRIX = new Array(198)

    for (let i = 0; i < 22; i++) {
      this.CENTER_MAP[2 * i] *= 0.5 * this.ARC
      this.CENTER_MAP[2 * i + 1] *= this.ARC * this.ROOT3 / 12
    }

    for (let i = 0; i < 12; i++) {
      this.VERT[2 * i + 1] = 90 - this.VERT[2 * i + 1]

      this.VERT[2 * i] *= this.TO_RADIANS
      this.VERT[2 * i + 1] *= this.TO_RADIANS
    }

    for (let i = 0; i < 22; i++) {
      const a = this.cart(this.VERT[2 * this.ISO[i * 3]], this.VERT[2 * this.ISO[i * 3] + 1])
      const b = this.cart(this.VERT[2 * this.ISO[i * 3 + 1]], this.VERT[2 * this.ISO[i * 3 + 1] + 1])
      const c = this.cart(this.VERT[2 * this.ISO[i * 3 + 2]], this.VERT[2 * this.ISO[i * 3 + 2] + 1])

      const xsum = a[0] + b[0] + c[0]
      const ysum = a[1] + b[1] + c[1]
      const zsum = a[2] + b[2] + c[2]

      const mag = Math.sqrt(xsum * xsum + ysum * ysum + zsum * zsum)

      this.CENTROID[3 * i] = xsum / mag
      this.CENTROID[3 * i + 1] = ysum / mag
      this.CENTROID[3 * i + 2] = zsum / mag

      const clon = Math.atan2(ysum, xsum)
      const clat = Math.atan2(Math.sqrt(xsum * xsum + ysum * ysum), zsum)

      let v = [this.VERT[2 * this.ISO[i * 3]], this.VERT[2 * this.ISO[i * 3] + 1]]
      v = this.yRot(v[0] - clon, v[1], -clat)

      this.produceZYZRotationMatrix(this.ROTATION_MATRIX, i * 9, -clon, -clat, (Math.PI / 2) - v[0])
      this.produceZYZRotationMatrix(this.INVERSE_ROTATION_MATRIX, i * 9, v[0] - (Math.PI / 2), clat, clon)
    }

    this.FACE_ON_GRID = [
      -1, -1, 0, 1, 2, -1, -1, 3, -1, 4, -1,
      -1, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
      20, 19, 15, 21, 16, -1, 17, 18, -1, -1, -1
    ]

    this.Z = Math.sqrt(5 + 2 * Math.sqrt(5)) / Math.sqrt(15)
    this.EL = Math.sqrt(8) / Math.sqrt(5 + Math.sqrt(5))
    this.EL6 = this.EL / 6
    this.DVE = Math.sqrt(3 + Math.sqrt(5)) / Math.sqrt(5 + Math.sqrt(5))
    this.R = -3 * this.EL6 / this.DVE

    this.OUT_OF_BOUNDS = [NaN, NaN]
  }

  produceZYZRotationMatrix (out, offset, a, b, c) {
    const sina = Math.sin(a); const cosa = Math.cos(a); const sinb = Math.sin(b); const cosb = Math.cos(b); const sinc = Math.sin(c); const cosc = Math.cos(c)

    out[offset + 0] = cosa * cosb * cosc - sinc * sina
    out[offset + 1] = -sina * cosb * cosc - sinc * cosa
    out[offset + 2] = cosc * sinb

    out[offset + 3] = sinc * cosb * cosa + cosc * sina
    out[offset + 4] = cosc * cosa - sinc * cosb * sina
    out[offset + 5] = sinc * sinb

    out[offset + 6] = -sinb * cosa
    out[offset + 7] = sinb * sina
    out[offset + 8] = cosb
  }

  cart (lambda, phi) {
    const sinphi = Math.sin(phi)
    return [sinphi * Math.cos(lambda), sinphi * Math.sin(lambda), Math.cos(phi)]
  }

  findTriangle (x, y, z) {
    let min = Number.MAX_VALUE
    let face = 0

    for (let i = 0; i < 20; i++) {
      const xd = this.CENTROID[3 * i] - x
      const yd = this.CENTROID[3 * i + 1] - y
      const zd = this.CENTROID[3 * i + 2] - z

      const dissq = xd * xd + yd * yd + zd * zd
      if (dissq < min) {
        if (dissq < 0.1) { // TODO: enlarge radius
          return i
        }
        face = i
        min = dissq
      }
    }

    return face
  }

  findMapTriangle (x, y) {
    let min = Number.MAX_VALUE
    let face = 0

    for (let i = 0; i < 20; i++) {
      const xd = this.CENTER_MAP[2 * i] - x
      const yd = this.CENTER_MAP[2 * i + 1] - y

      const dissq = xd * xd + yd * yd
      if (dissq < min) {
        face = i
        min = dissq
      }
    }

    return face
  }

  findTriangleGrid (x, y) {
    // cast equiladeral triangles to 45 degreee right triangles (side length of root2)
    const xp = x / this.ARC
    let yp = y / (this.ARC * this.ROOT3)

    let row
    if (yp > -0.25) {
      if (yp < 0.25) { // middle
        row = 1
      } else if (yp <= 0.75) { // top
        row = 0
        yp = 0.5 - yp // translate to middle and flip
      } else return -1
    } else if (yp >= -0.75) { // bottom
      row = 2
      yp = -yp - 0.5 // translate to middle and flip
    } else return -1

    yp += 0.25 // change origin to vertex 4, to allow grids to allign

    // rotate coords 45 degrees so left and right sides of the triangle become the x/y axies (also side lengths are now 1)
    const xr = xp - yp
    const yr = xp + yp

    // assign a order to what grid along the y=x line it is
    const gx = Math.floor(xr)
    const gy = Math.floor(yr)

    const col = 2 * gx + (gy !== gx ? 1 : 0) + 6

    // out of bounds
    if (col < 0 || col >= 11) { return -1 }

    return this.FACE_ON_GRID[row * 11 + col] // get face at this position
  }

  triangleTransform (x, y, z) {
    const S = this.Z / z

    const xp = S * x
    const yp = S * y

    const a = Math.atan((2 * yp / this.ROOT3 - this.EL6) / this.DVE) // ARC/2 terms cancel
    const b = Math.atan((xp - yp / this.ROOT3 - this.EL6) / this.DVE)
    const c = Math.atan((-xp - yp / this.ROOT3 - this.EL6) / this.DVE)

    return [0.5 * (b - c), (2 * a - b - c) / (2 * this.ROOT3)]
  }

  inverseTriangleTransformNewton (xpp, ypp) {
    // a & b are linearly related to c, so using the tan of sum formula we know: tan(c+off) = (tanc + tanoff)/(1-tanc*tanoff)
    const tanaoff = Math.tan(this.ROOT3 * ypp + xpp) // a = c + root3*y'' + x''
    const tanboff = Math.tan(2 * xpp) // b = c + 2x''

    const anumer = tanaoff * tanaoff + 1
    const bnumer = tanboff * tanboff + 1

    // we will be solving for tanc, starting at t=0, tan(0) = 0
    let tana = tanaoff
    let tanb = tanboff
    let tanc = 0

    let adenom = 1
    let bdenom = 1

    // double fp = anumer + bnumer + 1; //derivative relative to tanc

    // int i = newton;
    for (let i = 0; i < this.newton; i++) {
      const f = tana + tanb + tanc - this.R // R = tana + tanb + tanc
      const fp = anumer * adenom * adenom + bnumer * bdenom * bdenom + 1 // derivative relative to tanc

      // TODO: fp could be simplified on first loop: 1 + anumer + bnumer

      tanc -= f / fp

      adenom = 1 / (1 - tanc * tanaoff)
      bdenom = 1 / (1 - tanc * tanboff)

      tana = (tanc + tanaoff) * adenom
      tanb = (tanc + tanboff) * bdenom
    }

    // simple reversal algebra based on tan values
    const yp = this.ROOT3 * (this.DVE * tana + this.EL6) / 2
    const xp = this.DVE * tanb + yp / this.ROOT3 + this.EL6

    // x = z*xp/Z, y = z*yp/Z, x^2 + y^2 + z^2 = 1
    const xpoZ = xp / this.Z
    const ypoZ = yp / this.Z

    const z = 1 / Math.sqrt(1 + xpoZ * xpoZ + ypoZ * ypoZ)

    return [z * xpoZ, z * ypoZ, z]
  }

  inverseTriangleTransformCbrt (xpp, ypp) {
    // a & b are linearly related to c, so using the tan of sum formula we know: tan(c+off) = (tanc + tanoff)/(1-tanc*tanoff)
    const tanaoff = Math.tan(this.ROOT3 * ypp + xpp) // a = c + root3*y'' + x''
    const tanboff = Math.tan(2 * xpp) // b = c + 2x''

    // using a derived cubic equation and cubic formula
    const l = tanboff * tanaoff
    const m = -(this.R * tanboff * tanaoff + 2 * tanboff + 2 * tanaoff)
    const n = 3 + this.R * tanboff + this.R * tanaoff - 2 * tanboff * tanaoff
    const o = tanboff + tanaoff - this.R

    const p = -m / (3 * l)
    const q = p * p * p + (m * n - 3 * l * o) / (6 * l * l)
    const r = n / (3 * l)

    const rmpp = r - p * p
    const imag = Math.sqrt(-(q * q + rmpp * rmpp * rmpp))
    const mag = Math.sqrt(imag * imag + q * q)

    const b = Math.atan2(imag, q)

    const tanc = 2 * Math.cbrt(mag) * Math.cos((b / 3)) + p

    const tana = (tanc + tanaoff) / (1 - tanc * tanaoff)
    const tanb = (tanc + tanboff) / (1 - tanc * tanboff)

    // simple reversal algebra based on tan values
    const yp = this.ROOT3 * (this.DVE * tana + this.EL6) / 2
    const xp = this.DVE * tanb + yp / this.ROOT3 + this.EL6

    // x = z*xp/Z, y = z*yp/Z, x^2 + y^2 + z^2 = 1
    const xpoZ = xp / this.Z
    const ypoZ = yp / this.Z

    const z = 1 / Math.sqrt(1 + xpoZ * xpoZ + ypoZ * ypoZ)

    return [z * xpoZ, z * ypoZ, z]
  }

  inverseTriangleTransformCbrtNewton (xpp, ypp) {
    // a & b are linearly related to c, so using the tan of sum formula we know: tan(c+off) = (tanc + tanoff)/(1-tanc*tanoff)
    const tanaoff = Math.tan(this.ROOT3 * ypp + xpp) // a = c + root3*y'' + x''
    const tanboff = Math.tan(2 * xpp) // b = c + 2x''
    const sumtmp = tanaoff + tanboff

    // using a derived cubic equation and cubic formula
    const l = tanboff * tanaoff
    const m = -(this.R * l + 2 * tanboff + 2 * tanaoff)
    const n = 3 + this.R * sumtmp - 2 * l
    const o = sumtmp - this.R

    const l3 = 3 * l
    const m2 = 2 * m

    let x = -o / n // x = tanc

    for (let i = 0; i < this.newton; i++) {
      const x2 = x * x

      const f = l * x2 * x + m * x2 + n * x + o
      const fp = l3 * x2 + m2 * x + n

      x -= f / fp
    }

    const tana = (x + tanaoff) / (1 - x * tanaoff)
    const tanb = (x + tanboff) / (1 - x * tanboff)

    // simple reversal algebra based on tan values
    const yp = this.ROOT3 * (this.DVE * tana + this.EL6) / 2
    const xp = this.DVE * tanb + yp / this.ROOT3 + this.EL6

    // x = z*xp/Z, y = z*yp/Z, x^2 + y^2 + z^2 = 1
    const xpoZ = xp / this.Z
    const ypoZ = yp / this.Z

    const z = 1 / Math.sqrt(1 + xpoZ * xpoZ + ypoZ * ypoZ)

    return [z * xpoZ, z * ypoZ, z]
  }

  inverseTriangleTransform (x, y) {
    return this.inverseTriangleTransformNewton(x, y)
  }

  yRot (lambda, phi, rot) {
    const c = this.cart(lambda, phi)

    const x = c[0]
    c[0] = c[2] * Math.sin(rot) + x * Math.cos(rot)
    c[2] = c[2] * Math.cos(rot) - x * Math.sin(rot)

    const mag = Math.sqrt(c[0] * c[0] + c[1] * c[1] + c[2] * c[2])
    c[0] /= mag; c[1] /= mag; c[2] /= mag

    return [
      Math.atan2(c[1], c[0]),
      Math.atan2(Math.sqrt(c[0] * c[0] + c[1] * c[1]), c[2])
    ]
  }

  fromGeo (lon, lat) {
    lat = 90 - lat
    lon *= this.TO_RADIANS
    lat *= this.TO_RADIANS

    const sinphi = Math.sin(lat)

    let x = Math.cos(lon) * sinphi
    const y = Math.sin(lon) * sinphi
    const z = Math.cos(lat)

    let face = this.findTriangle(x, y, z)

    // apply rotation matrix (move triangle onto template triangle)
    const off = 9 * face
    const xp = x * this.ROTATION_MATRIX[off + 0] + y * this.ROTATION_MATRIX[off + 1] + z * this.ROTATION_MATRIX[off + 2]
    const yp = x * this.ROTATION_MATRIX[off + 3] + y * this.ROTATION_MATRIX[off + 4] + z * this.ROTATION_MATRIX[off + 5]
    const zp = x * this.ROTATION_MATRIX[off + 6] + y * this.ROTATION_MATRIX[off + 7] + z * this.ROTATION_MATRIX[off + 8]

    const out = this.triangleTransform(xp, yp, zp)

    // flip triangle to correct orientation
    if (this.FLIP_TRIANGLE[face] !== 0) {
      out[0] = -out[0]
      out[1] = -out[1]
    }

    x = out[0]
    // deal with special snowflakes (child faces 20, 21)
    if (((face === 15 && x > out[1] * this.ROOT3) || face === 14) && x > 0) {
      out[0] = 0.5 * x - 0.5 * this.ROOT3 * out[1]
      out[1] = 0.5 * this.ROOT3 * x + 0.5 * out[1]
      face += 6 // shift 14->20 & 15->21
    }

    out[0] += this.CENTER_MAP[face * 2]
    out[1] += this.CENTER_MAP[face * 2 + 1]

    return out
  }

  toGeo (x, y) {
    const face = this.findTriangleGrid(x, y)

    if (face === -1) {
      return this.OUT_OF_BOUNDS
    }

    x -= this.CENTER_MAP[face * 2]
    y -= this.CENTER_MAP[face * 2 + 1]

    // deal with bounds of special snowflakes
    switch (face) {
      case 14:
        if (x > 0) {
          return this.OUT_OF_BOUNDS
        }
        break

      case 20:
        if (-y * this.ROOT3 > x) {
          return this.OUT_OF_BOUNDS
        }
        break

      case 15:
        if (x > 0 && x > y * this.ROOT3) {
          return this.OUT_OF_BOUNDS
        }
        break

      case 21:
        if (x < 0 || -y * this.ROOT3 > x) {
          return this.OUT_OF_BOUNDS
        }
        break
    }

    // flip triangle to upright orientation (if not already)
    if (this.FLIP_TRIANGLE[face] !== 0) {
      x = -x
      y = -y
    }

    // invert triangle transform
    const c = this.inverseTriangleTransform(x, y)
    x = c[0]
    y = c[1]
    const z = c[2]

    // apply inverse rotation matrix (move triangle from template triangle to correct position on globe)
    const off = 9 * face
    const xp = x * this.INVERSE_ROTATION_MATRIX[off + 0] + y * this.INVERSE_ROTATION_MATRIX[off + 1] + z * this.INVERSE_ROTATION_MATRIX[off + 2]
    const yp = x * this.INVERSE_ROTATION_MATRIX[off + 3] + y * this.INVERSE_ROTATION_MATRIX[off + 4] + z * this.INVERSE_ROTATION_MATRIX[off + 5]
    const zp = x * this.INVERSE_ROTATION_MATRIX[off + 6] + y * this.INVERSE_ROTATION_MATRIX[off + 7] + z * this.INVERSE_ROTATION_MATRIX[off + 8]

    // convert back to spherical coordinates
    return [Math.atan2(yp, xp) / this.TO_RADIANS, 90 - Math.acos(zp) / this.TO_RADIANS]
  }

  bounds () {
    return [-3 * this.ARC, -0.75 * this.ARC * this.ROOT3, 2.5 * this.ARC, 0.75 * this.ARC * this.ROOT3]
  }

  upright () {
    return false
  }

  metersPerUnit () {
    return Math.sqrt(510100000000000.0 / (20 * this.ROOT3 * this.ARC * this.ARC / 4))
  }
}

class ConformalEstimate extends Airocean {
  constructor () {
    super()

    this.VECTOR_SCALE_FACTOR = 1 / 1.1473979730192934

    let is = null

    const sideLength = 256

    const xs = new Array(sideLength + 1)
    const ys = new Array(xs.length)

    for (let i = 0; i < xs.length; i++) {
      xs[i] = []
    }
    for (let i = 0; i < ys.length; i++) {
      ys[i] = []
    }

    try {
      // is = new FileInputStream("../resources/assets/terra121/data/conformal.txt");
      is = context.getSafeOpenFile('craftscripts/data', 'conformal', 'txt')
      if (!is.exists()) {
        player.printError("Conformal.txt doesn't exist.")
      } else {
        var sc = new BufferedReader(new FileReader(is))
        // const sc = require('fs').readFileSync(require('path').resolve(__dirname, './data/conformal.txt'), 'utf-8').split(/\r?\n/)
        // let i = 0

        for (let u = 0; u < xs.length; u++) {
          const px = new Array(xs.length - u)
          const py = new Array(xs.length - u)
          xs[u] = px
          ys[u] = py
        }

        for (let v = 0; v < xs.length; v++) {
          for (let u = 0; u < xs.length - v; u++) {
            let line = sc.readLine()
            // let line = sc[i]
            line = line.substring(1, line.length() - 3)
            const split = line.split(', ')
            xs[u][v] = Number.parseFloat(split[0]) * this.VECTOR_SCALE_FACTOR
            ys[u][v] = Number.parseFloat(split[1]) * this.VECTOR_SCALE_FACTOR
            // i++
          }
        }
      }

      sc.close()
    } catch (e) {
      player.printError("Can't load conformal: " + e)
      // console.error("Can't load conformal: " + e)
    }

    this.inverse = new InvertableVectorField(xs, ys)
  }

  triangleTransform (x, y, z) {
    let c = super.triangleTransform(x, y, z)

    x = c[0]
    y = c[1]

    c[0] /= this.ARC
    c[1] /= this.ARC

    c[0] += 0.5
    c[1] += this.ROOT3 / 6

    // use another interpolated vector to have a really good guess before using newtons method
    // c = forward.getInterpolatedVector(c[0], c[1]);
    // c = inverse.applyNewtonsMethod(x, y, c[0]/ARC + 0.5, c[1]/ARC + ROOT3/6, 1);

    // just use newtons method: slower
    c = this.inverse.applyNewtonsMethod(x, y, c[0], c[1], 5)// c[0]/ARC + 0.5, c[1]/ARC + ROOT3/6

    c[0] -= 0.5
    c[1] -= this.ROOT3 / 6

    c[0] *= this.ARC
    c[1] *= this.ARC

    /* x = c[0];
    y = c[1];
    double dis = Math.sqrt(c[0]*c[0] + c[1]*c[1]);
    double theta = dis<(ARC*ROOT3/6)?90*(ARC*ROOT3/6 - dis)/(ARC*ROOT3/6):0;
    c[0] = Math.cos(theta * TO_RADIANS) * c[0] + Math.sin(theta * TO_RADIANS) * c[1];
    c[1] = Math.cos(theta * TO_RADIANS) * c[1] - Math.sin(theta * TO_RADIANS) * x; */

    return c
  }

  inverseTriangleTransform (x, y) {
    // System.out.println(x+" "+y);

    x /= this.ARC
    y /= this.ARC

    x += 0.5
    y += this.ROOT3 / 6

    const c = this.inverse.getInterpolatedVector(x, y)

    /* double[] c = new double[] {x,y};
    double dis = Math.sqrt(c[0]*c[0] + c[1]*c[1]);
    double theta = dis<(ARC*ROOT3/6)?90*(ARC*ROOT3/6 - dis)/(ARC*ROOT3/6):0;
    c[0] = Math.cos(-theta * TO_RADIANS) * c[0] + Math.sin(-theta * TO_RADIANS) * c[1];
    c[1] = Math.cos(-theta * TO_RADIANS) * c[1] - Math.sin(-theta * TO_RADIANS) * x; */

    // System.out.println(c[0]+" "+c[1]);

    return super.inverseTriangleTransform(c[0], c[1])
  }

  metersPerUnit () {
    return (40075017 / (2 * Math.PI)) / this.VECTOR_SCALE_FACTOR
  }
}

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

export default function getProjection () { // eslint-disable-line no-unused-vars
  const scale = 7318261.522857145
  const bteAirOcean = new ModifiedAirocean()
  const uprightProj = new GeographicProjection().orientProjection(bteAirOcean)
  return new ScaleProjection(uprightProj, scale, scale)
}
