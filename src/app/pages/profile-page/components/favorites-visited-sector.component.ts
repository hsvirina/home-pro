import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SliderPlacesComponent } from '../../../shared/components/slider-places.component';
import { Place } from '../../../core/models/place.model';
import { PlaceCardType } from '../../../core/constants/place-card-type.enum';
import { PlaceCardComponent } from '../../../shared/components/place-card.component';

@Component({
  selector: 'app-favorites-visited-sector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SliderPlacesComponent,
    PlaceCardComponent,
  ],
  template: `
    <div class="flex flex-col gap-12">
      <!-- Favorite Cafés -->
      <div>
        <h4 class="mb-1 text-[24px] lg:text-[32px] xxl:text-[40px]">
          Favorite Cafés
        </h4>
        <span class="body-font-1 block"
          >Your saved coffee spots ({{ favoritePlaces.length }})</span
        >

        <!-- Mobile slider -->
        <div class="block lg:hidden">
          <app-slider-places
            [title]="'Favorite Cafés'"
            [places]="favoritePlaces"
            [cardType]="PlaceCardType.Favourites"
          ></app-slider-places>
        </div>

        <!-- Desktop grid -->
        <div
          class="hidden w-full gap-x-[20px] gap-y-[12px] lg:grid lg:grid-cols-6 xxl:grid-cols-8"
        >
          <app-place-card
            *ngFor="let place of favoritePlaces"
            [place]="place"
            [cardType]="PlaceCardType.Favourites"
            class="col-span-2"
          ></app-place-card>
        </div>
      </div>

      <!-- Visited Cafés -->
      <div>
        <h4 class="mb-2 text-[24px] lg:text-[32px] xxl:text-[40px]">
          Already visited
        </h4>
        <span class="body-font-1 block"
          >One more place on your personal coffee map</span
        >

        <!-- Mobile slider -->
        <div class="block lg:hidden">
          <app-place-card
            *ngFor="let place of favoritePlaces"
            [place]="place"
            [cardType]="PlaceCardType.Favourites"
            class="col-span-2"
            (favoriteToggled)="onFavoriteToggled($event)"
          ></app-place-card>
        </div>

        <!-- Desktop grid -->
        <div
          class="hidden w-full gap-x-[20px] gap-y-[12px] lg:grid lg:grid-cols-6 xxl:grid-cols-8"
        >
          <app-place-card
            *ngFor="let place of visitedPlaces"
            [place]="place"
            [cardType]="PlaceCardType.Favourites"
            class="col-span-2"
            (favoriteToggled)="onFavoriteToggledVisited($event)"
          ></app-place-card>
        </div>
      </div>
    </div>
  `,
})
export class FavoritesVisitedSectorComponent {
  @Input() favoritePlaces: Place[] = [];
  @Input() visitedPlaces: Place[] = [];

  protected readonly PlaceCardType = PlaceCardType;

  onFavoriteToggled(event: { placeId: number; isFavorite: boolean }) {
    if (!event.isFavorite) {
      this.favoritePlaces = this.favoritePlaces.filter(
        (p) => p.id !== event.placeId,
      );
    }
  }

  onFavoriteToggledVisited(event: { placeId: number; isFavorite: boolean }) {
    if (!event.isFavorite) {
      // Если логика требует, например, удалить из visitedPlaces
      this.visitedPlaces = this.visitedPlaces.filter(
        (p) => p.id !== event.placeId,
      );
    }
  }
}
