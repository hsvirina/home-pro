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
    <!-- User avatar container -->
    <div
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
      <!-- User avatar image -->
      <img
        [src]="userPhoto"
        alt="User avatar"
        class="cursor-pointer object-cover transition hover:opacity-80"
        loading="eager"
        [style.width.px]="avatarSize"
        [style.height.px]="avatarSize"
        style="display: block; object-fit: cover;"
        aria-hidden="true"
      />

      <!-- Optional badge overlay -->
      <ng-container *ngIf="hasBadge">
        <div
          class="pointer-events-none absolute left-1/2 top-1/2"
          [style.width.px]="badgeSize"
          [style.height.px]="badgeSize"
          style="transform: translate(-50%, -50%);"
        >
          <!-- Badge image should be provided by parent component -->
        </div>
      </ng-container>
    </div>
  `,
})
export class UserMenuComponent {
  readonly ICONS = ICONS;

  /** URL of user avatar */
  @Input() userPhoto: string | null = null;

  /** Dropdown open state */
  @Input() opened = false;

  /** Avatar and badge sizes */
  @Input() avatarSize: number = 64;
  @Input() badgeSize: number = 64;

  /** Whether user has a badge */
  @Input() hasBadge: boolean = false;

  /** Event emitted when avatar is clicked or toggled via keyboard */
  @Output() toggle = new EventEmitter<MouseEvent | KeyboardEvent>();

  /** Event emitted when user triggers logout (if needed in parent) */
  @Output() logout = new EventEmitter<void>();

  /** Event emitted to close the menu from parent */
  @Output() close = new EventEmitter<void>();

  /** Observable for current theme */
  readonly currentTheme$: Observable<Theme>;

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;
  }

  /**
   * Emit toggle event for parent component
   * @param event Mouse or Keyboard event
   */
  onToggle(event: Event) {
    this.toggle.emit(event as MouseEvent | KeyboardEvent);
  }
}
