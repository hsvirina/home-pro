import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FilterBarComponent } from './components/filter-bar.component';
import { WelcomeBlockComponent } from './components/welcome-block.component';
import { Place } from '../../core/models/place.model';
import { PlacesStoreService } from '../../core/services/places-store.service';
import { CommonModule } from '@angular/common';

import { ModalComponent } from '../../shared/components/modal.component';
import { SliderPlacesComponent } from '../../shared/components/slider-places.component';
import { ImageCollageComponent } from './components/image-collage.component';
import { Theme } from '../../core/models/theme.type';
import { Observable } from 'rxjs';
import { ThemeService } from '../../core/services/theme.service';
import { TranslateModule } from '@ngx-translate/core';
import {
  LangCode,
  LanguageService,
} from '../../core/services/language.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    SliderPlacesComponent,
    FilterBarComponent,
    WelcomeBlockComponent,
    ModalComponent,
    ImageCollageComponent,
    TranslateModule,
  ],
  template: `
    <div class="flex w-full flex-col items-center">
      <div class="flex w-full max-w-[1320px] flex-col gap-8">
        <!-- Image Collage -->
        <div class="order-1 lg:order-3">
          <app-image-collage class="w-full"></app-image-collage>
        </div>

        <!-- Title and Subtitle -->
        <div
          class="order-2 flex flex-col gap-6 px-5 text-center lg:order-2"
          *ngIf="currentTheme$ | async as theme"
          [ngClass]="{ 'text-[var(--color-white)]': theme === 'dark' }"
        >
          <h2 class="max-w-[1200px] text-[36px] lg:text-[64px] xxl:text-[80px]">
            {{ 'home_page.title' | translate }}
            <span class="text-[var(--color-primary)]">{{
              'home_page.click' | translate
            }}</span>
            <ng-container *ngIf="lang$ | async as lang">
              <ng-container *ngIf="lang === 'en'">
                {{ 'home_page.away' | translate }}
              </ng-container>
            </ng-container>
          </h2>
          <span class="body-font-1">{{
            'home_page.subtitle' | translate
          }}</span>
        </div>

        <!-- Filter Bar -->
        <div
          class="order-3 flex w-full justify-center px-5 lg:order-1 lg:mx-auto lg:w-auto"
        >
          <app-filter-bar class="w-full"></app-filter-bar>
        </div>
      </div>

      <!-- Slider: Recommended for you -->
      <app-slider-places
        [title]="'home_page.slider.for_you' | translate"
        [places]="(places$ | async) ?? []"
        (unauthorizedFavoriteClick)="handleUnauthorizedFavoriteClick()"
        class="my-[64px] w-full max-w-[1320px] lg:mb-[150px] lg:mt-[150px] lg:px-10 xxl:px-0"
      ></app-slider-places>

      <!-- Welcome block with theme-based background -->
      <div
        class="w-full rounded-[24px]"
        *ngIf="currentTheme$ | async as theme"
        [ngClass]="{
          'bg-[var(--color-gray-100)]': theme === 'dark',
          'bg-[var(--color-white)]': theme === 'light',
        }"
      >
        <div class="mx-auto w-full max-w-[1320px]">
          <app-welcome-block></app-welcome-block>
        </div>
      </div>

      <!-- Slider: Popular places -->
      <app-slider-places
        [title]="'home_page.slider.popular' | translate"
        [places]="(popularPlaces$ | async) ?? []"
        (unauthorizedFavoriteClick)="handleUnauthorizedFavoriteClick()"
        class="my-[64px] w-full max-w-[1320px] lg:mb-[150px] lg:mt-[150px] lg:px-10 xxl:px-0"
      ></app-slider-places>
    </div>

    <!-- Login Modal -->
    <app-modal [isOpen]="showLoginModal" (close)="showLoginModal = false">
      <h4 class="mb-4 text-center">{{ 'MODAL.LOGIN_TITLE' | translate }}</h4>
      <p class="menu-text-font mb-4 text-center text-[var(--color-gray-75)]">
        {{ 'MODAL.LOGIN_TEXT' | translate }}
      </p>
      <div class="flex justify-center gap-4">
        <button
          (click)="navigateToAuth()"
          class="button-font button-bg-blue px-6 py-2"
        >
          {{ 'button.log_in' | translate }}
        </button>
        <button
          (click)="showLoginModal = false"
          class="button-font button-bg-transparent px-6 py-2"
        >
          {{ 'button.close' | translate }}
        </button>
      </div>
    </app-modal>
  `,
})
export class HomePageComponent implements OnInit {
  places$: Observable<Place[]>;
  popularPlaces$: Observable<Place[]>;
  currentTheme$: Observable<Theme>;
  lang$: Observable<LangCode>;

  showLoginModal = false;

  constructor(
    private placesStore: PlacesStoreService,
    private router: Router,
    private themeService: ThemeService,
    private languageService: LanguageService,
  ) {
    this.places$ = this.placesStore.places$;
    this.popularPlaces$ = this.placesStore.popularPlaces$;
    this.currentTheme$ = this.themeService.theme$;
    this.lang$ = this.languageService.lang$;
  }

  /** Load places data on component initialization */
  ngOnInit(): void {
    this.placesStore.loadPlaces();
  }

  /** Open login modal when user tries to favorite a place without authorization */
  handleUnauthorizedFavoriteClick(): void {
    this.showLoginModal = true;
  }

  /**
   * Navigate to the authentication page.
   * Save current route to return to after successful login.
   */
  navigateToAuth(): void {
    localStorage.setItem('returnUrl', this.router.url);
    this.showLoginModal = false;
    this.router.navigate(['/auth']);
  }
}
