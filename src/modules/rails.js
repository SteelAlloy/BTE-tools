import { request } from './OSMcommand'
import decode from './decodePolygon'
import { draw, findGround, ignoreBuildings, setOffset, setWall, printBlocks } from './drawLines'

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)

export function rails (options) {
  request(options.radius, options.center, (s, n) => {
    return `(way[railway~"${options.regex}"](${s.join(',')},${n.join(',')});>;);out;`
  }, callback)

  function callback (data) {
    const lines = decode(data)
    const findGround_ = findGround(options)
    const ignoreBuildings_ = ignoreBuildings(options)
    const setOffset_ = setOffset(options)
    const setWall_ = setWall(options)
    draw(lines, (pos) => {
      pos = findGround_(pos)
      if (ignoreBuildings_(pos)) {
        pos = setOffset_(pos)
        setWall_(pos)
      }
    })
    printBlocks()
  }
}
