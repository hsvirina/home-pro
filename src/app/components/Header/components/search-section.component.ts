import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  OnInit,
  HostListener,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Place } from '../../../models/place.model';
import { PlacesService } from '../../../services/places.service';
import { slideDownAnimation } from '../../../../styles/animations';

@Component({
  selector: 'app-search-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  animations: [slideDownAnimation],
  template: `
    <div
      class="shadow-hover relative flex h-12 w-[500px] items-center gap-2 rounded-full border border-[var(--color-gray-20)] px-6 py-3 lg:max-w-sm xxl:max-w-xl"
    >
      <img src="/icons/search-dark.svg" alt="Search" class="h-6 w-6" />
      <input
        type="text"
        placeholder="Search cafés or areas…"
        class="body-font-1 w-full border-none bg-transparent focus:outline-none"
        [(ngModel)]="searchTerm"
        (input)="onSearchChange()"
        (focus)="onSearchChange()"
        autocomplete="off"
      />

      <!-- Подсказки -->
      <ul
        *ngIf="showSuggestions"
        [@slideDownAnimation]
        class="absolute left-0 top-full z-50 mt-2 max-h-[600px] w-full rounded-[40px] bg-[var(--color-white)] p-2 shadow-md"
      >
        <li
          *ngFor="let place of filteredPlaces"
          (click)="selectPlace(place)"
          class="flex h-[72px] cursor-pointer items-center gap-3 rounded-[40px] p-2 hover:bg-[var(--color-bg)]"
        >
          <img
            [src]="place.photoUrls[0]"
            alt="{{ place.name }}"
            class="h-14 w-14 flex-shrink-0 rounded-full object-cover"
          />
          <span class="menu-text-font">{{ place.name }}</span>
        </li>
      </ul>
    </div>
  `,
})
export class SearchSectionComponent implements OnInit {
  searchTerm = '';
  allPlaces: Place[] = [];
  filteredPlaces: Place[] = [];
  showSuggestions = false;

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private elementRef: ElementRef,
  ) {}

  ngOnInit() {
    this.placesService.getPlaces().subscribe({
      next: (places) => (this.allPlaces = places),
      error: (err) => console.error('Error loading places:', err),
    });
  }

  onSearchChange() {
    const term = this.searchTerm.trim().toLowerCase();
    if (term.length > 0) {
      this.filteredPlaces = this.allPlaces
        .filter((place) => place.name.toLowerCase().includes(term))
        .slice(0, 5);
      this.showSuggestions = this.filteredPlaces.length > 0;
    } else {
      this.filteredPlaces = [];
      this.showSuggestions = false;
    }
  }

  selectPlace(place: Place) {
    this.showSuggestions = false;
    this.searchTerm = '';
    this.router.navigate(['/catalog', place.id]);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (
      event.target instanceof Node &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.showSuggestions = false;
      this.searchTerm = ''; // очищаем input
    }
  }
}
