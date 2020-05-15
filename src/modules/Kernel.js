class Kernel {
  constructor (width, height, data) {
    this.width = width
    this.height = height
    this.xOrigin = (width - 1) >> 1
    this.yOrigin = (height - 1) >> 1
    const len = width * height
    if (data.length < len) {
      throw new Error('Data array too small (is ' + data.length + ' and should be ' + len)
    }
    this.data = new Array(len)
    for (let i = 0; i < data.length; i++) {
      this.data[i] = data[i]
    }
  }

  getXOrigin () {
    return this.xOrigin
  }

  getYOrigin () {
    return this.yOrigin
  }

  getWidth () {
    return this.width
  }

  getHeight () {
    return this.height
  }

  getKernelData (data) {
    if (data == null) {
      data = new Array(this.data.length)
    } else if (data.length < this.data.length) {
      throw new Error('Data array too small (should be ' + this.data.length + ' but is ' + data.length + ' )')
    }
    for (let i = 0; i < data.length; i++) {
      data[i] = this.data[i]
    }
    return data
  }
}

module.exports = Kernel
