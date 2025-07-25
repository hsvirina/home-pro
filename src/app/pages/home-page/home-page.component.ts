import { Component, OnInit } from '@angular/core';
import { FilterBarComponent } from './components/filter-bar.component';
import { WelcomeBlockComponent } from './components/welcome-block.component';
import { Place } from '../../core/models/place.model';
import { PlacesStoreService } from '../../core/services/places-store.service';
import { CommonModule } from '@angular/common';
import { ReviewsService } from '../../core/services/reviews.service';
import { SliderPlacesComponent } from '../../shared/components/slider-places.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    SliderPlacesComponent,
    FilterBarComponent,
    WelcomeBlockComponent,
  ],
  template: `
    <div class="flex flex-col lg:px-[40px] xxl:px-[0px]">
      <h1
        class="mx-auto max-w-[1172px] px-[20px] text-center text-[36px] lg:text-[64px] xxl:text-[80px]"
      >
        Your next favorite café is just a
        <span class="text-[var(--color-primary)]">click</span>
        away
      </h1>

      <div class="lg:flex lg:justify-center">
        <app-filter-bar></app-filter-bar>
      </div>

      <ng-container *ngIf="places.length > 0">
        <app-slider-places
          [title]="'Popular Places'"
          [places]="places"
        ></app-slider-places>

        <app-welcome-block></app-welcome-block>

        <app-slider-places
          [title]="'Most Popular'"
          [places]="popularPlaces"
          [ngStyle]="{ 'margin-bottom': '148px' }"
        ></app-slider-places>
      </ng-container>
    </div>
  `,
})
export class HomePageComponent implements OnInit {
  places: Place[] = [];
  popularPlaces: Place[] = [];

  constructor(
    private placesStore: PlacesStoreService,
    private reviewsService: ReviewsService, // добавляем в конструктор.
  ) {}

  ngOnInit() {
    // Загрузка кафе
    this.placesStore.loadPlaces();
    this.placesStore.places$.subscribe((data) => {
      if (data) {
        this.places = [...data];
        this.popularPlaces = [...data]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 10);
      }
    });
  }
}
