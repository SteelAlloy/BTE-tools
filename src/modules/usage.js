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
export const elevationFrance = `${command}/cs elevationFrance ${optional}[options] 
${example}/cs elevationFrance
${example}/cs elevationFrance {"smooth":false,"ignoreWater":true}
Default options: ${object}{
${object}"smooth": ${boolean}true${object},
${object}"ignoreWater": ${boolean}false${object},
${object}"ignoredBlocks": [${string}"see documentation"${object}],
${object}}
`
export const elevationJapan = `${command}/cs elevationJapan ${optional}[options] 
${example}/cs elevationJapan
${example}/cs elevationJapan {"smooth":false,"ignoreWater":true}
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
${object}"offset": ${number}0${object},
${object}"onGround": ${boolean}true${object},
${object}"ignoreBuildings": ${boolean}true${object},
${object}"ignoreVegetation": ${boolean}true${object},
${object}"ignoredBlocks": [${string}"see documentation"${object}],
${object}"allowedBlocks": [${string}"see documentation"${object}]
${object}}
`

export const hedgesnear = `${command}/cs hedgesnear ${optional}[options] 
${example}/cs hedgesnear 7
${example}/cs hedgesnear 50 {"block":"stone","height":5}
Default options: ${object}{
${object}"block": ${string}"leaves:4"${object},
${object}"height": ${number}2${object},
${object}"offset": ${number}0${object},
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
  ${example}/cs tpll 47°35'6.32"N, 6°53'50.06"E 370`
