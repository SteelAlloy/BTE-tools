import { command, required, optional, example, object, string, number, boolean } from './colors'

export const draw = `${command}/cs draw ${required}<file> ${optional}[block] [options] 
${example}/cs draw rails1 iron_block
${example}/cs draw file3.kml stone {"offset":3,"onGround":false}
Default options: ${object}{
  ${object}"block": ${string}"gold_block"${object},
  ${object}"height": ${number}1${object},
  ${object}"offset": ${number}0${object},
  ${object}"onGround": ${boolean}true${object},
  ${object}"ignoreBuildings": ${boolean}true${object},
  ${object}"ignoreVegetation": ${boolean}true${object},
  ${object}"ignoredBlocks": [${string}"see documentation"${object}],
  ${object}"allowedBlocks": [${string}"see documentation"${object}]
  ${object}}
`
export const gis_fr = /* eslint-disable-line camelcase */
`${command}/cs gis_fr ${optional}[options] 
${example}/cs gis_fr
${example}/cs gis_fr {"smooth":false,"ignoreWater":true}
Default options: ${object}{
  ${object}"smooth": ${boolean}true${object},
  ${object}"ignoreWater": ${boolean}false${object},
  ${object}"ignoredBlocks": [${string}"see documentation"${object}],
${object}}
`
export const gis_jp = /* eslint-disable-line camelcase */
`${command}/cs gis_jp ${optional}[options] 
${example}/cs gis_jp
${example}/cs gis_jp {"smooth":false,"ignoreWater":true}
Default options: ${object}{
  ${object}"smooth": ${boolean}true${object},
  ${object}"ignoreWater": ${boolean}false${object},
  ${object}"ignoredBlocks": [${string}"see documentation"${object}],
${object}}
`
export const gis_no = /* eslint-disable-line camelcase */
`${command}/cs gis_no ${optional}[options] 
${example}/cs gis_no
${example}/cs gis_no {"smooth":false,"ignoreWater":true}
Default options: ${object}{
  ${object}"smooth": ${boolean}true${object},
  ${object}"ignoreWater": ${boolean}false${object},
  ${object}"ignoredBlocks": [${string}"see documentation"${object}],
${object}}
`

export const hedges = `${command}/cs hedges ${optional}[options] 
${example}/cs hedges
${example}/cs hedges {"block":"stone","height":5}
Default options: ${object}{
  ${object}"block": ${string}"leaves:4"${object},
  ${object}"height": ${number}2${object},
  ${object}"offset": ${number}1${object},
  ${object}"onGround": ${boolean}true${object},
  ${object}"ignoreBuildings": ${boolean}true${object},
  ${object}"ignoreVegetation": ${boolean}true${object},
  ${object}"ignoredBlocks": [${string}"see documentation"${object}],
  ${object}"allowedBlocks": [${string}"see documentation"${object}]
${object}}
`

export const hedgesnear = `${command}/cs hedgesnear ${required}<radius> ${optional}[options] 
${example}/cs hedgesnear 7
${example}/cs hedgesnear 50 {"block":"stone","height":5}
Default options: ${object}{
  ${object}"block": ${string}"leaves:4"${object},
  ${object}"height": ${number}2${object},
  ${object}"offset": ${number}1${object},
  ${object}"onGround": ${boolean}true${object},
  ${object}"ignoreBuildings": ${boolean}true${object},
  ${object}"ignoreVegetation": ${boolean}true${object},
  ${object}"ignoredBlocks": [${string}"see documentation"${object}],
  ${object}"allowedBlocks": [${string}"see documentation"${object}]
${object}}
`

export const osm = `${command}/cs osm ${required}<query> ${optional}[options] 
  ${example}/cs osm way[highway~"^.*$"]
  ${example}/cs osm way[railway~"^.*$"] {"block":"stone","offset":5}
Default options: ${object}{
  ${object}"block": ${string}"diamond_block"${object},
  ${object}"offset": ${number}0${object},
  ${object}"height": ${number}1${object},
  ${object}"onGround": ${boolean}true${object},
  ${object}"ignoreBuildings": ${boolean}true${object},
  ${object}"ignoreVegetation": ${boolean}true${object},
  ${object}"ignoredBlocks": [${string}"see documentation"${object}],
  ${object}"allowedBlocks": [${string}"see documentation"${object}]
${object}}
`

export const osmnear = `${command}/cs osmnear ${required}<query> <radius> ${optional}[options] 
  ${example}/cs osmnear way[highway~"^.*$"] 7
  ${example}/cs osmnear way[railway~"^.*$"] 50 {"block":"stone","offset":5}
Default options: ${object}{
  ${object}"block": ${string}"diamond_block"${object},
  ${object}"offset": ${number}0${object},
  ${object}"height": ${number}1${object},
  ${object}"regex": ${string}"^.*$"${object},
  ${object}"onGround": ${boolean}true${object},
  ${object}"ignoreBuildings": ${boolean}true${object},
  ${object}"ignoreVegetation": ${boolean}true${object},
  ${object}"ignoredBlocks": [${string}"see documentation"${object}],
  ${object}"allowedBlocks": [${string}"see documentation"${object}]
${object}}
`

export const rails = `${command}/cs rails ${optional}[options] 
  ${example}/cs rails
  ${example}/cs rails {"block":"stone","offset":5}
Default options: ${object}{
  ${object}"block": ${string}"iron_block"${object},
  ${object}"offset": ${number}0${object},
  ${object}"height": ${number}1${object},
  ${object}"regex": ${string}"^.*$"${object},
  ${object}"onGround": ${boolean}true${object},
  ${object}"ignoreBuildings": ${boolean}true${object},
  ${object}"ignoreVegetation": ${boolean}true${object},
  ${object}"ignoredBlocks": [${string}"see documentation"${object}],
  ${object}"allowedBlocks": [${string}"see documentation"${object}]
${object}}
`

export const railsnear = `${command}/cs railsnear ${required}<radius> ${required}[options] 
  ${example}/cs railsnear 7
  ${example}/cs railsnear 50 {"block":"stone","offset":5}
Default options: ${object}{
  ${object}"block": ${string}"iron_block"${object},
  ${object}"offset": ${number}0${object},
  ${object}"height": ${number}1${object},
  ${object}"regex": ${string}"^.*$"${object},
  ${object}"onGround": ${boolean}true${object},
  ${object}"ignoreBuildings": ${boolean}true${object},
  ${object}"ignoreVegetation": ${boolean}true${object},
  ${object}"ignoredBlocks": [${string}"see documentation"${object}],
  ${object}"allowedBlocks": [${string}"see documentation"${object}]
${object}}
`

export const tpll = `${command}/cs tpll ${required}<latitude> <longitude> ${required}[altitude]
  ${example}/cs tpll 47.58523 6.89725
  ${example}/cs tpll 47.58523, 6.89725 370
  ${example}/cs tpll 47°35'6.32"N 6°53'50.06"E
  ${example}/cs tpll 47°35'6.32"N, 6°53'50.06"E 370
`

export const goto = `${command}/cs goto ${required}<search query>
  ${example}/cs goto Paris
  ${example}/cs goto Abidjan
  ${example}/cs goto Area 51, USA
  ${example}/cs goto Machu Picchu, Peru
`
