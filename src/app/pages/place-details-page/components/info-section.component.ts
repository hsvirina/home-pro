import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Place } from '../../../core/models/place.model';
import { IconComponent } from '../../../shared/components/icon.component';
import { ICONS } from '../../../core/constants/icons.constant';

@Component({
  selector: 'app-info-section',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="flex flex-col gap-[24px]">
      <h5>Information</h5>

      <!-- Show working hours if available -->
      <div class="grid grid-cols-8 gap-[20px]" *ngIf="place?.workingHours">
        <div
          class="shadow-hover col-span-8 flex items-center justify-center gap-[24px] rounded-[40px] bg-[var(--color-bg-2)] px-6 py-3 lg:col-span-2"
        >
          <app-icon [icon]="ICONS.Clock" class="h-[38px] w-[38px]"></app-icon>
          <div class="flex flex-col justify-center gap-1">
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
  ICONS = ICONS;
}
