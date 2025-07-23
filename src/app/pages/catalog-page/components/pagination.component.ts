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
  @Input() totalItems: number = 0;
  @Input() selectedSize: number = 6;
  @Input() currentPage: number = 1;

  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    if (this.selectedSize === -1) return 1;
    return Math.ceil(this.totalItems / this.selectedSize);
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }
}
