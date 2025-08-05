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
        <!-- Коллаж -->
        <div class="order-1 lg:order-3">
          <app-image-collage class="w-full"></app-image-collage>
        </div>

        <!-- Тайтл и подзаголовок -->
        <div
          class="order-2 flex flex-col gap-6 px-5 text-center lg:order-2"
          [ngClass]="{
            'text-[var(--color-white)]': (currentTheme$ | async) === 'dark',
          }"
        >
          <h2 class="max-w-[1172px] text-[36px] lg:text-[64px] xxl:text-[80px]">
            {{ 'HOME.TITLE' | translate }}
            <span class="text-[var(--color-primary)]">{{
              'HOME.CLICK' | translate
            }}</span>
            {{ 'HOME.AWAY' | translate }}
          </h2>
          <span class="body-font-1">
            {{ 'HOME.SUBTITLE' | translate }}
          </span>
        </div>

        <!-- Filter Bar -->
        <div
          class="order-3 flex w-full justify-center px-5 lg:order-1 lg:mx-auto lg:w-auto"
        >
          <app-filter-bar class="w-full"></app-filter-bar>
        </div>
      </div>

      <!-- Слайдер популярных -->
      <app-slider-places
        [title]="'SLIDER.FOR_YOU' | translate"
        [places]="places"
        (unauthorizedFavoriteClick)="handleUnauthorizedFavoriteClick()"
        class="my-[64px] w-full max-w-[1320px] lg:mb-[150px] lg:mt-[150px] lg:px-10 xxl:px-0"
      ></app-slider-places>

      <!-- Welcome-блок: фон на всю ширину -->
      <div
        class="w-full"
        [ngClass]="{
          'bg-[var(--color-gray-100)]': (currentTheme$ | async) === 'dark',
          'bg-[var(--color-white)]': (currentTheme$ | async) === 'light',
        }"
      >
        <div class="mx-auto w-full max-w-[1320px]">
          <app-welcome-block></app-welcome-block>
        </div>
      </div>

      <!-- Слайдер самых популярных -->
      <app-slider-places
        [title]="'SLIDER.POPULAR' | translate"
        [places]="popularPlaces"
        (unauthorizedFavoriteClick)="handleUnauthorizedFavoriteClick()"
        class="my-[64px] w-full max-w-[1320px] lg:mb-[150px] lg:mt-[150px]  lg:px-10 xxl:px-0"
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
          {{ 'BUTTON.LOG_IN' | translate }}
        </button>
        <button
          (click)="showLoginModal = false"
          class="button-font button-bg-transparent px-6 py-2"
        >
          {{ 'BUTTON.CLOSE' | translate }}
        </button>
      </div>
    </app-modal>
  `,
})
export class HomePageComponent implements OnInit {
  places: Place[] = [];
  popularPlaces: Place[] = [];
  showLoginModal = false;
  currentTheme$: Observable<Theme>;

  constructor(
    private placesStore: PlacesStoreService,
    private router: Router,
    private themeService: ThemeService,
  ) {
    this.currentTheme$ = this.themeService.theme$;
  }

  ngOnInit() {
    this.placesStore.loadPlaces();

    this.placesStore.places$.subscribe((data) => {
      if (data) {
        this.places = [...data];
        this.popularPlaces = [...data]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 10);
      }
    });
  }

  handleUnauthorizedFavoriteClick() {
    this.showLoginModal = true;
  }

  navigateToAuth() {
    localStorage.setItem('returnUrl', this.router.url);
    this.showLoginModal = false;
    this.router.navigate(['/auth']);
  }
}
