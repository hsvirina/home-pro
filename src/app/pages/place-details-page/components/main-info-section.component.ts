import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Place } from '../../../core/models/place.model';
import { IconComponent } from '../../../shared/components/icon.component';
import { ICONS } from '../../../core/constants/icons.constant';

@Component({
  selector: 'app-main-info-section',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="flex flex-col gap-5">
      <h3>{{ place.name }}</h3>

      <div class="body-font-1 flex flex-col gap-[4px] text-[var(--color-gray-75)]">
        <!-- Rating and number of reviews -->
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-2">
            <app-icon [icon]="ICONS.Star" />
            <span>{{ place.rating }}</span>
          </div>
          <span>({{ place.reviewCount }})</span>
        </div>

        <!-- Address with Google Maps link -->
        <div class="flex items-center gap-2">
          <app-icon [icon]="ICONS.Location" [size]="36" />
          <a
            [href]="googleMapsUrl"
            target="_blank"
            rel="noopener noreferrer"
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

  ICONS = ICONS;

  /**
   * Generates a Google Maps search URL based on place address and city.
   */
  get googleMapsUrl(): string {
    const query = encodeURIComponent(`${this.place.address}, ${this.place.city}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }
}
