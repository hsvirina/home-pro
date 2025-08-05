import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
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

interface LocationOption {
  key: string;
  label: string;
}

const DEFAULT_LABEL = 'City';

@Component({
  selector: 'app-city-dropdown',
  standalone: true,
  imports: [CommonModule, IconComponent, TranslateModule],
  animations: [slideDownAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative" (click)="onToggle($event)">
      <div class="flex cursor-pointer items-center gap-1 lg:p-0">
        {{ ('LOCATION.' + (selectedKey?.toUpperCase() || 'CITY')) | translate }}
        <app-icon
          [icon]="ICONS.ChevronDown"
          class="transition-transform duration-300"
          [ngClass]="{ 'rotate-180': opened }"
        />
      </div>

      <div
        *ngIf="opened"
        @slideDownAnimation
        class="absolute left-0 top-full z-50 mt-2 flex w-full origin-top flex-col gap-[12px] rounded-[16px] border p-2"
        [ngClass]="{
          'border-[var(--color-white)] bg-[var(--color-white)]':
            (currentTheme$ | async) === 'light',
          'border-[var(--color-white)] bg-[var(--color-bg-card)]':
            (currentTheme$ | async) === 'dark',
        }"
      >
        <div
          *ngFor="let loc of locationOptions"
          (click)="onSelect(loc.key, $event)"
          class="cursor-pointer rounded-[16px] px-2 py-1 transition-colors duration-300"
          [ngClass]="{
            'hover:bg-[var(--color-bg)]': true,
          }"
        >
          {{ ('LOCATION.' + loc.key.toUpperCase()) | translate }}
        </div>
      </div>
    </div>
  `,
})
export class CityDropdownComponent {
  readonly ICONS = ICONS;
  readonly locationOptions: LocationOption[] =
    FILTER_CATEGORIES.find((c) => c.key === 'location')?.options || [];

  @Input() selectedKey: string | null = null;
  @Input() selectedLabel: string = DEFAULT_LABEL;
  @Input() opened = false;

  @Output() toggle = new EventEmitter<void>();
  @Output() cityChange = new EventEmitter<string>();

  readonly currentTheme$: Observable<Theme>;

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;
  }

  onToggle(event: MouseEvent): void {
    event.stopPropagation();
    this.toggle.emit();
  }

  onSelect(key: string, event: MouseEvent): void {
    event.stopPropagation();
    this.cityChange.emit(key);
  }
}
