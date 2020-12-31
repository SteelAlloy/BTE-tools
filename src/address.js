/* global StringWriter IOUtils StandardCharsets */
import getProjection from './modules/getProjection'

importPackage(Packages.java.io)
importPackage(Packages.java.net)
importPackage(Packages.java.nio.charset)
importPackage(Packages.org.apache.commons.io)

context.checkArgs(0, 0, '/cs address')

player.print('§7§oGetting closest address...')

const { x, z } = player.getLocation()
const projection = getProjection()
const [lon, lat] = projection.toGeo(x, z)

const urltext = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`

const url = new URL(urltext)
const c = url.openConnection()
c.addRequestProperty('User-Agent', 'BTE-tools')

const is = c.getInputStream()

const writer = new StringWriter()
IOUtils.copy(is, writer, StandardCharsets.UTF_8)
const data = writer.toString()

player.print(JSON.parse(data).display_name)
