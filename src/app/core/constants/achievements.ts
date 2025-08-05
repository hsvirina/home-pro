export interface Achievement {
  title: string;             // Title of the achievement
  description: string;       // Description of what the achievement is for
  iconPath: string;          // Path to the achievement icon
  alt: string;               // Alt text for accessibility (screen readers)
  ariaLabel: string;         // ARIA label for better accessibility support
}

export interface AchievementSection {
  sectionTitle: string;      // Section heading (e.g. "Visiting coffee shops")
  achievements: Achievement[]; // List of achievements within this section
}

const ICONS_BASE_PATH = './assets/icons/achievements';

export const ACHIEVEMENTS: AchievementSection[] = [
  {
    sectionTitle: 'Visiting coffee shops',
    achievements: [
      {
        title: 'Curiouser Cup',
        description: 'For the first visit to the coffee shop',
        iconPath: `${ICONS_BASE_PATH}/curiouser-cup.svg`,
        alt: 'Icon of Curiouser Cup achievement',
        ariaLabel: 'Curiouser Cup achievement icon',
      },
      {
        title: 'Snow Roast',
        description: 'For visiting 5 different coffee shops',
        iconPath: `${ICONS_BASE_PATH}/snow-roast.svg`,
        alt: 'Icon of Snow Roast achievement',
        ariaLabel: 'Snow Roast achievement icon',
      },
      {
        title: 'City Bean Genie',
        description: 'For visiting 10+ different coffee shops',
        iconPath: `${ICONS_BASE_PATH}/city-bean-genie.svg`,
        alt: 'Icon of City Bean Genie achievement',
        ariaLabel: 'City Bean Genie achievement icon',
      },
    ],
  },
  {
    sectionTitle: 'Evaluation',
    achievements: [
      {
        title: 'The Bean Pirate',
        description: 'For the first rating of the coffee shop (1–5)',
        iconPath: `${ICONS_BASE_PATH}/bean-pirate.svg`,
        alt: 'Icon of The Bean Pirate achievement',
        ariaLabel: 'The Bean Pirate achievement icon',
      },
      {
        title: 'The Hat Rater',
        description: 'For 5 different rated coffee shops',
        iconPath: `${ICONS_BASE_PATH}/hat-rater.svg`,
        alt: 'Icon of The Hat Rater achievement',
        ariaLabel: 'The Hat Rater achievement icon',
      },
      {
        title: 'Star Wizard',
        description: 'For 10+ different rated coffee shops',
        iconPath: `${ICONS_BASE_PATH}/star-wizard.svg`,
        alt: 'Icon of Star Wizard achievement',
        ariaLabel: 'Star Wizard achievement icon',
      },
    ],
  },
  {
    sectionTitle: 'Interaction with content',
    achievements: [
      {
        title: 'Magic Reviewer',
        description: 'For the first fabulous review',
        iconPath: `${ICONS_BASE_PATH}/magic-reviewer.svg`,
        alt: 'Icon of Magic Reviewer achievement',
        ariaLabel: 'Magic Reviewer achievement icon',
      },
      {
        title: 'Café Moments',
        description: 'For 5+ detailed reviews',
        iconPath: `${ICONS_BASE_PATH}/cafe-moments.svg`,
        alt: 'Icon of Café Moments achievement',
        ariaLabel: 'Café Moments achievement icon',
      },
      {
        title: 'Code & Coffee',
        description: 'For 10+ detailed reviews',
        iconPath: `${ICONS_BASE_PATH}/code-coffee.svg`,
        alt: 'Icon of Code & Coffee achievement',
        ariaLabel: 'Code & Coffee achievement icon',
      },
    ],
  },
  {
    sectionTitle: 'Social activity',
    achievements: [
      {
        title: 'Spider-Share',
        description: 'For sharing a coffee shop with a friend',
        iconPath: `${ICONS_BASE_PATH}/spider-share.svg`,
        alt: 'Icon of Spider-Share achievement',
        ariaLabel: 'Spider-Share achievement icon',
      },
      {
        title: 'Brew Trooper',
        description: 'First time add a coffee shop to favorites',
        iconPath: `${ICONS_BASE_PATH}/brew-trooper.svg`,
        alt: 'Icon of Brew Trooper achievement',
        ariaLabel: 'Brew Trooper achievement icon',
      },
    ],
  },
];
