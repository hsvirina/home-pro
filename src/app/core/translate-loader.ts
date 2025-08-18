import { HttpClient } from '@angular/common/http';
import { TranslateLoader, Translation } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable } from 'rxjs';

/**
 * Factory function to create a TranslateLoader for ngx-translate.
 * Loads translation JSON files from the specified assets folder.
 *
 * @param http HttpClient instance used to fetch translation files
 * @returns A TranslateLoader implementing getTranslation
 */
export function createTranslateLoader(http: HttpClient): TranslateLoader {
  // Default loader that fetches JSON translation files from './assets/i18n/'
  const loader = new TranslateHttpLoader(http, './assets/i18n/', '.json');

  return {
    /**
     * Fetch translations for a given language
     * @param lang Language code (e.g., 'en', 'fr')
     * @returns Observable with translation key-value pairs
     */
    getTranslation: (lang: string): Observable<Translation> => {
      return loader.getTranslation(lang) as Observable<Translation>;
    },
  };
}
