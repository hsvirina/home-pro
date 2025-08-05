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

  setTheme(theme: Theme) {
    const normalizedTheme = theme.toLowerCase() as Theme;

    this.themeSubject.next(normalizedTheme);
    localStorage.setItem('theme', normalizedTheme);
    document.documentElement.setAttribute('data-theme', normalizedTheme);
  }

  toggleTheme() {
    const next = this.themeSubject.getValue() === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  get currentTheme(): Theme {
    return this.themeSubject.getValue();
  }
}
