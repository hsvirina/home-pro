import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Place } from '../../../models/place.model';

@Component({
  selector: 'app-main-info-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-5">
      <h3 class="text-3xl font-semibold">{{ place.name }}</h3>
      <div class="flex items-center gap-2 text-gray-600">
        <ng-container *ngFor="let _ of createArray(floor(place.rating))">
          <img src="./icons/star.png" alt="star" class="h-5 w-5" />
        </ng-container>
        <span class="text-base">{{ place.rating }} ({{ place.reviewCount }})</span>
      </div>
      <div class="flex items-center gap-2 text-gray-600">
        <img src="./icons/location.png" alt="location" class="h-6 w-6" />
        <a
          [href]="googleMapsUrl"
          target="_blank"
          rel="noopener"
          class="underline"
        >
          {{ place.address }}
        </a>
      </div>
    </div>
  `
})
export class MainInfoSectionComponent {
  @Input() place!: Place;
  floor = Math.floor;

  get googleMapsUrl(): string {
    const query = encodeURIComponent(`${this.place.address}, ${this.place.city}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  createArray(n: number): number[] {
    return Array(n).fill(0);
  }
}
