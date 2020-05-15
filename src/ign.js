/* global importPackage Packages context player StringWriter IOUtils StandardCharsets Vector argv Thread */
const getProjection = require('./modules/getProjection')
const { ignoredBlocks } = require('./modules/blocks')

const HeightMap = require('./modules/HeightMap')
const HeightMapFilter = require('./modules/HeightMapFilter')
const GaussianKernel = require('./modules/GaussianKernel')

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)
importPackage(Packages.java.io)
importPackage(Packages.java.net)
importPackage(Packages.java.lang)
importPackage(Packages.java.nio.charset)
importPackage(Packages.org.apache.commons.io)

const usage = `[flags]
Flags:
 • §lw§r§c Keeps water`

context.checkArgs(0, 1, usage)

const options = {}
if (argv[1]) {
  argv[1] = '' + argv[1]
  options.water = argv[1].includes('w')
}

const session = context.getSession()
const blocks = context.remember()
const region = session.getRegionSelector(player.getWorld()).getRegion()

const air = context.getBlock('air')
const water = context.getBlock('water')
const lava = context.getBlock('lava')

const vectorUp = new Vector(0, 1, 0)
const vectorDown = new Vector(0, -1, 0)

if (!options.water) {
  if (ignoredBlocks.indexOf(water.id) < 0) {
    ignoredBlocks.push(water.id)
  }
  if (ignoredBlocks.indexOf(lava.id) < 0) {
    ignoredBlocks.push(lava.id)
  }
}

// Run
const selectedCoords = getRegion()

ign()
smooth()

// transform 2.5 blocks chunks into smooth surface
function smooth () {
  // TODO : get function from WorldEdit

  // TODO : get correct region after elevation
  // region.expand(new Vector(0, 10, 0), new Vector(0, -10, 0))

  blocks.flushQueue()

  const iterations = 1
  const heightMap = new HeightMap(context.remember(), region)
  const filter = new HeightMapFilter(new GaussianKernel(5, 1.0))
  const affected = heightMap.applyFilter(filter, iterations)
  player.print(`${affected} blocks have been smoothed`)
}

// functions

function getRegion () {
  player.print('§7Please wait...')
  const projection = getProjection()

  const coords = []
  const minX = region.getMinimumPoint().getX()
  const minZ = region.getMinimumPoint().getZ()
  const maxX = region.getWidth() + minX
  const maxZ = region.getLength() + minZ
  for (let x = minX; x < maxX; x++) {
    for (let z = minZ; z < maxZ; z++) {
      coords.push({ x: x, z: z, geo: projection.toGeo(x, z) })
    }
  }

  return coords
}

function getLon (coord) {
  return coord.geo[0]
}
function getLat (coord) {
  return coord.geo[1]
}

function ign () {
  let retries = [] // store coords that failed once, to retry fetching them once after

  let onRetryNeeded = () => {
    player.print(`${retries.length} blocks have failed to elevate. Retrying...`)

    // extract retries list
    const retrying = retries

    // empty retries list
    retries = []

    // do not retry once more, show error message instead of an infinite loop
    onRetryNeeded = () => {
      player.printError(`${retries.length} blocks failed to elevate.\nPlease select a slightly different region.`)
    }

    // retry once with smaller groups
    runReqs(retrying, 50)
  }

  const elevationMap = []
  let success = 0

  const runReqs = (allCoords, maxSimultaneous) => {
    const allThreads = []
    for (let i = 0; i < allCoords.length; i += maxSimultaneous) {
      const group = allCoords.slice(i, i + maxSimultaneous)
      const lons = group.map(getLon).join('|')
      const lats = group.map(getLat).join('|')
      const query = `http://wxs.ign.fr/choisirgeoportail/alti/rest/elevation.json?lon=${lons}&lat=${lats}&zonly=true`

      allThreads.push(requestAsync(query, (data) => {
        const elevations = data.elevations
        for (let j = 0; j < group.length; j++) {
          if (elevations[j] > -99999) {
            elevationMap.push({ x: group[j].x, y: (elevations[j] + 0.5) | 0, z: group[j].z })
          } else {
            retries.push(group[j])
          }
        }
      }, (err) => {
        player.printError(`Request Error \n${(err.message + '').split('http')[0]}`)
        retries = retries.concat(group)
      }))
    }
    player.print(`Requesting information (${allCoords.length} blocs divided into ${allThreads.length} requests)...`)

    for (let i = 0; i < allThreads.length; i++) {
      allThreads[i].join()
      while (elevationMap.length > 0) {
        const elevationNode = elevationMap.shift()
        if (elevationNode) {
          elevateGround(new Vector(elevationNode.x, elevationNode.y, elevationNode.z))
          success++
        }
      }
    }

    if (retries.length > 0) {
      onRetryNeeded()
    }
  }

  runReqs(selectedCoords, 150)

  player.print(`Elevated ${success}/${selectedCoords.length} blocs successfully.`)
}

function elevateGround (pos) {
  // look for current ground location
  let ground = pos
  while (!ignoredBlocks.includes(blocks.getBlock(ground.add(vectorUp)).id)) {
    ground = ground.add(vectorUp)
  }
  while (ignoredBlocks.includes(blocks.getBlock(ground).id)) {
    ground = ground.add(vectorDown)
  }

  // update ground height
  const block0 = blocks.getBlock(ground)
  const block1 = blocks.getBlock(ground.add(vectorDown))
  if (ground.y < pos.y) {
    for (let y = ground.y; y < pos.y; y++) {
      blocks.setBlock(ground, block1)
      ground = ground.add(vectorUp)
    }
    blocks.setBlock(pos, block0)
  } else if (ground.y > pos.y) {
    const replace = blocks.getBlock(pos) === water ? water : air
    for (let y = ground.y + 1; y > pos.y; y--) {
      blocks.setBlock(ground, replace)
      ground = ground.add(vectorDown)
    }
    blocks.setBlock(pos, block0)
  }
}

function requestAsync (url, onSuccess, onError) {
  /**
   * url: string like "http://xxx.com/..."
   * cb: function like cb(data, error)
   *    data: data returned by the url; null in case of error
   *    error: null if data returned; error description in case of problem
   */
  const t = new Thread(() => {
    try {
      const c = new URL(url).openConnection()
      const writer = new StringWriter()
      IOUtils.copy(c.getInputStream(), writer, StandardCharsets.UTF_8)
      onSuccess(JSON.parse(writer.toString()))
    } catch (err) {
      onError(err)
    }
  })
  t.start()
  return t
}
