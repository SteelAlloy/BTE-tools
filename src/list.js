/* global player */
const bte = require('../package.json')

const list = `Usage: /cs <COMMAND> [ARGS]
 • list : Lists all available commands.
 • tpll : Replaces the tpll command.
 • tpdms : Same as tpll but takes degrees minutes seconds (such as 47°35'6.32"N 6°53'50.06"E ).
 • draw : Traces any imported shape of an OpenStreetMap query - railroads, roads, etc.
 • rails : Traces all railroads in an area
 • address : Get the closest address

BTE-tools v${bte.version}
Request features & report issues : ${bte.bugs.url}
 `

player.print(list)
