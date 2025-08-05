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
import { IconComponent } from '../../../shared/components/icon.component';
import { ThemeService } from '../../../core/services/theme.service';
import { Theme } from '../../../core/models/theme.type';
import { Observable } from 'rxjs';
import { AuthUser } from '../../../core/models/user.model';

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
          class="h-[50px] w-[50px] cursor-pointer rounded-full object-cover transition hover:opacity-80"
          loading="eager"
          aria-haspopup="true"
          [attr.aria-expanded]="opened"
          role="button"
          tabindex="0"
          (keydown.enter)="onToggle($event)"
          (keydown.space)="onToggle($event)"
        />
      </ng-container>

      <ng-template #defaultIcon>
        <div
          class="flex h-[58px] w-[58px] items-center justify-center rounded-[29px] bg-[var(--color-secondary)]"
        >
          <app-icon
            [icon]="ICONS.UserProfile"
            (click)="onToggle($event)"
            class="cursor-pointer rounded-full transition hover:opacity-80"
            [width]="36"
            [height]="36"
            aria-haspopup="true"
            [attr.aria-expanded]="opened"
            role="button"
            tabindex="0"
            (keydown.enter)="onToggle($event)"
            (keydown.space)="onToggle($event)"
          />
        </div>
      </ng-template>

      <div
        *ngIf="opened"
        @slideDownAnimation
        class="absolute right-0 z-10 mt-2 w-auto origin-top rounded-[16px] border p-2"
        role="menu"
        aria-label="User menu"
        [ngClass]="{
          'border-[var(--color-white)] bg-[var(--color-white)]':
            (currentTheme$ | async) === 'light',
          'border-[var(--color-white)] bg-[var(--color-bg-card)]':
            (currentTheme$ | async) === 'dark'
        }"
      >
        <a
          routerLink="/profile"
          class="block cursor-pointer rounded-[12px] px-4 py-2 transition-colors"
          (click)="closeMenu()"
          role="menuitem"
          [ngClass]="{
            'hover:bg-[var(--color-bg)]': true
          }"
        >
          Profile
        </a>
        <button
          class="w-full cursor-pointer rounded-[12px] px-4 py-2 transition-colors"
          (click)="onLogout()"
          role="menuitem"
          [ngClass]="{
            'hover:bg-[var(--color-bg)]': true
          }"
        >
          Logout
        </button>
      </div>
    </div>
  `,
})
export class UserMenuComponent {
  readonly ICONS = ICONS;

  @Input() user: AuthUser | null = null;
  @Input() opened = false;

  @Output() toggle = new EventEmitter<MouseEvent | KeyboardEvent>();
  @Output() logout = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  readonly currentTheme$: Observable<Theme>;

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;
  }

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
