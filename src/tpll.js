import teleport from './modules/teleport'

importPackage(Packages.com.sk89q.worldedit)

const usage = `<latitude> <longitude> [altitude]
 • §o/cs tpll 47.58523 6.89725
 • §o/cs tpll 47.58523, 6.89725 370
 • §o/cs tpll 47°35'6.32"N 6°53'50.06"E
 • §o/cs tpll 47°35'6.32"N, 6°53'50.06"E 370`

context.checkArgs(2, 3, usage)

player.print('§7§oTeleportation...')

argv[1].replace(',', '')
argv[2].replace(',', '')

if ((argv[1] + '').match(new RegExp('\\d*°\\d*\'\\d*.\\d*"')) && (argv[2] + '').match(new RegExp('\\d*°\\d*\'\\d*.\\d*"'))) {
  argv[1] = dmsToll(argv[1])
  argv[2] = dmsToll(argv[2])
  teleport(Number.parseFloat(argv[2]), Number.parseFloat(argv[1]), Number.parseFloat(argv[3]))
} else if ((argv[1] + '').match(new RegExp('\\d*')) && (argv[2] + '').match(new RegExp('\\d*'))) {
  teleport(Number.parseFloat(argv[2]), Number.parseFloat(argv[1]), Number.parseFloat(argv[3]))
} else {
  player.printError('Wrong usage')
  player.printError(usage)
}

function dmsToll (dms) {
  dms = '' + dms
  const [degrees, minutes, seconds] = dms.split(new RegExp('°|\\\'|\\"'))
  return Number.parseFloat(degrees) + Number.parseFloat(minutes) / 60 + Number.parseFloat(seconds) / 3600
}
