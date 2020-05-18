/* global importPackage Packages player StringWriter IOUtils StandardCharsets context BufferedReader FileReader */
const osmtogeojson = require('osmtogeojson')

importPackage(Packages.java.io)
importPackage(Packages.java.net)
importPackage(Packages.java.nio.charset)
importPackage(Packages.org.apache.commons.io)

module.exports = function (query, cb, options) {
  options = options || {}

  const cfg = readCFG('terra121')

  const serverOverpass = cfg
    ? cfg.match(new RegExp('overpass_interpreter=(.*)\\n'))[1]
    : 'https://overpass.kumi.systems/api/interpreter'

  player.printDebug(serverOverpass)

  const urltext = serverOverpass + '/api/interpreter?data=[out:json];' + query

  try {
    player.print('§7§oDatabase query...')
    const url = new URL(urltext)
    const c = url.openConnection()
    c.addRequestProperty('User-Agent', 'BTE-tools')

    const is = c.getInputStream()

    const writer = new StringWriter()
    IOUtils.copy(is, writer, StandardCharsets.UTF_8)
    const data = writer.toString()

    const geojson = osmtogeojson(JSON.parse(data), {
      flatProperties: options.flatProperties || false
    })
    cb(undefined, geojson)
  } catch (err) {
    player.printError('Osm region download failed, no osm features will spawn, ' + err)
  }
}

function readCFG (name) {
  const file = context.getSafeOpenFile('../', name, 'cfg')

  if (!file.exists()) {
    return undefined
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

    return bufStr
  }
}
