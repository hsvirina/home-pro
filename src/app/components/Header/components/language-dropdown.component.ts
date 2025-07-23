import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { slideDownAnimation } from '../../../../styles/animations';

@Component({
  selector: 'app-language-dropdown',
  standalone: true,
  imports: [CommonModule],
  animations: [slideDownAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative" (click)="toggleDropdown($event)">
      <div
        class="shadow-hover flex cursor-pointer items-center gap-1 rounded-[8px] bg-[var(--color-white)] p-[8px]"
      >
        {{ selectedLanguage }}
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
          (click)="selectLanguage('ENG', $event)"
          class="cursor-pointer rounded-[8px] hover:bg-[var(--color-bg)]"
        >
          ENG
        </div>
        <div
          (click)="selectLanguage('UKR', $event)"
          class="cursor-pointer rounded-[8px] hover:bg-[var(--color-bg)]"
        >
          UKR
        </div>
      </div>
    </div>
  `,
})
export class LanguageDropdownComponent {
  @Input() selectedLanguage: 'ENG' | 'UKR' = 'ENG';
  @Input() opened = false;

  @Output() languageChange = new EventEmitter<'ENG' | 'UKR'>();
  @Output() toggle = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>(); // 👈 новый output

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.toggle.emit();
  }

  selectLanguage(lang: 'ENG' | 'UKR', event: MouseEvent) {
    event.stopPropagation();
    this.languageChange.emit(lang);
    this.close.emit(); // 👈 закрыть дропдаун после выбора
  }
}

