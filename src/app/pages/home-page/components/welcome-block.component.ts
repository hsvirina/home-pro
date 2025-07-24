import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-welcome-block',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div
      class="mb-[80px] mt-[36px] grid grid-cols-8 items-center gap-[48px] px-[20px] lg:my-[100px] xxl:my-[150px] xxl:gap-[20px] xxl:px-[0px]"
    >
      <div
        class="col-span-8 flex flex-col gap-[24px] lg:col-span-4 lg:gap-[16px] xxl:max-w-[590px] xxl:gap-[32px]"
      >
        <div class="flex flex-col gap-[16px] lg:gap-[24px] xxl:gap-[32px]">
          <div class="flex flex-col gap-[16px]">
            <h3
              class="text-[24px] text-[var(--color-gray-100)] xxl:text-[40px]"
            >
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
              <span class="body-font-1"
                >Affordable Options for Every Budget</span
              >
            </div>
          </div>
        </div>

        <a [routerLink]="['/catalog']">
          <button
            class="button-bg-transparent shadow-hover menu-text-font hidden h-[48px] w-[182px] lg:flex"
          >
            Go to Catalog
          </button>
        </a>

        <div class="grid h-[48px] grid-cols-2 gap-[16px] lg:hidden">
          <button
            class="menu-text-font col-span-1 button-bg-blue"
            [routerLink]="['/catalog']"
          >
            View
          </button>

          <button
            class="col-span-1 flex h-[48px] shadow-hover button-bg-transparent gap-[8px]"
            [routerLink]="['/catalog']"
          >
            <span class="menu-text-font"
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
