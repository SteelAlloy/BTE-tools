const ModifiedAirocean = require('./ModifiedAirocean')
const GeographicProjection = require('./GeographicProjection')
const ScaleProjection = require('./ScaleProjection')

function getProjection () {
  const scale = 7318261.522857145
  const bteAirOcean = new ModifiedAirocean()
  const uprightProj = new GeographicProjection().orientProjection(bteAirOcean)
  return new ScaleProjection(uprightProj, scale, scale)
}

module.exports = getProjection
