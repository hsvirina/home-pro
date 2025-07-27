import { Component, Input } from '@angular/core';
import { IconData } from '../../core/constants/icons.constant';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <!-- Display SVG or image icon -->
    <img
      [src]="icon.filename"
      [alt]="icon.alt"
      class="object-contain"
      [style.width.px]="size ?? 24"
      [style.height.px]="size ?? 24"
      loading="lazy"
    />
  `,
})
export class IconComponent {
  @Input() icon!: IconData;
  @Input() size?: number;
}
