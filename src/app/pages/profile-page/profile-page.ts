import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { PlacesService } from '../../core/services/places.service';
import { InfoSectorComponent } from './components/info-sector.component';
import { FavoritesSliderComponent } from './components/favorites-sector.component';
import { SettingsSectorComponent } from './components/settings-sector.component';

import { User } from '../../core/models/user.model';
import { Place } from '../../core/models/place.model';
import { PlaceCardType } from '../../core/constants/place-card-type.enum';
import { AuthApiService } from '../../core/services/auth-api.service';
import { AuthStateService } from '../../state/auth/auth-state.service';
import { LoaderService } from '../../core/services/loader.service';

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
        <!-- Info Section -->
        <app-info-sector
          class="col-span-4 lg:col-span-8 xxl:col-span-6 xxl:col-start-2"
          [editableUser]="editedUser || user"
          [isEditing]="isEditing"
          (onToggleEdit)="handleToggleEdit()"
          (fieldChange)="onFieldChange($event.field, $event.value)"
          [hasPendingChanges]="hasPendingChanges"
        ></app-info-sector>

        <!-- Favorites Section -->
        <app-favorites-sector
          class="col-span-4 lg:col-span-8"
          [places]="favorites"
        ></app-favorites-sector>

        <!-- Settings Section -->
        <app-settings-sector
          *ngIf="editedUser"
          class="col-span-4 lg:col-span-8"
          [user]="editedUser"
          [places]="allPlaces"
          (settingsChanged)="onSettingsChanged()"
        ></app-settings-sector>

        <!-- Save Button -->
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

        <!-- Success Modal -->
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

  showModal = false;
  allPlaces: Place[] = [];

  constructor(
    private router: Router,
    private authService: AuthStateService,
    private placesService: PlacesService,
    private loaderService: LoaderService,
  ) {}

  // Load user data and favorite places on component initialization
  ngOnInit(): void {
    this.loaderService.show();

    this.authService.loadUserInfo().subscribe({
      next: (userFromService: User) => {
        this.user = userFromService;
        this.editedUser = { ...userFromService };

        this.placesService.getPlaces().subscribe({
          next: (places: Place[]) => {
            this.allPlaces = places;

            const favoriteIds =
              userFromService.favoriteCafeIds?.map(Number) || [];
            this.favorites = places.filter((place) =>
              favoriteIds.includes(place.id),
            );

            this.loaderService.hide();
          },
          error: (err) => {
            console.error('❌ Failed to load places:', err);
            this.loaderService.hide();
          },
        });
      },
      error: (err: any) => {
        console.error('❌ Failed to load user data:', err);
        this.loaderService.hide();
      },
    });
  }

  // Fetch all places for mapping user favorites
  private loadAllPlaces() {
    this.placesService.getPlaces().subscribe({
      next: (places: Place[]) => {
        this.allPlaces = places;
      },
      error: (err) => console.error('❌ Failed to load places:', err),
    });
  }

  // Load user’s favorite cafes based on stored IDs
  private loadFavoriteCafes(): void {
    if (!this.user || !this.user.favoriteCafeIds?.length) {
      this.favorites = [];
      return;
    }

    const favoriteIds = this.user.favoriteCafeIds.map((id) => Number(id));

    this.placesService.getPlaces().subscribe({
      next: (allPlaces: Place[]) => {
        this.favorites = allPlaces.filter((place) =>
          favoriteIds.includes(place.id),
        );
      },
      error: (err) => console.error('❌ Failed to load favorite cafes:', err),
    });
  }

  // Toggle editing mode
  handleToggleEdit() {
    this.isEditing = !this.isEditing;
  }

  // Handle form field change from child component
  onFieldChange(field: keyof User, value: User[keyof User]) {
    if (!this.editedUser) return;
    // @ts-ignore – suppress type-checking for dynamic assignment
    this.editedUser[field] = value;
    this.hasPendingChanges = true;
  }

  // Mark form as dirty when any setting is changed
  onSettingsChanged() {
    this.hasPendingChanges = true;
  }

  // Submit updated user profile to backend
  saveChanges() {
    if (!this.user || !this.editedUser) return;

    const payload: Partial<User> = {
      ...this.editedUser,
      email: this.user.email,
    };

    this.authService.updateUserProfile(payload).subscribe({
      next: (updated: User) => {
        this.user = updated;
        this.editedUser = { ...updated };
        this.isEditing = false;
        this.hasPendingChanges = false;
        this.showModal = true;
      },
      error: (err: any) => console.error('❌ Failed to update profile:', err),
    });
  }

  // Close success modal
  closeModal() {
    this.showModal = false;
  }

  // Logout and navigate to auth page
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
