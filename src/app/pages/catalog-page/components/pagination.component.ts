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
          [disabled]="page === currentPage"
          [class.bg-blue-600]="page === currentPage"
          [class.text-white]="page === currentPage"
          [class.bg-gray-200]="page !== currentPage"
          [class.text-gray-700]="page !== currentPage"
          class="button-bg-blue flex h-10 w-10"
        >
          {{ page }}
        </button>
      </div>
    </ng-container>
  `,
})
export class PaginationComponent {
  /** Total items to paginate */
  @Input() totalItems = 0;

  /** Items per page; -1 means show all items on one page */
  @Input() selectedSize = 6;

  /** Current active page */
  @Input() currentPage = 1;

  /** Emits the page number when page changes */
  @Output() pageChange = new EventEmitter<number>();

  /** Calculate total pages based on total items and items per page */
  get totalPages(): number {
    if (this.selectedSize === -1) return 1; // Show all on single page
    return Math.ceil(this.totalItems / this.selectedSize);
  }

  /** Create array of page numbers for rendering buttons */
  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  /** Emit event on page button click */
  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }
}
