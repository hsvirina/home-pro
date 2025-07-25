import { Component, Input } from '@angular/core';
import { IconData } from '../../core/constants/icons.constant';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <img
      [src]="icon.filename"
      [alt]="icon.alt"
      class="h-6 w-6 object-contain"
      loading="lazy"
    />
  `,
})
export class IconComponent {
  @Input() icon!: IconData;
}
