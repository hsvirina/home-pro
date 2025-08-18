import { AchievementSection } from "../constants/achievements";

export type BadgeType = 'gold' | 'silver' | 'bronze' | null;

/**
 * Calculates the badge type for a user based on the percentage of unlocked achievements.
 *
 * @param unlockedAchievements Sections containing achievements the user has unlocked
 * @param allAchievements All possible achievement sections
 * @returns The badge type ('gold', 'silver', 'bronze') or null if no badge is earned
 */
export function calculateBadgeType(
  unlockedAchievements: AchievementSection[],
  allAchievements: AchievementSection[],
): BadgeType | null {
  // Total number of achievements across all sections
  const totalCount = allAchievements.reduce(
    (acc, section) => acc + section.achievements.length,
    0,
  );

  // Total number of achievements the user has unlocked
  const unlockedCount = unlockedAchievements.reduce(
    (acc, section) => acc + section.achievements.length,
    0,
  );

  // Calculate the percentage of achievements unlocked
  const percent = (unlockedCount / totalCount) * 100;

  // Determine badge type based on thresholds
  if (percent >= 85) return 'gold';
  if (percent >= 65) return 'silver';
  if (percent >= 35) return 'bronze';

  // Return null if no badge earned
  return null;
}
