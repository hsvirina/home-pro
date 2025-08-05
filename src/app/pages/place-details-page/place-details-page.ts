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
      <div class="xxl: grid xxl:grid-cols-8 xxl:gap-5">
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
      ></app-last-check-ins>

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
      <p class="menu-text-font mb-4 text-center text-[var(--color-gray-75)]">
        {{ 'modals.loginMessage' | translate }}
      </p>
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
  place: Place | null = null;

  isMobile = false;
  showAddReviewForm = false;
  showLoginModal = false;
  showShareModal = false;
  copied = false;

  private scrollToReviewForm = false;

  @ViewChild(RatingReviewsSectionComponent, { read: ElementRef })
  reviewsSectionRef!: ElementRef;
  randomPlaces: Place[] = [];

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

  /** Lifecycle hook: Initialize component and load place data */
  ngOnInit(): void {
    this.updateScreenMode();

    // при первой и всех последующих сменах id
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) {
        this.router.navigate(['/not-found']);
        return;
      }

      const lang = localStorage.getItem('lang') || 'en';
      this.loadPlaceData(lang, id);
    });

    // если язык меняется, перезагружаем данные для текущего id
    this.translate.onLangChange.subscribe((event) => {
      const id = this.route.snapshot.paramMap.get('id'); // можно оставить snapshot здесь
      if (id) {
        this.loadPlaceData(event.lang, id);
      }
    });
  }

  loadPlaceData(lang: string, id: string) {
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

        this.randomPlaces = this.shuffleArray(
          places.filter((p) => p.id !== this.place!.id),
        ).slice(0, 8);

        this.loaderService.hide();
      },
      error: (err) => {
        this.router.navigate(['/not-found']);
        this.loaderService.hide();
      },
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

  private shuffleArray(array: Place[]): Place[] {
    return array
      .map((item) => ({ sort: Math.random(), value: item }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
  }

  /** Window resize event handler - update screen mode and form visibility */
  @HostListener('window:resize')
  onResize() {
    this.updateScreenMode();
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
  onToggleFavorite(event?: MouseEvent) {
    event?.preventDefault();
    event?.stopPropagation();

    if (!this.place) return; // ✅ Защита от null

    this.favoriteToggleService.toggleFavorite(this.place).subscribe({
      next: () => this.cdr.detectChanges(),
      error: (err) => {
        if (err.message === 'NOT_AUTHENTICATED') {
          this.showLoginModal = true;
        } else {
          alert('An error occurred while updating favorites.');
        }
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

  get isFavorite(): boolean {
    return this.place
      ? this.favoriteToggleService.isFavorite(this.place.id)
      : false;
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
