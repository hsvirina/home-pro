import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { slideDownAnimation } from '../../../../styles/animations/animations';
import { ICONS } from '../../../core/constants/icons.constant';
import { IconComponent } from '../../../shared/components/icon.component';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  animations: [slideDownAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative">
      <ng-container *ngIf="user?.photoUrl as photoUrl; else defaultIcon">
        <img
          (click)="onToggle($event)"
          [src]="photoUrl"
          alt="User avatar"
          class="h-10 w-10 cursor-pointer rounded-full object-cover transition hover:opacity-80"
          loading="lazy"
          width="40"
          height="40"
          aria-haspopup="true"
          [attr.aria-expanded]="opened"
          role="button"
          tabindex="0"
          (keydown.enter)="onToggle($event)"
          (keydown.space)="onToggle($event)"
        />
      </ng-container>

      <ng-template #defaultIcon>
        <app-icon
          [icon]="ICONS.UserProfile"
          (click)="onToggle($event)"
          class="h-10 w-10 cursor-pointer rounded-full transition hover:opacity-80"
          aria-haspopup="true"
          [attr.aria-expanded]="opened"
          role="button"
          tabindex="0"
          (keydown.enter)="onToggle($event)"
          (keydown.space)="onToggle($event)"
        />
      </ng-template>

      <div
        *ngIf="opened"
        @slideDownAnimation
        class="absolute right-0 z-10 mt-2 w-40 rounded bg-white shadow-md"
        role="menu"
        aria-label="User menu"
      >
        <a
          routerLink="/profile"
          class="block px-4 py-2 hover:bg-gray-100"
          (click)="closeMenu()"
          role="menuitem"
        >
          Profile
        </a>
        <button
          class="w-full px-4 py-2 text-left hover:bg-gray-100"
          (click)="onLogout()"
          role="menuitem"
        >
          Logout
        </button>
      </div>
    </div>
  `,
})
export class UserMenuComponent {
  ICONS = ICONS;

  @Input() user: User | null = null;
  @Input() opened = false;

  @Output() toggle = new EventEmitter<MouseEvent | KeyboardEvent>();
  @Output() logout = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  /**
   * Handle mouse and keyboard events for toggling dropdown.
   */
  onToggle(event: Event): void {
    event.stopPropagation();

    if (event instanceof MouseEvent || event instanceof KeyboardEvent) {
      this.toggle.emit(event);
    }
  }

  closeMenu(): void {
    this.close.emit();
  }

  onLogout(): void {
    this.logout.emit();
    this.closeMenu();
  }
}
