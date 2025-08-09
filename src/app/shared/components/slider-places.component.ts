import { CommonModule, NgClass, NgForOf, NgStyle } from '@angular/common';
import {
  Component,
  Input,
  HostListener,
  OnInit,
  EventEmitter,
  Output,
} from '@angular/core';
import { PlaceCardComponent } from './place-card.component';
import { PlaceCardType } from '../../core/constants/place-card-type.enum';
import { IconComponent } from './icon.component';
import { IconData, ICONS } from '../../core/constants/icons.constant';
import { ThemeService } from '../../core/services/theme.service';
import { ThemedIconPipe } from '../../core/pipes/themed-icon.pipe';
import { Place } from '../../core/models/place.model';

@Component({
  selector: 'app-slider-places',
  standalone: true,
  imports: [
    CommonModule,
    NgStyle,
    NgClass,
    NgForOf,
    PlaceCardComponent,
    IconComponent,
    ThemedIconPipe,
  ],
  template: `
    <div class="flex flex-col items-center gap-[24px] pl-5 lg:px-0">
      <!-- Slider container with navigation arrows and title -->
      <div class="relative mr-5 flex w-full items-center justify-between">
        <!-- Previous arrow button -->
        <button
          (click)="prev()"
          [disabled]="startIndex === 0"
          class="flex p-2 focus:outline-none"
          [ngClass]="{
            'cursor-not-allowed opacity-50': startIndex === 0,
            'cursor-pointer': startIndex > 0
          }"
          aria-label="Previous slide"
        >
          <app-icon
            [icon]="'ArrowLeft' | themedIcon"
            [width]="32"
            [height]="32"
          />
        </button>

        <!-- Title and subtitle -->
        <div class="flex flex-col justify-center">
          <h3
            *ngIf="title"
            class="text-center text-[20px] lg:text-[32px] xxl:text-[40px]"

          >
            {{ title }}
          </h3>
          <span *ngIf="subtitle" class="body-font-1 mt-2">{{ subtitle }}</span>
        </div>

        <!-- Next arrow button -->
        <button
          (click)="next()"
          [disabled]="startIndex >= places.length - visibleCount"
          class="p-2 focus:outline-none"
          [ngClass]="{
            'cursor-not-allowed opacity-50': startIndex >= places.length - visibleCount,
            'cursor-pointer': startIndex < places.length - visibleCount
          }"
          aria-label="Next slide"
        >
          <app-icon
            [icon]="'ArrowRight' | themedIcon"
            [width]="32"
            [height]="32"
          />
        </button>
      </div>

      <!-- Slider track -->
      <div class="w-full overflow-hidden lg:py-0">
        <div
          class="flex"
          [ngStyle]="{
            transform: 'translateX(-' + shift + 'px)',
            gap: gap + 'px',
            transition: 'transform 400ms ease-in-out'
          }"
        >
          <app-place-card
            *ngFor="let place of places"
            [place]="place"
            [cardType]="cardType"
            class="flex-shrink-0"
            [ngStyle]="{ width: cardWidth + 'px' }"
            (unauthorizedFavoriteClick)="unauthorizedFavoriteClick.emit()"
          />
        </div>
      </div>
    </div>
  `,
})
export class SliderPlacesComponent implements OnInit {
  /** Icon constants for use in template */
  ICONS = ICONS;

  /** Array of places to display */
  @Input() places: Place[] = [];

  /** Optional slider title */
  @Input() title?: string;

  /** Optional slider subtitle */
  @Input() subtitle?: string;

  /** Type of place card displayed */
  @Input() cardType: PlaceCardType = PlaceCardType.Full;

  /** Emits when user clicks favorite on a place but is unauthorized */
  @Output() unauthorizedFavoriteClick = new EventEmitter<void>();

  /** Expose PlaceCardType enum to template */
  PlaceCardType = PlaceCardType;

  /** Current index of the first visible card */
  startIndex = 0;

  /** Number of cards visible at once */
  visibleCount = 4;

  /** Width of each card in pixels */
  cardWidth = 315;

  /** Gap between cards in pixels */
  gap = 20;

  /**
   * Angular lifecycle hook - runs once after component initialization.
   * Sets up initial layout based on window size.
   */
  ngOnInit(): void {
    this.updateLayout();
  }

  /**
   * Host listener for window resize events.
   * Dynamically recalculates slider layout parameters to remain responsive.
   */
  @HostListener('window:resize')
  updateLayout(): void {
    const w = window.innerWidth;

    if (w >= 1440) {
      // Extra large screens (e.g., large desktops)
      this.visibleCount = 4;
      this.cardWidth = 315;
      this.gap = 20;
    } else if (w >= 1320) {
      // Large desktops, fewer cards with custom gap
      this.visibleCount = 3;
      this.cardWidth = 315;
      this.gap = Math.floor((1320 - 3 * this.cardWidth - 80) / 2);
    } else if (w >= 1024) {
      // Medium desktops
      this.visibleCount = 3;
      this.cardWidth = 301;
      this.gap = Math.floor((w - 3 * this.cardWidth - 80) / 2);
    } else {
      // Tablets and mobiles - calculate based on viewport
      this.cardWidth = 315;
      this.gap = 16;
      const containerWidth = w - 2 * 20; // 20px padding on both sides
      this.visibleCount = Math.max(
        1,
        Math.floor((containerWidth + this.gap) / (this.cardWidth + this.gap)),
      );
    }

    // Ensure startIndex is within valid range after resize
    const maxStart = Math.max(0, this.places.length - this.visibleCount);
    if (this.startIndex > maxStart) {
      this.startIndex = maxStart;
    }
  }

  /**
   * Calculates horizontal shift in pixels for slider track based on current startIndex.
   * Used to apply translateX CSS property for slide effect.
   */
  get shift(): number {
    return this.startIndex * (this.cardWidth + this.gap);
  }

  /**
   * Navigate to the previous slide if possible.
   * Decreases startIndex but not below zero.
   */
  prev(): void {
    this.startIndex = Math.max(this.startIndex - 1, 0);
  }

  /**
   * Navigate to the next slide if possible.
   * Increases startIndex but not beyond maximum valid start index.
   */
  next(): void {
    this.startIndex = Math.min(
      this.startIndex + 1,
      this.places.length - this.visibleCount,
    );
  }
}
