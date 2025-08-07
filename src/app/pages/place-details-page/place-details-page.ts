import {
  Component,
  OnInit,
  AfterViewChecked,
  HostListener,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';

import { Place } from '../../core/models/place.model';
import { AuthStateService } from '../../state/auth/auth-state.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { PlacesService } from '../../core/services/places.service';
import { LoaderService } from '../../core/services/loader.service';

import { CarouselSectionComponent } from './components/carousel-section.component';
import { MainInfoSectionComponent } from './components/main-info-section.component';
import { ActionsSectorComponent } from './components/actions-sector.component';
import { BreadcrumbsComponent } from '../../shared/components/breadcrumbs.component';
import { ModalComponent } from '../../shared/components/modal.component';
import { FavoriteToggleService } from '../../core/services/favorite-toggle.service';
import { RatingReviewsSectionComponent } from './components/Rating-reviews-section/rating-reviews-section.component';
import { SliderPlacesComponent } from '../../shared/components/slider-places.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LastCheckInsComponent } from './components/last-check-ins.components';

@Component({
  selector: 'app-place-details-page',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    CarouselSectionComponent,
    MainInfoSectionComponent,
    ActionsSectorComponent,
    ModalComponent,
    BreadcrumbsComponent,
    RatingReviewsSectionComponent,
    SliderPlacesComponent,
    TranslateModule,
    LastCheckInsComponent,
  ],
  template: `
    <div
      *ngIf="place"
      class="flex max-w-[1320px] flex-col gap-20 px-5 lg:px-10 xxl:mx-auto xxl:px-0"
    >
      <div class="xxl:grid xxl:grid-cols-8 xxl:gap-5">
        <app-breadcrumbs
          [lastLabel]="place.name"
          class="mb-[24px] xxl:col-span-8"
        />

        <app-carousel-section
          [place]="place"
          [photoUrls]="place.photoUrls"
          [isFavorite]="isFavorite"
          (onToggleFavorite)="onToggleFavorite()"
          (onShare)="openShareModal()"
          class="xxl:col-span-4"
        />

        <app-main-info-section
          [place]="place"
          class="mt-4 lg:mt-0 xxl:col-span-4"
        />
      </div>

      <app-rating-reviews-section
        [cafeId]="place.id"
        [place]="place"
        [currentUser]="currentUser"
        [isMobile]="isMobile"
        [showAddReviewForm]="showAddReviewForm"
        [alwaysShowFormOnDesktop]="!isMobile"
        (closeAddReviewForm)="showAddReviewForm = false"
      />

      <app-last-check-ins
        *ngIf="place"
        [cafeId]="place.id"
      />

      <app-slider-places
        [title]="'places.moreCafes' | translate"
        [places]="randomPlaces"
        (unauthorizedFavoriteClick)="showLoginModal = true"
      />

      <app-actions-sector
        [isFavorite]="isFavorite"
        [isMobile]="isMobile"
        [showAddReviewForm]="showAddReviewForm"
        [isLoggedIn]="isLoggedIn"
        (leaveReviewClick)="handleLeaveReviewClick()"
        (onToggleFavorite)="onToggleFavorite()"
        (onShare)="openShareModal()"
      />
    </div>

    <!-- Login Modal -->
    <app-modal [isOpen]="showLoginModal" (close)="showLoginModal = false">
      <h4 class="mb-4 text-center">{{ 'modals.loginTitle' | translate }}</h4>
      <div class="flex justify-center gap-4">
        <button
          (click)="navigateToAuth()"
          class="button-font button-bg-blue px-6 py-2"
        >
          {{ 'modals.loginBtn' | translate }}
        </button>
        <button
          (click)="showLoginModal = false"
          class="button-font button-bg-transparent px-6 py-2"
        >
          {{ 'modals.closeBtn' | translate }}
        </button>
      </div>
    </app-modal>

    <!-- Share Modal -->
    <app-modal [isOpen]="showShareModal" (close)="showShareModal = false">
      <h4 class="mb-4 text-center">Share this café</h4>
      <input
        [value]="currentShareLink"
        readonly
        class="mb-4 w-full truncate rounded-lg border p-3"
      />
      <button (click)="handleShare()" class="button-bg-blue h-12 w-full">
        {{
          copied
            ? ('modals.copied' | translate)
            : ('modals.copyLink' | translate)
        }}
      </button>
    </app-modal>
  `,
})
export class PlaceDetailsPageComponent implements OnInit, AfterViewChecked {
  /** Currently displayed place */
  place: Place | null = null;

  /** Flag indicating mobile viewport */
  isMobile = false;

  /** Controls visibility of the review form */
  showAddReviewForm = false;

  /** Controls visibility of login modal */
  showLoginModal = false;

  /** Controls visibility of share modal */
  showShareModal = false;

  /** Indicates if share link was copied */
  copied = false;

  /** Flag to trigger scroll to review form */
  private scrollToReviewForm = false;

  /** Reference to the reviews section for scrolling */
  @ViewChild(RatingReviewsSectionComponent, { read: ElementRef })
  private reviewsSectionRef!: ElementRef;

  /** List of random places for slider */
  randomPlaces: Place[] = [];

