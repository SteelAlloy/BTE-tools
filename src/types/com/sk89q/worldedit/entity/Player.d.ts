import Entity from './Entity'
import Vector from '../Vector'

export default interface Player extends Entity, Actor {
  /**
   * Return the world that the player is on.
   *
   * @return the world
   */
  getWorld(): World

  /**
   * Returns true if the entity is holding a pick axe.
   *
   * @return whether a pick axe is held
   */
  isHoldingPickAxe(): boolean

  /**
   * Get the player's cardinal direction (N, W, NW, etc.) with an offset. May return null.
   * @param yawOffset offset that is added to the player's yaw before determining the cardinal direction
   *
   * @return the direction
   */
  getCardinalDirection(yawOffset: number)

  /**
   * Get the ID of the item that the player is holding.
   *
   * @return the item id of the item the player is holding
   */
  getItemInHand(): number

  /**
   * Get the Block that the player is holding.
   *
   * @return the item id of the item the player is holding
   */
  getBlockInHand(): BaseBlock

  /**
   * Gives the player an item.
   *
   * @param type The item id of the item to be given to the player
   * @param amount How many items in the stack
   */
  giveItem(type: number, amount: number): void

  /**
   * Get this actor's block bag.
   *
   * @return the actor's block bag
   */
  getInventoryBlockBag(): BlockBag

  /**
   * Return whether this actor has creative mode.
   *
   * @return true if creative mode is enabled
   */
  hasCreativeMode(): boolean

  /**
   * Find a position for the actor to stand that is not inside a block.
   * Blocks above the player will be iteratively tested until there is
   * a series of two free blocks. The actor will be teleported to
   * that free position.
   *
   * @param searchPos search position
   */
  findFreePosition(searchPos: WorldVector): void

  /**
   * Set the actor on the ground.
   *
   * @param searchPos The location to start searching from
   */
  setOnGround(searchPos: WorldVector): void

  /**
   * Find a position for the player to stand that is not inside a block.
   * Blocks above the player will be iteratively tested until there is
   * a series of two free blocks. The player will be teleported to
   * that free position.
   */
  findFreePosition(): void

  /**
   * Go up one level to the next free space above.
   *
   * @return true if a spot was found
   */
  ascendLevel(): boolean

  /**
   * Go up one level to the next free space above.
   *
   * @return true if a spot was found
   */
  descendLevel(): boolean

  /**
   * Ascend to the ceiling above.
   *
   * @param clearance How many blocks to leave above the player's head
   * @return whether the player was moved
   */
  ascendToCeiling(clearance: number): boolean

  /**
   * Ascend to the ceiling above.
   *
   * @param clearance How many blocks to leave above the player's head
   * @param alwaysGlass Always put glass under the player
   * @return whether the player was moved
   */
  ascendToCeiling(clearance: number, alwaysGlass: boolean): boolean

  /**
   * Just go up.
   *
   * @param distance How far up to teleport
   * @return whether the player was moved
   */
  ascendUpwards(distance: number): boolean

  /**
   * Just go up.
   *
   * @param distance How far up to teleport
   * @param alwaysGlass Always put glass under the player
   * @return whether the player was moved
   */
  ascendUpwards(distance: number, alwaysGlass: boolean): boolean

  /**
   * Make the player float in the given blocks.
   *
   * @param x The X coordinate of the block to float in
   * @param y The Y coordinate of the block to float in
   * @param z The Z coordinate of the block to float in
   */
  floatAt(x: number, y: number, z: number, alwaysGlass: boolean): void

  /**
   * Get the point of the block that is being stood in.
   *
   * @return point
   */
  getBlockIn(): WorldVector

  /**
   * Get the point of the block that is being stood upon.
   *
   * @return point
   */
  getBlockOn(): WorldVector

  /**
   * Get the point of the block being looked at. May return null.
   * Will return the farthest away air block if useLastBlock is true and no other block is found.
   *
   * @param range how far to checks for blocks
   * @param useLastBlock try to return the last valid air block found
   * @return point
   */
  getBlockTrace(range: number, useLastBlock: boolean): WorldVector

  /**
   * Get the face that the player is looking at.
   *
   * @param range the range
   * @param useLastBlock try to return the last valid air block found
   * @return a face
   */
  getBlockTraceFace(range: number, useLastBlock: boolean): WorldVectorFace

  /**
   * Get the point of the block being looked at. May return null.
   *
   * @param range How far to checks for blocks
   * @return point
   */
  getBlockTrace(range: number): WorldVector

  /**
   * Get the point of the block being looked at. May return null.
   *
   * @param range How far to checks for blocks
   * @return point
   */
  getSolidBlockTrace(range: number): WorldVector

  /**
   * Get the player's cardinal direction (N, W, NW, etc.). May return null.
   *
   * @return the direction
   */
  getCardinalDirection(): PlayerDirection

  /**
   * Get the actor's position.
   *
   * <p>If the actor has no permission, then a dummy location is returned.</p>
   *
   * @return the actor's position
   * @deprecated use {@link #getLocation()}
   */
  getPosition(): WorldVector

  /**
   * Get the player's view pitch in degrees.
   *
   * @return pitch
   * @deprecated use {@link #getLocation()}
   */
  getPitch(): number

  /**
   * Get the player's view yaw in degrees.
   *
   * @return yaw
   * @deprecated use {@link #getLocation()}
   */
  getYaw(): number


  /**
   * Pass through the wall that you are looking at.
   *
   * @param range How far to checks for blocks
   * @return whether the player was pass through
   */
  passThroughForwardWall(range: number): boolean

  /**
   * Move the player.
   *
   * @param pos where to move them
   * @param pitch the pitch (up/down) of the player's view in degrees
   * @param yaw the yaw (left/right) of the player's view in degrees
   */
  setPosition(pos: Vector, pitch: number, yaw: number): void

  /**
   * Move the player.
   *
   * @param pos where to move them
   */
  setPosition(pos: Vector): void

}
