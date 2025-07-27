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
import { InfoSectionComponent } from './components/info-section.component';
import { MainInfoSectionComponent } from './components/main-info-section.component';
import { AboutSectionComponent } from './components/about-section.component';
import { ReviewsSectionComponent } from './components/reviews-section.component';
import { ActionsSectorComponent } from './components/actions-sector.component';
import { BreadcrumbsComponent } from '../../shared/components/breadcrumbs.component';
import { ModalComponent } from '../../shared/components/modal.component';

@Component({
  selector: 'app-place-details-page',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    CarouselSectionComponent,
    InfoSectionComponent,
    MainInfoSectionComponent,
    AboutSectionComponent,
    BreadcrumbsComponent,
    ReviewsSectionComponent,
    ActionsSectorComponent,
    ModalComponent,
  ],
  template: `
    <div
      *ngIf="place"
      class="flex max-w-[1320px] flex-col gap-20 px-5 lg:gap-12 lg:px-10 xxl:mx-auto"
    >
      <app-breadcrumbs [lastLabel]="place.name" />

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
        [isMobile]="isMobile"
        [showAddReviewForm]="showAddReviewForm"
        [alwaysShowFormOnDesktop]="!isMobile"
        (closeAddReviewForm)="showAddReviewForm = false"
      />

      <app-actions-sector
        [isFavorite]="isFavorite"
        [isMobile]="isMobile"
        [showAddReviewForm]="showAddReviewForm"
        [isLoggedIn]="isLoggedIn"
        (leaveReviewClick)="handleLeaveReviewClick()"
        (onToggleFavorite)="handleFavorite()"
        (onShare)="openShareModal()"
      />
    </div>

    <!-- Login Modal -->
    <app-modal [isOpen]="showLoginModal" (close)="showLoginModal = false">
      <h4 class="mb-4 text-center text-xl font-semibold">Please log in</h4>
      <p class="mb-4 text-center text-gray-600">
        You must be logged in to add cafés to your favorites.
      </p>
      <div class="flex justify-center gap-4">
        <button (click)="navigateToAuth()" class="button-bg-blue px-6 py-2">
          Log In
        </button>
        <button
          (click)="showLoginModal = false"
          class="button-bg-transparent px-6 py-2"
        >
          Close
        </button>
      </div>
    </app-modal>

    <!-- Share Modal -->
    <app-modal [isOpen]="showShareModal" (close)="showShareModal = false">
      <h4 class="mb-4 text-xl font-semibold">Share this café</h4>
      <input
        [value]="currentShareLink"
        readonly
        class="mb-4 w-full truncate rounded-lg border p-3"
      />
      <button (click)="handleShare()" class="button-bg-blue h-12 w-full">
        {{ copied ? 'Copied!' : 'Copy Link' }}
      </button>
    </app-modal>
  `,
})
export class PlaceDetailsPageComponent implements OnInit, AfterViewChecked {
  place: Place | null = null;

  isMobile = false;
  showAddReviewForm = false;
  showLoginModal = false;
  showShareModal = false;
  copied = false;

  private scrollToReviewForm = false;

  @ViewChild(ReviewsSectionComponent, { read: ElementRef })
  reviewsSectionRef!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private placesService: PlacesService,
    private favoritesService: FavoritesService,
    private authService: AuthStateService,
    private loaderService: LoaderService,
    private cdr: ChangeDetectorRef,
  ) {}

  /** Lifecycle hook: Initialize component and load place data */
  ngOnInit(): Promise<void> {
    this.updateScreenMode();

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/not-found']);
      return Promise.reject();
    }

    this.loaderService.show();

    return new Promise((resolve, reject) => {
      this.placesService.getPlaces().subscribe({
        next: (places) => {
          this.place = places.find((p) => p.id.toString() === id) || null;

          if (!this.place) {
            this.router.navigate(['/not-found']);
            this.loaderService.hide();
            reject('Place not found');
            return;
          }

          this.loaderService.hide();
          resolve();
        },
        error: (err) => {
          this.router.navigate(['/not-found']);
          this.loaderService.hide();
          reject(err);
        },
      });
    });
  }

  /** Lifecycle hook: After view checked, scroll to review form if needed */
  ngAfterViewChecked() {
    if (this.scrollToReviewForm && this.reviewsSectionRef) {
      this.scrollToReviewForm = false;
      this.reviewsSectionRef.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  /** Window resize event handler - update screen mode and form visibility */
  @HostListener('window:resize')
  onResize() {
    this.updateScreenMode();
    this.showAddReviewForm = this.isMobile;
  }

  /** Update isMobile flag based on window width */
  private updateScreenMode() {
    this.isMobile = window.innerWidth < 1024;
    this.cdr.detectChanges();
  }

  /** Handle click on "Leave a review" button */
  handleLeaveReviewClick() {
    if (!this.currentUser) {
      this.showLoginModal = true;
      return;
    }
    this.showAddReviewForm = true;
    if (this.isMobile) this.scrollToReviewForm = true;
  }

  /** Handle favorite toggle */
  handleFavorite() {
    if (!this.currentUser || !this.place) {
      this.showLoginModal = true;
      return;
    }

    const cafeId = this.place.id;
    const obs = this.isFavorite
      ? this.favoritesService.removeFavorite(cafeId)
      : this.favoritesService.addFavorite(cafeId);

    obs.subscribe({
      next: () => {
        const user = this.authService.getCurrentUser();
        if (!user) return;

        user.favoriteCafeIds = this.isFavorite
          ? user.favoriteCafeIds.filter((id) => id !== cafeId)
          : [...user.favoriteCafeIds, cafeId];

        this.cdr.detectChanges();
      },
      error: () => {
        // TODO: Add error handling here if needed
      },
    });
  }

  /** Navigate to auth page and store return URL */
  navigateToAuth() {
    localStorage.setItem('returnUrl', this.router.url);
    this.showLoginModal = false;
    this.router.navigate(['/auth']);
  }

  /** Open share modal */
  openShareModal() {
    this.showShareModal = true;
    this.copied = false;
  }

  /** Copy share link to clipboard */
  handleShare() {
    navigator.clipboard.writeText(this.currentShareLink).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 3000);
    });
  }

  /** Current logged-in user getter */
  get currentUser() {
    return this.authService.getCurrentUser();
  }

  /** Check if current place is in user's favorites */
  get isFavorite(): boolean {
    return !!(
      this.place &&
      this.currentUser &&
      this.currentUser.favoriteCafeIds.includes(this.place.id)
    );
  }

  /** Check if user is logged in */
  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  /** Construct current page share link */
  get currentShareLink(): string {
    return `${window.location.origin}/places/${this.place?.id}`;
  }
}
