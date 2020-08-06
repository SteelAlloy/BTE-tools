import { hedges } from './modules/hedges'
import { getRadius } from './modules/OSMcommand'
import { ignoredBlocks, allowedBlocks } from './modules/blocks'

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)

const usage = `[flags]
 • §o/cs hedges region
 • §o/cs hedges region u
Flags:
 • §lu§r§c Draw a block above`

const session = context.getSession()

context.checkArgs(0, 1, usage)

const region = session.getRegionSelector(player.getWorld()).getRegion()

const options = {
  block: 'leaves:4',
  height: 2,
  offset: 0,
  radius: getRadius(region),
  center: region.center,
  onGround: true,
  ignoreBuildings: true,
  ignoreTrees: true,
  ignoredBlocks,
  allowedBlocks,
  ...JSON.parse(argv[1] || '{}')
}

options.ignoredBlocks = options.ignoredBlocks.map((id) => context.getBlock(id).id)
options.allowedBlocks = options.allowedBlocks.map((id) => context.getBlock(id).id)

hedges(options)
