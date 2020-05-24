import CraftScriptContext from './com/sk89q/worldedit/scripting/CraftScriptContext'
import Player from './com/sk89q/worldedit/entity/Player'

interface Package {
  [key: string]: Package | undefined
}

declare global {
  declare const Packages: Package
  declare function importClass(package: Package): void
  declare function importPackage(package: Package): void
  declare const context: CraftScriptContext
  declare const player: Player
  declare const argv: Array<string>
}
