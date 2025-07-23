// import {
//   Component,
//   ElementRef,
//   HostListener,
//   OnInit,
//   OnDestroy,
//   ChangeDetectorRef,
// } from '@angular/core';
// import {
//   ActivatedRoute,
//   NavigationEnd,
//   Router,
//   RouterModule,
// } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { Subscription } from 'rxjs';
// import { filter } from 'rxjs/operators';

// import { AuthService } from '../../services/auth.service';
// import { PlacesService } from '../../services/places.service';
// import { FILTER_CATEGORIES } from '../../models/catalog-filter.config';
// import { Place } from '../../models/place.model';
// import { User } from '../../models/user.model';
// import { SearchSectionComponent } from './components/search-section.component';
// import { slideDownAnimation } from '../../../styles/animations';

// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [FormsModule, CommonModule, RouterModule, SearchSectionComponent],
//   animations: [slideDownAnimation],
//   template: `
//     <!-- Шапка сайта -->
//     <header
//       class="relative z-50 flex h-[48px] items-center justify-between bg-[var(--color-bg)] px-[20px] lg:h-[72px] lg:px-[40px] xxl:h-[80px] xxl:px-0"
//     >
//       <!-- Логотип и кнопка меню для мобильных -->
//       <div class="flex items-center gap-[8px]">
//         <button class="lg:hidden" (click)="toggleDropdown('menu')">
//           <img src="/icons/menu.png" alt="menu" class="h-6 w-6" />
//         </button>
//         <a routerLink="/">
//           <img
//             src="./logo.svg"
//             alt="beanly"
//             class="shadow-hover h-[24px] w-[93px] object-contain lg:h-[28px] lg:w-[130px] xxl:h-[32px] xxl:w-[165px]"
//           />
//         </a>
//       </div>

//       <!-- Поиск (виден только на больших экранах) -->
//       <div class="hidden flex-1 justify-center lg:flex">
//         <app-search-section></app-search-section>
//       </div>

//       <!-- Навигация и пользовательские кнопки -->
//       <div class="flex items-center gap-[30px]">
//         <!-- Основное меню (только на больших экранах) -->
//         <div class="hidden items-center gap-[30px] lg:flex">
//           <nav class="menu-text-font flex items-center gap-[30px]">
//             <a
//               routerLink="/catalog"
//               class="shadow-hover text-[var(--color-gray-100)]"
//               >Catalog</a
//             >

//             <!-- Выбор города -->
//             <div class="relative" (click)="toggleDropdown('city')">
//               <div
//                 class="shadow-hover flex cursor-pointer items-center gap-1 rounded-[8px] bg-[var(--color-white)] p-[8px]"
//               >
//                 {{ cityLabel }}
//                 <img
//                   src="/icons/chevron-down.svg"
//                   class="h-6 w-6"
//                   [class.rotate-180]="isCityDropdown"
//                 />
//               </div>
//               <div
//                 *ngIf="isCityDropdown"
//                 @slideDownAnimation
//                 class="absolute left-0 top-full z-50 mt-2 flex w-full origin-top flex-col gap-[12px] rounded-[8px] bg-[var(--color-white)] p-2 shadow-lg"
//               >
//                 <div
//                   *ngFor="let loc of locationOptions"
//                   (click)="setCity(loc.key, $event)"
//                   class="cursor-pointer rounded-[8px] hover:bg-[var(--color-bg)]"
//                 >
//                   {{ loc.label }}
//                 </div>
//               </div>
//             </div>

//             <!-- Выбор языка -->
//             <div class="relative" (click)="toggleDropdown('lang')">
//               <div
//                 class="shadow-hover flex cursor-pointer items-center gap-1 rounded-[8px] bg-[var(--color-white)] p-[8px]"
//               >
//                 {{ language }}
//                 <img
//                   src="/icons/chevron-down.svg"
//                   class="h-6 w-6"
//                   [class.rotate-180]="isLangDropdown"
//                 />
//               </div>
//               <div
//                 *ngIf="isLangDropdown"
//                 @slideDownAnimation
//                 class="absolute left-0 top-full z-50 mt-2 flex w-full origin-top flex-col gap-[12px] rounded-[8px] bg-[var(--color-white)] p-2 shadow-lg"
//               >
//                 <div
//                   (click)="setLanguage('ENG', $event)"
//                   class="cursor-pointer rounded-[8px] hover:bg-[var(--color-bg)]"
//                 >
//                   ENG
//                 </div>
//                 <div
//                   (click)="setLanguage('UKR', $event)"
//                   class="cursor-pointer rounded-[8px] hover:bg-[var(--color-bg)]"
//                 >
//                   UKR
//                 </div>
//               </div>
//             </div>
//           </nav>
//         </div>

