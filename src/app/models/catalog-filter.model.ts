export type FilterOption = {
  key: string;
  label: string;
  description: string,
  imageURL: string
};

export type FilterCategory = {
  title: string;
  key: string;
  description: string;
  options: FilterOption[];
};

export type CatalogFilters = Record<string, Record<string, boolean>>;
