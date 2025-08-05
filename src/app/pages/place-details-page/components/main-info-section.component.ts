import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Place } from '../../../core/models/place.model';
import { IconComponent } from '../../../shared/components/icon.component';
import { IconData, ICONS } from '../../../core/constants/icons.constant';
import { FILTER_CATEGORIES } from '../../../core/constants/catalog-filter.config';
import { Observable } from 'rxjs';
import { Theme } from '../../../core/models/theme.type';
import { ThemeService } from '../../../core/services/theme.service';
import { ThemedIconPipe } from '../../../core/pipes/themed-icon.pipe';
import { Router } from '@angular/router';
import { CheckInsService } from '../../../core/services/check-ins.service';
import { StorageService } from '../../../core/services/storage.service';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { TranslateModule } from '@ngx-translate/core';

type FlexibleIcon =
  | IconData
  | {
      iconURL: string;
      iconURLDarkThema?: string;
      label: string;
    };

@Component({
  selector: 'app-main-info-section',
  standalone: true,
  imports: [CommonModule, IconComponent, ThemedIconPipe, TranslateModule],
  template: `
    <div
      class="flex flex-col gap-6"
      [ngClass]="{
        'text-[var(--color-gray-20)]': (currentTheme$ | async) === 'dark',
      }"
    >
      <h3>{{ place.name }}</h3>

      <div class="body-font-1 flex-col lg:flex-row flex justify-between gap-[32px]">
        <!-- Левая часть -->
        <div
          class="flex flex-1 flex-col gap-2"
          [ngClass]="{
            'text-[var(--color-gray-75)]': (currentTheme$ | async) === 'light',
            'text-[var(--color-gray-20)]': (currentTheme$ | async) === 'dark',
          }"
        >
          <div class="flex gap-2">
            <div class="flex items-center gap-2">
              <app-icon [icon]="ICONS.Star" />
              <span>{{ place.rating }}</span>
            </div>
            <span>({{ place.reviewCount }})</span>
          </div>

          <div class="flex items-center gap-2">
            <app-icon [icon]="ICONS.Location" />
            <a
              [href]="googleMapsUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="underline"
              style="underline"
            >
              {{ place.address }}
            </a>
          </div>
        </div>

        <!-- Правая часть -->
        <div class="flex-1" *ngIf="place?.workingHours">
          <div class="gap-[20px]">
            <div
              class="flex items-center justify-center gap-3 rounded-[40px] px-6 py-2"
              [ngClass]="{
                'bg-[var(--color-bg-2)] text-[var(--color-gray-100)]':
                  (currentTheme$ | async) === 'light',
                'bg-[var(--color-bg-card)] text-[var(--color-gray-20)]':
                  (currentTheme$ | async) === 'dark',
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

      <div class="flex flex-col gap-4">
        <h5>{{ 'mainInfo.aboutCafe' | translate }}</h5>

        <span class="body-font-1">{{ place.longDescription }}</span>

        <div class="flex flex-wrap gap-2" *ngIf="place?.tags?.length">
          <div
            *ngFor="let tag of place.tags"
            class="tag-item flex items-center justify-center gap-2 rounded-[40px] px-4 py-2"
            [ngClass]="{
              'bg-[var(--color-secondary)]':
                (currentTheme$ | async) === 'light',
              'bg-[var(--color-bg-card)]': (currentTheme$ | async) === 'dark',
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

      <button
        class="w-full button-bg-transparent lg:w-1/2 gap-2 py-3 px-4"
        (click)="onCheckInClick($event)"
        [disabled]="isCheckedIn"
        [title]="
          isCheckedIn
            ? ('mainInfo.alreadyCheckedIn' | translate)
            : isAuthenticated
              ? ('mainInfo.checkIn' | translate)
              : ('mainInfo.pleaseLoginToCheckIn' | translate)
        "
      >
        <ng-container *ngIf="isAuthenticated; else notAuth">
          <app-icon
            [icon]="isCheckedIn ? ICONS.CheckCircle : ICONS.AddCircle"
          ></app-icon>
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
    this.TAG_ICON_MAP = {};
    for (const category of FILTER_CATEGORIES) {
      for (const option of category.options) {
        this.TAG_ICON_MAP[option.id.toString()] = {
          iconURL: option.iconURL ?? '',
          iconURLDarkThema: option.iconURLDarkThema ?? '',
          label: option.label,
        };
      }
    }

    console.log('TAG_ICON_MAP:', this.TAG_ICON_MAP);
  }

  ngOnInit(): void {
    this.updateCheckInStatus();

    if (this.place?.tags?.length) {
      this.place.tags.forEach((tag) => {
        const icon = this.TAG_ICON_MAP[tag.key];
        if (!icon) {
          console.warn(`No icon found for tag key: "${tag.key}"`);
        } else {
          console.log(`Found icon for tag key: "${tag.key}"`, icon);
        }
      });
    }
  }

  get isAuthenticated(): boolean {
    return !!this.storageService.getUser();
  }

  get googleMapsUrl(): string {
    const query = encodeURIComponent(
      `${this.place.address}, ${this.place.city}`,
    );
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  isIconData(icon: FlexibleIcon): icon is IconData {
    return 'viewBox' in icon;
  }

  getIconURL(icon: FlexibleIcon): string {
    if (this.isIconData(icon)) {
      return '';
    }

    return this.themeService.currentTheme === 'dark' && icon.iconURLDarkThema
      ? icon.iconURLDarkThema
      : icon.iconURL;
  }

  getIconLabel(icon: FlexibleIcon): string {
    if (this.isIconData(icon)) {
      return '';
    }
    return icon.label;
  }

  private updateCheckInStatus(): void {
    if (!this.place) return;

    const publicProfile = this.storageService.getPublicUserProfile();

    if (publicProfile && publicProfile.checkInCafes) {
      this.isCheckedIn = publicProfile.checkInCafes.some(
        (cafe) => cafe.id === this.place.id,
      );
    } else {
      this.isCheckedIn = false;
    }
    this.cdr.detectChanges();
  }

  onCheckInClick(event: MouseEvent): void {
    if (!this.isAuthenticated) {
      // Неавторизованный — перенаправляем на вход
      this.router.navigate(['/auth']);
      return;
    }

    if (this.isCheckedIn) {
      // Уже зачекинено — ничего не делаем
      return;
    }

    // Предотвращаем всплытие клика, если нужно
    event.preventDefault();
    event.stopPropagation();

    this.performCheckIn();
  }

  private performCheckIn(): void {
    this.checkInsService.checkInToCafe(this.place.id).subscribe({
      next: () => {
        this.userService
          .getPublicUserProfile(this.storageService.getUser()?.userId || 0)
          .subscribe({
            next: (profile) => {
              this.storageService.setPublicUserProfile(profile);
              this.isCheckedIn = true;
              this.cdr.detectChanges();
              this.router.navigate(['/catalog', this.place.id]);
            },
            error: (err) => {
              console.error('Ошибка обновления профиля:', err);
            },
          });
      },
      error: (err) => {
        console.error('Ошибка при выполнении чекина:', err);
      },
    });
  }
}
