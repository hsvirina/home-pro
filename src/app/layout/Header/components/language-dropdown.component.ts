import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { slideDownAnimation } from '../../../../styles/animations/animations';
import { ICONS } from '../../../core/constants/icons.constant';
import { IconComponent } from '../../../shared/components/icon.component';

type Lang = 'ENG' | 'UKR';

@Component({
  selector: 'app-language-dropdown',
  standalone: true,
  imports: [CommonModule, IconComponent],
  animations: [slideDownAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative" (click)="onToggle($event)">
      <div
        class="shadow-hover flex cursor-pointer items-center gap-1 rounded-[8px] bg-[var(--color-white)] p-[8px]"
      >
        {{ selectedLanguage }}
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
          *ngFor="let lang of languages"
          (click)="onSelect(lang, $event)"
          class="cursor-pointer rounded-[8px] hover:bg-[var(--color-bg)]"
        >
          {{ lang }}
        </div>
      </div>
    </div>
  `,
})
export class LanguageDropdownComponent {
  readonly ICONS = ICONS;
  readonly languages: Lang[] = ['ENG', 'UKR'];

  @Input() selectedLanguage: Lang = 'ENG';
  @Input() opened = false;

  @Output() languageChange = new EventEmitter<Lang>();
  @Output() toggle = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onToggle(event: MouseEvent): void {
    event.stopPropagation();
    this.toggle.emit();
  }

  onSelect(lang: Lang, event: MouseEvent): void {
    event.stopPropagation();
    this.languageChange.emit(lang);
    this.close.emit();
  }
}
