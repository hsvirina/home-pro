/**
 * ICONS constant holds icon metadata for the application.
 * Each icon includes a file path and an alt text for accessibility.
 * Some icons have variants for dark theme usage, denoted by suffix 'DarkTheme' or similar.
 */
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
  AppleDarkTheme: {
    filename: './assets/icons/apple-dark-thema.svg',
    alt: 'Apple dark theme logo',
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
  ArrowLeftDarkTheme: {
    filename: './assets/icons/arrow-left-dark-thema.svg',
    alt: 'Left arrow dark theme',
  },
  ArrowRight: {
    filename: './assets/icons/arrow-right.svg',
    alt: 'Right arrow',
  },
  ArrowRightDarkTheme: {
    filename: './assets/icons/arrow-right-dark-thema.svg',
    alt: 'Right arrow dark theme',
  },
  ChevronDown: {
    filename: './assets/icons/chevron-down.svg',
    alt: 'Chevron down',
  },
  Clock: {
    filename: './assets/icons/clock.svg',
    alt: 'Clock',
  },
  ClockDarkTheme: {
    filename: './assets/icons/clock-dark-thema.png',
    alt: 'Clock dark theme',
  },
  Close: {
    filename: './assets/icons/close.svg',
    alt: 'Close icon',
  },
  CoffeeBean: {
    filename: './assets/icons/coffee-bean.svg',
    alt: 'Coffee bean icon',
  },
  CheckCircle: {
    filename: './assets/icons/check-circle.svg',
    alt: 'Check circle icon',
  },
  Eye: {
    filename: './assets/icons/eye.svg',
    alt: 'Show password',
  },
  EyeDarkTheme: {
    filename: './assets/icons/eyeDarkTheme.svg',
    alt: 'Show password (dark theme)',
  },
  EyeSlash: {
    filename: './assets/icons/eye-slash.svg',
    alt: 'Hide password',
  },
  EyeSlashDarkTheme: {
    filename: './assets/icons/eye-slashDarkTheme.svg',
    alt: 'Hide password (dark theme)',
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
  HeartBlueDarkTheme: {
    filename: './assets/icons/heart-dark-thema.svg',
    alt: 'Heart dark theme icon',
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
    alt: 'ID pass icon',
  },
  IdPassDarkTheme: {
    filename: './assets/icons/id-pass-dark-thema.png',
    alt: 'ID pass dark theme icon',
  },
  Laptop: {
    filename: './assets/icons/laptop.png',
    alt: 'Laptop icon',
  },
  Letter: {
    filename: './assets/icons/letter.svg',
    alt: 'Letter icon',
  },
  LetterDarkTheme: {
    filename: './assets/icons/letterDarkTheme.png',
    alt: 'Letter dark theme icon',
  },
  Like: {
    filename: './assets/icons/like.svg',
    alt: 'Like icon',
  },
  LikeFill: {
    filename: './assets/icons/like-fill.svg',
    alt: 'Like fill icon',
  },
  Location: {
    filename: './assets/icons/location.svg',
    alt: 'Location icon',
  },
  LocationDarkTheme: {
    filename: './assets/icons/locationDarkTheme.svg',
    alt: 'Location dark theme icon',
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
    alt: 'Search icon (dark theme)',
  },
  SearchWhite: {
    filename: './assets/icons/search-white.svg',
    alt: 'Search icon (white)',
  },
  Share: {
    filename: './assets/icons/share.svg',
    alt: 'Share icon',
  },
  ShareDarkTheme: {
    filename: './assets/icons/share-dark-thema.svg',
    alt: 'Share dark theme icon',
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
    alt: 'Stars collage icon',
  },
  StarsCollageDarkTheme: {
    filename: './assets/icons/stars-collage-dark-thema.svg',
    alt: 'Stars collage dark theme icon',
  },
  UserProfile: {
    filename: './assets/icons/user-profile.svg',
    alt: 'User profile icon',
  },
  Moon: {
    filename: './assets/icons/moon.svg',
    alt: 'Moon icon',
  },
  Sun: {
    filename: './assets/icons/sun.svg',
    alt: 'Sun icon',
  },
  SunDarkTheme: {
    filename: './assets/icons/sun-dark.svg',
    alt: 'Sun dark theme icon',
  },
} as const;

/**
 * IconData type represents a single icon's metadata
 * consisting of filename and alt text.
 */
export type IconData = (typeof ICONS)[keyof typeof ICONS];
