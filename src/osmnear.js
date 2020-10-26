import { osmnear as usage } from './modules/usage'
import { osm } from './modules/osm'
import { ignoredBlocks, allowedBlocks } from './modules/blocks'
import { transformIDs } from './modules/utils'

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)

context.checkArgs(2, 3, usage)

const options = {
  block: 'diamond_block',
  offset: 0,
  query: argv[1],
  radius: Number.parseFloat(argv[2]),
  center: player.getLocation(),
  onGround: true,
  ignoreBuildings: true,
  ignoreVegetation: true,
  restrict: false,
  ignoredBlocks,
  allowedBlocks,
  ...JSON.parse(argv[3] || '{}')
}

transformIDs(options, 'ignoredBlocks')
transformIDs(options, 'allowedBlocks')

osm(options)
