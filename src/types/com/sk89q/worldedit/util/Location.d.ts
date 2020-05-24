import Vector from '../Vector'
import Extent from '../extent/Extent'

export default class Location {

  /**
   * Create a new instance in the given extent at 0, 0, 0 with a
   * direction vector of 0, 0, 0.
   *
   * @param extent the extent
   */
  constructor(extent: Extent)

  /**
   * Create a new instance in the given extent with the given coordinates
   * with a direction vector of 0, 0, 0.
   *
   * @param extent the extent
   * @param x the X coordinate
   * @param y the Y coordinate
   * @param z the Z coordinate
   */
  constructor(extent: Extent, x: number, y: number, z: number)

  /**
   * Create a new instance in the given extent with the given position
   * vector and a direction vector of 0, 0, 0.
   *
   * @param extent the extent
   * @param position the position vector
   */
  constructor(extent: Extent, position: Vector)

  /**
   * Create a new instance in the given extent with the given coordinates
   * and the given direction vector.
   *
   * @param extent the extent
   * @param x the X coordinate
   * @param y the Y coordinate
   * @param z the Z coordinate
   * @param direction the direction vector
   */
  constructor(extent: Extent, x: number, y: number, z: number, direction: Vector)

  /**
   * Create a new instance in the given extent with the given coordinates
   * and the given direction vector.
   *
   * @param extent the extent
   * @param x the X coordinate
   * @param y the Y coordinate
   * @param z the Z coordinate
   * @param yaw the yaw, in degrees
   * @param pitch the pitch, in degrees
   */
  constructor(extent: Extent, x: number, y: number, z: number, yaw: number, pitch: number)

  /**
   * Create a new instance in the given extent with the given position vector
   * and the given direction vector.
   *
   * @param extent the extent
   * @param position the position vector
   * @param direction the direction vector
   */
  constructor(extent: Extent, position: Vector, direction: Vector)

  /**
   * Create a new instance in the given extent with the given position vector
   * and the given direction vector.
   *
   * @param extent the extent
   * @param position the position vector
   * @param yaw the yaw, in degrees
   * @param pitch the pitch, in degrees
   */
  constructor(extent: Extent, position: Vector, yaw: number, pitch: number)

  /**
   * Get the extent.
   *
   * @return the extent
   */
  public getExtent(): Extent

  /**
   * Create a clone of this object with the given extent.
   *
   * @param extent the new extent
   * @return the new instance
   */
  public setExtent(extent: Extent): Location

  /**
   * Get the yaw in degrees.
   *
   * @return the yaw in degrees
   */
  public getYaw(): number

  /**
   * Create a clone of this object with the given yaw.
   *
   * @param yaw the new yaw
   * @return the new instance
   */
  public setYaw(yaw: number): Location

  /**
   * Get the pitch in degrees.
   *
   * @return the pitch in degrees
   */
  public getPitch(): number

  /**
   * Create a clone of this object with the given pitch.
   *
   * @param pitch the new yaw
   * @return the new instance
   */
  public setPitch(pitch: number): Location

  /**
   * Create a clone of this object with the given yaw and pitch.
   *
   * @param yaw the new yaw
   * @param pitch the new pitch
   * @return the new instance
   */
  public setDirection(yaw: number, pitch: number): Location

  /**
   * Get the direction vector.
   *
   * @return the direction vector
   */
  public getDirection(): Vector

  /**
   * Create a clone of this object with the given direction.
   *
   * @param direction the new direction
   * @return the new instance
   */
  public setDirection(direction: Vector): Location

  /**
   * Get a {@link Vector} form of this location's position.
   *
   * @return a vector
   */
  public toVector(): Vector

  /**
   * Get the X component of the position vector.
   *
   * @return the X component
   */
  public getX(): number

  /**
   * Get the rounded X component of the position vector.
   *
   * @return the rounded X component
   */
  public getBlockX(): number
  /**
   * Return a copy of this object with the X component of the new object
   * set to the given value.
   *
   * @param x the new value for the X component
   * @return a new immutable instance
   */
  public setX(x: number): Location

  /**
   * Return a copy of this object with the X component of the new object
   * set to the given value.
   *
   * @param x the new value for the X component
   * @return a new immutable instance
   */
  public setX(x: number): Location

  /**
   * Get the Y component of the position vector.
   *
   * @return the Y component
   */
  public getY(): number

  /**
   * Get the rounded Y component of the position vector.
   *
   * @return the rounded Y component
   */
  public getBlockY(): number

  /**
   * Return a copy of this object with the Y component of the new object
   * set to the given value.
   *
   * @param y the new value for the Y component
   * @return a new immutable instance
   */
  public setY(y: number): Location

  /**
   * Return a copy of this object with the Y component of the new object
   * set to the given value.
   *
   * @param y the new value for the Y component
   * @return a new immutable instance
   */
  public setY(y: number): Location

  /**
   * Get the Z component of the position vector.
   *
   * @return the Z component
   */
  public getZ(): number

  /**
   * Get the rounded Z component of the position vector.
   *
   * @return the rounded Z component
   */
  public getBlockZ(): number
  /**
   * Return a copy of this object with the Z component of the new object
   * set to the given value.
   *
   * @param z the new value for the Y component
   * @return a new immutable instance
   */
  public setZ(z: number): Location

  /**
   * Return a copy of this object with the Z component of the new object
   * set to the given value.
   *
   * @param z the new value for the Y component
   * @return a new immutable instance
   */
  public setZ(z: number): Location

  public equals(o: object): boolean

  public hashCode(): number

}