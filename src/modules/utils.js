const session = context.getSession()

export function getRadius (region) {
  const x = Math.abs(region.pos1.x - region.pos2.x)
  const z = Math.abs(region.pos1.z - region.pos2.z)
  return Math.sqrt(x * x + z * z) / 2
}

export function getRegion () {
  return session.getRegionSelector(player.getWorld()).getRegion()
}

export function transformIDs (options, field) {
  if (field === 'ignoredBlocks' && !options[field].includes('air')) {
    options[field].push('air')
  }
  options[field] = options[field].map((id) => context.getBlock(id).id)
}
