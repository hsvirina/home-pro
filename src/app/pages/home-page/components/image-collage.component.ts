import { Component, HostListener, ChangeDetectorRef } from '@angular/core';
import { NgForOf, NgStyle } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon.component';
import { ThemedIconPipe } from '../../../core/pipes/themed-icon.pipe';

@Component({
  selector: 'app-image-collage',
  standalone: true,
  imports: [NgForOf, NgStyle, IconComponent, ThemedIconPipe],
  template: `
    <!-- Mobile layout -->
    <div class="relative flex h-[356px] w-full flex-col items-center justify-center xxl:hidden">
      <app-icon
        [icon]="'StarsCollage' | themedIcon"
        [width]="starIconWidth"
        [height]="starIconHeight"
        class="absolute left-5 top-0 z-10"
      ></app-icon>

      <app-icon
        [icon]="'StarsCollage' | themedIcon"
        [width]="starIconWidth"
        [height]="starIconHeight"
        class="absolute bottom-0 right-5 z-10"
      ></app-icon>

      <div class="flex w-full flex-col items-center justify-center gap-0 px-5">
        <!-- Top row images with fixed negative rotation -->
        <div class="mt-4 flex -space-x-[10px]">
          <div
            *ngFor="let image of images.slice(0, 3); let i = index"
            class="overflow-hidden rounded-[16px]"
            [ngStyle]="{
              width: 'clamp(106px, 28vw, 172px)',
              height: 'clamp(106px, 42vw, 157px)',
              zIndex: getZIndex(i),
              transform: 'rotate(-9.96deg)'
            }"
          >
            <img
              [src]="image"
              alt="Collage image"
              class="h-full w-full rounded-[16px] object-cover"
            />
          </div>
        </div>

        <!-- Bottom row images with fixed positive rotation -->
        <div class="relative -mt-12 flex -space-x-[10px]">
          <div
            *ngFor="let image of images.slice(3); let i = index"
            class="overflow-hidden rounded-[16px]"
            [ngStyle]="{
              width: 'clamp(106px, 28vw, 172px)',
              height: 'clamp(158px, 42vw, 256px)',
              zIndex: getZIndex(i + 3),
              transform: 'rotate(9.96deg)'
            }"
          >
            <img
              [src]="image"
              alt="Collage image"
              class="h-full w-full rounded-[16px] object-cover"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop layout -->
    <div class="relative mx-auto mt-4 hidden h-[348px] w-[1134px] xxl:block">
      <app-icon
        [icon]="'StarsCollage' | themedIcon"
        [width]="50"
        [height]="104"
        class="absolute left-0 top-0"
      ></app-icon>

      <app-icon
        [icon]="'StarsCollage' | themedIcon"
        [width]="50"
        [height]="104"
        class="absolute bottom-0 right-0"
      ></app-icon>

      <div class="flex h-full items-center justify-center">
        <div class="relative flex -space-x-[10px]">
          <div
            *ngFor="let image of images; let i = index"
            class="h-[254px] w-[170px]"
            [ngStyle]="{ zIndex: getZIndex(i), transform: getImageRotation() }"
          >
            <img
              [src]="image"
              alt="Collage"
              class="h-full w-full rounded-[24px] object-cover transition-transform duration-300 hover:-translate-y-2"
            />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ImageCollageComponent {
  // Images array
  images: string[] = [
    'assets/main-collage/image-1.jpg',
    'assets/main-collage/image-2.jpg',
    'assets/main-collage/image-3.jpg',
    'assets/main-collage/image-4.jpg',
    'assets/main-collage/image-5.jpg',
    'assets/main-collage/image-6.jpg',
  ];

  starIconWidth = 24;
  starIconHeight = 52;

  isMobile = window.innerWidth < 1024;

  constructor(private cdr: ChangeDetectorRef) {
    this.updateIconSize(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    const width = (event.target as Window).innerWidth;
    const wasMobile = this.isMobile;
    this.isMobile = width < 1024;

    if (wasMobile !== this.isMobile) {
      this.cdr.markForCheck();
    }

    this.updateIconSize(width);
  }

  /**
   * Update icon sizes depending on viewport width
   */
  private updateIconSize(width: number): void {
    if (width < 640) {
      this.starIconWidth = 24;
      this.starIconHeight = 52;
    } else if (width < 1024) {
      this.starIconWidth = 36;
      this.starIconHeight = 78;
    } else {
      this.starIconWidth = 50;
      this.starIconHeight = 104;
    }
  }

  /**
   * For desktop: all images rotated -9.96deg.
   * Mobile rotations handled directly in template per row.
   */
  getImageRotation(): string {
    return 'rotate(-9.96deg)';
  }

  /**
   * Calculate z-index for layering
   */
  getZIndex(index: number): number {
    const photoNumber = index + 1;
    if (photoNumber === 4) return 3;
    if ([1, 3, 6].includes(photoNumber)) return 2;
    return 1;
  }
}
