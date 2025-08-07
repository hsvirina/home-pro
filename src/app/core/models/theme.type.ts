/**
 * Defines the allowed theme values as a readonly tuple.
 */
export const ThemeValues = ['light', 'dark'] as const;

/**
 * Type representing the available themes.
 * It is a union type of the string literals 'light' and 'dark'.
 */
export type Theme = typeof ThemeValues[number];
