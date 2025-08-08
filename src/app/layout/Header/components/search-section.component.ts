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
        placeholder="{{ 'SEARCH_SECTION.PLACEHOLDER' | translate }}"
        class="body-font-1 w-full border-none bg-transparent focus:outline-none"
        [(ngModel)]="searchTerm"
        (click)="$event.stopPropagation()"
        (input)="onSearchChange()"
        autocomplete="off"
        [attr.aria-label]="'SEARCH_SECTION.ARIA_LABEL' | translate"
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
          {{ 'SEARCH_SECTION.NO_RESULTS' | translate: { term: searchTerm } }}
        </li>
      </ul>
    </div>
  `,
})
export class SearchSectionComponent implements OnDestroy {
  readonly ICONS = ICONS;

  @Input() closeDropdowns!: () => void;

  /** Текущий ввод в поиске */
  private searchTerm$ = new BehaviorSubject<string>('');

  /** Observable с текущей темой */
  readonly currentTheme$: Observable<Theme>;

  /** Observable с отфильтрованными местами */
  readonly filteredPlaces$: Observable<Place[]>;

  /** Для отписки от всех потоков */
  private destroy$ = new Subject<void>();

  /** Используется в input через ngModel */
  searchTerm = '';

  constructor(
    private placesService: PlacesService,
    private themeService: ThemeService,
    private translateService: TranslateService,
    private router: Router,
  ) {
    this.currentTheme$ = this.themeService.theme$;

    this.filteredPlaces$ = combineLatest([
      this.searchTerm$,
      this.translateService.onLangChange.pipe(
        map((event) => event.lang),
        startWith(this.translateService.currentLang), // начальное значение
      ),
    ]).pipe(
      switchMap(([term, lang]) =>
        this.placesService
          .getPlaces(lang)
          .pipe(map((places) => this.filterPlaces(places, term))),
      ),
    );
  }

  /**
   * Обновляем строку поиска и реактивно фильтруем
   */
  onSearchChange(): void {
    this.searchTerm$.next(this.searchTerm.trim());
  }

  /**
   * Обработка выбора места
   */
  selectPlace(place: Place): void {
    this.resetSearch();
    this.router.navigate(['/catalog', place.id]).catch(console.error);
  }

  /**
   * Обработка клика вне компонента
   */
  onClickOutside(): void {
    this.resetSearch();
  }

  private resetSearch(): void {
    this.searchTerm = '';
    this.searchTerm$.next('');
  }

  private filterPlaces(places: Place[], term: string): Place[] {
    const lowerTerm = term.toLowerCase();

    return !lowerTerm
      ? []
      : places
          .filter(
            (place) =>
              place.name.toLowerCase().includes(lowerTerm) ||
              place.city?.toLowerCase().includes(lowerTerm) ||
              place.address?.toLowerCase().includes(lowerTerm),
          )
          .slice(0, 5);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
