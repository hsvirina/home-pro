import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { slideDownAnimation } from '../../../../styles/animations/animations';
import { ICONS } from '../../../core/constants/icons.constant';
import { IconComponent } from '../../../shared/components/icon.component';
import { ThemeService } from '../../../core/services/theme.service';
import { LanguageService, LangCode } from '../../../core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-language-dropdown',
  standalone: true,
  imports: [CommonModule, IconComponent, TranslateModule],
  animations: [slideDownAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative" (click)="onToggle($event)">
      <div class="flex cursor-pointer items-center gap-1 lg:p-0">
         {{ ('LANGUAGE.' + (((currentLang$ | async) || 'en') | uppercase)) | translate }}
        <app-icon
          [icon]="ICONS.ChevronDown"
          class="transition-transform duration-300"
          [ngClass]="{ 'rotate-180': opened }"
        />
      </div>

      <div
        *ngIf="opened"
        @slideDownAnimation
        class="absolute left-0 top-full z-50 mt-2 flex w-full origin-top flex-col gap-[12px] rounded-[16px] p-2 border"
        [ngClass]="{
          'bg-[var(--color-white)] border-[var(--color-white)]': (currentTheme$ | async) === 'light',
          'bg-[var(--color-bg-card)] border-[var(--color-white)]': (currentTheme$ | async) === 'dark'
        }"
      >
        <div
          *ngFor="let lang of languages"
          (click)="onSelect(lang, $event)"
          class="cursor-pointer rounded-[16px] px-2 py-1 transition-colors duration-300"
          [ngClass]="{
            'hover:bg-[var(--color-bg)]': true,
            'font-semibold': lang === (currentLang$ | async)
          }"
        >
          {{ ('LANGUAGE.' + (lang | uppercase)) | translate }}
        </div>
      </div>
    </div>
  `,
})
export class LanguageDropdownComponent {
  readonly ICONS = ICONS;
  readonly languages: LangCode[] = ['en', 'uk'];

  @Input() opened = false;

  currentLang$: Observable<LangCode>;
  currentTheme$: Observable<'light' | 'dark'>;

  @Output() toggle = new EventEmitter<void>();

  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService,
  ) {
    this.currentLang$ = this.languageService.lang$;
    this.currentTheme$ = this.themeService.theme$; // <-- инициализируем currentTheme$
  }

  onToggle(event: MouseEvent): void {
    event.stopPropagation();
    this.toggle.emit();
  }

  onSelect(lang: LangCode, event: MouseEvent): void {
    event.stopPropagation();
    this.languageService.setLang(lang);
    this.toggle.emit(); // закрываем дропдаун
  }
}
