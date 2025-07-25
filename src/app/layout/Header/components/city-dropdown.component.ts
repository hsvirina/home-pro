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

interface LocationOption {
  key: string;
  label: string;
}

const DEFAULT_LABEL = 'City';

@Component({
  selector: 'app-city-dropdown',
  standalone: true,
  imports: [CommonModule, IconComponent],
  animations: [slideDownAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative" (click)="onToggle($event)">
      <div
        class="shadow-hover flex cursor-pointer items-center gap-1 rounded-[8px] bg-[var(--color-white)] p-[8px]"
      >
        {{ selectedLabel }}
        <app-icon
          [icon]="ICONS.ChevronDown"
          [ngClass]="{ 'rotate-180': opened }"
        />
      </div>

      <div
        *ngIf="opened"
        @slideDownAnimation
        class="absolute left-0 top-full z-50 mt-2 flex w-full origin-top flex-col gap-[12px] rounded-[8px] bg-[var(--color-white)] p-2 shadow-lg"
      >
        <div
          *ngFor="let loc of locationOptions"
          (click)="onSelect(loc.key, $event)"
          class="cursor-pointer rounded-[8px] hover:bg-[var(--color-bg)]"
        >
          {{ loc.label }}
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

  onToggle(event: MouseEvent): void {
    event.stopPropagation();
    this.toggle.emit();
  }

  onSelect(key: string, event: MouseEvent): void {
    event.stopPropagation();
    this.cityChange.emit(key);
  }
}
