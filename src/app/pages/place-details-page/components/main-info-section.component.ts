import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Place } from '../../../models/place.model';

@Component({
  selector: 'app-main-info-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-5">
      <h3>{{ place.name }}</h3>

      <div
        class="body-font-1 flex flex-col gap-[4px] text-[var(--color-gray-75)]"
      >
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-2">
            <img src="/icons/star.png" alt="Star icon" class="h-6 w-6" />
            <span>{{ place.rating }}</span>
          </div>
          <span>({{ place.reviewCount }})</span>
        </div>

        <div class="flex items-center gap-2">
          <img src="/icons/location.png" alt="Location icon" class="h-9" />
          <a
            [href]="googleMapsUrl"
            target="_blank"
            rel="noopener"
            class="underline"
            style="text-decoration-style: dotted; text-underline-offset: 4px;"
          >
            {{ place.address }}
          </a>
        </div>
      </div>
    </div>
  `,
})
export class MainInfoSectionComponent {
  @Input() place!: Place;
  floor = Math.floor;

  get googleMapsUrl(): string {
    const query = encodeURIComponent(
      `${this.place.address}, ${this.place.city}`,
    );
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }
}
