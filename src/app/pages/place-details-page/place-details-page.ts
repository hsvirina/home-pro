import {
  Component,
  OnInit,
  HostListener,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';

import { Place } from '../../core/models/place.model';
import { PlacesService } from '../../core/services/places.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { AuthStateService } from '../../state/auth/auth-state.service';

import { CarouselSectionComponent } from './components/carousel-section.component';
import { InfoSectionComponent } from './components/info-section.component';
import { MainInfoSectionComponent } from './components/main-info-section.component';
import { AboutSectionComponent } from './components/about-section.component';
import { BreadcrumbsComponent } from '../../shared/components/breadcrumbs.component';
import { ReviewsSectionComponent } from './components/reviews-section.component';
import { ActionsSectorComponent } from './components/actions-sector.component';
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
      <app-breadcrumbs [lastLabel]="place.name"></app-breadcrumbs>

      <app-carousel-section
        [photoUrls]="place.photoUrls"
        [isFavorite]="isFavorite"
        (onToggleFavorite)="handleFavorite()"
        (onShare)="openShareModal()"
      ></app-carousel-section>

      <app-main-info-section [place]="place"></app-main-info-section>
      <app-info-section [place]="place"></app-info-section>
      <app-about-section [place]="place"></app-about-section>

      <app-reviews-section
        [cafeId]="place.id"
        [place]="place"
        [currentUser]="currentUser"
        [isMobile]="isMobile"
        [showAddReviewForm]="showAddReviewForm"
        [alwaysShowFormOnDesktop]="!isMobile"
        (closeAddReviewForm)="showAddReviewForm = false"
      ></app-reviews-section>

      <app-actions-sector
        [isFavorite]="isFavorite"
        [isMobile]="isMobile"
        [showAddReviewForm]="showAddReviewForm"
        (leaveReviewClick)="handleLeaveReviewClick()"
        (onToggleFavorite)="handleFavorite()"
        (onShare)="openShareModal()"
      />
    </div>

    <!-- Login Modal -->
    <app-modal [isOpen]="showLoginModal" (close)="showLoginModal = false">
      <h4 class="mb-4 text-xl font-semibold">Please log in</h4>
      <p class="mb-4 text-gray-600">
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
export class PlaceDetailsPageComponent implements OnInit {
  place: Place | null = null;
  isMobile = false;
  showAddReviewForm = false;
  showLoginModal = false;
  showShareModal = false;
  copied = false;

  // Reference to the ReviewsSection for scrolling
  @ViewChild(ReviewsSectionComponent, { read: ElementRef })
  reviewsSectionRef!: ElementRef;

  private scrollToReviewForm = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private placesService: PlacesService,
    private favoritesService: FavoritesService,
    private authService: AuthStateService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.updateScreenMode();
    this.loadPlace();
  }

  // Listen to window resize events to update mobile/desktop mode
  @HostListener('window:resize')
  onResize() {
    this.updateScreenMode();
  }

  // Handle click on "Leave a Review" button
  handleLeaveReviewClick() {
    this.showAddReviewForm = true;

    // Scroll to the review form on mobile devices
    if (this.isMobile) {
      this.scrollToReviewForm = true;
    }
  }

  // Scroll to review form after view updates if requested
  ngAfterViewChecked() {
    if (this.scrollToReviewForm) {
      this.scrollToReviewForm = false;
      if (this.reviewsSectionRef) {
        this.reviewsSectionRef.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  }

  // Update screen mode flag based on window width
  private updateScreenMode() {
    this.isMobile = window.innerWidth < 1024;
    this.cdr.detectChanges(); // Trigger change detection after update
  }

  // Load place details by ID from route parameters
  private loadPlace() {
    const id = this.route.snapshot.paramMap.get('id');

    this.placesService.getPlaces().subscribe({
      next: (places) => {
        this.place = places.find((p) => p.id.toString() === id) || null;

        // Redirect to 404 if place not found
        if (!this.place) this.router.navigate(['/not-found']);
      },
      error: () => this.router.navigate(['/not-found']),
    });
  }

  // Get currently authenticated user
  get currentUser() {
    return this.authService.getCurrentUser();
  }

  // Check if current place is in user's favorites
  get isFavorite(): boolean {
    return !!(
      this.place &&
      this.currentUser &&
      this.currentUser.favoriteCafeIds.includes(this.place.id)
    );
  }

  // Navigate to authentication page
  navigateToAuth() {
    this.showLoginModal = false;
    this.router.navigate(['/auth']);
  }

  // Toggle favorite status for the current place
  handleFavorite() {
    if (!this.currentUser) {
      this.showLoginModal = true;
      return;
    }

    const cafeId = this.place!.id;
    const obs = this.isFavorite
      ? this.favoritesService.removeFavorite(cafeId)
      : this.favoritesService.addFavorite(cafeId);

    obs.subscribe({
      next: () => {
        const user = this.authService.getCurrentUser();
        if (!user) return;

        if (this.isFavorite) {
          // Remove cafe from user's favorites
          user.favoriteCafeIds = user.favoriteCafeIds.filter(
            (id) => id !== cafeId,
          );
        } else {
          // Add cafe to user's favorites
          user.favoriteCafeIds.push(cafeId);
        }

        this.cdr.detectChanges(); // Refresh UI after changes
      },
      error: () => {
        // Optionally handle error
      },
    });
  }

  // Generate shareable link for the current place
  get currentShareLink(): string {
    return `${window.location.origin}/places/${this.place?.id}`;
  }

  // Open share modal dialog
  openShareModal() {
    this.showShareModal = true;
    this.copied = false;
  }

  // Copy share link to clipboard and provide user feedback
  handleShare() {
    navigator.clipboard.writeText(this.currentShareLink).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 3000);
    });
  }
}
