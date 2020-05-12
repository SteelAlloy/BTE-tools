/* global importPackage Packages context player StringWriter IOUtils StandardCharsets Vector */
const getProjection = require('./modules/getProjection')
const { ignoredBlocks } = require('./modules/blocks')

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)
importPackage(Packages.java.io)
importPackage(Packages.java.net)
importPackage(Packages.java.nio.charset)
importPackage(Packages.org.apache.commons.io)
importPackage(Packages.javax.net.ssl)
importPackage(Packages.java.security)
importPackage(Packages.java.security.cert)

const usage = 'Select a region'

context.checkArgs(0, 0, usage)

const areaError = `An error has occurred in one area.
Please select a slightly different region.`

const session = context.getSession()
const blocks = context.remember()
const region = session.getRegionSelector(player.getWorld()).getRegion()

const air = context.getBlock('air')

const { coords, geoCoords } = getRegion()

try {
  ign()
} catch (err) {
  player.printError((err.message + '').split('http')[0])
}

function getRegion () {
  player.print('§7Please wait...')
  const projection = getProjection()

  const coords = [[]]
  const geoCoords = [[]]
  let index = 0
  let length = 0

  const minX = region.getMinimumPoint().getX()
  const minZ = region.getMinimumPoint().getZ()
  for (let x = minX; x < region.getWidth() + minX; x++) {
    for (let z = minZ; z < region.getLength() + minZ; z++) {
      if (length >= 150) {
        coords.push([])
        geoCoords.push([])
        index++
        length = 0
      }
      length++
      coords[index].push([x, z])
      geoCoords[index].push(projection.toGeo(x, z))
    }
  }

  return { coords, geoCoords }
}

function ign () {
  for (let i = 0; i < geoCoords.length; i++) {
    const query = `http://wxs.ign.fr/choisirgeoportail/alti/rest/elevation.json?lon=${geoCoords[i].map((block) => block[0]).join('|')}&lat=${geoCoords[i].map((block) => block[1]).join('|')}&zonly=true`
    const elevations = JSON.parse(request(query)).elevations
    if (elevationError(elevations)) {
      player.printError(areaError)
    } else {
      for (let j = 0; j < elevations.length; j++) {
        const [x, z] = coords[i][j]
        elevateGround(new Vector(x, Math.floor(elevations[j] + 0.5), z))
      }
    }
  }
}

function elevateGround (pos) {
  let ground = pos
  while (!ignoredBlocks.includes(blocks.getBlock(ground.add(new Vector(0, 1, 0))).id)) {
    ground = ground.add(new Vector(0, 1, 0))
  }
  while (ignoredBlocks.includes(blocks.getBlock(ground).id)) {
    ground = ground.add(new Vector(0, -1, 0))
  }
  const block0 = blocks.getBlock(ground)
  const block1 = blocks.getBlock(ground.add(new Vector(0, -1, 0)))
  if (ground.y < pos.y) {
    for (let y = ground.y; y < pos.y; y++) {
      blocks.setBlock(ground, block1)
      ground = ground.add(new Vector(0, 1, 0))
    }
    blocks.setBlock(pos, block0)
  } else {
    for (let y = ground.y + 1; y > pos.y; y--) {
      blocks.setBlock(ground, air)
      ground = ground.add(new Vector(0, -1, 0))
    }
    blocks.setBlock(pos, block0)
  }
}

function elevationError (elevations) {
  return elevations.includes(-99999.0)
}

function request (urlText) {
  const url = new URL(urlText)
  const c = url.openConnection()

  const is = c.getInputStream()

  const writer = new StringWriter()
  IOUtils.copy(is, writer, StandardCharsets.UTF_8)
  return writer.toString()
}
