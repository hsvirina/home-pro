// import { Component, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { FILTER_CATEGORIES } from '../../../models/catalog-filter.config';
// import { slideDownAnimation } from '../../../../styles/animations';

// @Component({
//   selector: 'app-filter-bar',
//   standalone: true,
//   imports: [CommonModule],
//   animations: [slideDownAnimation],
//   template: `
//     <div
//       class="mb-[80px] mt-[64px] grid grid-cols-4 gap-[16px] px-[20px] lg:flex lg:h-[72px] lg:gap-[20px] lg:px-0 xxl:mb-[150px] xxl:h-[84px] xxl:max-w-[896px] xxl:grid-cols-none xxl:gap-[24px]"
//     >
//       <!-- Кнопка фильтров (только мобильная версия) -->
//       <button
//         class="col-span-2 flex h-[48px] w-full items-center justify-center rounded-[40px] border border-[var(--color-primary)] text-[var(--color-primary)] lg:hidden"
//         type="button"
//         (click)="toggleMobileFilter()"
//       >
//         Filters
//       </button>

//       <!-- Фильтры (десктоп / мобилка открыта) -->
//       <div
//         class="gap-[24px]"
//         [ngClass]="{
//           'hidden h-[100%] lg:flex': !isMobileFilterOpen,
//           'flex flex-col': isMobileFilterOpen,
//         }"
//       >
//         <div
//           class="relative flex w-[688px] items-center justify-between gap-[4px] rounded-[40px] border border-[var(--color-gray-20)] lg:h-[72px] xxl:h-[84px]"
//         >
//           <div
//             *ngFor="let category of filterCategories; let i = index"
//             class="relative flex h-full flex-1 cursor-pointer flex-col items-center justify-center gap-[4px] whitespace-nowrap rounded-[40px] text-center transition-colors duration-300 hover:bg-[var(--color-white)]"
//             [ngClass]="{
//               'bg-[var(--color-white)] shadow-sm':
//                 selectedOptions[category.key],
//               'font-semibold text-[var(--color-primary)]':
//                 selectedOptions[category.key],
//             }"
//             (click)="toggleDropdown(i)"
//             (mouseenter)="handleMouseEnter(i)"
//           >
//             <span class="menu-text-font text-[var(--color-gray-100)]">
//               {{ category.title }}
//             </span>
//             <span class="body-font-1 text-[var(--color-gray-75)]">
//               {{ selectedOptions[category.key] || category.description }}
//             </span>

//             <!-- Dropdown (десктоп) -->
//             <ul
//               *ngIf="openedDropdownIndex === i"
//               @slideDownAnimation
//               class="absolute left-0 top-full z-50 mt-2 w-max rounded-[40px] bg-[var(--color-white)] p-2"
//             >
//               <li
//                 *ngFor="let option of category.options"
//                 class="flex cursor-pointer gap-[12px] rounded-[40px] p-2 hover:bg-[var(--color-bg)]"
//                 (click)="
//                   selectOption(category.key, option.label);
//                   $event.stopPropagation()
//                 "
//               >
//                 <img
//                   [src]="option.imageURL"
//                   alt="image"
//                   class="h-[56px] w-[56px]"
//                 />
//                 <div class="flex flex-col gap-[4px] text-left">
//                   <span class="menu-text-font">{{ option.label }}</span>
//                   <span class="body-font-2">{{ option.description }}</span>
//                 </div>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       <!-- Кнопка поиска -->
//       <button
//         class="button-bg-blue col-span-2 flex h-[48px] w-full gap-3 lg:h-[72px] lg:w-[168px] xxl:h-[84px] xxl:w-[184px]"
//         type="button"
//         (click)="applyFilters()"
//       >
//         <img
//           src="./assets/icons/search-white.svg"
//           alt="search-button"
//           class="h-[24px] w-[24px]"
//         />
//         <span class="button-font">Search</span>
//       </button>

//       <!-- Фон с размытием -->
//       <div
//         *ngIf="isMobileFilterOpen"
//         class="bg-[var(--color-bg)]/70 fixed inset-0 z-50 backdrop-blur-3xl lg:hidden"
//       ></div>

//       <!-- Модальное окно фильтров (мобилка) -->
//       <div
//         *ngIf="isMobileFilterOpen"
//         class="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto px-5 pt-3 lg:hidden"
//       >
//         <!-- Верхняя панель с крестиком -->
//         <div class="flex justify-end">
//           <button
//             (click)="toggleMobileFilter()"
//             class="mb-[25px] flex h-10 w-10 items-center justify-center rounded-[40px] bg-[var(--color-white)]"
//             aria-label="Close"
//           >
//             <img src="/assets/icons/close.svg" alt="close" class="h-5 w-5" />
//           </button>
//         </div>

