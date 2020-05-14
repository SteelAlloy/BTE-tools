const Kernel = require('./Kernel')

class HeightMapFilter {
  constructor (kernel) {
    this.kernel = kernel
  }

  HeightMapFilter (kernelWidth, kernelHeight, kernelData) {
    this.kernel = new Kernel(kernelWidth, kernelHeight, kernelData)
  }

  getKernel () {
    return this.kernel
  }

  setKernel (kernel) {
    this.kernel = kernel
  }

  filter (inData, width, height) {
    let index = 0
    const matrix = this.kernel.getKernelData(null)
    const outData = new Array(inData.length)

    const kh = this.kernel.getHeight()
    const kw = this.kernel.getWidth()
    const kox = this.kernel.getXOrigin()
    const koy = this.kernel.getYOrigin()

    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        let z = 0

        for (let ky = 0; ky < kh; ++ky) {
          let offsetY = y + ky - koy
          // Clamp coordinates inside data
          if (offsetY < 0 || offsetY >= height) {
            offsetY = y
          }

          offsetY *= width

          const matrixOffset = ky * kw
          for (let kx = 0; kx < kw; ++kx) {
            const f = matrix[matrixOffset + kx]
            if (f === 0) continue

            let offsetX = x + kx - kox
            // Clamp coordinates inside data
            if (offsetX < 0 || offsetX >= width) {
              offsetX = x
            }

            z += f * inData[offsetY + offsetX]
          }
        }
        outData[index++] = Math.trunc(z + 0.5)
      }
    }
    return outData
  }
}

module.exports = HeightMapFilter
