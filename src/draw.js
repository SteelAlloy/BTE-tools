/* global importPackage Packages context player argv BufferedReader FileReader */
import draw from './modules/drawGeoJSON'

importPackage(Packages.java.io)
importPackage(Packages.java.awt)
importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)

const usage = `/cs draw <file> <block> [flags]
 • §o/cs draw rails1 iron_block
 • §o/cs draw file3 stone u
Flags:
 • §lu§r§c Draws a block above`

context.checkArgs(2, 3, usage)

const options = {}
if (argv[3]) {
  argv[3] = '' + argv[3]
  options.up = argv[3].includes('u')
}

player.print('§7Please wait...')
draw(readFile(), argv[2], options)

function readFile () {
  const file = context.getSafeOpenFile('drawings', argv[1], 'geojson', ['json', 'geojson'])

  if (!file.exists()) {
    player.printError("Specified file doesn't exist.")
  } else {
    var buffer = new BufferedReader(new FileReader(file))
    var bufStr = ''
    var line = ''

    do {
      bufStr = bufStr + line
      bufStr = bufStr + '\n'
      line = buffer.readLine()
    } while (line)

    buffer.close()

    return JSON.parse(bufStr)
  }
}
