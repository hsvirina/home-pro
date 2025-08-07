/**
 * Represents a tag associated with places or filters.
 */
export interface Tag {
  /** Unique identifier for the tag */
  id: number;

  /** Key used for mapping with FilterOption.key */
  key: string;

  /** Display name of the tag */
  name: string;
}

/**
 * Represents a place entity with detailed information.
 */
export interface Place {
  /** Unique identifier for the place */
  id: number;

  /** Name of the place */
  name: string;

  /** Average rating of the place (e.g., from user reviews) */
  rating: number;

  /** Total number of reviews */
  reviewCount: number;

  /** City where the place is located */
  city: string;

  /** Full address of the place */
  address: string;

  /** Working hours in a human-readable format */
  workingHours: string;

  /** Short description or summary of the place */
  shortDescription: string;

  /** Detailed description of the place */
  longDescription: string;

  /** Array of associated tags */
  tags: Tag[];

  /** Array of URLs pointing to photos of the place */
  photoUrls: string[];

  /** Optional timestamp when the place was shared (ISO 8601 string) */
  sharedAt?: string;
}
