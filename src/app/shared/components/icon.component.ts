import { Component, Input } from '@angular/core';
import { IconData } from '../../core/constants/icons.constant';

type FlexibleIcon = IconData | { iconURL: string; label: string };

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <img
      [src]="resolvedSrc"
      [alt]="resolvedAlt"
      class="object-contain"
      [style.width.px]="width ?? 24"
      [style.height.px]="height ?? 24"
      [style.minWidth.px]="width ?? 24"
      [style.minHeight.px]="height ?? 24"
      loading="eager"
    />
  `,
})
export class IconComponent {
  @Input() icon!: FlexibleIcon;
  @Input() width?: number;
  @Input() height?: number;

  get resolvedSrc(): string {
    // Если есть iconURL, значит это иконка из FILTER_CATEGORIES
    return 'iconURL' in this.icon ? this.icon.iconURL : this.icon.filename;
  }

  get resolvedAlt(): string {
    return 'label' in this.icon ? `${this.icon.label} icon` : this.icon.alt;
  }
}
