import { Injectable } from '@angular/core';
import { Place } from '../../core/models/place.model';
import { CatalogFilters } from '../../core/models/catalog-filter.model';

interface FilterCategoryOption {
  key: string;
  label: string;
}

interface FilterCategory {
  key: string;
  options: FilterCategoryOption[];
}

/**
 * Service responsible for filtering Places based on active filter selections.
 */
@Injectable({ providedIn: 'root' })
export class CatalogFilterService {
  /**
   * Filters an array of places according to the active filters and filter categories.
   *
   * @param places - Array of places to be filtered
   * @param filters - Current active filter selections, grouped by category and option keys
   * @param filterCategories - Metadata about filter categories and their options (keys and labels)
   * @returns Filtered array of places matching the selected filters
   */
  filterPlaces(
    places: Place[],
    filters: CatalogFilters,
    filterCategories: FilterCategory[],
  ): Place[] {
    return places.filter((place) => {
      const tags = place.tags || [];
      const city = place.city.toLowerCase();

      for (const categoryKey in filters) {
        // Extract selected filter keys for this category
        const selectedKeys = Object.keys(filters[categoryKey]).filter(
          (key) => filters[categoryKey][key]
        );
        // Skip empty filter category
        if (selectedKeys.length === 0) continue;

        // Special handling for location category filtering
        if (categoryKey === 'location') {
          const locationCategory = filterCategories.find((cat) => cat.key === 'location');
          const selectedLabels = selectedKeys.map((key) => {
            const option = locationCategory?.options.find((opt) => opt.key === key);
            return option ? option.label.toLowerCase() : key.toLowerCase();
          });

          // Check if place's city includes any of the selected location labels
          if (!selectedLabels.some((label) => city.includes(label))) {
            return false;
          }
        } else {
          // For other categories, check if place tags contain any selected label
          if (
            !selectedKeys.some((key) => {
              const label = this.getLabelByKey(filterCategories, categoryKey, key);
              return tags.some((tag) => tag.name === label);
            })
          ) {
            return false;
          }
        }
      }

      // All filter categories passed, include place in result
      return true;
    });
  }

  /**
   * Retrieves the user-friendly label for a given filter category key and option key.
   *
   * @param filterCategories - Array of filter categories
   * @param categoryKey - Key identifying the filter category
   * @param optionKey - Key identifying the filter option within the category
   * @returns The label string associated with the filter option, or empty string if not found
   */
  getLabelByKey(
    filterCategories: FilterCategory[],
    categoryKey: string,
    optionKey: string,
  ): string {
    const category = filterCategories.find((cat) => cat.key === categoryKey);
    return category?.options.find((opt) => opt.key === optionKey)?.label || '';
  }
}
