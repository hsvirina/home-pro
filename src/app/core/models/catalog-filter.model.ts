/**
 * Represents a single filter option within a filter category.
 */
export interface FilterOption {
  /** Unique identifier for the filter option */
  id: number;

  /** Key used to identify the option programmatically */
  key: string;

  /** Display label for the option */
  label: string;

  /** Additional description to explain the option */
  description: string;

  /** URL of the main image representing the option */
  imageURL: string;

  /** Optional URL for the icon (light theme) */
  iconURL?: string;

  /** Optional URL for the icon in dark theme */
  iconURLDarkTheme?: string;
}

/**
 * Represents a filter category grouping multiple filter options.
 */
export type FilterCategory = {
  /** Display title of the filter category */
  title: string;

  /** Key used to identify the category programmatically */
  key: string;

  /** Description of the filter category */
  description: string;

  /** List of filter options under this category */
  options: FilterOption[];
};

/**
 * Represents the active filter selections in the catalog.
 * Outer keys correspond to category keys,
 * inner keys correspond to option keys,
 * and the boolean indicates whether the filter is active.
 */
export type CatalogFilters = Record<string, Record<string, boolean>>;
