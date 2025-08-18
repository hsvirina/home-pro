import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationStart, RouterModule } from '@angular/router';
import { BadgeImagePipe } from '../../../core/pipes/badge-image.pipe';
import { UserMenuComponent } from './user-menu.component';
import { slideDownAnimation } from '../../../../styles/animations/animations';
import { BadgeType } from '../../../core/utils/badge-utils';
import { AuthUser } from '../../../core/models/user.model';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    UserMenuComponent,
    BadgeImagePipe,
    RouterModule,
    TranslateModule,
  ],
  animations: [slideDownAnimation],
  template: `
    <div
      class="relative flex items-center justify-center"
      [style.width.px]="avatarSize"
      [style.height.px]="avatarSize"
      tabindex="0"
      role="button"
      aria-haspopup="true"
      [attr.aria-expanded]="opened"
    >
      <!-- Badge overlay -->
      <img
        *ngIf="userBadge | badgeImage as badgeImg"
        [src]="badgeImg"
        alt="badge"
        class="absolute left-1/2 top-1/2 z-0"
        [style.width.px]="badgeSize"
        [style.height.px]="badgeSize"
        style="transform: translate(-50%, -50%); object-fit: contain;"
      />

      <!-- User avatar -->
      <app-user-menu
        [userPhoto]="user.photoUrl"
        [opened]="opened"
        [avatarSize]="avatarSize - 8"
        [badgeSize]="badgeSize"
        [hasBadge]="!!userBadge"
        class="relative z-10 cursor-pointer"
        (click)="toggleDropdown($event)"
      ></app-user-menu>

      <!-- Dropdown menu -->
      <div
        *ngIf="opened"
        @slideDownAnimation
        class="absolute right-0 top-full z-[999] mt-2 w-auto origin-top rounded-[16px] border p-2"
        [ngClass]="{
          'border-[var(--color-white)] bg-[var(--color-white)]':
            theme === 'light',
          'border-[var(--color-white)] bg-[var(--color-bg-card)]':
            theme === 'dark',
        }"
        role="menu"
      >
        <a
          routerLink="/profile"
          class="block cursor-pointer rounded-[12px] px-4 py-2 transition-colors hover:bg-[var(--color-bg)]"
          role="menuitem"
          (click)="closeDropdown()"
        >
          {{ 'header.users_menu.profile' | translate }}
        </a>
        <button
          class="w-full cursor-pointer rounded-[12px] px-4 py-2 transition-colors hover:bg-[var(--color-bg)]"
          role="menuitem"
          (click)="logout.emit(); closeDropdown()"
        >
          {{ 'header.users_menu.logout' | translate }}
        </button>
      </div>
    </div>
  `,
})
export class UserDropdownComponent implements OnInit, OnDestroy {
  /** User data input */
  @Input() user!: AuthUser;

  /** User badge type (gold/silver/bronze/null) */
  @Input() userBadge: BadgeType | null = null;

  /** Avatar and badge sizes */
  @Input() avatarSize = 64;
  @Input() badgeSize = 64;

  /** Dropdown open state */
  @Input() opened = false;

  /** Current theme */
  @Input() theme: 'light' | 'dark' = 'light';

  /** Event emitted when dropdown state changes */
  @Output() openedChange = new EventEmitter<boolean>();

  /** Event emitted when user clicks logout */
  @Output() logout = new EventEmitter<void>();

  private routerSub!: Subscription;

  constructor(private router: Router, private elRef: ElementRef) {}

  ngOnInit(): void {
    // Close dropdown when navigation occurs
    this.routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.closeDropdown();
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }

  /**
   * Toggle dropdown open/close state
   * @param event Mouse event to stop propagation
   */
  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.opened = !this.opened;
    this.openedChange.emit(this.opened);
  }

  /** Close the dropdown and emit change */
  closeDropdown(): void {
    this.opened = false;
    this.openedChange.emit(this.opened);
  }

  /**
   * Close dropdown when clicking outside of component
   * @param event Document click event
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }
}
