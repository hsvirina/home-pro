import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UiStateService {
  private mobileMenuOpenSubject = new BehaviorSubject<boolean>(false);
  mobileMenuOpen$ = this.mobileMenuOpenSubject.asObservable();

  private mobileFilterOpenSubject = new BehaviorSubject<boolean>(false);
  mobileFilterOpen$ = this.mobileFilterOpenSubject.asObservable();

  private isMobileSubject = new BehaviorSubject<boolean>(window.innerWidth < 1024);
  isMobile$ = this.isMobileSubject.asObservable();

  constructor() {
    fromEvent(window, 'resize').pipe(
      map(() => window.innerWidth < 1024),
      startWith(window.innerWidth < 1024),
    ).subscribe(this.isMobileSubject);
  }

  openMobileMenu(): void {
    this.mobileMenuOpenSubject.next(true);
    this.mobileFilterOpenSubject.next(false);
    document.body.style.overflow = 'hidden';
  }
  closeMobileMenu(): void {
    this.mobileMenuOpenSubject.next(false);
    document.body.style.overflow = '';
  }

  openMobileFilter(): void {
    this.mobileFilterOpenSubject.next(true);
    this.mobileMenuOpenSubject.next(false);
    document.body.style.overflow = 'hidden';
  }
  closeMobileFilter(): void {
    this.mobileFilterOpenSubject.next(false);
    document.body.style.overflow = '';
  }
}
