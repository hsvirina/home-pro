import { Pipe, PipeTransform } from '@angular/core';
import { BadgeType } from '../utils/badge-utils'; // поправь путь

@Pipe({
  name: 'badgeImage',
  standalone: true,
})
export class BadgeImagePipe implements PipeTransform {
  transform(value: BadgeType | null | undefined): string | null {
    if (!value) return null;

    switch (value) {
      case 'gold':
        return './assets/badges/GoldRate.png';
      case 'silver':
        return './assets/badges/SilverRate.png';
      case 'bronze':
        return './assets/badges/BronzeRate.png';
      default:
        return null;
    }
  }
}
