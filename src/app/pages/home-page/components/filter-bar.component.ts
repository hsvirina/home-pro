import { Component } from '@angular/core';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  template: `
    <div
      class="px-[20px] mb-[80px] mt-[64px] grid grid-cols-4 gap-[16px] lg:gap-[20px] xxl:gap-[24px] lg:flex lg:h-[72px] xxl:mb-[150px] xxl:h-[84px] xxl:max-w-[896px] xxl:grid-cols-none"
    >
      <button
        class=" col-span-2 flex h-[48px] w-full items-center justify-center rounded-[40px] border border-[var(--color-primary)] text-[var(--color-primary)] lg:hidden"
        type="button"
      >
        Filters
      </button>

      <div class="hidden h-[100%] gap-[24px] lg:flex">
        <div
          class="flex w-[688px] items-center justify-between gap-[4px] rounded-[40px] border border-[var(--color-gray-20)] lg:h-[72px] xxl:h-[84px]"
        >
          <div
            class="flex h-full flex-1 cursor-pointer flex-col items-center justify-center gap-[4px]  whitespace-nowrap rounded-[40px] text-center hover:bg-[var(--color-white)]"
          >
            <span class="menu-text-font text-[var(--color-gray-100)]"
              >Location</span
            >
            <span class="body-font-1 text-[var(--color-gray-75)]"
              >Look for options</span
            >
          </div>
          <div
            class="flex h-full flex-1 cursor-pointer flex-col items-center justify-center gap-[4px] whitespace-nowrap rounded-[40px] text-center hover:bg-[var(--color-white)]"
          >
            <span class="menu-text-font text-[var(--color-gray-100)]"
              >Purpose</span
            >
            <span class="body-font-1 text-[var(--color-gray-75)]"
              >Visit goal</span
            >
          </div>
          <div
            class="flex h-full flex-1 cursor-pointer flex-col items-center justify-center gap-[4px] whitespace-nowrap rounded-[40px] text-center hover:bg-[var(--color-white)]"
          >
            <span class="menu-text-font text-[var(--color-gray-100)]"
              >Amenities</span
            >
            <span class="body-font-1 text-[var(--color-gray-75)]"
              >Bonus comfort</span
            >
          </div>
          <div
            class="flex h-full flex-1 cursor-pointer flex-col items-center justify-center gap-[4px] whitespace-nowrap rounded-[40px] text-center hover:bg-[var(--color-white)]"
          >
            <span class="menu-text-font text-[var(--color-gray-100)]"
              >Style / Vibe</span
            >
            <span class="body-font-1 text-[var(--color-gray-75)]"
              >Design feel</span
            >
          </div>
        </div>
      </div>

      <button
        class="col-span-2 flex h-[48px] w-full items-center justify-center gap-3 rounded-[40px] bg-[var(--color-primary)] lg:w-[168px] text-[var(--color-white)] lg:h-[72px] xxl:h-[84px] xxl:w-[184px]"
        type="button"
      >
        <img
          src="./icons/search-white.svg"
          alt="search-button"
          class="h-[24px] w-[24px]"
        />
        <span class="button-font">Search</span>
      </button>
    </div>
  `,
})
export class FilterBarComponent {}
