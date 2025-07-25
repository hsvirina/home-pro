import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgForOf, NgClass } from '@angular/common';
import { Place } from '../../core/models/place.model';
import { PlaceCardType } from '../../core/constants/place-card-type.enum';
import { IconComponent } from './icon.component';
import { ICONS } from '../../core/constants/icons.constant';

@Component({
  selector: 'app-place-card',
  standalone: true,
  imports: [RouterLink, NgIf, NgForOf, NgClass, IconComponent],
  template: `
    <div
      class="box-border w-full overflow-hidden rounded-[40px] bg-[var(--color-white)] transition-shadow duration-300 hover:shadow-lg"
      [ngClass]="{
        'h-[554px]': cardType === PlaceCardType.Full,
        'h-[370px]': cardType === PlaceCardType.Favourites,
      }"
    >
      <!-- Card clickable area -->
      <a
        [routerLink]="['/catalog', place.id]"
        class="block w-full no-underline"
      >
        <!-- Place image -->
        <img
          [src]="place.photoUrls[0]"
          alt="Place Image"
          class="h-[222px] w-full rounded-t-[40px] object-cover"
        />

        <!-- Content section -->
        <div class="flex flex-col gap-[16px] p-[16px]">
          <!-- Title and rating -->
          <div class="flex h-[52px] items-start justify-between">
            <h5 class="text-[var(--color-gray-100)]">{{ place.name }}</h5>
            <div class="flex items-center gap-1">
              <span class="body-font-1 text-[var(--color-gray-75)]">{{
                place.rating
              }}</span>
              <app-icon [icon]="ICONS.Star" class="h-[17px] w-[15px]" />
            </div>
          </div>

          <!-- Short description (only in Full card) -->
          <p
            *ngIf="cardType === PlaceCardType.Full"
            class="body-font-1 line-clamp-3 h-[72px] overflow-hidden text-[var(--color-gray-100)]"
          >
            {{ place.shortDescription }}
          </p>

          <!-- Divider -->
          <div class="h-px w-full bg-[var(--color-gray-20)]"></div>

          <!-- Tags (truncated dynamically) -->
          <div
            *ngIf="cardType === PlaceCardType.Full"
            #tagsContainer
            class="flex h-[80px] flex-wrap gap-2 overflow-hidden"
          >
            <ng-container *ngFor="let tag of displayTags">
              <span
                class="body-font-2 whitespace-nowrap rounded-[40px] bg-[var(--color-gray-10)] px-[12px] py-[8px] text-[var(--color-gray-100)]"
              >
                {{ tag }}
              </span>
            </ng-container>
          </div>
        </div>
      </a>

      <!-- Footer: address and external link -->
      <a
        [href]="getGoogleMapsLink(place.address)"
        target="_blank"
        rel="noopener noreferrer"
        class="flex min-h-[48px] items-center justify-between rounded-b-[40px] px-[16px] pb-[16px] transition-colors duration-200 hover:bg-[var(--color-bg)]"
        (click)="$event.stopPropagation()"
      >
        <div class="flex items-center gap-[4px]">
          <app-icon [icon]="ICONS.Location" />
          <span class="body-font-1 text-[var(--color-gray-100)]">
            {{ place.address }}
          </span>
        </div>

        <app-icon [icon]="ICONS.ArrowDownRight" />
      </a>
    </div>
  `,
})
export class PlaceCardComponent implements AfterViewInit {
  @Input() place!: Place;
  @Input() cardType: PlaceCardType = PlaceCardType.Full;

  @ViewChild('tagsContainer', { static: false })
  tagsContainer!: ElementRef<HTMLDivElement>;

  displayTags: string[] = [];
  ICONS = ICONS;
  protected readonly PlaceCardType = PlaceCardType;

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
  ) {}

  /**
   * Build a Google Maps search link based on the address.
   */
  getGoogleMapsLink(address: string): string {
    return (
      'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(address)
    );
  }

  /**
   * Truncate tags to fit into two lines inside the container.
   */
  ngAfterViewInit(): void {
    if (this.cardType !== PlaceCardType.Full) return;

    this.displayTags = [];

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        this.displayTags = [...this.place.tags];
        this.cdr.detectChanges();

        setTimeout(() => {
          const container = this.tagsContainer.nativeElement;
          const maxWidth = container.clientWidth;

          const style = getComputedStyle(container);
          const gap = parseFloat(style.gap) || parseFloat(style.columnGap) || 0;

          const maxLines = 2;
          const children = Array.from(
            container.querySelectorAll('span'),
          ) as HTMLElement[];

          let currentLineWidth = 0;
          let lineCount = 1;
          const fitted: string[] = [];

          for (let i = 0; i < children.length; i++) {
            const childWidth = children[i].offsetWidth;

            if (currentLineWidth + childWidth <= maxWidth) {
              currentLineWidth += childWidth + gap;
            } else {
              lineCount++;
              if (lineCount > maxLines) break;
              currentLineWidth = childWidth;
            }

            fitted.push(this.place.tags[i]);
          }

          if (fitted.length < this.place.tags.length && fitted.length > 0) {
            fitted.pop();
            fitted.push('...');
          }

          this.ngZone.run(() => {
            this.displayTags = fitted;
            this.cdr.detectChanges();
          });
        }, 0);
      });
    });
  }
}
