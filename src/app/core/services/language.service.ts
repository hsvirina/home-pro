import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AuthUser } from '../models/user.model';

export type LangCode = 'en' | 'uk';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly allowedLangs: LangCode[] = ['en', 'uk'];

  private getInitialLang(): LangCode {
    const stored = localStorage.getItem('lang');
    if (stored && this.allowedLangs.includes(stored as LangCode)) {
      return stored as LangCode;
    }
    return 'en';
  }

  syncFromUser(user: AuthUser): void {
  const userLang = user.language?.toLowerCase();
  if (userLang === 'en' || userLang === 'uk') {
    this.setLang(userLang);
  }
}

  private langSubject = new BehaviorSubject<LangCode>(this.getInitialLang());
  lang$ = this.langSubject.asObservable();

  get currentLang(): LangCode {
    return this.langSubject.value;
  }

  constructor(private translate: TranslateService) {
    this.translate.setFallbackLang('en');

    this.translate.use(this.getInitialLang());
  }

  setLang(lang: LangCode) {
    if (!this.allowedLangs.includes(lang)) {
      throw new Error(`Unsupported language code: ${lang}`);
    }
    localStorage.setItem('lang', lang);
    this.langSubject.next(lang);
    this.translate.use(lang);
  }
}
