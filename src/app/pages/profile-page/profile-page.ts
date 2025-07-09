import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-[20px]">
      <div
        class="flex flex-col gap-[32px] rounded-[24px] border border-[var(--color-gray-20)] bg-[var(--color-white)] p-[16px]"
      >
        <div class="flex items-center gap-[20px]">
          <img
            [src]="user.avatar"
            alt="Profile"
            class="h-[100px] w-[100px] rounded-full object-cover"
          />
          <div class="flex flex-col gap-[8px] text-[var(--color-gray-100)]">
            <h5>{{ user.fullName }}</h5>
            <span class="body-font-1">{{ user.email }}</span>
            <span class="body-font-1">Coffee enthusiast and digital nomad. Здесь должна быть локация Always on the hunt for the perfect espresso!</span>

            <span class="body-font-1">{{ user.status }}</span>
          </div>
        </div>

        <div class="flex flex-col gap-[20px]">
          <div class="flex gap-3">
            <div
              class="flex h-[50px] w-[50px] items-center justify-center rounded-[25px] bg-[var(--color-bg-2)]"
            >
              <img
                src="/icons/id-pass.png"
                alt="ID card icon"
                class="h-[26px] w-[20px]"
              />
            </div>
            <div class="flex flex-col gap-1">
              <p class="body-font-1">Full Name</p>
              <p>{{ user.fullName }}</p>
            </div>
          </div>
          <div class="flex gap-3">
            <div
              class="flex h-[50px] w-[50px] items-center justify-center rounded-[25px] bg-[var(--color-bg-2)]"
            >
              <img
                src="/icons/location.png"
                alt="Location icon"
                class="h-[26px] w-[20px]"
              />
            </div>
            <div class="flex flex-col gap-1">
              <p class="body-font-1">Location</p>
              <p>{{ user.location }}</p>
            </div>
          </div>
          <div class="flex gap-3">
            <div
              class="flex h-[50px] w-[50px] items-center justify-center rounded-[25px] bg-[var(--color-bg-2)]"
            >
              <img
                src="/icons/letter.png"
                alt="Letter icon"
                class="h-[26px] w-[20px]"
              />
            </div>
            <div class="flex flex-col gap-1">
              <p class="body-font-1">Email</p>
              <p>{{ user.email }}</p>
            </div>
          </div>
        </div>

        <div class="flex border border-[var(--color-primary)] h-[48px] text-[var(--color-primary)] rounded-[40px] ">
          <button
            class="flex-1 bg-transparent menu-text-font"
            (click)="onEdit()"
          >
            Edit Profile
          </button>

        </div>
      </div>

      <button
        class="flex-1 rounded bg-red-500 py-2 text-white hover:bg-red-600"
        (click)="onLogout()"
      >
        Выйти
      </button>
    </div>
  `,
})
export class ProfilePageComponent implements OnInit {
  user = {
    fullName: 'Sarah Johnson',
    email: 'anna.@.comivanova',
    location: 'Kyiv, Ukraine',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    status:
      'Coffee enthusiast and digital nomad. Always on the hunt for the perfect espresso!',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {}

  onEdit() {
    console.log('Редактировать профиль');
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
