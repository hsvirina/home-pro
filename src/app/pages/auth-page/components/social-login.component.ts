import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon.component';
import { ICONS } from '../../../core/constants/icons.constant';



import { ThemedIconPipe } from '../../../core/pipes/themed-icon.pipe';
import { Theme } from '../../../core/models/theme.type';
import { Observable } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-social-login',
  standalone: true,
  imports: [CommonModule, IconComponent, ThemedIconPipe, TranslateModule],
  template: `
    <div class="flex flex-col gap-[20px] text-center">
      <!-- Section title -->
      <span class="body-font-1">{{ 'SOCIAL_LOGIN.OR_SIGN_IN_WITH' | translate }}</span>

      <!-- Social login buttons -->
      <div class="flex flex-col gap-[10px] lg:flex-row">
        <!-- Google -->
        <button
          (click)="showTemporaryMessage()"
          class="flex flex-1 items-center justify-center gap-[8px] rounded-[40px] border border-[var(--color-button-green)] px-[24px] py-[12px]"
        >
          <app-icon [icon]="ICONS.Google" />
          <span class="button-font text-[var(--color-button-green)]"
            >{{ 'SOCIAL_LOGIN.GOOGLE' | translate }}</span
          >
        </button>

        <!-- Facebook -->
        <button
          (click)="showTemporaryMessage()"
          class="flex flex-1 items-center justify-center gap-[8px] rounded-[40px] border border-[var(--color-button-blue)] px-[24px] py-[12px]"
        >
          <app-icon [icon]="ICONS.Facebook" />
          <span class="button-font text-[var(--color-button-blue)]"
            >{{ 'SOCIAL_LOGIN.FACEBOOK' | translate }}</span
          >
        </button>

        <!-- Apple -->
        <button
          (click)="showTemporaryMessage()"
          class="flex flex-1 items-center justify-center gap-[8px] rounded-[40px] border px-[24px] py-[12px]"
          [ngClass]="[
              (currentTheme$ | async) === 'light'
                ? 'border-[var(--color-gray-100)]'
                : 'border-[var(--color-gray-20)]',
            ]"
        >
          <app-icon [icon]="'Apple' | themedIcon" />
          <span class="button-font">{{ 'SOCIAL_LOGIN.APPLE' | translate }}</span>
        </button>
      </div>

      <!-- Terms and privacy links -->
      <span class="body-font-1">
        {{ 'SOCIAL_LOGIN.BY_REGISTERING' | translate }}
        <a (click)="goHome()" class="cursor-pointer underline">{{ 'SOCIAL_LOGIN.TERMS_OF_USE' | translate }}</a>
         {{ 'SOCIAL_LOGIN.AND' | translate }}
        <a (click)="goHome()" class="cursor-pointer underline"
          >{{ 'SOCIAL_LOGIN.PRIVACY_POLICY' | translate }}</a
        >
      </span>

      <!-- Temporary message -->
      <div *ngIf="showMessage" class="mt-4 text-[var(--color-primary)]">
        {{ 'SOCIAL_LOGIN.PLEASE_USE_EMAIL' | translate }}
      </div>
    </div>
  `,
})
export class SocialLoginPlaceholderComponent {
  ICONS = ICONS;

  @Input() showMessage = false;

  readonly currentTheme$: Observable<Theme>;


  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;
  }

  showTemporaryMessage() {
    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
    }, 3000);
  }

  goHome() {
    console.log('Navigate to home');
  }
}
