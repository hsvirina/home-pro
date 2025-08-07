import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Place } from '../../../core/models/place.model';
import { IconComponent } from '../../../shared/components/icon.component';
import { IconData, ICONS } from '../../../core/constants/icons.constant';
import { FILTER_CATEGORIES } from '../../../core/constants/catalog-filter.config';
import { Observable } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { Router } from '@angular/router';
import { CheckInsService } from '../../../core/services/check-ins.service';
import { StorageService } from '../../../core/services/storage.service';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { TranslateModule } from '@ngx-translate/core';
import { Theme } from '../../../core/models/theme.type';
import { ThemedIconPipe } from '../../../core/pipes/themed-icon.pipe';

export type FlexibleIcon =
  | IconData
  | {
      iconURL: string;
      iconURLDarkTheme?: string;
      label: string;
    };

@Component({
  selector: 'app-main-info-section',
  standalone: true,
  imports: [CommonModule, IconComponent, TranslateModule, ThemedIconPipe],
  template: `
    <div
      [ngClass]="{
        'text-[var(--color-gray-20)]': (currentTheme$ | async) === 'dark',
        'text-[var(--color-gray-75)]': (currentTheme$ | async) === 'light'
      }"
      class="flex flex-col gap-6"
    >
      <h3>{{ place.name }}</h3>

      <div class="body-font-1 flex flex-col justify-between gap-[32px] lg:flex-row">
        <!-- Rating and Reviews -->
        <div
          class="flex flex-1 flex-col gap-2"
          [ngClass]="{
            'text-[var(--color-gray-75)]': (currentTheme$ | async) === 'light',
            'text-[var(--color-gray-20)]': (currentTheme$ | async) === 'dark'
          }"
        >
          <div class="flex gap-2">
            <div class="flex items-center gap-2">
              <app-icon [icon]="ICONS.Star" />
              <span>{{ place.rating }}</span>
            </div>
            <span>({{ place.reviewCount }})</span>
          </div>

          <!-- Address with link to Google Maps -->
          <div class="flex items-center gap-2">
            <app-icon [icon]="ICONS.Location" />
            <a
              [href]="googleMapsUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="underline"
            >
              {{ place.address }}
            </a>
          </div>
        </div>

        <!-- Working hours -->
        <div class="flex-1" *ngIf="place?.workingHours">
          <div class="gap-[20px]">
            <div
              class="flex items-center justify-center gap-3 rounded-[40px] px-6 py-2"
              [ngClass]="{
                'bg-[var(--color-bg-2)] text-[var(--color-gray-100)]':
                  (currentTheme$ | async) === 'light',
                'bg-[var(--color-bg-card)] text-[var(--color-gray-20)]':
                  (currentTheme$ | async) === 'dark'
              }"
            >
              <app-icon [icon]="'Clock' | themedIcon"></app-icon>
              <div class="flex flex-col justify-center gap-1 text-center">
                <span class="menu-text-font">{{ 'mainInfo.openingHours' | translate }}</span>
                <span class="body-font-1">{{ place.workingHours }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- About section -->
      <div class="flex flex-col gap-4">
        <h5>{{ 'mainInfo.aboutCafe' | translate }}</h5>
        <span class="body-font-1">{{ place.longDescription }}</span>

        <!-- Tags with icons -->
        <div class="flex flex-wrap gap-2" *ngIf="place?.tags?.length">
          <div
            *ngFor="let tag of place.tags"
            class="tag-item flex items-center justify-center gap-2 rounded-[40px] px-4 py-2"
            [ngClass]="{
              'bg-[var(--color-secondary)]': (currentTheme$ | async) === 'light',
              'bg-[var(--color-bg-card)]': (currentTheme$ | async) === 'dark'
            }"
          >
            <ng-container *ngIf="TAG_ICON_MAP[tag.id.toString()] as icon">
              <ng-container *ngIf="isIconData(icon); else customIcon">
                <app-icon [icon]="icon"></app-icon>
              </ng-container>
              <ng-template #customIcon>
                <img [src]="getIconURL(icon)" [alt]="getIconLabel(icon)" />
              </ng-template>
            </ng-container>
            <span class="body-font-2">{{ tag.name }}</span>
          </div>
        </div>
      </div>

      <!-- Check-in button -->
      <button
        class="button-bg-transparent w-full gap-2 px-4 py-3 lg:w-1/2"
        (click)="onCheckInClick($event)"
        [disabled]="isCheckedIn"
        [title]="checkInTitle"
      >
        <ng-container *ngIf="isAuthenticated; else notAuth">
          <app-icon [icon]="isCheckedIn ? ICONS.CheckCircle : ICONS.AddCircle"></app-icon>
          {{
            isCheckedIn
              ? ('mainInfo.checkedIn' | translate)
              : ('mainInfo.checkIn' | translate)
          }}
        </ng-container>
        <ng-template #notAuth>
          <app-icon [icon]="ICONS.AddCircle"></app-icon>
          {{ 'mainInfo.logInToCheckIn' | translate }}
        </ng-template>
      </button>
    </div>
  `,
})
export class MainInfoSectionComponent implements OnInit {
  @Input() place!: Place;

