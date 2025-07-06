import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgForOf } from '@angular/common';
import { Place } from '../models/place.model';

@Component({
  selector: 'app-place-card',
  standalone: true,
  imports: [RouterLink, NgForOf],
  template: `
    <a
      [routerLink]="['/catalog', place.id]"
      class="block rounded-[40px] h-[552px] bg-[var(--color-white)] no-underline overflow-hidden"
    >
      <img
        [src]="place.photoUrls[0]"
        alt="Place Image"
        class="w-full h-[222px] object-cover rounded-t-[40px]"
      />

      <div class="flex flex-col gap-[16px] p-[16px]">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <h5 class="text-[var(--color-gray-100)]">{{ place.name }}</h5>
          <div class="flex items-center gap-[4px] justify-between">
            <span class="text-[var(--color-gray-75)] body-font-1">{{ place.rating }}</span>
            <img
              src="./icons/star.png"
              alt="Star"
              class="w-4 h-4 object-contain"
            />
          </div>
        </div>

        <!-- Short Description -->
        <p class="text-[var(--color-gray-100)] body-font-1">
          {{ place.shortDescription }}
        </p>

        <div class="h-px bg-[var(--color-gray-20)] w-full"></div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2">
          <span
            *ngFor="let tag of place.tags"
            class="whitespace-nowrap text-[var(--color-gray-100)] bg-[var(--color-gray-10)] py-[8px] px-[12px] rounded-[40px] body-font-2"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between h-[32px]">
          <div class="flex items-center gap-[4px]">
            <img
              src="./icons/location.png"
              alt="Location"
              class="h-6 object-contain"
            />
            <span class="text-[var(--color-gray-100)] body-font-1">{{ place.address }}</span>
          </div>
          <img
            src="./icons/arrow_down_right.svg"
            alt="Go"
            class="w-8 h-8 object-contain"
          />
        </div>
      </div>
    </a>
  `
})
export class PlaceCardComponent {
  @Input() place!: Place;
}
