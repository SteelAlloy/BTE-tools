/* global importPackage Packages player StringWriter IOUtils StandardCharsets */
const osmtogeojson = require('osmtogeojson')

importPackage(Packages.java.io)
importPackage(Packages.java.net)
importPackage(Packages.java.nio.charset)
importPackage(Packages.org.apache.commons.io)

module.exports = function (query, cb, options) {
  options = options || {}

  const serverOverpass = 'https://overpass.kumi.systems/api/interpreter'
  const urltext = serverOverpass + '/api/interpreter?data=[out:json];' + query

  try {
    player.print('§7§oDatabase query...')
    const url = new URL(urltext)
    const c = url.openConnection()
    c.addRequestProperty('User-Agent', 'BTE-tools/1.0.2')

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
