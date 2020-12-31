/* global StringWriter IOUtils StandardCharsets */
import { italic, gray, red } from './modules/colors'
import { goto as usage } from './modules/usage'
import teleport from './modules/teleport'

importPackage(Packages.java.io)
importPackage(Packages.java.net)
importPackage(Packages.java.nio.charset)
importPackage(Packages.org.apache.commons.io)

context.checkArgs(1, -1, usage)

// Maximum amount of results returned by the API.
const limit = 1

// Allows the player to type '/cs goto A place with spaces in its name'.
const fullInput = argv.slice(1).join(' ')

player.print(`${gray}${italic}Searching for '${fullInput}'...`)

const urlText = encodeURI(
  `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${fullInput}&limit=${limit}`
)
const url = new URL(urlText)
const c = url.openConnection()
c.addRequestProperty('User-Agent', 'BTE-tools')

const is = c.getInputStream()
const writer = new StringWriter()
IOUtils.copy(is, writer, StandardCharsets.UTF_8)
const data = writer.toString()
const locations = JSON.parse(data)

if (locations.length === 0) {
  player.print(`${red}No result found for '${fullInput}'!`)
} else {
  const location = locations[0]
  player.print(`${gray}${italic}Teleporting to ${location.display_name}.`)
  teleport(location.lon, location.lat)
}
