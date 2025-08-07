import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UiStateService {
  /** Observable tracking whether the mobile menu is open */
  private mobileMenuOpenSubject = new BehaviorSubject<boolean>(false);
  mobileMenuOpen$ = this.mobileMenuOpenSubject.asObservable();

  /** Observable tracking whether the mobile filter panel is open */
  private mobileFilterOpenSubject = new BehaviorSubject<boolean>(false);
  mobileFilterOpen$ = this.mobileFilterOpenSubject.asObservable();

  /** Observable emitting true if the viewport width is less than 1024px */
  private isMobileSubject = new BehaviorSubject<boolean>(window.innerWidth < 1024);
  isMobile$ = this.isMobileSubject.asObservable();

  constructor() {
    // Listen to window resize events to update the isMobile state reactively
    fromEvent(window, 'resize').pipe(
      map(() => window.innerWidth < 1024),
      startWith(window.innerWidth < 1024),
    ).subscribe(this.isMobileSubject);
  }

  /**
   * Opens the mobile menu, closes the mobile filter panel,
   * and disables body scrolling.
   */
  openMobileMenu(): void {
    this.mobileMenuOpenSubject.next(true);
    this.mobileFilterOpenSubject.next(false);
    this.disableBodyScroll();
  }

  /**
   * Closes the mobile menu and restores body scrolling.
   */
  closeMobileMenu(): void {
    this.mobileMenuOpenSubject.next(false);
    this.enableBodyScrollIfAllowed();
  }

  /**
   * Opens the mobile filter panel, closes the mobile menu,
   * and disables body scrolling.
   */
  openMobileFilter(): void {
    this.mobileFilterOpenSubject.next(true);
    this.mobileMenuOpenSubject.next(false);
    this.disableBodyScroll();
  }

  /**
   * Closes the mobile filter panel and restores body scrolling.
   */
  closeMobileFilter(): void {
    this.mobileFilterOpenSubject.next(false);
    this.enableBodyScrollIfAllowed();
  }

  /**
   * Toggles the mobile menu open/close state.
   */
  toggleMobileMenu(): void {
    const isOpen = this.mobileMenuOpenSubject.value;
    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  /**
   * Disables body scrolling by setting overflow to 'hidden'.
   */
  private disableBodyScroll(): void {
    document.body.style.overflow = 'hidden';
  }

  /**
   * Enables body scrolling only if both mobile menu and filter are closed.
   */
  private enableBodyScrollIfAllowed(): void {
    if (
      !this.mobileMenuOpenSubject.value &&
      !this.mobileFilterOpenSubject.value
    ) {
      document.body.style.overflow = '';
    }
  }
}
