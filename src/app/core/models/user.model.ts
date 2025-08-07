import { Place } from './place.model';
import { PublicReview } from './review.model';

/**
 * Interface representing the authenticated user's detailed information.
 */
export interface AuthUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string | null;
  status: string | null;
  defaultCity: string;
  favoriteCafeIds: number[];
  theme: string;
  language?: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  reviewNotifications: boolean;
  locationSharing: boolean;
}

/**
 * Interface representing the public profile of a user,
 * including summary information and related places and reviews.
 */
export interface PublicUserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string | null;
  statusText: string | null;
  favoriteCafes: Place[];
  checkInCafes: Place[];
  reviews: PublicReview[];
  totalUniqueCheckIns: number;
  totalReviewsWithoutText: number;
  totalReviewsWithText: number;
  totalFavoriteCafes: number;
  sharedCafes: Place[];
  totalSharedCafes: number;
  city: string;
}
