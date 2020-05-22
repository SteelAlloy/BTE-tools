import Player from './entity/Player'

export default class CraftScriptContext extends CraftScriptEnvironment {

  /**
   * Get an edit session. Every subsequent call returns a new edit session.
   * Usually you only need to use one edit session.
   * 
   * @return an edit session
   */
  remember(): EditSession

  /**
   * Get the player.
   * 
   * @return the calling player
   */
  getPlayer(): Player

  /**
   * Get the player's session.
   * 
   * @return a session
   */
  getSession(): LocalSession

  /**
   * Get the configuration for WorldEdit.
   * 
   * @return the configuration
   */
  getConfiguration(): LocalConfiguration

  /**
   * Get a list of edit sessions that have been created.
   * 
   * @return a list of created {@code EditSession}s
   */
  getEditSessions(): Array<EditSession>

  /**
   * Print a regular message to the user.
   * 
   * @param message a message
   */
  print(message: string): void

  /**
   * Print an error message to the user.
   * 
   * @param message a message
   */
  error(message: string): void

  /**
   * Print an raw message to the user.
   * 
   * @param message a message
   */
  printRaw(message: string): void

  /**
   * Checks to make sure that there are enough but not too many arguments.
   *
   * @param min a number of arguments
   * @param max -1 for no maximum
   * @param usage usage string
   * @throws InsufficientArgumentsException
   */
  checkArgs(min: number, max: number, usage: string): void

  /**
   * Get an item ID from an item name or an item ID number.
   *
   * @param input input to parse
   * @param allAllowed true to ignore blacklists
   * @return a block
   * @throws UnknownItemException
   * @throws DisallowedItemException
   */
  getBlock(input: string, allAllowed: boolean): BaseBlock

  /**
   * Get a block.
   *
   * @param id the type Id
   * @return a block
   * @throws UnknownItemException
   * @throws DisallowedItemException
   */
  getBlock(id: string): BaseBlock

  /**
   * Get a list of blocks as a set. This returns a Pattern.
   *
   * @param list the input
   * @return pattern
   * @throws UnknownItemException 
   * @throws DisallowedItemException 
   */
  getBlockPattern(list: string): Pattern


  /**
   * Get a list of blocks as a set.
   *
   * @param list a list
   * @param allBlocksAllowed true if all blocks are allowed
   * @return set
   * @throws UnknownItemException 
   * @throws DisallowedItemException 
   */
  getBlockIDs(list: string, allBlocksAllowed: boolean): Set<number>

  /**
   * Gets the path to a file. This method will check to see if the filename
   * has valid characters and has an extension. It also prevents directory
   * traversal exploits by checking the root directory and the file directory.
   * On success, a {@code java.io.File} object will be returned.
   * 
   * <p>Use this method if you need to read a file from a directory.</p>
   * 
   * @param folder sub-directory to look in
   * @param filename filename (user-submitted)
   * @return a file
   * @throws FilenameException
   */
  getSafeFile(folder: string, filename: string): File

  /**
   * Gets the path to a file for opening. This method will check to see if the
   * filename has valid characters and has an extension. It also prevents
   * directory traversal exploits by checking the root directory and the file
   * directory. On success, a {@code java.io.File} object will be
   * returned.
   * 
   * <p>Use this method if you need to read a file from a directory.</p>
   * 
   * @param folder sub-directory to look in
   * @param filename filename (user-submitted)
   * @param defaultExt default extension to append if there is none
   * @param exts list of extensions for file open dialog, null for no filter
   * @return a file
   * @throws FilenameException 
   */
  getSafeOpenFile(folder: string, filename: string, defaultExt: string, exts: Array<string>): File

  /**
   * Gets the path to a file for saving. This method will check to see if the
   * filename has valid characters and has an extension. It also prevents
   * directory traversal exploits by checking the root directory and the file
   * directory. On success, a {@code java.io.File} object will be
   * returned.
   * 
   * <p>Use this method if you need to read a file from a directory.</p>
   * 
   * @param folder sub-directory to look in
   * @param filename filename (user-submitted)
   * @param defaultExt default extension to append if there is none
   * @param exts list of extensions for file save dialog, null for no filter
   * @return a file
   * @throws FilenameException 
   */
  getSafeSaveFile(folder: string, filename: string, defaultExt: string, exts: Array<string>): File

}
