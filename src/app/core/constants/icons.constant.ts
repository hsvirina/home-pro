export const ICONS = {
  Accessibility: {
    filename: './assets/icons/accessibility.png',
    alt: 'Accessibility icon',
  },
  AddCircle: {
    filename: './assets/icons/add-circle.svg',
    alt: 'Add circle icon',
  },
  Apple: {
    filename: './assets/icons/apple.svg',
    alt: 'Apple logo',
  },
  AppleDarkThema: {
    filename: './assets/icons/apple-dark-thema.svg',
    alt: 'Apple dark thema logo',
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
  ArrowLeftDarkThema: {
    filename: './assets/icons/arrow-left-dark-thema.svg',
    alt: 'Left arrow dark thema',
  },
  ArrowRight: {
    filename: './assets/icons/arrow-right.svg',
    alt: 'Right arrow',
  },
  ArrowRightDarkThema: {
    filename: './assets/icons/arrow-right-dark-thema.svg',
    alt: 'Right arrow dark thema',
  },
  ChevronDown: {
    filename: './assets/icons/chevron-down.svg',
    alt: 'Chevron down',
  },
  Clock: {
    filename: './assets/icons/clock.svg',
    alt: 'Clock',
  },
  ClockDarkThema: {
    filename: './assets/icons/clock-dark-thema.png',
    alt: 'Clock',
  },
  Close: {
    filename: './assets/icons/close.svg',
    alt: 'Close icon',
  },
  CoffeeBean: {
    filename: './assets/icons/coffee-bean.svg',
    alt: 'Coffee Bean icon',
  },
  CheckCircle: {
    filename: './assets/icons/check-circle.svg',
    alt: 'Check circle icon',
  },
  Eye: {
    filename: './assets/icons/eye.svg',
    alt: 'Show password',
  },
  EyeDarkThema: {
    filename: './assets/icons/eyeDarkThema.svg',
    alt: 'Show password',
  },
  EyeSlash: {
    filename: './assets/icons/eye-slash.svg',
    alt: 'Hide password',
  },
  EyeSlashDarkThema: {
    filename: './assets/icons/eye-slashDarkThema.svg',
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
  HeartBlueDarkThema: {
    filename: './assets/icons/heart-dark-thema.svg',
    alt: 'Heart dark thema icon',
  },
  HeartBlue: {
    filename: './assets/icons/heart-blue.svg',
    alt: 'Blue heart icon',
  },
  HeartBlueFill: {
    filename: './assets/icons/heart-fill.svg',
    alt: 'Blue heart fill icon',
  },
  IdPass: {
    filename: './assets/icons/id-pass.svg',
    alt: 'ID pass',
  },
  IdPassDarkThema: {
    filename: './assets/icons/id-pass-dark-thema.png',
    alt: 'ID dark thema pass',
  },
  Laptop: {
    filename: './assets/icons/laptop.png',
    alt: 'Laptop',
  },
  Letter: {
    filename: './assets/icons/letter.svg',
    alt: 'Letter',
  },
  LetterDarkThema: {
    filename: './assets/icons/letterDarkThema.png',
    alt: 'Letter',
  },
  Like: {
    filename: './assets/icons/like.svg',
    alt: 'Like',
  },
  LikeFill: {
    filename: './assets/icons/like-fill.svg',
    alt: 'Like Fill',
  },
  Location: {
    filename: './assets/icons/location.svg',
    alt: 'Location',
  },
  LocationDarkThema: {
    filename: './assets/icons/locationDarkThema.svg',
    alt: 'Location dark thema',
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
  ShareDarkThema: {
    filename: './assets/icons/share-dark-thema.svg',
    alt: 'Share dark thema icon',
  },
  ShareBlue: {
    filename: './assets/icons/share-blue.svg',
    alt: 'Share icon (blue)',
  },
  Star: {
    filename: './assets/icons/star.svg',
    alt: 'Star icon',
  },
  StarEmpty: {
    filename: './assets/icons/star-empty.svg',
    alt: 'Star empty icon',
  },
  StarsCollage: {
    filename: './assets/icons/stars-collage.svg',
    alt: 'Star collage icon',
  },
  StarsCollageDarkThema: {
    filename: './assets/icons/stars-collage-dark-thema.svg',
    alt: 'Star collage dark thema icon',
  },
  UserProfile: {
    filename: './assets/icons/user-profile.svg',
    alt: 'User profile',
  },
  Moon: {
    filename: './assets/icons/moon.svg',
    alt: 'Moon icon',
  },
  Sun: {
    filename: './assets/icons/sun.svg',
    alt: 'Sun icon',
  },
  SunDarkThema: {
    filename: './assets/icons/sun-dark.svg',
    alt: 'Sun dark icon',
  },
} as const;

export type IconData = typeof ICONS[keyof typeof ICONS];
