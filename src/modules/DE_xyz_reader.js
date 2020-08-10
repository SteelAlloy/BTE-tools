/* reads the data in .xyz files provided by germany and transforms them into an readable state */

// getRegioSelection if too high break
// get Pos1 xy Pos2 xy coordinates, convert -->  UTM
var EPos1 = 346 // get from Selection !test value! 346000.toString().substr(0, 2)
var NPos1 = 5646 // get from Selection !test value! 5646000.toString().substr(0, 3)
var EPos2 = 344 // get from Selection !test value! 344000.toString().substr(0, 2)
var NPos2 = 5644 // get from Selection !test value! 5644000.toString().substr(0, 3)
var Edif = EPos1 - EPos2 // for example 4
console.log(Edif)
var Ndif = NPos1 - NPos2
console.log(Ndif)
var TilE = []
var TilN = []
var TileNumbers = [] // List of Tiles that will be loaded
var UtmGridNr = 32 // Get out of coordinate conversion

if (Edif > 0) {
  for (let i = 0; i < Edif + 1; i += 2) {
    TilE.push(EPos2 + i)
  }
} else if (Edif < 0) {
  for (let i = 0; i < Math.abs(Edif) + 1; i += 2) {
    TilE.push(EPos1 + i)
  }
} else {
  TilE.push(EPos1)
}

if (Ndif > 0) {
  for (let i = 0; i < Ndif + 1; i += 2) {
    TilN.push(NPos2 + i)
  }
} else if (Ndif < 0) {
  for (let i = 0; i < Math.abs(Ndif) + 1; i += 2) {
    TilN.push(NPos1 + i)
  }
} else {
  TilN.push(NPos1)
}

console.log(TilN)
console.log(TilE)
var i
var x
for (i of TilN) {
  for (x of TilE) {
    TileNumbers.push(UtmGridNr.toString() + TilN[i] + '_' + TilE[x])
  }
}

console.log(TileNumbers)
/*
for (i in TileNumbers) {
   load TileNumbers[i] in a way we can use the data in elevation
} */
// load all xyz files in TilN
