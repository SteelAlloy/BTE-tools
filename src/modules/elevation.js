/* global WorldEdit RegionCommands StringWriter URL Thread StandardCharsets IOUtils Vector */
import getProjection from './getProjection'
import { getConfig } from './readFile'
import xmlToJson from './xmlToJson'

importClass(Packages.com.sk89q.worldedit.Vector)

importClass(Packages.com.sk89q.worldedit.WorldEdit)
importClass(Packages.com.sk89q.worldedit.command.RegionCommands)
importClass(Packages.java.io.StringWriter)
importClass(Packages.java.net.URL)
importClass(Packages.java.lang.Thread)
importClass(Packages.java.nio.charset.StandardCharsets)
importClass(Packages.org.apache.commons.io.IOUtils)

const config = getConfig()

const session = context.getSession()
const blocks = context.remember()
const world = session.getRegionSelector(player.getWorld())
const region = world.getRegion()

const air = context.getBlock('air')
const water = context.getBlock('water')
const lava = context.getBlock('lava')

const vectorUp = Vector.UNIT_Y
const vectorDown = Vector.UNIT_Y.multiply(-1)

export function elevation (options, getQuery, getElevations, maxSimultaneous) {
  if (!options.ignoreWater) {
    if (options.ignoredBlocks.indexOf(water.id) < 0) {
      options.ignoredBlocks.push(water.id)
    }
    if (options.ignoredBlocks.indexOf(lava.id) < 0) {
      options.ignoredBlocks.push(lava.id)
    }
  }

  const selection = getSelection()
  const blockLimit = config.elevationBlockLimit
  if (blockLimit && blockLimit > 0 && selection.length > blockLimit) {
    player.printError(`Please select an area of less than ${blockLimit} blocks`)
    return
  }
  const terrain = fixElevation(selection, options, getQuery, getElevations, maxSimultaneous)
  if (options.smooth) {
    smooth(terrain)
  }
}

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

  // for of

  // Get as list
  const projection = getProjection()
  const coordsList = []
  for (const posX in uniqueCoords) {
    for (const posZ in uniqueCoords[posX]) {
      const x = Number.parseFloat(posX)
      const z = Number.parseFloat(posZ)
      const geo = projection.toGeo(x, z)
      coordsList.push({ x: x, z: z, lon: geo[0].toFixed(5), lat: geo[1].toFixed(5) })
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

function fixElevation (selectedCoords, options, getQuery, getElevations, maxSimultaneous) {
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
    runReqs(retrying, maxSimultaneous || 50)
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
      const query = getQuery(lons, lats)

      allThreads.push(requestAsync(query, (data) => {
        const elevations = getElevations(data)
        for (let j = 0; j < group.length; j++) {
          // process data only if it make sense (some places like Guyana can have more than a billion meters of altitude according to the API)
          if (elevations[j] > -15000 && elevations[j] < 10000) {
            group[j].y = elevations[j] | 0
            const previousY = findGround(new Vector(group[j].x, group[j].y, group[j].z), options)
            group[j].previousY = previousY
            elevationMap.push(group[j])
            maxY = Math.max(maxY, elevations[j], previousY)
            minY = Math.min(minY, elevations[j], previousY)
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
        if (elevationNode) {
          const newPos = new Vector(elevationNode.x, elevationNode.y, elevationNode.z)
          elevateGround(elevationNode.previousY, newPos)
          success++
        }
      }
    }

    if (retries.length > 0) {
      onRetryNeeded()
    }
  }

  runReqs(selectedCoords, maxSimultaneous || 150)

  player.print(`Elevated ${success}/${selectedCoords.length} blocs successfully.`)

  return { maxY, minY }
}

function findGround (pos, options) {
  // look for current ground location
  let groundPos = pos
  while (!options.ignoredBlocks.includes(blocks.getBlock(groundPos.add(vectorUp)).id)) {
    groundPos = groundPos.add(vectorUp)
  }
  while (options.ignoredBlocks.includes(blocks.getBlock(groundPos).id)) {
    groundPos = groundPos.add(vectorDown)
  }
  return groundPos.y
}

function elevateGround (previousY, newPos) {
  // update ground height
  let previousPos = new Vector(newPos.x, previousY, newPos.z)
  const surface = blocks.getBlock(previousPos)
  if (previousPos.y < newPos.y) {
    const underground = blocks.getBlock(previousPos.add(vectorDown))

    for (let y = previousPos.y; y < newPos.y; y++) {
      blocks.setBlock(previousPos, underground)
      previousPos = previousPos.add(vectorUp)
    }
    blocks.setBlock(newPos, surface)
  } else if (previousPos.y > newPos.y) {
    const replace = blocks.getBlock(newPos) === water ? water : air

    for (let y = previousPos.y + 1; y > newPos.y; y--) {
      blocks.setBlock(previousPos, replace)
      previousPos = previousPos.add(vectorDown)
    }
    blocks.setBlock(newPos, surface)
  }

  return previousY
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
      c.addRequestProperty('User-Agent', 'BTE-tools')
      const writer = new StringWriter()
      IOUtils.copy(c.getInputStream(), writer, StandardCharsets.UTF_8)
      const response = writer.toString()
      if (response.startsWith('{')) {
        out = JSON.parse(response)
      } else {
        out = xmlToJson(response)
      }
    } catch (err) {
      onError(('Request Error:\n' + (err.message || url)).split('http')[0])
      return
    }
    try {
      onSuccess(out)
    } catch (err) {
      onError(('Callback Error:\n' + (err.message || url)).split('http')[0])
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
  } catch { }

  const commands = new RegionCommands(WorldEdit.getInstance())
  commands.smooth(context.getPlayer(), context.remember(), region, 2, false)

  try {
    region.contract(new Vector(2, 0, 2), new Vector(-2, 0, -2))
  } catch { }

  // update region
  world.learnChanges()
  world.explainRegionAdjust(player, session)
}
