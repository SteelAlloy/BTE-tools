/* global importPackage Packages context */
import { request } from './modules/OSMcommand'
import decode from './modules/decodePolygon'
import { draw, findGround, insideRegion, naturalBlock, oneBlockAbove, setBlock, printBlocks } from './drawLines'

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)

export function rails (options) {
  request(options.radius, options.center, (s, n) => {
    return `(way[railway~"${options.regex}"](${s.join(',')},${n.join(',')});>;);out;`
  }, callback)

  function callback (data) {
    const lines = decode(data)
    const insideRegion_ = insideRegion(options)
    const findGround_ = findGround(options, context)
    const naturalBlock_ = naturalBlock(options, context)
    const oneBlockAbove_ = oneBlockAbove(options)
    const setBlock_ = setBlock(options, context)
    draw(lines, (pos) => {
      if (insideRegion_(pos)) {
        pos = findGround_(pos)
        if (naturalBlock_(pos)) {
          pos = oneBlockAbove_(pos)
          setBlock_(pos)
        }
      }
    })
    printBlocks()
  }
}
