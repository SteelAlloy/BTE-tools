import { gis_jp as usage } from './modules/usage'
import { elevation } from './modules/elevation'
import { ignoredBlocks } from './modules/blocks'
import { transformIDs } from './modules/utils'

importClass(Packages.com.sk89q.worldedit.Vector)

importClass(Packages.com.sk89q.worldedit.WorldEdit)
importClass(Packages.com.sk89q.worldedit.command.RegionCommands)
importClass(Packages.java.io.StringWriter)
importClass(Packages.java.net.URL)
importClass(Packages.java.lang.Thread)
importClass(Packages.java.nio.charset.StandardCharsets)
importClass(Packages.org.apache.commons.io.IOUtils)

context.checkArgs(0, 1, usage)

const options = {
  smooth: true,
  ignoreWater: false,
  ignoredBlocks,
  ...JSON.parse(argv[1] || '{}')
}

transformIDs(options, 'ignoredBlocks')

elevation(options,
  (lons, lats) => `https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php?lon=${lons}&lat=${lats}&outtype=JSON`,
  (data) => [data.elevation],
  1)
