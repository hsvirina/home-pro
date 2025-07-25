import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="selectedSize !== -1">
      <div class="flex w-full justify-center gap-2">
        <button
          *ngFor="let page of totalPagesArray"
          (click)="onPageChange(page)"
          [class.bg-blue-600]="page === currentPage"
          [class.text-white]="page === currentPage"
          [class.bg-gray-200]="page !== currentPage"
          [class.text-gray-700]="page !== currentPage"
          class="flex h-10 w-10 button-bg-blue"
        >
          {{ page }}
        </button>
      </div>
    </ng-container>
  `,
})
export class PaginationComponent {
  /** Total number of items to paginate */
  @Input() totalItems: number = 0;

  /** Number of items shown per page; -1 means 'show all' */
  @Input() selectedSize: number = 6;

  /** Currently selected page */
  @Input() currentPage: number = 1;

  /** Emits the selected page number when user changes page */
  @Output() pageChange = new EventEmitter<number>();

  /** Calculate total number of pages */
  get totalPages(): number {
    if (this.selectedSize === -1) return 1; // If 'show all' selected, only 1 page
    return Math.ceil(this.totalItems / this.selectedSize);
  }

  /** Create an array with page numbers for *ngFor */
  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  /** Handle page button click */
  onPageChange(page: number) {
    this.pageChange.emit(page);
  }
}
