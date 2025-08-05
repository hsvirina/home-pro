import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Place } from '../../../core/models/place.model';
import { PlacesService } from '../../../core/services/places.service';
import { slideDownAnimation } from '../../../../styles/animations/animations';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { ICONS } from '../../../core/constants/icons.constant';
import { IconComponent } from '../../../shared/components/icon.component';
import { ThemeService } from '../../../core/services/theme.service';
import { Observable } from 'rxjs';
import { Theme } from '../../../core/models/theme.type';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ClickOutsideDirective,
    IconComponent,
    TranslateModule,
  ],
  animations: [slideDownAnimation],
  template: `
    <div
      class="relative flex h-12 items-center gap-2 rounded-full border border-[var(--color-gray-20)] px-6 py-3 lg:w-[300px] xxl:w-[500px] xxl:max-w-xl"
      appClickOutside
      (appClickOutside)="onClickOutside()"
    >
      <app-icon
        [icon]="
          (currentTheme$ | async) === 'dark'
            ? ICONS.SearchWhite
            : ICONS.SearchDark
        "
      />
      <input
        type="text"
        placeholder="{{ 'SEARCH_SECTION.PLACEHOLDER' | translate }}"
        class="body-font-1 w-full border-none bg-transparent focus:outline-none"
        [(ngModel)]="searchTerm"
        (input)="onSearchChange()"
        (focus)="onSearchChange()"
        autocomplete="off"
        [attr.aria-label]="'SEARCH_SECTION.ARIA_LABEL' | translate"
      />

      <!-- Suggestions dropdown -->
      <ul
        *ngIf="searchTerm.trim().length > 0"
        [@slideDownAnimation]
        class="absolute left-0 top-full z-50 mt-2 max-h-[600px] w-full overflow-auto rounded-[40px] p-2"
        [ngClass]="{
          'bg-[var(--color-white)]': (currentTheme$ | async) === 'light',
          'border border-[var(--color-white)] bg-[var(--color-bg-card)]':
            (currentTheme$ | async) === 'dark',
        }"
        role="listbox"
      >
        <li
          *ngFor="let place of filteredPlaces"
          (click)="selectPlace(place)"
          class="flex h-[72px] cursor-pointer items-center gap-3 rounded-[40px] p-2 transition-colors duration-300"
          [ngClass]="{
            'hover:bg-[var(--color-bg)]': true,
          }"
          role="option"
          tabindex="0"
          (keydown.enter)="selectPlace(place)"
          (keydown.space)="selectPlace(place)"
        >
          <img
            [src]="place.photoUrls[0]"
            alt="{{ place.name }}"
            class="h-14 w-14 flex-shrink-0 rounded-full object-cover"
            loading="eager"
            width="56"
            height="56"
          />
          <span class="menu-text-font">{{ place.name }}</span>
        </li>

        <!-- NO RESULTS MESSAGE -->
        <li
          *ngIf="filteredPlaces.length === 0"
          class="p-4 text-gray-500"
          role="alert"
        >
          {{ 'SEARCH_SECTION.NO_RESULTS' | translate: { term: searchTerm } }}
        </li>
      </ul>
    </div>
  `,
})
export class SearchSectionComponent {
  readonly ICONS = ICONS;

  searchTerm = '';
  allPlaces: Place[] = [];
  filteredPlaces: Place[] = [];

  readonly currentTheme$: Observable<Theme>;

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private themeService: ThemeService,
  ) {
    this.currentTheme$ = this.themeService.theme$;

    this.placesService.getPlaces().subscribe({
      next: (places) => {
        this.allPlaces = places;
      },
      error: (err) => {
        console.error('Error loading places:', err);
      },
    });
  }

  onSearchChange(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredPlaces = term.length
      ? this.allPlaces
          .filter(
            (place) =>
              place.name.toLowerCase().includes(term) ||
              place.city?.toLowerCase().includes(term) ||
              place.address?.toLowerCase().includes(term),
          )
          .slice(0, 5)
      : [];
  }

  selectPlace(place: Place): void {
    this.searchTerm = '';
    this.router.navigate(['/catalog', place.id]).catch((err) => {
      console.error('Navigation error:', err);
    });
  }

  onClickOutside(): void {
    this.searchTerm = '';
  }
}
