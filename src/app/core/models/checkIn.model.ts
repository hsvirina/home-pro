/**
 * Represents a user check-in event at a cafe.
 */
export interface CheckIn {
  /** Unique identifier for the check-in */
  id: number;

  /** Identifier of the cafe where the check-in occurred */
  cafeId: number;

  /** Timestamp of the check-in in ISO 8601 format */
  timestamp: string;

  /** Unique identifier of the user who checked in */
  userId: number;

  /** First name of the user */
  userFirstName: string;

  /** Last name of the user */
  userLastName: string;

  /** URL to the user's profile photo */
  userPhotoUrl: string;
}
