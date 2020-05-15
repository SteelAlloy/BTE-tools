/* global context Vector */

class HeightMap {
  constructor (session, region) {
    this.session = session
    this.region = region

    this.width = region.getWidth()
    this.height = region.getLength()

    const minX = region.getMinimumPoint().getBlockX()
    const minY = region.getMinimumPoint().getBlockY()
    const minZ = region.getMinimumPoint().getBlockZ()
    const maxY = region.getMaximumPoint().getBlockY()

    // Store current heightmap data
    this.data = new Array(this.width * this.height)
    for (let z = 0; z < this.height; ++z) {
      for (let x = 0; x < this.width; ++x) {
        this.data[z * this.width + x] = session.getHighestTerrainBlock(x + minX, z + minZ, minY, maxY)
      }
    }
  }

  applyFilter (filter, iterations) {
    let newData = new Array(this.data.length)
    for (let i = 0; i < this.data.length; i++) {
      newData[i] = this.data[i]
    }

    for (let i = 0; i < iterations; ++i) {
      newData = filter.filter(newData, this.width, this.height)
    }

    return this.apply(newData)
  }

  apply (data) {
    const minY = this.region.getMinimumPoint()
    const originX = minY.getBlockX()
    const originY = minY.getBlockY()
    const originZ = minY.getBlockZ()

    const maxY = this.region.getMaximumPoint().getBlockY()
    const fillerAir = context.getBlock('air')

    let blocksChanged = 0

    // Apply heightmap
    for (let z = 0; z < this.height; ++z) {
      for (let x = 0; x < this.width; ++x) {
        const index = z * this.width + x
        const curHeight = this.data[index]

        // Clamp newHeight within the selection area
        const newHeight = Math.min(maxY, data[index])

        // Offset x,z to be 'real' coordinates
        const xr = x + originX
        const zr = z + originZ

        // We are keeping the topmost blocks so take that in account for the scale
        const scale = (curHeight - originY) / (newHeight - originY)

        // Depending on growing or shrinking we need to start at the bottom or top
        if (newHeight > curHeight) {
          // Set the top block of the column to be the same type (this might go wrong with rounding)
          const existing = this.session.getBlock(new Vector(xr, curHeight, zr))

          // Skip water/lava
          if (existing !== context.getBlock('water') && existing !== context.getBlock('lava')) {
            this.session.setBlock(new Vector(xr, newHeight, zr), existing)
            ++blocksChanged

            // Grow -- start from 1 below top replacing airblocks
            for (let y = newHeight - 1 - originY; y >= 0; --y) {
              const copyFrom = Math.trunc(y * scale)
              this.session.setBlock(new Vector(xr, originY + y, zr), this.session.getBlock(new Vector(xr, originY + copyFrom, zr)))
              ++blocksChanged
            }
          }
        } else if (curHeight > newHeight) {
          // Shrink -- start from bottom
          for (let y = 0; y < newHeight - originY; ++y) {
            const copyFrom = Math.trunc(y * scale)
            this.session.setBlock(new Vector(xr, originY + y, zr), this.session.getBlock(new Vector(xr, originY + copyFrom, zr)))
            ++blocksChanged
          }

          // Set the top block of the column to be the same type
          // (this could otherwise go wrong with rounding)
          this.session.setBlock(new Vector(xr, newHeight, zr), this.session.getBlock(new Vector(xr, curHeight, zr)))
          ++blocksChanged

          // Fill rest with air
          for (let y = newHeight + 1; y <= curHeight; ++y) {
            this.session.setBlock(new Vector(xr, y, zr), fillerAir)
            ++blocksChanged
          }
        }
      }
    }

    // Drop trees to the floor -- TODO

    return blocksChanged
  }
}

module.exports = HeightMap