  currentTheme$: Observable<Theme>;

  ICONS = ICONS;

  TAG_ICON_MAP: Record<string, FlexibleIcon> = {};

  isCheckedIn = false;

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private checkInsService: CheckInsService,
    private storageService: StorageService,
    private userService: AuthApiService,
    private cdr: ChangeDetectorRef,
  ) {
    this.currentTheme$ = this.themeService.theme$;
    this.initializeTagIconMap();
  }

  /** Initialize tag to icon mapping based on filter config */
  private initializeTagIconMap(): void {
    FILTER_CATEGORIES.forEach((category) => {
      category.options.forEach((option) => {
        this.TAG_ICON_MAP[option.id.toString()] = {
          iconURL: option.iconURL ?? '',
          iconURLDarkTheme: option.iconURLDarkTheme ?? '',
          label: option.label,
        };
      });
    });
  }

  ngOnInit(): void {
    this.updateCheckInStatus();
  }

  /** Returns whether the user is authenticated */
  get isAuthenticated(): boolean {
    return !!this.storageService.getUser();
  }

  /** Returns Google Maps search URL for place's address */
  get googleMapsUrl(): string {
    const query = encodeURIComponent(`${this.place.address}, ${this.place.city}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  /** Returns translated tooltip/title for check-in button */
  get checkInTitle(): string {
    if (this.isCheckedIn) {
      return 'mainInfo.alreadyCheckedIn';
    }
    if (this.isAuthenticated) {
      return 'mainInfo.checkIn';
    }
    return 'mainInfo.pleaseLoginToCheckIn';
  }

  /** Type guard to check if icon is IconData */
  isIconData(icon: FlexibleIcon): icon is IconData {
    return 'viewBox' in icon;
  }

  /** Get icon URL depending on current theme */
  getIconURL(icon: FlexibleIcon): string {
    if (this.isIconData(icon)) return '';
    return this.themeService.currentTheme === 'dark' && icon.iconURLDarkTheme
      ? icon.iconURLDarkTheme
      : icon.iconURL;
  }

  /** Get label for custom icon */
  getIconLabel(icon: FlexibleIcon): string {
    if (this.isIconData(icon)) return '';
    return icon.label;
  }

  /** Update check-in status from stored user profile */
  private updateCheckInStatus(): void {
    if (!this.place) return;

    const publicProfile = this.storageService.getPublicUserProfile();
    this.isCheckedIn =
      publicProfile?.checkInCafes?.some((cafe) => cafe.id === this.place.id) ?? false;

    this.cdr.detectChanges();
  }

  /**
   * Handles user clicking on the Check-in button.
   * Redirects to login if unauthenticated,
   * or performs check-in if allowed.
   */
  onCheckInClick(event: MouseEvent): void {
    if (!this.isAuthenticated) {
      this.router.navigate(['/auth']);
      return;
    }

    if (this.isCheckedIn) return;

    event.preventDefault();
    event.stopPropagation();
    this.performCheckIn();
  }

  /**
   * Perform check-in via service, update user profile and UI state,
   * notify other components about check-in update.
   */
  private performCheckIn(): void {
    this.checkInsService.checkInToCafe(this.place.id).subscribe({
      next: () => {
        this.userService
          .getPublicUserProfile(this.storageService.getUser()?.userId || 0)
          .subscribe({
            next: (profile) => {
              this.storageService.setPublicUserProfile(profile);
              this.isCheckedIn = true;

              // Notify subscribers that check-ins have been updated
              this.checkInsService['checkInsUpdatedSource'].next();

              this.cdr.detectChanges();
              this.router.navigate(['/catalog', this.place.id]);
            },
            error: (err) => console.error('Error updating user profile:', err),
          });
      },
      error: (err) => console.error('Error performing check-in:', err),
    });
  }
}
