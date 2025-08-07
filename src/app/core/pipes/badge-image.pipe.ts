import { Pipe, PipeTransform } from '@angular/core';
import { BadgeType } from '../utils/badge-utils'; // Correct import path, adjust if needed

/**
 * Pipe to map BadgeType values to their corresponding image paths.
 * Returns the image URL for the badge or null if no valid badge is provided.
 */
@Pipe({
  name: 'badgeImage',
  standalone: true,
})
export class BadgeImagePipe implements PipeTransform {
  transform(value: BadgeType | null | undefined): string | null {
    if (!value) {
      // Return null if badge type is null or undefined
      return null;
    }

    // Map badge types to image asset paths
    switch (value) {
      case 'gold':
        return './assets/badges/GoldRate.png';
      case 'silver':
        return './assets/badges/SilverRate.png';
      case 'bronze':
        return './assets/badges/BronzeRate.png';
      default:
        // Return null if badge type is unknown
        return null;
    }
  }
}
