export interface FilterOption {
  id: number;               // <-- добавляем обязательное поле id
  key: string;
  label: string;
  description: string;
  imageURL: string;
  iconURL?: string;
  iconURLDarkThema?: string;
}

export type FilterCategory = {
  title: string;
  key: string;
  description: string;
  options: FilterOption[];
};

export type CatalogFilters = Record<string, Record<string, boolean>>;
