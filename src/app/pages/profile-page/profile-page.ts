import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface User {
  fullName: string;
  photoUrl: string;
  location: string;
}

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <div class="flex items-center space-x-4">
        <img
          [src]="user.photoUrl"
          alt="Profile"
          class="w-20 h-20 rounded-full border-4 border-indigo-500 object-cover"
        />
        <div>
          <h2 class="text-2xl font-bold text-gray-800">{{ user.fullName }}</h2>
          <p class="text-gray-500 text-sm">{{ user.location }}</p>
        </div>
      </div>

      <div class="mt-6">
        <h3 class="text-lg font-semibold text-gray-700">О себе</h3>
        <p class="text-gray-600 mt-2 text-sm leading-relaxed">
          Люблю разрабатывать интерфейсы и создавать понятный, красивый код. Постоянно учусь и развиваюсь в IT.
        </p>
      </div>
    </div>
  `,
  styles: [],
})
export class ProfilePageComponent implements OnInit {
  user!: User;

  ngOnInit() {
    // Заглушка данных пользователя (имитация получения с сервера)
    this.user = {
      fullName: 'Анна Иванова',
      photoUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
      location: 'Швейцария, Цюрих',
    };
  }
}
