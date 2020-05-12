/* global player */
const bte = require('../package.json')

const list = `Usage: /cs <COMMAND> [ARGS]
 • list : Lists all available commands.
 • tpll : Classic tpll command that also accepts degrees minutes seconds
 • draw : Traces any imported shape of an OpenStreetMap query - railroads, roads, etc.
 • rails : Traces all railroads in an area
 • address : Get the closest address
 • ign : Get better elevation data (only works in France)

BTE-tools v${bte.version}
Request features & report issues : ${bte.bugs.url}
 `

player.print(list)
