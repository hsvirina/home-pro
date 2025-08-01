import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Place } from '../../../core/models/place.model';
import { PlaceCardType } from '../../../core/constants/place-card-type.enum';
import { SliderPlacesComponent } from '../../../shared/components/slider-places.component';
import { PlaceCardComponent } from '../../../shared/components/place-card.component';

@Component({
  selector: 'app-favorites-sector',
  standalone: true,
  imports: [CommonModule, SliderPlacesComponent, PlaceCardComponent],
  template: `
    <div class="mb-[54px] mt-[72px]">
      <!-- Desktop header with title and count -->
      <div class="mb-4 hidden lg:block">
        <h4
          class="mb-1 text-[24px] text-[var(--color-gray-100)] lg:text-[32px] xxl:text-[40px]"
        >
          Favorite Cafés
        </h4>

        <span class="body-font-1 block">
          Your saved coffee spots ({{ places.length }})
        </span>
      </div>

      <!-- Mobile view: carousel slider for favorite places -->
      <div class="block lg:hidden">
        <app-slider-places
          [title]="'Favorite Cafés'"
          [places]="places"
          [cardType]="PlaceCardType.Favourites"
        ></app-slider-places>
      </div>

      <!-- Desktop view: grid layout for favorite places -->
      <div
        class="hidden w-full gap-x-[20px] gap-y-[12px] lg:grid lg:grid-cols-6 xxl:grid-cols-8"
      >
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
  // Input list of places to display as favorites
  @Input() places: Place[] = [];

  // Enum to specify card type for child components
  protected readonly PlaceCardType = PlaceCardType;
}
