import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50  px-[20px]"
    >
      <div
        class="flex w-full max-w-[650px] flex-col items-center justify-between gap-[32px] rounded-[40px] bg-[var(--color-bg-2)] p-[24px] text-center text-[var(--color-gray-100)] shadow-xl"
      >
        <div class="flex flex-col gap-[20px]">
          <h4>Welcome to Beanly!</h4>
          <p *ngIf="isNewUser" class="body-font-1 text-[var(--color-gray-100)]">
            From cozy corners perfect for reading to stylish spots for your
            next coffee date — explore places that feel just right for you.
          </p>
        </div>
        <button
          (click)="close.emit()"
          class="button-font button-bg-blue h-[48px] w-full px-[32px] py-[12px]"
        >
          Explore Catalog
        </button>
      </div>
    </div>
  `,
})
export class WelcomeModalComponent {
  @Input() isNewUser = false;
  @Output() close = new EventEmitter<void>();
}
