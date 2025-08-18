import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { slideDownAnimation } from '../../../../styles/animations/animations';
import { ICONS } from '../../../core/constants/icons.constant';
import { IconComponent } from '../../../shared/components/icon.component';
import { ThemeService } from '../../../core/services/theme.service';
import { LanguageService, LangCode } from '../../../core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';

@Component({
  selector: 'app-language-dropdown',
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
        <!-- Display current language label -->
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
        class="absolute left-0 top-full z-50 mt-2 flex w-auto origin-top flex-col gap-3 rounded-lg p-2 border"
        [ngClass]="{
          'bg-[var(--color-white)] border-[var(--color-white)]': (currentTheme$ | async) === 'light',
          'bg-[var(--color-bg-card)] border-[var(--color-white)]': (currentTheme$ | async) === 'dark'
        }"
      >
        <div
          *ngFor="let lang of languages"
          (click)="onSelect(lang, $event)"
          class="cursor-pointer rounded-lg px-2 py-1 transition-colors duration-300 hover:bg-[var(--color-bg)]"
          [ngClass]="{ 'font-semibold': lang === (currentLang$ | async) }"
        >
          {{ ('LANGUAGE.' + (lang | uppercase)) | translate }}
        </div>
      </div>
    </div>
  `,
})
export class LanguageDropdownComponent {
  /** Icon constants for UI consistency */
  readonly ICONS = ICONS;

  /** Supported language codes */
  readonly languages: LangCode[] = ['en', 'uk'];

  /** Controls dropdown open/close state */
  @Input() opened = false;

  /** Observable current language */
  currentLang$: Observable<LangCode>;

  /** Observable current theme */
  currentTheme$: Observable<'light' | 'dark'>;

  /** Emits toggle events */
  @Output() toggle = new EventEmitter<void>();

  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService,
    private cdr: ChangeDetectorRef,
  ) {
    this.currentLang$ = this.languageService.lang$;
    this.currentTheme$ = this.themeService.theme$;
  }

  /**
   * Toggles dropdown open state
   * @param event Mouse click event
   */
  onToggle(event: MouseEvent): void {
    event.stopPropagation();
    this.toggle.emit();
  }

  /**
   * Handles language selection
   * Updates language service and closes dropdown
   * @param lang Selected language code
   * @param event Mouse click event
   */
  onSelect(lang: LangCode, event: MouseEvent): void {
    event.stopPropagation();
    this.languageService.setLang(lang);
    this.toggle.emit(); // Close dropdown after selection
  }

  /**
   * Handles click outside the component to close dropdown
   */
  onOutsideClick(): void {
    this.opened = false;
    this.cdr.markForCheck();
  }
}
