import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon.component';
import { ICONS } from '../../../core/constants/icons.constant';

@Component({
  selector: 'app-social-login',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="flex flex-col gap-[20px] text-center">
      <span class="body-font-1">Or log in with</span>
      <div class="flex gap-[10px]">
        <button
          (click)="showTemporaryMessage()"
          class="flex flex-1 items-center justify-center gap-[8px] rounded-[40px] border border-[var(--color-button-green)] px-[24px] py-[12px]"
        >
          <app-icon [icon]="ICONS.Google" />
          <span class="button-font text-[var(--color-button-green)]"
            >Google</span
          >
        </button>
        <button
          (click)="showTemporaryMessage()"
          class="flex flex-1 items-center justify-center gap-[8px] rounded-[40px] border border-[var(--color-button-blue)] px-[24px] py-[12px]"
        >
          <app-icon [icon]="ICONS.Facebook" />
          <span class="button-font text-[var(--color-button-blue)]"
            >Facebook</span
          >
        </button>
        <button
          (click)="showTemporaryMessage()"
          class="flex flex-1 items-center justify-center gap-[8px] rounded-[40px] border border-[var(--color-gray-100)] px-[24px] py-[12px]"
        >
          <app-icon [icon]="ICONS.Apple" />
          <span class="button-font text-[var(--color-gray-100)]">Apple</span>
        </button>
      </div>

      <span class="body-font-1">
        By registering, you accept our
        <a
          (click)="goHome()"
          class="cursor-pointer text-[var(--color-primary)] underline"
          >Terms of use</a
        >
        and
        <a
          (click)="goHome()"
          class="cursor-pointer text-[var(--color-primary)] underline"
          >Privacy Policy</a
        >
      </span>

      <div *ngIf="showMessage" class="mt-4 text-[var(--color-primary)]">
        Please use your email
      </div>
    </div>
  `,
})
export class SocialLoginPlaceholderComponent {
  ICONS = ICONS;
  @Input() showMessage = false;

  showTemporaryMessage() {
    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
    }, 3000);
  }

  goHome() {
    // Здесь реализуй переход на домашнюю страницу,
    // например через Router, если нужен навигатор:
    // this.router.navigate(['/']);
    console.log('Navigate to home');
  }
}