//         <!-- Кнопка профиля для мобильных (когда меню не открыто) -->
//         <button
//           *ngIf="screenIsMobile && activeDropdown !== 'menu'"
//           (click)="navigateToAuth()"
//           class="flex items-center lg:hidden"
//         >
//           <img
//             src="/icons/user-profile.svg"
//             alt="user-profile"
//             class="h-6 w-6"
//           />
//         </button>

//         <!-- Пользовательский блок (авторизован/неавторизован) на больших экранах -->
//         <div class="hidden items-center gap-[30px] lg:flex">
//           <ng-container *ngIf="user; else showLogin">
//             <div class="relative">
//               <a routerLink="/profile">
//                 <img
//                   [src]="user.photoUrl || '/icons/user-profile.svg'"
//                   alt="avatar"
//                   class="h-10 w-10 rounded-full object-cover transition hover:opacity-80"
//                 />
//               </a>
//               <div
//                 *ngIf="activeDropdown === 'userMenu'"
//                 class="absolute right-0 mt-2 w-40 rounded bg-white shadow-md"
//               >
//                 <a
//                   routerLink="/profile"
//                   class="block px-4 py-2 hover:bg-gray-100"
//                   >Profile</a
//                 >
//                 <button
//                   (click)="handleLogout()"
//                   class="w-full px-4 py-2 text-left hover:bg-gray-100"
//                 >
//                   Logout
//                 </button>
//               </div>
//             </div>
//           </ng-container>
//           <ng-template #showLogin>
//             <button
//               class="shadow-hover flex items-center gap-1"
//               (click)="navigateToAuth()"
//             >
//               <span class="hidden lg:inline">Log in</span>
//               <img
//                 src="/icons/user-profile.svg"
//                 alt="user-profile"
//                 class="h-6 w-6"
//               />
//             </button>
//           </ng-template>
//         </div>
//       </div>
//     </header>

//     <!-- Мобильное меню (отдельный блок с оверлеем) -->
//     <div
//       *ngIf="screenIsMobile && activeDropdown === 'menu'"
//       class="fixed inset-0 z-50 flex flex-col bg-[var(--color-bg)]"
//     >
//       <div
//         class="fixed left-0 right-0 top-0 z-50 flex h-[48px] items-center justify-between bg-[var(--color-bg)] px-[20px]"
//       >
//         <a routerLink="/"
//           ><img src="./logo.svg" alt="beanly" class="h-[24px] w-[93px]"
//         /></a>
//         <button (click)="toggleDropdown('menu')">
//           <img src="/icons/close.svg" alt="Close" class="h-6 w-6" />
//         </button>
//       </div>

//       <div class="mt-[48px] flex flex-1 flex-col overflow-y-auto px-[20px]">
//         <!-- Поиск внутри мобильного меню -->
//         <div
//           class="mb-[48px] mt-[40px] flex items-center gap-[8px] rounded-[40px] border border-[var(--color-gray-20)] px-[24px] py-[12px]"
//         >
//           <img src="/icons/search-dark.svg" class="h-6 w-6" />
//           <input
//             type="text"
//             placeholder="Search cafés or areas…"
//             class="body-font-1 w-full border-none bg-transparent focus:outline-none"
//           />
//         </div>

//         <!-- Навигация внутри мобильного меню -->
//         <nav class="menu-text-font flex flex-col gap-6">
//           <a routerLink="/catalog" class="text-lg text-[var(--color-gray-100)]"
//             >Catalog</a
//           >
//           <div (click)="toggleDropdown('city')" class="flex items-center gap-2">
//             {{ cityLabel
//             }}
//           </div>
//           <div (click)="toggleDropdown('lang')" class="flex items-center gap-2">
//             {{ language
//             }}
//           </div>
//         </nav>

