import { HttpClient } from '@angular/common/http';
import { TranslateLoader, Translation } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable } from 'rxjs';

export function createTranslateLoader(http: HttpClient): TranslateLoader {
  const loader = new TranslateHttpLoader(http, './assets/i18n/', '.json');

  return {
    getTranslation: (lang: string): Observable<Translation> => {
      return loader.getTranslation(lang) as Observable<Translation>;
    },
  };
}
