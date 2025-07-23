import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { slideDownAnimation } from '../../../../styles/animations';
import { FILTER_CATEGORIES } from '../../../models/catalog-filter.config';

interface LocationOption {
  key: string;
  label: string;
}

@Component({
  selector: 'app-city-dropdown',
  standalone: true,
  imports: [CommonModule],
  animations: [slideDownAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative" (click)="toggleDropdown($event)">
      <div
        class="shadow-hover flex cursor-pointer items-center gap-1 rounded-[8px] bg-[var(--color-white)] p-[8px]"
      >
        {{ selectedLabel }}
        <img
          src="/icons/chevron-down.svg"
          class="h-6 w-6"
          [class.rotate-180]="opened"
        />
      </div>

      <div
        *ngIf="opened"
        @slideDownAnimation
        class="absolute left-0 top-full z-50 mt-2 flex w-full origin-top flex-col gap-[12px] rounded-[8px] bg-[var(--color-white)] p-2 shadow-lg"
      >
        <div
          *ngFor="let loc of locationOptions"
          (click)="selectCity(loc.key, $event)"
          class="cursor-pointer rounded-[8px] hover:bg-[var(--color-bg)]"
        >
          {{ loc.label }}
        </div>
      </div>
    </div>
  `,
})
export class CityDropdownComponent {
  @Input() selectedKey: string | null = null;
  @Input() selectedLabel: string = 'City';
  @Input() opened = false;

  @Output() toggle = new EventEmitter<void>();
  @Output() cityChange = new EventEmitter<string>();

  locationOptions: LocationOption[] =
    FILTER_CATEGORIES.find((c) => c.key === 'location')?.options || [];

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.toggle.emit();
  }

  selectCity(key: string, event: MouseEvent) {
    event.stopPropagation();
    this.cityChange.emit(key);
  }
}
