import { Component, HostListener, ChangeDetectorRef } from '@angular/core';
import { NgForOf, NgStyle } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon.component';
import { ICONS } from '../../../core/constants/icons.constant';
import { ThemedIconPipe } from '../../../core/pipes/themed-icon.pipe';

@Component({
  selector: 'app-image-collage',
  standalone: true,
  imports: [NgForOf, NgStyle, IconComponent, ThemedIconPipe],
  template: `
    <!-- Мобильный коллаж -->
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
    <!-- Верхний ряд -->
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

    <!-- Нижний ряд -->
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
      <!-- Левая верхняя иконка -->
      <app-icon
        [icon]="'StarsCollage' | themedIcon"
        [width]="50"
        [height]="104"
        class="absolute left-0 top-0"
      />

      <!-- Правая нижняя иконка -->
      <app-icon
        [icon]="'StarsCollage' | themedIcon"
        [width]="50"
        [height]="104"
        class="absolute bottom-0 right-0"
      />

      <!-- Центрированный флекс-контейнер с перекрытием -->
      <div class="flex h-full items-center justify-center">
        <div class="relative flex -space-x-[10px]">
          <div
            *ngFor="let image of images; let i = index"
            class="h-[254px] w-[170px]"
            [ngStyle]="{ zIndex: getZIndex(i) }"
          >
            <img
              [src]="image"
              alt="Collage"
              class="h-full w-full rounded-[24px] object-cover transition-transform duration-300 hover:-translate-y-2"
              [style.transform]="getImageRotation(i)"
            />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ImageCollageComponent {
  ICONS = ICONS;

  images = [
    'assets/main-collage/image-1.jpg',
    'assets/main-collage/image-2.jpg',
    'assets/main-collage/image-3.jpg',
    'assets/main-collage/image-4.jpg',
    'assets/main-collage/image-5.jpg',
    'assets/main-collage/image-6.jpg',
  ];

  isMobile = window.innerWidth < 1024;

  // Новые переменные для размеров иконок (можно адаптировать под дизайн)
  starIconWidth = 24;
  starIconHeight = 52;

  constructor(private cdr: ChangeDetectorRef) {
    this.updateIconSize(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const width = event.target.innerWidth;
    const newIsMobile = width < 1024;
    if (newIsMobile !== this.isMobile) {
      this.isMobile = newIsMobile;
    }
    this.updateIconSize(width);
    this.cdr.detectChanges();
  }

  updateIconSize(width: number) {
    if (width < 640) {
      // мобильные размеры
      this.starIconWidth = 24;
      this.starIconHeight = 52;
    } else if (width < 1024) {
      // планшетные размеры (пример)
      this.starIconWidth = 36;
      this.starIconHeight = 78;
    } else {
      // десктоп
      this.starIconWidth = 50;
      this.starIconHeight = 104;
    }
  }

  getImageRotation(index: number): string {
    if (this.isMobile) return 'none';
    return 'rotate(-9.96deg)';
  }

  getZIndex(index: number): number {
    const photoNumber = index + 1;
    if (photoNumber === 4) return 3;
    if ([1, 3, 6].includes(photoNumber)) return 2;
    return 1;
  }
}
