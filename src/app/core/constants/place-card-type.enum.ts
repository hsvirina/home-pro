/**
 * Enum representing the different types of place cards used in the application UI.
 * Each type corresponds to a specific card layout or context.
 */
export enum PlaceCardType {
  /**
   * Full detailed card view showing comprehensive place information.
   */
  Full = 'full',

  /**
   * Simplified card used in the user's favorites list.
   */
  Favourites = 'favourites',

  /**
   * Simplified card used in the catalog listing.
   */
  Catalog = 'catalog',
}
