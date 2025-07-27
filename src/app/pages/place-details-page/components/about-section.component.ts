import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Place } from '../../../core/models/place.model';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-[24px]">
      <h5>About the cafe</h5>

      <!-- Long description of the cafe -->
      <span class="body-font-1">{{ place.longDescription }}</span>

      <!-- Display tags if available -->
      <div class="flex flex-wrap gap-2" *ngIf="place?.tags?.length">
        <div
          *ngFor="let tag of place.tags"
          class="shadow-hover rounded-[40px] bg-[var(--color-white)] px-3 py-2 text-center"
        >
          <span class="body-font-1 whitespace-nowrap">{{ tag }}</span>
        </div>
      </div>
    </div>
  `,
})
export class AboutSectionComponent {
  // Input property to receive place data
  @Input() place!: Place;
}
