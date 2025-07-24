import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UiStateService {
  private mobileMenuOpenSubject = new BehaviorSubject(false);
  mobileMenuOpen$ = this.mobileMenuOpenSubject.asObservable();

  private mobileFilterOpenSubject = new BehaviorSubject(false);
  mobileFilterOpen$ = this.mobileFilterOpenSubject.asObservable();

  openMobileMenu() {
    this.mobileMenuOpenSubject.next(true);
    this.mobileFilterOpenSubject.next(false); // Закрываем фильтры при открытии меню
    document.body.style.overflow = 'hidden';
  }

  closeMobileMenu() {
    this.mobileMenuOpenSubject.next(false);
    document.body.style.overflow = '';
  }

  openMobileFilter() {
    this.mobileFilterOpenSubject.next(true);
    this.mobileMenuOpenSubject.next(false); // Закрываем меню при открытии фильтров
    document.body.style.overflow = 'hidden';
  }

  closeMobileFilter() {
    this.mobileFilterOpenSubject.next(false);
    document.body.style.overflow = '';
  }
}
