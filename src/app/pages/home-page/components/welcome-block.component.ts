import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome-block',
  standalone: true,
  template: `
    <div
      class="mb-[80px] mt-[36px] grid grid-cols-8 items-center gap-[48px] px-[20px] lg:my-[100px] xxl:my-[150px] xxl:gap-[20px] xxl:px-[0px]"
    >
      <div
        class="col-span-8 flex flex-col gap-[24px] lg:col-span-4 xxl:max-w-[590px] xxl:gap-[32px]"
      >
        <div class="flex flex-col gap-[16px]">
          <h3 class="text-[24px] text-[var(--color-gray-100)] xxl:text-[40px]">
            Explore
            <span class="text-[var(--color-primary)]">the best</span> cafés in
            your area
          </h3>
          <span class="body-font-1">
            Find your perfect café with just a few clicks. Browse through our
            curated list and discover your new favorite spot.
          </span>
        </div>

        <div class="flex items-center gap-[20px] py-[8px]">
          <div class="flex max-w-[168px] flex-col gap-[8px]">
            <h5>80%</h5>
            <span class="body-font-1"
              >Cozy, Instagrammable, and Perfect for Work</span
            >
          </div>
          <div class="flex max-w-[168px] flex-col gap-[8px]">
            <h5>30%</h5>
            <span class="body-font-1">Affordable Options for Every Budget</span>
          </div>
        </div>

        <div class="grid h-[48px] grid-cols-2 gap-[16px] lg:hidden">
          <button
            class="menu-text-font col-span-1 rounded-[40px] border border-[var(--color-primary)] text-[var(--color-primary)]"
          >
            View
          </button>

          <button
            class="col-span-1 flex h-[48px] items-center justify-center gap-[8px]"
          >
            <span class="menu-text-font text-[var(--color-primary)]"
              >Details</span
            >
            <img
              src="/icons/arrow_down_right_primary.svg"
              alt="Icon arrow down right"
              class="h-[32px] w-[32px]"
            />
          </button>
        </div>
      </div>

      <div
        class="col-span-8 max-h-[500px] overflow-hidden rounded-[40px] lg:col-span-4"
      >
        <img
          src="./placeholder-image.jpg"
          alt="Placeholder Image"
          class="h-auto w-full object-cover"
        />
      </div>
    </div>
  `,
})
export class WelcomeBlockComponent {}
