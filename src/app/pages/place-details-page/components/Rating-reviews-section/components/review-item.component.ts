import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  HostListener,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Review } from '../../../../../core/models/review.model';
import { BadgeType } from '../../../../../core/utils/badge-utils';
import { ICONS } from '../../../../../core/constants/icons.constant';
import { BadgeImagePipe } from '../../../../../core/pipes/badge-image.pipe';

import { IconComponent } from '../../../../../shared/components/icon.component';
import { FlipNumberComponent } from './flip-number.component';
import { UserMenuComponent } from '../../../../../layout/Header/components/user-menu.component';
import { ModalComponent } from '../../../../../shared/components/modal.component';

import { FlexibleIcon } from '../../main-info-section.component';

@Component({
  selector: 'app-review-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IconComponent,
    BadgeImagePipe,
    FlipNumberComponent,
    UserMenuComponent,
    ModalComponent,
    TranslateModule,
  ],
  providers: [DatePipe],
  template: `
    <div class="flex gap-4 px-[18px] py-[15px]">
      <!-- User profile link with avatar and badge -->
      <a
        [routerLink]="['/users', review.userId]"
        class="relative inline-block bg-transparent"
      >
        <div
          class="relative flex items-center justify-center"
          [ngStyle]="{
            width: isMobile ? '50px' : '113px',
            height: isMobile ? '50px' : '113px',
          }"
        >
          <img
            *ngIf="badgeType | badgeImage as badgeImg"
            [src]="badgeImg"
            alt="badge"
            class="absolute left-1/2 top-1/2 z-0"
            [ngStyle]="{
              width: isMobile ? '50px' : '113px',
              height: isMobile ? '50px' : '113px',
              transform: 'translate(-50%, -50%)',
              objectFit: 'contain',
            }"
          />
          <div
            class="absolute left-1/2 top-1/2 z-10"
            [ngStyle]="{
              transform: 'translate(-50%, -50%)',
              width: isMobile ? '40px' : '100px',
              height: isMobile ? '40px' : '100px',
            }"
          >
            <app-user-menu
              [userPhoto]="review.userPhotoUrl"
              [avatarSize]="isMobile ? 40 : 100"
              [badgeSize]="isMobile ? 50 : 113"
              [hasBadge]="hasBadge"
            ></app-user-menu>
          </div>
        </div>
      </a>

      <!-- Review content and controls -->
      <div
        class="flex w-full flex-col justify-between gap-2 lg:flex-row lg:gap-0"
      >
        <!-- Left block: user name, review text, rating stars -->
        <div class="flex flex-1 flex-col gap-2">
          <span class="menu-text-font"
            >{{ review.userName }} {{ review.userSurname }}</span
          >
          <span class="body-font-1" *ngIf="review.text">{{ review.text }}</span>
          <div class="flex gap-[2px]">
            <ng-container *ngFor="let star of getStarsArray(review.rating)">
              <app-icon [icon]="ICONS.Star" />
            </ng-container>
          </div>
        </div>

        <!-- Right block: date, delete and like buttons -->
        <div
          class="w-22 relative flex flex-shrink-0 justify-between lg:h-[113px] lg:flex-col"
        >
          <div
            class="flex"
            [ngClass]="{ 'items-end': true, 'lg:items-center': true }"
          >
            <span class="body-font-2">{{ formatDate(review.createdAt) }}</span>
          </div>

          <div class="flex justify-between">
            <button
              *ngIf="currentUserId === review.userId"
              (click)="onDeleteClick()"
              class="cursor-pointer border-none bg-none"
              aria-label="Delete review"
            >
              <app-icon [icon]="ICONS.Close" />
            </button>

            <!-- Like section with animated count -->
            <div class="body-font-2 ml-auto flex items-end gap-1">
              <app-flip-number [value]="roundedLikesCount"></app-flip-number>
              <button
                (click)="onToggleLike()"
                aria-label="Like review"
                class="flex cursor-pointer items-end border-none"
              >
                <app-icon [icon]="getLikeIcon()" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Login modal for unauthorized users -->
      <app-modal
        [isOpen]="showLoginModal"
        (close)="closeLoginModal()"
        [width]="'400px'"
      >
        <div class="flex flex-col items-center p-4 text-center">
          <h3 class="mb-4 text-xl font-semibold">
            {{ 'modals.loginTitle' | translate }}
          </h3>
          <p class="body-font-1 mb-4">
            {{ 'modals.loginMessageForLike' | translate }}
          </p>
          <button class="btn btn-primary" (click)="goToLogin()">
            {{ 'modals.loginBtn' | translate }}
          </button>
        </div>
      </app-modal>
    </div>
  `,
  styles: [
    `
      .liked app-icon {
        color: red; /* Style for liked icon */
      }
    `,
  ],
})
export class AppReviewItemComponent implements OnDestroy, OnChanges {
  @Input() review!: Review; // Review data to display
  @Input() badgeType: BadgeType = null; // Badge type for the user
  @Input() currentUserId: number | null = null; // Current logged-in user ID (used for permission checks)
  @Input() likesInfo: { likedByCurrentUser: boolean; totalLikes: number } = {
    likedByCurrentUser: false,
    totalLikes: 0,
  }; // Likes information
  @Input() isLoggedIn = false; // Flag indicating if user is logged in
  @Output() delete = new EventEmitter<number>(); // Emits when the delete button is clicked
  @Output() toggleLike = new EventEmitter<boolean>(); // Emits when the like toggle button is clicked

