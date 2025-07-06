import { Component, Input } from '@angular/core';
import { NgStyle, NgClass, NgForOf } from '@angular/common';
import { PlaceCardComponent } from './place-card.component';

@Component({
  selector: 'app-slider-places',
  standalone: true,
  imports: [NgStyle, NgClass, NgForOf, PlaceCardComponent],
  template: `
    <div class="flex flex-col px-[20px] xxl:px-[0px] gap-[24px]">
      <div class="flex w-full items-center justify-between">
        <!-- Левая стрелка: видна на всех, но абсолют только на xxl -->
        <button
          (click)="prev()"
          [disabled]="startIndex === 0"
          class="hidden p-2 focus:outline-none xxl:flex"
          [ngClass]="{
            'cursor-not-allowed opacity-50': startIndex === 0,
            'cursor-pointer': startIndex > 0,
          }"
        >
          <img src="./icons/arrow-left.svg" alt="Prev" class="h-8 w-8" />
        </button>

        <!-- Заголовок: абсолют только на xxl -->
        <h3
          class="text-[24px] text-[var(--color-gray-100)] xxl:absolute xxl:left-1/2 xxl:-translate-x-1/2 xxl:text-[40px]"
        >
          {{ title }}
        </h3>

        <!-- Правая стрелка: штатно на малых, абсолют на xxl -->
        <button
          (click)="next()"
          [disabled]="startIndex >= places.length - visibleCount"
          class="p-2 focus:outline-none"
          [ngClass]="{
            'cursor-not-allowed opacity-50':
              startIndex >= places.length - visibleCount,
            'cursor-pointer': startIndex < places.length - visibleCount,
          }"
        >
          <img src="./icons/arrow-right.svg" alt="Next" class="h-8 w-8" />
        </button>
      </div>

      <div class="w-full overflow-hidden py-[22px] xxl:py-[0px]">
        <div
          class="duration-400 flex gap-5 transition-transform ease-in-out"
          [ngStyle]="{ transform: 'translateX(-' + shift + 'px)' }"
        >
          <app-place-card
            *ngFor="let place of places"
            [place]="place"
            class="flex-shrink-0"
            [ngStyle]="{ width: cardWidth + 'px' }"
          ></app-place-card>
        </div>
      </div>
    </div>
  `,
})
export class SliderPlacesComponent {
  @Input() places: any[] = [];
  @Input() title!: string;

  startIndex = 0;
  visibleCount = 4;
  cardWidth = 315;
  gap = 20;

  get shift(): number {
    return this.startIndex * (this.cardWidth + this.gap);
  }

  prev(): void {
    this.startIndex = Math.max(this.startIndex - 1, 0);
  }

  next(): void {
    this.startIndex = Math.min(
      this.startIndex + 1,
      this.places.length - this.visibleCount,
    );
  }
}