//         <!-- Логин/Логаут в мобильном меню -->
//         <div class="mb-[35px] mt-auto">
//           <ng-container *ngIf="user; else mobileLogin">
//             <button
//               (click)="handleLogout()"
//               class="text-left text-[var(--color-gray-100)]"
//             >
//               <h5>Logout</h5>
//             </button>
//           </ng-container>
//           <ng-template #mobileLogin>
//             <button
//               (click)="navigateToAuth()"
//               class="text-left text-[var(--color-gray-100)]"
//             >
//               <h5>Log in</h5>
//             </button>
//           </ng-template>
//         </div>
//       </div>
//     </div>
//   `,
// })
// export class HeaderComponent implements OnInit, OnDestroy {
//   // === Свойства состояния ===
//   cityKey: string | null = null; // Выбранный ключ города
//   cityLabel = 'City'; // Отображаемое имя города
//   language: 'ENG' | 'UKR' = 'ENG'; // Выбранный язык
//   activeDropdown: 'city' | 'lang' | 'menu' | 'userMenu' | null = null; // Какое выпадающее меню открыто
//   user: User | null = null; // Текущий пользователь
//   screenIsMobile = false; // Флаг мобильного экрана

//   // Опции выбора локации из конфига фильтра
//   locationOptions =
//     FILTER_CATEGORIES.find((c) => c.key === 'location')?.options || [];

//   // Подписки для отписки при уничтожении компонента
//   private userSub?: Subscription;
//   private queryParamsSub?: Subscription;
//   private routerEventsSub?: Subscription;

//   constructor(
//     private router: Router,
//     private route: ActivatedRoute,
//     private elementRef: ElementRef,
//     private authService: AuthService,
//     private placesService: PlacesService,
//     private cdr: ChangeDetectorRef,
//   ) {}

//     get isCityDropdown(): boolean {
//     return this.activeDropdown === 'city';
//   }

//   get isLangDropdown(): boolean {
//     return this.activeDropdown === 'lang';
//   }

//   // === Lifecycle hooks ===

//   ngOnInit() {
//     // Подписка на текущего пользователя, установка города из настроек пользователя или query params
//     this.userSub = this.authService.user$.subscribe((user) => {
//       this.user = user;

//       if (user?.defaultCity) {
//         const found = this.locationOptions.find(
//           (opt) => opt.key.toLowerCase() === user.defaultCity.toLowerCase(),
//         );
//         if (found) {
//           this.cityKey = found.key;
//           this.cityLabel = found.label;
//           return;
//         }
//       }
//       // Если город не установлен из профиля, пытаемся взять из query params
//       this.setCityFromQueryParams();
//     });

//     // Определяем, мобильный ли экран, и слушаем ресайз
//     this.checkScreenWidth();
//     window.addEventListener('resize', this.checkScreenWidth);

//     // Закрываем dropdown при смене маршрута
//     this.routerEventsSub = this.router.events
//       .pipe(filter((e) => e instanceof NavigationEnd))
//       .subscribe(() => {
//         this.activeDropdown = null;
//         document.body.classList.remove('overflow-hidden');
//         this.cdr.detectChanges();
//       });
//   }

//   ngOnDestroy() {
//     // Отписываемся от всех подписок и убираем слушатели
//     this.userSub?.unsubscribe();
//     this.queryParamsSub?.unsubscribe();
//     this.routerEventsSub?.unsubscribe();
//     window.removeEventListener('resize', this.checkScreenWidth);
//     document.body.classList.remove('overflow-hidden');
//   }

//   // === Методы логики ===

//   /**
//    * Устанавливает город из параметров URL
//    */
//   setCityFromQueryParams() {
//     this.queryParamsSub?.unsubscribe();
//     this.queryParamsSub = this.route.queryParams.subscribe((params) => {
//       const loc = params['location'];
//       const found = this.locationOptions.find((opt) => opt.key === loc);
//       if (found) {
//         this.cityKey = found.key;
//         this.cityLabel = found.label;
//       } else {
//         this.cityKey = null;
//         this.cityLabel = 'City';
//       }
//     });
//   }

//   /**
//    * Переключает открытость выпадающего меню
//    * @param name Название меню для переключения
//    */
//   toggleDropdown(name: typeof this.activeDropdown) {
//     const isOpening = this.activeDropdown !== name;
//     this.activeDropdown = isOpening ? name : null;

//     // Если мобильное меню открыто, запрещаем скролл body
//     if (this.screenIsMobile && name === 'menu') {
//       document.body.classList.toggle('overflow-hidden', isOpening);
//     }
//   }

//   /**
//    * Устанавливает выбранный город и меняет URL с query параметром
//    * @param key ключ города
//    * @param event событие клика, чтобы остановить всплытие
//    */
//   setCity(key: string, event?: MouseEvent) {
//     event?.stopPropagation();
//     const found = this.locationOptions.find((opt) => opt.key === key);
//     if (!found) return;

