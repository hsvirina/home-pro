import { Pipe, PipeTransform } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { ICONS, IconData } from '../constants/icons.constant';

type IconKey = keyof typeof ICONS;

@Pipe({
  name: 'themedIcon',
  standalone: true,
  pure: false
})
export class ThemedIconPipe implements PipeTransform {
  private theme: 'light' | 'dark' = 'light';

  constructor(private themeService: ThemeService) {
    this.themeService.theme$.subscribe(t => this.theme = t);
  }

  transform(key: IconKey): IconData {
    if (this.theme === 'dark') {
      const darkKey = `${key}DarkThema` as IconKey;
      if (darkKey in ICONS) {
        return ICONS[darkKey];
      }
    }
    return ICONS[key];
  }
}
