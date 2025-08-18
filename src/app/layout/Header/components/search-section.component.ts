import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  switchMap,
  map,
  takeUntil,
  startWith,
} from 'rxjs';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Place } from '../../../core/models/place.model';
import { Theme } from '../../../core/models/theme.type';

import { PlacesService } from '../../../core/services/places.service';
import { ThemeService } from '../../../core/services/theme.service';

import { slideDownAnimation } from '../../../../styles/animations/animations';
import { ICONS } from '../../../core/constants/icons.constant';

import { IconComponent } from '../../../shared/components/icon.component';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';

@Component({
  selector: 'app-search-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IconComponent,
    TranslateModule,
    ClickOutsideDirective,
  ],
  animations: [slideDownAnimation],
  template: `
    <div
      class="relative flex h-12 items-center gap-2 rounded-full border border-[var(--color-gray-20)] px-6 py-3 lg:w-[300px] xxl:w-[500px] xxl:max-w-xl"
      appClickOutside
      (appClickOutside)="onClickOutside()"
    >
      <!-- Search icon depending on theme -->
      <app-icon
        [icon]="
          (currentTheme$ | async) === 'dark'
            ? ICONS.SearchWhite
            : ICONS.SearchDark
        "
      ></app-icon>

      <!-- Search input -->
      <input
        type="text"
        placeholder="{{ 'header.search_section.placeholder' | translate }}"
        class="body-font-1 w-full border-none bg-transparent focus:outline-none"
        [(ngModel)]="searchTerm"
        (click)="$event.stopPropagation()"
        (input)="onSearchChange()"
        autocomplete="off"
        [attr.aria-label]="'header.search_section.aria_label' | translate"
      />

      <!-- Suggestions dropdown -->
      <ul
        *ngIf="
          searchTerm.trim().length > 0 && (filteredPlaces$ | async) as filtered
        "
        [@slideDownAnimation]
        class="absolute left-0 top-full z-50 mt-2 max-h-[600px] w-full overflow-auto rounded-[40px] p-2"
        [ngClass]="{
          'bg-[var(--color-white)]': (currentTheme$ | async) === 'light',
          'border border-[var(--color-white)] bg-[var(--color-bg-card)]':
            (currentTheme$ | async) === 'dark',
        }"
        role="listbox"
      >
        <!-- List of filtered places -->
        <li
          *ngFor="let place of filtered"
          (click)="selectPlace(place)"
          (keydown.enter)="selectPlace(place)"
          (keydown.space)="selectPlace(place)"
          class="flex h-[72px] cursor-pointer items-center gap-3 rounded-[40px] p-2 transition-colors duration-300 hover:bg-[var(--color-bg)]"
          role="option"
          tabindex="0"
        >
          <img
            [src]="place.photoUrls[0]"
            [alt]="place.name"
            class="h-14 w-14 flex-shrink-0 rounded-full object-cover"
            width="56"
            height="56"
            loading="eager"
          />
          <span class="menu-text-font">{{ place.name }}</span>
        </li>

        <!-- No results message -->
        <li
          *ngIf="filtered.length === 0"
          class="p-4 text-gray-500"
          role="alert"
        >
          {{
            'header.search_section.no_results' | translate: { term: searchTerm }
          }}
        </li>
      </ul>
    </div>
  `,
})
export class SearchSectionComponent implements OnDestroy {
  readonly ICONS = ICONS;

  /** Callback to close parent dropdowns */
  @Input() closeDropdowns!: () => void;

  /** Current search input value (ngModel) */
  searchTerm = '';

  /** Reactive search term stream */
  private searchTerm$ = new BehaviorSubject<string>('');

  /** Observable with the current theme */
  readonly currentTheme$: Observable<Theme>;

  /** Observable with filtered places according to search term and current language */
  readonly filteredPlaces$: Observable<Place[]>;

  /** Subject for cleanup on destroy */
  private destroy$ = new Subject<void>();

  constructor(
    private placesService: PlacesService,
    private themeService: ThemeService,
    private translateService: TranslateService,
    private router: Router,
  ) {
    this.currentTheme$ = this.themeService.theme$;

    // Combine search term and language changes to filter places reactively
    this.filteredPlaces$ = combineLatest([
      this.searchTerm$,
      this.translateService.onLangChange.pipe(
        map((event) => event.lang),
        startWith(this.translateService.currentLang),
      ),
    ]).pipe(
      switchMap(([term, lang]) =>
        this.placesService
          .getPlaces(lang)
          .pipe(map((places) => this.filterPlaces(places, term))),
      ),
    );
  }

  /** Update search term and trigger filtering */
  onSearchChange(): void {
    this.searchTerm$.next(this.searchTerm.trim());
  }

  /**
   * Handle selection of a place from the dropdown
   * @param place Selected place
   */
  selectPlace(place: Place): void {
    this.resetSearch();
    this.router.navigate(['/catalog', place.id]).catch(console.error);
    this.closeDropdowns?.();
  }

  /** Reset search when clicking outside the component */
  onClickOutside(): void {
    this.resetSearch();
  }

  /** Clear search input and reactive search term */
  private resetSearch(): void {
    this.searchTerm = '';
    this.searchTerm$.next('');
  }

  /**
   * Filter places based on search term
   * @param places List of places
   * @param term Search term
   * @returns Filtered list (max 5 items)
   */
  private filterPlaces(places: Place[], term: string): Place[] {
    const lowerTerm = term.toLowerCase();

    if (!lowerTerm) return [];

    return places
      .filter(
        (place) =>
          place.name.toLowerCase().includes(lowerTerm) ||
          place.city?.toLowerCase().includes(lowerTerm) ||
          place.address?.toLowerCase().includes(lowerTerm),
      )
      .slice(0, 5);
  }

  /** Cleanup subscriptions on destroy */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
