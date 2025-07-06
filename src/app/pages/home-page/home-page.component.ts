import { Component, OnInit } from '@angular/core';
import { SliderPlacesComponent } from '../../components/slider-places.component';
import { FilterBarComponent } from './components/filter-bar.component';
import { WelcomeBlockComponent } from './components/welcome-block.component';
import { Place } from '../../models/place.model';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SliderPlacesComponent, FilterBarComponent, WelcomeBlockComponent],
  template: `
    <div class="flex flex-col">
      <h1
        class="mx-auto max-w-[1172px] px-[20px] text-center text-[36px] xxl:px-[0px] xxl:text-[80px]"
      >
        Your next favorite café is just a
        <span class="text-[var(--color-primary)]">click</span>
        away
      </h1>

      <div class="xxl:flex xxl:justify-center">
        <app-filter-bar></app-filter-bar>
      </div>

      <app-slider-places
        [title]="'Popular Places'"
        [places]="places"
      ></app-slider-places>

      <app-welcome-block></app-welcome-block>

      <app-slider-places
        [title]="'Most Popular'"
        [places]="popularPlaces"
      ></app-slider-places>
    </div>
  `,
})
export class HomePageComponent implements OnInit {
  places: Place[] = [];
  popularPlaces: Place[] = [];

  constructor(private placesService: PlacesService) {}

  ngOnInit() {
    this.placesService.getPlaces().subscribe({
      next: (data) => {
        this.places = data;
        this.popularPlaces = [...data]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 10);
      },
      error: (err) => console.error('Ошибка при загрузке кафе:', err),
    });
  }
}
