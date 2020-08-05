import { elevation } from './modules/elevation'
import { ignoredBlocks } from './modules/blocks'

importClass(Packages.com.sk89q.worldedit.Vector)

importClass(Packages.com.sk89q.worldedit.WorldEdit)
importClass(Packages.com.sk89q.worldedit.command.RegionCommands)
importClass(Packages.java.io.StringWriter)
importClass(Packages.java.net.URL)
importClass(Packages.java.lang.Thread)
importClass(Packages.java.nio.charset.StandardCharsets)
importClass(Packages.org.apache.commons.io.IOUtils)

const usage = `[flags]
Flags:
 • §lw§r§c Keeps water
 • §ls§r§c Removes smoothing step`

context.checkArgs(0, 1, usage)

const options = {
  smooth: true,
  ignoreWater: false,
  ignoredBlocks,
  ...JSON.parse(argv[1] || '{}')
}

options.ignoredBlocks = options.ignoredBlocks.map((id) => context.getBlock(id).id)

elevation(options, (lons, lats) => `http://wxs.ign.fr/${process.env.IGN_API_KEY}/alti/rest/elevation.json?lon=${lons}&lat=${lats}&zonly=true`, (data) => data.elevations)
