const fs = require('fs')
const path = require('path')
const overpass = require('query-overpass')

const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.json'), 'utf-8'))

let request

if (config.overpass) {
  switch (config.feature) {
    case 'rails':
      request = railsFeature()
      break
    default:
      throw new Error('Feature not supported')
  }
  overpass(request, (err, data) => {
    if (err) throw err
    main(data)
  })
} else {
  const input = path.resolve(__dirname, '../', config.input)
  const raw = fs.readFileSync(input, 'utf-8')
  const data = JSON.parse(raw)
  main(data)
}

function main (data) {
  const geometry = []
  let length = 0
  for (let i = 0; i < data.features.length; i++) {
    const coordinates = data.features[i].geometry.coordinates
    if (Array.isArray(coordinates[0])) {
      geometry.push(coordinates)
      length += coordinates.length
    }
    console.log((i + 1) + '/' + data.features.length)
  }

  console.log(`${length} Elements`)

  fs.writeFileSync('temp.json', JSON.stringify(geometry, null, 2))
}

function railsFeature () {
  if (config.requestType === 'region') {
    return `
(
(rel(${config.region})["route"="train"];);
(way["name"="${config.name}"];>;);
);
out;
`
  } else if (config.requestType === 'name') {
    return `
(way[railway~"^(rail|subway|tram)$"](${config.region});>;);
out;
`
  } else throw new Error('Request type not supported')
}
