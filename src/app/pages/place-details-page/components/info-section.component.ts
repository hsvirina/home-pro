import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Place } from '../../../models/place.model';

@Component({
  selector: 'app-info-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h5>Information</h5>
      <div class="tags-container flex flex-wrap gap-2">
        <span
          *ngFor="let tag of place?.tags"
          class="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-800"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  `,
})
export class InfoSectionComponent implements OnInit {
  @Input() place!: Place | null;

  ngOnInit(): void {}
}
