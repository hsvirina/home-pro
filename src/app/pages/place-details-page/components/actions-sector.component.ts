import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon.component';
import { ICONS } from '../../../core/constants/icons.constant';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-actions-sector',
  standalone: true,
  imports: [CommonModule, IconComponent, TranslateModule],
  template: `
    <div class="mb-11 flex flex-col items-center gap-4">
      <h5>{{ 'actions.title' | translate }}</h5>
      <span class="body-font-1">
        {{ 'actions.subtitle' | translate }}
      </span>

      <div class="flex w-full flex-col gap-4 lg:w-auto lg:flex-row">
        <!-- Leave Review button: shown only if review form is hidden and user is either not logged in or on mobile -->
        <button
          *ngIf="!showAddReviewForm && (!isLoggedIn || isMobile)"
          (click)="leaveReviewClick.emit()"
          class="button-font button-bg-blue w-full px-6 py-3 lg:w-auto"
        >
          {{ 'actions.leaveReview' | translate }}
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
          <!-- Button text changes based on favorite state -->
          {{
            isFavorite
              ? ('actions.removeFromFavorites' | translate)
              : ('actions.saveToFavorites' | translate)
          }}
        </button>

        <!-- Share button -->
        <button
          (click)="onShare.emit()"
          class="button-font button-bg-transparent flex w-full gap-2 px-6 py-3 lg:w-auto"
        >
          <app-icon [icon]="ICONS.ShareBlue" />
          {{ 'actions.share' | translate }}
        </button>
      </div>
    </div>
  `,
})
export class ActionsSectorComponent {
  /**
   * Constant holding icon definitions for easy use in template
   */
  readonly ICONS = ICONS;

  /**
   * Whether the item/place is currently marked as favorite.
   */
  @Input() isFavorite = false;

  /**
   * Flag to show/hide the add review form.
   */
  @Input() showAddReviewForm = false;

  /**
   * Indicates if the current device is mobile.
   */
  @Input() isMobile = false;

  /**
   * Indicates if the user is currently logged in.
   */
  @Input() isLoggedIn = false;

  /**
   * Event emitted when the "Leave Review" button is clicked.
   */
  @Output() leaveReviewClick = new EventEmitter<void>();

  /**
   * Event emitted when the favorite toggle button is clicked.
   */
  @Output() onToggleFavorite = new EventEmitter<void>();

  /**
   * Event emitted when the share button is clicked.
   */
  @Output() onShare = new EventEmitter<void>();
}