//     this.cityKey = found.key;
//     this.cityLabel = found.label;

//     this.router
//       .navigate(['/catalog'], {
//         queryParams: { location: this.cityKey },
//         queryParamsHandling: 'merge',
//       })
//       .then(() => {
//         this.activeDropdown = null;
//       });
//   }

//   /**
//    * Устанавливает язык интерфейса, обновляя профиль пользователя если он залогинен
//    * @param lang 'ENG' или 'UKR'
//    * @param event событие клика для остановки всплытия
//    */
//   setLanguage(lang: 'ENG' | 'UKR', event?: MouseEvent) {
//     event?.stopPropagation();

//     if (this.user) {
//       this.authService.updateUserLanguage(lang).subscribe({
//         next: (updatedUser) => {
//           this.user = updatedUser;
//           this.authService.setUser(updatedUser);
//           this.language = lang;
//           this.activeDropdown = null;
//         },
//         error: (err) => {
//           console.error('Ошибка при обновлении языка пользователя', err);
//           this.language = lang;
//           this.activeDropdown = null;
//         },
//       });
//     } else {
//       this.language = lang;
//       this.activeDropdown = null;
//     }
//   }

//   /**
//    * Проверка ширины экрана и установка флага мобильного устройства
//    */
//   checkScreenWidth = () => {
//     this.screenIsMobile = window.innerWidth < 1024;
//   };

//   /**
//    * Навигация к странице аутентификации
//    */
//   navigateToAuth() {
//     this.router.navigate(['/auth']);
//   }

//   /**
//    * Выход из системы (логаут)
//    */
//   handleLogout() {
//     this.authService.logout();
//     this.activeDropdown = null;
//     this.router.navigate(['/']);
//   }

//   // === Хендлер клика вне компонента для закрытия dropdown ===
//   @HostListener('document:click', ['$event'])
//   onClickOutside(event: MouseEvent) {
//     if (!this.elementRef.nativeElement.contains(event.target)) {
//       this.activeDropdown = null;
//     }
//   }
// }








// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-auth-page',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   template: `
//     <ng-template #splash>
//       <div
//         class="fixed left-0 top-[52px] z-[9999] h-[calc(100vh-52px)] w-full overflow-hidden bg-[var(--color-bg)] lg:top-[76px] lg:h-[calc(100vh-76px)] xxl:top-[86px] xxl:h-[calc(100vh-86px)]"
//         title="Click to skip splash"
//       >
//         <!-- Абсолютные декоративные изображения -->
//         <img
//           src="/splash/coffee-beans.png"
//           alt="coffee beans"
//           class="absolute left-0 top-[8%] z-0 max-w-[184px] object-contain"
//         />
//         <img
//           src="/splash/croissant.png"
//           alt="croissant"
//           class="absolute left-[32%] top-[13%] z-0 max-w-[152px] object-contain"
//         />
//         <img
//           src="/splash/cake.png"
//           alt="cake"
//           class="absolute right-[37%] top-[7%] z-0 max-w-[152px] object-contain"
//         />
//         <img
//           src="/splash/turkish-coffee.png"
//           alt="turka"
//           class="absolute right-0 top-[18%] z-0 max-w-[118px] object-contain"
//         />
//         <img
//           src="/splash/donut.png"
//           alt="donut"
//           class="absolute right-[17%] top-[64%] z-0 max-w-[142px] object-contain"
//         />
//         <img
//           src="/splash/coffee-cup.png"
//           alt="coffee cup"
//           class="absolute bottom-[13%] left-[22%] z-0 max-w-[176px] object-contain"
//         />

//         <!-- Контент по центру -->
//         <div
//           class="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center"
//         >
//           <h1
//             class="max-w-[1068px] font-bold uppercase leading-tight text-[var(--color-gray-100)] lg:text-[80px] xxl:text-[96px]"
//           >
//             <span class="text-[var(--color-primary)]">Coffee</span> places
//             you’ll <span class="text-[var(--color-primary)]">love</span>, picked
//             for you
//           </h1>

