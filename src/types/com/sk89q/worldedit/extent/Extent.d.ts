import Vector from '../Vector'
import Entity from '../entity/Entity'

export default interface Extent extends InputExtent, OutputExtent {

  /**
   * Get the minimum point in the extent.
   *
   * <p>If the extent is unbounded, then a large (negative) value may
   * be returned.</p>
   *
   * @return the minimum point
   */
  getMinimumPoint(): Vector

  /**
   * Get the maximum point in the extent.
   *
   * <p>If the extent is unbounded, then a large (positive) value may
   * be returned.</p>
   *
   * @return the maximum point
   */
  getMaximumPoint(): Vector

  /**
   * Get a list of all entities within the given region.
   *
   * <p>If the extent is not wholly loaded (i.e. a world being simulated in the
   * game will not have every chunk loaded), then this list may not be
   * incomplete.</p>
   *
   * @param region the region in which entities must be contained
   * @return a list of entities
   */
  getEntities(region: Region): Array<Entity>

  /**
   * Get a list of all entities.
   *
   * <p>If the extent is not wholly loaded (i.e. a world being simulated in the
   * game will not have every chunk loaded), then this list may not be
   * incomplete.</p>
   *
   * @return a list of entities
   */
  getEntities(): Array<Entity> 

  /**
   * Create an entity at the given location.
   *
   * @param entity the entity
   * @param location the location
   * @return a reference to the created entity, or null if the entity could not be created
   */
  createEntity(location: Location, entity: BaseEntity): Entity

}