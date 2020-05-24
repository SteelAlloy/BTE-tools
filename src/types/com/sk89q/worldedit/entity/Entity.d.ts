export default interface Entity extends Faceted {
  /**
   * Get a copy of the entity's state.
   *
   * <p>In some cases, this method may return {@code null} if a snapshot
   * of the entity can't be created. It may not be possible, for example,
   * to get a snapshot of a player.</p>
   *
   * @return the entity's state or null if one cannot be created
   */
  getState(): BaseEntity

  /**
   * Get the location of this entity.
   *
   * @return the location of the entity
   */
  getLocation(): Location

  /**
   * Get the extent that this entity is on.
   *
   * @return the extent
   */
  getExtent(): Extent

  /**
   * Remove this entity from it container.
   *
   * @return true if removal was successful
   */
  remove(): boolean

}
