import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  template: `
    <footer
      class="grid grid-cols-2 gap-x-[16px] gap-y-[40px] bg-[var(--color-secondary)] px-[20px] py-[48px] text-[var(--color-gray-75)] lg:grid-cols-6 lg:px-[40px] xxl:flex xxl:py-[60px]"
    >
      <!-- Logo -->
      <div class="col-span-1">
        <img
          src="./logo.svg"
          alt="logo"
          class="h-[24px] w-[93px] object-contain lg:h-[28px] lg:w-[130px] xxl:h-[32px] xxl:w-[165px]"
        />
      </div>

      <!-- Links -->
      <div
        class="body-font-2 col-span-2 grid grid-cols-2 gap-x-[16px] xxl:mx-auto xxl:flex xxl:gap-[172px]"
      >
        <div class="flex flex-col gap-1">
          <a routerLink="/about" class="py-[8px] hover:underline">About Us</a>
          <a routerLink="/faqs" class="py-[8px] hover:underline">FAQs</a>
          <a routerLink="/contact" class="py-[8px] hover:underline"
            >Contact Us</a
          >
          <a routerLink="/social-media" class="py-[8px] hover:underline"
            >Social Media</a
          >
          <a routerLink="/feedback" class="py-[8px] hover:underline"
            >FeedBack</a
          >
        </div>
        <div class="flex flex-col gap-1">
          <a routerLink="/newsletter" class="py-[8px] hover:underline"
            >Newsletter</a
          >
          <a routerLink="/updates" class="py-[8px] hover:underline">Updates</a>
          <a routerLink="/events" class="py-[8px] hover:underline">Events</a>
          <a routerLink="/blog-posts" class="py-[8px] hover:underline"
            >Blog Posts</a
          >
          <a routerLink="/community" class="py-[8px] hover:underline"
            >Community</a
          >
        </div>
      </div>

      <!-- Subscribe Section -->
      <div
        class="col-span-2 flex flex-col gap-[24px] lg:col-span-3 xxl:ml-auto"
      >
        <div class="flex flex-col gap-[16px]">
          <h5 class="text-[var(--color-gray-100)]">Subscribe</h5>
          <span class="body-font-2">
            Join our newsletter to stay updated on features and releases.
          </span>
        </div>
        <div class="flex flex-col gap-[12px]">
          <form
            #subscribeForm="ngForm"
            (ngSubmit)="onSubmit()"
            class="flex h-[48px] gap-[16px]"
          >
            <input
              [(ngModel)]="email"
              name="email"
              type="email"
              placeholder="Your Email Here"
              required
              email
              #emailInput="ngModel"
              (blur)="onBlur()"
              class="body-font-1 flex-1 border-b border-[var(--color-gray-75)] bg-transparent focus:border-[var(--color-gray-100)] focus:text-[var(--color-gray-100)] focus:outline-none"
            />
            <button
              type="submit"
              [disabled]="subscribeForm.invalid"
              class="flex button-bg-transparent px-[24px] py-[12px] shadow-hover"
              [ngClass]="{ 'cursor-default opacity-50': subscribeForm.invalid }"
            >
              Send
            </button>
          </form>
          <div
            *ngIf="showError"
            class="body-font-2 mt-1 text-[var(--color-primary)]"
          >
            Please enter a valid email address.
          </div>
          <span class="body-font-2">
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates.
          </span>
        </div>
      </div>
    </footer>

    <!-- Modal -->
    <div
      *ngIf="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        class="flex w-full max-w-[650px] flex-col items-center justify-between gap-[32px] rounded-[40px] bg-[var(--color-bg-2)] p-[24px] text-center text-[var(--color-gray-100)] shadow-xl"
      >
        <div class="flex flex-col gap-[20px]">
          <h4>Thank you for subscribing!</h4>
          <p class="body-font-1 text-[var(--color-gray-100)]">
            You have successfully joined our newsletter. Stay tuned for updates
            and exciting features!
          </p>
        </div>
        <button
          (click)="closeModal()"
          class="button-font h-[48px] w-full rounded-[40px] bg-[var(--color-primary)] px-[32px] py-[12px] text-[var(--color-white)]"
        >
          Close
        </button>
      </div>
    </div>
  `,
})
export class FooterComponent {
  email = '';
  showModal = false;
  showError = false;

  onSubmit() {
    if (!this.validateEmail(this.email)) {
      this.showError = true;
      return;
    }
    this.showModal = true;
    this.email = '';
    this.showError = false;
  }

  onBlur() {
    if (this.email && !this.validateEmail(this.email)) {
      this.showError = true;
    } else {
      this.showError = false;
    }
  }

  clearEmail() {
    this.email = '';
    this.showError = false;
  }

  closeModal() {
    this.showModal = false;
  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    return re.test(email.toLowerCase());
  }
}
