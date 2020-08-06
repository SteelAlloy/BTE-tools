/* global context */

export const ignoredBlocks = [
  'air',
  'tallgrass',
  'sapling',
  'log',
  'log2',
  'leaves',
  'leaves2',
  'deadbush',
  'red_flower',
  'yellow_flower',
  'red_mushroom',
  'brown_mushroom',
  'vine',
  'waterlily',
  'cactus',
  'reeds',
  'pumpkin',
  'melon_block',
  'snow_layer',
  'double_plant'
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
