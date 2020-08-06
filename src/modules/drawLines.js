/* global Vector */

importClass(Packages.com.sk89q.worldedit.Vector)

const vectorUp = Vector.UNIT_Y
const vectorDown = Vector.UNIT_Y.multiply(-1)
let changedBlocks = 0

export function draw (lines, setBlock) {
  const y = player.getLocation().y
  for (let i = 0; i < lines.length; i++) {
    const [x1, z1, x2, z2] = lines[i]
    drawLine(x1, y, z1, x2, y, z2, setBlock)
  }
}

function drawLine (x1, y1, z1, x2, y2, z2, setBlock) {
  const lenX = x2 - x1
  const lenY = y2 - y1
  const lenZ = z2 - z1

  const max = Math.max(Math.abs(lenX), Math.abs(lenY), Math.abs(lenZ))

  const incrX = lenX / max
  const incrY = lenY / max
  const incrZ = lenZ / max

  const incrMax = Math.max(Math.abs(incrX), Math.abs(incrY), Math.abs(incrZ))

  for (let i = 0; i < max; i += incrMax) {
    const pos = new Vector(x1 + incrX * i | 0, y1 + incrY * i | 0, z1 + incrZ * i | 0)
    setBlock(pos)
  }
}

export function findGround (options, context) {
  const blocks = context.remember()
  return (pos) => {
    while (!options.ignoredBlocks.includes(blocks.getBlock(pos.add(vectorUp)).id)) {
      pos = pos.add(vectorUp)
    }
    while (options.ignoredBlocks.includes(blocks.getBlock(pos).id)) {
      pos = pos.add(vectorDown)
    }
    return pos
  }
}

export function insideRegion (options) {
  if (options.region) {
    const y = options.region.center.y
    return (pos) => options.region.contains(new Vector(pos.x, y, pos.z))
  }
  return (pos) => true
}

export function naturalBlock (options, context) {
  const blocks = context.remember()
  return (pos) => options.allowedBlocks.includes(blocks.getBlock(pos).id)
}

export function oneBlockAbove (options) {
  if (options.up) {
    return (pos) => pos.add(vectorUp)
  }
  return (pos) => pos
}

export function setWall (options, context) {
  const blocks = context.remember()
  const block = context.getBlock(options.block)
  if (options.height) {
    const height = Number.parseInt(options.height)
    return (pos) => {
      for (let i = 0; i < height; i++) {
        pos = pos.add(vectorUp)
        blocks.setBlock(pos, block)
        changedBlocks++
      }
    }
  }
  return (pos) => blocks.setBlock(pos, block)
}

export function setBlock (options, context) {
  const blocks = context.remember()
  const block = context.getBlock(options.block)
  return (pos) => {
    blocks.setBlock(pos, block)
    changedBlocks++
  }
}

export function printBlocks () {
  player.print(`Operation completed (${changedBlocks} blocks affected).`)
}
