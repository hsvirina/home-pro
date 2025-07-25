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
      <!-- Если есть user.photoUrl → обычный <img>, иначе <app-icon> -->
      <ng-container *ngIf="user?.photoUrl as photoUrl; else defaultIcon">
        <img
          (click)="toggleDropdown($event)"
          [src]="photoUrl"
          alt="User avatar"
          class="h-10 w-10 cursor-pointer rounded-full object-cover transition hover:opacity-80"
        />
      </ng-container>

      <ng-template #defaultIcon>
        <app-icon
          [icon]="ICONS.UserProfile"
          (click)="toggleDropdown($event)"
          class="h-10 w-10 cursor-pointer rounded-full transition hover:opacity-80"
        />
      </ng-template>

      <div
        *ngIf="opened"
        @slideDownAnimation
        class="absolute right-0 z-10 mt-2 w-40 rounded bg-white shadow-md"
      >
        <a
          routerLink="/profile"
          class="block px-4 py-2 hover:bg-gray-100"
          (click)="closeMenu()"
        >
          Profile
        </a>
        <button
          class="w-full px-4 py-2 text-left hover:bg-gray-100"
          (click)="onLogout()"
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

  @Output() toggle = new EventEmitter<MouseEvent>();
  @Output() logout = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation(); // ✅ вот решение
    this.toggle.emit(event);
  }

  closeMenu() {
    this.close.emit();
  }

  onLogout() {
    this.logout.emit();
    this.closeMenu();
  }
}
