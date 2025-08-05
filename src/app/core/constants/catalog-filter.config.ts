import { FilterCategory } from '../models/catalog-filter.model';

// Array of filter categories for catalog filtering
export const FILTER_CATEGORIES: FilterCategory[] = [
  {
    title: 'Location',       // Category name shown in UI
    key: 'location',        // Unique key for filtering logic
    description: 'Look for options',  // Short info about this category
    options: [
      {
        id: 35,
        key: 'kyiv',        // Filter key used in data matching
        label: 'Kyiv',      // User-friendly label
        description: 'Local picks',
        imageURL: './assets/filter/kyiv.jpg',
      },
      {
        id: 0,              // 0 used as fallback id if not in list (commented)
        key: 'lviv',
        label: 'Lviv',
        description: 'Explore Lviv',
        imageURL: './assets/filter/lviv.jpg',
      },
    ],
  },
  {
    title: 'Purpose',
    key: 'purpose',
    description: 'Visit goal',
    options: [
      {
        id: 3,
        key: 'workFriendly',
        label: 'Work-friendly',
        description: 'Calm, focused, with Wi-Fi',
        imageURL: './assets/filter/workFriendly.jpg',
        iconURL: './assets/icons/workFriendly.svg',
        iconURLDarkThema: './assets/icons/workFriendlyDarkThema.svg',
      },
      {
        id: 48,
        key: 'grabAndGo',
        label: 'Grab & go',
        description: 'Quick stop, takeout friendly',
        imageURL: './assets/filter/grabAndGo.jpg',
        iconURL: './assets/icons/grabAndGo.svg',
        iconURLDarkThema: './assets/icons/grabAndGoDarkThema.svg',
      },
      {
        id: 49,
        key: 'brunch',
        label: 'Breakfast-brunch',
        description: 'Morning meals, tasty snacks',
        imageURL: './assets/filter/brunch.jpg',
        iconURL: './assets/icons/brunch.svg',
        iconURLDarkThema: './assets/icons/brunchDarkThema.svg',
      },
      {
        id: 52,
        key: 'chill',
        label: 'Chill & Relax',
        description: 'Slow pace, cozy vibe',
        imageURL: './assets/filter/chill.jpg',
        iconURL: './assets/icons/chill.svg',
        iconURLDarkThema: './assets/icons/chillDarkThema.svg',
      },
      {
        id: 55,
        key: 'date',
        label: 'Date or cozy time',
        description: 'Romantic, intimate feel',
        imageURL: './assets/filter/date.jpg',
        iconURL: './assets/icons/date.svg',
        iconURLDarkThema: './assets/icons/dateDarkThema.svg',
      },
    ],
  },
  {
    title: 'Amenities',
    key: 'amenities',
    description: 'Bonus comfort',
    options: [
      {
        id: 47,
        key: 'freeWifi',
        label: 'Wi-Fi',
        description: 'Fast and stable connection',
        imageURL: './assets/filter/freeWifi.jpg',
        iconURL: './assets/icons/freeWifi.svg',
        iconURLDarkThema: './assets/icons/freeWifiDarkThema.svg',
      },
      {
        id: 8,
        key: 'petFriendly',
        label: 'Pet-friendly',
        description: 'Pets are welcome',
        imageURL: './assets/filter/petFriendly.jpg',
        iconURL: './assets/icons/petFriendly.svg',
        iconURLDarkThema: './assets/icons/petFriendlyDarkThema.svg',
      },
      {
        id: 7,
        key: 'veganOptions',
        label: 'Vegan options',
        description: 'Plant-based food & drinks',
        imageURL: './assets/filter/veganOptions.jpg',
        iconURL: './assets/icons/veganOptions.svg',
        iconURLDarkThema: './assets/icons/veganOptionsDarkThema.svg',
      },
      {
        id: 54,
        key: 'quietZone',
        label: 'Quiet zone',
        description: 'Low-noise, focus-friendly',
        imageURL: './assets/filter/quietZone.jpg',
        iconURL: './assets/icons/quietZone.svg',
        iconURLDarkThema: './assets/icons/quietZoneDarkThema.svg',
      },
      {
        id: 50,
        key: 'outdoorSeating',
        label: 'Outdoor seating',
        description: 'Terrace or street tables',
        imageURL: './assets/filter/outdoorSeating.jpg',
        iconURL: './assets/icons/outdoorSeating.svg',
        iconURLDarkThema: './assets/icons/outdoorSeatingDarkThema.svg',
      },
    ],
  },
  {
    title: 'Vibe & Style',
    key: 'vibe',
    description: 'Design feel',
    options: [
      {
        id: 10,
        key: 'minimalist',
        label: 'Minimalist',
        description: 'Clean, calm, spacious look',
        imageURL: './assets/filter/minimalist.jpg',
        iconURL: './assets/icons/minimalist.svg',
        iconURLDarkThema: './assets/icons/minimalistDarkThema.svg',
      },
      {
        id: 51,
        key: 'vintageRetro',
        label: 'Vintage / Retro',
        description: 'Old-school, unique pieces',
        imageURL: './assets/filter/vintageRetro.jpg',
        iconURL: './assets/icons/vintageRetro.svg',
        iconURLDarkThema: './assets/icons/vintageRetroDarkThema.svg',
      },
      {
        id: 58, // last in list (lively social vibe)
        key: 'livelySocial',
        label: 'Lively & social',
        description: 'Busy vibe, loud music',
        imageURL: './assets/filter/livelySocial.jpg',
        iconURL: './assets/icons/livelySocial.svg',
        iconURLDarkThema: './assets/icons/livelySocialDarkThema.svg',
      },
      {
        id: 53,
        key: 'greenNatural',
        label: 'Green & natural',
        description: 'Plants, wood, eco-friendly',
        imageURL: './assets/filter/greenNatural.jpg',
        iconURL: './assets/icons/greenNatural.svg',
        iconURLDarkThema: './assets/icons/greenNaturalDarkThema.svg',
      },
      {
        id: 56,
        key: 'darkMoody',
        label: 'Dark & moody',
        description: 'Low light, deep tones',
        imageURL: './assets/filter/darkMoody.jpg',
        iconURL: './assets/icons/darkMoody.svg',
        iconURLDarkThema: './assets/icons/darkMoodyDarkThema.svg',
      },
    ],
  },
];