//           <button
//             (click)="onContinueFromSplash()"
//             class="button-font mt-[60px] flex h-[84px] w-[315px] gap-[12px] px-[32px] py-[12px] button-bg-blue"
//           >
//             Explore now
//             <img src="/icons/arrow-down-right-white.svg" alt="Icon arrow" />
//           </button>
//         </div>
//       </div>
//     </ng-template>
//     <ng-container *ngIf="!showSplash; else splash">
//       <div
//         class="grid grid-cols-8 gap-[32px] px-[20px] py-[40px] text-[var(--color-gray-100)]"
//       >
//         <!-- === Заголовок (шаги регистрации/логина) === -->
//         <div class="col-span-4 col-start-3 flex flex-col gap-[20px]">
//           <!-- STEP 1 - Ввод email для регистрации -->
//           <ng-container *ngIf="step === 1">
//             <h4 class="text-center">Create your Beanly account</h4>
//             <span class="body-font-1 text-center">
//               Already have an account?
//               <button class="underline shadow-hover" (click)="toggleForm()">
//                 <h6>Log In</h6>
//               </button>
//             </span>
//           </ng-container>

//           <!-- STEP 2 - Ввод пароля после ввода email -->
//           <ng-container *ngIf="step === 2">
//             <div
//               class="flex cursor-pointer select-none items-center"
//               (click)="goBackToEmail()"
//               style="user-select: none;"
//             >
//               <img
//                 src="/icons/arrow-left.svg"
//                 alt="Arrow back"
//                 class="mr-[32px]"
//               />
//               <h4 class="m-0">Create your Beanly account</h4>
//             </div>
//             <span class="body-font-1 text-center">
//               Come up with a password for the email
//               <span class="font-semibold">{{ email }}</span>
//             </span>
//           </ng-container>

//           <!-- STEP 3 - Форма входа (логина) -->
//           <ng-container *ngIf="step === 3">
//             <div
//               class="flex cursor-pointer select-none items-center justify-center"
//               (click)="goBackToEmail()"
//               style="user-select: none;"
//             >
//               <img
//                 src="/icons/arrow-left.svg"
//                 alt="Arrow back"
//                 class="mr-[32px]"
//               />
//               <h4 class="text-center">
//                 Welcome back! Log in to your Beanly account
//               </h4>
//             </div>
//           </ng-container>
//         </div>

//         <!-- === STEP 1: Форма ввода email === -->
//         <div *ngIf="step === 1" class="col-span-4 col-start-3">
//           <form class="flex flex-col gap-[12px]" (ngSubmit)="onSubmitEmail()">
//             <div class="flex flex-col gap-[4px]">
//               <span class="body-font-2 text-[var(--color-gray-75)]">
//                 First, enter your email address
//               </span>
//               <input
//                 type="email"
//                 placeholder="email@gmail.com"
//                 [(ngModel)]="email"
//                 name="email"
//                 [ngClass]="{
//                   'text-[var(--color-gray-55)]': !email,
//                   'text-[var(--color-gray-100)]': email,
//                 }"
//                 class="body-font-1 rounded-[40px] border border-[var(--color-gray-20)] bg-[var(--color-bg)] px-6 py-3 focus:border-[var(--color-gray-20)] focus:outline-none"
//               />
//             </div>
//             <button
//               type="submit"
//               [disabled]="!isValidEmail"
//               [ngClass]="{
//                 'button-bg-blue':
//                   isValidEmail,
//                 'bg-[var(--color-gray-20)] text-[var(--color-gray-55)]':
//                   !isValidEmail,
//               }"
//               class="button-font rounded-[40px] px-[32px] py-[12px]"
//             >
//               Next
//             </button>
//           </form>
//         </div>

//         <!-- === STEP 2: Форма ввода пароля и подтверждения пароля === -->
//         <div *ngIf="step === 2" class="col-span-4 col-start-3">
//           <form
//             autocomplete="off"
//             class="flex flex-col gap-[12px]"
//             (ngSubmit)="onSubmitPassword()"
//           >
//             <!-- Поле Password -->
//             <div class="relative flex flex-col gap-[4px]">
//               <span class="body-font-2 text-[var(--color-gray-75)]"
//                 >Password</span
//               >
//               <div class="relative">
//                 <input
//                   [type]="showPassword ? 'text' : 'password'"
//                   placeholder="Enter password"
//                   [(ngModel)]="password"
//                   name="password"
//                   (ngModelChange)="onPasswordChange()"
//                   [class.border-red-600]="passwordTooWeak"
//                   [ngClass]="{
//                     'text-[var(--color-gray-55)]': !password,
//                     'text-[var(--color-gray-100)]': password,
//                   }"
//                   class="body-font-1 w-full rounded-[40px] border border-[var(--color-gray-20)] bg-[var(--color-bg)] px-6 py-3 outline-none focus:border-[var(--color-gray-20)]"
//                 />
//                 <button
//                   *ngIf="password"
//                   type="button"
//                   (click)="showPassword = !showPassword"
//                   tabindex="-1"
//                   aria-label="Toggle password visibility"
//                   class="absolute right-0 top-0 flex h-full w-[60px] items-center justify-center"
//                 >
//                   <img
//                     [src]="
//                       showPassword ? '/icons/eye-slash.svg' : '/icons/eye.svg'
//                     "
//                     alt="Toggle visibility"
//                     class="h-[20px] w-[20px]"
//                   />
//                 </button>
//               </div>
//               <!-- Ошибка слабого пароля -->
//               <div
//                 *ngIf="passwordTooWeak"
//                 class="body-font-2 mt-1 flex select-none items-center gap-[4px] text-[var(--color-button-error)]"
//               >
//                 <img src="/icons/red-close.svg" alt="Error icon" />
//                 Password too weak
//               </div>
//             </div>

