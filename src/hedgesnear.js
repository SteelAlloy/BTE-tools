import { hedges } from './modules/hedges'
import { ignoredBlocks, allowedBlocks } from './modules/blocks'

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)

const usage = `<radius> [flags]
 • §o/cs hedges radius 7
 • §o/cs hedges radius 50 u
Flags:
 • §lu§r§c Draw a block above`

context.checkArgs(0, 2, usage)

const options = {
  block: 'leaves:4',
  height: 2,
  radius: Number.parseFloat(argv[1]),
  center: player.getLocation(),
  onGround: true,
  ignoreBuildings: true,
  ignoreTrees: true,
  ignoredBlocks,
  allowedBlocks,
  ...JSON.parse(argv[2] || '{}')
}

options.ignoredBlocks = options.ignoredBlocks.map((id) => context.getBlock(id).id)
options.allowedBlocks = options.allowedBlocks.map((id) => context.getBlock(id).id)

hedges(options)
