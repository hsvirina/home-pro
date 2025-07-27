import { FilterCategory } from '../models/catalog-filter.model';

export const FILTER_CATEGORIES: FilterCategory[] = [
  {
    title: 'Location',
    key: 'location',
    description: 'Look for options',
    options: [
      {
        key: 'kyiv',
        label: 'Kyiv',
        description: 'Local picks',
        imageURL: './assets/filter/kyiv.jpg',
      },
      {
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
        key: 'workFriendly',
        label: 'Work-friendly',
        description: 'Calm, focused, with Wi-Fi',
        imageURL: './assets/filter/workFriendly.jpg',
      },
      {
        key: 'grabAndGo',
        label: 'Grab & go',
        description: 'Quick stop, takeout friendly',
        imageURL: './assets/filter/grabAndGo.jpg',
      },
      {
        key: 'brunch',
        label: 'Breakfast-brunch',
        description: 'Morning meals, tasty snacks',
        imageURL: './assets/filter/brunch.jpg',
      },
      {
        key: 'chill',
        label: 'Chill & Relax',
        description: 'Slow pace, cozy vibe',
        imageURL: './assets/filter/chill.jpg',
      },
      {
        key: 'date',
        label: 'Date or cozy time',
        description: 'Romantic, intimate feel',
        imageURL: './assets/filter/date.jpg',
      },
    ],
  },
  {
    title: 'Amenities',
    key: 'amenities',
    description: 'Bonus comfort',
    options: [
      {
        key: 'freeWifi',
        label: 'Wi-Fi',
        description: 'Fast and stable connection',
        imageURL: './assets/filter/freeWifi.jpg',
      },
      {
        key: 'petFriendly',
        label: 'Pet-friendly',
        description: 'Pets are welcome',
        imageURL: './assets/filter/petFriendly.jpg',
      },
      {
        key: 'veganOptions',
        label: 'Vegan options',
        description: 'Plant-based food & drinks',
        imageURL: './assets/filter/veganOptions.jpg',
      },
      {
        key: 'quietZone',
        label: 'Quiet zone',
        description: 'Low-noise, focus-friendly',
        imageURL: './assets/filter/quietZone.jpg',
      },
      {
        key: 'outdoorSeating',
        label: 'Outdoor seating',
        description: 'Terrace or street tables',
        imageURL: './assets/filter/outdoorSeating.jpg',
      },
    ],
  },
  {
    title: 'Vibe & Style',
    key: 'vibe',
    description: 'Design feel',
    options: [
      {
        key: 'minimalist',
        label: 'Minimalist',
        description: 'Clean, calm, spacious look',
        imageURL: './assets/filter/minimalist.jpg',
      },
      {
        key: 'vintageRetro',
        label: 'Vintage / Retro',
        description: 'Old-school, unique pieces',
        imageURL: './assets/filter/vintageRetro.jpg',
      },
      {
        key: 'livelySocial',
        label: 'Lively & social',
        description: 'Busy vibe, loud music',
        imageURL: './assets/filter/livelySocial.jpg',
      },
      {
        key: 'greenNatural',
        label: 'Green & natural',
        description: 'Plants, wood, eco-friendly',
        imageURL: './assets/filter/greenNatural.jpg',
      },
      {
        key: 'darkMoody',
        label: 'Dark & moody',
        description: 'Low light, deep tones',
        imageURL: './assets/filter/darkMoody.jpg',
      },
    ],
  },
];