  /** Current favorite status of the place */
  isFavorite = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private placesService: PlacesService,
    private favoritesService: FavoritesService,
    private authService: AuthStateService,
    private loaderService: LoaderService,
    private cdr: ChangeDetectorRef,
    private favoriteToggleService: FavoriteToggleService,
    private translate: TranslateService,
  ) {}

  /**
   * Initialize component, load place data, and subscribe to language changes
   */
  ngOnInit(): void {
    this.updateScreenMode();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) {
        this.router.navigate(['/not-found']);
        return;
      }
      const lang = localStorage.getItem('lang') || 'en';
      this.loadPlaceData(lang, id);
    });

    this.translate.onLangChange.subscribe((event) => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.loadPlaceData(event.lang, id);
      }
    });
  }

  /**
   * Fetches place data based on current language and ID
   * @param lang Current language code
   * @param id Place identifier as string
   */
  private loadPlaceData(lang: string, id: string): void {
    this.loaderService.show();

    const idNum = Number(id);
    if (isNaN(idNum)) {
      this.router.navigate(['/not-found']);
      this.loaderService.hide();
      return;
    }

    this.placesService.getPlaces(lang).subscribe({
      next: (places) => {
        this.place = places.find((p) => p.id === idNum) || null;

        if (!this.place) {
          this.router.navigate(['/not-found']);
          this.loaderService.hide();
          return;
        }

        this.isFavorite = this.favoriteToggleService.isFavorite(this.place.id);
        this.cdr.detectChanges();

        this.randomPlaces = this.shuffleArray(
          places.filter((p) => p.id !== this.place!.id),
        ).slice(0, 8);

        this.loaderService.hide();
      },
      error: () => {
        this.router.navigate(['/not-found']);
        this.loaderService.hide();
      },
    });
  }

  /**
   * Scroll to the review form if triggered after view checked
   */
  ngAfterViewChecked(): void {
    if (this.scrollToReviewForm && this.reviewsSectionRef) {
      this.scrollToReviewForm = false;
      this.reviewsSectionRef.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  /**
   * Shuffle array elements using Fisher-Yates algorithm
   * @param array Array of Place objects
   * @returns Shuffled array
   */
  private shuffleArray(array: Place[]): Place[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /** Window resize event listener to update mobile mode flag */
  @HostListener('window:resize')
  onResize(): void {
    this.updateScreenMode();
  }

  /** Updates the isMobile flag based on viewport width */
  private updateScreenMode(): void {
    this.isMobile = window.innerWidth < 1024;
    this.cdr.detectChanges();
  }

  /**
   * Handles user action to leave a review.
   * Shows login modal if not authenticated,
   * otherwise reveals review form and scrolls to it on mobile.
   */
  handleLeaveReviewClick(): void {
    if (!this.currentUser) {
      this.showLoginModal = true;
      return;
    }
    this.showAddReviewForm = true;

    if (this.isMobile) {
      this.scrollToReviewForm = true;
    }
  }

  /**
   * Toggles favorite status of the current place.
   * Shows login modal on authentication error.
   * @param event Optional MouseEvent to prevent propagation
   */
  onToggleFavorite(): void {
    event?.preventDefault();
    event?.stopPropagation();

    if (!this.place) return;

    this.favoriteToggleService.toggleFavorite(this.place).subscribe({
      next: () => {
        this.isFavorite = this.favoriteToggleService.isFavorite(this.place!.id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.message === 'NOT_AUTHENTICATED') {
          this.showLoginModal = true;
        } else {
          alert('An error occurred while updating favorites.');
        }
      },
    });
  }

  /**
   * Navigates to authentication page while saving current URL for redirection after login
   */
  navigateToAuth(): void {
    localStorage.setItem('returnUrl', this.router.url);
    this.showLoginModal = false;
    this.router.navigate(['/auth']);
  }

  /** Opens share modal and resets copy state */
openShareModal(): void {
  if (!this.isLoggedIn) {
    this.showLoginModal = true;
    return;
  }

  this.showShareModal = true;
  this.copied = false;
}

  /**
   * Copies current share URL to clipboard and temporarily shows feedback
   */
  // handleShare(): void {
  //   navigator.clipboard.writeText(this.currentShareLink).then(() => {
  //     this.copied = true;
  //     setTimeout(() => (this.copied = false), 3000);
  //   });
  // }

  handleShare(): void {
  console.log('Share button clicked');
  if (!this.place?.id) return;

  // Копирование ссылки в буфер обмена
  navigator.clipboard.writeText(this.currentShareLink).then(() => {
    console.log('Cafe URL copied to clipboard');
    // После успешного копирования, меняем текст кнопки
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 3000);  // Ожидаем 3 секунды, чтобы вернуть текст кнопки
  }).catch((err) => {
    console.error('Failed to copy URL: ', err);
  });
}

  /** Retrieves current authenticated user */
  get currentUser() {
    return this.authService.getCurrentUser();
  }

  /** Checks if user is logged in */
  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  /** Builds current shareable URL for the place */
  // get currentShareLink(): string {
  //   return `${window.location.origin}/places/${this.place?.id}`;
  // }
  get currentShareLink(): string {
  return `${window.location.origin}/places/${this.place?.id}`;
}
}
