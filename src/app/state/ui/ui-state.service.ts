import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UiStateService {
  /** Tracks the state of the mobile menu (open/closed) */
  private mobileMenuOpenSubject = new BehaviorSubject<boolean>(false);
  mobileMenuOpen$ = this.mobileMenuOpenSubject.asObservable();

  /** Tracks the state of the mobile filter panel (open/closed) */
  private mobileFilterOpenSubject = new BehaviorSubject<boolean>(false);
  mobileFilterOpen$ = this.mobileFilterOpenSubject.asObservable();

  /** Emits true if screen width is less than 1024px */
  private isMobileSubject = new BehaviorSubject<boolean>(window.innerWidth < 1024);
  isMobile$ = this.isMobileSubject.asObservable();

  constructor() {
    // Listen to window resize events and update isMobile state accordingly
    fromEvent(window, 'resize').pipe(
      map(() => window.innerWidth < 1024),
      startWith(window.innerWidth < 1024),
    ).subscribe(this.isMobileSubject);
  }

  /** Opens mobile menu and disables background scrolling */
  openMobileMenu(): void {
    this.mobileMenuOpenSubject.next(true);
    this.mobileFilterOpenSubject.next(false);
    document.body.style.overflow = 'hidden';
  }

  /** Closes mobile menu and restores scrolling */
  closeMobileMenu(): void {
    this.mobileMenuOpenSubject.next(false);
    document.body.style.overflow = '';
  }

  /** Opens mobile filter and disables background scrolling */
  openMobileFilter(): void {
    this.mobileFilterOpenSubject.next(true);
    this.mobileMenuOpenSubject.next(false);
    document.body.style.overflow = 'hidden';
  }

  /** Closes mobile filter and restores scrolling */
  closeMobileFilter(): void {
    this.mobileFilterOpenSubject.next(false);
    document.body.style.overflow = '';
  }
}