//             <!-- Поле Confirm Password -->
//             <div class="relative flex flex-col gap-[4px]">
//               <span class="body-font-2 text-[var(--color-gray-75)]"
//                 >Confirm Password</span
//               >
//               <div class="relative">
//                 <input
//                   autocomplete="new-password"
//                   [type]="showRepeatPassword ? 'text' : 'password'"
//                   placeholder="Enter the password again"
//                   [(ngModel)]="repeatPassword"
//                   (ngModelChange)="onRepeatPasswordChange()"
//                   name="confirmPass"
//                   [class.border-red-600]="passwordMismatch"
//                   [ngClass]="{
//                     'text-[var(--color-gray-55)]': !repeatPassword,
//                     'text-[var(--color-gray-100)]': repeatPassword,
//                   }"
//                   class="body-font-1 w-full rounded-[40px] border border-[var(--color-gray-20)] bg-[var(--color-bg)] px-6 py-3 outline-none focus:border-[var(--color-gray-20)]"
//                 />
//                 <button
//                   *ngIf="repeatPassword"
//                   type="button"
//                   (click)="showRepeatPassword = !showRepeatPassword"
//                   tabindex="-1"
//                   aria-label="Toggle repeat password visibility"
//                   class="absolute right-0 top-0 flex h-full w-[60px] items-center justify-center"
//                 >
//                   <img
//                     [src]="
//                       showRepeatPassword
//                         ? '/icons/eye-slash.svg'
//                         : '/icons/eye.svg'
//                     "
//                     alt="Toggle visibility"
//                     class="h-[20px] w-[20px]"
//                   />
//                 </button>
//               </div>
//               <!-- Ошибка несовпадения паролей -->
//               <div
//                 *ngIf="passwordMismatch"
//                 class="body-font-2 flex select-none items-center gap-[4px] text-[var(--color-button-error)]"
//               >
//                 <img src="/icons/red-close.svg" alt="Error icon" />
//                 Confirm password mismatch
//               </div>
//             </div>

//             <button
//               type="submit"
//               class="button-font px-[32px] py-[12px] button-bg-blue"
//             >
//               Create account
//             </button>
//           </form>
//         </div>

//         <!-- === STEP 3: Форма входа (логина) === -->
//         <div *ngIf="step === 3" class="col-span-4 col-start-3">
//           <form
//             autocomplete="off"
//             class="flex flex-col gap-[12px]"
//             (ngSubmit)="onSubmitLogin()"
//           >
//             <div class="flex flex-col gap-[4px]">
//               <span class="body-font-2 text-[var(--color-gray-75)]">Email</span>
//               <input
//                 type="email"
//                 placeholder="email@gmail.com"
//                 [(ngModel)]="email"
//                 name="loginEmail"
//                 required
//                 [ngClass]="{
//                   'text-[var(--color-gray-55)]': !email,
//                   'text-[var(--color-gray-100)]': email,
//                 }"
//                 class="body-font-1 rounded-[40px] border border-[var(--color-gray-20)] bg-[var(--color-bg)] px-6 py-3 focus:border-[var(--color-gray-20)] focus:outline-none"
//               />
//             </div>

