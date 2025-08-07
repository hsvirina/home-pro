import {
  Component,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SliderPlacesComponent } from '../../../shared/components/slider-places.component';
import { Place } from '../../../core/models/place.model';
import { PlaceCardType } from '../../../core/constants/place-card-type.enum';
import { PlaceCardComponent } from '../../../shared/components/place-card.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-favorites-visited-sector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SliderPlacesComponent,
    PlaceCardComponent,
    TranslateModule,
  ],
  template: `
    <div class="flex flex-col gap-12">
      <!-- Favorite Cafés Section -->
      <section class="flex flex-col">
        <h4
          class="mb-2 hidden text-[24px] lg:flex lg:text-[32px] xxl:text-[40px]"
        >
          {{ 'favoritesVisited.favoriteCafes' | translate }}
        </h4>
        <span class="body-font-1 mb-4 hidden lg:block">
          {{
            'favoritesVisited.favoriteCafesDescription'
              | translate: { count: favoritePlaces.length }
          }}
        </span>

        <!-- Mobile slider -->
        <div class="block lg:hidden">
          <app-slider-places
            [places]="favoritePlaces"
            [cardType]="PlaceCardType.Favourites"
            [title]="'favoritesVisited.favoriteCafes' | translate"
            [subtitle]="
              'favoritesVisited.favoriteCafesDescription'
                | translate: { count: favoritePlaces.length }
            "
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
            (favoriteToggled)="onFavoriteToggled($event)"
          ></app-place-card>
        </div>
      </section>

      <!-- Visited Cafés Section -->
      <section class="flex flex-col">
        <h4
          class="mb-2 hidden text-[24px] lg:flex lg:text-[32px] xxl:text-[40px]"
        >
          {{ 'favoritesVisited.alreadyVisited' | translate }}
        </h4>
        <span class="body-font-1 mb-4 hidden lg:block">
          {{ 'favoritesVisited.alreadyVisitedDescription' | translate }}
        </span>

        <!-- Mobile slider -->
        <div class="block lg:hidden">
          <app-slider-places
            [places]="visitedPlaces"
            [cardType]="PlaceCardType.Favourites"
            [title]="'favoritesVisited.alreadyVisited' | translate"
            [subtitle]="
              'favoritesVisited.alreadyVisitedDescription' | translate
            "
          ></app-slider-places>
        </div>

        <!-- Desktop grid -->
        <ng-container *ngIf="visitedPlaces.length > 0; else noVisitedPlaces">
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
        </ng-container>

        <ng-template #noVisitedPlaces>
          <div class="mt-4 text-gray-500 lg:block">
            {{ 'favoritesVisited.noVisitedPlaces' | translate }}
          </div>
        </ng-template>
      </section>
    </div>
  `,
})
export class FavoritesVisitedSectorComponent {
  /** User's favorite places */
  @Input() favoritePlaces: Place[] = [];
  @Output() visitedPlacesChanged = new EventEmitter<Place[]>();

  /** User's visited places */
  @Input() visitedPlaces: Place[] = [];

  @Output() favoritePlacesChanged = new EventEmitter<Place[]>();

  /** Enum for place card types exposed to template */
  protected readonly PlaceCardType = PlaceCardType;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Trigger change detection to update view properly on init
    this.cdr.detectChanges();
  }

  /**
   * Handles the favorite toggling for favoritePlaces.
   * Removes the place from favorites if unfavorited.
   * @param event - event containing placeId and isFavorite flag
   */
  // onFavoriteToggled(event: { placeId: number; isFavorite: boolean }): void {
  //   if (!event.isFavorite) {
  //     this.favoritePlaces = this.favoritePlaces.filter(p => p.id !== event.placeId);
  //   }
  // }
  // onFavoriteToggled(event: { placeId: number; isFavorite: boolean }): void {
  //   console.log(
  //     'Toggling favorite for place:',
  //     event.placeId,
  //     'Is favorite:',
  //     event.isFavorite,
  //   );

  //   if (!event.isFavorite) {
  //     console.log('Removing from favorite places:', event.placeId);

  //     // Создаем новый массив, исключая удаленное место
  //     this.favoritePlaces = this.favoritePlaces.filter(
  //       (p) => p.id !== event.placeId,
  //     );

  //     // Эмитим обновление
  //     this.favoritePlacesChanged.emit(this.favoritePlaces);
  //   } else {
  //     console.log(
  //       'Place is now marked as favorite again, no changes to visited list',
  //     );
  //   }
  // }

  onFavoriteToggled(event: { placeId: number; isFavorite: boolean }): void {
    console.log(
      'Toggling favorite for place:',
      event.placeId,
      'Is favorite:',
      event.isFavorite,
    );

    if (event.isFavorite) {
      console.log('Adding to favorite places:', event.placeId);

      // Проверяем, не добавлен ли уже этот элемент
      if (!this.favoritePlaces.some((place) => place.id === event.placeId)) {
        const placeToAdd = this.favoritePlaces.find(
          (place) => place.id === event.placeId,
        );
        if (placeToAdd) {
          // Добавляем в массив фаворитов
          this.favoritePlaces = [...this.favoritePlaces, placeToAdd];
          // Эмитим обновление
          this.favoritePlacesChanged.emit(this.favoritePlaces);
        }
      }
    } else {
      console.log('Removing from favorite places:', event.placeId);

      // Удаляем из массива фаворитов
      this.favoritePlaces = this.favoritePlaces.filter(
        (p) => p.id !== event.placeId,
      );

      // Эмитим обновление
      this.favoritePlacesChanged.emit(this.favoritePlaces);
    }
  }

  onFavoriteToggledVisited(event: {
    placeId: number;
    isFavorite: boolean;
  }): void {
    if (!event.isFavorite) {
      // Создаем новый массив, исключая удаленное место
      this.favoritePlaces = this.favoritePlaces.filter(
        (p) => p.id !== event.placeId,
      );

      // Эмитим обновление
      this.favoritePlacesChanged.emit(this.favoritePlaces);
      this.cdr.detectChanges();
    }
  }
}
