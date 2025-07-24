import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { Place } from '../../models/place.model';
import { PlacesService } from '../../services/places.service';
import { CarouselSectionComponent } from './components/carousel-section.component';
import { InfoSectionComponent } from './components/info-section.component';
import { MainInfoSectionComponent } from './components/main-info-section.component';
import { AboutSectionComponent } from './components/about-section.component';
import { BreadcrumbsComponent } from '../../components/breadcrumbs.component';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';
import { ReviewsSectionComponent } from './components/reviews-section.component';
import { ActionsSectorComponent } from './components/actions-sector.component';

@Component({
  selector: 'app-place-details-page',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    InfoSectionComponent,
    CarouselSectionComponent,
    MainInfoSectionComponent,
    AboutSectionComponent,
    BreadcrumbsComponent,
    ReviewsSectionComponent,
    ActionsSectorComponent,
  ],
  template: `
    <div *ngIf="place" class="mx-auto flex max-w-[1320px] flex-col gap-12">
      <app-breadcrumbs [lastLabel]="place.name"></app-breadcrumbs>

      <app-carousel-section
        [photoUrls]="place.photoUrls"
        [isFavorite]="isFavorite"
        (onToggleFavorite)="handleFavorite()"
        (onShare)="openShareModal()"
      />

      <app-main-info-section [place]="place" />

      <app-info-section [place]="place" />

      <app-about-section [place]="place" />

      <app-reviews-section
        [cafeId]="place.id"
        [place]="place"
        [currentUser]="currentUser"
      />

      <app-actions-sector
        [isFavorite]="isFavorite"
        (onToggleFavorite)="handleFavorite()"
        (onShare)="openShareModal()"
      />
    </div>

    <!-- Модальное окно авторизации -->
    <div
      *ngIf="showLoginModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        class="flex w-full max-w-[650px] flex-col items-center justify-between gap-[32px] rounded-[40px] bg-[var(--color-bg-2)] p-[24px] text-center text-[var(--color-gray-100)] shadow-xl"
      >
        <div class="flex flex-col gap-[20px]">
          <h4>Please log in to use favorites</h4>
          <p class="body-font-1 text-[var(--color-gray-100)]">
            This feature is available for registered users only.
            <br />
            Please sign in or create an account to add cafés to favorites.
          </p>
        </div>
        <div class="flex w-full flex-col gap-4 sm:flex-row">
          <button
            (click)="navigateToAuth()"
            class="button-font h-[48px] w-full rounded-[40px] bg-[var(--color-primary)] px-[32px] py-[12px] text-[var(--color-white)] transition-colors duration-200 hover:bg-[var(--color-hover-primary)] active:bg-[var(--color-pressed-primary)]"
          >
            Log in
          </button>
          <button
            (click)="closeModal()"
            class="button-font h-[48px] w-full rounded-[40px] border border-[var(--color-gray-40)] bg-transparent px-[32px] py-[12px] text-[var(--color-gray-100)] transition-colors duration-200 hover:bg-[var(--color-gray-10)] active:bg-[var(--color-gray-20)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно шейра -->
    <div
      *ngIf="showShareModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        class="flex w-full max-w-[650px] flex-col items-center justify-between gap-[32px] rounded-[40px] bg-[var(--color-bg-2)] p-[24px] text-center text-[var(--color-gray-100)] shadow-xl"
      >
        <div class="flex w-full flex-col gap-[20px]">
          <h4>Share this café</h4>
          <div
            class="flex items-center gap-2 rounded-[40px] border border-[var(--color-gray-40)] bg-white px-4 py-3"
          >
            <input
              type="text"
              [value]="currentShareLink"
              readonly
              class="w-full truncate border-none bg-transparent outline-none"
            />
          </div>
        </div>

        <div class="flex w-full flex-col gap-4 sm:flex-row">
          <button
            (click)="handleShare()"
            [ngClass]="[
              'button-font bg-[var(--color-primary)] h-[48px] w-full rounded-[40px] px-[32px] py-[12px] text-[var(--color-white)] transition-colors duration-200',
              copied
                ? 'cursor-default bg-[var(--color-hover-primary)]'
                : 'cursor-pointer hover:bg-[var(--color-hover-primary)] active:bg-[var(--color-pressed-primary)]',
            ]"
          >
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
          <button
            (click)="closeShareModal()"
            class="button-font h-[48px] w-full rounded-[40px] border border-[var(--color-gray-40)] bg-transparent px-[32px] py-[12px] text-[var(--color-gray-100)] transition-colors duration-200 hover:bg-[var(--color-gray-10)] active:bg-[var(--color-gray-20)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  `,
})
export class PlaceDetailsPageComponent implements OnInit {
  place: Place | null = null;
  showLoginModal = false;
  showShareModal = false;
  copied = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private placesService: PlacesService,
    private favoritesService: FavoritesService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    const loadPlace = () => {
      this.placesService.getPlaces().subscribe({
        next: (places: Place[]) => {
          const found = places.find((p) => p.id.toString() === id);
          if (found) {
            this.place = found;
            this.cdr.detectChanges();
          } else {
            this.router.navigate(['/not-found']);
          }
        },
        error: (err) => {
          console.error('Error loading places:', err);
          this.router.navigate(['/not-found']);
        },
      });
    };

    if (this.authService.getCurrentUser()) {
      loadPlace();
    } else if (this.authService.getToken()) {
      this.authService.loadUserInfo().subscribe({
        next: (user) => {
          if (user && user.favoriteCafeIds) {
            // Приводим все favoriteCafeIds к числам
            user.favoriteCafeIds = user.favoriteCafeIds.map(id => Number(id));
          }
          loadPlace();
        },
        error: (err) => {
          console.error('Error loading user info:', err);
          loadPlace();
        },
      });
    } else {
      loadPlace();
    }
  }

  get currentShareLink(): string {
    return `${window.location.origin}/places/${this.place?.id}`;
  }

  get isAuthenticated(): boolean {
    return !!this.authService.getToken();
  }

  get currentUser(): User | null {
    return this.authService.getCurrentUser();
  }

  get isFavorite(): boolean {
    if (!this.place || !this.currentUser) return false;
    return this.currentUser.favoriteCafeIds.includes(this.place.id);
  }

  navigateToAuth(): void {
    this.showLoginModal = false;
    this.router.navigate(['/auth']);
  }

  handleFavorite(): void {
    if (!this.isAuthenticated || !this.currentUser) {
      this.showLoginModal = true;
      return;
    }

    const cafeId = this.place!.id;
    const isFav = this.currentUser.favoriteCafeIds.includes(cafeId);

    const obs = isFav
      ? this.favoritesService.removeFavorite(cafeId)
      : this.favoritesService.addFavorite(cafeId);

    obs.subscribe({
      next: () => {
        if (isFav) {
          this.currentUser!.favoriteCafeIds = this.currentUser!.favoriteCafeIds.filter(id => id !== cafeId);
        } else {
          this.currentUser!.favoriteCafeIds = [...this.currentUser!.favoriteCafeIds, cafeId];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(`❌ Ошибка при ${isFav ? 'удалении' : 'добавлении'} в избранное:`, err);
      },
    });
  }

  handleShare(): void {
    navigator.clipboard.writeText(this.currentShareLink).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 5000);
    });
  }

  openShareModal(): void {
    this.showShareModal = true;
    this.copied = false;
  }

  closeShareModal(): void {
    this.showShareModal = false;
    this.copied = false;
  }

  closeModal(): void {
    this.showLoginModal = false;
  }
}
