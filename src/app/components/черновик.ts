import { Component, Input, HostListener, OnInit } from '@angular/core';
import { NgStyle, NgClass, NgForOf } from '@angular/common';
import { PlaceCardComponent } from './place-card.component';

@Component({
  selector: 'app-slider-places',
  standalone: true,
  imports: [NgStyle, NgClass, NgForOf, PlaceCardComponent],
  template: `
    <div class="flex flex-col gap-[24px] px-[20px] xxl:px-0">
    <!-- <div class="flex flex-col gap-[24px] px-0 lg:px-[20px] xxl:px-0"> -->
      <div class="flex w-full items-center justify-between">
        <button
          (click)="prev()"
          [disabled]="startIndex === 0"
          class="hidden p-2 focus:outline-none lg:flex"
          [ngClass]="{
            'cursor-not-allowed opacity-50': startIndex === 0,
            'cursor-pointer': startIndex > 0,
          }"
        >
          <img src="./icons/arrow-left.svg" alt="Prev" class="h-8 w-8" />
        </button>

        <h3
          class="text-[24px] text-[var(--color-gray-100)] lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:text-[32px] xxl:text-[40px]"
        >
          {{ title }}
        </h3>

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

      <div class="w-full overflow-hidden py-[22px] xxl:py-0">
        <div
          class="duration-400 flex transition-transform ease-in-out"
          [ngStyle]="{
            transform: 'translateX(-' + shift + 'px)',
            gap: gap + 'px',
          }"
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
export class SliderPlacesComponent implements OnInit {
  @Input() places: any[] = [];
  @Input() title!: string;

  startIndex = 0;

  /** Текущее количество видимых карточек */
  visibleCount = 4;
  /** Текущая ширина карточки */
  cardWidth = 315;
  /** Расстояние между карточками */
  gap = 20;

  ngOnInit() {
    this.updateLayout();
  }

  /** Пересчитываем параметры на основании окна */
  @HostListener('window:resize')
  updateLayout() {
    const w = window.innerWidth;
    if (w >= 1536) {
      // xxl
      this.visibleCount = 4;
      this.cardWidth = 315;
      this.gap = 20;
    } else if (w >= 1024) {
      // lg
      this.visibleCount = 3;
      this.cardWidth = 301;
      this.gap = 16;
    } else {
      // ниже lg — можно адаптировать (например, 1 или 2 карточки)
      this.visibleCount = 1;
      this.cardWidth = w - 40; // full-width minus padding
      this.gap = 16;
    }
    // скорректировать startIndex, чтобы не уходил в минус или за пределы
    const maxStart = Math.max(0, this.places.length - this.visibleCount);
    if (this.startIndex > maxStart) {
      this.startIndex = maxStart;
    }
  }

  /** Смещение контейнера */
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
