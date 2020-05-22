export default class Vector implements Comparable<Vector> {

  public static ZERO: Vector
  public static UNIT_X: Vector
  public static UNIT_Y: Vector
  public static UNIT_Z: Vector
  public static ONE: Vector

  protected x: number
  protected y: number
  protected z: number

  /**
   * Construct an instance.
   *
   * @param x the X coordinate
   * @param y the Y coordinate
   * @param z the Z coordinate
   */
  constructor(x: number, y: number, z: number)

  /**
   * Copy another vector.
   *
   * @param other another vector to make a copy of
   */
  constructor(other: Vector)


  /**
   * Construct a new instance with X, Y, and Z coordinates set to 0.
   *
   * <p>One can also refer to a static {@link #ZERO}.</p>
   */
  constructor()

  /**
   * Get the X coordinate.
   *
   * @return the x coordinate
   */
  public getX(): number

  /**
   * Get the X coordinate rounded.
   *
   * @return the x coordinate
   */
  public getBlockX(): number

  /**
   * Set the X coordinate.
   *
   * @param x the new X
   * @return a new vector
   */
  public setX(x: number): Vector

  /**
   * Set the X coordinate.
   *
   * @param x the X coordinate
   * @return new vector
   */
  public setX(x: number): Vector

  /**
   * Get the Y coordinate.
   *
   * @return the y coordinate
   */
  public getY(): number

  /**
   * Get the Y coordinate rounded.
   *
   * @return the y coordinate
   */
  public getBlockY(): number

  /**
   * Set the Y coordinate.
   *
   * @param y the new Y
   * @return a new vector
   */
  public setY(y: number): Vector

  /**
   * Set the Y coordinate.
   *
   * @param y the new Y
   * @return a new vector
   */
  public setY(y: number): Vector

  /**
   * Get the Z coordinate.
   *
   * @return the z coordinate
   */
  public getZ(): number

  /**
   * Get the Z coordinate rounded.
   *
   * @return the z coordinate
   */
  public getBlockZ(): number

  /**
   * Set the Z coordinate.
   *
   * @param z the new Z
   * @return a new vector
   */
  public setZ(z: number): Vector

  /**
   * Add another vector to this vector and return the result as a new vector.
   *
   * @param other the other vector
   * @return a new vector
   */
  public add(other: Vector): Vector

  /**
   * Add another vector to this vector and return the result as a new vector.
   *
   * @param x the value to add
   * @param y the value to add
   * @param z the value to add
   * @return a new vector
   */
  public add(x: number, y: number, z: number): Vector

  /**
   * Add a list of vectors to this vector and return the
   * result as a new vector.
   *
   * @param others an array of vectors
   * @return a new vector
   */
  public add(others: Array<Vector>): Vector

  /**
   * Subtract another vector from this vector and return the result
   * as a new vector.
   *
   * @param other the other vector
   * @return a new vector
   */
  public subtract(other: Vector): Vector

  /**
   * Subtract another vector from this vector and return the result
   * as a new vector.
   *
   * @param x the value to subtract
   * @param y the value to subtract
   * @param z the value to subtract
   * @return a new vector
   */
  public subtract(x: number, y: number, z: number): Vector

  /**
   * Subtract a list of vectors from this vector and return the result
   * as a new vector.
   *
   * @param others an array of vectors
   * @return a new vector
   */
  public subtract(others: Array<Vector>): Vector

  /**
   * Multiply this vector by another vector on each component.
   *
   * @param other the other vector
   * @return a new vector
   */
  public multiply(other: Vector): Vector

  /**
   * Multiply this vector by another vector on each component.
   *
   * @param x the value to multiply
   * @param y the value to multiply
   * @param z the value to multiply
   * @return a new vector
   */
  public multiply(x: number, y: number, z: number): Vector

  /**
   * Multiply this vector by zero or more vectors on each component.
   *
   * @param others an array of vectors
   * @return a new vector
   */
  public multiply(others: Array<Vector>): Vector

  /**
   * Perform scalar multiplication and return a new vector.
   *
   * @param n the value to multiply
   * @return a new vector
   */
  public multiply(n: number): Vector

  /**
   * Divide this vector by another vector on each component.
   *
   * @param other the other vector
   * @return a new vector
   */
  public divide(other: Vector): Vector

  /**
   * Divide this vector by another vector on each component.
   *
   * @param x the value to divide by
   * @param y the value to divide by
   * @param z the value to divide by
   * @return a new vector
   */
  public divide(x: number, y: number, z: number): Vector

  /**
   * Perform scalar division and return a new vector.
   *
   * @param n the value to divide by
   * @return a new vector
   */
  public divide(n: number): Vector

  /**
   * Get the length of the vector.
   *
   * @return length
   */
  public length(): number

  /**
   * Get the length, squared, of the vector.
   *
   * @return length, squared
   */
  public lengthSq(): number

  /**
   * Get the distance between this vector and another vector.
   *
   * @param other the other vector
   * @return distance
   */
  public distance(other: Vector): number

  /**
   * Get the distance between this vector and another vector, squared.
   *
   * @param other the other vector
   * @return distance
   */
  public distanceSq(other: Vector): number

  /**
   * Get the normalized vector, which is the vector divided by its
   * length, as a new vector.
   *
   * @return a new vector
   */
  public normalize(): Vector

  /**
   * Gets the dot product of this and another vector.
   *
   * @param other the other vector
   * @return the dot product of this and the other vector
   */
  public dot(other: Vector): number

  /**
   * Gets the cross product of this and another vector.
   *
   * @param other the other vector
   * @return the cross product of this and the other vector
   */
  public cross(other: Vector): Vector

  /**
   * Checks to see if a vector is contained with another.
   *
   * @param min the minimum point (X, Y, and Z are the lowest)
   * @param max the maximum point (X, Y, and Z are the lowest)
   * @return true if the vector is contained
   */
  public containedWithin(min: Vector, max: Vector): boolean

  /**
   * Checks to see if a vector is contained with another, comparing
   * using discrete comparisons, inclusively.
   *
   * @param min the minimum point (X, Y, and Z are the lowest)
   * @param max the maximum point (X, Y, and Z are the lowest)
   * @return true if the vector is contained
   */
  public containedWithinBlock(min: Vector, max: Vector): boolean

  /**
   * Clamp the Y component.
   *
   * @param min the minimum value
   * @param max the maximum value
   * @return a new vector
   */
  public clampY(min: number, max: number): Vector
  /**
   * Floors the values of all components.
   *
   * @return a new vector
   */
  public floor(): Vector
  /**
   * Rounds all components up.
   *
   * @return a new vector
   */
  public ceil(): Vector

  /**
   * Rounds all components to the closest integer.
   *
   * <p>Components &lt; 0.5 are rounded down, otherwise up.</p>
   *
   * @return a new vector
   */
  public round(): Vector

  /**
   * Returns a vector with the absolute values of the components of
   * this vector.
   *
   * @return a new vector
   */
  public positive(): Vector

  /**
   * Perform a 2D transformation on this vector and return a new one.
   *
   * @param angle in degrees
   * @param aboutX about which x coordinate to rotate
   * @param aboutZ about which z coordinate to rotate
   * @param translateX what to add after rotation
   * @param translateZ what to add after rotation
   * @return a new vector
   * @see AffineTransform another method to transform vectors
   */
  public transform2D(angle: number, aboutX: number, aboutZ: number, translateX: number, translateZ: number): Vector

  /**
   * Returns whether this vector is collinear with another vector.
   *
   * @param other the other vector
   * @return true if collinear
   */
  public isCollinearWith(other: Vector): boolean

  /**
   * Get this vector's pitch as used within the game.
   *
   * @return pitch in radians
   */
  public toPitch(): number

  /**
   * Get this vector's yaw as used within the game.
   *
   * @return yaw in radians
   */
  public toYaw(): number

  /**
   * Create a new {@code BlockVector} using the given components.
   *
   * @param x the X coordinate
   * @param y the Y coordinate
   * @param z the Z coordinate
   * @return a new {@code BlockVector}
   */
  public static toBlockPoint(x: number, y: number, z: number): BlockVector

  /**
   * Create a new {@code BlockVector} from this vector.
   *
   * @return a new {@code BlockVector}
   */
  public toBlockPoint(): BlockVector

  /**
   * Create a new {@code BlockVector} from this vector.
   *
   * @return a new {@code BlockVector}
   */
  public toBlockVector(): BlockVector

  /**
   * Creates a 2D vector by dropping the Y component from this vector.
   *
   * @return a new {@code Vector2D}
   */
  public toVector2D(): Vector2D

  public equals(obj: object): boolean

  public compareTo(other: Vector): number

  public hashCode(): number

  public toString(): string

  /**
   * Gets the minimum components of two vectors.
   *
   * @param v1 the first vector
   * @param v2 the second vector
   * @return minimum
   */
  public static getMinimum(v1: Vector, v2: Vector): Vector

  /**
   * Gets the maximum components of two vectors.
   *
   * @param v1 the first vector
   * @param v2 the second vector
   * @return maximum
   */
  public static getMaximum(v1: Vector, v2: Vector): Vector

  /**
   * Gets the midpoint of two vectors.
   *
   * @param v1 the first vector
   * @param v2 the second vector
   * @return maximum
   */
  public static getMidpoint(v1: Vector, v2: Vector): Vector

}