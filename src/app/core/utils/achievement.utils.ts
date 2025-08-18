import { ACHIEVEMENTS, AchievementSection } from "../constants/achievements";
import { PublicUserProfile } from "../models/user.model";

/**
 * Returns the list of achievement sections with achievements unlocked
 * based on the given user's profile.
 *
 * @param profile The public user profile containing stats and reviews
 * @returns Array of AchievementSection objects with unlocked achievements only
 */
export function getUnlockedAchievements(profile: PublicUserProfile): AchievementSection[] {
  // Total unique check-ins made by the user
  const uniqueCheckIns = profile.totalUniqueCheckIns;

  // Count only cafes that have been rated
  const ratedCafesCount = new Set(
    profile.reviews
      .filter(r => r.rating !== null && r.rating !== undefined)
      .map(r => r.cafeId)
  ).size;

  // Count reviews with non-empty text
  const detailedReviewsCount = profile.reviews.filter(
    r => r.text && r.text.trim().length > 0
  ).length;

  // Total cafes shared by the user
  const sharedCafesCount = profile.totalSharedCafes;

  // Total cafes marked as favorite
  const favoriteCafesCount = profile.totalFavoriteCafes;

  return ACHIEVEMENTS
    .map(section => {
      // Filter achievements based on user's stats
      const filteredAchievements = section.achievements.filter(a => {
        switch (a.key) {
          // Check-ins achievements
          case 'curiouserCup':
            return uniqueCheckIns > 0;
          case 'snowRoast':
            return uniqueCheckIns >= 5;
          case 'cityBeanGenie':
            return uniqueCheckIns >= 10;

          // Rated cafes achievements
          case 'beanPirate':
            return ratedCafesCount >= 1;
          case 'hatRater':
            return ratedCafesCount >= 5;
          case 'starWizard':
            return ratedCafesCount >= 10;

          // Detailed reviews achievements
          case 'magicReviewer':
            return detailedReviewsCount >= 1;
          case 'cafeMoments':
            return detailedReviewsCount >= 5;
          case 'codeCoffee':
            return detailedReviewsCount >= 10;

          // Shared cafes achievements
          case 'spiderShare':
            return sharedCafesCount >= 1;

          // Favorite cafes achievements
          case 'brewTrooper':
            return favoriteCafesCount >= 1;

          default:
            return false;
        }
      });

      return {
        sectionKey: section.sectionKey,
        achievements: filteredAchievements,
      };
    })
    // Remove sections that have no unlocked achievements
    .filter(section => section.achievements.length > 0);
}
