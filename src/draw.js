/* global importPackage Packages context player argv BufferedReader FileReader Vector */
const getProjection = require('./projections/projection')

importPackage(Packages.java.io)
importPackage(Packages.java.awt)
importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)

const usage = '/cs draw <file> <block> [options] \n' +
  ' • §o/cs draw rails1 iron_block\n' +
  ' • §o/cs draw file3 stone u\n' +
  'Options:\n' +
  ' • §lu§r§c Draw a block above'

context.checkArgs(2, 3, usage)

const options = {}
if (argv[3]) {
  argv[3] = '' + argv[3]
  options.up = argv[3].includes('u')
}

const blocks = context.remember()
let changedBlocks = 0

const ignoreBlocks = getIgnoredBlocks()
const allowedBlocks = getAllowedBlocks()

const DataError = new Error('Incorrect data format')

draw(parse(readFile()))

function readFile () {
  const file = context.getSafeOpenFile('drawings', argv[1], 'geojson', ['json', 'geojson'])

  if (!file.exists()) {
    player.printError("Specified file doesn't exist.")
  } else {
    var buffer = new BufferedReader(new FileReader(file))
    var bufStr = ''
    var line = ''

    do {
      bufStr = bufStr + line
      bufStr = bufStr + '\n'
      line = buffer.readLine()
    } while (line)

    buffer.close()

    return JSON.parse(bufStr)
  }
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

function draw (geometry) {
  const y = player.getPosition().y
  const block = context.getBlock(argv[2])

  player.print('§7Please wait...')
  const projection = getProjection()

  for (let i = 0; i < geometry.length; i++) {
    const shape = geometry[i]
    for (let j = 0; j < shape.length - 1; j++) {
      const [x1, z1] = projection.fromGeo(...shape[j])
      const [x2, z2] = projection.fromGeo(...shape[j + 1])
      drawLine(x1, y, z1, x2, y, z2, block)
    }
  }

  player.print('Operation completed (' + changedBlocks + ' blocks affected).')
}

function drawLine (x1, y1, z1, x2, y2, z2, block) {
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

    while (!ignoreBlocks.includes(blocks.getBlock(pos.add(new Vector(0, 1, 0))).id)) {
      pos = pos.add(new Vector(0, 1, 0))
    }
    while (ignoreBlocks.includes(blocks.getBlock(pos).id)) {
      pos = pos.add(new Vector(0, -1, 0))
    }

    if (allowedBlocks.includes(blocks.getBlock(pos).id)) {
      if (options.up) {
        pos = pos.add(new Vector(0, 1, 0))
      }
      blocks.setBlock(pos, block)
      changedBlocks++
    }
  }
}

function getIgnoredBlocks () {
  return [
    context.getBlock('air').id,
    context.getBlock('tallgrass').id,
    context.getBlock('sapling').id,
    context.getBlock('log').id,
    context.getBlock('log2').id,
    context.getBlock('leaves').id,
    context.getBlock('leaves2').id,
    context.getBlock('deadbush').id,
    context.getBlock('red_flower').id,
    context.getBlock('yellow_flower').id,
    context.getBlock('red_mushroom').id,
    context.getBlock('brown_mushroom').id,
    context.getBlock('vine').id,
    context.getBlock('waterlily').id,
    context.getBlock('cactus').id,
    context.getBlock('reeds').id,
    context.getBlock('pumpkin').id,
    context.getBlock('melon_block').id,
    context.getBlock('snow_layer').id,
    context.getBlock('double_plant').id
  ]
}

function getAllowedBlocks () {
  return [
    context.getBlock('grass').id,
    context.getBlock('dirt').id,
    context.getBlock('stone').id,
    context.getBlock('sand').id,
    context.getBlock('grass_path').id,
    context.getBlock('concrete').id,
    context.getBlock('gravel').id,
    context.getBlock('water').id,
    context.getBlock('lava').id
  ]
}
