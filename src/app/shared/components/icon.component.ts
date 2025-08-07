import { Component, Input } from '@angular/core';
import { IconData } from '../../core/constants/icons.constant';

/**
 * Type representing either a standard icon (IconData) or a flexible icon
 * with custom URL and label, e.g. from FILTER_CATEGORIES.
 */
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
  /**
   * Input icon which can be either a predefined IconData or a flexible icon object
   */
  @Input() icon!: FlexibleIcon;

  /**
   * Optional width of the icon in pixels; default is 24px
   */
  @Input() width?: number;

  /**
   * Optional height of the icon in pixels; default is 24px
   */
  @Input() height?: number;

  /**
   * Resolves the source URL for the image.
   * If icon has 'iconURL' property, it is considered a flexible icon.
   * Otherwise, uses the 'filename' property from IconData.
   */
  get resolvedSrc(): string {
    return 'iconURL' in this.icon ? this.icon.iconURL : this.icon.filename;
  }

  /**
   * Resolves the alt text for accessibility.
   * If icon has 'label' property, use it with 'icon' suffix.
   * Otherwise, uses the 'alt' property from IconData.
   */
  get resolvedAlt(): string {
    return 'label' in this.icon ? `${this.icon.label} icon` : this.icon.alt;
  }
}
