import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * LoaderService manages global loading state.
 * It provides an observable for components to reactively display/hide loading indicators.
 */
@Injectable({ providedIn: 'root' })
export class LoaderService {
  // Internal BehaviorSubject to track loading state
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Public observable for components to subscribe to loading state changes
  public readonly isLoading$ = this.loadingSubject.asObservable();

  /**
   * Sets loading state to true, indicating loading in progress.
   */
  show(): void {
    this.loadingSubject.next(true);
  }

  /**
   * Sets loading state to false, indicating loading has finished.
   */
  hide(): void {
    this.loadingSubject.next(false);
  }
}
