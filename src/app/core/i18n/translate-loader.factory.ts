import { HttpClient } from '@angular/common/http';
import { TranslateLoader, Translation } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable } from 'rxjs';

/**
 * Factory function to create a TranslateLoader instance for ngx-translate.
 *
 * This loader fetches translation JSON files from the `assets/i18n/` directory.
 *
 * @param http HttpClient instance for performing HTTP requests.
 * @returns A TranslateLoader with getTranslation method returning an Observable of translations.
 */
export function createTranslateLoader(http: HttpClient): TranslateLoader {
  const loader = new TranslateHttpLoader(http, './assets/i18n/', '.json');

  return {
    getTranslation: (lang: string): Observable<Translation> =>
      loader.getTranslation(lang) as Observable<Translation>,
  };
}
