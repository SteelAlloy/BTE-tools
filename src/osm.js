import { osm as usage } from './modules/usage'
import { osm } from './modules/osm'
import { ignoredBlocks, allowedBlocks } from './modules/blocks'
import { getRadius, getRegion, transformIDs } from './modules/utils'

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)

context.checkArgs(1, 2, usage)

const region = getRegion()

const options = {
  block: 'diamond_block',
  height: 1,
  offset: 0,
  query: argv[1],
  radius: getRadius(region),
  center: region.center,
  onGround: true,
  ignoreBuildings: true,
  ignoreVegetation: true,
  restrict: false,
  ignoredBlocks,
  allowedBlocks,
  ...JSON.parse(argv[2] || '{}')
}

transformIDs(options, 'ignoredBlocks')
transformIDs(options, 'allowedBlocks')

osm(options)
