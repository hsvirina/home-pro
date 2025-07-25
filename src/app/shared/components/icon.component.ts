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
      class="h-6 w-6 object-contain"
      loading="lazy"
    />
  `,
})
export class IconComponent {
  /**
   * Icon object containing filename (URL) and alt text
   */
  @Input() icon!: IconData;
}