//         <!-- Контейнер фильтров с отступами, чтобы был просвет -->
//         <div class="flex-grow">
//           <div class="relative flex h-full flex-col">
//             <!-- Фильтры по категориям -->
//             <div class="flex flex-col gap-[16px] px-[20px]">
//               <div
//                 *ngFor="let category of filterCategories; let i = index"
//                 class="col-span-4"
//               >
//                 <!-- Заголовок и описание -->
//                 <div
//                   class="flex cursor-pointer rounded-[24px] bg-[var(--color-white)] px-6 py-4 transition-all duration-300 hover:rounded-[24px] hover:bg-[var(--color-bg)]"
//                   (click)="toggleMobileFilterCategory(i)"
//                   (mouseenter)="
//                     mobileMouseControlEnabled && (mobileOpenedIndex = i)
//                   "
//                   [ngClass]="{
//                     'flex-row items-center justify-between gap-2':
//                       mobileOpenedIndex !== i,
//                     'flex-col': mobileOpenedIndex === i,
//                   }"
//                 >
//                   <div class="text-[var(--color-primary)]">
//                     {{ category.title }}
//                   </div>
//                   <div class="text-[var(--color-gray-75)]">
//                     {{ selectedOptions[category.key] || category.description }}
//                   </div>
//                 </div>

//                 <!-- Скрываемый/разворачиваемый блок опций -->
//                 <div
//                   class="mt-1 flex flex-col gap-1 rounded-[24px] bg-[var(--color-white)] p-4 transition-all duration-300 ease-in-out"
//                   [ngStyle]="{
//                     maxHeight: mobileOpenedIndex === i ? '1000px' : '0',
//                     opacity: mobileOpenedIndex === i ? '1' : '0',
//                     paddingTop: mobileOpenedIndex === i ? '12px' : '0',
//                     overflow: mobileOpenedIndex === i ? 'visible' : 'hidden',
//                   }"
//                 >
//                   <div
//                     *ngFor="let option of category.options"
//                     (click)="selectOption(category.key, option.label)"
//                     class="flex cursor-pointer items-center gap-2 p-2 transition-colors duration-300 hover:rounded-[24px] hover:bg-[var(--color-bg)]"
//                   >
//                     <img
//                       [src]="option.imageURL"
//                       alt="icon"
//                       class="h-[40px] w-[40px] rounded-full"
//                     />
//                     <div class="flex flex-col">
//                       <span class="menu-text-font">{{ option.label }}</span>
//                       <span class="body-font-2">{{ option.description }}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <!-- Кнопка применения -->
//         <button
//           class="mb-4 mt-4 h-12 rounded-[40px] bg-[var(--color-primary)] text-white"
//           (click)="applyFilters(); toggleMobileFilter()"
//         >
//           Apply Filters
//         </button>
//       </div>
//     </div>
//   `,
// })
// export class FilterBarComponent implements OnDestroy {
//   filterCategories = FILTER_CATEGORIES;
//   selectedOptions: Record<string, string> = {};

//   isMobileFilterOpen = false;
//   mobileOpenedIndex: number | null = null;
//   mobileMouseControlEnabled = false;

//   openedDropdownIndex: number | null = null;

//   private globalClickUnlistener: () => void;

//   constructor(
//     private router: Router,
//     private elementRef: ElementRef,
//     private renderer: Renderer2,
//   ) {
//     // Закрытие дропдаунов при клике вне компонента
//     this.globalClickUnlistener = this.renderer.listen(
//       'document',
//       'click',
//       this.onDocumentClick.bind(this),
//     );
//   }

//   toggleMobileFilter() {
//     this.isMobileFilterOpen = !this.isMobileFilterOpen;

//     if (this.isMobileFilterOpen) {
//       this.disableBodyScroll();
//       this.mobileOpenedIndex = null;
//       this.mobileMouseControlEnabled = false;
//     } else {
//       this.enableBodyScroll();
//     }
//   }

//   toggleMobileFilterCategory(index: number) {
//     this.mobileOpenedIndex = index;
//     this.mobileMouseControlEnabled = true;
//   }

//   selectOption(categoryKey: string, label: string) {
//     this.selectedOptions[categoryKey] = label;

//     // Закрытие мобильного блока и отключение hover-переключения
//     this.mobileOpenedIndex = null;
//     this.mobileMouseControlEnabled = false;

//     // Закрытие дропдауна десктопа
//     this.openedDropdownIndex = null;
//   }

//   toggleDropdown(index: number) {
//     this.openedDropdownIndex =
//       this.openedDropdownIndex === index ? null : index;
//   }

//   handleMouseEnter(index: number) {
//     if (
//       this.openedDropdownIndex !== null &&
//       this.openedDropdownIndex !== index
//     ) {
//       this.openedDropdownIndex = index;
//     }
//   }

//   applyFilters() {
//     const queryParams: Record<string, string> = {};

//     for (const category of this.filterCategories) {
//       const key = category.key;
//       const selectedLabel = this.selectedOptions[key];

//       if (selectedLabel) {
//         const matched = category.options.find(
//           (opt) => opt.label === selectedLabel,
//         );
//         if (matched) {
//           queryParams[key] = matched.key;
//         }
//       }
//     }

//     this.enableBodyScroll();
//     this.router.navigate(['/catalog'], { queryParams });
//   }

//   private onDocumentClick(event: MouseEvent) {
//     const clickInside = this.elementRef.nativeElement.contains(event.target);
//     if (!clickInside) {
//       this.openedDropdownIndex = null;

//       if (this.isMobileFilterOpen) {
//         this.isMobileFilterOpen = false;
//         this.enableBodyScroll();
//       }
//     }
//   }

//   private enableBodyScroll() {
//     document.body.style.overflow = '';
//   }

//   private disableBodyScroll() {
//     document.body.style.overflow = 'hidden';
//   }

//   ngOnDestroy() {
//     if (this.globalClickUnlistener) {
//       this.globalClickUnlistener();
//     }
//     this.enableBodyScroll();
//   }
// }
// //
