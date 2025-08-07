/**
 * Represents an individual achievement with associated metadata.
 */
export interface Achievement {
  /** Translation key for the achievement name or description */
  key: string;

  /** Path to the icon image representing the achievement */
  iconPath: string;

  /** Alternative text for the icon image (for accessibility) */
  alt: string;

  /** ARIA label for screen readers (enhances accessibility) */
  ariaLabel: string;
}

/**
 * Represents a section/category grouping multiple achievements.
 */
export interface AchievementSection {
  /** Translation key for the section header/title */
  sectionKey: string;

  /** List of achievements belonging to this section */
  achievements: Achievement[];
}

/** Base path for all achievement icons */
const ICONS_BASE_PATH = './assets/icons/achievements';

/**
 * Array of achievement sections with grouped achievements.
 * Used to display achievements categorized in UI.
 */
export const ACHIEVEMENTS: AchievementSection[] = [
  {
    sectionKey: 'visiting',
    achievements: [
      {
        key: 'curiouserCup',
        iconPath: `${ICONS_BASE_PATH}/curiouser-cup.svg`,
        alt: 'Icon of Curiouser Cup achievement',
        ariaLabel: 'Curiouser Cup achievement icon',
      },
      {
        key: 'snowRoast',
        iconPath: `${ICONS_BASE_PATH}/snow-roast.svg`,
        alt: 'Icon of Snow Roast achievement',
        ariaLabel: 'Snow Roast achievement icon',
      },
      {
        key: 'cityBeanGenie',
        iconPath: `${ICONS_BASE_PATH}/city-bean-genie.svg`,
        alt: 'Icon of City Bean Genie achievement',
        ariaLabel: 'City Bean Genie achievement icon',
      },
    ],
  },
  {
    sectionKey: 'evaluation',
    achievements: [
      {
        key: 'beanPirate',
        iconPath: `${ICONS_BASE_PATH}/bean-pirate.svg`,
        alt: 'Icon of The Bean Pirate achievement',
        ariaLabel: 'The Bean Pirate achievement icon',
      },
      {
        key: 'hatRater',
        iconPath: `${ICONS_BASE_PATH}/hat-rater.svg`,
        alt: 'Icon of The Hat Rater achievement',
        ariaLabel: 'The Hat Rater achievement icon',
      },
      {
        key: 'starWizard',
        iconPath: `${ICONS_BASE_PATH}/star-wizard.svg`,
        alt: 'Icon of Star Wizard achievement',
        ariaLabel: 'Star Wizard achievement icon',
      },
    ],
  },
  {
    sectionKey: 'interaction',
    achievements: [
      {
        key: 'magicReviewer',
        iconPath: `${ICONS_BASE_PATH}/magic-reviewer.svg`,
        alt: 'Icon of Magic Reviewer achievement',
        ariaLabel: 'Magic Reviewer achievement icon',
      },
      {
        key: 'cafeMoments',
        iconPath: `${ICONS_BASE_PATH}/cafe-moments.svg`,
        alt: 'Icon of Café Moments achievement',
        ariaLabel: 'Café Moments achievement icon',
      },
      {
        key: 'codeCoffee',
        iconPath: `${ICONS_BASE_PATH}/code-coffee.svg`,
        alt: 'Icon of Code & Coffee achievement',
        ariaLabel: 'Code & Coffee achievement icon',
      },
    ],
  },
  {
    sectionKey: 'social',
    achievements: [
      {
        key: 'spiderShare',
        iconPath: `${ICONS_BASE_PATH}/spider-share.svg`,
        alt: 'Icon of Spider-Share achievement',
        ariaLabel: 'Spider-Share achievement icon',
      },
      {
        key: 'brewTrooper',
        iconPath: `${ICONS_BASE_PATH}/brew-trooper.svg`,
        alt: 'Icon of Brew Trooper achievement',
        ariaLabel: 'Brew Trooper achievement icon',
      },
    ],
  },
];
