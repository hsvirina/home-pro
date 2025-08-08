import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { slideDownAnimation } from '../../../../styles/animations/animations';
import { FILTER_CATEGORIES } from '../../../core/constants/catalog-filter.config';
import { IconComponent } from '../../../shared/components/icon.component';
import { ICONS } from '../../../core/constants/icons.constant';
import { ThemeService } from '../../../core/services/theme.service';
import { Observable } from 'rxjs';
import { Theme } from '../../../core/models/theme.type';
import { TranslateModule } from '@ngx-translate/core';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';

interface LocationOption {
  key: string;
  label: string;
}

const DEFAULT_LABEL = 'City';

@Component({
  selector: 'app-city-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    TranslateModule,
    ClickOutsideDirective,
  ],
  animations: [slideDownAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      appClickOutside
      class="relative"
      (click)="onToggle($event)"

      (appClickOutside)="onOutsideClick()"
    >
      <div class="flex cursor-pointer items-center gap-1 lg:p-0">
        <!-- Display selected city label or default -->
        {{ 'LOCATION.' + (selectedKey?.toUpperCase() || 'CITY') | translate }}
        <app-icon
          [icon]="ICONS.ChevronDown"
          class="transition-transform duration-300"
          [ngClass]="{ 'rotate-180': opened }"
        />
      </div>

      <div
        *ngIf="opened"
        @slideDownAnimation
        class="absolute left-0 top-full z-50 mt-2 flex w-full origin-top flex-col gap-3 rounded-lg border p-2"
        [ngClass]="{
          'border-[var(--color-white)] bg-[var(--color-white)]': (currentTheme$ | async) === 'light',
          'border-[var(--color-white)] bg-[var(--color-bg-card)]': (currentTheme$ | async) === 'dark'
        }"
      >
        <div
          *ngFor="let loc of locationOptions"
          (click)="onSelect(loc.key, $event)"
          class="cursor-pointer rounded-lg px-2 py-1 transition-colors duration-300 hover:bg-[var(--color-bg)]"
        >
          {{ 'LOCATION.' + loc.key.toUpperCase() | translate }}
        </div>
      </div>
    </div>
  `,
})
export class CityDropdownComponent {
  /** Icon constants imported for consistent UI */
  readonly ICONS = ICONS;

  /** Dropdown options extracted from filter config */
  readonly locationOptions: LocationOption[] =
    FILTER_CATEGORIES.find((c) => c.key === 'location')?.options || [];

  /** Currently selected city key */
  @Input() selectedKey: string | null = null;

  /** Label fallback, currently unused but can be extended */
  @Input() selectedLabel: string = DEFAULT_LABEL;

  /** Controls dropdown open/close state */
  @Input() opened = false;

  /** Emits when dropdown toggle is requested */
  @Output() toggle = new EventEmitter<void>();

  /** Emits selected city key on selection */
  @Output() cityChange = new EventEmitter<string>();

  /** Observable for current theme to dynamically style dropdown */
  readonly currentTheme$: Observable<Theme>;

  constructor(
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef,
  ) {
    this.currentTheme$ = this.themeService.theme$;
  }

  /**
   * Handles dropdown toggle click event.
   * Stops event propagation and emits toggle event for parent control.
   * @param event Mouse click event
   */
  onToggle(event: MouseEvent): void {
    event.stopPropagation();
    this.toggle.emit();
  }

  /**
   * Handles selection of a location option.
   * Stops event propagation and emits the selected city key.
   * @param key Selected city key string
   * @param event Mouse click event
   */
  onSelect(key: string, event: MouseEvent): void {
    event.stopPropagation();
    this.cityChange.emit(key);
  }

  /**
   * Handles clicks outside the dropdown area.
   * Closes the dropdown locally and triggers change detection manually.
   */
  onOutsideClick(): void {
    this.opened = false;
    this.cdr.markForCheck();
  }
}
