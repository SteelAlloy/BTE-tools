const Kernel = require('./Kernel')

class GaussianKernel extends Kernel {
  constructor (radius, sigma) {
    const diameter = radius * 2 + 1
    const data = new Array(diameter * diameter)

    const sigma22 = 2 * sigma * sigma
    const constant = Math.PI * sigma22
    for (let y = -radius; y <= radius; ++y) {
      for (let x = -radius; x <= radius; ++x) {
        data[(y + radius) * diameter + x + radius] = Math.exp(-(x * x + y * y) / sigma22) / constant
      }
    }
    super(radius * 2 + 1, radius * 2 + 1, data)
  }

  createKernel (radius, sigma) {
    const diameter = radius * 2 + 1
    const data = new Array(diameter * diameter)

    const sigma22 = 2 * sigma * sigma
    const constant = Math.PI * sigma22
    for (let y = -radius; y <= radius; ++y) {
      for (let x = -radius; x <= radius; ++x) {
        data[(y + radius) * diameter + x + radius] = Math.exp(-(x * x + y * y) / sigma22) / constant
      }
    }

    return data
  }
}

module.exports = GaussianKernel
