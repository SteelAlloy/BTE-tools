import { rails as usage } from './modules/usage'
import { rails } from './modules/rails'
import { ignoredBlocks, allowedBlocks } from './modules/blocks'
import { getRadius, getRegion, transformIDs } from './modules/utils'

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)

context.checkArgs(0, 1, usage)

const region = getRegion()

const options = {
  block: 'iron_block',
  height: 1,
  offset: 0,
  regex: '^.*$',
  radius: getRadius(region),
  center: region.center,
  onGround: true,
  ignoreBuildings: true,
  ignoreVegetation: true,
  restrict: false,
  ignoredBlocks,
  allowedBlocks,
  ...JSON.parse(argv[1] || '{}')
}

transformIDs(options, 'ignoredBlocks')
transformIDs(options, 'allowedBlocks')

rails(options)
