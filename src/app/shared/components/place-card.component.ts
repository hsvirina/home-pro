import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  NgZone,
  EventEmitter,
  Output,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf, NgForOf, NgClass, AsyncPipe } from '@angular/common';
import { Place } from '../../core/models/place.model';
import { PlaceCardType } from '../../core/constants/place-card-type.enum';
import { IconComponent } from './icon.component';
import { ICONS } from '../../core/constants/icons.constant';
import { FavoriteToggleService } from '../../core/services/favorite-toggle.service';
import { ThemeService } from '../../core/services/theme.service';
import { Theme } from '../../core/models/theme.type';
import { Observable } from 'rxjs';
import { ThemedIconPipe } from '../../core/pipes/themed-icon.pipe';
import { StorageService } from '../../core/services/storage.service';
import { CheckInsService } from '../../core/services/check-ins.service';
import { AuthApiService } from '../../core/services/auth-api.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-place-card',
  standalone: true,
  imports: [NgIf, NgForOf, NgClass, IconComponent, AsyncPipe, ThemedIconPipe, TranslateModule],
  template: `
    <div
      (mouseenter)="isHovered = true"
      (mouseleave)="isHovered = false"
      class="box-border w-full cursor-pointer overflow-hidden rounded-[40px] transition-colors duration-300"
      [ngClass]="{
        'h-[570px]': cardType === PlaceCardType.Full,
        'h-[334px]': cardType === PlaceCardType.Favourites,
        'bg-[var(--color-white)] hover:bg-[var(--color-gray-10)]':
          (currentTheme$ | async) === 'light',
        'bg-[var(--color-bg-card)] hover:bg-[var(--color-gray-100)]':
          (currentTheme$ | async) === 'dark',
      }"
    >
      <!-- Card clickable area -->
      <div class="block w-full no-underline" (click)="onCardClick()">
        <!-- Place image -->
        <div class="relative">
          <img
            [src]="place.photoUrls[0]"
            alt="Place Image"
            class="h-[222px] w-full rounded-t-[40px] object-cover"
          />

          <!-- Rating badge -->
          <div
            class="absolute left-[12px] top-[12px] z-10 flex items-center justify-center gap-1 rounded-[40px] px-2 py-[4px] backdrop-blur"
            [ngClass]="{
              'bg-[#FFFFFF]/60': (currentTheme$ | async) === 'light',
              'bg-[#0D0D0D]/60': (currentTheme$ | async) === 'dark',
            }"
          >
            <span
              class="body-font-1"
              [ngClass]="{
                'text-[var(--color-gray-75)]':
                  (currentTheme$ | async) === 'light',
                'text-[var(--color-white)]': (currentTheme$ | async) === 'dark',
              }"
              >{{ place.rating }}</span
            >
            <app-icon [icon]="ICONS.Star" />
          </div>

          <!-- Favorite button -->
          <button
            (click)="onToggleFavorite($event)"
            class="absolute right-[12px] top-[12px] z-10 flex h-[32px] w-[32px] items-center justify-center rounded-[40px] p-[4px] backdrop-blur"
            [ngClass]="{
              'bg-[#FFFFFF]/60': (currentTheme$ | async) === 'light',
              'bg-[#0D0D0D]/60': (currentTheme$ | async) === 'dark',
            }"
            title="{{ 'BUTTON.ADD_TO_FAVORITES' | translate }}"
          >
            <app-icon
              [icon]="(isFavorite ? 'HeartBlueFill' : 'HeartBlue') | themedIcon"
            ></app-icon>
          </button>
        </div>

        <!-- Content section -->
        <div
          class="flex flex-col gap-[12px] p-[12px]"
          [ngClass]="{
            'text-[var(--color-gray-10)]': (currentTheme$ | async) === 'dark',
          }"
        >
          <!-- Title -->
          <div class="flex h-[52px] items-start justify-between">
            <h5
              [ngClass]="{
                'text-[var(--color-white)]': (currentTheme$ | async) === 'dark',
              }"
            >
              {{ place.name }}
            </h5>
          </div>

          <a
            [href]="getGoogleMapsLink(place.address)"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-center gap-2"
            (click)="$event.stopPropagation()"
          >
            <app-icon [icon]="ICONS.Location" />
            <span class="body-font-1 relative underline">
              {{ place.address }}
            </span>
          </a>

          <!-- Short description (only in Full card) -->
          <p
            *ngIf="cardType === PlaceCardType.Full"
            class="body-font-1 line-clamp-3 h-[72px] overflow-hidden"
          >
            {{ place.shortDescription }}
          </p>

          <!-- Tags (truncated dynamically) -->
          <div
            *ngIf="cardType === PlaceCardType.Full"
            #tagsContainer
            class="flex h-[80px] flex-wrap gap-2 overflow-hidden"
          >
            <ng-container *ngIf="cardType === PlaceCardType.Full">
              <span
                *ngFor="let tag of displayTags"
                class="body-font-2 whitespace-nowrap rounded-[40px] px-[12px] py-[8px]"
                [style.background-color]="
                  (currentTheme$ | async) === 'dark'
                    ? isHovered
                      ? 'var(--color-bg)'
                      : 'var(--color-gray-100)'
                    : 'var(--color-secondary)'
                "
                style="transition: background-color 0.3s ease"
              >
                {{ tag.name }}
              </span>
              <span
                *ngIf="showEllipsis"
                class="body-font-2 whitespace-nowrap rounded-[40px] px-[12px] py-[8px]"
                [style.background-color]="
                  (currentTheme$ | async) === 'dark'
                    ? isHovered
                      ? 'var(--color-bg)'
                      : 'var(--color-gray-100)'
                    : 'var(--color-secondary)'
                "
                style="transition: background-color 0.3s ease"
              >
                ...
              </span>
            </ng-container>
          </div>

          <button
            *ngIf="cardType === PlaceCardType.Full"
            class="button-bg-transparent gap-2 py-3"
            (click)="onCheckInClick($event)"
            [disabled]="isCheckedIn"
            [title]="
    isCheckedIn
      ? ('CHECK_IN.ALREADY_CHECKED_IN' | translate)
      : ('CHECK_IN.CHECK_IN' | translate)
  "
          >
            <ng-container *ngIf="isAuthenticated; else learnMore">
              <app-icon
                [icon]="isCheckedIn ? ICONS.CheckCircle : ICONS.AddCircle"
              ></app-icon>
              {{ isCheckedIn ? ('CHECK_IN.CHECKED_IN' | translate) : ('CHECK_IN.CHECK_IN' | translate) }}
            </ng-container>
            <ng-template #learnMore> {{ 'BUTTON.LEARN_MORE' | translate }} </ng-template>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class PlaceCardComponent implements AfterViewInit {
  @Input() place!: Place;
  @Input() cardType: PlaceCardType = PlaceCardType.Full;
  @Output() unauthorizedFavoriteClick = new EventEmitter<void>();

  displayTags: { id: number; name: string }[] = [];
  ICONS = ICONS;
  protected readonly PlaceCardType = PlaceCardType;

  isHovered = false;
  showEllipsis = false;
  isCheckedIn = false;

  readonly currentTheme$: Observable<Theme>;

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private router: Router,
    private favoriteToggleService: FavoriteToggleService,
    private themeService: ThemeService,
    private storageService: StorageService,
    private checkInsService: CheckInsService,
    private userService: AuthApiService,
  ) {
    this.currentTheme$ = this.themeService.theme$;
  }

  ngOnChanges() {
    if (this.place?.tags) {
      this.displayTags = [...this.place.tags];
    }
    this.updateCheckInStatus();
  }
  /** Определяет, добавлен ли объект в избранное */
  get isFavorite(): boolean {
    return this.favoriteToggleService.isFavorite(this.place.id);
  }

  get isAuthenticated(): boolean {
    return !!this.storageService.getUser();
  }

  onCardClick(): void {
    this.router.navigate(['/catalog', this.place.id]);
  }

  @Output() favoriteToggled = new EventEmitter<{
    placeId: number;
    isFavorite: boolean;
  }>();

  onToggleFavorite(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.favoriteToggleService.toggleFavorite(this.place).subscribe({
      next: () => {
        this.cdr.detectChanges();
        this.favoriteToggled.emit({
          placeId: this.place.id,
          isFavorite: this.isFavorite,
        });
      },
      error: (err) => {
        if (err.message === 'NOT_AUTHENTICATED') {
          this.unauthorizedFavoriteClick.emit();
        } else {
          alert('An error occurred while updating favorites.');
        }
      },
    });
  }

  navigateToAuth() {
    localStorage.setItem('returnUrl', this.router.url);

    this.router.navigate(['/auth']);
  }

  /** Построение ссылки на Google Maps */
  getGoogleMapsLink(address: string): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }

  /** Отображение тегов */
  @ViewChild('tagsContainer', { static: false })
  tagsContainer!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    if (this.cardType !== PlaceCardType.Full) return;

    this.displayTags = [...this.place.tags];
    this.updateCheckInStatus();

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        // Безопасно маппим tags, чтобы гарантировать, что displayTags - строки

        this.displayTags = [...this.place.tags];

        this.cdr.detectChanges();

        setTimeout(() => {
          const container = this.tagsContainer.nativeElement;
          const maxWidth = container.clientWidth;

          const style = getComputedStyle(container);
          const gap = parseFloat(style.gap) || 0;

          const maxLines = 2;
          const children = Array.from(
            container.querySelectorAll('span'),
          ) as HTMLElement[];

          let currentLineWidth = 0;
          let lineCount = 1;
          const fitted: { id: number; name: string }[] = [];

          for (let i = 0; i < children.length; i++) {
            const childWidth = children[i].offsetWidth;

            if (currentLineWidth + childWidth <= maxWidth) {
              currentLineWidth += childWidth + gap;
            } else {
              lineCount++;
              if (lineCount > maxLines) break;
              currentLineWidth = childWidth;
            }

            // Вместо this.place.tags[i] используем displayTags[i], чтобы соответствовать отображаемым тегам
            fitted.push(this.displayTags[i]);
          }

          if (fitted.length < this.displayTags.length && fitted.length > 0) {
            fitted.pop();
            this.showEllipsis = true;
          }

          this.ngZone.run(() => {
            this.displayTags = fitted;
            this.cdr.detectChanges();
          });
        }, 0);
      });
    });
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
      // Просто позволяем всплытие, чтоб onCardClick сработал
      return;
    }

    // Предотвращаем всплытие — чтоб карточка не кликалась
    event.preventDefault();
    event.stopPropagation();

    if (this.isCheckedIn) {
      return;
    }

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
              this.router.navigate(['/catalog', this.place.id]); // ⬅ переход после чекина
            },
            error: (err) => {
              console.error('Ошибка при обновлении публичного профиля:', err);
            },
          });
      },
      error: (err) => {
        console.error('Ошибка при выполнении чекина:', err);
      },
    });
  }
}
