import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Place } from '../../../models/place.model';

@Component({
  selector: 'app-info-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-[24px]">
      <h5>Information</h5>

      <div class="grid grid-cols-8 gap-[20px]" *ngIf="place?.workingHours">
        <div
          class="shadow-hover col-span-2 flex items-center justify-center gap-[24px] rounded-[40px] bg-[var(--color-bg-2)] px-6 py-3"
        >
          <img src="/icons/clock.png" alt="Clock icon h-[38px] w-[38px]" />
          <div class="flex flex-col gap-1 justify-center">
            <span class="menu-text-font">Opening Hours</span>
            <span class="body-font-1">{{ place?.workingHours }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class InfoSectionComponent {
  @Input() place!: Place | null;
}
