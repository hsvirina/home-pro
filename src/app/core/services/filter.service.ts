import { Injectable } from '@angular/core';
import { LanguageService, LangCode } from './language.service';
import { FILTER_CATEGORIES } from '../constants/catalog-filter.config';

import { FilterCategory } from '../models/catalog-filter.model';
import { FILTER_CATEGORIES_UK } from '../constants/catalog-filter.uk.config';

@Injectable({ providedIn: 'root' })
export class FilterService {
  constructor(private languageService: LanguageService) {}

  get categories(): FilterCategory[] {
    const lang = this.languageService.currentLang;
    return lang === 'uk' ? FILTER_CATEGORIES_UK : FILTER_CATEGORIES;
  }
}
