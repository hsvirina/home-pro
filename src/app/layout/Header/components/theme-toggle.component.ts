import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { IconComponent } from '../../../shared/components/icon.component';
import { ThemedIconPipe } from '../../../core/pipes/themed-icon.pipe';
import { ThemeService } from '../../../core/services/theme.service';
import { Theme } from '../../../core/models/theme.type';
import { ICONS } from '../../../core/constants/icons.constant';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, TranslateModule, IconComponent, ThemedIconPipe],
  template: `
    <div class="flex gap-1 p-1">
      <!-- Light theme button -->
      <button
        class="flex h-10 w-10 items-center justify-center rounded-full"
        [ngClass]="[
          (currentTheme$ | async) === 'light'
            ? 'bg-[var(--color-secondary)]'
            : 'hover:bg-[var(--color-gray-20)]',
        ]"
        (click)="setTheme('light')"
        (mouseenter)="isSunHovered = true"
        (mouseleave)="isSunHovered = false"
        [attr.aria-label]="'theme.light' | translate"
      >
        <app-icon
          [icon]="
            (currentTheme$ | async) === 'dark'
              ? isSunHovered
                ? ICONS.Sun
                : ICONS.SunDarkTheme
              : ('Sun' | themedIcon)
          "
        />
      </button>

      <!-- Dark theme button -->
      <button
        class="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--color-gray-20)]"
        [ngClass]="{
          'bg-[var(--color-gray-20)]': (currentTheme$ | async) === 'dark',
        }"
        (click)="setTheme('dark')"
        [attr.aria-label]="'theme.dark' | translate"
      >
        <app-icon [icon]="ICONS.Moon" />
      </button>
    </div>
  `,
})
export class ThemeToggleComponent {
  readonly ICONS = ICONS;
  readonly currentTheme$: Observable<Theme>;
  isSunHovered = false;

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;
  }

  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }
}
