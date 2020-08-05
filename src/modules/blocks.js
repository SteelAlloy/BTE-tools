/* global context */

export const ignoredBlocks = [
  context.getBlock('air').id,
  context.getBlock('tallgrass').id,
  context.getBlock('sapling').id,
  context.getBlock('log').id,
  context.getBlock('log2').id,
  context.getBlock('leaves').id,
  context.getBlock('leaves2').id,
  context.getBlock('deadbush').id,
  context.getBlock('red_flower').id,
  context.getBlock('yellow_flower').id,
  context.getBlock('red_mushroom').id,
  context.getBlock('brown_mushroom').id,
  context.getBlock('vine').id,
  context.getBlock('waterlily').id,
  context.getBlock('cactus').id,
  context.getBlock('reeds').id,
  context.getBlock('pumpkin').id,
  context.getBlock('melon_block').id,
  context.getBlock('snow_layer').id,
  context.getBlock('double_plant').id
]

export const allowedBlocks = [
  context.getBlock('grass').id,
  context.getBlock('dirt').id,
  context.getBlock('stone').id,
  context.getBlock('sand').id,
  context.getBlock('grass_path').id,
  context.getBlock('concrete').id,
  context.getBlock('gravel').id,
  context.getBlock('water').id,
  context.getBlock('lava').id
]
