import { command, optional, example, white, green, bold, yellow, underline } from './modules/colors'
import * as usage from './modules/usage'

const bte = require('../package.json')
const arg = argv[1]

const help = `${command}/cs help ${optional}[command]
${example} • help : Lists all available commands.
${example} • tpll : Classic tpll command that also accepts degrees minutes seconds
${example} • draw : Traces any imported shape of an OpenStreetMap query - railroads, roads, etc.
${example} • address : Get the closest address
${example} • rails : Traces all railroads in an area 
${example} • railsnear : Traces all railroads around the player
${example} • hedges : Traces all hedges in an area 
${example} • hedgesnear : Traces all hedges around the player
${example} • elevationFrance : Get better elevation data in France
${example} • elevationJapan : Get better elevation data in Japan

${white}BTE-tools ${green}${bold}v${bte.version}
${white}Request features & report issues : ${yellow}${underline}${bte.bugs.url}
`

context.checkArgs(0, 1, help)

if (arg in usage) {
  player.print(`Usage: ${usage[arg]}`)
} else {
  player.print(`Usage: ${help}`)
}