//             <div class="relative flex flex-col gap-[4px]">
//               <span class="body-font-2 text-[var(--color-gray-75)]"
//                 >Password</span
//               >
//               <div class="relative">
//                 <input
//                   [type]="showPassword ? 'text' : 'password'"
//                   placeholder="Enter password"
//                   [(ngModel)]="password"
//                   name="loginPassword"
//                   required
//                   class="body-font-1 w-full rounded-[40px] border border-[var(--color-gray-20)] bg-[var(--color-bg)] px-6 py-3 outline-none focus:border-[var(--color-gray-20)]"
//                 />
//                 <button
//                   *ngIf="password"
//                   type="button"
//                   (click)="showPassword = !showPassword"
//                   tabindex="-1"
//                   aria-label="Toggle password visibility"
//                   class="absolute right-0 top-0 flex h-full w-[60px] items-center justify-center"
//                 >
//                   <img
//                     [src]="
//                       showPassword ? '/icons/eye-slash.svg' : '/icons/eye.svg'
//                     "
//                     alt="Toggle visibility"
//                     class="h-[20px] w-[20px]"
//                   />
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               class="button-font px-[32px] py-[12px] button-bg-blue"
//             >
//               Log In
//             </button>
//           </form>
//         </div>

//         <!-- === Социальный вход (заглушка, выводит сообщение) === -->
//         <div
//           class="col-span-4 col-start-3 flex flex-col gap-[20px] text-center"
//         >
//           <span class="body-font-1">Or log in with</span>
//           <div class="flex gap-[10px]">
//             <button
//               (click)="showTemporaryMessage()"
//               class="flex flex-1 items-center justify-center gap-[8px] rounded-[40px] border border-[var(--color-button-green)] px-[24px] py-[12px]"
//             >
//               <img
//                 src="/icons/google.svg"
//                 alt="Google"
//                 class="h-[24px] w-[24px]"
//               />
//               <span class="button-font text-[var(--color-button-green)]"
//                 >Google</span
//               >
//             </button>
//             <button
//               (click)="showTemporaryMessage()"
//               class="flex flex-1 items-center justify-center gap-[8px] rounded-[40px] border border-[var(--color-button-blue)] px-[24px] py-[12px]"
//             >
//               <img
//                 src="/icons/facebook.svg"
//                 alt="Facebook"
//                 class="h-[24px] w-[24px]"
//               />
//               <span class="button-font text-[var(--color-button-blue)]"
//                 >Facebook</span
//               >
//             </button>
//             <button
//               (click)="showTemporaryMessage()"
//               class="flex flex-1 items-center justify-center gap-[8px] rounded-[40px] border border-[var(--color-gray-100)] px-[24px] py-[12px]"
//             >
//               <img
//                 src="/icons/apple.svg"
//                 alt="Apple"
//                 class="h-[24px] w-[24px]"
//               />
//               <span class="button-font text-[var(--color-gray-100)]"
//                 >Apple</span
//               >
//             </button>
//           </div>

//           <span class="body-font-1">
//             By registering, you accept our
//             <a
//               (click)="goHome()"
//               class="cursor-pointer text-[var(--color-primary)] underline"
//               >Terms of use</a
//             >
//             and
//             <a
//               (click)="goHome()"
//               class="cursor-pointer text-[var(--color-primary)] underline"
//               >Privacy Policy</a
//             >
//           </span>

//           <div *ngIf="showMessage" class="mt-4 text-[var(--color-primary)]">
//             Please use your email
//           </div>
//         </div>

//         <!-- === Модальное окно после успешной регистрации/входа === -->
//         <div
//           *ngIf="showWelcomeModal"
//           class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
//         >
//           <div
//             class="flex w-full max-w-[650px] flex-col items-center justify-between gap-[32px] rounded-[40px] bg-[var(--color-bg-2)] p-[24px] text-center text-[var(--color-gray-100)] shadow-xl"
//           >
//             <div class="flex flex-col gap-[20px]">
//               <h4>Welcome to Beanly!</h4>

//               <!-- Текст только для новых пользователей (при регистрации) -->
//               <p
//                 *ngIf="isNewUser"
//                 class="body-font-1 text-[var(--color-gray-100)]"
//               >
//                 From cozy corners perfect for reading to stylish spots for your
//                 next coffee date — explore places that feel just right for you.
//               </p>
//             </div>
//             <button
//               (click)="goHome()"
//               class="button-font h-[48px] w-full px-[32px] py-[12px] button-bg-blue"
//             >
//               Explore Catalog
//             </button>
//           </div>
//         </div>
//       </div>
//     </ng-container>
//   `,
// })
// export class AuthPageComponent implements OnInit {
//   showSplash = true; // Показывать ли сплэш-экран
//   step = 1; // Текущий шаг: 1 - email, 2 - регистрация (пароль), 3 - вход
//   email = '';
//   password = '';
//   repeatPassword = '';
//   showPassword = false; // Показать/скрыть пароль
//   showRepeatPassword = false; // Показать/скрыть подтверждение пароля
//   showMessage = false; // Временное сообщение при клике на соц. кнопки

