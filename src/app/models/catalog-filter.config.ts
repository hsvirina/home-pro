import { FilterCategory } from "./catalog-filter.model";

export const FILTER_CATEGORIES: FilterCategory[] = [
  {
    title: 'Location',
    key: 'location',
    description: 'Look for options',
    options: [
      { key: 'kyiv', label: 'Kyiv', description: 'Local picks', imageURL:'/filter/kyiv.jpg' },
      { key: 'lviv', label: 'Lviv', description: 'Explore Lviv', imageURL:'/filter/lviv.jpg' },
    ],
  },
  {
    title: 'Purpose',
    key: 'purpose',
    description: 'Visit goal',
    options: [
      { key: 'workFriendly', label: 'Work-friendly', description: 'Calm, focused, with Wi-Fi', imageURL:'/filter/workFriendly.jpg' },
      { key: 'grabAndGo', label: 'Grab & go', description: 'Quick stop, takeout friendly', imageURL:'/filter/grabAndGo.jpg' },
      { key: 'brunch', label: 'Breakfast-brunch', description: 'Morning meals, tasty snacks', imageURL:'/filter/brunch.jpg' },
      { key: 'chill', label: 'Chill & Relax', description: 'Slow pace, cozy vibe', imageURL:'/filter/chill.jpg' },
      { key: 'date', label: 'Date or cozy time', description: 'Romantic, intimate feel', imageURL:'/filter/date.jpg' },
    ],
  },
  {
    title: 'Amenities',
    key: 'amenities',
    description: 'Bonus comfort',
    options: [
      { key: 'freeWifi', label: 'Wi-Fi', description: 'Fast and stable connection', imageURL:'/filter/freeWifi.jpg' },
      { key: 'petFriendly', label: 'Pet-friendly', description: 'Pets are welcome', imageURL:'/filter/petFriendly.jpg' },
      { key: 'veganOptions', label: 'Vegan options', description: 'Plant-based food & drinks', imageURL:'/filter/veganOptions.jpg' },
      { key: 'quietZone', label: 'Quiet zone', description: 'Low-noise, focus-friendly', imageURL:'/filter/quietZone.jpg' },
      { key: 'outdoorSeating', label: 'Outdoor seating', description: 'Terrace or street tables', imageURL:'/filter/outdoorSeating.jpg' },
    ],
  },
  {
    title: 'Vibe & Style',
    key: 'vibe',
    description: 'Design feel',
    options: [
      { key: 'minimalist', label: 'Minimalist', description: 'Clean, calm, spacious look', imageURL:'/filter/minimalist.jpg' },
      { key: 'vintageRetro', label: 'Vintage / Retro', description: 'Old-school, unique pieces', imageURL:'/filter/vintageRetro.jpg' },
      { key: 'livelySocial', label: 'Lively & social', description: 'Busy vibe, loud music', imageURL:'/filter/livelySocial.jpg' },
      { key: 'greenNatural', label: 'Green & natural', description: 'Plants, wood, eco-friendly', imageURL:'/filter/greenNatural.jpg' },
      { key: 'darkMoody', label: 'Dark & moody', description: 'Low light, deep tones', imageURL:'/filter/darkMoody.jpg' },
    ],
  },
];
