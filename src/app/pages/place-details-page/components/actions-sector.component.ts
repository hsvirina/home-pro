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

      <div class="flex w-full lg:w-auto flex-col gap-4 lg:flex-row">
        <!-- Leave Review button -->
<button
  *ngIf="!showAddReviewForm && (!isLoggedIn || isMobile)"
  (click)="leaveReviewClick.emit()"
  class="button-font button-bg-blue w-full px-6 py-3 lg:w-auto"
>
  Leave a Review
</button>

        <!-- Favorite toggle button -->
        <button
          (click)="onToggleFavorite.emit()"

          class="button-bg-transparent button-font flex w-full items-center gap-2 rounded-[40px] px-6 py-3 lg:w-auto"
        >
          <ng-container *ngIf="isFavorite; else blueHeart">
            <app-icon [icon]="ICONS.HeartBlueFill" />
          </ng-container>
          <ng-template #blueHeart>
            <app-icon [icon]="ICONS.HeartBlue" />
          </ng-template>
          {{ isFavorite ? 'Remove from Favorites' : 'Save to Favorites' }}
        </button>

        <!-- Share button -->
        <button
          (click)="onShare.emit()"
          class="button-font button-bg-transparent flex w-full gap-2 px-6 py-3 lg:w-auto"
        >
          <app-icon [icon]="ICONS.ShareBlue" />
          Share this Place
        </button>
      </div>
    </div>
  `,
})
export class ActionsSectorComponent {
  // Icons used in the component
  ICONS = ICONS;

  // Inputs controlling component behavior
  @Input() isFavorite = false; // Whether the place is favorited
  @Input() showAddReviewForm = false; // Controls visibility of review form
  @Input() isMobile = false; // Indicates if the view is on mobile
  @Input() isLoggedIn = false; // Indicates if user is logged in

  // Output events to notify parent component about user actions
  @Output() leaveReviewClick = new EventEmitter<void>(); // Emitted when the review button is clicked
  @Output() onToggleFavorite = new EventEmitter<void>(); // Emitted when favorite toggle button is clicked
  @Output() onShare = new EventEmitter<void>(); // Emitted when share button is clicked
}
