import { CommonModule, NgClass, NgForOf, NgStyle } from '@angular/common';
import {
  Component,
  Input,
  HostListener,
  OnInit,
  EventEmitter,
  Output,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { PlaceCardComponent } from './place-card.component';
import { PlaceCardType } from '../../core/constants/place-card-type.enum';
import { IconComponent } from './icon.component';
import { ICONS } from '../../core/constants/icons.constant';
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
    <div #sliderContainer class="flex flex-col items-center gap-[24px] pl-5 lg:px-0">
      <!-- Header with title, subtitle and navigation arrows -->
      <div class="relative mr-5 flex w-full items-center justify-between">
        <!-- Previous button -->
        <button
          (click)="prev()"
          [disabled]="startIndex === 0"
          class="flex p-2 focus:outline-none"
          [ngClass]="{ 'cursor-not-allowed opacity-50': startIndex === 0, 'cursor-pointer': startIndex > 0 }"
          aria-label="Previous slide"
        >
          <app-icon [icon]="'ArrowLeft' | themedIcon" [width]="32" [height]="32" />
        </button>

        <div class="flex flex-col justify-center text-center">
          <h3 *ngIf="title" class="text-[20px] lg:text-[32px] xxl:text-[40px]">{{ title }}</h3>
          <span *ngIf="subtitle" class="body-font-1 mt-2">{{ subtitle }}</span>
        </div>

        <!-- Next button -->
        <button
          (click)="next()"
          [disabled]="startIndex >= places.length - visibleCount"
          class="p-2 focus:outline-none"
          [ngClass]="{ 'cursor-not-allowed opacity-50': startIndex >= places.length - visibleCount, 'cursor-pointer': startIndex < places.length - visibleCount }"
          aria-label="Next slide"
        >
          <app-icon [icon]="'ArrowRight' | themedIcon" [width]="32" [height]="32" />
        </button>
      </div>

      <!-- Slider track -->
      <div
        #sliderTrack
        class="w-full overflow-hidden lg:py-0"
        (touchstart)="onTouchStart($event)"
        (touchmove)="onTouchMove($event)"
        (touchend)="onTouchEnd()"
      >
        <div
          class="flex"
          [ngStyle]="{
            transform: 'translateX(-' + shift + 'px)',
            gap: gap + 'px',
            transition: transitionStyle
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
  // ================== ViewChild ==================
  @ViewChild('sliderContainer') sliderContainer!: ElementRef<HTMLDivElement>;

  // ================== Inputs ==================
  @Input() places: Place[] = [];
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() cardType: PlaceCardType = PlaceCardType.Full;

  // ================== Outputs ==================
  @Output() unauthorizedFavoriteClick = new EventEmitter<void>();

  // ================== Constants ==================
  ICONS = ICONS;
  PlaceCardType = PlaceCardType;
  transitionStyle = 'transform 400ms ease-in-out';

  // ================== State ==================
  startIndex = 0;
  visibleCount = 4;
  cardWidth = 315;
  gap = 20;

  // ================== Swipe State ==================
  private touchStartX = 0;
  private touchEndX = 0;

  // ================== Lifecycle ==================
  ngOnInit(): void {
    this.updateLayout();
  }

  // ================== Computed ==================
  /** Total shift in pixels for slider translation */
  get shift(): number {
    return this.startIndex * (this.cardWidth + this.gap);
  }

  // ================== Host Listeners ==================
  @HostListener('window:resize')
  updateLayout(): void {
    const w = window.innerWidth;

    if (w >= 1440) {
      this.visibleCount = 4;
      this.cardWidth = 315;
      this.gap = 20;
    } else if (w >= 1320) {
      this.visibleCount = 3;
      this.cardWidth = 315;
      this.gap = Math.floor((1320 - 3 * this.cardWidth - 80) / 2);
    } else if (w >= 1024) {
      this.visibleCount = 3;
      this.cardWidth = 301;
      this.gap = Math.floor((w - 3 * this.cardWidth - 80) / 2);
    } else {
      this.cardWidth = 315;
      this.gap = 16;
      const containerWidth = w - 40;
      this.visibleCount = Math.max(1, Math.floor((containerWidth + this.gap) / (this.cardWidth + this.gap)));
    }

    // Prevent startIndex overflow after resize
    const maxStart = Math.max(0, this.places.length - this.visibleCount);
    if (this.startIndex > maxStart) {
      this.startIndex = maxStart;
    }
  }

  // ================== Navigation ==================
  prev(): void {
    this.startIndex = Math.max(this.startIndex - 1, 0);
  }

  next(): void {
    this.startIndex = Math.min(this.startIndex + 1, this.places.length - this.visibleCount);
  }

  // ================== Swipe Handlers ==================
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchMove(event: TouchEvent): void {
    this.touchEndX = event.touches[0].clientX;
  }

  onTouchEnd(): void {
    const delta = this.touchStartX - this.touchEndX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? this.next() : this.prev();
    }
    this.touchStartX = 0;
    this.touchEndX = 0;
  }
}
