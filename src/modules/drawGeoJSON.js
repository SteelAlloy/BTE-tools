/* global importPackage Packages context player Vector */
const getProjection = require('./getProjection')
const { ignoredBlocks, allowedBlocks } = require('./blocks')

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)

const blocks = context.remember()
let changedBlocks = 0
const DataError = new Error('Incorrect data format')

module.exports = function (data, block, options) {
  options = options || {}
  draw(parse(data), block, options)
}

function parse (data) {
  if (data.type !== 'FeatureCollection') throw DataError
  if (!Array.isArray(data.features)) throw DataError

  const geometry = []
  let lines = 0
  for (let i = 0; i < data.features.length; i++) {
    if (data.features[i].geometry.type !== 'LineString') continue
    const coordinates = data.features[i].geometry.coordinates
    geometry.push(coordinates)
    lines += coordinates.length
  }

  player.print(`§7${lines} lines to draw`)

  return geometry
}

function draw (geometry, block, options) {
  const y = player.getPosition().y
  block = context.getBlock(block)

  const projection = getProjection()

  for (let i = 0; i < geometry.length; i++) {
    const shape = geometry[i]
    for (let j = 0; j < shape.length - 1; j++) {
      const [x1, z1] = projection.fromGeo(...shape[j])
      const [x2, z2] = projection.fromGeo(...shape[j + 1])
      drawLine(x1, y, z1, x2, y, z2, block, options)
    }
  }

  player.print('Operation completed (' + changedBlocks + ' blocks affected).')
}

function drawLine (x1, y1, z1, x2, y2, z2, block, options) {
  const lenX = x2 - x1
  const lenY = y2 - y1
  const lenZ = z2 - z1

  const max = Math.max(Math.abs(lenX), Math.abs(lenY), Math.abs(lenZ))

  const incrX = lenX / max
  const incrY = lenY / max
  const incrZ = lenZ / max

  const incrMax = Math.max(Math.abs(incrX), Math.abs(incrY), Math.abs(incrZ))

  for (var i = 0; i < max; i += incrMax) {
    var pos = new Vector(Math.floor(x1 + incrX * i), Math.floor(y1 + incrY * i), Math.floor(z1 + incrZ * i))
    if (insideRegion(pos, options)) {
      pos = findGround(pos)

      if (allowedBlocks.includes(blocks.getBlock(pos).id)) {
        if (options.up) {
          pos = pos.add(new Vector(0, 1, 0))
        }
        blocks.setBlock(pos, block)
        changedBlocks++
      }
    }
  }
}

function findGround (pos) {
  while (!ignoredBlocks.includes(blocks.getBlock(pos.add(new Vector(0, 1, 0))).id)) {
    pos = pos.add(new Vector(0, 1, 0))
  }
  while (ignoredBlocks.includes(blocks.getBlock(pos).id)) {
    pos = pos.add(new Vector(0, -1, 0))
  }
  return pos
}

function insideRegion (pos, options) {
  if (options.region) {
    return options.region.contains(
      new Vector(pos.x, options.region.center.y, pos.z)
    )
  }
  return true
}
