/**
 * Copyright (c) 2020 Oganexon
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"),to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// Javascript Standard Style Helper
/* global importPackage Packages context player argv BufferedReader FileReader Vector */

importPackage(Packages.java.io)
importPackage(Packages.java.awt)
importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)

const ignoreBlocks = [
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

const allowedBlocks = [
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

const blocks = context.remember()

const usage = '/cs draw <file> [block] [options] \n' +
' '

context.checkArgs(1, 3, usage)

var changedBlocks = 0

const options = argv[3].split('')
const upOption = options.includes('u')

readFile()

function readFile () {
  const file = context.getSafeOpenFile('drawings', argv[1], 'json')

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
    parse(JSON.parse(bufStr))
    player.print('Operation completed (' + changedBlocks + ' blocks affected).')
  }
}

function parse (data) {
  if (!(data.bte && data.geometry && Array.isArray(data.geometry))) {
    player.printError('The specified file is invalid.')
  } else {
    const y = player.getPosition().y
    const block = argv[2] || data.block
    player.printDebug('Please wait...')
    for (var i = 0; i < data.geometry.length; i++) {
      var shape = data.geometry[i]
      for (var j = 0; j < shape.length - 1; j++) {
        var [x1, z1] = shape[j]
        var [x2, z2] = shape[j + 1]
        drawLine(x1, y, z1, x2, y, z2, block)
      }
    }
  }
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
      if (upOption) {
        pos = pos.add(new Vector(0, 1, 0))
      }
      blocks.setBlock(pos, context.getBlock(block))
      changedBlocks++
    }
  }
}
