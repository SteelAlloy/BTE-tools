import { gis_jp as usage } from './modules/usage'
import { elevation } from './modules/elevation'
import { ignoredBlocks } from './modules/blocks'
import { transformIDs } from './modules/utils'

importClass(Packages.com.sk89q.worldedit.Vector)

importClass(Packages.com.sk89q.worldedit.WorldEdit)
importClass(Packages.com.sk89q.worldedit.command.RegionCommands)
importClass(Packages.java.io.StringWriter)
importClass(Packages.java.net.URL)
importClass(Packages.java.lang.Thread)
importClass(Packages.java.nio.charset.StandardCharsets)
importClass(Packages.org.apache.commons.io.IOUtils)

context.checkArgs(0, 1, usage)

const options = {
  smooth: true,
  ignoreWater: false,
  ignoredBlocks,
  ...JSON.parse(argv[1] || '{}')
}

transformIDs(options, 'ignoredBlocks')

elevation(options,
  (lons, lats) => `https://wms.geonorge.no/skwms1/wps.elevation2?service=WPS&request=Execute&version=1.0.0&Identifier=elevation&DataInputs=lon%3D${lons}%40datatype%3Dfloat%3Blat%3D${lats}%40datatype%3Dfloat%3Bepsg%3D4326%40datatype%3Dinteger`,
  (data) => [Number.parseFloat(data["wps:ExecuteResponse"]["wps:ProcessOutputs"]["wps:Output"].filter(em => em["ows:Identifier"] == "elevation")[0]["wps:Data"]["wps:LiteralData"])],1)