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
      <!-- Section title -->
      <span class="body-font-1">Or log in with</span>

      <!-- Social login buttons -->
      <div class="flex gap-[10px]">
        <button
          (click)="showTemporaryMessage()"
          class="flex flex-1 items-center justify-center gap-[8px] rounded-[40px] border border-[var(--color-button-green)] px-[24px] py-[12px]"
        >
          <app-icon [icon]="ICONS.Google" />
          <span class="button-font text-[var(--color-button-green)]">Google</span>
        </button>

        <button
          (click)="showTemporaryMessage()"
          class="flex flex-1 items-center justify-center gap-[8px] rounded-[40px] border border-[var(--color-button-blue)] px-[24px] py-[12px]"
        >
          <app-icon [icon]="ICONS.Facebook" />
          <span class="button-font text-[var(--color-button-blue)]">Facebook</span>
        </button>

        <button
          (click)="showTemporaryMessage()"
          class="flex flex-1 items-center justify-center gap-[8px] rounded-[40px] border border-[var(--color-gray-100)] px-[24px] py-[12px]"
        >
          <app-icon [icon]="ICONS.Apple" />
          <span class="button-font text-[var(--color-gray-100)]">Apple</span>
        </button>
      </div>

      <!-- Terms and privacy links -->
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

      <!-- Temporary message shown when social login is clicked -->
      <div *ngIf="showMessage" class="mt-4 text-[var(--color-primary)]">
        Please use your email
      </div>
    </div>
  `,
})
export class SocialLoginPlaceholderComponent {
  // Icons constant import for easy icon usage in template
  ICONS = ICONS;

  // Input flag to control display of temporary message
  @Input() showMessage = false;

  /**
   * Show a temporary message for 3 seconds
   */
  showTemporaryMessage() {
    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
    }, 3000);
  }

  /**
   * Placeholder for navigation to home page.
   * Replace with router navigation if needed.
   */
  goHome() {
    // Example navigation via Router could be implemented here:
    // this.router.navigate(['/']);
    console.log('Navigate to home');
  }
}
