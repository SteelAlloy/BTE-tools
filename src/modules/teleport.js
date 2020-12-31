/* global Vector */
import getProjection from './getProjection'

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)

export default function teleport (lon, lat, height) {
  const projection = getProjection()

  const [x, z] = projection.fromGeo(lon, lat)

  let pos

  if (height) {
    pos = new Vector(x, Number.parseFloat(height) - 2, z)
  } else {
    pos = new Vector(x, player.getLocation().y, z)

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
}
