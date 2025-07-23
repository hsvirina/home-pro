import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderPlacesComponent } from '../../../components/slider-places.component';
import { PlaceCardComponent } from '../../../components/place-card.component';
import { Place } from '../../../models/place.model';
import { PlaceCardType } from '../../../models/place-card-type.enum';

@Component({
  selector: 'app-favorites-sector',
  standalone: true,
  imports: [CommonModule, SliderPlacesComponent, PlaceCardComponent],
  template: `
    <div class="mb-[54px] mt-[72px]">
      <!-- Мобильный: слайдер -->
      <div class="block lg:hidden">
        <app-slider-places
          [title]="'Favorite Cafés'"
          [places]="places"
          [cardType]="PlaceCardType.Favourites"
        ></app-slider-places>
      </div>

      <!-- Десктоп: сетка -->
      <div
        class="hidden w-full gap-x-[20px] gap-y-[12px] lg:grid lg:grid-cols-6 xxl:grid-cols-8"
      >
        <h4
          class="col-span-6 text-[24px] text-[var(--color-gray-100)] lg:text-[32px] xxl:col-span-8 xxl:text-[40px]"
        >
          Favorite Cafés
        </h4>

        <span class="body-font-1 col-span-6 xxl:col-span-8">
          Your saved coffee spots ({{ places.length }})
        </span>

        <app-place-card
          *ngFor="let place of places"
          [place]="place"
          [cardType]="PlaceCardType.Favourites"
          class="col-span-2"
        ></app-place-card>
      </div>
    </div>
  `,
})
export class FavoritesSliderComponent {
  @Input() places: Place[] = [];
  protected readonly PlaceCardType = PlaceCardType;
}
