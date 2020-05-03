/* global importPackage Packages player context argv Vector */
const getProjection = require('./getProjection')

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)

const usage = '<latitude> <longitude> [altitude]\n' +
' • §o/cs tpll 47.58523 6.89725\n' +
' • §o/cs tpll 47.58523, 6.89725 370'

context.checkArgs(2, 3, usage)

player.print('§7§oTeleportation...')

const projection = getProjection()

argv[1].replace(',', '')
argv[2].replace(',', '')

const [x, z] = projection.fromGeo(Number.parseFloat(argv[2]), Number.parseFloat(argv[1]))

let pos

if (argv[3]) {
  pos = new Vector(x, Number.parseFloat(argv[3]), z)
} else {
  pos = new Vector(x, player.getPosition().y, z)

  const blocks = context.remember()

  while (blocks.getBlock(pos.add(new Vector(0, 1, 0))).id !== context.getBlock('air').id) {
    pos = pos.add(new Vector(0, 1, 0))
  }
  while (blocks.getBlock(pos).id === context.getBlock('air').id) {
    pos = pos.add(new Vector(0, -1, 0))
  }
}

player.setPosition(pos.add(new Vector(0, 2, 0)))
player.print(`Teleported to ${pos.x} ${pos.y} ${pos.z}`)
