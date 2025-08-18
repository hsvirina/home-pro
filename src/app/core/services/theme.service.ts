import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Theme } from '../models/theme.type';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject: BehaviorSubject<Theme>;
  public theme$: Observable<Theme>;

  constructor() {
    const saved =
      (localStorage.getItem('theme')?.toLowerCase() as Theme) ?? 'light';

    this.themeSubject = new BehaviorSubject<Theme>(saved);
    this.theme$ = this.themeSubject.asObservable();

    document.documentElement.setAttribute('data-theme', saved);
  }

  /**
   * Sets a new theme if it differs from the current one.
   * Avoids unnecessary writes to localStorage.
   * @param theme The theme to set ('light' or 'dark').
   */
  setTheme(theme: Theme) {
    const normalizedTheme = theme.toLowerCase() as Theme;
    const current = this.themeSubject.getValue();

    // Only update if theme has changed
    if (normalizedTheme !== current) {
      this.themeSubject.next(normalizedTheme);
      localStorage.setItem('theme', normalizedTheme);
      document.documentElement.setAttribute('data-theme', normalizedTheme);
    }
  }

  /**
   * Toggles the theme between 'light' and 'dark'.
   */
  toggleTheme() {
    const next = this.themeSubject.getValue() === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  /**
   * Returns the current theme value.
   */
  get currentTheme(): Theme {
    return this.themeSubject.getValue();
  }
}
