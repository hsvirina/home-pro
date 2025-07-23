import { NgClass, NgForOf, NgStyle } from '@angular/common';
import { Component, Input, HostListener, OnInit } from '@angular/core';
import { PlaceCardComponent } from './place-card.component';
import { PlaceCardType } from '../models/place-card-type.enum';

@Component({
  selector: 'app-slider-places',
  standalone: true,
  imports: [NgStyle, NgClass, NgForOf, PlaceCardComponent],
  template: `
    <div
      class="flex flex-col items-center gap-[24px] lg:px-0"
      [ngClass]="{
        'px-[20px]': cardType !== PlaceCardType.Favourites,
        'px-0': cardType === PlaceCardType.Favourites,
      }"
    >
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
          [ngClass]="{
            'text-[24px] text-[var(--color-gray-100)] lg:text-[32px] xxl:text-[40px]': true,
            'lg:absolute lg:left-1/2 lg:-translate-x-1/2':
              cardType !== PlaceCardType.Favourites,
          }"
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

      <div class="w-full overflow-hidden py-[22px] lg:py-0">
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
            [cardType]="cardType"
            class="flex-shrink-0"
            [ngStyle]="{ width: cardWidth + 'px' }"
          />
        </div>
      </div>
    </div>
  `,
})
export class SliderPlacesComponent implements OnInit {
  @Input() places: any[] = [];
  @Input() title!: string;
  @Input() cardType: PlaceCardType = PlaceCardType.Full;

  PlaceCardType = PlaceCardType;

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

    if (w >= 1440) {
      // xxl
      this.visibleCount = 4;
      this.cardWidth = 315;
      this.gap = 20;
    } else if (w >= 1320) {
      this.cardWidth = 315;
      this.gap = Math.floor((1320 - 3 * this.cardWidth - 80) / 2);
      this.visibleCount = 3;
    } else if (w >= 1024) {
      // lg
      this.visibleCount = 3;
      this.cardWidth = 301;
      this.gap = Math.floor((w - 3 * this.cardWidth - 100) / 2);
    } else {
      // ниже lg — динамически считаем
      this.cardWidth = 315;
      this.gap = 16;
      const containerWidth = window.innerWidth - 2 * 20;
      this.visibleCount = Math.max(
        1,
        Math.floor((containerWidth + this.gap) / (this.cardWidth + this.gap)),
      );
    }

    // скорректировать startIndex, чтобы не уходил за пределы
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
