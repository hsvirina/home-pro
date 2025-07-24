import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { PlacesService } from '../../services/places.service';

import { InfoSectorComponent } from './components/info-sector.component';
import { FavoritesSliderComponent } from './components/favorites-sector.component';
import { SettingsSectorComponent } from './components/settings-sector.component';

import { User } from '../../models/user.model';
import { Place } from '../../models/place.model';
import { PlaceCardType } from '../../models/place-card-type.enum';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    InfoSectorComponent,
    FavoritesSliderComponent,
    SettingsSectorComponent,
  ],
  template: `
    <div *ngIf="user" class="px-[20px] lg:px-[40px] xxl:px-0">
      <div class="grid grid-cols-4 gap-[16px] lg:grid-cols-8 lg:gap-[20px]">
        <!-- Info -->
        <app-info-sector
          class="col-span-4 lg:col-span-8 xxl:col-span-6 xxl:col-start-2"
          [editableUser]="editedUser || user"
          [isEditing]="isEditing"
          (onToggleEdit)="handleToggleEdit()"
          (fieldChange)="onFieldChange($event.field, $event.value)"
          [hasPendingChanges]="hasPendingChanges"
        ></app-info-sector>

        <!-- Favorites -->
        <app-favorites-sector
          class="col-span-4 lg:col-span-8"
          [places]="favorites"
        ></app-favorites-sector>

        <!-- Settings -->
<app-settings-sector
  *ngIf="editedUser"
  class="col-span-4 lg:col-span-8"
  [user]="editedUser"
  [places]="allPlaces"
  (settingsChanged)="onSettingsChanged()"
></app-settings-sector>

        <!-- Save button -->
        <div
          class="col-span-4 mb-[144px] mt-[32px] flex justify-center lg:col-span-8"
        >
          <button
            class="button-font button-bg-blue h-[48px] w-full lg:w-[482px]"
            [disabled]="!hasPendingChanges"
            (click)="saveChanges()"
          >
            Save All Changes
          </button>
        </div>

        <!-- Modal -->
        <div
          *ngIf="showModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div
            class="flex w-full max-w-[650px] flex-col items-center justify-between gap-[32px] rounded-[40px] bg-[var(--color-bg-2)] p-[24px] text-center text-[var(--color-gray-100)] shadow-xl"
          >
            <div class="flex flex-col gap-[20px]">
              <h4>Changes saved successfully</h4>
              <p class="body-font-1 text-[var(--color-gray-100)]">
                Your profile has been updated. Thank you!
              </p>
            </div>
            <button
              (click)="closeModal()"
              class="button-font button-bg-blue h-[48px] w-full px-[32px] py-[12px]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProfilePageComponent implements OnInit {
  public readonly PlaceCardType = PlaceCardType;

  favorites: Place[] = [];
  user: User | null = null;
  editedUser: User | null = null;

  isEditing = false;
  hasPendingChanges = false;

  showModal = false; // 👈 новое состояние
  allPlaces: Place[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private placesService: PlacesService,
  ) {}
  ngOnInit(): void {
    this.authService.loadUserInfo().subscribe({
      next: (userFromService) => {
        this.user = userFromService;
        this.editedUser = { ...userFromService };
        this.loadFavoriteCafes();
        this.loadAllPlaces(); // загружаем все места
      },
      error: (err) =>
        console.error('❌ Ошибка при загрузке пользователя:', err),
    });
  }

  private loadAllPlaces() {
    this.placesService.getPlaces().subscribe({
      next: (places) => {
        this.allPlaces = places;
      },
      error: (err) => console.error('❌ Ошибка при загрузке всех мест:', err),
    });
  }
  private loadFavoriteCafes(): void {
    if (!this.user || !this.user.favoriteCafeIds?.length) {
      this.favorites = [];
      return;
    }

    const favoriteIds = this.user.favoriteCafeIds.map((id) => Number(id));

    this.placesService.getPlaces().subscribe({
      next: (allPlaces) => {
        this.favorites = allPlaces.filter((place) =>
          favoriteIds.includes(place.id),
        );
      },
      error: (err) => console.error('❌ Ошибка при загрузке кафе:', err),
    });
  }

  handleToggleEdit() {
    // просто переключаем режим, без сохранения на сервер
    this.isEditing = !this.isEditing;
  }

  onFieldChange(field: keyof User, value: User[keyof User]) {
    if (!this.editedUser) return;
    // @ts-ignore — отключаем проверку в этой строке
    this.editedUser[field] = value;
    this.hasPendingChanges = true;
  }

  onSettingsChanged() {
    this.hasPendingChanges = true;
  }

  saveChanges() {
    if (!this.user || !this.editedUser) return;

    const payload: Partial<User> = {
      ...this.editedUser,
      email: this.user.email,
    };

    this.authService.updateUserProfile(payload).subscribe({
      next: (updated) => {
        this.user = updated;
        this.editedUser = { ...updated };
        this.isEditing = false;
        this.hasPendingChanges = false;
        this.showModal = true; // 👈 показываем модалку
      },
      error: (err) => console.error('❌ Ошибка обновления профиля', err),
    });
  }

  closeModal() {
    this.showModal = false;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
