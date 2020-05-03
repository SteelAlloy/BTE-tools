/* global importPackage Packages BufferedReader FileReader player context */
const Airocean = require('./Airocean')
const InvertableVectorField = require('./InvertableVectorField')

importPackage(Packages.java.io)
importPackage(Packages.java.awt)

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
      is = context.getSafeOpenFile('data', 'conformal', 'txt')
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

module.exports = ConformalEstimate
