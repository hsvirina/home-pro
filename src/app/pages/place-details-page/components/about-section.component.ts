import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Place } from '../../../models/place.model';
import { FILTER_CATEGORIES } from '../../../models/catalog-filter.config';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-[24px]">
      <h5>About the cafe</h5>

      <span class="body-font-1">{{ place.longDescription }}</span>

      <div class="flex flex-wrap gap-2">
        <div
          *ngFor="let tag of allTags"
          class="rounded-[40px] bg-[var(--color-white)] px-3 py-2 text-center shadow-hover"
        >
          <span class="body-font-1 whitespace-nowrap">{{ tag }}</span>
        </div>
      </div>
    </div>
  `,
})
export class AboutSectionComponent implements OnInit {
  @Input() place!: Place;

  allTags: string[] = [];

  ngOnInit(): void {
    const tags: string[] = [];

    if (this.place?.tags) {
      for (const category of FILTER_CATEGORIES) {
        const matching = category.options
          .filter((opt) => this.place.tags.includes(opt.label))
          .map((opt) => opt.label);

        tags.push(...matching);
      }
    }

    this.allTags = tags;
  }
}