  animatedLikesCount = 0; // Current animated likes count for flip number display
  readonly ICONS = ICONS; // Icons constant
  isMobile = false; // Flag to detect mobile layout
  showLoginModal = false; // Controls the visibility of the login modal
  private animationInterval: any = null; // Interval for animation

  constructor(
    private datePipe: DatePipe,
    private elRef: ElementRef,
    private translate: TranslateService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.checkScreenSize(); // Initialize screen size check
  }

  /** Lifecycle hook: cleanup interval on destroy */
  ngOnDestroy(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval); // Clear interval on destroy
    }
  }

  /** Lifecycle hook: react to input changes */
  ngOnChanges(changes: SimpleChanges): void {
    const likesChange = changes['likesInfo'];

    // Animate the like count if it's changed
    if (
      likesChange &&
      likesChange.currentValue &&
      likesChange.previousValue &&
      likesChange.previousValue.totalLikes !==
        likesChange.currentValue.totalLikes
    ) {
      this.animateLikesCount(likesChange.currentValue.totalLikes);
    } else if (likesChange?.currentValue && !likesChange.previousValue) {
      this.animatedLikesCount = likesChange.currentValue.totalLikes;
    }

    this.cdr.markForCheck(); // Trigger change detection to update the view
  }

  /** Emits delete event with review ID */
  onDeleteClick(): void {
    this.delete.emit(this.review.id);
  }

  /** Handles like toggle action */
  onToggleLike(): void {
    if (!this.isLoggedIn) {
      this.showLoginModal = true;
      return;
    }
    this.toggleLike.emit(!this.likesInfo.likedByCurrentUser);

    // Update likes info
    this.likesInfo = {
      likedByCurrentUser: !this.likesInfo.likedByCurrentUser,
      totalLikes: this.likesInfo.likedByCurrentUser
        ? this.likesInfo.totalLikes - 1
        : this.likesInfo.totalLikes + 1,
    };

    // Trigger change detection to update the view
    this.cdr.markForCheck();
  }

  /** Closes the login modal */
  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  /** Navigates to the login page */
  goToLogin(): void {
    this.showLoginModal = false;
    this.router.navigate(['/auth']);
  }

  /** Returns the icon for the like button based on the like status */
  getLikeIcon(): FlexibleIcon {
    if (!this.isLoggedIn) {
      return this.likesInfo.totalLikes > 0
        ? this.ICONS.LikeFill
        : this.ICONS.Like;
    }
    return this.likesInfo.likedByCurrentUser
      ? this.ICONS.LikeFill
      : this.ICONS.Like;
  }

  /** Creates an array of stars for rating display */
  getStarsArray(rating: number): number[] {
    return Array.from({ length: rating }, (_, i) => i + 1);
  }

  /** Formats the date to a readable format */
  formatDate(dateString: string): string | null {
    return this.datePipe.transform(dateString, 'MMM dd, yyyy');
  }

  /** Detects screen size to handle mobile layout */
  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 1024; // Define mobile layout
  }

  /** Indicates if the user has a badge */
  get hasBadge(): boolean {
    return !!this.badgeType;
  }

  /** Returns the rounded value for the animated likes count */
  get roundedLikesCount(): number {
    return Math.round(this.animatedLikesCount);
  }

  /** Animates the like count change smoothly */
  animateLikesCount(target: number): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval); // Clear any ongoing animation
    }

    if (target === 0) {
      this.animatedLikesCount = 0;
      return;
    }

    const duration = 500; // Duration of the animation in milliseconds
    const fps = 60; // Frames per second
    const steps = Math.ceil((duration / 1000) * fps); // Number of steps for animation
    const start = this.animatedLikesCount;
    const increment = (target - start) / steps; // Calculate increment for each frame

    let step = 0;

    // Set up interval for smooth animation
    this.animationInterval = setInterval(() => {
      step++;
      this.animatedLikesCount += increment;

      if (step >= steps) {
        this.animatedLikesCount = target;
        clearInterval(this.animationInterval); // Stop animation when finished
        this.animationInterval = null;
      }
    }, 1000 / fps);

    // Trigger change detection after animation ends
    setTimeout(() => {
      this.cdr.markForCheck();
    }, duration);
  }
}
