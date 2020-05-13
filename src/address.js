/* global importPackage Packages player context StringWriter IOUtils StandardCharsets */
const getProjection = require('./modules/getProjection')

importPackage(Packages.java.io)
importPackage(Packages.java.net)
importPackage(Packages.java.nio.charset)
importPackage(Packages.org.apache.commons.io)

context.checkArgs(0, 0, '/cs address')

player.print('§7§oGetting closest address...')

const { x, z } = player.getPosition()
const projection = getProjection()
const [lon, lat] = projection.toGeo(x, z)

const urltext = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`

const url = new URL(urltext)
const c = url.openConnection()
c.addRequestProperty('User-Agent', 'BTE-tools/1.0.2')

const is = c.getInputStream()

const writer = new StringWriter()
IOUtils.copy(is, writer, StandardCharsets.UTF_8)
const data = writer.toString()

player.print(JSON.parse(data).display_name)
