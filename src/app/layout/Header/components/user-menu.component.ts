import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { slideDownAnimation } from '../../../../styles/animations/animations';
import { ICONS } from '../../../core/constants/icons.constant';
import { ThemeService } from '../../../core/services/theme.service';
import { Theme } from '../../../core/models/theme.type';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  animations: [slideDownAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Если у пользователя есть бейдж, показываем его вместе с аватаром -->
    <div
      *ngIf="hasBadge && userPhoto; else avatarOnly"
      class="relative"
      [style.width.px]="avatarSize"
      [style.height.px]="avatarSize"
      style="border-radius: 50%; overflow: hidden;"
      tabindex="0"
      role="button"
      aria-haspopup="true"
      [attr.aria-expanded]="opened"
      (click)="onToggle($event)"
      (keydown.enter)="onToggle($event)"
      (keydown.space)="onToggle($event)"
    >
      <img
        [src]="userPhoto"
        alt="User avatar"
        class="cursor-pointer z-10 object-cover transition hover:opacity-80"
        loading="eager"
        [style.width.px]="avatarSize"
        [style.height.px]="avatarSize"
        style="display: block; object-fit: cover;"
        aria-hidden="true"
      />
    </div>

    <!-- Если бейджа нет, показываем только аватар -->
    <ng-template #avatarOnly>
      <div
        class="relative"
        [style.width.px]="badgeSize"
        [style.height.px]="badgeSize"
        style="border-radius: 50%; overflow: hidden;"
        tabindex="0"
        role="button"
        aria-haspopup="true"
        [attr.aria-expanded]="opened"
        (click)="onToggle($event)"
        (keydown.enter)="onToggle($event)"
        (keydown.space)="onToggle($event)"
      >
        <img
          [src]="userPhoto"
          alt="User avatar"
          class="cursor-pointer object-cover transition hover:opacity-80"
          loading="eager"
          [style.width.px]="badgeSize"
          [style.height.px]="badgeSize"
          style="display: block;"
          aria-hidden="true"
        />
      </div>
    </ng-template>
  `,
})
export class UserMenuComponent {
  readonly ICONS = ICONS;

  @Input() userPhoto: string | null = null;
  @Input() opened = false;

  @Output() toggle = new EventEmitter<MouseEvent | KeyboardEvent>();
  @Output() logout = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Input() hasBadge: boolean = false;

  readonly currentTheme$: Observable<Theme>;

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;
  }

  @Input() avatarSize: number = 64;
  @Input() badgeSize: number = 64;

  onToggle(event: Event) {
    // Приводим Event к MouseEvent | KeyboardEvent для совместимости
    this.toggle.emit(event as MouseEvent | KeyboardEvent);
  }
}
