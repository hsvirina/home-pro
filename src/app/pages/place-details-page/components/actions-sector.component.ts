import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon.component';
import { ICONS } from '../../../core/constants/icons.constant';

@Component({
  selector: 'app-actions-sector',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="mb-11 flex flex-col items-center gap-4">
      <h5>Like Larks & Owls?</h5>
      <span class="body-font-1">
        Help other coffee lovers discover this place by sharing your experience!
      </span>

      <div class="flex flex-col gap-4 lg:flex-row">
        <!-- Favorite toggle button -->
        <button
          (click)="onToggleFavorite.emit()"
          [ngClass]="{
            'button-bg-blue': isFavorite,
            'button-bg-transparent shadow-hover': !isFavorite,
          }"
          class="button-font flex items-center gap-2 rounded-[40px] px-6 py-3"
        >
          <ng-container *ngIf="isFavorite; else blueHeart">
            <app-icon [icon]="ICONS.Heart" />
          </ng-container>
          <ng-template #blueHeart>
            <app-icon [icon]="ICONS.HeartBlue" />
          </ng-template>
          {{ isFavorite ? 'Remove from Favorites' : 'Save to Favorites' }}
        </button>

        <!-- Share button -->
        <button
          (click)="onShare.emit()"
          class="button-font button-bg-transparent shadow-hover flex gap-2 px-6 py-3"
        >
          <app-icon [icon]="ICONS.ShareBlue" />
          Share this Place
        </button>

        <!-- Mobile-only review button -->
        <button
          *ngIf="isMobile && !showAddReviewForm"
          (click)="leaveReviewClick.emit()"
          class="button-font button-bg-blue px-6 py-3"
        >
          Leave a Review
        </button>
      </div>
    </div>
  `,
})
export class ActionsSectorComponent {
  ICONS = ICONS;

  @Input() isFavorite = false; // Whether place is favorited
  @Input() showAddReviewForm = false; // Controls visibility of review form
  @Input() isMobile = false; // Flag for mobile view

  @Output() leaveReviewClick = new EventEmitter<void>(); // Emits when review button clicked
  @Output() onToggleFavorite = new EventEmitter<void>(); // Emits favorite toggle action
  @Output() onShare = new EventEmitter<void>(); // Emits share action
}
