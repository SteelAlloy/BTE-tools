/* global StringWriter IOUtils StandardCharsets */
import osmtogeojson from 'osmtogeojson'
import { readFile } from './readFile'

importPackage(Packages.java.io)
importPackage(Packages.java.net)
importPackage(Packages.java.nio.charset)
importPackage(Packages.org.apache.commons.io)

export default function overpass (query, cb, options) {
  options = options || {}

  const file = context.getSafeOpenFile('../', 'terra121', 'cfg', [])
  const cfg = readFile(file)

  const serverOverpass = cfg
    ? cfg.match(new RegExp('overpass_interpreter=(.*)\\n'))[1]
    : 'https://overpass.kumi.systems/api/interpreter'

  const urltext = serverOverpass + '/api/interpreter?data=[out:json];' + query
  let geojson

  try {
    player.print('§7§oDatabase query...')
    const url = new URL(urltext)
    const c = url.openConnection()
    c.addRequestProperty('User-Agent', 'BTE-tools')

    const is = c.getInputStream()

    const writer = new StringWriter()
    IOUtils.copy(is, writer, StandardCharsets.UTF_8)
    const data = writer.toString()

    geojson = osmtogeojson(JSON.parse(data), {
      flatProperties: options.flatProperties || false
    })
  } catch (err) {
    player.printError('Osm region download failed, no osm features will spawn')
    cb(err)
    return
  }
  cb(undefined, geojson)
}
