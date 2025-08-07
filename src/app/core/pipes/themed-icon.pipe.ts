import { Pipe, PipeTransform } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { ICONS, IconData } from '../constants/icons.constant';

type IconKey = keyof typeof ICONS;

/**
 * Pipe to return the appropriate themed icon based on the current theme.
 * Automatically switches to the dark theme icon variant if available.
 *
 * Usage example: {{ 'ArrowLeft' | themedIcon }}
 */
@Pipe({
  name: 'themedIcon',
  standalone: true,
  pure: false, // Pipe is impure because it depends on ThemeService observable
})
export class ThemedIconPipe implements PipeTransform {
  private theme: 'light' | 'dark' = 'light';

  constructor(private themeService: ThemeService) {
    // Subscribe to theme changes to update the icon accordingly
    this.themeService.theme$.subscribe((t) => (this.theme = t));
  }

  transform(key: IconKey): IconData {
    // Check if current theme is dark and if a dark theme icon exists
    if (this.theme === 'dark') {
      const darkKey = `${key}DarkTheme` as IconKey;
      if (darkKey in ICONS) {
        return ICONS[darkKey];
      }
    }

    // Return default icon for light theme or fallback
    return ICONS[key];
  }
}
