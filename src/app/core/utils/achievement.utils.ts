import { AchievementSection, ACHIEVEMENTS } from '../constants/achievements';
import { PublicUserProfile } from '../models/user.model';

export function getUnlockedAchievements(profile: PublicUserProfile): AchievementSection[] {
  const uniqueCheckIns = profile.totalUniqueCheckIns; // Уникальные посещения кафе
  const ratedCafesCount = new Set(profile.reviews.map(r => r.cafeId)).size; // Кол-во кафе с отзывами
  const detailedReviewsCount = profile.reviews.filter(r => r.text.trim().length > 0).length; // Кол-во отзывов с текстом
  const sharedCafesCount = profile.totalSharedCafes; // Кол-во кафе, которыми поделились
  const favoriteCafesCount = profile.totalFavoriteCafes; // Кол-во избранных кафе

  return ACHIEVEMENTS.map(section => {
    const filteredAchievements = section.achievements.filter(a => {
      switch (a.title) {
        // Ачивки за посещения кафе
        case 'Curiouser Cup':
          return uniqueCheckIns > 0;
        case 'Snow Roast':
          return uniqueCheckIns >= 5;
        case 'City Bean Genie':
          return uniqueCheckIns >= 10;

        // Ачивки за отзывы по кафе
        case 'The Bean Pirate':
          return ratedCafesCount >= 1;
        case 'The Hat Rater':
          return ratedCafesCount >= 5;
        case 'Star Wizard':
          return ratedCafesCount >= 10;

        // Ачивки за детальные отзывы с текстом
        case 'Magic Reviewer':
          return detailedReviewsCount >= 1;
        case 'Café Moments':
          return detailedReviewsCount >= 5;
        case 'Code & Coffee':
          return detailedReviewsCount >= 10;

        // Ачивка за количество кафе, которыми поделились
        case 'Spider-Share':
          return sharedCafesCount >= 1;

        // Ачивка за избранные кафе
        case 'Brew Trooper':
          return favoriteCafesCount >= 1;

        default:
          return false;
      }
    });

    return {
      sectionTitle: section.sectionTitle,
      achievements: filteredAchievements,
    };
  })
  // Убираем секции без ачивок
  .filter(section => section.achievements.length > 0);
}
