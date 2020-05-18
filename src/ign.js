/* global WorldEdit Vector RegionCommands StringWriter URL Thread StandardCharsets IOUtils */
const getProjection = require('./modules/getProjection')
const { ignoredBlocks } = require('./modules/blocks')

importClass(Packages.com.sk89q.worldedit.WorldEdit)
importClass(Packages.com.sk89q.worldedit.Vector)
importClass(Packages.com.sk89q.worldedit.command.RegionCommands)
importClass(Packages.java.io.StringWriter)
importClass(Packages.java.net.URL)
importClass(Packages.java.lang.Thread)
importClass(Packages.java.nio.charset.StandardCharsets)
importClass(Packages.org.apache.commons.io.IOUtils)

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
const world = session.getRegionSelector(player.getWorld())
const region = world.getRegion()

const air = context.getBlock('air')
const water = context.getBlock('water')
const lava = context.getBlock('lava')

const vectorUp = Vector.UNIT_Y
const vectorDown = Vector.UNIT_Y.multiply(-1)

if (!options.water) {
  if (ignoredBlocks.indexOf(water.id) < 0) {
    ignoredBlocks.push(water.id)
  }
  if (ignoredBlocks.indexOf(lava.id) < 0) {
    ignoredBlocks.push(lava.id)
  }
}

// Run

const selection = getSelection()
const terrain = ign(selection)
smooth(terrain)

// functions

function getSelection () {
  player.print('§7Please wait...')

  // Get coords (without duplicates)
  const iterator = region.iterator()
  const uniqueCoords = {} // {x: {z: true}}
  while (iterator.hasNext()) {
    const { x, z } = iterator.next()
    if (!uniqueCoords[x]) {
      uniqueCoords[x] = {}
    }
    uniqueCoords[x][z] = true
  }

  // Get as list
  const projection = getProjection()
  const coordsList = []
  for (const posX in uniqueCoords) {
    for (const posZ in uniqueCoords[posX]) {
      const x = Number.parseFloat(posX)
      const z = Number.parseFloat(posZ)
      const geo = projection.toGeo(x, z)
      coordsList.push({ x, z, lon: geo[0].toFixed(5), lat: geo[1].toFixed(5) })
    }
  }

  return coordsList
}

function getLon (coord) {
  return coord.lon
}
function getLat (coord) {
  return coord.lat
}

function ign (selectedCoords) {
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
  let maxY = Number.MIN_VALUE
  let minY = Number.MAX_VALUE

  const runReqs = (allCoords, maxSimultaneous) => {
    const allThreads = []
    for (let i = 0; i < allCoords.length; i += maxSimultaneous) {
      const group = allCoords.slice(i, i + maxSimultaneous).filter(a => a)
      const lons = group.map(getLon).join('|')
      const lats = group.map(getLat).join('|')
      const query = `http://wxs.ign.fr/choisirgeoportail/alti/rest/elevation.json?lon=${lons}&lat=${lats}&zonly=true`

      allThreads.push(requestAsync(query, (data) => {
        const elevations = data.elevations
        for (let j = 0; j < group.length; j++) {
          if (elevations[j] > -99999) {
            group[j].y = (elevations[j] + 0.5) | 0
            elevationMap.push(group[j])
            maxY = Math.max(maxY, elevations[j])
            minY = Math.min(minY, elevations[j])
          } else {
            retries.push(group[j])
          }
        }
      }, (err) => {
        if (err.match('Request Error:\nEmpty JSON string')) {
          player.print('§7Too many requests, please reduce region size next time.')
        } else {
          player.printError(err)
        }
        retries = retries.concat(group)
      }))
    }
    player.print(`Requesting information (${allCoords.length} blocs divided into ${allThreads.length} requests)...`)

    for (let i = 0; i < allThreads.length; i++) {
      allThreads[i].join()
      while (elevationMap.length > 0) {
        const elevationNode = elevationMap.shift()
        elevateGround(new Vector(elevationNode.x, elevationNode.y, elevationNode.z))
        success++
      }
    }

    if (retries.length > 0) {
      onRetryNeeded()
    }
  }

  runReqs(selectedCoords, 150)

  player.print(`Elevated ${success}/${selectedCoords.length} blocs successfully.`)

  return { maxY, minY }
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
  if (ground.y < pos.y) {
    const replace = blocks.getBlock(ground)
    for (let y = ground.y; y < pos.y; y++) {
      blocks.setBlock(ground, replace)
      ground = ground.add(vectorUp)
    }
    blocks.setBlock(pos, blocks.getBlock(ground))
  } else if (ground.y > pos.y) {
    const replace = blocks.getBlock(pos) === water ? water : air
    for (let y = ground.y + 1; y > pos.y; y--) {
      blocks.setBlock(ground, replace)
      ground = ground.add(vectorDown)
    }
    blocks.setBlock(pos, blocks.getBlock(ground))
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
    let out = null
    try {
      const c = new URL(url).openConnection()
      const writer = new StringWriter()
      IOUtils.copy(c.getInputStream(), writer, StandardCharsets.UTF_8)
      out = JSON.parse(writer.toString())
    } catch (err) {
      onError('Request Error:\n' + (err.message || url))
      return
    }
    try {
      onSuccess(out)
    } catch (err) {
      onError('Callback Error:\n' + (err.message || url))
    }
  })

  t.start()
  return t
}

// transform 2.5 blocks chunks into smooth surface
function smooth ({ maxY, minY }) {
  // apply block changes
  blocks.flushQueue()

  const up = Math.max(maxY - region.getMaximumPoint().y, 0)
  const down = Math.min(minY - region.getMinimumPoint().y, 0)

  // expansion & smooth sides
  region.expand(new Vector(0, up, 0), new Vector(0, down, 0))
  try {
    region.expand(new Vector(2, 0, 2), new Vector(-2, 0, -2))
  } catch {}

  // update region
  world.learnChanges()
  world.explainRegionAdjust(player, session)

  const commands = new RegionCommands(WorldEdit.getInstance())
  commands.smooth(context.getPlayer(), context.remember(), region, 2, false)
}
