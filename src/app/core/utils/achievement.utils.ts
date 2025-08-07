import { ACHIEVEMENTS, AchievementSection } from "../constants/achievements";
import { PublicUserProfile } from "../models/user.model";

export function getUnlockedAchievements(profile: PublicUserProfile): AchievementSection[] {
  const uniqueCheckIns = profile.totalUniqueCheckIns;

  // Считаем только кафе с рейтингом
  const ratedCafesCount = new Set(
    profile.reviews.filter(r => r.rating !== null && r.rating !== undefined).map(r => r.cafeId)
  ).size;

  // Считаем отзывы с текстом (текст не пустой после трима)
  const detailedReviewsCount = profile.reviews.filter(r => r.text && r.text.trim().length > 0).length;

  const sharedCafesCount = profile.totalSharedCafes;
  const favoriteCafesCount = profile.totalFavoriteCafes;

  return ACHIEVEMENTS.map(section => {
    const filteredAchievements = section.achievements.filter(a => {
      switch (a.key) {
        case 'curiouserCup':
          return uniqueCheckIns > 0;
        case 'snowRoast':
          return uniqueCheckIns >= 5;
        case 'cityBeanGenie':
          return uniqueCheckIns >= 10;

        case 'beanPirate':
          return ratedCafesCount >= 1;
        case 'hatRater':
          return ratedCafesCount >= 5;
        case 'starWizard':
          return ratedCafesCount >= 10;

        case 'magicReviewer':
          return detailedReviewsCount >= 1;
        case 'cafeMoments':
          return detailedReviewsCount >= 5;
        case 'codeCoffee':
          return detailedReviewsCount >= 10;

        case 'spiderShare':
          return sharedCafesCount >= 1;

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
  }).filter(section => section.achievements.length > 0);
}
