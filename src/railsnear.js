/* global importPackage Packages player context argv */
import { rails } from './modules/rails'
import { ignoredBlocks, allowedBlocks } from './modules/blocks'

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)

const usage = `<radius> [block] [flags]
• §o/cs rails radius 7
• §o/cs rails radius 50 stone u
Flags:
• §lu§r§c Draw a block above`

context.checkArgs(1, 2, usage)

const options = {
  block: 'iron_block',
  offset: 0,
  regex: '^.*$',
  radius: Number.parseFloat(argv[2]),
  center: player.getLocation(),
  ignoredBlocks,
  allowedBlocks,
  ...JSON.parse(argv[1] || '{}')
}

options.ignoredBlocks = options.ignoredBlocks.map((id) => context.getBlock(id).id)
options.allowedBlocks = options.allowedBlocks.map((id) => context.getBlock(id).id)

rails(options)
