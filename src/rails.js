/* global importPackage Packages player context argv */
import { rails } from './modules/rails'
import { ignoredBlocks, allowedBlocks } from './modules/blocks'
import { getRadius } from './modules/OSMcommand'

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)

const session = context.getSession()

const usage = `[block] [flags]
 • §o/cs rails region
 • §o/cs rails region stone u
Flags:
 • §lu§r§c Draw a block above`

context.checkArgs(0, 1, usage)

const region = session.getRegionSelector(player.getWorld()).getRegion()

const options = {
  block: 'iron_block',
  offset: 0,
  regex: '^.*$',
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

rails(options)
