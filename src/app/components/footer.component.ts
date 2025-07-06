import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer
      class="grid grid-cols-2 gap-x-[16px] gap-y-[40px] bg-[var(--color-secondary)] px-[20px] py-[48px] text-[var(--color-gray-75)]
              xxl:flex xxl:py-[60px]"
    >
      <!-- Logo -->
      <div class="col-span-2">
        <img src="./logo.svg" alt="logo" class="h-[32px] w-[165px]" />
      </div>

      <!-- Links -->
      <div class="body-font-2 col-span-2 grid grid-cols-2 gap-x-[16px] xxl:flex xxl:gap-[172px] xxl:mx-auto">
        <!-- Первый столбец ссылок -->
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

        <!-- Второй столбец ссылок -->
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
      <div class="col-span-2 flex flex-col gap-[24px] xxl:ml-auto">
        <div class="flex flex-col gap-[16px]">
          <h5 class="text-[var(--color-gray-100)]">Subscribe</h5>
          <span class="body-font-2">
            Join our newsletter to stay updated on features and releases.
          </span>
        </div>
        <div class="flex flex-col gap-[12px]">
          <form class="flex h-[48px] gap-[16px]">
            <input
              type="email"
              placeholder="Your Email Here"
              required
              class="body-font-1 flex-1 border-b border-[var(--color-gray-75)] bg-transparent focus:border-[var(--color-primary)] focus:outline-none"
            />
            <button
              type="submit"
              class="flex items-center justify-center rounded-full border border-[var(--color-primary)] px-[24px] py-[12px] text-[var(--color-primary)]"
            >
              Send
            </button>
          </form>
          <span class="body-font-2">
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates.
          </span>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
