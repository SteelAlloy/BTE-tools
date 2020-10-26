import { hedgesnear as usage } from './modules/usage'
import { hedges } from './modules/hedges'
import { ignoredBlocks, allowedBlocks } from './modules/blocks'
import { transformIDs } from './modules/utils'

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)

context.checkArgs(1, 2, usage)

const options = {
  block: 'leaves:4',
  height: 2,
  offset: 1,
  radius: Number.parseFloat(argv[1]),
  center: player.getLocation(),
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

hedges(options)
