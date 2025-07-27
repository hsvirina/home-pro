export const ICONS = {
  Accessibility: {
    filename: './assets/icons/accessibility.png',
    alt: 'Accessibility icon',
  },
  Apple: {
    filename: './assets/icons/apple.svg',
    alt: 'Apple logo',
  },
  ArrowDownRight: {
    filename: './assets/icons/arrow_down_right.svg',
    alt: 'Arrow down right',
  },
  ArrowDownRightPrimary: {
    filename: './assets/icons/arrow_down_right_primary.svg',
    alt: 'Arrow down right (primary)',
  },
  ArrowBack: {
    filename: './assets/icons/arrow-back.svg',
    alt: 'Back arrow',
  },
  ArrowDownRightWhite: {
    filename: './assets/icons/arrow-down-right-white.svg',
    alt: 'Arrow down right (white)',
  },
  ArrowLeft: {
    filename: './assets/icons/arrow-left.svg',
    alt: 'Left arrow',
  },
  ArrowRight: {
    filename: './assets/icons/arrow-right.svg',
    alt: 'Right arrow',
  },
  ChevronDown: {
    filename: './assets/icons/chevron-down.svg',
    alt: 'Chevron down',
  },
  Clock: {
    filename: './assets/icons/clock.png',
    alt: 'Clock',
  },
  Close: {
    filename: './assets/icons/close.svg',
    alt: 'Close icon',
  },
  Eye: {
    filename: './assets/icons/eye.svg',
    alt: 'Show password',
  },
  EyeSlash: {
    filename: './assets/icons/eye-slash.svg',
    alt: 'Hide password',
  },
  Facebook: {
    filename: './assets/icons/facebook.svg',
    alt: 'Facebook logo',
  },
  Google: {
    filename: './assets/icons/google.svg',
    alt: 'Google logo',
  },
  Heart: {
    filename: './assets/icons/heart.svg',
    alt: 'Heart icon',
  },
  HeartBlue: {
    filename: './assets/icons/heart-blue.svg',
    alt: 'Blue heart icon',
  },
  IdPass: {
    filename: './assets/icons/id-pass.png',
    alt: 'ID pass',
  },
  Laptop: {
    filename: './assets/icons/laptop.png',
    alt: 'Laptop',
  },
  Letter: {
    filename: './assets/icons/letter.png',
    alt: 'Letter',
  },
  Location: {
    filename: './assets/icons/location.png',
    alt: 'Location',
  },
  Menu: {
    filename: './assets/icons/menu.png',
    alt: 'Menu icon',
  },
  Pet: {
    filename: './assets/icons/pet.png',
    alt: 'Pet icon',
  },
  RedClose: {
    filename: './assets/icons/red-close.svg',
    alt: 'Red close icon',
  },
  SearchDark: {
    filename: './assets/icons/search-dark.svg',
    alt: 'Search (dark)',
  },
  SearchWhite: {
    filename: './assets/icons/search-white.svg',
    alt: 'Search (white)',
  },
  Share: {
    filename: './assets/icons/share.svg',
    alt: 'Share icon',
  },
  ShareBlue: {
    filename: './assets/icons/share-blue.svg',
    alt: 'Share icon (blue)',
  },
  Star: {
    filename: './assets/icons/star.png',
    alt: 'Star icon',
  },
  UserProfile: {
    filename: './assets/icons/user-profile.svg',
    alt: 'User profile',
  },
} as const;

// export type IconKey = keyof typeof ICONS;
export type IconData = (typeof ICONS)[keyof typeof ICONS];
