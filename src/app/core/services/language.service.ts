import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AuthUser } from '../models/user.model';

export type LangCode = 'en' | 'uk';

/**
 * LanguageService manages application language state,
 * synchronizes with user preferences and persists the selection.
 * Integrates with ngx-translate for runtime language switching.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  // Supported language codes
  private readonly allowedLangs: LangCode[] = ['en', 'uk'];

  // RxJS subject to emit current language changes
  private langSubject = new BehaviorSubject<LangCode>(this.getInitialLang());

  // Observable for language changes
  lang$ = this.langSubject.asObservable();

  constructor(private translate: TranslateService) {
    // Set default fallback language in translation service
    this.translate.setFallbackLang('en');
    // Initialize translation language with persisted or default language
    this.translate.use(this.getInitialLang());
  }

  /**
   * Retrieves the initial language from localStorage or defaults to 'en'.
   * @returns LangCode initial language code
   */
  private getInitialLang(): LangCode {
    const stored = localStorage.getItem('lang');
    if (stored && this.allowedLangs.includes(stored as LangCode)) {
      return stored as LangCode;
    }
    return 'en';
  }

  /**
   * Updates the language based on the authenticated user's preference.
   * Ignores if user's language is unsupported.
   * @param user AuthUser object containing language preference
   */
  syncFromUser(user: AuthUser): void {
    const userLang = user.language?.toLowerCase() as LangCode | undefined;
    if (userLang && this.allowedLangs.includes(userLang)) {
      this.setLang(userLang);
    }
  }

  /**
   * Current active language getter.
   */
  get currentLang(): LangCode {
    return this.langSubject.value;
  }

  /**
   * Sets the application language.
   * Throws error if language code is unsupported.
   * Updates localStorage, BehaviorSubject, and ngx-translate language.
   * @param lang LangCode to set
   */
  setLang(lang: LangCode): void {
    if (!this.allowedLangs.includes(lang)) {
      throw new Error(`Unsupported language code: ${lang}`);
    }
    localStorage.setItem('lang', lang);
    this.langSubject.next(lang);
    this.translate.use(lang);
  }
}
