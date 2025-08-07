import { FilterCategory } from '../models/catalog-filter.model';

/**
 * Ukrainian localization of filter categories for the catalog.
 * Contains translated titles, descriptions, and options.
 */
export const FILTER_CATEGORIES_UK: FilterCategory[] = [
  {
    title: 'Локація', // Category name shown in UI
    key: 'location', // Unique key for filtering logic
    description: 'Обери місто', // Short category description
    options: [
      {
        id: 35,
        key: 'kyiv', // Key used for data matching
        label: 'Київ', // User-friendly label
        description: 'Заклади Києва',
        imageURL: './assets/filter/kyiv.jpg',
      },
      {
        id: 0, // Fallback id if needed
        key: 'lviv',
        label: 'Львів',
        description: 'Заклади Львова',
        imageURL: './assets/filter/lviv.jpg',
      },
    ],
  },
  {
    title: 'Мета візиту',
    key: 'purpose',
    description: 'Навіщо ти тут?',
    options: [
      {
        id: 3,
        key: 'workFriendly',
        label: 'Зручно для роботи',
        description: 'Тихо, спокійно, є Wi-Fi',
        imageURL: './assets/filter/workFriendly.jpg',
        iconURL: './assets/icons/workFriendly.svg',
        iconURLDarkTheme: './assets/icons/workFriendlyDarkTheme.svg',
      },
      {
        id: 48,
        key: 'grabAndGo',
        label: 'На виніс',
        description: 'Швидка зупинка, takeout',
        imageURL: './assets/filter/grabAndGo.jpg',
        iconURL: './assets/icons/grabAndGo.svg',
        iconURLDarkTheme: './assets/icons/grabAndGoDarkTheme.svg',
      },
      {
        id: 49,
        key: 'brunch',
        label: 'Сніданок-бранч',
        description: 'Ранкові страви та снеки',
        imageURL: './assets/filter/brunch.jpg',
        iconURL: './assets/icons/brunch.svg',
        iconURLDarkTheme: './assets/icons/brunchDarkTheme.svg',
      },
      {
        id: 52,
        key: 'chill',
        label: 'Розслабитись та відпочити',
        description: 'Повільний темп, затишна атмосфера',
        imageURL: './assets/filter/chill.jpg',
        iconURL: './assets/icons/chill.svg',
        iconURLDarkTheme: './assets/icons/chillDarkTheme.svg',
      },
      {
        id: 55,
        key: 'date',
        label: 'Датування чи затишний час',
        description: 'Романтика, інтимна атмосфера',
        imageURL: './assets/filter/date.jpg',
        iconURL: './assets/icons/date.svg',
        iconURLDarkTheme: './assets/icons/dateDarkTheme.svg',
      },
    ],
  },
  {
    title: 'Зручності',
    key: 'amenities',
    description: 'Додатковий комфорт',
    options: [
      {
        id: 47,
        key: 'freeWifi',
        label: 'Wi-Fi',
        description: 'Швидкий та стабільний інтернет',
        imageURL: './assets/filter/freeWifi.jpg',
        iconURL: './assets/icons/freeWifi.svg',
        iconURLDarkTheme: './assets/icons/freeWifiDarkTheme.svg',
      },
      {
        id: 8,
        key: 'petFriendly',
        label: 'Дружнє до тварин',
        description: 'Тварини ласкаво просимо',
        imageURL: './assets/filter/petFriendly.jpg',
        iconURL: './assets/icons/petFriendly.svg',
        iconURLDarkTheme: './assets/icons/petFriendlyDarkTheme.svg',
      },
      {
        id: 7,
        key: 'veganOptions',
        label: 'Веганські опції',
        description: 'Рослинна їжа та напої',
        imageURL: './assets/filter/veganOptions.jpg',
        iconURL: './assets/icons/veganOptions.svg',
        iconURLDarkTheme: './assets/icons/veganOptionsDarkTheme.svg',
      },
      {
        id: 54,
        key: 'quietZone',
        label: 'Тиха зона',
        description: 'Мінімум шуму, максимум фокусу',
        imageURL: './assets/filter/quietZone.jpg',
        iconURL: './assets/icons/quietZone.svg',
        iconURLDarkTheme: './assets/icons/quietZoneDarkTheme.svg',
      },
      {
        id: 50,
        key: 'outdoorSeating',
        label: 'Місця на відкритому повітрі',
        description: 'Тераси або столики надворі',
        imageURL: './assets/filter/outdoorSeating.jpg',
        iconURL: './assets/icons/outdoorSeating.svg',
        iconURLDarkTheme: './assets/icons/outdoorSeatingDarkTheme.svg',
      },
    ],
  },
  {
    title: 'Атмосфера та стиль',
    key: 'vibe',
    description: 'Яке враження?',
    options: [
      {
        id: 10,
        key: 'minimalist',
        label: 'Мінімалістичний',
        description: 'Чистий, просторий інтер’єр',
        imageURL: './assets/filter/minimalist.jpg',
        iconURL: './assets/icons/minimalist.svg',
        iconURLDarkTheme: './assets/icons/minimalistDarkTheme.svg',
      },
      {
        id: 51,
        key: 'vintageRetro',
        label: 'Вінтаж / ретро',
        description: 'Старовинні меблі та настрій',
        imageURL: './assets/filter/vintageRetro.jpg',
        iconURL: './assets/icons/vintageRetro.svg',
        iconURLDarkTheme: './assets/icons/vintageRetroDarkTheme.svg',
      },
      {
        id: 58,
        key: 'livelySocial',
        label: 'Жива та соціальна',
        description: 'Багато людей, енергія, музика',
        imageURL: './assets/filter/livelySocial.jpg',
        iconURL: './assets/icons/livelySocial.svg',
        iconURLDarkTheme: './assets/icons/livelySocialDarkTheme.svg',
      },
      {
        id: 53,
        key: 'greenNatural',
        label: 'Зелений та натуральний',
        description: 'Рослини, дерево, еко-атмосфера',
        imageURL: './assets/filter/greenNatural.jpg',
        iconURL: './assets/icons/greenNatural.svg',
        iconURLDarkTheme: './assets/icons/greenNaturalDarkTheme.svg',
      },
      {
        id: 56,
        key: 'darkMoody',
        label: 'Темно та атмосферно',
        description: 'Приглушене світло, глибокі тони',
        imageURL: './assets/filter/darkMoody.jpg',
        iconURL: './assets/icons/darkMoody.svg',
        iconURLDarkTheme: './assets/icons/darkMoodyDarkTheme.svg',
      },
    ],
  },
];
