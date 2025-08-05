import { AchievementSection } from '../constants/achievements';

export type BadgeType = 'gold' | 'silver' | 'bronze' | 'neutral';

export function calculateBadgeType(
  unlockedAchievements: AchievementSection[],
  allAchievements: AchievementSection[],
): BadgeType {
  const totalCount = allAchievements.reduce(
    (acc, section) => acc + section.achievements.length,
    0,
  );
  const unlockedCount = unlockedAchievements.reduce(
    (acc, section) => acc + section.achievements.length,
    0,
  );

  const percent = (unlockedCount / totalCount) * 100;

  if (percent >= 85) return 'gold';
  if (percent >= 65) return 'silver';
  if (percent >= 35) return 'bronze';
  return 'neutral';
}
