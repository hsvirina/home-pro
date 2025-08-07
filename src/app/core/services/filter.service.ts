import { Injectable } from '@angular/core';
import { LanguageService } from './language.service';
import { FILTER_CATEGORIES } from '../constants/catalog-filter.config';
import { FILTER_CATEGORIES_UK } from '../constants/catalog-filter.uk.config';
import { FilterCategory } from '../models/catalog-filter.model';

/**
 * FilterService provides localized filter categories based on the current application language.
 * It enables dynamic retrieval of filter metadata according to user language preferences.
 */
@Injectable({ providedIn: 'root' })
export class FilterService {
  constructor(private languageService: LanguageService) {}

  /**
   * Retrieves the array of filter categories for the current language.
   * Returns Ukrainian filter categories if the language code is 'uk',
   * otherwise defaults to the English filter categories.
   */
  get categories(): FilterCategory[] {
    const lang = this.languageService.currentLang;
    return lang === 'uk' ? FILTER_CATEGORIES_UK : FILTER_CATEGORIES;
  }
}