//   showWelcomeModal = false; // Показывать ли модальное окно приветствия после успеха
//   isNewUser = false; // Новый пользователь (регистрация) или старый (вход)

//   passwordMismatch = false; // Ошибка несовпадения паролей
//   passwordTooWeak = false; // Ошибка слабого пароля

//   constructor(
//     private router: Router,
//     private authService: AuthService,
//   ) {}

//   ngOnInit(): void {
//     // Если нужно, сюда можно добавить логику при инициализации компонента
//   }

//   onContinueFromSplash() {
//     // Пользователь нажал кнопку "Продолжить" — скрываем сплэш, показываем форму регистрации (шаг 1)
//     this.showSplash = false;
//   }

//   get isValidEmail(): boolean {
//     // Валидация email по регулярному выражению
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
//   }

//   onSubmitEmail() {
//     // При отправке email - переходим к шагу 2 (пароль)
//     if (this.isValidEmail) {
//       this.step = 2;

//       // Сброс состояния полей и ошибок пароля
//       this.password = '';
//       this.repeatPassword = '';
//       this.passwordTooWeak = false;
//       this.passwordMismatch = false;
//       this.showPassword = false;
//       this.showRepeatPassword = false;
//     }
//   }

//   onSubmitLogin() {
//     // Логика входа по email и паролю
//     if (!this.email || !this.password) return;

//     this.authService.login(this.email, this.password).subscribe({
//       next: () => {
//         // Если вход успешен — показать модальное окно, флаг isNewUser = false (старый пользователь)
//         this.isNewUser = false;
//         this.showWelcomeModal = true;
//       },
//       error: (err) => {
//         // Ошибка входа
//         alert('Ошибка входа: ' + err.message);
//       },
//     });
//   }

//   onPasswordChange() {
//     // При изменении пароля убираем ошибки, если они были
//     if (this.passwordTooWeak) this.passwordTooWeak = false;
//     if (this.passwordMismatch) this.passwordMismatch = false;
//   }

//   onRepeatPasswordChange() {
//     // При изменении подтверждения пароля убираем ошибку несовпадения
//     if (this.passwordMismatch) this.passwordMismatch = false;
//   }

//   onSubmitPassword() {
//     // Проверяем пароль при регистрации

//     this.passwordMismatch = false;
//     this.passwordTooWeak = false;

//     if (this.password.length < 6) {
//       // Слишком слабый пароль
//       this.passwordTooWeak = true;
//       return;
//     }

//     if (this.password !== this.repeatPassword) {
//       // Несовпадение паролей
//       this.passwordMismatch = true;
//       return;
//     }

//     // Формируем имя пользователя из email (до @)
//     const fullNameParts = this.email.split('@')[0].split('.');
//     const firstName = fullNameParts[0] || 'User';
//     const lastName = fullNameParts[1] || '';

//     // Регистрируем пользователя
//     this.authService
//       .register(this.email, this.password, firstName, lastName)
//       .subscribe({
//         next: (res) => {

//           // После успешной регистрации — сразу логиним пользователя
//           this.authService.login(this.email, this.password).subscribe({
//             next: () => {
//               this.isNewUser = true; // Новый пользователь
//               this.showWelcomeModal = true; // Показать модальное окно
//             },
//             error: (err) => {
//               alert('Ошибка входа после регистрации: ' + err.message);
//             },
//           });
//         },
//         error: (err) => {
//           alert('Ошибка регистрации: ' + err.message);
//         },
//       });
//   }

//   toggleForm() {
//     // Переключение между регистрацией и логином
//     if (this.step === 1) {
//       this.step = 3; // Переходим к логину
//     } else {
//       this.step = 1; // Переходим к регистрации (ввод email)
//     }
//   }

//   goBackToEmail() {
//     // Вернуться к шагу ввода email (шаг 1)
//     this.step = 1;
//     this.password = '';
//     this.repeatPassword = '';
//   }

//   showTemporaryMessage() {
//     // Показать временное сообщение при клике на соц. кнопки
//     this.showMessage = true;
//     setTimeout(() => {
//       this.showMessage = false;
//     }, 3000);
//   }

//   goHome() {
//     // Переход на домашнюю страницу (например, после успешного входа/регистрации)
//     this.router.navigate(['/']);
//   }
// }

