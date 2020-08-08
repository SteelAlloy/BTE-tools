/* global Vector2D */

/* UNSTABLE COMMAND */

import getProjection from './getProjection'

importClass(Packages.com.sk89q.worldedit.Vector2D)

const projection = getProjection()

const pos = player.getLocation()

const vectorProj = projection.vector(pos.x, pos.z, 1, 0)

const vector = new Vector2D(vectorProj[0], vectorProj[1]).normalize()

const toDegrees = 180 / Math.PI

const mercatorAngle = Math.asin(vector.x) * toDegrees

const parisMeridian = 2.337222

const angle = mercatorAngle + (projection.toGeo(pos.x, pos.z)[0] - parisMeridian) * 0.8

player.print(mercatorAngle)
player.print(projection.toGeo(pos.x, pos.z)[0])
player.print(projection.toGeo(pos.x, pos.z)[0] - parisMeridian)
player.print(angle)
