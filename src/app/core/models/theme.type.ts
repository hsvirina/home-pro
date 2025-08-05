export const ThemeValues = ['light', 'dark'] as const;
export type Theme = typeof ThemeValues[number];
