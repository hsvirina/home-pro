/**
 * Represents a public review without user-specific personal details.
 */
export interface PublicReview {
  /** Unique identifier of the review */
  id: number;

  /** Identifier of the cafe/place being reviewed */
  cafeId: number;

  /** Rating score provided by the reviewer */
  rating: number;

  /** Text content of the review */
  text: string;

  /** ISO 8601 string representing the creation date/time of the review */
  createdAt: string;
}

/**
 * Represents a detailed review including user information.
 */
export interface Review {
  /** Unique identifier of the review */
  id: number;

  /** Identifier of the cafe/place being reviewed */
  cafeId: number;

  /** Identifier of the user who wrote the review */
  userId: number;

  /** Rating score provided by the reviewer */
  rating: number;

  /** Text content of the review */
  text: string;

  /** ISO 8601 string representing the creation date/time of the review */
  createdAt: string;

  /** Reviewer's first name */
  userName: string;

  /** Reviewer's last name */
  userSurname: string;

  /** URL to the reviewer's photo/avatar */
  userPhotoUrl: string;
}
